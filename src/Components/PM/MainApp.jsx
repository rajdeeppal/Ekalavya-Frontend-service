import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Button, Modal, Typography, Box, Grid } from '@mui/material';
import SearchBar from './SearchBar';
import ProjectForm from './ProjectForm';
import EditProjectForm from './EditProjectForm';
import BeneficiaryForm from './BeneficiaryForm';
import BeneficiaryTable from './BeneficiaryTable';
import { getBeneficiary, downloadTemplate, uploadTemplate } from '../DataCenter/apiService';
import Sidebar from './sidebar/Sidebar';

import Navbar from './navbar/Navbar';
import { useAuth } from '../PrivateRoute';

const MainApp = () => {
  const { userId } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [isSuccess, setIsSucess] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [value, setValue] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    console.log("isSuccess:", isSuccess);
    if (isSuccess) {
      console.log("Calling handleSearch...");
      handleSearch(value);
    }
  }, [isSuccess]);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
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
      const data = await getBeneficiary(userId, criteria, 'sanction');
      setBeneficiaries(Array.isArray(data) ? data : []);
      setShowTable(true);
      console.log(beneficiaries);
      setIsSucess(false);
      setValue(criteria);
      console.log(isSuccess);
    } catch (error) {
      setShowTable(false);
      enqueueSnackbar(error.message || 'Error fetching activities', { variant: 'error' });
      console.error('Error fetching activities:', error);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const data = await downloadTemplate();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Beneficiary_Template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };


  const handleUploadTemplate = async () => {
    if (!selectedFile) {
      enqueueSnackbar('Please select a file first.', { variant: 'warning' });
      return;
    }

    try {
      const responseMessage = await uploadTemplate(userId, selectedFile);
      enqueueSnackbar(`Upload Successful: ${responseMessage}`, { variant: 'success' });
      setShowUploadModal(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      enqueueSnackbar("File upload failed. Please try again.", { variant: 'error' });
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
          <SearchBar onSearch={handleSearch} />
          <Box sx={{ display: 'flex', gap: 2, mt: 3, ml: 3 }} >
            <Button variant="contained" color="primary" onClick={handleDownloadTemplate}>
              Download template
            </Button>
            <Button variant="contained" color="primary" onClick={() => setShowUploadModal(true)}>
              Upload template
            </Button>
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

        <Modal
          open={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          aria-labelledby="upload-modal-title"
          aria-describedby="upload-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: 300, sm: 400 }, // responsive width
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 28,
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              id="upload-modal-title"
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontWeight: "bold", color: "primary.main", textAlign: "center" }}
            >
              Upload Beneficiary Data
            </Typography>

            <Typography
              id="upload-modal-description"
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, textAlign: "center" }}
            >
              Please select an Excel file to upload beneficiary details.
            </Typography>

            <Button
              variant="outlined"
              component="label"
              sx={{
                mb: 3,
                width: "100%",
                textTransform: "none",
                borderRadius: 2,
                border: "1px dashed",
                color: "text.primary",
                "&:hover": {
                  border: "1px dashed",
                  backgroundColor: "grey.100",
                },
              }}
            >
              {selectedFile ? selectedFile.name : "Choose File"}
              <input
                type="file"
                accept=".xlsx, .xls"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleUploadTemplate}
              disabled={!selectedFile}
              fullWidth
              sx={{
                borderRadius: 2,
                py: 1.5,
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Upload
            </Button>
          </Box>
        </Modal>


        {showTable && <Box sx={{ borderRadius: 2, boxShadow: 1, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
          <BeneficiaryTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} setIsSucess={setIsSucess} value={value} />
        </Box>}
      </Box>

    </Box >

  );
};

export default MainApp;
