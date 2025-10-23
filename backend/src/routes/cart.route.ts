import express from "express";
import { addToCart, getCart, removeFromCart,clearCart } from "../controllers/cart.controller";
import { authMiddleware } from "../middlewares/auth.miiddleware";


const router = express.Router();

router.use(authMiddleware);

router.post("/add", addToCart);
router.get("/", getCart);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

export default router;