
import React from "react";
import { FaLock } from "react-icons/fa";

interface User {
  _id: string;
  Name: string;
  Email: string;
}

interface Props {
  user: User;
}

const ProfileDetails: React.FC<Props> = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow w-full md:w-2/4">
      <h2 className="text-xl font-semibold mb-2">{user.Name}</h2>
      <p className="mb-2">Email: {user.Email}</p>
      <a
        href="/change-password"
        className="text-blue-600 flex items-center space-x-1 hover:text-blue-800"
      >
        <FaLock /> <span>Change Password</span>
      </a>
    </div>
  );
};

export default ProfileDetails;
