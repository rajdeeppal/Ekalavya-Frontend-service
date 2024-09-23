import React from 'react';
import { TextField, Button, Grid, Container } from '@mui/material';

const SearchBar = ({ onSearch }) => {
  const [searchCriteria, setSearchCriteria] = React.useState({
    state: '',
    districtName: '',
    projectName: '',
    projectType: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    onSearch(searchCriteria);
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="State"
            name="state"
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="District Name"
            name="districtName"
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="Project Name"
            name="projectName"
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="Project Type"
            name="projectType"
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="Category"
            name="category"
            onChange={handleChange}
            size="small"
          />
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
