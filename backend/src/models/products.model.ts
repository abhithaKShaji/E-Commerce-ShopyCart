import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./user.model";

export interface IProduct extends Document {
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  createdBy?: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
