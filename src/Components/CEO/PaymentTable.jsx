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
import { updatedBeneficiarySubTask, approveDomainDetails, rejectDomainDetails } from '../DataCenter/apiService';

function PaymentTable({ beneficiaries, setBeneficiaries, isReview }) {
    const { userId } = useAuth();
    const [open, setOpen] = useState({});


    const toggleCollapse = (index) => {
        setOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
    };


    return (
        <div style={{ padding: '20px' }} className="listContainer">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom style={{ color: '#888' }}>
                    Payment List
                </Typography>
            </div>
            <TableContainer component={Paper}>
                <Table aria-label="beneficiary table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Payee Name</TableCell>
                            <TableCell>Account Number</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {beneficiaries?.map((beneficiary, beneficiaryIndex) => (
                            <React.Fragment key={beneficiary.id}>
                                {/* Main Beneficiary Row */}
                                <TableRow>
                                    <TableCell>{beneficiary.payeeName}</TableCell>
                                    <TableCell>{beneficiary.accountNumber}</TableCell>
                                    <TableCell>{new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                        maximumFractionDigits: 2,
                                    }).format(beneficiary.grandTotal)}</TableCell>
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
                                                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                                                        <Table size="small" aria-label="tasks table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Name of the Work</TableCell>
                                                                    <TableCell>Grant Amount</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {beneficiary.tasks?.map((task) => (
                                                                    <TableRow key={task.id}>
                                                                        <TableCell>{task.taskName}</TableCell>
                                                                        <TableCell>{new Intl.NumberFormat('en-IN', {
                                                                            style: 'currency',
                                                                            currency: 'INR',
                                                                            maximumFractionDigits: 2,
                                                                        }).format(task.totalAmount)}</TableCell>
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
                                                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                                                        <Table size="small" aria-label="passbook table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Name of the Document</TableCell>
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
                                                                                        color: 'blue',
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
