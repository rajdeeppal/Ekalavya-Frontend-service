import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode }   from 'jwt-decode';
import EmailOtpVerification from '../Admin/EmailOtpVerification';
 // Import the OTP component

const LoginRedirect = ({ token }) => {
  const navigate = useNavigate();
  const [showOtpModal, setShowOtpModal] = useState(false); // State to show OTP pop-up
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (token) {
      try {
        // Decode the JWT token
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role[0].authority;
        const decodedUsername = decodedToken.sub;

        setUsername(decodedUsername);

        if (userRole === 'EADMIN') {
          console.log("Admin User has logged in....");
          setShowOtpModal(true); // Show OTP modal instead of navigating
        } else if (userRole === 'DOMAIN EXPERT') {
          console.log("DOMAIN EXPERT User has logged in....");
          // setShowOtpModal(true); // Show OTP modal instead of navigating
          navigate('/resolution-list');
        } else if (userRole === 'AO') {
          console.log("DOMAIN EXPERT User has logged in....");
          // setShowOtpModal(true); // Show OTP modal instead of navigating
          navigate('/resolution-list');
        }else if (userRole === 'TRUSTEE') {
          console.log("DOMAIN EXPERT User has logged in....");
          // setShowOtpModal(true); // Show OTP modal instead of navigating
          navigate('/Trustee/inprogress-list');
        }else if (userRole === 'CEO') {
          console.log("DOMAIN EXPERT User has logged in....");
          // setShowOtpModal(true); // Show OTP modal instead of navigating
          navigate('/CEO/inprogress-list');
        }else{
          console.log("Non Admin User has logged in....");
          navigate('/beneficiary');
        }
      } catch (error) {
        console.error('Invalid token', error);
        // Handle token decoding error
      }
    }
  }, [token, navigate]);

  return (
    <>
      {showOtpModal && <EmailOtpVerification username={username}  />} {/* Pass username as props */}
    </>
  );
};

export default LoginRedirect;
