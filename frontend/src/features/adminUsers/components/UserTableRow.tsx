// src/features/adminUsers/components/UserTableRow.tsx
import React from "react";

export interface User {
  _id: string;
  Name: string;
  Email: string;
  Number: string;
  status: boolean; // true = active, false = blocked
}

interface Props {
  user: User;
  index: number;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  isToggling: boolean;
}

const UserTableRow: React.FC<Props> = ({ user, index, onToggleStatus, isToggling }) => {
  return (
    <tr className="border-b">
      <td className="py-3 px-2 text-center">{index + 1}</td>
      <td className="py-3 px-2 text-center">{user.Name}</td>
      <td className="py-3 px-2 text-center">{user.Email}</td>
      <td className="py-3 px-2 text-center">
        {user.status ? (
          <span className="text-green-600 font-medium">Active</span>
        ) : (
          <span className="text-red-600 font-medium">Blocked</span>
        )}
      </td>
      <td className="py-3 px-2 text-center">
        <button
          onClick={() => onToggleStatus(user._id, user.status)}
          disabled={isToggling}
          className={`px-3 py-1 rounded font-medium text-white transition-colors ${
            user.status
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-red-500 hover:bg-red-600"
          } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {user.status ? "Block" : "Unblock"}
        </button>
      </td>
    </tr>
  );
};

export default UserTableRow;
