"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalRevenue = exports.getOrderStatusCounts = exports.getPaymentMethodCounts = exports.updateOrderStatus = exports.getAllOrders = exports.getMyOrders = void 0;
const order_model_1 = require("../models/order.model");
//  GET Logged-in User Orders
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        console.log("🔹 Fetching orders for:", userId);
        const orders = yield order_model_1.Order.find({ userId })
            .populate({
            path: "products.productId",
            select: "name brand price images",
        })
            .sort({ createdAt: -1 });
        console.log("🔹 Orders found:", orders.length);
        const mappedOrders = orders.map((order) => ({
            _id: order._id,
            userId: order.userId,
            items: order.products.map((p) => ({
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
    }
    catch (error) {
        console.error(" Error fetching user orders:", error);
        res.status(500).json({ message: "Error fetching user orders" });
    }
});
exports.getMyOrders = getMyOrders;
// ------------------ GET ALL ORDERS (Admin + Paginated) ------------------
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse pagination params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Count total number of orders (for pagination metadata)
        const totalOrders = yield order_model_1.Order.countDocuments();
        // Fetch paginated orders
        const orders = yield order_model_1.Order.find()
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
            items: order.products.map((p) => ({
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
    }
    catch (error) {
        console.error(" Error fetching all orders:", error);
        res.status(500).json({ message: "Error fetching all orders" });
    }
});
exports.getAllOrders = getAllOrders;
// ------------------ UPDATE ORDER STATUS (Admin) ------------------
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        // Validate status
        const allowedStatuses = ["placed", "shipped", "delivered", "cancelled"];
        if (!allowedStatuses.includes(status)) {
            res.status(400).json({ success: false, message: "Invalid status value" });
            return;
        }
        const order = yield order_model_1.Order.findById(orderId);
        if (!order) {
            res.status(404).json({ success: false, message: "Order not found" });
            return;
        }
        order.status = status;
        yield order.save();
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
    }
    catch (error) {
        console.error(" Error updating order status:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.updateOrderStatus = updateOrderStatus;
// ------------------ GET PAYMENT METHOD COUNTS (Public) ------------------
const getPaymentMethodCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const codCount = yield order_model_1.Order.countDocuments({ paymentId: { $exists: false } });
        const razorpayCount = yield order_model_1.Order.countDocuments({ paymentId: { $exists: true } });
        res.status(200).json({
            success: true,
            counts: { COD: codCount, Razorpay: razorpayCount },
            message: "Payment method counts fetched successfully",
        });
    }
    catch (error) {
        console.error(" Error fetching payment method counts:", error);
        res.status(500).json({ success: false, message: "Error fetching counts" });
    }
});
exports.getPaymentMethodCounts = getPaymentMethodCounts;
// ------------------ GET ORDER STATUS COUNTS ------------------
const getOrderStatusCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Aggregate orders by status and count
        const counts = yield order_model_1.Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    total: { $sum: 1 },
                },
            },
        ]);
        // Map to object with all statuses even if 0
        const statusCounts = {
            placed: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
        };
        counts.forEach((c) => {
            if (c._id in statusCounts) {
                statusCounts[c._id] = c.total;
            }
        });
        res.status(200).json({
            success: true,
            orderStatusCounts: statusCounts,
            message: "Order status counts fetched successfully",
        });
    }
    catch (error) {
        console.error("Error fetching order status counts:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.getOrderStatusCounts = getOrderStatusCounts;
// ------------------ GET TOTAL REVENUE ------------------
const getTotalRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Sum totalAmount of all orders
        const result = yield order_model_1.Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                },
            },
        ]);
        const totalRevenue = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0;
        res.status(200).json({
            success: true,
            totalRevenue,
            message: "Total revenue fetched successfully",
        });
    }
    catch (error) {
        console.error("Error fetching total revenue:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.getTotalRevenue = getTotalRevenue;
