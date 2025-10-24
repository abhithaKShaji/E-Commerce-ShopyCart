import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { getEnvVariable } from "./utils/helpers";
import { addressRoute, authRoute, cartRoute, checkoutRoute,  orderRoute, productRoute } from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
connectDB();

// Middlewares
app.use(cors({
  origin: [
    getEnvVariable('FRONT_END_URL'), "http://localhost:5173",
  ]
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root 
app.get("/", async (_req, res) => {
  res.send("Hai there, API is running...");
});

 //Routes
app.use("/api/auth", authRoute);
app.use('/api/products', productRoute)
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);
app.use('/api/order', orderRoute);
app.use('/api/address', addressRoute)



// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
