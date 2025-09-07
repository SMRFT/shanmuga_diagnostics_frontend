import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import apiRequest from "../Auth/apiRequest";
import { toast } from "react-toastify";
import {
  Search,
  Calendar,
  Filter,
  CheckCircle,
  Eye,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  TestTube,
  X,
  Clock,
  FileText,
  XCircle,
  MessageSquare,
} from "lucide-react";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const MainContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  color: white;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;
    font-weight: 300;
  }
`;

const FilterCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  align-items: end;
`;

const InputGroup = styled.div`
  position: relative;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  padding-left: ${(props) => (props.hasIcon ? "2.75rem" : "1rem")};
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  z-index: 1;

  ${(props) =>
    props.hasLabel &&
    `
    top: calc(50% + 0.75rem);
  `}
`;

const ResultsInfo = styled.div`
  color: white;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  opacity: 0.9;
`;

const TableContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;

  @media (max-width: 768px) {
    min-width: 900px;
  }
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  th {
    padding: 1.5rem 1rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;

    @media (max-width: 768px) {
      padding: 1rem 0.5rem;
      font-size: 0.8rem;
    }
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #f3f4f6;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(102, 126, 234, 0.05);
    }

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 1.5rem 1rem;
    vertical-align: top;

    @media (max-width: 768px) {
      padding: 1rem 0.5rem;
    }
  }
`;

const BatchInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 200px;

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    flex-shrink: 0;

    @media (max-width: 768px) {
      width: 32px;
      height: 32px;
      font-size: 0.8rem;
    }
  }

  .details {
    .batch-number {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.25rem;
      font-size: 1rem;

      @media (max-width: 768px) {
        font-size: 0.9rem;
      }
    }

    .franchise-id {
      color: #6b7280;
      font-size: 0.8rem;
      margin-bottom: 0.25rem;

      @media (max-width: 768px) {
        font-size: 0.7rem;
      }
    }

    .barcode-count {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #6b7280;
      font-size: 0.7rem;

      @media (max-width: 768px) {
        font-size: 0.6rem;
      }
    }
  }
`;

const ShipmentInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 180px;

  .icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(102, 126, 234, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #667eea;
    flex-shrink: 0;

    @media (max-width: 768px) {
      width: 28px;
      height: 28px;
    }
  }

  .details {
    .route {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #1f2937;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.25rem;

      @media (max-width: 768px) {
        font-size: 0.8rem;
      }
    }

    .from-to {
      color: #6b7280;
      font-size: 0.8rem;

      @media (max-width: 768px) {
        font-size: 0.7rem;
      }
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.7rem;
  }

  ${(props) =>
    props.status === "received"
      ? `
    background: rgba(34, 197, 94, 0.1);
    color: #059669;
  `
      : props.status === "rejected"
      ? `
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
  `
      : `
    background: rgba(245, 158, 11, 0.1);
    color: #d97706;
  `}
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${(props) =>
    props.variant === "view"
      ? `
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    
    &:hover:not(:disabled) {
      background: rgba(59, 130, 246, 0.2);
    }
  `
      : props.variant === "approve"
      ? `
    background: rgba(34, 197, 94, 0.1);
    color: #059669;
    
    &:hover:not(:disabled) {
      background: rgba(34, 197, 94, 0.2);
    }
  `
      : props.variant === "reject"
      ? `
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    
    &:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.2);
    }
  `
      : `
    background: rgba(156, 163, 175, 0.1);
    color: #6b7280;
    
    &:hover:not(:disabled) {
      background: rgba(156, 163, 175, 0.2);
    }
  `}
`;

const ActionButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;

  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(102, 126, 234, 0.3);
    border-top: 3px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .text {
    margin-top: 1rem;
    color: #6b7280;
    font-size: 1.1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;

  .icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1rem;
    opacity: 0.3;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .description {
    font-size: 1rem;
    opacity: 0.8;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  backdrop-filter: blur(4px);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  border-bottom: 1px solid #f3f4f6;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 1.4rem;
    }
  }

  button {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(107, 114, 128, 0.1);
    }
  }
`;

const ModalBody = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const DetailSection = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const DetailItem = styled.div`
  .label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }

  .value {
    font-size: 1rem;
    color: #1f2937;
    font-weight: 500;
  }
`;

const SpecimenCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  .specimen-type {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .specimen-count {
    color: #6b7280;
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background: rgba(34, 197, 94, 0.1);
  color: #059669;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;

const RemarkModal = styled(Modal)``;

const RemarkModalContent = styled(ModalContent)`
  max-width: 500px;
`;

const FranchiseBatchApproval = () => {
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingBatch, setProcessingBatch] = useState(null);
  const [rejectionRemark, setRejectionRemark] = useState("");
  const [currentAction, setCurrentAction] = useState(null);
  const navigate = useNavigate();

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Initialize dates on component mount
  useEffect(() => {
    const currentDate = getCurrentDate();
    setFromDate(currentDate);
    setToDate(currentDate);
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);

      const url = `${Labbaseurl}franchise-batches/?${params.toString()}`;
      const result = await apiRequest(url, "GET");

      if (result.success) {
        setBatches(result.data.data || []);
        setFilteredBatches(result.data.data || []);
      } else {
        console.error("API Error:", result.error);
        setError(result.error || "Failed to fetch batches. Please try again.");
        toast.error(result.error || "Failed to fetch batches");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = batches.filter((batch) => {
      const searchFields = [
        batch.batch_number,
        batch.franchise_id,
        batch.shipment_from,
        batch.shipment_to,
        batch.created_by,
        ...(batch.batch_details || []).map((detail) => detail.barcode),
      ];

      return searchFields.some((field) =>
        field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredBatches(filtered);
  }, [searchTerm, batches]);

  const handleReceive = async (batchNumber) => {
    setCurrentAction({ type: "receive", batch: batchNumber });
    setProcessingBatch(batchNumber);
    setError("");
    setSuccess("");

    try {
      // Make API request to update batch received status
      const result = await apiRequest(
        `${Labbaseurl}franchise-receive/${batchNumber}/`,
        "PATCH",
        {
          received: true,
        }
      );

      // Check if the request was successful
      if (!result.success) {
        throw new Error(result.error || `HTTP error! status: ${result.status}`);
      }

      console.log("Success response:", result.data);

      // Update the batch in the local state
      // Make sure to match the correct field name from your MongoDB document
      setBatches((prev) =>
        prev.map((batch) =>
          batch.batch_number === batchNumber
            ? {
                ...batch,
                received: true,
                lastmodified_date: new Date().toISOString(),
                lastmodified_by: "current_user", // You might want to get this from user context
              }
            : batch
        )
      );

      // Show success messages
      setSuccess("Batch received successfully!");
      toast.success("Batch received successfully!");

      // Navigate to next page after delay
      setTimeout(() => {
        navigate("/FranchiseSampleUpdate");
      }, 1500);
    } catch (error) {
      console.error("Error receiving batch:", error);

      // Handle different types of errors
      let errorMessage = "An unexpected error occurred";

      if (error.message.includes("not found")) {
        errorMessage = "Batch not found";
      } else if (error.message.includes("already marked")) {
        errorMessage = "Batch was already received";
      } else {
        errorMessage = error.message;
      }

      setError(`Failed to receive batch: ${errorMessage}`);
      toast.error(`Failed to receive batch: ${errorMessage}`);

      // Clear error after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      // Reset processing states
      setProcessingBatch(null);
      setCurrentAction(null);
    }
  };

  const handleReject = (batchNumber) => {
    setCurrentAction({ type: "reject", batch: batchNumber });
    setShowRemarkModal(true);
    setRejectionRemark("");
  };

  const confirmReject = async () => {
    if (!rejectionRemark.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    const batchNumber = currentAction.batch;
    setProcessingBatch(batchNumber);
    setShowRemarkModal(false);
    setError("");
    setSuccess("");

    try {
      const result = await apiRequest(
        `${Labbaseurl}franchise-receive/${batchNumber}/`,
        "PATCH",
        {
          received: false,
          remarks: rejectionRemark.trim(),
        }
      );

      if (!result.success) {
        throw new Error(result.error || `HTTP error! status: ${result.status}`);
      }

      console.log("Success response:", result.data);

      // Update the batch in the local state
      setBatches((prev) =>
        prev.map((batch) =>
          batch.batch_number === batchNumber
            ? {
                ...batch,
                received: false,
                remarks: rejectionRemark.trim(),
                is_active: false,
              }
            : batch
        )
      );

      setSuccess("Batch rejected successfully!");
      toast.success("Batch rejected successfully!");
    } catch (error) {
      console.error("Error rejecting batch:", error);
      setError(`Failed to reject batch: ${error.message}`);
      toast.error(`Failed to reject batch: ${error.message}`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setProcessingBatch(null);
      setCurrentAction(null);
      setRejectionRemark("");
    }
  };

  const showBatchDetails = (batch) => {
    setSelectedBatch(batch);
    setShowDetails(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBatchInitials = (batchNumber) => {
    return batchNumber?.substring(0, 2).toUpperCase() || "N/A";
  };

  const getStatusInfo = (batch) => {
    if (batch.received === true) {
      return { status: "received", text: "Received" };
    } else if (batch.received === false && batch.remarks) {
      return { status: "rejected", text: "Rejected" };
    } else {
      return { status: "pending", text: "Pending" };
    }
  };

  // Fetch batches when component mounts or when dates are initialized
  useEffect(() => {
    if (fromDate && toDate) {
      fetchBatches();
    }
  }, [fromDate, toDate]);

  return (
    <>
      <GlobalStyle />
      <Container>
        <MainContent>
          <Header>
            <h1>Franchise Batch Approval</h1>
            <p>Manage and approve franchise batch shipments with ease</p>
          </Header>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <FilterCard>
            <FilterGrid>
              <InputGroup>
                <label>Search</label>
                <InputIcon hasLabel>
                  <Search size={20} />
                </InputIcon>
                <StyledInput
                  type="text"
                  placeholder="Search by batch, franchise, barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  hasIcon
                />
              </InputGroup>

              <InputGroup>
                <label>From Date</label>
                <InputIcon hasLabel>
                  <Calendar size={20} />
                </InputIcon>
                <StyledInput
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  hasIcon
                />
              </InputGroup>

              <InputGroup>
                <label>To Date</label>
                <InputIcon hasLabel>
                  <Calendar size={20} />
                </InputIcon>
                <StyledInput
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  hasIcon
                />
              </InputGroup>
            </FilterGrid>
          </FilterCard>

          <ResultsInfo>
            Showing {filteredBatches.length} of {batches.length} batches
          </ResultsInfo>

          <TableContainer>
            <Table>
              <TableHeader>
                <tr>
                  <th>Batch Information</th>
                  <th>Franchise</th>
                  <th>Shipment Details</th>
                  <th>Specimen Count</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <tr>
                    <td colSpan="7">
                      <LoadingContainer>
                        <div className="spinner"></div>
                        <div className="text">Loading batches...</div>
                      </LoadingContainer>
                    </td>
                  </tr>
                ) : filteredBatches.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      <EmptyState>
                        <FileText className="icon" size={64} />
                        <div className="title">No batches found</div>
                        <div className="description">
                          Try adjusting your search criteria or check if there
                          are any pending batches
                        </div>
                      </EmptyState>
                    </td>
                  </tr>
                ) : (
                  filteredBatches.map((batch) => {
                    const statusInfo = getStatusInfo(batch);
                    return (
                      <tr key={batch._id}>
                        <td>
                          <BatchInfo>
                            <div className="icon">
                              {getBatchInitials(batch.batch_number)}
                            </div>
                            <div className="details">
                              <div className="batch-number">
                                Batch #{batch.batch_number}
                              </div>
                              <div className="franchise-id">
                                Franchise: {batch.franchise_id}
                              </div>
                              <div className="barcode-count">
                                <FileText size={12} />
                                {batch.batch_details?.length || 0} barcodes
                              </div>
                            </div>
                          </BatchInfo>
                        </td>
                        <td>
                          <div style={{ fontWeight: "600", color: "#1f2937" }}>
                            {batch.franchise_id}
                          </div>
                        </td>
                        <td>
                          <ShipmentInfo>
                            <div className="icon">
                              <Package size={20} />
                            </div>
                            <div className="details">
                              <div className="route">
                                <MapPin size={14} />
                                Route
                              </div>
                              <div className="from-to">
                                {batch.shipment_from} → {batch.shipment_to}
                              </div>
                            </div>
                          </ShipmentInfo>
                        </td>
                        <td>
                          <div>
                            {batch.specimen_count?.map((specimen, index) => (
                              <div
                                key={index}
                                style={{ marginBottom: "0.25rem" }}
                              >
                                <span
                                  style={{
                                    fontWeight: "600",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  {specimen.specimen_type}
                                </span>
                                <span
                                  style={{
                                    color: "#6b7280",
                                    fontSize: "0.8rem",
                                    marginLeft: "0.5rem",
                                  }}
                                >
                                  ({specimen.count})
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              fontWeight: "600",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {formatDate(batch.created_date)}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                            by {batch.created_by}
                          </div>
                        </td>
                        <td>
                          <StatusBadge status={statusInfo.status}>
                            {statusInfo.status === "received" && (
                              <CheckCircle size={16} />
                            )}
                            {statusInfo.status === "rejected" && (
                              <XCircle size={16} />
                            )}
                            {statusInfo.status === "pending" && (
                              <Clock size={16} />
                            )}
                            {statusInfo.text}
                          </StatusBadge>
                          {batch.remarks && (
                            <div
                              style={{
                                fontSize: "0.7rem",
                                color: "#dc2626",
                                marginTop: "0.25rem",
                                fontStyle: "italic",
                              }}
                            >
                              {batch.remarks}
                            </div>
                          )}
                        </td>
                        <td>
                          <ActionButtonGroup>
                            <ActionButton
                              variant="view"
                              onClick={() => showBatchDetails(batch)}
                            >
                              <Eye size={16} />
                              View Details
                            </ActionButton>
                            {statusInfo.status === "pending" && (
                              <>
                                <ActionButton
                                  variant="approve"
                                  onClick={() =>
                                    handleReceive(batch.batch_number)
                                  }
                                  disabled={
                                    processingBatch === batch.batch_number
                                  }
                                >
                                  <CheckCircle size={16} />
                                  {processingBatch === batch.batch_number &&
                                  currentAction?.type === "receive"
                                    ? "Receiving..."
                                    : "Receive"}
                                </ActionButton>
                                <ActionButton
                                  variant="reject"
                                  onClick={() =>
                                    handleReject(batch.batch_number)
                                  }
                                  disabled={
                                    processingBatch === batch.batch_number
                                  }
                                >
                                  <XCircle size={16} />
                                  {processingBatch === batch.batch_number &&
                                  currentAction?.type === "reject"
                                    ? "Rejecting..."
                                    : "Reject"}
                                </ActionButton>
                              </>
                            )}
                          </ActionButtonGroup>
                        </td>
                      </tr>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Batch Details Modal */}
          {showDetails && selectedBatch && (
            <Modal>
              <ModalContent>
                <ModalHeader>
                  <h2>Batch Details - #{selectedBatch.batch_number}</h2>
                  <button onClick={() => setShowDetails(false)}>
                    <X size={24} />
                  </button>
                </ModalHeader>
                <ModalBody>
                  <DetailSection>
                    <h3>
                      <Package size={20} />
                      Batch Information
                    </h3>
                    <DetailGrid>
                      <DetailItem>
                        <div className="label">Batch Number</div>
                        <div className="value">
                          {selectedBatch.batch_number}
                        </div>
                      </DetailItem>
                      <DetailItem>
                        <div className="label">Franchise ID</div>
                        <div className="value">
                          {selectedBatch.franchise_id}
                        </div>
                      </DetailItem>
                      <DetailItem>
                        <div className="label">Created By</div>
                        <div className="value">{selectedBatch.created_by}</div>
                      </DetailItem>
                      <DetailItem>
                        <div className="label">Created Date</div>
                        <div className="value">
                          {formatDate(selectedBatch.created_date)}
                        </div>
                      </DetailItem>
                      <DetailItem>
                        <div className="label">Last Modified</div>
                        <div className="value">
                          {formatDate(selectedBatch.lastmodified_date)}
                        </div>
                      </DetailItem>
                      <DetailItem>
                        <div className="label">Status</div>
                        <div className="value">
                          <StatusBadge
                            status={getStatusInfo(selectedBatch).status}
                          >
                            {getStatusInfo(selectedBatch).text}
                          </StatusBadge>
                        </div>
                      </DetailItem>
                    </DetailGrid>
                    {selectedBatch.remarks && (
                      <DetailItem style={{ marginTop: "1rem" }}>
                        <div className="label">Remarks</div>
                        <div className="value" style={{ color: "#dc2626" }}>
                          {selectedBatch.remarks}
                        </div>
                      </DetailItem>
                    )}
                  </DetailSection>

                  <DetailSection>
                    <h3>
                      <MapPin size={20} />
                      Shipment Details
                    </h3>
                    <DetailGrid>
                      <DetailItem>
                        <div className="label">From</div>
                        <div className="value">
                          {selectedBatch.shipment_from}
                        </div>
                      </DetailItem>
                      <DetailItem>
                        <div className="label">To</div>
                        <div className="value">{selectedBatch.shipment_to}</div>
                      </DetailItem>
                    </DetailGrid>
                  </DetailSection>

                  <DetailSection>
                    <h3>
                      <TestTube size={20} />
                      Specimen Count
                    </h3>
                    {(selectedBatch.specimen_count || []).map(
                      (specimen, index) => (
                        <SpecimenCard key={index}>
                          <div className="specimen-type">
                            {specimen.specimen_type}
                          </div>
                          <div className="specimen-count">
                            Count: {specimen.count}
                          </div>
                        </SpecimenCard>
                      )
                    )}
                  </DetailSection>

                  <DetailSection>
                    <h3>
                      <FileText size={20} />
                      Batch Details (Barcodes)
                    </h3>
                    <DetailGrid>
                      {(selectedBatch.batch_details || []).map(
                        (detail, index) => (
                          <DetailItem key={index}>
                            <div className="label">Barcode #{index + 1}</div>
                            <div className="value">{detail.barcode}</div>
                          </DetailItem>
                        )
                      )}
                    </DetailGrid>
                  </DetailSection>
                </ModalBody>
              </ModalContent>
            </Modal>
          )}

          {/* Rejection Remarks Modal */}
          {showRemarkModal && currentAction?.type === "reject" && (
            <RemarkModal>
              <RemarkModalContent>
                <ModalHeader>
                  <h2>Reject Batch</h2>
                  <button
                    onClick={() => {
                      setShowRemarkModal(false);
                      setCurrentAction(null);
                      setRejectionRemark("");
                    }}
                  >
                    <X size={24} />
                  </button>
                </ModalHeader>
                <ModalBody>
                  <p style={{ marginBottom: "1rem", color: "#6b7280" }}>
                    Please provide a reason for rejecting batch #
                    {currentAction.batch}:
                  </p>
                  <InputGroup>
                    <label>Rejection Remarks</label>
                    <TextArea
                      placeholder="Enter the reason for rejection..."
                      value={rejectionRemark}
                      onChange={(e) => setRejectionRemark(e.target.value)}
                    />
                  </InputGroup>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      justifyContent: "flex-end",
                      marginTop: "2rem",
                    }}
                  >
                    <ActionButton
                      variant="default"
                      onClick={() => {
                        setShowRemarkModal(false);
                        setCurrentAction(null);
                        setRejectionRemark("");
                      }}
                    >
                      Cancel
                    </ActionButton>
                    <ActionButton
                      variant="reject"
                      onClick={confirmReject}
                      disabled={!rejectionRemark.trim()}
                    >
                      <XCircle size={16} />
                      Confirm Rejection
                    </ActionButton>
                  </div>
                </ModalBody>
              </RemarkModalContent>
            </RemarkModal>
          )}
        </MainContent>
      </Container>
    </>
  );
};

export default FranchiseBatchApproval;