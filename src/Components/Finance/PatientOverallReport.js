import React, { useState, useEffect } from "react";
import apiRequest from "../Auth/apiRequest";
import axios from "axios";
import styled, { keyframes, css } from "styled-components";
import {
  Save,
  Edit2,
  CreditCard,
  User,
  FileText,
  IndianRupee,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 0;
  width: 100%;
`;

const ReportCard = styled.div`
  width: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 30px;
  animation: ${fadeIn} 0.5s ease-out;
  border: 1px solid #eaeaea;
`;

const Header = styled.div`
  margin-bottom: 25px;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 12px;

  h2 {
    margin: 0;
    color: #1e293b;
    font-size: 22px;
    font-weight: 700;
  }
`;

const SectionTitle = styled.h5`
  color: #334155;
  font-size: 16px;
  margin: 25px 0 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  svg {
    color: #6366f1;
  }
`;

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 10px 10px 38px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  transition: all 0.2s ease;
  background: #f8fafc;
  height: 42px;

  &:focus {
    border-color: #6366f1;
    background: #fff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    background: #f1f5f9;
    color: #64748b;
    border-color: #e2e8f0;
    cursor: default;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 10px 10px 38px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  transition: all 0.2s ease;
  background: #f8fafc;
  appearance: none;
  height: 42px;
  cursor: pointer;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;

  &:focus {
    border-color: #6366f1;
    background-color: #fff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  height: 42px;
  white-space: nowrap;

  ${(props) =>
    props.primary
      ? css`
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
            background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
          }
        `
      : css`
          background: white;
          color: #475569;
          border: 1px solid #e2e8f0;

          &:hover {
            background: #f8fafc;
            border-color: #cbd5e1;
            color: #1e293b;
          }
        `}

  &:active {
    transform: translateY(0);
  }
`;

const TableContainer = styled.div`
  margin-top: 25px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
`;

