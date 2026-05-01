import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Snackbar, Alert } from '@mui/material';

const defaultAuthContext = {
  isTokenExpired: false,
  token: null,
  userId: null,
  userRole: null,
  hasAccess: () => false,
};

const AuthContext = createContext(defaultAuthContext);

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const PrivateRoute = ({ children, requiredRoles }) => {
  const token = localStorage.getItem('jwtToken');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'error' });
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const showNotification = (message, severity = 'error') => {
    setNotification({ open: true, message, severity });
    setTimeout(() => {
      setShouldRedirect(true);
    }, 2000);
  };

  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Invalid token:', error);
      showNotification('Invalid Token. Please refresh your session.');
      return true;
    }
  };

  const userRole = jwtDecode(token) ? jwtDecode(token).role[0]?.authority : null;
  const hasAccess = (requiredRoles) => {
    if (!userRole) return false;
    return requiredRoles.includes(userRole);
  };

  // If token is not present or expired, redirect to the homepage
  if (!token) {
    showNotification('You are not logged in. Redirecting to the login page.');
    if (shouldRedirect) return <Navigate to="/" />;
  }

  if (token && isTokenExpired(token)) {
    showNotification('Your session has timed out.');
    if (shouldRedirect) return <Navigate to="/" />;
  }

  if (token && !isTokenExpired(token) && !hasAccess(requiredRoles)) {
    showNotification('You do not have permission to access this page.');
    if (shouldRedirect) return <Navigate to="/" replace />;
  }

  const userId = jwtDecode(token).sub; // Decode the token after ensuring it's not null or expired

  const value = {
    token,
    userId,
    userRole,
    hasAccess,
    isTokenExpired,
  };

  // If token is valid, render the children (protected component)
  return (
    <>
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
};
