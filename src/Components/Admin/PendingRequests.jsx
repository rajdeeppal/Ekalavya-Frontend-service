import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Stack
} from '@mui/material';
import axios from 'axios';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // Fetch requests from API
  useEffect(() => {
    axios.get('http://3.111.84.98:8080/admin/manageRoles')  // Replace with your API endpoint
      .then(response => {
        setRequests(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching requests', error);
      });
  }, [refresh]);

  // Function to handle approve/reject
  const handleStatusChange = (requestId, newStatus) => {
    axios.post(`/api/request/${requestId}/update-status`, { status: newStatus })
      .then(() => {
        setRefresh(!refresh);  // Trigger a re-fetch of data
      })
      .catch(error => {
        console.error('Error updating status', error);
      });
  };

  return (
    <TableContainer component={Paper} sx={{ padding: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Email ID</TableCell>
            <TableCell>Request Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Approver Comments</TableCell>
            <TableCell>Requested Date</TableCell>
            <TableCell>Approved Date</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request, index) => (
            <TableRow
              key={request.id}
              sx={{
                backgroundColor: index % 2 === 0 ? 'white' : 'lightblue',
              }}
            >
              <TableCell>{request.user.username}</TableCell>
              <TableCell>{request.user.emailId}</TableCell>
              <TableCell>{request.requestedRole}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>{request.approverComments}</TableCell>
              <TableCell>{new Date(request.requestedDate).toLocaleDateString()}</TableCell>
              <TableCell>{request.approvedDate ? new Date(request.approvedDate).toLocaleDateString() : '-'}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleStatusChange(request.id, 'approve')}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleStatusChange(request.id, 'reject')}
                  >
                    Reject
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PendingRequests;
