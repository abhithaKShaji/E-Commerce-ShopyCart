import { useState } from "react";
import axios from "axios";
import { useCartContext, type CartItem } from "../../../context/CartContext";
import { useUserAuth } from "../../../context/UserAuthContext";

export const useRemoveFromCart = () => {
  const { user } = useUserAuth();
  const { cart, setCart } = useCartContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeFromCart = async (cartItemId: string) => {
    
    const token = localStorage.getItem("user_token");
    if (!token) {
      setError("You must be logged in to remove items from the cart");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.delete<{
        message: string;
        cart: {
          _id: string;
          user: string;
          items: { product: any; quantity: number; _id: string }[];
        };
      }>(`http://localhost:3000/api/cart/remove/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      
      const updatedItems: CartItem[] = data.cart.items.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        product:
          typeof item.product === "string"
            ? { _id: item.product, name: "", brand: "", description: "", price: 0, category: "", images: [] }
            : item.product,
      }));

      setCart({ _id: data.cart._id, user: data.cart.user, items: updatedItems });
    } catch (err: any) {
      console.error("Remove from cart failed:", err);
      setError(err.response?.data?.message || "Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  return { removeFromCart, loading, error };
};
