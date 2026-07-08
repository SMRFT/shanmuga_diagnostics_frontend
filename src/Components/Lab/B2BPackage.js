"use client"

import { useState, useEffect } from "react"
import styled, { createGlobalStyle } from "styled-components"
import { Search, Package, User, TestTube, X, Check, AlertCircle } from 'lucide-react'
import apiRequest from "../Auth/apiRequest"

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
`

// Container for the main content
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
`

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
`

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
`

const CardBody = styled.div`
  padding: 1.5rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FormSection = styled.div`
  padding: 1.5rem;
  background-color: var(--light);
  border-radius: var(--border-radius);
  border: 1px solid var(--gray-light);
`

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary-dark);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const Label = styled.label`
  font-size: 0.875rem;
  color: var(--gray);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  ${(props) =>
        props.required &&
        `
    &::after {
      content: '*';
      color: var(--danger);
    }
  `}
`

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
  
  ${(props) =>
        props.hasIcon &&
        `
    padding-left: 2.5rem;
  `}
`

const InputWrapper = styled.div`
  position: relative;
`

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
  display: flex;
  align-items: center;
  justify-content: center;
`

const SearchContainer = styled.div`
  position: relative;
`

const SearchInput = styled(Input)`
  padding-left: 2.5rem;
`

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--gray-light);
  border-top: none;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: var(--box-shadow);
`

const SearchItem = styled.div`
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid var(--gray-light);
  transition: var(--transition);
  
  &:hover {
    background-color: var(--light);
  }
  
  &:last-child {
    border-bottom: none;
  }
`

const MultiSelectContainer = styled.div`
  position: relative;
`

const MultiSelectHeader = styled.div`
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  background-color: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--transition);
  min-height: 48px;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`

const SelectedItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex: 1;
`

const SelectedItem = styled.span`
  background-color: var(--primary-light);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    color: var(--danger);
  }
`

const DropdownArrow = styled.div`
  color: var(--gray);
  font-size: 0.75rem;
  transition: transform 0.2s;
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`

const MultiSelectDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--gray-light);
  border-top: none;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: var(--box-shadow);
`

const MultiSelectSearch = styled(Input)`
  margin: 0.5rem;
  width: calc(100% - 1rem);
`

const MultiSelectOption = styled.div`
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--light);
  }
`

const TestNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const TestName = styled.span`
  font-weight: 500;
  color: var(--dark);
`

const TestShortcut = styled.span`
  font-size: 0.75rem;
  color: var(--gray);
  font-style: italic;
`

const Checkbox = styled.input`
  margin: 0;
  cursor: pointer;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${(props) => (props.primary ? "var(--primary)" : "white")};
  color: ${(props) => (props.primary ? "white" : "var(--gray)")};
  border: 1px solid ${(props) => (props.primary ? "var(--primary)" : "var(--gray-light)")};
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: var(--transition);
  opacity: ${(props) => (props.disabled ? "0.7" : "1")};
  
  &:hover {
    background-color: ${(props) => (props.primary ? "var(--primary-dark)" : "var(--gray-light)")};
  }
`

const LoadingSpinner = styled.div`
  border: 2px solid var(--gray-light);
  border-top: 2px solid var(--primary);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

// Toast Component
const Toast = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--success);
  color: white;
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1000;
  animation: slideIn 0.3s ease, fadeOut 0.5s ease 3.5s forwards;
  
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`

const DisplayContainer = styled(Card)`
  margin-top: 2rem;
`

const DisplayTitle = styled.h2`
  color: var(--primary-dark);
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
`

const DisplayItem = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: var(--light);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary);
`

const DisplayLabel = styled.span`
  font-weight: 600;
  color: var(--primary-dark);
  margin-right: 0.5rem;
`

const DisplayValue = styled.span`
  color: var(--dark);
`

const SearchHelp = styled.div`
  font-size: 0.75rem;
  color: var(--gray);
  margin-top: 0.25rem;
  font-style: italic;
`

// New styled components for test table with rates
const TestTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
`

