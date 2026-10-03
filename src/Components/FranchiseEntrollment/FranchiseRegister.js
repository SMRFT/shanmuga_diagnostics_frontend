// src/Components/FranchiseEntrollment/FranchiseRegister.js
import React, { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import Select from "react-select"
import apiRequest from "../Auth/apiRequest"
import "bootstrap/dist/css/bootstrap.min.css"
import {
  GlobalStyle,
  Container as GlobalContainer,
  PageBackground,
} from "./GlobalStyle"
import {
  Building2,
  Phone,
  UserCheck,
  FileUp,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Check,
  X,
  ShieldCheck,
  Lock,
  IndianRupee,
  Sparkles,
} from "lucide-react"

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const toastSlideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
  }
`

const toastSlideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`

const progressBar = keyframes`
  from { width: 100%; }
  to { width: 0%; }
`

// Layout Components
const Container = styled(PageBackground)`
  padding: 1.5rem 0 3rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8faff 0%, #f1f5f9 100%);
  font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`

const MainCard = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 2.25rem 2.5rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03);
  border-radius: 20px;
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 14px;
    margin: 0 0.5rem;
  }
`

// Header Section
const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.75rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 1rem;
`

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

const BadgeTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%);
  color: #6366f1;
  width: fit-content;
  border: 1px solid #e0e7ff;
`

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`

const PageSubtitle = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  font-weight: 400;
`

// Form Card Sections - Clear, highly visible containers with signature dashed accent
const FormSection = styled.div`
  background: #ffffff;
  border: 1.5px dashed #f093fb;
  border-radius: 14px;
  padding: 1.5rem 1.75rem;
  margin-bottom: 1.5rem;
  transition: all 0.25s ease;
  box-shadow: 0 4px 16px rgba(240, 147, 251, 0.08);

  &:hover {
    border-color: #d946ef;
    box-shadow: 0 6px 20px -4px rgba(217, 70, 239, 0.16);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1.5px dashed rgba(240, 147, 251, 0.45);
`

const SectionIconBox = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #764ba2;
  border: 1px solid #f0abfc;
  flex-shrink: 0;
`

const SectionTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const SectionTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #764ba2;
  margin: 0;
  letter-spacing: -0.01em;
`

const SectionSubtitle = styled.span`
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 400;
`

// Field Components
const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`

const FieldLabel = styled.label`
  font-size: 0.82rem;
  font-weight: 600;
  color: #4c51bf;
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .req {
    color: #ef4444;
    margin-left: 3px;
  }
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const StyledInput = styled.input`
  width: 100%;
  height: 44px;
  border: 1.5px solid ${(props) => (props.isInvalid ? "#ef4444" : "#e1e8ff")};
  border-radius: 10px;
  padding: 0 14px;
  font-size: 14px;
  font-weight: 500;
  background: ${(props) => (props.readOnly ? "#f8fafc" : "#ffffff")};
  color: ${(props) => (props.readOnly ? "#64748b" : "#1e293b")};
  transition: all 0.2s ease;

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border-color: ${(props) => (props.isInvalid ? "#ef4444" : "#667eea")};
    box-shadow: 0 0 0 3px
      ${(props) => (props.isInvalid ? "rgba(239, 68, 68, 0.15)" : "rgba(102, 126, 234, 0.15)")};
    background: #ffffff;
  }

  &:hover:not(:focus):not([readonly]) {
    border-color: ${(props) => (props.isInvalid ? "#ef4444" : "#c7d2fe")};
  }

  &[readonly] {
    cursor: not-allowed;
    border-color: #e2e8f0;
  }
`

const ReadOnlyBadge = styled.span`
  position: absolute;
  right: 12px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #e2e8f0;
  padding: 2px 8px;
  border-radius: 6px;
  pointer-events: none;
`

const StyledSelect = styled.select`
  width: 100%;
  height: 44px;
  border: 1.5px solid ${(props) => (props.isInvalid ? "#ef4444" : "#e1e8ff")};
  border-radius: 10px;
  padding: 0 14px;
  font-size: 14px;
  font-weight: 500;
  background: #ffffff;
  color: #1e293b;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.isInvalid ? "#ef4444" : "#667eea")};
    box-shadow: 0 0 0 3px
      ${(props) => (props.isInvalid ? "rgba(239, 68, 68, 0.15)" : "rgba(102, 126, 234, 0.15)")};
  }

  &:hover:not(:focus) {
    border-color: ${(props) => (props.isInvalid ? "#ef4444" : "#c7d2fe")};
  }

  option {
    color: #1e293b;
    padding: 8px;
  }
`

const ValidationError = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ef4444;
  font-size: 0.76rem;
  margin-top: 0.35rem;
  font-weight: 500;
`

// Modern File Upload Box
const FileUploadContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`

const HiddenFileInput = styled.input`
  display: none;
