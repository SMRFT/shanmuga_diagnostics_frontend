"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import styled, { createGlobalStyle, ThemeProvider } from "styled-components"
import { Calendar, Search, Check, X, AlertCircle, CheckCircle } from "lucide-react"
import apiRequest from "../Auth/apiRequest"

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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const Card = styled.div`
  background: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.lg};
  padding: 2rem;
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
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
`

const DateDisplay = styled.span`
  font-size: 0.875rem;
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
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${(props) => props.theme.shadows.sm};
`

const Th = styled.th`
  background: ${(props) => props.theme.colors.backgroundAlt};
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.text};
`

const Tr = styled.tr`
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
  transition: all 0.2s ease-in-out;
  
  ${(props) =>
    props.primary &&
    `
    background: ${props.theme.colors.primary};
    color: white;
    &:hover {
      background: ${props.theme.colors.primaryHover};
    }
  `}
  
  ${(props) =>
    props.success &&
    `
    background: ${props.theme.colors.success};
    color: white;
    &:hover {
      background: #059669;
    }
  `}
  
  ${(props) =>
    props.secondary &&
    `
    background: ${props.theme.colors.secondary};
    color: white;
    &:hover {
      background: ${props.theme.colors.secondaryHover};
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  box-shadow: ${(props) => props.theme.shadows.lg};
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.textLight};
  padding: 0.25rem;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  
  &:hover {
    background: ${(props) => props.theme.colors.backgroundAlt};
  }
`

const Select = styled.select`
  padding: 0.375rem 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.875rem;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 1rem;
  height: 1rem;
  accent-color: ${(props) => props.theme.colors.primary};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  padding: 3rem 1rem;
  color: ${(props) => props.theme.colors.textLight};
`

const EmptyStateText = styled.p`
  font-size: 1rem;
  margin-top: 0.5rem;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-top: 1px solid ${(props) => props.theme.colors.border};
