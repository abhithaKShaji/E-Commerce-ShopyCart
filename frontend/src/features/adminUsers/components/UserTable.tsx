// src/features/adminUsers/components/UserTable.tsx
import React from "react";
import UserTableRow, { type User as UserRowType } from "./UserTableRow";

export type User = UserRowType; // ✅ export the type

interface Props {
  users: User[];
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  isToggling: boolean;
}

const UsersTable: React.FC<Props> = ({ users, onToggleStatus, isToggling }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-2 text-center text-sm font-semibold">No</th>
            <th className="py-3 px-2 text-center text-sm font-semibold">Username</th>
            <th className="py-3 px-2 text-center text-sm font-semibold">Email</th>
            <th className="py-3 px-2 text-center text-sm font-semibold">Status</th>
            <th className="py-3 px-2 text-center text-sm font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <UserTableRow
              key={user._id}
              user={user}
              index={idx}
              onToggleStatus={onToggleStatus}
              isToggling={isToggling}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
