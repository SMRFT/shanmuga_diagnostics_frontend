"use client"

import { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import apiRequest from "../Auth/apiRequest"

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

const Fieldset = styled.fieldset`
  border: 2px dashed #f093fb;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  background: rgba(255, 255, 255, 0.3);
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  
  legend {
    font-size: 1.3rem;
    font-weight: bold;
    color: #764ba2;
    padding: 0 15px;
    background: linear-gradient(135deg, #f093fb, #667eea);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
  
  h4 {
    text-align: center;
    color: #764ba2;
    margin-bottom: 20px;
    font-weight: bold;
    font-size: 1.2rem;
    
    @media (max-width: 768px) {
      font-size: 1rem;
      margin-bottom: 15px;
    }
  }
  
  @media (max-width: 768px) {
    padding: 15px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`

// Enhanced animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`

const MainCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: ${fadeIn} 0.8s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.2);
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: -0.025em;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const Section = styled.div`
  background: transparent;
  border-radius: 16px;
  padding: 0;
  border: none;
  transition: all 0.3s ease;
`

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #334155;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: ${(props) => props.mb || "0"};
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  text-transform: uppercase;
`

const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #cbd5e1;
  }

  &::placeholder {
    color: #9ca3af;
    font-style: italic;
  }
`

const Select = styled.select`
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #cbd5e1;
  }
`

// Enhanced Search Container with shortcut support
const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`

const SearchInput = styled(Input)`
  padding-left: 2.5rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 0.75rem center;
  background-size: 1.25rem;

  &.shortcut-mode {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
    background-color: #f0fdf4;
  }
`

const ShortcutIndicator = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  animation: ${pulse} 2s infinite;
  pointer-events: none;
`

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  animation: ${slideDown} 0.2s ease-out;
  margin-top: 0.5rem;
