import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    IconButton,
    Modal,
    Box,
    TextField,
    Button
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { useAuth } from '../PrivateRoute';
import { exportPaymentDetails, flagVoucherAmountDispute } from '../DataCenter/apiService';
import { useNotification } from '../Common/useNotification';

const AODashboardTable = ({ beneficiaries ,date, setDate}) => {
    const { userId } = useAuth();
    const { showSuccess, showError } = useNotification();
    const [flagModal, setFlagModal] = useState({ open: false, voucherId: null });
    const [flagForm, setFlagForm] = useState({ correctAmount: '', justification: '' });
    const [flagErrors, setFlagErrors] = useState({});

    const handleOpenFlagModal = (voucherId) => {
        setFlagModal({ open: true, voucherId });
        setFlagForm({ correctAmount: '', justification: '' });
        setFlagErrors({});
    };

    const handleCloseFlagModal = () => setFlagModal({ open: false, voucherId: null });

    const handleFlagSubmit = async () => {
        const errors = {};
        if (!flagForm.correctAmount || isNaN(flagForm.correctAmount) || Number(flagForm.correctAmount) <= 0)
            errors.correctAmount = 'Enter a valid correct amount';
        if (!flagForm.justification.trim())
            errors.justification = 'Justification is required';
        if (Object.keys(errors).length) { setFlagErrors(errors); return; }
        try {
            await flagVoucherAmountDispute(userId, flagModal.voucherId, Number(flagForm.correctAmount), flagForm.justification.trim());
            showSuccess('Amount dispute flagged. VC/Secretary will be notified.');
            handleCloseFlagModal();
        } catch (err) {
            showError(err?.response?.data || err?.message || 'Failed to flag amount dispute');
        }
    };

    const exportToExcel = async () => {
        try {
            console.log("ok");
            const data = await exportPaymentDetails(userId, date);
            alert(data);
            console.log(beneficiaries);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    }
    return (
        <>
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }} className="listContainer">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Typography variant="h4" gutterBottom style={{ color: '#555' }}>
                    Payment Details
                </Typography>
                <IconButton onClick={exportToExcel} >
                    <DownloadIcon />
                </IconButton>
            </div>
            <TableContainer component={Paper} elevation={3} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <Table aria-label="beneficiary table">
                    <TableHead style={{ backgroundColor: '#f0f0f0' }}>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Date/Time</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Payee Name</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Payee Account Details</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Account Head</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Total Amount</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Voucher</TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }}>Flag Issue</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {beneficiaries?.map((beneficiary, beneficiaryIndex) => (
                            <TableRow hover key={beneficiaryIndex}>
                                <TableCell>{beneficiary.paymentTimestamp}</TableCell>
                                <TableCell>{beneficiary.payeeName}</TableCell>
                                <TableCell>{beneficiary.payeeAccountInfo}</TableCell>
                                <TableCell>{beneficiary.headOfAcount}</TableCell>
                                <TableCell>{beneficiary.amount}</TableCell>
                                            <TableCell>
                                                <a
                                                    href={beneficiary.voucherUrl}
                                                    download={beneficiary.voucherUrl}
                                                    style={{
                                                        textDecoration: 'underline',
                                                        color: '#007BFF',
                                                    }}
                                                >
                                                    {beneficiary.voucherId}
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                {beneficiary.voucherStatus === 'VERIFYING' && (
                                                    <IconButton
                                                        size="small"
                                                        color="warning"
                                                        title="Report Amount Issue"
                                                        onClick={() => handleOpenFlagModal(beneficiary.voucherId)}
                                                    >
                                                        <ReportProblemOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

        <Modal open={flagModal.open} onClose={handleCloseFlagModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 420,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ReportProblemOutlinedIcon color="warning" />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Report Amount Issue</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Flag a potential amount mismatch on this voucher. VC / Secretary will see this remark before approving or rejecting.
                    </Typography>
                    <TextField
                        fullWidth
                        label="Correct Amount (₹)"
                        type="number"
                        value={flagForm.correctAmount}
                        onChange={(e) => setFlagForm(prev => ({ ...prev, correctAmount: e.target.value }))}
                        margin="normal"
                        required
                        error={!!flagErrors.correctAmount}
                        helperText={flagErrors.correctAmount}
                        inputProps={{ min: 0, step: '0.01' }}
                    />
                    <TextField
                        fullWidth
                        label="Justification / Reason"
                        multiline
                        rows={3}
                        value={flagForm.justification}
                        onChange={(e) => setFlagForm(prev => ({ ...prev, justification: e.target.value }))}
                        margin="normal"
                        required
                        error={!!flagErrors.justification}
                        helperText={flagErrors.justification}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        <Button variant="outlined" onClick={handleCloseFlagModal}>Cancel</Button>
                        <Button variant="contained" color="warning" onClick={handleFlagSubmit}>Submit Flag</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default AODashboardTable;
