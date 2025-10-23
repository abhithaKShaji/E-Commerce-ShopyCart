import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserAuthProvider } from "./context/UserAuthContext";
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    
      <UserAuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </UserAuthProvider>
   
  </StrictMode>
);
