import React, { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });
    setSocket(newSocket);

    // Handle incoming messages
    newSocket.on("receiveMessage", (message) => {
      setMessages((prev) => ({
        ...prev,
        [message.senderId]: [...(prev[message.senderId] || []), message],
      }));
    });

    // Handle user status (online/offline)
    newSocket.on("userStatus", ({ userId, role, name, online }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: { role, name, online },
      }));
    });

    return () => newSocket.disconnect();
  }, []);

  const sendMessage = (receiverId, content) => {
    if (socket) {
      socket.emit("sendMessage", { receiverId, content });
    }
  };

  return (
    <ChatContext.Provider
      value={{ socket, messages, selectedUser, setSelectedUser, onlineUsers, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;