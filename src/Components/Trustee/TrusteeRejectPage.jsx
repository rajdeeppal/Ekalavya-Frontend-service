import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import Sidebar from '../Trustee/sidebar/Sidebar';

import Navbar from "../PM/navbar/Navbar";
import SearchBar from '../PM/SearchBar';
import { getBeneficiary } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import ReviewTable from '../DomainExpert/ReviewTable';

function TrusteeRejectPage() {
  const { userId } = useAuth();
  const [showTable, setShowTable] = useState(false);
  const [isReview, setIsReview] = useState(true);
  const [isSuccess, setIsSucess] = useState(false);
  const [value, setValue] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]
  );

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
    <Box sx={{ display: 'flex' }} style={{backgroundColor:"#F0F5F9"}}>
      <Sidebar isSuccess={isSuccess}/>
      <div className="homeContainer">
        {/* <Navbar /> */}
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

          {showTable && <Box sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
            <ReviewTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} isReview={isReview} setIsSucess={setIsSucess}/>
          </Box>}
        </Box>
      </div>
    </Box>
  )
}

export default TrusteeRejectPage;
