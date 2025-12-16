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
    Box,
    Modal,
    Divider
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Reviews,
} from '@mui/icons-material';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuth } from '../PrivateRoute';
import * as XLSX from 'xlsx';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { updatedResubmitSubTask, approveDomainDetails, rejectDomainDetails } from '../DataCenter/apiService';

function ReviewTable({ beneficiaries, setBeneficiaries, isReview, setIsSucess, isCEO }) {
    const { userId } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [remarks, setRemarks] = useState('');
    const [open, setOpen] = useState({});
    const [taskDetailsOpen, setTaskDetailsOpen] = useState({});
    const [comments, setComments] = useState([]);
    const [editMode, setEditMode] = useState({});
    const [showViewConfirmation, setShowViewConfirmation] = useState(false);
    const [newTask, setNewTask] = useState(true);

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

    const handleCloseViewConfirmation = () => {
        setShowViewConfirmation(false);
    };

    const handleInputChange = (taskIndex, rowIndex, field, value) => {
        setBeneficiaries((prevBeneficiaries) => {
            return prevBeneficiaries.map((beneficiary) => ({
                ...beneficiary,
                components: beneficiary.components.map((component) => ({
                    ...component,
                    activities: component.activities.map((activity) => ({
                        ...activity,
                        tasks: activity.tasks.map((task) => {
                            if (task.id === taskIndex) {
                                const updatedTaskUpdates = [...task.taskUpdates];
                                const updatedRow = {
                                    ...updatedTaskUpdates[rowIndex],
                                    [field]: value,
                                };
                                console.log(field)

                                updatedTaskUpdates[rowIndex] = updatedRow;

                                return { ...task, taskUpdates: updatedTaskUpdates };
                            }
                            return task;
                        })
                    }))
                }))
            }));
        });
    };

    const handleSave = async (action, taskId, rowId, rowIndex) => {
        const task = beneficiaries
            .flatMap((b) => b.components.flatMap((c) => c.activities.flatMap((a) => a.tasks)))
            .find((t, i) => t.id === taskId);
        const changedData = task.taskUpdates[rowIndex];
        console.log(taskId)
        if (action === 'Approve') {
            try {
                await approveDomainDetails(userId, rowId, changedData.remarks);
                setIsSucess(true);
                console.log("User ID:", userId, "Row ID:", rowId, "Remarks:", changedData.remarks);
                alert("Tasks have been approved successfully");
            } catch (error) {
                console.error("Error approving tasks:", error);
                setIsSucess(true);
                enqueueSnackbar('An error occurred while approving the tasks. Please try again.', { variant: 'error' });
            }
        } else {
            try {
                await rejectDomainDetails(userId, rowId, changedData.remarks);
                setIsSucess(true);
                console.log("User ID:", userId, "Row ID:", rowId, "Remarks:", changedData.remarks);
                alert("Tasks have been rejected successfully");
            } catch (error) {
                console.error("Error tasks:", error);
                setIsSucess(true);
                const backendErrors = error.response?.data || 'An error occurred while rejecting the tasks. Please try again.';
                alert(backendErrors);
            }
        }
    };

    const toggleViewMode = (comments) => {
        setShowViewConfirmation(true);
        setComments(comments);
    };

    const handleReview = async (action, taskId, rowId, rowIndex) => {
        const task = beneficiaries
            .flatMap((b) => b.components.flatMap((c) => c.activities.flatMap((a) => a.tasks)))
            .find((t, i) => t.id === taskId);
        const changedData = task.taskUpdates[rowIndex];
        console.log(taskId)

        try {
            await updatedResubmitSubTask(userId, rowId, changedData.remarks);
            console.log("User ID:", userId, "Row ID:", rowId, "Remarks:", changedData.remarks);
            setIsSucess(true);
            enqueueSnackbar('Tasks have been approved successfully', { variant: 'success' });
        } catch (error) {
            console.error("Error approving tasks:", error);
            setIsSucess(true);
            const backendErrors = error.response?.data || 'An error occurred while approving the tasks. Please try again.';
            enqueueSnackbar(backendErrors, { variant: 'error' });
        }
    };
    return (
        <div style={{ padding: '20px' }} className='listContainer'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom style={{ color: '#888' }}>
                    Task List
                </Typography>
            </div>
            <TableContainer component={Paper}>
                <Table aria-label="beneficiary table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Project Name</TableCell>
                            <TableCell>Beneficiary Name</TableCell>
                            <TableCell>Father/Husband Name</TableCell>
                            <TableCell>Village Name</TableCell>
                            <TableCell>Mandal Name</TableCell>
                            <TableCell>District Name</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Aadhar Number</TableCell>
                            <TableCell>Survey No.</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {beneficiaries?.map((beneficiary, beneficiaryIndex) => (
                            <React.Fragment key={beneficiary.id}>
                                <TableRow>
                                    <TableCell>{beneficiary.projectName}</TableCell>
                                    <TableCell>{beneficiary.beneficiaryName}</TableCell>
                                    <TableCell>{beneficiary.guardianName}</TableCell>
                                    <TableCell>{beneficiary.villageName}</TableCell>
                                    <TableCell>{beneficiary.mandalName}</TableCell>
                                    <TableCell>{beneficiary.districtName}</TableCell>
                                    <TableCell>{beneficiary.stateName}</TableCell>
                                    <TableCell>{beneficiary.aadharNumber}</TableCell>
                                    <TableCell>{beneficiary.surveyNumber}</TableCell>
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
                                                                                <TableContainer component={Paper} sx={{ mb: 2 }}>
                                                                                    <Table size="small" aria-label="tasks table">
                                                                                        <TableHead>
                                                                                            <TableRow>
                                                                                                <TableCell>Name of the Work</TableCell>
                                                                                                <TableCell>Type of Unit</TableCell>
                                                                                                <TableCell>Unit Rate</TableCell>
                                                                                                <TableCell>Financial Extension</TableCell>
                                                                                                <TableCell>Sanction Units</TableCell>
                                                                                                <TableCell>Unit Balance</TableCell>
                                                                                                <TableCell>Total Cost</TableCell>
                                                                                                <TableCell>Beneficiary Contribution Balance</TableCell>
                                                                                                <TableCell>Remain Amount</TableCell>
                                                                                                <TableCell>Year of Sanction</TableCell>
                                                                                                <TableCell>Actions</TableCell>
                                                                                            </TableRow>
                                                                                        </TableHead>
                                                                                        <TableBody>
                                                                                            {activity.tasks?.map((task, taskIndex) => (
                                                                                                <React.Fragment key={task.id}>
                                                                                                    <TableRow>
                                                                                                        <TableCell>{task.taskName}</TableCell>
                                                                                                        <TableCell>{task.typeOfUnit}</TableCell>
                                                                                                        <TableCell>{task.ratePerUnit}</TableCell>
                                                                                                        <TableCell>
                                                                                                            {task.financialExtension ? 'Y' : 'N'}
                                                                                                        </TableCell>
                                                                                                        <TableCell>{task.units}</TableCell>
                                                                                                        <TableCell>{task.unitRemain}</TableCell>
                                                                                                        <TableCell>{task.totalCost}</TableCell>
                                                                                                        <TableCell>{task.beneficiaryContributionRemain}</TableCell>
                                                                                                        <TableCell>{task.balanceRemaining}</TableCell>
                                                                                                        <TableCell>{task.yearOfSanction}</TableCell>
                                                                                                        <TableCell>
                                                                                                            <Button
                                                                                                                variant="outlined"
                                                                                                                color="primary"
                                                                                                                onClick={() => toggleTaskDetails(taskIndex)}

                                                                                                            >
                                                                                                                View
                                                                                                            </Button>
                                                                                                        </TableCell>
                                                                                                    </TableRow>
                                                                                                    <TableRow>
                                                                                                        <TableCell colSpan={9} style={{ padding: 0 }}>
                                                                                                            <Collapse
                                                                                                                in={taskDetailsOpen[taskIndex]}
                                                                                                                timeout="auto"
                                                                                                                unmountOnExit
                                                                                                            >
                                                                                                                <div style={{ padding: '10px' }}>
                                                                                                                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                                                                                                                        <Table size="small" aria-label="task details table">
                                                                                                                            <TableHead>
                                                                                                                                <TableRow>
                                                                                                                                    <TableCell>Unit Achievement</TableCell>
                                                                                                                                    <TableCell>Discounted Rate</TableCell>
                                                                                                                                    <TableCell>Beneficiary Contribution</TableCell>
                                                                                                                                    <TableCell>Current Cost</TableCell>
                                                                                                                                    <TableCell>Procurement Check</TableCell>
                                                                                                                                    <TableCell>Payee Name</TableCell>
                                                                                                                                    <TableCell>Account details</TableCell>
                                                                                                                                    <TableCell>Passbook Copy</TableCell>
                                                                                                                                    <TableCell>Other Document</TableCell>
                                                                                                                                    {/*<TableCell>Domain Expert</TableCell>*/}
                                                                                                                                    <TableCell>Reviews</TableCell>
                                                                                                                                    <TableCell>Remarks</TableCell>
                                                                                                                                    <TableCell>Actions</TableCell>
                                                                                                                                </TableRow>
                                                                                                                            </TableHead>
                                                                                                                            <TableBody>
                                                                                                                                {(task.taskUpdates || []).map((row, rowIndex) => (
                                                                                                                                    <TableRow key={rowIndex}>
                                                                                                                                        <TableCell>{row.achievementUnit}</TableCell>
                                                                                                                                        <TableCell>{row.revisedRatePerUnit}</TableCell>
                                                                                                                                        <TableCell>{row.currentBeneficiaryContribution}</TableCell>
                                                                                                                                        <TableCell>{row.currentCost}</TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            <Checkbox
                                                                                                                                                checked={row.procurementCheck || false}
                                                                                                                                                disabled
                                                                                                                                            />
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell>{row.payeeName}</TableCell>
                                                                                                                                        <TableCell>{row.accountNumber}</TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            {row.passbookDoc ? (
                                                                                                                                                <a
                                                                                                                                                    href={row.passbookDoc.downloadUrl}
                                                                                                                                                    download={row.passbookDoc.fileName}
                                                                                                                                                    style={{
                                                                                                                                                        textDecoration: 'underline',
                                                                                                                                                        color: 'blue',
                                                                                                                                                    }}
                                                                                                                                                >
                                                                                                                                                    {row.passbookDoc.fileName}
                                                                                                                                                </a>
                                                                                                                                            ) : (
                                                                                                                                                <Typography>No Image</Typography>
                                                                                                                                            )}
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell>
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
                                                                                                                                        {/*<TableCell>{row.domainExpertEmpId}</TableCell>*/}
                                                                                                                                        <TableCell>
                                                                                                                                            <IconButton
                                                                                                                                                color={
                                                                                                                                                    'primary'
                                                                                                                                                }
                                                                                                                                                onClick={() => toggleViewMode(row.comments)}
                                                                                                                                            >
                                                                                                                                                <RemoveRedEyeOutlinedIcon />
                                                                                                                                            </IconButton>
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell><TextField
                                                                                                                                            variant="outlined"
                                                                                                                                            size="small"
                                                                                                                                            name="remarks"
                                                                                                                                            value={row.remarks || ''}
                                                                                                                                            onChange={(e) =>
                                                                                                                                                handleInputChange(
                                                                                                                                                    task.id,
                                                                                                                                                    rowIndex,
                                                                                                                                                    'remarks',
                                                                                                                                                    e.target.value
                                                                                                                                                )
                                                                                                                                            }

                                                                                                                                        /></TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            <Box sx={{ display: 'flex', gap: 0.5 }} >
                                                                                                                                                <Button
                                                                                                                                                    variant="contained"
                                                                                                                                                    color="success"
                                                                                                                                                    onClick={() => { isReview ? handleReview('Approve', task.id, row.id, rowIndex) : handleSave('Approve', task.id, row.id, rowIndex) }}
                                                                                                                                                >
                                                                                                                                                    Approve
                                                                                                                                                </Button>
                                                                                                                                                {!isCEO &&
                                                                                                                                                    <Button
                                                                                                                                                        variant="contained"
                                                                                                                                                        color="error"
                                                                                                                                                        onClick={() => handleSave('Reject', task.id, row.id, rowIndex)}
                                                                                                                                                    >
                                                                                                                                                        Reject
                                                                                                                                                    </Button>}
                                                                                                                                            </Box>
                                                                                                                                        </TableCell>
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

                                            </div>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                open={showViewConfirmation}
                onClose={handleCloseViewConfirmation}
                aria-labelledby="confirmation-modal"
                aria-describedby="confirmation-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}
                    >
                        Comments
                    </Typography>
                    <div
                        className="comment-section"
                        style={{
                            maxHeight: '300px',
                            overflowY: 'auto',
                            padding: '8px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            background: '#f9f9f9',
                        }}
                    >
                        {comments !== null ? <>
                            {comments?.map((comment, id) => (
                                <div
                                    key={id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        marginBottom: '16px',
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: comment.role === 'Admin' ? 'primary.main' : 'secondary.main',
                                            mr: 2,
                                        }}
                                    >
                                        {comment.role.charAt(0)}
                                    </Avatar>
                                    <div>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 'bold', color: 'text.primary' }}
                                        >
                                            {comment.role}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {comment.message}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </> : <>No Remarks found</>}
                    </div>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <button
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#d32f2f',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                            onClick={handleCloseViewConfirmation}
                        >
                            Close
                        </button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default ReviewTable;