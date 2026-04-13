import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Box } from '@mui/material';
import Sidebar from '../CEO/sidebar/Sidebar';
import SearchBar from '../PM/SearchBar';
import { getBeneficiary } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';
import FinalPreviewList from '../PM/FinalPreviewList';
import Pagination from '../Common/Pagination';


function CEODashboard() {
    const { userId } = useAuth();
    const [showTable, setShowTable] = useState(false);
    const [isReview, setIsReview] = useState(true);
    const [beneficiaries, setBeneficiaries] = useState([
    ]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [value, setValue] = useState(null);

    const handleSearch = async (criteria, page = 0, size = pageSize) => {
        if (!criteria) return;
        try {
            console.log("ok");
            const data = await getBeneficiary(userId, criteria, 'generic', page, size);
            setBeneficiaries(Array.isArray(data.beneficiaries) ? data.beneficiaries : []);
            setCurrentPage(data.currentPage || 0);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
            setPageSize(data.pageSize || size);
            setShowTable(true);
            setValue(criteria);
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
                    <SearchBar onSearch={handleSearch} />
                </Box>
                {showTable && <Box sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: 'background.paper', mt: 3 }}>
                <Box sx={{ pb: 3 }}>
                  <FinalPreviewList beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} isReview={isReview}/>
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

export default CEODashboard;
