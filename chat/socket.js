let io;
let userSocketMap = {};

export const initIO = (socketIO) => {
  io = socketIO;

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};