`

const UploadBox = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.1rem 0.75rem;
  border: 1.5px dashed ${(props) => (props.isInvalid ? "#ef4444" : props.hasFile ? "#10b981" : "#d8b4fe")};
  border-radius: 12px;
  background: ${(props) => (props.isInvalid ? "#fef2f2" : props.hasFile ? "#f0fdf4" : "rgba(243, 232, 255, 0.35)")};
  cursor: pointer;
  transition: all 0.25s ease;
  min-height: 110px;
  text-align: center;

  &:hover {
    border-color: ${(props) => (props.hasFile ? "#059669" : "#a855f7")};
    background: ${(props) => (props.hasFile ? "#ecfdf5" : "rgba(243, 232, 255, 0.65)")};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.12);
  }
`

const UploadIconCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => (props.hasFile ? "#dcfce7" : "rgba(240, 147, 251, 0.2)")};
  color: ${(props) => (props.hasFile ? "#16a34a" : "#764ba2")};
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
`

const UploadDocTitle = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
`

const UploadHint = styled.span`
  font-size: 0.72rem;
  color: #64748b;
`

const FilePill = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  background: #ffffff;
  border: 1px solid #dcfce7;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`

const FilePillName = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
`

const RemoveFileBtn = styled.button`
  background: #fee2e2;
  border: none;
  color: #ef4444;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    background: #ef4444;
    color: #ffffff;
  }
`

// Modern Payment Mode Components
const PaymentCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const PaymentOptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  background: ${(props) => (props.checked ? "linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)" : "rgba(243, 232, 255, 0.25)")};
  border: 1.5px dashed ${(props) => (props.checked ? "#c026d3" : "#f093fb")};
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) => (props.checked ? "0 4px 15px rgba(217, 70, 239, 0.15)" : "none")};
`

const CheckboxOptionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  user-select: none;
`

const CustomCheckbox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 7px;
  border: 2px solid ${(props) => (props.checked ? "#6366f1" : "#94a3b8")};
  background: ${(props) => (props.checked ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "#ffffff")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  transition: all 0.25s ease;
  box-shadow: ${(props) => (props.checked ? "0 2px 8px rgba(99, 102, 241, 0.35)" : "none")};
  flex-shrink: 0;

  &:hover {
    border-color: #6366f1;
    transform: scale(1.05);
  }
`

const OptionTextCol = styled.div`
  display: flex;
  flex-direction: column;
`

const OptionTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const OptionDesc = styled.span`
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 2px;
`

const AmountDisplayCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #ffffff;
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  border: 1px solid #d8b4fe;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.08);
  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: 576px) {
    width: 100%;
    justify-content: space-between;
  }
`

const AmountLabel = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: #475569;
`

const AmountValueBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 1.15rem;
  font-weight: 800;
  color: #6d28d9;
  background: #f5f3ff;
  padding: 0.3rem 0.85rem;
  border-radius: 8px;
  border: 1px solid #e9d5ff;
`

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  background: ${(props) => (props.active ? "#dcfce7" : "#f1f5f9")};
  color: ${(props) => (props.active ? "#15803d" : "#64748b")};
  border: 1px solid ${(props) => (props.active ? "#bbf7d0" : "#e2e8f0")};
`

// Submit Button Component
const SubmitArea = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
`

const PrimarySubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, #6366f1 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  padding: 0.95rem 3rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px -4px rgba(99, 102, 241, 0.4);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #4f46e5 0%, #6b21a8 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 30px -4px rgba(99, 102, 241, 0.5);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

// Toast Notification Styles
const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Toast = styled.div`
  display: flex;
  align-items: center;
  min-width: 340px;
  padding: 14px 18px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  animation: ${(props) => (props.isExiting ? toastSlideOut : toastSlideIn)} 0.3s ease-out;
  position: relative;
  overflow: hidden;
  background: ${(props) =>
    props.type === "success"
      ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
      : "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)"};
  color: white;

  @media (max-width: 480px) {
    min-width: calc(100vw - 32px);
    margin: 0 8px;
  }
`

const ToastIcon = styled.div`
  margin-right: 12px;
  font-size: 20px;
  display: flex;
  align-items: center;
`

const ToastContent = styled.div`
  flex: 1;
`

const ToastTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 2px;
`

const ToastMessage = styled.div`
  font-size: 13px;
  opacity: 0.95;
  line-height: 1.35;
`

const ToastCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  margin-left: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.15);
  }
`

const ToastProgress = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.4);
  animation: ${progressBar} ${(props) => props.duration}ms linear;
`

