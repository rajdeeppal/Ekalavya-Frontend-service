import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const ProjectForm = ({ addProject }) => {

  const [project, setProject] = useState({
    projectName: '',
    vertical: ''
  });
  const [errors, setErrors] = useState('');

  const validateForm = () => {
    // Check if all fields are filled
    let formErrors = {};
    if (!project.projectName) formErrors.projectName = 'Project name is required';
    if (!project.vertical) formErrors.vertical = 'vertical is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));

  };

  const handleSubmit = () => {
    addProject(project);
    console.log(project);
  };

  return (
    <Box sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <TextField
        fullWidth
        label="Project Name"
        name="Project"
        placeholder="Project Name"
        onChange={handleChange}
        margin="normal"
        required
        error={!!errors.beneficiaryName}
        helperText={errors.beneficiaryName}
      />

      <TextField
        fullWidth
        label="Vertical"
        name="guardianName"
        placeholder="Vertical"
        onChange={handleChange}
        margin="normal"
        required
        error={!!errors.guardianName}
        helperText={errors.guardianName}
      />

      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  );
};

export default ProjectForm;
