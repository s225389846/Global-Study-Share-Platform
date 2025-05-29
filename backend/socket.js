// backend/socket.js
let ioInstance;

module.exports = {
  init: (httpServer) => {
    ioInstance = require("socket.io")(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    ioInstance.on("connection", (socket) => {
      console.log("A user connected via WebSocket:", socket.id);
      socket.on("disconnect", () => {
        console.log("A user disconnected from WebSocket:", socket.id);
      });
     
    });

    return ioInstance;
  },
  getIo: () => {
    if (!ioInstance) {
      throw new Error("Socket.IO not initialized!");
    }
    return ioInstance;
  },
};