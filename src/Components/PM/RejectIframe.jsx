import React, { useState } from 'react'
import { Container, Button, Modal, Typography, Box, AppBar, Toolbar } from '@mui/material';
import SearchBar from './SearchBar';
import Sidebar from './sidebar/Sidebar';
import InprogressTable from './InprogressTable';
import { getBeneficiary } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';

function RejectIframe() {
    const { userId } = useAuth();
    const [beneficiaries, setBeneficiaries] = useState([
        {
            "mandalName": "Kolkata",
            "components": [
                {
                    "activities": [
                        {
                            "activityName": "Hi",
                            "id": 53,
                            "tasks": [
                                {
                                    "balanceRemaining": 9498,
                                    "beneficiaryContribution": 500,
                                    "unitRemain": 48,
                                    "beneficiaryContributionRemain": 102,
                                    "isRejectionOccurred": false,
                                    "taskUpdates": [
                                        {
                                            "pendingWith": "PM",
                                            "comments": [
                                                {
                                                    "id": 1,
                                                    "role": "Domain",
                                                    "message": "not accepted"
                                                },
                                                {
                                                    "id": 2,
                                                    "role": "Domain Expert",
                                                    "message": "not accepted"
                                                }
                                            ],
                                            "domainExpertEmpId": 1002,
                                            "currentCost": 1,
                                            "accountNumber": "66449",
                                            "transactionId": null,
                                            "payeeName": "Enterprise",
                                            "currentBeneficiaryContribution": 199,
                                            "createdDate": "17-11-2024",
                                            "otherDocs": [
                                                {
                                                    "id": 25,
                                                    "fileName": "Assignment_12_Riya_Kirtania (1).pdf",
                                                    "downloadUrl": "http://localhost:61002/download-document/25"
                                                },
                                                {
                                                    "id": 26,
                                                    "fileName": "Assignment_12_Riya_Kirtania.pdf",
                                                    "downloadUrl": "http://localhost:61002/download-document/26"
                                                }
                                            ],
                                            "achievementUnit": 1,
                                            "id": 59,
                                            "remarks": null,
                                            "isCompleted": "N",
                                            "passbookDoc": {
                                                "id": 19,
                                                "fileName": "Service_&_Commitment__Award.pdf",
                                                "downloadUrl": "http://localhost:61002/download-document/19"
                                            }
                                        },
                                        {
                                            "pendingWith": "PM",
                                            "comments": [
                                                {
                                                    "id": 3,
                                                    "role": "CEO",
                                                    "message":"not accepted"
                                                }
                                            ],
                                            "domainExpertEmpId": 1002,
                                            "currentCost": 1,
                                            "accountNumber": "66449",
                                            "transactionId": null,
                                            "payeeName": "Enterprise",
                                            "currentBeneficiaryContribution": 199,
                                            "createdDate": "17-11-2024",
                                            "otherDocs": [
                                                {
                                                    "id": 27,
                                                    "fileName": "Assignment_12_Riya_Kirtania.pdf",
                                                    "downloadUrl": "http://localhost:61002/download-document/27"
                                                }
                                            ],
                                            "achievementUnit": 1,
                                            "id": 60,
                                            "remarks": null,
                                            "isCompleted": "N",
                                            "passbookDoc": {
                                                "id": 20,
                                                "fileName": "Service_&_Commitment__Award.pdf",
                                                "downloadUrl": "http://localhost:61002/download-document/20"
                                            }
                                        }
                                    ],
                                    "units": 50,
                                    "grantAmount": 9500,
                                    "typeOfUnit": "CM",
                                    "isSanction": true,
                                    "taskName": "Future",
                                    "id": 53,
                                    "yearOfSanction": 2021,
                                    "ratePerUnit": 200,
                                    "totalCost": 10000,
                                    "isCompleted": "N"
                                }
                            ]
                        }
                    ],
                    "id": 53,
                    "componentName": "MPM"
                }
            ],
            "districtName": "Varanasi",
            "aadharNumber": 1326,
            "guardianName": "Debjit",
            "stateName": "Uttar Pradesh",
            "beneficiaryName": "qwe",
            "id": 53,
            "projectName": "BT",
            "villageName": "Kolkata"
        }
    ]);
    const [showTable, setShowTable] = useState(true);
    const [isReject, setIsReject] = useState(true);

      const handleSearch = async (criteria) => {
        if (!criteria) return;
        try {
          console.log("ok");
          const data = await getBeneficiary(userId,criteria,'inprogress');
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
                <InprogressTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} isReject={isReject}/>
                </Box>}
            </Box>
        </Box>
  )
}

export default RejectIframe;
