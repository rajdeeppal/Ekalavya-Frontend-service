import React, { useState, useEffect } from 'react'
import { Container, Button, Modal, Typography, Box, AppBar, Toolbar } from '@mui/material';
import SearchBar from './SearchBar';
import Sidebar from './sidebar/Sidebar';
import InprogressTable from './InprogressTable';
import { getBeneficiary } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';

function RejectIframe() {
  const { userId } = useAuth();
  const [isSuccess, setIsSucess] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([
  ]);
  const [value, setValue] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isReject, setIsReject] = useState(true);

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
      const data = await getBeneficiary(userId, criteria, 'rejection');
      setBeneficiaries(Array.isArray(data) ? data : []);
      setShowTable(true)
      setValue(criteria);
      setIsSucess(false);
      console.log(beneficiaries);
    } catch (error) {
      setShowTable(false);
      alert(error);
      console.error('Error fetching activities:', error);
    }
  };
  return (
    <Box sx={{ display: 'flex' }} style={{ backgroundColor: "#F0F5F9" }}>
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
        <Box sx={{ borderRadius: 2, boxShadow: 1, backgroundColor: 'background.paper', pb: 3 }}>
          <SearchBar onSearch={handleSearch} />
        </Box>
        {showTable && <Box sx={{ borderRadius: 2, boxShadow: 1, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
          <InprogressTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} isReject={isReject} setIsSucess={setIsSucess}/>
        </Box>}
      </Box>
    </Box>
  )
}

export default RejectIframe;
