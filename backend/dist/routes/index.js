"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressRoute = exports.orderRoute = exports.checkoutRoute = exports.cartRoute = exports.productRoute = exports.authRoute = void 0;
var auth_route_1 = require("./auth.route");
Object.defineProperty(exports, "authRoute", { enumerable: true, get: function () { return __importDefault(auth_route_1).default; } });
var products_route_1 = require("./products.route");
Object.defineProperty(exports, "productRoute", { enumerable: true, get: function () { return __importDefault(products_route_1).default; } });
var cart_route_1 = require("./cart.route");
Object.defineProperty(exports, "cartRoute", { enumerable: true, get: function () { return __importDefault(cart_route_1).default; } });
var checkout_route_1 = require("./checkout.route");
Object.defineProperty(exports, "checkoutRoute", { enumerable: true, get: function () { return __importDefault(checkout_route_1).default; } });
var order_route_1 = require("./order.route");
Object.defineProperty(exports, "orderRoute", { enumerable: true, get: function () { return __importDefault(order_route_1).default; } });
var address_route_1 = require("./address.route");
Object.defineProperty(exports, "addressRoute", { enumerable: true, get: function () { return __importDefault(address_route_1).default; } });
