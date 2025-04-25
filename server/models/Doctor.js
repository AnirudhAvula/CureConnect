const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  gender: { 
    type: String, 
    enum: ["Male", "Female", "Non-binary", "Prefer not to say"], 
    required: true 
  },
  password: { type: String, required: true },
  specialization: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  issuingAuthority: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true, min: 0 },
  licenseCertificate: { type: String, required: true }, // URL or path to uploaded file
  governmentId: { type: String, required: true }, // URL or path to uploaded file
  termsAgree: { 
    type: Boolean, 
    required: true,
    validate: {
      validator: value => value === true,
      message: "You must agree to the Terms and Privacy Policy"
    }
  }
}, { timestamps: true });

// Hash password before saving
DoctorSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("Doctor", DoctorSchema);