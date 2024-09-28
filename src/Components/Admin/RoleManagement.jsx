import React, { useState, useEffect } from 'react';
import {
  MenuItem, Select, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from '@mui/material';
import axios from 'axios'; // For making API calls

const RoleManagement = () => {
  const [roles, setRoles] = useState([]); // To store the list of roles fetched from the backend
  const [selectedRole, setSelectedRole] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserRole, setSelectedUserRole] = useState({}); // To track the selected new role for each user
  const token = localStorage.getItem('jwtToken');

  // Fetch roles from backend when the component mounts
  useEffect(() => {
    axios.get('http://3.111.84.98:61002/roleAudit',{
      headers:{
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    }) // Replace with your actual backend API endpoint
      .then((response) => {
        setRoles(response.data); // Assume response data is an array of role objects
      })
      .catch((error) => {
        console.error('Error fetching roles:', error);
      });
  }, []);

  // Handle role selection
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setUsers([]); // Clear the user list when the role changes
  };

  // Handle search button click (fetch users by selected role)
  const handleSearch = () => {
    if (selectedRole) {
      axios.get(`http://3.111.84.98:61002/roleAudit/searchRole/${selectedRole}`,
        {
          headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        });
    }
  };

  // Handle revoking role from a user
  const handleRevoke = (userId, roleId) => {
    axios.post(`http://3.111.84.98:61002/roleAudit/revokeRole`, null, {
      params: {
        userId: userId, // Pass userId as a request parameter
        roleId: roleId   // Pass roleId as a request parameter
      },
      headers: {
        'Authorization': `Bearer ${token}`, // Include the authorization token
        'Content-Type': 'application/json'   // Ensure the content type is set
      }
    })
    .then(() => {
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers); // Update the table with the remaining users
    })
    .catch((error) => {
        console.error('Error revoking role:', error);
    });
  };

  // Handle selecting a new role for a user
  const handleUserRoleChange = (userId, newRole) => {
    setSelectedUserRole((prevState) => ({
      ...prevState,
      [userId]: newRole,
    }));
  };

  // Handle assigning a new role to a user
  const handleAssignRole = (userId) => {
    const newRole = selectedUserRole[userId];
    if (newRole) {
      // Include the selected role in the POST request payload
      axios.post(`http://3.111.84.98:61002/roleAudit/changeRole`, null, {
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
          // Refresh the table with the updated user list after assigning the new role
          handleSearch(); // Fetch updated list of users with the selected role
        })
        .catch((error) => {
          console.error('Error assigning role:', error);
        });
    }
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
          <MenuItem key={role.id} value={role.name}>
            {role.name}
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
                          onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                          displayEmpty
                          style={{ marginRight: 10 }}
                        >
                          <MenuItem value="">
                            <em>Select a Role</em>
                          </MenuItem>
                          {roles
                            .filter((role) => role.name !== "UNASSIGN") // Exclude the "UNASSIGN" role
                            .map((role) => (
                              <MenuItem key={role.id} value={role.name}>
                                {role.name}
                              </MenuItem>
                          ))}
                        </Select>
                        {/* Assign Button */}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAssignRole(user.id)}
                        >
                          Assign
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRevoke(user.id, user.role.id)}
                      >
                        Revoke
                      </Button>
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
    </div>
  );
};

export default RoleManagement;
