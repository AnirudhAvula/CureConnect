import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PatientSignup from "./pages/PatientSignup";
import DoctorSignup from "./pages/DoctorSignup";
import Login from "./pages/Login";
import DoctorDashboard from "./components/DoctorDashboard";
import PatientDashboard from "./components/PatientDashboard";

// ProtectedRoute component to guard dashboard routes
const ProtectedRoute = ({ children, allowedRole }) => {
  let user;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    console.error("Error parsing user from localStorage:", e);
    user = null;
  }

  console.log("ProtectedRoute check:", { user, allowedRole });

  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role?.toLowerCase() !== allowedRole.toLowerCase()) {
    console.log(`Role mismatch: user.role=${user.role}, allowedRole=${allowedRole}`);
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup/doctor" element={<DoctorSignup />} />
      <Route path="/signup/patient" element={<PatientSignup />} />
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      {/* Redirect unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;