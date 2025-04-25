import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Backend URL

const ChatBox = ({ doctor, patient }) => {
  const [room, setRoom] = useState(`${doctor._id}_${patient._id}`);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    socket.emit("join_room", room);

    // Listen for messages from the server
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [room]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const sender = isDoctor ? doctor.name : patient.name;

    const data = {
      room,
      sender,
      message,
    };

    socket.emit("send_message", data);
    setMessages((prev) => [...prev, data]); // Add sent message to the UI
    setMessage(""); // Clear the input field
  };

  return (
    <div className="p-4 w-full max-w-md border rounded">
      <h2 className="text-lg font-bold mb-2">
        Chat with Dr. {doctor.name}
      </h2>
      <div className="h-64 overflow-y-auto border p-2 mb-2 bg-gray-50 rounded">
        {messages.map((msg, index) => (
          <div key={index} className="mb-1">
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow border p-2 rounded-l"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>

      {/* Toggle sender between doctor and patient */}
      <button
        className="mt-2 px-4 py-1 bg-gray-300 rounded"
        onClick={() => setIsDoctor(!isDoctor)}
      >
        {isDoctor ? "Switch to Patient" : "Switch to Doctor"}
      </button>
    </div>
  );
};

export default ChatBox;
