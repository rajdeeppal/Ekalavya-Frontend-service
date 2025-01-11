import React, { useState } from 'react';
import {
    Box,
    Container,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
} from '@mui/material';
import { getVoucherDetails, generatedPaymentDetails } from '../DataCenter/apiService';

function AOPaymentTable({ setShowViewPaymentConfirmation, setIsSucess }) {
    const [formValues, setFormValues] = useState({
        voucherId: '',
        payeeName: '',
        accountNumber: '',
        amount: '',
        taskNames: [],
        bankInfo: '',
        transactionId: '',
        paymentMode: '',
        paymentStatus: '',
    });
    const [showForm, setShowFrom] = useState(false);
    const [errors, setErrors] = useState({});
    const [backendMessage, setBackendMessage] = useState('');
    const status = ['SUCCESS', 'FAILED', 'ONHOLD'];
    const modes = ['Online', 'Cheque', 'Cash'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

const handleSearch = async (value) => {
  if (!value) {
    setErrors((prevErrors) => ({ ...prevErrors, voucherId: 'Voucher ID is required' }));
    return;
  }

  try {
    const response = await getVoucherDetails(value);

    if (response.status === 200) {
      const data = response.data;

      // Populate the form with the received data
      setFormValues({
        ...formValues,
        voucherId: data.voucherId,
        payeeName: data.payeeName,
        accountNumber: data.accountNumber,
        amount: data.amount,
        taskNames: data.taskNames,
        bankInfo: data.bankInfo,
      });

      setShowFrom(true); // Show the form
      setBackendMessage(data.lastPaymentNote || ''); // Set backend message
    }
  } catch (error) {
    // Handle errors, including non-200 responses
    console.error('Error fetching voucher details:', error);

    const errorMessage = error.response?.data || 'Failed to fetch voucher details. Please try again later.';
    setShowFrom(false);
    setBackendMessage(errorMessage); // Display error message
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
        };

        try {
            await generatedPaymentDetails(criteria);
            setShowFrom(false);
            setIsSucess(true);
            setShowViewPaymentConfirmation(false);
        } catch (error) {
            setIsSucess(true);
            alert(error);
            console.error('Error saving payment details:', error);
        }
    };

    return (
        <Container sx={{ maxHeight: '80vh', overflowY: 'auto', p: 2 }}>
            <Box>
                {/* Display Warning or Info Message */}
                {backendMessage && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        {backendMessage}
                    </Alert>
                )}

                {/* Voucher ID Input */}
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                    <TextField
                        fullWidth
                        label="Voucher ID"
                        name="voucherId"
                        placeholder="Enter Voucher ID"
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
                        onClick={() => handleSearch(formValues.voucherId)} // Call the search function
                    >
                        Find
                    </Button>
                </Box>

                {/* Conditionally Render Form */}
                {showForm && (
                    <Box>
                        <TextField
                            fullWidth
                            label="Payee Name"
                            name="payeeName"
                            placeholder="Payee Name"
                            value={formValues.payeeName}
                            margin="normal"
                            required
                            error={!!errors.payeeName}
                            helperText={errors.payeeName}
                            InputProps={{ readOnly: true }}
                        />

                        <TextField
                            fullWidth
                            label="Account Number"
                            name="accountNumber"
                            placeholder="Account Number"
                            value={formValues.accountNumber}
                            margin="normal"
                            required
                            error={!!errors.accountNumber}
                            helperText={errors.accountNumber}
                            InputProps={{ readOnly: true }}
                        />

                        <TextField
                            fullWidth
                            label="Amount"
                            name="amount"
                            placeholder="Amount"
                            value={formValues.amount}
                            margin="normal"
                            required
                            error={!!errors.amount}
                            helperText={errors.amount}
                            InputProps={{ readOnly: true }}
                        />

                        <TextField
                            fullWidth
                            label="Transaction ID"
                            name="transactionId"
                            placeholder="Transaction ID"
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!errors.transactionId}
                            helperText={errors.transactionId}
                        />

                        <TextField
                            fullWidth
                            label="Task Names"
                            name="taskNames"
                            placeholder="Task Names"
                            value={formValues.taskNames.join(', ')}
                            margin="normal"
                            required
                            error={!!errors.taskNames}
                            helperText={errors.taskNames}
                            InputProps={{ readOnly: true }}
                        />

                        <TextField
                            fullWidth
                            label="Bank Info"
                            name="bankInfo"
                            placeholder="Bank Info"
                            value={formValues.bankInfo}
                            margin="normal"
                            required
                            error={!!errors.bankInfo}
                            helperText={errors.bankInfo}
                            InputProps={{ readOnly: true }}
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Payment Status</InputLabel>
                            <Select
                                name="paymentStatus"
                                value={formValues.paymentStatus}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="">Select Payment Status</MenuItem>
                                {status.map((status, id) => (
                                    <MenuItem key={id} value={status}>
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
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="">Select Payment Mode</MenuItem>
                                {modes.map((mode, id) => (
                                    <MenuItem key={id} value={mode}>
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
                )}
            </Box>
        </Container>
    );
}

export default AOPaymentTable;