import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import Sidebar from './sidebar/Sidebar';

import { getTraining } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import TrainingReviewTable from '../DomainExpert/TrainingReviewTable';
import TrainingSearchBar from '../PM/TrainingSearchBar';

function TrainingTrusteeReviewPage() {
  const { userId } = useAuth();
  const [showTable, setShowTable] = useState(false);
  const [isReview, setIsReview] = useState(false);
  const [isSuccess, setIsSucess] = useState(false);
  const [value, setValue] = useState(false);
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

        <Box sx={{ borderRadius: 2, boxShadow: 1, backgroundColor: 'background.paper', pb: 3 }}>
          <TrainingSearchBar onSearch={handleSearch} />
        </Box>

        {showTable && <Box sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
          <TrainingReviewTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} isReview={isReview} setIsSucess={setIsSucess} showTraining={showTraining}/>
        </Box>}
      </Box>
    </Box>
  )
}

export default TrainingTrusteeReviewPage;
