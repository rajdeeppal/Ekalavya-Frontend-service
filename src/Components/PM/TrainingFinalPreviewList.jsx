import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Collapse,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
    Alert,
    Box,
    Chip,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import {
    ExpandMore as ExpandMoreIcon,
    Edit as EditIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import UndoIcon from '@mui/icons-material/Undo';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import { useAuth } from '../PrivateRoute';
import { exportFinalPreviewDetails, rollbackTaskUpdateFromPreview, submitPreviewDetails } from '../DataCenter/apiService';

const TrainingFinalPreviewList = ({ beneficiaries, value, isReview, showTraining, onRefresh }) => {
    const { userId, userRole } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState({});
    const [taskDetailsOpen, setTaskDetailsOpen] = useState({});
    const [editMode, setEditMode] = useState({});
    const [newTask, setNewTask] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedTaskUpdate, setSelectedTaskUpdate] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);
    const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

    // Roles that can bypass the deleteRequestPending restriction
    const bypassRoles = ['CFO', 'VICE_CHAIRMAN', 'SECRETARY'];
    const canBypass = bypassRoles.includes(userRole);

    const showSnackbar = (message, severity) => setSnackbar({ open: true, message, severity });

    const toggleEditMode = (taskIndex, rowIndex) => {
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [`${taskIndex}-${rowIndex}`]: !prevEditMode[`${taskIndex}-${rowIndex}`],
        }));
    };

    const toggleCollapse = (index) => {
        setOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
    };

    const toggleTaskDetails = (taskIndex) => {
        setTaskDetailsOpen((prevState) => ({
            ...prevState,
            [taskIndex]: !prevState[taskIndex],
        }));
    };
