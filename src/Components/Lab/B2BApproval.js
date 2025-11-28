import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  CheckCircle, 
  Loader2, 
  AlertCircle, 
  User, 
  Calendar, 
  Tag, 
  Code, 
  MapPin, 
  FileText, 
  CreditCard, 
  ChevronDown,
  ChevronUp,
  Eye,
  X
} from 'lucide-react';
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
  background-color: ${props => props.primary ? 'var(--primary)' : props.success ? 'var(--success)' : props.danger ? 'var(--danger)' : props.secondary ? 'var(--secondary)' : 'white'};
  color: ${props => (props.primary || props.success || props.danger || props.secondary) ? 'white' : 'var(--gray)'};
  border: 1px solid ${props => props.primary ? 'var(--primary)' : props.success ? 'var(--success)' : props.danger ? 'var(--danger)' : props.secondary ? 'var(--secondary)' : 'var(--gray-light)'};
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: var(--transition);
  opacity: ${props => props.disabled ? '0.7' : '1'};
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : props.success ? 'var(--primary-light)' : props.danger ? 'var(--danger)' : props.secondary ? 'var(--primary-dark)' : 'var(--gray-light)'};
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
  
  ${props => props.type === 'success' && `
    background-color: rgba(76, 201, 240, 0.1);
    color: var(--success);
  `}
  
  ${props => props.type === 'warning' && `
    background-color: rgba(248, 150, 30, 0.1);
    color: var(--warning);
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

// New styled components for detailed view
const DetailCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

const DetailHeader = styled.div`
  padding: 1rem 1.5rem;
  background-color: var(--primary-light);
  color: white;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const DetailBody = styled.div`
  padding: ${props => props.expanded ? '1.5rem' : '0'};
  max-height: ${props => props.expanded ? '2000px' : '0'};
  overflow: hidden;
  transition: max-height 0.5s ease, padding 0.3s ease;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailSection = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  color: var(--primary-dark);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--gray-light);
`;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.div`
  width: 40%;
  font-weight: 500;
  color: var(--gray);
  font-size: 0.875rem;
`;

const InfoValue = styled.div`
  width: 60%;
  font-size: 0.875rem;
`;

const DocumentLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-light);
`;

// Updated modal components for document preview
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

const DocumentPreview = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: block;
`;

const PreviewLoading = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 10;
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

const DocumentActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-light);
  display: flex;
  justify-content: flex-end;
