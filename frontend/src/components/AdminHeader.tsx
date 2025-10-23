import React, { useState } from "react";
import { Link } from "react-router-dom";
import {  Users,  ShoppingCart, Package, Monitor } from "lucide-react";
import profile from "../assets/profile.png";

const AdminHeader: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
 // const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  //const toggleDropdown = (id: string) =>
   // setOpenDropdown(openDropdown === id ? null : id);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Toggle Button for mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md shadow"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 z-40`}
      >
        {/* Profile */}
        <div className="flex flex-col items-center py-6">
          <img
            src={profile}
            alt="Admin Avatar"
            className="w-20 h-20 rounded-full border-2 border-amber-400"
          />
          <p className="mt-3 font-semibold">Admin</p>
        </div>

        {/* Navigation */}
        <nav className="px-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 rounded-lg"
              >
                <Monitor size={18} />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/users"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 rounded-lg"
              >
                <Users size={18} />
                <span>Manage Users</span>
              </Link>
            </li>

          { /* <li>
              <button
                onClick={() => toggleDropdown("offers")}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 rounded-lg"
              >
                <span className="flex items-center gap-3">
                  <Tag size={18} />
                  Manage Offers
                </span>
                <ChevronDown size={16} />
              </button>
              {openDropdown === "offers" && (
                <ul className="pl-10 space-y-1 text-sm">
                  <li>
                    <Link
                      to="/admin/product-offer"
                      className="block px-2 py-1 hover:text-amber-400"
                    >
                      Product Offers
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="block px-2 py-1 hover:text-amber-400"
                    >
                      Coupon Codes
                    </Link>
                  </li>
                </ul>
              )}
            </li>*/}

            <li>
              <Link
                to="/admin/products"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 rounded-lg"
              >
                <Package size={18} />
                <span>Manage Products</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/orders"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 rounded-lg"
              >
                <ShoppingCart size={18} />
                <span>Manage Orders</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 p-6 overflow-auto bg-white min-h-screen transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        {/* Your main content goes here */}
      </div>
    </div>
  );
};

export default AdminHeader;
