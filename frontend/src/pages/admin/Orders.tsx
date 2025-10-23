import React, { useState, useEffect } from "react";
import OrdersTable from "../../features/adminOrder/components/OrdersTable";
import type { OrderStatus } from "../../features/adminOrder/types";
import { useOrders } from "../../features/adminOrder/hooks/useAdminOrders";
import { useUpdateOrderStatus } from "../../features/adminOrder/hooks/useUpdateOrdersStatus";

interface MappedOrder {
  _id: string;
  deliveryDetails: {
    name: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    product: {
      _id: string;
      name: string;
      brand: string;
      price: number;
      images: string[];
    };
    quantity: number;
  }[];
  totalAmount: number;
  paymentMethod: string;
  date: string;
  status: OrderStatus;
}


const Orders: React.FC = () => {
  // Fetch orders from API
  const { orders: apiOrders, totalPages, page, loading, error, nextPage, prevPage } = useOrders(1, 10);
  const { updateOrderStatus, loading: updating, error: updateError, successMessage } = useUpdateOrderStatus();

  // Local state for instant UI updates
 const [orders, setOrders] = useState<MappedOrder[]>([]);


  // Sync local state when API orders change
  useEffect(() => {
    const mappedOrders = apiOrders.map(order => ({
      _id: order._id,
      deliveryDetails: {
        name: order.user?.name || "Unknown",
        street: "N/A",
        city: "N/A",
        state: "N/A",
        pincode: "N/A",
      },
      items: order.items
        .filter(i => i.product)
        .map(i => ({ product: i.product!, quantity: i.quantity })),
      totalAmount: order.totalAmount || 0,
      paymentMethod: "N/A",
      date: order.orderDate,
      status: order.status as OrderStatus,
    }));
    setOrders(mappedOrders);
  }, [apiOrders]);

  // Handle status change
  const handleChangeStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      if (updatedOrder) {
        // Update local state immediately
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, status: updatedOrder.status } : order
          )
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Render loading/error messages
  if (loading) return <p className="m-4 text-gray-500">Loading orders...</p>;
  if (error) return <p className="m-4 text-red-500">Error: {error}</p>;

  return (
    <section className="m-4 md:m-10">
      <div className="container mx-auto">
        <ul className="flex space-x-2 text-gray-500 mb-4">
          <li>Manage Orders</li>
          <li>/</li>
          <li className="font-semibold text-gray-700">All Orders</li>
        </ul>

        {updateError && <p className="text-red-500 mb-2">{updateError}</p>}
        {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}
        {updating && <p className="text-blue-500 mb-2">Updating status...</p>}

        <OrdersTable orders={orders} onChangeStatus={handleChangeStatus} />

        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ← Prev
          </button>
          <span className="px-3 text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Orders;
