import React,{ useState, useEffect} from 'react';
import { TextField, Button, Grid, Container,FormControl, InputLabel, Select, MenuItem, Alert} from '@mui/material';
import {getUserProjects, getComponentsByProject } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';

const SearchBar = ({ onSearch }) => {
  const { userId } = useAuth();
  const [searchCriteria, setSearchCriteria] = React.useState({
    stateName: '',
    districtName: '',
    // projectName: '',
    // componentName: '',
  });
  const [projects, setProjects] = useState([]);
  const [components, setComponents] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');

  useEffect(() => {
    async function fetchProjects() {
      const data = await getUserProjects(userId);
      setProjects(Array.isArray(data) ? data : []);
    }
    fetchProjects();
  }, [userId]);

  useEffect(() => {
    async function fetchComponents() {
      if (!selectedProject) return;
      const data = await getComponentsByProject(selectedProject);
      setComponents(Array.isArray(data) ? data : []);
    }
    fetchComponents();
  }, [selectedProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const data={
      ...searchCriteria,
      projectName:selectedProject,
      componentName:selectedComponent
    }
    onSearch(searchCriteria);
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} md={2.5}>
          <TextField
            fullWidth
            variant="outlined"
            label="State"
            name="stateName"
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
          <TextField
            fullWidth
            variant="outlined"
            label="District Name"
            name="districtName"
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
        <FormControl fullWidth margin="normal">
            <InputLabel>Project Name</InputLabel>
            <Select
              name="projectName"
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                
              }}
              required
            >
              <MenuItem value="">Select Project</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.projectName} >
                  {project.projectName}
                </MenuItem>
              ))}
            </Select>
           
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
        <FormControl fullWidth margin="normal">
            <InputLabel>Component Name</InputLabel>
            <Select
              value={selectedComponent}
              onChange={(e)=>setSelectedComponent(e.target.value)}
              required
            >
              <MenuItem value="">Select Component</MenuItem>
              {components.map((component) => (
                <MenuItem key={component.id} value={component.componentName}>
                  {component.componentName}
                </MenuItem>
              ))}
            </Select>
           
          </FormControl>

        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button
            variant="outlined"
            fullWidth
            color="primary"
            className="button"
            onClick={handleSearch}
            sx={{ height: '40px' }}  // Adjust height to match input fields
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchBar;
