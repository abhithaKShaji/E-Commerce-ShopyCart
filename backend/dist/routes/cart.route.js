"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const auth_miiddleware_1 = require("../middlewares/auth.miiddleware");
const router = express_1.default.Router();
router.use(auth_miiddleware_1.authMiddleware);
router.post("/add", cart_controller_1.addToCart);
router.get("/", cart_controller_1.getCart);
router.delete("/remove/:productId", cart_controller_1.removeFromCart);
router.delete("/clear", cart_controller_1.clearCart);
exports.default = router;
