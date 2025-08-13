"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaSearch, FaTrash, FaWalking, FaBuilding, FaHome, FaFlask } from "react-icons/fa"

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  h2 {
    color: #1e293b;
    font-size: 28px;
    font-weight: 600;
    margin: 0;
  }
`

const DatePicker = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  label {
    font-weight: 500;
    color: #374151;
  }
  
  input {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
  }
`

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 20px;
`

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  max-width: 400px;
  
  svg {
    position: absolute;
    left: 12px;
    color: #64748b;
    z-index: 1;
  }
  
  input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.2s;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
`

const PatientTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  
  th {
    background: #f8fafc;
    font-weight: 600;
    color: #374151;
  }
  
  tr:hover {
    background: #f8fafc;
  }
`

const ActionButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #2563eb;
  }
`

const PatientInfo = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  
  h3 {
    margin: 0 0 15px 0;
    color: #1e293b;
    font-size: 20px;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
  }
  
  .info-item {
    display: flex;
    
    .label {
      font-weight: 600;
      color: #374151;
      min-width: 100px;
    }
    
    .value {
      color: #6b7280;
    }
  }
`

const BillingSection = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
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
  }
  
  input, select {
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
`

const PaymentRow = styled.div`
  display: flex;
  gap: 15px;
  align-items: end;
  margin-bottom: 15px;
  
  .payment-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    label {
      margin-bottom: 5px;
      font-weight: 500;
      color: #374151;
      font-size: 14px;
    }
    
    input, select {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
    }
  }
  
  button {
    background: #10b981;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    
    &:hover {
      background: #059669;
    }
  }
`

const PaymentList = styled.div`
  margin-top: 15px;
  
  .payment-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    margin-bottom: 8px;
    
    .payment-details {
      flex: 1;
    }
    
    .remove-btn {
      background: #ef4444;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      
      &:hover {
        background: #dc2626;
      }
    }
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`

const Button = styled.button`
  background: ${(props) => (props.primary ? "#3b82f6" : "#6b7280")};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${(props) => (props.primary ? "#2563eb" : "#4b5563")};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const TotalDisplay = styled.div`
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  text-align: right;
  
  .total-amount {
    font-size: 24px;
    font-weight: 700;
    color: #0c4a6e;
  }
`

const ServiceTypeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  color: white;
  
  h4 {
    margin: 0 0 15px 0;
    font-size: 18px;
    font-weight: 600;
  }
`

const ServiceTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
`

const ServiceTypeCard = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: ${(props) => (props.selected ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)")};
  border: 2px solid ${(props) => (props.selected ? "#ffffff" : "transparent")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  input {
    display: none;
  }
  
  svg {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  span {
    font-size: 14px;
    font-weight: 500;
    text-align: center;
  }
`

const LabDetailsSection = styled.div`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  color: white;
  
  h4 {
    margin: 0 0 15px 0;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`

const LabDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
`

const LabFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  label {
    margin-bottom: 5px;
    font-weight: 500;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
  }
  
  input, select, textarea {
    padding: 10px 12px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    
    &:focus {
      outline: none;
      background: white;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
    }
    
    &::placeholder {
      color: #666;
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 80px;
  }
`

const TestDetailsSection = styled.div`
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  
  h5 {
    margin: 0 0 15px 0;
    color: #374151;
    font-size: 16px;
  }
`

const TestItem = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
  
  input {
    flex: 2;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
  }
  
  button {
    background: #ef4444;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    
    &:hover {
      background: #dc2626;
    }
  }
`

const AddTestButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background: #059669;
  }
`

