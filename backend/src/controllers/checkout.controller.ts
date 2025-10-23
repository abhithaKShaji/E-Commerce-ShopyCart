import { Request, Response } from "express";
import crypto from "crypto";
import { razorpayInstance } from "../utils/razorpay";
import { Order } from "../models/order.model";
import {AuthRequest} from "../middlewares/auth.miiddleware"
import { Types } from "mongoose";

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, products } = req.body;
    console.log(" Products received in order:", req.body.products);

    const userId = req.user?.id;

    if (!userId)
      return res.status(400).json({ message: "User not authenticated" });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    const newOrder = new Order({
      userId: new Types.ObjectId(userId), // ✅ Correct
      products,
      totalAmount: amount,
      currency: razorpayOrder.currency,
      orderId: razorpayOrder.id,
      status: "placed",
    });

    await newOrder.save();

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};


export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { paymentId: razorpay_payment_id, status: "placed" },
      { new: true }
    );

    res.json({ success: true, message: "Payment verified", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};
