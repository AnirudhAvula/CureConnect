const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Doctor = require("../../models/Doctor");
const Patient = require("../../models/Patient");

// Common Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

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
      { expiresIn: "1h" }
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
        ...(role === "doctor" && {
          specialization: user.specialization,
          gender: user.gender,
          age: user.age,
        }),
        ...(role === "patient" && {
          location: user.location,
          gender: user.gender,
          age: user.age,
        }),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
