import { useState } from "react";
import axios from "axios";
//import { useUserAuth } from "../../../context/UserAuthContext";

interface ProductItem {
  productId: string;
  name: string;
  brand?: string;
  price: number;
  quantity: number;
  images: string[];
}

interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

const BASE_URL = "https://shopycart-backend.onrender.com";

export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);

  //const { user } = useUserAuth();

  //  Added products parameter
  const createOrder = async (
    amount: number,
    addressId: string,
    paymentMethod: "COD" | "Razorpay",
    products: ProductItem[]
  ) => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      setError("User not authenticated. Please login and try again.");
      throw new Error("User not authenticated");
    }

    if (!products || products.length === 0) {
      setError("No products in the order.");
      throw new Error("No products in the order");
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post<CreateOrderResponse>(
       ` ${BASE_URL}/api/checkout/create-order`,
        {
          amount,
          addressId,
          paymentMethod,
          products, 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrderData(data);
      return data;
    } catch (err: any) {
      console.error("createOrder error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error, orderData };
};
