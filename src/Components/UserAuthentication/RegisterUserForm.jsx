import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Box, Typography, Grid, Paper, MenuItem, CircularProgress, FormControl, InputLabel, Select, FormHelperText, Container, Alert
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getPublicVerticals, getPublicComponents, getStateDetails, getDistrictDetails } from '../DataCenter/apiService';
const RegisterUserForm = () => {
  const [states, setStates] = useState([]);
  const [district, setDistrict] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVertical, setSelectedVertical] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [emailId, setEmailId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [requestedRole, setRequestedRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDomain, setShowDomain] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [verticals, setVerticals] = useState([]);
  const [components, setComponents] = useState([

  ]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('https://projects.ekalavya.net/api/roleAudit');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setErrorMessage('Failed to load roles. Please refresh the page.');
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      const data = await getPublicVerticals();
      const updatedVerticals = Array.isArray(data) ? data : [];
      setVerticals(updatedVerticals);
      console.log(updatedVerticals); // Logs the updated value directly
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    async function fetchComponents() {
      const id = verticals.find(item => item.verticalName === selectedVertical)?.id;
      if (!selectedVertical) return;
      const data = await getPublicComponents(id);
      const updatedComponents = Array.isArray(data) ? data : [];
      setComponents(updatedComponents);
    }
    fetchComponents();
  }, [selectedVertical, verticals]);

  useEffect(() => {
    async function fetchStates() {
      const data = await getStateDetails();
      setStates(Array.isArray(data) ? data : []);
      console.log(states);
    }
    fetchStates();
  }, []);

  useEffect(() => {
    async function fetchDistricts() {
      if (!selectedState) return;
      const state = states.find(s => s.state_name === selectedState);
      if (state) {
        const data = await getDistrictDetails(state.state_id);
        setDistrict(Array.isArray(data) ? data : []);
      }
    }
    fetchDistricts();
  }, [selectedState, states]);

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
    
const formData = {
  username,
  password,
  vertical: selectedVertical,
  component: selectedComponent,
  emailId,
  mobileNumber,
  requestedRole,
  ...(requestedRole === 'TRUSTEE' && {
    state: selectedState,
    district: selectedDistrict,
  }),
};

    try {
      const response = await axios.post('https://projects.ekalavya.net/api/self-service/submitRoleRequest', JSON.stringify(formData), {
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
        setSelectedVertical('');
        setSelectedComponent('');
        setEmailId('');
        setMobileNumber('');
        setRequestedRole('');
        setShowDomain(false);
        navigate('/');
      }
    } catch (error) {
    const backendErrors = error.response?.data || 'Error registering user. Please try again.';
            if (typeof backendErrors === 'object' && backendErrors !== null) {
                const formattedErrors = Object.entries(backendErrors)
                    .map(([field, message]) => `${field}: ${message}`)
                    .join('\n');

                setErrorMessage(formattedErrors);
            } else {
                setErrorMessage(backendErrors);
            }
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
{requestedRole === 'TRUSTEE' && (
  <>
            <FormControl fullWidth margin="normal">
                <InputLabel>State</InputLabel>
                <Select
                  name="stateName"
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);

                  }}
                  required
                >
                  <MenuItem value="">Select State</MenuItem>
                  {states.map((state) => (
                    <MenuItem key={state.id} value={state.state_name} >
                      {state.state_name}
                    </MenuItem>
                  ))}
                </Select>

              </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>District</InputLabel>
                <Select
                  name="districtName"
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);

                  }}
                  required
                >
                  <MenuItem value="">Select District</MenuItem>
                  {district.map((district) => (
                    <MenuItem key={district.id} value={district.district_name} >
                      {district.district_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
  </>
)}
            {showDomain && (
              <>
                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  error={!selectedVertical && requestedRole === 'DOMAIN EXPERT'}
                >
                  <InputLabel id="vertical-label">Vertical</InputLabel>
                  <Select
                    labelId="vertical-label"
                    id="vertical"
                    value={selectedVertical}
                    onChange={(e) => setSelectedVertical(e.target.value)}
                    autoComplete="vertical"
                  >
                    {verticals.map((vertical) => (
                      <MenuItem key={vertical.id} value={vertical.verticalName}>
                        {vertical.verticalName}
                      </MenuItem>
                    ))}
                  </Select>
                  {!selectedVertical && requestedRole === 'DOMAIN EXPERT' && (
                    <FormHelperText>Vertical is required</FormHelperText>
                  )}
                </FormControl>

                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  error={!selectedComponent && requestedRole === 'DOMAIN EXPERT'}
                >
                  <InputLabel id="component-label">Component</InputLabel>
                  <Select
                    labelId="component-label"
                    id="component"
                    value={selectedComponent}
                    onChange={(e) => setSelectedComponent(e.target.value)}
                    autoComplete="component"
                  >
                    {components.map((component) => (
                      <MenuItem key={component.id} value={component.componentName}>
                        {component.componentName}
                      </MenuItem>
                    ))}
                  </Select>
                  {!selectedComponent && requestedRole === 'DOMAIN EXPERT' && (
                    <FormHelperText>Component is required</FormHelperText>
                  )}
                </FormControl>

              </>
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

            <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="mobileNumber"
                          label="Mobile Number"
                          name="mobileNumber"
                          type="number"
                          autoComplete="number"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          error={!mobileNumber && !!errorMessage}
                          helperText={!mobileNumber && !!errorMessage ? 'Mobile number is required' : ''}
                        />

            {successMessage && (
              <Typography color="success" variant="body2" sx={{ mt: 2 }}>
                {successMessage}
              </Typography>
            )}
                {errorMessage && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}
{/*             {errorMessage && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )} */}

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
