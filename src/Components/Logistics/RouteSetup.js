import { useState, useEffect } from "react"
import Select from "react-select"
import styled from "styled-components"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaRoute, FaTruck, FaClock, FaFlask, FaHospital, FaSave, FaEdit, FaTrash, FaEye, FaTimes } from "react-icons/fa"
import apiRequest from "../Auth/apiRequest"
import { format } from "date-fns"

const ActionButton = styled.button`
  background: ${(props) =>
    props.variant === "delete"
      ? "linear-gradient(135deg, #ef4444, #dc2626)"
      : props.variant === "edit"
      ? "linear-gradient(135deg, #3b82f6, #2563eb)"
      : "linear-gradient(135deg, #667eea, #764ba2)"};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`

const ModalOverlay = styled.div`
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
  padding: 20px;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 550px;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 18px;
    color: #312e81;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 18px;
    color: #6b7280;
    cursor: pointer;
    &:hover { color: #ef4444; }
  }
`

const ModalBody = styled.div`
  .detail-row {
    margin-bottom: 10px;
    font-size: 14px;
    color: #374151;
  }
`

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  overflow-y: auto;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.05), rgba(102, 126, 234, 0.05));
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 12px;
  }
`

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto 20px;
  flex-shrink: 0;
  width: 100%;

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 12px;
  }
`

const ListCard = styled(FormCard)`
  margin-bottom: 30px;
`

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 15px;
  border-radius: 10px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f5f7ff;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 8px;
  }
`

const Table = styled.table`
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid rgba(102,126,234,0.1);
    font-size: 14px;
  }

  th {
    background: rgba(102,126,234,0.05);
    color: #4c51bf;
    font-weight: 600;
    white-space: nowrap;
  }

  tr:hover td {
    background: rgba(102,126,234,0.02);
  }

  @media (max-width: 768px) {
    th, td {
      padding: 10px 12px;
      font-size: 13px;
    }
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

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;

  &.row-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
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
    display: flex;
    align-items: center;
    gap: 8px;

    @media (max-width: 480px) {
      font-size: 12px;
      margin-bottom: 5px;
    }
  }

  input, select {
    padding: 12px 15px;
    border: 2px solid #e1e8ff;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    transition: all 0.3s ease;
    font-family: 'Poppins', sans-serif;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &::placeholder {
      color: #a0aec0;
    }

    &:disabled {
      background: rgba(226, 232, 240, 0.5);
      color: #718096;
      cursor: not-allowed;
    }

    @media (max-width: 480px) {
      padding: 10px 12px;
      font-size: 13px;
    }
  }

  select {
    cursor: pointer;
  }
`

const TimeRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  select {
    flex: 1;
  }

  span {
    font-weight: 700;
    color: #667eea;
  }
`

const RequiredIndicator = styled.span`
  color: #f093fb;
  margin-left: 2px;
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
  width: 100%;

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

const InfoText = styled.p`
  text-align: center;
  color: #718096;
  font-size: 14px;
  margin-top: 20px;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '46px',
    borderRadius: '10px',
    borderWidth: '2px',
    borderColor: state.isFocused ? '#667eea' : '#e1e8ff',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '14px',
    '&:hover': {
      borderColor: '#667eea',
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: '#a0aec0',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#667eea'
      : state.isFocused
      ? 'rgba(102, 126, 234, 0.1)'
      : 'white',
    color: state.isSelected ? 'white' : '#2d3748',
    cursor: 'pointer',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: '6px',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#4c51bf',
    fontWeight: 600,
  }),
};

const DEFAULT_PROCESSING_LAB = "Shanmuga Mother Lab"

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

