"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecieverSocketId = void 0;
const userSocketMap = {};
const socketConfig = (io) => {
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (typeof userId === "string" &&
            userId !== "undefined" &&
            userId !== null) {
            userSocketMap[userId] = socket.id;
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        socket.on("disconnect", () => {
            if (typeof userId === "string" &&
                userId !== "undefined" &&
                userId !== null) {
                delete userSocketMap[userId];
            }
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });
};
const getRecieverSocketId = (reciever) => {
    return userSocketMap[reciever];
};
exports.getRecieverSocketId = getRecieverSocketId;
exports.default = socketConfig;
