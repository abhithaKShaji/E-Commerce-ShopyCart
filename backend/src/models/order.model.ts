import mongoose, { Document, Schema, Types } from "mongoose";

// ----------------------
// INTERFACE
// ----------------------
export interface IOrderProduct {
  productId: Types.ObjectId;       // reference to Product
  name: string;
  brand?: string;
  images?: string[];
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;          // reference to User
  products: IOrderProduct[];
  totalAmount: number;
  currency: string;
  orderId: string;                 // Razorpay order id
  paymentId?: string;              // Razorpay payment id
  status: "placed" | "shipped" | "delivered" | "cancelled" | "paid";
  createdAt: Date;
  updatedAt: Date;
}

// ----------------------
// SCHEMA
// ----------------------
const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        brand: { type: String },
        images: [{ type: String }],
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],

    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    // Razorpay fields
    orderId: { type: String, required: true },  // razorpay_order_id
    paymentId: { type: String },

    status: {
      type: String,
      enum: ["placed", "shipped", "delivered", "cancelled", "paid"],
      default: "placed",
    },
  },
  { timestamps: true }
);

// ----------------------
// MODEL EXPORT
// ----------------------
export const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
