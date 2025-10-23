// src/features/adminDashboard/hooks/useTotalRevenue.ts
import { useState, useEffect } from "react";
import axios from "axios";

interface TotalRevenueResponse {
  success: boolean;
  totalRevenue: number;
  message: string;
}

interface UseTotalRevenueResult {
  totalRevenue: number;
  loading: boolean;
  error: string | null;
}

export const useTotalRevenue = (): UseTotalRevenueResult => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<TotalRevenueResponse>(
          "http://localhost:3000/api/order/total-revenue"
        );
        setTotalRevenue(res.data.totalRevenue);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to fetch revenue");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  return { totalRevenue, loading, error };
};
