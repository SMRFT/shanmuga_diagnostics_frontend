"use client"

import { useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import styled from "styled-components"
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import apiRequest from "../Auth/apiRequest"

const StyledModal = styled(Modal)`
  .modal-dialog {
    width: 100%;
    max-width: 980px;
    margin: 1rem auto;
    margin-left: 300px;
    padding: 0 1rem;
  }

  .modal-content {
    padding: 1.25rem;
    border-radius: 12px;
  }

  @media (max-width: 992px) {
    .modal-dialog {
      max-width: 92%;
      margin-left: 0;
    }
  }

  @media (max-width: 576px) {
    .modal-dialog {
      max-width: 100%;
      margin: 0;
    }
    .modal-content {
      padding: 0.75rem;
      border-radius: 0;
    }
  }
`

const ToggleSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 25px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e1;
    transition: 0.3s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 19px;
    width: 19px;
    left: 4px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #22c55e;
  }

  input:checked + .slider:before {
    transform: translateX(24px);
  }
`

const Label = styled.label`
  display: inline-block;
  margin-bottom: 0.35rem;
  font-weight: 600;
  color: #0f172a;
`

const TextInput = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`

const NumberInput = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`

const SmallNote = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
`

const IconBtn = styled.button`
  border: none;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  background-color: ${(p) => (p.variant === "danger" ? "#ef4444" : "#6b7280")};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const SubmitBtn = styled.button`
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  background-color: #16a34a;
`

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
`

const Col = styled.div`
  flex: 1 1 ${(p) => p.basis || "200px"};
  min-width: ${(p) => p.minw || "200px"};
`

const Divider = styled.hr`
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 16px 0;
`

const DeviceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const DeviceItem = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e5e7eb;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;

  input {
    accent-color: #2563eb;
    transform: scale(1.1);
  }

  span {
    color: #0f172a;
    font-size: 14px;
  }
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

