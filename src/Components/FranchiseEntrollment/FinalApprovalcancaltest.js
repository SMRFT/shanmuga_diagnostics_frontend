"use client"

import { useEffect, useState } from "react"
import apiRequest from "../Auth/apiRequest"
import styled from "styled-components"

// ================= Styled Components =================
const Container = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`

const PatientCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
`

const PatientHeader = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
`

const SectionTitle = styled.h4`
  margin-top: 20px;
  font-size: 16px;
  color: #444;
  display: flex;
  align-items: center;
  gap: 8px;
`

const TestCard = styled.div`
  background: #f8fdff;
  border-left: 4px solid #00a884;
  border-radius: 8px;
  padding: 15px;
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const TestTitle = styled.div`
  font-weight: bold;
  color: #222;
`

const Price = styled.span`
  font-weight: bold;
  color: #00897b;
`

const Status = styled.span`
  background: #ffb300;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 20px;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`

const ApproveButton = styled.button`
  background: #2ecc71;
  border: none;
  color: white;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #27ae60;
  }
`

const RejectButton = styled.button`
  background: #e74c3c;
  border: none;
  color: white;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #c0392b;
  }
`

// ================= Component =================
const FinalApprovalcancaltest = () => {
  const [cancelAccepted, setCancelAccepted] = useState([])
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  useEffect(() => {
    const fetchData = async () => {
      const res = await apiRequest(`${Labbaseurl}cancel-requested/`, "GET")
      if (res.success && res.data && res.data.cancel_requested) {
        const filtered = res.data.cancel_requested
          .map((item) => ({
            ...item,
            cancel_requested_tests: item.cancel_requested_tests.filter((test) => test.status === "Cancel Accepted"),
          }))
          .filter((item) => item.cancel_requested_tests.length > 0)
        setCancelAccepted(filtered)
      }
    }
    fetchData()
  }, [])

  const handleAction = async (patientId, testId, action) => {
    const res = await apiRequest(`${Labbaseurl}update_cancel_status/`, "POST", {
      patient_id: patientId,
      test_id: testId,
      action: action,
    })
    if (res.success && res.data.success) {
      setCancelAccepted((prev) =>
        prev.map((p) =>
          p.patient_id === patientId
            ? {
                ...p,
                cancel_requested_tests: p.cancel_requested_tests.map((t) =>
                  t.test_id === testId
                    ? {
                        ...t,
                        status: action === "approve" ? "Cancel Approved" : "Reject",
                        cancel_approved_date:
                          action === "approve" ? new Date().toISOString() : t.cancel_approved_date,
                        rejected_date: action === "reject" ? new Date().toISOString() : t.rejected_date,
                      }
                    : t,
                ),
              }
            : p,
        ),
      )
    }
  }

  return (
    <Container>
      {cancelAccepted.map((patient, idx) => (
        <PatientCard key={idx}>
          <PatientHeader>Patient ID: {patient.patient_id}</PatientHeader>

          <InfoRow>
            <b>BARCODE:</b> {patient.barcode}
          </InfoRow>
          <InfoRow>
            <b>FRANCHISE:</b> {patient.franchise_id}
          </InfoRow>
          <InfoRow>
            <b>REFERRED DOCTOR:</b> {patient.referredDoctor}
          </InfoRow>
          <InfoRow>
            <b>TOTAL TESTS:</b> {patient.cancel_requested_tests.length}
          </InfoRow>

          <SectionTitle>📝 Accepted Cancellations</SectionTitle>

          {patient.cancel_requested_tests.map((test, tIdx) => (
            <TestCard key={tIdx}>
              <TestTitle>{test.test_name}</TestTitle>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Status>{test.status}</Status>
                <Price>₹{test.MRP}</Price>
              </div>

              {/* Show dates if available */}
              {test.cancel_approved_date && (
                <div style={{ fontSize: "12px", color: "#2ecc71" }}>
                  ✅ Approved on: {new Date(test.cancel_approved_date).toLocaleString()}
                </div>
              )}
              {test.rejected_date && (
                <div style={{ fontSize: "12px", color: "#e74c3c" }}>
                  ❌ Rejected on: {new Date(test.rejected_date).toLocaleString()}
                </div>
              )}

              <ButtonRow>
                <ApproveButton onClick={() => handleAction(patient.patient_id, test.test_id, "approve")}>
                  APPROVE
                </ApproveButton>
                <RejectButton onClick={() => handleAction(patient.patient_id, test.test_id, "reject")}>
                  REJECT
                </RejectButton>
              </ButtonRow>
            </TestCard>
          ))}
        </PatientCard>
      ))}
    </Container>
  )
}

export default FinalApprovalcancaltest
