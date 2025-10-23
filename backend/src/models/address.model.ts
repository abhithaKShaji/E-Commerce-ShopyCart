import mongoose, { Schema, Document } from "mongoose";

export interface IAddress extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  number: string;
  street: string;
  town: string;
  city: string;
  state: string;
  pincode: string;
}

const AddressSchema = new Schema<IAddress>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    number: { type: String, required: true },
    street: { type: String, required: true },
    town: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { timestamps: true }
);

export const Address = mongoose.model<IAddress>("Address", AddressSchema);
