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

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

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

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
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

const BarcodeSearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  max-width: 28rem;
  min-width: 200px;
  @media (max-width: ${(props) => props.theme.breakpoints?.md || "768px"}) {
    max-width: 100%;
  }
`;

const StepButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background: ${(props) => props.theme.colors.backgroundAlt || props.theme.colors.background};
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${(props) => props.theme.transitions?.default || "all 0.2s ease-in-out"};
  line-height: 1;
  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: white;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 2px 8px ${(props) => props.theme.colors.primary}40;
  }
  &:active {
    transform: scale(0.95);
  }
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
  z-index: 1200;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.xl};
  width: 100%;
  max-width: 1200px;
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

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
`;

// Calendar component
const SimpleDatePicker = ({ selectedDate, onChange, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );

  const isSelectedDate = (date) =>
    date &&
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getFullYear() === selectedDate.getFullYear();

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

  const handleBarcodeStep = (delta) => {
    setSearchQuery((prev) => {
      const match = prev.match(/^(.*?)(\d+)$/);
      if (match) {
        const prefix = match[1];
        const num = parseInt(match[2], 10);
        const padLength = match[2].length;
        const next = Math.max(0, num + delta);
        return prefix + String(next).padStart(padLength, "0");
      }
      return delta > 0 ? prev + "1" : prev;
    });
  };
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [statusChanges, setStatusChanges] = useState({});
  const [remarks, setRemarks] = useState({});
  const [emergencyFilter, setEmergencyFilter] = useState("All");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [outsourceLabs, setOutsourceLabs] = useState([]);
  const [selectedOutsourceLab, setSelectedOutsourceLab] = useState({});
  const [selectedTests, setSelectedTests] = useState([]);
  const storedName = localStorage.getItem("name");
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Add this inside the component, before the useEffects
  const fetchSampleCollected = async () => {
    setLoading(true);
    try {
      const localFromDate = new Date(fromDate);
      localFromDate.setMinutes(
        localFromDate.getMinutes() - localFromDate.getTimezoneOffset(),
      );
      const formattedFromDate = localFromDate.toISOString().split("T")[0];

      const localToDate = new Date(toDate);
      localToDate.setMinutes(
        localToDate.getMinutes() - localToDate.getTimezoneOffset(),
      );
      const formattedToDate = localToDate.toISOString().split("T")[0];

      const response = await apiRequest(
        `${Labbaseurl}get_sample_collected/?from_date=${formattedFromDate}&to_date=${formattedToDate}`,
        "GET",
      );

      if (response.success) {
        setSamples(response.data.data || []);
        setError(null);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchOutsourceLabs = async () => {
      try {
        const response = await apiRequest(
          `${Labbaseurl}get_outsource_labs/`,
          "GET",
        );
        let labs = [];
        if (response && response.data) {
          if (Array.isArray(response.data)) {
            labs = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            labs = response.data.data;
          }
        }
        setOutsourceLabs(labs);
      } catch (err) {
        console.error("Error fetching outsource labs:", err);
        setOutsourceLabs([]);
      }
    };
    if (Labbaseurl) fetchOutsourceLabs();
  }, [Labbaseurl]);

  // Replace the existing fetchSampleCollected useEffect with:
  useEffect(() => {
    fetchSampleCollected();
  }, [fromDate, toDate]);

  // ✅ All handlers use barcode as key (same as HMS)
  const handleStatusChange = (barcode, testIndex, newStatus) => {
    setStatusChanges((prev) => ({
      ...prev,
      [barcode]: {
        ...prev[barcode],
        [testIndex]: newStatus,
      },
    }));

    if (newStatus !== "Rejected") {
      setRemarks((prev) => {
        const updated = { ...prev };
        delete updated[`${barcode}-${testIndex}`];
        return updated;
      });
    }

    if (newStatus !== "Outsource") {
      setSelectedOutsourceLab((prev) => {
        const updated = { ...prev };
        delete updated[`${barcode}-${testIndex}`];
        return updated;
      });
    }
  };

  const handleRemarksChange = (barcode, testIndex, value) => {
    setRemarks((prev) => ({
      ...prev,
      [`${barcode}-${testIndex}`]: value,
    }));
  };

  const handleOutsourceLabChange = (barcode, testIndex, labName) => {
    setSelectedOutsourceLab((prev) => ({
      ...prev,
      [`${barcode}-${testIndex}`]: labName,
    }));
  };

  const toggleSelectTest = (barcode, testIndex) => {
    const isCurrentlySelected = selectedTests.includes(
      `${barcode}-${testIndex}`,
    );
    if (isCurrentlySelected) {
      setSelectedTests((prev) =>
        prev.filter((id) => id !== `${barcode}-${testIndex}`),
      );
      handleStatusChange(barcode, testIndex, "");
    } else {
      setSelectedTests((prev) => [...prev, `${barcode}-${testIndex}`]);
      handleStatusChange(barcode, testIndex, "Received");
    }
  };

  const selectAllTests = (barcode) => {
    if (!selectedPatient) return;
    const allTestIds = selectedPatient.testdetails.map(
      (_, idx) => `${barcode}-${idx}`,
    );
    const allSelected = allTestIds.every((id) => selectedTests.includes(id));

    if (allSelected) {
      setSelectedTests([]);
      selectedPatient.testdetails.forEach((_, testIndex) => {
        handleStatusChange(barcode, testIndex, "");
      });
    } else {
      setSelectedTests(allTestIds);
      selectedPatient.testdetails.forEach((_, testIndex) => {
        handleStatusChange(barcode, testIndex, "Received");
      });
    }
  };

  const updateAllTests = async () => {
    const barcode = selectedPatient.barcode;
    const testsToUpdate = [];
    let hasErrors = false;
    let errorMessage = "";

    selectedPatient.testdetails.forEach((detail, testIndex) => {
      const updatedStatus = statusChanges[barcode]?.[testIndex];

      if (!updatedStatus) return;

      if (updatedStatus === "Outsource") {
        const outsourceLabName =
          selectedOutsourceLab[`${barcode}-${testIndex}`];
        if (!outsourceLabName) {
          hasErrors = true;
          errorMessage = `Please select an outsource lab for test: ${detail.testname}`;
          return;
        }
      }

      if (updatedStatus === "Rejected") {
        const updatedRemarks = remarks[`${barcode}-${testIndex}`];
        if (!updatedRemarks || updatedRemarks.trim() === "") {
          hasErrors = true;
          errorMessage = `Please provide a rejection reason for test: ${detail.testname}`;
          return;
        }
      }

      testsToUpdate.push({
        test_id: detail.test_id,
        samplestatus: updatedStatus,
        remarks: remarks[`${barcode}-${testIndex}`] || null,
        received_by: updatedStatus === "Received" ? storedName : null,
        rejected_by: updatedStatus === "Rejected" ? storedName : null,
        outsourced_by: updatedStatus === "Outsource" ? storedName : null,
        outsource_lab:
          updatedStatus === "Outsource"
            ? selectedOutsourceLab[`${barcode}-${testIndex}`]
            : null,
      });
    });

    if (hasErrors) {
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (testsToUpdate.length === 0) {
      setError("Please select a status for at least one test before updating.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const response = await apiRequest(
        `${Labbaseurl}update_sample_collected/${barcode}/`,
        "PUT",
        {
          barcode: selectedPatient.barcode,
          updates: testsToUpdate,
        },
      );

      if (response.success) {
        setSuccessMessage(
          `Successfully updated ${testsToUpdate.length} test(s)!`,
        );
        setTimeout(() => {
          setSuccessMessage(null);
          closeModal();
        }, 2000);

        setSamples((prevSamples) =>
          prevSamples.map((sample) =>
            sample.barcode === barcode
              ? {
                ...sample,
                testdetails: sample.testdetails.map((detail) => {
                  const update = testsToUpdate.find(
                    (t) => t.test_id === detail.test_id,
                  );
                  if (update) {
                    return {
                      ...detail,
                      samplestatus: update.samplestatus,
                      remarks: update.remarks,
                      outsource_lab: update.outsource_lab,
                    };
                  }
                  return detail;
                }),
              }
              : sample,
          ),
        );
      } else {
        setError(response.error || "Failed to update sample status");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError("An unexpected error occurred while updating sample status");
      setTimeout(() => setError(null), 3000);
      console.error("Unexpected error:", err);
    }
  };

  // ✅ openModal uses barcode (same as HMS)
  const openModal = (barcode) => {
    const patient = samples.find((sample) => sample.barcode === barcode);
    if (patient) {
      setSelectedPatient(patient);
    } else {
      console.error(`Barcode ${barcode} not found in samples`);
    }
  };

  // ✅ closeModal with reload (same as HMS)
  const closeModal = () => {
    setSelectedPatient(null);
    setStatusChanges({});
    setRemarks({});
    setSelectedTests([]);
    setSelectedOutsourceLab({});
    setError(null);
    setSuccessMessage(null);
    fetchSampleCollected(); // ← refetch with current dates instead of reloading
  };

  const filteredPatients = samples.filter((sample) => {
    const matchesSearch =
      sample.patientname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.patient_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.segment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.B2B?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.barcode?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEmergency =
      emergencyFilter === "All" ||
      (emergencyFilter === "Emergency" && sample.is_emergency) ||
      (emergencyFilter === "Normal" && !sample.is_emergency);

    return matchesSearch && matchesEmergency;
  });

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Card>
          <Header>
            <Title>Sample Accessioning</Title>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
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

          <FilterContainer>
            <BarcodeSearchWrapper>
              <SearchContainer style={{ flex: 1, minWidth: 0, maxWidth: "none" }}>
                <SearchIcon>
                  <Search size={16} />
                </SearchIcon>
                <SearchInput
                  type="text"
                  placeholder="B2B Name, Barcode, Patient name, ID, or Segment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchContainer>
              <StepButton
                type="button"
                title="Decrement barcode number"
                onClick={() => handleBarcodeStep(-1)}
              >
                −
              </StepButton>
              <StepButton
                type="button"
                title="Increment barcode number"
                onClick={() => handleBarcodeStep(1)}
              >
                +
              </StepButton>
            </BarcodeSearchWrapper>

            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                Status Filter:
              </label>
              <Select
                value={emergencyFilter}
                onChange={(e) => setEmergencyFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Emergency">Emergency</option>
                <option value="Normal">Normal</option>
              </Select>
            </div>
          </FilterContainer>

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
                        <Th>B2B Name</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((sample) => (
                        <Tr key={sample.barcode}>
                          <Td>
                            {new Date(sample.date).toLocaleDateString("en-GB")}
                          </Td>
                          <Td>{sample.patient_id}</Td>
                          <Td>{sample.patientname}</Td>
                          <Td>{sample.barcode}</Td>
                          <Td>{sample.age}</Td>
                          <Td>{sample.segment || "N/A"}</Td>
                          <Td>{sample.B2B || "N/A"}</Td>
                          <Td>
                            {sample.is_emergency ? (
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
                            {/* ✅ openModal now called with barcode */}
                            <Button
                              primary
                              onClick={() => openModal(sample.barcode)}
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
                    No samples found for the selected filters.
                  </EmptyStateText>
                </EmptyState>
              )}
            </>
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
                  <Tag size={16} />
                  <PatientInfoLabel>Barcode:</PatientInfoLabel>
                  <PatientInfoValue>{selectedPatient.barcode}</PatientInfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <User size={16} />
                  <PatientInfoLabel>Age:</PatientInfoLabel>
                  <PatientInfoValue>{selectedPatient.age}</PatientInfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <Clock size={16} color={theme.colors.primary} />
                  <PatientInfoLabel>Current Time:</PatientInfoLabel>
                  <PatientInfoValue>
                    {format(currentTime, "dd/MM/yyyy hh:mm:ss a")}
                  </PatientInfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <Activity size={16} color={theme.colors.success} />
                  <PatientInfoLabel>Branch:</PatientInfoLabel>
                  <PatientInfoValue>
                    {samples.length > 0
                      ? samples[0].branch
                      : "Shanmuga Reference Lab"}
                  </PatientInfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <User size={16} color={theme.colors.info} />
                  <PatientInfoLabel>Technician:</PatientInfoLabel>
                  <PatientInfoValue>{storedName || "N/A"}</PatientInfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <AlertCircle size={16} />
                  <PatientInfoLabel>Status:</PatientInfoLabel>
                  <PatientInfoValue>
                    {selectedPatient.is_emergency ? (
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
                  </PatientInfoValue>
                </PatientInfoItem>
              </PatientInfoCard>

              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <Th>Sl.No</Th>
                      <Th>Test Name</Th>
                      <Th>Container Type</Th>
                      <Th>Department</Th>
                      <Th>Status</Th>
                      <Th>Sample Collector</Th>
                      <Th>Outsource Lab</Th>
                      <Th>Reason for Rejection</Th>
                      <Th>
                        {/* ✅ selectAllTests uses barcode */}
                        <Checkbox
                          checked={
                            selectedPatient.testdetails.length > 0 &&
                            selectedPatient.testdetails.every((_, idx) =>
                              selectedTests.includes(
                                `${selectedPatient.barcode}-${idx}`,
                              ),
                            )
                          }
                          onChange={() =>
                            selectAllTests(selectedPatient.barcode)
                          }
                        />
                      </Th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPatient.testdetails.map((detail, testIndex) => (
                      <Tr key={testIndex}>
                        <Td>{testIndex + 1}</Td>
                        <Td>{detail.testname}</Td>
                        <Td>{detail.container}</Td>
                        <Td>{detail.department}</Td>
                        <Td>
                          {/* ✅ handleStatusChange uses barcode */}
                          <Select
                            value={
                              statusChanges[selectedPatient.barcode]?.[
                              testIndex
                              ] ?? detail.samplestatus
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                selectedPatient.barcode,
                                testIndex,
                                e.target.value,
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
                          {statusChanges[selectedPatient.barcode]?.[
                            testIndex
                          ] === "Outsource" && (
                              <Select
                                value={
                                  selectedOutsourceLab[
                                  `${selectedPatient.barcode}-${testIndex}`
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleOutsourceLabChange(
                                    selectedPatient.barcode,
                                    testIndex,
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="">Select Outsource Lab</option>
                                {Array.isArray(outsourceLabs) &&
                                  outsourceLabs.length > 0 ? (
                                  outsourceLabs.map((lab, index) => (
                                    <option
                                      key={lab.labID || index}
                                      value={lab.labName}
                                    >
                                      {lab.labName}
                                    </option>
                                  ))
                                ) : (
                                  <option value="" disabled>
                                    No labs available
                                  </option>
                                )}
                              </Select>
                            )}
                        </Td>
                        <Td>
                          {statusChanges[selectedPatient.barcode]?.[
                            testIndex
                          ] === "Rejected" && (
                              <Textarea
                                value={
                                  remarks[
                                  `${selectedPatient.barcode}-${testIndex}`
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleRemarksChange(
                                    selectedPatient.barcode,
                                    testIndex,
                                    e.target.value,
                                  )
                                }
                                placeholder="Enter rejection reason"
                              />
                            )}
                        </Td>
                        <Td>
                          {/* ✅ toggleSelectTest uses barcode */}
                          <Checkbox
                            checked={selectedTests.includes(
                              `${selectedPatient.barcode}-${testIndex}`,
                            )}
                            onChange={() =>
                              toggleSelectTest(
                                selectedPatient.barcode,
                                testIndex,
                              )
                            }
                          />
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>

              <div
                style={{
                  marginTop: "1.5rem",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button success onClick={updateAllTests}>
                  <CheckCircle size={16} />
                  Update All Tests
                </Button>
              </div>
            </ModalContent>
          </Modal>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default SampleStatusUpdate;
