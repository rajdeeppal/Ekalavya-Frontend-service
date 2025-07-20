import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, Typography, Grid, CircularProgress, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import axios from 'axios';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); // in seconds
  const [otpExpired, setOtpExpired] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); 


  const navigate = useNavigate();

  // Timer logic (15 mins = 900 seconds)
  useEffect(() => {
    let countdown;
    if (otpSent && timer > 0 && !otpExpired) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && otpSent) {
      setOtpExpired(true);
      setOtpSent(false);
      setMessage('OTP expired. Please request a new one.');
    }
    return () => clearInterval(countdown);
  }, [timer, otpSent, otpExpired]);

  // Prevent direct access to this page
  useEffect(() => {
    if (!window.location.pathname.includes('/forgot-password')) {
      navigate('/');
    }
  }, [navigate]);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await axios.post('https://projects.ekalavya.net/api/admin/sendOtp', { username, loginMethod });
      setOtpSent(true);
      setOtpExpired(false);
      setTimer(900); // reset 15 minutes
      setMessage('OTP sent successfully.');
    } catch (error) {
      setMessage('Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://projects.ekalavya.net/api/admin/validateOtp', {
        username,
        otp,
      });
      if (response.data === 'Otp Validated Successfully!') {
        setOtpVerified(true);
        setMessage('OTP verified successfully.');
      } else {
        setMessage('Invalid OTP. Try again.');
      }
    } catch (error) {
      setMessage('Error verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('https://projects.ekalavya.net/api/self-service/resetPassword', {
        username,
        newPassword,
      });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
        const errMsg =
              error?.response?.data?.newPassword ||
              error?.response?.data?.message ||
              'Failed to reset password.';
            setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={4} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Forgot Password
        </Typography>

        {/* Step 1: Send OTP */}
        {!otpSent && !otpVerified && (
          <>
            <TextField
              label="Employee ID"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
             <FormControl component="fieldset" sx={{ mt: 1 }}>
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
            <Button
              variant="contained"
              fullWidth
              onClick={handleSendOtp}
              disabled={loading || !username}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Send OTP'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/')}
              sx={{ mt: 1, textTransform: 'none', color: '#1976d2' }}
            >
              Back to Login
            </Button>
          </>
        )}

        {/* Step 2: Enter OTP */}
        {otpSent && !otpVerified && (
          <>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Enter the OTP sent to the email associated with Employee ID <b>{username}</b>
            </Typography>
            <TextField
              label="Enter OTP"
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={otpExpired}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleVerifyOtp}
              disabled={loading || !otp || otpExpired}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>

            {/* Timer */}
            {!otpExpired && (
              <Typography variant="caption" align="center" display="block" sx={{ mt: 1 }}>
                Time remaining: {formatTime(timer)}
              </Typography>
            )}
          </>
        )}

        {/* Step 3: Reset Password */}
        {otpVerified && (
          <>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleResetPassword}
              disabled={loading || !newPassword || !confirmPassword}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
          </>
        )}

        {/* Message */}
{message && (
  <Alert
    severity={message.toLowerCase().includes('success') ? 'success' : 'error'}
    sx={{ mt: 2 }}
  >
    {message}
  </Alert>
)}
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;