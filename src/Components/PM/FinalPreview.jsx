import React, { useState } from 'react'
import { Box } from '@mui/material';
import SearchBar from './SearchBar';
import Sidebar from './sidebar/Sidebar';
import FinalPreviewList from './FinalPreviewList';
import { getBeneficiary } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import Pagination from '../Common/Pagination';

const FinalPreview = () => {
    const { userId } = useAuth();
    const [beneficiaries, setBeneficiaries] = useState([
       
    ]);
    const [value,setValue]=useState(true);
    const [showTable, setShowTable] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const handleSearch = async (criteria, page = 0, size = pageSize) => {
        if (!criteria) return;
        try {
          console.log("ok");
          const data = await getBeneficiary(userId,criteria,'preview', page, size);
          setValue(criteria);
          setBeneficiaries(Array.isArray(data.beneficiaries) ? data.beneficiaries : []);
          setCurrentPage(data.currentPage || 0);
          setTotalPages(data.totalPages || 0);
          setTotalElements(data.totalElements || 0);
          setPageSize(data.pageSize || size);
          setShowTable(true)
          console.log(beneficiaries);
        } catch (error) {
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
        <Box sx={{ display: 'flex' }} style={{backgroundColor:"#F0F5F9"}}>
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
                    <SearchBar onSearch={handleSearch} />
                </Box>
                {showTable && <Box sx={{ borderRadius: 2, boxShadow: 1, backgroundColor: 'background.paper', mt: 3 }}>
                <Box sx={{ pb: 3 }}>
                  <FinalPreviewList beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} value={value}/>
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

export default FinalPreview;
