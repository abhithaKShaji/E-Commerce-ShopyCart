import { useEffect, useState } from "react";
import axios, { type AxiosResponse } from "axios";

interface ProductCountResponse {
  success: boolean;
  totalProducts: number;
  message: string;
}

export const useTotalProducts = () => {
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        setLoading(true);
        setError(null);

        const res: AxiosResponse<ProductCountResponse> = await axios.get(
          "http://localhost:3000/api/products/count"
        );

        setTotalProducts(res.data.totalProducts || 0);
      } catch (err: any) {
        console.error("Error fetching product count:", err);

        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else {
          setError(err.message || "Something went wrong while fetching product count.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductCount();
  }, []);

  return { totalProducts, loading, error };
};
