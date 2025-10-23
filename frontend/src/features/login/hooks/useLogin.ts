
import { useState } from "react";
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    name: string;
    email: string; 
    role: string;
  };
}

const BASE_URL = "https://shopycart-backend.onrender.com";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { login } = useUserAuth();

  const loginUser = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post<LoginResponse>(
        `${BASE_URL}/api/auth/login`,
        data
      );

      setSuccess(res.data.message);

      login(res.data.user, res.data.accessToken);

      return res.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading, error, success };
};
