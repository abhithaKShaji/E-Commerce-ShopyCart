import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { getEnvVariable } from "./utils/helpers";
import {
  addressRoute,
  authRoute,
  cartRoute,
  checkoutRoute,
  orderRoute,
  productRoute,
} from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

// --- Connect Database ---
connectDB();

// --- CORS Configuration ---
const allowedOrigins = [
  getEnvVariable("FRONT_END_URL"),
  "http://localhost:5173",
  "https://shopycart-frontend.onrender.com", // optional if deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // 🔥 this sends Access-Control-Allow-Credentials: true
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- Handle Preflight Requests ---
app.options(/.*/, cors());

// --- Other Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.get("/", (_req, res) => {
  res.send("Hai there, API is running...");
});

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/order", orderRoute);
app.use("/api/address", addressRoute);

// --- Start Server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
