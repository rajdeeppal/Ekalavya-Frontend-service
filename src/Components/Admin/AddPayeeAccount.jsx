import React, { useState } from 'react';
import {
  Card, Typography, TextField, Button, Checkbox, FormControlLabel,
  Alert, IconButton, Box, Snackbar, InputAdornment, CircularProgress, Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createPayeeAccount, updatePayeeAccount, getPayeeAccountByAccountNumber, searchPayeeAccounts } from '../DataCenter/apiService';

const initialForm = {
  accountNumber: '',
  payeeName: '',
  bankName: '',
  ifscCode: '',
  branchName: '',
  protectPassbookDoc: false,
};

const AddPayeeAccount = () => {
  const [form, setForm] = useState(initialForm);
  const [passbookDoc, setPassbookDoc] = useState(null);
  const [existingPassbookDoc, setExistingPassbookDoc] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPassbookDoc(file);
  };

  const handleRemoveFile = () => setPassbookDoc(null);

  const handleSearchInput = async (searchValue) => {
    if (!searchValue || searchValue.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const response = await searchPayeeAccounts(searchValue, 0, 10);
      setSearchResults(response.content || []);
    } catch (error) {
      console.error('Error searching accounts:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAccountSelect = async (account) => {
    if (!account) return;
    
    setSearchLoading(true);
    try {
      const response = await getPayeeAccountByAccountNumber(account.accountNumber);
      setForm({
        accountNumber: response.accountNumber || '',
        payeeName: response.payeeName || '',
        bankName: response.bankName || '',
        ifscCode: response.ifscCode || '',
        branchName: response.branchName || '',
        protectPassbookDoc: response.protectPassbookDoc || false,
      });
      setAccountId(response.id);
      if (response.passbookDocName && response.url) {
        setExistingPassbookDoc({
          passbookDocName: response.passbookDocName,
          url: response.url
        });
      } else {
        setExistingPassbookDoc(null);
      }
      setPassbookDoc(null);
      setIsEditMode(true);
      setSnackbar({ open: true, message: 'Account found!', severity: 'success' });
    } catch (error) {
      const errorMessage = typeof error.response?.data === 'string'
        ? error.response.data
        : error.response?.data?.message || error.message || 'Account not found.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setPassbookDoc(null);
    setExistingPassbookDoc(null);
    setIsEditMode(false);
    setAccountId(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('PayeeAccountRequest', JSON.stringify(form));
      if (passbookDoc) formData.append('passbookDoc', passbookDoc);
      
      if (isEditMode && accountId) {
        await updatePayeeAccount(accountId, formData);
        setSnackbar({ open: true, message: 'Payee account updated successfully!', severity: 'success' });
      } else {
        await createPayeeAccount(formData);
        setSnackbar({ open: true, message: 'Payee account created successfully!', severity: 'success' });
      }
      handleReset();
    } catch (error) {
      const errorMessage = typeof error.response?.data === 'string'
        ? error.response.data
        : error.response?.data?.message || error.message || 'Error saving payee account.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  return (
    <Card sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {isEditMode ? 'Edit Bank Account' : 'Add Bank Account'}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Autocomplete
          freeSolo
          options={searchResults}
          loading={searchLoading}
          getOptionLabel={(option) => option.accountNumber || ''}
          onInputChange={(event, value) => handleSearchInput(value)}
          onChange={(event, value) => handleAccountSelect(value)}
          renderOption={(props, option) => (
            <li {...props}>
              <div>
                <div><strong>{option.accountNumber}</strong></div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  {option.payeeName} - {option.bankName}
                </div>
              </div>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search by Account Number"
              size="small"
              placeholder="Type to search account number"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {searchLoading ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <TextField
          label="Account Number"
          size="small"
          value={form.accountNumber}
          onChange={e => handleChange('accountNumber', e.target.value)}
          disabled={isEditMode}
        />
        <TextField label="Payee Name" size="small" value={form.payeeName}
          onChange={e => handleChange('payeeName', e.target.value)} />
        <TextField label="Bank Name" size="small" value={form.bankName}
          onChange={e => handleChange('bankName', e.target.value)} />
        <TextField label="IFSC Code" size="small" value={form.ifscCode}
          onChange={e => handleChange('ifscCode', e.target.value)} />
        <TextField label="Branch Name" size="small" value={form.branchName}
          onChange={e => handleChange('branchName', e.target.value)} />

        <Box>
          <Typography variant="body2" sx={{ mb: 0.5 }}>Passbook Document</Typography>
          {existingPassbookDoc && !passbookDoc && (
            <Alert severity="success" sx={{ mb: 1 }}>
              Current: <a
                href={existingPassbookDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline', color: 'blue' }}
              >
                {existingPassbookDoc.passbookDocName}
              </a>
            </Alert>
          )}
          {!passbookDoc ? (
            <Button variant="contained" component="label" size="small">
              {isEditMode ? 'Replace Document' : 'Upload'}
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          ) : (
            <Alert severity="info" action={
              <IconButton size="small" color="inherit" onClick={handleRemoveFile}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }>
              {passbookDoc.name}
            </Alert>
          )}
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={form.protectPassbookDoc}
              onChange={e => handleChange('protectPassbookDoc', e.target.checked)}
            />
          }
          label="Passbook Protection"
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {isEditMode ? 'Update' : 'Submit'}
          </Button>
          {isEditMode && (
            <Button variant="outlined" color="secondary" onClick={handleReset}>
              Cancel
            </Button>
          )}
        </Box>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default AddPayeeAccount;