// Builds an "HH:MM" select pair that closes immediately on selection,
// instead of a native <input type="time"> picker which stays open.
const TimeSelect = ({ value, onChange }) => {
  const [hour, minute] = value ? value.split(':') : ['', '']

  const handleHourChange = (e) => {
    onChange(`${e.target.value}:${minute || '00'}`)
  }

  const handleMinuteChange = (e) => {
    onChange(`${hour || '00'}:${e.target.value}`)
  }

  return (
    <TimeRow>
      <select value={hour} onChange={handleHourChange}>
        <option value="" disabled>HH</option>
        {HOURS.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <span>:</span>
      <select value={minute} onChange={handleMinuteChange}>
        <option value="" disabled>MM</option>
        {MINUTES.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </TimeRow>
  )
}

const RouteSetup = () => {
  const [formData, setFormData] = useState({
    route_name: "",
    logistics_mapping: "",
    start_time: "",
    end_time: "",
    processing_lab: DEFAULT_PROCESSING_LAB,
    clinical_name: [], // array of referrerCode values, e.g. ["SD0243", "SD0245"]
  })

  const [collectorOptions, setCollectorOptions] = useState([])
  const [clinicalOptions, setClinicalOptions] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const todayDate = new Date().toISOString().split("T")[0]
  const [selectedDate, setSelectedDate] = useState(todayDate)
  const [routesList, setRoutesList] = useState([])
  const [loadingRoutes, setLoadingRoutes] = useState(false)
  const [expandedRoutes, setExpandedRoutes] = useState({})
  const [clinicalSearchInput, setClinicalSearchInput] = useState("")

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  useEffect(() => {
    fetchDropdownOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchRoutes()
  }, [selectedDate])

  const fetchRoutes = async () => {
    setLoadingRoutes(true)
    try {
      const res = await apiRequest(`${Labbaseurl}routesetup/?date=${selectedDate}`, "GET")
      setRoutesList(res?.data || res || [])
    } catch (error) {
      console.error("Error fetching routes list:", error.message)
    } finally {
      setLoadingRoutes(false)
    }
  }

  const fetchDropdownOptions = async () => {
    setLoadingOptions(true)
    try {
      const [collectorRes, clinicalRes, hospitalLabRes] = await Promise.all([
        apiRequest(`${Labbaseurl}sample-collector/`, "GET"),
        apiRequest(`${Labbaseurl}clinical_name/`, "GET"),
        apiRequest(`${Labbaseurl}hospitallabform/`, "GET"),
      ])

      const collectorList = collectorRes?.data || collectorRes || []
      const collectors = collectorList.map((item) => {
        // item is now { employeeId, employeeName }
        const label = typeof item === "string" ? item : item.employeeName || item.name
        const value = typeof item === "string" ? item : (item.employeeId || item.employeeName)
        return { label, value }
      })

      // 1. From core_clinicalname: store referrerCode as value, clinicalname as label
      const clinicalList = clinicalRes?.data || clinicalRes || []
      const clinicals = clinicalList
        .filter((item) => item.clinicalname)
        .map((item) => ({
          label: item.clinicalname,
          value: item.referrerCode || item.clinicalname,
        }))

      // 2. From core_hospitallab: store clinicalname directly as value, clinicalname as label
      const hospitalLabList = hospitalLabRes?.data || hospitalLabRes || []
      const hospitalLabs = hospitalLabList
        .filter((item) => item.clinicalname)
        .map((item) => ({
          label: item.clinicalname,
          value: item.clinicalname,
        }))

      // Combine options without duplicate values
      const combinedOptions = [...clinicals]
      hospitalLabs.forEach((hLab) => {
        if (!combinedOptions.some((opt) => opt.value === hLab.value || opt.label === hLab.label)) {
          combinedOptions.push(hLab)
        }
      })

      setCollectorOptions(collectors)
      setClinicalOptions(combinedOptions)
    } catch (error) {
      console.error("Error fetching dropdown options:", error.message)
      toast.error("Error loading dropdown options. Please try again.")
    } finally {
      setLoadingOptions(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (selectedOption, field) => {
    setFormData((prev) => ({ ...prev, [field]: selectedOption ? selectedOption.value : "" }))
  }

  const handleMultiSelectChange = (selectedOptions, field) => {
    const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : []
    setFormData((prev) => ({ ...prev, [field]: values }))
  }

  const handleClinicalInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      setClinicalSearchInput(inputValue)
    } else if (action === "menu-close") {
      setClinicalSearchInput("")
    }
  }

  const handleTimeChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const [editingRouteId, setEditingRouteId] = useState(null)
  const [viewingRoute, setViewingRoute] = useState(null)

  const resetForm = () => {
    setFormData({
      route_name: "",
      logistics_mapping: "",
      start_time: "",
      end_time: "",
      processing_lab: DEFAULT_PROCESSING_LAB,
      clinical_name: [],
    })
    setEditingRouteId(null)
  }

  const handleEditRoute = (route) => {
    setEditingRouteId(route.id)

    let selectedCodes = []
    if (Array.isArray(route.clinical_name)) {
      selectedCodes = route.clinical_name
    } else if (typeof route.clinical_name === 'string') {
      try {
        selectedCodes = JSON.parse(route.clinical_name)
      } catch (e) {
        selectedCodes = [route.clinical_name]
      }
    }

    setFormData({
      route_name: route.route_name || "",
      logistics_mapping: route.logistics_mapping || "",
      start_time: route.start_time || "",
      end_time: route.end_time || "",
      processing_lab: route.processing_lab || DEFAULT_PROCESSING_LAB,
      clinical_name: selectedCodes,
    })

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCancelEdit = () => {
    resetForm()
  }

  const handleDeleteRoute = async (routeId) => {
    if (!window.confirm("Are you sure you want to delete this route setup?")) return
    try {
      await apiRequest(`${Labbaseurl}routesetup/${routeId}/`, "DELETE")
      toast.success("Route deleted successfully!")
      if (editingRouteId === routeId) {
        resetForm()
      }
      fetchRoutes()
    } catch (error) {
      console.error("Error deleting route:", error.message)
      toast.error(error.message || "Failed to delete route")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.route_name ||
      !formData.logistics_mapping ||
      !formData.start_time ||
      !formData.end_time ||
      formData.clinical_name.length === 0
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      if (editingRouteId) {
        await apiRequest(`${Labbaseurl}routesetup/${editingRouteId}/`, "PUT", {
          ...formData,
          id: editingRouteId,
        })
        toast.success("Route Setup updated successfully!")
      } else {
        await apiRequest(`${Labbaseurl}routesetup/`, "POST", formData)
        toast.success("Route Setup saved successfully!")
      }
      resetForm()
      fetchRoutes()
    } catch (error) {
      console.error("Error saving route setup:", error.message)
      toast.error(error.message || "Failed to save Route Setup")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer>
      <FormCard>
        <StyledTitle>{editingRouteId ? `Edit Route Setup (#${editingRouteId})` : "Route Setup"}</StyledTitle>

        <form onSubmit={handleSubmit}>
          <Row>
            <FormGroup>
              <label>
                <FaRoute />
                Route Name<RequiredIndicator>*</RequiredIndicator>
              </label>
              <input
                type="text"
                name="route_name"
                value={formData.route_name}
                onChange={handleChange}
                placeholder="Enter route name"
                required
              />
            </FormGroup>

            <FormGroup>
              <label>
                <FaTruck />
                Sample Collector<RequiredIndicator>*</RequiredIndicator>
              </label>
              <Select
                options={collectorOptions}
                isLoading={loadingOptions}
                isClearable
                isSearchable
                placeholder="Search and select sample collector"
                styles={selectStyles}
                value={collectorOptions.find((opt) => opt.value === formData.logistics_mapping) || null}
                onChange={(option) => handleSelectChange(option, "logistics_mapping")}
              />
            </FormGroup>
          </Row>

          <Row className="row-2">
            <FormGroup>
              <label>
                <FaClock />
                Start Time<RequiredIndicator>*</RequiredIndicator>
              </label>
              <TimeSelect
                value={formData.start_time}
                onChange={(value) => handleTimeChange("start_time", value)}
              />
            </FormGroup>

            <FormGroup>
              <label>
                <FaClock />
                End Time<RequiredIndicator>*</RequiredIndicator>
              </label>
              <TimeSelect
                value={formData.end_time}
                onChange={(value) => handleTimeChange("end_time", value)}
              />
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <label>
                <FaFlask />
                Processing Lab
              </label>
              <input
                type="text"
                name="processing_lab"
                value={formData.processing_lab}
                onChange={handleChange}
                disabled
              />
            </FormGroup>

            <FormGroup>
              <label>
                <FaHospital />
                Clinical / Lab Names<RequiredIndicator>*</RequiredIndicator>
              </label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                blurInputOnSelect={false}
                options={clinicalOptions}
                isLoading={loadingOptions}
                isClearable
                isSearchable
                placeholder="Search and select one or more clinical labs"
                styles={selectStyles}
                value={formData.clinical_name.map((val) => {
                  const found = clinicalOptions.find((opt) => opt.value === val)
                  return found || { label: val, value: val }
                })}
                onChange={(options) => handleMultiSelectChange(options, "clinical_name")}
                inputValue={clinicalSearchInput}
                onInputChange={handleClinicalInputChange}
              />
            </FormGroup>
          </Row>

          <ButtonContainer style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <SpinnerIcon />
                  {editingRouteId ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  <FaSave />
                  {editingRouteId ? "Update Route Setup" : "Save Route Setup"}
                </>
              )}
            </SubmitButton>

            {editingRouteId && (
              <ActionButton
                type="button"
                variant="delete"
                onClick={handleCancelEdit}
                style={{ padding: "12px 24px", fontSize: "14px", borderRadius: "10px" }}
              >
                <FaTimes /> Cancel Edit
              </ActionButton>
            )}
          </ButtonContainer>

          <InfoText>
            Fields marked with <RequiredIndicator>*</RequiredIndicator> are required
          </InfoText>
        </form>
      </FormCard>

      <ListCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <StyledTitle style={{ margin: 0, fontSize: '1.8rem' }}>Assigned Routes</StyledTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaClock color="#667eea" />
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #e1e8ff",
                fontFamily: "'Poppins', sans-serif",
                outline: "none"
              }}
            />
          </div>
        </div>

        {loadingRoutes ? (
          <p style={{ textAlign: 'center', color: '#a0aec0' }}>Loading routes...</p>
        ) : routesList.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Route Name</th>
                  <th>Sample Collector</th>
                  <th>Time Window</th>
                  <th>Clinical/Lab Names</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {routesList.map((r) => {
                  const collectorName = collectorOptions.find(opt => opt.value === r.logistics_mapping)?.label || r.logistics_mapping;
                  return (
                    <tr key={r.id}>
                      <td><strong>{r.route_name}</strong></td>
                      <td>{collectorName}</td>
                      <td>{r.start_time} - {r.end_time}</td>
                      <td>
                        <button 
                          onClick={() => setExpandedRoutes(prev => ({ ...prev, [r.id]: !prev[r.id] }))}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#667eea",
                            fontWeight: 600,
                            cursor: "pointer",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            textDecoration: "underline"
                          }}
                        >
                          {expandedRoutes[r.id] ? "Hide Labs" : `${r.clinical_name_display?.length || 0} Labs`}
                        </button>
                        
                        {expandedRoutes[r.id] && (
                          <div style={{ marginTop: "8px", fontSize: "13px", color: "#4a5568", background: "#f7fafc", padding: "8px", borderRadius: "8px" }}>
                            {r.clinical_name_display?.map((c, i) => (
                              <div key={i} style={{ marginBottom: "4px" }}>
                                • {c.clinicalname || c.referrerCode}
                                {c.referrerCode && c.referrerCode !== c.clinicalname && (
                                  <span style={{ color: "#a0aec0", fontSize: "11px", marginLeft: "4px" }}>
                                    ({c.referrerCode})
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
                          <ActionButton variant="view" onClick={() => setViewingRoute(r)} title="View route details">
                            <FaEye /> View
                          </ActionButton>

                          <ActionButton variant="edit" onClick={() => handleEditRoute(r)} title="Edit route setup">
                            <FaEdit /> Edit
                          </ActionButton>

                          <ActionButton variant="delete" onClick={() => handleDeleteRoute(r.id)} title="Delete route setup">
                            <FaTrash /> Delete
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
            </TableContainer>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#a0aec0' }}>No routes found for this date.</p>
        )}
      </ListCard>

      {/* View Route Details Modal */}
      {viewingRoute && (
        <ModalOverlay onClick={() => setViewingRoute(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Route Details - {viewingRoute.route_name}</h3>
              <button className="close-btn" onClick={() => setViewingRoute(null)}>
                <FaTimes />
              </button>
            </ModalHeader>
            <ModalBody>
              <div className="detail-row"><strong>Route ID:</strong> #{viewingRoute.id}</div>
              <div className="detail-row"><strong>Route Name:</strong> {viewingRoute.route_name}</div>
              <div className="detail-row">
                <strong>Sample Collector:</strong>{" "}
                {collectorOptions.find((opt) => opt.value === viewingRoute.logistics_mapping)?.label || viewingRoute.logistics_mapping}
              </div>
              <div className="detail-row"><strong>Time Window:</strong> {viewingRoute.start_time} - {viewingRoute.end_time}</div>
              <div className="detail-row"><strong>Processing Lab:</strong> {viewingRoute.processing_lab || "Main Lab"}</div>
              <div className="detail-row"><strong>Assigned Labs Count:</strong> {viewingRoute.clinical_name_display?.length || 0}</div>
              
              <hr style={{ margin: "14px 0", border: "0", borderTop: "1px solid #e2e8f0" }} />
              
              <h4 style={{ margin: "0 0 10px 0", color: "#4c51bf", fontSize: "14px" }}>Assigned Clinical / Lab Names:</h4>
              <div style={{ maxHeight: "220px", overflowY: "auto", background: "#f8fafc", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                {viewingRoute.clinical_name_display?.length > 0 ? (
                  viewingRoute.clinical_name_display.map((c, i) => (
                    <div key={i} style={{ padding: "6px 0", borderBottom: i < viewingRoute.clinical_name_display.length - 1 ? "1px solid #e2e8f0" : "none", fontSize: "13px" }}>
                      {i + 1}. <strong>{c.clinicalname}</strong> {c.referrerCode && c.referrerCode !== c.clinicalname ? <span style={{ color: "#718096", fontSize: "12px" }}>({c.referrerCode})</span> : ""}
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#a0aec0", fontSize: "13px" }}>No labs assigned</div>
                )}
              </div>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </PageContainer>
  )
}

export default RouteSetup