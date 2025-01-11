import React, { useEffect,useState } from 'react';
import { Avatar, Box, Typography, Grid, Card, Button, Divider, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../PrivateRoute';
import { getProfileDetails } from '../DataCenter/apiService';

const UserProfile = () => {
  const { userId } = useAuth();
  const [profile,setProfile]=useState([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        console.log("ok");
        const data = await getProfileDetails(userId);
        setProfile(data);
        console.log(profile);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    }
    fetchTasks();
  }, []);

  const user = {
    profilePicture: 'https://via.placeholder.com/150', // Replace with actual profile picture URL
    username: 'JohnDoe',
    empId: 'EMP12345',
    email: 'john.doe@example.com',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5', // Light background to reduce visual fatigue
        padding: '20px',
      }}
    >
      <Card
        sx={{
          width: { xs: '100%', sm: '600px' }, // Responsive width
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0px 6px 20px rgba(0,0,0,0.1)',
          backgroundColor: '#fff', // Clean white background
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
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow for profile picture
              }}
            >
            </Avatar>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {profile.userName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'gray', mb: 1 }}>
                Role: {profile.role}
              </Typography>
              <Typography variant="body2" sx={{ color: 'gray', mb: 1 }}>
                Email: {profile.emailId}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  gap: '10px',
                }}
              >
                <Tooltip title="Edit Profile" arrow>
                  <IconButton
                    aria-label="edit profile"
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
                    aria-label="profile settings"
                    sx={{
                      backgroundColor: '#fff',
                      border: '1px solid #1976d2',
                      color: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#1976d2',
                        color: '#fff',
                      },
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default UserProfile;
