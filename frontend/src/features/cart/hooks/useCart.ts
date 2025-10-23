import { useEffect, useState } from "react";
import axios from "axios";
import {  useUserAuth } from "../../../context/UserAuthContext";

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
  product: Product;
  quantity: number;
  _id: string;
}

interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

const BASE_URL = "https://shopycart-backend.onrender.com";

export const useCart = () => {
  const { user } = useUserAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    if (!user) return; // fetch only when logged in
    try {
      setLoading(true);
      const token = localStorage.getItem("user_token"); 
      if (!token) {
        console.warn("No access token found");
        return;
      }
      const res = await axios.get(`${BASE_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(res.data);
      setError(null);
    } catch (err: any) {
      console.error("Cart fetch error:", err);
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  return { cart, loading, error, fetchCart };
};
