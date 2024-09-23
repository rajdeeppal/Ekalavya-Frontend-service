import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Stack, TextField
} from '@mui/material';
import axios from 'axios';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // Fetch requests from API
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    console.log('Inside Pending Requests Component : ', token);

    axios.get('http://3.111.84.98:8080/admin/manageRoles', {
      headers:{
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        setRequests(response.data);
        console.log(response.data);
      })
      .catch(error => {
        if(error.response && error.response.status === 401){
          console.error('Token has expired, please login again.');
          localStorage.removeItem('jwtToken');
          window.location.href = '/login';  // Redirect to login page
        } else {
          console.error('Error fetching requests', error);
        }
      });
  }, [refresh]);

  // Handle status change with approver comments and date
  const handleStatusChange = (requestId, newStatus, approverComments, approvedDate) => {
    axios.post(`/api/request/${requestId}/update-status`, { 
        status: newStatus,
        approverComments,
        approvedDate
      })
      .then(() => {
        setRefresh(!refresh);  // Trigger a re-fetch of data
      })
      .catch(error => {
        console.error('Error updating status', error);
      });
  };

  // Handle entering edit mode
  const [editing, setEditing] = useState({});

  const toggleEdit = (requestId) => {
    setEditing((prev) => ({
      ...prev,
      [requestId]: !prev[requestId]
    }));
  };

  const handleApproveReject = (request, newStatus) => {
    handleStatusChange(request.id, newStatus, request.approverComments, request.approvedDate);
  };

  const handleChange = (requestId, field, value) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === requestId ? { ...request, [field]: value } : request
      )
    );
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
              
              <TableCell>
                {editing[request.id] ? (
                  <TextField
                    value={request.approverComments}
                    onChange={(e) => handleChange(request.id, 'approverComments', e.target.value)}
                    fullWidth
                  />
                ) : (
                  request.approverComments || '-'
                )}
              </TableCell>

              <TableCell>
                {editing[request.id] ? (
                  <TextField
                    type="date"
                    value={request.approvedDate ? new Date(request.approvedDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleChange(request.id, 'approvedDate', e.target.value)}
                    fullWidth
                  />
                ) : (
                  request.approvedDate ? new Date(request.approvedDate).toLocaleDateString() : '-'
                )}
              </TableCell>

              <TableCell>
                <Stack direction="row" spacing={1}>
                  {editing[request.id] ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApproveReject(request, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleApproveReject(request, 'reject')}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => toggleEdit(request.id)}
                    >
                      Edit
                    </Button>
                  )}
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
