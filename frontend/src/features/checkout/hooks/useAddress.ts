import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export interface Address {
  _id: string;
  user: string;
  name: string;
  number: string;
  street: string;
  town: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UseAddressesReturn {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  fetchAddresses: () => Promise<void>;
}

const BASE_URL = "https://shopycart-backend.onrender.com";

export const useAddresses = (): UseAddressesReturn => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage (match your auth context)
      const token = localStorage.getItem("user_token");
      if (!token) throw new Error("User not authenticated");

      const response = await axios.get<Address[]>(
        `${BASE_URL}/api/address`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAddresses(response.data);
    } catch (err: any) {
      console.error("Failed to fetch addresses:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong");
      setAddresses([]); // reset on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return { addresses, loading, error, fetchAddresses };
};
