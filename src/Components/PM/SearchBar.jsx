import React,{ useState, useEffect} from 'react';
import { TextField, Button, Grid, Container,FormControl, InputLabel, Select, MenuItem, Alert} from '@mui/material';
import {getUserProjects, getComponentsByProject, getStateDetails, getDistrictDetails } from '../DataCenter/apiService';
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
  const [states, setStates] = useState([]);
  const [district, setDistrict] = useState([]);
  const [components, setComponents] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
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

  useEffect(() => {
    async function fetchStates() {
      const data = await getStateDetails();
      setStates(Array.isArray(data) ? data : []);
      console.log(states);
    }
    fetchStates();
  }, []);

  useEffect(() => {
    async function fetchDistricts() {
      if (!selectedState) return;
      const state = states.find(s => s.state_name === selectedState);
      if (state) {
        const data = await getDistrictDetails(state.state_id);
        setDistrict(Array.isArray(data) ? data : []);
      }
    }
    fetchDistricts();
  }, [selectedState, states]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const data={
      stateName: selectedState,
      districtName: selectedDistrict,
      projectName:selectedProject,
      componentName:selectedComponent
    }
    console.log("hello");
    onSearch(data);
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} md={2.5}>
        <FormControl fullWidth margin="normal">
            <InputLabel>State</InputLabel>
            <Select
              name="stateName"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                
              }}
              required
            >
              <MenuItem value="">Select State</MenuItem>
              {states.map((state) => (
                <MenuItem key={state.id} value={state.state_name} >
                  {state.state_name}
                </MenuItem>
              ))}
            </Select>
           
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
        <FormControl fullWidth margin="normal">
            <InputLabel>District</InputLabel>
            <Select
              name="districtName"
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                
              }}
              required
            >
              <MenuItem value="">Select District</MenuItem>
              {district.map((district) => (
                <MenuItem key={district.id} value={district.district_name} >
                  {district.district_name}
                </MenuItem>
              ))}
            </Select>
           
          </FormControl>
          
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
