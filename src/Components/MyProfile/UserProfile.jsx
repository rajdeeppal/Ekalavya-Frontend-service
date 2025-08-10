import React, { useEffect, useState } from 'react';
import {
  Avatar, Box, Typography, Grid, Card, Divider, IconButton, Tooltip,
  TextField, Button, Snackbar, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../PrivateRoute';
import { getProfileDetails, updateProfileDetails } from '../DataCenter/apiService';

const UserProfile = () => {
  const { userId } = useAuth();
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ emailId: '', mobileNumber: '' });

  // Snackbar states
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfileDetails(userId);
      setProfile(data);
      setFormData({
        emailId: data.emailId || '',
        mobileNumber: data.mobileNumber || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setSnackbar({ open: true, message: 'Failed to load profile', severity: 'error' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSave = async () => {
  try {
    const dto = {
      emailId:
        formData.emailId !== profile.emailId ? formData.emailId : null,
      mobileNumber:
        formData.mobileNumber !== profile.mobileNumber
          ? formData.mobileNumber
          : null,
    };

    await updateProfileDetails(profile.empId, dto);
    setIsEditing(false);
    fetchProfile();

    setSnackbar({ open: true, message: "Profile updated successfully!", severity: "success" });
  } catch (error) {
    console.error("Error updating profile:", error);

    if (error.response && error.response.data) {
      // Extract all messages from backend error object
      const backendErrors = Object.values(error.response.data);

      // If there are multiple errors, join them with line breaks
      setSnackbar({
        open: true,
        message: backendErrors.join("\n"),
        severity: "error",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Failed to update profile",
        severity: "error",
      });
    }
  }
};

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <Card
        sx={{
          width: { xs: '100%', sm: '600px' },
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0px 6px 20px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Avatar
              alt={profile.userName}
              sx={{
                width: { xs: 120, sm: 150 },
                height: { xs: 120, sm: 150 },
                margin: 'auto',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {profile.userName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'gray', mb: 1 }}>
                Employee Id: {profile.empId}
              </Typography>
              <Typography variant="body2" sx={{ color: 'gray', mb: 1 }}>
                Role: {profile.role}
              </Typography>

              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    label="Email"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Mobile"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                </>
              ) : (
                <>
                  <Typography variant="body2" sx={{ color: 'gray', mb: 1 }}>
                    Email: {profile.emailId}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'gray', mb: 1 }}>
                    Mobile: {profile.mobileNumber}
                  </Typography>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: '10px' }}>
                {isEditing ? (
                  <>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                      Save
                    </Button>
                    <Button variant="outlined" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Tooltip title="Edit Profile" arrow>
                      <IconButton
                        onClick={() => setIsEditing(true)}
                        sx={{
                          backgroundColor: '#1976d2',
                          color: '#fff',
                          '&:hover': { backgroundColor: '#115293' },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Profile Settings" arrow>
                      <IconButton
                        sx={{
                          backgroundColor: '#fff',
                          border: '1px solid #1976d2',
                          color: '#1976d2',
                          '&:hover': { backgroundColor: '#1976d2', color: '#fff' },
                        }}
                      >
                        <SettingsIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Snackbar for feedback */}
<Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
>
  <Alert
    onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
    severity={snackbar.severity}
    sx={{ width: "100%", whiteSpace: "pre-line" }} // preserves line breaks
  >
    {snackbar.message}
  </Alert>
</Snackbar>
    </Box>
  );
};

export default UserProfile;