`

// Calendar components
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

const HmsSampleStatus = () => {
  const storedName = localStorage.getItem("name")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const [showFromDatePicker, setShowFromDatePicker] = useState(false)
  const [showToDatePicker, setShowToDatePicker] = useState(false)
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBarcode, setSelectedBarcode] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPatientTests, setCurrentPatientTests] = useState([])
  const [selectedTests, setSelectedTests] = useState([])
  const [loadingTestDetails, setLoadingTestDetails] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  useEffect(() => {
    const fetchPatientsByDate = async () => {
      setLoading(true)
      try {
        const localFromDate = new Date(fromDate)
        localFromDate.setMinutes(localFromDate.getMinutes() - localFromDate.getTimezoneOffset())
        const formattedFromDate = localFromDate.toISOString().split("T")[0]

        const localToDate = new Date(toDate)
        localToDate.setMinutes(localToDate.getMinutes() - localToDate.getTimezoneOffset())
        const formattedToDate = localToDate.toISOString().split("T")[0]

        const result = await apiRequest(
          `${Labbaseurl}hms_sample_patient/?from_date=${formattedFromDate}&to_date=${formattedToDate}`,
          "GET",
        )

        if (result.success) {
          const patientsData = typeof result.data === "string" ? JSON.parse(result.data) : result.data
          setPatients(patientsData.data || [])
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPatientsByDate()
  }, [fromDate, toDate])

  // Updated function to fetch test details and merge with existing data
  const fetchTestDetailsByIds = async (testIds) => {
    setLoadingTestDetails(true)
    try {
      const testDetailsPromises = testIds.map((testId) =>
        apiRequest(`${Labbaseurl}hms_testdetails/?test_id=${testId}`, "GET"),
      )

      const results = await Promise.all(testDetailsPromises)
      const allTestDetails = []

      results.forEach((result) => {
        if (result.success) {
          const data = result.data.data || result.data
          if (Array.isArray(data)) {
            allTestDetails.push(...data)
          } else if (data) {
            allTestDetails.push(data)
          }
        }
      })

      return allTestDetails
    } catch (err) {
      console.error("Error fetching test details:", err)
      return []
    } finally {
      setLoadingTestDetails(false)
    }
  }

  const fetchSampleStatus = async (barcode) => {
    setLoadingTestDetails(true)
    try {
      const patient = patients.find((p) => p.barcode === barcode)

      if (!patient || !patient.testdetails) {
        setError("No test details found for the selected barcode")
        return
      }

      // Get test_ids from patient's testdetails
      const testIds = patient.testdetails.map((test) => test.test_id)

      // Fetch detailed test information
      const detailedTestInfo = await fetchTestDetailsByIds(testIds)

      // Check if sample status exists in MongoDB
      const result = await apiRequest(`${Labbaseurl}hms_check_sample_status/${barcode}/`, "GET")

      if (result.success && result.data.exists) {
        try {
          const response = await apiRequest(`${Labbaseurl}hms_sample_status_data/${barcode}/`, "GET")

          if (response.success && response.data && response.data.testdetails) {
            let testdetails = response.data.testdetails
            if (typeof testdetails === "string") {
              testdetails = JSON.parse(testdetails)
            }

            // Filter for Pending tests only and merge with detailed info
            const pendingTests = testdetails
              .filter((test) => test.samplestatus === "Pending")
              .map((test) => {
                const detailedInfo = detailedTestInfo.find((detail) => detail.test_id === test.test_id)
                return {
                  ...test,
                  status: test.samplestatus || "Pending",
                  department: detailedInfo?.department || test.department || "N/A",
                  collection_container: detailedInfo?.container || test.container || "N/A",
                }
              })

            if (pendingTests.length > 0) {
              setCurrentPatientTests(pendingTests)
            } else {
              // If no pending tests from MongoDB, show all tests from original data with detailed info
              const allTests = patient.testdetails.map((test) => {
                const detailedInfo = detailedTestInfo.find((detail) => detail.test_id === test.test_id)
                return {
                  ...test,
                  status: "Pending",
                  samplestatus: "Pending",
                  department: detailedInfo?.department || test.department || "N/A",
                  collection_container: detailedInfo?.container || test.container || "N/A",
                }
              })
              setCurrentPatientTests(allTests)
            }
          } else {
            throw new Error("Invalid response from hms_sample_status_data")
          }
        } catch (statusError) {
          console.log("Error fetching hms_sample_status_data, using original patient data:", statusError)
          // Fallback to original patient data with detailed info
          const allTests = patient.testdetails.map((test) => {
            const detailedInfo = detailedTestInfo.find((detail) => detail.test_id === test.test_id)
            return {
              ...test,
              status: "Pending",
              samplestatus: "Pending",
              department: detailedInfo?.department || test.department || "N/A",
              collection_container: detailedInfo?.container || test.container || "N/A",
              samplecollector: "N/A",
            }
          })
          setCurrentPatientTests(allTests)
        }
      } else {
        // No sample status exists - use original patient data with detailed info
        const allTests = patient.testdetails.map((test) => {
          const detailedInfo = detailedTestInfo.find((detail) => detail.test_id === test.test_id)
          return {
            ...test,
            status: "Pending",
            samplestatus: "Pending",
            department: detailedInfo?.department || test.department || "N/A",
            collection_container: detailedInfo?.container || test.container || "N/A",
            samplecollector: "N/A",
          }
        })
        setCurrentPatientTests(allTests)
      }
    } catch (err) {
      console.error("Error in fetchSampleStatus:", err)
      setError("Error fetching sample status: " + err.message)
    } finally {
      setLoadingTestDetails(false)
    }
  }

  const handleStatusChange = (testId, status) => {
    setCurrentPatientTests((prevTests) =>
      prevTests.map((test) => (test.test_id === testId ? { ...test, status } : test)),
    )
  }

  const toggleSelectTest = (testId) => {
    const isCurrentlySelected = selectedTests.includes(testId)
    if (isCurrentlySelected) {
      setSelectedTests((prevSelected) => prevSelected.filter((id) => id !== testId))
      handleStatusChange(testId, "Pending")
    } else {
      setSelectedTests((prevSelected) => [...prevSelected, testId])
      handleStatusChange(testId, "Sample Collected")
    }
  }

  const selectAllTests = () => {
    const allTestIds = currentPatientTests.map((test) => test.test_id)
    const allSelected = allTestIds.every((id) => selectedTests.includes(id))

    if (allSelected) {
      setSelectedTests([])
      setCurrentPatientTests((prevTests) => prevTests.map((test) => ({ ...test, status: "Pending" })))
    } else {
      setSelectedTests(allTestIds)
      setCurrentPatientTests((prevTests) => prevTests.map((test) => ({ ...test, status: "Sample Collected" })))
    }
  }

  const saveAllTestsForPatient = async () => {
    if (currentPatientTests.length === 0) {
      setError("No tests available to save")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const patient = patients.find((p) => p.barcode === selectedBarcode)
      if (!patient) {
        setError("Patient not found")
        return
      }

      // Check if sample status already exists
      const checkResult = await apiRequest(`${Labbaseurl}hms_check_sample_status/${selectedBarcode}/`, "GET")

      if (checkResult.success && checkResult.data.exists) {
        // Update existing sample status
        const testsToUpdate = currentPatientTests.map((test) => ({
          test_id: test.test_id,
          testname: test.testname,
          samplestatus: test.status,
          collectd_by: test.status === "Sample Collected" ? storedName : null,
        }))

        const updateResult = await apiRequest(`${Labbaseurl}hms_patch_sample_status/${selectedBarcode}/`, "PATCH", {
          testdetails: testsToUpdate,
        })

        if (updateResult.success) {
          setSuccessMessage("Sample status updated successfully!")
          setIsSaved(true)
        } else {
          setError(updateResult.error || "Failed to update sample status")
        }
      } else {
        // Create new sample status
        const testsToSave = currentPatientTests.map((test) => ({
          test_id: test.test_id,
          testname: test.testname,
          collection_container: test.container || test.collection_container,
          department: test.department,
          samplestatus: test.status,
          collectd_by: test.status === "Sample Collected" ? storedName : null,
        }))

        const saveResult = await apiRequest(`${Labbaseurl}hms_sample_status/`, "POST", {
          barcode: selectedBarcode,
          date: patient.date,
          testdetails: testsToSave,
        })

        if (saveResult.success) {
          setSuccessMessage("Sample status saved successfully!")
          setIsSaved(true)
        } else {
          setError(saveResult.error || "Failed to save sample status")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred: " + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const openModal = async (barcode) => {
    setSelectedBarcode(barcode)
    setShowModal(true)
    setError(null)
    setSuccessMessage(null)
    setSelectedTests([])
    setCurrentPatientTests([])
    setIsSaving(false)
    setIsSaved(false)

    await fetchSampleStatus(barcode)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedBarcode(null)
    setError(null)
    setSuccessMessage(null)
    setSelectedTests([])
    setCurrentPatientTests([])
    setIsSaving(false)
    setIsSaved(false)
  }

  const filteredPatients = (patients || []).filter(
    (patient) =>
      patient.patientname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patient_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.barcode?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Card>
          <Header>
            <Title>HMS Patient Sample Status</Title>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
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
                        <Th>Gender</Th>
                        <Th>Tests</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient) => (
                        <Tr key={patient.barcode}>
                          <Td>{patient.patient_id || "N/A"}</Td>
                          <Td>{patient.patientname || "N/A"}</Td>
                          <Td>{patient.barcode}</Td>
                          <Td>{patient.age || "N/A"}</Td>
                          <Td>{patient.gender || "N/A"}</Td>
                          <Td>
                            {patient.testdetails && patient.testdetails.length > 0
                              ? patient.testdetails.map((test) => test.testname).join(", ") || "No tests"
                              : "No tests"}
                          </Td>
                          <Td>
                            <Button primary onClick={() => openModal(patient.barcode)}>
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
                  <EmptyStateText>No patients with pending tests found for the selected date.</EmptyStateText>
                </EmptyState>
              )}
            </>
          )}
        </Card>

        {showModal && selectedBarcode && (
          <Modal>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>
                  {(patients || []).find((p) => p.barcode === selectedBarcode)?.patientname} - Test Details
                </ModalTitle>
                <CloseButton onClick={closeModal}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              <div style={{ padding: "1.5rem" }}>
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
                  .filter((patient) => patient.barcode === selectedBarcode)
                  .map((patient) => (
                    <div key={patient.barcode}>
                      <div style={{ marginBottom: "1rem" }}>
                        <strong>Patient ID:</strong> {patient.patient_id || "N/A"} | <strong>Barcode:</strong>{" "}
                        {patient.barcode} | <strong>Age:</strong> {patient.age || "N/A"} | <strong>Gender:</strong>{" "}
                        {patient.gender || "N/A"}
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
                                      currentPatientTests.every((test) => selectedTests.includes(test.test_id))
                                    }
                                    onChange={selectAllTests}
                                    disabled={isSaving || isSaved}
                                  />
                                </Th>

                              </tr>
                            </thead>
                            <tbody>
                              {currentPatientTests.map((test) => (
                                <Tr key={test.test_id}>
                                  <Td>{test.testname}</Td>
                                  <Td>{test.container || test.collection_container || "N/A"}</Td>
                                  <Td>{test.department || "N/A"}</Td>
                                  <Td>
                                    <Select
                                      value={test.status || "Pending"}
                                      onChange={(e) => handleStatusChange(test.test_id, e.target.value)}
                                      disabled={isSaving || isSaved}
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Sample Collected">Collected</option>
                                    </Select>
                                  </Td>
                                  <Td>
                                    <Checkbox
                                      checked={selectedTests.includes(test.test_id)}
                                      onChange={() => toggleSelectTest(test.test_id)}
                                      disabled={isSaving || isSaved}
                                    />
                                  </Td>
                                </Tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              <ButtonGroup>
                <Button success onClick={saveAllTestsForPatient} disabled={loadingTestDetails || isSaving || isSaved}>
                  <Check size={16} />
                  {isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}
                </Button>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default HmsSampleStatus
