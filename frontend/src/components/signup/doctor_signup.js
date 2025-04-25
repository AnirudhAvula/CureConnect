import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    licenseNumber: '',
    issuingAuthority: '',
    yearsExperience: '',
    licenseCertificate: null,
    governmentId: null,
    termsAgree: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, files, type, checked } = e.target;
    if (type === 'file' && files[0]) {
      // Validate file size (5MB limit)
      if (files[0].size > 5 * 1024 * 1024) {
        setErrors({ ...errors, [id]: 'File size must be less than 5MB' });
        return;
      }
    }
    setFormData({
      ...formData,
      [id]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value,
    });

    // Real-time password matching and strength
    if (id === 'password') {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      setErrors({
        ...errors,
        password: value && !passwordRegex.test(value) ? 'Password must be 8+ characters with letters, numbers, and symbols' : '',
        confirmPassword: value !== formData.confirmPassword ? 'Passwords do not match' : '',
      });
    } else if (id === 'confirmPassword') {
      setErrors({
        ...errors,
        confirmPassword: formData.password !== value ? 'Passwords do not match' : '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Valid Email is required';
    if (!formData.phone || !/^\+?\d{10,15}$/.test(formData.phone.replace(/\D/g, '')))
      newErrors.phone = 'Valid Phone Number is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password))
      newErrors.password = 'Password must be 8+ characters with letters, numbers, and symbols';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.licenseNumber) newErrors.licenseNumber = 'Medical License Number is required';
    if (!formData.issuingAuthority) newErrors.issuingAuthority = 'Issuing Authority is required';
    if (!formData.yearsExperience || formData.yearsExperience < 0)
      newErrors.yearsExperience = 'Valid Years of Experience is required';
    if (!formData.licenseCertificate) newErrors.licenseCertificate = 'Medical License Certificate is required';
    if (!formData.governmentId) newErrors.governmentId = 'Government-issued ID is required';
    if (!formData.termsAgree) newErrors.termsAgree = 'You must agree to the Terms and Privacy Policy';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const data = new FormData();
      data.append('name', formData.fullName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('gender', formData.gender);
      data.append('password', formData.password);
      data.append('specialization', formData.specialization);
      data.append('licenseNumber', formData.licenseNumber);
      data.append('issuingAuthority', formData.issuingAuthority);
      data.append('yearsOfExperience', formData.yearsExperience);
      data.append('licenseCertificate', formData.licenseCertificate);
      data.append('governmentId', formData.governmentId);
      data.append('termsAgree', formData.termsAgree);

      const response = await fetch('http://localhost:5000/api/auth/doctor/signup', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Sign-up successful! You will receive an email upon approval.');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          gender: '',
          password: '',
          confirmPassword: '',
          specialization: '',
          licenseNumber: '',
          issuingAuthority: '',
          yearsExperience: '',
          licenseCertificate: null,
          governmentId: null,
          termsAgree: false,
        });
        // Clear file inputs
        document.getElementById('licenseCertificate').value = '';
        document.getElementById('governmentId').value = '';
        navigate('/login');
      } else {
        setErrors(result.errors || { server: result.msg || 'Sign-up failed' });
      }
    } catch (error) {
      setErrors({ server: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="signup" className="py-20 bg-gray-100">
      <div className="signup-container">
        <div className="logo-container">
          <div className="logo">
            Cure<span>Connect</span>
          </div>
        </div>
        <div className="card">
          <h2 className="signup-title">Doctor Sign Up</h2>
          <div className="subtitle">
            Join CureConnect to streamline patient scheduling and care
          </div>
          {errors.server && <p className="error-message server-error">{errors.server}</p>}
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="section-title">Personal Information</div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName" className="required">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.fullName && <p className="error-message">{errors.fullName}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="required">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone" className="required">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(123) 456-7890"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.phone && <p className="error-message">{errors.phone}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="gender" className="required">
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    aria-required="true"
                    disabled={isSubmitting}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.gender && <p className="error-message">{errors.gender}</p>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">Professional Information</div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="specialization" className="required">
                    Specialization
                  </label>
                  <select
                    id="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    aria-required="true"
                    disabled={isSubmitting}
                  >
                    <option value="">Select Specialization</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Orthopedist">Orthopedist</option>
                  </select>
                  {errors.specialization && <p className="error-message">{errors.specialization}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="licenseNumber" className="required">
                    Medical License Number
                  </label>
                  <input
                    type="text"
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="Enter your license number"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.licenseNumber && <p className="error-message">{errors.licenseNumber}</p>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="issuingAuthority" className="required">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    id="issuingAuthority"
                    value={formData.issuingAuthority}
                    onChange={handleChange}
                    placeholder="Enter issuing authority"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.issuingAuthority && <p className="error-message">{errors.issuingAuthority}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="yearsExperience" className="required">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={handleChange}
                    min="0"
                    placeholder="Enter years of experience"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.yearsExperience && <p className="error-message">{errors.yearsExperience}</p>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">Documentation</div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="licenseCertificate" className="required">
                    Medical License Certificate
                  </label>
                  <input
                    type="file"
                    id="licenseCertificate"
                    onChange={handleChange}
                    accept=".pdf,.jpg,.png"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  <div className="file-upload-label">Upload PDF, JPG, or PNG (max 5MB)</div>
                  {errors.licenseCertificate && <p className="error-message">{errors.licenseCertificate}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="governmentId" className="required">
                    Government-issued ID
                  </label>
                  <input
                    type="file"
                    id="governmentId"
                    onChange={handleChange}
                    accept=".pdf,.jpg,.png"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  <div className="file-upload-label">Upload PDF, JPG, or PNG (max 5MB)</div>
                  {errors.governmentId && <p className="error-message">{errors.governmentId}</p>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">Account Security</div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password" className="required">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.password && <p className="error-message">{errors.password}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="required">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="termsAgree"
                  checked={formData.termsAgree}
                  onChange={handleChange}
                  aria-required="true"
                  disabled={isSubmitting}
                />
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
              {errors.termsAgree && <p className="error-message">{errors.termsAgree}</p>}
            </div>

            <div className="privacy-notice">
              Your information will be verified within 2-3 business days. You will receive an email upon approval.
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Sign Up'}
            </button>
          </form>
        </div>
        <div className="login-link">
          Already registered? <a href="/login">Log in to Provider Portal</a>
        </div>
        <div className="footer">
          © 2025 CureConnect Health Systems. All rights reserved.<br />
          <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Contact Support</a>
        </div>
      </div>
    </section>
  );
}

export default SignUp;