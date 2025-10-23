import { useState } from "react";
import axios from "axios";

interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

export const useVerifyPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const verifyPayment = async (paymentData: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data } = await axios.post<VerifyPaymentResponse>(
        "http://localhost:3000/api/checkout/verify-payment",
        paymentData
      );

      setSuccess(data.success);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Payment verification failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { verifyPayment, loading, error, success };
};
