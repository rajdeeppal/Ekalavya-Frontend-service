import React, { useState } from 'react'
import { Box } from '@mui/material';
import SearchBar from './SearchBar';
import Sidebar from './sidebar/Sidebar';
import FinalPreviewList from './FinalPreviewList';
import { getBeneficiary } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';

const FinalPreview = () => {
    const { userId } = useAuth();
    const [beneficiaries, setBeneficiaries] = useState([
       
    ]);
    const [value,setValue]=useState(true);
    const [showTable, setShowTable] = useState(false);
    const handleSearch = async (criteria) => {
        if (!criteria) return;
        try {
          console.log("ok");
          const data = await getBeneficiary(userId,criteria,'preview');
          setValue(criteria);
          setBeneficiaries(Array.isArray(data) ? data : []);
          setShowTable(true)
          console.log(beneficiaries);
        } catch (error) {
          console.error('Error fetching activities:', error);
        }
      };

    return (
        <Box sx={{ display: 'flex' }} style={{backgroundColor:"#F0F5F9"}}>
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
                <FinalPreviewList beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} value={value}/>
                </Box>}
            </Box>
        </Box>
    )
}

export default FinalPreview;
