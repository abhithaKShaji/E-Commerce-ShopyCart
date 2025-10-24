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

//  Connect to MongoDB
connectDB();

//  CORS Configuration
const allowedOrigins = [
  getEnvVariable("FRONT_END_URL") || "https://ecommerceshopycart.netlify.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); 
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(" Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

//  Disable caching (prevents 304 errors)
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

//  Parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Root endpoint
app.get("/", (_req, res) => {
  res.send(" Hai there, API is running smoothly...");
});

//  Routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/order", orderRoute);
app.use("/api/address", addressRoute);

//  Global error handler (optional but useful)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(" Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

//  Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
