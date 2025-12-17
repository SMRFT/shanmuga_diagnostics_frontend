"use client"

"use client"

import { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { FaSearch, FaClipboardList, FaEdit, FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa"
import TestForm from "./TestForm"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import apiRequest from "../Auth/apiRequest"

const Container = styled.div`
  padding: 1rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const SearchContainer = styled.div`
  position: relative;
  width: 350px;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const SearchInput = styled.input`
  width: 100%;
  height: 45px;
  padding: 0 40px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`

const SearchIcon = styled(FaSearch)`
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 16px;
`

const AddButton = styled.button`
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background-color: #1d4ed8;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 14px 16px;
  }
`

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  width: 100%;
`

const ModernTable = styled.table`
  width: 100%;
  min-width: 1100px;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: top;
  }

  th {
    background-color: #f8fafc;
    font-weight: 700;
    color: #334155;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  tr:nth-child(even) {
    background-color: #f9fafb;
  }

  tr:hover {
    background-color: #f1f5f9;
  }

  tr.focused-row {
    background-color: #e6f3ff !important;
    border: 2px solid #2563eb;
  }

  @media (max-width: 1024px) {
    th,
    td {
      padding: 0.75rem;
    }
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: 0.5rem;
    }
    font-size: 12px;
  }
`

const ActionIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #64748b;
  padding: 0.25rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #2563eb;
    background-color: rgba(37, 99, 235, 0.08);
  }

  &.add-icon {
    color: #10b981;
    font-size: 16px;

    &:hover {
      color: #059669;
      background-color: rgba(16, 185, 129, 0.1);
    }
  }

  &.delete-icon {
    color: #ef4444;
    font-size: 16px;

    &:hover {
      color: #dc2626;
      background-color: rgba(239, 68, 68, 0.1);
    }
  }
`

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12);
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
  box-sizing: border-box;
`

const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  width: calc(100% - 300px);
  margin-left: 300px;
  max-width: 1100px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);

  @media (max-width: 992px) {
    width: 94%;
    margin-left: 0;
  }

  @media (max-width: 576px) {
    width: 100%;
    margin-left: 0;
    border-radius: 0;
  }
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
`

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.2s ease;

  &:hover {
    color: #0f172a;
  }
`

const ModalBody = styled.div`
  padding: 1.25rem;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #e2e8f0;
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) =>
    props.secondary &&
    `background-color: #f8fafc;
    color: #475569;
    border: 1px solid #e2e8f0;
    
    &:hover {
      background-color: #f1f5f9;
    }
  `}

  ${(props) =>
    props.primary &&
    `background-color: #2563eb;
    color: white;
    border: 1px solid #2563eb;
    
    &:hover {
      background-color: #1d4ed8;
    }
  `}
`

const TestName = styled.div`
  margin-bottom: 1rem;
  padding: 0 1.25rem;
  font-size: 1rem;
  color: #334155;
`

const EmptyMessage = styled.td`
  text-align: center;
  padding: 2rem !important;
  color: #718096;
`

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 36px;
  align-items: center;
  border: 1px dashed #e2e8f0;
  padding: 6px;
  border-radius: 8px;
  background: #fafafa;
`

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e2e8f0;
  color: #0f172a;
  padding: 6px 8px;
  border-radius: 9999px;
  font-size: 12px;

  button {
    background: transparent;
    border: none;
    color: #0f172a;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
  }
`

const OptionInput = styled.input`
  border: none;
  outline: none;
  min-width: 120px;
  flex: 1;
  background: transparent;
  padding: 6px 4px;
  font-size: 14px;
`

const DropdownWrapper = styled.div`
  position: relative;
  width: 180px;
`
const DropdownButton = styled.button`
  width: 100%;
  min-height: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  padding: 8px 10px;
  text-align: left;
  cursor: pointer;
  color: #0f172a;
`
const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 240px;
  overflow: auto;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-top: 6px;
  z-index: 60;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  padding: 8px;
`
const DropdownItem = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;

  input {
    accent-color: #2563eb;
  }

  &:hover {
    background: #f8fafc;
  }
