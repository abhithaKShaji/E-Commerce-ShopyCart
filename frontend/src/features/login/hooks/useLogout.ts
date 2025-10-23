import { useState } from "react";
import { useUserAuth } from "../../../context/UserAuthContext";
import axios from "axios";

const BASE_URL = "https://shopycart-backend.onrender.com";

export const useLogout = () => {
  const { logout: contextLogout } = useUserAuth(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("user_token"); 

      await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      contextLogout();

    } catch (err: any) {
      setError(err.response?.data?.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
};
