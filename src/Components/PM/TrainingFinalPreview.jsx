import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import Sidebar from './sidebar/Sidebar';

import { getTraining } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import TrainingSearchBar from './TrainingSearchBar';
import TrainingFinalPreviewList from './TrainingFinalPreviewList';

function TrainingFinalPreview() {
  const { userId } = useAuth();
  const [showTable, setShowTable] = useState(false);
  const [value,setValue]=useState(true);
  const [isSuccess, setIsSucess] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
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
      const data = await getTraining(userId, criteria, 'preview');
      setBeneficiaries(Array.isArray(data) ? data : []);
      setShowTable(true);
      setValue(criteria);
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

        {showTable && <Box sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
          <TrainingFinalPreviewList beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} value={value} showTraining={showTraining} />
        </Box>}
      </Box>
    </Box>
  )
}

export default TrainingFinalPreview;