"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createOrder = void 0;
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = require("../utils/razorpay");
const order_model_1 = require("../models/order.model");
const mongoose_1 = require("mongoose");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { amount, products } = req.body;
        console.log(" Products received in order:", req.body.products);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(400).json({ message: "User not authenticated" });
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };
        const razorpayOrder = yield razorpay_1.razorpayInstance.orders.create(options);
        const newOrder = new order_model_1.Order({
            userId: new mongoose_1.Types.ObjectId(userId), // ✅ Correct
            products,
            totalAmount: amount,
            currency: razorpayOrder.currency,
            orderId: razorpayOrder.id,
            status: "placed",
        });
        yield newOrder.save();
        res.json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
});
exports.createOrder = createOrder;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const generatedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");
        if (generatedSignature !== razorpay_signature) {
            return res
                .status(400)
                .json({ success: false, message: "Payment verification failed" });
        }
        const order = yield order_model_1.Order.findOneAndUpdate({ orderId: razorpay_order_id }, { paymentId: razorpay_payment_id, status: "placed" }, { new: true });
        res.json({ success: true, message: "Payment verified", order });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Verification failed" });
    }
});
exports.verifyPayment = verifyPayment;
