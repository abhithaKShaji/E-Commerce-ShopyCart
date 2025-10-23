import React from "react";

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

interface CartSummaryProps {
  items: CartItem[];
}

const CartSummary: React.FC<CartSummaryProps> = ({ items }) => {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="mt-8 flex justify-end">
      <div className="bg-gray-100 p-6 rounded-lg w-full md:w-1/3">
        <h5 className="text-lg font-semibold mb-4">Total</h5>
        <div className="flex justify-between mb-4">
          <span>Total Price:</span>
          <span className="font-bold">₹ {total}</span>
        </div>
        <button
          onClick={() => window.location.href = "/checkout"}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold"
        >
          PLACE ORDER
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
