import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import {
  FiDownload,
  FiFilter,
  FiDatabase,
  FiInfo,
  FiList,
} from "react-icons/fi";
import * as XLSX from "xlsx";
import apiRequest from '../Auth/apiRequest';

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
`;

// Styled components remain the same as before...
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
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

const CardBody = styled.div`
  padding: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  overflow: hidden;
`;

const THead = styled.thead`
  background-color: var(--secondary);
  color: white;

  th {
    padding: 12px;
    text-align: center;
    font-weight: bold;
    background-color: var(--primary);
  }
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--gray-light);
  font-size: 0.875rem;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: var(--light);
  }

  &:hover {
    background-color: rgba(67, 97, 238, 0.05);
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${(props) =>
    props.primary
      ? "var(--primary)"
      : props.success
      ? "var(--success)"
      : "white"};
  color: ${(props) =>
    props.primary || props.success ? "white" : "var(--gray)"};
  border: 1px solid
    ${(props) =>
      props.primary
        ? "var(--primary)"
        : props.success
        ? "var(--success)"
        : "var(--gray-light)"};
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: var(--transition);
  opacity: ${(props) => (props.disabled ? "0.7" : "1")};

  &:hover {
    background-color: ${(props) =>
      props.primary
        ? "var(--primary-dark)"
        : props.success
        ? "var(--primary-light)"
        : "var(--gray-light)"};
  }
`;

const Alert = styled.div`
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  ${(props) =>
    props.type === "success" &&
    `
    background-color: rgba(76, 201, 240, 0.1);
    border-left: 4px solid var(--success);
    color: var(--primary-dark);
  `}

  ${(props) =>
    props.type === "error" &&
    `
    background-color: rgba(247, 37, 133, 0.1);
    border-left: 4px solid var(--danger);
    color: var(--danger);
  `}
  
  ${(props) =>
    props.type === "info" &&
    `
    background-color: rgba(144, 224, 239, 0.1);
    border-left: 4px solid var(--info);
    color: var(--primary-dark);
  `}
`;

const LoadingSpinner = styled.div`
  border: 2px solid var(--gray-light);
  border-top: 2px solid var(--primary);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;

  ${(props) =>
    props.type === "primary" &&
    `
    background-color: rgba(67, 97, 238, 0.1);
    color: var(--primary);
  `}

  ${(props) =>
    props.type === "secondary" &&
    `
    background-color: rgba(63, 55, 201, 0.1);
    color: var(--secondary);
  `}
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
`;

const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background-color: rgba(76, 201, 240, 0.1);
  border-radius: 50%;
  margin-bottom: 1rem;

  svg {
    color: var(--primary);
    width: 1.75rem;
    height: 1.75rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--dark);
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-self: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 1rem;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: var(--gray);
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// New styled components for handling test names display
const TestNameContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  max-width: 250px;
`;

const TestNamePreview = styled.div`
  font-size: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
`;

const TestNameItem = styled.div`
  padding: 2px 0;
  border-bottom: 1px dotted var(--gray-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:last-child {
    border-bottom: none;
  }
`;

const ViewDetailsButton = styled.button`
  background: var(--primary-light);
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  cursor: pointer;

  &:hover {
    background: var(--primary);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 0.75rem;
  width: 280px;
  z-index: 10;
  margin-bottom: 8px;
  border: 1px solid var(--gray-light);

  &:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 20px;
    border-width: 8px;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }
`;

const TooltipHeader = styled.div`
  font-weight: 600;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  color: var(--primary-dark);
  border-bottom: 1px solid var(--gray-light);
  padding-bottom: 0.5rem;
`;

const TestList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
`;

const TestItem = styled.li`
  padding: 0.4rem 0;
  font-size: 0.75rem;
  border-bottom: 1px dashed var(--gray-light);

  &:last-child {
    border-bottom: none;
  }
`;

const PatientDataTable = () => {
  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]); // Store all fetched patients
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Initialize filters with today's date for both from and to
  const [filters, setFilters] = useState({
    patient_id: "",
    from_date: today,
    to_date: today,
  });

  const [activeTooltipId, setActiveTooltipId] = useState(null);

  // API base URL - replace with your actual API endpoint
  const API_BASE_URL = `${Labbaseurl}overall_report/`;

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      // We still send filters to backend for patient_id if provided
      const queryParams = new URLSearchParams();
      if (filters.patient_id)
        queryParams.append("patient_id", filters.patient_id);

      const response = await apiRequest(`${API_BASE_URL}?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAllPatients(data); // Store all fetched data

      // Apply date filters in the frontend
      const filteredData = applyDateFilters(data);
      setPatients(filteredData);

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(`Error fetching data: ${err.message}`);
      setPatients([]);
      setAllPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data when component mounts or when patient_id filter changes
    fetchData();
  }, [filters.patient_id]); // Only re-fetch when patient_id changes

  // Also apply date filters immediately when component mounts
  useEffect(() => {
    if (allPatients.length > 0) {
      const filteredData = applyDateFilters(allPatients);
      setPatients(filteredData);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Apply date filters to the data in the frontend
  const applyDateFilters = (data) => {
    if (!filters.from_date && !filters.to_date) {
      return data; // Return all data if no date filters
    }

    return data.filter((patient) => {
      const patientDate = new Date(patient.date);

      // Set time to midnight for accurate date comparison
      patientDate.setHours(0, 0, 0, 0);

      let fromDateObj = null;
      let toDateObj = null;

      if (filters.from_date) {
        fromDateObj = new Date(filters.from_date);
        fromDateObj.setHours(0, 0, 0, 0);
      }

      if (filters.to_date) {
        toDateObj = new Date(filters.to_date);
        // Set to end of day for inclusive "to" date
        toDateObj.setHours(23, 59, 59, 999);
      }

      // Apply date range filter
      if (fromDateObj && toDateObj) {
        return patientDate >= fromDateObj && patientDate <= toDateObj;
      } else if (fromDateObj) {
        return patientDate >= fromDateObj;
      } else if (toDateObj) {
        return patientDate <= toDateObj;
      }

      return true;
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyFilter = () => {
    if (filters.patient_id) {
      // If patient_id changed, we need to fetch from API
      fetchData();
    } else {
      // Just apply date filters to existing data
      const filteredData = applyDateFilters(allPatients);
      setPatients(filteredData);
      setCurrentPage(1); // Reset to first page when filters change
    }
  };

  const handleClearFilter = () => {
    // Set today's date for from_date and to_date when clearing filters
    setFilters({
      patient_id: "",
      from_date: today,
      to_date: today,
    });

    // Apply the default today's date filter to data
    if (allPatients.length > 0) {
      const filteredData = applyDateFilters(allPatients);
      setPatients(filteredData);
    }
    setCurrentPage(1);
  };

  // Toggle tooltip visibility
  const toggleTooltip = (id) => {
    if (activeTooltipId === id) {
      setActiveTooltipId(null);
    } else {
      setActiveTooltipId(id);
    }
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        activeTooltipId !== null &&
        !e.target.closest(".test-name-container")
      ) {
        setActiveTooltipId(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [activeTooltipId]);

  // Helper function to parse test names string with parentheses handling
  const parseTestNamesString = (testNamesStr) => {
    if (!testNamesStr) return [];

    // Parse the string handling parentheses correctly
    const result = [];
    let currentTest = "";
    let insideParentheses = 0;

    // Go through each character one by one
    for (let i = 0; i < testNamesStr.length; i++) {
      const char = testNamesStr[i];

      // Track parentheses depth
      if (char === "(") {
        insideParentheses++;
        currentTest += char;
      } else if (char === ")") {
        insideParentheses--;
        currentTest += char;
      }
      // If we find a comma and we're not inside parentheses, it's a test separator
      else if (char === "," && insideParentheses === 0) {
        result.push(currentTest.trim());
        currentTest = "";
      }
      // Handle - and ; as separators when not inside parentheses
      else if (
        (char === "-" || char === ";") &&
        insideParentheses === 0 &&
        (i === 0 || testNamesStr[i - 1] === " ") &&
        i + 1 < testNamesStr.length &&
        testNamesStr[i + 1] === " "
      ) {
        result.push(currentTest.trim());
        currentTest = "";
      }
      // Otherwise, add to current test
      else {
        currentTest += char;
      }
    }

    // Add the last test if any
    if (currentTest.trim()) {
      result.push(currentTest.trim());
    }

    // Return the final array of tests
    return result;
  };

  // Get test names from patient object
  const getTestNames = (patient) => {
    if (Array.isArray(patient.testname) && patient.testname.length > 0) {
      if (
        typeof patient.testname[0] === "object" &&
        patient.testname[0].testname
      ) {
        return patient.testname.map((t) => t.testname);
      } else {
        return patient.testname;
      }
    } else if (patient.test_names) {
      if (Array.isArray(patient.test_names)) {
        return patient.test_names;
      } else if (typeof patient.test_names === "string") {
        return parseTestNamesString(patient.test_names);
      }
      return [patient.test_names];
    } else if (patient.testname && typeof patient.testname === "string") {
      return parseTestNamesString(patient.testname);
    }
    return [];
  };

  // Count tests for a patient
  const countTests = (patient) => {
    const testNames = getTestNames(patient);
    return testNames.length;
  };

  // Helper function to get payment method and details
  const getPaymentInfo = (patient) => {
    let paymentMethod = "";
    let paymentDetails = "";

    if (typeof patient.payment_method === "object" && patient.payment_method) {
      paymentMethod = patient.payment_method.paymentmethod || "";

      // Extract payment details as-is without labels
      if (patient.payment_method.chequedetails) {
        paymentDetails = patient.payment_method.chequedetails;
      } else if (patient.payment_method.carddetails) {
        paymentDetails = patient.payment_method.carddetails;
      } else if (patient.payment_method.upidetails) {
        paymentDetails = patient.payment_method.upidetails;
      } else if (patient.payment_method.netbankingdetails) {
        paymentDetails = patient.payment_method.netbankingdetails;
      } else if (patient.payment_method.creditdetails) {
        paymentDetails = patient.payment_method.creditdetails;
      } else if (patient.payment_method.details) {
        paymentDetails = patient.payment_method.details;
      }
    } else if (typeof patient.payment_method === "string") {
      paymentMethod = patient.payment_method;
    }

    return { paymentMethod, paymentDetails };
  };

  // Export data to Excel
  const exportToExcel = () => {
    // Prepare data for export - using the filtered data
    const exportData = patients.map((p) => {
      // Get test names as a formatted string
      const testNames = getTestNames(p);
      const testNamesStr = testNames.join(", ");

      // Get payment information
      const { paymentMethod, paymentDetails } = getPaymentInfo(p);

      return {
        "Patient ID": p.patient_id,
        Name: p.patientname || p.patient_name, // Handle different field names
        Age: p.age,
        Gender: p.gender,
        Date: new Date(p.date).toLocaleDateString("en-GB"),
        "Referred By": p.refby,
        B2B: p.b2b || "N/A", // Add B2B field
        "Sales Representative": p.salesMapping || "N/A", // Add Sales Representative field
        "Sample Collector": p.sample_collector || "N/A", // Add Sample Collector field
        Branch: p.branch,
        Segment: p.segment,
        "No. of Tests": countTests(p), // Add number of tests
        "Test Name(s)": testNamesStr, // Add test names
        "Total Amount": p.totalAmount || p.total_amount, // Handle different field names
        "Payment Method": paymentMethod,
        "Payment Details": paymentDetails, // Add payment details
        "Credit Amount": p.credit_amount,
        "Bill No": p.bill_no,
        "Registered By": p.registeredby,
      };
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patient Report");

    // Generate filename with current date and date range if filtered
    let fileName = "patient_report";

    if (filters.from_date) {
      fileName += `_from_${filters.from_date}`;
    }

    if (filters.to_date) {
      fileName += `_to_${filters.to_date}`;
    }

    if (!filters.from_date && !filters.to_date) {
      fileName += `_${new Date().toISOString().split("T")[0]}`;
    }

    fileName += ".xlsx";

    // Export to file
    XLSX.writeFile(workbook, fileName);
  };

  // Get current patients for pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Card>
          <CardHeader>
            <Title>Patient Report</Title>
            <Button
              primary
              onClick={exportToExcel}
              disabled={loading || patients.length === 0}
            >
              <FiDownload /> Export to Excel
            </Button>
          </CardHeader>
          <CardBody>
            <FilterContainer>
              <FilterGroup>
                <FormLabel>Patient ID</FormLabel>
                <InputGroup>
                  <Input
                    type="text"
                    name="patient_id"
                    value={filters.patient_id}
                    onChange={handleFilterChange}
                    placeholder="Enter Patient ID"
                  />
                </InputGroup>
              </FilterGroup>

              <FilterGroup>
                <FormLabel>From Date</FormLabel>
                <InputGroup>
                  <Input
                    type="date"
                    name="from_date"
                    value={filters.from_date}
                    onChange={handleFilterChange}
                  />
                </InputGroup>
              </FilterGroup>

              <FilterGroup>
                <FormLabel>To Date</FormLabel>
                <InputGroup>
                  <Input
                    type="date"
                    name="to_date"
                    value={filters.to_date}
                    onChange={handleFilterChange}
                  />
                </InputGroup>
              </FilterGroup>

              <ButtonGroup>
                <Button primary onClick={handleApplyFilter}>
                  <FiFilter /> Apply Filters
                </Button>
                <Button onClick={handleClearFilter}>Clear</Button>
              </ButtonGroup>
            </FilterContainer>

            {error && (
              <Alert type="error">
                <FiInfo />
                <div>{error}</div>
              </Alert>
            )}

            {loading ? (
              <EmptyState>
                <LoadingSpinner />
                <p style={{ marginTop: "1rem" }}>Loading patient data...</p>
              </EmptyState>
            ) : patients.length === 0 ? (
              <EmptyState>
                <IconCircle>
                  <FiDatabase />
                </IconCircle>
                <h3 style={{ marginBottom: "0.5rem", fontWeight: "500" }}>
                  No patient data found
                </h3>
                <p style={{ color: "var(--gray)" }}>
                  Try adjusting your filters or add new patients to the system.
                </p>
              </EmptyState>
            ) : (
              <>
                <div style={{ overflowX: "auto" }}>
                  <Table>
                    <THead type="primary">
                      <Tr>
                        <Th>Date</Th>
                        <Th>Patient ID</Th>
                        <Th>Name</Th>
                        <Th>Age/Gender</Th>
                        <Th>Referred By</Th>
                        <Th>B2B</Th>
                        <Th>Sales Rep</Th>
                        <Th>Sample Collector</Th>
                        <Th>No. of Tests</Th>
                        <Th>Test Names</Th>
                        <Th>Total Amount</Th>
                        <Th>Payment Method</Th>
                        <Th>Payment Details</Th>
                        <Th>Credit Amount</Th>
                      </Tr>
                    </THead>
                    <tbody>
                      {currentPatients.map((patient, index) => {
                        const patientId = patient._id || `patient-${index}`;
                        const testNames = getTestNames(patient);
                        const testCount = countTests(patient);
                        const { paymentMethod, paymentDetails } =
                          getPaymentInfo(patient);

                        return (
                          <Tr key={patientId}>
                            <Td>
                              {new Date(patient.date).toLocaleDateString(
                                "en-GB"
                              )}
                            </Td>
                            <Td>
                              <Badge type="primary">{patient.patient_id}</Badge>
                            </Td>
                            <Td style={{ fontWeight: "500" }}>
                              {patient.patientname || patient.patient_name}
                            </Td>
                            <Td>{`${patient.age} / ${patient.gender}`}</Td>
                            <Td>{patient.refby}</Td>

                            {/* B2B Column */}
                            <Td>
                              <Badge
                                type={
                                  patient.b2b && patient.b2b !== "N/A"
                                    ? "info"
                                    : "secondary"
                                }
                              >
                                {patient.b2b || "N/A"}
                              </Badge>
                            </Td>

                            {/* Sales Representative Column */}
                            <Td>
                              <Badge
                                type={
                                  patient.salesMapping &&
                                  patient.salesMapping !== "N/A"
                                    ? "success"
                                    : "secondary"
                                }
                              >
                                {patient.salesMapping || "N/A"}
                              </Badge>
                            </Td>

                            {/* Sample Collector Column */}
                            <Td>
                              <Badge
                                type={
                                  patient.sample_collector &&
                                  patient.sample_collector !== "N/A"
                                    ? "warning"
                                    : "secondary"
                                }
                              >
                                {patient.sample_collector || "N/A"}
                              </Badge>
                            </Td>

                            {/* No. of Tests Column */}
                            <Td>
                              <Badge type="secondary">{testCount}</Badge>
                            </Td>

                            {/* Test Names Column - Enhanced with tooltip */}
                            <Td>
                              <TestNameContainer className="test-name-container">
                                <TestNamePreview>
                                  {testNames.length > 0 ? (
                                    testNames
                                      .slice(0, 3)
                                      .map((test, i) => (
                                        <TestNameItem key={i}>
                                          • {test.trim()}
                                        </TestNameItem>
                                      ))
                                  ) : (
                                    <span style={{ color: "var(--gray)" }}>
                                      No tests
                                    </span>
                                  )}
                                  {testNames.length > 3 && (
                                    <TestNameItem
                                      style={{ color: "var(--primary)" }}
                                    >
                                      +{testNames.length - 3} more...
                                    </TestNameItem>
                                  )}
                                </TestNamePreview>

                                {testNames.length > 0 && (
                                  <ViewDetailsButton
                                    title="View all test names"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTooltip(patientId);
                                    }}
                                  >
                                    <FiList />
                                  </ViewDetailsButton>
                                )}

                                {activeTooltipId === patientId &&
                                  testNames.length > 0 && (
                                    <Tooltip>
                                      <TooltipHeader>
                                        Test Names ({testNames.length})
                                      </TooltipHeader>
                                      <TestList>
                                        {testNames.map((test, i) => (
                                          <TestItem key={i}>
                                            • {test.trim()}
                                          </TestItem>
                                        ))}
                                      </TestList>
                                    </Tooltip>
                                  )}
                              </TestNameContainer>
                            </Td>

                            <Td>
                              ₹
                              {parseInt(
                                patient.totalAmount || patient.total_amount || 0
                              ).toLocaleString()}
                            </Td>
                            <Td>
                              <Badge
                                type={paymentMethod ? "info" : "secondary"}
                              >
                                {paymentMethod || "-"}
                              </Badge>
                            </Td>
                            <Td>
                              {paymentDetails ? (
                                <span
                                  style={{
                                    fontSize: "0.85em",
                                    color: "var(--text-secondary)",
                                  }}
                                >
                                  {paymentDetails}
                                </span>
                              ) : (
                                <span style={{ color: "var(--gray)" }}>-</span>
                              )}
                            </Td>
                            <Td>
                              {parseInt(patient.credit_amount) > 0 ? (
                                <span style={{ color: "var(--danger)" }}>
                                  ₹
                                  {parseInt(
                                    patient.credit_amount
                                  ).toLocaleString()}
                                </span>
                              ) : (
                                <span style={{ color: "var(--gray)" }}>-</span>
                              )}
                            </Td>
                          </Tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>

                <PaginationContainer>
                  <PaginationInfo>
                    Showing{" "}
                    <strong>
                      {patients.length > 0 ? indexOfFirstPatient + 1 : 0}
                    </strong>{" "}
                    to{" "}
                    <strong>
                      {Math.min(indexOfLastPatient, patients.length)}
                    </strong>{" "}
                    of <strong>{patients.length}</strong> entries
                  </PaginationInfo>
                  <PaginationButtons>
                    <Button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      primary
                      onClick={() => paginate(currentPage + 1)}
                      disabled={indexOfLastPatient >= patients.length}
                    >
                      Next
                    </Button>
                  </PaginationButtons>
                </PaginationContainer>
              </>
            )}
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default PatientDataTable;