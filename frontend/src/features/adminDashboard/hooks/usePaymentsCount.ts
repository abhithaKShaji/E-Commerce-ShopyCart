import { useEffect, useState } from "react";
import axios, { type AxiosResponse } from "axios";

interface PaymentCounts {
  COD: number;
  Razorpay: number;
}

interface ApiResponse {
  success: boolean;
  counts: PaymentCounts;
  message: string;
}

const BASE_URL = "https://shopycart-backend.onrender.com";

export const usePaymentCounts = () => {
  const [paymentCounts, setPaymentCounts] = useState<PaymentCounts>({ COD: 0, Razorpay: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res: AxiosResponse<ApiResponse> = await axios.get(
          `${BASE_URL}/api/order/payment-counts`
        );

        setPaymentCounts(res.data.counts || { COD: 0, Razorpay: 0 });
      } catch (err: any) {
        console.error("Error fetching payment counts:", err);

        // Axios-specific error message
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else {
          setError(err.message || "Something went wrong while fetching payment counts.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return { paymentCounts, loading, error };
};
