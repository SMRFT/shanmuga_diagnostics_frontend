"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import styled, { createGlobalStyle, ThemeProvider } from "styled-components"
import { Search, X, CheckCircle, AlertCircle, FileText, Clock, User, Calendar, Tag, Activity } from "lucide-react"
import apiRequest from "../Auth/apiRequest"

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
}

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
`

// Styled components
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`

const Card = styled.div`
  background: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.lg};
  padding: 2rem;
  margin-bottom: 2rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const DatePickerWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const DateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  transition: ${(props) => props.theme.transitions.default};

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: ${(props) => props.theme.shadows.sm};
  }
`

const DateDisplay = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.textLight};
  z-index: 1;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.875rem;
  transition: ${(props) => props.theme.transitions.default};
  background: ${(props) => props.theme.colors.background};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textLight};
  }
`

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.sm};
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${(props) => props.theme.colors.background};
`

const Th = styled.th`
  background: ${(props) => props.theme.colors.backgroundAlt};
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  border-bottom: 2px solid ${(props) => props.theme.colors.border};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.text};
  font-size: 0.875rem;
`

const Tr = styled.tr`
  transition: ${(props) => props.theme.transitions.fast};
  
  &:hover {
    background: ${(props) => props.theme.colors.backgroundAlt};
  }
`

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: ${(props) => (props.small ? "0.375rem 0.75rem" : "0.5rem 1rem")};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => (props.small ? "0.75rem" : "0.875rem")};
  font-weight: 500;
  cursor: pointer;
  transition: ${(props) => props.theme.transitions.default};
  
  ${(props) =>
    props.primary &&
    `
    background: ${props.theme.colors.primary};
    color: white;
    &:hover:not(:disabled) {
      background: ${props.theme.colors.primaryHover};
      transform: translateY(-1px);
      box-shadow: ${props.theme.shadows.md};
    }
  `}
  
  ${(props) =>
    props.success &&
    `
    background: ${props.theme.colors.success};
    color: white;
    &:hover:not(:disabled) {
      background: #059669;
      transform: translateY(-1px);
      box-shadow: ${props.theme.shadows.md};
    }
  `}
  
  ${(props) =>
    props.secondary &&
    `
    background: ${props.theme.colors.secondary};
    color: white;
    &:hover:not(:disabled) {
      background: ${props.theme.colors.secondaryHover};
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`

const ModalContent = styled.div`
  background: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.xl};
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.theme.colors.backgroundAlt};
`

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.textLight};
  padding: 0.5rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  transition: ${(props) => props.theme.transitions.default};
  
  &:hover {
    background: ${(props) => props.theme.colors.border};
    color: ${(props) => props.theme.colors.text};
  }
`

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.875rem;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  transition: ${(props) => props.theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  transition: ${(props) => props.theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textLight};
  }
`

const Alert = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: 1rem;
  
  ${(props) =>
    props.error &&
    `
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  `}
  
  ${(props) =>
    props.success &&
    `
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  `}
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${(props) => props.theme.colors.textLight};
`

const EmptyStateText = styled.p`
  font-size: 1rem;
  margin-top: 1rem;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
`

const LoadingSpinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 2px solid ${(props) => props.theme.colors.border};
  border-top: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 500;
  
  ${(props) =>
    props.collected &&
    `
    background: #fef3c7;
    color: #d97706;
  `}
  
  ${(props) =>
    props.received &&
    `
    background: #dcfce7;
    color: #16a34a;
  `}
  
  ${(props) =>
    props.rejected &&
    `
    background: #fee2e2;
    color: #dc2626;
  `}
  
  ${(props) =>
    props.outsource &&
    `
    background: #dbeafe;
    color: #2563eb;
  `}
`

const PatientInfoCard = styled.div`
  background: ${(props) => props.theme.colors.backgroundAlt};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: 1.5rem;
  margin: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`

const PatientInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const PatientInfoLabel = styled.span`
  font-weight: 500;
  color: ${(props) => props.theme.colors.textLight};
`

const PatientInfoValue = styled.span`
  color: ${(props) => props.theme.colors.text};
`

// Calendar components (same as HmsSampleStatus)
const CalendarContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.lg};
  padding: 1rem;
  min-width: 280px;
`

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 1rem;
`

const CalendarDay = styled.button`
  padding: 0.5rem;
  border: none;
  background: ${(props) => (props.selected ? props.theme.colors.primary : "transparent")};
  color: ${(props) => (props.selected ? "white" : props.theme.colors.text)};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  
  &:hover:not(:disabled) {
    background: ${(props) => (props.selected ? props.theme.colors.primaryHover : props.theme.colors.backgroundAlt)};
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`

// Calendar component (same as HmsSampleStatus)
const SimpleDatePicker = ({ selectedDate, onChange, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate))
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i))
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isSelectedDate = (date) => {
    return (
      date &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

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
          <CalendarDay key={index} selected={isSelectedDate(day)} onClick={() => day && onChange(day)} disabled={!day}>
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
  )
}

// Main component
const HmsSampleStatusUpdate = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const [showFromDatePicker, setShowFromDatePicker] = useState(false)
  const [showToDatePicker, setShowToDatePicker] = useState(false)
  const [samples, setSamples] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [savedTests, setSavedTests] = useState({})
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [statusChanges, setStatusChanges] = useState({})
  const storedName = localStorage.getItem("name")
  const [remarks, setRemarks] = useState({})
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  useEffect(() => {
    const fetchSampleCollected = async () => {
      setLoading(true)
      try {
        // Format both dates
        const localFromDate = new Date(fromDate)
        localFromDate.setMinutes(localFromDate.getMinutes() - localFromDate.getTimezoneOffset())
        const formattedFromDate = localFromDate.toISOString().split("T")[0]

        const localToDate = new Date(toDate)
        localToDate.setMinutes(localToDate.getMinutes() - localToDate.getTimezoneOffset())
        const formattedToDate = localToDate.toISOString().split("T")[0]

        // Updated API call with date range
        const response = await apiRequest(
          `${Labbaseurl}hms_get_sample_collected/?from_date=${formattedFromDate}&to_date=${formattedToDate}`,
          "GET",
        )

        if (response.success) {
          setSamples(response.data.data || [])
          setError(null)
        } else {
          // Handle API errors
          setError(response.error)
          console.error("API Error:", response.error)
        }
      } catch (err) {
        // This catch block will rarely be hit since apiRequest handles most errors
        setError("An unexpected error occurred")
        console.error("Unexpected error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSampleCollected()
  }, [fromDate, toDate])

  const handleStatusChange = (barcode, testIndex, newStatus) => {
    setStatusChanges((prev) => ({
      ...prev,
      [barcode]: {
        ...prev[barcode],
        [testIndex]: newStatus,
      },
    }))

    if (newStatus !== "Rejected") {
      setRemarks((prev) => {
        const updatedRemarks = { ...prev }
        if (updatedRemarks[`${barcode}-${testIndex}`]) {
          delete updatedRemarks[`${barcode}-${testIndex}`]
        }
        return updatedRemarks
      })
    }
  }

  const handleRemarksChange = (barcode, testIndex, value) => {
    setRemarks((prev) => ({
      ...prev,
      [`${barcode}-${testIndex}`]: value,
    }))
  }

  const updateTestStatus = async (barcode, testIndex) => {
    const updatedStatus = statusChanges[selectedPatient.barcode]?.[testIndex]
    const testDetails = selectedPatient.testdetails[testIndex]
    const updatedRemarks = remarks[`${barcode}-${testIndex}`]

    if (!updatedStatus) {
      setError("Please select a status for the test before updating.")
      setTimeout(() => setError(null), 3000)
      return
    }

    try {
      const response = await apiRequest(`${Labbaseurl}hms_update_sample_collected/${barcode}/`, "PUT", {
        barcode: selectedPatient.barcode, // <-- send barcode
        samplecollected_time: testDetails.samplecollected_time, // <-- send exact collected time
        updates: [
          {
            test_id: testDetails.test_id, // <-- use test_id instead of testIndex
            samplestatus: updatedStatus,
            remarks: updatedRemarks || null,
            received_by: updatedStatus === "Received" ? storedName : null,
            rejected_by: updatedStatus === "Rejected" ? storedName : null,
            outsourced_by: updatedStatus === "Outsource" ? storedName : null,
          },
        ],
      })

      if (response.success) {
        setSuccessMessage("Sample status updated successfully!")
        setTimeout(() => setSuccessMessage(null), 3000)
        setSavedTests((prev) => ({
          ...prev,
          [`${barcode}-${testIndex}`]: true,
        }))
        setSamples((prevSamples) =>
          prevSamples.map((sample) =>
            sample.barcode === barcode
              ? {
                  ...sample,
                  testdetails: sample.testdetails.map((detail, idx) =>
                    idx === testIndex
                      ? {
                          ...detail,
                          samplestatus: updatedStatus,
                          remarks: updatedRemarks || null,
                        }
                      : detail,
                  ),
                }
              : sample,
          ),
        )
      } else {
        setError(response.error || "Failed to update sample status")
        setTimeout(() => setError(null), 3000)
      }
    } catch (err) {
      setError("An unexpected error occurred while updating sample status")
      setTimeout(() => setError(null), 3000)
      console.error("Unexpected error:", err)
    }
  }

  const openModal = (barcode) => {
    const patient = samples.find((sample) => sample.barcode === barcode)
    if (patient) {
      setSelectedPatient(patient)
    } else {
      console.error(`Barcode ${barcode} not found in samples`)
    }
  }

  const closeModal = () => {
    setSelectedPatient(null)
    setError(null)
    setSuccessMessage(null)
    window.location.reload() // Reload the page to reset the state
  }

  // Updated filteredPatients to include barcode search
  const filteredPatients = samples.filter(
    (sample) =>
      sample.patientname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.patient_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.barcode?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case "Sample Collected":
        return (
          <Badge collected>
            <Clock size={12} /> Collected
          </Badge>
        )
      case "Received":
        return (
          <Badge received>
            <CheckCircle size={12} /> Received
          </Badge>
        )
      case "Rejected":
        return (
          <Badge rejected>
            <X size={12} /> Rejected
          </Badge>
        )
      case "Outsource":
        return (
          <Badge outsource>
            <Activity size={12} /> Outsourced
          </Badge>
        )
      default:
        return (
          <Badge>
            <Clock size={12} /> {status}
          </Badge>
        )
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Card>
          <Header>
            <Title>
              <Activity size={24} />
              HMS Sample Status Update
            </Title>
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
                <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>From Date:</label>
                <DateButton onClick={() => setShowFromDatePicker(!showFromDatePicker)}>
                  <Calendar size={16} />
                  <DateDisplay>{format(fromDate, "yyyy-MM-dd")}</DateDisplay>
                </DateButton>
                {showFromDatePicker && (
                  <SimpleDatePicker
                    selectedDate={fromDate}
                    onChange={(date) => {
                      setFromDate(date)
                      setShowFromDatePicker(false)
                    }}
                    onClose={() => setShowFromDatePicker(false)}
                  />
                )}
              </DatePickerWrapper>

              {/* To Date Picker */}
              <DatePickerWrapper>
                <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>To Date:</label>
                <DateButton onClick={() => setShowToDatePicker(!showToDatePicker)}>
                  <Calendar size={16} />
                  <DateDisplay>{format(toDate, "yyyy-MM-dd")}</DateDisplay>
                </DateButton>
                {showToDatePicker && (
                  <SimpleDatePicker
                    selectedDate={toDate}
                    onChange={(date) => {
                      setToDate(date)
                      setShowToDatePicker(false)
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
              placeholder="Search by Barcode, Patient name, ID"
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
                        <Th>Gender</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((sample) => (
                        <Tr key={sample.barcode}>
                          <Td>{new Date(sample.date).toLocaleDateString("en-GB")}</Td>
                          <Td>{sample.patient_id || "N/A"}</Td>
                          <Td>{sample.patientname || "N/A"}</Td>
                          <Td>{sample.barcode}</Td>
                          <Td>{sample.age || "N/A"}</Td>
                          <Td>{sample.gender || "N/A"}</Td>
                          <Td>
                            <Button primary onClick={() => openModal(sample.barcode)}>
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
                    No samples found for the selected date range with status "Sample Collected".
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
                  <PatientInfoValue>{selectedPatient.patientname || "N/A"}</PatientInfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <Tag size={16} />
                  <PatientInfoLabel>ID:</PatientInfoLabel>
                  <PatientInfoValue>{selectedPatient.patient_id || "N/A"}</PatientInfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <Calendar size={16} />
                  <PatientInfoLabel>Date:</PatientInfoLabel>
                  <PatientInfoValue>{new Date(selectedPatient.date).toLocaleDateString("en-GB")}</PatientInfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <Tag size={16} />
                  <PatientInfoLabel>Barcode:</PatientInfoLabel>
                  <PatientInfoValue>{selectedPatient.barcode}</PatientInfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <User size={16} />
                  <PatientInfoLabel>Age:</PatientInfoLabel>
                  <PatientInfoValue>{selectedPatient.age || "N/A"}</PatientInfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <User size={16} />
                  <PatientInfoLabel>Gender:</PatientInfoLabel>
                  <PatientInfoValue>{selectedPatient.gender || "N/A"}</PatientInfoValue>
                </PatientInfoItem>
              </PatientInfoCard>

              <div style={{ padding: "0 1.5rem 1.5rem" }}>
                <TableContainer>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Test Name</Th>
                        <Th>Container Type</Th>
                        <Th>Department</Th>
                        <Th>Status</Th>
                        <Th>Reason for Rejection</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPatient.testdetails.map((detail, testIndex) => (
                        <Tr key={testIndex}>
                          <Td>{detail.testname}</Td>
                          <Td>{detail.collection_container}</Td>
                          <Td>{detail.department}</Td>
                          <Td>
                            <Select
                              value={statusChanges[selectedPatient.barcode]?.[testIndex] ?? detail.samplestatus}
                              onChange={(e) => handleStatusChange(selectedPatient.barcode, testIndex, e.target.value)}
                            >
                              <option value="">Select Status</option>
                              <option value="Received">Received</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Outsource">Outsource</option>
                            </Select>
                          </Td>
                          <Td>
                            {statusChanges[selectedPatient.barcode]?.[testIndex] === "Rejected" && (
                              <Textarea
                                value={remarks[`${selectedPatient.barcode}-${testIndex}`] || ""}
                                onChange={(e) =>
                                  handleRemarksChange(selectedPatient.barcode, testIndex, e.target.value)
                                }
                                placeholder="Enter rejection reason"
                              />
                            )}
                          </Td>
                          <Td>
                            <Button
                              success={!savedTests[`${selectedPatient.barcode}-${testIndex}`]}
                              secondary={savedTests[`${selectedPatient.barcode}-${testIndex}`]}
                              onClick={() => updateTestStatus(selectedPatient.barcode, testIndex)}
                              disabled={savedTests[`${selectedPatient.barcode}-${testIndex}`]}
                            >
                              {savedTests[`${selectedPatient.barcode}-${testIndex}`] ? (
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
              </div>
            </ModalContent>
          </Modal>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default HmsSampleStatusUpdate
