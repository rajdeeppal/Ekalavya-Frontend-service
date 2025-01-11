import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { saveProjectConfiguration, getVerticals } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';

const ProjectForm = ({ addProject }) => {
  const { userId } = useAuth();
  const [project, setProject] = useState({
    projectName: '',
    verticalName: ''
  });
  const [errors, setErrors] = useState('');
  const [verticals, setVerticals] = useState([]);
  const [selectedVertical, setSelectedVertical] = useState('');

  useEffect(() => {
    async function fetchVerticals() {
      const data = await getVerticals();
      setVerticals(Array.isArray(data) ? data : []);
    }
    fetchVerticals();
  }, []);

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
    if (name === 'verticalName') {
      setSelectedVertical(value);
    }
    setProject((prev) => ({ ...prev, [name]: value }));

  };

  const handleSubmit = async () => {
    try {
      await saveProjectConfiguration(userId, project);
      alert('Project saved successfully!');
      addProject(project); // Call addProject only after successful save
      setProject({ projectName: '', verticalName: '' }); // Reset form

    } catch (error) {
      console.error('Error saving beneficiary and task:', error);
      alert('Failed to save. Please try again.');
    }
    addProject(project);
    console.log(project);
  };

  return (
    <Box sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <TextField
        fullWidth
        label="Project Name"
        name="projectName"
        placeholder="Project Name"
        onChange={handleChange}
        margin="normal"
        required
        error={!!errors.beneficiaryName}
        helperText={errors.beneficiaryName}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Vertical</InputLabel>
        <Select
          name="verticalName"
          value={selectedVertical}
          onChange={handleChange}
          required
        >
          <MenuItem value="">Select Vertical</MenuItem>
          {verticals.map((project) => (
            <MenuItem key={project.id} value={project.verticalName}>
              {project.verticalName}
            </MenuItem>
          ))}
        </Select>
        {errors.selectedVertical && <Alert severity="error">{errors.selectedVertical}</Alert>}
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }} style={{width:"100%",borderRadius:"15px"}}>
        Submit
      </Button>
    </Box>
  );
};

export default ProjectForm;
