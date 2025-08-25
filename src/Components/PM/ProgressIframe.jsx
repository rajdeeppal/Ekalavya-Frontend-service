import React, { useState, useEffect } from 'react'
import { Container, Button, Modal, Typography, Box, AppBar, Toolbar } from '@mui/material';
import SearchBar from './SearchBar';
import Sidebar from './sidebar/Sidebar';
import InprogressTable from './InprogressTable';
import { getBeneficiary } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';

const ProgressIframe = () => {
  const [isSuccess, setIsSucess] = useState(false);
  const { userId } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState([
    
  ]);
  const [showTable, setShowTable] = useState(false);
  const [value, setValue] = useState(false);

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
      const data = await getBeneficiary(userId, criteria, 'inprogress');
      setBeneficiaries(Array.isArray(data) ? data : []);
      setShowTable(true);
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
      <Sidebar isSuccess={isSuccess} />
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
          <InprogressTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} setIsSucess={setIsSucess} value={value}/>
        </Box>}
      </Box>
    </Box>
  )
}

export default ProgressIframe;
