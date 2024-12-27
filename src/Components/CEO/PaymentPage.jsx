import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import Sidebar from '../CEO/sidebar/Sidebar';
import DatePickerSearch from '../CEO/DatePickerSearch';
import { getPaymentDetails } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import PaymentTable from '../CEO/PaymentTable';

function PaymentPage() {
  const { userId } = useAuth();
  const [showTable, setShowTable] = useState(true);
  const [isReview, setIsReview] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([
    {
      "payeeName": "Shilpa",
      "id": 1,
      "accountNumber": "10023",
      "tasks": [
        {
          "id": 5,
          "taskName": "t2",
          "totalAmount": 1340
        },
        {
          "id": 6,
          "taskName": "t1",
          "totalAmount": 900
        }
      ],
      "grandTotal": 2240,
      "passbookDocs": [
        {
          "id": 1,
          "fileName": "Screenshot 2023-08-27 233149.png",
          "downloadUrl": "http://localhost:61002/download-document/1"
        },
        {
          "id": 2,
          "fileName": "Screenshot 2023-08-02 201712.png",
          "downloadUrl": "http://localhost:61002/download-document/2"
        }
      ]
    }
  ]);
  const handleSearch = async (criteria) => {
    if (!criteria) return;
    try {
      console.log("ok");
      const data = await getPaymentDetails(criteria);
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
          <PaymentTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} isReview={isReview} />
        </Box>}
      </Box>
    </Box>
  )
}

export default PaymentPage;