import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
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
  products: Product[];
  page: number;
  totalPages: number;
  totalItems: number;
}

interface FilterParams {
  name?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
}

const BASE_URL = "https://shopycart-backend.onrender.com";

export const useProducts = (filters: FilterParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (filters.name) params.append("name", filters.name);
        if (filters.category) params.append("category", filters.category);
        if (filters.brand) params.append("brand", filters.brand);
        if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());

        const response = await axios.get<ApiResponse>(
          `${BASE_URL}/api/products?${params.toString()}`
        );

        setProducts(response.data.products);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { products, loading, error };
};
