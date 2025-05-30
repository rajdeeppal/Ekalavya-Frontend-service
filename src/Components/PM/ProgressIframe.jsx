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
    // {
    //     "id": 1,
    //     "verticalName": "BT",
    //     "guardianName": 'Yes',
    //     "villageName": 'Yes',
    //     "mandalName": 'Yes',
    //     "districtName": 'Yes',
    //     "state": 'Yes',
    //     "aadharNumber": 'Yes',
    //     "surveyNumber": 'Yes',
    //     "components": [
    //         {
    //             "id": 2,
    //             "componentName": "Enterprise",
    //             "activities": [
    //                 {
    //                     "id": 3,
    //                     "activityName": "AIB",
    //                     "tasks": [
    //                         {
    //                             "id": 4,
    //                             "taskName": "VOICE",
    //                             "typeOfUnit": "gm",
    //                             "units": "10",
    //                             "ratePerUnit": "800",
    //                             "totalCost": "234",
    //                             "beneficiaryContribution": "12",
    //                             "grantAmount": "234",
    //                             "yearOfSanction": "2009",
    //                             "taskUpdates": [
    //                                 {
    //                                     achievementUnit: '',
    //                                     remainingBalance: '',
    //                                     duration: '',
    //                                     payeeName: '',
    //                                     passbookCopy: ''
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             "id": 5,
    //                             "taskName": "CV",
    //                             "typeOfUnit": "gm",
    //                             "units": "20",
    //                             "ratePerUnit": "700",
    //                             "totalCost": "234",
    //                             "beneficiaryContribution": "12",
    //                             "grantAmount": "234",
    //                             "yearOfSanction": "2009",
    //                             "taskUpdates": [
    //                                 {
    //                                     achievementUnit: '',
    //                                     remainingBalance: '',
    //                                     duration: '',
    //                                     payeeName: '',
    //                                     passbookCopy: ''
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 6,
    //             "componentName": "Consumer",
    //             "activities": [
    //                 {
    //                     "id": 7,
    //                     "activityName": "OFS",
    //                     "tasks": [
    //                         {
    //                             "id": 8,
    //                             "taskName": "Global",
    //                             "typeOfUnit": "gm",
    //                             "units": "96",
    //                             "ratePerUnit": "89",
    //                             "totalCost": "234",
    //                             "beneficiaryContribution": "12",
    //                             "grantAmount": "234",
    //                             "yearOfSanction": "2009",
    //                             "taskUpdates": [
    //                                 {
    //                                     achievementUnit: '',
    //                                     remainingBalance: '',
    //                                     duration: '',
    //                                     payeeName: '',
    //                                     passbookCopy: ''
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // }
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
          <InprogressTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} setIsSucess={setIsSucess}/>
        </Box>}
      </Box>
    </Box>
  )
}

export default ProgressIframe;
