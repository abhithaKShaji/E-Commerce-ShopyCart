"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const address_controller_1 = require("../controllers/address.controller");
const auth_miiddleware_1 = require("../middlewares/auth.miiddleware");
const router = express_1.default.Router();
router.post("/", auth_miiddleware_1.authMiddleware, address_controller_1.addAddress);
router.get("/", auth_miiddleware_1.authMiddleware, address_controller_1.getAddresses);
router.delete("/:id", auth_miiddleware_1.authMiddleware, address_controller_1.deleteAddress);
exports.default = router;
