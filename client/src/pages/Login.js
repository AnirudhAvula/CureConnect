import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, role, user } = res.data;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      // Debug localStorage
      console.log("localStorage after login:", {
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
        user: JSON.parse(localStorage.getItem("user")),
      });

      // Redirect to respective dashboard
      if (role === "doctor") {
        console.log("Navigating to doctor dashboard");
        navigate("/doctor/dashboard", { replace: true });
      } else {
        console.log("Navigating to patient dashboard");
        navigate("/patient/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErr(error.response?.data?.message || "Login failed");
    }
  };

  // Debug navigation issues
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      console.log("User found in localStorage on render:", user);
      if (user.role === "doctor") {
        navigate("/doctor/dashboard", { replace: true });
      } else if (user.role === "patient") {
        navigate("/patient/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        {err && <p className="text-red-500">{err}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;