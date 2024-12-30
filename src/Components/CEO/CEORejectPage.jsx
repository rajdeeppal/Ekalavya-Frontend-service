import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import Sidebar from '../CEO/sidebar/Sidebar';

import Navbar from "../PM/navbar/Navbar";
import SearchBar from '../PM/SearchBar';
import { getBeneficiary } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import ReviewTable from '../DomainExpert/ReviewTable';

function CEORejectPage() {
    const { userId } = useAuth();
    const [showTable, setShowTable] = useState(false);
    const [isReview,setIsReview] = useState(true);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const handleSearch = async (criteria) => {
      
        if (!criteria) return;
        try {
          console.log("ok");
          const data = await getBeneficiary(userId,criteria,'rejection');
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
          <ReviewTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} isReview={isReview}/>
        </Box>}
      </Box>
    </div>
    </Box>
  )
}

export default CEORejectPage;