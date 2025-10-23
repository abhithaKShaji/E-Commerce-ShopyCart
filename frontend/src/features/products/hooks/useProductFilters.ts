
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

interface Filters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface UseProductFiltersReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  distinctBrands: string[];
  distinctCategories: string[];
  fetchProducts: (filters?: Filters) => void;
}

const BASE_URL = "https://shopycart-backend.onrender.com";

export const useProductFilters = (): UseProductFiltersReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [distinctBrands, setDistinctBrands] = useState<string[]>([]);
  const [distinctCategories, setDistinctCategories] = useState<string[]>([]);

  const fetchProducts = async (filters?: Filters) => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {};
      if (filters?.category) params.category = filters.category;
      if (filters?.brand) params.brand = filters.brand;
      if (filters?.minPrice) params.minPrice = filters.minPrice;
      if (filters?.maxPrice) params.maxPrice = filters.maxPrice;

      const response = await axios.get(`${BASE_URL}/api/products/filters`, { params });
      const data = response.data;

      setProducts(data.products || []);
      setDistinctBrands(data.distinctBrands || []);
      setDistinctCategories(data.distinctCategories || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, distinctBrands, distinctCategories, fetchProducts };
};
