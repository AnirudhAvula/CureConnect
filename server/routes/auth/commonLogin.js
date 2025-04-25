const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../../models/Patient");
const Doctor = require("../../models/Doctor");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    let user = await Patient.findOne({ email });
    let role = "patient";

    if (!user) {
      user = await Doctor.findOne({ email });
      role = "doctor";
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role,
        ...(role === "doctor" && {
          specialization: user.specialization,
          licenseNumber: user.licenseNumber,
          issuingAuthority: user.issuingAuthority,
          yearsOfExperience: user.yearsOfExperience
        }),
        ...(role === "patient" && {
          dateOfBirth: user.dateOfBirth,
          address: user.address,
          height: user.height,
          weight: user.weight,
          bloodGroup: user.bloodGroup,
          medicalConditions: user.medicalConditions,
          emergencyContact: user.emergencyContact
        })
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;