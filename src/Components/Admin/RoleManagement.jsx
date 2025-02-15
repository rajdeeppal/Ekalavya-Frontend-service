import React, { useState, useEffect } from 'react';
import {
  MenuItem, Select, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Card, CardContent, CircularProgress,
  Snackbar, Alert, IconButton, Tooltip
} from '@mui/material';
import { Check, Cancel, Refresh } from '@mui/icons-material';
import axios from 'axios'; // For making API calls

const RoleManagement = () => {
  const [roles, setRoles] = useState([]); // To store the list of roles fetched from the backend
  const [selectedRole, setSelectedRole] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserRole, setSelectedUserRole] = useState({}); // To track the selected new role for each user
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const token = localStorage.getItem('jwtToken');

  // Fetch roles from backend when the component mounts
  useEffect(() => {
    setLoading(true);
    axios.get('http://3.111.84.98:61002/api/roleAudit')
      .then((response) => {
        setRoles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching roles:', error);
        setLoading(false);
        showSnackbar('Failed to fetch roles', 'error');
      });
  }, []);

  // Handle role selection
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setUsers([]); // Clear the user list when the role changes
  };

  // Show snackbar notifications
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle search button click (fetch users by selected role)
  const handleSearch = () => {
    if (selectedRole) {
      setLoading(true);
      axios.get(`http://3.111.84.98:61002/api/roleAudit/searchRole/${selectedRole}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
        .then((response) => {
          setUsers(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
          setLoading(false);
          showSnackbar('Error fetching users', 'error');
        });
    }
  };

  // Handle revoking role from a user
  const handleRevoke = (userId, roleId) => {
    setLoading(true);
    axios.post(`http://3.111.84.98:61002/api/roleAudit/revokeRole`, null, {
      params: {
        userId: userId, // Pass userId as a request parameter
        roleId: roleId   // Pass roleId as a request parameter
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    .then(() => {
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers); // Update the table with the remaining users
        setLoading(false);
        showSnackbar('Role revoked successfully', 'success');
    })
    .catch((error) => {
        console.error('Error revoking role:', error);
        setLoading(false);
        showSnackbar('Failed to revoke role', 'error');
    });
  };

  // Handle assigning a new role to a user
  const handleAssignRole = (userId) => {
    const newRole = selectedUserRole[userId];
    if (newRole) {
      setLoading(true);
      axios.post(`http://3.111.84.98:61002/api/roleAudit/changeRole`, null, {
        params: {
          userId: userId,   // Pass userId as a request parameter
          newRoleName: newRole // Pass new role name as a request parameter
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
        .then(() => {
          console.log(`Assigned role ${newRole} to user ${userId}`);
          handleSearch(); // Refresh the user list
          setLoading(false);
          showSnackbar('Role assigned successfully', 'success');
        })
        .catch((error) => {
          console.error('Error assigning role:', error);
          setLoading(false);
          showSnackbar('Failed to assign role', 'error');
        });
    }
  };

  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div>
      <Card elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Role Management
        </Typography>

        {/* Role Dropdown */}
        <Select
          value={selectedRole}
          onChange={handleRoleChange}
          displayEmpty
          style={{ marginRight: 10 }}
          sx={{ width: '200px' }}
        >
          <MenuItem value="">
            <em>Select a Role</em>
          </MenuItem>
          <MenuItem value="UNASSIGN">
            <em>UNASSIGN</em>
          </MenuItem>
          {roles.filter((role) => role.name !== 'EADMIN')
            .map((role) => (
              <MenuItem key={role.id} value={role.name}>
                {role.name}
              </MenuItem>
            ))}
        </Select>

        {/* Search Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          startIcon={<Refresh />}
          sx={{ mt: 1 }}
        >
          Search
        </Button>

        {/* Loading Indicator */}
        {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
      </Card>

      {/* Users Table */}
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>UserName</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role ? user.role.name : 'None'}</TableCell>
                  <TableCell>
                    {selectedRole === "UNASSIGN" ? (
                      <>
                        {/* Dropdown to select new role for the user */}
                        <Select
                          value={selectedUserRole[user.id] || ''}
                          onChange={(e) => setSelectedUserRole({ ...selectedUserRole, [user.id]: e.target.value })}
                          displayEmpty
                          style={{ marginRight: 10 }}
                        >
                          <MenuItem value="">
                            <em>Select a Role</em>
                          </MenuItem>
                            {/* <MenuItem value="UNASSIGN">
                              <em>UNASSIGN</em>
                            </MenuItem> */}
                          {roles.filter((role) => role.name !== 'EADMIN' && role.name !== 'UNASSIGN')
                            .map((role) => (
                              <MenuItem key={role.id} value={role.name}>
                                {role.name}
                              </MenuItem>
                            ))}
                        </Select>
                        {/* Assign Button */}
                        <Tooltip title="Assign Role">
                          <IconButton color="primary" onClick={() => handleAssignRole(user.id)}>
                            <Check />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <Tooltip title="Revoke Role">
                        <IconButton color="secondary" onClick={() => handleRevoke(user.id, user.role.id)}>
                          <Cancel />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No users found with the selected role.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RoleManagement;
