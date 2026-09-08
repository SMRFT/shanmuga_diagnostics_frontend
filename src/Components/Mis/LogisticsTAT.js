import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import apiRequest from '../Auth/apiRequest';

const Container = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
`;

const Header = styled.h1`
  color: #1a1a1a;
  margin-bottom: 24px;
  font-size: 28px;
  font-weight: 600;
`;

const FilterSection = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FilterRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 150px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ClearButton = styled(Button)`
  background: #6b7280;

  &:hover {
    background: #4b5563;
  }
`;

const TableContainer = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TableTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
`;

const EntryCount = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Thead = styled.thead`
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s;

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  white-space: nowrap;
  padding: 12px 16px;
  color: #1a1a1a;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'PickedUp':
        return '#d1fae5';
      case 'Accepted':
        return '#dbeafe';
      default:
        return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'PickedUp':
        return '#065f46';
      case 'Accepted':
        return '#1e40af';
      default:
        return '#374151';
    }
  }};
`;

const TATValue = styled.span`
  font-weight: 500;
  color: ${props => {
    if (!props.value) return '#9ca3af';
    if (props.value < 30) return '#059669';
    if (props.value < 60) return '#d97706';
    return '#dc2626';
  }};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 24px;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 16px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const PaginationInfo = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.active ? '#2563eb' : '#f9fafb'};
    border-color: ${props => props.active ? '#2563eb' : '#9ca3af'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LogisticsTATReport = () => {
  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [filters, setFilters] = useState({
    start_date: getCurrentDate(),
    end_date: getCurrentDate(),
    search: '',
    sample_collector: ''
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collectors, setCollectors] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Fetch data on component mount
  useEffect(() => {
    fetchReport();
    fetchCollectors();
  }, []);

  const fetchCollectors = async () => {
    try {
      const res = await apiRequest(`${Labbaseurl}sample-collector/`, 'GET');
      let names = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      names = names.map(c => {
        if (typeof c === 'object' && c !== null) {
          return { employeeId: c.employeeId || '', employeeName: c.employeeName || c.name || '' };
        }
        return { employeeId: c, employeeName: c };
      }).filter(c => c.employeeName && c.employeeName.trim() !== '');

      const uniqueCollectors = [];
      const seen = new Set();
      for (const c of names) {
        if (!seen.has(c.employeeId)) {
          seen.add(c.employeeId);
          uniqueCollectors.push(c);
        }
      }
      setCollectors(uniqueCollectors);
    } catch (err) {
      console.error('Failed to fetch collectors:', err);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await apiRequest(
        `${Labbaseurl}logistics-tat-report/?${params.toString()}`,
        'GET'
      );

      setData(response?.data || response);
      setCurrentPage(1); // Reset to first page on new fetch
    } catch (err) {
      console.error('Error fetching report:', err);
      setError('Failed to fetch report');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      start_date: getCurrentDate(),
      end_date: getCurrentDate(),
      search: '',
      sample_collector: ''
    });
  };

  const formatTAT = (minutes) => {
    if (minutes === null || minutes === undefined) return '-';
    
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    
    try {
      const date = new Date(dateTimeString);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${hours}:${minutes}:${seconds}`;
    } catch (e) {
      return '-';
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.data?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((data?.data?.length || 0) / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Container>
      <Header>Logistics TAT Report</Header>

      <FilterSection>
        <FilterRow>
          <FilterGroup>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={filters.start_date}
              max={filters.end_date || new Date().toISOString().split("T")[0]}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <Label>End Date</Label>
            <Input
              type="date"
              value={filters.end_date}
              min={filters.start_date}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <Label>Sample Collector</Label>
            <Select
              value={filters.sample_collector}
              onChange={(e) => handleFilterChange('sample_collector', e.target.value)}
            >
              <option value="">All Collectors</option>
              {collectors.map((collector, index) => (
                <option key={index} value={collector.employeeId}>
                  {collector.employeeName}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup style={{ flex: 2 }}>
            <Label>Search</Label>
            <Input
              type="text"
              placeholder="Search by lab name..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </FilterGroup>

          <ButtonGroup>
            <Button onClick={fetchReport} disabled={loading}>
              {loading ? 'Loading...' : 'Generate Report'}
            </Button>
            <ClearButton onClick={handleClearFilters}>
              Clear
            </ClearButton>
          </ButtonGroup>
        </FilterRow>
      </FilterSection>

      {error && (
        <ErrorMessage>
          Error: {error}
        </ErrorMessage>
      )}

      {loading && (
        <LoadingMessage>Loading report data...</LoadingMessage>
      )}

      {!loading && data && (
        <>
          {data.data && data.data.length > 0 ? (
            <TableContainer>
              <TableHeader>
                <TableTitle>TAT Report</TableTitle>
                <EntryCount>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.data.length)} of {data.data.length} entries
                </EntryCount>
              </TableHeader>
              
              <TableWrapper>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>S.No</Th>
                      <Th>Lab Name</Th>
                      <Th>Sample Collector</Th>
                      <Th>Date</Th>
                      <Th>Order Time</Th>
                      <Th>Accepted Time</Th>
                      <Th>Picked Up Time</Th>
                      <Th>Order ↔ Accept</Th>
                      <Th>Accept ↔ Pickup</Th>
                      <Th>Total TAT</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentItems.map((row, index) => (
                      <Tr key={index}>
                        <Td>{indexOfFirstItem + index + 1}</Td>
                        <Td>{row.lab_name}</Td>
                        <Td>{row.sample_collector || '-'}</Td>
                        <Td>{row.date}</Td>
                        <Td>{formatTime(row.order_time)}</Td>
                        <Td>{formatTime(row.accepted_time)}</Td>
                        <Td>{formatTime(row.picked_up_time)}</Td>
                        <Td>
                          <TATValue value={row.order_to_accept_tat_minutes}>
                            {formatTAT(row.order_to_accept_tat_minutes)}
                          </TATValue>
                        </Td>
                        <Td>
                          <TATValue value={row.accept_to_pickup_tat_minutes}>
                            {formatTAT(row.accept_to_pickup_tat_minutes)}
                          </TATValue>
                        </Td>
                        <Td>
                          <TATValue value={row.total_tat_minutes}>
                            {formatTAT(row.total_tat_minutes)}
                          </TATValue>
                        </Td>
                        <Td>
                          <StatusBadge status={row.status}>
                            {row.status}
                          </StatusBadge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableWrapper>

              {totalPages > 1 && (
                <PaginationContainer>
                  <PaginationInfo>
                    Page {currentPage} of {totalPages}
                  </PaginationInfo>
                  
                  <PaginationButtons>
                    <PageButton 
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </PageButton>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show only 5 page numbers at a time
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PageButton
                            key={pageNumber}
                            active={currentPage === pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </PageButton>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber}>...</span>;
                      }
                      return null;
                    })}
                    
                    <PageButton 
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </PageButton>
                  </PaginationButtons>
                </PaginationContainer>
              )}
            </TableContainer>
          ) : (
            <TableContainer>
              <NoDataMessage>
                No data available for Today
              </NoDataMessage>
            </TableContainer>
          )}
        </>
      )}

      {!loading && !data && !error && (
        <LoadingMessage>
          Loading today's report...
        </LoadingMessage>
      )}
    </Container>
  );
};

export default LogisticsTATReport;
