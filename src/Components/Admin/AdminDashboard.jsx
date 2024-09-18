import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Typography, Container, Box } from '@mui/material';
import PendingRequests from './PendingRequests';
import { Fade } from '@mui/material';
import RoleManagement from './RoleManagement';
import TaskIframe from './TaskIframe';

const AdminDashboard = () => {
  // State to manage which component to render
  const [activeComponent, setActiveComponent] = useState('PendingRequests');
  const [fadeIn, setFadeIn] = useState(true);

  // Handle switching components with transition
  const handleComponentSwitch = (component) => {
    setFadeIn(false);
    setTimeout(() => {
      setActiveComponent(component);
      setFadeIn(true);
    }, 300); // Set timeout to match the transition duration
  };


  // Function to render the selected component
  const renderComponent = () => {
    switch (activeComponent) {
      case 'PendingRequests':
        return <PendingRequests />;
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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={() => handleComponentSwitch('PendingRequests')}>
            Pending Requests
          </Button>
          <Button color="inherit" onClick={() => handleComponentSwitch('RoleManagement')}>
            Role Management
          </Button>
          <Button color="inherit" onClick={() => handleComponentSwitch('TaskIframe')}>
            Project Configuration
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content with Transition */}
      <Container>
        <Fade in={fadeIn} timeout={300}>
          <Box mt={4}>{renderComponent()}</Box>
        </Fade>
      </Container>
    </div>
  );
};

export default AdminDashboard;
