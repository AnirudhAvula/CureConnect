const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  dateOfBirth: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: "Date of Birth cannot be in the future"
    }
  },
  gender: { 
    type: String, 
    enum: ["Male", "Female", "Other", "Prefer not to say"], 
    required: true 
  },
  address: {
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
    stateProvince: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  height: { type: String, required: true }, // e.g., "5'7"" or "170 cm"
  weight: { type: String, required: true }, // e.g., "154 lbs" or "70 kg"
  bloodGroup: { 
    type: String, 
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], 
    required: true 
  },
  allergies: { type: String },
  medicalConditions: { 
    type: [String], 
    required: true,
    validate: {
      validator: function(array) {
        return array.length > 0;
      },
      message: "At least one medical condition must be selected"
    }
  },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true }
  },
  password: { type: String, required: true },
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
PatientSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("Patient", PatientSchema);