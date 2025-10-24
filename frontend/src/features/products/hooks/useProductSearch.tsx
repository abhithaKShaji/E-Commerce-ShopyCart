
import { useState, useEffect } from "react";
import axios from "axios";

export interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = "https://shopycart-backend.onrender.com";

export const useProductSearch = (query: string, page = 1, limit = 5) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/products/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
        );
        setProducts(res.data.products);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, page, limit]);

  return { products, loading, error };
};
