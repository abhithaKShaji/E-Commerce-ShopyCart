import express from "express";
import { getMyOrders, getAllOrders,getPaymentMethodCounts,updateOrderStatus, getOrderStatusCounts, getTotalRevenue } from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.miiddleware";

const router = express.Router();

// User orders
router.get("/user/me",authMiddleware, getMyOrders);

// Admin orders
router.get("/all-orders", getAllOrders);
router.get("/payment-counts", getPaymentMethodCounts);
router.get("/status-counts", getOrderStatusCounts);
router.get("/total-revenue", getTotalRevenue);
router.put("/update-status/:orderId", updateOrderStatus);

export default router;
