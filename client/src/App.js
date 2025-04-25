import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PatientSignup from "./pages/PatientSignup";
import DoctorSignup from "./pages/DoctorSignup";
import Login from "./pages/Login";
import DoctorDashboard from "./components/DoctorDashboard";
import PatientDashboard from "./components/PatientDashboard";

function App() {
  const user = JSON.parse(localStorage.getItem("user")); // get from login response

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup/doctor" element={<DoctorSignup />} />
        <Route path="/signup/patient" element={<PatientSignup />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;