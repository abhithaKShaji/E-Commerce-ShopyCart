import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { Product, IProduct } from "../models/products.model";
import { FilterQuery } from "mongoose";

// -------------------- CREATE PRODUCT --------------------
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, brand, description, price, category } = req.body;

    if (!name || !brand || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const uploadedImages: string[] = [];
    for (const file of req.files as Express.Multer.File[]) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        { folder: "products" }
      );
      uploadedImages.push(result.secure_url);
    }

    const newProduct = new Product({
      name,
      brand,
      description,
      price,
      category,
      images: uploadedImages,
      createdBy: req.user?.id,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- GET PRODUCTS --------------------
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, brand, minPrice, maxPrice, name, page = "1", limit = "10" } = req.query;

    const filter: FilterQuery<IProduct> = {};

    if (category) filter.category = category as string;
    if (brand) filter.brand = brand as string;

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as any)["$gte"] = Number(minPrice);
      if (maxPrice) (filter.price as any)["$lte"] = Number(maxPrice);
    }

    // Name search
    if (name) filter.name = { $regex: name as string, $options: "i" };

    const products = await Product.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalItems: total,
    });
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- GET SINGLE PRODUCT --------------------
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- UPDATE PRODUCT --------------------
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update basic fields
    if (body.name) product.name = body.name;
    if (body.brand) product.brand = body.brand;
    if (body.description) product.description = body.description;
    if (body.category) product.category = body.category;

    if (body.price !== undefined && body.price !== "") {
      const parsedPrice = Number(body.price);
      if (isNaN(parsedPrice)) {
        return res.status(400).json({ message: "Price must be a valid number" });
      }
      product.price = parsedPrice;
    }

    //  Handle image updates
    let finalImages: string[] = [];

    // Keep existing images (from formData)
    if (body["existingImages[]"]) {
      if (Array.isArray(body["existingImages[]"])) {
        finalImages = body["existingImages[]"];
      } else {
        finalImages = [body["existingImages[]"]];
      }
    }

    // Add new uploaded images
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      for (const file of req.files as Express.Multer.File[]) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "products" }
        );
        finalImages.push(result.secure_url);
      }
    }

    product.images = finalImages;

    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// -------------------- DELETE PRODUCT --------------------
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- GET PRODUCTS BY CATEGORY --------------------
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const products = await Product.find({ category });

    if (!products.length) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    res.json({ category, products });
  } catch (err) {
    console.error("Get products by category error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- SEARCH PRODUCTS --------------------
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { query, page = "1", limit = "10" } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Build regex for case-insensitive search
    const regex = new RegExp(query as string, "i");

    // Search by name or brand
    const filter: FilterQuery<IProduct> = {
      $or: [{ name: regex }, { brand: regex }],
    };

    const products = await Product.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalItems: total,
    });
  } catch (err) {
    console.error("Search products error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- GET PRODUCTS WITH FILTERS --------------------
export const filterProducts = async (req: Request, res: Response) => {
  try {
    const { category, brand, minPrice, maxPrice, page = "1", limit = "10" } = req.query;

    const filter: FilterQuery<IProduct> = {};

    // ✅ Category filter
    if (category) filter.category = category as string;

    // ✅ Brand filter
    if (brand) filter.brand = brand as string;

    // ✅ Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as any)["$gte"] = Number(minPrice);
      if (maxPrice) (filter.price as any)["$lte"] = Number(maxPrice);
    }

    // Pagination
    const products = await Product.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    // ✅ Distinct brands for selected category
    const distinctBrands = category
      ? await Product.find({ category }).distinct("brand")
      : await Product.distinct("brand");

    // ✅ Distinct categories (all)
    const distinctCategories = await Product.distinct("category");

    res.json({
      products,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalItems: total,
      distinctBrands,
      distinctCategories,
    });
  } catch (err) {
    console.error("Filter products error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- GET TOTAL PRODUCT COUNT (PUBLIC) --------------------
export const getTotalProductCount = async (req: Request, res: Response) => {
  try {
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      success: true,
      totalProducts,
      message: "Total product count fetched successfully",
    });
  } catch (err) {
    console.error("Get total product count error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
