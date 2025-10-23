import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { generateTokens } from "../utils/jwt-token";

// ---------------- REGISTER ----------------
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: role || "user" });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- LOGIN ----------------
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // JWT payload includes role
    const payload = { id: user._id, email: user.email, role: user.role };
    const { accessToken, refreshToken } = generateTokens(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- REFRESH TOKEN ----------------
export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
      id: string;
      email: string;
      role: "user" | "admin";
    };

    const { accessToken, refreshToken: newRefresh } = generateTokens(decoded);

    user.refreshToken = newRefresh;
    await user.save();

    res.json({ accessToken, refreshToken: newRefresh });
  } catch {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// ---------------- LOGOUT ----------------
export const logoutUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    // Clear the refresh token
    await User.findByIdAndUpdate(userId, { refreshToken: null });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ---------------- GET LOGGED-IN USER PROFILE ----------------
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id)
      return res.status(401).json({ message: "Unauthorized: No user found" });

    const user = await User.findById(req.user.id).select("-password -refreshToken");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ---------------- PUBLIC: TOTAL USERS + LIST (WITH FILTER & PAGINATION) ----------------
export const getAllUsersAndCount = async (req: Request, res: Response) => {
  try {
    // Parse query params
    const { filter = "all", page = "1", limit = "10" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const now = new Date();
    let dateFilter: any = {};

    switch (filter) {
      case "today":
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        dateFilter = { createdAt: { $gte: startOfDay } };
        break;

      case "7days":
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = { createdAt: { $gte: sevenDaysAgo } };
        break;

      case "30days":
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
        break;

      default:
        dateFilter = {}; // all
    }

    // Fetch total count (after filtering)
    const totalUsers = await User.countDocuments(dateFilter);

    // Fetch paginated users
    const users = await User.find(dateFilter)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      totalUsers,
      currentPage: pageNum,
      totalPages: Math.ceil(totalUsers / limitNum),
      usersPerPage: limitNum,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// /api/users/block/:id
export const toggleUserBlock = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Toggle blocked status
    user.blocked = !user.blocked;
    await user.save();

    res.status(200).json({
      message: `User has been ${user.blocked ? "blocked" : "unblocked"}`,
      blocked: user.blocked,
    });
  } catch (error) {
    console.error("Toggle block error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
