"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import {
  Search,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  User,
  Calendar,
  Tag,
  Activity,
} from "lucide-react";
import apiRequest from "../Auth/apiRequest";

// Theme definition
const theme = {
  colors: {
    primary: "#4f46e5",
    primaryHover: "#4338ca",
    secondary: "#6b7280",
    secondaryHover: "#4b5563",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
    background: "#ffffff",
    backgroundAlt: "#f9fafb",
    text: "#1f2937",
    textLight: "#6b7280",
    border: "#e5e7eb",
    borderDark: "#d1d5db",
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
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
    fast: "all 0.1s ease-in-out",
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
    background-color: ${(props) => props.theme.colors.backgroundAlt};
    line-height: 1.5;
  }
`;

// Styled components
const Container = styled.div`
  max-width: 1280px;
  margin: 2rem auto;
  padding: 0 1rem;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 0 2rem;
  }
`;

const Card = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.md};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 1.875rem;
  }
`;

const DatePickerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.borderDark};
  }
`;

const DateDisplay = styled.span`
  font-weight: 500;
`;

const CalendarContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  margin-top: 0.5rem;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.lg};
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CalendarDay = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: none;
  background-color: ${(props) =>
    props.selected ? props.theme.colors.primary : "transparent"};
  color: ${(props) => (props.selected ? "white" : props.theme.colors.text)};
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.selected
        ? props.theme.colors.primaryHover
        : props.theme.colors.backgroundAlt};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 24rem;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.background};
  transition: ${(props) => props.theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 1px ${(props) => props.theme.colors.primary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.textLight};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.sm};
  border: 1px solid ${(props) => props.theme.colors.border};
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(props) => props.theme.colors.textLight};
  background-color: ${(props) => props.theme.colors.backgroundAlt};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  vertical-align: middle;
`;

const Tr = styled.tr`
  &:hover {
    background-color: ${(props) => props.theme.colors.backgroundAlt};
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  transition: ${(props) => props.theme.transitions.default};

  ${(props) =>
    props.primary &&
    `
    background-color: ${props.theme.colors.primary};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${props.theme.colors.primaryHover};
    }
  `}

  ${(props) =>
    props.secondary &&
    `
    background-color: white;
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background-color: ${props.theme.colors.backgroundAlt};
    }
  `}
  
  ${(props) =>
    props.success &&
    `
    background-color: ${props.theme.colors.success};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${props.theme.colors.success}e6;
    }
  `}
  
  ${(props) =>
    props.danger &&
    `
    background-color: ${props.theme.colors.danger};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${props.theme.colors.danger}e6;
    }
  `}
  
  ${(props) =>
    props.info &&
    `
    background-color: ${props.theme.colors.info};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${props.theme.colors.info}e6;
    }
  `}
  
  ${(props) =>
    props.warning &&
    `
    background-color: ${props.theme.colors.warning};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${props.theme.colors.warning}e6;
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: ${(props) => props.theme.borderRadius.full};

  ${(props) =>
    props.collected &&
    `
    background-color: ${props.theme.colors.warning}20;
    color: ${props.theme.colors.warning};
  `}

  ${(props) =>
    props.received &&
    `
    background-color: ${props.theme.colors.success}20;
    color: ${props.theme.colors.success};
  `}
  
  ${(props) =>
    props.rejected &&
    `
    background-color: ${props.theme.colors.danger}20;
    color: ${props.theme.colors.danger};
  `}
  
  ${(props) =>
    props.outsource &&
    `
    background-color: ${props.theme.colors.info}20;
    color: ${props.theme.colors.info};
  `}
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin-left: 15%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.xl};
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  animation: modalFadeIn 0.3s ease-out;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.textLight};
  transition: ${(props) => props.theme.transitions.default};
  width: 2rem;
  height: 2rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${(props) => props.theme.colors.text};
    background-color: ${(props) => props.theme.colors.backgroundAlt};
  }
`;

const Select = styled.select`
  width: fit-content;
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${(props) => props.theme.colors.background};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${(props) => props.theme.colors.background};
  min-height: 80px;
  resize: vertical;
  transition: ${(props) => props.theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 1px ${(props) => props.theme.colors.primary};
  }
