import React, { useState, useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const DoctorDashboard = () => {
  const { messages, selectedUser, setSelectedUser, onlineUsers, sendMessage } =
    useContext(ChatContext);
  const [messageInput, setMessageInput] = useState("");

  // Get list of patients who messaged
  const patients = Object.keys(messages).map((userId) => ({
    _id: userId,
    name: onlineUsers[userId]?.name || "Unknown",
  }));

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedUser) {
      sendMessage(selectedUser._id, messageInput);
      setMessageInput("");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Patient List */}
      <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: "10px" }}>
        <h3>Patients</h3>
        {patients.map((patient) => (
          <div
            key={patient._id}
            onClick={() => setSelectedUser(patient)}
            style={{
              padding: "10px",
              cursor: "pointer",
              background: selectedUser?._id === patient._id ? "#e0e0e0" : "white",
            }}
          >
            {patient.name}
            <span style={{ color: onlineUsers[patient._id]?.online ? "green" : "red" }}>
              {onlineUsers[patient._id]?.online ? " Online" : " Offline"}
            </span>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div style={{ width: "70%", padding: "10px" }}>
        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser.name}</h3>
            <div style={{ height: "80%", overflowY: "scroll", border: "1px solid #ccc" }}>
              {(messages[selectedUser._id] || []).map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    textAlign: msg.senderId === selectedUser._id ? "left" : "right",
                    margin: "5px",
                  }}
                >
                  <p>
                    <strong>{msg.senderName}:</strong> {msg.content}
                  </p>
                  <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                </div>
              ))}
            </div>
            <div>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                style={{ width: "80%", padding: "5px" }}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a patient to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;