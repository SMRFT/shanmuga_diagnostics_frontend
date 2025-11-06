import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CheckCircle, Loader2, AlertCircle, User, Calendar, Tag, Code } from 'lucide-react';
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  overflow: hidden;
`;

const THead = styled.thead`
  background-color: var(--secondary);
  color: white;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--gray-light);
  font-size: 0.875rem;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: var(--light);
  }
  
  &:hover {
    background-color: rgba(67, 97, 238, 0.05);
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.primary ? 'var(--primary)' : props.success ? 'var(--success)' : 'white'};
  color: ${props => (props.primary || props.success) ? 'white' : 'var(--gray)'};
  border: 1px solid ${props => props.primary ? 'var(--primary)' : props.success ? 'var(--success)' : 'var(--gray-light)'};
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: var(--transition);
  opacity: ${props => props.disabled ? '0.7' : '1'};
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : props.success ? 'var(--primary-light)' : 'var(--gray-light)'};
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

const B2BFinalApproval = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingApproval, setProcessingApproval] = useState(null);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  useEffect(() => {
    fetchPendingApprovals();
  }, []);
  
  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Labbaseurl}clinical-names/?status=PENDING_FINAL`);
      // console.log('API Response:', response.data);
      setPendingApprovals(response.data);
      setError(null);
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
      await axios.patch(
        `${Labbaseurl}clinical-names/${referrerCode}/final_approve/`
      );
      
      // Custom success toast message
      toast.success(`"${clinicalname || referrerCode}" was finally approved!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      fetchPendingApprovals(); // Refresh the list
    } catch (error) {
      console.error("Final Approval Failed:", error.response?.data);
      toast.error("Final Approval Failed: " + (error.response?.data?.error || "Unknown error"));
    } finally {
      setProcessingApproval(null);
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
                      <Td>{approval.clinicalname || "N/A"}</Td>
                      <Td>{approval.referrerCode}</Td>
                      <Td>{new Date(approval.first_approved_timestamp).toLocaleString()}</Td>
                      <Td>
                        <Badge type="primary">
                          {approval.type || "N/A"}
                        </Badge>
                      </Td>
                      <Td style={{ textAlign: 'right' }}>
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
                              <CheckCircle size={16} />
                              Final Approve
                            </>
                          )}
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default B2BFinalApproval;