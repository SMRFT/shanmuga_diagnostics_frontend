"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import styled, {
  createGlobalStyle,
  ThemeProvider,
  keyframes,
  css,
} from "styled-components";
import {
  Calendar,
  Search,
  AlertCircle,
  ChevronRight,
  CheckCircle,
  RefreshCcw,
  Clock,
  User,
  Tag,
  FileText,
  CalendarDays,
  Users,
  Stethoscope,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from "react-router-dom";
import apiRequest from "../Auth/apiRequest";

const theme = {
  colors: {
    primary: "#0178A1",
    primaryHover: "#015d80",
    secondary: "#6B7280",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    background: "#F4F6F9",
    backgroundAlt: "#FFFFFF",
    backgroundHover: "#F9FBFC",
    text: "#1F2937",
    textLight: "#6B7280",
    border: "#E5E7EB",
    borderDark: "#D1D5DB",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1)",
    lg: "0 10px 15px -3px rgba(0,0,0,0.1)",
    xl: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  breakpoints: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px" },
  transitions: {
    default: "all 0.2s ease-in-out",
    slow: "all 0.3s ease-in-out",
  },
};

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: ${(props) => props.theme.colors.text};
    background-color: ${(props) => props.theme.colors.background};
    line-height: 1.5;
  }
  .react-datepicker-wrapper { width: auto; }
  .react-datepicker {
    font-family: inherit;
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: ${(props) => props.theme.borderRadius.lg};
    box-shadow: ${(props) => props.theme.shadows.lg};
  }
  .react-datepicker__header {
    background-color: ${(props) => props.theme.colors.background};
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }
  .react-datepicker__day--selected { background-color: ${(props) => props.theme.colors.primary}; color: white; }
  .react-datepicker__day:hover { background-color: ${(props) => props.theme.colors.primaryHover}; color: white; }
  .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range {
    background-color: ${(props) => props.theme.colors.primary}30;
    color: ${(props) => props.theme.colors.text};
  }
  .react-datepicker__day--selecting-range-start,
  .react-datepicker__day--range-start,
  .react-datepicker__day--range-end {
    background-color: ${(props) => props.theme.colors.primary}; color: white;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 2rem auto;
  padding: 2rem;
  background: ${(props) => props.theme.colors.backgroundAlt};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  box-shadow: ${(props) => props.theme.shadows.lg};
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    margin: 1rem;
    padding: 1rem;
  }
`;
const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;
const Title = styled.h1`
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;
const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;
const DateRangeWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: column;
    width: 100%;
  }
`;
const DatePickerWrapper = styled.div`
  gap: 0.1rem;
  align-items: center;
  background: ${(props) => props.theme.colors.backgroundAlt};
  padding: 0.5rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  transition: ${(props) => props.theme.transitions.default};
  min-width: 100px;
  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
  label {
    color: ${(props) => props.theme.colors.textLight};
    font-size: 0.875rem;
    white-space: nowrap;
  }
  .react-datepicker-wrapper {
    width: 100px;
  }
  input {
    border: none;
    background: transparent;
    color: ${(props) => props.theme.colors.text};
    font-size: 0.875rem;
    padding: 0.25rem;
    cursor: pointer;
    min-width: 80px;
    &:focus {
      outline: none;
    }
  }
`;
const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    max-width: 100%;
  }
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.875rem;
  transition: ${(props) => props.theme.transitions.default};
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary}20;
  }
`;
const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.textLight};
  pointer-events: none;
`;
const TableWrapper = styled.div`
  position: relative;
  overflow-x: auto;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.sm};
`;
const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.875rem;
`;
const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  white-space: nowrap;
  top: 0;
  z-index: 10;
  &:first-child {
    padding-left: 1.5rem;
  }
  &:last-child {
    padding-right: 1.5rem;
  }
`;
const Td = styled.td`
  padding: 1rem;
  color: ${(props) => props.theme.colors.text};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  vertical-align: top;
  &:first-child {
    padding-left: 1.5rem;
  }
  &:last-child {
    padding-right: 1.5rem;
  }
`;
const Tr = styled.tr`
  &:hover {
    background-color: ${(props) => props.theme.colors.backgroundHover};
  }
  &:last-child td {
    border-bottom: none;
  }
