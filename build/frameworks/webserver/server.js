"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const serverConfig = (server) => {
    return {
        startServer: () => {
            const PORT = config_1.default.PORT;
            server.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }
    };
};
exports.default = serverConfig;
