const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  specialization: { type: String, required: true },
  password: { type: String, required: true }, // for login
}, { timestamps: true });

module.exports = mongoose.model("Doctor", DoctorSchema);
