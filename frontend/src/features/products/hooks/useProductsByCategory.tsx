import { useState, useEffect } from "react";
import axios from "axios";

export interface Product {
  _id: string;
  name: string;
  brand?: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  category: string;
  products: Product[];
}

export const useProductsByCategory = (category?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get<ApiResponse>(
          `http://localhost:3000/api/products/category/${category}`
        );
        setProducts(data.products);
      } catch (err: any) {
        // Axios errors have a response object with message
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return { products, loading, error };
};
