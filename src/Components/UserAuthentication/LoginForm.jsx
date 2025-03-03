import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginRedirect from './LoginRedirect';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = React.useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://projects.ekalavya.net/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('jwtToken', data.jwt);
        setToken(data.jwt);
        console.log('Login successful, JWT token:', data.jwt);
      } else {
        setErrorMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Grid container component="main" sx={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
              Please log in to your account
            </Typography>
            <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  backgroundColor: '#f9f9f9',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#ccc' },
                    '&:hover fieldset': { borderColor: '#333' },
                  },
                }}
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
                sx={{
                  backgroundColor: '#f9f9f9',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#ccc' },
                    '&:hover fieldset': { borderColor: '#333' },
                  },
                }}
              />
              {errorMessage && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {errorMessage}
                </Typography>
              )}
              <Box sx={{ position: 'relative', mt: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': { backgroundColor: '#115293' },
                    '&:disabled': { backgroundColor: '#ccc' },
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Login'}
                </Button>
              </Box>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ borderColor: '#1976d2', color: '#1976d2', '&:hover': { borderColor: '#115293' } }}
                    onClick={handleRegister}
                  >
                    Register
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ borderColor: '#1976d2', color: '#1976d2', '&:hover': { borderColor: '#115293' } }}
                    onClick={handleDashboard}
                  >
                    Dashboard
                  </Button>
                </Grid>
              </Grid>
              {token && <LoginRedirect token={token} />}
            </Box>
          </Box>
        </motion.div>
      </Grid>
    </Grid>
  );
};

export default LoginForm;