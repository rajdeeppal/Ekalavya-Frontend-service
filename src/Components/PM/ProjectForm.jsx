import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, Alert, Divider, Typography
} from '@mui/material';
import { saveProjectConfiguration, getVerticals } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import ProjectLogoUpload from './ProjectLogoUpload';

const ProjectForm = ({ addProject }) => {
  const { userId } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [project, setProject] = useState({ projectName: '', verticalName: '' });
  const [errors, setErrors] = useState({});
  const [verticals, setVerticals] = useState([]);
  const [selectedVertical, setSelectedVertical] = useState('');
  const [logoFile, setLogoFile] = useState(null);   // cropped File blob from ProjectLogoUpload
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVerticals() {
      const data = await getVerticals();
      setVerticals(Array.isArray(data) ? data : []);
    }
    fetchVerticals();
  }, []);

  const validateForm = () => {
    const formErrors = {};
    if (!project.projectName) formErrors.projectName = 'Project name is required';
    if (!selectedVertical)    formErrors.vertical = 'Vertical is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'verticalName') setSelectedVertical(value);
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await saveProjectConfiguration(
        userId,
        project.projectName,
        selectedVertical,
        logoFile           // null if no logo chosen — backend accepts it as optional
      );
      enqueueSnackbar('Project saved successfully!', { variant: 'success' });
      addProject({ ...project, verticalName: selectedVertical });
      setProject({ projectName: '', verticalName: '' });
      setSelectedVertical('');
      setLogoFile(null);
    } catch (error) {
      console.error('Error saving project:', error);
      enqueueSnackbar(
        error?.response?.data || 'Failed to save. Please try again.',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
      {/* Logo upload section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1, mb: 1 }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: 1, fontWeight: 600, letterSpacing: 0.5 }}
        >
          PROJECT LOGO (optional)
        </Typography>
        <ProjectLogoUpload onLogoChange={setLogoFile} size={90} />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <TextField
        fullWidth
        label="Project Name"
        name="projectName"
        value={project.projectName}
        placeholder="Enter project name"
        onChange={handleChange}
        margin="normal"
        required
        error={!!errors.projectName}
        helperText={errors.projectName}
      />

      <FormControl fullWidth margin="normal" error={!!errors.vertical}>
        <InputLabel>Vertical</InputLabel>
        <Select
          name="verticalName"
          value={selectedVertical}
          onChange={handleChange}
          required
          label="Vertical"
        >
          <MenuItem value="">Select Vertical</MenuItem>
          {verticals.map((v) => (
            <MenuItem key={v.id} value={v.verticalName}>
              {v.verticalName}
            </MenuItem>
          ))}
        </Select>
        {errors.vertical && <Alert severity="error" sx={{ mt: 0.5 }}>{errors.vertical}</Alert>}
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ mt: 2, width: '100%', borderRadius: '15px', py: 1.2, fontWeight: 600 }}
      >
        {loading ? 'Saving…' : 'Create Project'}
      </Button>
    </Box>
  );
};

export default ProjectForm;
