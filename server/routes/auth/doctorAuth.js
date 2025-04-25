const router = require("express").Router();
const Doctor = require("../../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only PDF, JPG, and PNG files are allowed'));
    }
    cb(null, true);
  },
});

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ errors: { auth: "No token provided" } });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, email, role }
    if (req.user.role !== "doctor") {
      return res.status(403).json({ errors: { auth: "Access denied" } });
    }
    next();
  } catch (err) {
    res.status(401).json({ errors: { auth: "Invalid token" } });
  }
};

// Doctor Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select("-password");
    if (!doctor) {
      return res.status(404).json({ errors: { server: "Doctor not found" } });
    }
    res.json({ doctor });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ errors: { server: "Server error", details: err.message } });
  }
});

// Doctor Signup
router.post("/signup", upload.fields([
  { name: 'licenseCertificate', maxCount: 1 },
  { name: 'governmentId', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      name, email, phone, gender, password, specialization,
      licenseNumber, issuingAuthority, yearsOfExperience, termsAgree
    } = req.body;

    // Validate required fields
    const errors = {};
    if (!name) errors.name = "Full Name is required";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Valid Email is required";
    if (!phone || !/^\+?\d{10,15}$/.test(phone.replace(/\D/g, ''))) errors.phone = "Valid Phone Number is required";
    if (!gender) errors.gender = "Gender is required";
    if (!password) errors.password = "Password is required";
    if (!specialization) errors.specialization = "Specialization is required";
    if (!licenseNumber) errors.licenseNumber = "Medical License Number is required";
    if (!issuingAuthority) errors.issuingAuthority = "Issuing Authority is required";
    if (!yearsOfExperience || yearsOfExperience < 0) errors.yearsOfExperience = "Valid Years of Experience is required";
    if (termsAgree !== 'true') errors.termsAgree = "You must agree to the Terms and Privacy Policy";
    if (!req.files['licenseCertificate']) errors.licenseCertificate = "Medical License Certificate is required";
    if (!req.files['governmentId']) errors.governmentId = "Government-issued ID is required";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Check for existing doctor
    const existingEmail = await Doctor.findOne({ email });
    if (existingEmail) return res.status(400).json({ errors: { email: "Email already exists" } });

    const existingPhone = await Doctor.findOne({ phone });
    if (existingPhone) return res.status(400).json({ errors: { phone: "Phone number already exists" } });

    const existingLicense = await Doctor.findOne({ licenseNumber });
    if (existingLicense) return res.status(400).json({ errors: { licenseNumber: "License number already exists" } });

    // Store file names as placeholder URLs to satisfy schema
    const licenseCertificate = `http://localhost/files/license-${req.files['licenseCertificate'][0].originalname}`;
    const governmentId = `http://localhost/files/gov-id-${req.files['governmentId'][0].originalname}`;

    // Create doctor
    const doctor = await Doctor.create({
      name,
      email,
      phone,
      gender,
      password, // Will be hashed by schema's pre('save') hook
      specialization,
      licenseNumber,
      issuingAuthority,
      yearsOfExperience: Number(yearsOfExperience),
      licenseCertificate,
      governmentId,
      termsAgree: termsAgree === 'true'
    });

    res.status(201).json({ msg: "Signup successful", doctor });
  } catch (err) {
    console.error("Signup error:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ errors: { [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` } });
    }
    res.status(500).json({ errors: { server: "Server error", details: err.message } });
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