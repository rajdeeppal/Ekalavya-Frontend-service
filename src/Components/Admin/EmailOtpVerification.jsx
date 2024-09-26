import React, { useState } from 'react';
import axios from 'axios';
import { Container, Grid, TextField, Button, Typography, useMediaQuery, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const EmailOtpVerification = () => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for spinner
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Mobile responsive check

  // Handle form submission to request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner

    try {
      const response = await axios.post('http://3.111.84.98:61002/admin/sendOtp', { username });
      setIsOtpSent(true);
      setMessage('OTP has been sent to your email.');
    } catch (error) {
      setMessage('Error sending OTP. Please try again.');
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://3.111.84.98:61002/admin/validateOtp', { username, otp });
      console.log(response);
      if (response.data === 'Otp Validated Successfully!') {
        setMessage('OTP verified successfully!');
        // Redirect to the desired page (e.g., admin dashboard)
        navigate('/adminDashboard');
      } else {
        window.alert('Invalid OTP. Please try again.'); // Show alert popup
        setOtp(''); // Clear OTP input field
        setMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      window.alert('Error verifying OTP. Please login again.');
      setMessage('Error verifying OTP. Please try again.');
      localStorage.removeItem('jwtToken'); // Remove JWT token from localStorage
      navigate('/'); // Redirect to the login page
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant={isMobile ? 'h5' : 'h4'} align="center" gutterBottom>
        OTP Verification
      </Typography>
      {!isOtpSent ? (
        <form onSubmit={handleRequestOtp}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                type="text"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading} // Disable button while loading
              >
                {loading ? <CircularProgress size={24} /> : 'Request OTP'} {/* Show spinner when loading */}
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" align="center" gutterBottom>
                Enter the OTP sent to the email associated with {username}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="OTP"
                variant="outlined"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                type="text"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Verify OTP
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
      {message && (
        <Typography
          variant="body1"
          color={message.includes('Error') ? 'error' : 'primary'}
          align="center"
          style={{ marginTop: '20px' }}
        >
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default EmailOtpVerification;
