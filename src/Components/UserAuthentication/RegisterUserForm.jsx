import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Box, Typography, Grid, Paper, MenuItem
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterUserForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [emailId, setEmailId] = useState('');
  const [requestedRole, setRequestedRole] = useState('');
  const [roles, setRoles] = useState([]); // State to store roles fetched from API
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDomain, setShowDomain] = useState(false); // State to toggle domain field
  const navigate = useNavigate();

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://3.111.84.98:61002/roleAudit'); // Replace with your actual endpoint
        setRoles(response.data); // Assuming API returns an array of roles
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  // Handle requested role change and show/hide domain field based on role selection
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRequestedRole(selectedRole);
    if (selectedRole === 'DOMAIN EXPERT') {
      setShowDomain(true);  // Show domain field if 'DOMAIN EXPERT' is selected
    } else {
      setShowDomain(false); // Hide domain field for other roles
      setDomain('');        // Clear domain field when it's hidden
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = { username, password, domain, emailId, requestedRole };

    try {
      const response = await axios.post('http://3.111.84.98:61002/self-service/submitRoleRequest', JSON.stringify(formData), {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 201) {
        setSuccessMessage('User registered successfully!');
        setErrorMessage('');
        setUsername('');
        setPassword('');
        setDomain('');
        setEmailId('');
        setRequestedRole('');
        navigate('/');
      }
    } catch (error) {
      setErrorMessage('Error registering user. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <Grid 
      container 
      component="main" 
      sx={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }} 
    >
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Register New User
          </Typography>
          <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="requestedRole"
              select
              label="Requested Role"
              name="requestedRole"
              value={requestedRole}
              onChange={handleRoleChange}
              helperText="Please select your role"
            >
              {roles
              .filter((role) => role.name !== 'EADMIN')
              .map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Conditionally show the Domain field if the role is 'DOMAIN EXPERT' */}
            {showDomain && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="domain"
                label="Domain"
                name="domain"
                autoComplete="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="emailId"
              label="Email ID"
              name="emailId"
              type="email"
              autoComplete="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />

            {successMessage && (
              <Typography color="success" variant="body2" sx={{ mt: 2 }}>
                {successMessage}
              </Typography>
            )}

            {errorMessage && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RegisterUserForm;
