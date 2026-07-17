import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import {
  Download,
  Filter,
  Database,
  Info,
  List,
} from "lucide-react";
import { exportToExcel as exportExcelFile } from "../../utils/xlsxUtils";
import { useCachedApi } from '../../hooks/useApiCache';

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
    --border-radius: 12px;
    --box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  margin: 2rem auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 24px;
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
  border: 1px solid rgba(0,0,0,0.02);
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #6e8efb, #a777e3, #e56f8f);
  padding: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: white;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1;
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
  background-color: #f8fafc;
  
  th {
    padding: 1.25rem 1rem;
    text-align: left;
    font-weight: 600;
    color: #64748b;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #e2e8f0;
    background: transparent;
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
  transition: all 0.2s;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8fafc;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${(props) =>
    props.primary
      ? "#6e8efb"
      : props.success
        ? "#10b981"
        : "white"};
  color: ${(props) =>
    props.primary || props.success ? "white" : "#475569"};
  border: 1px solid
    ${(props) =>
    props.primary
      ? "#6e8efb"
      : props.success
        ? "#10b981"
        : "#e2e8f0"};
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: var(--transition);
  opacity: ${(props) => (props.disabled ? "0.7" : "1")};
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    background-color: ${(props) =>
    props.primary
      ? "#5a7ce6"
      : props.success
        ? "#059669"
        : "#f1f5f9"};
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
  gap: 1.5rem;
  margin-bottom: 2rem;
  background: #fff;
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.02);

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
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #475569;
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
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 0.95rem;
  transition: var(--transition);
  background: #f8fafc;
  color: #1e293b;

  &:focus {
    outline: none;
    border-color: #a777e3;
    background: white;
    box-shadow: 0 0 0 4px rgba(167, 119, 227, 0.1);
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

  // ✅ Cached read. The request URL already encodes patient_id/from_date/to_date,
  // so each distinct filter combination gets its own cache entry - changing any
  // filter (including via the date inputs) now naturally triggers a fetch,
  // reusing the cached response if the same combination was fetched recently.
  const queryParams = new URLSearchParams();
  if (filters.patient_id) queryParams.append("patient_id", filters.patient_id);
  if (filters.from_date) queryParams.append("from_date", filters.from_date);
  if (filters.to_date) queryParams.append("to_date", filters.to_date);
  const requestUrl = `${API_BASE_URL}?${queryParams.toString()}`;

  const {
    data: cachedResponse,
    loading: apiLoading,
    error: apiError,
    refetch: refetchPatientData,
  } = useCachedApi(requestUrl, null, { ttl: 60 * 1000 });

  // Sync the hook's state into the local state the rest of this component
  // (pagination, export, table rendering) already relies on.
  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading]);

  useEffect(() => {
    if (apiError) {
      console.error("Error fetching data:", apiError);
      setError(`Error fetching data: ${apiError}`);
      setPatients([]);
      setAllPatients([]);
      return;
    }
    if (cachedResponse) {
      const data = Array.isArray(cachedResponse?.data) ? cachedResponse.data : [];
      setAllPatients(data);
      setPatients(data);
      setError(null);
    }
  }, [cachedResponse, apiError]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyFilter = () => {
    setCurrentPage(1);
    // Force-bypass the cache: the user explicitly asked for the latest data
    // for the currently-typed filters, even if a cached entry is still fresh.
    refetchPatientData(true);
  };

  const handleClearFilter = () => {
    const defaultFilters = {
      patient_id: "",
      from_date: today,
      to_date: today,
    };
    setFilters(defaultFilters);
    setCurrentPage(1);
    // Resetting filters changes the request URL, so useCachedApi will fetch
    // automatically for the new (default) filter combination. Note: the
    // previous implementation here called apiRequest(...).then(response =>
    // response.json()), but apiRequest already resolves to a plain
    // { success, data, error } object (not a fetch Response), so that
    // .json() call was dead/broken code - removed as part of this cleanup.
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
        (char === "" || char === ";") &&
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
    exportExcelFile(exportData, fileName, { sheetName: "Patient Report" });
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
              <Download /> Export to Excel
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
                  <Filter /> Apply Filters
                </Button>
                <Button onClick={handleClearFilter}>Clear</Button>
              </ButtonGroup>
            </FilterContainer>

            {error && (
              <Alert type="error">
                <Info />
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
                  <Database />
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
                        <Th>Reg. Date</Th>
                        <Th>Collected</Th>
                        <Th>Patient ID</Th>
                        <Th>Name</Th>
                        <Th>Age/Gender</Th>
                        <Th>Referred By</Th>
                        <Th>B2B</Th>
                        <Th>Sales Rep</Th>
                        <Th>Sample Collector</Th>
                        <Th>Status</Th>
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

                        // Format dates
                        const regDate = patient.registration_date
                          ? new Date(patient.registration_date).toLocaleString("en-GB", {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })
                          : new Date(patient.date).toLocaleDateString("en-GB");

                        const collectionInfo = patient.collected_date
                          ? `${patient.collected_date} ${patient.collection_time || ''}`
                          : "N/A";

                        return (
                          <Tr key={patientId}>
                            <Td>{regDate}</Td>
                            <Td>{collectionInfo}</Td>
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

                            {/* Status Column */}
                            <Td>
                              <Badge
                                type={
                                  patient.status === "Approved" || patient.status === "Partially Approved"
                                    ? "success"
                                    : "primary"
                                }
                              >
                                {patient.status || "Pending"}
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
                                    <List />
                                  </ViewDetailsButton>
                                )}

                                {activeTooltipId === patientId &&
                                  testNames.length > 0 && (
                                    <Tooltip>
                                      <TooltipHeader>
                                        Tests ({testNames.length})
                                      </TooltipHeader>
                                      <TestList>
                                        {testNames.map((test, idx) => (
                                          <TestItem key={idx}>
                                            {test.trim()}
                                          </TestItem>
                                        ))}
                                      </TestList>
                                    </Tooltip>
                                  )}
                              </TestNameContainer>
                            </Td>
                            <Td style={{ fontWeight: "600" }}>
                              ₹{patient.totalAmount || patient.total_amount}
                            </Td>
                            <Td>
                              <Badge
                                type={
                                  paymentMethod === "Cash"
                                    ? "success"
                                    : "primary"
                                }
                              >
                                {paymentMethod || "N/A"}
                              </Badge>
                            </Td>
                            <Td style={{ fontSize: "0.75rem" }}>
                              {paymentDetails || "-"}
                            </Td>
                            <Td
                              style={{
                                color:
                                  patient.credit_amount > 0
                                    ? "var(--danger)"
                                    : "inherit",
                                fontWeight:
                                  patient.credit_amount > 0 ? "600" : "400",
                              }}
                            >
                              ₹{patient.credit_amount || 0}
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
      </Container >
    </>
  );
};

export default PatientDataTable;