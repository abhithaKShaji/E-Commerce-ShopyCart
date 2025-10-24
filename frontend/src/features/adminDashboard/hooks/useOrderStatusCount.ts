// src/features/adminDashboard/hooks/useOrderStatusCounts.ts
import { useState, useEffect } from "react";
import axios from "axios";

export interface OrderStatusCounts {
  placed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface UseOrderStatusCountsResult {
  counts: OrderStatusCounts;
  loading: boolean;
  error: string | null;
}

const BASE_URL = "https://shopycart-backend.onrender.com";

export const useOrderStatusCounts = (): UseOrderStatusCountsResult => {
  const [counts, setCounts] = useState<OrderStatusCounts>({
    placed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/order/status-counts`,
          { withCredentials: true,}
        );
        if (res.data && res.data.orderStatusCounts) {
          setCounts(res.data.orderStatusCounts);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Error fetching order status counts");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return { counts, loading, error };
};
