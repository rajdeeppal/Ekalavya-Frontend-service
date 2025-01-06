import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    IconButton
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuth } from '../PrivateRoute';
import { exportPaymentDetails } from '../DataCenter/apiService';

const AODashboardTable = ({ beneficiaries ,date, setDate}) => {
    const { userId } = useAuth();
    const exportToExcel = async () => {
        try {
            console.log("ok");
            const data = await exportPaymentDetails(userId, date);
            alert(data);
            console.log(beneficiaries);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    }
    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }} className="listContainer">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Typography variant="h4" gutterBottom style={{ color: '#555' }}>
                    Payment Details
                </Typography>
                <IconButton onClick={exportToExcel} >
                    <DownloadIcon />
                </IconButton>
            </div>
            <TableContainer component={Paper} elevation={3} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <Table aria-label="beneficiary table">
                    <TableHead style={{ backgroundColor: '#f0f0f0' }}>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Date/Time</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Payee Name</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Payee Account Details</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Account Head</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Total Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {beneficiaries?.map((beneficiary, beneficiaryIndex) => (
                            <TableRow hover key={beneficiaryIndex}>
                                <TableCell>{beneficiary.paymentTimestamp}</TableCell>
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
