import express from "express";
import { addAddress, getAddresses, deleteAddress } from "../controllers/address.controller";
import { authMiddleware } from "../middlewares/auth.miiddleware";

const router = express.Router();

router.post("/", authMiddleware, addAddress);
router.get("/", authMiddleware, getAddresses);
router.delete("/:id", authMiddleware, deleteAddress);

export default router;
