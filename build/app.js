"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("./frameworks/database/mongodb/connection"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const server_1 = __importDefault(require("./frameworks/webserver/server"));
const express_2 = __importDefault(require("./frameworks/webserver/express"));
const routes_1 = __importDefault(require("./frameworks/webserver/routes"));
const appError_1 = __importDefault(require("./utils/appError"));
const errorHandling_1 = __importDefault(require("./frameworks/webserver/middlewares/errorHandling"));
const socket_1 = __importDefault(require("./frameworks/webSocket/socket"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
(0, socket_1.default)(exports.io);
(0, connection_1.default)();
(0, express_2.default)(app);
(0, routes_1.default)(app);
app.use(errorHandling_1.default);
app.all("*", (req, res, next) => {
    next(new appError_1.default("Not found", 404));
});
(0, server_1.default)(server).startServer();
