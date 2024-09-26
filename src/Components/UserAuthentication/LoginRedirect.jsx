import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LoginRedirect = ({ token }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        // Decode the JWT token
        const decodedToken = jwtDecode(token);

        const userRole = jwtDecode(token).role[0].authority;
        const username = jwtDecode(token).sub;

        if (userRole == 'EADMIN') {
          // If the user is an ADMIN, navigate to the email OTP verification page, from email otp verification
          // navigate to admin dashboard
          console.log("Admin User has logged in....");
          navigate('/otpValidation', { state: { username } });
        } else {
          // Otherwise, navigate to the beneficiary dashboard
          console.log("Non Admin User has logged in....");
        navigate('/beneficiary');
        }
      } catch (error) {
        console.error('Invalid token', error);
        // Handle token decoding error
      }
    }
  }, [token, navigate]);

  return null; // Since we're only handling navigation, there's no need to render anything
};

export default LoginRedirect;
