"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import RefBy from "../Forms/RefBy"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaSearch, FaToggleOn, FaToggleOff, FaPlus, FaTimes } from "react-icons/fa"
import apiRequest from "../Auth/apiRequest";

const FormContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
    border-radius: 10px;
  }
`

const StyledTitle = styled.h2`
  background: linear-gradient(135deg, #f093fb, #667eea, #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`

const SearchContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
  position: relative;

  input {
    width: 100%;
    padding: 12px 20px 12px 45px;
    border: 2px solid #e1e8ff;
    border-radius: 25px;
    background: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    transition: all 0.3s ease;

    &::placeholder {
      color: #6c757d;
    }

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    @media (max-width: 480px) {
      padding: 10px 20px 10px 40px;
      font-size: 14px;
    }
  }

  svg {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #6c757d;
  }
`;

const PatientSelectionModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 70vh;
  overflow-y: auto;
  position: relative;
  
  h3 {
    color: #764ba2;
    margin-bottom: 20px;
    text-align: center;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  
  &:hover {
    color: #f093fb;
  }
`

const PatientCard = styled.div`
  border: 2px solid #e1e8ff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
    transform: translateY(-2px);
  }
  
  .patient-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    
    .label {
      font-size: 12px;
      color: #666;
      font-weight: 600;
      margin-bottom: 2px;
    }
    
    .value {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
  }
`

const Fieldset = styled.fieldset`
  border: 2px dashed #f093fb;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  background: rgba(255, 255, 255, 0.3);
  opacity: ${props => props.disabled ? 0.6 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  
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

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  align-items: end;
  
  &.row-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  &.row-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  
  &.row-4 {
    grid-template-columns: repeat(4, 1fr);
  }
  
  &.row-5 {
    grid-template-columns: repeat(5, 1fr);
  }
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    
    &.row-4, &.row-5 {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 15px;
    
    &.row-3, &.row-4, &.row-5 {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
    
    &.row-2, &.row-3, &.row-4, &.row-5 {
      grid-template-columns: 1fr;
    }
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  label {
    margin-bottom: 8px;
    font-weight: 600;
    color: #4c51bf;
    font-size: 14px;
    
    @media (max-width: 480px) {
      font-size: 12px;
      margin-bottom: 5px;
    }
  }
  
  input, select {
    padding: 10px 12px;
    border: 2px solid #e1e8ff;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    &:disabled {
      background: #f7fafc;
      border-color: #e2e8f0;
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    @media (max-width: 480px) {
      padding: 8px 10px;
      font-size: 12px;
    }
  }
  
  select {
    cursor: pointer;
  }
`

const FieldWithButton = styled.div`
  display: flex;
  align-items: end;
  gap: 10px;
  
  .field-input {
    flex: 1;
  }
  
  button {
    background: linear-gradient(135deg, #f093fb, #667eea);
    border: none;
    border-radius: 8px;
    color: white;
    padding: 10px 12px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
    height: 42px;
    min-width: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(240, 147, 251, 0.4);
    }
    
    @media (max-width: 480px) {
      height: 38px;
      min-width: 38px;
      padding: 8px 10px;
      font-size: 14px;
    }
  }
`

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  label {
    margin-bottom: 8px;
    font-weight: 600;
    color: #4c51bf;
    font-size: 14px;
    text-align: center;
    
    @media (max-width: 480px) {
      font-size: 12px;
    }
  }
  
  div {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s;
    
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    svg {
      @media (max-width: 480px) {
        font-size: 30px;
      }
    }
  }
`

const RadioGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 8px;
  flex-wrap: wrap;
  
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    cursor: pointer;
    padding: 8px 12px;
    border: 2px solid #e1e8ff;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    transition: all 0.2s;
    margin-bottom: 0;
    font-size: 14px;
    
    &:hover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }
    
    input[type="radio"] {
      margin: 0;
      accent-color: #667eea;
    }
    
    &:has(input:checked) {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.1);
      color: #4c51bf;
      font-weight: 600;
    }
    
    @media (max-width: 480px) {
      padding: 6px 10px;
      font-size: 12px;
      gap: 5px;
    }
  }
`

const RequiredIndicator = styled.span`
  color: #f093fb;
  margin-left: 4px;
  font-weight: bold;
`

const SubmitButton = styled.button`
  background: ${(props) =>
    props.disabled
      ? "linear-gradient(135deg, #cbd5e0, #a0aec0)"
      : "linear-gradient(135deg, #f093fb, #667eea, #764ba2)"};
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 15px 40px;
  border: none;
  border-radius: 25px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  box-shadow: ${(props) => (props.disabled ? "none" : "0 10px 25px rgba(240, 147, 251, 0.3)")};
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(240, 147, 251, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
  }
  
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 12px 30px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px 25px;
    width: 100%;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    margin-top: 20px;
  }
`

const StatusIndicator = styled.div`
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  
  &.existing {
    background: rgba(34, 197, 94, 0.1);
    color: #16a34a;
    border: 2px solid rgba(34, 197, 94, 0.3);
  }
  
  &.new {
    background: rgba(59, 130, 246, 0.1);
    color: #2563eb;
    border: 2px solid rgba(59, 130, 246, 0.3);
  }
  
  &.multiple {
    background: rgba(255, 193, 7, 0.1);
    color: #f59e0b;
    border: 2px solid rgba(255, 193, 7, 0.3);
  }
`

const SpinnerIcon = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const PatientForm = () => {
  const getCurrentDateWithTime = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const day = String(currentDate.getDate()).padStart(2, "0")
    const hours = String(currentDate.getHours()).padStart(2, "0")
    const minutes = String(currentDate.getMinutes()).padStart(2, "0")
    const seconds = String(currentDate.getSeconds()).padStart(2, "0")
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL
  const storedName = localStorage.getItem("name") || "system"

  const [showRefByForm, setShowRefByFormForm] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [multiplePatients, setMultiplePatients] = useState([]);

  const [formData, setFormData] = useState({
    patient_id: "",
    date: getCurrentDateWithTime(),
    lab_id: "",
    refby: "",
    branch: "",
    B2B: "",
    segment: "Walk-in",
    Title: "Mr.",
    patientname: "",
    gender: "Male",
    age: "",
    age_type: "Year",
    phone: "",
    email: "",
    address: { area: "", pincode: "" },
    sample_collector: "",
    testdetails: [],
    totalAmount: 0,
    discount: 0,
    payment_method: {},
    credit_amount: 0,
    registeredby: storedName,
    bill_no: "",
    bill_date: null,
    salesMapping: "",
    MultiplePayment: [],
  })

  const [isB2BEnabled, setIsB2BEnabled] = useState(false)
  const [isHomeCollectionEnabled, setIsHomeCollectionEnabled] = useState(false)
  const [dropdownOptions, setDropdownOptions] = useState({
    clinicalNames: [],
    sampleCollectors: [],
    referrers: [],
  })
  const [searchValue, setSearchValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [isExistingPatient, setIsExistingPatient] = useState(false)

  // Form validation
  useEffect(() => {
    const basicFieldsValid = formData.patientname.trim() !== "" && formData.age !== ""
    const refByValid = formData.refby.trim() !== ""
    const sampleCollectorValid = formData.sample_collector.trim() !== ""
    const branchValid = formData.branch.trim() !== ""
    const b2bFieldsValid = !isB2BEnabled || formData.B2B.trim() !== ""
    
    // Home collection specific validations
    const homeCollectionValid = !isHomeCollectionEnabled || (
      formData.phone.trim() !== "" && 
      formData.email.trim() !== "" &&
      formData.address.area.trim() !== "" &&
      formData.address.pincode.trim() !== ""
    )

    setIsFormValid(
      basicFieldsValid && 
      refByValid && 
      sampleCollectorValid && 
      branchValid &&
      b2bFieldsValid && 
      homeCollectionValid
    )
  }, [formData, isB2BEnabled, isHomeCollectionEnabled])

  const loadDropdownOptions = async () => {
    try {
      const [clinical, collector, refby] = await Promise.all([
        apiRequest(`${Labbaseurl}clinical_name/`, "GET"),
        apiRequest(`${Labbaseurl}sample-collector/`, "GET"),
        apiRequest(`${Labbaseurl}refby/`, "GET"),
      ]);

      if (clinical.success) {
        setDropdownOptions((prev) => ({ ...prev, clinicalNames: clinical.data }));
      }
      if (collector.success) {
        setDropdownOptions((prev) => ({ ...prev, sampleCollectors: collector.data }));
      }
      if (refby.success) {
        setDropdownOptions((prev) => ({ ...prev, referrers: refby.data }));
      }
    } catch (error) {
      console.error("Error loading dropdown options:", error);
      toast.error("Failed to load dropdown options");
    }
  };

const generateNewPatientId = async () => {
    try {
      const response = await apiRequest(`${Labbaseurl}latest-patient-id/`, "GET");
      
      if (response && response.patient_id) {
        setFormData((prev) => ({ ...prev, patient_id: response.patient_id }));
      } else if (response && response.data && response.data.patient_id) {
        setFormData((prev) => ({ ...prev, patient_id: response.data.patient_id }));
      } else {
        console.error("Invalid patient ID response format:", response);
        toast.error("Failed to generate patient ID - invalid response format");
      }
    } catch (error) {
      console.error("Error generating patient ID:", error);
      toast.error("Failed to generate patient ID");
    }
  };

  useEffect(() => {
    generateNewPatientId()
    loadDropdownOptions()
  }, [])
  

  const handleChange = (e) => {
    const { name, value } = e.target

    let updatedGender = formData.gender
    if (name === "Title") {
      if (value === "Mr." || value === "Master." || value === "Dr.") {
        updatedGender = "Male"
      } else if (value === "Mrs." || value === "Ms." || value === "Miss." || value === "Baby.") {
        updatedGender = "Female"
      } else if (value === "Baby of.") {
        updatedGender = "Other"
      }
    }

    if (name === "area" || name === "pincode") {
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [name]: value,
        },
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        ...(name === "Title" && { gender: updatedGender }),
      }))
    }
  }

  const handleB2BToggle = () => {
    if (isHomeCollectionEnabled) {
      toast.error("Please disable Home Collection first before enabling B2B")
      return
    }
    
    const newB2BState = !isB2BEnabled
    setIsB2BEnabled(newB2BState)

    if (newB2BState) {
      setFormData((prev) => ({ 
        ...prev, 
        segment: "B2B",
        // Clear address when B2B is enabled
        address: { area: "", pincode: "" }
      }))
    } else {
      setFormData((prev) => ({ 
        ...prev, 
        segment: "Walk-in", 
        B2B: "",
        lab_id: "",
        salesMapping: "",
        phone: "",
        email: ""
      }))
    }
  }

  const handleHomeCollectionToggle = () => {
    if (isB2BEnabled) {
      toast.error("Please disable B2B first before enabling Home Collection")
      return
    }
    
    const newHomeCollectionState = !isHomeCollectionEnabled
    setIsHomeCollectionEnabled(newHomeCollectionState)
    setFormData((prev) => ({
      ...prev,
      segment: newHomeCollectionState ? "Home Collection" : "Walk-in",
    }))
  }

  const handleClinicalNameSelect = (e) => {
    const selectedClinical = dropdownOptions.clinicalNames.find((clinical) => clinical.clinicalname === e.target.value)
    if (selectedClinical) {
      setFormData((prev) => ({
        ...prev,
        B2B: selectedClinical.clinicalname,
        lab_id: selectedClinical.referrerCode || "",
        salesMapping: selectedClinical.salesMapping || "",
        phone: selectedClinical.phone || "",
        email: selectedClinical.email || "",
      }))
    }
  }

  const handleSearchChange = (e) => {
    const input = e.target.value
    setSearchValue(input)

    if (input.length >= 3) {
      searchPatient(input)
    } else if (input.length === 0) {
      setIsExistingPatient(false)
      setShowPatientModal(false)
      setMultiplePatients([])
      generateNewPatientId()
      // Reset form for new patient
      setFormData((prev) => ({
        ...prev,
        patientname: "",
        age: "",
        gender: "Male",
        phone: isB2BEnabled ? prev.phone : "",
        email: isB2BEnabled ? prev.email : "",
        address: { area: "", pincode: "" },
      }))
    }
  }

  const searchPatient = async (value) => {
    try {
      let queryParam;
      if (/^SD\d+$/.test(value)) {
        queryParam = `patient_id=${value}`;
      } else if (/^\d{10}$/.test(value)) {
        queryParam = `phone=${value}`;
      } else {
        queryParam = `patientname=${value}`;
      }

      const response = await apiRequest(
        `${Labbaseurl}patient-get/?${queryParam}`,
        "GET"
      );

      if (response && response.success) {
        if (response.multiple && response.data && response.data.length > 1) {
          // Multiple patients found
          setMultiplePatients(response.data);
          setShowPatientModal(true);
          setIsExistingPatient(false);
          toast.info(`Found ${response.count} patients with this phone number. Please select one.`);
        } else if (response.data) {
          // Single patient found
          const data = Array.isArray(response.data) ? response.data[0] : response.data;
          loadPatientData(data);
        }
      } else {
        throw new Error("Patient not found");
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      // toast.info("Patient not found. Ready for new registration.");
      setIsExistingPatient(false);
      setShowPatientModal(false);
      setMultiplePatients([]);
    }
  };

const loadPatientData = (data) => {
  const prefixes = /^(MR\.?|MRS\.?|MS\.?|MASTER|MISS|DR\.?|BABY|BABY OF)\s+/i;
  const cleanedName = data.patientname
    ? data.patientname.replace(prefixes, "").trim()
    : "";

  console.log("cleanedName", cleanedName);

  setFormData((prev) => ({
    ...prev,
    patient_id: data.patient_id,
    patientname: cleanedName,
    age: data.age,
    age_type: data.age_type,
    gender: data.gender,
    phone: isB2BEnabled ? prev.phone : data.phone || "",
    email: isB2BEnabled ? prev.email : data.email || "",
    address: isB2BEnabled
      ? { area: "", pincode: "" }
      : typeof data.address === "string"
      ? JSON.parse(data.address)
      : data.address || { area: "", pincode: "" },
  }));

  setIsExistingPatient(true);
  setShowPatientModal(false);
  toast.success("Patient details loaded successfully. Ready for billing.");
};



  const handlePatientSelect = (patient) => {
    loadPatientData(patient);
  };

  const formatAddress = (address) => {
    if (!address) return "N/A";
    if (typeof address === "string") {
      try {
        const parsed = JSON.parse(address);
        return `${parsed.area || ''}, ${parsed.pincode || ''}`.replace(/^,\s*|,\s*$/g, '') || "N/A";
      } catch {
        return address;
      }
    }
    return `${address.area || ''}, ${address.pincode || ''}`.replace(/^,\s*|,\s*$/g, '') || "N/A";
  };

  const validateRequiredFields = () => {
    const errors = []

    if (!formData.patientname.trim()) errors.push("Patient Name is required")
    if (!formData.age) errors.push("Age is required")
    if (!formData.refby.trim()) errors.push("Ref By is required")
    if (!formData.sample_collector.trim()) errors.push("Sample Collector is required")
    if (!formData.branch.trim()) errors.push("Branch is required")
    
    if (isB2BEnabled && !formData.B2B.trim()) {
      errors.push("Clinical Name is required when B2B is enabled")
    }
    
    if (isHomeCollectionEnabled) {
      if (!formData.phone.trim()) errors.push("Phone Number is required for Home Collection")
      if (!formData.email.trim()) errors.push("Email ID is required for Home Collection")
      if (!formData.address.area.trim()) errors.push("Area is required for Home Collection")
      if (!formData.address.pincode.trim()) errors.push("Pin Code is required for Home Collection")
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate required fields
    const validationErrors = validateRequiredFields()
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error))
      return
    }

    setIsSubmitting(true);

    try {
      const fullPatientName = `${formData.Title} ${formData.patientname}`;
      const addressData = { area: formData.address.area, pincode: formData.address.pincode };

      let segmentValue = "Walk-in";
      if (isB2BEnabled) segmentValue = "B2B";
      else if (isHomeCollectionEnabled) segmentValue = "Home Collection";

      const baseData = {
        patient_id: formData.patient_id,
        patientname: fullPatientName,
        age: formData.age,
        age_type: formData.age_type,
        gender: formData.gender,
        phone: isB2BEnabled ? "" : formData.phone,
        email: isB2BEnabled ? "" : formData.email,
        address: isB2BEnabled ? {} : addressData,
        registeredby: formData.registeredby,
      };

      const billData = {
        ...baseData,
        date: formData.date,
        lab_id: formData.lab_id,
        refby: formData.refby,
        branch: formData.branch,
        B2B: isB2BEnabled ? formData.B2B : "",
        segment: segmentValue,
        salesMapping: formData.salesMapping,
        sample_collector: formData.sample_collector,
        testdetails: formData.testdetails,
        totalAmount: formData.totalAmount,
        discount: formData.discount,
        payment_method: formData.payment_method,
        credit_amount: formData.credit_amount,
        MultiplePayment: formData.MultiplePayment,
        status: "Registered",
      };

      if (isExistingPatient) {
        // Existing patient: create bill only
        const billResult = await apiRequest(`${Labbaseurl}create_bill/`, "POST", billData);
        if (billResult && billResult.success) {
          toast.success(`Bill created successfully!`);
          // Reset form for next entry
          resetForm();
        } else {
          toast.error("Failed to create bill. Please try again.");
        }
      } else {
        // New patient: create patient first, then bill
        try {
          const patientResult = await apiRequest(`${Labbaseurl}create_patient/`, "POST", baseData);
          
          if (patientResult && patientResult.success) {
            // Now create the bill
            const billResult = await apiRequest(`${Labbaseurl}create_bill/`, "POST", billData);
            
            if (billResult && billResult.success) {
              toast.success(`Patient registered and bill created successfully!`);
              // Reset form for next entry
              resetForm();
            } else {
              toast.error("Patient created but failed to create bill. Please create bill manually.");
            }
          } else {
            toast.error("Failed to create patient. Please try again.");
          }
        } catch (error) {
          console.error("Error in patient/bill creation:", error);
          toast.error("Error creating patient or bill. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSearchValue("");
    setIsExistingPatient(false);
    setIsB2BEnabled(false);
    setIsHomeCollectionEnabled(false);
    setShowPatientModal(false);
    setMultiplePatients([]);
    
    setFormData({
      patient_id: "",
      date: getCurrentDateWithTime(),
      lab_id: "",
      refby: "",
      branch: "",
      B2B: "",
      segment: "Walk-in",
      Title: "Mr.",
      patientname: "",
      gender: "Male",
      age: "",
      age_type: "Year",
      phone: "",
      email: "",
      address: { area: "", pincode: "" },
      sample_collector: "",
      testdetails: [],
      totalAmount: 0,
      discount: 0,
      payment_method: {},
      credit_amount: 0,
      registeredby: storedName,
      bill_no: "",
      bill_date: null,
      salesMapping: "",
      MultiplePayment: [],
    });
    
    // Generate new patient ID
    generateNewPatientId();
  };

  return (
    <FormContainer>
      <FormCard>
        <StyledTitle>Patient Registration & Billing System</StyledTitle>

        <SearchContainer>
          <FaSearch size={18} />
          <input
            type="text"
            placeholder="Enter Patient ID, Name, or Phone"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </SearchContainer>

        {isExistingPatient && (
          <StatusIndicator className="existing">
            ✓ Existing Patient Found - Ready for Billing
          </StatusIndicator>
        )}

        {showPatientModal && (
          <StatusIndicator className="multiple">
            ⚠ Multiple Patients Found - Please Select One
          </StatusIndicator>
        )}

        {/* Patient Selection Modal */}
        {showPatientModal && (
          <PatientSelectionModal>
            <ModalContent>
              <CloseButton onClick={() => setShowPatientModal(false)}>
                <FaTimes />
              </CloseButton>
              <h3>Select Patient ({multiplePatients.length} found)</h3>
              
              {multiplePatients.map((patient, index) => (
                <PatientCard key={index} onClick={() => handlePatientSelect(patient)}>
                  <div className="patient-info">
                    <div className="info-item">
                      <span className="label">Patient ID</span>
                      <span className="value">{patient.patient_id}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Name</span>
                      <span className="value">{patient.patientname}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Age</span>
                      <span className="value">{patient.age} {patient.age_type}(s)</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Gender</span>
                      <span className="value">{patient.gender}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Phone</span>
                      <span className="value">{patient.phone || "N/A"}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Email</span>
                      <span className="value">{patient.email || "N/A"}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Address</span>
                      <span className="value">{formatAddress(patient.address)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Registered By</span>
                      <span className="value">{patient.registeredby || "N/A"}</span>
                    </div>
                  </div>
                </PatientCard>
              ))}
            </ModalContent>
          </PatientSelectionModal>
        )}

        <form onSubmit={handleSubmit}>
          {/* Lab Details */}
          <Fieldset>
            <h4>Lab Details</h4>
            <Row className="row-4">
              <FormGroup>
                <label>Date & Time</label>
                <input type="text" name="date" value={formData.date} onChange={handleChange} disabled />
              </FormGroup>
              <FormGroup>
                <label>Lab ID</label>
                <input type="text" name="lab_id" value={formData.lab_id} onChange={handleChange} readOnly />
              </FormGroup>
              <FieldWithButton>
                <FormGroup className="field-input">
                  <label>
                    Ref By<RequiredIndicator>*</RequiredIndicator>
                  </label>
                  <select name="refby" value={formData.refby} onChange={handleChange} required>
                    <option value="">Select Refby</option>
                    {dropdownOptions.referrers.map((refby, index) => (
                      <option key={index} value={refby.name}>
                        {refby.name}
                      </option>
                    ))}
                  </select>
                </FormGroup>
                <button type="button" onClick={() => setShowRefByFormForm(true)} title="Add new Refby">
                  <FaPlus />
                </button>
              </FieldWithButton>
              <FormGroup>
                <label>Branch<RequiredIndicator>*</RequiredIndicator></label>
                <select name="branch" value={formData.branch} onChange={handleChange} required>
                  <option value="">Select a Branch</option>
                  <option value="Shanmuga Reference Lab">Shanmuga Reference Lab</option>
                </select>
              </FormGroup>
            </Row>

            <Row className="row-5">
              <ToggleContainer>
                <label>B2B</label>
                <div onClick={handleB2BToggle} className={isHomeCollectionEnabled ? "disabled" : ""}>
                  {isB2BEnabled ? (
                    <FaToggleOn style={{ fontSize: "40px", color: "green" }} />
                  ) : (
                    <FaToggleOff style={{ fontSize: "40px", color: "grey" }} />
                  )}
                </div>
              </ToggleContainer>

              <FormGroup>
                <label>
                  Clinical Name{isB2BEnabled && <RequiredIndicator>*</RequiredIndicator>}
                </label>
                <select 
                  name="clinical_name" 
                  value={formData.B2B} 
                  onChange={handleClinicalNameSelect}
                  disabled={!isB2BEnabled}
                  required={isB2BEnabled}
                >
                  <option value="">Select Clinical Name</option>
                  {dropdownOptions.clinicalNames.map((clinical, index) => (
                    <option key={index} value={clinical.clinicalname}>
                      {clinical.clinicalname}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup>
                <label>Sales Representative</label>
                <input type="text" name="salesMapping" value={formData.salesMapping} onChange={handleChange} readOnly />
              </FormGroup>

              <ToggleContainer>
                <label>Home Collection</label>
                <div onClick={handleHomeCollectionToggle} className={isB2BEnabled ? "disabled" : ""}>
                  {isHomeCollectionEnabled ? (
                    <FaToggleOn style={{ fontSize: "40px", color: "green" }} />
                  ) : (
                    <FaToggleOff style={{ fontSize: "40px", color: "grey" }} />
                  )}
                </div>
              </ToggleContainer>

              <FormGroup>
                <label>
                  Sample Collector<RequiredIndicator>*</RequiredIndicator>
                </label>
                <select
                  name="sample_collector"
                  value={formData.sample_collector}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Sample Collector</option>
                  {dropdownOptions.sampleCollectors.map((collector, index) => (
                    <option key={index} value={collector}>
                      {collector}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </Row>
          </Fieldset>

          {/* Personal Details */}
          <Fieldset>
            <h4>Personal Details</h4>
            <Row className="row-5">
              <FormGroup>
                <label>Patient ID</label>
                <input type="text" name="patient_id" value={formData.patient_id} readOnly />
              </FormGroup>
              <FormGroup>
                <label>Title</label>
                <select name="Title" value={formData.Title} onChange={handleChange} disabled={isExistingPatient}>
                  <option value="Mr.">Mr</option>
                  <option value="Mrs.">Mrs</option>
                  <option value="Ms.">Ms</option>
                  <option value="Master.">Master</option>
                  <option value="Miss.">Miss</option>
                  <option value="Dr.">Dr</option>
                  <option value="Baby.">Baby</option>
                  <option value="Baby of.">Baby of</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>
                  Patient Name<RequiredIndicator>*</RequiredIndicator>
                </label>
                <input
                  type="text"
                  name="patientname"
                  value={formData.patientname}
                  onChange={handleChange}
                  required
                  disabled={isExistingPatient}
                />
              </FormGroup>
              <FormGroup>
                <label>
                  Age<RequiredIndicator>*</RequiredIndicator>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  disabled={isExistingPatient}
                />
              </FormGroup>
              <FormGroup>
                <label>Age Type</label>
                <select name="age_type" value={formData.age_type} onChange={handleChange} disabled={isExistingPatient}>
                  <option value="Year">Year</option>
                  <option value="Month">Month</option>
                  <option value="Day">Day</option>
                </select>
              </FormGroup>
            </Row>

            <Row>
              <FormGroup>
                <label>Gender</label>
                <RadioGroup>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleChange}
                      disabled={isExistingPatient}
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleChange}
                      disabled={isExistingPatient}
                    />
                    Female
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={formData.gender === "Other"}
                      onChange={handleChange}
                      disabled={isExistingPatient}
                    />
                    Other
                  </label>
                </RadioGroup>
              </FormGroup>
            </Row>
          </Fieldset>

          {/* Contact Details */}
          <Fieldset disabled={isB2BEnabled}>
            <h4>Contact Details {isB2BEnabled && "(Auto-filled from Clinical)"}</h4>
            <Row className="row-4">
              <FormGroup>
                <label>
                  Phone Number{isHomeCollectionEnabled && <RequiredIndicator>*</RequiredIndicator>}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isExistingPatient || isB2BEnabled}
                  required={isHomeCollectionEnabled}
                  maxLength={15}
                />
              </FormGroup>
              <FormGroup>
                <label>
                  Email ID{isHomeCollectionEnabled && <RequiredIndicator>*</RequiredIndicator>}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isExistingPatient || isB2BEnabled}
                  required={isHomeCollectionEnabled}
                />
              </FormGroup>
              <FormGroup>
                <label>
                  Area{isHomeCollectionEnabled && <RequiredIndicator>*</RequiredIndicator>}
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.address.area}
                  onChange={handleChange}
                  disabled={isExistingPatient || isB2BEnabled}
                  required={isHomeCollectionEnabled}
                />
              </FormGroup>
              <FormGroup>
                <label>
                  Pin Code{isHomeCollectionEnabled && <RequiredIndicator>*</RequiredIndicator>}
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  disabled={isExistingPatient || isB2BEnabled}
                  required={isHomeCollectionEnabled}
                  maxLength={6}
                />
              </FormGroup>
            </Row>
          </Fieldset>

          <ButtonContainer>
            <SubmitButton type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <SpinnerIcon />
                  Processing...
                </>
              ) : isExistingPatient ? (
                "Create Bill"
              ) : (
                "Register Patient & Create Bill"
              )}
            </SubmitButton>
          </ButtonContainer>
        </form>
      </FormCard>

      <RefBy show={showRefByForm} setShow={setShowRefByFormForm} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </FormContainer>
  )
}

export default PatientForm