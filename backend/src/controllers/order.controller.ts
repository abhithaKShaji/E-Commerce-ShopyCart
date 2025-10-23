import { Request, Response } from "express";
import { Types } from "mongoose";
import { Order } from "../models/order.model";
import { AuthRequest } from "../middlewares/auth.miiddleware";

//  GET Logged-in User Orders
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    console.log("🔹 Fetching orders for:", userId);

    const orders = await Order.find({ userId }) 
      .populate({
        path: "products.productId",
        select: "name brand price images",
      })
      .sort({ createdAt: -1 });

    console.log("🔹 Orders found:", orders.length);

    const mappedOrders = orders.map((order) => ({
      _id: order._id,
      userId: order.userId,
      items: order.products.map((p: any) => ({
        product: p.productId
          ? {
              _id: p.productId._id,
              name: p.productId.name,
              brand: p.productId.brand,
              price: p.productId.price,
              images: p.productId.images,
            }
          : null,
        quantity: p.quantity,
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    res.status(200).json({ orders: mappedOrders });
  } catch (error) {
    console.error(" Error fetching user orders:", error);
    res.status(500).json({ message: "Error fetching user orders" });
  }
};


// ------------------ GET ALL ORDERS (Admin + Paginated) ------------------

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    // Parse pagination params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Count total number of orders (for pagination metadata)
    const totalOrders = await Order.countDocuments();

    // Fetch paginated orders
    const orders = await Order.find()
      .populate({
        path: "products.productId",
        select: "name brand price images",
      })
      .populate({
        path: "userId",
        select: "name email",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Map response
    const mappedOrders = orders.map((order) => ({
      _id: order._id,
      orderDate: order.createdAt,
      status: order.status,
      totalAmount: order.totalAmount,
      user: order.userId
        ? { _id: order.userId._id, name: order.userId.name, email: order.userId.email }
        : null,
      items: order.products.map((p: any) => ({
        product: p.productId
          ? {
              _id: p.productId._id,
              name: p.productId.name,
              brand: p.productId.brand,
              price: p.productId.price,
              images: p.productId.images,
            }
          : null,
        quantity: p.quantity,
      })),
    }));

    // Return paginated data
    res.status(200).json({
      success: true,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      ordersPerPage: limit,
      orders: mappedOrders,
    });
  } catch (error) {
    console.error(" Error fetching all orders:", error);
    res.status(500).json({ message: "Error fetching all orders" });
  }
};


// ------------------ UPDATE ORDER STATUS (Admin) ------------------
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const allowedStatuses = ["placed", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ success: false, message: "Invalid status value" });
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    order.status = status as any;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: {
        _id: order._id,
        status: order.status,
        totalAmount: order.totalAmount,
        userId: order.userId,
        products: order.products,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error(" Error updating order status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ------------------ GET PAYMENT METHOD COUNTS (Public) ------------------
export const getPaymentMethodCounts = async (req: Request, res: Response) => {
  try {
    const codCount = await Order.countDocuments({ paymentId: { $exists: false } });
    const razorpayCount = await Order.countDocuments({ paymentId: { $exists: true } });

    res.status(200).json({
      success: true,
      counts: { COD: codCount, Razorpay: razorpayCount },
      message: "Payment method counts fetched successfully",
    });
  } catch (error) {
    console.error(" Error fetching payment method counts:", error);
    res.status(500).json({ success: false, message: "Error fetching counts" });
  }
};

// ------------------ GET ORDER STATUS COUNTS ------------------
export const getOrderStatusCounts = async (req: Request, res: Response) => {
  try {
    // Aggregate orders by status and count
    const counts = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 },
        },
      },
    ]);

    // Map to object with all statuses even if 0
 const statusCounts: Record<'placed' | 'shipped' | 'delivered' | 'cancelled', number> = {
  placed: 0,
  shipped: 0,
  delivered: 0,
  cancelled: 0,
};

counts.forEach((c: { _id: string; total: number }) => {
  if (c._id in statusCounts) {
    statusCounts[c._id as keyof typeof statusCounts] = c.total;
  }
});

    res.status(200).json({
      success: true,
      orderStatusCounts: statusCounts,
      message: "Order status counts fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching order status counts:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ------------------ GET TOTAL REVENUE ------------------
export const getTotalRevenue = async (req: Request, res: Response) => {
  try {
    // Sum totalAmount of all orders
    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = result[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      totalRevenue,
      message: "Total revenue fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


