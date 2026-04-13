import React from 'react';
import { Box, IconButton, Select, MenuItem, Typography, Stack } from '@mui/material';
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from '@mui/icons-material';

const Pagination = ({ currentPage, totalPages, pageSize, totalElements, onPageChange, onPageSizeChange }) => {
  const pageSizeOptions = [5, 10, 20, 50, 100];

  const handleFirstPage = () => onPageChange(0);
  const handlePrevPage = () => onPageChange(Math.max(0, currentPage - 1));
  const handleNextPage = () => onPageChange(Math.min(totalPages - 1, currentPage + 1));
  const handleLastPage = () => onPageChange(totalPages - 1);

  const startItem = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#fafafa',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Rows per page:
        </Typography>
        <Select
          value={pageSize}
          onChange={(e) => onPageSizeChange(e.target.value)}
          size="small"
          sx={{
            minWidth: 70,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#d0d0d0',
            },
          }}
        >
          {pageSizeOptions.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Typography variant="body2" color="text.secondary">
        {startItem}-{endItem} of {totalElements}
      </Typography>

      <Stack direction="row" spacing={0.5}>
        <IconButton
          onClick={handleFirstPage}
          disabled={currentPage === 0}
          size="small"
          sx={{
            '&:hover': { backgroundColor: '#e3f2fd' },
            '&.Mui-disabled': { color: '#bdbdbd' },
          }}
        >
          <FirstPage />
        </IconButton>
        <IconButton
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          size="small"
          sx={{
            '&:hover': { backgroundColor: '#e3f2fd' },
            '&.Mui-disabled': { color: '#bdbdbd' },
          }}
        >
          <ChevronLeft />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            minWidth: 80,
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            Page {currentPage + 1} of {totalPages || 1}
          </Typography>
        </Box>
        <IconButton
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
          size="small"
          sx={{
            '&:hover': { backgroundColor: '#e3f2fd' },
            '&.Mui-disabled': { color: '#bdbdbd' },
          }}
        >
          <ChevronRight />
        </IconButton>
        <IconButton
          onClick={handleLastPage}
          disabled={currentPage >= totalPages - 1}
          size="small"
          sx={{
            '&:hover': { backgroundColor: '#e3f2fd' },
            '&.Mui-disabled': { color: '#bdbdbd' },
          }}
        >
          <LastPage />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Pagination;
