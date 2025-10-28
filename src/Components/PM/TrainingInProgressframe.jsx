import React, { useState, useEffect } from 'react'
import { Container, Button, Modal, Typography, Box, AppBar, Toolbar } from '@mui/material';
import Sidebar from './sidebar/Sidebar';
import InprogressTable from './InprogressTable';
import { getTraining } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import TrainingSearchBar from './TrainingSearchBar';
import TrainingInProgressTable from './TrainingInProgressTable';


const TrainingInProgressFrame = () => {
  const [isSuccess, setIsSucess] = useState(false);
  const { userId } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState([
    
  ]);
  const [showTable, setShowTable] = useState(false);
  const [value, setValue] = useState(false);
  const [showTraining, setShowTraining] = useState('');

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
      const data = await getTraining(userId, criteria, 'inprogress');
      setBeneficiaries(Array.isArray(data) ? data : []);
      setShowTable(true);
      setShowTraining(criteria.formType);
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
          <TrainingSearchBar onSearch={handleSearch} />
        </Box>
        {showTable && <Box sx={{ borderRadius: 2, boxShadow: 1, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
          <TrainingInProgressTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} setIsSucess={setIsSucess} value={value} showTraining={showTraining} />
        </Box>}
      </Box>
    </Box>
  )
};

export default TrainingInProgressFrame;
