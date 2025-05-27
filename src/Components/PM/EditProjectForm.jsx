import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { updateProjectConfiguration } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';

const EditProjectForm = ({ onClose }) => {
  const { userId } = useAuth();
  const [formData, setFormData] = useState({
    projectId: '',
    updatedProjectName: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.projectId) newErrors.projectId = 'Project ID is required';
    if (!formData.updatedProjectName) newErrors.updatedProjectName = 'New project name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await updateProjectConfiguration(userId, formData);
      alert('Project updated successfully!');
      onClose(); // Close the modal after success
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    }
  };

  return (
    <Box sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <TextField
        fullWidth
        label="Project ID"
        name="projectId"
        value={formData.projectId}
        onChange={handleChange}
        margin="normal"
        required
        error={!!errors.projectId}
        helperText={errors.projectId}
      />

      <TextField
        fullWidth
        label="New Project Name"
        name="updatedProjectName"
        value={formData.updatedProjectName}
        onChange={handleChange}
        margin="normal"
        required
        error={!!errors.updatedProjectName}
        helperText={errors.updatedProjectName}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
        style={{ width: '100%', borderRadius: '15px' }}
      >
        Update Project
      </Button>
    </Box>
  );
};

export default EditProjectForm;
