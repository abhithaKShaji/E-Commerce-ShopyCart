import React from "react";
import type { Order, OrderStatus } from "../types";

interface OrderRowProps {
  order: Order;
  onChangeStatus: (orderId: string, status: OrderStatus) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({ order, onChangeStatus }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeStatus(order._id, e.target.value as OrderStatus);
  };

  return (
    <tr className="border-b">
      <td className="py-2 px-2">{order._id}</td>
      <td className="py-2 px-2">{order.deliveryDetails.name}</td>
      <td className="py-2 px-2">
        <div className="flex flex-col space-y-1">
          {order.items.map((i) => (
            <div key={i.product._id} className="flex items-center space-x-2">
              <img
                src={i.product.images[0]} 
                alt={i.product.name}
                className="w-10 h-10 object-cover rounded"
              />
              <div className="flex flex-col">
                <span className="text-sm ">{i.product.name}</span>
                <span className="text-xs text-gray-500">Qty: {i.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </td>
      <td className="py-2 px-2">{order.totalAmount}</td>
      <td className="py-2 px-2">{order.date}</td>
      <td className="py-2 px-2">
        <select
          value={order.status}
          onChange={handleSelectChange}
          className="border px-2 py-1 rounded"
        >
          <option value="placed">Placed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </td>
    </tr>
  );
};

export default OrderRow;
