import { useEffect, useState } from "react";
import axios from "axios";

export interface Product {
  _id: string;
  name: string;
  brand?: string;
  description?: string;
  price: number;
  category: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductResponse {
  products: Product[];
  page: number;
  totalPages: number;
  totalItems: number;
}


export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true); 
  const [actionLoading, setActionLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = "https://shopycart-backend.onrender.com";

  const fetchProducts = async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      const res = await axios.get<ProductResponse>(`${BASE_URL}/api/products?page=${pageNumber}`);
      setProducts(res.data.products);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (formData: FormData) => {
    try {
      setActionLoading(true); 
      const res = await axios.post(`${BASE_URL}/api/products/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data.message);
      await fetchProducts(page);
      setError(null);
    } catch (err) {
      console.error("Failed to add product", err);
      setError("Failed to add product");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const updateProduct = async (id: string, formData: FormData) => {
    try {
      setActionLoading(true); 
      const res = await axios.put(`${BASE_URL}/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data.message);
      await fetchProducts(page);
      setError(null);
    } catch (err) {
      console.error("Failed to update product", err);
      setError("Failed to update product");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setError(null);
    } catch (err) {
      console.error("Failed to delete product", err);
      setError("Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  return {
    products,
    page,
    totalPages,
    loading, 
    actionLoading, 
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setPage,
  };
};