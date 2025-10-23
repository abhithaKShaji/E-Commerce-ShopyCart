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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalProductCount = exports.filterProducts = exports.searchProducts = exports.getProductsByCategory = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const products_model_1 = require("../models/products.model");
// -------------------- CREATE PRODUCT --------------------
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, brand, description, price, category } = req.body;
        if (!name || !brand || !description || !price || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }
        const uploadedImages = [];
        for (const file of req.files) {
            const result = yield cloudinary_1.default.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString("base64")}`, { folder: "products" });
            uploadedImages.push(result.secure_url);
        }
        const newProduct = new products_model_1.Product({
            name,
            brand,
            description,
            price,
            category,
            images: uploadedImages,
            createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        });
        yield newProduct.save();
        res.status(201).json({ message: "Product created", product: newProduct });
    }
    catch (err) {
        console.error("Create product error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createProduct = createProduct;
// -------------------- GET PRODUCTS --------------------
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, brand, minPrice, maxPrice, name, page = "1", limit = "10" } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (brand)
            filter.brand = brand;
        // Price filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price["$gte"] = Number(minPrice);
            if (maxPrice)
                filter.price["$lte"] = Number(maxPrice);
        }
        // Name search
        if (name)
            filter.name = { $regex: name, $options: "i" };
        const products = yield products_model_1.Product.find(filter)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const total = yield products_model_1.Product.countDocuments(filter);
        res.json({
            products,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalItems: total,
        });
    }
    catch (err) {
        console.error("Get products error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getProducts = getProducts;
// -------------------- GET SINGLE PRODUCT --------------------
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield products_model_1.Product.findById(id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    }
    catch (err) {
        console.error("Get product error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getProductById = getProductById;
// -------------------- UPDATE PRODUCT --------------------
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const body = req.body || {};
        const product = yield products_model_1.Product.findById(id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        // Update basic fields
        if (body.name)
            product.name = body.name;
        if (body.brand)
            product.brand = body.brand;
        if (body.description)
            product.description = body.description;
        if (body.category)
            product.category = body.category;
        if (body.price !== undefined && body.price !== "") {
            const parsedPrice = Number(body.price);
            if (isNaN(parsedPrice)) {
                return res.status(400).json({ message: "Price must be a valid number" });
            }
            product.price = parsedPrice;
        }
        //  Handle image updates
        let finalImages = [];
        // Keep existing images (from formData)
        if (body["existingImages[]"]) {
            if (Array.isArray(body["existingImages[]"])) {
                finalImages = body["existingImages[]"];
            }
            else {
                finalImages = [body["existingImages[]"]];
            }
        }
        // Add new uploaded images
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = yield cloudinary_1.default.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString("base64")}`, { folder: "products" });
                finalImages.push(result.secure_url);
            }
        }
        product.images = finalImages;
        yield product.save();
        res.json({ message: "Product updated successfully", product });
    }
    catch (err) {
        console.error("Update product error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateProduct = updateProduct;
// -------------------- DELETE PRODUCT --------------------
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedProduct = yield products_model_1.Product.findByIdAndDelete(id);
        if (!deletedProduct)
            return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    }
    catch (err) {
        console.error("Delete product error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteProduct = deleteProduct;
// -------------------- GET PRODUCTS BY CATEGORY --------------------
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.params;
        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }
        const products = yield products_model_1.Product.find({ category });
        if (!products.length) {
            return res.status(404).json({ message: "No products found for this category" });
        }
        res.json({ category, products });
    }
    catch (err) {
        console.error("Get products by category error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getProductsByCategory = getProductsByCategory;
// -------------------- SEARCH PRODUCTS --------------------
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, page = "1", limit = "10" } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }
        // Build regex for case-insensitive search
        const regex = new RegExp(query, "i");
        // Search by name or brand
        const filter = {
            $or: [{ name: regex }, { brand: regex }],
        };
        const products = yield products_model_1.Product.find(filter)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const total = yield products_model_1.Product.countDocuments(filter);
        res.json({
            products,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalItems: total,
        });
    }
    catch (err) {
        console.error("Search products error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.searchProducts = searchProducts;
// -------------------- GET PRODUCTS WITH FILTERS --------------------
const filterProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, brand, minPrice, maxPrice, page = "1", limit = "10" } = req.query;
        const filter = {};
        // ✅ Category filter
        if (category)
            filter.category = category;
        // ✅ Brand filter
        if (brand)
            filter.brand = brand;
        // ✅ Price filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price["$gte"] = Number(minPrice);
            if (maxPrice)
                filter.price["$lte"] = Number(maxPrice);
        }
        // Pagination
        const products = yield products_model_1.Product.find(filter)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const total = yield products_model_1.Product.countDocuments(filter);
        // ✅ Distinct brands for selected category
        const distinctBrands = category
            ? yield products_model_1.Product.find({ category }).distinct("brand")
            : yield products_model_1.Product.distinct("brand");
        // ✅ Distinct categories (all)
        const distinctCategories = yield products_model_1.Product.distinct("category");
        res.json({
            products,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalItems: total,
            distinctBrands,
            distinctCategories,
        });
    }
    catch (err) {
        console.error("Filter products error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.filterProducts = filterProducts;
// -------------------- GET TOTAL PRODUCT COUNT (PUBLIC) --------------------
const getTotalProductCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalProducts = yield products_model_1.Product.countDocuments();
        res.status(200).json({
            success: true,
            totalProducts,
            message: "Total product count fetched successfully",
        });
    }
    catch (err) {
        console.error("Get total product count error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getTotalProductCount = getTotalProductCount;
