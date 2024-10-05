import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Typography, Container, Box, Fade, IconButton, Badge } from '@mui/material';
import PendingRequests from './PendingRequests';
import RoleManagement from './RoleManagement';
import TaskIframe from './TaskIframe';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout'; // Icon for logout

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('PendingRequests');
  const [fadeIn, setFadeIn] = useState(true);
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  // Handle switching components with fade animation
  const handleComponentSwitch = (component) => {
    if (activeComponent !== component) {
      setFadeIn(false);
      setTimeout(() => {
        setActiveComponent(component);
        setFadeIn(true);
      }, 300); // Set timeout to match the transition duration
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Remove JWT token from localStorage
    navigate('/'); // Redirect to the login page
  };

  // Render the selected component
  const renderComponent = () => {
    switch (activeComponent) {
      case 'PendingRequests':
        return <PendingRequests setPendingCount={setPendingCount} />;
      case 'RoleManagement':
        return <RoleManagement />;
      case 'TaskIframe':
        return <TaskIframe />;
      default:
        return <PendingRequests />;
    }
  };

  return (
    <div>
      {/* Navigation Header */}
      <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Admin Dashboard
          </Typography>

          {/* Updated navigation buttons with dynamic styling */}
          <Button
            color={activeComponent === 'PendingRequests' ? 'secondary' : 'inherit'}
            sx={{
              fontWeight: activeComponent === 'PendingRequests' ? 'bold' : 'normal',
              borderBottom: activeComponent === 'PendingRequests' ? '2px solid #ffeb3b' : 'none',
            }}
            onClick={() => handleComponentSwitch('PendingRequests')}
          >
            <Badge badgeContent={pendingCount} color="error">
              Pending Requests
            </Badge>
          </Button>
          <Button
            color={activeComponent === 'RoleManagement' ? 'secondary' : 'inherit'}
            sx={{
              fontWeight: activeComponent === 'RoleManagement' ? 'bold' : 'normal',
              borderBottom: activeComponent === 'RoleManagement' ? '2px solid #ffeb3b' : 'none',
            }}
            onClick={() => handleComponentSwitch('RoleManagement')}
          >
            Role Management
          </Button>
          <Button
            color={activeComponent === 'TaskIframe' ? 'secondary' : 'inherit'}
            sx={{
              fontWeight: activeComponent === 'TaskIframe' ? 'bold' : 'normal',
              borderBottom: activeComponent === 'TaskIframe' ? '2px solid #ffeb3b' : 'none',
            }}
            onClick={() => handleComponentSwitch('TaskIframe')}
          >
            Project Configuration
          </Button>

          {/* Logout Button with an Icon */}
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{ marginLeft: 'auto', color: '#ffeb3b' }} // Yellow color for logout
          >
            <LogoutIcon />
            <Typography variant="body2" sx={{ marginLeft: 1 }}>
              Logout
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content Area with Fade Transition */}
      <Container maxWidth={false} disableGutters>
        <Fade in={fadeIn} timeout={300}>
          <Box mt={4} sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, p: 4, boxShadow: 3 }}>
            {renderComponent()}
          </Box>
        </Fade>
      </Container>
    </div>
  );
};

export default AdminDashboard;
