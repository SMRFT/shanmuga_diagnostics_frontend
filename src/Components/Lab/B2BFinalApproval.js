import React, { useState, useEffect } from 'react';
import apiRequest from '../Auth/apiRequest';
import { toast } from 'react-toastify';
import { CheckCircle, Loader2, AlertCircle, User, Calendar, Tag, Code, X } from 'lucide-react';
import styled, { createGlobalStyle } from 'styled-components';

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
`;

// Styled components
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
`;

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
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  background: white;
`;

const THead = styled.thead`
  background: linear-gradient(135deg, var(--secondary), var(--primary-dark));
  color: white;
`;

const Th = styled.th`
  padding: 1.25rem 1rem;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--gray-light);
  font-size: 0.9rem;
  vertical-align: middle;
`;

const Tr = styled.tr`
  transition: all 0.2s ease;
  
  &:nth-child(even) {
    background-color: rgba(248, 249, 250, 0.7);
  }
  
  &:hover {
    background-color: rgba(67, 97, 238, 0.08);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background-color: ${props => props.primary ? 'var(--primary)' : props.success ? 'var(--success)' : props.danger ? 'var(--danger)' : 'white'};
  color: ${props => (props.primary || props.success || props.danger) ? 'white' : 'var(--gray)'};
  border: 1px solid ${props => props.primary ? 'var(--primary)' : props.success ? 'var(--success)' : props.danger ? 'var(--danger)' : 'var(--gray-light)'};
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
    background-color: ${props => props.primary ? 'var(--primary-dark)' : props.success ? '#38bdf8' : props.danger ? '#e11d48' : 'var(--gray-light)'};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Alert = styled.div`
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  ${props => props.type === 'success' && `
    background-color: rgba(76, 201, 240, 0.1);
    border-left: 4px solid var(--success);
    color: var(--primary-dark);
  `}
  
  ${props => props.type === 'error' && `
    background-color: rgba(247, 37, 133, 0.1);
    border-left: 4px solid var(--danger);
    color: var(--danger);
  `}
  
  ${props => props.type === 'info' && `
    background-color: rgba(144, 224, 239, 0.1);
    border-left: 4px solid var(--info);
    color: var(--primary-dark);
  `}
`;

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
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  
  ${props => props.type === 'primary' && `
    background-color: rgba(67, 97, 238, 0.1);
    color: var(--primary);
  `}
  
  ${props => props.type === 'secondary' && `
    background-color: rgba(63, 55, 201, 0.1);
    color: var(--secondary);
  `}
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
`;

const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background-color: rgba(76, 201, 240, 0.1);
  border-radius: 50%;
  margin-bottom: 1rem;
  
  svg {
    color: var(--primary);
    width: 1.75rem;
    height: 1.75rem;
  }
`;

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
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: var(--primary-dark);
`;

const ModalBody = styled.div`
  flex: 1;
  overflow: hidden;
  height: 70vh;
  position: relative;
`;

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
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-light);
  display: flex;
  justify-content: flex-end;
`;

const B2BFinalApproval = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingApproval, setProcessingApproval] = useState(null);
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    approvalData: null,
    reason: "",
    loading: false
  });
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`${Labbaseurl}clinical-names/?status=PENDING_FINAL`, 'GET');

      if (response.success) {
        setPendingApprovals(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch pending final approvals');
        toast.error(response.error || 'Error fetching pending final approvals');
      }
    } catch (error) {
      console.error('Error fetching approvals:', error);
      setError('Failed to fetch pending final approvals');
      toast.error('Error fetching pending final approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalApprove = async (approval) => {
    const { referrerCode, clinicalname } = approval;

    if (!referrerCode) {
      toast.error("Invalid referrer code");
      return;
    }

    try {
      setProcessingApproval(referrerCode);
      const response = await apiRequest(
        `${Labbaseurl}clinical-names/${referrerCode}/final_approve/`,
        'PATCH'
      );

      if (response.success) {
        toast.success(`"${clinicalname || referrerCode}" has been finally approved!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        fetchPendingApprovals(); // Refresh the list
      } else {
        toast.error("Final Approval Failed: " + (response.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Final Approval Failed:", error);
      toast.error("Final Approval Failed: Unknown error");
    } finally {
      setProcessingApproval(null);
    }
  };

  const handleReject = (approval) => {
    setRejectModal({
      isOpen: true,
      approvalData: approval,
      reason: "",
      loading: false
    });
  };

  const handleRejectSubmit = async () => {
    const approval = rejectModal.approvalData;
    const { referrerCode, clinicalname } = approval;
    
    if (!rejectModal.reason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }

    try {
      setRejectModal(prev => ({ ...prev, loading: true }));
      const userId = localStorage.getItem("employeeId") || "Admin";
      
      const payload = {
        rejected_reason: rejectModal.reason,
        rejected_id: userId
      };

      const response = await apiRequest(
        `${Labbaseurl}clinical-names/${referrerCode}/reject/`,
        'PATCH',
        payload
      );

      if (response.success) {
        toast.success(`"${clinicalname || referrerCode}" has been rejected.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        setRejectModal({ isOpen: false, approvalData: null, reason: "", loading: false });
        fetchPendingApprovals(); // Refresh the list
      } else {
        toast.error("Rejection Failed: " + (response.error || "Unknown error"));
        setRejectModal(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error("Rejection Failed:", error);
      toast.error("Rejection Failed: Unknown error");
      setRejectModal(prev => ({ ...prev, loading: false }));
    }
  };

  if (loading) {
    return (
      <Container>
        <Alert type="info">
          <Loader2 size={18} className="animate-spin" />
          <span>Loading pending final approvals...</span>
        </Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert type="error">
          <AlertCircle size={18} />
          <span>Error: {error}</span>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Card>
          <CardHeader>
            <Title>B2B Approval</Title>
            <Button primary onClick={fetchPendingApprovals}>
              <Loader2 size={16} />
              Refresh
            </Button>
          </CardHeader>

          <CardBody>
            {pendingApprovals.length === 0 ? (
              <EmptyState>
                <IconCircle>
                  <CheckCircle />
                </IconCircle>
                <h3>No Pending Final Approvals</h3>
                <p>All clinical names have been finally approved. Check back later for new submissions.</p>
              </EmptyState>
            ) : (
              <TableWrapper>
                <Table>
                  <THead>
                    <Tr>
                      <Th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={14} /> Clinical Name</div></Th>
                      <Th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Code size={14} /> Referrer Code</div></Th>
                      <Th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> First Approved At</div></Th>
                      <Th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={14} /> Type</div></Th>
                      <Th style={{ textAlign: 'right' }}>Actions</Th>
                    </Tr>
                  </THead>
                  <tbody>
                    {pendingApprovals.map((approval) => (
                      <Tr key={approval.referrerCode}>
                        <Td><strong>{approval.clinicalname || "N/A"}</strong></Td>
                        <Td>{approval.referrerCode}</Td>
                        <Td>{new Date(approval.first_approved_timestamp).toLocaleString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
                        })}</Td>
                        <Td>
                          <Badge type="primary">
                            {approval.type || "N/A"}
                          </Badge>
                        </Td>
                        <Td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button danger onClick={() => handleReject(approval)}>
                              <AlertCircle size={14} />
                              Reject
                            </Button>
                            <Button
                              success
                              onClick={() => handleFinalApprove(approval)}
                              disabled={processingApproval === approval.referrerCode}
                            >
                              {processingApproval === approval.referrerCode ? (
                                <>
                                  <LoadingSpinner />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={14} />
                                  Approve
                                </>
                              )}
                            </Button>
                          </div>
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>
            )}
          </CardBody>
        </Card>
      </Container>

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <ModalOverlay onClick={() => !rejectModal.loading && setRejectModal(prev => ({ ...prev, isOpen: false }))}>
          <ModalContent style={{ maxWidth: '500px', height: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Reject Approval</ModalTitle>
              <CloseButton onClick={() => !rejectModal.loading && setRejectModal(prev => ({ ...prev, isOpen: false }))}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            <ModalBody style={{ height: 'auto', padding: '1.5rem' }}>
              <p style={{ marginBottom: '1rem', color: 'var(--gray)' }}>
                Please provide a reason for rejecting <strong>{rejectModal.approvalData?.clinicalname || rejectModal.approvalData?.referrerCode}</strong>.
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
              <Button style={{ marginRight: '0.75rem' }} onClick={() => !rejectModal.loading && setRejectModal(prev => ({ ...prev, isOpen: false }))}>
                Cancel
              </Button>
              <Button danger onClick={handleRejectSubmit} disabled={rejectModal.loading || !rejectModal.reason.trim()}>
                {rejectModal.loading ? <><LoadingSpinner style={{ width: '14px', height: '14px' }} /> Rejecting...</> : 'Confirm Reject'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default B2BFinalApproval;