import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import Sidebar from '../DomainExpert/sidebar/Sidebar';
import SearchBar from '../PM/SearchBar';
import { getBeneficiary } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import ReviewTable from './ReviewTable';

function ReviewPage() {
  const { userId } = useAuth();
  const [isSuccess, setIsSucess] = useState(false);
  const [value, setValue] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isReview, setIsReview] = useState(false);
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
      const data = await getBeneficiary(userId, criteria, 'inprogress');
      setBeneficiaries(Array.isArray(data) ? data : []);
      setShowTable(true);
      setValue(criteria);
      setIsSucess(false);
      console.log(beneficiaries);
    } catch (error) {
      setShowTable(false);
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
          <SearchBar onSearch={handleSearch} />
        </Box>

        {showTable && <Box sx={{ borderRadius: 1, boxShadow: 1, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
          <ReviewTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} isReview={isReview} setIsSucess={setIsSucess} />
        </Box>}
      </Box>
    </Box>
  )
}

export default ReviewPage;
