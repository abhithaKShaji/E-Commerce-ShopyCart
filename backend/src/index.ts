import express from "express";
import { connectDB } from "./config/db";
import { getEnvVariable } from "./utils/helpers";
import { addressRoute, authRoute, cartRoute, checkoutRoute, orderRoute, productRoute } from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
connectDB();

// ----------------------
// Global CORS Headers
// ----------------------
app.use((req, res, next) => {
  const FRONTEND_URL = getEnvVariable('FRONT_END_URL'); 

  res.header("Access-Control-Allow-Origin", FRONTEND_URL); // only allow your frontend
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Credentials", "true"); // for cookies/jwt

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ----------------------
// Body parsers
// ----------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------
// Root route
// ----------------------
app.get("/", (_req, res) => {
  res.send("Hai there, API is running...");
});

// ----------------------
// API Routes
// ----------------------
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/order", orderRoute);
app.use("/api/address", addressRoute);

// ----------------------
// Start Server
// ----------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
