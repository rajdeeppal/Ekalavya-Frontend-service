import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('jwtToken');

  // If token is not present, redirect to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If token is present, render the children (the protected component)
  return children;
};

export default PrivateRoute;
