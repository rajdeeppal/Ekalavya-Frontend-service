import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import Sidebar from '../AO/sidebar/Sidebar';
import DatePickerSearch from '../CEO/DatePickerSearch';
import { getUpdatedPaymentDetails } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import AODashboardTable from './AODashboardTable';


function AODashboard() {
    const { userId } = useAuth();
    const [showTable, setShowTable] = useState(true);
    const [isReview, setIsReview] = useState(true);
    const [beneficiaries, setBeneficiaries] = useState([
        {
            "id": 1,
            "payeeName": "Madhu",
            "accountNumber": "100896",
            "components": [
                {
                    "id": 1,
                    "componentName": "c1",
                    "activities": [
                        {
                            "id": 1,
                            "activityName": "a1",
                            "tasks": [
                                {
                                    "id": 1,
                                    "taskName": "t1",
                                    "totalAmount": 1800,
                                    "beneficiaryContribution": 490
                                }
                            ]
                        }
                    ]
                }
            ],
            "grandTotal": 1800,
            "totalBenContribution": 490,
            "passbookDocs": [
                {
                    "id": 3,
                    "fileName": "Screenshot 2023-08-27 233102.png",
                    "downloadUrl": "http://localhost:61002/download-document/3"
                }
            ]
        },
        {
            "id": 2,
            "payeeName": "shilpa",
            "accountNumber": "100021",
            "components": [
                {
                    "id": 1,
                    "componentName": "c1",
                    "activities": [
                        {
                            "id": 1,
                            "activityName": "a1",
                            "tasks": [
                                {
                                    "id": 1,
                                    "taskName": "t1",
                                    "totalAmount": 1500,
                                    "beneficiaryContribution": 200
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "activityName": "a3",
                            "tasks": [
                                {
                                    "id": 1,
                                    "taskName": "t3",
                                    "totalAmount": 2000,
                                    "beneficiaryContribution": 220
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": 2,
                    "componentName": "c2",
                    "activities": [
                        {
                            "id": 1,
                            "activityName": "a2",
                            "tasks": [
                                {
                                    "id": 1,
                                    "taskName": "t2",
                                    "totalAmount": 3600,
                                    "beneficiaryContribution": 510
                                }
                            ]
                        }
                    ]
                }
            ],
            "grandTotal": 7100,
            "totalBenContribution": 930,
            "passbookDocs": [
                {
                    "id": 1,
                    "fileName": "Screenshot 2023-08-02 201712.png",
                    "downloadUrl": "http://localhost:61002/download-document/1"
                },
                {
                    "id": 2,
                    "fileName": "Screenshot 2023-08-02 201502.png",
                    "downloadUrl": "http://localhost:61002/download-document/2"
                },
                {
                    "id": 4,
                    "fileName": "Screenshot 2023-08-27 231539.png",
                    "downloadUrl": "http://localhost:61002/download-document/4"
                },
                {
                    "id": 5,
                    "fileName": "Screenshot 2023-08-02 203841.png",
                    "downloadUrl": "http://localhost:61002/download-document/5"
                }
            ]
        }
    ]);
    const handleSearch = async (criteria) => {
        if (!criteria) return;
        try {
            console.log("ok");
            const data = await getUpdatedPaymentDetails(criteria);
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

                <Box sx={{ borderRadius: 2, boxShadow: 1, backgroundColor: 'background.paper' }}>
                    <DatePickerSearch onSearch={handleSearch} />
                </Box>

                {showTable && <Box sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
                    <AODashboardTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} isReview={isReview} />
                </Box>}
            </Box>
        </Box>
    )
}

export default AODashboard;