`

const DropdownItem = styled.li`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.95rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: translateX(4px);
  }

  &:last-child {
    border-bottom: none;
    border-radius: 0 0 12px 12px;
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &.shortcut-match {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    font-weight: 600;
  }
`

const ShortcutTag = styled.span`
  background: rgba(0, 0, 0, 0.1);
  color: currentColor;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
`

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-collapse: collapse;
`

const TableHead = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`

const TableHeader = styled.th`
  padding: 1.25rem 1rem;
  text-align: left;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const TableBody = styled.tbody`
  tr {
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(102, 126, 234, 0.05);
      transform: scale(1.01);
    }

    &:nth-child(even) {
      background: rgba(248, 250, 252, 0.5);
    }
  }
`

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.95rem;
`

const Button = styled.button`
  padding: ${(props) => (props.size === "sm" ? "0.5rem 1rem" : "1rem 2rem")};
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: ${(props) => (props.size === "sm" ? "0.875rem" : "1.1rem")};
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  position: relative;
  overflow: hidden;
  font-family: inherit;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  ${(props) =>
    props.variant === "danger" &&
    `
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px -8px #ef4444;
    }
  `}

  ${(props) =>
    props.variant === "success" &&
    `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px -8px #10b981;
    }
  `}

  ${(props) =>
    props.variant === "primary" &&
    `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px -8px #667eea;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`

const TotalCard = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 16px;
  text-align: center;
  margin: 1.5rem 0;
  box-shadow: 0 8px 25px -8px rgba(30, 41, 59, 0.5);
`

const TotalAmount = styled.div`
  font-size: 2rem;
  font-weight: 800;
  margin-top: 0.5rem;
  color: #fbbf24;
`

const Divider = styled.hr`
  border: none;
  height: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 2rem 0;
  border-radius: 2px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-style: italic;
  
  &::before {
    content: '📋';
    display: block;
    font-size: 3rem;
    margin-bottom: 1rem;
  }
`

const ShortcutHelp = styled.div`
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #1e40af;
  
  strong {
    color: #1d4ed8;
  }
`

const HmsBilling = () => {
  function getLocalDateTime() {
    const now = new Date()
    const offset = now.getTimezoneOffset()
    const local = new Date(now.getTime() - offset * 60 * 1000)
    return local.toISOString().slice(0, 16)
  }

const [formData, setFormData] = useState({
  patient_id: "",
  ipnumber: "",
  salutation: "",   // added field
  patientname: "",
  age: "",
  age_type: "years",
  gender: "",
  phone: "",
  location_id: "hms",
  billnumber: "",
  ref_doctor: "",   // you can drop this if not needed anymore
  date: getLocalDateTime(),
});
  const [tests, setTests] = useState([])
  const [searchTest, setSearchTest] = useState("")
  const [filteredTests, setFilteredTests] = useState([])
  const [testDetails, setTestDetails] = useState([])
  const [doctors, setDoctors] = useState([])
  const [searchDoctor, setSearchDoctor] = useState("")
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [isShortcutMode, setIsShortcutMode] = useState(false)

  useEffect(() => {
    const fetchTests = async () => {
      const result = await apiRequest(`${Labbaseurl}hms_testdetails/`, "GET")

      if (result.success) {
        setTests(result.data.data || [])
      } else {
        console.error("Error fetching test details:", result.error)
        toast.error("Failed to load test details")
      }
    }
    fetchTests()
  }, [])

  useEffect(() => {
    const fetchDoctors = async () => {
      const result = await apiRequest(`${Labbaseurl}hms_list_doctor/`, "GET")

      if (result.success) {
        setDoctors(result.data || [])
      } else {
        console.error("Error fetching doctors:", result.error)
        toast.error("Failed to load doctor list")
      }
    }

    fetchDoctors()
  }, [])

  useEffect(() => {
    if (searchDoctor.length >= 2) {
      const filtered = doctors.filter((d) => d.doctor_name.toLowerCase().includes(searchDoctor.toLowerCase()))
      setFilteredDoctors(filtered)
    } else {
      setFilteredDoctors([])
    }
  }, [searchDoctor, doctors])

  useEffect(() => {
    if (searchTest.length >= 1) {
      // Check if it's a shortcut search (all uppercase, 2-6 characters)
      const isShortcut = /^[A-Z0-9]{2,6}$/.test(searchTest.trim())
      setIsShortcutMode(isShortcut)

      let filtered = []
      
      if (isShortcut) {
        // Priority search for shortcuts
        const shortcutMatches = tests.filter(t => 
          t.shortcut && t.shortcut.toLowerCase() === searchTest.toLowerCase()
        )
        const partialShortcutMatches = tests.filter(t => 
          t.shortcut && t.shortcut.toLowerCase().startsWith(searchTest.toLowerCase()) && 
          !shortcutMatches.some(sm => sm.test_id === t.test_id)
        )
        filtered = [...shortcutMatches, ...partialShortcutMatches]
      } else {
        // Regular text search
        filtered = tests.filter((t) => t.testname.toLowerCase().includes(searchTest.toLowerCase()))
      }
      
      setFilteredTests(filtered.slice(0, 10)) // Limit to 10 results
    } else {
      setFilteredTests([])
      setIsShortcutMode(false)
    }
  }, [searchTest, tests])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const selectDoctor = (doctor) => {
    setFormData({ ...formData, ref_doctor: doctor.doctor_name })
    setSearchDoctor(doctor.doctor_name)
    setFilteredDoctors([])
  }

  const addTest = (test) => {
    if (!test) return

    // Check if test is already added
    const exists = testDetails.find(t => t.test_id === test.test_id)
    if (exists) {
      toast.warning(`${test.testname} is already added!`)
      return
    }

    const newTest = {
      test_id: test.test_id,
      testname: test.testname,
      container: test.container,
      department: test.department,
      SH_Rate: test.SH_Rate,
      shortcut: test.shortcut,
    }

    setTestDetails((prev) => [...prev, newTest])
    setSearchTest("")
    setFilteredTests([])
    setIsShortcutMode(false)
    toast.success(`Added: ${test.testname}`)
  }

  const deleteTest = (id) => {
    const testToRemove = testDetails.find(t => t.test_id === id)
    setTestDetails(testDetails.filter((t) => t.test_id !== id))
    if (testToRemove) {
      toast.info(`Removed: ${testToRemove.testname}`)
    }
  }

  const handleTestSearchKeyDown = (e) => {
    if (e.key === "Enter" && filteredTests.length > 0) {
      e.preventDefault()
      addTest(filteredTests)
    } else if (e.key === "Escape") {
      setSearchTest("")
      setFilteredTests([])
      setIsShortcutMode(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // CRITICAL VALIDATION: Check if any tests are selected
    if (testDetails.length === 0) {
      alert("❌ Cannot save billing without selecting at least one test!")
      toast.error("Please add at least one test before submitting the billing!")
      return
    }
    
    // Additional validations
    if (!formData.patient_id.trim()) {
      alert("❌ Patient ID is required!")
      toast.error("Patient ID is required!")
      return
    }
    if (!formData.patientname.trim()) {
      alert("❌ Patient name is required!")
      toast.error("Patient name is required!")
      return
    }
    
  const payload = {
    ...formData,
    patientname: `${formData.salutation} ${formData.patientname}`.trim(),
    testdetails: testDetails, // if tests are still included
  };
    
    const result = await apiRequest(`${Labbaseurl}hms_patient_billing/`, "POST", payload)
    
    if (result.success && result.data.success) {
      alert("✅ Billing saved successfully!")
      toast.success("Billing saved successfully!")
      
      // Reset form
      setFormData({
        patient_id: "",
        ipnumber: "",
        patientname: "",
        age: "",
        age_type: "years",
        gender: "",
        phone: "",
        location_id: "hms",
        billnumber: "",
        ref_doctor: "",
        date: getLocalDateTime(),
      })
      setTestDetails([])
      setSearchDoctor("")
      setSearchTest("")
    } else {
      console.error("Error submitting billing:", result.error)
      alert("❌ Error: " + (result.error || "Failed to submit billing data"))
      toast.error("Failed to submit billing data")
    }
  }

  const totalMRP = testDetails.reduce((sum, t) => sum + (t.SH_Rate || 0), 0)

  return (
    <Container>
      <MainCard>
        <Title>🏥 HMS Patient Billing System</Title>
        <Form onSubmit={handleSubmit}>
          <Fieldset>
            <legend>Patient Information</legend>
            <Grid>
              <FieldGroup>
                <Label>UHID NO</Label>
                <Input
                  type="text"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  placeholder="Enter UHID NO"
                />
              </FieldGroup>

              <FieldGroup>
                <Label>IP Number</Label>
                <Input
                  type="text"
                  name="ipnumber"
                  value={formData.ipnumber}
                  onChange={handleChange}
                  placeholder="Enter IP number"
                />
              </FieldGroup>
<FieldGroup>
  <Label>Salutation</Label>
  <Select
    name="salutation"
    value={formData.salutation}
    onChange={handleChange}
  >
    <option value="">Select</option>
    <option value="Mr">Mr</option>
    <option value="Mrs">Mrs</option>
    <option value="Baby">Baby</option>
    <option value="Master">Master</option>
    <option value="Miss">Miss</option>
    <option value="Dr">Dr</option>
  </Select>
</FieldGroup>

              <FieldGroup>
                <Label>Patient Name</Label>
                <Input
                  type="text"
                  name="patientname"
                  value={formData.patientname}
                  onChange={handleChange}
                  placeholder="Enter patient name"
                />
              </FieldGroup>

              <FieldGroup>
                <Label>Age</Label>
                <Input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Enter age" />
              </FieldGroup>

              <FieldGroup>
                <Label>Age Type</Label>
                <Select name="age_type" value={formData.age_type} onChange={handleChange}>
                  <option value="">Select age type</option>
                  <option value="years">Years</option>
                  <option value="Months">Months</option>
                  <option value="days">Days</option>
                </Select>
              </FieldGroup>

              <FieldGroup>
                <Label>Gender</Label>
                <Select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </Select>
              </FieldGroup>

              <FieldGroup>
                <Label>Phone</Label>
                <Input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </FieldGroup>

              <FieldGroup>
                <Label>Bill Number</Label>
                <Input
                  type="text"
                  name="billnumber"
                  value={formData.billnumber}
                  onChange={handleChange}
                  placeholder="Enter bill number"
                />
              </FieldGroup>

              <FieldGroup>
                <Label>Date & Time</Label>
                <Input type="datetime-local" name="date" value={formData.date} onChange={handleChange} />
              </FieldGroup>
            </Grid>
          </Fieldset>

          <Fieldset>
            <legend>Referring Doctor</legend>
            <Grid>
              <FieldGroup>
                <Label>Doctor Name</Label>
                <SearchContainer>
                  <SearchInput
                    type="text"
                    placeholder="Search and select doctor..."
                    value={searchDoctor}
                    onChange={(e) => setSearchDoctor(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && filteredDoctors.length > 0) {
                        e.preventDefault()
                        selectDoctor(filteredDoctors)
                      }
                    }}
                  />
                  {filteredDoctors.length > 0 && (
                    <DropdownList>
                      {filteredDoctors.map((d) => (
                        <DropdownItem key={d._id} onClick={() => selectDoctor(d)}>
                          {d.doctor_name} ({d.department})
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  )}
                </SearchContainer>
              </FieldGroup>
            </Grid>
          </Fieldset>

          <Fieldset>
            <legend>Laboratory Tests</legend>
            <Grid mb="1.5rem">
              <FieldGroup>
                <Label>Search Tests</Label>
                <SearchContainer>
                  <SearchInput
                    type="text"
                    className={isShortcutMode ? 'shortcut-mode' : ''}
                    placeholder="Type test name or shortcut (e.g., ALP, CBC)..."
                    value={searchTest}
                    onChange={(e) => setSearchTest(e.target.value)}
                    onKeyDown={handleTestSearchKeyDown}
                  />
                  {isShortcutMode && <ShortcutIndicator>SHORTCUT</ShortcutIndicator>}
                  {filteredTests.length > 0 && (
                    <DropdownList>
                      {filteredTests.map((t) => (
                        <DropdownItem 
                          key={t.test_id} 
                          onClick={() => addTest(t)}
                          className={isShortcutMode && t.shortcut?.toLowerCase() === searchTest.toLowerCase() ? 'shortcut-match' : ''}
                        >
                          <span>{t.testname}</span>
                          {t.shortcut && <ShortcutTag>{t.shortcut}</ShortcutTag>}
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  )}
                </SearchContainer>
                <ShortcutHelp>
                  <strong>Quick Tips:</strong> Type shortcuts like <strong>ALP</strong>, <strong>CBC</strong>, <strong>ESR</strong> for instant test selection. 
                  Press <strong>Enter</strong> to add the first result, <strong>Esc</strong> to clear.
                </ShortcutHelp>
              </FieldGroup>
            </Grid>

            {testDetails.length > 0 ? (
              <>
                <Table>
                  <TableHead>
                    <tr>
                      <TableHeader>Test Name</TableHeader>
                      <TableHeader>Shortcut</TableHeader>
                      <TableHeader>Container</TableHeader>
                      <TableHeader>Department</TableHeader>
                      <TableHeader>Amount</TableHeader>
                      <TableHeader>Action</TableHeader>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {testDetails.map((t) => (
                      <tr key={t.test_id}>
                        <TableCell>{t.testname}</TableCell>
                        <TableCell>
                          {t.shortcut && <ShortcutTag>{t.shortcut}</ShortcutTag>}
                        </TableCell>
                        <TableCell>{t.container}</TableCell>
                        <TableCell>{t.department}</TableCell>
                        <TableCell>₹{t.SH_Rate}</TableCell>
                        <TableCell>
                          <Button type="button" variant="danger" size="sm" onClick={() => deleteTest(t.test_id)}>
                            Remove
                          </Button>
                        </TableCell>
                      </tr>
                    ))}
                  </TableBody>
                </Table>

                <TotalCard>
                  <div>Total Amount ({testDetails.length} tests)</div>
                  <TotalAmount>₹{totalMRP.toLocaleString()}</TotalAmount>
                </TotalCard>
              </>
            ) : (
              <EmptyState>No tests added yet. Search and add tests above using shortcuts or full names.</EmptyState>
            )}
          </Fieldset>

          <Button type="submit" variant="success">
            💾 Submit Billing
          </Button>
        </Form>
      </MainCard>
    </Container>
  )
}

export default HmsBilling
