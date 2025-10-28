import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box, Grid } from '@mui/material';
import SearchBar from './SearchBar';
import ProjectForm from './ProjectForm';
import EditProjectForm from './EditProjectForm';
import BeneficiaryForm from './BeneficiaryForm';
import BeneficiaryTable from './BeneficiaryTable';
import { getTraining } from '../DataCenter/apiService';
import Sidebar from './sidebar/Sidebar';

import Navbar from './navbar/Navbar';
import { useAuth } from '../PrivateRoute';
import TrainingForm from './TrainingForm';
import TrainingSearchBar from './TrainingSearchBar';
import TrainingTable from './TrainingTable';

const TrainingIframe = () => {
  const { userId } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [value, setValue] = useState(false);
  const [showTraining, setShowTraining] = useState('');

  useEffect(() => {
    console.log("isSuccess:", isSuccess);
    if (isSuccess) {
      console.log("Calling handleSearch...");
      handleSearch(value);
    }
  }, [isSuccess]);

  const [showCommonExpeditureModal, setShowCommonExpeditureModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);

  const handleSearch = async (criteria) => {
    if (!criteria) return;
    try {
      console.log("ok");
      const data = await getTraining(userId, criteria, 'sanction');
      setBeneficiaries(Array.isArray(data) ? data : []);
      setShowTable(true);
      console.log(beneficiaries);
      setShowTraining(criteria.formType);
      setIsSuccess(false);
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
    <Box sx={{ display: 'flex' }} style={{ backgroundColor: "#F0F5F9" }}>
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
          <TrainingSearchBar onSearch={handleSearch} />
          <Box sx={{ display: 'flex', gap: 2, mt: 3, ml: 3 }} >
            <Button variant="contained" color="primary" onClick={() => setShowCommonExpeditureModal(true)}>
              Add Common Expenditure
            </Button>
            <Button variant="contained" color="primary" onClick={() => setShowTrainingModal(true)}>
              Add Training
            </Button>
          </Box>
        </Box>
        <Modal
          open={showCommonExpeditureModal}
          onClose={() => setShowCommonExpeditureModal(false)}
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
              Add Common Expenditure
            </Typography>
            <TrainingForm isTraining={false} isExpenditure={true} />
          </Box>
        </Modal>

        <Modal
          open={showTrainingModal}
          onClose={() => setShowTrainingModal(false)}
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
              Add Training
            </Typography>
            <TrainingForm isTraining={true}  isExpenditure={false}/>
          </Box>
        </Modal>

        {showTable && <Box sx={{ borderRadius: 2, boxShadow: 1, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
          <TrainingTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} setIsSuccess={setIsSuccess} value={value} showTraining={showTraining} />
        </Box>}
      </Box>

    </Box >

  );
};

export default TrainingIframe;
