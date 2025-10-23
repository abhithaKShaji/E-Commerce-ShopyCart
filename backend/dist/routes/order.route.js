"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const auth_miiddleware_1 = require("../middlewares/auth.miiddleware");
const router = express_1.default.Router();
// User orders
router.get("/user/me", auth_miiddleware_1.authMiddleware, order_controller_1.getMyOrders);
// Admin orders
router.get("/all-orders", order_controller_1.getAllOrders);
router.get("/payment-counts", order_controller_1.getPaymentMethodCounts);
router.get("/status-counts", order_controller_1.getOrderStatusCounts);
router.get("/total-revenue", order_controller_1.getTotalRevenue);
router.put("/update-status/:orderId", order_controller_1.updateOrderStatus);
exports.default = router;
