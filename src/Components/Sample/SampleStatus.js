"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import {
  Calendar,
  Search,
  Check,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import apiRequest from "../auth/apiRequest";

// Theme
const theme = {
  colors: {
    primary: "#4f46e5",
    primaryHover: "#4338ca",
    secondary: "#6b7280",
    secondaryHover: "#4b5563",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
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
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
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
  max-width: 1200px;
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
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.background};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 1px ${(props) => props.theme.colors.primary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.textLight};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(props) => props.theme.colors.textLight};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
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
  transition: all 0.2s ease;

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
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background-color: ${(props) =>
        props.success
          ? props.theme.colors.success
          : props.primary
          ? props.theme.colors.primary
          : props.secondary
          ? "white"
          : "initial"};
    }
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: ${(props) => props.theme.borderRadius.md};

  ${(props) =>
    props.pending &&
    `
    background-color: ${props.theme.colors.warning}20;
    color: ${props.theme.colors.warning};
  `}

  ${(props) =>
    props.collected &&
    `
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
  z-index: 50;
`;

const ModalContent = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.lg};
  width: 90%;
  max-width: 1100px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
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
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.textLight};

  &:hover {
    color: ${(props) => props.theme.colors.text};
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

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
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

// Calendar component
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
const SampleStatus = () => {
  const storedName = localStorage.getItem("name");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [savedTests, setSavedTests] = useState({});
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [testDetails, setTestDetails] = useState({});
  const [selectedTests, setSelectedTests] = useState([]);
  const [currentPatientTests, setCurrentPatientTests] = useState([]);
  const [loadingTestDetails, setLoadingTestDetails] = useState(false);
  // New state for tracking save button status
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    const fetchPatientsByDate = async () => {
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
        const result = await apiRequest(
          `${Labbaseurl}sample_patient/?from_date=${formattedFromDate}&to_date=${formattedToDate}`,
          "GET"
        );

        if (result.success) {
          const patientsData =
            typeof result.data === "string"
              ? JSON.parse(result.data)
              : result.data;
          setPatients(patientsData.data || []);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientsByDate();
  }, [fromDate, toDate]);

  const fetchTestDetailsByIds = async (testIds) => {
    setLoadingTestDetails(true);
    try {
      // Fetch test details for each test_id separately since backend supports test_id filtering
      const testDetailsPromises = testIds.map((testId) =>
        apiRequest(`${Labbaseurl}test_details/?test_id=${testId}`, "GET")
      );

      const results = await Promise.all(testDetailsPromises);
      const allTestDetails = [];

      // Combine all successful results
      results.forEach((result) => {
        if (result.success) {
          const data = result.data.data || result.data;
          if (Array.isArray(data)) {
            allTestDetails.push(...data);
          } else if (data) {
            allTestDetails.push(data);
          }
        }
      });

      // Transform the data to include parameters if needed
      const processedTests = allTestDetails.map((test) => {
        const processedTest = {
          ...test,
          status: "Pending", // Default status for sample collection
        };

        // If test has parameters (like CBC), flatten them for display
        if (test.parameters) {
          let parameters = [];
          if (typeof test.parameters === "string") {
            try {
              parameters = JSON.parse(test.parameters);
            } catch (e) {
              parameters = test.parameters;
            }
          } else {
            parameters = test.parameters;
          }

          // For device-based parameters, get the first device's parameters
          if (
            typeof parameters === "object" &&
            parameters !== null &&
            !Array.isArray(parameters)
          ) {
            const firstDevice = Object.keys(parameters)[0];
            if (firstDevice && Array.isArray(parameters[firstDevice])) {
              parameters = parameters[firstDevice];
            }
          }

          processedTest.parameters = parameters;
        }

        return processedTest;
      });

      setCurrentPatientTests(processedTests);

      if (processedTests.length === 0) {
        setError("No test details found for the selected tests");
      }
    } catch (err) {
      setError("Error fetching test details: " + err.message);
    } finally {
      setLoadingTestDetails(false);
    }
  };

  const handleStatusChange = (testId, status) => {
    setCurrentPatientTests((prevTests) =>
      prevTests.map((test) =>
        test.test_id === testId ? { ...test, status } : test
      )
    );
  };

  const toggleSelectTest = (testId) => {
    const isCurrentlySelected = selectedTests.includes(testId);

    if (isCurrentlySelected) {
      // Unselect and set status to Pending
      setSelectedTests((prevSelected) =>
        prevSelected.filter((id) => id !== testId)
      );
      handleStatusChange(testId, "Pending");
    } else {
      // Select and set status to Sample Collected
      setSelectedTests((prevSelected) => [...prevSelected, testId]);
      handleStatusChange(testId, "Sample Collected");
    }
  };

  const saveAllTestsForPatient = async () => {
    setIsSaving(true); // Start saving process
    try {
      const patient = patients.find((p) => p.patient_id === selectedPatientId);
      if (!patient) {
        setError("Patient not found");
        setSuccessMessage(null);
        setTimeout(() => setError(null), 3000);
        return;
      }

      // Check if data already exists
      const checkResult = await apiRequest(
        `${Labbaseurl}check_sample_status/${patient.patient_id}/`,
        "GET"
      );

      const dataExists = checkResult.success && checkResult.data?.exists;

      // Helper function to format datetime as "YYYY-MM-DD HH:MM:SS"
      const formatDateTime = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const seconds = String(d.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      if (dataExists) {
        // Use PATCH to update existing data
        const currentTime = formatDateTime(new Date());

        const patchData = {
          patient_id: patient.patient_id,
          barcode: patient.barcode,
          testdetails: currentPatientTests.map((test) => {
            const isSelected = selectedTests.includes(test.test_id);
            const status = isSelected ? "Sample Collected" : "Pending";

            return {
              test_id: test.test_id,
              testname: test.test_name,
              samplestatus: status,
              samplecollected_time:
                status === "Sample Collected" ? currentTime : null,
              collectd_by: status === "Sample Collected" ? storedName : null,
            };
          }),
        };

        console.log("PATCH Data:", patchData);

        const result = await apiRequest(
          `${Labbaseurl}sample_statusupdate/${patient.patient_id}/`,
          "PATCH",
          patchData
        );

        if (result.success) {
          setSuccessMessage(
            result.data?.message || "Sample status updated successfully"
          );
          setError(null);
          setIsSaved(true); // Mark as saved
          setTimeout(() => {
            window.location.reload();
            setSuccessMessage(null);
          }, 3000);
        } else {
          setError(result.error || "Failed to update sample status");
          setSuccessMessage(null);
          setTimeout(() => setError(null), 3000);
        }
      } else {
        // Use POST to create new data
        const formattedDate1 = formatDateTime(new Date(patient.date));
        const currentTime = formatDateTime(new Date());

        const formattedData = {
          patient_id: patient.patient_id,
          barcode: patient.barcode,
          date: formattedDate1,
          testdetails: currentPatientTests.map((test) => {
            const isSelected = selectedTests.includes(test.test_id);
            const status = isSelected ? "Sample Collected" : "Pending";

            return {
              test_id: test.test_id,
              testname: test.test_name,
              container: test.collection_container || "N/A",
              department: test.department || "N/A",
              samplecollector: patient.sample_collector || "N/A",
              samplestatus: status,
              samplecollected_time:
                status === "Sample Collected" ? currentTime : null,
              received_time: null,
              rejected_time: null,
              oursourced_time: null,
              collectd_by: status === "Sample Collected" ? storedName : null,
              received_by: null,
              rejected_by: null,
              oursourced_by: null,
              remarks: null,
            };
          }),
        };

        console.log("POST Data:", formattedData);

        const result = await apiRequest(
          `${Labbaseurl}sample_status/`,
          "POST",
          formattedData
        );

        if (result.success) {
          setSavedTests((prev) => ({
            ...prev,
            [patient.patient_id]: formattedData,
          }));

          setSuccessMessage(
            result.data?.message ||
              `All test data saved successfully for ${
                patient.patientname || "patient"
              }`
          );
          setError(null);
          setIsSaved(true); // Mark as saved
          setTimeout(() => {
            window.location.reload();
            setSuccessMessage(null);
          }, 5000);
        } else {
          // Handle specific error messages
          let errorMessage = result.error || "Failed to save tests";

          // Check if it's the specific "patient already exists" error
          if (
            errorMessage.includes("Please change status as Sample Collected") ||
            errorMessage.includes("Patient ID already exists")
          ) {
            errorMessage = "Please change status as Sample Collected";
          }

          setError(errorMessage);
          setSuccessMessage(null);
          setTimeout(() => setError(null), 5000); // Show for longer time for this specific message
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);

      // Handle network errors that might contain the timezone error
      let errorMessage = "An unexpected error occurred";
      if (
        error.message &&
        error.message.includes("Please change status as Sample Collected")
      ) {
        errorMessage = "Please change status as Sample Collected";
      } else if (error.message && error.message.includes("timezone")) {
        errorMessage = "Please change status as Sample Collected";
      }

      setError(errorMessage);
      setSuccessMessage(null);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSaving(false); // End saving process
    }
  };

  const selectAllTests = () => {
    const allSelected = currentPatientTests.every((test) =>
      selectedTests.includes(test.test_id)
    );

    if (allSelected) {
      // Unselect all tests and set status to Pending
      setSelectedTests([]);
      setCurrentPatientTests((prevTests) =>
        prevTests.map((test) => ({ ...test, status: "Pending" }))
      );
    } else {
      // Select all tests and set status to Sample Collected
      const allTestIds = currentPatientTests.map((test) => test.test_id);
      setSelectedTests(allTestIds);
      setCurrentPatientTests((prevTests) =>
        prevTests.map((test) => ({ ...test, status: "Sample Collected" }))
      );
    }
  };

  const openModal = async (patientId) => {
    setSelectedPatientId(patientId);
    setShowModal(true);
    setSelectedTests([]);
    setCurrentPatientTests([]);
    // Reset save button states when opening modal
    setIsSaving(false);
    setIsSaved(false);

    // Get test_ids from patient's testdetails
    const patient = patients.find((p) => p.patient_id === patientId);
    if (patient && patient.testdetails) {
      const testIds = patient.testdetails.map((test) => test.test_id);
      await fetchTestDetailsByIds(testIds);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatientId(null);
    setError(null);
    setSuccessMessage(null);
    setSelectedTests([]);
    setCurrentPatientTests([]);
    // Reset save button states when closing modal
    setIsSaving(false);
    setIsSaved(false);
  };

  const filteredPatients = (patients || []).filter(
    (patient) =>
      patient.patientname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.segment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.barcode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Card>
          <Header>
            <Title>Patient Sample Status</Title>
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
            <EmptyState>
              <div>Loading patients...</div>
            </EmptyState>
          ) : error ? (
            <Alert error>
              <AlertCircle size={16} />
              Error: {error}
            </Alert>
          ) : (
            <>
              {filteredPatients.length > 0 ? (
                <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Patient ID</Th>
                        <Th>Patient Name</Th>
                        <Th>Barcode ID</Th>
                        <Th>Age</Th>
                        <Th>Segment</Th>
                        <Th>Tests</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient) => (
                        <Tr key={patient.patient_id}>
                          <Td>{patient.patient_id}</Td>
                          <Td>{patient.patientname}</Td>
                          <Td>{patient.barcode}</Td>
                          <Td>{patient.age}</Td>
                          <Td>{patient.segment || "N/A"}</Td>
                          <Td>
                            {patient.testdetails &&
                            patient.testdetails.length > 0
                              ? patient.testdetails
                                  .map((test) => test.test_name)
                                  .join(", ")
                              : "No tests"}
                          </Td>
                          <Td>
                            <Button
                              primary
                              onClick={() => openModal(patient.patient_id)}
                            >
                              View Sample Status
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <EmptyState>
                  <EmptyStateText>
                    No patients found for the selected date.
                  </EmptyStateText>
                </EmptyState>
              )}
            </>
          )}
        </Card>

        {showModal && selectedPatientId && (
          <Modal>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>
                  {
                    (patients || []).find(
                      (p) => p.patient_id === selectedPatientId
                    )?.patientname
                  }{" "}
                  - Test Details
                </ModalTitle>
                <CloseButton onClick={closeModal}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              {error && (
                <Alert error>
                  <AlertCircle size={16} />
                  {error}
                </Alert>
              )}

              {successMessage && (
                <Alert success>
                  <CheckCircle size={16} />
                  {successMessage}
                </Alert>
              )}

              {(patients || [])
                .filter((patient) => patient.patient_id === selectedPatientId)
                .map((patient) => (
                  <div key={patient.patient_id}>
                    <div style={{ marginBottom: "1rem" }}>
                      <strong>Patient ID:</strong> {patient.patient_id} |{" "}
                      <strong>Barcode:</strong> {patient.barcode} |{" "}
                      <strong>Age:</strong> {patient.age} |{" "}
                      <strong>Gender:</strong> {patient.gender || "N/A"}
                    </div>

                    {loadingTestDetails ? (
                      <EmptyState>
                        <div>Loading test details...</div>
                      </EmptyState>
                    ) : (
                      <div style={{ overflowX: "auto" }}>
                        <Table>
                          <thead>
                            <tr>
                              <Th>Test Name</Th>
                              <Th>Container Type</Th>
                              <Th>Department</Th>
                              <Th>Status</Th>
                              <Th>
                                <Checkbox
                                  checked={
                                    currentPatientTests.length > 0 &&
                                    currentPatientTests.every((test) =>
                                      selectedTests.includes(test.test_id)
                                    )
                                  }
                                  onChange={selectAllTests}
                                  disabled={isSaving || isSaved}
                                />
                              </Th>
                              <Th>Sample Collector</Th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentPatientTests.map((test) => (
                              <Tr key={test.test_id}>
                                <Td>{test.test_name}</Td>
                                <Td>{test.collection_container || "N/A"}</Td>
                                <Td>{test.department || "N/A"}</Td>
                                <Td>
                                  <Select
                                    value={test.status || "Pending"}
                                    onChange={(e) =>
                                      handleStatusChange(
                                        test.test_id,
                                        e.target.value
                                      )
                                    }
                                    disabled={isSaving || isSaved}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Sample Collected">
                                      Collected
                                    </option>
                                  </Select>
                                </Td>
                                <Td>
                                  <Checkbox
                                    checked={selectedTests.includes(
                                      test.test_id
                                    )}
                                    onChange={() =>
                                      toggleSelectTest(test.test_id)
                                    }
                                    disabled={isSaving || isSaved}
                                  />
                                </Td>
                                <Td>{patient.sample_collector || "N/A"}</Td>
                              </Tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}

                    <ButtonGroup>
                      <Button
                        success
                        onClick={saveAllTestsForPatient}
                        disabled={loadingTestDetails || isSaving || isSaved}
                      >
                        <Check size={16} />
                        {isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}
                      </Button>
                    </ButtonGroup>
                  </div>
                ))}
            </ModalContent>
          </Modal>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default SampleStatus;
