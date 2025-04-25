const router = require("express").Router();
const Doctor = require("../../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Doctor Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, age, gender, phone, email, specialization, password } = req.body;

    const existing = await Doctor.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Doctor already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({
      name, age, gender, phone, email, specialization, password: hashed
    });

    res.json({ msg: "Signup successful", doctor });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Doctor Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ msg: "Doctor not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign({ id: doctor._id, role: "doctor" }, process.env.JWT_SECRET);
    res.json({ token, user: doctor, role: "doctor" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
