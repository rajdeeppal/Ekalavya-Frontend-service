import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Typography, Container, Box, Fade, IconButton, Badge } from '@mui/material';
import PendingRequests from './PendingRequests';
import RoleManagement from './RoleManagement';
import TaskIframe from './TaskIframe';
import AddPayeeAccount from './AddPayeeAccount';
import DeleteBeneficiary from './DeleteBeneficiary';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import VoucherPortal from './VoucherPortal';
import DeleteJobPortal from './DeleteJobPortal';

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('PendingRequests');
  const [fadeIn, setFadeIn] = useState(true);
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  const handleComponentSwitch = (component) => {
    if (activeComponent !== component) {
      setFadeIn(false);
      setTimeout(() => {
        setActiveComponent(component);
        setFadeIn(true);
      }, 300);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'PendingRequests':
        return <PendingRequests setPendingCount={setPendingCount} />;
      case 'RoleManagement':
        return <RoleManagement />;
      case 'TaskIframe':
        return <TaskIframe />;
      case 'AddPayeeAccount':
        return <AddPayeeAccount />;
      case 'DeleteBeneficiary':
        return <DeleteBeneficiary />;
      case 'VoucherPortal':
        return <VoucherPortal />;
      case 'DeleteJobPortal':
        return <DeleteJobPortal />;
      default:
        return <PendingRequests />;
    }
  };

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Admin Dashboard
          </Typography>

          <Button
            sx={{
              fontWeight: activeComponent === 'PendingRequests' ? 'bold' : 'normal',
              color: activeComponent === 'PendingRequests' ? '#8ce0f5' : 'inherit',
              borderBottom: activeComponent === 'PendingRequests' ? '2px solid #8ce0f5' : 'none',
            }}
            onClick={() => handleComponentSwitch('PendingRequests')}
          >
            <Badge badgeContent={pendingCount} color="error">
              Pending Requests
            </Badge>
          </Button>
          <Button
            sx={{
              fontWeight: activeComponent === 'RoleManagement' ? 'bold' : 'normal',
              color: activeComponent === 'RoleManagement' ? '#8ce0f5' : 'inherit',
              borderBottom: activeComponent === 'RoleManagement' ? '2px solid #8ce0f5' : 'none',
            }}
            onClick={() => handleComponentSwitch('RoleManagement')}
          >
            Role Management
          </Button>
          <Button
            sx={{
              fontWeight: activeComponent === 'TaskIframe' ? 'bold' : 'normal',
              color: activeComponent === 'TaskIframe' ? '#8ce0f5' : 'inherit',
              borderBottom: activeComponent === 'TaskIframe' ? '2px solid #8ce0f5' : 'none',
            }}
            onClick={() => handleComponentSwitch('TaskIframe')}
          >
            Project Configuration
          </Button>
          <Button
            sx={{
              fontWeight: activeComponent === 'AddPayeeAccount' ? 'bold' : 'normal',
              color: activeComponent === 'AddPayeeAccount' ? '#8ce0f5' : 'inherit',
              borderBottom: activeComponent === 'AddPayeeAccount' ? '2px solid #8ce0f5' : 'none',
            }}
            onClick={() => handleComponentSwitch('AddPayeeAccount')}
          >
            Add Bank Account
          </Button>
          <Button
            sx={{
              fontWeight: activeComponent === 'DeleteBeneficiary' ? 'bold' : 'normal',
              color: activeComponent === 'DeleteBeneficiary' ? '#8ce0f5' : 'inherit',
              borderBottom: activeComponent === 'DeleteBeneficiary' ? '2px solid #8ce0f5' : 'none',
            }}
            onClick={() => handleComponentSwitch('DeleteBeneficiary')}
          >
            Delete Beneficiary
          </Button>

          <Button
            sx={{
              fontWeight: activeComponent === 'VoucherPortal' ? 'bold' : 'normal',
              color: activeComponent === 'VoucherPortal' ? '#8ce0f5' : 'inherit',
              borderBottom: activeComponent === 'VoucherPortal' ? '2px solid #8ce0f5' : 'none',
            }}
            onClick={() => handleComponentSwitch('VoucherPortal')}
          >
            Voucher Portal
          </Button>

          <Button
            sx={{
              fontWeight: activeComponent === 'DeleteJobPortal' ? 'bold' : 'normal',
              color: activeComponent === 'DeleteJobPortal' ? '#8ce0f5' : 'inherit',
              borderBottom: activeComponent === 'DeleteJobPortal' ? '2px solid #8ce0f5' : 'none',
            }}
            onClick={() => handleComponentSwitch('DeleteJobPortal')}
          >
            Delete Job
          </Button>

          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{ marginLeft: 'auto', color: '#ffeb3b' }}
          >
            <LogoutIcon />
            <Typography variant="body2" sx={{ marginLeft: 1 }}>
              Logout
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>

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
