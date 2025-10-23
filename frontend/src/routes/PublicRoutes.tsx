import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import {
  Login,
  Home,
  Signup,
  ProductsPage,
  ViewProduct,
  Cart,
  Checkout,
  Success,
  OrderHistory,
  Profile,
} from "../pages/user";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="products-page" element={<ProductsPage />} />
        <Route path="view-product/:id" element={<ViewProduct />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="success" element={<Success />} />
        <Route path="order-history" element={<OrderHistory />} />
        <Route path="profile" element={<Profile/>}/>
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
