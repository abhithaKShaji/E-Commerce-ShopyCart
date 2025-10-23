import React from "react";
import type { Order, OrderStatus } from "../types";
import OrderRow from "./OrderRow";

interface OrdersTableProps {
  orders: Order[];
  onChangeStatus: (orderId: string, status: OrderStatus) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onChangeStatus }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-2 text-left text-sm font-semibold">Order ID</th>
            <th className="py-3 px-2 text-left text-sm font-semibold">Delivery Details</th>
            <th className="py-3 px-2 text-left text-sm font-semibold">Products</th>
            <th className="py-3 px-2 text-left text-sm font-semibold">Total Amount</th>
            <th className="py-3 px-2 text-left text-sm font-semibold">Date</th>
            <th className="py-3 px-2 text-left text-sm font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <OrderRow key={order._id} order={order} onChangeStatus={onChangeStatus} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