`;
const TestButton = styled.button`
  display: inline-flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background: ${(props) => props.theme.colors.backgroundAlt};
  color: ${(props) => props.theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;
  transition: ${(props) => props.theme.transitions.default};
  width: 100%;
  text-align: left;
  flex-direction: column;
  &:hover {
    background: ${(props) => props.theme.colors.background};
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
  }
  &:disabled {
    background: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.textLight};
    border-color: ${(props) => props.theme.colors.border};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
const TestNameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0.5rem;
`;
const UserInfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.textLight};
  margin-top: 0.25rem;
`;
const UserBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.375rem;
  background: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  white-space: nowrap;
`;
const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  ${(props) => {
    switch (props.status) {
      case "Approved":
        return css`
          background-color: ${props.theme.colors.success}20;
          color: ${props.theme.colors.success};
        `;
      case "Rerun Initiated":
        return css`
          background-color: ${props.theme.colors.danger}20;
          color: ${props.theme.colors.danger};
        `;
      default:
        return css`
          background-color: ${props.theme.colors.warning}20;
          color: ${props.theme.colors.warning};
        `;
    }
  }}
`;
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  background: ${(props) => props.theme.colors.backgroundAlt};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  border: 2px dashed ${(props) => props.theme.colors.border};
`;
const EmptyStateText = styled.p`
  color: ${(props) => props.theme.colors.textLight};
  margin-top: 1rem;
  max-width: 24rem;
`;
const LoadingSpinner = styled.div`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 50%;
  border-top-color: ${(props) => props.theme.colors.primary};
  animation: spin 1s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
`;
const PatientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${(props) => props.theme.colors.text};
  font-size: 0.875rem;
  svg {
    color: ${(props) => props.theme.colors.textLight};
  }
`;
const TestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const DateRangeLabel = styled.span`
  color: ${(props) => props.theme.colors.textLight};
  font-size: 0.875rem;
  margin: 0 0.5rem;
`;
const FilterSelect = styled.select`
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.backgroundAlt};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px;
  cursor: pointer;
  transition: ${(props) => props.theme.transitions.default};
  appearance: none;
  min-width: 150px;
  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary}20;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    width: 100%;
  }
`;
const blink = keyframes` 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } `;
const EmergencyBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: ${(props) => props.theme.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  ${(props) =>
    props.emergency &&
    css`
      background-color: ${props.theme.colors.danger};
      color: white;
      animation: ${blink} 1.5s ease-in-out infinite;
    `}
  ${(props) =>
    props.normal &&
    css`
      background-color: ${props.theme.colors.success}20;
      color: ${props.theme.colors.success};
    `}
`;
const DepartmentGroup = styled.div`
  margin-bottom: 0.75rem;
`;
const DepartmentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.primary};
`;

const PatientDetails = () => {
  const getDefaultFromDate = () => new Date();
  const getDefaultToDate = () => new Date();

  const [searchQuery, setSearchQuery] = useState("");
  const [patientDetails, setPatientDetails] = useState([]);
  const [fromDate, setFromDate] = useState(getDefaultFromDate());
  const [toDate, setToDate] = useState(getDefaultToDate());
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emergencyFilter, setEmergencyFilter] = useState("all");
  const [fromFilter, setFromFilter] = useState("all");
  const [opipFilter, setOpipFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const navigate = useNavigate();
  const location = useLocation();
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    if (
      location.state?.fromDate ||
      location.state?.toDate ||
      location.state?.barcode
    ) {
      if (location.state.fromDate)
        setFromDate(new Date(location.state.fromDate));
      if (location.state.toDate) setToDate(new Date(location.state.toDate));
      if (location.state.barcode) setSearchQuery(location.state.barcode);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const formattedFromDate = format(fromDate, "yyyy-MM-dd");
        const formattedToDate = format(toDate, "yyyy-MM-dd");
        const patientResponse = await apiRequest(
          `${Labbaseurl}samplestatus-testvalue/?from_date=${formattedFromDate}&to_date=${formattedToDate}`,
          "GET",
        );
        if (!patientResponse.success)
          throw new Error(
            patientResponse.error || "Failed to fetch patient data",
          );
        setPatientDetails(patientResponse.data);
        setError(null);
      } catch (err) {
        setError(
          err.message || "Failed to fetch patient details. Please try again.",
        );
        setPatientDetails([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientDetails();
  }, [fromDate, toDate, Labbaseurl]);

  // ── UPDATED: gender is now included in the navigate URL ──
  const handlePatientClick = (
    patientId,
    patientname,
    age,
    gender,
    barcode,
    location_id,
    testId,
    testName,
    patientDate,
    createdDate,
    phone,
    ref_doctor,
    barcode_by,
    barcode_date, // NEW
  ) => {
    const formattedPatientDate = patientDate
      ? format(new Date(patientDate), "yyyy-MM-dd")
      : "";
    const rawCreated = createdDate || "";
    const formattedCreatedDate = rawCreated
      ? format(new Date(rawCreated.replace("T", " ") + "Z"), "yyyy-MM-dd")
      : "";
    const encodedTestName = encodeURIComponent(testName || "");
    const encodedBarcode = encodeURIComponent(barcode || "");
    const encodedGender = encodeURIComponent(gender || "");
    const encodedPhone = encodeURIComponent(phone || ""); // NEW
    const encodedRefDoctor = encodeURIComponent(ref_doctor || ""); // NEW
    const encodedBarcodeBy = encodeURIComponent(barcode_by || ""); // NEW
    const encodedBarcodeDate = encodeURIComponent(barcode_date || ""); // NEW

    navigate(
      `/TestDetails?date=${formattedPatientDate}&created_date=${formattedCreatedDate}` +
        `&patient_id=${patientId}&patientname=${patientname}&age=${age}` +
        `&gender=${encodedGender}&barcode=${encodedBarcode}` +
        `&locationId=${location_id || "Shanmuga Referrence Lab"}&test_id=${testId}` +
        `&phone=${encodedPhone}&ref_doctor=${encodedRefDoctor}` + // NEW
        `&barcode_by=${encodedBarcodeBy}&barcode_date=${encodedBarcodeDate}`, // NEW
      { state: { fromDate, toDate, barcode } },
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle size={12} />;
      case "Rerun Initiated":
        return <RefreshCcw size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  const getTestStatus = (test) => {
    if (!test.test_value_exists) return "Waiting for Technician's Approval";
    return test.rerun
      ? "Rerun Initiated"
      : test.approve
        ? "Approved"
        : "Waiting for Doctor's Approval";
  };

  const groupTestsByDepartment = (testdetails) => {
    const grouped = {};
    testdetails.forEach((test) => {
      const dept = test.department || "Other";
      if (!grouped[dept]) grouped[dept] = [];
      grouped[dept].push(test);
    });
    return grouped;
  };

  const getAllDepartments = () => {
    const departments = new Set();
    patientDetails.forEach((patient) => {
      patient.testdetails?.forEach((test) => {
        if (test.department) departments.add(test.department);
      });
    });
    return Array.from(departments).sort();
  };

  const filteredPatients = patientDetails.filter((patient) => {
    const matchesSearch =
      (patient.patientname || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (patient.barcode || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (patient.patient_id || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    const patientLocation = patient.location_id || "Shanmuga Reference Lab";
    if (fromFilter !== "all" && patientLocation !== fromFilter) return false;
    if (opipFilter !== "all" && patient.opiptype !== opipFilter) return false;

    const matchesEmergency =
      emergencyFilter === "all" ||
      (emergencyFilter === "emergency" && patient.is_emergency) ||
      (emergencyFilter === "normal" && !patient.is_emergency);
    if (!matchesEmergency) return false;

    if (departmentFilter !== "all") {
      const hasDepartment = patient.testdetails?.some(
        (test) => test.department === departmentFilter,
      );
      if (!hasDepartment) return false;
    }

    if (statusFilter === "all") return true;
    return patient.testdetails?.some((test) => {
      const testStatus = getTestStatus(test);
      if (statusFilter === "technician")
        return testStatus === "Waiting for Technician's Approval";
      if (statusFilter === "doctor")
        return testStatus === "Waiting for Doctor's Approval";
      if (statusFilter === "approved") return testStatus === "Approved";
      if (statusFilter === "rerun") return testStatus === "Rerun Initiated";
      return false;
    });
  });

  const getUniqueLocations = () => {
    const locations = new Set();
    patientDetails.forEach((p) =>
      locations.add(p.location_id || "Shanmuga Reference Lab"),
    );
    return Array.from(locations).sort();
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>Patient Test Details</Title>
        </Header>

        <Controls>
          <DateRangeWrapper>
            <DatePickerWrapper>
              <Calendar size={16} color={theme.colors.textLight} />
              <label>From:</label>
              <DatePicker
                selected={fromDate}
                onChange={(date) => setFromDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="From date"
                selectsStart
                startDate={fromDate}
                endDate={toDate}
                maxDate={toDate}
              />
            </DatePickerWrapper>
            <DateRangeLabel>to</DateRangeLabel>
            <DatePickerWrapper>
              <CalendarDays size={16} color={theme.colors.textLight} />
              <label>To:</label>
              <DatePicker
                selected={toDate}
                onChange={(date) => setToDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="To date"
                selectsEnd
                startDate={fromDate}
                endDate={toDate}
                minDate={fromDate}
              />
            </DatePickerWrapper>
          </DateRangeWrapper>

          <SearchWrapper>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Enter Barcode, Name or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>

          <FilterSelect
            value={fromFilter}
            onChange={(e) => setFromFilter(e.target.value)}
          >
            <option value="all">All Locations</option>
            {getUniqueLocations().map((location, idx) => (
              <option key={idx} value={location}>
                {location}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            value={opipFilter}
            onChange={(e) => setOpipFilter(e.target.value)}
          >
            <option value="all">All Type</option>
            <option value="OP">OP</option>
            <option value="IP">IP</option>
          </FilterSelect>

          <FilterSelect
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {getAllDepartments().map((dept, idx) => (
              <option key={idx} value={dept}>
                {dept}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="technician">Waiting for Technician</option>
            <option value="doctor">Waiting for Doctor</option>
            <option value="approved">Approved</option>
            <option value="rerun">Rerun Initiated</option>
          </FilterSelect>

          <FilterSelect
            value={emergencyFilter}
            onChange={(e) => setEmergencyFilter(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="emergency">Emergency</option>
            <option value="normal">Normal</option>
          </FilterSelect>
        </Controls>

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : error ? (
          <EmptyState>
            <AlertCircle size={24} color={theme.colors.danger} />
            <EmptyStateText>{error}</EmptyStateText>
          </EmptyState>
        ) : filteredPatients.length === 0 ? (
          <EmptyState>
            <AlertCircle size={24} color={theme.colors.textLight} />
            <EmptyStateText>
              No received tests available for the selected filters.
            </EmptyStateText>
          </EmptyState>
        ) : (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Patient Info</Th>
                  <Th>Type</Th>
                  <Th>From</Th>
                  <Th>Priority</Th>
                  <Th>Tests (Grouped by Department)</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => {
                  const groupedTests = groupTestsByDepartment(
                    patient.testdetails || [],
                  );
                  return (
                    <Tr key={index}>
                      <Td>
                        <PatientInfo>
                          <Calendar size={14} />
                          {patient.date
                            ? format(new Date(patient.date), "MMM dd, yyyy")
                            : patient.created_date
                              ? format(
                                  new Date(patient.created_date),
                                  "MMM dd, yyyy",
                                )
                              : "N/A"}
                        </PatientInfo>
                      </Td>
                      <Td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                          }}
                        >
                          <PatientInfo>
                            <User size={14} />
                            <strong>
                              {patient.patientname || "Unknown Patient"}
                            </strong>
                          </PatientInfo>
                          <PatientInfo>
                            <Tag size={14} />
                            ID: {patient.patient_id || "Unknown ID"}
                          </PatientInfo>
                          <PatientInfo>
                            <FileText size={14} />
                            Barcode: {patient.barcode || "N/A"}
                          </PatientInfo>
                          {/* NEW: barcode_by and barcode_date in IST */}
                          {patient.barcode_by && (
                            <PatientInfo>
                              <User size={14} />
                              Barcode By: {patient.barcode_by}
                            </PatientInfo>
                          )}
                          {patient.barcode_date && (
                            <PatientInfo>
                              <Calendar size={14} />
                              Barcode Date:{" "}
                              {format(
                                new Date(
                                  new Date(patient.barcode_date).toLocaleString(
                                    "en-US",
                                    { timeZone: "Asia/Kolkata" },
                                  ),
                                ),
                                "MMM dd, yyyy hh:mm a",
                              )}
                            </PatientInfo>
                          )}
                          <PatientInfo>
                            <User size={14} />
                            Age: {patient.age || "Unknown"} |{" "}
                            {patient.gender || "N/A"}
                          </PatientInfo>
                        </div>
                      </Td>
                      <Td>
                        <StatusBadge status={patient.opiptype}>
                          {patient.opiptype || "N/A"}
                        </StatusBadge>
                      </Td>
                      <Td>
                        <PatientInfo>
                          {patient.location_id || "Shanmuga Reference Lab"}
                        </PatientInfo>
                      </Td>
                      <Td>
                        {patient.is_emergency ? (
                          <EmergencyBadge emergency>
                            <AlertCircle size={12} />
                            Emergency
                          </EmergencyBadge>
                        ) : (
                          <EmergencyBadge normal>
                            <CheckCircle size={12} />
                            Normal
                          </EmergencyBadge>
                        )}
                      </Td>
                      <Td>
                        {Object.entries(groupedTests).map(
                          ([department, tests]) => (
                            <DepartmentGroup key={department}>
                              <DepartmentHeader>
                                <Stethoscope size={14} />
                                {department}
                              </DepartmentHeader>
                              <TestList>
                                {tests.map((test, idx) => {
                                  const testStatus = getTestStatus(test);
                                  return (
                                    <TestButton
                                      key={idx}
                                      onClick={() =>
                                        handlePatientClick(
                                          patient.patient_id,
                                          patient.patientname,
                                          patient.age,
                                          patient.gender, // ← NEW: pass gender
                                          patient.barcode,
                                          patient.location_id,
                                          test.test_id,
                                          test.testname,
                                          patient.date,
                                          patient.created_date,
                                          patient.phone, // NEW
                                          patient.ref_doctor, // NEW
                                          patient.barcode_by, // NEW
                                          patient.barcode_date, // NEW
                                        )
                                      }
                                      title={
                                        testStatus ===
                                        "Waiting for Technician's Approval"
                                          ? "Enter Test Values"
                                          : testStatus === "Rerun Initiated"
                                            ? "Rerun Test"
                                            : "Test Cannot Be Edited"
                                      }
                                      disabled={
                                        !(
                                          testStatus ===
                                            "Waiting for Technician's Approval" ||
                                          testStatus === "Rerun Initiated"
                                        )
                                      }
                                    >
                                      <TestNameRow>
                                        <span>
                                          {test.test_id} - {test.testname}
                                        </span>
                                        <ChevronRight size={16} />
                                      </TestNameRow>
                                      <UserInfoRow>
                                        {test.collectd_by && (
                                          <UserBadge>
                                            <Users size={10} />
                                            C/B: {test.collectd_by}
                                          </UserBadge>
                                        )}
                                        {test.received_by && (
                                          <UserBadge>
                                            <Users size={10} />
                                            R/B: {test.received_by}
                                          </UserBadge>
                                        )}
                                        {test.verified_by && (
                                          <UserBadge>
                                            <Users size={10} />
                                            V/B: {test.verified_by}
                                          </UserBadge>
                                        )}
                                        {test.rerun_by && (
                                          <UserBadge>
                                            <Users size={10} />
                                            RR/B: {test.rerun_by}
                                          </UserBadge>
                                        )}
                                      </UserInfoRow>
                                    </TestButton>
                                  );
                                })}
                              </TestList>
                            </DepartmentGroup>
                          ),
                        )}
                      </Td>
                      <Td>
                        {Object.entries(groupedTests).map(
                          ([department, tests]) => (
                            <DepartmentGroup key={department}>
                              <TestList>
                                {tests.map((test, idx) => {
                                  const testStatus = getTestStatus(test);
                                  return (
                                    <StatusBadge key={idx} status={testStatus}>
                                      {getStatusIcon(testStatus)}
                                      {testStatus}
                                    </StatusBadge>
                                  );
                                })}
                              </TestList>
                            </DepartmentGroup>
                          ),
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrapper>
        )}

        <div
          style={{
            padding: "1rem 1.5rem",
            textAlign: "right",
            color: theme.colors.textLight,
            fontSize: "0.875rem",
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          Showing {filteredPatients.length}{" "}
          {filteredPatients.length === 1 ? "entry" : "entries"}
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default PatientDetails;
