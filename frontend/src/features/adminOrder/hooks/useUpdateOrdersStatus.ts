import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "https://shopycart-backend.onrender.com";

export const useUpdateOrderStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateOrderStatus = async (orderId: string, status: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.put(
        `${BASE_URL}/api/order/update-status/${orderId}`,
        { status },
        { withCredentials: true } 
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        toast.success(response.data.message);

        return response.data.order; 
      } else {
        setError("Failed to update order status");
        toast.error("Failed to update order status");
        return null;
      }
    } catch (err: any) {
      console.error("Error updating order:", err);
      setError(err.response?.data?.message || "Something went wrong");
      toast.error(err.response?.data?.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateOrderStatus, loading, error, successMessage };
};
