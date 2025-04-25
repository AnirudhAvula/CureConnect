import React, { useState } from "react";
import axios from "axios";

const DoctorSignup = () => {
  const [form, setForm] = useState({
    name: "", age: "", gender: "", phone: "", email: "", specialization: "", password: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/doctor/signup", form);
      alert("Signup successful. Please login.");
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Doctor Signup</h2>
      {["name", "age", "gender", "phone", "email", "specialization", "password"].map((field) => (
        <input
          key={field}
          type={field === "password" ? "password" : "text"}
          name={field}
          placeholder={field[0].toUpperCase() + field.slice(1)}
          value={form[field]}
          onChange={handleChange}
          required
        />
      ))}
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default DoctorSignup;
