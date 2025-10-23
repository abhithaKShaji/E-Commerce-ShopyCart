import React from "react";
import type { Order } from "../hooks/useOrders";

interface OrderItemCardProps {
  order: Order;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ order }) => {
  const validItems = order.items.filter((i) => i.product);

  if (validItems.length === 0) {
    return (
      <tr>
        <td colSpan={4} className="py-4 px-6 text-center text-gray-500">
          No products in this order
        </td>
      </tr>
    );
  }

  return (
    <>
      {validItems.map((item, idx) => (
        <tr
          key={`${order._id}-${idx}`}
          className="border-b hover:bg-gray-50 transition"
        >
          <td className="py-4 px-6 flex items-center gap-4">
            <img
              src={item.product.images?.[0] || "/placeholder.png"}
              alt={item.product.name}
              className="w-20 h-24 object-cover rounded-md border"
            />
            <div>
              <h6 className="font-semibold text-gray-800">{item.product.brand}</h6>
              <p className="text-gray-600 text-sm">{item.product.name}</p>
              <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
            </div>
          </td>

          <td className="py-4 px-6 text-gray-700">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </td>

          <td className="py-4 px-6 font-medium text-gray-800">
            ₹ {order.totalAmount}
          </td>

          <td
            className={`py-4 px-6 font-semibold ${
              order.status === "delivered"
                ? "text-green-600"
                : order.status === "placed"
                ? "text-yellow-600"
                : "text-blue-600"
            }`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </td>
        </tr>
      ))}
    </>
  );
};

export default OrderItemCard;
