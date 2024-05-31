"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRouter = () => {
    const router = express_1.default.Router();
    console.log('inside auth.ts');
    router.post('/signup', (req, res) => {
        console.log('hii');
        res.status(200).json({ message: 'success' });
    });
    return router;
};
exports.default = authRouter;
