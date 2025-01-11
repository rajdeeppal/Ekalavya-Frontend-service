import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import Sidebar from '../AO/sidebar/Sidebar';
import DatePickerSearch from '../CEO/DatePickerSearch';
import { getPaymentDetails } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import PaymentTable from '../CEO/PaymentTable';

function AOPaymentPage() {
  const { userId } = useAuth();
  const [showTable, setShowTable] = useState(true);
  const [isReview, setIsReview] = useState(true);
  const [isSuccess, setIsSucess] = useState(false);
  const [value, setValue] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([
  ]);

  useEffect(() => {
    console.log("isSuccess:", isSuccess);
    if (isSuccess) {
      console.log("Calling handleSearch...");
      handleSearch(value);
    }
  }, [isSuccess]);

  const handleSearch = async (criteria) => {
    if (!criteria) return;
    try {
      console.log("ok");
      const data = await getPaymentDetails(criteria);
      setBeneficiaries(Array.isArray(data) ? data : []);
      setShowTable(true);
      setIsSucess(false);
      setValue(criteria);
      console.log(beneficiaries);
    } catch (error) {
      setShowTable(false);
      alert(error);
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
          <PaymentTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} isReview={isReview} setIsSucess={setIsSucess} />
        </Box>}
      </Box>
    </Box>
  )
}

export default AOPaymentPage;