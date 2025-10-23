import {  Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";


const AdminLayout: React.FC = () => {

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <AdminHeader />
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

export default AdminLayout;
