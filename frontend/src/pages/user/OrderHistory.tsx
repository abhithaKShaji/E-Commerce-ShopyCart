import React from "react";
import { useOrders } from "../../features/order/hooks/useOrders";
import OrderItemCard from "../../features/order/components/OrderItemCard";
import Sidebar from "../../features/profile/components/Sidebar";
import OrderHistorySkeleton from "../../features/order/components/OrderHistorySkeleton";

const OrderHistory: React.FC = () => {
  const { orders, loading, error } = useOrders();

  if (loading)
    return (
      <section className="container mx-auto p-4 md:p-10 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        <Sidebar />
        <div className="flex-1">
          <OrderHistorySkeleton count={5} />
        </div>
      </section>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64 text-red-500 text-lg">
        {error}
      </div>
    );

  return (
    <section className="container mx-auto p-4 md:p-10 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
      <Sidebar />
     
      {orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">You have no orders yet.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg bg-white">
          <table className="min-w-full text-sm text-gray-700 border-collapse">
            <thead className="bg-gray-100 text-gray-800 uppercase text-sm">
              <tr>
                <th className="py-3 px-6 text-left">Item</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Amount</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderItemCard key={order._id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default OrderHistory;
