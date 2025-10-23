import { useEffect, useState } from "react";
import axios from "axios";

export interface ApiOrder {
  _id: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
  items: {
    product: {
      _id: string;
      name: string;
      brand: string;
      price: number;
      images: string[];
    } | null;
    quantity: number;
  }[];
}

interface ApiResponse {
  success: boolean;
  totalOrders: number;
  currentPage: number;
  totalPages: number;
  ordersPerPage: number;
  orders: ApiOrder[];
}

export const useOrders = (initialPage: number = 1, limit: number = 10) => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<ApiResponse>(
          `http://localhost:3000/api/order/all-orders`,
          {
            params: { page, limit },
            withCredentials: true, // if using cookies/auth
          }
        );

        const data = response.data;

        setOrders(data.orders || []);
        setTotalOrders(data.totalOrders || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        const message =
          err.response?.data?.message ||
          err.message ||
          "Something went wrong while fetching orders.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit]);

  const nextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return {
    orders,
    totalOrders,
    totalPages,
    page,
    loading,
    error,
    nextPage,
    prevPage,
    setPage,
  };
};
