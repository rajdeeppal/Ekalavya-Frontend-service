import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const DatePickerSearch = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSearch = () => {
    console.log('Start Date:', startDate ? startDate.format('YYYY-MM-DD') : 'Not selected');
    console.log('End Date:', endDate ? endDate.format('YYYY-MM-DD') : 'Not selected');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ padding: '20px' }}>

        <Grid item>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>

        <Grid item>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={!startDate || !endDate}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DatePickerSearch;
