import React from "react";

export interface Product {
  productId: string; 
  name: string;
  brand: string;
  price: number;
  images: string[];
  quantity: number;
}

interface OrderSummaryProps {
  products: Product[];
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ products, total }) => {
  return (
    <div className="p-4 rounded-2xl shadow-md bg-white space-y-4">
      <h2 className="text-xl font-semibold mb-3">Order Summary</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No products in the order.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.productId} className="flex items-center py-3">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">{product.brand}</p>
                <p className="text-sm text-gray-700">
                  ₹{product.price.toLocaleString()} × {product.quantity}
                </p>
              </div>
              <p className="font-semibold">
                ₹{(product.price * product.quantity).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="pt-4 border-t border-gray-300">
        <p className="text-lg font-bold">
          Total: ₹{total.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
