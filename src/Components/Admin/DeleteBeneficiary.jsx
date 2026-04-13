import React, { useState } from 'react';
import {
  Card,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import {
  deleteBeneficiaryByAadhar,
  searchBeneficiariesByAadhar
} from '../DataCenter/apiService';

const DeleteBeneficiary = () => {

  const [aadharNumber, setAadharNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleAadharSearch = async (value) => {

    if (!value || value.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);

    try {
      const response = await searchBeneficiariesByAadhar(value, 0, 10);
      setSearchResults(response.content || []);
    } catch (error) {
      console.error("Error searching aadhar:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelect = (selected) => {
    if (!selected) {
      setSelectedBeneficiary(null);
      setAadharNumber('');
      return;
    }

    setSelectedBeneficiary(selected);
    setAadharNumber(selected.aadharNumber?.toString());
  };

  const handleDelete = async () => {
    setConfirmOpen(false);
    if (!aadharNumber || aadharNumber.toString().length !== 12) {
      setSnackbar({
        open: true,
        message: 'Please select valid 12-digit Aadhar number',
        severity: 'error'
      });
      return;
    }

    setLoading(true);

    try {

      const response = await deleteBeneficiaryByAadhar(aadharNumber);

      setSnackbar({
        open: true,
        message: response,
        severity: 'success'
      });

      setAadharNumber('');
      setSelectedBeneficiary(null);
      setSearchResults([]);

    } catch (error) {

      const errorMessage =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message ||
          error.message ||
          'Error deleting beneficiary.';

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Delete Beneficiary
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        <Autocomplete
          value={selectedBeneficiary}
          options={searchResults}
          loading={searchLoading}
          getOptionLabel={(option) =>
            option?.aadharNumber?.toString() || ''
          }
          onInputChange={(event, value) => handleAadharSearch(value)}
          onChange={(event, value) => handleSelect(value)}
          renderOption={(props, option) => (
            <li {...props}>
              <div>
                <div>
                  <strong>{option.aadharNumber}</strong>
                </div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  {option.beneficiaryName} - {option.villageName}
                </div>
              </div>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Aadhar Number"
              size="small"
              placeholder="Type Aadhar Number"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {searchLoading ? (
                      <CircularProgress size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <Button
          variant="contained"
          color="error"
          onClick={() => setConfirmOpen(true)}
          disabled={loading || !aadharNumber}
        >
          {loading
            ? <CircularProgress size={24} />
            : 'Delete Beneficiary'}
        </Button>

      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
          <WarningAmberIcon color="error" /> Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to permanently delete the beneficiary with Aadhar number <strong>{aadharNumber}</strong>.
            {selectedBeneficiary && <><br />Name: <strong>{selectedBeneficiary.beneficiaryName}</strong> — Village: <strong>{selectedBeneficiary.villageName}</strong>.</>}
            <br /><br />
            This action is <strong>irreversible</strong>. Please confirm to proceed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" startIcon={<DeleteForeverIcon />}>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar(s => ({ ...s, open: false }))
        }
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Card>
  );
};

export default DeleteBeneficiary;