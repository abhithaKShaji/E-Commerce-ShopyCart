"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkout_controller_1 = require("../controllers/checkout.controller");
const auth_miiddleware_1 = require("../middlewares/auth.miiddleware");
const router = express_1.default.Router();
router.post("/create-order", auth_miiddleware_1.authMiddleware, checkout_controller_1.createOrder);
router.post("/verify-payment", checkout_controller_1.verifyPayment);
exports.default = router;