const PatientBilling = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchValue, setSearchValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [isBillingView, setIsBillingView] = useState(false)

  const [serviceType, setServiceType] = useState("Walk-in")
  const [labDetails, setLabDetails] = useState({
    ClinicalName: "",
    sales_person: "",
    sample_collector: "",
    refby: "",
    special_instructions: "",
    test_details: [],
  })

  const [billingData, setBillingData] = useState({
    testdetails: [],
    total: 0,
    discount: 0,
    payment_method: [],
    credit_amount: 0,
  })

  const [currentPayment, setCurrentPayment] = useState({
    amount: "",
    payment_mode: "Cash",
  })

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    fetchPatients()
  }, [selectedDate])

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${Labbaseurl}patients_by_date/?date=${selectedDate}`)
      if (response.ok) {
        const data = await response.json()
        setPatients(data)
      } else {
        toast.error("Failed to fetch patients")
      }
    } catch (error) {
      console.error("Error fetching patients:", error)
      toast.error("Error fetching patients")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.error("Please enter a patient ID")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${Labbaseurl}create_patient/?patient_id=${searchValue}`)
      if (response.ok) {
        const patientData = await response.json()
        setSelectedPatient(patientData)
        setIsBillingView(true)

        setBillingData({
          testdetails: [],
          total: 0,
          discount: 0,
          payment_method: [],
          credit_amount: 0,
        })

        toast.success("Patient found! Ready for billing.")
      } else {
        toast.error("Patient not found")
      }
    } catch (error) {
      console.error("Error searching patient:", error)
      toast.error("Error searching patient")
    } finally {
      setLoading(false)
    }
  }

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    setIsBillingView(true)

    setServiceType("Walk-in")
    setLabDetails({
      ClinicalName: "",
      sales_person: "",
      sample_collector: "",
      refby: "",
      special_instructions: "",
      test_details: [],
    })
    setBillingData({
      testdetails: [],
      total: 0,
      discount: 0,
      payment_method: [],
      credit_amount: 0,
    })
  }

  const addPayment = () => {
    if (!currentPayment.amount || Number.parseFloat(currentPayment.amount) <= 0) {
      toast.error("Please enter a valid payment amount")
      return
    }

    const newPayment = {
      amount: Number.parseFloat(currentPayment.amount),
      payment_mode: currentPayment.payment_mode,
      id: Date.now(),
    }

    setBillingData((prev) => ({
      ...prev,
      payment_method: [...prev.payment_method, newPayment],
    }))

    setCurrentPayment({ amount: "", payment_mode: "Cash" })
    toast.success("Payment added successfully")
  }

  const removePayment = (paymentId) => {
    setBillingData((prev) => ({
      ...prev,
      payment_method: prev.payment_method.filter((p) => p.id !== paymentId),
    }))
    toast.info("Payment removed")
  }

  const calculateTotal = () => {
    const paymentTotal = billingData.payment_method.reduce((sum, payment) => sum + payment.amount, 0)
    const discountAmount = Number.parseFloat(billingData.discount) || 0
    return Math.max(0, paymentTotal - discountAmount)
  }

  const addTestDetail = () => {
    setLabDetails((prev) => ({
      ...prev,
      test_details: [...prev.test_details, { name: "", price: "" }],
    }))
  }

  const updateTestDetail = (index, field, value) => {
    setLabDetails((prev) => ({
      ...prev,
      test_details: prev.test_details.map((test, i) => (i === index ? { ...test, [field]: value } : test)),
    }))
  }

  const removeTestDetail = (index) => {
    setLabDetails((prev) => ({
      ...prev,
      test_details: prev.test_details.filter((_, i) => i !== index),
    }))
  }

  const handleGenerateBill = async () => {
    if (!selectedPatient) {
      toast.error("No patient selected")
      return
    }

    if (billingData.payment_method.length === 0) {
      toast.error("Please add at least one payment")
      return
    }

    setLoading(true)
    try {
      const billData = {
        patient_id: selectedPatient.patient_id,
        date: new Date().toISOString(),
        lab_id: `LAB${Date.now()}`,
        segment: serviceType,
        ClinicalName: labDetails.ClinicalName,
        sales_person: labDetails.sales_person,
        sample_collector: labDetails.sample_collector,
        refby: labDetails.refby,
        testdetails: labDetails.test_details,
        total: calculateTotal().toString(),
        discount: billingData.discount.toString(),
        payment_method: billingData.payment_method,
        MultiplePayment: billingData.payment_method,
        credit_amount: billingData.credit_amount.toString(),
      }

      const response = await fetch(`${Labbaseurl}create_bill/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(billData),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`Bill generated successfully! Bill No: ${result.bill_no}`)

        setIsBillingView(false)
        setSelectedPatient(null)
        setServiceType("Walk-in")
        setLabDetails({
          ClinicalName: "",
          sales_person: "",
          sample_collector: "",
          refby: "",
          special_instructions: "",
          test_details: [],
        })
        setBillingData({
          testdetails: [],
          total: 0,
          discount: 0,
          payment_method: [],
          credit_amount: 0,
        })

        fetchPatients()
      } else {
        const errorData = await response.json()
        toast.error("Failed to generate bill: " + JSON.stringify(errorData))
      }
    } catch (error) {
      console.error("Error generating bill:", error)
      toast.error("Failed to generate bill. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Header>
        <h2>Patient Billing System</h2>
        <DatePicker>
          <label>Select Date:</label>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </DatePicker>
      </Header>

      {!isBillingView ? (
        <Card>
          <SearchContainer>
            <FaSearch />
            <input
              type="text"
              placeholder="Search by Patient ID"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <ActionButton onClick={handleSearch} style={{ marginLeft: "10px" }}>
              Search
            </ActionButton>
          </SearchContainer>

          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
          ) : (
            <PatientTable>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Age/Gender</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <tr key={patient.patient_id}>
                      <td>{patient.patient_id}</td>
                      <td>{patient.patientname}</td>
                      <td>{patient.phone}</td>
                      <td>
                        {patient.age}{patient.gender}
                      </td>
                      <td>
                        <ActionButton onClick={() => handlePatientSelect(patient)}>Generate Bill</ActionButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
                      No patients found for selected date
                    </td>
                  </tr>
                )}
              </tbody>
            </PatientTable>
          )}
        </Card>
      ) : (
        <Card>
          {selectedPatient && (
            <>
              <PatientInfo>
                <h3>Patient Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Patient ID:</span>
                    <span className="value">{selectedPatient.patient_id}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Name:</span>
                    <span className="value">{selectedPatient.patientname}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Age/Gender:</span>
                    <span className="value">
                      {selectedPatient.age}{selectedPatient.gender}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Phone:</span>
                    <span className="value">{selectedPatient.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Email:</span>
                    <span className="value">{selectedPatient.email || "N/A"}</span>
                  </div>
                </div>
              </PatientInfo>

              <ServiceTypeSection>
                <h4>Select Service Type</h4>
                <ServiceTypeGrid>
                  <ServiceTypeCard selected={serviceType === "Walk-in"}>
                    <input
                      type="radio"
                      name="serviceType"
                      value="Walk-in"
                      checked={serviceType === "Walk-in"}
                      onChange={(e) => setServiceType(e.target.value)}
                    />
                    <FaWalking />
                    <span>Walk-in</span>
                  </ServiceTypeCard>
                  <ServiceTypeCard selected={serviceType === "B2B"}>
                    <input
                      type="radio"
                      name="serviceType"
                      value="B2B"
                      checked={serviceType === "B2B"}
                      onChange={(e) => setServiceType(e.target.value)}
                    />
                    <FaBuilding />
                    <span>B2B</span>
                  </ServiceTypeCard>
                  <ServiceTypeCard selected={serviceType === "Home Collection"}>
                    <input
                      type="radio"
                      name="serviceType"
                      value="Home Collection"
                      checked={serviceType === "Home Collection"}
                      onChange={(e) => setServiceType(e.target.value)}
                    />
                    <FaHome />
                    <span>Home Collection</span>
                  </ServiceTypeCard>
                </ServiceTypeGrid>
              </ServiceTypeSection>

              <LabDetailsSection>
                <h4>
                  <FaFlask /> Lab Details
                </h4>
                <LabDetailsGrid>
                  <LabFormGroup>
                    <label>Clinical Name</label>
                    <input
                      type="text"
                      value={labDetails.ClinicalName}
                      onChange={(e) => setLabDetails((prev) => ({ ...prev, ClinicalName: e.target.value }))}
                      placeholder="Enter clinical name"
                    />
                  </LabFormGroup>
                  <LabFormGroup>
                    <label>Sales Person</label>
                    <input
                      type="text"
                      value={labDetails.sales_person}
                      onChange={(e) => setLabDetails((prev) => ({ ...prev, sales_person: e.target.value }))}
                      placeholder="Enter sales person name"
                    />
                  </LabFormGroup>
                  <LabFormGroup>
                    <label>Sample Collector</label>
                    <input
                      type="text"
                      value={labDetails.sample_collector}
                      onChange={(e) => setLabDetails((prev) => ({ ...prev, sample_collector: e.target.value }))}
                      placeholder="Enter sample collector name"
                    />
                  </LabFormGroup>
                  <LabFormGroup>
                    <label>Referred By</label>
                    <input
                      type="text"
                      value={labDetails.refby}
                      onChange={(e) => setLabDetails((prev) => ({ ...prev, refby: e.target.value }))}
                      placeholder="Enter referrer name"
                    />
                  </LabFormGroup>
                </LabDetailsGrid>

                <LabFormGroup>
                  <label>Special Instructions</label>
                  <textarea
                    value={labDetails.special_instructions}
                    onChange={(e) => setLabDetails((prev) => ({ ...prev, special_instructions: e.target.value }))}
                    placeholder="Enter any special instructions for the lab tests"
                  />
                </LabFormGroup>

                <TestDetailsSection>
                  <h5>Test Details</h5>
                  {labDetails.test_details.map((test, index) => (
                    <TestItem key={index}>
                      <input
                        type="text"
                        placeholder="Test name"
                        value={test.name}
                        onChange={(e) => updateTestDetail(index, "name", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={test.price}
                        onChange={(e) => updateTestDetail(index, "price", e.target.value)}
                      />
                      <button onClick={() => removeTestDetail(index)}>
                        <FaTrash />
                      </button>
                    </TestItem>
                  ))}
                  <AddTestButton onClick={addTestDetail}>+ Add Test</AddTestButton>
                </TestDetailsSection>
              </LabDetailsSection>

              <BillingSection>
                <h3>Billing Information</h3>

                <div>
                  <h4>Add Payments</h4>
                  <PaymentRow>
                    <div className="payment-group">
                      <label>Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={currentPayment.amount}
                        onChange={(e) => setCurrentPayment((prev) => ({ ...prev, amount: e.target.value }))}
                        placeholder="Enter amount"
                      />
                    </div>
                    <div className="payment-group">
                      <label>Payment Mode</label>
                      <select
                        value={currentPayment.payment_mode}
                        onChange={(e) => setCurrentPayment((prev) => ({ ...prev, payment_mode: e.target.value }))}
                      >
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Card">Card</option>
                        <option value="Cheque">Cheque</option>
                        <option value="NEFT">NEFT</option>
                      </select>
                    </div>
                    <button onClick={addPayment}>Add Payment</button>
                  </PaymentRow>

                  {billingData.payment_method.length > 0 && (
                    <PaymentList>
                      <h5>Added Payments:</h5>
                      {billingData.payment_method.map((payment) => (
                        <div key={payment.id} className="payment-item">
                          <div className="payment-details">
                            <strong>₹{payment.amount.toFixed(2)}</strong> - {payment.payment_mode}
                          </div>
                          <button className="remove-btn" onClick={() => removePayment(payment.id)}>
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </PaymentList>
                  )}
                </div>

                <FormRow>
                  <FormGroup>
                    <label>Discount Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={billingData.discount}
                      onChange={(e) =>
                        setBillingData((prev) => ({ ...prev, discount: Number.parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="Enter discount amount"
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Credit Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={billingData.credit_amount}
                      onChange={(e) =>
                        setBillingData((prev) => ({ ...prev, credit_amount: Number.parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="Enter credit amount"
                    />
                  </FormGroup>
                </FormRow>

                <TotalDisplay>
                  <div className="total-amount">Total Amount: ₹{calculateTotal().toFixed(2)}</div>
                </TotalDisplay>

                <ButtonGroup>
                  <Button onClick={() => setIsBillingView(false)}>Back to Patients</Button>
                  <Button primary onClick={handleGenerateBill} disabled={loading}>
                    {loading ? "Processing..." : "Generate Bill"}
                  </Button>
                </ButtonGroup>
              </BillingSection>
            </>
          )}
        </Card>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </Container>
  )
}

export default PatientBilling
