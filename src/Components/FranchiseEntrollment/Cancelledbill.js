import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "../Auth/apiRequest";
import styled from "styled-components";

// ================= Styled Components =================
const Container = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.04), rgba(102, 126, 234, 0.04));
  padding: 2rem;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    background: linear-gradient(135deg, #f093fb, #667eea, #764ba2);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 2.4rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    letter-spacing: 0.5px;
  }

  p {
    color: #718096;
    font-size: 1.05rem;
    margin: 0;
  }
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: #ffffff;
  padding: 1.2rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(225, 232, 255, 0.8);
  text-align: center;
  min-width: 140px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
  }

  .number {
    font-size: 1.85rem;
    font-weight: 700;
    color: ${props => props.$color || "#667eea"};
    display: block;
    line-height: 1.2;
  }

  .label {
    color: #4a5568;
    font-size: 0.82rem;
    margin-top: 0.35rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid ${props => props.$active ? "#667eea" : "#e2e8f0"};
  background: ${props => props.$active ? "linear-gradient(135deg, #667eea, #764ba2)" : "#ffffff"};
  color: ${props => props.$active ? "#ffffff" : "#4a5568"};
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #667eea;
    color: ${props => props.$active ? "#ffffff" : "#667eea"};
  }
`;

const SearchInput = styled.input`
  padding: 0.55rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 0.85rem;
  min-width: 250px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const TableWrapper = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid rgba(225, 232, 255, 0.8);
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
`;

const Thead = styled.thead`
  background: linear-gradient(135deg, #f093fb 0%, #667eea 100%);
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.2rem;
  color: white;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  white-space: nowrap;
`;

const Tr = styled.tr`
  transition: background 0.15s ease;

  &:hover {
    background: rgba(240, 244, 255, 0.6);
  }

  &:not(:last-child) {
    border-bottom: 1px solid #edf2f7;
  }
`;

const Td = styled.td`
  padding: 0.9rem 1.2rem;
  font-size: 0.9rem;
  color: #2d3748;
  vertical-align: middle;
`;

const TestNameCell = styled(Td)`
  font-weight: 600;
  color: #006666;
  max-width: 280px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  background: ${props => {
    switch (props.status) {
      case 'Cancel Requested':
        return '#f39c12';
      case 'Cancel Accepted':
        return '#3498db';
      case 'Cancel Approved':
        return '#27ae60';
      case 'Rejected':
      case 'Reject':
        return '#e74c3c';
      default:
        return '#718096';
    }
  }};
  color: white;
`;

const DateInfo = styled.div`
  font-size: 0.75rem;
  color: #718096;
  margin-top: 0.3rem;
  white-space: nowrap;
  font-weight: 500;
`;

const MRPTag = styled.span`
  font-weight: 700;
  color: #006666;
  background: rgba(0, 102, 102, 0.08);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  white-space: nowrap;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  border: none;
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.74rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;

  ${props =>
    props.$variant === 'approve'
      ? `
    background: #27ae60;
    color: white;

    &:hover {
      background: #219955;
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(39, 174, 96, 0.3);
    }
  `
      : props.$variant === 'reject'
        ? `
    background: #e74c3c;
    color: white;

    &:hover {
      background: #c0392b;
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(231, 76, 60, 0.3);
    }
  `
        : `
    background: #006666;
    color: white;

    &:hover {
      background: #004d4d;
      transform: translateY(-1px);
    }
  `}

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const NoActionLabel = styled.span`
  color: #a0aec0;
  font-size: 0.8rem;
  font-style: italic;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 20, 20, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
`;

const ModalCard = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  background: linear-gradient(90deg, #006666 0%, #00a0a0 100%);
  padding: 1.25rem 1.5rem;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ModalHeaderText = styled.div`
  color: white;
`;

const ModalPatientId = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
`;

const ModalSubline = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 0.25rem;
`;

const ModalCloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.35);
  }
`;

const ModalBody = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
`;

const ModalTotalLine = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1rem;

  strong {
    color: #006666;
  }
`;

const ModalTestList = styled.ol`
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const ModalTestItem = styled.li`
  font-size: 0.9rem;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed #edf2f7;
`;

