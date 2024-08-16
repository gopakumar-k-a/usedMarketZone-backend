"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookieParser = require("cookie-parser");
const config_1 = __importDefault(require("../../config"));
const expressConfig = (app) => {
    const corsOptions = {
        origin: config_1.default.CLIENT_URL,
        optionsSuccessStatus: 200,
        credentials: true,
    };
    app.use(cookieParser());
    app.use((0, cors_1.default)(corsOptions));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
};
exports.default = expressConfig;
