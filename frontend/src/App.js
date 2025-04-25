import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./components/home_page/home.js";
import Login from "./components/login/login.js"
import Doctor_Signup from "./components/signup/doctor_signup.js"
import Patient_Signup from './components/signup/patient_signup.js';
import PatientDashboard from './components/patient_dashboard/parient_dashboard.js';
import DoctorDashboard from './components/doctor_dashboard/doctor_dashboard.js';
import "./styles.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
      <Routes>
        <Route path="/signup/doctor" element={<Doctor_Signup />} />
      </Routes>
      <Routes>
        <Route path="/signup/patient" element={<Patient_Signup />} />
      </Routes>
      <Routes>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
      </Routes>
      <Routes>
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
