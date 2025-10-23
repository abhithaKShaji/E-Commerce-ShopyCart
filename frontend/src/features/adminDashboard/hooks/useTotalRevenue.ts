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

const BASE_URL = "https://shopycart-backend.onrender.com";

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
          `${BASE_URL}/api/order/total-revenue`
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
