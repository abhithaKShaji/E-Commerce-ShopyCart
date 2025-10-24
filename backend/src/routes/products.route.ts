import express from "express";
import multer from "multer";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
  filterProducts,
  getTotalProductCount
} from "../controllers/products.controller";

const router = express.Router();
const imageUpload = multer({ storage: multer.memoryStorage() });

router.post("/", imageUpload.array("images"), createProduct);
router.get("/", getProducts);
router.get("/count", getTotalProductCount);
router.get("/search", searchProducts);
router.get("/filters", filterProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);
router.put("/:id", imageUpload.array("images"), updateProduct);
router.delete("/:id", deleteProduct);




export default router;
