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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.getAddresses = exports.addAddress = void 0;
const address_model_1 = require("../models/address.model");
// ➕ Add new address
const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
            return res.status(400).json({ message: "User not authenticated" });
        const { name, number, street, town, city, state, pincode } = req.body;
        const address = new address_model_1.Address({
            user: req.user.id,
            name,
            number,
            street,
            town,
            city,
            state,
            pincode,
        });
        yield address.save();
        res.status(201).json({ message: "Address added successfully", address });
    }
    catch (error) {
        console.error("Add address error:", error);
        res.status(500).json({ message: "Failed to add address" });
    }
});
exports.addAddress = addAddress;
// 📦 Get all addresses for logged-in user
const getAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
            return res.status(400).json({ message: "User not authenticated" });
        const addresses = yield address_model_1.Address.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(addresses);
    }
    catch (error) {
        console.error("Get address error:", error);
        res.status(500).json({ message: "Failed to fetch addresses" });
    }
});
exports.getAddresses = getAddresses;
// ❌ Delete address
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
            return res.status(400).json({ message: "User not authenticated" });
        const { id } = req.params;
        const address = yield address_model_1.Address.findOneAndDelete({ _id: id, user: req.user.id });
        if (!address)
            return res.status(404).json({ message: "Address not found" });
        res.status(200).json({ message: "Address deleted successfully" });
    }
    catch (error) {
        console.error("Delete address error:", error);
        res.status(500).json({ message: "Failed to delete address" });
    }
});
exports.deleteAddress = deleteAddress;
