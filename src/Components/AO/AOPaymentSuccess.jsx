import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import Sidebar from '../AO/sidebar/Sidebar';
import DatePickerSearch from '../CEO/DatePickerSearch';
import { getSuccessPaymentDetails, getVoucherDetails } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import PaymentTable from '../CEO/PaymentTable';
import AOPaymentTable from '../AO/AOPaymentTable';

function AOPaymentSuccess() {
    const { userId } = useAuth();
    const [showTable, setShowTable] = useState(false);
    const [isReview, setIsReview] = useState(true);
    const [isSuccess, setIsSucess] = useState(false);
    const [isApprove, setIsApprove] = useState(false);
    const [isVoucher, setIsVoucher] = useState(false);
    const [value, setValue] = useState(false);
    const [voucher, setVoucher] = useState('');
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [showViewPaymentConfirmation, setShowViewPaymentConfirmation] = useState(false);

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
            console.log(isVoucher);
            let data;
            if (isVoucher) {
                // data = await getVoucherDetails(criteria);
                setVoucher(criteria);
                setShowTable(false);
                setShowViewPaymentConfirmation(true);
            } else {
                data = await getSuccessPaymentDetails(criteria);
                setBeneficiaries(Array.isArray(data) ? data : []);
                setShowTable(true);
            }
            setIsSucess(false);
            setIsApprove(true);
            setValue(criteria);
            console.log(beneficiaries);
            console.log(voucher);
        } catch (error) {
            setShowTable(false);
            alert(error);
            console.error('Error fetching activities:', error);
        }
    };

    const handleCloseViewPaymentConfirmation = () => {
        setShowViewPaymentConfirmation(false);
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

                <Box sx={{ borderRadius: 2, boxShadow: 1, backgroundColor: 'background.paper' }}>
                    <DatePickerSearch onSearch={handleSearch} setIsVoucher={setIsVoucher} isVoucher={isVoucher} isTrue='true' />
                </Box>

                {showTable && <Box sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
                    <PaymentTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} isReview={isReview} setIsSucess={setIsSucess} isApprove={isApprove} />
                </Box>}


                <Modal
                    open={showViewPaymentConfirmation}
                    onClose={handleCloseViewPaymentConfirmation}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 500,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <Typography variant="h6" component="h2" gutterBottom>
                            Payment Form
                        </Typography>
                        <AOPaymentTable setShowViewPaymentConfirmation={setShowViewPaymentConfirmation} showViewPaymentConfirmation={showViewPaymentConfirmation} setIsSucess={setIsSucess} voucher={voucher} />
                    </Box>
                </Modal>

            </Box>
        </Box>
    )
}

export default AOPaymentSuccess;