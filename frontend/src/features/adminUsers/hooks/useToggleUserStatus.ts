import { useState } from "react";
import axios from "axios";

interface ToggleStatusResponse {
  blocked: boolean;
  message: string;
}

interface UseToggleUserStatusResult {
  toggleStatus: (id: string, currentStatus: boolean) => Promise<ToggleStatusResponse | null>;
  loading: boolean;
  error: string | null;
}

export const useToggleUserStatus = (): UseToggleUserStatusResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleStatus = async (id: string, currentStatus: boolean): Promise<ToggleStatusResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      // Always call /block/:id, send desired blocked state in body
      const response = await axios.put<ToggleStatusResponse>(
        `http://localhost:3000/api/auth/block/${id}`,
        { blocked: !currentStatus } // toggle the current status
      );

      return response.data; // { blocked: true/false, message: "User has been blocked/unblocked" }
    } catch (err: any) {
      console.error("Failed to toggle user status:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { toggleStatus, loading, error };
};
