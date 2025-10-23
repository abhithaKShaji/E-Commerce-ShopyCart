import { Request, Response } from "express";
import { Address } from "../models/address.model";
import { AuthRequest } from "../middlewares/auth.miiddleware";

// ➕ Add new address
export const addAddress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(400).json({ message: "User not authenticated" });

    const { name, number, street, town, city, state, pincode } = req.body;

    const address = new Address({
      user: req.user.id,
      name,
      number,
      street,
      town,
      city,
      state,
      pincode,
    });

    await address.save();
    res.status(201).json({ message: "Address added successfully", address });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({ message: "Failed to add address" });
  }
};

// 📦 Get all addresses for logged-in user
export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(400).json({ message: "User not authenticated" });

    const addresses = await Address.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Get address error:", error);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

// ❌ Delete address
export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(400).json({ message: "User not authenticated" });

    const { id } = req.params;
    const address = await Address.findOneAndDelete({ _id: id, user: req.user.id });

    if (!address) return res.status(404).json({ message: "Address not found" });
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ message: "Failed to delete address" });
  }
};
