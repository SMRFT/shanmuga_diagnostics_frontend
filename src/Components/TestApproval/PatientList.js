import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled, { createGlobalStyle } from "styled-components";
import {
  Search,
  Calendar,
  Eye,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import apiRequest from "../Auth/apiRequest";

// Global styles
const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #4361ee;
    --primary-light: #4895ef;
    --primary-dark: #3a0ca3;
    --secondary: #3f37c9;
    --success: #4cc9f0;
    --danger: #f72585;
    --warning: #f8961e;
    --info: #90e0ef;
    --light: #f8f9fa;
    --dark: #212529;
    --gray: #6c757d;
    --gray-light: #e9ecef;
    --border-radius: 8px;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f7fb;
    color: var(--dark);
    line-height: 1.5;
  }
  
  .react-datepicker-wrapper {
    width: auto;
  }
  
  .react-datepicker__input-container input {
    padding: 0.5rem 1rem;
    border: 1px solid var(--gray-light);
    border-radius: var(--border-radius);
    font-size: 0.875rem;
    background-color: white;
    cursor: pointer;
    transition: var(--transition);
    
    &:hover, &:focus {
      border-color: var(--primary);
      outline: none;
    }
  }
  
  .react-datepicker {
    border: none;
    box-shadow: var(--box-shadow);
    font-family: inherit;
    z-index: 1000 !important;
  }
  
  .react-datepicker-popper {
    z-index: 1000 !important;
  }
  
  .react-datepicker__header {
    background-color: var(--primary);
    border-bottom: none;
    padding-top: 0.8rem;
  }
  
  .react-datepicker__current-month, 
  .react-datepicker__day-name {
    color: white;
  }
  
  .react-datepicker__day--selected {
    background-color: var(--primary);
    
    &:hover {
      background-color: var(--primary-dark);
    }
  }
`;

// Container
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Card
const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
`;

// Header
const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
`;

// Filters
const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DatePickerLabel = styled.label`
  font-size: 0.875rem;
  color: var(--gray);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
  pointer-events: none;
`;

const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-dark);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3);
  }
`;

const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--gray);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--dark);
  }
`;

// Table
const TableContainer = styled.div`
  overflow-x: auto;
  max-height: 600px;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--gray-light);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--gray);
    border-radius: 20px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const TableHead = styled.thead`
  background-color: var(--gray-light);
  position: sticky;
  top: 0;
  z-index: 5;

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--gray);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--gray-light);

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: rgba(67, 97, 238, 0.05);
    }
  }

  td {
    padding: 1rem;
    vertical-align: middle;
    font-size: 0.875rem;
  }
`;

const NoData = styled.td`
  text-align: center;
  padding: 2rem !important;
  color: var(--gray);
  font-style: italic;
`;

// Status badges
const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
`;

const WaitingBadge = styled(StatusBadge)`
  background-color: rgba(248, 150, 30, 0.15);
  color: var(--warning);
`;

// Button
const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-dark);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3);
  }
`;

const ViewButton = styled(Button)`
  padding: 0.35rem 0.75rem;
  background-color: var(--primary-light);

  &:hover {
    background-color: var(--primary);
  }
`;

// Test list
const TestList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TestItem = styled.li`
  white-space: nowrap;
  font-size: 0.875rem;
`;

// Status list
const StatusList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// Pagination
const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid var(--gray-light);
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--gray-light);
  background-color: white;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--gray-light);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.div`
  margin: 0 1rem;
  font-size: 0.875rem;
  color: var(--gray);
`;

