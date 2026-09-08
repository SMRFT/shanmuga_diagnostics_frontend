"use client"

import { useEffect, useState } from "react"
import apiRequest from "../Auth/apiRequest"
import styled from "styled-components"

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.05), rgba(102, 126, 234, 0.05));
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
`

const CardWrapper = styled.div`
  border: 1px solid rgba(225, 232, 255, 0.8);
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(102, 126, 234, 0.12);
  }
`

const CardTitle = styled.h5`
  font-weight: 700;
  color: #4c51bf;
  margin-bottom: 0.75rem;
`

const CardText = styled.p`
  margin: 0.25rem 0;
  color: #64748b;
  font-size: 0.9rem;

  strong {
    color: #334155;
  }
`

const ResendButton = styled.button`
  margin-top: 1rem;
  background: ${(props) => (props.expired ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #f093fb 0%, #667eea 100%)")};
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const BulkActions = styled.div`
  margin-bottom: 2rem;
  padding: 1.25rem;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(225, 232, 255, 0.8);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  color: #334155;
`

const StatusBadge = styled.span`
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: ${(props) => (props.expired ? "#fee2e2" : "#dcfce7")};
  color: ${(props) => (props.expired ? "#dc2626" : "#16a34a")};
`

const PageTitle = styled.h2`
  background: linear-gradient(135deg, #f093fb, #667eea, #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  font-size: 2rem;
`

const InactiveFranchises = () => {
  const [franchises, setFranchises] = useState([])
  const [selectedFranchises, setSelectedFranchises] = useState([])
  const [loading, setLoading] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  useEffect(() => {
    fetchInactiveFranchises()
  }, [])

  const fetchInactiveFranchises = async () => {
    setLoading(true)
    const res = await apiRequest(`${Labbaseurl}inactive-franchises/`, "GET")
    if (res.success) {
      setFranchises(res.data)
    } else {
      console.error("Error fetching franchises", res.error)
    }
    setLoading(false)
  }

  const handleResend = async (franchiseId) => {
    try {
      setLoading(true)
      const response = await apiRequest(`${Labbaseurl}resend-password-reset/`, "POST", {
        franchise_id: franchiseId,
      })
      if (response.success) {
        alert(`✅ ${response.data.message}`)
        fetchInactiveFranchises()
      } else {
        alert(`❌ Error: ${response.error}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBulkResend = async () => {
    if (selectedFranchises.length === 0) {
      alert("Please select at least one franchise")
      return
    }
    if (!window.confirm(`Are you sure you want to resend emails to ${selectedFranchises.length} franchises?`)) {
      return
    }
    try {
      setBulkLoading(true)
      const response = await apiRequest(`${Labbaseurl}bulk-resend-password-reset/`, "POST", {
        franchise_ids: selectedFranchises,
      })
      if (response.success) {
        alert(`✅ ${response.data.message}`)
        setSelectedFranchises([])
        fetchInactiveFranchises()
      } else {
        alert(`❌ Error: ${response.error}`)
      }
    } finally {
      setBulkLoading(false)
    }
  }

  const handleSelectFranchise = (franchiseId) => {
    setSelectedFranchises((prev) =>
      prev.includes(franchiseId) ? prev.filter((id) => id !== franchiseId) : [...prev, franchiseId],
    )
  }

  const handleSelectAll = () => {
    if (selectedFranchises.length === franchises.length) {
      setSelectedFranchises([])
    } else {
      setSelectedFranchises(franchises.map((f) => f.franchise_id))
    }
  }

  if (loading && franchises.length === 0) {
    return (
      <PageWrapper>
        <div className="text-center mt-4" style={{ color: "#64748b" }}>
          Loading inactive franchises...
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <PageTitle>Inactive Franchises ({franchises.length})</PageTitle>
          <button
            className="btn btn-outline-primary"
            style={{ color: "#667eea", borderColor: "#667eea", borderRadius: "8px", fontWeight: "600" }}
            onClick={fetchInactiveFranchises}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {franchises.length > 0 && (
          <BulkActions>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectedFranchises.length === franchises.length}
                  onChange={handleSelectAll}
                  className="me-2"
                />
                <label htmlFor="selectAll" style={{ fontWeight: "600", cursor: "pointer" }}>
                  Select All ({selectedFranchises.length} selected)
                </label>
              </div>
              <button
                className="btn btn-primary"
                style={{ background: "linear-gradient(135deg, #f093fb 0%, #667eea 100%)", border: "none", borderRadius: "8px", fontWeight: "600" }}
                onClick={handleBulkResend}
                disabled={selectedFranchises.length === 0 || bulkLoading}
              >
                {bulkLoading ? "Sending..." : `Bulk Resend (${selectedFranchises.length})`}
              </button>
            </div>
          </BulkActions>
        )}

        {franchises.length === 0 ? (
          <div className="text-center mt-5" style={{ color: "#64748b" }}>
            <h4>🎉 No Inactive Franchises</h4>
            <p>All franchises have completed their account setup!</p>
          </div>
        ) : (
          <div className="row">
            {franchises.map((item) => (
              <div className="col-md-6 col-lg-4" key={item.franchise_id}>
                <CardWrapper>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <input
                      type="checkbox"
                      checked={selectedFranchises.includes(item.franchise_id)}
                      onChange={() => handleSelectFranchise(item.franchise_id)}
                    />
                    <StatusBadge expired={item.is_expired}>
                      {item.is_expired ? "Expired" : "Active"}
                    </StatusBadge>
                  </div>

                  <CardTitle>{item.franchise_name || "Unknown Franchise"}</CardTitle>
                  <CardText>
                    <strong>ID:</strong> {item.franchise_id}
                  </CardText>
                  <CardText>
                    <strong>Email:</strong> {item.email || "No email"}
                  </CardText>
                  <CardText>
                    <strong>Phone:</strong> {item.phone || "No phone"}
                  </CardText>
                  <CardText>
                    <strong>Location:</strong> {item.location || "No location"}
                  </CardText>

                  {item.reset_token_expires && (
                    <CardText>
                      <strong>Expires:</strong>{" "}
                      {new Date(item.reset_token_expires).toLocaleString()}
                    </CardText>
                  )}

                  <ResendButton
                    expired={item.is_expired}
                    onClick={() => handleResend(item.franchise_id)}
                    disabled={loading}
                  >
                    {item.is_expired ? "🚨 Resend (Expired)" : "📧 Resend Email"}
                  </ResendButton>
                </CardWrapper>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

export default InactiveFranchises