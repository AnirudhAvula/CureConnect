const jwt = require("jsonwebtoken");

module.exports = (io) => {
  // Store connected users (userId -> socketId)
  const connectedUsers = new Map();

  // Authenticate Socket.IO connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // Attach user data (id, name, role, etc.)
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id}, Role: ${socket.user.role}`);

    // Store connected user
    connectedUsers.set(socket.user.id, socket.id);
    // Broadcast user online status
    io.emit("userStatus", {
      userId: socket.user.id,
      role: socket.user.role,
      name: socket.user.name,
      online: true,
    });

    // Handle sending a message
    socket.on("sendMessage", ({ receiverId, content }) => {
      const message = {
        senderId: socket.user.id,
        senderName: socket.user.name,
        receiverId,
        content,
        timestamp: new Date().toISOString(),
      };

      // Send message to receiver (if online) and sender
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", message);
      }
      socket.emit("receiveMessage", message); // Echo back to sender for UI

      console.log(`Message from ${socket.user.name} to ${receiverId}: ${content}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      connectedUsers.delete(socket.user.id);
      io.emit("userStatus", {
        userId: socket.user.id,
        role: socket.user.role,
        name: socket.user.name,
        online: false,
      });
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });
};