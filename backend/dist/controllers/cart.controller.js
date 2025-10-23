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
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.getCart = exports.addToCart = void 0;
const cart_model_1 = require("../models/cart.model");
// Add product to cart
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productId, quantity = 1 } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // <- only the ObjectId
    if (!productId)
        return res.status(400).json({ message: "Product ID is required" });
    try {
        let cart = yield cart_model_1.Cart.findOne({ user: userId });
        if (!cart) {
            cart = new cart_model_1.Cart({ user: userId, items: [{ product: productId, quantity }] });
        }
        else {
            const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            }
            else {
                cart.items.push({ product: productId, quantity });
            }
        }
        yield cart.save();
        res.status(200).json({ message: "Product added to cart", cart });
    }
    catch (err) {
        console.error("Add to cart error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addToCart = addToCart;
// Get user's cart
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // <- use only ObjectId, not the whole object
    //console.log("getCart userId:", userId);
    try {
        const cart = yield cart_model_1.Cart.findOne({ user: userId }).populate("items.product");
        //console.log("Cart found:", cart);
        if (!cart) {
            return res.status(200).json({ message: "Cart not found for user", items: [] });
        }
        res.status(200).json(cart);
    }
    catch (err) {
        console.error("Get cart error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCart = getCart;
// Remove item from cart
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!productId)
        return res.status(400).json({ message: "Product ID is required" });
    try {
        const cart = yield cart_model_1.Cart.findOne({ user: userId });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        cart.items = cart.items.filter(item => !item.product.equals(productId));
        yield cart.save();
        res.status(200).json({ message: "Product removed from cart", cart });
    }
    catch (err) {
        console.error("Remove from cart error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.removeFromCart = removeFromCart;
// Clear user's cart after successful checkout
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ message: "User not authenticated" });
        const cart = yield cart_model_1.Cart.findOne({ user: userId });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        cart.items = [];
        yield cart.save();
        res.status(200).json({ success: true, message: "Cart cleared successfully" });
    }
    catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({ success: false, message: "Failed to clear cart" });
    }
});
exports.clearCart = clearCart;
