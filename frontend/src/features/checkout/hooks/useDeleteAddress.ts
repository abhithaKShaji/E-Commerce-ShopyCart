// src/features/checkout/hooks/useDeleteAddress.ts
import { useState } from "react";
import axios from "axios";

export const useDeleteAddress = () => {
  const [loading, setLoading] = useState(false);

  const deleteAddress = async (id: string, token: string) => {
    setLoading(true);
    try {
      const res = await axios.delete(`http://localhost:3000/api/address/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      return res.data; // { message: "Address deleted successfully" }
    } catch (err: any) {
      setLoading(false);
      console.error("Failed to delete address:", err);
      throw err;
    }
  };

  return { deleteAddress, loading };
};
