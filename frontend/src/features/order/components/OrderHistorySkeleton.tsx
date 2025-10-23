// src/features/order/components/OrderHistorySkeleton.tsx
import React from "react";

interface OrderHistorySkeletonProps {
  count?: number;
}

const OrderHistorySkeleton: React.FC<OrderHistorySkeletonProps> = ({ count = 5 }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white animate-pulse">
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
          {Array.from({ length: count }).map((_, idx) => (
            <tr key={idx} className="border-b border-gray-200">
              <td className="py-3 px-6">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="py-3 px-6">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </td>
              <td className="py-3 px-6">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </td>
              <td className="py-3 px-6">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistorySkeleton;
