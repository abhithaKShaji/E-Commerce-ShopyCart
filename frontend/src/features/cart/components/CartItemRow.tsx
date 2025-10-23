import React, { useState } from "react";
import type { CartItem } from "../../../context/CartContext";
import { useAddToCart } from "../hooks/useAddToCart";
import { useRemoveFromCart } from "../hooks/useRemoveFromCart";

interface CartItemRowProps {
  item: CartItem;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { addToCart } = useAddToCart();
  const { removeFromCart, loading: removing } = useRemoveFromCart();
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (delta: number) => {
    if (item.quantity + delta < 1) return;
    setUpdating(true);
    await addToCart(item.product._id, delta);
    setUpdating(false);
  };

  const handleRemove = async () => {
    await removeFromCart(item._id); 
  };

  return (
    <tr className="border-b border-gray-200">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <img
            src={item.product.images[0] || "/placeholder.png"}
            alt={item.product.name}
            className="w-20 h-24 object-cover cursor-pointer"
            onClick={() => window.location.href = `/view-product/${item.product._id}`}
          />
          <div>
            <h6 className="font-semibold">{item.product.brand || "Brand"}</h6>
            <p>{item.product.name || "Product"}</p>
            <small>₹ {item.product.price || 0}</small>
            <button
              type="button"
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={handleRemove}
              disabled={removing}
            >
              {removing ? "Removing..." : "Remove"}
            </button>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <button
            type="button"
            className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
            onClick={() => handleQuantityChange(-1)}
            disabled={updating}
          >
            -
          </button>
          <span className="px-4">{item.quantity}</span>
          <button
            type="button"
            className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
            onClick={() => handleQuantityChange(1)}
            disabled={updating}
          >
            +
          </button>
        </div>
      </td>
      <td className="px-6 py-4">₹ {item.product.price * item.quantity}</td>
    </tr>
  );
};

export default CartItemRow;
