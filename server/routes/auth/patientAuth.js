const router = require("express").Router();
const Patient = require("../../models/Patient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Patient Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, age, gender, location, phone, email, password } = req.body;

    const existing = await Patient.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Patient already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const patient = await Patient.create({
      name, age, gender, location, phone, email, password: hashed
    });

    res.json({ msg: "Signup successful", patient });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Patient Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(400).json({ msg: "Patient not found" });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign({ id: patient._id, role: "patient" }, process.env.JWT_SECRET);
    res.json({ token, user: patient, role: "patient" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
