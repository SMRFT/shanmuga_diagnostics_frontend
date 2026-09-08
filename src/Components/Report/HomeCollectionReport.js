import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import apiRequest from "../Auth/apiRequest";
import {
  Search,
  Calendar,
  RefreshCw,
  Home,
  MapPin,
  Phone,
  User,
  Activity,
  FileSpreadsheet,
  Filter,
  Eye,
  FlaskConical,
  X
} from "lucide-react";

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
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
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);
  
  svg {
    stroke-width: 2.5px;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #1a1a1a;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
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
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: nowrap;
  overflow-x: auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1 1 0;
  min-width: 140px;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 0.2rem;
  white-space: nowrap;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #0ea5e9;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 10px 10px 38px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 500;
  color: #334155;
  transition: all 0.3s;
  background: #f8f9fa;
  height: 42px;

  &:focus {
    outline: none;
    border-color: #0ea5e9;
    background: white;
    box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 10px 10px 38px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 500;
  color: #334155;
  transition: all 0.3s;
  background: #f8f9fa;
  cursor: pointer;
  outline: none;
  height: 42px;

  &:focus {
    border-color: #0ea5e9;
    background: white;
    box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: nowrap;
  flex-shrink: 0;
  align-items: flex-end;
`;

const Button = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
  height: 42px;
  white-space: nowrap;
  
  &:active {
    transform: translateY(1px);
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  color: white;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5);
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

const ExcelButton = styled(Button)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const TableCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.1);
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
    background: rgba(14, 165, 233, 0.05);
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

const Amount = styled.span`
  font-family: 'Space Mono', monospace;
  font-weight: 700;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 4px;
`;

/* ═══════════════════════════════════════════════
   TESTS CELL & MODAL COMPONENTS
═══════════════════════════════════════════════ */
const TestCellWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
`;

const TestCountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
`;

const ViewTestsBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #dbeafe;
    border-color: #93c5fd;
    transform: translateY(-1px);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.25);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  animation: ${scaleIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
`;

const ModalHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
`;

const ModalTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ModalIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
`;

const ModalSubtitle = styled.div`
  font-size: 0.78rem;
  color: #64748b;
  margin-top: 2px;
`;

const ModalCloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background: #f1f5f9;
    color: #334155;
  }
`;

const ModalBody = styled.div`
  padding: 1.25rem 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  max-height: 55vh;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 6px;
  }
`;

const TestCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.15s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

const TestNumberBadge = styled.span`
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TestInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const TestNameText = styled.span`
  font-size: 0.88rem;
  font-weight: 600;
  color: #1e293b;
`;

const TestAmountText = styled.span`
  font-size: 0.84rem;
  font-weight: 700;
  color: #059669;
  font-family: 'Space Mono', monospace;
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
`;

// --- Main Component ---

const HomeCollectionReport = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedModalItem, setSelectedModalItem] = useState(null);
    const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setFromDate(today);
        setToDate(today);
        fetchReport(today, today, "ALL");
    }, []);

    const fetchReport = async (start, end, status = statusFilter) => {
        setLoading(true);
        try {
            const payload = {
                from_date: start,
                to_date: end
            };
            if (status && status !== "ALL") {
                payload.status = status;
            }

            const response = await apiRequest(
                `${Labbaseurl}get_home_collection_report/`,
                "POST",
                payload
            );

            if (response.success && response.data && response.data.data) {
                setReportData(response.data.data);
                toast.success(`Found ${response.data.count} home collection records`);
            } else {
                setReportData([]);
                toast.info("No home collection records found");
            }
        } catch (error) {
            console.error("Error fetching home collection report:", error);
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
        fetchReport(fromDate, toDate, statusFilter);
    };

    const handleReset = () => {
        const today = new Date().toISOString().split("T")[0];
        setFromDate(today);
        setToDate(today);
        setStatusFilter("ALL");
        fetchReport(today, today, "ALL");
    };

    const handleExportExcel = () => {
        if (!reportData || reportData.length === 0) {
            toast.warning("No data available to export");
            return;
        }

        try {
            const excelData = [];

            reportData.forEach((item, patientIdx) => {
                const testList = (item.tests && Array.isArray(item.tests) && item.tests.length > 0)
                    ? item.tests
                    : (item.test_names && item.test_names !== "-")
                    ? item.test_names.split("\n").map(t => ({ test_name: t.replace(/^\d+\.\s*/, "").trim(), amount: "" }))
                    : [{ test_name: "-", amount: "" }];

                testList.forEach((test, testIdx) => {
                    const isFirst = testIdx === 0;
                    const tname = typeof test === "object" ? (test.test_name || test.testname || "-") : String(test);
                    const tamount = typeof test === "object" && test.amount !== undefined && test.amount !== "" ? Number(test.amount) : "";

                    excelData.push({
                        "S.No": isFirst ? patientIdx + 1 : "",
                        "Date": isFirst ? (item.date || "-") : "",
                        "Bill No": isFirst ? (item.bill_no || "-") : "",
                        "Patient ID": isFirst ? (item.patient_id || "-") : "",
                        "Patient Name": isFirst ? (item.patient_name || "-") : "",
                        "Phone": isFirst ? (item.phone || "-") : "",
                        "Address": isFirst ? (item.address || "-") : "",
                        "Sample Collector": isFirst ? (item.sample_collector || "-") : "",
                        "Test #": testIdx + 1,
                        "Test Name": tname,
                        "Test Amount (₹)": tamount !== "" ? tamount : "-",
                        "Bill Total Amount (₹)": isFirst ? (Number(item.total_amount) || 0) : "",
                        "Status": isFirst ? (item.status || "-") : ""
                    });
                });
            });

            const ws = XLSX.utils.json_to_sheet(excelData);

            // Auto-adjust column widths
            ws["!cols"] = [
                { wch: 6 },  // S.No
                { wch: 12 }, // Date
                { wch: 16 }, // Bill No
                { wch: 12 }, // Patient ID
                { wch: 22 }, // Patient Name
                { wch: 14 }, // Phone
                { wch: 32 }, // Address
                { wch: 20 }, // Sample Collector
                { wch: 8 },  // Test #
                { wch: 35 }, // Test Name
                { wch: 15 }, // Test Amount (₹)
                { wch: 20 }, // Bill Total Amount (₹)
                { wch: 12 }, // Status
            ];

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Home Collection Report");

            const fileName = `Home_Collection_Report_${fromDate || 'all'}_to_${toDate || 'all'}.xlsx`;
            XLSX.writeFile(wb, fileName);
            toast.success("Excel exported successfully!");
        } catch (error) {
            console.error("Error exporting to Excel:", error);
            toast.error("Failed to export Excel file");
        }
    };

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <PageContainer>
            <ToastContainer position="top-right" autoClose={3000} />

            <Header>
                <TitleGroup>
                    <IconWrapper>
                        <Home size={24} />
                    </IconWrapper>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Title>Home Collection Report</Title>
                        <Subtitle>Manage and track home sample collections</Subtitle>
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
                            onChange={(e) => setFromDate(e.target.value)} max={toDate || new Date().toISOString().split("T")[0]}
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
                            onChange={(e) => setToDate(e.target.value)} min={fromDate} max={new Date().toISOString().split("T")[0]}
                        />
                    </InputWrapper>
                </FormGroup>

                <FormGroup>
                    <Label>Status</Label>
                    <InputWrapper>
                        <InputIcon><Filter size={18} /></InputIcon>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="Billed">Billed</option>
                            <option value="Registered">Registered</option>
                        </Select>
                    </InputWrapper>
                </FormGroup>

                <ButtonGroup>
                    <PrimaryButton onClick={handleSearch} disabled={loading}>
                        {loading ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
                        Search Records
                    </PrimaryButton>
                    <SecondaryButton onClick={handleReset}>
                        <RefreshCw size={18} />
                        Reset
                    </SecondaryButton>
                    <ExcelButton onClick={handleExportExcel} disabled={loading || reportData.length === 0}>
                        <FileSpreadsheet size={18} />
                        Export Excel
                    </ExcelButton>
                </ButtonGroup>
            </FilterSection>

            <TableCard>
                {reportData.length > 0 ? (
                    <TableContainer>
                        <Table>
                            <thead>
                                <tr>
                                    <Th>Date / Bill No</Th>
                                    <Th>Patient Details</Th>
                                    <Th>Sample Collector</Th>
                                    <Th>Tests Ordered</Th>
                                    <Th>Financials</Th>
                                    <Th>Status</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => {
                                    const testCount = item.test_count || (item.tests ? item.tests.length : 0);
                                    return (
                                        <Tr key={index}>
                                            <Td>
                                                <div style={{ fontWeight: 700, color: '#1a1a1a' }}>{item.date}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', fontFamily: 'monospace' }}>{item.bill_no}</div>
                                            </Td>
                                            <Td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#0f172a' }}>
                                                    <User size={14} color="#0ea5e9" />
                                                    {item.patient_name}
                                                </div>
                                                <InfoRow>
                                                    <Phone size={12} /> {item.phone}
                                                </InfoRow>
                                                <InfoRow>
                                                    <MapPin size={12} /> {item.address}
                                                </InfoRow>
                                            </Td>
                                            <Td>
                                                {item.sample_collector !== "N/A" ? (
                                                    <Badge bg="#ecfdf5" color="#059669" border="#a7f3d0">
                                                        <Activity size={12} />
                                                        {item.sample_collector}
                                                    </Badge>
                                                ) : (
                                                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>Unassigned</span>
                                                )}
                                            </Td>
                                            <Td style={{ minWidth: '170px' }}>
                                                {testCount > 0 ? (
                                                    <TestCellWrapper>
                                                        <TestCountBadge>
                                                            <FlaskConical size={13} />
                                                            {testCount} {testCount === 1 ? 'Test' : 'Tests'}
                                                        </TestCountBadge>
                                                        <ViewTestsBtn onClick={() => setSelectedModalItem(item)}>
                                                            <Eye size={13} />
                                                            View Tests
                                                        </ViewTestsBtn>
                                                    </TestCellWrapper>
                                                ) : (
                                                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>-</span>
                                                )}
                                            </Td>
                                            <Td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Total: <Amount style={{ color: '#0f172a' }}>{formatCurrency(item.total_amount)}</Amount></div>
                                                </div>
                                            </Td>
                                            <Td>
                                                <Badge
                                                    bg={
                                                        item.status === "Billed"
                                                            ? "#dcfce7"
                                                            : item.status === "Registered"
                                                            ? "#e0e7ff"
                                                            : "#fee2e2"
                                                    }
                                                    color={
                                                        item.status === "Billed"
                                                            ? "#166534"
                                                            : item.status === "Registered"
                                                            ? "#3730a3"
                                                            : "#991b1b"
                                                    }
                                                    border={
                                                        item.status === "Billed"
                                                            ? "#bbf7d0"
                                                            : item.status === "Registered"
                                                            ? "#c7d2fe"
                                                            : "#fecaca"
                                                    }
                                                >
                                                    {item.status}
                                                </Badge>
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
                            <Home size={48} color="#94a3b8" />
                        </EmptyIcon>
                        <h3 style={{ margin: '0', color: '#334155', fontWeight: 700 }}>No Home Collection Records Found</h3>
                        <p style={{ margin: '0', fontSize: '0.95rem' }}>Try adjusting the date range filters.</p>
                    </NoDatacontainer>
                )}
            </TableCard>

            {/* View Tests Modal */}
            {selectedModalItem && (
                <ModalOverlay onClick={(e) => e.target === e.currentTarget && setSelectedModalItem(null)}>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitleGroup>
                                <ModalIcon>
                                    <FlaskConical size={20} />
                                </ModalIcon>
                                <div>
                                    <ModalTitle>Ordered Tests</ModalTitle>
                                    <ModalSubtitle>
                                        {selectedModalItem.patient_name} • Bill #{selectedModalItem.bill_no}
                                    </ModalSubtitle>
                                </div>
                            </ModalTitleGroup>
                            <ModalCloseBtn onClick={() => setSelectedModalItem(null)}>
                                <X size={20} />
                            </ModalCloseBtn>
                        </ModalHeader>
                        <ModalBody>
                            {selectedModalItem.tests && selectedModalItem.tests.length > 0 ? (
                                selectedModalItem.tests.map((test, idx) => {
                                    const tname = typeof test === "object" ? (test.test_name || test.testname || "") : String(test);
                                    const tamount = typeof test === "object" ? test.amount : null;
                                    return (
                                        <TestCard key={idx}>
                                            <TestInfo>
                                                <TestNumberBadge>#{idx + 1}</TestNumberBadge>
                                                <TestNameText>{tname || "Unnamed Test"}</TestNameText>
                                            </TestInfo>
                                            {tamount !== null && tamount !== undefined && Number(tamount) > 0 && (
                                                <TestAmountText>{formatCurrency(tamount)}</TestAmountText>
                                            )}
                                        </TestCard>
                                    );
                                })
                            ) : (
                                <div style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>
                                    No tests recorded for this bill.
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                                Total: <strong style={{ color: "#0f172a" }}>{selectedModalItem.tests?.length || 0} Tests</strong>
                            </div>
                            <PrimaryButton
                                style={{ height: "36px", padding: "8px 18px", fontSize: "0.84rem" }}
                                onClick={() => setSelectedModalItem(null)}
                            >
                                Close
                            </PrimaryButton>
                        </ModalFooter>
                    </ModalContent>
                </ModalOverlay>
            )}
        </PageContainer>
    );
};

export default HomeCollectionReport;
