import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Container, FormControl, InputLabel, Select, MenuItem, Alert, IconButton } from '@mui/material';
import Sidebar from './sidebar/Sidebar';
import { useAuth } from '../PrivateRoute';
import { getUserProjects } from '../DataCenter/apiService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadDetails } from '../DataCenter/apiService';
import CloseIcon from '@mui/icons-material/Close';

function Resolution() {
    const { userId } = useAuth();
    const [selectedProject, setSelectedProject] = useState('');
    const [projects, setProjects] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        async function fetchProjects() {
            const data = await getUserProjects(userId);
            setProjects(Array.isArray(data) ? data : []);
        }
        fetchProjects();
    }, [userId]);

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files); // Convert FileList to Array
        setSelectedFiles(files);
    };


    const handleRemoveFile = (fileToRemove) => {
        setSelectedFiles((prevFiles) =>
            prevFiles.filter((file) => file !== fileToRemove)
        );
    };


    const handleSearch = async () => {
        const formData = new FormData();
        formData.append("projectName", selectedProject);
        if (selectedFiles) {
            selectedFiles.forEach((doc, index) => {
                formData.append("file", doc);
            });
        }

        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }


        try {
            console.log("ok");
            await uploadDetails(userId, formData);
            alert("Resolution files are uploaded successfully");
            setSelectedProject("");
            setSelectedFiles([]);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }

    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flex: 6,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{ borderRadius: 2, boxShadow: 1, backgroundColor: 'background.paper', pb: 3 }}>
                    <Container sx={{ marginTop: 4 }}>
                        <Grid container spacing={3} alignItems="center">
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
                                            <MenuItem key={project.id} value={project.projectName}>
                                                {project.projectName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={2.5}>
                                {selectedFiles.length === 0 ? (<Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                    sx={{ height: '40px' }}
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Add File
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        onChange={handleFileUpload}
                                    />
                                </Button>)
                                    :
                                    (<>
                                        {
                                            selectedFiles.map((file, index) => (
                                                <Alert
                                                    severity="info"
                                                    action={
                                                        <IconButton
                                                            aria-label="remove file"
                                                            color="inherit"
                                                            size="small"
                                                            onClick={() => handleRemoveFile(file)}
                                                        >
                                                            <CloseIcon fontSize="inherit" />
                                                        </IconButton>
                                                    }
                                                    sx={{ mt: 1 }}
                                                >
                                                    <div key={index}>{file.name}</div>
                                                </Alert>
                                            ))
                                        }</>
                                    )}
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
                                    Upload
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}

export default Resolution;
