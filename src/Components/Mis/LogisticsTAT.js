import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import apiRequest from "../Auth/apiRequest";

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Header = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8fafc;
  }
  
  &:hover {
    background-color: #f1f5f9;
  }
  
  border-bottom: 1px solid #e2e8f0;
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #64748b;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #334155;
  font-size: 0.9375rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${(props) => 
    props.$duration ? 
      (parseFloat(props.$duration.split(':')[0]) < 1 ? '#dcfce7' : 
       parseFloat(props.$duration.split(':')[0]) < 2 ? '#fef9c3' : '#fee2e2') 
      : '#f1f5f9'
  };
  color: ${(props) => 
    props.$duration ? 
      (parseFloat(props.$duration.split(':')[0]) < 1 ? '#166534' : 
       parseFloat(props.$duration.split(':')[0]) < 2 ? '#854d0e' : '#991b1b') 
      : '#64748b'
  };
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.625rem 1.25rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const RefreshButton = styled(Button)`
  margin-right: 1rem;
`;

const ApplyFilterButton = styled(Button)`
  background-color: #10b981;
  
  &:hover {
    background-color: #059669;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const DateInput = styled.input`
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #334155;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
  }
`;

const LoadingState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #64748b;
  font-size: 0.9375rem;
`;

const NoDataMessage = styled.div`
  padding: 3rem;
  text-align: center;
  color: #64748b;
  font-size: 0.9375rem;
`;

const InputLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
`;

const LogisticsTAT = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Function to convert 12-hour format time to Date object
  const convertToDate = (timeString, date) => {
  if (!timeString) return null;

  const [time, modifier] = timeString.trim().split(" ");

  // split by ":" but seconds may not exist
  let parts = time.split(":");

  let hours = parseInt(parts[0], 10);
  let minutes = parseInt(parts[1], 10);
  let seconds = parts[2] ? parseInt(parts[2], 10) : 0; // default seconds = 0

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const dt = new Date(`${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);

  return isNaN(dt.getTime()) ? null : dt;
};


  // Function to calculate time difference and format it as hh:mm:ss
  const getTimeDifference = (start, end) => {
    if (!start || !end) return null;
    let diff = Math.abs(end - start) / 1000;
    let hours = Math.floor(diff / 3600);
    let minutes = Math.floor((diff % 3600) / 60);
    let seconds = Math.floor(diff % 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Set today's date as default end date when component mounts
  useEffect(() => {
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  const formattedSevenDaysAgo = sevenDaysAgo.toISOString().split("T")[0];

  setStartDate(formattedSevenDaysAgo);
  setEndDate(formattedToday);
}, []);

useEffect(() => {
  if (startDate && endDate) {
    fetchLogisticData();
  }
}, [startDate, endDate]);

  // Fetch the logistic data
  const fetchLogisticData = async () => {
  setIsLoading(true);

  try {
    const params = {};

    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await apiRequest({
      method: "GET",
      url: `${Labbaseurl}get_logistic_task/`,
      params,
      showError: true,
    });

    setEmployeeData(response); // apiRequest returns data directly
  } catch (error) {
    console.error("Error fetching logistic data:", error);
  } finally {
    setIsLoading(false);
  }
};


  // Initial data load
  useEffect(() => {
    if (startDate && endDate) {
      fetchLogisticData();
    }
  }, []);

  // Apply date filters
  const handleApplyFilters = () => {
    fetchLogisticData();
  };

  return (
    <Container>
      <Header>Logistics Turnaround Time</Header>
      
      <ActionBar>
        <div>
          <RefreshButton onClick={fetchLogisticData}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4m-4 4a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
            </svg>
            Refresh Data
          </RefreshButton>
        </div>
        
        <FilterGroup>
          <InputLabel htmlFor="start-date">Start Date:</InputLabel>
          <DateInput 
            id="start-date"
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
          />
          
          <InputLabel htmlFor="end-date">End Date:</InputLabel>
          <DateInput 
            id="end-date"
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
          />
          
          <ApplyFilterButton onClick={handleApplyFilters}>
            Apply Filters
          </ApplyFilterButton>
        </FilterGroup>
      </ActionBar>
      
      <Card>
        {isLoading ? (
          <LoadingState>Loading data...</LoadingState>
        ) : employeeData.length === 0 ? (
          <NoDataMessage>No logistics data available for the selected date range</NoDataMessage>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Lab Name</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Order Time</TableHeader>
                <TableHeader>Accepted Time</TableHeader>
                <TableHeader>Picked Up Time</TableHeader>
                <TableHeader>Order - Accepted</TableHeader>
                <TableHeader>Accepted - Picked Up</TableHeader>
                <TableHeader>Order - Picked Up</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {employeeData.map((item, index) => {
                const sampleOrderTime = convertToDate(item.sampleordertime, item.date);
                const sampleAcceptedTime = convertToDate(item.sampleacceptedtime, item.date);
                const samplePickedUpTime = convertToDate(item.samplepickeduptime, item.date);
                
                const orderToAccepted = getTimeDifference(sampleOrderTime, sampleAcceptedTime);
                const acceptedToPickedUp = getTimeDifference(sampleAcceptedTime, samplePickedUpTime);
                const orderToPickedUp = getTimeDifference(sampleOrderTime, samplePickedUpTime);
                
                return (
                  <TableRow key={index}>
                    <TableCell>{item.lab_name}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.sampleordertime || "N/A"}</TableCell>
                    <TableCell>{item.sampleacceptedtime || "N/A"}</TableCell>
                    <TableCell>{item.samplepickeduptime || "N/A"}</TableCell>
                    <TableCell>
                      {orderToAccepted ? (
                        <StatusBadge $duration={orderToAccepted}>{orderToAccepted}</StatusBadge>
                      ) : "N/A"}
                    </TableCell>
                    <TableCell>
                      {acceptedToPickedUp ? (
                        <StatusBadge $duration={acceptedToPickedUp}>{acceptedToPickedUp}</StatusBadge>
                      ) : "N/A"}
                    </TableCell>
                    <TableCell>
                      {orderToPickedUp ? (
                        <StatusBadge $duration={orderToPickedUp}>{orderToPickedUp}</StatusBadge>
                      ) : "N/A"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
};

export default LogisticsTAT;
