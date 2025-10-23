"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_miiddleware_1 = require("../middlewares/auth.miiddleware");
const router = express_1.default.Router();
// Auth
router.post("/register", auth_controller_1.registerUser);
router.post("/login", auth_controller_1.loginUser);
router.post("/refresh-token", auth_controller_1.refreshAccessToken);
router.post("/logout", auth_miiddleware_1.authMiddleware, auth_controller_1.logoutUser);
// Profile
router.get("/users/profile", auth_miiddleware_1.authMiddleware, auth_controller_1.getUserProfile);
router.get("/all-users", auth_controller_1.getAllUsersAndCount);
router.put("/block/:id", auth_controller_1.toggleUserBlock);
exports.default = router;
