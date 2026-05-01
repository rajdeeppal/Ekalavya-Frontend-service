import React, { useState, useEffect } from 'react';
import { Button, Grid, Container, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { getUserProjects, getComponentsByProject, getStateDetails, getDistrictDetails, exportBeneficiaryDetails, exportComponentDetails } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import Sidebar from './sidebar/Sidebar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNotification } from '../Common/useNotification';

function TrusteeReportPage() {
    const { userId } = useAuth();
    const { showSuccess, showError } = useNotification();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
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
            const id = projects.find(item => item.projectName === selectedProject)?.id;
            if (!selectedProject) return;
            const data = await getComponentsByProject(id);
            setComponents(Array.isArray(data) ? data : []);
        }
        fetchComponents();
    }, [selectedProject, projects]);

    useEffect(() => {
        async function fetchStates() {
            const data = await getStateDetails();
            setStates(Array.isArray(data) ? data : []);
        }
        fetchStates();
    }, []);

    useEffect(() => {
        async function fetchDistricts() {
            if (!selectedState) return;
            const state = states.find(s => s.state_name === selectedState);
            if (state) {
                const data = await getDistrictDetails(state.id);
                setDistrict(Array.isArray(data) ? data : []);
            }
        }
        fetchDistricts();
    }, [selectedState, states]);

    const handleBeneficiarySearch = async () => {
        if (!selectedState || !selectedDistrict || !selectedProject) {
            showError('Please select State, District, and Project');
            return;
        }
        const data = {
            stateName: selectedState,
            districtName: selectedDistrict,
            projectName: selectedProject,
            componentName: selectedComponent,
            ...(startDate && { startDate: startDate.format('YYYY-MM-DD') }),
            ...(endDate && { endDate: endDate.format('YYYY-MM-DD') }),
        }
        try {
            const response = await exportBeneficiaryDetails(userId, data);
            showSuccess(response);
        } catch (error) {
            showError(error?.response?.data?.message || error?.message || 'Error exporting beneficiary details');
            console.error('Error fetching activities:', error);
        }
    };

    const handleComponentSearch = async () => {
        if (!selectedState || !selectedDistrict || !selectedProject) {
            showError('Please select State, District, and Project');
            return;
        }
        const data = {
            stateName: selectedState,
            districtName: selectedDistrict,
            projectName: selectedProject,
            componentName: selectedComponent,
            ...(startDate && { startDate: startDate.format('YYYY-MM-DD') }),
            ...(endDate && { endDate: endDate.format('YYYY-MM-DD') }),
        }
        try {
            const response = await exportComponentDetails(userId, data);
            showSuccess(response);
        } catch (error) {
            showError(error?.response?.data?.message || error?.message || 'Error exporting component details');
            console.error('Error fetching activities:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flex: 6,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    overflowY: 'auto',
                }}
            >
                <Box
                    sx={{
                        borderRadius: 2,
                        boxShadow: 3,
                        backgroundColor: 'background.paper',
                        p: 3,
                    }}
                >
                    <Container>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>State</InputLabel>
                                    <Select
                                        name="stateName"
                                        value={selectedState}
                                        onChange={(e) => setSelectedState(e.target.value)}
                                        required
                                    >
                                        <MenuItem value="">Select State</MenuItem>
                                        {states.map((state) => (
                                            <MenuItem key={state.id} value={state.state_name}>
                                                {state.state_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>District</InputLabel>
                                    <Select
                                        name="districtName"
                                        value={selectedDistrict}
                                        onChange={(e) => setSelectedDistrict(e.target.value)}
                                        required
                                    >
                                        <MenuItem value="">Select District</MenuItem>
                                        {district.map((district) => (
                                            <MenuItem key={district.id} value={district.district_name}>
                                                {district.district_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Project Name</InputLabel>
                                    <Select
                                        name="projectName"
                                        value={selectedProject}
                                        onChange={(e) => setSelectedProject(e.target.value)}
                                        required
                                    >
                                        <MenuItem value="">Select Project</MenuItem>
                                        {projects.map((project) => (
                                            <MenuItem key={project.id} value={project.projectName}>
                                                {project.projectName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Component Name</InputLabel>
                                    <Select
                                        value={selectedComponent}
                                        onChange={(e) => setSelectedComponent(e.target.value)}
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
                        </Grid>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid
                                container
                                spacing={2}
                                alignItems="center"
                                justifyContent="center"
                                sx={{ mt: 1, marginBottom: 1 }}
                            >
                                <Grid item>
                                    <DatePicker
                                        label="Start Date"
                                        value={startDate}
                                        onChange={(newValue) => setStartDate(newValue)}
                                    />
                                </Grid>
                                <Grid item>
                                    <DatePicker
                                        label="End Date"
                                        value={endDate}
                                        onChange={(newValue) => setEndDate(newValue)}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleBeneficiarySearch}
                                        disabled={!selectedState || !selectedDistrict || !selectedProject}
                                        sx={{ height: '100%' }}
                                    >
                                        Beneficiary Export
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleComponentSearch}
                                        disabled={!selectedState || !selectedDistrict || !selectedProject}
                                        sx={{ height: '100%' }}
                                    >
                                        Component Export
                                    </Button>
                                </Grid>
                            </Grid>
                        </LocalizationProvider>
                    </Container>
                </Box>
            </Box>
        </Box>
    )
}

export default TrusteeReportPage;
