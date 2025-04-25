import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role);
        localStorage.setItem('userId', result.user.id);

        // Redirect based on role
        if (result.role === 'patient') {
          navigate('/patient/dashboard');
        } else if (result.role === 'doctor') {
          navigate('/doctor/dashboard');
        }

        // Clear form
        setFormData({ email: '', password: '' });
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="login-container">
          <h2 className="login-title">Login to CureConnect</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="block text-gray-600 mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                placeholder="Your Email"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="block text-gray-600 mb-2 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                placeholder="Your Password"
                required
                disabled={isSubmitting}
              />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="signup-description">
            <p>Don't have an account? Sign up as a patient or doctor to join CureConnect.</p>
            <div className="signup-links">
              <a href="/signup/patient" className="text-blue-600 underline hover:text-blue-800">
                Patient Signup
              </a>
              <a href="/signup/doctor" className="text-blue-600 underline hover:text-blue-800">
                Doctor Signup
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;