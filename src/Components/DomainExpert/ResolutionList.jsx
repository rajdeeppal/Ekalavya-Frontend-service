import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, TableHead, TableRow, TableCell, TableBody, Container, FormControl, InputLabel, Select, MenuItem, Table, Collapse, TableContainer, Alert, IconButton } from '@mui/material';
import Sidebar from '../PM/sidebar/Sidebar';
import { useAuth } from '../PrivateRoute';
import { getUserProjects } from '../DataCenter/apiService';
import { getUploadDetails } from '../DataCenter/apiService';
import Paper from "@mui/material/Paper";

function ResolutionList() {
    const { userId } = useAuth();
    const [selectedProject, setSelectedProject] = useState('');
    const [projects, setProjects] = useState([]);
    const [viewData, setViewData] = useState([]);
    const [showTable, setShowTable] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            const data = await getUserProjects(userId);
            setProjects(Array.isArray(data) ? data : []);
        }
        fetchProjects();
    }, [userId]);

    const handleSearch = async () => {

        try {
            console.log("ok");
            const data = await getUploadDetails(selectedProject);
            setViewData(Array.isArray(data) ? data : []);
            console.log(viewData);
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
                {/* <Box sx={{ borderRadius: 2, boxShadow: 1, backgroundColor: 'background.paper', pb: 3 }}> */}
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
                {showTable && <Box sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
                    <TableContainer component={Paper} className="table">
                        <Table sx={{ minWidth: 650 }} aria-label="beneficiary table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Project Name</TableCell>
                                    <TableCell>Beneficiary Name</TableCell>
                                    <TableCell>Father/Husband Name</TableCell>
                                    <TableCell>Village</TableCell>
                                    <TableCell>Mandal</TableCell>
                                    <TableCell>District</TableCell>
                                    <TableCell>State</TableCell>
                                    <TableCell>Aadhar Number</TableCell>
                                    <TableCell>Survey No.</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {viewData.map((beneficiary, beneficiaryIndex) => (
                                    <React.Fragment key={beneficiary.id}>
                                        <TableRow>
                                            <TableCell>{beneficiary.projectName}</TableCell>
                                            <TableCell>{beneficiary.beneficiaryName}</TableCell>
                                            <TableCell>{beneficiary.guardianName}</TableCell>
                                            <TableCell>{beneficiary.villageName}</TableCell>
                                            <TableCell>{beneficiary.mandalName}</TableCell>
                                            <TableCell>{beneficiary.districtName}</TableCell>
                                            <TableCell>{beneficiary.stateName}</TableCell>
                                            <TableCell>{beneficiary.aadharNumber}</TableCell>
                                            <TableCell>{beneficiary.surveyNumber}</TableCell>
                                            <TableCell>
                                                
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>}
            </Box>
        // </Box>
    )
}

export default ResolutionList;
