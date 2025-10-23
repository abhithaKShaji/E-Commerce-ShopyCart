import React from "react";
import CartItemRow from "../components/CartItemRow";

interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

interface CartTableProps {
  items: CartItem[];
}

const CartTable: React.FC<CartTableProps> = ({ items }) => {
  return (
    <table className="min-w-full mt-5 text-left border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3">Item</th>
          <th className="px-6 py-3">Quantity</th>
          <th className="px-6 py-3">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <CartItemRow key={item._id} item={item} />
        ))}
      </tbody>
    </table>
  );
};

export default CartTable;
