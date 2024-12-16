import React, { useState } from 'react';
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
    Box
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Reviews,
} from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuth } from '../PrivateRoute';
import * as XLSX from 'xlsx';
import { updatedBeneficiarySubTask,approveDomainDetails, rejectDomainDetails } from '../DataCenter/apiService';

function ReviewTable({ beneficiaries, setBeneficiaries, isReview }) {
    const { userId } = useAuth();
    const [remarks, setRemarks] = useState('');
    const [open, setOpen] = useState({});
    const [taskDetailsOpen, setTaskDetailsOpen] = useState({});
    const [editMode, setEditMode] = useState({});
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

    const handleSave = async (action, userId, rowId) => {
        if (action === 'Approve') {
            try {
                await approveDomainDetails(userId, rowId, remarks);
                console.log("User ID:", userId, "Row ID:", rowId, "Remarks:", remarks);
                alert("Tasks have been approved successfully");
            } catch (error) {
                console.error("Error approving tasks:", error);
                alert("An error occurred while approving the tasks. Please try again.");
            }
        } else {
            try {
                await rejectDomainDetails(userId, rowId, remarks);
                console.log("User ID:", userId, "Row ID:", rowId, "Remarks:", remarks);
                alert("Tasks have been rejected successfully");
            } catch (error) {
                console.error("Error tasks:", error);
                alert("An error occurred while rejecting the tasks. Please try again.");
            }
        }
    };

    const handleReview = () => {

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
                                                                                                <TableCell>No. of Units</TableCell>
                                                                                                <TableCell>Total Cost</TableCell>
                                                                                                <TableCell>Beneficiary Contribution</TableCell>
                                                                                                <TableCell>Grant Amount</TableCell>
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
                                                                                                        <TableCell>{task.units}</TableCell>
                                                                                                        <TableCell>{task.totalCost}</TableCell>
                                                                                                        <TableCell>{task.beneficiaryContribution}</TableCell>
                                                                                                        <TableCell>{task.grantAmount}</TableCell>
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
                                                                                                                                    <TableCell>Beneficiary Contribution</TableCell>
                                                                                                                                    <TableCell>Current Cost</TableCell>
                                                                                                                                    <TableCell>Payee Name</TableCell>
                                                                                                                                    <TableCell>Account details</TableCell>
                                                                                                                                    <TableCell>Passbook Copy</TableCell>
                                                                                                                                    <TableCell>Other Document</TableCell>
                                                                                                                                    <TableCell>Domain Expert</TableCell>
                                                                                                                                    {isReview &&
                                                                                                                                        <TableCell>Rejection Reason</TableCell>}
                                                                                                                                    <TableCell>Remarks</TableCell>
                                                                                                                                    <TableCell>Actions</TableCell>
                                                                                                                                </TableRow>
                                                                                                                            </TableHead>
                                                                                                                            <TableBody>
                                                                                                                                {(task.taskUpdates || []).map((row, rowIndex) => (
                                                                                                                                    <TableRow key={rowIndex}>
                                                                                                                                        <TableCell>{row.achievementUnit}</TableCell>
                                                                                                                                        <TableCell>{row.currentBeneficiaryContribution}</TableCell>
                                                                                                                                        <TableCell>{row.currentCost}</TableCell>
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
                                                                                                                                            {
                                                                                                                                                row.otherDocument &&
                                                                                                                                                    row.otherDocument.files &&
                                                                                                                                                    row.otherDocument.files.length > 0 ? (
                                                                                                                                                    row.otherDocument.files.map((file, idx) => (
                                                                                                                                                        <div key={idx}>
                                                                                                                                                            <a
                                                                                                                                                                href={file.fileURL}
                                                                                                                                                                download={file.file.name}
                                                                                                                                                                style={{
                                                                                                                                                                    textDecoration: 'underline',
                                                                                                                                                                    color: 'blue',
                                                                                                                                                                }}
                                                                                                                                                            >
                                                                                                                                                                {file.file.name}
                                                                                                                                                            </a>
                                                                                                                                                        </div>
                                                                                                                                                    ))
                                                                                                                                                ) : (
                                                                                                                                                    <Typography>No File Uploaded</Typography>
                                                                                                                                                )}
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell>{row.domainExpertEmpId}</TableCell>
                                                                                                                                        {isReview &&
                                                                                                                                            <TableCell>{row.rejectionReason}</TableCell>}
                                                                                                                                        <TableCell><TextField
                                                                                                                                            variant="outlined"
                                                                                                                                            size="small"
                                                                                                                                            name="remarks"
                                                                                                                                            value={remarks || ''}
                                                                                                                                            onChange={(e) => setRemarks(e.target.value)}

                                                                                                                                        /></TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            <Box sx={{ display: 'flex', gap: 0.5 }} >
                                                                                                                                                <Button
                                                                                                                                                    variant="contained"
                                                                                                                                                    color="success"
                                                                                                                                                    onClick={() => { isReview ? handleReview('Approve') : handleSave('Approve',userId,row.id) }}
                                                                                                                                                >
                                                                                                                                                    Approve
                                                                                                                                                </Button>
                                                                                                                                                <Button
                                                                                                                                                    variant="contained"
                                                                                                                                                    color="error"
                                                                                                                                                    onClick={() => { isReview ? handleReview('Reject') : handleSave('Reject',userId,row.id) }}
                                                                                                                                                >
                                                                                                                                                    Reject
                                                                                                                                                </Button>
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
        </div>
    )
}

export default ReviewTable;
