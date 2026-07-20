import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    Divider,
    TextField,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
    getPendingTaskDeleteRequests,
    approveTaskDeletion,
    rejectTaskDeletion,
} from '../DataCenter/apiService';
import { useSnackbar } from 'notistack';

const DeleteTaskRequests = ({ onCountChange }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('approve'); // 'approve' | 'reject'
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [adminRemarks, setAdminRemarks] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPendingTaskDeleteRequests();
            setRequests(data);
            if (onCountChange) onCountChange(data.length);
        } catch (err) {
            setError('Failed to load task deletion requests. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const openDialog = (request, type) => {
        setSelectedRequest(request);
        setDialogType(type);
        setAdminRemarks('');
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedRequest(null);
        setAdminRemarks('');
    };

    const handleSubmitDecision = async () => {
        if (!selectedRequest) return;
        setSubmitting(true);
        try {
            if (dialogType === 'approve') {
                await approveTaskDeletion(selectedRequest.requestId, adminRemarks);
                enqueueSnackbar(`✅ Task "${selectedRequest.taskName}" deleted permanently.`, { variant: 'success' });
            } else {
                await rejectTaskDeletion(selectedRequest.requestId, adminRemarks);
                enqueueSnackbar(`↩ Task "${selectedRequest.taskName}" restored to active.`, { variant: 'info' });
            }
            await fetchRequests();
            handleDialogClose();
        } catch (err) {
            const msg = err.response?.data || 'An error occurred. Please try again.';
            enqueueSnackbar(msg, { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
                <Typography sx={{ ml: 2, color: '#555' }}>Loading task delete requests...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
                <Button size="small" sx={{ ml: 2 }} onClick={fetchRequests}>Retry</Button>
            </Alert>
        );
    }

    if (requests.length === 0) {
        return (
            <Box textAlign="center" mt={6}>
                <CheckCircleIcon sx={{ fontSize: 64, color: '#43a047', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    No pending task deletion requests.
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                    All task deletion requests have been reviewed.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight={700} color="#b71c1c">
                    🗑️ Task Deletion Requests
                </Typography>
                <Chip
                    label={`${requests.length} Pending`}
                    color="error"
                    sx={{ fontWeight: 700, fontSize: '0.95rem', px: 1 }}
                />
            </Box>

            <Grid container spacing={3}>
                {requests.map((req) => (
                    <Grid item xs={12} key={req.requestId}>
                        <Card
                            elevation={3}
                            sx={{
                                borderLeft: '5px solid #e53935',
                                borderRadius: '12px',
                                transition: 'box-shadow 0.2s',
                                '&:hover': { boxShadow: 8 },
                            }}
                        >
                            <CardContent>
                                {/* Header */}
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700} color="#c62828">
                                            {req.taskName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {req.projectName} › {req.beneficiaryName} › {req.componentName} › {req.activityName}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        icon={<WarningAmberIcon />}
                                        label="PENDING"
                                        color="warning"
                                        size="small"
                                        sx={{ fontWeight: 700 }}
                                    />
                                </Box>

                                <Divider sx={{ my: 1.5 }} />

                                {/* Task Details Grid */}
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    {[
                                        { label: 'Type of Unit', value: req.typeOfUnit },
                                        { label: 'Sanctioned Units', value: req.units },
                                        { label: 'Rate per Unit (₹)', value: req.ratePerUnit?.toFixed(4) },
                                        { label: 'Total Cost (₹)', value: req.totalCost?.toFixed(4) },
                                        { label: 'Grant Amount (₹)', value: req.grantAmount?.toFixed(4) },
                                        { label: 'Beneficiary Contribution (₹)', value: req.beneficiaryContribution?.toFixed(4) },
                                        { label: 'Year of Sanction', value: req.yearOfSanction },
                                        { label: 'Unit Balance', value: req.unitRemain },
                                        { label: 'Grant Balance (₹)', value: req.balanceRemaining?.toFixed(4) },
                                        { label: 'Ben. Contribution Balance (₹)', value: req.beneficiaryContributionRemain?.toFixed(4) },
                                    ].map(({ label, value }) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={label}>
                                            <Box sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px', p: 1.5 }}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {label}
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {value ?? '—'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Associated Job IDs */}
                                <Box mt={1}>
                                    <Typography variant="body2" color="text.secondary" fontWeight={600} mb={0.5}>
                                        Associated Job IDs ({req.associatedJobIds?.length ?? 0}):
                                    </Typography>
                                    {req.associatedJobIds?.length > 0 ? (
                                        <Box display="flex" gap={1} flexWrap="wrap">
                                            {req.associatedJobIds.map((jobId) => (
                                                <Chip
                                                    key={jobId}
                                                    label={`Job #${jobId}`}
                                                    size="small"
                                                    sx={{ backgroundColor: '#e3f2fd', fontWeight: 600 }}
                                                />
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No associated job updates.
                                        </Typography>
                                    )}
                                </Box>

                                <Divider sx={{ my: 1.5 }} />

                                {/* Request Metadata */}
                                <Box display="flex" gap={3} flexWrap="wrap">
                                    <Typography variant="caption" color="text.secondary">
                                        <strong>Requested by:</strong> {req.requestedByEmpId}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        <strong>Requested at:</strong> {formatDate(req.requestedAt)}
                                    </Typography>
                                </Box>
                            </CardContent>

                            <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<CheckCircleIcon />}
                                    sx={{
                                        backgroundColor: '#2e7d32',
                                        '&:hover': { backgroundColor: '#1b5e20' },
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                    }}
                                    onClick={() => openDialog(req, 'approve')}
                                >
                                    Approve & Delete
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                    sx={{
                                        color: '#c62828',
                                        borderColor: '#c62828',
                                        '&:hover': { backgroundColor: 'rgba(198,40,40,0.06)', borderColor: '#b71c1c' },
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                    }}
                                    onClick={() => openDialog(req, 'reject')}
                                >
                                    Reject (Restore Task)
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{
                    color: dialogType === 'approve' ? '#1b5e20' : '#b71c1c',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                }}>
                    {dialogType === 'approve'
                        ? '✅ Approve Task Deletion'
                        : '↩ Reject Deletion & Restore Task'}
                </DialogTitle>
                <DialogContent>
                    {selectedRequest && (
                        <Box>
                            <Alert
                                severity={dialogType === 'approve' ? 'warning' : 'info'}
                                sx={{ mb: 2 }}
                            >
                                {dialogType === 'approve'
                                    ? `You are about to permanently delete task "${selectedRequest.taskName}" and all its ${selectedRequest.associatedJobIds?.length ?? 0} job update(s). This action CANNOT be undone.`
                                    : `You are about to reject the delete request for task "${selectedRequest.taskName}". The task will be restored to active status for the PM.`}
                            </Alert>
                            <TextField
                                label="Admin Remarks (Optional)"
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                value={adminRemarks}
                                onChange={(e) => setAdminRemarks(e.target.value)}
                                placeholder="Add any notes for the PM..."
                                sx={{ mt: 1 }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleDialogClose} variant="outlined" disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disabled={submitting}
                        onClick={handleSubmitDecision}
                        sx={{
                            backgroundColor: dialogType === 'approve' ? '#2e7d32' : '#c62828',
                            '&:hover': {
                                backgroundColor: dialogType === 'approve' ? '#1b5e20' : '#b71c1c',
                            },
                            fontWeight: 700,
                        }}
                        startIcon={submitting
                            ? <CircularProgress size={16} color="inherit" />
                            : dialogType === 'approve' ? <CheckCircleIcon /> : <CancelIcon />}
                    >
                        {submitting
                            ? 'Processing...'
                            : dialogType === 'approve' ? 'Confirm Delete' : 'Confirm Reject'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DeleteTaskRequests;
