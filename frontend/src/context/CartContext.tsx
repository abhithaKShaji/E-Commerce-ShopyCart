import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { useUserAuth } from "./UserAuthContext";

// ====== Interfaces ======
export interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
  fetchCart: () => Promise<void>;
}

// ====== Context Setup ======
const CartContext = createContext<CartContextType | undefined>(undefined);

// ====== Provider ======
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserAuth();
  const [cart, setCart] = useState<Cart | null>(null);

  // ✅ Use useCallback to prevent unnecessary re-renders
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("user_token");
    if (!token) return;

    try {
      const res = await axios.get<Cart>("http://localhost:3000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err);
      setCart(null);
    }
  }, []);

  // Auto-fetch cart when user changes
  useEffect(() => {
    if (user) fetchCart();
    else setCart(null);
  }, [user, fetchCart]);

  return (
    <CartContext.Provider value={{ cart, setCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

// ====== Hook ======
export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within a CartProvider");
  return ctx;
};
