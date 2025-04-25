import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ChatContext } from "../context/ChatContext";

const PatientDashboard = () => {
  const { messages, selectedUser, setSelectedUser, onlineUsers, sendMessage } =
    useContext(ChatContext);
  const [doctors, setDoctors] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/doctors", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedUser) {
      sendMessage(selectedUser._id, messageInput);
      setMessageInput("");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Doctor List */}
      <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: "10px" }}>
        <h3>Doctors</h3>
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            onClick={() => setSelectedUser(doctor)}
            style={{
              padding: "10px",
              cursor: "pointer",
              background: selectedUser?._id === doctor._id ? "#e0e0e0" : "white",
            }}
          >
            {doctor.name} ({doctor.specialization})
            <span style={{ color: onlineUsers[doctor._id]?.online ? "green" : "red" }}>
              {onlineUsers[doctor._id]?.online ? " Online" : " Offline"}
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
          <p>Select a doctor to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;