const TestTableHeader = styled.thead`
  background-color: var(--primary);
  color: white;
  
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.875rem;
  }
`

const TestTableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--gray-light);
    transition: var(--transition);
    
    &:hover {
      background-color: var(--light);
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  td {
    padding: 1rem;
    font-size: 0.875rem;
    color: var(--dark);
  }
`

const TotalRow = styled.tr`
  background-color: var(--primary-light);
  color: white;
  font-weight: 600;
  
  td {
    padding: 1rem;
    font-size: 1rem;
  }
`

const B2BPackage = () => {
    // State management
    const [formData, setFormData] = useState({
        packageName: "",
        referrerCode: "",
        clinicalnameDisplay: "",
        rate: "",
        testNames: [],
        status: "pending",
    })

    const [clinicalnames, setclinicalnames] = useState([])
    const [testDetails, setTestDetails] = useState([])
    const [selectedTestsWithRates, setSelectedTestsWithRates] = useState([])
    const [showDisplay, setShowDisplay] = useState(false)
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null)

    // Search states
    const [clinicalSearch, setClinicalSearch] = useState("")
    const [showClinicalResults, setShowClinicalResults] = useState(false)
    const [testDropdownOpen, setTestDropdownOpen] = useState(false)
    const [testSearch, setTestSearch] = useState("")

    const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

    // Show toast message
    const showToast = (message, type = "success") => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 4000)
    }

    // Fetch clinical names from API
    useEffect(() => {
        const fetchclinicalnames = async () => {
            try {
                const response = await apiRequest(`${Labbaseurl}clinical_name/`, "GET")
                if (response.success) {
                    setclinicalnames(Array.isArray(response.data) ? response.data : (response.data?.data || []))
                } else {
                    showToast(response.error || "Failed to fetch clinical names", "error")
                }
            } catch (error) {
                showToast("Error fetching clinical names: " + error.message, "error")
            }
        }

        if (Labbaseurl) {
            fetchclinicalnames()
        }
    }, [Labbaseurl])

    // Fetch test details from API
    useEffect(() => {
        const fetchTestDetails = async () => {
            try {
                const response = await apiRequest(`${Labbaseurl}testdetails/`, "GET")
                if (response.success) {
                    setTestDetails(Array.isArray(response.data) ? response.data : (response.data?.data || []))
                } else {
                    showToast(response.error || "Failed to fetch test details", "error")
                }
            } catch (error) {
                showToast("Error fetching test details: " + error.message, "error")
            }
        }

        if (Labbaseurl) {
            fetchTestDetails()
        }
    }, [Labbaseurl])

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Handle clinical search
    const handleClinicalSearch = (e) => {
        const value = e.target.value
        setClinicalSearch(value)
        setShowClinicalResults(value.length > 0)
    }

    // Filter clinical names based on search
    const filteredclinicalnames = clinicalnames.filter((clinical) =>
        clinical.clinicalname?.toLowerCase().includes(clinicalSearch.toLowerCase()),
    )

    // Select clinical name
    const selectclinicalname = (clinical) => {
        setFormData((prev) => ({
            ...prev,
            referrerCode: clinical.referrerCode,
            clinicalnameDisplay: clinical.clinicalname,
        }))
        setClinicalSearch(clinical.clinicalname)
        setShowClinicalResults(false)
    }

    // Handle test selection with rates
    const handleTestSelection = (testId) => {
        const test = testDetails.find((t) => (t._id && t._id.$oid === testId) || t.id === testId || t.test_name === testId)

        if (!test) return

        const isAlreadySelected = selectedTestsWithRates.some((selectedTest) => selectedTest.testId === testId)

        if (isAlreadySelected) {
            // Remove test
            setSelectedTestsWithRates((prev) => prev.filter((selectedTest) => selectedTest.testId !== testId))
            setFormData((prev) => ({
                ...prev,
                testNames: prev.testNames.filter((id) => id !== testId),
            }))
        } else {
            // Add test with rates
            const newTestWithRates = {
                testId: testId,
                testName: test.test_name,
                mrp: Number.parseFloat(test.MRP || 0),
                l2lRate: Number.parseFloat(test.L2L_Rate_Card || 0),
            }

            setSelectedTestsWithRates((prev) => [...prev, newTestWithRates])
            setFormData((prev) => ({
                ...prev,
                testNames: [...prev.testNames, { test_id: test.test_id || test.id || testId }], // Store test IDs in object
            }))
        }
    }

    // Remove selected test
    const removeSelectedTest = (testId) => {
        const testToRemove = selectedTestsWithRates.find((test) => test.testId === testId)
        setSelectedTestsWithRates((prev) => prev.filter((test) => test.testId !== testId))
        setFormData((prev) => ({
            ...prev,
            testNames: prev.testNames.filter((item) => item.test_id !== (testToRemove?.test_id || testId)),
        }))
    }

    // Enhanced filter for test details - searches in both test_name and shortcut
    const filteredTestDetails = testDetails.filter((test) => {
        const searchTerm = testSearch.toLowerCase()
        const testName = (test.test_name || "").toLowerCase()
        const shortcut = (test.shortcut || "").toLowerCase()

        return testName.includes(searchTerm) || shortcut.includes(searchTerm)
    })

    // Get test name display text
    const getTestNameDisplay = (testId) => {
        const test = testDetails.find((t) => (t._id && t._id.$oid === testId) || t.id === testId || t.test_name === testId)
        return test ? test.test_name || test.name || testId : testId
    }

    // Get selected test names for display
    const getSelectedTestNames = () => {
        return selectedTestsWithRates.map(t => t.testName)
    }

    // Calculate totals
    const calculateTotals = () => {
        const mrpTotal = selectedTestsWithRates.reduce((sum, test) => sum + test.mrp, 0)
        const l2lTotal = selectedTestsWithRates.reduce((sum, test) => sum + test.l2lRate, 0)

        return { mrpTotal, l2lTotal }
    }

    // Validate form data
    const validateForm = () => {
        const { packageName, referrerCode, rate, testNames } = formData

        if (!packageName.trim()) {
            showToast("Package name is required", "error")
            return false
        }

        if (!referrerCode) {
            showToast("Clinical name is required", "error")
            return false
        }

        if (!rate || isNaN(rate) || parseFloat(rate) <= 0) {
            showToast("Valid rate is required", "error")
            return false
        }

        if (!testNames || testNames.length === 0) {
            showToast("At least one test name is required", "error")
            return false
        }

        return true
    }

    // Handle display button click
    const handleDisplay = (e) => {
        e.preventDefault() // Prevent form submission
        if (validateForm()) {
            setShowDisplay(true)
        }
    }

    // Handle save button click
    const handleSave = async () => {
        if (!validateForm()) return

        setLoading(true)

        const { mrpTotal, l2lTotal } = calculateTotals()

        try {
            const payload = {
                packageName: formData.packageName,
                referrerCode: formData.referrerCode,
                mrptotal: mrpTotal.toString(), // Convert to string as per model
                l2ltotal: l2lTotal.toString(), // Convert to string as per model
                rate: formData.rate,
                testNames: formData.testNames, // Array of test names
                status: formData.status,
            }

            const response = await apiRequest(`${Labbaseurl}b2b_packages/`, "POST", payload)

            if (response.success) {
                showToast("Package saved successfully!", "success")
                // Reset form after successful save
                setFormData({
                    packageName: "",
                    referrerCode: "",
                    clinicalnameDisplay: "",
                    rate: "",
                    testNames: [],
                    status: "pending",
                })
                setSelectedTestsWithRates([])
                setClinicalSearch("")
                setTestSearch("")
                setShowDisplay(false)
            } else {
                showToast(response.error || "Failed to save package", "error")
            }
        } catch (error) {
            showToast("Error saving package: " + error.message, "error")
        } finally {
            setLoading(false)
        }
    }

    const { mrpTotal, l2lTotal } = calculateTotals()

    return (
        <>
            <GlobalStyle />
            <Container>
                {toast && (
                    <Toast type={toast.type}>
                        {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
                        {toast.message}
                    </Toast>
                )}
                <Card>
                    <CardHeader>
                        <Title>
                            <Package size={24} />
                            B2B Package Management
                        </Title>
                    </CardHeader>

                    <CardBody>
                        <Form>
                            <FormSection>
                                <SectionTitle>
                                    <Package size={16} />
                                    Package Information
                                </SectionTitle>
                                <FormRow>
                                    <FormGroup>
                                        <Label required>Package Name</Label>
                                        <InputWrapper>
                                            <InputIcon>
                                                <Package size={16} />
                                            </InputIcon>
                                            <Input
                                                type="text"
                                                name="packageName"
                                                value={formData.packageName}
                                                onChange={handleInputChange}
                                                placeholder="Enter package name"
                                                hasIcon
                                            />
                                        </InputWrapper>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label required>Clinical Name</Label>
                                        <SearchContainer>
                                            <InputWrapper>
                                                <InputIcon>
                                                    <Search size={16} />
                                                </InputIcon>
                                                <SearchInput
                                                    type="text"
                                                    value={clinicalSearch}
                                                    onChange={handleClinicalSearch}
                                                    placeholder="Search clinical name"
                                                    onFocus={() => setShowClinicalResults(clinicalSearch.length > 0)}
                                                />
                                            </InputWrapper>
                                            {showClinicalResults && (
                                                <SearchResults>
                                                    {filteredclinicalnames.map((clinical, index) => (
                                                        <SearchItem
                                                            key={clinical._id?.$oid || clinical.id || index}
                                                            onClick={() => selectclinicalname(clinical)}
                                                        >
                                                            {clinical.clinicalname}
                                                        </SearchItem>
                                                    ))}
                                                </SearchResults>
                                            )}
                                        </SearchContainer>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label required>Rate</Label>
                                        <InputWrapper>
                                            <InputIcon>
                                                <Package size={16} />
                                            </InputIcon>
                                            <Input
                                                type="number"
                                                name="rate"
                                                value={formData.rate}
                                                onChange={handleInputChange}
                                                placeholder="Enter rate"
                                                min="0"
                                                step="0.01"
                                                hasIcon
                                            />
                                        </InputWrapper>
                                    </FormGroup>
                                </FormRow>
                            </FormSection>

                            <FormSection>
                                <SectionTitle>
                                    <TestTube size={16} />
                                    Test Selection
                                </SectionTitle>
                                <FormGroup>
                                    <Label required>Test Names</Label>
                                    <SearchHelp>
                                        Search by test name or shortcut (e.g., "ACID" for "ACID PHOSPHATASE - PROSTATIC FRACTION")
                                    </SearchHelp>
                                    <MultiSelectContainer>
                                        <MultiSelectHeader onClick={() => setTestDropdownOpen(!testDropdownOpen)} tabIndex={0}>
                                            <SelectedItems>
                                                {selectedTestsWithRates.length === 0 ? (
                                                    <span style={{ color: "var(--gray)" }}>Select test names</span>
                                                ) : (
                                                    selectedTestsWithRates.map((test, index) => (
                                                        <SelectedItem key={test.testId || index}>
                                                            {test.testName}
                                                            <RemoveButton
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    removeSelectedTest(test.testId)
                                                                }}
                                                                type="button"
                                                            >
                                                                <X size={12} />
                                                            </RemoveButton>
                                                        </SelectedItem>
                                                    ))
                                                )}
                                            </SelectedItems>
                                            <DropdownArrow isOpen={testDropdownOpen}>▼</DropdownArrow>
                                        </MultiSelectHeader>

                                        {testDropdownOpen && (
                                            <MultiSelectDropdown>
                                                <MultiSelectSearch
                                                    type="text"
                                                    value={testSearch}
                                                    onChange={(e) => setTestSearch(e.target.value)}
                                                    placeholder="Search by test name or shortcut..."
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                {filteredTestDetails.map((test, index) => {
                                                    const testId = test._id?.$oid || test.id || test.test_name
                                                    const testName = test.test_name || "Unnamed Test"
                                                    const shortcut = test.shortcut || ""
                                                    const isSelected = selectedTestsWithRates.some(selectedTest => selectedTest.testId === testId)

                                                    return (
                                                        <MultiSelectOption key={testId || index} onClick={() => handleTestSelection(testId)}>
                                                            <Checkbox
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => { }} // Handled by parent onClick
                                                            />
                                                            <TestNameContainer>
                                                                <TestName>{testName}</TestName>
                                                                {shortcut && <TestShortcut>Shortcut: {shortcut}</TestShortcut>}
                                                            </TestNameContainer>
                                                        </MultiSelectOption>
                                                    )
                                                })}
                                                {filteredTestDetails.length === 0 && testSearch && (
                                                    <MultiSelectOption>
                                                        <span style={{ color: "var(--gray)", fontStyle: "italic" }}>
                                                            No tests found matching "{testSearch}"
                                                        </span>
                                                    </MultiSelectOption>
                                                )}
                                            </MultiSelectDropdown>
                                        )}
                                    </MultiSelectContainer>
                                </FormGroup>

                                {/* Test Table with Rates */}
                                {selectedTestsWithRates.length > 0 && (
                                    <TestTable>
                                        <TestTableHeader>
                                            <tr>
                                                <th>Test Name</th>
                                                <th>MRP (₹)</th>
                                                <th>L2L Rate (₹)</th>
                                            </tr>
                                        </TestTableHeader>
                                        <TestTableBody>
                                            {selectedTestsWithRates.map((test) => (
                                                <tr key={test.testId}>
                                                    <td>{test.testName}</td>
                                                    <td>{test.mrp.toFixed(2)}</td>
                                                    <td>{test.l2lRate.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            <TotalRow>
                                                <td>
                                                    <strong>Total</strong>
                                                </td>
                                                <td>
                                                    <strong>₹{mrpTotal.toFixed(2)}</strong>
                                                </td>
                                                <td>
                                                    <strong>₹{l2lTotal.toFixed(2)}</strong>
                                                </td>
                                            </TotalRow>
                                        </TestTableBody>
                                    </TestTable>
                                )}
                            </FormSection>

                            <ButtonContainer>
                                <Button primary type="button" onClick={handleDisplay}>
                                    <User size={16} />
                                    Display
                                </Button>
                                <Button type="button" onClick={handleSave} disabled={loading}>
                                    {loading ? <LoadingSpinner /> : <Check size={16} />}
                                    Save
                                </Button>
                            </ButtonContainer>
                        </Form>
                    </CardBody>
                </Card>

                {showDisplay && (
                    <DisplayContainer>
                        <CardHeader>
                            <DisplayTitle>Package Details</DisplayTitle>
                        </CardHeader>
                        <CardBody>
                            <DisplayItem>
                                <DisplayLabel>Package Name:</DisplayLabel>
                                <DisplayValue>{formData.packageName}</DisplayValue>
                            </DisplayItem>
                            <DisplayItem>
                                <DisplayLabel>Clinical Name:</DisplayLabel>
                                <DisplayValue>{formData.clinicalname}</DisplayValue>
                            </DisplayItem>
                            <DisplayItem>
                                <DisplayLabel>Rate:</DisplayLabel>
                                <DisplayValue>₹{formData.rate}</DisplayValue>
                            </DisplayItem>
                            <DisplayItem>
                                <DisplayLabel>MRP Total:</DisplayLabel>
                                <DisplayValue>₹{mrpTotal.toFixed(2)}</DisplayValue>
                            </DisplayItem>
                            <DisplayItem>
                                <DisplayLabel>L2L Total:</DisplayLabel>
                                <DisplayValue>₹{l2lTotal.toFixed(2)}</DisplayValue>
                            </DisplayItem>
                            <DisplayItem>
                                <DisplayLabel>Test Names:</DisplayLabel>
                                <DisplayValue>{getSelectedTestNames().join(", ")}</DisplayValue>
                            </DisplayItem>
                        </CardBody>
                    </DisplayContainer>
                )}
            </Container>
        </>
    )
}

export default B2BPackage