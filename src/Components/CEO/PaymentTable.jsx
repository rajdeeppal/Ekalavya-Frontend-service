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
    Checkbox
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
import { updatedBeneficiarySubTask, approveDomainDetails, rejectDomainDetails } from '../DataCenter/apiService';

function PaymentTable({ beneficiaries, setBeneficiaries, isReview }) {
    const [open, setOpen] = useState({});
    const [selectedTasks, setSelectedTasks] = useState({});

    const toggleCollapse = (index) => {
        setOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
    };

    const handleCheckboxChange = (beneficiaryId, componentId, activityId, taskId, task) => {
        // First, update the selectedTasks state
        setSelectedTasks((prev) => {
            const updatedTasks = { ...prev };

            // Initialize the hierarchy if not present
            if (!updatedTasks[beneficiaryId]) {
                updatedTasks[beneficiaryId] = {};
            }
            if (!updatedTasks[beneficiaryId][componentId]) {
                updatedTasks[beneficiaryId][componentId] = {};
            }
            if (!updatedTasks[beneficiaryId][componentId][activityId]) {
                updatedTasks[beneficiaryId][componentId][activityId] = {};
            }

            // Toggle the task selection
            const activityTasks = updatedTasks[beneficiaryId][componentId][activityId];
            if (activityTasks[taskId]) {
                delete activityTasks[taskId];

                // Clean up the hierarchy if empty
                if (Object.keys(activityTasks).length === 0) {
                    delete updatedTasks[beneficiaryId][componentId][activityId];
                    if (Object.keys(updatedTasks[beneficiaryId][componentId]).length === 0) {
                        delete updatedTasks[beneficiaryId][componentId];
                        if (Object.keys(updatedTasks[beneficiaryId]).length === 0) {
                            delete updatedTasks[beneficiaryId];
                        }
                    }
                }
            } else {
                activityTasks[taskId] = task;
            }

            return updatedTasks;
        });
    };



    const handleGenerateVoucher = (bId) => {
        const beneficiary = beneficiaries.find((beneficiary) => beneficiary.id === bId);
    
        if (!beneficiary) {
            console.error('Beneficiary not found for the provided ID:', bId);
            return;
        }
    
        const tasks = selectedTasks[bId];
        if (!tasks || Object.keys(tasks).length === 0) {
            console.error('No tasks selected for the beneficiary:', bId);
            return;
        }
    
        const components = Object.entries(tasks).map(([componentId, activities]) => {
            return {
                id: parseInt(componentId),
                componentName: beneficiary.components.find((c) => c.id === parseInt(componentId))?.componentName || `c${componentId}`,
                activities: Object.entries(activities).map(([activityId, taskGroup]) => {
                    return {
                        id: parseInt(activityId),
                        activityName: beneficiary.components
                            .find((c) => c.id === parseInt(componentId))
                            ?.activities.find((a) => a.id === parseInt(activityId))?.activityName || `a${activityId}`,
                        tasks: Object.entries(taskGroup).map(([taskId, task]) => {
                            const matchedTask = beneficiary.components
                                .find((c) => c.id === parseInt(componentId))
                                ?.activities.find((a) => a.id === parseInt(activityId))
                                ?.tasks.find((t) => t.id === parseInt(taskId));
    
                            return {
                                id: task.id,
                                taskName: matchedTask?.taskName || task.taskName,
                                totalAmount: task.totalAmount,
                                beneficiaryContribution: task.beneficiaryContribution,
                            };
                        }),
                    };
                }),
            };
        });
    
        const totalAmount = components.reduce((sum, component) => {
            return sum + component.activities.reduce((activitySum, activity) => {
                return activitySum + activity.tasks.reduce((taskSum, task) => taskSum + task.totalAmount, 0);
            }, 0);
        }, 0);
    
        const voucherData = {
            payeeName: beneficiary.payeeName,
            accountNumber: beneficiary.accountNumber,
            components: components,
            amount: totalAmount,
        };
    
        console.log('Generated Voucher Data:', voucherData);
        return voucherData;
    };
    


    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }} className="listContainer">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Typography variant="h4" gutterBottom style={{ color: '#555' }}>
                    Payment List
                </Typography>
            </div>
            <TableContainer component={Paper} elevation={3} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <Table aria-label="beneficiary table">
                    <TableHead style={{ backgroundColor: '#f0f0f0' }}>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Payee Name</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Account Number</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Total Amount</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {beneficiaries?.map((beneficiary, beneficiaryIndex) => (
                            <React.Fragment key={beneficiary.id}>
                                {/* Main Beneficiary Row */}
                                <TableRow hover>
                                    <TableCell>{beneficiary.payeeName}</TableCell>
                                    <TableCell>{beneficiary.accountNumber}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('en-IN', {
                                            style: 'currency',
                                            currency: 'INR',
                                            maximumFractionDigits: 2,
                                        }).format(beneficiary.grandTotal)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
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
                                                                                                {isReview && <TableCell style={{ fontWeight: 'bold' }}>Checkbox</TableCell>}
                                                                                                <TableCell style={{ fontWeight: 'bold' }}>Name of the Work</TableCell>
                                                                                                <TableCell style={{ fontWeight: 'bold' }}>Total Cost</TableCell>
                                                                                                <TableCell style={{ fontWeight: 'bold' }}>Beneficiary Contribution Balance</TableCell>
                                                                                            </TableRow>
                                                                                        </TableHead>
                                                                                        <TableBody>
                                                                                            {activity.tasks?.map((task, taskIndex) => (
                                                                                                <React.Fragment key={task.id}>
                                                                                                    <TableRow>
                                                                                                        {isReview && <TableCell>
                                                                                                            <Checkbox
                                                                                                                checked={
                                                                                                                    !!selectedTasks[beneficiary.id]?.[component.id]?.[activity.id]?.[task.id]
                                                                                                                }
                                                                                                                onChange={() =>
                                                                                                                    handleCheckboxChange(beneficiary.id, component.id, activity.id, task.id, task)
                                                                                                                }
                                                                                                            />
                                                                                                        </TableCell>}
                                                                                                        <TableCell>{task.taskName}</TableCell>
                                                                                                        <TableCell>{new Intl.NumberFormat('en-IN', {
                                                                                                            style: 'currency',
                                                                                                            currency: 'INR',
                                                                                                            maximumFractionDigits: 2,
                                                                                                        }).format(task.totalAmount)}</TableCell>
                                                                                                        <TableCell>{new Intl.NumberFormat('en-IN', {
                                                                                                            style: 'currency',
                                                                                                            currency: 'INR',
                                                                                                            maximumFractionDigits: 2,
                                                                                                        }).format(task.beneficiaryContribution)}</TableCell>
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
                                <TableRow>
                                    <TableCell colSpan={10} style={{ padding: 0 }}>
                                        <Collapse in={open[beneficiaryIndex]} timeout="auto" unmountOnExit>
                                            <Accordion>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls={`passbook-content-${beneficiary.id}`}
                                                    id={`passbook-header-${beneficiary.id}`}
                                                >
                                                    <Typography>Passbook Document</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <TableContainer component={Paper} elevation={2} sx={{ mb: 2 }}>
                                                        <Table size="small" aria-label="passbook table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell style={{ fontWeight: 'bold' }}>Name of the Document</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {beneficiary.passbookDocs &&
                                                                    beneficiary.passbookDocs.length > 0 ? (
                                                                    beneficiary.passbookDocs.map((file, idx) => (
                                                                        <TableRow key={idx}>
                                                                            <TableCell>
                                                                                <a
                                                                                    href={file.downloadUrl}
                                                                                    download={file.fileName}
                                                                                    style={{
                                                                                        textDecoration: 'underline',
                                                                                        color: '#007BFF',
                                                                                    }}
                                                                                >
                                                                                    {file.fileName}
                                                                                </a>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))
                                                                ) : (
                                                                    <TableRow>
                                                                        <TableCell>
                                                                            <Typography>No File Uploaded</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </AccordionDetails>
                                            </Accordion>
                                            {isReview && <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => handleGenerateVoucher(beneficiary.id)}
                                                    style={{ marginTop: '10px' }}
                                                >
                                                    Generate Voucher
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    style={{ marginTop: '10px' }}
                                                >
                                                    Payment Details
                                                </Button>
                                            </div>}
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

export default PaymentTable;
