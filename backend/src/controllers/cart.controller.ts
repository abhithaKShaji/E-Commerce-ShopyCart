// controllers/cart.controller.ts
import { Request, Response } from "express";
import { Cart } from "../models/cart.model";
import { AuthRequest } from "../middlewares/auth.miiddleware";
import { Types } from "mongoose";

// Add product to cart
export const addToCart = async (req: Request, res: Response) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user?.id; // <- only the ObjectId

  if (!productId) return res.status(400).json({ message: "Product ID is required" });

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [{ product: productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user's cart
export const getCart = async (req: Request, res: Response) => {
  const userId = req.user?.id; // <- use only ObjectId, not the whole object
  //console.log("getCart userId:", userId);

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    //console.log("Cart found:", cart);

    if (!cart) {
      return res.status(200).json({ message: "Cart not found for user", items: [] });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const userId = req.user?.id;

  if (!productId) return res.status(400).json({ message: "Product ID is required" });

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => !item.product.equals(productId));
    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Clear user's cart after successful checkout
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "User not authenticated" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ success: false, message: "Failed to clear cart" });
  }
};