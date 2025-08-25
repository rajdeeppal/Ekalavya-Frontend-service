import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import Sidebar from './sidebar/Sidebar';
import DatePickerSearch from '../CEO/DatePickerSearch';
import { getRejectPaymentDetails } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import PaymentTable from '../CEO/PaymentTable';

function AOPaymentReject() {
  const { userId } = useAuth();
  const [showTable, setShowTable] = useState(false);
  const [isReview, setIsReview] = useState(true);
  const [isSuccess, setIsSucess] = useState(false);
  const [isReject, setIsReject] = useState(false);
      const [isVoucher, setIsVoucher] = useState(false);
  const [value, setValue] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);

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
      const data = await getRejectPaymentDetails(criteria);
      setBeneficiaries(Array.isArray(data) ? data : []);
      setShowTable(true);
      setIsSucess(false);
      setIsReject(true);
      setValue(criteria);
      console.log(beneficiaries);
    } catch (error) {
      setShowTable(false);
      alert(error);
      console.error('Error fetching activities:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }} style={{backgroundColor:"#F0F5F9"}}>
      <Sidebar isSuccess={isSuccess}/>
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
          <DatePickerSearch onSearch={handleSearch} setIsVoucher={setIsVoucher} isVoucher={isVoucher} />
        </Box>

        {showTable && <Box sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
          <PaymentTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} setIsSucess={setIsSucess} isReject={isReject}/>
        </Box>}
      </Box>
    </Box>
  )
}

export default AOPaymentReject;