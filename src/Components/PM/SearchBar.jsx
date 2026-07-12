import React, { useState, useEffect, useRef } from 'react';
import {
  TextField, Button, Grid, Container, FormControl,
  InputLabel, Select, MenuItem, Box, Avatar, Typography,
  Chip, Skeleton, Fade, Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import {
  getUserProjects, getComponentsByProject,
  getStateDetails, getDistrictDetails, getProjectLogo
} from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';

// ─── Animated Project Identity Card ─────────────────────────────────────────
const ProjectIdentityCard = ({ project, logoUrl, logoLoading }) => {
  if (!project) return null;

  return (
    <Fade in={!!project} timeout={350}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 2.5,
          py: 1.5,
          mb: 2,
          mx: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #E3F2FD 0%, #EDE7F6 100%)',
          border: '1px solid',
          borderColor: 'primary.100',
          animation: 'slideDown 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '@keyframes slideDown': {
            from: { opacity: 0, transform: 'translateY(-12px) scale(0.97)' },
            to:   { opacity: 1, transform: 'translateY(0)    scale(1)' },
          },
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: 4,
            background: 'linear-gradient(180deg, #1976D2 0%, #7B1FA2 100%)',
            borderRadius: '4px 0 0 4px',
          },
        }}
      >
        {/* Logo avatar */}
        {logoLoading ? (
          <Skeleton variant="circular" width={52} height={52} />
        ) : logoUrl ? (
          <Avatar
            src={logoUrl}
            sx={{
              width: 52, height: 52,
              border: '2px solid',
              borderColor: 'primary.main',
              boxShadow: '0 2px 8px rgba(25,118,210,0.2)',
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: 52, height: 52,
              bgcolor: 'primary.main',
              border: '2px solid',
              borderColor: 'primary.light',
              boxShadow: '0 2px 8px rgba(25,118,210,0.2)',
            }}
          >
            <FolderSpecialIcon sx={{ fontSize: 26 }} />
          </Avatar>
        )}

        {/* Project info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              fontSize: '0.65rem',
            }}
          >
            Selected Project
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {project.projectName}
          </Typography>
        </Box>

        {/* Active badge */}
        <Chip
          label="Active"
          size="small"
          sx={{
            bgcolor: '#E8F5E9',
            color: '#2E7D32',
            fontWeight: 700,
            fontSize: '0.68rem',
            height: 22,
            border: '1px solid #A5D6A7',
          }}
        />
      </Paper>
    </Fade>
  );
};

// ─── SearchBar ───────────────────────────────────────────────────────────────
const SearchBar = ({ onSearch }) => {
  const { userId } = useAuth();
  const [projects, setProjects] = useState([]);
  const [states, setStates] = useState([]);
  const [district, setDistrict] = useState([]);
  const [components, setComponents] = useState([]);

  const [selectedProject, setSelectedProject]   = useState('');
  const [selectedState, setSelectedState]       = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');

  // logo for the Project Identity Card
  const [cardLogoUrl, setCardLogoUrl]     = useState(null);
  const [cardLogoLoading, setCardLogoLoading] = useState(false);
  const logoRevokRef = useRef(null);      // track blob URL for revocation

  // ── Data fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    getUserProjects(userId).then((data) => setProjects(Array.isArray(data) ? data : []));
  }, [userId]);

  useEffect(() => {
    getStateDetails().then((data) => setStates(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const proj = projects.find((p) => p.projectName === selectedProject);
    if (proj?.id) {
      getComponentsByProject(proj.id).then((data) =>
        setComponents(Array.isArray(data) ? data : [])
      );
    }
  }, [selectedProject, projects]);

  useEffect(() => {
    if (!selectedState) return;
    const state = states.find((s) => s.state_name === selectedState);
    if (state) {
      getDistrictDetails(state.id)
        .then((data) => setDistrict(Array.isArray(data) ? data : []))
        .catch(() => setDistrict([]));
    }
  }, [selectedState, states]);

  // ── Logo loading for Project Identity Card ─────────────────────────────────
  useEffect(() => {
    // Revoke old blob URL to avoid memory leaks
    if (logoRevokRef.current) {
      URL.revokeObjectURL(logoRevokRef.current);
      logoRevokRef.current = null;
    }

    if (!selectedProject) {
      setCardLogoUrl(null);
      return;
    }

    const proj = projects.find((p) => p.projectName === selectedProject);
    if (!proj) return;

    // If the project has a logoKey, fetch it; otherwise show placeholder icon
    if (proj.logoKey) {
      setCardLogoLoading(true);
      getProjectLogo(proj.id).then((url) => {
        logoRevokRef.current = url;
        setCardLogoUrl(url);
        setCardLogoLoading(false);
      });
    } else {
      setCardLogoUrl(null);
      setCardLogoLoading(false);
    }

    return () => {
      if (logoRevokRef.current) URL.revokeObjectURL(logoRevokRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSearch = () => {
    onSearch({
      stateName: selectedState,
      districtName: selectedDistrict,
      projectName: selectedProject,
      componentName: selectedComponent,
    });
  };

  const selectedProjectObj = projects.find((p) => p.projectName === selectedProject) || null;

  const isSearchDisabled =
    !selectedProject.trim() ||
    !selectedDistrict.trim() ||
    !selectedState.trim();

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Container sx={{ mt: 3 }}>
      {/* Project Identity Card — appears when a project is selected */}
      <ProjectIdentityCard
        project={selectedProjectObj}
        logoUrl={cardLogoUrl}
        logoLoading={cardLogoLoading}
      />

      {/* Search filters */}
      <Grid container spacing={3} alignItems="center">
        {/* State */}
        <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth margin="normal">
            <InputLabel>State</InputLabel>
            <Select
              name="stateName"
              value={selectedState}
              label="State"
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('');
              }}
            >
              <MenuItem value="">Select State</MenuItem>
              {states.map((s) => (
                <MenuItem key={s.id} value={s.state_name}>{s.state_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* District */}
        <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth margin="normal">
            <InputLabel>District</InputLabel>
            <Select
              name="districtName"
              value={selectedDistrict}
              label="District"
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <MenuItem value="">Select District</MenuItem>
              {district.map((d) => (
                <MenuItem key={d.id} value={d.district_name}>{d.district_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Project */}
        <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Project Name</InputLabel>
            <Select
              name="projectName"
              value={selectedProject}
              label="Project Name"
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setSelectedComponent('');
              }}
            >
              <MenuItem value="">Select Project</MenuItem>
              {projects.map((p) => (
                <MenuItem key={p.id} value={p.projectName}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {p.logoKey ? (
                      <Avatar
                        src={`https://projects.ekalavya.net/api/user/pm/project/logo/${p.id}`}
                        sx={{ width: 22, height: 22 }}
                      />
                    ) : (
                      <FolderSpecialIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    )}
                    {p.projectName}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Component */}
        <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Component Name</InputLabel>
            <Select
              value={selectedComponent}
              label="Component Name"
              onChange={(e) => setSelectedComponent(e.target.value)}
            >
              <MenuItem value="">Select Component</MenuItem>
              {components.map((c) => (
                <MenuItem key={c.id} value={c.componentName}>{c.componentName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Search button */}
        <Grid item xs={12} sm={6} md={2}>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={isSearchDisabled}
            sx={{
              height: '56px',
              mt: 1,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.95rem',
              boxShadow: '0 3px 10px rgba(25,118,210,0.25)',
              '&:hover': {
                boxShadow: '0 5px 15px rgba(25,118,210,0.35)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchBar;
