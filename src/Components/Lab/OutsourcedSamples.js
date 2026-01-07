import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "../Auth/apiRequest";
import {
    Search, Calendar, RefreshCw, Share, User, TestTube,
    Clock, CheckCircle, Truck, AlertCircle, XCircle
} from "lucide-react";

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// --- Styled Components ---

const PageContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #f0f4ff 0%, #f3e5f5 100%);
  min-height: 100vh;
  font-family: 'Outfit', 'Inter', sans-serif;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  animation: ${fadeIn} 0.5s ease-out;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 15px rgba(167, 119, 227, 0.4);
  
  svg {
    stroke-width: 2.5px;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #1a1a1a;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
`;

const FilterSection = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
  flex-wrap: wrap;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 0.2rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #a777e3;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 42px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #334155;
  transition: all 0.3s;
  background: #f8f9fa;

  &:focus {
    outline: none;
    border-color: #a777e3;
    background: white;
    box-shadow: 0 0 0 4px rgba(167, 119, 227, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  
  &:active {
    transform: translateY(1px);
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  color: white;
  box-shadow: 0 4px 15px rgba(167, 119, 227, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(167, 119, 227, 0.5);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #475569;
    transform: translateY(-2px);
  }
`;

const TableCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(167, 119, 227, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.6);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.8s ease-out;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  background: rgba(248, 250, 252, 0.8);
  padding: 1.2rem 1.5rem;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  white-space: nowrap;
`;

const Tr = styled.tr`
  transition: all 0.2s;

  &:hover {
    background: rgba(167, 119, 227, 0.05);
  }
`;

const Td = styled.td`
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid rgba(241, 245, 249, 0.8);
  color: #334155;
  font-size: 0.95rem;
  vertical-align: middle;

  ${Tr}:last-child & {
    border-bottom: none;
  }
`;

const Badge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.bg || '#f1f5f9'};
  color: ${props => props.color || '#475569'};
  border: 1px solid ${props => props.border || 'transparent'};
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
`;

const NoDatacontainer = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const EmptyIcon = styled.div`
  background: #f1f5f9;
  padding: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// --- Sample Data Type Badge Helper ---
const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
        case 'outsource':
        case 'outsourced':
            return { bg: '#eff6ff', color: '#3b82f6', border: '#dbeafe', icon: null }; // Blue
        case 'completed':
        case 'approved':
            return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', icon: <CheckCircle size={14} /> }; // Green
        case 'rejected':
            return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', icon: <XCircle size={14} /> }; // Red
        case 'pending':
            return { bg: '#fffbeb', color: '#d97706', border: '#fde68a', icon: <Clock size={14} /> }; // Amber
        default:
            return { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0', icon: null };
    }
};

// --- Main Component ---

const OutsourcedSamples = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setFromDate(today);
        setToDate(today);
        fetchReport(today, today);
    }, []);

    const fetchReport = async (start, end) => {
        setLoading(true);
        try {
            const response = await apiRequest(
                `${Labbaseurl}get_outsourced_samples/`,
                "POST",
                {
                    from_date: start,
                    to_date: end
                }
            );

            if (response.success && response.data && response.data.data) {
                setReportData(response.data.data);
                toast.success(`Found ${response.data.count} records`);
            } else {
                setReportData([]);
                toast.info("No records found");
            }
        } catch (error) {
            console.error("Error fetching outsourced samples:", error);
            toast.error("Failed to fetch report");
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!fromDate || !toDate) {
            toast.warning("Please select both From Date and To Date");
            return;
        }
        fetchReport(fromDate, toDate);
    };

    const handleReset = () => {
        const today = new Date().toISOString().split("T")[0];
        setFromDate(today);
        setToDate(today);
        fetchReport(today, today);
    };

    const formatDateTime = (isoString) => {
        if (!isoString || isoString === "N/A") return "N/A";
        try {
            return new Date(isoString).toLocaleString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch {
            return isoString;
        }
    };

    return (
        <PageContainer>
            <ToastContainer position="top-right" autoClose={3000} />

            <Header>
                <TitleGroup>
                    <IconWrapper>
                        <Share size={24} />
                    </IconWrapper>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Title>Outsourced Samples</Title>
                        <Subtitle>Track samples sent to external reference labs</Subtitle>
                    </div>
                </TitleGroup>
            </Header>

            <FilterSection>
                <FormGroup>
                    <Label>From Date</Label>
                    <InputWrapper>
                        <InputIcon><Calendar size={18} /></InputIcon>
                        <Input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </InputWrapper>
                </FormGroup>

                <FormGroup>
                    <Label>To Date</Label>
                    <InputWrapper>
                        <InputIcon><Calendar size={18} /></InputIcon>
                        <Input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </InputWrapper>
                </FormGroup>

                <ButtonGroup>
                    <PrimaryButton onClick={handleSearch} disabled={loading}>
                        {loading ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
                        Search Report
                    </PrimaryButton>
                    <SecondaryButton onClick={handleReset}>
                        <RefreshCw size={18} />
                        Reset
                    </SecondaryButton>
                </ButtonGroup>
            </FilterSection>

            <TableCard>
                {reportData.length > 0 ? (
                    <TableContainer>
                        <Table>
                            <thead>
                                <tr>
                                    <Th>Outcourse Date</Th>
                                    <Th>Outsourced To</Th>
                                    <Th>Patient Info</Th>
                                    <Th>Test Details</Th>
                                    <Th>Status</Th>
                                    <Th>Dispatch Info</Th>
                                    <Th>Remarks</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => {
                                    return (
                                        <Tr key={index}>
                                            <Td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <span style={{ fontWeight: 700, color: '#1a1a1a' }}>
                                                        {item.date ? item.date.split('T')[0] : 'N/A'}
                                                    </span>
                                                    <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Clock size={12} />
                                                        {formatDateTime(item.outsourced_time).split(',')[1] || item.outsourced_time}
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                                        by {item.outsourced_by}
                                                    </span>
                                                </div>
                                            </Td>
                                            <Td>
                                                <Badge bg="#e0f2fe" color="#0369a1" border="#bae6fd">
                                                    <Truck size={14} />
                                                    {item.outsourced_to}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                                                        <User size={14} color="#6e8efb" />
                                                        {item.patient_id}
                                                    </div>
                                                    <div style={{
                                                        fontFamily: 'monospace',
                                                        fontSize: '0.8rem',
                                                        background: 'rgba(110, 142, 251, 0.1)',
                                                        color: '#6e8efb',
                                                        padding: '2px 8px',
                                                        borderRadius: '6px',
                                                        width: 'fit-content'
                                                    }}>
                                                        {item.barcode}
                                                    </div>
                                                </div>
                                            </Td>
                                            <Td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#334155' }}>
                                                        <TestTube size={14} color="#a777e3" />
                                                        {item.testname}
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                                        {item.container} • {item.samplecollector}
                                                    </div>
                                                </div>
                                            </Td>
                                            <Td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    {item.approve_time !== "N/A" ? (
                                                        <Badge bg="#dcfce7" color="#15803d" border="#86efac">
                                                            <CheckCircle size={12} />
                                                            Approved: {formatDateTime(item.approve_time)}
                                                        </Badge>
                                                    ) : (
                                                        <Badge bg="#fff7ed" color="#c2410c" border="#fed7aa">
                                                            <Clock size={12} />
                                                            Pending Approval
                                                        </Badge>
                                                    )}

                                                    {item.tat !== "N/A" && (
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <span style={{ fontWeight: 600 }}>TAT:</span> {item.tat}
                                                        </div>
                                                    )}
                                                </div>
                                            </Td>
                                            <Td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    {item.dispatch_status ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontSize: '0.85rem', fontWeight: 600 }}>
                                                            <CheckCircle size={14} /> Dispatched
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>
                                                            <Clock size={14} /> Not Dispatched
                                                        </div>
                                                    )}
                                                    {item.dispatch_time && item.dispatch_time !== "N/A" && (
                                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                            {formatDateTime(item.dispatch_time)}
                                                        </span>
                                                    )}
                                                </div>
                                            </Td>
                                            <Td>
                                                {item.remarks !== "N/A" ? (
                                                    <div style={{
                                                        maxWidth: '200px',
                                                        fontSize: '0.85rem',
                                                        color: '#475569',
                                                        background: 'rgba(241, 245, 249, 0.7)',
                                                        padding: '8px 12px',
                                                        borderRadius: '12px',
                                                        border: '1px solid rgba(226, 232, 240, 0.6)'
                                                    }}>
                                                        {item.remarks}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#cbd5e1' }}>-</span>
                                                )}
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </TableContainer>
                ) : (
                    <NoDatacontainer>
                        <EmptyIcon>
                            <AlertCircle size={48} color="#94a3b8" />
                        </EmptyIcon>
                        <h3 style={{ margin: '0', color: '#334155', fontWeight: 700 }}>No Outsourced Samples Found</h3>
                        <p style={{ margin: '0', fontSize: '0.95rem' }}>Try adjusting your date range filters to see results.</p>
                    </NoDatacontainer>
                )}
            </TableCard>
        </PageContainer>
    );
};

export default OutsourcedSamples;
