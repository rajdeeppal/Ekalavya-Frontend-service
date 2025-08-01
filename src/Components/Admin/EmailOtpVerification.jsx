import React, { useState } from 'react';
import axios from 'axios';
import { Container, Grid, TextField, Button, Typography, useMediaQuery, CircularProgress, Modal, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const EmailOtpVerification = ({ username }) => {
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for spinner
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Mobile responsive check

  const successColor = theme.palette.success.main;
  const errorColor = theme.palette.error.main;
   const [loginMethod, setLoginMethod] = useState('email');

  // Handle form submission to request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner

    try {
      const response = await axios.post('https://projects.ekalavya.net/api/admin/sendOtp', { username, loginMethod });
      setIsOtpSent(true);
      setMessage(response.data);
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
      const response = await axios.post('https://projects.ekalavya.net/api/admin/validateOtp', { username, otp });
      if (response.data === 'Otp Validated Successfully!') {
        setMessage('OTP verified successfully!');
        navigate('/adminDashboard');
      } else {
        setOtp('');
        setMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setMessage('Error verifying OTP. Please login again.');
      localStorage.removeItem('jwtToken'); // Remove JWT token from localStorage
      navigate('/');
    }
  };

  return (
    <Modal open={true}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh" // Full height of the viewport
      >
        <Container
          maxWidth="sm"
          sx={{
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24, // Adds shadow around the modal for better visibility
          }}
        >
          <Typography variant={isMobile ? 'h5' : 'h4'} align="center" gutterBottom color="primary">
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
                    value={username} // Use the username passed from props
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>
                 <Grid item xs={12}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">Select OTP delivery method</FormLabel>
          <RadioGroup
            row
            value={loginMethod}
            onChange={(e) => setLoginMethod(e.target.value)}
          >
            <FormControlLabel value="email" control={<Radio />} label="Email ID" />
            <FormControlLabel value="phone" control={<Radio />} label="Phone No" />
          </RadioGroup>
        </FormControl>
      </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                      backgroundColor: successColor,
                      '&:hover': { backgroundColor: theme.palette.success.dark },
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Request OTP'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" align="center" gutterBottom color="textSecondary">
                    Enter the OTP sent to the account associated with <strong>{username}</strong>
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.info.main,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: theme.palette.info.main,
                      '&:hover': { backgroundColor: theme.palette.info.dark },
                      transition: 'background-color 0.3s ease',
                    }}
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
              align="center"
              sx={{
                mt: 2,
                color: message.includes('Error') ? errorColor : successColor,
                fontWeight: 500,
              }}
            >
              {message}
            </Typography>
          )}
        </Container>
      </Box>
    </Modal>
  );
};

export default EmailOtpVerification;
