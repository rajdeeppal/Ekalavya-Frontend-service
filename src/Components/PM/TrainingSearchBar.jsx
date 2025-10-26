import React, { useState, useEffect } from 'react';
import { Button, Grid, Container, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getUserProjects } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';

const TrainingSearchBar = ({ onSearch }) => {
    const { userId } = useAuth();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedFormType, setSelectedFormType] = useState('');

    useEffect(() => {
        async function fetchProjects() {
            const data = await getUserProjects(userId);
            setProjects(Array.isArray(data) ? data : []);
        }
        fetchProjects();
    }, [userId]);

    const handleSearch = async () => {
        const data = {
            projectName: selectedProject,
            formType: selectedFormType
        }

        onSearch(data);
    };

    const handleReset = () => {
        setSelectedProject('');
        setSelectedFormType('');
    };

    return (
        <Container sx={{ marginTop: 4 }}>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
                {/* Project Dropdown */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Project Name</InputLabel>
                        <Select
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

                {/* Form Type Dropdown */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Form Type</InputLabel>
                        <Select
                            value={selectedFormType}
                            onChange={(e) => setSelectedFormType(e.target.value)}
                            required
                        >
                            <MenuItem value="">Select Form Type</MenuItem>
                            <MenuItem value="TRAINING_FORM">TRAINING_FORM</MenuItem>
                            <MenuItem value="COMMON_EXP_FORM">COMMON_EXP_FORM</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Search Button */}
                <Grid item xs={12} sm={6} md={2} marginTop={1}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleSearch}
                        style={{padding: '8px'}}
                        fullWidth
                    >
                        Search
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={2} marginTop={1}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleReset}
                        style={{padding: '8px'}}
                        fullWidth
                    >
                        Reset
                    </Button>
                </Grid>

            </Grid>
        </Container>
    );
};

export default TrainingSearchBar;
