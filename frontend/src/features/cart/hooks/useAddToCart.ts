import { useState } from "react";
import axios from "axios";
import { useCartContext } from "../../../context/CartContext";
//import { useUserAuth } from "../../../context/UserAuthContext";

export const useAddToCart = () => {
  //const { user } = useUserAuth();
  const { fetchCart } = useCartContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = async (productId: string, quantity: number) => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      setError("You must be logged in to add items to the cart.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(
        "http://localhost:3000/api/cart/add",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchCart();
    } catch (err: any) {
      console.error("Add to cart failed:", err);
      setError(err.response?.data?.message || "Failed to update cart.");
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, loading, error };
};
