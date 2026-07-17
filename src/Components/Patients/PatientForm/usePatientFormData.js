import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import apiRequest from "../../Auth/apiRequest"
import {
  getCurrentDateWithTime,
  getTitleFromName,
  filterReferrers,
  filterClinicalNames,
  validateRequiredFields,
} from "./helpers"

// Encapsulates all of the PatientForm component's state, data-fetching,
// and form-handling logic. Extracted verbatim from the component body -
// the JSX in index.js is unchanged, it just reads these values/functions
// from this hook instead of from local variables.
export default function usePatientFormData() {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL
  const storedName = localStorage.getItem("name") || "system"

  const [showRefByForm, setShowRefByFormForm] = useState(false)
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [multiplePatients, setMultiplePatients] = useState([])
  const [prescriptionFile, setPrescriptionFile] = useState(null)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [appointmentPatients, setAppointmentPatients] = useState([])
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false)

  const [patientSelectionSource, setPatientSelectionSource] = useState(null)
  const [originalPatientName, setOriginalPatientName] = useState("")

  const [refBySearchValue, setRefBySearchValue] = useState("")
  const [showRefByDropdown, setShowRefByDropdown] = useState(false)
  const [clinicalSearchValue, setClinicalSearchValue] = useState("")
  const [showClinicalDropdown, setShowClinicalDropdown] = useState(false)

  // ---- Dropdown selection tracking flags ----
  const [isRefBySelectedFromDropdown, setIsRefBySelectedFromDropdown] = useState(false)
  const [isClinicalSelectedFromDropdown, setIsClinicalSelectedFromDropdown] = useState(false)

  // ---- Inline error hints shown after a failed submit attempt ----
  const [refByError, setRefByError] = useState(false)
  const [clinicalError, setClinicalError] = useState(false)

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
    age_type: "Years",
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
    b2b_area: "",
    MultiplePayment: [],
    emergency: false,
    patient_history: "",
  })

  const [isB2BEnabled, setIsB2BEnabled] = useState(false)
  const [isHomeCollectionEnabled, setIsHomeCollectionEnabled] = useState(false)
  const [isEmergencyEnabled, setIsEmergencyEnabled] = useState(false)
  const [dropdownOptions, setDropdownOptions] = useState({
    clinicalNames: [],
    sampleCollectors: [],
    referrers: [],
  })
  const [searchValue, setSearchValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [isExistingPatient, setIsExistingPatient] = useState(false)

  // -----------------------------------------------------------------------
  // Form validation — does NOT include dropdown-selection checks so the
  // submit button stays enabled regardless of whether the user typed or
  // selected from the dropdown. Dropdown validation happens at submit time.
  // -----------------------------------------------------------------------
  useEffect(() => {
    const basicFieldsValid = formData.patientname.trim() !== "" && formData.age !== ""
    const refByValid = formData.refby.trim() !== ""
    const sampleCollectorValid = formData.sample_collector.trim() !== ""
    const branchValid = formData.branch.trim() !== ""
    const b2bFieldsValid = !isB2BEnabled || formData.B2B.trim() !== ""

    const homeCollectionValid =
      !isHomeCollectionEnabled ||
      (formData.phone.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.address.area.trim() !== "" &&
        formData.address.pincode.trim() !== "")

    setIsFormValid(
      basicFieldsValid && refByValid && sampleCollectorValid && branchValid && b2bFieldsValid && homeCollectionValid,
    )
  }, [formData, isB2BEnabled, isHomeCollectionEnabled])

  const loadDropdownOptions = async () => {
    try {
      const [clinical, collector, refby] = await Promise.all([
        apiRequest(`${Labbaseurl}clinical_name/`, "GET"),
        apiRequest(`${Labbaseurl}sample-collector/`, "GET"),
        apiRequest(`${Labbaseurl}refby/`, "GET"),
      ])

      if (clinical.success) {
        setDropdownOptions((prev) => ({ ...prev, clinicalNames: clinical.data?.data || [] }))
      }
      if (collector.success) {
        setDropdownOptions((prev) => ({ ...prev, sampleCollectors: collector.data }))
      }
      if (refby.success) {
        setDropdownOptions((prev) => ({ ...prev, referrers: refby.data }))
      }
    } catch (error) {
      console.error("Error loading dropdown options:", error)
      toast.error("Failed to load dropdown options")
    }
  }

  const generateNewPatientId = async () => {
    try {
      const response = await apiRequest(`${Labbaseurl}latest-patient-id/`, "GET")

      if (response && response.patient_id) {
        setFormData((prev) => ({ ...prev, patient_id: response.patient_id }))
      } else if (response && response.data && response.data.patient_id) {
        setFormData((prev) => ({ ...prev, patient_id: response.data.patient_id }))
      } else {
        console.error("Invalid patient ID response format:", response)
        toast.error("Failed to generate patient ID - invalid response format")
      }
    } catch (error) {
      console.error("Error generating patient ID:", error)
      toast.error("Failed to generate patient ID")
    }
  }

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should not exceed 5MB")
        return
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, JPG, JPEG, and PNG files are allowed")
        return
      }
      setPrescriptionFile(file)
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
        address: { area: "", pincode: "" },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        segment: "Walk-in",
        B2B: "",
        lab_id: "",
        salesMapping: "",
        b2b_area: "",
        phone: "",
        email: "",
      }))
      setClinicalSearchValue("")
      setIsClinicalSelectedFromDropdown(false)
      setClinicalError(false)
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

  const handleEmergencyToggle = () => {
    const newEmergencyState = !isEmergencyEnabled
    setIsEmergencyEnabled(newEmergencyState)
    setFormData((prev) => ({
      ...prev,
      emergency: newEmergencyState,
    }))
  }

  // -----------------------------------------------------------------------
  // Clinical Name handlers
  // -----------------------------------------------------------------------
  const handleClinicalNameSearch = (e) => {
    const value = e.target.value
    setClinicalSearchValue(value)
    setShowClinicalDropdown(true)
    // User is typing — clear the "selected from dropdown" flag and any error
    setIsClinicalSelectedFromDropdown(false)
    setClinicalError(false)

    setFormData((prev) => ({
      ...prev,
      B2B: value,
    }))
  }

  const handleClinicalNameSelect = (clinical) => {
    setClinicalSearchValue(clinical.clinicalname)
    setIsClinicalSelectedFromDropdown(true) // ✅ properly selected
    setClinicalError(false)
    setFormData((prev) => ({
      ...prev,
      B2B: clinical.clinicalname,
      lab_id: clinical.referrerCode || "",
      salesMapping: clinical.salesMapping || "",
      b2b_area: clinical.area || "",
      phone: clinical.phone || "",
      email: clinical.email || "",
    }))
    setShowClinicalDropdown(false)
  }

  // -----------------------------------------------------------------------
  // Ref By handlers
  // -----------------------------------------------------------------------
  const handleRefBySearch = (e) => {
    const value = e.target.value
    setRefBySearchValue(value)
    setShowRefByDropdown(true)
    // User is typing — clear the "selected from dropdown" flag and any error
    setIsRefBySelectedFromDropdown(false)
    setRefByError(false)

    setFormData((prev) => ({
      ...prev,
      refby: value,
    }))
  }

  const handleRefBySelect = (refby) => {
    setRefBySearchValue(refby.name)
    setIsRefBySelectedFromDropdown(true) // ✅ properly selected
    setRefByError(false)
    setFormData((prev) => ({
      ...prev,
      refby: refby.name,
    }))
    setShowRefByDropdown(false)
  }

  const getFilteredRefBys = () => filterReferrers(dropdownOptions.referrers, refBySearchValue)

  const getFilteredClinicalNames = () => filterClinicalNames(dropdownOptions.clinicalNames, clinicalSearchValue)

  const handleSearchChange = (e) => {
    const input = e.target.value
    const numericInput = input.replace(/\D/g, "")
    setSearchValue(numericInput)

    if (numericInput.length === 10) {
      searchPatientByPhone(numericInput)
    } else if (numericInput.length === 0) {
      setIsExistingPatient(false)
      setShowPatientModal(false)
      setMultiplePatients([])
      setPatientSelectionSource(null)
      generateNewPatientId()
      setFormData((prev) => ({
        ...prev,
        patientname: "",
        age: "",
        age_type: "Years",
        gender: "Male",
        phone: isB2BEnabled ? prev.phone : "",
        email: isB2BEnabled ? prev.email : "",
        address: { area: "", pincode: "" },
        patient_history: "",
      }))
      setPrescriptionFile(null)
    } else if (numericInput.length < 10) {
      setIsExistingPatient(false)
      setShowPatientModal(false)
      setMultiplePatients([])
      setPatientSelectionSource(null)
    }
  }

  const searchPatientByPhone = async (phoneNumber) => {
    try {
      const response = await apiRequest(`${Labbaseurl}patient-get/?phone=${phoneNumber}`, "GET")

      if (response && response.success) {
        let patients = []

        if (Array.isArray(response.data)) {
          patients = response.data
        } else if (response.data && response.data.data) {
          if (Array.isArray(response.data.data)) {
            patients = response.data.data
          } else {
            patients = [response.data.data] // Extract the actual patient object
          }
        } else if (response.data && typeof response.data === "object") {
          patients = [response.data]
        }

        if (patients.length >= 1) {
          setMultiplePatients(patients)
          setShowPatientModal(true)
          setIsExistingPatient(false)
          setPatientSelectionSource(null)
          toast.info(`Found ${patients.length} patient(s) with this phone number. Please select one.`)
        } else {
          throw new Error("Patient not found")
        }
      } else {
        throw new Error(response?.error || "Patient not found")
      }
    } catch (error) {
      console.error("Error fetching patient details:", error)
      setIsExistingPatient(false)
      setShowPatientModal(false)
      setMultiplePatients([])
      setPatientSelectionSource(null)
      generateNewPatientId()
    }
  }

  const loadPatientData = (data, source = null) => {
    const prefixes = /^(MR\.?|MRS\.?|MS\.?|MASTER\.?|MISS\.?|DR\.?|BABY\.?|BABY OF\.?)\s+/i
    const cleanedName = data.patientname ? data.patientname.replace(prefixes, "").trim() : ""
    const extractedTitle = getTitleFromName(data.patientname || "")

    let parsedAddress = { area: "", pincode: "" }
    if (data.address) {
      if (typeof data.address === "string") {
        try {
          parsedAddress = JSON.parse(data.address)
        } catch (e) {
          console.error("Error parsing address:", e)
          parsedAddress = { area: "", pincode: "" }
        }
      } else if (typeof data.address === "object") {
        parsedAddress = data.address
      }
    }

    let patientGender = data.gender || "Male"
    if (!data.gender) {
      if (extractedTitle === "Mr." || extractedTitle === "Master." || extractedTitle === "Dr.") {
        patientGender = "Male"
      } else if (
        extractedTitle === "Mrs." ||
        extractedTitle === "Ms." ||
        extractedTitle === "Miss." ||
        extractedTitle === "Baby."
      ) {
        patientGender = "Female"
      }
    }

    setOriginalPatientName(cleanedName)

    setFormData((prev) => ({
      ...prev,
      patient_id: data.patient_id || prev.patient_id, // Load the existing ID!
      Title: extractedTitle,
      patientname: cleanedName,
      age: data.age || "",
      age_type: data.age_type || "Years",
      gender: patientGender,
      phone: isB2BEnabled ? prev.phone : (data.phone ? data.phone.replace(/[^0-9]/g, "").slice(-10) : ""),
      email: isB2BEnabled ? prev.email : data.email || "",
      address: isB2BEnabled ? { area: "", pincode: "" } : parsedAddress,
      patient_history: data.patient_history || "",
      appointment_id: data.appointment_id || "",
      sample_collector: data.sample_collector || prev.sample_collector,
    }))

    if (data.emergency) {
      setIsEmergencyEnabled(true)
    } else {
      setIsEmergencyEnabled(false)
    }

    setIsExistingPatient(source === "appointment" ? true : false)
    setShowPatientModal(false)
    setPatientSelectionSource(source)
  }

  const handlePatientSelect = (patient) => {
    loadPatientData(patient, "search")
    toast.success("Patient details loaded (read-only). Ready for billing.")
  }

  // -----------------------------------------------------------------------
  // Submit handler — dropdown-selection validation happens here so the
  // button is always clickable and users get a clear toast message.
  // -----------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    let hasDropdownError = false

    // Validate Ref By — must be chosen from dropdown, not just typed
    if (formData.refby.trim() && !isRefBySelectedFromDropdown) {
      toast.error("Please select Ref By from the dropdown list")
      setRefByError(true)
      hasDropdownError = true
    }

    // Validate Clinical Name — must be chosen from dropdown when B2B is enabled
    if (isB2BEnabled && formData.B2B.trim() && !isClinicalSelectedFromDropdown) {
      toast.error("Please select Clinical Name from the dropdown list")
      setClinicalError(true)
      hasDropdownError = true
    }

    if (hasDropdownError) return

    // Standard field validation
    const validationErrors = validateRequiredFields(formData, isB2BEnabled, isHomeCollectionEnabled)
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error))
      return
    }

    setIsSubmitting(true)

    try {
      const fullPatientName = `${formData.Title} ${formData.patientname}`
      const addressData = { area: formData.address.area, pincode: formData.address.pincode }

      let segmentValue = "Walk-in"
      if (isB2BEnabled) segmentValue = "B2B"
      else if (isHomeCollectionEnabled) segmentValue = "Home Collection"

      const patientHistory = formData.patient_history.trim() || ""

      // Check if it's a search load and if the name changed
      let finalSelectionSource = patientSelectionSource
      let finalPatientId = formData.patient_id

      if (patientSelectionSource === "search") {
        const isNameChanged = formData.patientname.trim().toLowerCase() !== originalPatientName.trim().toLowerCase()
        if (isNameChanged) {
          finalSelectionSource = null // Treat as new patient!

          // Fetch a NEW patient ID right before submitting
          try {
            const idResponse = await apiRequest(`${Labbaseurl}latest-patient-id/`, "GET")
            if (idResponse && idResponse.patient_id) {
              finalPatientId = idResponse.patient_id
            } else if (idResponse && idResponse.data && idResponse.data.patient_id) {
              finalPatientId = idResponse.data.patient_id
            }
          } catch (e) {
            console.error("Failed to generate new ID for changed name:", e)
          }
        }
      }

      const baseData = {
        patient_id: finalPatientId,
        patientname: fullPatientName,
        age: formData.age,
        age_type: formData.age_type,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        address: formData.address.area.trim() || formData.address.pincode.trim() ? addressData : {},
        registeredby: formData.registeredby,
        emergency: isEmergencyEnabled,
        patient_history: patientHistory,
      }

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
        emergency: isEmergencyEnabled,
        patient_history: patientHistory,
        appointment_id: formData.appointment_id,
      }

      let billPayload = billData
      let headers = {}

      if (prescriptionFile) {
        const billFormData = new FormData()

        Object.keys(billData).forEach((key) => {
          const value = billData[key]
          if (value === null || value === undefined) return

          if (typeof value === "object" && !(value instanceof Date) && key !== "date") {
            billFormData.append(key, JSON.stringify(value))
          } else {
            billFormData.append(key, value)
          }
        })

        billFormData.append("prescription_file", prescriptionFile)
        billPayload = billFormData
        headers = { "Content-Type": undefined }
      }

      if (finalSelectionSource === "search") {
        const billResult = await apiRequest(`${Labbaseurl}create_bill/`, "POST", billPayload, headers)
        if (billResult && billResult.success) {
          toast.success(`Bill created successfully for revisit patient!`)
          resetForm()
        } else {
          toast.error("Failed to create bill. Please try again.")
        }
      } else {
        try {
          const patientResult = await apiRequest(`${Labbaseurl}create_patient/`, "POST", baseData)

          if (patientResult && patientResult.success) {
            const billResult = await apiRequest(`${Labbaseurl}create_bill/`, "POST", billPayload, headers)

            if (billResult && billResult.success) {
              toast.success(`Patient registered and bill created successfully!`)
              resetForm()
            } else {
              toast.error("Patient created but failed to create bill. Please create bill manually.")
            }
          } else {
            toast.error("Failed to create patient. Please try again.")
          }
        } catch (error) {
          console.error("Error in patient/bill creation:", error)
          toast.error("Error creating patient or bill. Please try again.")
        }
      }
    } catch (error) {
      console.error("Error saving data:", error)
      toast.error("Error saving data. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSearchValue("")
    setIsExistingPatient(false)
    setIsB2BEnabled(false)
    setIsHomeCollectionEnabled(false)
    setIsEmergencyEnabled(false)
    setShowPatientModal(false)
    setMultiplePatients([])
    setPrescriptionFile(null)
    setPatientSelectionSource(null)
    setRefBySearchValue("")
    setClinicalSearchValue("")
    // Reset dropdown flags and errors
    setIsRefBySelectedFromDropdown(false)
    setIsClinicalSelectedFromDropdown(false)
    setRefByError(false)
    setClinicalError(false)

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
      age_type: "Years",
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
      emergency: false,
      patient_history: "",
      appointment_id: "",
    })

    generateNewPatientId()
  }

  const fetchTodayAppointments = async () => {
    try {
      setIsLoadingAppointments(true)

      const response = await apiRequest(`${Labbaseurl}appointments/?limit=500`, "GET")

      let appointments = []

      if (response) {
        if (Array.isArray(response)) {
          appointments = response
        } else if (response.success && Array.isArray(response.appointments)) {
          appointments = response.appointments
        } else if (response.success && Array.isArray(response.data)) {
          appointments = response.data
        } else if (Array.isArray(response.data)) {
          appointments = response.data
        } else if (response.data && Array.isArray(response.data.appointments)) {
          appointments = response.data.appointments
        } else if (response.data && Array.isArray(response.data.data)) {
          appointments = response.data.data
        }
      }

      if (appointments.length === 0) {
        toast.info("No appointments found in the system")
        setAppointmentPatients([])
        setShowAppointmentModal(false)
        return
      }

      const today = new Date()
      const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

      const todayAppointments = appointments.filter((appointment) => {
        if (!appointment.appointment_date) return false;
        if (appointment.status === "Cancelled") return false;
        const appointmentDateStr = appointment.appointment_date.split("T")[0].split(" ")[0];
        return appointmentDateStr === todayDate;
      })

      if (todayAppointments.length > 0) {
        setAppointmentPatients(todayAppointments)
        setShowAppointmentModal(true)
        toast.info(`Found ${todayAppointments.length} appointments for today`)
      } else {
        toast.info("No appointments booked for today")
        setAppointmentPatients([])
        setShowAppointmentModal(false)
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast.error("Failed to fetch appointments. Please try again.")
    } finally {
      setIsLoadingAppointments(false)
    }
  }

  const handleAppointmentSelect = (appointment) => {
    const patientData = {
      patient_id: formData.patient_id || "",
      patientname: appointment.patient_name || "",
      age: appointment.age || "",
      age_type: appointment.age_type || "Years",
      gender: appointment.gender || "Male",
      phone: appointment.mobile_number || "",
      email: appointment.email || "",
      address: appointment.address || { area: "", pincode: "" },
      patient_history: appointment.patient_history || "",
      emergency: appointment.emergency || false,
      appointment_id: appointment.appointment_id || "",
      sample_collector: appointment.sample_collector || "",
    }

    loadPatientData(patientData, "appointment")
    setShowAppointmentModal(false)
    toast.success("Appointment patient loaded successfully. Fields are editable.")
  }

  const shouldDisableField = () => {
    return patientSelectionSource === "search" && isExistingPatient
  }

  return {
    Labbaseurl,
    showRefByForm,
    setShowRefByFormForm,
    showPatientModal,
    setShowPatientModal,
    multiplePatients,
    setMultiplePatients,
    prescriptionFile,
    setPrescriptionFile,
    showAppointmentModal,
    setShowAppointmentModal,
    appointmentPatients,
    setAppointmentPatients,
    isLoadingAppointments,
    setIsLoadingAppointments,
    patientSelectionSource,
    setPatientSelectionSource,
    originalPatientName,
    setOriginalPatientName,
    refBySearchValue,
    setRefBySearchValue,
    showRefByDropdown,
    setShowRefByDropdown,
    clinicalSearchValue,
    setClinicalSearchValue,
    showClinicalDropdown,
    setShowClinicalDropdown,
    isRefBySelectedFromDropdown,
    setIsRefBySelectedFromDropdown,
    isClinicalSelectedFromDropdown,
    setIsClinicalSelectedFromDropdown,
    refByError,
    setRefByError,
    clinicalError,
    setClinicalError,
    formData,
    setFormData,
    isB2BEnabled,
    setIsB2BEnabled,
    isHomeCollectionEnabled,
    setIsHomeCollectionEnabled,
    isEmergencyEnabled,
    setIsEmergencyEnabled,
    dropdownOptions,
    setDropdownOptions,
    searchValue,
    setSearchValue,
    isSubmitting,
    setIsSubmitting,
    isFormValid,
    setIsFormValid,
    isExistingPatient,
    setIsExistingPatient,
    loadDropdownOptions,
    generateNewPatientId,
    handleChange,
    handleFileChange,
    handleB2BToggle,
    handleHomeCollectionToggle,
    handleEmergencyToggle,
    handleClinicalNameSearch,
    handleClinicalNameSelect,
    handleRefBySearch,
    handleRefBySelect,
    getFilteredRefBys,
    getFilteredClinicalNames,
    handleSearchChange,
    searchPatientByPhone,
    loadPatientData,
    handlePatientSelect,
    handleSubmit,
    resetForm,
    fetchTodayAppointments,
    handleAppointmentSelect,
    shouldDisableField,
  }
}
