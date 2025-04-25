const router = require("express").Router();
const Patient = require("../../models/Patient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ errors: { auth: "No token provided" } });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, email, role }
    if (req.user.role !== "patient") {
      return res.status(403).json({ errors: { auth: "Access denied" } });
    }
    next();
  } catch (err) {
    res.status(401).json({ errors: { auth: "Invalid token" } });
  }
};

// Patient Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select("-password");
    if (!patient) {
      return res.status(404).json({ errors: { server: "Patient not found" } });
    }
    res.json({ patient });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ errors: { server: "Server error", details: err.message } });
  }
});

// Patient Signup
router.post("/signup", async (req, res) => {
  try {
    console.log("Received req.body:", req.body);

    const {
      name, email, phone, dateOfBirth, gender, addressLine1, city,
      stateProvince, country, zipCode, height, weight, bloodGroup,
      allergies, medicalConditions, emergencyContactName, emergencyContactPhone,
      password, termsAgree
    } = req.body;

    const errors = {};
    if (!name) errors.name = "Full Name is required";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Valid Email is required";
    if (!phone || !/^\+?\d{10,15}$/.test(phone.replace(/\D/g, ''))) errors.phone = "Valid Phone Number is required";
    if (!dateOfBirth) errors.dateOfBirth = "Date of Birth is required";
    else if (new Date(dateOfBirth) > new Date()) errors.dateOfBirth = "Date of Birth cannot be in the future";
    if (!gender) errors.gender = "Gender is required";
    if (!addressLine1) errors.addressLine1 = "Address Line 1 is required";
    if (!city) errors.city = "City is required";
    if (!stateProvince) errors.stateProvince = "State/Province is required";
    if (!country) errors.country = "Country is required";
    if (!zipCode) errors.zipCode = "ZIP/Postal Code is required";
    if (!height) errors.height = "Height is required";
    if (!weight) errors.weight = "Weight is required";
    if (!bloodGroup || !["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(bloodGroup))
      errors.bloodGroup = "Valid Blood Group is required";
    if (!medicalConditions || !Array.isArray(medicalConditions) || medicalConditions.length === 0)
      errors.medicalConditions = "At least one medical condition must be selected";
    if (!emergencyContactName) errors.emergencyContactName = "Emergency Contact Name is required";
    if (!emergencyContactPhone || !/^\+?\d{10,15}$/.test(emergencyContactPhone.replace(/\D/g, '')))
      errors.emergencyContactPhone = "Valid Emergency Contact Phone is required";
    if (!password) errors.password = "Password is required";
    else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password))
      errors.password = "Password must be 8+ characters with letters, numbers, and symbols";
    if (termsAgree !== 'true') errors.termsAgree = "You must agree to the Terms and Privacy Policy";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const existingEmail = await Patient.findOne({ email });
    if (existingEmail) return res.status(400).json({ errors: { email: "Email already exists" } });

    const existingPhone = await Patient.findOne({ phone });
    if (existingPhone) return res.status(400).json({ errors: { phone: "Phone number already exists" } });

    const patient = await Patient.create({
      name,
      email,
      phone,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address: {
        addressLine1,
        city,
        stateProvince,
        country,
        zipCode
      },
      height,
      weight,
      bloodGroup,
      allergies: allergies || "",
      medicalConditions,
      emergencyContact: {
        name: emergencyContactName,
        phone: emergencyContactPhone
      },
      password,
      termsAgree: termsAgree === 'true'
    });

    res.status(201).json({ msg: "Signup successful", patient });
  } catch (err) {
    console.error("Signup error:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ errors: { [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` } });
    }
    res.status(500).json({ errors: { server: "Server error", details: err.message } });
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