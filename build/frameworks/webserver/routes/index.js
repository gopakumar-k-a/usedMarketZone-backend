"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwtUserTokenVerifyMiddleware_1 = __importDefault(require("../middlewares/jwtUserTokenVerifyMiddleware"));
const jwtAdminTokenVerify_1 = __importDefault(require("../middlewares/jwtAdminTokenVerify"));
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const admin_1 = __importDefault(require("./admin"));
const product_1 = __importDefault(require("./product"));
const bid_1 = __importDefault(require("./bid"));
const message_1 = __importDefault(require("./message"));
const payment_1 = __importDefault(require("./payment"));
const routes = (app) => {
    app.use("/api/auth", (0, auth_1.default)());
    app.use("/api/user", jwtUserTokenVerifyMiddleware_1.default, (0, user_1.default)());
    app.use("/api/admin", jwtAdminTokenVerify_1.default, (0, admin_1.default)());
    app.use("/api/product", jwtUserTokenVerifyMiddleware_1.default, (0, product_1.default)());
    app.use("/api/bid", jwtUserTokenVerifyMiddleware_1.default, (0, bid_1.default)());
    app.use("/api/message", jwtUserTokenVerifyMiddleware_1.default, (0, message_1.default)());
    app.use("/api/payment", jwtUserTokenVerifyMiddleware_1.default, (0, payment_1.default)());
};
exports.default = routes;
