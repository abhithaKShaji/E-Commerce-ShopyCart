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
exports.toggleUserBlock = exports.getAllUsersAndCount = exports.getUserProfile = exports.logoutUser = exports.refreshAccessToken = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const jwt_token_1 = require("../utils/jwt-token");
// ---------------- REGISTER ----------------
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ message: "All fields are required" });
    try {
        const existingUser = yield user_model_1.User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already registered" });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new user_model_1.User({ name, email, password: hashedPassword, role: role || "user" });
        yield user.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.registerUser = registerUser;
// ---------------- LOGIN ----------------
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });
    try {
        const user = yield user_model_1.User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });
        // JWT payload includes role
        const payload = { id: user._id, email: user.email, role: user.role };
        const { accessToken, refreshToken } = (0, jwt_token_1.generateTokens)(payload);
        user.refreshToken = refreshToken;
        yield user.save();
        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.loginUser = loginUser;
// ---------------- REFRESH TOKEN ----------------
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(401).json({ message: "Refresh token required" });
    try {
        const user = yield user_model_1.User.findOne({ refreshToken });
        if (!user)
            return res.status(403).json({ message: "Invalid refresh token" });
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const { accessToken, refreshToken: newRefresh } = (0, jwt_token_1.generateTokens)(decoded);
        user.refreshToken = newRefresh;
        yield user.save();
        res.json({ accessToken, refreshToken: newRefresh });
    }
    catch (_a) {
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
});
exports.refreshAccessToken = refreshAccessToken;
// ---------------- LOGOUT ----------------
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }
        // Clear the refresh token
        yield user_model_1.User.findByIdAndUpdate(userId, { refreshToken: null });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.logoutUser = logoutUser;
// ---------------- GET LOGGED-IN USER PROFILE ----------------
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
            return res.status(401).json({ message: "Unauthorized: No user found" });
        const user = yield user_model_1.User.findById(req.user.id).select("-password -refreshToken");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json({
            message: "Profile fetched successfully",
            user,
        });
    }
    catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserProfile = getUserProfile;
// ---------------- PUBLIC: TOTAL USERS + LIST (WITH FILTER & PAGINATION) ----------------
const getAllUsersAndCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse query params
        const { filter = "all", page = "1", limit = "10" } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        // Build filter
        const now = new Date();
        let dateFilter = {};
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
        const totalUsers = yield user_model_1.User.countDocuments(dateFilter);
        // Fetch paginated users
        const users = yield user_model_1.User.find(dateFilter)
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
    }
    catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.getAllUsersAndCount = getAllUsersAndCount;
// /api/users/block/:id
const toggleUserBlock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // Toggle blocked status
        user.blocked = !user.blocked;
        yield user.save();
        res.status(200).json({
            message: `User has been ${user.blocked ? "blocked" : "unblocked"}`,
            blocked: user.blocked,
        });
    }
    catch (error) {
        console.error("Toggle block error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.toggleUserBlock = toggleUserBlock;
