import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Stack, TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('jwtToken');

  // Fetch requests from API
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    console.log('Inside Pending Requests Component : ', token);
    console.log('User Role : ', jwtDecode(token).role[0].authority);
    const userRole = jwtDecode(token).role[0].authority;

    axios.get('http://3.111.84.98:61002/admin/manageRoles', {
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
          navigate('/');;  // Redirect to login page
        } else {
          console.error('Error fetching requests', error);
        }
      });
  }, [refresh]);

  // Handle status change with approver comments and date
  const handleStatusChange = (requestId, newStatus, approverComments, approvedDate) => {
    axios.post('http://3.111.84.98:61002/admin/approveRoleRequest', {
        requestId,           // Including requestId in the body
        approverComments,     // Including approverComments in the body
      },{
        headers: {
          'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
          'Content-Type': 'application/json', // Ensure the content type is set
        }
      })
      .then(() => {
        setRefresh(!refresh);  // Trigger a re-fetch of data
      })
      .catch(error => {
        console.error('Error updating status', error);
      });
  };

  const handleRejectRoleRequest = (requestId, newStatus, approverComments, approvedDate) => {
    axios.post('http://3.111.84.98:61002/admin/rejectRoleRequest', {
        requestId,           // Including requestId in the body
        approverComments,     // Including approverComments in the body
      },{
        headers: {
          'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
          'Content-Type': 'application/json', // Ensure the content type is set
        }
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

  const handleApproveRequest = (request, newStatus) => {
    handleStatusChange(request.id, newStatus, request.approverComments, request.approvedDate);
  };

  const handleRejectRequest = (request, newStatus) => {
    handleRejectRoleRequest(request.id, newStatus, request.approverComments, request.approvedDate)
  }

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
              <TableCell>{request.user.emailid}</TableCell>
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

              <TableCell>{request.requestDate}</TableCell>

              <TableCell>
                <Stack direction="row" spacing={1}>
                  {editing[request.id] ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApproveRequest(request, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRejectRequest(request, 'reject')}
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
