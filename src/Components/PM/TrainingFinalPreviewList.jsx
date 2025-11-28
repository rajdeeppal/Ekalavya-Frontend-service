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
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import {
    ExpandMore as ExpandMoreIcon,
    Edit as EditIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import { useAuth } from '../PrivateRoute';
import { exportFinalPreviewDetails } from '../DataCenter/apiService';

const TrainingFinalPreviewList = ({ beneficiaries, value, isReview, showTraining }) => {
    const { userId } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState({});
    const [taskDetailsOpen, setTaskDetailsOpen] = useState({});
    const [editMode, setEditMode] = useState({});
    const [newTask, setNewTask] = useState(false);

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
                            <TableCell>Activity Code</TableCell>
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
                                                                                <TableContainer component={Paper} sx={{ mb: 2 }}>
                                                                                    <Table size="small" aria-label="tasks table">
                                                                                        <TableHead>
                                                                                            <TableRow>
                                                                                                <TableCell>Name of the Work</TableCell>
                                                                                                {showTraining === 'TRAINING_FORM' &&
                                                                                                    <>

                                                                                                        <TableCell>Male count</TableCell>
                                                                                                        <TableCell>Female count</TableCell>
                                                                                                        <TableCell>Other count</TableCell>
                                                                                                        <TableCell>Expert Subject Name</TableCell>
                                                                                                    </>}
                                                                                                {showTraining === 'COMMON_EXP_FORM' && <TableCell>Type of Unit</TableCell>}
                                                                                                <TableCell>Unit Rate</TableCell>
                                                                                                <TableCell>No of Units </TableCell>
                                                                                                <TableCell>Total Cost</TableCell>
                                                                                                <TableCell>Remain Amount</TableCell>
                                                                                                <TableCell>Actions</TableCell>
                                                                                            </TableRow>
                                                                                        </TableHead>
                                                                                        <TableBody>
                                                                                            {activity.tasks?.map((task, taskIndex) => (
                                                                                                <React.Fragment key={task.id}>
                                                                                                    <TableRow>
                                                                                                        <TableCell>{task.taskName}</TableCell>
                                                                                                        {showTraining === 'TRAINING_FORM' &&
                                                                                                            <>

                                                                                                                <TableCell>{task.maleCount}</TableCell>
                                                                                                                <TableCell>{task.femaleCount}</TableCell>
                                                                                                                <TableCell>{task.otherCount}</TableCell>
                                                                                                                <TableCell>{task.expertSubject}</TableCell>
                                                                                                            </>}
                                                                                                        {showTraining === 'COMMON_EXP_FORM' &&
                                                                                                            <TableCell>{task.typeOfUnit}</TableCell>}
                                                                                                        <TableCell>{task.ratePerUnit}</TableCell>
                                                                                                        <TableCell>{task.units}</TableCell>
                                                                                                        <TableCell>{task.totalCost}</TableCell>
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
                                                                                                    <TableRow>
                                                                                                        <TableCell colSpan={9} style={{ padding: 0 }}>
                                                                                                            <Collapse
                                                                                                                in={taskDetailsOpen[task.id]}
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
                                                                                                                                    {/*{!isReview && <TableCell>Domain Expert</TableCell>}*/}
                                                                                                                                    {isReview && <TableCell>Pending With</TableCell>}
                                                                                                                                    {isReview && <TableCell>Payment Status</TableCell>}
                                                                                                                                </TableRow>
                                                                                                                            </TableHead>
                                                                                                                            <TableBody>
                                                                                                                                {(task.taskUpdates || [])?.map((row, rowIndex) => (
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
                                                                                                                                        <TableCell>{row.passbookDoc ? (<a
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
                                                                                                                                        {/*{!isReview && <TableCell>{row.domainExpertEmpId}</TableCell>}*/}
                                                                                                                                        {isReview && <TableCell>{row.pendingWith}</TableCell>}
                                                                                                                                        {isReview && <TableCell>{row.paymentStatus}</TableCell>}
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


        </div >
    );
};

export default TrainingFinalPreviewList;