// React Select Styling
const customSelectStyles = (isInvalid) => ({
  control: (provided, state) => ({
    ...provided,
    height: "44px",
    minHeight: "44px",
    border: `1.5px solid ${isInvalid ? "#ef4444" : state.isFocused ? "#667eea" : "#e1e8ff"}`,
    borderRadius: "10px",
    padding: "0 4px",
    fontSize: "14px",
    fontWeight: 500,
    background: "#ffffff",
    boxShadow: state.isFocused
      ? isInvalid
        ? "0 0 0 3px rgba(239, 68, 68, 0.15)"
        : "0 0 0 3px rgba(102, 126, 234, 0.15)"
      : "none",
    "&:hover": {
      borderColor: isInvalid ? "#ef4444" : "#c7d2fe",
    },
    cursor: "pointer",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#94a3b8",
    fontWeight: 400,
    fontSize: "14px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1e293b",
    fontWeight: 500,
    fontSize: "14px",
  }),
  input: (provided) => ({
    ...provided,
    color: "#1e293b",
    fontWeight: 500,
    fontSize: "14px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#6366f1"
      : state.isFocused
      ? "#f1f5f9"
      : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#1e293b",
    fontWeight: 500,
    fontSize: "14px",
    cursor: "pointer",
    padding: "10px 14px",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "10px",
    zIndex: 9999,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
})

const FranchiseRegister = () => {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  const getCurrentDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const currentDate = getCurrentDate()

  const [formData, setFormData] = useState({
    franchise_id: "",
    franchise_name: "",
    location_id: "",
    location: "",
    contact_no: "",
    email: "",
    alt_number: "",
    address: "",
    qualification: "",
    age: 0,
    gender: "",
    pincode: "",
    dob: currentDate,
    initialpayment: "No",
  })

  // File states
  const [aadhaarFile, setAadhaarFile] = useState(null)
  const [panFile, setPanFile] = useState(null)
  const [paymentFile, setPaymentFile] = useState(null)
  const [agreementFile, setAgreementFile] = useState(null)
  const [franchisePhotoFile, setFranchisePhotoFile] = useState(null)

  const [toasts, setToasts] = useState([])
  const [locations, setLocations] = useState([])
  const [franchiseFeeChecked, setFranchiseFeeChecked] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchNextFranchiseId = async () => {
    try {
      const idResponse = await apiRequest(`${Labbaseurl}getnextfranchiseid/`, "GET")
      if (idResponse.success && idResponse.data?.franchise_id) {
        setFormData((prev) => ({
          ...prev,
          franchise_id: idResponse.data.franchise_id,
        }))
      }
    } catch (err) {
      console.error("Error fetching next franchise ID:", err)
    }
  }

  useEffect(() => {
    fetchNextFranchiseId()
  }, [])

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await apiRequest(`${Labbaseurl}getactivelocations/`, "GET")
        if (response.success) {
          setLocations(response.data || [])
        } else {
          console.error("Error fetching franchise locations:", response.error)
          showToast("error", "Error", "Failed to fetch franchise locations")
        }
      } catch (error) {
        console.error("Error fetching franchise locations:", error)
        showToast("error", "Error", "Network error while fetching locations")
      }
    }

    fetchLocations()
  }, [])

  const showToast = (type, title, message) => {
    const id = Date.now()
    const newToast = { id, type, title, message, isExiting: false }
    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, isExiting: true } : toast)))
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 300)
  }

  // Validation function
  const validateForm = () => {
    const errors = {}

    // Basic Information
    if (!formData.franchise_name.trim()) {
      errors.franchise_name = "Franchise name is required"
    }
    if (!formData.location) {
      errors.location = "Cluster name is required"
    }
    if (!formData.pincode.trim()) {
      errors.pincode = "Pincode is required"
    }

    // Contact Details
    if (!formData.contact_no.trim()) {
      errors.contact_no = "Primary contact is required"
    }
    if (!formData.email.trim()) {
      errors.email = "Email address is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid"
    }
    if (!formData.address.trim()) {
      errors.address = "Full address is required"
    }

    // Personal Information
    if (!formData.dob) {
      errors.dob = "Date of birth is required"
    }
    if (!formData.age || formData.age <= 0) {
      errors.age = "Valid age is required"
    }
    if (!formData.gender) {
      errors.gender = "Gender is required"
    }
    if (!formData.qualification.trim()) {
      errors.qualification = "Educational qualification is required"
    }

    // Document Upload
    if (!aadhaarFile) {
      errors.aadhaarFile = "Aadhaar proof is required"
    }
    if (!panFile) {
      errors.panFile = "PAN card proof is required"
    }
    if (!paymentFile) {
      errors.paymentFile = "Payment receipt is required"
    }
    if (!agreementFile) {
      errors.agreementFile = "Agreement document is required"
    }
    if (!franchisePhotoFile) {
      errors.franchisePhotoFile = "Franchise photo is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleLocationChange = (selectedOption) => {
    const selectedId = selectedOption ? selectedOption.value : ""
    setFormData((prev) => ({
      ...prev,
      location: selectedId,
      location_id: selectedId,
    }))

    if (validationErrors.location) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.location
        return newErrors
      })
    }
  }

  const calculateAge = (dob) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const calculateDOBFromAge = (age) => {
    const today = new Date()
    const birthYear = today.getFullYear() - age
    const month = today.getMonth()
    const day = today.getDate()
    const dob = new Date(birthYear, month, day)
    return dob.toISOString().split("T")[0]
  }

  const handleDOBChange = (e) => {
    const dob = e.target.value
    const age = calculateAge(dob)
    setFormData({ ...formData, dob, age })

    if (validationErrors.dob) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.dob
        return newErrors
      })
    }
  }

  const handleAgeChange = (e) => {
    const age = Number.parseInt(e.target.value) || 0
    const dob = calculateDOBFromAge(age)
    setFormData({ ...formData, age, dob })

    if (validationErrors.age) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.age
        return newErrors
      })
    }
  }

  // File handlers
  const handleAadhaarFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAadhaarFile(e.target.files[0])
      if (validationErrors.aadhaarFile) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.aadhaarFile
          return newErrors
        })
      }
    }
  }

  const handlePanFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPanFile(e.target.files[0])
      if (validationErrors.panFile) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.panFile
          return newErrors
        })
      }
    }
  }

  const handlePaymentFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentFile(e.target.files[0])
      if (validationErrors.paymentFile) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.paymentFile
          return newErrors
        })
      }
    }
  }

  const handleAgreementFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAgreementFile(e.target.files[0])
      if (validationErrors.agreementFile) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.agreementFile
          return newErrors
        })
      }
    }
  }

  const handleFranchisePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFranchisePhotoFile(e.target.files[0])
      if (validationErrors.franchisePhotoFile) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.franchisePhotoFile
          return newErrors
        })
      }
    }
  }

  // File removal handlers
  const removeAadhaarFile = () => {
    setAadhaarFile(null)
    const el = document.getElementById("aadhaar-upload")
    if (el) el.value = ""
  }

  const removePanFile = () => {
    setPanFile(null)
    const el = document.getElementById("pan-upload")
    if (el) el.value = ""
  }

  const removePaymentFile = () => {
    setPaymentFile(null)
    const el = document.getElementById("payment-upload")
    if (el) el.value = ""
  }

  const removeAgreementFile = () => {
    setAgreementFile(null)
    const el = document.getElementById("agreement-upload")
    if (el) el.value = ""
  }

  const removeFranchisePhotoFile = () => {
    setFranchisePhotoFile(null)
    const el = document.getElementById("franchise-photo-upload")
    if (el) el.value = ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!validateForm()) {
      setIsSubmitting(false)
      showToast("error", "Validation Error", "Please fill in all required fields and upload all documents.")
      return
    }

    const data = new FormData()

    const updatedFormData = {
      ...formData,
      location_id: formData.location || formData.location_id,
      initialpayment: franchiseFeeChecked ? "10000" : "No",
    }

    for (const key in updatedFormData) {
      if (key !== "paymentmethod" && key !== "paymentmode") {
        data.append(key, updatedFormData[key])
      }
    }

    // Append files
    if (aadhaarFile) data.append("aadhaar_proof", aadhaarFile)
    if (panFile) data.append("pan_proof", panFile)
    if (paymentFile) data.append("payment_proof", paymentFile)
    if (agreementFile) data.append("agreement_proof", agreementFile)
    if (franchisePhotoFile) data.append("franchise_photo", franchisePhotoFile)

    try {
      const response = await apiRequest(`${Labbaseurl}franchiseregister/`, "POST", data, {
        "Content-Type": "multipart/form-data",
      })

      if (response.success) {
        showToast("success", "Registration Successful!", "Franchise partner has been successfully enrolled.")

        // Reset form
        setFormData({
          franchise_id: "",
          franchise_name: "",
          location_id: "",
          location: "",
          contact_no: "",
          email: "",
          alt_number: "",
          address: "",
          qualification: "",
          age: 0,
          gender: "",
          pincode: "",
          dob: currentDate,
          initialpayment: "No",
        })

        fetchNextFranchiseId()

        // Reset files
        setAadhaarFile(null)
        setPanFile(null)
        setPaymentFile(null)
        setAgreementFile(null)
        setFranchisePhotoFile(null)

        const fileInputs = document.querySelectorAll('input[type="file"]')
        fileInputs.forEach((input) => (input.value = ""))

        setFranchiseFeeChecked(false)
        setValidationErrors({})
      } else {
        const errorMessage = response.data?.message || response.error || "Registration failed"
        showToast("error", "Registration Failed", errorMessage)
        console.error("API Error:", response.data || response.error)
      }
    } catch (error) {
      console.error("Catch block error:", error)
      const errorMessage =
        error.response?.data?.message || error.message || "Network error or unexpected issue occurred during registration."
      showToast("error", "Registration Failed", errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <GlobalStyle />
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} type={toast.type} isExiting={toast.isExiting}>
            <ToastIcon>{toast.type === "success" ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}</ToastIcon>
            <ToastContent>
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastMessage>{toast.message}</ToastMessage>
            </ToastContent>
            <ToastCloseButton onClick={() => removeToast(toast.id)}>
              <X size={16} />
            </ToastCloseButton>
            <ToastProgress duration={5000} />
          </Toast>
        ))}
      </ToastContainer>

      <Container>
        <GlobalContainer>
          <MainCard>
            {/* Page Header */}
            <PageHeader>
              <HeaderLeft>
                <BadgeTag>
                  <Sparkles size={13} />
                  Franchise Network
                </BadgeTag>
                <PageTitle>
                  Franchise Enrollment
                </PageTitle>
                <PageSubtitle>
                  Register and onboard an authorized collection center franchise partner
                </PageSubtitle>
              </HeaderLeft>
            </PageHeader>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Section 1: Basic Information */}
              <FormSection>
                <SectionHeader>
                  <SectionIconBox>
                    <Building2 size={20} />
                  </SectionIconBox>
                  <SectionTitleGroup>
                    <SectionTitle>Basic Information</SectionTitle>
                    <SectionSubtitle>Franchise identification, cluster mapping & location details</SectionSubtitle>
                  </SectionTitleGroup>
                </SectionHeader>

                <div className="row">
                  <div className="col-lg-3 col-md-6">
                    <FieldGroup>
                      <FieldLabel>
                        Franchise ID
                        <ReadOnlyBadge>
                          <Lock size={11} /> Auto
                        </ReadOnlyBadge>
                      </FieldLabel>
                      <InputWrapper>
                        <StyledInput
                          name="franchise_id"
                          placeholder="Franchise ID"
                          value={formData.franchise_id}
                          readOnly
                        />
                      </InputWrapper>
                    </FieldGroup>
                  </div>

                  <div className="col-lg-3 col-md-6">
                    <FieldGroup>
                      <FieldLabel>
                        Franchise Name <span className="req">*</span>
                      </FieldLabel>
                      <StyledInput
                        name="franchise_name"
                        placeholder="e.g. Shanmuga Anna Nagar"
                        value={formData.franchise_name}
                        onChange={handleChange}
                        isInvalid={validationErrors.franchise_name}
                      />
                      {validationErrors.franchise_name && (
                        <ValidationError>
                          <AlertCircle size={13} />
                          {validationErrors.franchise_name}
                        </ValidationError>
                      )}
                    </FieldGroup>
                  </div>

                  <div className="col-lg-3 col-md-6">
                    <FieldGroup>
                      <FieldLabel>
                        Cluster Name <span className="req">*</span>
                      </FieldLabel>
                      <Select
                        name="location"
                        value={
                          locations
                            .map((loc) => ({
                              value: loc.location_id,
                              label: loc.District ? `${loc.Cluster_Name} (${loc.District})` : loc.Cluster_Name,
                              Cluster_Name: loc.Cluster_Name,
                            }))
                            .find((opt) => opt.value === formData.location) || null
                        }
                        onChange={handleLocationChange}
                        options={locations.map((loc) => ({
                          value: loc.location_id,
                          label: loc.District ? `${loc.Cluster_Name} (${loc.District})` : loc.Cluster_Name,
                          Cluster_Name: loc.Cluster_Name,
                        }))}
                        placeholder="Select Cluster *"
                        isClearable
                        isSearchable
                        styles={customSelectStyles(validationErrors.location)}
                        noOptionsMessage={() => "No cluster found"}
                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                      />
                      {validationErrors.location && (
                        <ValidationError>
                          <AlertCircle size={13} />
                          {validationErrors.location}
                        </ValidationError>
                      )}
                    </FieldGroup>
                  </div>

                  <div className="col-lg-3 col-md-6">
                    <FieldGroup>
                      <FieldLabel>
                        Pincode <span className="req">*</span>
                      </FieldLabel>
                      <StyledInput
                        name="pincode"
                        placeholder="6-digit pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        maxLength={6}
                        isInvalid={validationErrors.pincode}
                      />
                      {validationErrors.pincode && (
                        <ValidationError>
                          <AlertCircle size={13} />
                          {validationErrors.pincode}
                        </ValidationError>
                      )}
                    </FieldGroup>
                  </div>
                </div>
              </FormSection>

              {/* Section 2: Contact Details */}
              <FormSection>
                <SectionHeader>
                  <SectionIconBox>
                    <Phone size={20} />
                  </SectionIconBox>
                  <SectionTitleGroup>
                    <SectionTitle>Contact Details</SectionTitle>
                    <SectionSubtitle>Official communication channels and operating address</SectionSubtitle>
                  </SectionTitleGroup>
                </SectionHeader>

                <div className="row">
                  <div className="col-lg-3 col-md-6">
                    <FieldGroup>
                      <FieldLabel>
                        Primary Contact <span className="req">*</span>
                      </FieldLabel>
                      <StyledInput
                        name="contact_no"
                        placeholder="10-digit mobile number"
                        value={formData.contact_no}
                        onChange={handleChange}
                        maxLength={15}
                        isInvalid={validationErrors.contact_no}
                      />
                      {validationErrors.contact_no && (
                        <ValidationError>
                          <AlertCircle size={13} />
                          {validationErrors.contact_no}
                        </ValidationError>
                      )}
                    </FieldGroup>
                  </div>

                  <div className="col-lg-3 col-md-6">
                    <FieldGroup>
                      <FieldLabel>Alternative Contact</FieldLabel>
                      <StyledInput
                        name="alt_number"
                        placeholder="Secondary contact (optional)"
                        value={formData.alt_number}
                        onChange={handleChange}
                        maxLength={15}
                      />
                    </FieldGroup>
                  </div>

                  <div className="col-lg-3 col-md-6">
                    <FieldGroup>
                      <FieldLabel>
                        Email Address <span className="req">*</span>
                      </FieldLabel>
                      <StyledInput
                        name="email"
                        type="email"
                        placeholder="franchise@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={validationErrors.email}
                      />
                      {validationErrors.email && (
                        <ValidationError>
                          <AlertCircle size={13} />
                          {validationErrors.email}
                        </ValidationError>
                      )}
                    </FieldGroup>
                  </div>

                  <div className="col-lg-3 col-md-6">
                    <FieldGroup>
                      <FieldLabel>
                        Full Address <span className="req">*</span>
                      </FieldLabel>
                      <StyledInput
                        name="address"
                        placeholder="Building, street, landmark"
                        value={formData.address}
                        onChange={handleChange}
                        isInvalid={validationErrors.address}
                      />
                      {validationErrors.address && (
                        <ValidationError>
                          <AlertCircle size={13} />
                          {validationErrors.address}
                        </ValidationError>
                      )}
                    </FieldGroup>
                  </div>
                </div>
              </FormSection>

              {/* Section 3: Personal Information */}
              <FormSection>
                <SectionHeader>
                  <SectionIconBox>
                    <UserCheck size={20} />
                  </SectionIconBox>
                  <SectionTitleGroup>
                    <SectionTitle>Franchise Incharge Information</SectionTitle>
                    <SectionSubtitle>Partner personal background, age and qualifications</SectionSubtitle>
                  </SectionTitleGroup>
                </SectionHeader>

                <div className="row">
                  <div className="col-lg-3 col-md-6">
                    <FieldGroup>
                      <FieldLabel>
                        Date of Birth <span className="req">*</span>
                      </FieldLabel>
                      <StyledInput
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleDOBChange}
                        isInvalid={validationErrors.dob}
                      />
                      {validationErrors.dob && (
                        <ValidationError>
                          <AlertCircle size={13} />
                          {validationErrors.dob}
                        </ValidationError>
                      )}
                    </FieldGroup>
                  </div>

                  <div className="col-lg-3 col-md-6">
                    <FieldGroup>
                      <FieldLabel>
                        Age <span className="req">*</span>
                      </FieldLabel>
                      <StyledInput
                        name="age"
                        type="number"
                        min="18"
                        max="120"
                        placeholder="Calculated or input age"
                        value={formData.age || ""}
                        onChange={handleAgeChange}
                        isInvalid={validationErrors.age}
                      />
                      {validationErrors.age && (
                        <ValidationError>
                          <AlertCircle size={13} />
                          {validationErrors.age}
                        </ValidationError>
                      )}
                    </FieldGroup>
                  </div>

                  <div className="col-lg-3 col-md-6">
                    <FieldGroup>
                      <FieldLabel>
                        Gender <span className="req">*</span>
                      </FieldLabel>
                      <StyledSelect
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        isInvalid={validationErrors.gender}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </StyledSelect>
                      {validationErrors.gender && (
                        <ValidationError>
                          <AlertCircle size={13} />
                          {validationErrors.gender}
                        </ValidationError>
                      )}
                    </FieldGroup>
                  </div>

                  <div className="col-lg-3 col-md-6">
                    <FieldGroup>
                      <FieldLabel>
                        Qualification <span className="req">*</span>
                      </FieldLabel>
                      <StyledInput
                        name="qualification"
                        placeholder="e.g. B.Sc MLT, B.Pharm, DMLT"
                        value={formData.qualification}
                        onChange={handleChange}
                        isInvalid={validationErrors.qualification}
                      />
                      {validationErrors.qualification && (
                        <ValidationError>
                          <AlertCircle size={13} />
                          {validationErrors.qualification}
                        </ValidationError>
                      )}
                    </FieldGroup>
                  </div>
                </div>
              </FormSection>

              {/* Section 4: Document Upload */}
              <FormSection>
                <SectionHeader>
                  <SectionIconBox>
                    <FileUp size={20} />
                  </SectionIconBox>
                  <SectionTitleGroup>
                    <SectionTitle>Document Verification & Proofs</SectionTitle>
                    <SectionSubtitle>Upload official identification, certificates and store photographs</SectionSubtitle>
                  </SectionTitleGroup>
                </SectionHeader>

                <div className="row g-3">
                  {/* Aadhaar Upload */}
                  <div className="col-lg col-md-6">
                    <FileUploadContainer>
                      <HiddenFileInput
                        type="file"
                        id="aadhaar-upload"
                        onChange={handleAadhaarFileChange}
                        accept="image/*,application/pdf"
                      />
                      <UploadBox
                        htmlFor="aadhaar-upload"
                        isInvalid={validationErrors.aadhaarFile}
                        hasFile={Boolean(aadhaarFile)}
                      >
                        <UploadIconCircle hasFile={Boolean(aadhaarFile)}>
                          {aadhaarFile ? <Check size={18} /> : <UploadCloud size={18} />}
                        </UploadIconCircle>
                        <UploadDocTitle>Aadhaar Proof *</UploadDocTitle>
                        <UploadHint>{aadhaarFile ? "File selected" : "Click to browse"}</UploadHint>
                      </UploadBox>
                      {aadhaarFile && (
                        <FilePill>
                          <FilePillName title={aadhaarFile.name}>{aadhaarFile.name}</FilePillName>
                          <RemoveFileBtn onClick={removeAadhaarFile} type="button" title="Remove file">
                            ✕
                          </RemoveFileBtn>
                        </FilePill>
                      )}
                      {validationErrors.aadhaarFile && (
                        <ValidationError>
                          <AlertCircle size={13} />
                          {validationErrors.aadhaarFile}
                        </ValidationError>
                      )}
                    </FileUploadContainer>
                  </div>

                  {/* PAN Upload */}
                  <div className="col-lg col-md-6">
                    <FileUploadContainer>
                      <HiddenFileInput
                        type="file"
                        id="pan-upload"
                        onChange={handlePanFileChange}
                        accept="image/*,application/pdf"
                      />
                      <UploadBox
                        htmlFor="pan-upload"
                        isInvalid={validationErrors.panFile}
                        hasFile={Boolean(panFile)}
                      >
                        <UploadIconCircle hasFile={Boolean(panFile)}>
                          {panFile ? <Check size={18} /> : <UploadCloud size={18} />}
                        </UploadIconCircle>
                        <UploadDocTitle>PAN Card Proof *</UploadDocTitle>
                        <UploadHint>{panFile ? "File selected" : "Click to browse"}</UploadHint>
                      </UploadBox>
                      {panFile && (
                        <FilePill>
                          <FilePillName title={panFile.name}>{panFile.name}</FilePillName>
                          <RemoveFileBtn onClick={removePanFile} type="button" title="Remove file">
                            ✕
                          </RemoveFileBtn>
                        </FilePill>
                      )}
                      {validationErrors.panFile && (
                        <ValidationError>
                          <AlertCircle size={13} />
                          {validationErrors.panFile}
                        </ValidationError>
                      )}
                    </FileUploadContainer>
                  </div>

                  {/* Payment Receipt */}
                  <div className="col-lg col-md-6">
                    <FileUploadContainer>
                      <HiddenFileInput
                        type="file"
                        id="payment-upload"
                        onChange={handlePaymentFileChange}
                        accept="image/*,application/pdf"
                      />
                      <UploadBox
                        htmlFor="payment-upload"
                        isInvalid={validationErrors.paymentFile}
                        hasFile={Boolean(paymentFile)}
                      >
                        <UploadIconCircle hasFile={Boolean(paymentFile)}>
                          {paymentFile ? <Check size={18} /> : <UploadCloud size={18} />}
                        </UploadIconCircle>
                        <UploadDocTitle>Payment Receipt *</UploadDocTitle>
                        <UploadHint>{paymentFile ? "File selected" : "Click to browse"}</UploadHint>
                      </UploadBox>
                      {paymentFile && (
                        <FilePill>
                          <FilePillName title={paymentFile.name}>{paymentFile.name}</FilePillName>
                          <RemoveFileBtn onClick={removePaymentFile} type="button" title="Remove file">
                            ✕
                          </RemoveFileBtn>
                        </FilePill>
                      )}
                      {validationErrors.paymentFile && (
                        <ValidationError>
                          <AlertCircle size={13} />
                          {validationErrors.paymentFile}
                        </ValidationError>
                      )}
                    </FileUploadContainer>
                  </div>

                  {/* Agreement Document */}
                  <div className="col-lg col-md-6">
                    <FileUploadContainer>
                      <HiddenFileInput
                        type="file"
                        id="agreement-upload"
                        onChange={handleAgreementFileChange}
                        accept="image/*,application/pdf"
                      />
                      <UploadBox
                        htmlFor="agreement-upload"
                        isInvalid={validationErrors.agreementFile}
                        hasFile={Boolean(agreementFile)}
                      >
                        <UploadIconCircle hasFile={Boolean(agreementFile)}>
                          {agreementFile ? <Check size={18} /> : <UploadCloud size={18} />}
                        </UploadIconCircle>
                        <UploadDocTitle>Agreement Proof *</UploadDocTitle>
                        <UploadHint>{agreementFile ? "File selected" : "Click to browse"}</UploadHint>
                      </UploadBox>
                      {agreementFile && (
                        <FilePill>
                          <FilePillName title={agreementFile.name}>{agreementFile.name}</FilePillName>
                          <RemoveFileBtn onClick={removeAgreementFile} type="button" title="Remove file">
                            ✕
                          </RemoveFileBtn>
                        </FilePill>
                      )}
                      {validationErrors.agreementFile && (
                        <ValidationError>
                          <AlertCircle size={13} />
                          {validationErrors.agreementFile}
                        </ValidationError>
                      )}
                    </FileUploadContainer>
                  </div>

                  {/* Franchise Photo */}
                  <div className="col-lg col-md-6">
                    <FileUploadContainer>
                      <HiddenFileInput
                        type="file"
                        id="franchise-photo-upload"
                        onChange={handleFranchisePhotoChange}
                        accept="image/*"
                      />
                      <UploadBox
                        htmlFor="franchise-photo-upload"
                        isInvalid={validationErrors.franchisePhotoFile}
                        hasFile={Boolean(franchisePhotoFile)}
                      >
                        <UploadIconCircle hasFile={Boolean(franchisePhotoFile)}>
                          {franchisePhotoFile ? <Check size={18} /> : <UploadCloud size={18} />}
                        </UploadIconCircle>
                        <UploadDocTitle>Franchise Photo *</UploadDocTitle>
                        <UploadHint>{franchisePhotoFile ? "File selected" : "Click to browse"}</UploadHint>
                      </UploadBox>
                      {franchisePhotoFile && (
                        <FilePill>
                          <FilePillName title={franchisePhotoFile.name}>{franchisePhotoFile.name}</FilePillName>
                          <RemoveFileBtn onClick={removeFranchisePhotoFile} type="button" title="Remove file">
                            ✕
                          </RemoveFileBtn>
                        </FilePill>
                      )}
                      {validationErrors.franchisePhotoFile && (
                        <ValidationError>
                          <AlertCircle size={13} />
                          {validationErrors.franchisePhotoFile}
                        </ValidationError>
                      )}
                    </FileUploadContainer>
                  </div>
                </div>
              </FormSection>

              {/* Section 5: Payment Mode */}
              <FormSection>
                <SectionHeader>
                  <SectionIconBox>
                    <CreditCard size={20} />
                  </SectionIconBox>
                  <SectionTitleGroup>
                    <SectionTitle>Payment Mode & Initial Deposit</SectionTitle>
                    <SectionSubtitle>Franchise onboarding security fee and initial wallet credit setup</SectionSubtitle>
                  </SectionTitleGroup>
                </SectionHeader>

                <PaymentCardWrapper>
                  <PaymentOptionRow checked={franchiseFeeChecked}>
                    <CheckboxOptionGroup onClick={() => setFranchiseFeeChecked(!franchiseFeeChecked)}>
                      <CustomCheckbox checked={franchiseFeeChecked}>
                        {franchiseFeeChecked && <Check size={16} strokeWidth={3} />}
                      </CustomCheckbox>
                      <OptionTextCol>
                        <OptionTitle>
                          Franchise Initial Fee
                          {franchiseFeeChecked ? (
                            <StatusPill active>
                              <CheckCircle2 size={12} /> Fee Applied
                            </StatusPill>
                          ) : (
                            <StatusPill>Optional / Unchecked</StatusPill>
                          )}
                        </OptionTitle>
                        <OptionDesc>
                          Enable initial security fee & onboarding deposit of ₹10,000 for franchise account activation
                        </OptionDesc>
                      </OptionTextCol>
                    </CheckboxOptionGroup>

                    {/* Initial Payment Display - High contrast and modern */}
                    {franchiseFeeChecked ? (
                      <AmountDisplayCard>
                        <AmountLabel>Initial Payment:</AmountLabel>
                        <AmountValueBadge>
                          <IndianRupee size={17} strokeWidth={2.5} />
                          10,000
                        </AmountValueBadge>
                      </AmountDisplayCard>
                    ) : (
                      <div className="d-none d-md-block text-muted" style={{ fontSize: "0.85rem", fontStyle: "italic" }}>
                        Click checkbox to enable initial payment (₹10,000)
                      </div>
                    )}
                  </PaymentOptionRow>
                </PaymentCardWrapper>
              </FormSection>

              {/* Submit Button Section */}
              <SubmitArea>
                <PrimarySubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Registering Franchise...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      Complete Franchise Enrollment
                    </>
                  )}
                </PrimarySubmitButton>
              </SubmitArea>
            </form>
          </MainCard>
        </GlobalContainer>
      </Container>
    </>
  )
}

export default FranchiseRegister