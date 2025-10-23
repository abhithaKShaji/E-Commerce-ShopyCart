import React, { useState, useEffect } from "react";
import UsersTable, { type User } from "../../features/adminUsers/components/UserTable";
import { useAllUsers, type User as ApiUser } from "../../features/adminDashboard/hooks/useTotalUsers";
import { useToggleUserStatus } from "../../features/adminUsers/hooks/useToggleUserStatus";

// Skeleton Row
const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse">
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-300 rounded w-24"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-300 rounded w-32"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-300 rounded w-20"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-300 rounded w-16"></div>
    </td>
    <td className="py-3 px-4">
      <div className="h-4 bg-gray-300 rounded w-12"></div>
    </td>
  </tr>
);

const AdminUsersPage: React.FC = () => {
  const { users: apiUsers, currentPage, totalPages, setCurrentPage, loading, error } = useAllUsers("all", 1, 5);
  const { toggleStatus, loading: toggling, error: toggleError } = useToggleUserStatus();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const mappedUsers = apiUsers.map(u => ({
      _id: u._id,
      Name: u.name,
      Email: u.email,
      Number: u.role,
      status: !u.blocked, // true = active, false = blocked
    }));
    setUsers(mappedUsers);
  }, [apiUsers]);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const updated = await toggleStatus(id, currentStatus);
    if (updated) {
      setUsers(prev =>
        prev.map(user =>
          user._id === id ? { ...user, status: !updated.blocked } : user
        )
      );
    }
  };

  return (
    <section className="p-4 md:p-10">
      <div className="container mx-auto">
        <ul className="flex space-x-2 text-gray-500 mb-4 text-sm md:text-base">
          <li>Manage Users</li>
          <li>/</li>
          <li className="font-semibold text-gray-700">View Users</li>
        </ul>

        {toggleError && <p className="text-red-500 text-center mb-2">{toggleError}</p>}
        {toggling && <p className="text-gray-700 text-center mb-2">Updating user status...</p>}

        {loading ? (
          <div className="overflow-x-auto shadow rounded-lg bg-white">
            <table className="min-w-full text-sm text-gray-700 border-collapse">
              <thead className="bg-gray-100 text-gray-800 uppercase text-sm">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <SkeletonRow key={idx} />
                ))}
              </tbody>
            </table>
          </div>
        ) : error ? (
          <p className="text-center mt-10 text-red-500">{error}</p>
        ) : (
          <UsersTable users={users} onToggleStatus={handleToggleStatus} isToggling={toggling} />
        )}

        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminUsersPage;
