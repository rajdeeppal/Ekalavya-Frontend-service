import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import Sidebar from '../AO/sidebar/Sidebar';
import DatePickerSearch from '../CEO/DatePickerSearch';
import { getPaymentDetails } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import PaymentTable from '../CEO/PaymentTable';

function AOPaymentPage() {
  const { userId } = useAuth();
  const [showTable, setShowTable] = useState(true);
  const [isReview, setIsReview] = useState(true);
  const [isSuccess, setIsSucess] = useState(false);
  const [value, setValue] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([

    {
      "id": 1,
      "payeeName": "Nayan",
      "accountNumber": "36521000",
      "projects": [
          {
              "id": 1,
              "projectName": "Ghumnur Watershed",
              "components": [
                  {
                      "id": 1,
                      "componentName": "I & CB",
                      "activities": [
                          {
                              "id": 1,
                              "activityName": "Committtee trainings",
                              "totalActivityAmount": 5200,
                              "totalActivityBenContribution": 1005,
                              "tasks": [
                                  {
                                      "id": 1,
                                      "taskName": "Resource Fee",
                                      "totalAmount": 5200,
                                      "beneficiaryContribution": 1005
                                  }
                              ]
                          }
                      ]
                  }
              ]
          },
          {
              "id": 2,
              "projectName": "Utnoor health dev",
              "components": [
                  {
                      "id": 1,
                      "componentName": "Training",
                      "activities": [
                          {
                              "id": 1,
                              "activityName": "Hygin Training",
                              "totalActivityAmount": 5390,
                              "totalActivityBenContribution": 500,
                              "tasks": [
                                  {
                                      "id": 1,
                                      "taskName": "Resource Fee",
                                      "totalAmount": 5390,
                                      "beneficiaryContribution": 500
                                  }
                              ]
                          }
                      ]
                  }
              ]
          }
      ],
      "grandTotal": 10590,
      "totalBenContribution": 1505,
      "passbookDocs": [
          {
              "id": null,
              "fileName": null,
              "downloadUrl": "http://localhost:61002/download-document/"
          }
      ]
  },
  {
      "id": 2,
      "payeeName": "Ramesh",
      "accountNumber": "2222233",
      "projects": [
          {
              "id": 1,
              "projectName": "Ghumnur Watershed",
              "components": [
                  {
                      "id": 1,
                      "componentName": "EPA",
                      "activities": [
                          {
                              "id": 1,
                              "activityName": "Tent House",
                              "totalActivityAmount": 7840,
                              "totalActivityBenContribution": 730,
                              "tasks": [
                                  {
                                      "id": 1,
                                      "taskName": "Chairs purchase",
                                      "totalAmount": 7840,
                                      "beneficiaryContribution": 730
                                  }
                              ]
                          }
                      ]
                  }
              ]
          },
          {
            "id": 2,
            "projectName": "Ghumnur Watershed",
            "components": [
                {
                    "id": 1,
                    "componentName": "EPA",
                    "activities": [
                        {
                            "id": 1,
                            "activityName": "Tent House",
                            "totalActivityAmount": 7840,
                            "totalActivityBenContribution": 730,
                            "tasks": [
                                {
                                    "id": 1,
                                    "taskName": "Chairs purchase",
                                    "totalAmount": 7840,
                                    "beneficiaryContribution": 730
                                }
                            ]
                        }
                    ]
                }
            ]
        }
      ],
      "grandTotal": 7840,
      "totalBenContribution": 730,
      "passbookDocs": [
          {
              "id": null,
              "fileName": null,
              "downloadUrl": "http://localhost:61002/download-document/"
          }
      ]
  }
  ]);

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
      const data = await getPaymentDetails(criteria);
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
          <PaymentTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} isReview={isReview} setIsSucess={setIsSucess} />
        </Box>}
      </Box>
    </Box>
  )
}

export default AOPaymentPage;