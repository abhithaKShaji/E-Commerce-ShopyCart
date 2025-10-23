import { Outlet } from "react-router-dom";
import MainHeader from "../components/common/MainHeader";
import Footer from "../components/common/Footer";

const PublicLayout = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <MainHeader /> 
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default PublicLayout;
