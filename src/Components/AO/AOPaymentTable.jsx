import React, { useState, useEffect } from 'react';
import { Box, Container, Dialog, DialogTitle, DialogContent, Button, TextField, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { getVoucherDetails, generatedPaymentDetails } from '../DataCenter/apiService';


function AOPaymentTable({setShowViewPaymentConfirmation}) {
    const [formValues, setFormValues] = useState({
        voucherId: '',
        payeeName: '',
        accountNumber: '',
        amount: '',
        taskNames: [],
        bankInfo: '',
        transactionId: '',
        paymentMode: '',
        paymentStatus:''
    });
    const [errors, setErrors] = useState({});
    const status = ['SUCCESS', 'FAILED', 'ONHOLD'];
    const modes = ["Online", "Cheque", "Cash"];
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }

    const handleSearch = async (value) => {
        if (!value) {
            setErrors((prevErrors) => ({ ...prevErrors, voucherId: 'Voucher Id is required' }));
            return;
        }

        try {
            const data = await getVoucherDetails(value);

            setFormValues({
                ...formValues,
                voucherId: data.voucherId,
                payeeName: data.payeeName,
                accountNumber: data.accountNumber,
                amount: data.amount,
                taskNames: data.taskNames,
                bankInfo: data.bankInfo,
            });

        } catch (error) {
            console.error('Error fetching Aadhaar details:', error);
        }
    };

    const handleSave = async () => { 
        const criteria = {
            voucherId: formValues.voucherId,
            payeeName: formValues.payeeName,
            accountNumber: formValues.accountNumber,
            amount: formValues.amount,
            taskNames: formValues.taskNames,
            bankInfo: formValues.bankInfo,
            paymentMode: formValues.paymentMode,
            transactionId: formValues.transactionId,
            paymentStatus: formValues.paymentStatus,
        }
        try {
              await generatedPaymentDetails(criteria);
              setShowViewPaymentConfirmation(false);
            } catch (error) {
              console.error('Error fetching activities:', error);
            }
    }

    return (
        <Container sx={{ maxHeight: '80vh', overflowY: 'auto', p: 2 }}>
            <Box>
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                    <TextField
                        fullWidth
                        label="voucherId"
                        name="voucherId"
                        placeholder="voucherId"
                        value={formValues.voucherId}
                        onChange={handleChange}
                        margin="normal"
                        required
                        error={!!errors.voucherId}
                        helperText={errors.voucherId}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSearch(formValues.voucherId)} // Call your search function here
                    >
                        Find
                    </Button>
                </Box>

                <TextField
                    fullWidth
                    label="payeeName"
                    name="payeeName"
                    placeholder="payeeName"
                    value={formValues.payeeName}
                    margin="normal"
                    required
                    error={!!errors.payeeName}
                    helperText={errors.payeeName}
                />

                <TextField
                    fullWidth
                    label="accountNumber"
                    name="accountNumber"
                    placeholder="accountNumber"
                    value={formValues.accountNumber}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!errors.accountNumber}
                    helperText={errors.accountNumber}
                />

                <TextField
                    fullWidth
                    label="amount"
                    name="amount"
                    placeholder="amount"
                    value={formValues.amount}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!errors.amount}
                    helperText={errors.amount}
                />

                <TextField
                    fullWidth
                    label="transactionId"
                    name="transactionId"
                    placeholder="transactionId"
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!errors.transactionId}
                    helperText={errors.transactionId}
                />

                <TextField
                    fullWidth
                    label="taskNames"
                    name="taskNames"
                    placeholder="taskNames"
                    value={formValues.taskNames}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!errors.taskNames}
                    helperText={errors.taskNames}
                />

                <TextField
                    fullWidth
                    label="bankInfo"
                    name="bankInfo"
                    placeholder="bankInfo"
                    value={formValues.bankInfo}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!errors.bankInfo}
                    helperText={errors.bankInfo}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Payment Status</InputLabel>
                    <Select
                        name="paymentStatus"
                        value={formValues.paymentStatus}
                        onChange={
                            handleChange
                        }
                        required
                    >
                        <MenuItem value="">Select Payment status</MenuItem>
                        {status.map((status, id) => (
                            <MenuItem key={id} value={status} >
                                {status}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Payment Mode</InputLabel>
                    <Select
                        name="paymentMode"
                        value={formValues.paymentMode}
                        onChange={
                            handleChange
                        }
                        required
                    >
                        <MenuItem value="">Select Payment mode</MenuItem>
                        {modes.map((mode, id) => (
                            <MenuItem key={id} value={mode} >
                                {mode}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    sx={{ marginTop: 2 }}
                >
                    Save
                </Button>
            </Box>
        </Container>
    )
}


export default AOPaymentTable;
