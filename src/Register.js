import React, { useState } from 'react';
import './Register.css'; // Optional, for additional styling

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    requestedRole: 'PM' // Default value for requestedRole
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const { username, password } = formData;
    const newErrors = {};

    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      fetch('http://localhost:61002/self-service/submitRoleRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData)
      })
      .then(response => {
        if (response.ok) {
          setSuccess('Registration successful!');
          setFormData({
            username: '',
            password: '',
            requestedRole: 'PM'
          });
        } else {
          setSuccess('Registration failed. Please try again.');
        }
        return response.text();
      })
      .catch(error => {
        console.error('Error:', error);
        setSuccess('Registration failed. Please try again.');
      });
    }
  };

  return (
    <div className="Register">
      <h1>Register New User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div>
          <label htmlFor="requestedRole">Requested Role:</label>
          <select
            id="requestedRole"
            name="requestedRole"
            value={formData.requestedRole}
            onChange={handleChange}
          >
            <option value="PM">PM</option>
            <option value="DOMAIN EXPERT">DOMAIN EXPERT</option>
            <option value="TRUSTEE">TRUSTEE</option>
            <option value="CEO">CEO</option>
            <option value="AO">AO</option>
          </select>
        </div>
        <button type="submit">Register</button>
        {success && <p>{success}</p>}
      </form>
    </div>
  );
}

export default Register;
