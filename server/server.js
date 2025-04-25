const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth/doctor", require("./routes/auth/doctorAuth"));
app.use("/api/auth/patient", require("./routes/auth/patientAuth"));
app.use("/api/doctors", require("./routes/doctors"));
app.use("/api/auth", require("./routes/auth/commonLogin"));


// Socket Events
require("./socket/chat")(io);



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
