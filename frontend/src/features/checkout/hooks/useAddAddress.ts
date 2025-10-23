import { useState } from "react";
import axios from "axios";
import type{ Address } from "../hooks/useAddress";

export interface AddressData {
  name: string;
  number: string;
  street: string;
  town: string;
  city: string;
  state: string;
  pincode: string;
}

interface UseAddAddressReturn {
  addAddress: (data: AddressData) => Promise<Address>;
  loading: boolean;
  error: string | null;
}

export const useAddAddress = (): UseAddAddressReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addAddress = async (data: AddressData): Promise<Address> => {
    try {
      setLoading(true);

      const token = localStorage.getItem("user_token");

      const response = await axios.post<Address>(
        "http://localhost:3000/api/address",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setError(null);
      return response.data;
    } catch (err: any) {
      console.error("Failed to add address:", err);
      setError(err?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addAddress, loading, error };
};