const formatDateTime = (value) => {
    if (!value) return '-';

    return new Date(value).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

    const exportToExcel = async () => {
        try {
            console.log("ok");
            const data = await exportFinalPreviewDetails(userId, value);
            enqueueSnackbar(data, { variant: 'success' });
            console.log(beneficiaries);
            console.log(beneficiaries);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const handleRollbackClick = (taskUpdate) => {
        setSelectedTaskUpdate(taskUpdate);
        setConfirmOpen(true);
    };

    const handleRollbackConfirm = async () => {
        setConfirmOpen(false);
        try {
            const result = await rollbackTaskUpdateFromPreview(selectedTaskUpdate.id);
            showSnackbar(result, 'success');
            if (onRefresh) onRefresh();
        } catch (error) {
            const msg = error.response?.data;
            showSnackbar(typeof msg === 'string' ? msg : error.message || 'Error rolling back task update', 'error');
        }
        setSelectedTaskUpdate(null);
    };

    const handleSubmitClick = (beneficiary) => {
        setSelectedBeneficiary(beneficiary);
        setSubmitConfirmOpen(true);
    };

    const handleSubmitConfirm = async () => {
        setSubmitConfirmOpen(false);
        try {
            const filteredData = JSON.parse(JSON.stringify(selectedBeneficiary));
            
            // Remove unnecessary fields from taskUpdates
            filteredData.components.forEach((component) => {
                component.activities.forEach((activity) => {
                    activity.tasks.forEach((task) => {
                        task.taskUpdates?.forEach((update) => {
                            delete update.otherDocs;
                            delete update.passbookDoc;
                            delete update.createdDate;
                        });
                    });
                });
            });

            const result = await submitPreviewDetails(filteredData);
            showSnackbar(result, 'success');
            if (onRefresh) onRefresh();
        } catch (error) {
            const msg = error.response?.data;
            showSnackbar(typeof msg === 'string' ? msg : error.message || 'Error submitting preview', 'error');
        }
        setSelectedBeneficiary(null);
    };


    return (
        <div style={{ padding: '20px' }} className='listContainer'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom style={{ color: '#888' }}>
                    Preview List
                </Typography>
                <IconButton onClick={exportToExcel} >
                    <DownloadIcon />
                </IconButton>
            </div>
            <TableContainer component={Paper}>
                <Table aria-label="beneficiary table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Project Name</TableCell>
                            {showTraining === 'TRAINING_FORM' &&
                                <TableCell>Resource Person Name</TableCell>}
                            {showTraining ===  'TRAINING_FORM' && <TableCell>Training Name</TableCell>}
                            {showTraining ===  'COMMON_EXP_FORM' && <TableCell>Description</TableCell>}
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {beneficiaries?.map((beneficiary, beneficiaryIndex) => (
                            <React.Fragment key={beneficiary.id}>
                                <TableRow>
                                    <TableCell>{beneficiary.projectName}</TableCell>
                                    {showTraining === 'TRAINING_FORM' && <TableCell>{beneficiary.beneficiaryName}</TableCell>}
                                    <TableCell>{beneficiary.activityCode}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => toggleCollapse(beneficiaryIndex)}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={10} style={{ padding: 0 }}>
                                        <Collapse in={open[beneficiaryIndex]} timeout="auto" unmountOnExit>
                                            <div style={{ padding: '10px' }}>
                                                {beneficiary.components?.map((component) => (
                                                    <div key={component.id}>
                                                        <Accordion>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls={`component-content-${component.id}`}
                                                                id={`component-header-${component.id}`}
                                                            >
                                                                <Typography>{component.componentName}</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                {component.activities?.map((activity) => (
                                                                    <div key={activity.id}>
                                                                        <Accordion>
                                                                            <AccordionSummary
                                                                                expandIcon={<ExpandMoreIcon />}
                                                                                aria-controls={`activity-content-${activity.id}`}
                                                                                id={`activity-header-${activity.id}`}
                                                                            >
                                                                                <Typography>{activity.activityName}</Typography>
                                                                            </AccordionSummary>
                                                                            <AccordionDetails>
                                                                                <TableContainer
                                                                                    component={Paper}
                                                                                    sx={{
                                                                                        mb: 2,
                                                                                        overflowX: 'auto',
                                                                                        maxWidth: '100%',
                                                                                    }}
                                                                                >

                                                                                    <Table size="small" aria-label="tasks table">

                                                                                        <TableBody>
                                                                                          {activity.tasks?.map((task, taskIndex) => (
                                                                                            <React.Fragment key={task.id}>

                                                                                              {/* ================= TRAINING FORM ================= */}
                                                                                              {showTraining === 'TRAINING_FORM' && (
                                                                                                <>
                                                                                                  {/* HEADER 1 */}
                                                                                                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                                                                    <TableCell>Name of the Work</TableCell>
                                                                                                    <TableCell>Male</TableCell>
                                                                                                    <TableCell>Female</TableCell>
                                                                                                    <TableCell>Other</TableCell>
                                                                                                    <TableCell>Duration</TableCell>
                                                                                                    <TableCell>Category</TableCell>
                                                                                                    <TableCell>Venue</TableCell>
                                                                                                    <TableCell>Time From</TableCell>
                                                                                                    <TableCell>Time To</TableCell>
                                                                                                  </TableRow>

                                                                                                  {/* VALUE 1 */}
                                                                                                  <TableRow>
                                                                                                    <TableCell>{task.taskName}</TableCell>
                                                                                                    <TableCell>{task.maleCount}</TableCell>
                                                                                                    <TableCell>{task.femaleCount}</TableCell>
                                                                                                    <TableCell>{task.otherCount}</TableCell>
                                                                                                    <TableCell>{task.trainingDuration}</TableCell>
                                                                                                    <TableCell>{task.participantCategory}</TableCell>
                                                                                                    <TableCell>{task.venue}</TableCell>
                                                                                                    <TableCell>{formatDateTime(task.timeFrom)}</TableCell>
                                                                                                    <TableCell>{formatDateTime(task.timeTo)}</TableCell>
                                                                                                  </TableRow>

                                                                                                  {/* HEADER 2 */}
                                                                                                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                                                                    <TableCell>Expert Subject</TableCell>
                                                                                                    <TableCell>Unit Rate</TableCell>
                                                                                                    <TableCell>Sanction Units</TableCell>
                                                                                                    <TableCell>Unit Balance</TableCell>
                                                                                                    <TableCell>Total Cost</TableCell>
                                                                                                    <TableCell>Remain Amount</TableCell>
                                                                                                    <TableCell colSpan={3}>Actions</TableCell>
                                                                                                  </TableRow>

                                                                                                  {/* VALUE 2 */}
                                                                                                  <TableRow>
                                                                                                    <TableCell>{task.expertSubject}</TableCell>
                                                                                                    <TableCell>{task.ratePerUnit}</TableCell>
                                                                                                    <TableCell>{task.units}</TableCell>
                                                                                                    <TableCell>{task.unitRemain}</TableCell>
                                                                                                    <TableCell>{task.totalCost}</TableCell>
                                                                                                    <TableCell>{task.balanceRemaining}</TableCell>
                                                                                                    <TableCell colSpan={3}>
                                                                                                      <Button
                                                                                                        variant="outlined"
                                                                                                        color="primary"
                                                                                                        onClick={() => toggleTaskDetails(task.id)}
                                                                                                      >
                                                                                                        View
                                                                                                      </Button>
                                                                                                    </TableCell>
                                                                                                  </TableRow>
                                                                                                </>
                                                                                              )}

                                                                                              {/* ================= COMMON EXP FORM ================= */}
                                                                                              {showTraining === 'COMMON_EXP_FORM' && (
                                                                                                <>
                                                                                                  {/* HEADER */}
                                                                                                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                                                                    <TableCell>Name of the Work</TableCell>
                                                                                                    <TableCell>Type of Unit</TableCell>
                                                                                                    <TableCell>Unit Rate</TableCell>
                                                                                                    <TableCell>Sanction Units</TableCell>
                                                                                                    <TableCell>Unit Balance</TableCell>
                                                                                                    <TableCell>Total Cost</TableCell>
                                                                                                    <TableCell>Community Contribution Balance</TableCell>
                                                                                                    <TableCell>Remain Amount</TableCell>
                                                                                                    <TableCell>Actions</TableCell>
                                                                                                  </TableRow>

                                                                                                  {/* VALUE */}
                                                                                                  <TableRow>
                                                                                                    <TableCell>{task.taskName}</TableCell>
                                                                                                    <TableCell>{task.typeOfUnit}</TableCell>
                                                                                                    <TableCell>{task.ratePerUnit}</TableCell>
                                                                                                    <TableCell>{task.units}</TableCell>
                                                                                                    <TableCell>{task.unitRemain}</TableCell>
                                                                                                    <TableCell>{task.totalCost}</TableCell>
                                                                                                    <TableCell>{task.beneficiaryContributionRemain}</TableCell>
                                                                                                    <TableCell>{task.balanceRemaining}</TableCell>
                                                                                                    <TableCell>
                                                                                                      <Button
                                                                                                        variant="outlined"
                                                                                                        color="primary"
                                                                                                        onClick={() => toggleTaskDetails(task.id)}
                                                                                                      >
                                                                                                        View
                                                                                                      </Button>
                                                                                                    </TableCell>
                                                                                                  </TableRow>
                                                                                                </>
                                                                                              )}
                                                                                                    <TableRow>
                                                                                                        <TableCell colSpan={9} style={{ padding: 0 }}>
                                                                                                            <Collapse
                                                                                                                in={taskDetailsOpen[task.id]}
                                                                                                                timeout="auto"
                                                                                                                unmountOnExit
                                                                                                            >
                                                                                                                <div style={{ padding: '10px' }}>
                                                                                                                    <TableContainer
                                                                                                                        component={Paper}
                                                                                                                        sx={{
                                                                                                                            mb: 2,
                                                                                                                            overflowX: 'auto',
                                                                                                                            maxWidth: '100%',
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <Table
                                                                                                                            size="small"
                                                                                                                            aria-label="task details table"
                                                                                                                            sx={{
                                                                                                                                tableLayout: 'fixed',
                                                                                                                                minWidth: 1200,
                                                                                                                            }}
                                                                                                                        >
                                                                                                                            <TableHead sx={{
                                                                                                                                           position: 'sticky',
                                                                                                                                           top: 0,
                                                                                                                                           backgroundColor: '#fafafa',
                                                                                                                                           zIndex: 1,
                                                                                                                                       }}>
                                                                                                                                <TableRow>
                                                                                                                                <TableCell sx={{ minWidth: 120 }}>Job Id</TableCell>
                                                                                                                                    <TableCell sx={{ minWidth: 120 }}>Unit Achievement</TableCell>
                                                                                                                                    <TableCell sx={{ minWidth: 130 }}>Discounted Rate</TableCell>

                                                                                                                                    {showTraining === 'COMMON_EXP_FORM' && (
                                                                                                                                        <TableCell sx={{ minWidth: 160 }}>
                                                                                                                                            Community Contribution
                                                                                                                                        </TableCell>
                                                                                                                                    )}

                                                                                                                                    <TableCell sx={{ minWidth: 120 }}>Current Cost</TableCell>
                                                                                                                                    <TableCell sx={{ minWidth: 150 }}>Procurement Check</TableCell>
                                                                                                                                    <TableCell sx={{ minWidth: 140 }}>Payee Name</TableCell>
                                                                                                                                    <TableCell sx={{ minWidth: 160 }}>Account Details</TableCell>
                                                                                                                                    <TableCell sx={{ minWidth: 160 }}>Passbook Copy</TableCell>
                                                                                                                                    <TableCell sx={{ minWidth: 180 }}>Other Document</TableCell>

                                                                                                                                    {isReview && <TableCell sx={{ minWidth: 140 }}>Pending With</TableCell>}
                                                                                                                                    {isReview && <TableCell sx={{ minWidth: 140 }}>Payment Status</TableCell>}
                                                                                                                                    {!isReview && <TableCell sx={{ minWidth: 160 }}>Actions</TableCell>}
                                                                                                                                </TableRow>
                                                                                                                            </TableHead>
                                                                                                                            <TableBody>
                                                                                                                                {(task.taskUpdates || [])?.map((row, rowIndex) => (
                                                                                                                                    <TableRow 
                                                                                                                                        key={rowIndex}
                                                                                                                                        sx={{
                                                                                                                                            bgcolor: row.isRejectionOccurred 
                                                                                                                                                ? 'rgba(211, 47, 47, 0.08)' 
                                                                                                                                                : 'inherit',
                                                                                                                                            borderLeft: row.isRejectionOccurred 
                                                                                                                                                ? '3px solid #d32f2f' 
                                                                                                                                                : 'none',
                                                                                                                                            '&:hover': {
                                                                                                                                                bgcolor: row.isRejectionOccurred 
                                                                                                                                                    ? 'rgba(211, 47, 47, 0.12)' 
                                                                                                                                                    : 'rgba(0, 0, 0, 0.04)',
                                                                                                                                            },
                                                                                                                                            transition: 'background-color 0.2s ease',
                                                                                                                                        }}
                                                                                                                                    >
                                                                                                                                    <TableCell sx={{ minWidth: 120 }}>{row.id}</TableCell>
                                                                                                                                        <TableCell sx={{ minWidth: 120 }}>
                                                                                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                                                                                {row.achievementUnit}
                                                                                                                                                {row.isRejectionOccurred && (
                                                                                                                                                    <Chip 
                                                                                                                                                        label="Rejected" 
                                                                                                                                                        size="small" 
                                                                                                                                                        color="error" 
                                                                                                                                                        sx={{ 
                                                                                                                                                            height: 20, 
                                                                                                                                                            fontSize: '0.7rem',
                                                                                                                                                            fontWeight: 600
                                                                                                                                                        }} 
                                                                                                                                                    />
                                                                                                                                                )}
                                                                                                                                            </Box>
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell sx={{ minWidth: 130 }}>{row.revisedRatePerUnit}</TableCell>
                                                                                                                                        {showTraining === 'COMMON_EXP_FORM' && <TableCell sx={{ minWidth: 160 }}>{row.currentBeneficiaryContribution}</TableCell>}
                                                                                                                                        <TableCell sx={{ minWidth: 120 }}>{row.currentCost}</TableCell>
                                                                                                                                        <TableCell sx={{ minWidth: 150 }}>
                                                                                                                                            <Checkbox
                                                                                                                                                checked={row.procurementCheck || false}
                                                                                                                                                disabled
                                                                                                                                            />
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell sx={{ minWidth: 140 }}>{row.payeeName}</TableCell>
                                                                                                                                        <TableCell sx={{ minWidth: 160 }}>{row.accountNumber}</TableCell>
                                                                                                                                        <TableCell sx={{ minWidth: 160 }}l>{row.passbookDoc ? (<a
                                                                                                                                            href={row.passbookDoc.downloadUrl}
                                                                                                                                            download={row.passbookDoc.downloadUrl}
                                                                                                                                            style={{
                                                                                                                                                textDecoration: 'underline',
                                                                                                                                                color: 'blue',
                                                                                                                                            }}

                                                                                                                                        >
                                                                                                                                            {row.passbookDoc.fileName}
                                                                                                                                        </a>
                                                                                                                                        ) : (
                                                                                                                                            <Typography>No Image</Typography>
                                                                                                                                        )}</TableCell>
                                                                                                                                        <TableCell sx={{ minWidth: 180 }}>
                                                                                                                                            {row.otherDocs &&
                                                                                                                                                row.otherDocs.length > 0 ? (
                                                                                                                                                row.otherDocs.map((file, idx) => (
                                                                                                                                                    <div key={idx}>
                                                                                                                                                        <a
                                                                                                                                                            href={file.downloadUrl}
                                                                                                                                                            download={file.downloadUrl}
                                                                                                                                                            style={{
                                                                                                                                                                textDecoration: 'underline',
                                                                                                                                                                color: 'blue',
                                                                                                                                                            }}
                                                                                                                                                        >
                                                                                                                                                            {file.fileName}
                                                                                                                                                        </a>
                                                                                                                                                    </div>
                                                                                                                                                ))
                                                                                                                                            ) : (
                                                                                                                                                <Typography>No File Uploaded</Typography>
                                                                                                                                            )}
                                                                                                                                        </TableCell>
                                                                                                                                        {/*{!isReview && <TableCell>{row.domainExpertEmpId}</TableCell>}*/}
                                                                                                                                        {isReview && <TableCell>{row.pendingWith}</TableCell>}
{isReview && <TableCell>{row.paymentStatus}</TableCell>}
                                                                                                                                         {!isReview && (
                                                                                                                                             <TableCell>
                                                                                                                                                 <Button
                                                                                                                                                     variant="outlined"
                                                                                                                                                     color="warning"
                                                                                                                                                     size="small"
                                                                                                                                                     startIcon={<UndoIcon />}
                                                                                                                                                     disabled={task.deleteRequestPending && !canBypass}
                                                                                                                                                     onClick={() => handleRollbackClick(row)}
                                                                                                                                                 >
                                                                                                                                                     Rollback
                                                                                                                                                 </Button>
                                                                                                                                                 {task.deleteRequestPending && !canBypass && (
                                                                                                                                                     <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                                                                                                                         ⏳ Pending Deletion - Actions Disabled
                                                                                                                                                     </Typography>
                                                                                                                                                 )}
                                                                                                                                             </TableCell>
                                                                                                                                         )}
                                                                                                                                    </TableRow>
                                                                                                                                ))}
                                                                                                                            </TableBody>
                                                                                                                        </Table>
                                                                                                                    </TableContainer>

                                                                                                                </div>
                                                                                                            </Collapse>
                                                                                                        </TableCell>
                                                                                                    </TableRow>
                                                                                                </React.Fragment>
                                                                                            ))}
                                                                                        </TableBody>
                                                                                    </Table>
                                                                                </TableContainer>
                                                                            </AccordionDetails>
                                                                        </Accordion>
                                                                    </div>
                                                                ))}
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </div>
                                                ))}

                                                {!isReview && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleSubmitClick(beneficiary)}
                                                        sx={{ mt: 2 }}
                                                    >
                                                        Submit
                                                    </Button>
                                                )}
                                            </div>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={submitConfirmOpen} onClose={() => setSubmitConfirmOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Submit Confirmation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are about to submit <strong>{selectedBeneficiary?.beneficiaryName || selectedBeneficiary?.activityCode}</strong>'s preview data to the Project Director for approval.
                        <br /><br />
                        Are you sure you want to proceed?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setSubmitConfirmOpen(false)} variant="outlined">No</Button>
                    <Button onClick={handleSubmitConfirm} variant="contained" color="primary">
                        Yes, Submit
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main' }}>
                    <WarningAmberIcon color="warning" /> Confirm Rollback
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are about to rollback <strong>Job ID: {selectedTaskUpdate?.id}</strong> from Preview back to PM.
                        <br /><br />
                        This will move the task update back to the PM stage. Are you sure you want to proceed?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setConfirmOpen(false)} variant="outlined">Cancel</Button>
                    <Button onClick={handleRollbackConfirm} variant="contained" color="warning" startIcon={<UndoIcon />}>
                        Yes, Rollback
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


        </div >
    );
};

export default TrainingFinalPreviewList;