import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, Divider, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

const JobDetailsDialog = ({ open, onClose, jobData }) => {
  if (!jobData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Job Details
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Divider sx={{ mb: 2 }} />
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
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsDialog;
