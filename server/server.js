const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
require("dotenv").config(); // Load env vars early

const app = express();
const server = http.createServer(app);

// Configure multer to handle text fields only (no files)
const upload = multer();

// Configure Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Validate that MONGO_URI exists
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in your .env file.");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(upload.none()); // Parse multipart/form-data text fields

// API Routes
app.use("/api/auth/doctor", require("./routes/auth/doctorAuth"));
app.use("/api/auth/patient", require("./routes/auth/patientAuth"));
app.use("/api/doctors", require("./routes/doctors"));
app.use("/api/auth", require("./routes/auth/commonLogin"));

// Socket Events
require("./socket/chat")(io);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));