import { useEffect, useState } from "react";
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext"; 

export interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "placed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export const useOrders = () => {
  const { user } = useUserAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("user_token");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:3000/api/order/user/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const mappedOrders: Order[] = response.data.orders.map((o: any) => ({
          _id: o._id,
          userId: o.userId,
          items: (o.items || o.products || [])
            .filter((p: any) => p.product) 
            .map((p: any) => ({
              product: {
                _id: p.product._id,
                name: p.product.name,
                brand: p.product.brand,
                price: p.product.price,
                images: p.product.images || [],
              },
              quantity: p.quantity || 1,
            })),
          totalAmount: o.totalAmount,
          status: o.status,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
        }));

        setOrders(mappedOrders);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        if (err.response?.status === 401) setError("Unauthorized. Please log in.");
        else setError(err.response?.data?.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return { orders, loading, error };
};
