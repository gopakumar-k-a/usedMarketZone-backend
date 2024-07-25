import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const userSocketMap: { [key: string]: string } = {};
const socketConfig = (io: Server) => {
  io.on(
    "connection",
    (
      socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
    ) => {
      console.log("a user connected", socket.id);
      const userId = socket.handshake.query.userId;
      if (
        typeof userId === "string" &&
        userId !== "undefined" &&
        userId !== null
      ) {
        console.log('in map adding process');
        
        userSocketMap[userId] = socket.id; // Assign socket.id to userSocketMap using userId as key
        console.log('user socket map ',userSocketMap);
        
      }



      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      //(socket.on)used to listen evnets on both front end and backend
      socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
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


export const getRecieverSocketId = (reciever:string) => {
  console.log('user socket map ',userSocketMap);
  
    return userSocketMap[reciever];
  };
  
export default socketConfig;
