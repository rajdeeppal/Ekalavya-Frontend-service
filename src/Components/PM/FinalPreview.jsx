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
    const [showTable, setShowTable] = useState(true);
    const handleSearch = async (criteria) => {
        if (!criteria) return;
        try {
          console.log("ok");
          const data = await getBeneficiary(userId,criteria,'preview');
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
                <FinalPreviewList beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} />
                </Box>}
            </Box>
        </Box>
    )
}

export default FinalPreview;
