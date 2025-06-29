import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import Sidebar from '../AO/sidebar/Sidebar';
import DatePickerSearch from '../CEO/DatePickerSearch';
import { getUpdatedPaymentDetails } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import AODashboardTable from './AODashboardTable';


function AODashboard() {
    const { userId } = useAuth();
    const [showTable, setShowTable] = useState(false);
    const [isReview, setIsReview] = useState(true);
    const [isVoucher, setIsVoucher] = useState(false);
    const [beneficiaries, setBeneficiaries] = useState([
        
    ]);
    const [date, setDate] = useState(true);
    const handleSearch = async (criteria) => {
        if (!criteria) return;
        try {
            console.log("ok");
            const data = await getUpdatedPaymentDetails(criteria);
            setDate(criteria);
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

                <Box sx={{ borderRadius: 2, boxShadow: 1, backgroundColor: 'background.paper' }}>
                    <DatePickerSearch onSearch={handleSearch} setIsReview={setIsReview} setIsVoucher={setIsVoucher} isVoucher={isVoucher}/>
                </Box>

                {showTable && <Box sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
                    <AODashboardTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} date={date} setDate={setDate} />
                </Box>}
            </Box>
        </Box>
    )
}

export default AODashboard;