const TestForm = ({ show, setShow, onTestAdded }) => {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  const [formData, setFormData] = useState({
    test_name: "",
    shortcut: "",
    department: "",
    method: "",
    collection_container: "",
    specimen_type: "",
    reference_range: "",
    units: "",
    MRP: "",
    L2L_Rate_Card: "",
    status: "Pending",
    test_code: "",
    device_id: [],
  })

  const [parameterList, setParameterList] = useState([
    {
      test_name: "",
      department: "",
      method: "",
      unit: "",
      reference_range: "",
      test_code: "",
      sub_title: "",
      value_option: [],
      _newOption: "",
    },
  ])

  const [parametersVisible, setParametersVisible] = useState(false)
  const [devices, setDevices] = useState([])
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await apiRequest(`${Labbaseurl}get_devices/`, "GET")
        if (res.success) {
          const records = Array.isArray(res.data?.data) ? res.data.data : res.data || []
          setDevices(records.filter((d) => d?.device_id))
        } else {
          toast.error(res.error || "Failed to load devices")
        }
      } catch (e) {
        toast.error("Error loading devices")
      }
    }
    fetchDevices()
  }, [Labbaseurl])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const toggleDevice = (deviceId) => {
    setFormData((prev) => {
      const exists = prev.device_id.includes(deviceId)
      return {
        ...prev,
        device_id: exists ? prev.device_id.filter((d) => d !== deviceId) : [...prev.device_id, deviceId],
      }
    })
  }

  const handleParameterChange = (index, e) => {
    const { name, value } = e.target
    setParameterList((prev) => {
      const next = [...prev]
      next[index][name] = value
      return next
    })
  }

  const addParameter = () => {
    setParameterList((prev) => [
      ...prev,
      {
        test_name: "",
        department: "",
        method: "",
        unit: "",
        reference_range: "",
        test_code: "",
        sub_title: "",
        value_option: [],
        _newOption: "",
      },
    ])
  }

  const removeParameter = (index) => {
    setParameterList((prev) => prev.filter((_, i) => i !== index))
  }

  const addValueOption = (index) => {
    setParameterList((prev) => {
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
    setParameterList((prev) => {
      const next = [...prev]
      next[pIndex].value_option = (next[pIndex].value_option || []).filter((_, i) => i !== optIndex)
      return next
    })
  }

  const sendApprovalEmail = async (testName) => {
    try {
      const response = await apiRequest(`${Labbaseurl}send_approval_email/`, "POST", {
        test_name: testName,
      })
      if (!response.success) {
        console.error("Error sending approval email:", response.error)
      }
    } catch (error) {
      console.error("Unexpected error sending approval email:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      test_name: "",
      shortcut: "",
      department: "",
      method: "",
      collection_container: "",
      specimen_type: "",
      reference_range: "",
      units: "",
      MRP: "",
      L2L_Rate_Card: "",
      status: "Pending",
      test_code: "",
      device_id: [],
    })
    setParameterList([
      {
        test_name: "",
        department: "",
        method: "",
        unit: "",
        reference_range: "",
        test_code: "",
        sub_title: "",
        value_option: [],
        _newOption: "",
      },
    ])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.device_id || formData.device_id.length === 0) {
      toast.error("Please select at least one device")
      return
    }

    // Validation: Either parameters must be ON with data, OR test_code must be provided
    if (parametersVisible) {
      const hasValidParams = parameterList.some((p) => p.test_name?.trim() || p.test_code?.trim() || p.method?.trim())
      if (!hasValidParams) {
        toast.error("Please add at least one parameter with valid data or turn off parameters toggle")
        return
      }
    } else {
      if (!formData.test_code?.trim()) {
        toast.error("Please enter a test code (or enable parameters)")
        return
      }
    }

    // Clean parameters - remove UI-only fields (_newOption)
    const cleanedParams = parametersVisible
      ? parameterList.map((p) => ({
          test_name: p.test_name || "",
          department: p.department || "",
          method: p.method || "",
          unit: p.unit || "",
          reference_range: p.reference_range || "",
          test_code: p.test_code || "",
          sub_title: p.sub_title || "",
          value_option: Array.isArray(p.value_option) ? p.value_option.filter((v) => v && v.trim()) : [],
        }))
      : []

    // Shape parameters: single device -> array, multiple -> dict keyed by device_id
    let parametersPayload = {}
    if (parametersVisible && cleanedParams.length > 0) {
      if (formData.device_id.length === 1) {
        parametersPayload = cleanedParams
      } else {
        parametersPayload = Object.fromEntries(formData.device_id.map((id) => [id, cleanedParams]))
      }
    }

    const payload = {
      test_name: formData.test_name,
      shortcut: formData.shortcut,
      department: formData.department,
      method: formData.method,
      collection_container: formData.collection_container,
      specimen_type: formData.specimen_type,
      reference_range: formData.reference_range,
      units: formData.units,
      MRP: formData.MRP,
      L2L_Rate_Card: formData.L2L_Rate_Card,
      status: formData.status,
      device_id: formData.device_id,
      // Send parameters or test_code depending on toggle
      ...(parametersVisible && cleanedParams.length > 0
        ? { parameters: parametersPayload }
        : { test_code: formData.test_code }),
    }

    console.log("=== Submitting Payload ===")
    console.log("Parameters Visible:", parametersVisible)
    console.log("Cleaned Params Length:", cleanedParams.length)
    console.log("Payload:", JSON.stringify(payload, null, 2))

    try {
      const response = await apiRequest(`${Labbaseurl}testdetails/`, "POST", payload)
      if (response.success) {
        toast.success("Form submitted successfully! Approval email sent.")
        setMessage("Form submitted successfully! An approval email has been sent.")
        setMessageType("success")
        setFormSubmitted(true)
        await sendApprovalEmail(formData.test_name)
        if (typeof onTestAdded === "function") onTestAdded(formData.test_name)
        resetForm()

        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
        }, 5000)
      } else {
        toast.error(response.error || "Failed to submit the form.")
        setMessage("Failed to submit the form. Please try again.")
        setMessageType("danger")
        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
        }, 5000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("An error occurred while submitting the form.")
      setMessage("Failed to submit the form. Please try again.")
      setMessageType("danger")
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    }
  }

  const handleClose = () => {
    setShow(false)
    setMessage(null)
    setMessageType(null)
    setFormSubmitted(false)
  }

  return (
    <StyledModal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Test</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
          </div>
        )}

        {formSubmitted ? (
          <div className="text-center p-4">
            <h4>Test has been submitted successfully!</h4>
            <p>An approval email has been sent.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Label htmlFor="test_name">Test Name</Label>
                <TextInput
                  type="text"
                  id="test_name"
                  name="test_name"
                  value={formData.test_name}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col>
                <Label htmlFor="shortcut">Shortcut</Label>
                <TextInput
                  type="text"
                  id="shortcut"
                  name="shortcut"
                  value={formData.shortcut}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Label htmlFor="department">Department</Label>
                <TextInput
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Label htmlFor="method">Method</Label>
                <TextInput type="text" id="method" name="method" value={formData.method} onChange={handleChange} />
              </Col>
            </Row>

            <Row>
              <Col>
                <Label htmlFor="collection_container">Collection Container</Label>
                <TextInput
                  type="text"
                  id="collection_container"
                  name="collection_container"
                  value={formData.collection_container}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Label htmlFor="specimen_type">Specimen Type</Label>
                <TextInput
                  type="text"
                  id="specimen_type"
                  name="specimen_type"
                  value={formData.specimen_type}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Label htmlFor="reference_range">Reference Range</Label>
                <TextInput
                  type="text"
                  id="reference_range"
                  name="reference_range"
                  value={formData.reference_range}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Label htmlFor="units">Units</Label>
                <TextInput type="text" id="units" name="units" value={formData.units} onChange={handleChange} />
              </Col>
            </Row>

            <Row>
              <Col>
                <Label htmlFor="MRP">MRP</Label>
                <NumberInput type="number" id="MRP" name="MRP" value={formData.MRP} onChange={handleChange} />
              </Col>
              <Col>
                <Label htmlFor="L2L_Rate_Card">L2L Rate Card</Label>
                <NumberInput
                  type="number"
                  id="L2L_Rate_Card"
                  name="L2L_Rate_Card"
                  value={formData.L2L_Rate_Card}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <Label>Devices</Label>
                <DeviceGrid>
                  {devices.map((d, idx) => {
                    const id = `${d.device_id}-${idx}`
                    const checked = formData.device_id.includes(d.device_id)
                    return (
                      <DeviceItem key={id} htmlFor={id}>
                        <input id={id} type="checkbox" checked={checked} onChange={() => toggleDevice(d.device_id)} />
                        <span>
                          {d.device_id} {d.department ? `(${d.department})` : ""}
                        </span>
                      </DeviceItem>
                    )
                  })}
                </DeviceGrid>
                <SmallNote>Select one or more device IDs</SmallNote>
              </Col>
              <Col>
                <Label htmlFor="test_code">Test Code</Label>
                <TextInput
                  type="text"
                  id="test_code"
                  name="test_code"
                  value={formData.test_code}
                  onChange={handleChange}
                  disabled={parametersVisible}
                  placeholder={parametersVisible ? "Disabled when parameters are ON" : "Enter test code"}
                />
                {parametersVisible && (
                  <SmallNote>With parameters ON, enter test codes inside each parameter below.</SmallNote>
                )}
              </Col>
            </Row>

            <Row>
              <Col basis="50%">
                <Label>Has Parameters?</Label>
                <ToggleSwitch>
                  <span>Show Parameters</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={parametersVisible}
                      onChange={(e) => setParametersVisible(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </ToggleSwitch>
              </Col>
            </Row>

            {parametersVisible && (
              <>
                <Divider />
                {parameterList.map((parameter, index) => (
                  <Row key={index}>
                    <Col>
                      <Label htmlFor={`p_test_name_${index}`}>Test Name</Label>
                      <TextInput
                        type="text"
                        id={`p_test_name_${index}`}
                        name="test_name"
                        value={parameter.test_name}
                        onChange={(e) => handleParameterChange(index, e)}
                      />
                    </Col>
                    <Col>
                      <Label htmlFor={`p_test_code_${index}`}>Test Code</Label>
                      <TextInput
                        type="text"
                        id={`p_test_code_${index}`}
                        name="test_code"
                        value={parameter.test_code}
                        onChange={(e) => handleParameterChange(index, e)}
                      />
                    </Col>
                    <Col>
                      <Label htmlFor={`p_method_${index}`}>Method</Label>
                      <TextInput
                        type="text"
                        id={`p_method_${index}`}
                        name="method"
                        value={parameter.method}
                        onChange={(e) => handleParameterChange(index, e)}
                      />
                    </Col>
                    <Col>
                      <Label htmlFor={`p_unit_${index}`}>Unit</Label>
                      <TextInput
                        type="text"
                        id={`p_unit_${index}`}
                        name="unit"
                        value={parameter.unit}
                        onChange={(e) => handleParameterChange(index, e)}
                      />
                    </Col>
                    <Col>
                      <Label htmlFor={`p_reference_range_${index}`}>Reference Range</Label>
                      <TextInput
                        type="text"
                        id={`p_reference_range_${index}`}
                        name="reference_range"
                        value={parameter.reference_range}
                        onChange={(e) => handleParameterChange(index, e)}
                      />
                    </Col>
                    <Col>
                      <Label htmlFor={`p_sub_title_${index}`}>Sub Title</Label>
                      <TextInput
                        type="text"
                        id={`p_sub_title_${index}`}
                        name="sub_title"
                        value={parameter.sub_title}
                        onChange={(e) => handleParameterChange(index, e)}
                        placeholder="e.g., MACROSCOPIC EXAMINATION"
                      />
                    </Col>
                    <Col>
                      <Label>Value Options</Label>
                      <Chips>
                        {(parameter.value_option || []).map((opt, i) => (
                          <Chip key={`${index}-opt-${i}`}>
                            {opt}
                            <button
                              type="button"
                              onClick={() => removeValueOption(index, i)}
                              aria-label="Remove option"
                            >
                              <FaTimes size={12} />
                            </button>
                          </Chip>
                        ))}
                        <OptionInput
                          type="text"
                          value={parameter._newOption || ""}
                          placeholder="Type and press Enter"
                          onChange={(e) =>
                            setParameterList((prev) => {
                              const next = [...prev]
                              next[index]._newOption = e.target.value
                              return next
                            })
                          }
                          onKeyDown={(e) => onOptionKeyDown(index, e)}
                        />
                      </Chips>
                      <SmallNote>Press Enter or comma to add</SmallNote>
                    </Col>

                    <Col basis="100%" minw="100px" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <IconBtn type="button" onClick={addParameter} title="Add Parameter">
                        <FaPlus />
                      </IconBtn>
                      {parameterList.length > 1 && (
                        <IconBtn
                          type="button"
                          variant="danger"
                          onClick={() => removeParameter(index)}
                          title="Remove Parameter"
                        >
                          <FaTrash />
                        </IconBtn>
                      )}
                    </Col>
                  </Row>
                ))}
              </>
            )}

            <div style={{ marginTop: 16 }}>
              <SubmitBtn type="submit">Submit</SubmitBtn>
            </div>
          </form>
        )}
      </Modal.Body>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </StyledModal>
  )
}

export default TestForm
