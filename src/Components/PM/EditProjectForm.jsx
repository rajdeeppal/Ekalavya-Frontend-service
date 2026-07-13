import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box, TextField, Button, Typography, Divider,
  Paper, List, ListItem, ListItemAvatar, ListItemText,
  Avatar, CircularProgress, InputAdornment, IconButton,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { updateProjectConfiguration, getUserProjects, getProjectLogo } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import ProjectLogoUpload from './ProjectLogoUpload';

/**
 * The backend appends `_<projectId>` to every project name on save (e.g. "ABC" → "ABC_100").
 * This helper strips that suffix so the UI shows only the human-readable part.
 * Uses a regex so it works even if projectId is not yet in the API response.
 * Examples:
 *   stripProjectIdSuffix("Ghumnur Water_100") → "Ghumnur Water"
 *   stripProjectIdSuffix("ABC_100_100")       → "ABC_100"
 *   stripProjectIdSuffix("XYZ")               → "XYZ"  (no suffix — unchanged)
 */
const stripProjectIdSuffix = (name) => {
  if (!name) return '';
  return name.replace(/_\d+$/, '');
};

const EditProjectForm = ({ onClose, userId: userIdProp }) => {
  const { userId: userIdFromCtx } = useAuth();
  const userId = userIdProp ?? userIdFromCtx;   // prefer prop, fall back to context
  const { enqueueSnackbar } = useSnackbar();

  const [allProjects, setAllProjects]           = useState([]);
  const [projectsLoading, setProjectsLoading]   = useState(false);
  const [searchText, setSearchText]             = useState('');
  const [suggestions, setSuggestions]           = useState([]);
  const [showDropdown, setShowDropdown]         = useState(false);
  const dropdownRef                             = useRef(null);
  const [selectedProject, setSelectedProject]   = useState(null);
  const [existingLogoUrl, setExistingLogoUrl]   = useState(null);
  const [logoLoading, setLogoLoading]           = useState(false);
  const [updatedProjectName, setUpdatedProjectName] = useState('');
  const [newLogoFile, setNewLogoFile]           = useState(null);
  const [nameError, setNameError]               = useState('');
  const [submitting, setSubmitting]             = useState(false);

  useEffect(() => {
    if (!userId) return;
    setProjectsLoading(true);
    getUserProjects(userId)
      .then((data) => setAllProjects(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Error fetching PM projects:', err);
        enqueueSnackbar('Could not load your projects list.', { variant: 'warning' });
      })
      .finally(() => setProjectsLoading(false));
  }, [userId]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    // If a project is already selected, keep the dropdown closed
    if (selectedProject) { setShowDropdown(false); return; }
    const q = searchText.trim().toLowerCase();
    if (!q) { setSuggestions([]); setShowDropdown(false); return; }
    const filtered = allProjects.filter((p) =>
      p.projectName?.toLowerCase().startsWith(q) ||
      String(p.projectId ?? '').startsWith(q)
    );
    setSuggestions(filtered);
    setShowDropdown(true);
  }, [searchText, allProjects, selectedProject]);

  const handleSelectProject = useCallback(async (project) => {
    const cleanName = stripProjectIdSuffix(project.projectName);
    setSelectedProject(project);
    setUpdatedProjectName(cleanName);
    setSearchText(cleanName);
    setShowDropdown(false);
    setNameError('');
    setNewLogoFile(null);
    if (project.logoKey) {
      setLogoLoading(true);
      try {
        const logoUrl = await getProjectLogo(project.id);
        setExistingLogoUrl(logoUrl);
      } catch { setExistingLogoUrl(null); }
      finally { setLogoLoading(false); }
    } else {
      setExistingLogoUrl(null);
    }
  }, []);

  const handleClearSelection = () => {
    setSelectedProject(null); setSearchText(''); setSuggestions([]);
    setShowDropdown(false); setUpdatedProjectName('');
    setExistingLogoUrl(null); setNewLogoFile(null); setNameError('');
  };

  const handleSubmit = async () => {
    if (!selectedProject) { enqueueSnackbar('Please select a project first.', { variant: 'warning' }); return; }
    if (!updatedProjectName.trim()) { setNameError('Project name is required'); return; }
    setNameError(''); setSubmitting(true);
    try {
      await updateProjectConfiguration(userId, selectedProject.projectId, updatedProjectName.trim(), newLogoFile);
      enqueueSnackbar('Project updated successfully!', { variant: 'success' });
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
      enqueueSnackbar(error?.response?.data || 'Failed to update project. Please try again.', { variant: 'error' });
    } finally { setSubmitting(false); }
  };

  return (
    <Box sx={{ px: 0.5 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>
        STEP 1 — SELECT YOUR PROJECT
      </Typography>

      <Box ref={dropdownRef}>
        <TextField
          fullWidth size="small"
          label="Search project by name or ID"
          value={searchText}
          disabled={projectsLoading}
          onChange={(e) => {
            if (selectedProject && e.target.value !== selectedProject.projectName) {
              setSelectedProject(null); setExistingLogoUrl(null);
            }
            setSearchText(e.target.value);
          }}
          onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {projectsLoading ? <CircularProgress size={16} /> : <SearchIcon fontSize="small" color="action" />}
              </InputAdornment>
            ),
            endAdornment: searchText && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSelection}><ClearIcon fontSize="small" /></IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Dropdown — in normal document flow, no position:absolute, no overflow clipping */}
        {showDropdown && suggestions.length > 0 && (
          <Paper
            elevation={4}
            sx={{
              mt: 0.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <List dense disablePadding>
              {suggestions.map((project, index) => (
                <ListItem
                  key={project.id ?? index}
                  button
                  onClick={() => handleSelectProject(project)}
                  sx={{
                    px: 2, py: 1.5,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    borderBottom: index < suggestions.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 44 }}>
                    <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.light' }}>
                      <FolderOpenIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600}>
                        {stripProjectIdSuffix(project.projectName)}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        Project ID: {project.projectId}
                        {project.logoKey && (
                          <Chip label="Has logo" size="small" color="success" variant="outlined" sx={{ ml: 1, height: 16, fontSize: 10 }} />
                        )}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {showDropdown && suggestions.length === 0 && searchText.trim() && !projectsLoading && (
          <Paper elevation={2} sx={{ mt: 0.5, p: 2, borderRadius: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">No projects matching "{searchText}"</Typography>
          </Paper>
        )}
      </Box>

      {selectedProject && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>
            STEP 2 — EDIT PROJECT DETAILS
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1, mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600, letterSpacing: 0.5 }}>
              PROJECT LOGO (optional)
            </Typography>
            {logoLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="caption" color="text.secondary">Loading existing logo…</Typography>
              </Box>
            ) : (
              <ProjectLogoUpload
                key={selectedProject.id}
                onLogoChange={setNewLogoFile}
                existingLogoUrl={existingLogoUrl}
                size={90}
              />
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          <TextField
            fullWidth
            label="Project Name"
            value={updatedProjectName}
            onChange={(e) => { setUpdatedProjectName(e.target.value); if (e.target.value.trim()) setNameError(''); }}
            margin="normal"
            required
            error={!!nameError}
            helperText={nameError}
            placeholder="Enter updated project name"
          />

          <Button
            variant="contained" color="primary"
            onClick={handleSubmit} disabled={submitting}
            sx={{ mt: 2, width: '100%', borderRadius: '15px', py: 1.2, fontWeight: 600 }}
          >
            {submitting ? 'Updating…' : 'Update Project'}
          </Button>
        </>
      )}

      {!selectedProject && !searchText && (
        <Box sx={{ mt: 3, p: 3, textAlign: 'center', border: '1.5px dashed', borderColor: 'divider', borderRadius: 2, color: 'text.secondary' }}>
          <FolderOpenIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
          <Typography variant="body2">Search for your project above to start editing.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default EditProjectForm;
