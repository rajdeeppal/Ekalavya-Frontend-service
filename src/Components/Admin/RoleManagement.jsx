import React, { useState } from 'react';
import { MenuItem, Select, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const RoleManagement = () => {
  // Dummy role list
  const roles = ['Admin', 'User', 'Manager'];

  // Dummy user data
  const dummyUsers = [
    { id: 1, name: 'User 1', role: 'Admin' },
    { id: 2, name: 'User 2', role: 'User' },
    { id: 3, name: 'User 3', role: 'Manager' },
    { id: 4, name: 'User 4', role: 'Admin' },
  ];

  const [selectedRole, setSelectedRole] = useState('');
  const [users, setUsers] = useState([]);

  // Handle role selection
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  // Handle search button click (filters users by role)
  const handleSearch = () => {
    const filteredUsers = dummyUsers.filter((user) => user.role === selectedRole);
    setUsers(filteredUsers);
  };

  // Handle revoking role from a user
  const handleRevoke = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers); // Update the table with the remaining users
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Role Management
      </Typography>
      
      {/* Role Dropdown */}
      <Select
        value={selectedRole}
        onChange={handleRoleChange}
        displayEmpty
        style={{ marginRight: 10 }}
      >
        <MenuItem value="">
          <em>Select a Role</em>
        </MenuItem>
        {roles.map((role) => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </Select>

      {/* Search Button */}
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>

      {/* Users Table */}
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRevoke(user.id)}
                    >
                      Revoke
                    </Button>
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
    </div>
  );
};

export default RoleManagement;
