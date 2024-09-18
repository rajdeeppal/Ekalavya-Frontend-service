import React, { useState } from 'react';
import { Container, Button, Modal, Typography, Box, AppBar, Toolbar } from '@mui/material';
import SearchBar from './SearchBar';
import ProjectForm from './ProjectForm';
import BeneficiaryForm from './BeneficiaryForm';
import BeneficiaryTable from './BeneficiaryTable';
import { getBeneficiary } from '../DataCenter/apiService';
import Sidebar from './sidebar/Sidebar';


const MainApp = () => {

  
  const [projects, setProjects] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([
    // {
    //     "id": 1,
    //     "verticalName": "BT",
    //     "components": [
    //         {
    //             "id": 1,
    //             "componentName": "Enterprise",
    //             "activities": [
    //                 {
    //                     "id": 1,
    //                     "activityName": "AIB",
    //                     "tasks": [
    //                         {
    //                             "id": 1,
    //                             "taskName": "VOICE",
    //                             "typeOfUnit":"gm",
    //                             "units": "10",
    //                             "ratePerUnit": "800",
    //                             "totalCost":"234",
    //                             "beneficiaryContribution":"12",
    //                             "grantAmount":"234",
    //                             "yearOfSanction":"2009"
    //                         },
    //                         {
    //                             "id": 3,
    //                             "taskName": "CV",
    //                             "typeOfUnit":"gm",
    //                             "units": "20",
    //                             "ratePerUnit": "700",
    //                             "totalCost":"234",
    //                             "beneficiaryContribution":"12",
    //                             "grantAmount":"234",
    //                             "yearOfSanction":"2009"
    //                         }
    //                     ]
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 2,
    //             "componentName": "Consumer",
    //             "activities": [
    //                 {
    //                     "id": 2,
    //                     "activityName": "OFS",
    //                     "tasks": [
    //                         {
    //                             "id": 2,
    //                             "taskName": "Global",
    //                             "typeOfUnit":"gm",
    //                             "units": "96",
    //                             "ratePerUnit": "89",
    //                             "totalCost":"234",
    //                             "beneficiaryContribution":"12",
    //                             "grantAmount":"234",
    //                             "yearOfSanction":"2009"
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // }
]);

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

  const handleSearch = async(criteria) => {
    if (!criteria) return;
    try {
      const data = await getBeneficiary(criteria);
      setBeneficiaries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
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

        <Box sx={{ mt: "-2%" }}>
          <SearchBar onSearch={handleSearch} />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="contained" color="primary" onClick={() => setShowProjectModal(true)}>
              Add Project
            </Button>
            <Button variant="contained" color="primary" onClick={() => setShowBeneficiaryModal(true)}>
              Add Beneficiary
            </Button>
          </Box>
        </Box>

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

        <BeneficiaryTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} />
      </Box>
    </Box>
  );
};

export default MainApp;
