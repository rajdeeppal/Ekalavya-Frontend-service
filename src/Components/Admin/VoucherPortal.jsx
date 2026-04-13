import React, { useState } from 'react';
import {
  Card,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
  Divider
} from '@mui/material';

import { getVoucherInfo, revertVoucher } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';

const VoucherPortal = () => {

  const { userId } = useAuth();

  const [searchId, setSearchId] = useState('');
  const [voucherData, setVoucherData] = useState(null);
  const [remarks, setRemarks] = useState('');

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showSnackbar = (message, severity) =>
    setSnackbar({ open: true, message, severity });

  const handleSearch = async () => {
    if (!searchId) {
      showSnackbar('Voucher Id is required', 'error');
      return;
    }
    try {
      const data = await getVoucherInfo(searchId);
      setVoucherData(data);
      setRemarks('');
    } catch (error) {
      setVoucherData(null);
      const msg = error.response?.data;
      showSnackbar(
        typeof msg === 'string' ? msg : error.message || 'Error fetching voucher details',
        'error'
      );
    }
  };

  const handleRevert = async () => {
    if (!remarks) {
      showSnackbar('Remarks are mandatory', 'error');
      return;
    }
    try {
      await revertVoucher(userId, searchId, remarks);
      showSnackbar('Voucher reverted successfully', 'success');
      setVoucherData(null);
      setSearchId('');
      setRemarks('');
    } catch (error) {
      const msg = error.response?.data;
      showSnackbar(
        typeof msg === 'string' ? msg : error.message || 'Error reverting voucher',
        'error'
      );
    }
  };

  return (
    <Card sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Voucher Portal
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="Voucher Id"
          size="small"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {voucherData && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Divider />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">Payee Name</Typography>
            <Typography variant="body2">{voucherData.payeeName}</Typography>

            <Typography variant="body2" color="text.secondary">Account Number</Typography>
            <Typography variant="body2">{voucherData.accountNumber}</Typography>

            <Typography variant="body2" color="text.secondary">Amount</Typography>
            <Typography variant="body2">{voucherData.amount}</Typography>

            <Typography variant="body2" color="text.secondary">Bank Info</Typography>
            <Typography variant="body2">{voucherData.bankInfo}</Typography>

            <Typography variant="body2" color="text.secondary">Last Payment Note</Typography>
            <Typography variant="body2">{voucherData.lastPaymentNote}</Typography>
          </Box>

          <TextField
            label="Remarks"
            size="small"
            multiline
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            required
            fullWidth
          />

          <Button variant="contained" color="error" onClick={handleRevert}>
            Revert Voucher
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default VoucherPortal;