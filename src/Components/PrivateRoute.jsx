import React ,{createContext,useContext} from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('jwtToken');
  const userId=jwtDecode(token).sub;
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

  // If token is not present or expired, redirect to the homepage
  if (!token || isTokenExpired(token)) {
    window.alert('Your Session has timed out.');
    return <Navigate to="/" />;
  }
  const value = {
    token,
    userId,
    isTokenExpired,
  };
  // If token is valid, render the children (protected component)
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


