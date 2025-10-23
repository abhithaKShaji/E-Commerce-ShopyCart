import { useState, useEffect } from "react";
import axios from "axios";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileResponse {
  message: string;
  user: UserProfile;
}

export const useUserProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get<ProfileResponse>(
        "http://localhost:3000/api/auth/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user)); 
      setError(null);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to fetch profile.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { user, loading, error, refetch: fetchProfile };
};
