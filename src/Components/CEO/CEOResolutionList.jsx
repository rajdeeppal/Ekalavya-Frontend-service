import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, TableHead, TableRow, TableCell, TableBody, Container, FormControl, InputLabel, Select, MenuItem, Table, Collapse, TableContainer, Alert, IconButton, Typography } from '@mui/material';
import Sidebar from './sidebar/Sidebar';
import { useAuth } from '../PrivateRoute';
import { getUserProjects } from '../DataCenter/apiService';
import { getUploadDetails } from '../DataCenter/apiService';
import Paper from "@mui/material/Paper";

function CEOResolutionList() {
    const { userId } = useAuth();
    const [selectedProject, setSelectedProject] = useState('');
    const [projects, setProjects] = useState([]);
    const [viewData, setViewData] = useState([]);
    const [showTable, setShowTable] = useState(false);

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
            setShowTable(true);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }

    };

    return (
        <Box sx={{ display: 'flex' }} style={{backgroundColor:"#F0F5F9"}}>
            <Sidebar isSuccess={false}/>
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

                            <Grid item xs={12} sm={6} md={2}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    color="primary"
                                    className="button"
                                    onClick={handleSearch}
                                    sx={{ height: '40px' }}  // Adjust height to match input fields
                                >
                                    View
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {showTable && <Box sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: 'background.paper', pb: 3, mt: 3 }}>
                    <div style={{ padding: '20px' }} className='listContainer'>
                        <TableContainer component={Paper} className="table">
                            <Table sx={{ minWidth: 650 }} aria-label="beneficiary table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Project Name</TableCell>
                                        <TableCell>PM Name</TableCell>
                                        <TableCell>Upload Date</TableCell>
                                        <TableCell>Documents</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {viewData.map((beneficiary, beneficiaryIndex) => (
                                        <React.Fragment key={beneficiary.id}>
                                            <TableRow>
                                                <TableCell>{beneficiary.projectName}</TableCell>
                                                <TableCell>{beneficiary.userName}</TableCell>
                                                <TableCell>{beneficiary.uploadTimestamp}</TableCell>
                                                <TableCell>{beneficiary.resolutionDocDTOList &&
                                                    beneficiary.resolutionDocDTOList.length > 0 ? (
                                                    beneficiary.resolutionDocDTOList.map((file, idx) => (
                                                        <div key={idx}>
                                                            <a
                                                                href={file.downloadUrl}
                                                                download={file.downloadUrl}
                                                                style={{
                                                                    textDecoration: 'underline',
                                                                    color: 'blue',
                                                                }}
                                                            >
                                                                {file.documentFileName}
                                                            </a>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <Typography>No File Uploaded</Typography>
                                                )}</TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Box>
                }

            </Box>
        </Box>
    )
}

export default CEOResolutionList;
