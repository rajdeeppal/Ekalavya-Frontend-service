import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Stack, TextField, Badge, Typography, IconButton, Tooltip,
  Card, CardContent, Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';  // Add smooth animations

const PendingRequests = ({ setPendingCount }) => {
  const [requests, setRequests] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('jwtToken');

  // Fetch requests from API
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const userRole = jwtDecode(token).role[0].authority;

    axios.get('https://3.111.84.98:61002/api/admin/manageRoles', {
      headers:{
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        setRequests(response.data);
        setPendingCount(response.data.length);  // Set pending requests count
      })
      .catch(error => {
        if(error.response && error.response.status === 401){
          localStorage.removeItem('jwtToken');
          navigate('/');  // Redirect to login page
        } else {
          console.error('Error fetching requests', error);
        }
      });
  }, [refresh, setPendingCount, navigate]);

  // Handle status change
  const handleStatusChange = (requestId, newStatus, approverComments) => {
    axios.post('https://3.111.84.98:61002/api/admin/approveRoleRequest', {
        requestId,
        approverComments,
      },{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      .then(() => {
        setRefresh(!refresh);  // Trigger a re-fetch of data
      })
      .catch(error => {
        console.error('Error updating status', error);
      });
  };

  const handleRejectRoleRequest = (requestId, approverComments) => {
    axios.post('https://3.111.84.98:61002/api/admin/rejectRoleRequest', {
        requestId,
        approverComments,
      },{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
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

  const handleApproveRequest = (request) => {
    handleStatusChange(request.id, 'approved', request.approverComments);
  };

  const handleRejectRequest = (request) => {
    handleRejectRoleRequest(request.id, request.approverComments);
  };

  const handleChange = (requestId, field, value) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === requestId ? { ...request, [field]: value } : request
      )
    );
  };

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Pending Role Requests
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Request Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Approver Comments</TableCell>
              <TableCell>Requested Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request, index) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Avatar alt={request.user.username} />
                </TableCell>
                <TableCell>{request.user.username}</TableCell>
                <TableCell>{request.user.emailid}</TableCell>
                <TableCell>{request.requestedRole}</TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ color: request.status === 'approved' ? 'green' : 'red' }}>
                    {request.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  {editing[request.id] ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={request.approverComments}
                        onChange={(e) => handleChange(request.id, 'approverComments', e.target.value)}
                      />
                    </motion.div>
                  ) : (
                    request.approverComments || '-'
                  )}
                </TableCell>
                <TableCell>{request.requestDate}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {editing[request.id] ? (
                      <>
                        <Tooltip title="Approve">
                          <motion.div whileHover={{ scale: 1.1 }}>
                            <IconButton
                              color="primary"
                              onClick={() => handleApproveRequest(request)}
                            >
                              <CheckIcon />
                            </IconButton>
                          </motion.div>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <motion.div whileHover={{ scale: 1.1 }}>
                            <IconButton
                              color="secondary"
                              onClick={() => handleRejectRequest(request)}
                            >
                              <CloseIcon />
                            </IconButton>
                          </motion.div>
                        </Tooltip>
                      </>
                    ) : (
                      <Tooltip title="Edit">
                        <motion.div whileHover={{ scale: 1.1 }}>
                          <IconButton onClick={() => toggleEdit(request.id)}>
                            <EditIcon />
                          </IconButton>
                        </motion.div>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default PendingRequests;
