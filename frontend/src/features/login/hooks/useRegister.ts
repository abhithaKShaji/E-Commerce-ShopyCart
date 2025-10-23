
import axios from "axios";
import { useState } from "react";


interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

const BASE_URL = "https://shopycart-backend.onrender.com";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const registerUser = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post<RegisterResponse>(`${BASE_URL}/api/auth/register`, data);
      setSuccess(res.data.message);
      return res.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Registration failed. Try again.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error, success };
};
