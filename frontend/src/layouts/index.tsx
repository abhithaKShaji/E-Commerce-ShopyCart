import { Routes } from "react-router-dom";
import PublicRoutes from "../routes/PublicRoutes";
import AdminRoutes from "../routes/AdminRoutes";


const AppRoutes = () => {

  return (
    <Routes>
      {PublicRoutes()}
     {AdminRoutes()}
    </Routes>
  );
};

export default AppRoutes;
