"use client"

import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaUser, FaFlask, FaCreditCard, FaPlus, FaTrash, FaSave, FaArrowLeft, FaSearch } from "react-icons/fa"
import apiRequest from "../Auth/apiRequest"
import headerImage from "../Images/Header.png"

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8fafc;
  min-height: 100vh;
`

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  
  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  p {
    margin: 10px 0 0 0;
    opacity: 0.9;
    font-size: 16px;
  }
`

const BackButton = styled.button`
  background: #6366f1;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  transition: all 0.2s;
  
  &:hover {
    background: #4f46e5;
    transform: translateY(-1px);
  }
`

const Button = styled.button`
  padding: ${(props) => (props.size === "sm" ? "8px 12px" : "12px 24px")};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  ${(props) => {
    switch (props.variant) {
      case "primary":
        return `background: #3b82f6; color: white; &:hover { background: #2563eb; } &:disabled { background: #9ca3af; cursor: not-allowed; }`
      case "success":
        return `background: #10b981; color: white; &:hover { background: #059669; }`
      case "danger":
        return `background: #ef4444; color: white; &:hover { background: #dc2626; }`
      default:
        return `background: #f3f4f6; color: #374151; &:hover { background: #e5e7eb; }`
    }
  }}
`

const PatientListContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`

const SearchAndFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
  padding: 25px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  
  input {
    width: 100%;
    padding: 12px 16px 12px 45px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.2s;
    background: white;

    &:focus {
      border-color: #667eea;
      outline: none;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  svg {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }
`

const DateFilters = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`

const PatientTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  
  th, td {
    padding: 15px 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  
  th {
    background: #f8fafc;
    font-weight: 600;
    color: #374151;
    font-size: 14px;
  }
  
  tr:hover {
    background: #f8fafc;
  }
  
  .select-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    
    &:hover {
      background: #2563eb;
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  }
`

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch(props.status?.toLowerCase()) {
      case 'billed': return '#dcfce7';
      case 'registered': return '#fef3c7';
      case 'collected': return '#dbeafe';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch(props.status?.toLowerCase()) {
      case 'billed': return '#166534';
      case 'registered': return '#92400e';
      case 'collected': return '#1e40af';
      default: return '#374151';
    }
  }};
`

const PatientInfo = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  
  h2 {
    margin: 0 0 20px 0;
    color: #1e293b;
    font-size: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .patient-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    
    .detail-item {
      display: flex;
      flex-direction: column;
      
      .label {
        font-size: 12px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
      }
      
      .value {
        font-size: 16px;
        color: #1e293b;
        font-weight: 500;
      }
    }
  }
`

const BillingSection = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  
  h3 {
    margin: 0 0 20px 0;
    color: #1e293b;
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  label {
    margin-bottom: 8px;
    font-weight: 500;
    color: #374151;
    font-size: 14px;
    
    &.required::after {
      content: " *";
      color: #ef4444;
    }
  }
  
  input, select, textarea {
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 16px;
    min-height: 44px;
    transition: border-color 0.2s;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
  
  select {
    cursor: pointer;
    background-color: white;
    
    option {
      padding: 8px 12px;
      font-size: 16px;
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 80px;
  }
`

const TestSearchContainer = styled.div`
  position: relative;
  width: 600px;   /* 👈 parent container width */

  input {
    width: 100%;   /* 👈 input expands fully */
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 16px;
    outline: none;
    
    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    width: 100%;
    min-width: 400px;

    .dropdown-item {
      padding: 15px 20px;
      cursor: pointer;
      transition: background-color 0.2s;
      border-bottom: 1px solid #f3f4f6;

      &:hover {
        background: #f8fafc;
      }

      &:last-child {
        border-bottom: none;
      }

      .test-name {
        display: block;
        color: #1e293b;
        font-weight: 500;
        font-size: 16px;
      }
    }
  }
`;


const TestTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  
  th {
    background: #f8fafc;
    font-weight: 600;
    color: #374151;
    font-size: 14px;
  }
  
  tr:hover {
    background: #f8fafc;
  }
  
  .remove-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 6px 8px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: #dc2626;
    }
  }
`

const PaymentMethodSection = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  
  h4 {
    margin: 0 0 15px 0;
    color: #1e293b;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`

const MultiplePaymentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 8px;
  
  .payment-info {
    flex: 1;
    font-size: 14px;
    
    .amount {
      font-weight: 600;
      color: #1e293b;
    }
    
    .method {
      color: #6b7280;
      margin-left: 8px;
    }
    
    .details {
      color: #9ca3af;
      font-size: 12px;
      margin-top: 2px;
    }
  }
`

const AmountSummary = styled.div`
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  
  h4 {
    margin: 0 0 15px 0;
    color: #0c4a6e;
    font-size: 18px;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #bae6fd;
    
    &:last-child {
      border-bottom: none;
      font-weight: 600;
      font-size: 16px;
      color: #0c4a6e;
    }
    
    .label {
      color: #0369a1;
    }
    
    .value {
      font-weight: 500;
      color: #0c4a6e;
    }
  }
`

// New styled component for payment validation warning
const PaymentValidationWarning = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  color: #92400e;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  .warning-icon {
    font-size: 16px;
  }
`

const PatientBilling = () => {
  const [currentPage, setCurrentPage] = useState("list")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchValue, setSearchValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [testOptions, setTestOptions] = useState([])
  const [filteredTestOptions, setFilteredTestOptions] = useState([])
  const [selectedTests, setSelectedTests] = useState([])
  const [patientsList, setPatientsList] = useState([])
  const [paymentOptions, setPaymentOptions] = useState({
    credit: true,
    cash: true,
    upi: true,
    neft: true,
    cheque: true,
    multiplePayment: true
  })
  const printRef = useRef()

  const getCurrentDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const [dateFilters, setDateFilters] = useState({
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  })

  const [billingData, setBillingData] = useState({
    totalAmount: 0,
    discount: 0,
    netAmount: 0,
    creditAmount: 0,
    paymentMethod: "",
    paymentDetails: "",
    multiplePayments: [],
  })

  const [currentMultiplePayment, setCurrentMultiplePayment] = useState({
    amount: "",
    paymentMethod: "Cash",
    paymentDetails: "",
  })

  const [testSearchValue, setTestSearchValue] = useState("")
  const [showTestDropdown, setShowTestDropdown] = useState(false)

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  useEffect(() => {
    fetchTestDetails()
    if (dateFilters.fromDate && dateFilters.toDate) {
      fetchPatientsByDate()
    }
  }, [])

  useEffect(() => {
    if (dateFilters.fromDate && dateFilters.toDate) {
      fetchPatientsByDate()
    }
  }, [dateFilters])

  useEffect(() => {
    calculateAmounts()
  }, [selectedTests, billingData.discount, billingData.paymentMethod])

  // New function to check if multiple payments match total amount
  const isMultiplePaymentComplete = () => {
    if (billingData.paymentMethod !== "Multiple Payment") return true
    
    const totalMultiplePayments = billingData.multiplePayments.reduce((sum, p) => sum + p.amount, 0)
    return Math.abs(totalMultiplePayments - billingData.netAmount) < 0.01 // Allow for small floating point differences
  }

  // New function to get remaining amount for multiple payments
  const getRemainingAmount = () => {
    if (billingData.paymentMethod !== "Multiple Payment") return 0
    
    const totalMultiplePayments = billingData.multiplePayments.reduce((sum, p) => sum + p.amount, 0)
    return Math.max(0, billingData.netAmount - totalMultiplePayments)
  }

  const calculateAmounts = () => {
    const testsTotal = selectedTests.reduce((sum, test) => sum + test.amount, 0)
    let discountAmount = 0

    if (billingData.discount) {
      if (typeof billingData.discount === "string" && billingData.discount.includes("%")) {
        const percentage = Number.parseFloat(billingData.discount.replace("%", ""))
        discountAmount = (testsTotal * percentage) / 100
      } else {
        discountAmount = Number.parseFloat(billingData.discount) || 0
      }
    }

    const netAmount = Math.max(0, testsTotal - discountAmount)
    let creditAmount = 0

    // Calculate credit amount based on payment method
    if (billingData.paymentMethod === "Credit") {
      creditAmount = netAmount
    }

    setBillingData((prev) => ({
      ...prev,
      totalAmount: testsTotal,
      netAmount: netAmount,
      creditAmount: creditAmount,
    }))
  }

  // New function to fetch patient details and check B2B restrictions
  const fetchPatientDetails = async (patient) => {
    if (patient.segment === 'B2B' && patient.lab_id) {
      try {
        const response = await apiRequest(`${Labbaseurl}get_patientsbyb2b/?date=${patient.date.split('T')[0]}`, "GET")
        
        if (response && response.success !== false) {
          const patientData = Array.isArray(response) ? response : (response.data || [])
          const currentPatient = patientData.find(p => p.patient_id === patient.patient_id)
          
          if (currentPatient && currentPatient.payment_options) {
            setPaymentOptions(currentPatient.payment_options)
            
            if (!currentPatient.payment_options.credit) {
              toast.info("Credit payment is disabled for this B2B patient (Cash type)")
            }
          }
        }
      } catch (error) {
        console.error("Error fetching patient payment options:", error)
        // Set default payment options if API fails
        setPaymentOptions({
          credit: true,
          cash: true,
          upi: true,
          neft: true,
          cheque: true,
          multiplePayment: true
        })
      }
    } else {
      // Reset to default for non-B2B patients
      setPaymentOptions({
        credit: true,
        cash: true,
        upi: true,
        neft: true,
        cheque: true,
        multiplePayment: true
      })
    }
  }

  const fetchTestDetails = async () => {
    try {
      setLoading(true)
      const result = await apiRequest(`${Labbaseurl}testdetails/`, "GET")

      if (result && result.success) {
        const testsData = result.data?.data || result.data || []
        setTestOptions(Array.isArray(testsData) ? testsData : [])
        if (testsData.length > 0) {
          toast.success(`Loaded ${testsData.length} tests`)
        }
      } else {
        console.error("Error fetching test details:", result?.error)
        toast.error("Failed to fetch test details")
        setTestOptions([])
      }
    } catch (error) {
      console.error("Error fetching test details:", error)
      toast.error("Failed to fetch test details")
      setTestOptions([])
    } finally {
      setLoading(false)
    }
  }

  const fetchPatientsByDate = async () => {
    if (!dateFilters.fromDate || !dateFilters.toDate) {
      toast.warning("Please select both from and to dates")
      return
    }

    setLoading(true)
    try {
      const response = await apiRequest(
        `${Labbaseurl}patients_by_date/?start_date=${dateFilters.fromDate}&end_date=${dateFilters.toDate}`,
        "GET",
      )

      let patients = []

      if (response && response.success && Array.isArray(response.data)) {
        patients = response.data
      } else if (response && Array.isArray(response.data)) {
        patients = response.data
      } else if (response && Array.isArray(response)) {
        patients = response
      } else if (response && response.data && Array.isArray(response.data.data)) {
        patients = response.data.data
      } else {
        console.error("Unexpected response structure:", response)
        toast.error("Unexpected response structure from server")
        setPatientsList([])
        setLoading(false)
        return
      }

      const validPatients = patients
        .filter((patient) => {
          const hasRequiredFields =
            patient && (patient.patient_id || patient._id) && (patient.patientname || patient.name)
          return hasRequiredFields
        })
        .map((patient) => ({
          ...patient,
          patient_id: patient.patient_id || patient._id,
          patientname: patient.patientname || patient.name || "Unknown",
          age: patient.age || "N/A",
          gender: patient.gender || "N/A",
          phone: patient.phone || patient.mobile || "N/A",
          segment: patient.segment || "N/A",
          date: patient.date || patient.created_date || new Date().toISOString(),
          lab_id: patient.lab_id || "N/A",
          B2B: patient.B2B || "N/A",
          refby: patient.refby || "SELF",
          status: patient.status || "Registered"
        }))

      setPatientsList(validPatients)

      if (validPatients.length === 0) {
        toast.info("No valid patients found for the selected date range")
      } else {
        toast.success(`Found ${validPatients.length} patients`)
      }
    } catch (error) {
      console.error("Error fetching patients:", error)
      toast.error("Failed to fetch patients")
      setPatientsList([])
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patientsList.filter(patient => {
    const searchLower = searchValue.toLowerCase()
    return (
      patient.patient_id?.toLowerCase().includes(searchLower) ||
      patient.patientname?.toLowerCase().includes(searchLower) ||
      patient.lab_id?.toLowerCase().includes(searchLower)
    )
  })

  const handlePatientSelect = async (patient) => {
    if (patient.status?.toLowerCase() === 'billed') {
      toast.warning("Cannot update billing for already billed patients")
      return
    }
    
    setSelectedPatient(patient)
    setCurrentPage("billing")
    
    // Fetch payment options for the patient
    await fetchPatientDetails(patient)
    
    loadExistingBillingData(patient)
  }

  const loadExistingBillingData = (patient) => {
    try {
      let existingTests = []
      if (patient.testdetails && patient.testdetails !== '""' && patient.testdetails !== '"[]"') {
        try {
          const parsedTests = JSON.parse(patient.testdetails)
          if (Array.isArray(parsedTests) && parsedTests.length > 0) {
            existingTests = parsedTests.map((test, index) => ({
              ...test,
              id: test.id || Date.now() + index,
            }))
          }
        } catch (e) {
          console.log("Error parsing testdetails:", e)
        }
      }

      let existingPaymentMethod = ""
      let existingPaymentDetails = ""
      if (patient.payment_method && patient.payment_method !== '""' && patient.payment_method !== '"{}"') {
        try {
          const parsedPayment = JSON.parse(patient.payment_method)
          if (parsedPayment && typeof parsedPayment === "object") {
            existingPaymentMethod = parsedPayment.paymentmethod || ""
            existingPaymentDetails = parsedPayment.paymentDetails || ""
          }
        } catch (e) {
          console.log("Error parsing payment_method:", e)
        }
      }

      let existingMultiplePayments = []
      if (patient.MultiplePayment && patient.MultiplePayment !== '""' && patient.MultiplePayment !== '"[]"') {
        try {
          const parsedMultiplePayments = JSON.parse(patient.MultiplePayment)
          if (Array.isArray(parsedMultiplePayments) && parsedMultiplePayments.length > 0) {
            existingMultiplePayments = parsedMultiplePayments.map((payment, index) => ({
              ...payment,
              amount: Number(payment.amount) || 0,
              id: payment.id || Date.now() + index,
            }))
          }
        } catch (e) {
          console.log("Error parsing MultiplePayment:", e)
        }
      }

      setSelectedTests(existingTests)

      const totalAmount = Number(patient.totalAmount) || 0
      const discount = Number(patient.discount) || 0
      const netAmount = totalAmount - discount
      const creditAmount = existingPaymentMethod === "Credit" ? netAmount : 0

      setBillingData({
        totalAmount: totalAmount,
        discount: discount,
        netAmount: netAmount,
        creditAmount: creditAmount,
        paymentMethod: existingPaymentMethod,
        paymentDetails: existingPaymentDetails,
        multiplePayments: existingMultiplePayments,
      })

      setCurrentMultiplePayment({
        amount: "",
        paymentMethod: "Cash",
        paymentDetails: "",
      })
      setTestSearchValue("")
      setShowTestDropdown(false)

      console.log("Loaded existing billing data:", {
        tests: existingTests.length,
        paymentMethod: existingPaymentMethod,
        multiplePayments: existingMultiplePayments.length,
        totalAmount: totalAmount,
        netAmount: netAmount,
        creditAmount: creditAmount,
      })
    } catch (error) {
      console.error("Error loading existing billing data:", error)
      resetBillingData()
    }
  }

  const resetBillingData = () => {
    setBillingData({
      totalAmount: 0,
      discount: 0,
      netAmount: 0,
      creditAmount: 0,
      paymentMethod: "",
      paymentDetails: "",
      multiplePayments: [],
    })
    setSelectedTests([])
    setCurrentMultiplePayment({
      amount: "",
      paymentMethod: "Cash",
      paymentDetails: "",
    })
    setTestSearchValue("")
    setShowTestDropdown(false)
    setPaymentOptions({
      credit: true,
      cash: true,
      upi: true,
      neft: true,
      cheque: true,
      multiplePayment: true
    })
  }

  const handleTestSearch = (value) => {
    setTestSearchValue(value)
    if (value.length > 0) {
      const filtered = testOptions.filter(
        (test) =>
          test.test_name?.toLowerCase().includes(value.toLowerCase()) ||
          test.shortcut?.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredTestOptions(filtered)
      setShowTestDropdown(true)
    } else {
      setFilteredTestOptions([])
      setShowTestDropdown(false)
    }
  }

  const handleTestSelect = (test) => {
    if (!selectedPatient) {
      toast.error("No patient selected.")
      return
    }

    let amount = 0
    if (selectedPatient.segment === "B2B") {
      amount = Number(test.L2L_Rate_Card || 0)
    } else if (selectedPatient.segment === "Walk-in" || selectedPatient.segment === "Home Collection") {
      amount = Number(test.MRP || 0)
    } else {
      amount = Number(test.MRP || 0)
    }

    const newTest = {
      test_id: test.test_id,
      testname: test.test_name,
      collection_container: test.collection_container,
      amount: amount,
      refund: false,
      cancellation: false,
      id: Date.now() + Math.random(),
    }

    const alreadySelected = selectedTests.some((selectedTest) => selectedTest.testname === newTest.testname)

    if (alreadySelected) {
      toast.error("This test is already selected.")
      return
    }

    setSelectedTests((prev) => [...prev, newTest])
    setTestSearchValue("")
    setShowTestDropdown(false)
    toast.success("Test added successfully")
  }

  const handleTestRemove = (testId) => {
    const updatedTests = selectedTests.filter((test) => test.id !== testId)
    setSelectedTests(updatedTests)
    toast.info("Test removed")
  }

  const addMultiplePayment = () => {
    if (!currentMultiplePayment.amount || !currentMultiplePayment.paymentMethod) {
      toast.error("Please fill amount and payment method")
      return
    }

    const paymentAmount = Number.parseFloat(currentMultiplePayment.amount)
    const remainingAmount = getRemainingAmount()
    
    if (paymentAmount > remainingAmount) {
      toast.error(`Payment amount cannot exceed remaining amount of ₹${remainingAmount.toFixed(2)}`)
      return
    }

    if (paymentAmount <= 0) {
      toast.error("Payment amount must be greater than zero")
      return
    }

    const newPayment = {
      ...currentMultiplePayment,
      amount: paymentAmount,
      id: Date.now(),
    }

    setBillingData((prev) => ({
      ...prev,
      multiplePayments: [...prev.multiplePayments, newPayment],
    }))

    setCurrentMultiplePayment({
      amount: "",
      paymentMethod: "Cash",
      paymentDetails: "",
    })

    toast.success("Payment added successfully")
  }

  const removeMultiplePayment = (paymentId) => {
    setBillingData((prev) => ({
      ...prev,
      multiplePayments: prev.multiplePayments.filter((p) => p.id !== paymentId),
    }))
    toast.info("Payment removed")
  }

  const isFormValid = () => {
    if (!selectedPatient) return false
    if (selectedTests.length === 0) return false
    if (!billingData.paymentMethod) return false

    if (billingData.paymentMethod === "Multiple Payment") {
      return billingData.multiplePayments.length > 0 && isMultiplePaymentComplete()
    }

    return true
  }

  const handlePrint = () => {
    const formatDateTimeUTC = (isoString) => {
      if (!isoString) return "NIL"
      const dateObj = new Date(isoString)
      const formatted = dateObj.toLocaleString("en-IN", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Kolkata",
        hour12: true,
      });
      return formatted.replace(/am|pm/gi, (match) => match.toUpperCase());
    }

    const numberToWords = (num) => {
      const a = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ]
      const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

      const toWords = (n) => {
        if (n < 20) return a[n]
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "")
        if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " and " + toWords(n % 100) : "")
        return toWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + toWords(n % 1000) : "")
      }
      return toWords(parseInt(num))
    }

    const tableRows =
      selectedTests
        ?.map(
          (test, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${test.testname || ""}</td>
              <td style="text-align: right;">₹${parseFloat(test.amount || 0).toFixed(2)}</td>
            </tr>
          `,
        )
        .join("") || ""

    let displayPaymentMode = "NIL"
    if (billingData.paymentMethod === "Multiple Payment") {
      displayPaymentMode = billingData.multiplePayments
        .map((p) => `${p.paymentMethod}: ₹${p.amount}${p.paymentDetails ? ` (${p.paymentDetails})` : ""}`)
        .join(", ")
    } else {
      displayPaymentMode = billingData.paymentMethod
      if (billingData.paymentDetails && billingData.paymentMethod !== "Cash") {
        displayPaymentMode += ` (${billingData.paymentDetails})`
      }
    }

    const netAmountInWords = billingData.netAmount ? numberToWords(billingData.netAmount) + " rupees only" : "Zero only"
    const storedName = localStorage.getItem("name") || "Employee"

    const printableContent = `
      <html>
      <head>
        <title>Shanmuga Diagnostics</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #000;
            font-size: 12px;
          }
          .container {
            width: 90%;
            margin: 10px auto;
            padding: 5px;
            border: 1px solid #000;
            font-size: 12px;
          }
          .header {
            text-align: center;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
            margin-bottom: 5px;
          }
          .header h1 {
            margin: 0;
            font-size: 14px;
          }
          .header p {
            margin: 2px 0;
            font-size: 10px;
          }
          .header div {
            font-size: 10px;
          }
          .header img {
            width: 100%;
            max-width: 100%;
            height: auto;
          }
          .details,
          .test-info,
          .payment-info {
            width: 100%;
            margin-bottom: 10px;
          }
          .details td,
          .test-info td,
          .payment-info td {
            padding: 2px;
            border-bottom: 1px solid #ddd;
            font-size: 12px;
          }
          .details th,
          .test-info th,
          .payment-info th {
            text-align: left;
            font-size: 12px;
          }
          .details table,
          .test-info table,
          .payment-info table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .payment-info th:first-child,
          .payment-info td:first-child {
            text-align: left;
            padding-left: 8px;
          }
          .signature {
            text-align: right;
            font-size: 12px;
          }
          .total-row {
            border-top: 2px solid #000;
            font-weight: bold;
          }
        </style>
      </head>
        <body>
          <div class="container">
            <div class="header">
              <div>CIN : U85110TZ2020PTC033974</div>
              <img src="${headerImage}" alt="Shanmuga Diagnostics" />
              <h1>BILL CUM RECEIPT</h1>
              <p>Contact No: 0427-2706666 / 6369131631</p>
            </div>
            <div class="details">
              <table id="invoiceTable">
                <tr>
                  <td><strong>Bill Date:</strong> ${
                    formatDateTimeUTC(selectedPatient.date) || "NIL"
                  }</td>
                  <td><strong>Bill No / Lab ID:</strong> ${
                    selectedPatient.lab_id || "NIL"
                  }</td>
                </tr>
                <tr>
                  <td><strong>Patient ID:</strong> ${
                    selectedPatient.patient_id || "NIL"
                  }</td>
                  <td><strong>Lab Name:</strong> ${selectedPatient.B2B || "NIL"}</td>
                </tr>
                <tr>
                  <td><strong>Name:</strong> ${
                    selectedPatient.patientname || "NIL"
                  }</td>
                  <td><strong>Gender/Age:</strong> ${selectedPatient.gender || "NIL"}/${
      selectedPatient.age || "NIL"
    } Yrs</td>
                </tr>
                <tr>
                  <td><strong>Mobile:</strong> ${selectedPatient.phone || "NIL"}</td>
                  <td><strong>Ref By:</strong> ${selectedPatient.refby || "SELF"}</td>
                </tr>
              </table>
            </div>
            <div class="test-info">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th style="text-align:center";>Test Name</th>
                    <th style="text-align:right";>Amount(₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>
            </div>
            <div class="payment-info">
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align:right">Amount(₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total Amount</td>
                    <td style="text-align:right">₹${parseFloat(billingData.totalAmount || 0).toFixed(2)}</td>
                  </tr>
                  ${
                    billingData.discount && parseFloat(billingData.discount) > 0
                      ? `<tr>
                          <td>Discount</td>
                          <td style="text-align:right">₹${parseFloat(billingData.discount).toFixed(2)}</td>
                        </tr>`
                      : ""
                  }
                  <tr class="total-row">
                    <td><strong>Net Amount</strong></td>
                    <td style="text-align:right"><strong>₹${parseFloat(billingData.netAmount || 0).toFixed(2)}</strong></td>
                  </tr>
                  <tr>
                    <td>Payment Mode</td>
                    <td style="text-align:right">${displayPaymentMode}</td>
                  </tr>
                </tbody>
              </table>
              <p><strong>Amount Paid in Words:</strong> ${netAmountInWords}</p>
              <div class="signature">
                <div class="signature-label">Signature of Employee</div>
                <div class="employee-name">${storedName}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const printWindow = window.open("", "", "width=1000,height=800")
    printWindow.document.write(printableContent)
    setTimeout(() => {
      printWindow.document.close()
      printWindow.print()
      printWindow.close()
    }, 1000)
  }

  const handleUpdateBill = async () => {
    if (!isFormValid()) {
      if (billingData.paymentMethod === "Multiple Payment" && !isMultiplePaymentComplete()) {
        toast.error(`Please complete the payment. Remaining amount: ₹${getRemainingAmount().toFixed(2)}`)
      } else {
        toast.error("Please fill all required fields")
      }
      return
    }
    setLoading(true)
    try {
      let paymentMethodData = {}
      let multiplePaymentData = []

      if (billingData.paymentMethod === "Multiple Payment") {
        multiplePaymentData = billingData.multiplePayments.map((payment) => ({
          amount: payment.amount.toString(),
          paymentMethod: payment.paymentMethod,
          paymentDetails: payment.paymentDetails || "",
        }))
        paymentMethodData = { paymentmethod: "Multiple Payment" }
      } else {
        paymentMethodData = {
          paymentmethod: billingData.paymentMethod,
          paymentDetails: billingData.paymentDetails || "",
        }
      }

      const updateData = {
        bill_id: selectedPatient._id?.$oid || selectedPatient._id || selectedPatient.id,
        patient_id: selectedPatient.patient_id,
        date: selectedPatient.date,
        testdetails: selectedTests,
        totalAmount: billingData.totalAmount.toString(),
        netAmount: billingData.netAmount.toString(),
        discount: billingData.discount.toString(),
        payment_method: paymentMethodData,
        MultiplePayment: JSON.stringify(multiplePaymentData),
        credit_amount: billingData.creditAmount.toString(),
        lastmodified_by: localStorage.getItem("name") || "system",
      }

      console.log("Sending update data:", updateData)

      const response = await apiRequest(`${Labbaseurl}update_bill/`, "PUT", updateData)
      console.log("Update bill response:", response)

      if (response && response.success !== false) {
        toast.success(`Bill updated successfully! ${response.bill_no ? `Bill No: ${response.bill_no}` : ""}`)

        setTimeout(() => {
          handlePrint()
        }, 1000)

        setTimeout(() => {
          setSelectedPatient(null)
          resetBillingData()
          setSearchValue("")
          setCurrentPage("list")
          if (dateFilters.fromDate && dateFilters.toDate) {
            fetchPatientsByDate()
          }
        }, 3000)
      } else {
        console.error("Bill update failed:", response)
        toast.error(`Failed to update bill: ${response?.error || response?.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error updating bill:", error)
      toast.error("Failed to update bill. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToList = () => {
    setSelectedPatient(null)
    resetBillingData()
    setCurrentPage("list")
  }

  if (currentPage === "list") {
    return (
      <Container>
        <Header>
          <h1>
            <FaUser /> Patient Billing Management
          </h1>
          <p>Select a patient to update their billing information</p>
        </Header>

        <PatientListContainer>
          <SearchAndFiltersContainer>
            <SearchContainer>
              <FaSearch />
              <input
                type="text"
                placeholder="Search by Patient ID, Name, or Barcode (Lab ID)..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </SearchContainer>
            
            <DateFilters>
              <FormGroup>
                <label>From Date</label>
                <input
                  type="date"
                  value={dateFilters.fromDate}
                  onChange={(e) => setDateFilters((prev) => ({ ...prev, fromDate: e.target.value }))}
                />
              </FormGroup>
              <FormGroup>
                <label>To Date</label>
                <input
                  type="date"
                  value={dateFilters.toDate}
                  onChange={(e) => setDateFilters((prev) => ({ ...prev, toDate: e.target.value }))}
                />
              </FormGroup>
            </DateFilters>
          </SearchAndFiltersContainer>

          {loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
              Loading patients...
            </div>
          )}

          {!loading && filteredPatients.length > 0 && (
            <PatientTable>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Age/Gender</th>
                  <th>Segment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr key={index}>
                    <td><strong>{patient.patient_id}</strong></td>
                    <td>{patient.patientname}</td>
                    <td>
                      {patient.age}/{patient.gender}
                    </td>
                    <td>{patient.segment}</td>
                    <td>{new Date(patient.date).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={patient.status}>
                        {patient.status}
                      </StatusBadge>
                    </td>
                    <td>
                      <button 
                        className="select-btn" 
                        onClick={() => handlePatientSelect(patient)}
                        disabled={patient.status?.toLowerCase() === 'billed'}
                      >
                        {patient.status?.toLowerCase() === 'billed' ? 'Billed' : 'Update'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </PatientTable>
          )}

          {!loading && filteredPatients.length === 0 && patientsList.length > 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
              No patients found matching your search criteria.
            </div>
          )}

          {!loading && patientsList.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
              No patients found for the selected date range.
            </div>
          )}
        </PatientListContainer>
      </Container>
    )
  }

  return (
    <Container>
      <BackButton onClick={handleBackToList}>
        <FaArrowLeft /> Back to Patient List
      </BackButton>

      <Header>
        <h1>
          <FaFlask /> Update Patient Billing
        </h1>
        <p>Update billing information for the selected patient</p>
      </Header>

      {selectedPatient && (
        <PatientInfo>
          <h2>
            <FaUser /> Patient Information
          </h2>
          <div className="patient-details">
            <div className="detail-item">
              <span className="label">Patient ID</span>
              <span className="value">{selectedPatient.patient_id}</span>
            </div>
            <div className="detail-item">
              <span className="label">Name</span>
              <span className="value">{selectedPatient.patientname}</span>
            </div>
            <div className="detail-item">
              <span className="label">Age/Gender</span>
              <span className="value">
                {selectedPatient.age} / {selectedPatient.gender}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Segment</span>
              <span className="value">{selectedPatient.segment}</span>
            </div>
          </div>
        </PatientInfo>
      )}

      <BillingSection>
        <h3>
          <FaFlask /> Billing Information
        </h3>

        {/* Test Selection */}
        <FormRow>
          <FormGroup>
            <label className="required">Test Name</label>
            <TestSearchContainer>
              <input
                type="text"
                value={testSearchValue}
                onChange={(e) => handleTestSearch(e.target.value)}
                placeholder="Search for tests..."
              />
              {showTestDropdown && filteredTestOptions.length > 0 && (
                <div className="dropdown">
                  {filteredTestOptions.map((test, index) => (
                    <div key={index} className="dropdown-item" onClick={() => handleTestSelect(test)}>
                      <div className="test-name">{test.test_name}</div>
                    </div>
                  ))}
                </div>
              )}
            </TestSearchContainer>
          </FormGroup>
        </FormRow>

        {/* Selected Tests Table */}
        {selectedTests.length > 0 && (
          <>
            <h4>Selected Tests ({selectedTests.length})</h4>
            <TestTable>
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Container</th>
                  <th style={{ textAlign: "right" }}>Amount (₹)</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedTests.map((test) => (
                  <tr key={test.id}>
                    <td>{test.testname}</td>
                    <td>{test.collection_container || "N/A"}</td>
                    <td style={{ textAlign: "right" }}>₹{test.amount.toFixed(2)}</td>
                    <td style={{ textAlign: "center" }}>
                      <button className="remove-btn" onClick={() => handleTestRemove(test.id)}>
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TestTable>
          </>
        )}

        {/* Discount Section */}
        {selectedTests.length > 0 && (
          <FormRow>
            <FormGroup>
              <label>Discount</label>
              <input
                type="text"
                value={billingData.discount}
                onChange={(e) => setBillingData((prev) => ({ ...prev, discount: e.target.value }))}
                placeholder="Enter discount amount (e.g., 10% or 50)"
              />
            </FormGroup>
          </FormRow>
        )}

        {/* Payment Method Selection */}
        {selectedTests.length > 0 && (
          <>
            <FormRow>
              <FormGroup>
                <label className="required">Payment Method</label>
                <select
                  value={billingData.paymentMethod}
                  onChange={(e) => setBillingData((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                >
                  <option value="">Select Payment Method</option>
                  <option value="Cash">Cash</option>
                  {paymentOptions.credit && <option value="Credit">Credit</option>}
                  <option value="UPI">UPI</option>
                  <option value="NEFT">NEFT</option>
                  <option value="Cheque">Cheque</option>
                  {paymentOptions.multiplePayment && <option value="Multiple Payment">Multiple Payment</option>}
                </select>
              </FormGroup>
              {billingData.paymentMethod &&
                billingData.paymentMethod !== "Cash" &&
                billingData.paymentMethod !== "Credit" &&
                billingData.paymentMethod !== "Multiple Payment" && (
                  <FormGroup>
                    <label>Payment Details</label>
                    <input
                      type="text"
                      value={billingData.paymentDetails}
                      onChange={(e) => setBillingData((prev) => ({ ...prev, paymentDetails: e.target.value }))}
                      placeholder="Enter payment details (optional)"
                    />
                  </FormGroup>
                )}
            </FormRow>

            {/* B2B Cash Type Warning */}
            {selectedPatient?.segment === 'B2B' && !paymentOptions.credit && (
              <PaymentValidationWarning>
                <span className="warning-icon">⚠️</span>
                Credit payment is disabled for this B2B patient (Cash type only)
              </PaymentValidationWarning>
            )}

            {/* Multiple Payment Section */}
            {billingData.paymentMethod === "Multiple Payment" && (
              <PaymentMethodSection>
                <h4>
                  <FaCreditCard /> Multiple Payment Details
                </h4>
                
                {/* Payment validation warning for multiple payments */}
                {getRemainingAmount() > 0 && (
                  <PaymentValidationWarning>
                    <span className="warning-icon">⚠️</span>
                    Remaining amount to be paid: ₹{getRemainingAmount().toFixed(2)}. 
                    Please complete all payments before saving.
                  </PaymentValidationWarning>
                )}

                <FormRow>
                  <FormGroup>
                    <label className="required">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      max={getRemainingAmount()}
                      value={currentMultiplePayment.amount}
                      onChange={(e) => setCurrentMultiplePayment((prev) => ({ ...prev, amount: e.target.value }))}
                      placeholder={`Max: ₹${getRemainingAmount().toFixed(2)}`}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label className="required">Payment Method</label>
                    <select
                      value={currentMultiplePayment.paymentMethod}
                      onChange={(e) =>
                        setCurrentMultiplePayment((prev) => ({ ...prev, paymentMethod: e.target.value }))
                      }
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="NEFT">NEFT</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </FormGroup>
                  <FormGroup>
                    <label>Payment Details</label>
                    <input
                      type="text"
                      value={currentMultiplePayment.paymentDetails}
                      onChange={(e) =>
                        setCurrentMultiplePayment((prev) => ({ ...prev, paymentDetails: e.target.value }))
                      }
                      placeholder="Enter payment details (optional)"
                    />
                  </FormGroup>
                  <div style={{ alignSelf: "end" }}>
                    <Button 
                      onClick={addMultiplePayment} 
                      variant="success"
                      disabled={getRemainingAmount() <= 0}
                    >
                      <FaPlus /> Add Payment
                    </Button>
                  </div>
                </FormRow>

                {billingData.multiplePayments.length > 0 && (
                  <div style={{ marginTop: "20px" }}>
                    <h5 style={{ margin: "0 0 15px 0", color: "#374151" }}>
                      Added Payments ({billingData.multiplePayments.length}):
                    </h5>
                    {billingData.multiplePayments.map((payment) => (
                      <MultiplePaymentItem key={payment.id}>
                        <div className="payment-info">
                          <div>
                            <span className="amount">₹{payment.amount.toFixed(2)}</span>
                            <span className="method">- {payment.paymentMethod}</span>
                          </div>
                          {payment.paymentDetails && <div className="details">{payment.paymentDetails}</div>}
                        </div>
                        <Button variant="danger" size="sm" onClick={() => removeMultiplePayment(payment.id)}>
                          <FaTrash />
                        </Button>
                      </MultiplePaymentItem>
                    ))}
                    <div style={{ textAlign: "right", fontWeight: "600", color: "#1e293b", marginTop: "10px" }}>
                      Total Multiple Payments: ₹
                      {billingData.multiplePayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                    </div>
                  </div>
                )}
              </PaymentMethodSection>
            )}

            {/* Amount Summary */}
            <AmountSummary>
              <h4>Amount Summary</h4>
              <div className="summary-row">
                <span className="label">Total Amount:</span>
                <span className="value">₹{billingData.totalAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="label">Discount:</span>
                <span className="value">
                  ₹
                  {(typeof billingData.discount === "string" && billingData.discount.includes("%")
                    ? (billingData.totalAmount * Number.parseFloat(billingData.discount.replace("%", ""))) / 100
                    : Number.parseFloat(billingData.discount) || 0
                  ).toFixed(2)}
                </span>
              </div>
              <div className="summary-row">
                <span className="label">Net Amount:</span>
                <span className="value">₹{billingData.netAmount.toFixed(2)}</span>
              </div>
              {billingData.creditAmount > 0 && (
                <div className="summary-row" style={{ color: "#ef4444", fontWeight: "600" }}>
                  <span className="label">Credit Amount:</span>
                  <span className="value">₹{billingData.creditAmount.toFixed(2)}</span>
                </div>
              )}
              {billingData.paymentMethod === "Multiple Payment" && (
                <>
                  <div className="summary-row">
                    <span className="label">Total Paid:</span>
                    <span className="value">₹{billingData.multiplePayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</span>
                  </div>
                  <div className="summary-row" style={{ color: getRemainingAmount() > 0 ? "#ef4444" : "#10b981", fontWeight: "600" }}>
                    <span className="label">Remaining:</span>
                    <span className="value">₹{getRemainingAmount().toFixed(2)}</span>
                  </div>
                </>
              )}
            </AmountSummary>

            {/* Save Button */}
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <Button
                variant="primary"
                onClick={handleUpdateBill}
                disabled={!isFormValid() || loading}
                style={{ fontSize: "16px", padding: "15px 30px" }}
              >
                <FaSave /> {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </>
        )}
      </BillingSection>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </Container>
  )
}

export default PatientBilling