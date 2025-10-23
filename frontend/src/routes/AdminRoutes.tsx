import { Routes, Route} from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { Dashboard,  Orders, Products, Users } from "../pages/admin";


const AdminRoutes = () => {

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users/>}/>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
