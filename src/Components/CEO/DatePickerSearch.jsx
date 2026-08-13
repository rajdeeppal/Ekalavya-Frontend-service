import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, IconButton, Tooltip } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const DatePickerSearch = ({ onSearch, setIsVoucher, isVoucher, isTrue, onDownloadReport }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [voucherId, setVoucherId] = useState('');

  const handleSearch = () => {
    console.log('Start Date:', startDate ? startDate.format('YYYY-MM-DD') : 'Not selected');
    console.log('End Date:', endDate ? endDate.format('YYYY-MM-DD') : 'Not selected');
    const data = {
      startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
    }
    if (isVoucher) {
      onSearch(voucherId);
    } else {
      onSearch(data);
    }
  };

  const handleReset = () => {
    setVoucherId('');
    setStartDate(null);
    setEndDate(null);
    if (setIsVoucher) setIsVoucher(false);
  };

  const handleVoucherIdChange = (e) => {
    const val = e.target.value;
    setVoucherId(val);
    if (val) {
      setIsVoucher(true);
    } else {
      setIsVoucher(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ padding: '20px' }}>

        <Grid item>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => { setStartDate(newValue); setIsVoucher(false) }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>

        <Grid item>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => { setEndDate(newValue); setIsVoucher(false) }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>

        {isTrue &&
          <>
            <Grid item>
              <Typography variant="body1" color="textSecondary">or</Typography>
            </Grid>

            <Grid item>
              <TextField
                label="Voucher ID"
                value={voucherId}
                onChange={handleVoucherIdChange}
                size="small"
              />
            </Grid>

            {/* Download Report button — visible only when Voucher ID has text */}
            {onDownloadReport && voucherId.trim() && (
              <Grid item>
                <Tooltip title="Download Voucher Report">
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<FileDownloadIcon />}
                    onClick={() => onDownloadReport(voucherId.trim())}
                    size="small"
                  >
                    Download Associated JobIds
                  </Button>
                </Tooltip>
              </Grid>
            )}
          </>
        }

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleReset}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DatePickerSearch;

