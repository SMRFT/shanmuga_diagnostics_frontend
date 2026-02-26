"use client"

import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaUser, FaFlask, FaCreditCard, FaPlus, FaTrash, FaSave, FaArrowLeft, FaSearch } from "react-icons/fa"
import { AlertCircle, CheckCircle } from "lucide-react"
import apiRequest from "../Auth/apiRequest"
import headerImage from "../Images/Header.png"

/* ═══════════════════════════════════════════════════
   LAYOUT — viewport-fixed, no outer page scroll
═══════════════════════════════════════════════════ */
const PageShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #f8fafc;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;

  @media (max-width: 480px) { padding: 10px; }
`

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`

/* ═══════════════════════════════════════════════════
   HEADER
═══════════════════════════════════════════════════ */
const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 30px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  p {
    margin: 8px 0 0 0;
    opacity: 0.9;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    h1 { font-size: 18px; }
  }
`

const BackButton = styled.button`
  background: #6366f1;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
  transition: all 0.2s;
  &:hover { background: #4f46e5; transform: translateY(-1px); }
`

const Button = styled.button`
  padding: ${(p) => (p.size === "sm" ? "7px 11px" : "11px 22px")};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  white-space: nowrap;
  ${(p) => {
    switch (p.variant) {
      case "primary":  return `background:#3b82f6;color:white;&:hover{background:#2563eb;}&:disabled{background:#9ca3af;cursor:not-allowed;}`
      case "success":  return `background:#10b981;color:white;&:hover{background:#059669;}`
      case "danger":   return `background:#ef4444;color:white;&:hover{background:#dc2626;}`
      default:         return `background:#f3f4f6;color:#374151;&:hover{background:#e5e7eb;}`
    }
  }}
`

/* ═══════════════════════════════════════════════════
   PATIENT LIST
═══════════════════════════════════════════════════ */
const PatientListContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`

const SearchAndFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 24px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`

const SearchContainer = styled.div`
  position: relative;
  flex: 2;
  min-width: 220px;

  input {
    width: 100%;
    padding: 10px 14px 10px 42px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    box-sizing: border-box;
    transition: border-color 0.2s;
    &:focus { border-color: #667eea; outline: none; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
  }
  svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #9ca3af; }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 140px;

  label { font-size: 13px; font-weight: 500; color: #374151; }

  select, input[type="date"], input[type="text"], input[type="number"] {
    padding: 10px 13px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    box-sizing: border-box;
    transition: border-color 0.2s;
    &:focus { border-color: #667eea; outline: none; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
  }
`

/* ── CHANGE 3: Table with horizontal scroll ── */
const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;
`

const PatientTable = styled.table`
  width: 100%;
  min-width: 780px;
  border-collapse: separate;
  border-spacing: 0;

  th, td {
    padding: 13px 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
    font-size: 13px;
  }
  th {
    background: #f8fafc;
    font-weight: 600;
    color: #374151;
    font-size: 13px;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  tbody tr:hover { background: #f8fafc; }

  .select-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 7px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    &:hover { background: #2563eb; }
    &:disabled { background: #9ca3af; cursor: not-allowed; }
  }
`

/* ── CHANGE 2: Pagination ── */
const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 0 4px;

  .info { font-size: 13px; color: #6b7280; }

  .controls {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-wrap: wrap;
  }

  button {
    padding: 6px 12px;
    border: 2px solid #e2e8f0;
    background: white;
    border-radius: 7px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    transition: all 0.15s;
    &:hover { background: #f1f5f9; border-color: #cbd5e1; }
    &.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white; border-color: transparent;
      box-shadow: 0 3px 8px rgba(102,126,234,0.4);
    }
    &:disabled { background: #f9fafb; cursor: not-allowed; color: #9ca3af; border-color: #f3f4f6; }
  }

  select {
    padding: 6px 10px;
    border: 2px solid #e2e8f0;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    background: white;
    cursor: pointer;
    &:focus { border-color: #667eea; outline: none; }
  }
`

/* ── CHANGE 1: Emergency badges ── */
const StatusBadge = styled.span`
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: ${(p) => {
    switch (p.status?.toLowerCase()) {
      case "billed":     return "#dcfce7"
      case "registered": return "#fef3c7"
      case "collected":  return "#dbeafe"
      default:           return "#f3f4f6"
    }
  }};
  color: ${(p) => {
    switch (p.status?.toLowerCase()) {
      case "billed":     return "#166534"
      case "registered": return "#92400e"
      case "collected":  return "#1e40af"
      default:           return "#374151"
    }
  }};
`

const EmergencyBadge = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: ${(p) => p.emergency ? "#fee2e2" : "#dcfce7"};
  color: ${(p) => p.emergency ? "#991b1b" : "#166534"};
  ${(p) => p.emergency && `box-shadow: 0 0 8px rgba(220,38,38,0.25);`}
`

/* ═══════════════════════════════════════════════════
   BILLING PAGE
═══════════════════════════════════════════════════ */
const PatientInfo = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);

  h2 {
    margin: 0 0 16px 0;
    color: #1e293b;
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .patient-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;

    .detail-item {
      display: flex;
      flex-direction: column;
      .label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
      .value { font-size: 15px; color: #1e293b; font-weight: 500; }
    }
  }
`

const BillingSection = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);

  h3 {
    margin: 0 0 20px 0;
    color: #1e293b;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`

/* ── CHANGE 5: 3-column aligned row for Discount / Payment Method / Payment Details ── */
const PaymentRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
  align-items: end;

  @media (max-width: 768px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
  align-items: end;
`

const TestSearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 560px;

  input {
    width: 100%;
    padding: 10px 14px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    box-sizing: border-box;
    transition: border-color 0.2s;
    &:focus { border-color: #667eea; outline: none; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
  }

  .dropdown {
    position: absolute;
    top: 100%; left: 0; right: 0;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    max-height: 280px;
    overflow-y: auto;
    z-index: 1000;

    .dropdown-item {
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 1px solid #f3f4f6;
      transition: background 0.15s;
      &:hover { background: #f8fafc; }
      &:last-child { border-bottom: none; }
      .test-name { color: #1e293b; font-weight: 500; font-size: 14px; }
    }
  }
`

const TestTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;

  th, td {
    padding: 11px 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
    font-size: 13px;
  }
  th { background: #f8fafc; font-weight: 600; color: #374151; }
  tbody tr:hover { background: #f8fafc; }

  .remove-btn {
    background: #ef4444; color: white; border: none;
    padding: 5px 7px; border-radius: 4px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    &:hover { background: #dc2626; }
  }
`

const PaymentMethodSection = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 18px;
  margin: 16px 0;

  h4 {
    margin: 0 0 14px 0;
    color: #1e293b;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`

const MultiplePaymentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 8px;

  .payment-info {
    flex: 1; font-size: 13px;
    .amount { font-weight: 600; color: #1e293b; }
    .method { color: #6b7280; margin-left: 8px; }
    .details { color: #9ca3af; font-size: 12px; margin-top: 2px; }
  }
`

const AmountSummary = styled.div`
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 18px;
  margin: 16px 0;

  h4 { margin: 0 0 12px 0; color: #0c4a6e; font-size: 16px; }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 0;
    border-bottom: 1px solid #bae6fd;
    &:last-child { border-bottom: none; font-weight: 600; font-size: 15px; color: #0c4a6e; }
    .label { color: #0369a1; }
    .value { font-weight: 500; color: #0c4a6e; }
  }
`

const PaymentValidationWarning = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 12px 15px;
  margin: 12px 0;
  color: #92400e;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
`

/* ═══════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════ */
const PatientBilling = () => {
  const [currentPage, setCurrentPage]         = useState("list")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchValue, setSearchValue]         = useState("")
  const [emergencyFilter, setEmergencyFilter] = useState("all")
  const [loading, setLoading]                 = useState(false)
  const [testOptions, setTestOptions]         = useState([])
  const [filteredTestOptions, setFilteredTestOptions] = useState([])
  const [selectedTests, setSelectedTests]     = useState([])
  const [patientsList, setPatientsList]       = useState([])

  /* ── CHANGE 2: pagination state ── */
  const [listPage, setListPage]         = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState(10)

  const [paymentOptions, setPaymentOptions] = useState({
    credit: true, cash: true, upi: true, neft: true, cheque: true, multiplePayment: true,
  })
  const printRef = useRef()

  const getCurrentDate = () => new Date().toISOString().split("T")[0]

  const [dateFilters, setDateFilters] = useState({
    fromDate: getCurrentDate(),
    toDate:   getCurrentDate(),
  })

  const [billingData, setBillingData] = useState({
    totalAmount: 0, discount: 0, netAmount: 0, creditAmount: 0,
    paymentMethod: "", paymentDetails: "", multiplePayments: [],
  })

  const [currentMultiplePayment, setCurrentMultiplePayment] = useState({
    amount: "", paymentMethod: "Cash", paymentDetails: "",
  })

  const [testSearchValue, setTestSearchValue]   = useState("")
  const [showTestDropdown, setShowTestDropdown] = useState(false)

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  useEffect(() => {
    fetchTestDetails()
    if (dateFilters.fromDate && dateFilters.toDate) fetchPatientsByDate()
  }, [])

  useEffect(() => {
    if (dateFilters.fromDate && dateFilters.toDate) fetchPatientsByDate()
  }, [dateFilters])

  useEffect(() => { calculateAmounts() }, [selectedTests, billingData.discount, billingData.paymentMethod])

  const isMultiplePaymentComplete = () => {
    if (billingData.paymentMethod !== "Multiple Payment") return true
    const total = billingData.multiplePayments.reduce((s, p) => s + p.amount, 0)
    return Math.abs(total - billingData.netAmount) < 0.01
  }

  const getRemainingAmount = () => {
    if (billingData.paymentMethod !== "Multiple Payment") return 0
    const total = billingData.multiplePayments.reduce((s, p) => s + p.amount, 0)
    return Math.max(0, billingData.netAmount - total)
  }

  const calculateAmounts = () => {
    const testsTotal = selectedTests.reduce((s, t) => s + t.amount, 0)
    let discountAmount = 0
    if (billingData.discount) {
      if (typeof billingData.discount === "string" && billingData.discount.includes("%")) {
        discountAmount = (testsTotal * parseFloat(billingData.discount)) / 100
      } else {
        discountAmount = parseFloat(billingData.discount) || 0
      }
    }
    const netAmount    = Math.max(0, testsTotal - discountAmount)
    const creditAmount = billingData.paymentMethod === "Credit" ? netAmount : 0
    setBillingData((prev) => ({ ...prev, totalAmount: testsTotal, netAmount, creditAmount }))
  }

  const fetchPatientDetails = async (patient) => {
    if (patient.segment === "B2B" && patient.lab_id) {
      try {
        const response = await apiRequest(`${Labbaseurl}get_patientsbyb2b/?date=${patient.date.split("T")[0]}`, "GET")
        if (response && response.success !== false) {
          const patientData  = Array.isArray(response) ? response : response.data || []
          const currentP     = patientData.find((p) => p.patient_id === patient.patient_id)
          if (currentP?.payment_options) {
            setPaymentOptions(currentP.payment_options)
            if (!currentP.payment_options.credit) toast.info("Credit payment is disabled for this B2B patient")
          }
        }
      } catch { setPaymentOptions({ credit:true,cash:true,upi:true,neft:true,cheque:true,multiplePayment:true }) }
    } else {
      setPaymentOptions({ credit:true,cash:true,upi:true,neft:true,cheque:true,multiplePayment:true })
    }
  }

  const fetchTestDetails = async () => {
    try {
      setLoading(true)
      const result = await apiRequest(`${Labbaseurl}testdetails/`, "GET")
      if (result?.success) {
        const testsData = result.data?.data || result.data || []
        setTestOptions(Array.isArray(testsData) ? testsData : [])
        if (testsData.length > 0) toast.success(`Loaded ${testsData.length} tests`)
      } else { toast.error("Failed to fetch test details"); setTestOptions([]) }
    } catch { toast.error("Failed to fetch test details"); setTestOptions([]) }
    finally { setLoading(false) }
  }

  const fetchPatientsByDate = async () => {
    if (!dateFilters.fromDate || !dateFilters.toDate) { toast.warning("Please select both dates"); return }
    setLoading(true)
    try {
      const response = await apiRequest(
        `${Labbaseurl}patients_by_date/?start_date=${dateFilters.fromDate}&end_date=${dateFilters.toDate}`, "GET"
      )
      let patients = []
      if (response?.success && Array.isArray(response.data))        patients = response.data
      else if (response && Array.isArray(response.data))            patients = response.data
      else if (Array.isArray(response))                             patients = response
      else if (response?.data && Array.isArray(response.data.data)) patients = response.data.data
      else { toast.error("Unexpected response structure"); setPatientsList([]); setLoading(false); return }

      const valid = patients
        .filter((p) => p && (p.patient_id || p._id) && (p.patientname || p.name))
        .map((p) => ({
          ...p,
          patient_id:  p.patient_id || p._id,
          patientname: p.patientname || p.name || "Unknown",
          age:         p.age || "N/A",
          gender:      p.gender || "N/A",
          phone:       p.phone || p.mobile || "N/A",
          segment:     p.segment || "N/A",
          date:        p.date || p.created_date || new Date().toISOString(),
          lab_id:      p.lab_id || "N/A",
          B2B:         p.B2B || "N/A",
          refby:       p.refby || "SELF",
          status:      p.status || "Registered",
          branch:      p.branch || "N/A",
          is_emergency: !!p.is_emergency,
        }))

      setPatientsList(valid)
      setListPage(1)
      if (valid.length === 0) toast.info("No patients found")
      else toast.success(`Found ${valid.length} patients`)
    } catch { toast.error("Failed to fetch patients"); setPatientsList([]) }
    finally { setLoading(false) }
  }

  /* ── filter + paginate ── */
  const filteredPatients = patientsList.filter((p) => {
    const s  = searchValue.toLowerCase()
    const ok = p.patient_id?.toLowerCase().includes(s) ||
               p.patientname?.toLowerCase().includes(s) ||
               p.lab_id?.toLowerCase().includes(s)
    const em = emergencyFilter === "all" ||
               (emergencyFilter === "emergency" && p.is_emergency) ||
               (emergencyFilter === "normal"    && !p.is_emergency)
    return ok && em
  })

  const totalPages     = Math.ceil(filteredPatients.length / recordsPerPage)
  const pagedPatients  = filteredPatients.slice((listPage - 1) * recordsPerPage, listPage * recordsPerPage)
  const pageNumbers    = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((n) => n === 1 || n === totalPages || (n >= listPage - 2 && n <= listPage + 2))

  const handlePatientSelect = async (patient) => {
    if (patient.status?.toLowerCase() === "billed") { toast.warning("Cannot update billed patients"); return }
    setSelectedPatient(patient)
    setCurrentPage("billing")
    await fetchPatientDetails(patient)
    loadExistingBillingData(patient)
  }

  const loadExistingBillingData = (patient) => {
    try {
      let existingTests = []
      if (patient.testdetails && patient.testdetails !== '""' && patient.testdetails !== '"[]"') {
        try {
          const parsed = JSON.parse(patient.testdetails)
          if (Array.isArray(parsed) && parsed.length > 0)
            existingTests = parsed.map((t, i) => ({ ...t, id: t.id || Date.now() + i }))
        } catch {}
      }
      let existingPaymentMethod  = ""
      let existingPaymentDetails = ""
      if (patient.payment_method && patient.payment_method !== '""') {
        try {
          const parsed = JSON.parse(patient.payment_method)
          if (parsed && typeof parsed === "object") {
            existingPaymentMethod  = parsed.paymentmethod  || ""
            existingPaymentDetails = parsed.paymentDetails || ""
          }
        } catch {}
      }
      let existingMultiplePayments = []
      if (patient.MultiplePayment && patient.MultiplePayment !== '""' && patient.MultiplePayment !== '"[]"') {
        try {
          const parsed = JSON.parse(patient.MultiplePayment)
          if (Array.isArray(parsed) && parsed.length > 0)
            existingMultiplePayments = parsed.map((p, i) => ({ ...p, amount: Number(p.amount)||0, id: p.id||Date.now()+i }))
        } catch {}
      }
      setSelectedTests(existingTests)
      const totalAmount  = Number(patient.totalAmount) || 0
      const discount     = Number(patient.discount)    || 0
      const netAmount    = totalAmount - discount
      const creditAmount = existingPaymentMethod === "Credit" ? netAmount : 0
      setBillingData({ totalAmount, discount, netAmount, creditAmount,
        paymentMethod: existingPaymentMethod, paymentDetails: existingPaymentDetails,
        multiplePayments: existingMultiplePayments })
      setCurrentMultiplePayment({ amount:"", paymentMethod:"Cash", paymentDetails:"" })
      setTestSearchValue(""); setShowTestDropdown(false)
    } catch { resetBillingData() }
  }

  const resetBillingData = () => {
    setBillingData({ totalAmount:0,discount:0,netAmount:0,creditAmount:0,paymentMethod:"",paymentDetails:"",multiplePayments:[] })
    setSelectedTests([])
    setCurrentMultiplePayment({ amount:"",paymentMethod:"Cash",paymentDetails:"" })
    setTestSearchValue(""); setShowTestDropdown(false)
    setPaymentOptions({ credit:true,cash:true,upi:true,neft:true,cheque:true,multiplePayment:true })
  }

  const handleTestSearch = (value) => {
    setTestSearchValue(value)
    if (!value.trim()) { setFilteredTestOptions([]); setShowTestDropdown(false); return }
    const search   = value.toLowerCase()
    const filtered = testOptions.filter(
      (t) => t.test_name?.toLowerCase().includes(search) || t.shortcut?.toLowerCase().includes(search)
    )
    setFilteredTestOptions(filtered); setShowTestDropdown(true)
  }

  const handleTestSelect = (test) => {
    if (!selectedPatient) { toast.error("No patient selected."); return }
    const amount = selectedPatient.segment === "B2B" ? Number(test.L2L_Rate_Card||0) : Number(test.MRP||0)
    const newTest = { test_id:test.test_id, testname:test.test_name, collection_container:test.collection_container,
                      amount, refund:false, cancellation:false, id:Date.now()+Math.random() }
    if (selectedTests.some((t) => t.testname === newTest.testname)) { toast.error("Test already selected."); return }
    setSelectedTests((prev) => [...prev, newTest])
    setTestSearchValue(""); setShowTestDropdown(false)
    toast.success("Test added")
  }

  const handleTestRemove = (id) => { setSelectedTests((p) => p.filter((t) => t.id !== id)); toast.info("Test removed") }

  const addMultiplePayment = () => {
    if (!currentMultiplePayment.amount || !currentMultiplePayment.paymentMethod) {
      toast.error("Please fill amount and payment method"); return
    }
    const amt  = parseFloat(currentMultiplePayment.amount)
    const rem  = getRemainingAmount()
    if (amt > rem)  { toast.error(`Amount cannot exceed ₹${rem.toFixed(2)}`); return }
    if (amt <= 0)   { toast.error("Amount must be > 0"); return }
    setBillingData((prev) => ({
      ...prev,
      multiplePayments: [...prev.multiplePayments, { ...currentMultiplePayment, amount:amt, id:Date.now() }],
    }))
    setCurrentMultiplePayment({ amount:"", paymentMethod:"Cash", paymentDetails:"" })
    toast.success("Payment added")
  }

  const removeMultiplePayment = (id) => {
    setBillingData((prev) => ({ ...prev, multiplePayments: prev.multiplePayments.filter((p) => p.id !== id) }))
    toast.info("Payment removed")
  }

  const isFormValid = () => {
    if (!selectedPatient || selectedTests.length === 0 || !billingData.paymentMethod) return false
    if (billingData.paymentMethod === "Multiple Payment")
      return billingData.multiplePayments.length > 0 && isMultiplePaymentComplete()
    return true
  }

  /* ── PRINT ── */
  const handlePrint = () => {
    const fmtDT = (iso) => {
      if (!iso) return "NIL"
      return new Date(iso).toLocaleString("en-IN", {
        year:"numeric",month:"long",day:"2-digit",hour:"2-digit",minute:"2-digit",
        second:"2-digit",timeZone:"Asia/Kolkata",hour12:true
      }).replace(/am|pm/gi, m => m.toUpperCase())
    }
    const nw = (num) => {
      const a=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
               "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
      const b=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
      const tw=(n)=>{
        if(n<20) return a[n]
        if(n<100) return b[Math.floor(n/10)]+(n%10?" "+a[n%10]:"")
        if(n<1000) return a[Math.floor(n/100)]+" Hundred"+(n%100?" and "+tw(n%100):"")
        return tw(Math.floor(n/1000))+" Thousand"+(n%1000?" "+tw(n%1000):"")
      }
      return tw(parseInt(num))
    }

    const tableRows = selectedTests?.map((t,i)=>`
      <tr><td>${i+1}</td><td>${t.testname||""}</td>
      <td style="text-align:right">₹${parseFloat(t.amount||0).toFixed(2)}</td></tr>`).join("") || ""

    let displayPaymentMode = "NIL"
    if (billingData.paymentMethod === "Multiple Payment") {
      displayPaymentMode = billingData.multiplePayments
        .map(p=>`${p.paymentMethod}: ₹${p.amount}${p.paymentDetails?` (${p.paymentDetails})`:""}`)
        .join(", ")
    } else {
      displayPaymentMode = billingData.paymentMethod
      if (billingData.paymentDetails && billingData.paymentMethod !== "Cash")
        displayPaymentMode += ` (${billingData.paymentDetails})`
    }

    const inWords     = billingData.netAmount ? nw(billingData.netAmount)+" rupees only" : "Zero only"
    const storedName  = localStorage.getItem("name") || "Employee"

    /* ── CHANGE 1: Emergency label in print ── */
    const emergencyLabel = selectedPatient?.is_emergency
      ? `<span style="color:#b91c1c;font-weight:bold;">🚨 EMERGENCY</span>`
      : `<span style="color:#166534;font-weight:bold;">✔ NORMAL</span>`

    const html = `<html><head><title>Shanmuga Diagnostics</title>
    <style>
      body{font-family:Arial,sans-serif;margin:0;padding:0;color:#000;font-size:12px}
      .container{width:90%;margin:10px auto;padding:5px;border:1px solid #000}
      .header{text-align:center;border-bottom:1px solid #000;padding-bottom:5px;margin-bottom:5px}
      .header h1{margin:0;font-size:14px}.header p{margin:2px 0;font-size:10px}
      .header img{width:100%;max-width:100%;height:auto;display:block}
      .details,.test-info,.payment-info{width:100%;margin-bottom:10px}
      .details td,.test-info td,.payment-info td{padding:2px;border-bottom:1px solid #ddd;font-size:12px}
      .details th,.test-info th,.payment-info th{text-align:left;font-size:12px}
      .details table,.test-info table,.payment-info table{width:100%;border-collapse:collapse}
      .signature{text-align:right;font-size:12px}
      .total-row{border-top:2px solid #000;font-weight:bold}
    </style></head>
    <body><div class="container">
      <div class="header">
        <div>CIN : U85110TZ2020PTC033974</div>
        <img src="${headerImage}" alt="Shanmuga Diagnostics"/>
        <h1>BILL CUM RECEIPT</h1>
        <p>Contact No: 0427-2706666 / 6369131631</p>
      </div>
      <div class="details"><table>
        <tr>
          <td><strong>Bill Date:</strong> ${fmtDT(new Date().toISOString())}</td>
          <td><strong>Bill No / Lab ID:</strong> ${selectedPatient.lab_id||"NIL"}</td>
        </tr>
        <tr>
          <td><strong>Patient ID:</strong> ${selectedPatient.patient_id||"NIL"}</td>
          <td><strong>Lab Name:</strong> ${selectedPatient.B2B||"NIL"}</td>
        </tr>
        <tr>
          <td><strong>Name:</strong> ${selectedPatient.patientname||"NIL"}</td>
          <td><strong>Gender/Age:</strong> ${selectedPatient.gender||"NIL"}/${selectedPatient.age||"NIL"} Yrs</td>
        </tr>
        <tr>
          <td><strong>Mobile:</strong> ${selectedPatient.phone||"NIL"}</td>
          <td><strong>Ref By:</strong> ${selectedPatient.refby||"SELF"}</td>
        </tr>
        <tr>
          <td><strong>Branch:</strong> ${selectedPatient.branch||"N/A"}</td>
          <td><strong>Visit Type:</strong> ${emergencyLabel}</td>
        </tr>
      </table></div>
      <div class="test-info"><table>
        <thead><tr><th>S.No</th><th style="text-align:center">Test Name</th><th style="text-align:right">Amount(₹)</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table></div>
      <div class="payment-info"><table>
        <thead><tr><th>Description</th><th style="text-align:right">Amount(₹)</th></tr></thead>
        <tbody>
          <tr><td>Total Amount</td><td style="text-align:right">₹${parseFloat(billingData.totalAmount||0).toFixed(2)}</td></tr>
          ${billingData.discount&&parseFloat(billingData.discount)>0
            ?`<tr><td>Discount</td><td style="text-align:right">₹${parseFloat(billingData.discount).toFixed(2)}</td></tr>`:""}
          <tr class="total-row">
            <td><strong>Net Amount</strong></td>
            <td style="text-align:right"><strong>₹${parseFloat(billingData.netAmount||0).toFixed(2)}</strong></td>
          </tr>
          <tr><td>Payment Mode</td><td style="text-align:right">${displayPaymentMode}</td></tr>
        </tbody>
      </table>
      <p><strong>Amount Paid in Words:</strong> ${inWords}</p>
      <div class="signature">
        <div>Signature of Employee</div><div>${storedName}</div>
      </div></div>
    </div></body></html>`

    const win = window.open("","","width=1000,height=800")
    win.document.write(html)
    setTimeout(()=>{ win.document.close(); win.print(); win.close() }, 1000)
  }

  const handleUpdateBill = async () => {
    if (!isFormValid()) {
      if (billingData.paymentMethod === "Multiple Payment" && !isMultiplePaymentComplete())
        toast.error(`Remaining amount: ₹${getRemainingAmount().toFixed(2)}`)
      else toast.error("Please fill all required fields")
      return
    }
    setLoading(true)
    try {
      let paymentMethodData = {}
      let multiplePaymentData = []
      if (billingData.paymentMethod === "Multiple Payment") {
        multiplePaymentData = billingData.multiplePayments.map((p) => ({
          amount: p.amount.toString(), paymentMethod: p.paymentMethod, paymentDetails: p.paymentDetails||""
        }))
        paymentMethodData = { paymentmethod:"Multiple Payment" }
      } else {
        paymentMethodData = { paymentmethod:billingData.paymentMethod, paymentDetails:billingData.paymentDetails||"" }
      }
      const updateData = {
        bill_id:         selectedPatient._id?.$oid || selectedPatient._id || selectedPatient.id,
        patient_id:      selectedPatient.patient_id,
        date:            selectedPatient.date,
        testdetails:     selectedTests,
        totalAmount:     billingData.totalAmount.toString(),
        netAmount:       billingData.netAmount.toString(),
        discount:        billingData.discount.toString(),
        payment_method:  paymentMethodData,
        MultiplePayment: JSON.stringify(multiplePaymentData),
        credit_amount:   billingData.creditAmount.toString(),
        lastmodified_by: localStorage.getItem("name")||"system",
      }
      const response = await apiRequest(`${Labbaseurl}update_bill/`, "PUT", updateData)
      if (response && response.success !== false) {
        toast.success(`Bill updated! ${response.bill_no?"Bill No: "+response.bill_no:""}`)
        setTimeout(() => handlePrint(), 1000)
        setTimeout(() => {
          setSelectedPatient(null); resetBillingData(); setSearchValue(""); setCurrentPage("list")
          if (dateFilters.fromDate && dateFilters.toDate) fetchPatientsByDate()
        }, 3000)
      } else {
        toast.error(`Failed: ${response?.error||response?.message||"Unknown error"}`)
      }
    } catch { toast.error("Failed to update bill. Please try again.") }
    finally { setLoading(false) }
  }

  /* ════════════════════════════════════════════
     RENDER — LIST PAGE
  ════════════════════════════════════════════ */
  if (currentPage === "list") {
    return (
      <PageShell>
        <ScrollArea>
          <Container>
            <Header>
              <h1><FaUser /> Patient Billing Management</h1>
              <p>Select a patient to update their billing information</p>
            </Header>

            <PatientListContainer>
              {/* Filters */}
              <SearchAndFiltersContainer>
                <SearchContainer>
                  <FaSearch />
                  <input type="text" placeholder="Search by Patient ID, Name or Lab ID"
                    value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} />
                </SearchContainer>

                <FormGroup>
                  <label>Emergency Status</label>
                  <select value={emergencyFilter} onChange={(e)=>setEmergencyFilter(e.target.value)}>
                    <option value="all">All Patients</option>
                    <option value="emergency">Emergency Only</option>
                    <option value="normal">Normal Only</option>
                  </select>
                </FormGroup>

                <FormGroup>
                  <label>From Date</label>
                  <input type="date" value={dateFilters.fromDate}
                    onChange={(e)=>setDateFilters(p=>({...p,fromDate:e.target.value}))} />
                </FormGroup>

                <FormGroup>
                  <label>To Date</label>
                  <input type="date" value={dateFilters.toDate}
                    onChange={(e)=>setDateFilters(p=>({...p,toDate:e.target.value}))} />
                </FormGroup>
              </SearchAndFiltersContainer>

              {/* ── CHANGE 2: Pagination controls top ── */}
              <PaginationRow>
                <span className="info">
                  {loading ? "Loading…" : (
                    <>Showing <strong>{pagedPatients.length}</strong> of <strong>{filteredPatients.length}</strong> patients</>
                  )}
                </span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:13,color:"#475569",fontWeight:500}}>Show:</span>
                  <select value={recordsPerPage} onChange={(e)=>{setRecordsPerPage(Number(e.target.value));setListPage(1)}}>
                    <option value={10}>10 records</option>
                    <option value={20}>20 records</option>
                    <option value={50}>50 records</option>
                    <option value={100}>100 records</option>
                  </select>
                </div>
              </PaginationRow>

              {loading && <div style={{textAlign:"center",padding:"40px",color:"#6b7280"}}>Loading patients…</div>}

              {/* ── CHANGE 3: Horizontal scroll table ── */}
              {!loading && pagedPatients.length > 0 && (
                <TableWrapper>
                  <PatientTable>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th>Age/Gender</th>
                        <th>Status</th>
                        {/* ── CHANGE 1: Emergency column header ── */}
                        <th>Visit Type</th>
                        <th>Segment</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedPatients.map((patient, idx) => (
                        <tr key={idx}>
                          <td>{new Date(patient.date).toLocaleDateString()}</td>
                          <td><strong>{patient.patient_id}</strong></td>
                          <td>{patient.patientname}</td>
                          <td>{patient.age}/{patient.gender}</td>
                          <td><StatusBadge status={patient.status}>{patient.status}</StatusBadge></td>
                          {/* ── CHANGE 1: Emergency / Normal badge ── */}
                          <td>
                            <EmergencyBadge emergency={patient.is_emergency}>
                              {patient.is_emergency
                                ? <><AlertCircle size={12}/> Emergency</>
                                : <><CheckCircle size={12}/> Normal</>}
                            </EmergencyBadge>
                          </td>
                          <td>{patient.segment}</td>
                          <td>
                            <button className="select-btn"
                              onClick={()=>handlePatientSelect(patient)}
                              disabled={patient.status?.toLowerCase()==="billed"}>
                              {patient.status?.toLowerCase()==="billed" ? "Billed" : "Update"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </PatientTable>
                </TableWrapper>
              )}

              {!loading && filteredPatients.length === 0 && (
                <div style={{textAlign:"center",padding:"40px",color:"#6b7280"}}>
                  {patientsList.length > 0 ? "No patients match your search." : "No patients found for selected dates."}
                </div>
              )}

              {/* ── CHANGE 2: Pagination buttons ── */}
              {!loading && totalPages > 1 && (
                <PaginationRow style={{justifyContent:"center",marginTop:12}}>
                  <div className="controls">
                    <button onClick={()=>setListPage(1)} disabled={listPage===1}>First</button>
                    <button onClick={()=>setListPage(p=>Math.max(p-1,1))} disabled={listPage===1}>Prev</button>
                    {pageNumbers.map((n,i)=>{
                      const prev=pageNumbers[i-1]
                      return (
                        <span key={n} style={{display:"inline-flex",alignItems:"center",gap:4}}>
                          {prev&&n-prev>1&&<span style={{color:"#9ca3af",padding:"0 2px"}}>…</span>}
                          <button onClick={()=>setListPage(n)} className={listPage===n?"active":""}>{n}</button>
                        </span>
                      )
                    })}
                    <button onClick={()=>setListPage(p=>Math.min(p+1,totalPages))} disabled={listPage===totalPages}>Next</button>
                    <button onClick={()=>setListPage(totalPages)} disabled={listPage===totalPages}>Last</button>
                  </div>
                </PaginationRow>
              )}
            </PatientListContainer>
          </Container>
        </ScrollArea>
      </PageShell>
    )
  }

  /* ════════════════════════════════════════════
     RENDER — BILLING PAGE
  ════════════════════════════════════════════ */
  return (
    <PageShell>
      <ScrollArea>
        <Container>
          <BackButton onClick={()=>{ setCurrentPage("list"); resetBillingData() }}>
            <FaArrowLeft /> Back to Patients
          </BackButton>

          <Header>
            <h1><FaFlask /> Update Patient Billing</h1>
            <p>Update billing information for the selected patient</p>
          </Header>

          {selectedPatient && (
            <PatientInfo>
              <h2><FaUser /> Patient Information</h2>
              <div className="patient-details">
                {[
                  ["Patient ID",    selectedPatient.patient_id],
                  ["Name",          selectedPatient.patientname],
                  ["Age",           selectedPatient.age],
                  ["Gender",        selectedPatient.gender],
                  ["Segment",       selectedPatient.segment],
                  ...(selectedPatient.segment==="B2B"?[["Clinical Center",selectedPatient.B2B||"N/A"]]:[]),
                  ["Lab ID",        selectedPatient.lab_id],
                  ["Reference By",  selectedPatient.refby],
                  ["Branch",        selectedPatient.branch||"N/A"],
                  /* ── CHANGE 1: Visit type in patient info ── */
                  ["Visit Type",    selectedPatient.is_emergency ? "🚨 Emergency" : "✔ Normal"],
                ].map(([lbl,val])=>(
                  <div className="detail-item" key={lbl}>
                    <span className="label">{lbl}</span>
                    <span className="value">{val}</span>
                  </div>
                ))}
              </div>
            </PatientInfo>
          )}

          <BillingSection>
            <h3><FaFlask /> Billing Information</h3>

            {/* Test Search */}
            <FormRow>
              <FormGroup>
                <label>Test Name</label>
                <TestSearchContainer>
                  <input type="text" value={testSearchValue}
                    onChange={(e)=>handleTestSearch(e.target.value)}
                    placeholder="Search for tests…" />
                  {showTestDropdown && filteredTestOptions.length > 0 && (
                    <div className="dropdown">
                      {filteredTestOptions.map((test,i)=>(
                        <div key={i} className="dropdown-item" onClick={()=>handleTestSelect(test)}>
                          <div className="test-name">{test.test_name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </TestSearchContainer>
              </FormGroup>
            </FormRow>

            {/* Selected Tests */}
            {selectedTests.length > 0 && (
              <>
                <h4 style={{margin:"0 0 10px",color:"#374151"}}>Selected Tests ({selectedTests.length})</h4>
                <TestTable>
                  <thead>
                    <tr>
                      <th>Test Name</th>
                      <th>Container</th>
                      <th style={{textAlign:"right"}}>Amount (₹)</th>
                      <th style={{textAlign:"center"}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTests.map((test)=>(
                      <tr key={test.id}>
                        <td>{test.testname}</td>
                        <td>{test.collection_container||"N/A"}</td>
                        <td style={{textAlign:"right"}}>₹{test.amount.toFixed(2)}</td>
                        <td style={{textAlign:"center"}}>
                          <button className="remove-btn" onClick={()=>handleTestRemove(test.id)}>
                            <FaTrash size={13}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </TestTable>

                {/* ── CHANGE 5: Discount + Payment Method + Payment Details in ONE aligned row ── */}
                <PaymentRow>
                  <FormGroup>
                    <label>Discount</label>
                    <input type="text" value={billingData.discount}
                      onChange={(e)=>setBillingData(p=>({...p,discount:e.target.value}))}
                      placeholder="e.g. 10% or 50" />
                  </FormGroup>

                  <FormGroup>
                    <label>Payment Method *</label>
                    <select value={billingData.paymentMethod}
                      onChange={(e)=>setBillingData(p=>({...p,paymentMethod:e.target.value}))}>
                      <option value="">Select Method</option>
                      <option value="Cash">Cash</option>
                      {paymentOptions.credit && <option value="Credit">Credit</option>}
                      <option value="UPI">UPI</option>
                      <option value="NEFT">NEFT</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Multiple Payment">Multiple Payment</option>
                    </select>
                  </FormGroup>

                  <FormGroup>
                    <label>Payment Details</label>
                    <input type="text"
                      value={billingData.paymentDetails}
                      onChange={(e)=>setBillingData(p=>({...p,paymentDetails:e.target.value}))}
                      placeholder={
                        !billingData.paymentMethod || billingData.paymentMethod==="Cash" || billingData.paymentMethod==="Multiple Payment"
                        ? "N/A for this method" : "Enter reference / details"
                      }
                      disabled={!billingData.paymentMethod || billingData.paymentMethod==="Cash" || billingData.paymentMethod==="Multiple Payment"}
                      style={{ opacity: (!billingData.paymentMethod||billingData.paymentMethod==="Cash"||billingData.paymentMethod==="Multiple Payment") ? 0.45 : 1 }}
                    />
                  </FormGroup>
                </PaymentRow>

                {/* B2B warning */}
                {selectedPatient?.segment==="B2B" && !paymentOptions.credit && (
                  <PaymentValidationWarning>
                    ⚠️ Credit payment is disabled for this B2B patient (Cash type only)
                  </PaymentValidationWarning>
                )}

                {/* Multiple Payment */}
                {billingData.paymentMethod==="Multiple Payment" && (
                  <PaymentMethodSection>
                    <h4><FaCreditCard /> Multiple Payment Details</h4>
                    {getRemainingAmount()>0 && (
                      <PaymentValidationWarning>
                        ⚠️ Remaining: ₹{getRemainingAmount().toFixed(2)} — complete all payments before saving.
                      </PaymentValidationWarning>
                    )}
                    <FormRow>
                      <FormGroup>
                        <label>Amount *</label>
                        <input type="number" step="0.01" max={getRemainingAmount()}
                          value={currentMultiplePayment.amount}
                          onChange={(e)=>setCurrentMultiplePayment(p=>({...p,amount:e.target.value}))}
                          placeholder={`Max ₹${getRemainingAmount().toFixed(2)}`} />
                      </FormGroup>
                      <FormGroup>
                        <label>Method *</label>
                        <select value={currentMultiplePayment.paymentMethod}
                          onChange={(e)=>setCurrentMultiplePayment(p=>({...p,paymentMethod:e.target.value}))}>
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="NEFT">NEFT</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </FormGroup>
                      <FormGroup>
                        <label>Details</label>
                        <input type="text" value={currentMultiplePayment.paymentDetails}
                          onChange={(e)=>setCurrentMultiplePayment(p=>({...p,paymentDetails:e.target.value}))}
                          placeholder="Optional" />
                      </FormGroup>
                      <div style={{alignSelf:"end"}}>
                        <Button onClick={addMultiplePayment} variant="success" disabled={getRemainingAmount()<=0}>
                          <FaPlus/> Add
                        </Button>
                      </div>
                    </FormRow>

                    {billingData.multiplePayments.length>0 && (
                      <div style={{marginTop:16}}>
                        <h5 style={{margin:"0 0 12px",color:"#374151"}}>Added ({billingData.multiplePayments.length}):</h5>
                        {billingData.multiplePayments.map((p)=>(
                          <MultiplePaymentItem key={p.id}>
                            <div className="payment-info">
                              <div>
                                <span className="amount">₹{p.amount.toFixed(2)}</span>
                                <span className="method">— {p.paymentMethod}</span>
                              </div>
                              {p.paymentDetails&&<div className="details">{p.paymentDetails}</div>}
                            </div>
                            <Button variant="danger" size="sm" onClick={()=>removeMultiplePayment(p.id)}>
                              <FaTrash/>
                            </Button>
                          </MultiplePaymentItem>
                        ))}
                        <div style={{textAlign:"right",fontWeight:600,color:"#1e293b",marginTop:8}}>
                          Total: ₹{billingData.multiplePayments.reduce((s,p)=>s+p.amount,0).toFixed(2)}
                        </div>
                      </div>
                    )}
                  </PaymentMethodSection>
                )}

                {/* Amount Summary */}
                <AmountSummary>
                  <h4>Amount Summary</h4>
                  {[
                    ["Total Amount", `₹${billingData.totalAmount.toFixed(2)}`],
                    ["Discount", `₹${(typeof billingData.discount==="string"&&billingData.discount.includes("%")
                      ?(billingData.totalAmount*parseFloat(billingData.discount))/100
                      :parseFloat(billingData.discount)||0).toFixed(2)}`],
                    ["Net Amount", `₹${billingData.netAmount.toFixed(2)}`],
                  ].map(([l,v])=>(
                    <div className="summary-row" key={l}>
                      <span className="label">{l}:</span>
                      <span className="value">{v}</span>
                    </div>
                  ))}
                  {billingData.creditAmount>0&&(
                    <div className="summary-row" style={{color:"#ef4444",fontWeight:600}}>
                      <span className="label">Credit Amount:</span>
                      <span className="value">₹{billingData.creditAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {billingData.paymentMethod==="Multiple Payment"&&(
                    <>
                      <div className="summary-row">
                        <span className="label">Total Paid:</span>
                        <span className="value">₹{billingData.multiplePayments.reduce((s,p)=>s+p.amount,0).toFixed(2)}</span>
                      </div>
                      <div className="summary-row" style={{color:getRemainingAmount()>0?"#ef4444":"#10b981",fontWeight:600}}>
                        <span className="label">Remaining:</span>
                        <span className="value">₹{getRemainingAmount().toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </AmountSummary>

                <div style={{textAlign:"center",marginTop:24}}>
                  <Button variant="primary" onClick={handleUpdateBill}
                    disabled={!isFormValid()||loading}
                    style={{fontSize:15,padding:"13px 28px"}}>
                    <FaSave/> {loading ? "Saving…" : "Save"}
                  </Button>
                </div>
              </>
            )}
          </BillingSection>

          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}/>
        </Container>
      </ScrollArea>
    </PageShell>
  )
}

export default PatientBilling