const ModalTestName = styled.span`
  font-weight: 600;
  color: #006666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);

  .icon {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    color: #667eea;
  }

  .text {
    color: #718096;
    font-size: 1.1rem;
    margin: 0;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;

  &::after {
    content: '';
    width: 45px;
    height: 45px;
    border: 4px solid rgba(102, 126, 234, 0.2);
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Cancelledbill = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingTests, setProcessingTests] = useState(new Set());
  const [viewItem, setViewItem] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    const res = await apiRequest(`${Labbaseurl}cancel-requested/`, "GET");
    if (res.success) {
      setTests(res.data.cancel_requested || []);
    } else {
      console.error("Error fetching cancel requested tests:", res.error);
    }
    setLoading(false);
  };

  const handleTestAction = async (patientId, barcode, testName, testId, action) => {
    const testKey = `${patientId}_${barcode}_${testId || testName}`;
    setProcessingTests(prev => new Set([...prev, testKey]));

    const targetStatus = action === 'approve' ? 'Cancel Approved' : 'Rejected';
    const currentUserId = localStorage.getItem("auth-user-id") || localStorage.getItem("user_id") || "60157";

    const response = await apiRequest(`${Labbaseurl}update-test-status/`, "POST", {
      patient_id: patientId,
      barcode: barcode,
      test_name: testName,
      test_id: testId,
      action: action,
      new_status: targetStatus,
      approved_by: currentUserId
    });

    if (response.success && (response.data?.success || response.data?.message)) {
      toast.success(`Test ${action === 'approve' ? 'Cancel Approved' : 'Rejected'} successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
      fetchTests();
    } else {
      console.error(`Error ${action}ing test:`, response.error);
      toast.error(`Error processing cancellation: ${response.error || "Please try again."}`, {
        position: "top-right",
        autoClose: 4000,
      });
    }

    setProcessingTests(prev => {
      const newSet = new Set(prev);
      newSet.delete(testKey);
      return newSet;
    });
  };

  // Flatten tests for statistics & filtering
  const allTestItems = tests.flatMap(item =>
    (item.cancel_requested_tests || []).map(test => ({
      ...item,
      test
    }))
  );

  const totalPatients = tests.length;
  const totalTestRequests = allTestItems.length;
  const pendingCount = allTestItems.filter(i => i.test.status === "Cancel Requested" || i.test.status === "Cancel Accepted").length;
  const approvedCount = allTestItems.filter(i => i.test.status === "Cancel Approved").length;
  const rejectedCount = allTestItems.filter(i => i.test.status === "Rejected" || i.test.status === "Reject").length;

  const filteredItems = allTestItems.filter(entry => {
    const status = entry.test.status;
    let matchesStatus = true;
    if (statusFilter === "pending") {
      matchesStatus = status === "Cancel Requested" || status === "Cancel Accepted";
    } else if (statusFilter === "approved") {
      matchesStatus = status === "Cancel Approved";
    } else if (statusFilter === "rejected") {
      matchesStatus = status === "Rejected" || status === "Reject";
    }

    if (!matchesStatus) return false;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      const patientId = (entry.patient_id || "").toLowerCase();
      const barcode = (entry.barcode || "").toLowerCase();
      const franchiseId = (entry.franchise_id || "").toLowerCase();
      const doctor = (entry.referredDoctor || "").toLowerCase();
      const testName = (entry.test.test_name || "").toLowerCase();

      return (
        patientId.includes(term) ||
        barcode.includes(term) ||
        franchiseId.includes(term) ||
        doctor.includes(term) ||
        testName.includes(term)
      );
    }

    return true;
  });

  const formatTimestamp = (isoDate) => {
    if (!isoDate) return null;
    try {
      const d = new Date(isoDate);
      return isNaN(d.getTime()) ? isoDate : d.toLocaleString();
    } catch {
      return isoDate;
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h1>Cancelled Bill Dashboard</h1>
        <p>Review and process patient test cancellation requests</p>
      </Header>

      <StatsBar>
        <StatCard $color="#667eea">
          <span className="number">{totalPatients}</span>
          <div className="label">Patients</div>
        </StatCard>
        <StatCard $color="#764ba2">
          <span className="number">{totalTestRequests}</span>
          <div className="label">Total Requests</div>
        </StatCard>
        <StatCard $color="#f39c12">
          <span className="number">{pendingCount}</span>
          <div className="label">Pending</div>
        </StatCard>
        <StatCard $color="#27ae60">
          <span className="number">{approvedCount}</span>
          <div className="label">Cancel Approved</div>
        </StatCard>
        <StatCard $color="#e74c3c">
          <span className="number">{rejectedCount}</span>
          <div className="label">Rejected</div>
        </StatCard>
      </StatsBar>

      <FilterSection>
        <FilterTabs>
          <FilterTab
            $active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            All ({totalTestRequests})
          </FilterTab>
          <FilterTab
            $active={statusFilter === "pending"}
            onClick={() => setStatusFilter("pending")}
          >
            Pending ({pendingCount})
          </FilterTab>
          <FilterTab
            $active={statusFilter === "approved"}
            onClick={() => setStatusFilter("approved")}
          >
            Cancel Approved ({approvedCount})
          </FilterTab>
          <FilterTab
            $active={statusFilter === "rejected"}
            onClick={() => setStatusFilter("rejected")}
          >
            Rejected ({rejectedCount})
          </FilterTab>
        </FilterTabs>

        <SearchInput
          type="text"
          placeholder="Search by Patient ID, Barcode, Doctor, Test..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FilterSection>

      {filteredItems.length === 0 ? (
        <EmptyState>
          <div className="icon">📋</div>
          <p className="text">No cancellation requests matching criteria.</p>
        </EmptyState>
      ) : (
        <TableWrapper>
          <TableScroll>
            <Table>
              <Thead>
                <tr>
                  <Th>Patient Details</Th>
                  <Th>Barcode</Th>
                  <Th>Franchise Details</Th>
                  <Th>Referred Doctor</Th>
                  <Th>Test Name</Th>
                  <Th>Status</Th>
                  <Th>MRP</Th>
                  <Th>Actions</Th>
                </tr>
              </Thead>
              <tbody>
                {filteredItems.map((entry, idx) => {
                  const item = entry;
                  const test = entry.test;
                  const testKey = `${item.patient_id}_${item.barcode}_${test.test_id || test.test_name}`;
                  const isProcessing = processingTests.has(testKey);
                  const showActions = test.status === "Cancel Requested" || test.status === "Cancel Accepted";

                  const approvedTime = test.Approveddatetime || test.cancel_approved_date;
                  const rejectedTime = test.Rejecteddatetime || test.rejected_date;

                  return (
                    <Tr key={`${item.patient_id}_${item.barcode}_${test.test_id || test.test_name}_${idx}`}>
                      <Td>
                        <div style={{ fontWeight: 700, color: "#1e3c72" }}>{item.patient_name || "—"}</div>
                        <div style={{ fontSize: "0.78rem", color: "#64748b", fontFamily: "monospace" }}>{item.patient_id}</div>
                      </Td>
                      <Td style={{ fontFamily: "monospace", fontWeight: 600 }}>{item.barcode}</Td>
                      <Td>
                        <div style={{ fontWeight: 600, color: "#1e293b" }}>{item.franchise_name || "—"}</div>
                        <span style={{ background: "#e0e7ff", color: "#3730a3", padding: "2px 6px", borderRadius: "4px", fontWeight: 600, fontSize: "0.74rem" }}>
                          {item.franchise_id}
                        </span>
                      </Td>
                      <Td>{item.referredDoctor || "—"}</Td>
                      <TestNameCell>{test.test_name}</TestNameCell>
                      <Td>
                        <StatusBadge status={test.status}>{test.status}</StatusBadge>
                        {approvedTime && (
                          <DateInfo>✅ Approved: {formatTimestamp(approvedTime)}</DateInfo>
                        )}
                        {rejectedTime && (
                          <DateInfo>❌ Rejected: {formatTimestamp(rejectedTime)}</DateInfo>
                        )}
                      </Td>
                      <Td>
                        <MRPTag>₹{test.MRP}</MRPTag>
                      </Td>
                      <Td>
                        <ActionButtons>
                          <ActionButton
                            $variant="view"
                            onClick={() => setViewItem(item)}
                          >
                            View
                          </ActionButton>
                          {showActions ? (
                            <>
                              <ActionButton
                                $variant="approve"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleTestAction(
                                    item.patient_id,
                                    item.barcode,
                                    test.test_name,
                                    test.test_id,
                                    'approve'
                                  )
                                }
                              >
                                {isProcessing ? '...' : 'Approve'}
                              </ActionButton>
                              <ActionButton
                                $variant="reject"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleTestAction(
                                    item.patient_id,
                                    item.barcode,
                                    test.test_name,
                                    test.test_id,
                                    'reject'
                                  )
                                }
                              >
                                {isProcessing ? '...' : 'Reject'}
                              </ActionButton>
                            </>
                          ) : (
                            <NoActionLabel>Processed</NoActionLabel>
                          )}
                        </ActionButtons>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          </TableScroll>
        </TableWrapper>
      )}

      {viewItem &&
        createPortal(
          <ModalOverlay onClick={() => setViewItem(null)}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalHeaderText>
                  <ModalPatientId>Patient ID: {viewItem.patient_id}</ModalPatientId>
                  <ModalSubline>
                    Barcode: {viewItem.barcode} &nbsp;•&nbsp; Franchise: {viewItem.franchise_id}
                  </ModalSubline>
                </ModalHeaderText>
                <ModalCloseButton onClick={() => setViewItem(null)}>✕</ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                <ModalTotalLine>
                  Total Tests: <strong>{viewItem.cancel_requested_tests?.length || 0}</strong>
                </ModalTotalLine>
                <ModalTestList>
                  {viewItem.cancel_requested_tests?.map((test, i) => (
                    <ModalTestItem key={i}>
                      <div>
                        <ModalTestName>{test.test_name}</ModalTestName>
                        <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "2px" }}>
                          MRP: ₹{test.MRP}
                          {(test.Approveddatetime || test.cancel_approved_date) && (
                            <span> • Approved: {formatTimestamp(test.Approveddatetime || test.cancel_approved_date)} {test.approved_by ? `by ${test.approved_by}` : ''}</span>
                          )}
                          {(test.Rejecteddatetime || test.rejected_date) && (
                            <span> • Rejected: {formatTimestamp(test.Rejecteddatetime || test.rejected_date)} {test.rejected_by ? `by ${test.rejected_by}` : ''}</span>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={test.status}>{test.status}</StatusBadge>
                    </ModalTestItem>
                  ))}
                </ModalTestList>
              </ModalBody>
            </ModalCard>
          </ModalOverlay>,
          document.body
        )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Container>
  );
};

export default Cancelledbill;