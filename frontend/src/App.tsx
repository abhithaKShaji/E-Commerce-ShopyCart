import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
