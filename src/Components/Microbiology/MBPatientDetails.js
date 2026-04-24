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
  X,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from "react-router-dom";
import apiRequest from "../Auth/apiRequest";

// Theme
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
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  transitions: {
    default: "all 0.2s ease-in-out",
    slow: "all 0.3s ease-in-out",
  },
};

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: ${(props) => props.theme.colors.text};
    background-color: ${(props) => props.theme.colors.background};
    line-height: 1.5;
  }

  .react-datepicker-wrapper {
    width: auto;
  }

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

  .react-datepicker__day--selected {
    background-color: ${(props) => props.theme.colors.primary};
    color: white;
  }

  .react-datepicker__day:hover {
    background-color: ${(props) => props.theme.colors.primaryHover};
    color: white;
  }

  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range {
    background-color: ${(props) => props.theme.colors.primary}30;
    color: ${(props) => props.theme.colors.text};
  }

  .react-datepicker__day--selecting-range-start,
  .react-datepicker__day--range-start,
  .react-datepicker__day--range-end {
    background-color: ${(props) => props.theme.colors.primary};
    color: white;
  }
`;

// Styled Components
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

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

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
const ReportStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: ${(props) => props.theme.borderRadius.full};
  white-space: nowrap;

  ${(props) =>
    props.preliminary &&
    css`
      background-color: #7b2ff720;
      color: #7b2ff7;
      border: 1px solid #7b2ff7;
    `}

  ${(props) =>
    props.final &&
    css`
      background-color: ${props.theme.colors.success}20;
      color: ${props.theme.colors.success};
      border: 1px solid ${props.theme.colors.success};
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
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.375rem;

  &:hover {
    background: #f4f6f9;
    color: #1f2937;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ModalDescription = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

const OptionButton = styled.button`
  width: 100%;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;

  &:hover {
    border-color: #0178a1;
    background: #f9fbfc;
    color: #0178a1;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

// Main Component
const MBPatientDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState(location.state?.barcode || "");
  const [patientDetails, setPatientDetails] = useState([]);
  const [fromDate, setFromDate] = useState(
    location.state?.fromDate ? new Date(location.state.fromDate) : new Date(),
  );
  const [toDate, setToDate] = useState(
    location.state?.toDate ? new Date(location.state.toDate) : new Date(),
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emergencyFilter, setEmergencyFilter] = useState("all");
  const [fromFilter, setFromFilter] = useState("all");
  const [opipFilter, setOpipFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Fetch patient details from API
  useEffect(() => {
    const fetchPatientDetails = async () => {
      console.log("[v0] Fetching patient details with dates:", {
        fromDate,
        toDate,
      });
      setLoading(true);
      setError(null);

      try {
        const formattedFromDate = format(fromDate, "yyyy-MM-dd");
        const formattedToDate = format(toDate, "yyyy-MM-dd");
        console.log("[v0] Formatted dates:", {
          formattedFromDate,
          formattedToDate,
        });

        const patientResponse = await apiRequest(
          `${Labbaseurl}micro_biology_testvalue/?from_date=${formattedFromDate}&to_date=${formattedToDate}`,
          "GET",
        );

        console.log("[v0] API Response:", patientResponse);

        if (!patientResponse.success) {
          throw new Error(
            patientResponse.error || "Failed to fetch patient data",
          );
        }

        console.log(
          "[v0] Patient data received:",
          patientResponse.data?.length || 0,
          "records",
        );
        setPatientDetails(patientResponse.data);
        setError(null);
      } catch (err) {
        console.error("[v0] Error fetching patient details:", err);
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

  // Update handleParameterTypeSelect function to include test_code
  const handleParameterTypeSelect = (parameterType) => {
    if (!selectedTest) return;

    const {
      patient_id,
      patientname,
      age,
      barcode,
      location_id,
      test,
      date,
      created_date,
    } = selectedTest;

    const formattedPatientDate = date
      ? format(new Date(date), "yyyy-MM-dd")
      : "";
    const rawCreated = created_date || "";
    const formattedCreatedDate = rawCreated
      ? format(new Date(rawCreated.replace("T", " ") + "Z"), "yyyy-MM-dd")
      : "";
    const encodedBarcode = encodeURIComponent(barcode || "");

    setShowModal(false);

    navigate(
      `/MBTestDetails?date=${formattedPatientDate}&created_date=${formattedCreatedDate}&patient_id=${patient_id}&patientname=${patientname}&age=${age}&barcode=${encodedBarcode}&locationId=${
        location_id || "Shanmuga Referrence Lab"
      }&test_id=${test.test_id}&parameter_type=${parameterType}&test_code=${test.test_code}`,
      {
        state: {
          fromDate: fromDate,
          toDate: toDate,
          barcode: barcode,
        },
      },
    );
  };

  const handleTestClick = (patient, test) => {
    setSelectedTest({
      patient_id: patient.patient_id,
      patientname: patient.patientname,
      age: patient.age,
      barcode: patient.barcode,
      location_id: patient.location_id,
      date: patient.date,
      created_date: patient.created_date,
      test: test,
    });
    setShowModal(true);
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
    if (!test.test_value_exists) {
      return "Waiting for Technician's Approval";
    }
    // If this specific test is preliminary and approved, allow re-entry for final report
    if (test.is_preliminary && test.approve) {
      return "Waiting for Technician's Approval";
    }
    return test.rerun
      ? "Rerun Initiated"
      : test.approve
        ? "Approved"
        : "Waiting for Doctor's Approval";
  };
  // Group tests by department
  const groupTestsByDepartment = (testdetails) => {
    const grouped = {};
    testdetails.forEach((test) => {
      const dept = test.department || "Other";
      if (!grouped[dept]) {
        grouped[dept] = [];
      }
      grouped[dept].push(test);
    });
    return grouped;
  };

  // Get unique departments from all patients
  const getAllDepartments = () => {
    const departments = new Set();
    patientDetails.forEach((patient) => {
      patient.testdetails?.forEach((test) => {
        if (test.department) {
          departments.add(test.department);
        }
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
    const matchesFrom = fromFilter === "all" || patientLocation === fromFilter;

    if (!matchesFrom) return false;

    // OP/IP filter
    const matchesOpIp = opipFilter === "all" || patient.opiptype === opipFilter;

    if (!matchesOpIp) return false;

    // Emergency filter
    const matchesEmergency =
      emergencyFilter === "all" ||
      (emergencyFilter === "emergency" && patient.is_emergency) ||
      (emergencyFilter === "normal" && !patient.is_emergency);

    if (!matchesEmergency) return false;

    // Department filter
    if (departmentFilter !== "all") {
      const hasDepartment = patient.testdetails?.some(
        (test) => test.department === departmentFilter,
      );
      if (!hasDepartment) return false;
    }

    // Status filter
    if (statusFilter === "all") return true;

    return patient.testdetails?.some((test) => {
      const testStatus = getTestStatus(test, patient.is_preliminary);
      if (statusFilter === "technician") {
        return testStatus === "Waiting for Technician's Approval";
      } else if (statusFilter === "doctor") {
        return testStatus === "Waiting for Doctor's Approval";
      } else if (statusFilter === "approved") {
        return testStatus === "Approved";
      } else if (statusFilter === "rerun") {
        return testStatus === "Rerun Initiated";
      }
      return false;
    });
  });

  // Get unique locations
  const getUniqueLocations = () => {
    const locations = new Set();
    patientDetails.forEach((p) => {
      locations.add(p.location_id || "Shanmuga Reference Lab");
    });
    return Array.from(locations).sort();
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>M/B Patient Details</Title>
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
                                  const testStatus = getTestStatus(
                                    test,
                                    patient.is_preliminary,
                                  );
                                  return (
                                    <TestButton
                                      key={idx}
                                      onClick={() =>
                                        handleTestClick(patient, test)
                                      }
                                      title={
                                        testStatus ===
                                        "Waiting for Technician's Approval"
                                          ? test.is_preliminary && test.approve
                                            ? "Enter Final Report"
                                            : "Enter Test Values"
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
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                          }}
                                        >
                                          {test.is_preliminary && (
                                            <span
                                              style={{
                                                fontSize: "0.65rem",
                                                fontWeight: 700,
                                                padding: "0.15rem 0.5rem",
                                                borderRadius: "9999px",
                                                backgroundColor: "#7b2ff720",
                                                color: "#7b2ff7",
                                                border: "1px solid #7b2ff7",
                                                whiteSpace: "nowrap",
                                              }}
                                            >
                                              Preliminary
                                            </span>
                                          )}
                                          <ChevronRight size={16} />
                                        </div>
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
                                  const testStatus = getTestStatus(
                                    test,
                                    patient.is_preliminary,
                                  );
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

        {showModal && (
          <ModalOverlay onClick={() => setShowModal(false)}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>Select Parameter Type</ModalTitle>
                <CloseButton onClick={() => setShowModal(false)}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>
              <ModalBody>
                <ModalDescription>
                  Please select the parameter type for{" "}
                  {selectedTest?.test?.testname || "this test"}:
                </ModalDescription>
                <OptionButton onClick={() => handleParameterTypeSelect("GNB")}>
                  <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                    GNB
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                    Gram-Negative Bacteria Parameters
                  </div>
                </OptionButton>
                <OptionButton onClick={() => handleParameterTypeSelect("GPC")}>
                  <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                    GPC
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                    Gram-Positive Cocci Parameters
                  </div>
                </OptionButton>
                <OptionButton
                  onClick={() => handleParameterTypeSelect("Normal")}
                >
                  <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                    Normal
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                    Remarks Only (No Parameters)
                  </div>
                </OptionButton>
                <OptionButton
                  onClick={() => handleParameterTypeSelect("Preliminary")}
                >
                  <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                    Preliminary Report
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                    Remarks Only (No Parameters)
                  </div>
                </OptionButton>
              </ModalBody>
            </ModalContainer>
          </ModalOverlay>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default MBPatientDetails;
