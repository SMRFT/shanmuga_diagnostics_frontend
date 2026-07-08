"use client"

import { useState, useEffect } from "react"
import styled, { createGlobalStyle } from "styled-components"
import { Package, User, DollarSign, TestTube, Check, AlertCircle, X } from "lucide-react"
import apiRequest from "../Auth/apiRequest"

// Global styles
const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #4361ee;
    --primary-light: #4895ef;
    --primary-dark: #3a0ca3;
    --secondary: #3f37c9;
    --success: #4cc9f0;
    --danger: #f72585;
    --warning: #f8961e;
    --info: #90e0ef;
    --light: #f8f9fa;
    --dark: #212529;
    --gray: #6c757d;
    --gray-light: #e9ecef;
    --border-radius: 8px;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f7fb;
    color: var(--dark);
    line-height: 1.5;
  }
`

// Container for the main content
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
`

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
`

const CardBody = styled.div`
  padding: 1.5rem;
`

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background-color: ${props => props.primary ? 'var(--primary)' : props.success || props.approved ? 'var(--success)' : props.danger ? 'var(--danger)' : 'white'};
  color: ${props => (props.primary || props.success || props.approved || props.danger) ? 'white' : 'var(--gray)'};
  border: 1px solid ${props => props.primary ? 'var(--primary)' : props.success || props.approved ? 'var(--success)' : props.danger ? 'var(--danger)' : 'var(--gray-light)'};
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? '0.7' : '1'};
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    background-color: ${props => props.primary ? 'var(--primary-dark)' : props.success || props.approved ? '#38bdf8' : props.danger ? '#e11d48' : 'var(--gray-light)'};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`

const LoadingSpinner = styled.div`
  border: 2px solid var(--gray-light);
  border-top: 2px solid var(--primary);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

// Toast Component
const Toast = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${(props) => (props.type === "error" ? "var(--danger)" : "var(--success)")};
  color: white;
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1000;
  animation: slideIn 0.3s ease, fadeOut 0.5s ease 3.5s forwards;
  
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`

const PackageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const PackageCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  border-left: 4px solid var(--warning);
  transition: var(--transition);
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`

const PackageHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const PackageTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
`

const PackageBody = styled.div`
  padding: 1rem;
`

const PackageInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`

const InfoIcon = styled.div`
  color: var(--primary);
  margin-top: 0.125rem;
  flex-shrink: 0;
`

const InfoContent = styled.div`
  flex: 1;
`

const InfoLabel = styled.span`
  font-weight: 600;
  color: var(--primary-dark);
  font-size: 0.875rem;
`

const InfoValue = styled.div`
  color: var(--dark);
  margin-top: 0.25rem;
`

const TestNamesList = styled.div`
  max-height: 120px;
  overflow-y: auto;
  background-color: var(--light);
  border-radius: var(--border-radius);
  padding: 0.75rem;
  margin-top: 0.5rem;
`

const TestName = styled.div`
  padding: 0.25rem 0;
  font-size: 0.875rem;
  color: var(--dark);
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--gray-light);
  }
`

const PackageFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-light);
  background-color: var(--light);
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const DateInfo = styled.div`
  font-size: 0.75rem;
  color: var(--gray);
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: var(--gray);
  gap: 1rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--gray);
`

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`

// New styled components for rate display
const RateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: var(--light);
  border-radius: var(--border-radius);
`

const RateItem = styled.div`
  text-align: center;
  padding: 0.5rem;
  background-color: white;
  border-radius: 4px;
  border: 1px solid var(--gray-light);
`

const RateLabel = styled.div`
  font-size: 0.75rem;
  color: var(--gray);
  margin-bottom: 0.25rem;
`

const RateValue = styled.div`
  font-weight: 600;
  color: var(--primary-dark);
  font-size: 0.875rem;
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
  z-index: 1000;
`

const ModalContent = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`

const ModalHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: var(--primary-dark);
`

const ModalBody = styled.div`
  padding: 1.5rem;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--gray);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: var(--primary-dark);
  }
`

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-light);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`

