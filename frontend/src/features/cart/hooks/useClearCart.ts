import { useState } from "react";
import axios from "axios";

export const useClearCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("user_token");
      if (!token) throw new Error("User not authenticated");

      await axios.delete("http://localhost:3000/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err: any) {
      console.error("Clear cart error:", err);
      setError(err.response?.data?.message || err.message || "Failed to clear cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { clearCart, loading, error };
};
