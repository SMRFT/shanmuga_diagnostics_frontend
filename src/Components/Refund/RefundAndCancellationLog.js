import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Styled Components
const Container = styled.div`
  padding: 24px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
`;

const ToggleContainer = styled.div`
  display: flex;
  background-color: #e9ecef;
  border-radius: 50px;
  padding: 4px;
`;

const ToggleButton = styled.button`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  background-color: ${props => props.active ? '#3498db' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6c757d'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => props.active ? '#3498db' : '#dee2e6'};
  }
  
  &:focus {
    outline: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
`;

const THead = styled.thead`
  background-color: #3498db;
  color: white;
`;

const TH = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 500;
`;

const TR = styled.tr`
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:nth-child(even) {
    background-color: #f1f3f5;
  }
`;

const TD = styled.td`
  padding: 16px;
`;

const TestMultiple = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #777;
  font-style: italic;
`;

const Badge = styled.span`
  background-color: ${props => props.count > 1 ? '#e74c3c' : '#2ecc71'};
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  margin-left: 8px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #6c757d;
`;

const SearchContainer = styled.div`
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const DateRangeContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

const DateInput = styled.input`
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const TotalAmount = styled.div`
  text-align: right;
  margin-top: 16px;
  font-weight: 600;
  font-size: 16px;
  color: #2c3e50;
`;

const RefundIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 8L15 12H18C18 15.31 15.31 18 12 18C10.99 18 10.03 17.75 9.2 17.3L7.74 18.76C8.97 19.54 10.43 20 12 20C16.42 20 20 16.42 20 12H23L19 8ZM6 12C6 8.69 8.69 6 12 6C13.01 6 13.97 6.25 14.8 6.7L16.26 5.24C15.03 4.46 13.57 4 12 4C7.58 4 4 7.58 4 12H1L5 16L9 12H6Z" fill="currentColor" />
  </svg>
);

const CancelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM17 15.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59Z" fill="currentColor" />
  </svg>
);

const RefreshButton = styled.button`
  padding: 8px 16px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #2ecc71;
  }
`;

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor" />
  </svg>
);

const RefundAndCancellationLog = () => {
  const [activeTab, setActiveTab] = useState('refund');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  // Initialize with current date as default
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  useEffect(() => {
    fetchData();
  }, [activeTab]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Base URL for your Django API
      let url = `${Labbaseurl}refund_cancellation_logs/`;
      
      // Build query parameters
      const params = {
        type: activeTab, // Send 'refund' or 'cancellation' as a query parameter
      };
      
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      
      const response = await axios.get(url, { params });
      setData(response.data);
    } catch (error) {
      console.error(`Error fetching ${activeTab} data:`, error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDateChange = () => {
    fetchData();
  };
  
  const filteredData = data.filter(item => 
    item.patientname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.bill_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.testname?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const calculateTotalAmount = () => {
    return filteredData.reduce((total, item) => total + parseFloat(item.refund_amount || 0), 0);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <Container>
      <Header>
        <Title>{activeTab === 'refund' ? 'Refund Log' : 'Cancellation Log'}</Title>
        <div style={{ display: 'flex' }}>
          <ToggleContainer>
            <ToggleButton 
              active={activeTab === 'refund'} 
              onClick={() => setActiveTab('refund')}
            >
              <RefundIcon /> Refund Log
            </ToggleButton>
            <ToggleButton 
              active={activeTab === 'cancellation'} 
              onClick={() => setActiveTab('cancellation')}
            >
              <CancelIcon /> Cancellation Log
            </ToggleButton>
          </ToggleContainer>
          <RefreshButton onClick={fetchData}>
            <RefreshIcon /> Refresh
          </RefreshButton>
        </div>
      </Header>
      
      <DateRangeContainer>
        <DateInput 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <DateInput 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
        />
        <RefreshButton onClick={handleDateChange}>
          Apply Filter
        </RefreshButton>
      </DateRangeContainer>
      
      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="Search by patient name, bill number or test name" 
          value={searchTerm}
          onChange={handleSearch}
        />
      </SearchContainer>
      
      {loading ? (
        <EmptyState>Loading...</EmptyState>
      ) : filteredData.length > 0 ? (
        <>
          <Table>
            <THead>
              <TR>
                <TH>Bill No</TH>
                <TH>Patient Name</TH>
                <TH>Tests</TH>
                <TH>Date</TH>
                <TH>Amount</TH>
                <TH>{activeTab === 'refund' ? 'Refund Reason' : 'Cancellation Reason'}</TH>
              </TR>
            </THead>
            <tbody>
              {filteredData.map((item) => (
                <TR key={item.id}>
                  <TD>{item.bill_no}</TD>
                  <TD>{item.patientname}</TD>
                  <TD>
                    {item.testname}
                    {(item.refund_count > 1 || item.cancel_count > 1) && (
                      <Badge count={item.refund_count || item.cancel_count}>
                        {item.refund_count || item.cancel_count} tests
                      </Badge>
                    )}
                  </TD>
                  <TD>{formatDate(item.date)}</TD>
                  <TD>₹{parseFloat(item.amount || 0).toFixed(2)}</TD>
                  <TD>{item.reason || '-'}</TD>
                </TR>
              ))}
            </tbody>
          </Table>
          <TotalAmount>
            Total {activeTab === 'refund' ? 'Refunded' : 'Cancelled'} Amount: ₹{calculateTotalAmount().toFixed(2)}
          </TotalAmount>
        </>
      ) : (
        <EmptyState>
          No {activeTab} records found for the selected date range.
        </EmptyState>
      )}
    </Container>
  );
};

export default RefundAndCancellationLog;