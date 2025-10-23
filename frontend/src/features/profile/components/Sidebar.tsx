import React from "react";
import { FaUserCircle, FaBoxes, FaPowerOff } from "react-icons/fa";
import { useLogout } from "../../login/hooks/useLogout";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const { logout, loading, error } = useLogout();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (error) alert(error);
  }, [error]);

  const handleLogout = async () => {
    await logout();
    navigate("/login"); 
  };

  return (
    <aside className="w-full md:w-1/4 bg-gray-100 p-4 rounded-lg">
      <ul className="space-y-2">
        <li>
          <a
            href="/profile"
            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200"
          >
            <FaUserCircle /> <span>My Profile</span>
          </a>
        </li>
        <li>
          <a
            href="/order-history"
            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200"
          >
            <FaBoxes /> <span>My Orders</span>
          </a>
        </li>
        <li>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 text-red-600 w-full text-left"
          >
            <FaPowerOff /> <span>{loading ? "Logging out..." : "Logout"}</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