`

const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 6px;
  gap: 12px;
`
const PageControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  button {
    padding: 6px 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  span {
    color: #475569;
    font-size: 14px;
  }
`

const TestEdit = () => {
  const [testDetails, setTestDetails] = useState([])
  const [filteredTestDetails, setFilteredTestDetails] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedParameters, setSelectedParameters] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingRow, setEditingRow] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTestId, setSelectedTestId] = useState(null)
  const [selectedTestName, setSelectedTestName] = useState("")
  const [showTestForm, setShowTestForm] = useState(false)
  const [focusedRow, setFocusedRow] = useState(null)
  const [lastEditedTestId, setLastEditedTestId] = useState(null)

  const [devices, setDevices] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const tableRef = useRef(null)
  const rowRefs = useRef({})

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [testsRes, devicesRes] = await Promise.all([
          apiRequest(`${Labbaseurl}testdetails/`, "GET"),
          apiRequest(`${Labbaseurl}get_devices/`, "GET"),
        ])
        if (testsRes.success) {
          const data = testsRes.data?.data || testsRes.data || []
          setTestDetails(data)
          setFilteredTestDetails(data)
        } else {
          toast.error(testsRes.error || "Failed to fetch test details")
        }

        if (devicesRes.success) {
          const records = Array.isArray(devicesRes.data?.data) ? devicesRes.data.data : devicesRes.data || []
          setDevices(records.filter((d) => d?.device_id))
        } else {
          toast.error(devicesRes.error || "Failed to load devices")
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        toast.error("An unexpected error occurred while loading data")
        setTestDetails([])
        setFilteredTestDetails([])
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [Labbaseurl])

  useEffect(() => {
    if (lastEditedTestId && filteredTestDetails.length > 0) {
      const testIndex = filteredTestDetails.findIndex((test) => test.test_id === lastEditedTestId)
      if (testIndex !== -1) {
        setFocusedRow(testIndex)
        setTimeout(() => {
          scrollToRow(testIndex)
        }, 800)
      }
    }
  }, [filteredTestDetails, lastEditedTestId])

  useEffect(() => {
    if (focusedRow !== null) {
      const timer = setTimeout(() => setFocusedRow(null), 2500)
      return () => clearTimeout(timer)
    }
  }, [focusedRow])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const scrollToRow = (index) => {
    const rowElement = rowRefs.current[index]
    if (rowElement) {
      rowElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      })
    }
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    const filteredData = testDetails.filter(
      (test) =>
        (test.test_name && test.test_name.toLowerCase().includes(query.toLowerCase())) ||
        (test.shortcut && test.shortcut.toLowerCase().includes(query.toLowerCase())),
    )

    setFilteredTestDetails(filteredData)
    setEditingRow(null)
    setFocusedRow(null)
  }

  // Parse parameters from various formats - get array from first device
  const parseParams = (parameters) => {
    if (!parameters) return []
    if (Array.isArray(parameters)) return parameters
    if (typeof parameters === "object" && Object.keys(parameters).length > 0) {
      // Get first device's parameters
      const firstDeviceParams = Object.values(parameters)[0]
      if (Array.isArray(firstDeviceParams)) {
        return firstDeviceParams
      }
    }
    return []
  }

  const hasParameters = (test) => {
    const p = test?.parameters
    if (!p) return false
    if (Array.isArray(p)) return p.length > 0
    if (typeof p === "object") return Object.keys(p).length > 0
    return false
  }

  const ensureParamShape = (arr) =>
    (arr || []).map((p) => ({
      test_name: p.test_name || "",
      unit: p.unit || "",
      reference_range: p.reference_range || "",
      method: p.method || "",
      test_code: p.test_code || "",
      sub_title: p.sub_title || "",
      value_option: Array.isArray(p.value_option) ? p.value_option : [],
      department: p.department || "",
      _newOption: "",
    }))

  const handleParameterClick = (test) => {
    const testId = test?.test_id
    const testName = test?.test_name
    let parsedParameters = ensureParamShape(parseParams(test?.parameters))
    if (parsedParameters.length === 0) {
      parsedParameters = [
        {
          test_name: "",
          unit: "",
          reference_range: "",
          method: "",
          test_code: test?.test_code || "",
          sub_title: "",
          value_option: [],
          department: "",
          _newOption: "",
        },
      ]
    }
    setSelectedParameters(parsedParameters)
    setShowModal(true)
    setSelectedTestId(testId)
    setSelectedTestName(testName)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedParameters([])
    setSelectedTestId(null)
    setSelectedTestName("")
  }

  const handleEditClick = (index) => {
    setEditingRow(index)
    setFocusedRow(null)
  }

  const handleParameterChange = (index, field, value) => {
    const updatedParameters = [...selectedParameters]
    updatedParameters[index][field] = value
    setSelectedParameters(updatedParameters)
  }

  const addValueOption = (index) => {
    setSelectedParameters((prev) => {
      const next = [...prev]
      const text = (next[index]._newOption || "").trim()
      if (text && !next[index].value_option.includes(text)) {
        next[index].value_option = [...(next[index].value_option || []), text]
        next[index]._newOption = ""
      }
      return next
    })
  }

  const onOptionKeyDown = (index, e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addValueOption(index)
    }
  }

  const removeValueOption = (pIndex, optIndex) => {
    setSelectedParameters((prev) => {
      const next = [...prev]
      next[pIndex].value_option = (next[pIndex].value_option || []).filter((_, i) => i !== optIndex)
      return next
    })
  }

  const handleAddParameter = () => {
    const newParameter = {
      test_name: "",
      unit: "",
      reference_range: "",
      method: "",
      test_code: "",
      sub_title: "",
      value_option: [],
      department: "",
      _newOption: "",
    }
    setSelectedParameters([...selectedParameters, newParameter])
  }

  const handleDeleteParameter = (index) => {
    if (selectedParameters.length > 1) {
      const updatedParameters = selectedParameters.filter((_, i) => i !== index)
      setSelectedParameters(updatedParameters)
    }
  }

  const handleSaveParameters = async () => {
    const currentTest = testDetails.find((t) => t.test_id === selectedTestId)

    // Get device IDs
    const deviceIds = Array.isArray(currentTest?.device_id)
      ? currentTest.device_id
      : typeof currentTest?.device_id === "string"
        ? currentTest.device_id
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : []

    // Clean parameters - remove UI-only fields
    const cleanedParams = selectedParameters.map((p) => ({
      test_name: p.test_name || "",
      unit: p.unit || "",
      reference_range: p.reference_range || "",
      method: p.method || "",
      test_code: p.test_code || "",
      sub_title: p.sub_title || "",
      value_option: Array.isArray(p.value_option) ? p.value_option.filter((v) => v && v.trim()) : [],
      department: p.department || "",
    }))

    const parametersPayload =
      deviceIds.length === 1 ? cleanedParams : Object.fromEntries(deviceIds.map((id) => [id, cleanedParams]))

    try {
      const response = await apiRequest(`${Labbaseurl}testdetails/`, "PATCH", {
        test_id: selectedTestId,
        parameters: parametersPayload,
      })

      if (response.success) {
        // Clear test_code when parameters are set
        await apiRequest(`${Labbaseurl}test_details_test/`, "PATCH", {
          test_id: selectedTestId,
          test_code: "",
        })

        toast.success("Parameters updated successfully!")

        const updatedAll = testDetails.map((t) =>
          t.test_id === selectedTestId ? { ...t, parameters: parametersPayload, test_code: "" } : t,
        )
        setTestDetails(updatedAll)

        const filtered = updatedAll.filter(
          (t) =>
            (t.test_name && t.test_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (t.shortcut && t.shortcut.toLowerCase().includes(searchQuery.toLowerCase())),
        )
        setFilteredTestDetails(filtered)

        setLastEditedTestId(selectedTestId)
        setShowModal(false)
        setSelectedParameters([])
        setSelectedTestId(null)
        setSelectedTestName("")
      } else {
        toast.error(response.error || "Failed to update parameters")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("An error occurred while updating parameters")
    }
  }

  const handleSaveClick = async (index) => {
    const updatedTest = filteredTestDetails[index]
    const deviceArr = Array.isArray(updatedTest.device_id)
      ? updatedTest.device_id
      : typeof updatedTest.device_id === "string"
        ? updatedTest.device_id
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : []

    try {
      const response = await apiRequest(`${Labbaseurl}test_details_test/`, "PATCH", {
        test_id: updatedTest.test_id,
        shortcut: updatedTest.shortcut,
        department: updatedTest.department,
        collection_container: updatedTest.collection_container,
        specimen_type: updatedTest.specimen_type,
        method: updatedTest.method,
        reference_range: updatedTest.reference_range,
        unit: updatedTest.unit,
        test_code: hasParameters(updatedTest) ? undefined : updatedTest.test_code,
        device_id: deviceArr,
      })

      if (response.success) {
        toast.success("Test updated successfully!")
        const originalIndex = testDetails.findIndex((test) => test.test_id === updatedTest.test_id)
        if (originalIndex !== -1) {
          const updatedTestDetails = [...testDetails]
          updatedTestDetails[originalIndex] = { ...updatedTest, device_id: deviceArr }
          setTestDetails(updatedTestDetails)
        }
        setLastEditedTestId(updatedTest.test_id)
        setEditingRow(null)
      } else {
        toast.error(response.error || "Error updating test details")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("An error occurred while updating test details")
    }
  }

  const handleInputChange = (e, index, field) => {
    const value = e.target.value
    const updatedFilteredTestDetails = [...filteredTestDetails]
    updatedFilteredTestDetails[index][field] = value
    setFilteredTestDetails(updatedFilteredTestDetails)

    const originalIndex = testDetails.findIndex((test) => test.test_id === filteredTestDetails[index].test_id)
    if (originalIndex !== -1) {
      const updatedTestDetails = [...testDetails]
      updatedTestDetails[originalIndex][field] = value
      setTestDetails(updatedTestDetails)
    }
  }

  const toggleRowDevice = (rowIndex, deviceId) => {
    setFilteredTestDetails((prev) => {
      const next = [...prev]
      const current = Array.isArray(next[rowIndex].device_id) ? next[rowIndex].device_id : []
      const exists = current.includes(deviceId)
      const updated = exists ? current.filter((d) => d !== deviceId) : [...current, deviceId]
      next[rowIndex].device_id = updated
      return next
    })
    setTestDetails((prevAll) => {
      const testId = filteredTestDetails[rowIndex]?.test_id
      return prevAll.map((t) =>
        t.test_id === testId
          ? {
              ...t,
              device_id: Array.isArray(filteredTestDetails[rowIndex].device_id)
                ? filteredTestDetails[rowIndex].device_id
                : [],
            }
          : t,
      )
    })
  }

  const handleTestAdded = (newTestId) => {
    const fetchTestDetails = async () => {
      try {
        const response = await apiRequest(`${Labbaseurl}testdetails/`, "GET")

        if (response.success) {
          const data = response.data?.data || response.data || []
          setTestDetails(data)
          setFilteredTestDetails(data)
          setLastEditedTestId(newTestId)
        } else {
          console.error("Error fetching test details:", response.error)
          toast.error(response.error || "Failed to fetch updated test list")
        }
      } catch (error) {
        console.error("Unexpected error in handleTestAdded:", error)
        toast.error("An unexpected error occurred while refreshing test list")
      }
    }

    fetchTestDetails()
  }

  const DeviceDropdown = ({ rowIndex, selected = [], options = [], onToggle }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
      const onDocClick = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false)
      }
      document.addEventListener("mousedown", onDocClick)
      return () => document.removeEventListener("mousedown", onDocClick)
    }, [])

    const label =
      selected.length === 0
        ? "Select devices"
        : `${selected.length} selected: ${selected.slice(0, 3).join(", ")}${selected.length > 3 ? "…" : ""}`

    return (
      <DropdownWrapper ref={ref}>
        <DropdownButton type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {label}
        </DropdownButton>
        {open && (
          <DropdownMenu role="listbox" aria-multiselectable="true">
            {options.map((d, i) => {
              const id = `${rowIndex}-${d.device_id}-${i}`
              const checked = Array.isArray(selected) && selected.includes(d.device_id)
              return (
                <DropdownItem key={id} htmlFor={id}>
                  <input id={id} type="checkbox" checked={!!checked} onChange={() => onToggle(d.device_id)} />
                  <span>
                    {d.device_id} {d.department ? `(${d.department})` : ""}
                  </span>
                </DropdownItem>
              )
            })}
          </DropdownMenu>
        )}
      </DropdownWrapper>
    )
  }

  const totalPages = Math.max(1, Math.ceil(filteredTestDetails.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const visibleRows = filteredTestDetails.slice(startIndex, endIndex)

  if (loading) {
    return (
      <Container>
        <div>Loading test details...</div>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title>Test Details</Title>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search Test Name or Shortcut"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchContainer>
        <AddButton onClick={() => setShowTestForm(true)}>
          <FaPlus size={16} />
          <span>Add Test</span>
        </AddButton>
      </Header>

      <TableWrapper ref={tableRef}>
        <ModernTable>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Shortcut</th>
              <th>Department</th>
              <th>Collection Container</th>
              <th>Specimen Type</th>
              <th>Method</th>
              <th>Reference Range</th>
              <th>Unit</th>
              <th>Device IDs</th>
              <th>Test Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length > 0 ? (
              visibleRows.map((test, localIdx) => {
                const globalIndex = startIndex + localIdx
                const parameterized = hasParameters(test)
                const deviceDisplay = Array.isArray(test.device_id)
                  ? test.device_id.join(", ")
                  : typeof test.device_id === "string"
                    ? test.device_id
                    : ""
                return (
                  <tr
                    key={globalIndex}
                    ref={(el) => (rowRefs.current[globalIndex] = el)}
                    className={focusedRow === globalIndex ? "focused-row" : ""}
                  >
                    <td>
                      {editingRow === globalIndex ? (
                        <Input
                          type="text"
                          value={test.test_name || ""}
                          onChange={(e) => handleInputChange(e, globalIndex, "test_name")}
                        />
                      ) : (
                        test.test_name
                      )}
                    </td>
                    <td>
                      {editingRow === globalIndex ? (
                        <Input
                          type="text"
                          value={test.shortcut || ""}
                          onChange={(e) => handleInputChange(e, globalIndex, "shortcut")}
                        />
                      ) : (
                        test.shortcut
                      )}
                    </td>
                    <td>
                      {editingRow === globalIndex ? (
                        <Input
                          type="text"
                          value={test.department || ""}
                          onChange={(e) => handleInputChange(e, globalIndex, "department")}
                        />
                      ) : (
                        test.department
                      )}
                    </td>
                    <td>
                      {editingRow === globalIndex ? (
                        <Input
                          type="text"
                          value={test.collection_container || ""}
                          onChange={(e) => handleInputChange(e, globalIndex, "collection_container")}
                        />
                      ) : (
                        test.collection_container
                      )}
                    </td>
                    <td>
                      {editingRow === globalIndex ? (
                        <Input
                          type="text"
                          value={test.specimen_type || ""}
                          onChange={(e) => handleInputChange(e, globalIndex, "specimen_type")}
                        />
                      ) : (
                        test.specimen_type
                      )}
                    </td>
                    <td>
                      {editingRow === globalIndex ? (
                        <Input
                          type="text"
                          value={test.method || ""}
                          onChange={(e) => handleInputChange(e, globalIndex, "method")}
                        />
                      ) : (
                        test.method
                      )}
                    </td>
                    <td>
                      {editingRow === globalIndex ? (
                        <Input
                          type="text"
                          value={test.reference_range || ""}
                          onChange={(e) => handleInputChange(e, globalIndex, "reference_range")}
                        />
                      ) : (
                        test.reference_range
                      )}
                    </td>
                    <td>
                      {editingRow === globalIndex ? (
                        <Input
                          type="text"
                          value={test.unit || ""}
                          onChange={(e) => handleInputChange(e, globalIndex, "unit")}
                        />
                      ) : (
                        test.unit
                      )}
                    </td>

                    <td>
                      {editingRow === globalIndex ? (
                        <DeviceDropdown
                          rowIndex={globalIndex}
                          selected={Array.isArray(test.device_id) ? test.device_id : []}
                          options={devices}
                          onToggle={(deviceId) => toggleRowDevice(globalIndex, deviceId)}
                        />
                      ) : (
                        deviceDisplay || "-"
                      )}
                    </td>

                    <td>
                      {parameterized ? (
                        <span style={{ color: "#64748b" }}>Per-parameter</span>
                      ) : editingRow === globalIndex ? (
                        <Input
                          type="text"
                          value={test.test_code || ""}
                          onChange={(e) => handleInputChange(e, globalIndex, "test_code")}
                        />
                      ) : (
                        test.test_code || "-"
                      )}
                    </td>

                    <td>
                      <ActionIcons>
                        <IconButton onClick={() => handleParameterClick(test)} title="View/Edit Parameters">
                          <FaClipboardList />
                        </IconButton>

                        {editingRow === globalIndex ? (
                          <IconButton onClick={() => handleSaveClick(globalIndex)} title="Save Changes">
                            <FaSave />
                          </IconButton>
                        ) : (
                          <IconButton onClick={() => handleEditClick(globalIndex)} title="Edit Test">
                            <FaEdit />
                          </IconButton>
                        )}
                      </ActionIcons>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <EmptyMessage colSpan="11">No test details available.</EmptyMessage>
              </tr>
            )}
          </tbody>
        </ModernTable>
      </TableWrapper>

      <PaginationBar>
        <span>
          Showing {filteredTestDetails.length === 0 ? 0 : startIndex + 1}-{" "}
          {Math.min(endIndex, filteredTestDetails.length)} of {filteredTestDetails.length}
        </span>
        <PageControls>
          <Button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </PageControls>
      </PaginationBar>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Parameters</ModalTitle>
              <ModalCloseButton onClick={handleCloseModal}>
                <FaTimes />
              </ModalCloseButton>
            </ModalHeader>

            <TestName>Test Name: {selectedTestName}</TestName>

            <ModalBody>
              <TableWrapper>
                <ModernTable>
                  <thead>
                    <tr>
                      <th>Test Name</th>
                      <th>Unit</th>
                      <th>Reference Range</th>
                      <th>Method</th>
                      <th>Department</th>
                      <th>Sub Title</th>
                      <th>Value Options</th>
                      <th>Test Code</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedParameters.map((param, index) => (
                      <tr key={index}>
                        <td>
                          <Input
                            type="text"
                            value={param.test_name || ""}
                            onChange={(e) => handleParameterChange(index, "test_name", e.target.value)}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            value={param.unit || ""}
                            onChange={(e) => handleParameterChange(index, "unit", e.target.value)}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            value={param.reference_range || ""}
                            onChange={(e) => handleParameterChange(index, "reference_range", e.target.value)}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            value={param.method || ""}
                            onChange={(e) => handleParameterChange(index, "method", e.target.value)}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            value={param.department || ""}
                            onChange={(e) => handleParameterChange(index, "department", e.target.value)}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            value={param.sub_title || ""}
                            onChange={(e) => handleParameterChange(index, "sub_title", e.target.value)}
                            placeholder="e.g., MACROSCOPIC EXAMINATION"
                          />
                        </td>
                        <td>
                          <Chips>
                            {(param.value_option || []).map((opt, i) => (
                              <Chip key={`${index}-opt-${i}`}>
                                {opt}
                                <button type="button" onClick={() => removeValueOption(index, i)} aria-label="Remove">
                                  <FaTimes size={12} />
                                </button>
                              </Chip>
                            ))}
                            <OptionInput
                              type="text"
                              value={param._newOption || ""}
                              placeholder="Type and press Enter"
                              onChange={(e) => handleParameterChange(index, "_newOption", e.target.value)}
                              onKeyDown={(e) => onOptionKeyDown(index, e)}
                            />
                          </Chips>
                        </td>
                        <td>
                          <Input
                            type="text"
                            value={param.test_code || ""}
                            onChange={(e) => handleParameterChange(index, "test_code", e.target.value)}
                          />
                        </td>
                        <td>
                          <ActionIcons>
                            <IconButton className="add-icon" onClick={handleAddParameter} title="Add Parameter">
                              <FaPlus />
                            </IconButton>
                            {selectedParameters.length > 1 && (
                              <IconButton
                                className="delete-icon"
                                onClick={() => handleDeleteParameter(index)}
                                title="Delete Parameter"
                              >
                                <FaTrash />
                              </IconButton>
                            )}
                          </ActionIcons>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ModernTable>
              </TableWrapper>
            </ModalBody>

            <ModalFooter>
              <Button secondary onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button primary onClick={handleSaveParameters}>
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      <TestForm show={showTestForm} setShow={setShowTestForm} onTestAdded={handleTestAdded} />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </Container>
  )
}

export default TestEdit
