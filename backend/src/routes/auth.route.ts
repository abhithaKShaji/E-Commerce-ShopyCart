import express from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  getUserProfile,
  getAllUsersAndCount,
  logoutUser,
  toggleUserBlock
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.miiddleware";

const router = express.Router();

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout",authMiddleware,logoutUser)

// Profile
router.get("/users/profile", authMiddleware, getUserProfile);

router.get("/all-users", getAllUsersAndCount);
router.put("/block/:id",  toggleUserBlock);


export default router;
