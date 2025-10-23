import { useState, useEffect } from "react";
import axios, { type AxiosResponse } from "axios";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersApiResponse {
  success: boolean;
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  usersPerPage: number;
  users: User[];
}

export const useAllUsers = (
  initialFilter: "all" | "today" | "7days" | "30days" = "all",
  initialPage = 1,
  pageSize = 5
) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "today" | "7days" | "30days">(initialFilter);

  const fetchUsers = async (filterValue = filter, pageValue = currentPage) => {
    setLoading(true);
    setError(null);

    try {
      const res: AxiosResponse<UsersApiResponse> = await axios.get(
        `http://localhost:3000/api/auth/all-users`,
        {
          params: {
            filter: filterValue,
            page: pageValue,
            limit: pageSize,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUsers(res.data.users);
      setTotalUsers(res.data.totalUsers);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err: any) {
      console.error("Error fetching users:", err);

      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError(err.message || "Something went wrong while fetching users.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter, currentPage]);

  return {
    users,
    totalUsers,
    currentPage,
    totalPages,
    filter,
    setFilter,
    setCurrentPage,
    loading,
    error,
    refetch: fetchUsers,
  };
};
