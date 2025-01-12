import React, { createContext, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

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

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Invalid token:', error);
      window.alert('Invalid Token. Refresh your session.');
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
    window.alert('You are not logged in. Redirecting to the login page.');
    return <Navigate to="/" />;
  }

  if (isTokenExpired(token)) {
    window.alert('Your session has timed out.');
    return <Navigate to="/" />;
  }

  if (!hasAccess(requiredRoles)) {
    window.alert('You do not have permission to access this page.');
    return <Navigate to="/" replace />;
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
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
