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
// --- Connect Database ---
(0, db_1.connectDB)();
// --- CORS Configuration ---
const allowedOrigins = [
    (0, helpers_1.getEnvVariable)("FRONT_END_URL"),
    "http://localhost:5173",
    "https://shopycart-frontend.onrender.com", // optional if deployed frontend
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // 🔥 this sends Access-Control-Allow-Credentials: true
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// --- Handle Preflight Requests ---
app.options(/.*/, (0, cors_1.default)());
// --- Other Middlewares ---
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// --- Routes ---
app.get("/", (_req, res) => {
    res.send("Hai there, API is running...");
});
app.use("/api/auth", routes_1.authRoute);
app.use("/api/products", routes_1.productRoute);
app.use("/api/cart", routes_1.cartRoute);
app.use("/api/checkout", routes_1.checkoutRoute);
app.use("/api/order", routes_1.orderRoute);
app.use("/api/address", routes_1.addressRoute);
// --- Start Server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
