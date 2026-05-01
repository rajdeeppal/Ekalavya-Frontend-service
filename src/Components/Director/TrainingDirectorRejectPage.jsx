import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import Sidebar from './sidebar/Sidebar';

import { getTraining } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import TrainingReviewTable from '../DomainExpert/TrainingReviewTable';
import TrainingSearchBar from '../PM/TrainingSearchBar';
import Pagination from '../Common/Pagination';
import { useNotification } from '../Common/useNotification';

function TrainingDirectorRejectPage() {
  const { userId } = useAuth();
  const { showError } = useNotification();
  const [showTable, setShowTable] = useState(false);
  const [isReview, setIsReview] = useState(true);
  const [isSuccess, setIsSucess] = useState(false);
  const [value, setValue] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showTraining, setShowTraining] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    console.log("isSuccess:", isSuccess);
    if (isSuccess) {
      console.log("Calling handleSearch...");
      handleSearch(value);
    }
  }, [isSuccess]);

  const handleSearch = async (criteria, page = 0, size = pageSize) => {
    if (!criteria) return;
    try {
      console.log("ok");
      const data = await getTraining(userId, criteria, 'rejection', page, size);
      setBeneficiaries(Array.isArray(data.beneficiaries) ? data.beneficiaries : []);
      setCurrentPage(data.currentPage || 0);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setPageSize(data.pageSize || size);
      setShowTable(true);
      setShowTraining(criteria.formType);
      setValue(criteria);
      setIsSucess(false);
      console.log(beneficiaries);
    } catch (error) {
      setShowTable(false);
      showError(error?.response?.data?.message || error?.message || 'Error fetching training data');
      console.error('Error fetching activities:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    handleSearch(value, newPage, pageSize);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0);
    handleSearch(value, 0, newSize);
  };

  return (
    <Box sx={{ display: 'flex' }} style={{ backgroundColor: "#F0F5F9" }}>
      <Sidebar isSuccess={isSuccess} />
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
          <TrainingSearchBar onSearch={handleSearch} />
        </Box>

        {showTable && <Box sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: 'background.paper', mt: 3 }}>
          <Box sx={{ pb: 3 }}>
            <TrainingReviewTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} isReview={isReview} setIsSucess={setIsSucess} showTraining={showTraining} />
          </Box>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalElements={totalElements}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </Box>}
      </Box>
    </Box>
  )
}

export default TrainingDirectorRejectPage;