function PatientList() {
  const [patientList, setPatientList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.barcode) {
      setSearchQuery(location.state.barcode);
      setCurrentPage(1); // Reset to first page to show relevant results
    }
  }, [location.state]);

  const fetchPatientData = async (fromDateParam = null, toDateParam = null) => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    if (fromDateParam) {
      queryParams.append(
        "from_date",
        fromDateParam.toLocaleDateString("en-CA")
      );
    }
    if (toDateParam) {
      queryParams.append("to_date", toDateParam.toLocaleDateString("en-CA"));
    }

    const queryString = queryParams.toString();
    const url = `${Labbaseurl}test-values/${
      queryString ? `?${queryString}` : ""
    }`;

    try {
      const patientResponse = await apiRequest(url, "GET");
      console.log("Fetched patient data:", patientResponse);
      if (!patientResponse.success) {
        throw new Error(
          patientResponse.error || "Failed to fetch patient data"
        );
      }

      const patientData = Array.isArray(patientResponse.data)
        ? patientResponse.data
        : [];
      setPatientList(patientData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setError(error.message);
      setPatientList([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  const handleFilter = () => {
    fetchPatientData(fromDate, toDate);
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setFromDate(null);
    setToDate(null);
    fetchPatientData();
    setCurrentPage(1);
  };

  const handleViewDetails = (patientId, patientDate, testName) => {
    const date = new Date(patientDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    navigate(
      `/DoctorForm?patient_id=${patientId}&date=${formattedDate}&testname=${
        testName || "N/A"
      }`
    );
  };

  const getStatusBadge = () => {
    return (
      <WaitingBadge>
        <AlertCircle size={12} /> Waiting for Approval
      </WaitingBadge>
    );
  };

  const safePatientList = Array.isArray(patientList) ? patientList : [];
  const filteredPatients = safePatientList.filter(
    (patient) =>
      patient.patientname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patient_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.barcode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  console.log("Filtered patients:", filteredPatients);
  console.log("Current patients:", currentPatients);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (error) {
    return (
      <Container>
        <GlobalStyle />
        <Card>
          <Header>
            <Title>Error</Title>
          </Header>
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>Failed to load patient data: {error}</p>
            <Button
              onClick={() => fetchPatientData(fromDate, toDate)}
              style={{ marginTop: "1rem" }}
            >
              Retry
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <GlobalStyle />
      <Card>
        <Header>
          <Title>Patient List</Title>
          <FiltersContainer>
            <DateRangeContainer>
              <DatePickerWrapper>
                <DatePickerLabel>
                  <Calendar size={16} />
                  From:
                </DatePickerLabel>
                <DatePicker
                  selected={fromDate}
                  onChange={setFromDate}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select from date"
                  isClearable
                />
              </DatePickerWrapper>

              <DatePickerWrapper>
                <DatePickerLabel>To:</DatePickerLabel>
                <DatePicker
                  selected={toDate}
                  onChange={setToDate}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select to date"
                  isClearable
                  minDate={fromDate}
                />
              </DatePickerWrapper>

              <FilterButton onClick={handleFilter}>
                <Filter size={16} />
                Filter
              </FilterButton>

              {(fromDate || toDate) && (
                <ClearButton onClick={handleClearFilter}>Clear</ClearButton>
              )}
            </DateRangeContainer>

            <SearchContainer>
              <SearchIconWrapper>
                <Search size={16} />
              </SearchIconWrapper>
              <SearchInput
                type="text"
                placeholder="Search by name, ID, or barcode"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </SearchContainer>
          </FiltersContainer>
        </Header>

        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <th>Date</th>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Barcode</th>
                <th>Age</th>
                <th>Test Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Loading patient data...
                  </td>
                </tr>
              ) : currentPatients.length > 0 ? (
                currentPatients.map((patient, index) => (
                  <tr key={index}>
                    <td>
                      {patient.date
                        ? new Date(patient.date).toLocaleDateString()
                        : "Invalid Date"}
                    </td>
                    <td>{patient.patient_id}</td>
                    <td>{patient.patientname}</td>
                    <td>{patient.barcode}</td>
                    <td>{patient.age}</td>
                    <td>
                      <TestList>
                        {patient.testdetails &&
                        patient.testdetails.length > 0 ? (
                          patient.testdetails.map((test, idx) => (
                            <TestItem key={idx}>{test.testname}</TestItem>
                          ))
                        ) : (
                          <TestItem>No tests available</TestItem>
                        )}
                      </TestList>
                    </td>
                    <td>
                      <StatusList>
                        {patient.testdetails &&
                        patient.testdetails.length > 0 ? (
                          patient.testdetails.map((test, idx) => (
                            <li key={idx}>{getStatusBadge()}</li>
                          ))
                        ) : (
                          <li>No status available</li>
                        )}
                      </StatusList>
                    </td>
                    <td>
                      <ViewButton
                        onClick={() =>
                          handleViewDetails(
                            patient.patient_id,
                            patient.date,
                            patient.testdetails &&
                              patient.testdetails.length > 0
                              ? patient.testdetails[0].testname
                              : "N/A"
                          )
                        }
                      >
                        <Eye size={14} />
                        View
                      </ViewButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <NoData colSpan={8}>
                    No patient data available for the selected criteria.
                  </NoData>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredPatients.length > patientsPerPage && (
          <PaginationContainer>
            <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
              <ChevronLeft size={16} />
            </PaginationButton>
            <PaginationInfo>
              Page {currentPage} of {totalPages}
            </PaginationInfo>
            <PaginationButton
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </PaginationButton>
          </PaginationContainer>
        )}
      </Card>
    </Container>
  );
}

export default PatientList;