`;

const Alert = styled.div`
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: alertFadeIn 0.3s ease-out;

  @keyframes alertFadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  ${(props) =>
    props.success &&
    `
    background-color: ${props.theme.colors.success}20;
    color: ${props.theme.colors.success};
  `}

  ${(props) =>
    props.error &&
    `
    background-color: ${props.theme.colors.danger}20;
    color: ${props.theme.colors.danger};
  `}
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`;

const EmptyStateText = styled.p`
  color: ${(props) => props.theme.colors.textLight};
  margin-top: 1rem;
  max-width: 24rem;
`;

const PatientInfoCard = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.backgroundAlt};
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const PatientInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

const PatientInfoLabel = styled.span`
  font-weight: 600;
  color: ${(props) => props.theme.colors.textLight};
`;

const PatientInfoValue = styled.span`
  color: ${(props) => props.theme.colors.text};
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid ${(props) => props.theme.colors.backgroundAlt};
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
  padding: 2rem;
`;

// Calendar component (same as SampleStatus)
const SimpleDatePicker = ({ selectedDate, onChange, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const isSelectedDate = (date) => {
    return (
      date &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <Button secondary onClick={prevMonth}>
          &lt;
        </Button>
        <span>{format(currentMonth, "MMMM yyyy")}</span>
        <Button secondary onClick={nextMonth}>
          &gt;
        </Button>
      </CalendarHeader>
      <CalendarGrid>
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={index} style={{ textAlign: "center", padding: "0.25rem" }}>
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <CalendarDay
            key={index}
            selected={isSelectedDate(day)}
            onClick={() => day && onChange(day)}
            disabled={!day}
          >
            {day ? day.getDate() : ""}
          </CalendarDay>
        ))}
      </CalendarGrid>
      <ButtonGroup>
        <Button secondary onClick={onClose}>
          Close
        </Button>
      </ButtonGroup>
    </CalendarContainer>
  );
};

// Main component
const SampleStatusUpdate = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [savedTests, setSavedTests] = useState({});
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [statusChanges, setStatusChanges] = useState({});
  const storedName = localStorage.getItem("name");
  const [remarks, setRemarks] = useState({});
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    const fetchSampleCollected = async () => {
      setLoading(true);
      try {
        // Format both dates
        const localFromDate = new Date(fromDate);
        localFromDate.setMinutes(
          localFromDate.getMinutes() - localFromDate.getTimezoneOffset()
        );
        const formattedFromDate = localFromDate.toISOString().split("T")[0];

        const localToDate = new Date(toDate);
        localToDate.setMinutes(
          localToDate.getMinutes() - localToDate.getTimezoneOffset()
        );
        const formattedToDate = localToDate.toISOString().split("T")[0];

        // Updated API call with date range
        const response = await apiRequest(
          `${Labbaseurl}get_sample_collected/?from_date=${formattedFromDate}&to_date=${formattedToDate}`,
          "GET"
        );

        if (response.success) {
          setSamples(response.data.data || []);
          setError(null);
        } else {
          // Handle API errors
          setError(response.error);
          console.error("API Error:", response.error);
        }
      } catch (err) {
        // This catch block will rarely be hit since apiRequest handles most errors
        setError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSampleCollected();
  }, [fromDate, toDate]);

  const handleStatusChange = (patientId, testIndex, newStatus) => {
    setStatusChanges((prev) => ({
      ...prev,
      [patientId]: {
        ...prev[patientId],
        [testIndex]: newStatus,
      },
    }));

    if (newStatus !== "Rejected") {
      setRemarks((prev) => {
        const updatedRemarks = { ...prev };
        if (updatedRemarks[`${patientId}-${testIndex}`]) {
          delete updatedRemarks[`${patientId}-${testIndex}`];
        }
        return updatedRemarks;
      });
    }
  };

  const handleRemarksChange = (patientId, testIndex, value) => {
    setRemarks((prev) => ({
      ...prev,
      [`${patientId}-${testIndex}`]: value,
    }));
  };

  const updateTestStatus = async (patientId, testIndex) => {
    const updatedStatus =
      statusChanges[selectedPatient.patient_id]?.[testIndex];
    const testDetails = selectedPatient.testdetails[testIndex];
    const updatedRemarks = remarks[`${patientId}-${testIndex}`];

    if (!updatedStatus) {
      setError("Please select a status for the test before updating.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const response = await apiRequest(
        `${Labbaseurl}update_sample_collected/${patientId}/`,
        "PUT",
        {
          updates: [
            {
              testIndex,
              testname: testDetails.testname,
              samplestatus: updatedStatus,
              remarks: updatedRemarks || null,
              received_by: updatedStatus === "Received" ? storedName : null,
              rejected_by: updatedStatus === "Rejected" ? storedName : null,
              oursourced_by: updatedStatus === "Outsource" ? storedName : null,
            },
          ],
        }
      );

      if (response.success) {
        setSuccessMessage("Sample status updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);

        setSavedTests((prev) => ({
          ...prev,
          [`${patientId}-${testIndex}`]: true,
        }));

        setSamples((prevSamples) =>
          prevSamples.map((sample) =>
            sample.patient_id === patientId
              ? {
                  ...sample,
                  testdetails: sample.testdetails.map((detail, idx) =>
                    idx === testIndex
                      ? {
                          ...detail,
                          samplestatus: updatedStatus,
                          remarks: updatedRemarks || null,
                        }
                      : detail
                  ),
                }
              : sample
          )
        );
      } else {
        // Handle API errors returned by apiRequest
        setError(response.error || "Failed to update sample status");
        setTimeout(() => setError(null), 3000);
        console.error("API Error:", response.error);
      }
    } catch (err) {
      // This catch block will rarely be hit since apiRequest handles most errors
      setError("An unexpected error occurred while updating sample status");
      setTimeout(() => setError(null), 3000);
      console.error("Unexpected error:", err);
    }
  };

  const openModal = (patientId) => {
    const patient = samples.find((sample) => sample.patient_id === patientId);
    if (patient) {
      setSelectedPatient(patient);
    } else {
      console.error(`Patient ID ${patientId} not found in samples`);
    }
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setError(null);
    setSuccessMessage(null);
    window.location.reload(); // Reload the page to reset the state
  };

  // Updated filteredPatients to include barcode search
  const filteredPatients = samples.filter(
    (sample) =>
      sample.patientname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.segment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.barcode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Sample Collected":
        return (
          <Badge collected>
            <Clock size={12} /> Collected
          </Badge>
        );
      case "Received":
        return (
          <Badge received>
            <CheckCircle size={12} /> Received
          </Badge>
        );
      case "Rejected":
        return (
          <Badge rejected>
            <X size={12} /> Rejected
          </Badge>
        );
      case "Outsource":
        return (
          <Badge outsource>
            <Activity size={12} /> Outsourced
          </Badge>
        );
      default:
        return (
          <Badge>
            <Clock size={12} /> {status}
          </Badge>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Card>
          <Header>
            <Title>Sample Status Update</Title>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* From Date Picker */}
              <DatePickerWrapper>
                <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                  From Date:
                </label>
                <DateButton
                  onClick={() => setShowFromDatePicker(!showFromDatePicker)}
                >
                  <Calendar size={16} />
                  <DateDisplay>{format(fromDate, "yyyy-MM-dd")}</DateDisplay>
                </DateButton>
                {showFromDatePicker && (
                  <SimpleDatePicker
                    selectedDate={fromDate}
                    onChange={(date) => {
                      setFromDate(date);
                      setShowFromDatePicker(false);
                    }}
                    onClose={() => setShowFromDatePicker(false)}
                  />
                )}
              </DatePickerWrapper>

              {/* To Date Picker */}
              <DatePickerWrapper>
                <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                  To Date:
                </label>
                <DateButton
                  onClick={() => setShowToDatePicker(!showToDatePicker)}
                >
                  <Calendar size={16} />
                  <DateDisplay>{format(toDate, "yyyy-MM-dd")}</DateDisplay>
                </DateButton>
                {showToDatePicker && (
                  <SimpleDatePicker
                    selectedDate={toDate}
                    onChange={(date) => {
                      setToDate(date);
                      setShowToDatePicker(false);
                    }}
                    onClose={() => setShowToDatePicker(false)}
                  />
                )}
              </DatePickerWrapper>
            </div>
          </Header>

          <SearchContainer>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search by Barcode, Patient name, ID, or Segment ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          ) : error ? (
            <Alert error>
              <AlertCircle size={16} />
              Error: {error}
            </Alert>
          ) : (
            <>
              {filteredPatients.length > 0 ? (
                <TableContainer>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Date</Th>
                        <Th>Patient ID</Th>
                        <Th>Patient Name</Th>
                        <Th>Barcode</Th>
                        <Th>Age</Th>
                        <Th>Segment</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((sample) => (
                        <Tr key={sample.patient_id}>
                          <Td>
                            {new Date(sample.date).toLocaleDateString("en-GB")}
                          </Td>
                          <Td>{sample.patient_id}</Td>
                          <Td>{sample.patientname}</Td>
                          <Td>{sample.barcode}</Td>
                          <Td>{sample.age}</Td>
                          <Td>{sample.segment || "N/A"}</Td>
                          <Td>
                            <Button
                              primary
                              onClick={() => openModal(sample.patient_id)}
                            >
                              <FileText size={16} />
                              View Details
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                </TableContainer>
              ) : (
                <EmptyState>
                  <AlertCircle size={48} color={theme.colors.textLight} />
                  <EmptyStateText>
                    No samples found for the selected date range with status
                    "Sample Collected".
                  </EmptyStateText>
                </EmptyState>
              )}
            </>
          )}
        </Card>

        {selectedPatient && Array.isArray(selectedPatient.testdetails) && (
          <Modal>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>
                  <FileText size={20} />
                  Sample Details
                </ModalTitle>
                <CloseButton onClick={closeModal}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              {successMessage && (
                <Alert success>
                  <CheckCircle size={16} />
                  {successMessage}
                </Alert>
              )}

              {error && (
                <Alert error>
                  <AlertCircle size={16} />
                  {error}
                </Alert>
              )}

              <PatientInfoCard>
                <PatientInfoItem>
                  <User size={16} />
                  <PatientInfoLabel>Patient:</PatientInfoLabel>
                  <PatientInfoValue>
                    {selectedPatient.patientname}
                  </PatientInfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <Tag size={16} />
                  <PatientInfoLabel>ID:</PatientInfoLabel>
                  <PatientInfoValue>
                    {selectedPatient.patient_id}
                  </PatientInfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <Calendar size={16} />
                  <PatientInfoLabel>Date:</PatientInfoLabel>
                  <PatientInfoValue>
                    {new Date(selectedPatient.date).toLocaleDateString("en-GB")}
                  </PatientInfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <Tag size={16} />
                  <PatientInfoLabel>Barcode:</PatientInfoLabel>
                  <PatientInfoValue>{selectedPatient.barcode}</PatientInfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <User size={16} />
                  <PatientInfoLabel>Age:</PatientInfoLabel>
                  <PatientInfoValue>{selectedPatient.age}</PatientInfoValue>
                </PatientInfoItem>
              </PatientInfoCard>

              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <Th>Test Name</Th>
                      <Th>Container Type</Th>
                      <Th>Department</Th>
                      <Th>Status</Th>
                      <Th>Sample Collector</Th>
                      <Th>Reason for Rejection</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPatient.testdetails.map((detail, testIndex) => (
                      <Tr key={testIndex}>
                        <Td>{detail.testname}</Td>
                        <Td>{detail.container}</Td>
                        <Td>{detail.department}</Td>
                        <Td>
                          <Select
                            value={
                              statusChanges[selectedPatient.patient_id]?.[
                                testIndex
                              ] ?? detail.samplestatus
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                selectedPatient.patient_id,
                                testIndex,
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select Status</option>
                            <option value="Received">Received</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Outsource">Outsource</option>
                          </Select>
                        </Td>
                        <Td>{detail.samplecollector}</Td>
                        <Td>
                          {statusChanges[selectedPatient.patient_id]?.[
                            testIndex
                          ] === "Rejected" && (
                            <Textarea
                              value={
                                remarks[
                                  `${selectedPatient.patient_id}-${testIndex}`
                                ] || ""
                              }
                              onChange={(e) =>
                                handleRemarksChange(
                                  selectedPatient.patient_id,
                                  testIndex,
                                  e.target.value
                                )
                              }
                              placeholder="Enter rejection reason"
                            />
                          )}
                        </Td>
                        <Td>
                          <Button
                            success={
                              !savedTests[
                                `${selectedPatient.patient_id}-${testIndex}`
                              ]
                            }
                            secondary={
                              savedTests[
                                `${selectedPatient.patient_id}-${testIndex}`
                              ]
                            }
                            onClick={() =>
                              updateTestStatus(
                                selectedPatient.patient_id,
                                testIndex
                              )
                            }
                            disabled={
                              savedTests[
                                `${selectedPatient.patient_id}-${testIndex}`
                              ]
                            }
                          >
                            {savedTests[
                              `${selectedPatient.patient_id}-${testIndex}`
                            ] ? (
                              <>
                                <CheckCircle size={16} />
                                Updated
                              </>
                            ) : (
                              "Update"
                            )}
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            </ModalContent>
          </Modal>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default SampleStatusUpdate;