import express from "express";
import { createOrder, verifyPayment } from "../controllers/checkout.controller";
import { authMiddleware } from "../middlewares/auth.miiddleware";

const router = express.Router();

router.post("/create-order", authMiddleware, createOrder);
router.post("/verify-payment", verifyPayment);

export default router;
