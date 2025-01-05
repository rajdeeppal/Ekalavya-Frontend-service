import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import Sidebar from '../CEO/sidebar/Sidebar';
import DatePickerSearch from '../CEO/DatePickerSearch';
import { getPaymentDetails } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import PaymentTable from '../CEO/PaymentTable';

function PaymentPage() {
    const { userId } = useAuth();
    const [showTable, setShowTable] = useState(true);
    const [isReview, setIsReview] = useState(false);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const handleSearch = async (criteria) => {
        if (!criteria) return;
        try {
          console.log("ok");
          const data = await getPaymentDetails(criteria);
          setBeneficiaries(Array.isArray(data) ? data : []);
          setShowTable(true)
          console.log(beneficiaries);
        } catch (error) {
          console.error('Error fetching activities:', error);
        }
      };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 6,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >

        <Box sx={{ borderRadius: 2, boxShadow: 1, backgroundColor: 'background.paper' }}>
          <DatePickerSearch onSearch={handleSearch} />
        </Box>

        {showTable && <Box sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
          <PaymentTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} isReview={isReview} />
        </Box>}
      </Box>
    </Box>
  )
}

export default PaymentPage;