const Th = styled.th`
  background: #f8fafc;
  color: #475569;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  font-size: 14px;

  &:last-child {
    border-bottom: none;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) => props.bg || "#f1f5f9"};
  color: ${(props) => props.color || "#64748b"};
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
      const fetchReport = async () => {
        const result = await apiRequest(
          `${Labbaseurl}overall_report/?patient_id=${patient_id}&selected_date=${date}`,
          "GET",
        );
        if (result.success) {
          const patientRecord = result.data.find(
            (item) => item.patient_id === patient_id,
          );
          if (patientRecord) {
            setPatientData(patientRecord);
            setCreditAmount(patientRecord.credit_amount || "0");
          } else {
            setPatientData(null);
          }
        } else {
          console.error("Error fetching data:", result.error);
        }
      };
      fetchReport();
    }
  }, [patient_id, date]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedCreditAmount =
      parseFloat(creditAmount) - parseFloat(amountPaid || 0);
    const newPaymentEntry = {
      paid_date: new Date().toISOString().split("T")[0], // Store as YYYY-MM-DD
      amount_paid: parseFloat(amountPaid || 0),
      remaining_amount: updatedCreditAmount.toString(),
      payment_method: paymentMethod,
    };

    const payload = {
      bill_no: patientData.bill_no,
      credit_amount: updatedCreditAmount.toString(),
      amount_paid: parseFloat(amountPaid || 0),
      paid_date: newPaymentEntry.paid_date,
      payment_method: paymentMethod,
    };

    const updateCredit = async () => {
      if (patientData && patientData.bill_no) {
        const result = await apiRequest(
          `${Labbaseurl}credit_amount/`,
          "PATCH",
          payload,
        );
        if (result.success) {
          // Update state immediately to reflect the new payment in the history table
          setPatientData((prevData) => ({
            ...prevData,
            credit_amount: updatedCreditAmount.toString(),
            credit_details: [
              ...(prevData.credit_details || []),
              newPaymentEntry,
            ], // Append new entry
          }));

          setCreditAmount(updatedCreditAmount.toString());
          setAmountPaid("");
          setIsEditing(false);
          toast.success("Credit amount updated successfully!", {
            autoClose: 3000,
          });
        } else {
          console.error("Error updating credit amount:", result.error);
          toast.error("Failed to update credit amount.");
        }
      } else {
        toast.error("Bill number not found for this patient.");
      }
    };
    updateCredit();
  };

  return (
    <PageContainer>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <ReportCard>
        {patientData ? (
          <>
            <Header>
              <FileText size={24} color="#6366f1" />
              <h2>Credit Amount Management</h2>
            </Header>

            {/* Patient Info Section */}
            <FormGroup>
              <InputGroup>
                <Label>Patient Name</Label>
                <InputWrapper>
                  <IconWrapper>
                    <User size={18} />
                  </IconWrapper>
                  <StyledInput
                    type="text"
                    value={patientData.patient_name}
                    disabled
                  />
                </InputWrapper>
              </InputGroup>
              <InputGroup>
                <Label>Total Bill Amount</Label>
                <InputWrapper>
                  <IconWrapper>
                    <IndianRupee size={18} />
                  </IconWrapper>
                  <StyledInput
                    type="text"
                    value={patientData.total_amount}
                    disabled
                  />
                </InputWrapper>
              </InputGroup>
            </FormGroup>

            <SectionTitle>
              <CreditCard size={18} /> Credit Details
            </SectionTitle>

            <FormGroup style={{ alignItems: "end" }}>
              <InputGroup>
                <Label>Current Credit Amount</Label>
                <InputWrapper>
                  <IconWrapper>
                    <IndianRupee size={18} />
                  </IconWrapper>
                  <StyledInput
                    type="text"
                    value={creditAmount}
                    disabled={true}
                    style={{ color: "#ef4444", fontWeight: "bold" }}
                  />
                </InputWrapper>
              </InputGroup>

              {!isEditing && parseFloat(creditAmount) > 0 && (
                <ActionButton onClick={handleEdit}>
                  <Edit2 size={16} /> Update Credit
                </ActionButton>
              )}
            </FormGroup>

            {isEditing && (
              <div
                style={{
                  background: "#f8fafc",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  marginBottom: "20px",
                }}
              >
                <FormGroup>
                  <InputGroup>
                    <Label>Amount Paid</Label>
                    <InputWrapper>
                      <IconWrapper>
                        <IndianRupee size={18} />
                      </IconWrapper>
                      <StyledInput
                        type="number"
                        placeholder="Enter amount paid"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        autoFocus
                      />
                    </InputWrapper>
                  </InputGroup>
                  <InputGroup>
                    <Label>Payment Method</Label>
                    <InputWrapper>
                      <IconWrapper>
                        <CreditCard size={18} />
                      </IconWrapper>
                      <StyledSelect
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="NEFT">NEFT</option>
                        <option value="Cheque">Cheque</option>
                      </StyledSelect>
                    </InputWrapper>
                  </InputGroup>
                </FormGroup>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <ActionButton onClick={() => setIsEditing(false)}>
                    Cancel
                  </ActionButton>
                  <ActionButton primary onClick={handleSave}>
                    <Save size={16} /> Save Transaction
                  </ActionButton>
                </div>
              </div>
            )}

            {/* Payment History Table */}
            {patientData.credit_details &&
              patientData.credit_details.length > 0 && (
                <>
                  <SectionTitle>
                    <Clock size={18} /> Payment History
                  </SectionTitle>
                  <TableContainer>
                    <StyledTable>
                      <thead>
                        <tr>
                          <Th>Date</Th>
                          <Th>Amount Paid</Th>
                          <Th>Remaining</Th>
                          <Th>Method</Th>
                          <Th>Status</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {patientData.credit_details.map((detail, index) => (
                          <tr key={index}>
                            <Td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <Calendar size={14} color="#64748b" />
                                {new Date(
                                  detail.paid_date,
                                ).toLocaleDateString()}
                              </div>
                            </Td>
                            <Td style={{ fontWeight: 600, color: "#059669" }}>
                              ₹{parseInt(detail.amount_paid)}
                            </Td>
                            <Td style={{ fontWeight: 600, color: "#ef4444" }}>
                              ₹{parseInt(detail.remaining_amount)}
                            </Td>
                            <Td>
                              <Badge bg="#e0e7ff" color="#4338ca">
                                {detail.payment_method || "N/A"}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge bg="#dcfce7" color="#166534">
                                <CheckCircle size={12} /> Paid
                              </Badge>
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </StyledTable>
                  </TableContainer>
                </>
              )}
          </>
        ) : (
          <div
            style={{ padding: "40px", textAlign: "center", color: "#64748b" }}
          >
            <p>Select a patient and date to view credit details.</p>
          </div>
        )}
      </ReportCard>
    </PageContainer>
  );
};

export default PatientOverallReport;