`;

const B2BApproval = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingApproval, setProcessingApproval] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState({});
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    fileId: null,
    fileName: null,
    loading: false
  });
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  useEffect(() => {
    fetchPendingApprovals();
  }, []);
  
  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Labbaseurl}clinical-names/?status=PENDING_APPROVAL`);
      // console.log('API Response:', response.data);
      setPendingApprovals(response.data);
      
      // Initialize expanded state for all items
      const expandedState = {};
      response.data.forEach(item => {
        expandedState[item.referrerCode] = false;
      });
      setExpandedDetails(expandedState);
      
      setError(null);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      setError('Failed to fetch pending approvals');
      toast.error('Error fetching pending approvals');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFirstApprove = async (approval) => {
    const { referrerCode, clinicalname } = approval;
    
    if (!referrerCode) {
      toast.error("Invalid referrer code");
      return;
    }

    try {
      setProcessingApproval(referrerCode);
      await axios.patch(
        `${Labbaseurl}clinical-names/${referrerCode}/first_approve/`
      );
      
      toast.success(`"${clinicalname || referrerCode}" was approved!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      fetchPendingApprovals(); // Refresh the list
    } catch (error) {
      console.error("First Approval Failed:", error.response?.data);
      toast.error("First Approval Failed: " + (error.response?.data?.error || "Unknown error"));
    } finally {
      setProcessingApproval(null);
    }
  };
  
  const toggleDetails = (referrerCode) => {
    setExpandedDetails(prev => ({
      ...prev,
      [referrerCode]: !prev[referrerCode]
    }));
  };
  
  const handleReject = (approval) => {
    // Implementation for reject functionality
    toast.info(`Reject functionality would be implemented here for ${approval.clinicalname || approval.referrerCode}`);
  };
  
  const handlePreviewMOU = (approval) => {
    // Open modal with document preview
    setPreviewModal({
      isOpen: true,
      fileId: approval.mou_file_id,
      fileName: `MOU - ${approval.clinicalname || approval.referrerCode}`,
      loading: true
    });
  };
  
  const closePreviewModal = () => {
    setPreviewModal({
      isOpen: false,
      fileId: null,
      fileName: null,
      loading: false
    });
  };
  
  const handleIframeLoad = () => {
    setPreviewModal(prev => ({
      ...prev,
      loading: false
    }));
  };
  
  if (loading) {
    return (
      <Container>
        <Alert type="info">
          <Loader2 size={18} className="animate-spin" />
          <span>Loading pending approvals...</span>
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
                <h3>No Pending Approvals</h3>
                <p>All clinical names have been reviewed. Check back later for new submissions.</p>
              </EmptyState>
            ) : (
              <>
                <Table>
                  <THead>
                    <Tr>
                      <Th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={14} /> Clinical Name</div></Th>
                      <Th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Code size={14} /> Referrer Code</div></Th>
                      <Th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={14} /> Type</div></Th>
                      <Th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> Created At</div></Th>
                      <Th style={{ textAlign: 'center' }}>Status</Th>
                      <Th style={{ textAlign: 'right' }}>Actions</Th>
                    </Tr>
                  </THead>
                  <tbody>
                    {pendingApprovals.map((approval) => (
                      <Tr key={approval.referrerCode}>
                        <Td>{approval.clinicalname || "N/A"}</Td>
                        <Td>{approval.referrerCode}</Td>
                        <Td>
                          <Badge type="primary">
                            {approval.type || "N/A"}
                          </Badge>
                        </Td>
                        <Td>{new Date(approval.created_at).toLocaleString()}</Td>
                        <Td style={{ textAlign: 'center' }}>
                          <Badge type="warning">
                            {approval.status}
                          </Badge>
                        </Td>
                        <Td style={{ textAlign: 'right' }}>
                          <Button 
                            onClick={() => toggleDetails(approval.referrerCode)}
                          >
                            {expandedDetails[approval.referrerCode] ? (
                              <>
                                <ChevronUp size={16} />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} />
                                View Details
                              </>
                            )}
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
                
                {pendingApprovals.map((approval) => (
                  <DetailCard key={`details-${approval.referrerCode}`}>
                    <DetailHeader onClick={() => toggleDetails(approval.referrerCode)}>
                      <span>{approval.clinicalname || approval.referrerCode} - Detailed Information</span>
                      {expandedDetails[approval.referrerCode] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </DetailHeader>
                    
                    <DetailBody expanded={expandedDetails[approval.referrerCode]}>
                      <DetailGrid>
                        <DetailSection>
                          <SectionTitle><User size={16} /> Basic Information</SectionTitle>
                          <InfoItem>
                            <InfoLabel>Referrer Code</InfoLabel>
                            <InfoValue>{approval.referrerCode}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>Clinical Name</InfoLabel>
                            <InfoValue>{approval.clinicalname || "N/A"}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>Type</InfoLabel>
                            <InfoValue>{approval.type || "N/A"}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>Sales Mapping</InfoLabel>
                            <InfoValue>{approval.salesMapping || "N/A"}</InfoValue>
                          </InfoItem>
                        </DetailSection>
                        
                        <DetailSection>
                          <SectionTitle><MapPin size={16} /> Contact & Location</SectionTitle>
                          <InfoItem>
                            <InfoLabel>Email</InfoLabel>
                            <InfoValue>{approval.email || "N/A"}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>Phone</InfoLabel>
                            <InfoValue>{approval.phone || "N/A"}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>Alternate Number</InfoLabel>
                            <InfoValue>{approval.alternateNumber || "N/A"}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>Address</InfoLabel>
                            <InfoValue>{approval.address || "N/A"}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>Area</InfoLabel>
                            <InfoValue>{approval.area || "N/A"}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>City</InfoLabel>
                            <InfoValue>{approval.city || "N/A"}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>State</InfoLabel>
                            <InfoValue>{approval.state || "N/A"}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>Pincode</InfoLabel>
                            <InfoValue>{approval.pincode || "N/A"}</InfoValue>
                          </InfoItem>
                        </DetailSection>
                      </DetailGrid>
                      
                      <DetailGrid>
                        <DetailSection>
                          <SectionTitle><CreditCard size={16} /> Credit Information</SectionTitle>
                          <InfoItem>
                            <InfoLabel>B2B Type</InfoLabel>
                            <InfoValue>{approval.b2bType || "N/A"}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>Credit Type</InfoLabel>
                            <InfoValue>{approval.creditType || "N/A"}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>Credit Limit</InfoLabel>
                            <InfoValue>₹{approval.creditLimit || "N/A"}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>Invoice Period</InfoLabel>
                            <InfoValue>{approval.invoicePeriod || "N/A"} days</InfoValue>
                          </InfoItem>
                        </DetailSection>
                        
                        <DetailSection>
                          <SectionTitle><FileText size={16} /> Report Preferences</SectionTitle>
                          <InfoItem>
                            <InfoLabel>Report Delivery</InfoLabel>
                            <InfoValue>{approval.reportDelivery || "N/A"}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>Report Format</InfoLabel>
                            <InfoValue>{approval.report || "N/A"}</InfoValue>
                          </InfoItem>
                          <InfoItem>
                            <InfoLabel>MOU Document</InfoLabel>
                            <InfoValue>
                              {approval.mou_file_id ? (
                                <DocumentActions>
                                  <DocumentLink 
                                    href="#" 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handlePreviewMOU(approval);
                                    }}
                                  >
                                    <Eye size={14} />
                                    Preview MOU
                                  </DocumentLink>
                                </DocumentActions>
                              ) : (
                                "No MOU Uploaded"
                              )}
                            </InfoValue>
                          </InfoItem>
                        </DetailSection>
                      </DetailGrid>
                      
                      <ActionBar>
                        <Button danger onClick={() => handleReject(approval)}>
                          <AlertCircle size={16} />
                          Reject
                        </Button>
                        <Button 
                          success
                          onClick={() => handleFirstApprove(approval)}
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
                              Approve
                            </>
                          )}
                        </Button>
                      </ActionBar>
                    </DetailBody>
                  </DetailCard>
                ))}
              </>
            )}
          </CardBody>
        </Card>
      </Container>
      
      {/* Document Preview Modal - Updated for better document viewing */}
      {previewModal.isOpen && (
        <ModalOverlay onClick={closePreviewModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{previewModal.fileName}</ModalTitle>
              <CloseButton onClick={closePreviewModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              {previewModal.loading && (
                <PreviewLoading>
                  <LoadingSpinner style={{ width: '32px', height: '32px', marginBottom: '1rem' }} />
                  <p>Loading document preview...</p>
                </PreviewLoading>
              )}
<iframe 
  src={`${Labbaseurl}mou-preview/${previewModal.fileId}/`} 
  title="MOU Document Preview"
  onLoad={handleIframeLoad}
  style={{ width: '100%', height: '600px', border: 'none' }}
/>

            </ModalBody>
            <ModalFooter>
              <Button onClick={closePreviewModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default B2BApproval;