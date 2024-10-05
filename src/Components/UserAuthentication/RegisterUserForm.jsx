import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Box, Typography, Grid, Paper, MenuItem, CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterUserForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [emailId, setEmailId] = useState('');
  const [requestedRole, setRequestedRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDomain, setShowDomain] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://3.111.84.98:61002/roleAudit');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setErrorMessage('Failed to load roles. Please refresh the page.');
      }
    };
    fetchRoles();
  }, []);

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRequestedRole(selectedRole);
    setShowDomain(selectedRole === 'DOMAIN EXPERT');
    if (selectedRole !== 'DOMAIN EXPERT') {
      setDomain('');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        // Clear fields after successful registration
        setUsername('');
        setPassword('');
        setDomain('');
        setEmailId('');
        setRequestedRole('');
        setShowDomain(false);
        navigate('/');
      }
    } catch (error) {
      setErrorMessage('Error registering user. Please try again.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/'); // Navigate to the login page
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
            my: 4,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
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
              error={!username && !!errorMessage}
              helperText={!username && !!errorMessage ? 'Username is required' : ''}
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
              error={!password && !!errorMessage}
              helperText={!password && !!errorMessage ? 'Password is required' : ''}
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
              error={!requestedRole && !!errorMessage}
            >
              {roles
                .filter((role) => role.name !== 'EADMIN')
                .map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
            </TextField>

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
                error={!domain && requestedRole === 'DOMAIN EXPERT'}
                helperText={!domain && requestedRole === 'DOMAIN EXPERT' ? 'Domain is required' : ''}
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
              error={!emailId && !!errorMessage}
              helperText={!emailId && !!errorMessage ? 'Email ID is required' : ''}
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
              sx={{ mt: 2, mb: 1 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>

            <Button
              onClick={handleBackToLogin}
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
            >
              Back to Login
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RegisterUserForm;
