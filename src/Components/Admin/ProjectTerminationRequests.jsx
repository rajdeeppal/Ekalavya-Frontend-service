import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Chip, TextField, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { jwtDecode } from 'jwt-decode';
import {
  getPendingTerminationRequests,
  approveTerminationRequest,
  rejectTerminationRequest,
  getPendingTerminationCount
} from '../DataCenter/apiService';

const ProjectTerminationRequests = ({ onCountChange }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false, type: null, requestId: null, projectName: '' });
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const adminEmpId = (() => {
    try { return jwtDecode(localStorage.getItem('jwtToken')).empId; } catch { return null; }
  })();

  const load = useCallback(() => {
    setLoading(true);
    getPendingTerminationRequests()
      .then(data => {
        setRequests(data);
        onCountChange?.(data.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [onCountChange]);

  useEffect(() => { load(); }, [load]);

  const openDialog = (type, requestId, projectName) => {
    setDialog({ open: true, type, requestId, projectName });
    setRemarks('');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (dialog.type === 'approve') {
        await approveTerminationRequest(dialog.requestId, adminEmpId, remarks);
      } else {
        await rejectTerminationRequest(dialog.requestId, remarks);
      }
      setDialog({ open: false });
      load();
    } catch (e) {
      alert(e?.response?.data || 'Error processing request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Box sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Project Termination Requests
        <Chip label={requests.length} color="warning" size="small" sx={{ ml: 1 }} />
      </Typography>

      {requests.length === 0 ? (
        <Typography color="text.secondary">No pending termination requests.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#3f51b5' }}>
              <TableRow>
                {['#', 'Project Name', 'Project ID', 'Requested At', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ color: '#fff', fontWeight: 700 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((req, i) => (
                <TableRow key={req.id} hover>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell fontWeight={600}>{req.project?.projectName || '—'}</TableCell>
                  <TableCell>{req.project?.projectId || '—'}</TableCell>
                  <TableCell>{req.requestedAt ? new Date(req.requestedAt).toLocaleString() : '—'}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small" variant="contained" color="success"
                        startIcon={<CheckCircleOutlineIcon />}
                        onClick={() => openDialog('approve', req.id, req.project?.projectName)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small" variant="outlined" color="error"
                        startIcon={<CancelOutlinedIcon />}
                        onClick={() => openDialog('reject', req.id, req.project?.projectName)}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialog.open} onClose={() => setDialog({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialog.type === 'approve' ? '✅ Approve Project Completion' : '❌ Reject Termination Request'}
        </DialogTitle>
        <DialogContent>
          <Typography mb={2}>
            Project: <strong>{dialog.projectName}</strong>
          </Typography>
          {dialog.type === 'approve' && (
            <Typography variant="body2" color="text.secondary" mb={2}>
              This will mark the project as <strong>COMPLETED</strong> and broadcast a notification to all users.
            </Typography>
          )}
          <TextField
            label="Remarks (optional)"
            fullWidth multiline rows={3}
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false })} disabled={submitting}>Cancel</Button>
          <Button
            variant="contained"
            color={dialog.type === 'approve' ? 'success' : 'error'}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={18} /> : (dialog.type === 'approve' ? 'Confirm Approve' : 'Confirm Reject')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectTerminationRequests;
