import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box,Grid  } from '@mui/material';
import SearchBar from './SearchBar';
import ProjectForm from './ProjectForm';
import EditProjectForm from './EditProjectForm';
import BeneficiaryForm from './BeneficiaryForm';
import BeneficiaryTable from './BeneficiaryTable';
import { getBeneficiary } from '../DataCenter/apiService';
import Sidebar from './sidebar/Sidebar';

import Navbar from './navbar/Navbar';
import { useAuth } from '../PrivateRoute';

const MainApp = () => {
  const { userId } = useAuth();
  const [isSuccess,setIsSucess]=useState(false);
  const [projects, setProjects] = useState([]);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [value,setValue]=useState(false);

  useEffect(() => {
    console.log("isSuccess:", isSuccess);
    if (isSuccess) {
      console.log("Calling handleSearch...");
      handleSearch(value);
    }
  }, [isSuccess]);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false);

  const addProject = (project) => {
    setProjects((prev) => [...prev, project]);
    console.log(projects);
    setShowProjectModal(false);
  };

  const addBeneficiary = (beneficiary) => {
    setBeneficiaries((prev) => [...prev, beneficiary]);
    setShowBeneficiaryModal(false);
  };

  const handleSearch = async (criteria) => {
    if (!criteria) return;
    try {
      console.log("ok");
      const data = await getBeneficiary(userId,criteria,'sanction');
      setBeneficiaries(Array.isArray(data) ? data : []);
      setShowTable(true);
      console.log(beneficiaries);
      setIsSucess(false);
      setValue(criteria);
      console.log(isSuccess);
    } catch (error) {
      setShowTable(false);
      alert(error);
      console.error('Error fetching activities:', error);
    }
  };

  return (
    // <div className="home" style={{backgroundColor:"#F0F5F9"}}>
   <Box sx={{ display: 'flex' }} style={{backgroundColor:"#F0F5F9"}}>
      <Sidebar />
      
      <Box
        component="main"
        sx={{
          flex: 6,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >

        <Box sx={{ borderRadius: 2, boxShadow: 1, backgroundColor: 'background.paper', pb: 3 }}>
          <SearchBar onSearch={handleSearch} />
          <Box sx={{ display: 'flex', gap: 2, mt: 3, ml: 3 }} >
            <Button variant="contained" color="primary" onClick={() => setShowProjectModal(true)}>
              Add Project
            </Button>
            <Button variant="contained" color="primary" onClick={() => setShowEditProjectModal(true)}>
              Edit Project
            </Button>
            <Button variant="contained" color="primary" onClick={() => setShowBeneficiaryModal(true)}>
              Add Beneficiary
            </Button>
          </Box>
        </Box>
<Modal
  open={showEditProjectModal}
  onClose={() => setShowEditProjectModal(false)}
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      borderRadius: 1,
      boxShadow: 24,
      p: 4,
    }}
  >
    <Typography variant="h6" component="h2" gutterBottom>
      Edit Project
    </Typography>
    <EditProjectForm onClose={() => setShowEditProjectModal(false)} />
  </Box>
</Modal>
        <Modal
          open={showProjectModal}
          onClose={() => setShowProjectModal(false)}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Add Project
            </Typography>
            <ProjectForm addProject={addProject} />
          </Box>
        </Modal>

        <Modal
          open={showBeneficiaryModal}
          onClose={() => setShowBeneficiaryModal(false)}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Add Beneficiary
            </Typography>
            <BeneficiaryForm projects={projects} addBeneficiary={addBeneficiary} />
          </Box>
        </Modal>

        {showTable && <Box sx={{ borderRadius: 2, boxShadow: 1, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
          <BeneficiaryTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} setIsSucess={setIsSucess} value={value}/>
        </Box>}
      </Box>
     
    </Box >
    
  );
};

export default MainApp;
