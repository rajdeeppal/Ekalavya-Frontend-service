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
  const [beneficiaries, setBeneficiaries] = useState([]
    // "beneficiaries": [
    //     {
    //         "mandalName": "Kolkata",
    //         "components": [
    //             {
    //                 "activities": [
    //                     {
    //                         "activityName": "Wholesale",
    //                         "id": 1,
    //                         "tasks": [
    //                             {
    //                                 "balanceRemaining": 10,
    //                                 "beneficiaryContribution": 100,
    //                                 "unitRemain": 5,
    //                                 "beneficiaryContributionRemain": 90,
    //                                 "taskUpdates": [
    //                                   {
    //                                     "achievementUnit":5,
    //                                     "currentBeneficiaryContribution":55,
    //                                     "currentCost": 565,
    //                                     "payeeName":"Rajdeep",
    //                                     "accountNumber":5555565,
    //                                     "domainExpertEmpId": 5565 ,
    //                                   }
    //                                 ],
    //                                 "units": 20,
    //                                 "grantAmount": 300,
    //                                 "typeOfUnit": "KG",
    //                                 "isSanction": false,
    //                                 "taskName": "Embassy",
    //                                 "id": 1,
    //                                 "yearOfSanction": 2021,
    //                                 "ratePerUnit": 20,
    //                                 "totalCost": 400,
    //                                 "isCompleted": "N"
    //                             }
    //                         ]
    //                     }
    //                 ],
    //                 "id": 1,
    //                 "componentName": "AIB"
    //             }
    //         ],
    //         "districtName": "West Bardhaman",
    //         "aadharNumber": 1323,
    //         "guardianName": "Debjit",
    //         "stateName": "West Bengal",
    //         "beneficiaryName": "Rajdeep",
    //         "id": 1,
    //         "projectName": "Hello",
    //         "villageName": "Kolkata"
    //     }
    // ]
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

        {showTable && <Box sx={{ borderRadius: 1, boxShadow: 1, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
          <ReviewTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} isReview={isReview} setIsSucess={setIsSucess} />
        </Box>}
      </Box>
    </Box>
  )
}

export default ReviewPage;
