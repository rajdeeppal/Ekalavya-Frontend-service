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
                                                                                                                                </TableRow>
                                                                                                                            </TableHead>
                                                                                                                            <TableBody>
                                                                                                                                {(task.taskUpdates || [])?.map((row, rowIndex) => (
                                                                                                                                    <TableRow key={rowIndex}>
                                                                                                                                        <TableCell sx={{ minWidth: 120 }}>{row.achievementUnit}</TableCell>
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