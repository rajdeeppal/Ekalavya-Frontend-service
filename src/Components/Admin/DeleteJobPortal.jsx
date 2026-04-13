import React, { useState } from 'react';
import {
  Card, Typography, TextField, Button, Snackbar, Alert,
  Box, Divider, Chip, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { getTaskUpdateDetails, deleteTaskUpdate } from '../DataCenter/apiService';

const Field = ({ label, value, chip }) => (
  <>
    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
      {label}
    </Typography>
    {chip
      ? <Chip label={value} size="small" sx={{ justifySelf: 'start' }}
          color={value === 'PENDING' ? 'warning' : value === 'SUCCESS' ? 'success' : 'default'} />
      : <Typography variant="body2">{value ?? '—'}</Typography>
    }
  </>
);

const DeleteJobPortal = () => {
  const [jobId, setJobId] = useState('');
  const [jobData, setJobData] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity) => setSnackbar({ open: true, message, severity });

  const handleSearch = async () => {
    if (!jobId) { showSnackbar('Job ID is required', 'error'); return; }
    try {
      const data = await getTaskUpdateDetails(jobId);
      setJobData(data);
    } catch (error) {
      setJobData(null);
      const msg = error.response?.data;
      showSnackbar(typeof msg === 'string' ? msg : error.message || 'Error fetching job details', 'error');
    }
  };

  const handleDelete = async () => {
    setConfirmOpen(false);
    try {
      const result = await deleteTaskUpdate(jobId);
      showSnackbar(result, 'success');
      setJobData(null);
      setJobId('');
    } catch (error) {
      const msg = error.response?.data;
      showSnackbar(typeof msg === 'string' ? msg : error.message || 'Error deleting job', 'error');
    }
  };

  return (
    <Card sx={{ p: 3, maxWidth: 650 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Delete Job Portal</Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="Job ID"
          size="small"
          value={jobId}
          onChange={(e) => { setJobId(e.target.value); setJobData(null); }}
          fullWidth
        />
        <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {jobData && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Divider />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', p: 2, bgcolor: '#f9f9f9', borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Field label="Task Update ID" value={jobData.taskUpdateId} />
            <Field label="Project" value={jobData.projectName} />
            <Field label="Beneficiary" value={jobData.beneficiaryName} />
            <Field label="Component" value={jobData.componentName} />
            <Field label="Activity" value={jobData.activityName} />
            <Field label="Task" value={jobData.taskName} />
            <Field label="Achievement Unit" value={jobData.achievementUnit} />
            <Field label="Current Cost" value={jobData.currentCost != null ? `₹ ${jobData.currentCost.toLocaleString()}` : '—'} />
            <Field label="Beneficiary Contribution" value={jobData.currentBeneficiaryContribution != null ? `₹ ${jobData.currentBeneficiaryContribution.toLocaleString()}` : '—'} />
            <Field label="Account Number" value={jobData.accountNumber} />
            <Field label="Payee Name" value={jobData.payeeName} />
            <Field label="Pending With" value={jobData.pendingWith} />
            <Field label="Payment Status" value={jobData.paymentStatus} chip />
            <Field label="Completed" value={jobData.isCompleted === 'Y' ? 'Yes' : 'No'} />
          </Box>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={() => setConfirmOpen(true)}
            sx={{ alignSelf: 'flex-start' }}
          >
            Delete Job
          </Button>
        </Box>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
          <WarningAmberIcon color="error" /> Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to permanently delete <strong>Job ID: {jobId}</strong>.
            {jobData && <><br />Beneficiary: <strong>{jobData.beneficiaryName}</strong> — Task: <strong>{jobData.taskName}</strong>.</>}
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
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default DeleteJobPortal;
