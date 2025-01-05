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
    Checkbox,
    Modal,
    Box
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Reviews,
} from '@mui/icons-material';
import { generatedVoucherDetails } from '../DataCenter/apiService';
import AOPaymentTable from '../AO/AOPaymentTable';


const AODashboardTable = ({ beneficiaries }) => {
    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }} className="listContainer">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Typography variant="h4" gutterBottom style={{ color: '#555' }}>
                    Payment Details
                </Typography>
            </div>
            <TableContainer component={Paper} elevation={3} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <Table aria-label="beneficiary table">
                    <TableHead style={{ backgroundColor: '#f0f0f0' }}>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Payment Date</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Payee Name</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Payee Acoount Info</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Head of Account</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Total Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {beneficiaries?.map((beneficiary, beneficiaryIndex) => (
                            <TableRow hover>
                                <TableCell>{beneficiary.paymentTimestamp.format('YYYY-MM-DD')}</TableCell>
                                <TableCell>{beneficiary.payeeName}</TableCell>
                                <TableCell>{beneficiary.payeeAccountInfo}</TableCell>
                                <TableCell>{beneficiary.headOfAccount}</TableCell>
                                <TableCell>{beneficiary.amount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    )
}

export default AODashboardTable;
