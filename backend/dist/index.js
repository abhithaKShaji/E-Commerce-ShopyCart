"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const helpers_1 = require("./utils/helpers");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
//  Connect to MongoDB
(0, db_1.connectDB)();
//  CORS Configuration
const allowedOrigins = [
    (0, helpers_1.getEnvVariable)("FRONT_END_URL") || "https://ecommerceshopycart.netlify.app",
    "http://localhost:5173",
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.warn(" Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
//  Disable caching (prevents 304 errors)
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});
//  Parse JSON and form data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//  Root endpoint
app.get("/", (_req, res) => {
    res.send(" Hai there, API is running smoothly...");
});
//  Routes
app.use("/api/auth", routes_1.authRoute);
app.use("/api/products", routes_1.productRoute);
app.use("/api/cart", routes_1.cartRoute);
app.use("/api/checkout", routes_1.checkoutRoute);
app.use("/api/order", routes_1.orderRoute);
app.use("/api/address", routes_1.addressRoute);
//  Global error handler (optional but useful)
app.use((err, _req, res, _next) => {
    console.error(" Server Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
});
//  Start server
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
