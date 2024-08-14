import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const userSocketMap: { [key: string]: string } = {};
const socketConfig = (io: Server) => {
  io.on(
    "connection",
    (
      socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
    ) => {
      const userId = socket.handshake.query.userId;
      if (
        typeof userId === "string" &&
        userId !== "undefined" &&
        userId !== null
      ) {
        userSocketMap[userId] = socket.id;
      }

      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      socket.on("disconnect", () => {
        if (
          typeof userId === "string" &&
          userId !== "undefined" &&
          userId !== null
        ) {
          delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      });
    }
  );
};

export const getRecieverSocketId = (reciever: string) => {
  return userSocketMap[reciever];
};

export default socketConfig;