const B2BPackageApproval = () => {
  const [packages, setPackages] = useState([])
  const [testDetails, setTestDetails] = useState([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState({})
  const [toast, setToast] = useState(null)
  const [rejectModal, setRejectModal] = useState({ isOpen: false, packageData: null, reason: "", loading: false })

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  // Show toast message
  const showToast = (message, type = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Fetch packages from API
  const fetchPackages = async () => {
    try {
      setLoading(true)
      const response = await apiRequest(`${Labbaseurl}b2b_packages/`, "GET")
      if (response.success) {
        const data = Array.isArray(response.data) ? response.data : (response.data?.data || [])
        // Filter out approved and rejected packages - only show pending packages
        const pendingPackages = data.filter((pkg) => pkg.status !== "Approved" && pkg.status !== "Rejected")
        setPackages(pendingPackages)
      } else {
        showToast(response.error || "Failed to fetch packages", "error")
      }
    } catch (error) {
      showToast("Error fetching packages: " + error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  // Fetch test details from API
  const fetchTestDetails = async () => {
    try {
      const response = await apiRequest(`${Labbaseurl}testdetails/`, "GET")
      if (response.success) {
        setTestDetails(Array.isArray(response.data) ? response.data : (response.data?.data || []))
      }
    } catch (error) {
      console.error("Error fetching test details:", error)
    }
  }

  useEffect(() => {
    if (Labbaseurl) {
      fetchPackages()
      fetchTestDetails()
    }
  }, [Labbaseurl])

  // Complete handleApprove function with success toast
  const handleApprove = async (packageId) => {
    setApproving((prev) => ({ ...prev, [packageId]: true }))

    try {
      const payload = {
        package_id: packageId,
        action: "approve"
      }

      const response = await apiRequest(`${Labbaseurl}b2b_packages/`, "PATCH", payload)

      if (response.success) {
        showToast(`Package approved successfully!`, "success")
        setPackages((prevPackages) =>
          prevPackages.filter(pkg => pkg.package_id !== packageId)
        )
      } else {
        showToast(response.error || `Failed to approve package`, "error")
      }
    } catch (error) {
      console.error("Error approving package:", error)
      showToast("Network error while approving package.", "error")
    } finally {
      setApproving((prev) => ({ ...prev, [packageId]: false }))
    }
  }

  const handleReject = (pkg) => {
    setRejectModal({ isOpen: true, packageData: pkg, reason: "", loading: false })
  }

  const handleRejectSubmit = async () => {
    setRejectModal(prev => ({ ...prev, loading: true }))
    try {
      const payload = {
        package_id: rejectModal.packageData.package_id,
        action: "reject",
        reason: rejectModal.reason
      }

      const response = await apiRequest(`${Labbaseurl}b2b_packages/`, "PATCH", payload)
      if (response.success) {
        showToast(`Package rejected successfully!`, "success")
        setPackages((prevPackages) =>
          prevPackages.filter(pkg => pkg.package_id !== rejectModal.packageData.package_id)
        )
        setRejectModal({ isOpen: false, packageData: null, reason: "", loading: false })
      } else {
        showToast(response.error || `Failed to reject package`, "error")
        setRejectModal(prev => ({ ...prev, loading: false }))
      }
    } catch (error) {
      console.error("Error rejecting package:", error)
      showToast("Network error while rejecting package.", "error")
      setRejectModal(prev => ({ ...prev, loading: false }))
    }
  }
  // Parse test names from array or string
  const parseTestNames = (testNamesData) => {
    try {
      if (Array.isArray(testNamesData)) {
        return testNamesData
      }
      if (typeof testNamesData === "string") {
        return JSON.parse(testNamesData)
      }
      return []
    } catch (error) {
      return []
    }
  }

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Invalid Date"
    }
  }

  // Get test name display text from testDetails
  const getTestNameDisplay = (testItem) => {
    try {
      if (!testItem) return "Unknown Test";
      const testId = typeof testItem === 'object' && testItem !== null ? (testItem.test_id || testItem.testId) : testItem;
      const test = testDetails.find((t) => 
         (t._id && t._id.$oid === String(testId)) || 
         String(t.id) === String(testId) || 
         String(t.test_id) === String(testId)
      );
      const name = test ? (test.test_name || test.name) : null;
      if (name && typeof name !== 'object') return String(name);
      return String(testId || "Unknown Test");
    } catch (e) {
      return "Unknown Test";
    }
  }

  // Format rate
  const formatRate = (rate) => {
    if (rate && rate.$numberDecimal) {
      return `₹${Number.parseFloat(rate.$numberDecimal).toFixed(2)}`
    }
    return `₹${Number.parseFloat(rate || 0).toFixed(2)}`
  }

  // Get package ID - handle different data structures
  const getPackageId = (pkg) => {
    return pkg.package_id || pkg.packageName || `pkg-${Math.random().toString(36).substr(2, 9)}`
  }

  // Get date value - handle different data structures
  const getDateValue = (dateObj) => {
    if (dateObj && dateObj.$date) {
      return dateObj.$date
    }
    return dateObj
  }

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <Card>
            <CardHeader>
              <Title>
                <Package size={24} />
                B2B Package Approval
              </Title>
            </CardHeader>
            <CardBody>
              <LoadingContainer>
                <LoadingSpinner />
                Loading packages...
              </LoadingContainer>
            </CardBody>
          </Card>
        </Container>
      </>
    )
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        {toast && (
          <Toast type={toast.type}>
            {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </Toast>
        )}

        <Card>
          <CardHeader>
            <Title>
              <Package size={24} />
              B2B Package Approval
            </Title>
          </CardHeader>
          <CardBody>
            {packages.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>✅</EmptyStateIcon>
                <h3>No pending packages</h3>
                <p>All packages have been approved or there are no packages to review at the moment.</p>
              </EmptyState>
            ) : (
              <PackageGrid>
                {packages.map((pkg) => {
                  const packageId = getPackageId(pkg)
                  const testNames = parseTestNames(pkg.testNames)

                  return (
                    <PackageCard key={packageId}>
                      <PackageHeader>
                        <div>
                          <PackageTitle>{pkg.packageName}</PackageTitle>
                        </div>
                      </PackageHeader>

                      <PackageBody>
                        <PackageInfo>
                          <InfoItem>
                            <InfoIcon>
                              <User size={16} />
                            </InfoIcon>
                            <InfoContent>
                              <InfoLabel>Referrer Code</InfoLabel>
                              <InfoValue>{pkg.referrerCode}</InfoValue>
                            </InfoContent>
                          </InfoItem>

                          <InfoItem>
                            <InfoIcon>
                              <DollarSign size={16} />
                            </InfoIcon>
                            <InfoContent>
                              <InfoLabel>Rate Breakdown</InfoLabel>
                              <RateGrid>
                                <RateItem>
                                  <RateLabel>MRP Total</RateLabel>
                                  <RateValue>{formatRate(pkg.mrptotal)}</RateValue>
                                </RateItem>
                                <RateItem>
                                  <RateLabel>L2L Total</RateLabel>
                                  <RateValue>{formatRate(pkg.l2ltotal)}</RateValue>
                                </RateItem>
                                <RateItem>
                                  <RateLabel>Package Rate</RateLabel>
                                  <RateValue>{formatRate(pkg.rate)}</RateValue>
                                </RateItem>
                              </RateGrid>
                            </InfoContent>
                          </InfoItem>

                          <InfoItem>
                            <InfoIcon>
                              <TestTube size={16} />
                            </InfoIcon>
                            <InfoContent>
                              <InfoLabel>Test Names ({testNames.length})</InfoLabel>
                              <TestNamesList>
                                {testNames.map((testItem, index) => (
                                  <TestName key={index}>{getTestNameDisplay(testItem)}</TestName>
                                ))}
                              </TestNamesList>
                            </InfoContent>
                          </InfoItem>
                        </PackageInfo>
                      </PackageBody>

                      <PackageFooter>
                        <DateInfo>Created: {formatDate(getDateValue(pkg.created_date))}</DateInfo>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button 
                            danger 
                            disabled={approving[pkg.package_id]}
                            onClick={() => handleReject(pkg)}
                          >
                            <AlertCircle size={14} />
                            Reject
                          </Button>
                          <Button
                            success
                            disabled={approving[pkg.package_id]}
                            onClick={() => handleApprove(pkg.package_id)}
                          >
                            {approving[pkg.package_id] ? <LoadingSpinner /> : <Check size={14} />}
                            Approve
                          </Button>
                        </div>
                      </PackageFooter>
                    </PackageCard>
                  )
                })}
              </PackageGrid>
            )}
          </CardBody>
        </Card>
      </Container>

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <ModalOverlay onClick={() => !rejectModal.loading && setRejectModal(prev => ({ ...prev, isOpen: false }))}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Reject Package</ModalTitle>
              <CloseButton onClick={() => !rejectModal.loading && setRejectModal(prev => ({ ...prev, isOpen: false }))}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <p style={{ marginBottom: '1rem', color: 'var(--gray)' }}>
                Please provide a reason for rejecting the package <strong>{rejectModal.packageData?.packageName}</strong>.
              </p>
              <textarea
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--gray-light)',
                  borderRadius: 'var(--border-radius)',
                  minHeight: '120px',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem'
                }}
                placeholder="Enter reason for rejection..."
                value={rejectModal.reason}
                onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
                disabled={rejectModal.loading}
              />
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => !rejectModal.loading && setRejectModal(prev => ({ ...prev, isOpen: false }))}>
                Cancel
              </Button>
              <Button danger onClick={handleRejectSubmit} disabled={rejectModal.loading || !rejectModal.reason.trim()}>
                {rejectModal.loading ? <LoadingSpinner /> : 'Confirm Reject'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  )
}

export default B2BPackageApproval