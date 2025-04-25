import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css'; // Reuse updated signup CSS

function PatientSignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    addressLine1: '',
    city: '',
    stateProvince: '',
    country: '',
    zipCode: '',
    height: '',
    weight: '',
    bloodGroup: '',
    allergies: '',
    medicalConditions: [],
    emergencyContactName: '',
    emergencyContactPhone: '',
    password: '',
    confirmPassword: '',
    termsAgree: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allergyPlaceholder, setAllergyPlaceholder] = useState('Penicillin, Peanuts, Latex');
  const navigate = useNavigate();

  // Dynamic placeholder for allergies
  useEffect(() => {
    const placeholders = [
      'Penicillin, Peanuts, Latex',
      'Shellfish, Dust, Pollen',
      'Aspirin, Soy, Gluten',
      'Latex, Eggs, Mold',
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % placeholders.length;
      setAllergyPlaceholder(placeholders[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked, name } = e.target;
    if (type === 'checkbox' && name === 'medicalConditions') {
      setFormData({
        ...formData,
        medicalConditions: checked
          ? [...formData.medicalConditions, value]
          : formData.medicalConditions.filter((condition) => condition !== value),
      });
    } else {
      setFormData({
        ...formData,
        [id]: type === 'checkbox' ? checked : value,
      });
    }

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
    if (!formData.name) newErrors.name = 'Full Name is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Valid Email is required';
    if (!formData.phone || !/^\+?\d{10,15}$/.test(formData.phone.replace(/\D/g, '')))
      newErrors.phone = 'Valid Phone Number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    else if (new Date(formData.dateOfBirth) > new Date())
      newErrors.dateOfBirth = 'Date of Birth cannot be in the future';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.addressLine1) newErrors.addressLine1 = 'Address Line 1 is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.stateProvince) newErrors.stateProvince = 'State/Province is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP/Postal Code is required';
    if (!formData.height) newErrors.height = 'Height is required';
    if (!formData.weight) newErrors.weight = 'Weight is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood Group is required';
    if (formData.medicalConditions.length === 0)
      newErrors.medicalConditions = 'At least one medical condition must be selected';
    if (!formData.emergencyContactName) newErrors.emergencyContactName = 'Emergency Contact Name is required';
    if (!formData.emergencyContactPhone || !/^\+?\d{10,15}$/.test(formData.emergencyContactPhone.replace(/\D/g, '')))
      newErrors.emergencyContactPhone = 'Valid Emergency Contact Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password))
      newErrors.password = 'Password must be 8+ characters with letters, numbers, and symbols';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
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
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('dateOfBirth', formData.dateOfBirth);
      data.append('gender', formData.gender);
      data.append('addressLine1', formData.addressLine1);
      data.append('city', formData.city);
      data.append('stateProvince', formData.stateProvince);
      data.append('country', formData.country);
      data.append('zipCode', formData.zipCode);
      data.append('height', formData.height);
      data.append('weight', formData.weight);
      data.append('bloodGroup', formData.bloodGroup);
      data.append('allergies', formData.allergies);
      formData.medicalConditions.forEach((condition) => data.append('medicalConditions[]', condition));
      data.append('emergencyContactName', formData.emergencyContactName);
      data.append('emergencyContactPhone', formData.emergencyContactPhone);
      data.append('password', formData.password);
      data.append('termsAgree', formData.termsAgree);

      const response = await fetch('http://localhost:5000/api/auth/patient/signup', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Patient sign-up successful! You will receive an email upon approval.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          addressLine1: '',
          city: '',
          stateProvince: '',
          country: '',
          zipCode: '',
          height: '',
          weight: '',
          bloodGroup: '',
          allergies: '',
          medicalConditions: [],
          emergencyContactName: '',
          emergencyContactPhone: '',
          password: '',
          confirmPassword: '',
          termsAgree: false,
        });
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
    <section id="patient-signup" className="py-20 bg-gray-100">
      <div className="signup-container">
        <div className="logo-container">
          <div className="logo">
            Cure<span>Connect</span>
          </div>
        </div>
        <div className="card">
          <h2 className="signup-title">Patient Sign Up</h2>
          <div className="subtitle">
            Join CureConnect to manage your healthcare appointments and records
          </div>
          {errors.server && <p className="error-message server-error">{errors.server}</p>}
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="section-title">Personal Information</div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="required">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="error-message">{errors.name}</p>}
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
                  <label htmlFor="dateOfBirth" className="required">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.dateOfBirth && <p className="error-message">{errors.dateOfBirth}</p>}
                </div>
              </div>
              <div className="form-row">
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
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.gender && <p className="error-message">{errors.gender}</p>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">Address</div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="addressLine1" className="required">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.addressLine1 && <p className="error-message">{errors.addressLine1}</p>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city" className="required">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.city && <p className="error-message">{errors.city}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="stateProvince" className="required">
                    State/Province
                  </label>
                  <input
                    type="text"
                    id="stateProvince"
                    value={formData.stateProvince}
                    onChange={handleChange}
                    placeholder="Enter your state/province"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.stateProvince && <p className="error-message">{errors.stateProvince}</p>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country" className="required">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter your country"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.country && <p className="error-message">{errors.country}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode" className="required">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Enter your ZIP/postal code"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.zipCode && <p className="error-message">{errors.zipCode}</p>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">Medical Information</div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="height" className="required">
                    Height
                  </label>
                  <input
                    type="text"
                    id="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="e.g., 5'7"
                    disabled={isSubmitting}
                  />
                  {errors.height && <p className="error-message">{errors.height}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="weight" className="required">
                    Weight
                  </label>
                  <input
                    type="text"
                    id="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="e.g., 154 lbs or 70 kg"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.weight && <p className="error-message">{errors.weight}</p>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bloodGroup" className="required">
                    Blood Group
                  </label>
                  <select
                    id="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    aria-required="true"
                    disabled={isSubmitting}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  {errors.bloodGroup && <p className="error-message">{errors.bloodGroup}</p>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="allergies">Allergies</label>
                  <textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder={allergyPlaceholder}
                    rows="4"
                    className={`allergies-textarea ${formData.allergies ? 'filled' : ''}`}
                    disabled={isSubmitting}
                  />
                  <div className="help-text">
                    List any allergies (e.g., medications, foods, environmental). Separate multiple allergies with commas.
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label className="required">Medical Conditions</label>
                  <div className="checkbox-group">
                    {['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'None'].map((condition) => (
                      <label key={condition} className="checkbox-label">
                        <input
                          type="checkbox"
                          name="medicalConditions"
                          value={condition}
                          checked={formData.medicalConditions.includes(condition)}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        {condition}
                      </label>
                    ))}
                  </div>
                  {errors.medicalConditions && <p className="error-message">{errors.medicalConditions}</p>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">Emergency Contact</div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emergencyContactName" className="required">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    placeholder="Enter contact name"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.emergencyContactName && <p className="error-message">{errors.emergencyContactName}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="emergencyContactPhone" className="required">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactPhone"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    placeholder="(123) 456-7890"
                    aria-required="true"
                    disabled={isSubmitting}
                  />
                  {errors.emergencyContactPhone && <p className="error-message">{errors.emergencyContactPhone}</p>}
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
          Already registered? <a href="/login">Log in to Patient Portal</a>
        </div>
        <div className="footer">
          © 2025 CureConnect Health Systems. All rights reserved.<br />
          <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Contact Support</a>
        </div>
      </div>
    </section>
  );
}

export default PatientSignUp;