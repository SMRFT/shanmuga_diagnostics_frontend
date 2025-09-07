import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaSave, FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "../Auth/apiRequest";

// Styled Components
const FormContainer = styled.div`
  width: 80%;
  margin: auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  background-color: ${(props) => (props.primary ? "#4CAF50" : "#F44336")};
  &:hover {
    opacity: 0.8;
  }
`;

const Table = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: #4caf50;
  color: white;
  padding: 10px;
  text-align: center;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const PatientOverallReport = ({ patient_id, date }) => {
  const [patientData, setPatientData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  useEffect(() => {
    if (patient_id && date) {
      const fetchPatientData = async () => {
        const result = await apiRequest(
          `${Labbaseurl}overall_report/?patient_id=${patient_id}&selected_date=${date}`,
          "GET"
        );

        if (result.success) {
          const patientRecord = result.data.find(
            (item) => item.patient_id === patient_id
          );
          if (patientRecord) {
            setPatientData(patientRecord);
            setCreditAmount(patientRecord.credit_amount || "0");
          } else {
            setPatientData(null);
          }
        } else {
          console.error("Error fetching data:", result.error);
          toast.error(result.error || "Failed to fetch patient data");
        }
      };

      fetchPatientData();
    }
  }, [patient_id, date]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const updatedCreditAmount =
      parseFloat(creditAmount) - parseFloat(amountPaid || 0);
    const newPaymentEntry = {
      paid_date: new Date().toISOString().split("T")[0], // Store as YYYY-MM-DD
      amount_paid: parseFloat(amountPaid || 0),
      remaining_amount: updatedCreditAmount.toString(),
      payment_method: paymentMethod,
    };

    const payload = {
      credit_amount: updatedCreditAmount.toString(),
      amount_paid: parseFloat(amountPaid || 0),
      paid_date: newPaymentEntry.paid_date,
      payment_method: paymentMethod,
    };

    const result = await apiRequest(
      `${Labbaseurl}credit_amount/${patient_id}/`,
      "PATCH",
      payload
    );

    if (result.success) {
      // Update state immediately to reflect the new payment in the history table
      setPatientData((prevData) => ({
        ...prevData,
        credit_amount: updatedCreditAmount.toString(),
        credit_details: [...prevData.credit_details, newPaymentEntry], // Append new entry
      }));

      setCreditAmount(updatedCreditAmount.toString());
      setAmountPaid("");
      setIsEditing(false);
      toast.success("Credit amount updated successfully!", {
        autoClose: 3000,
      });
    } else {
      console.error("Error updating credit amount:", result.error);
      toast.error(result.error || "Failed to update credit amount");
    }
  };

  return (
    <>
      <ToastContainer />
      <FormContainer>
        {patientData ? (
          <>
            <h2>Edit Credit Amount</h2>

            {/* Patient Name and Total Amount in the Same Row */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ flex: 1 }}>
                <label>Patient Name:</label>
                <InputField
                  type="text"
                  value={patientData.patient_name}
                  disabled
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Total Amount:</label>
                <InputField
                  type="text"
                  value={patientData.total_amount}
                  disabled
                />
              </div>
            </div>

            {/* Credit Amount with Edit Button in the Same Row */}
            <label>Credit Amount:</label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <InputField
                type="text"
                value={creditAmount}
                disabled={true} // Always disabled
                style={{ flex: 1 }}
              />

              {!isEditing ? (
                <Button onClick={handleEdit}>
                  <FaEdit /> Edit
                </Button>
              ) : null}
            </div>

            {isEditing && (
              <>
                {/* Amount Paid and Payment Method in the Same Row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    marginTop: "10px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label>Amount Paid:</label>
                    <InputField
                      type="number"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Payment Method:</label>
                    <Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="NEFT">NEFT</option>
                      <option value="Cheque">Cheque</option>
                    </Select>
                  </div>
                </div>

                {/* Save Button Below */}
                <div style={{ marginTop: "15px" }}>
                  <Button primary onClick={handleSave}>
                    <FaSave /> Save
                  </Button>
                </div>
              </>
            )}

            {/* Conditionally Render Payment History Table */}
            {patientData.credit_details &&
              patientData.credit_details.length > 0 && (
                <>
                  <h5>Payment History</h5>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Date</Th>
                        <Th>Amount Paid</Th>
                        <Th>Remaining</Th>
                        <Th>Method</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {patientData.credit_details.map((detail, index) => (
                        <tr key={index}>
                          <Td>
                            {new Date(detail.paid_date).toLocaleDateString()}
                          </Td>
                          <Td>{parseInt(detail.amount_paid)}</Td>
                          <Td>{parseInt(detail.remaining_amount)}</Td>
                          <Td>{detail.payment_method || "N/A"}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}
          </>
        ) : (
          <p>No data available</p>
        )}
      </FormContainer>
    </>
  );
};

export default PatientOverallReport;