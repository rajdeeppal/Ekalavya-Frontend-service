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
    const { userId } = useAuth();
    const [open, setOpen] = useState({});
    const [selectedTasks, setSelectedTasks] = useState({});


    const toggleCollapse = (index) => {
        setOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
    };

    const handleCheckboxChange = (beneficiaryId, taskId, task) => {
        setSelectedTasks((prev) => {
            const updatedTasks = { ...prev };

            // Initialize tasks for this beneficiary if not present
            if (!updatedTasks[beneficiaryId]) {
                updatedTasks[beneficiaryId] = {};
            }

            // Toggle the task selection
            if (updatedTasks[beneficiaryId][taskId]) {
                delete updatedTasks[beneficiaryId][taskId];
                // Remove the beneficiary if no tasks are selected
                if (Object.keys(updatedTasks[beneficiaryId]).length === 0) {
                    delete updatedTasks[beneficiaryId];
                }
            } else {
                updatedTasks[beneficiaryId][taskId] = task;
            }

            return updatedTasks;
        });
        console.log(selectedTasks)
        console.log(beneficiaryId, taskId, task)
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
    

        const totalGrant = Object.values(tasks).reduce(
            (sum, task) => sum + task.totalAmount,
            0
        );
        const taskNames = Object.values(tasks).map(task => task.taskName);
        const voucherData = {
            payeeName: beneficiary.payeeName,
            accountNumber: beneficiary.accountNumber,
            taskNames: taskNames,
            amount: totalGrant
        };
        console.log('Generated Voucher Data:', voucherData);
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

                                {/* Task Details Collapsible Row */}
                                <TableRow>
                                    <TableCell colSpan={10} style={{ padding: 0 }}>
                                        <Collapse in={open[beneficiaryIndex]} timeout="auto" unmountOnExit>
                                            <Accordion>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls={`task-content-${beneficiary.id}`}
                                                    id={`task-header-${beneficiary.id}`}
                                                >
                                                    <Typography>Tasks</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <TableContainer component={Paper} elevation={2} sx={{ mb: 2 }}>
                                                        <Table size="small" aria-label="tasks table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    {isReview && <TableCell>Checkbox</TableCell>}
                                                                    <TableCell style={{ fontWeight: 'bold' }}>
                                                                        Name of the Work
                                                                    </TableCell>
                                                                    <TableCell style={{ fontWeight: 'bold' }}>
                                                                        Grant Amount
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {beneficiary.tasks?.map((task) => (
                                                                    <TableRow hover key={task.id}>
                                                                        {isReview && <TableCell>
                                                                            <Checkbox
                                                                                checked={
                                                                                    !!selectedTasks[beneficiary.id]?.[task.id]
                                                                                }
                                                                                onChange={() =>
                                                                                    handleCheckboxChange(beneficiary.id, task.id, task)
                                                                                }
                                                                            />
                                                                        </TableCell>}
                                                                        <TableCell>{task.taskName}</TableCell>
                                                                        <TableCell>
                                                                            {new Intl.NumberFormat('en-IN', {
                                                                                style: 'currency',
                                                                                currency: 'INR',
                                                                                maximumFractionDigits: 2,
                                                                            }).format(task.totalAmount)}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </AccordionDetails>
                                            </Accordion>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>

                                {/* Passbook Document Collapsible Row */}
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
                                                                    beneficiary.passbookDoc.length > 0 ? (
                                                                    beneficiary.passbookDoc.map((file, idx) => (
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
