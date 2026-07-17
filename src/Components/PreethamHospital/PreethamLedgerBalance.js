import React, { useState, useEffect } from "react";
import styled from "styled-components";
import apiRequest from "../Auth/apiRequest";
import {
    Search,
    RefreshCw,
    Download,
    DollarSign,
    CreditCard,
    FileText,
    Building2
} from "lucide-react";
import { toast } from "react-toastify";
import { exportToExcel as exportExcelFile } from "../../utils/xlsxUtils";

// --- Styled Components ---

const PageWrapper = styled.div`
  background-color: #f4f7fe;
  min-height: 100vh;
  padding: 2rem;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  color: #1b2559;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const HospitalBadge = styled.span`
  background: rgba(67, 24, 255, 0.08);
  color: #4318FF;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  border: 1px solid rgba(67, 24, 255, 0.2);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  border-left: 5px solid ${(props) => props.color || "#4318FF"};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.06);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatTitle = styled.span`
  color: #a3aed0;
  font-size: 0.875rem;
  font-weight: 500;
`;

const IconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.bg || "#f4f7fe"};
  color: ${(props) => props.color || "#4318FF"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.h2`
  color: #1b2559;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
`;

const StatCount = styled.p`
  color: #a3aed0;
  font-size: 0.8rem;
  margin: 0.25rem 0 0 0;
`;

const MainCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03);
  overflow: hidden;
`;

const FilterBar = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 180px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #2b3674;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid #e0e5f2;
  font-size: 0.9rem;
  color: #1b2559;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #4318FF;
    box-shadow: 0 0 0 2px rgba(67, 24, 255, 0.1);
  }
`;

const ActionButton = styled.button`
  background-color: ${(props) => props.bg || "#f4f7fe"};
  color: ${(props) => props.color || "#4318FF"};
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;

  &:hover {
    filter: brightness(0.95);
    transform: translateY(-1px);
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const Thead = styled.thead`
  background-color: #f9fafc;

  th {
    text-align: left;
    padding: 1rem 1.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #a3aed0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e0e5f2;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      color: #4318FF;
    }
  }
`;

const Tr = styled.tr`
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  td {
    padding: 1.25rem 1.5rem;
    color: #1b2559;
    font-size: 0.95rem;
    vertical-align: middle;
  }
`;

const TfootRow = styled.tr`
  background-color: #f4f7fe;
  border-top: 2px solid #e0e5f2;

  td {
    padding: 1rem 1.5rem;
    font-weight: 700;
    color: #1b2559;
    font-size: 0.95rem;
  }
`;

const EmptyState = styled.div`
  padding: 4rem;
  text-align: center;
  color: #a3aed0;
`;

const RecordCount = styled.span`
  font-size: 0.85rem;
  color: #a3aed0;
  padding: 0.5rem 1.5rem 1rem;
  display: block;
`;

const PreethamHospitalLedger = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Default to the first day of the current month
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(currentDate);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" });

    const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const from = formatDate(startDate);
            const to = formatDate(endDate);
            const url = `${Labbaseurl}preetham_hospital_ledger/?from_date=${from}&to_date=${to}`;

            const response = await apiRequest(url, "GET");

            if (response.success) {
                const resultData = response.data?.data || response.data || [];
                setData(Array.isArray(resultData) ? resultData : []);
            } else {
                setData([]);
                toast.error(response.error || "Failed to fetch ledger data");
            }
        } catch (error) {
            console.error("Error fetching Preetham Hospital ledger:", error);
            toast.error("Failed to load ledger data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    const sortIcon = (key) =>
        sortConfig.key === key ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : "";

    const sortedData = [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    const filteredData = sortedData.filter(
        (item) =>
            (item.bill_no || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.patient_name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Totals
    const totalAmount = filteredData.reduce((sum, item) => sum + (item.total_amount || 0), 0);
    const totalNet = filteredData.reduce((sum, item) => sum + (item.net_amount || 0), 0);
    const totalDiscount = filteredData.reduce((sum, item) => sum + (item.discount || 0), 0);

    const exportToExcel = () => {
        exportExcelFile(
            filteredData.map((item) => ({
                Date: item.date,
                "Bill No": item.bill_no,
                "Patient Name": item.patient_name,
                "B2B Name": item.b2b_name,
                "Total Amount": item.total_amount,
                Discount: item.discount,
                "Net Amount": item.net_amount,
            })),
            "Preetham_Hospital_Ledger.xlsx",
            { sheetName: "Preetham Hospital" },
        );
    };

    return (
        <PageWrapper>
            <Container>
                {/* Header */}
                <HeaderSection>
                    <PageTitle>
                        <Building2 size={28} color="#4318FF" />
                        Ledger Balance
                        <HospitalBadge>PREETHAM HOSPITAL</HospitalBadge>
                    </PageTitle>
                    <ActionButton bg="#4318FF" color="white" onClick={exportToExcel}>
                        <Download size={18} /> Export Excel
                    </ActionButton>
                </HeaderSection>

                {/* Stats */}
                <StatsGrid>
                    <StatCard color="#4318FF">
                        <StatHeader>
                            <StatTitle>Total Amount</StatTitle>
                            <IconBox bg="rgba(67, 24, 255, 0.1)" color="#4318FF">
                                <DollarSign size={20} />
                            </IconBox>
                        </StatHeader>
                        <StatValue>₹ {totalAmount.toLocaleString()}</StatValue>
                        <StatCount>{filteredData.length} bills</StatCount>
                    </StatCard>

                    <StatCard color="#05cd99">
                        <StatHeader>
                            <StatTitle>Net Amount</StatTitle>
                            <IconBox bg="rgba(5, 205, 153, 0.1)" color="#05cd99">
                                <FileText size={20} />
                            </IconBox>
                        </StatHeader>
                        <StatValue>₹ {totalNet.toLocaleString()}</StatValue>
                    </StatCard>

                    <StatCard color="#FFB547">
                        <StatHeader>
                            <StatTitle>Total Discount</StatTitle>
                            <IconBox bg="rgba(255, 181, 71, 0.1)" color="#FFB547">
                                <DollarSign size={20} />
                            </IconBox>
                        </StatHeader>
                        <StatValue>₹ {totalDiscount.toLocaleString()}</StatValue>
                    </StatCard>
                </StatsGrid>

                {/* Main Table Card */}
                <MainCard>
                    <FilterBar>
                        <FilterGroup>
                            <Label>From Date</Label>
                            <Input
                                type="date"
                                value={formatDate(startDate)}
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                            />
                        </FilterGroup>

                        <FilterGroup>
                            <Label>To Date</Label>
                            <Input
                                type="date"
                                value={formatDate(endDate)}
                                onChange={(e) => setEndDate(new Date(e.target.value))}
                            />
                        </FilterGroup>

                        <FilterGroup style={{ flex: 2 }}>
                            <Label>Search</Label>
                            <div style={{ position: "relative" }}>
                                <Search
                                    size={18}
                                    style={{
                                        position: "absolute", left: "12px",
                                        top: "50%", transform: "translateY(-50%)",
                                        color: "#a3aed0",
                                    }}
                                />
                                <Input
                                    type="text"
                                    placeholder="Search Bill No or Patient Name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ paddingLeft: "2.5rem", width: "100%", boxSizing: "border-box" }}
                                />
                            </div>
                        </FilterGroup>

                        <ActionButton onClick={fetchData} title="Refresh">
                            <RefreshCw size={20} />
                        </ActionButton>
                    </FilterBar>

                    <RecordCount>Showing {filteredData.length} record(s)</RecordCount>

                    <TableContainer>
                        <StyledTable>
                            <Thead>
                                <tr>
                                    <th onClick={() => handleSort("date")}>Date{sortIcon("date")}</th>
                                    <th onClick={() => handleSort("bill_no")}>Bill No{sortIcon("bill_no")}</th>
                                    <th onClick={() => handleSort("patient_name")}>Patient Name{sortIcon("patient_name")}</th>
                                    <th onClick={() => handleSort("total_amount")}>Total Amount{sortIcon("total_amount")}</th>
                                    <th onClick={() => handleSort("discount")}>Discount{sortIcon("discount")}</th>
                                    <th onClick={() => handleSort("net_amount")}>Net Amount{sortIcon("net_amount")}</th>
                                </tr>
                            </Thead>
                            <tbody>
                                {loading ? (
                                    <Tr>
                                        <td colSpan={6} style={{ textAlign: "center", padding: "3rem" }}>
                                            Loading data...
                                        </td>
                                    </Tr>
                                ) : filteredData.length > 0 ? (
                                    <>
                                        {filteredData.map((item, index) => (
                                            <Tr key={item.id || index}>
                                                <td>{item.date}</td>
                                                <td style={{ fontWeight: 600 }}>{item.bill_no}</td>
                                                <td>{item.patient_name}</td>
                                                <td>₹ {item.total_amount?.toLocaleString()}</td>
                                                <td style={{ color: item.discount > 0 ? "#FFB547" : "inherit" }}>
                                                    {item.discount > 0 ? `₹ ${item.discount.toLocaleString()}` : "-"}
                                                </td>
                                                <td style={{ fontWeight: 600, color: "#05cd99" }}>
                                                    ₹ {item.net_amount?.toLocaleString()}
                                                </td>
                                            </Tr>
                                        ))}
                                    </>
                                ) : (
                                    <Tr>
                                        <td colSpan={6}>
                                            <EmptyState>
                                                <Building2 size={48} style={{ marginBottom: "1rem", opacity: 0.3 }} />
                                                <p>No records found for PREETHAM HOSPITAL in the selected date range.</p>
                                            </EmptyState>
                                        </td>
                                    </Tr>
                                )}
                            </tbody>
                            {filteredData.length > 0 && (
                                <tfoot>
                                    <TfootRow>
                                        <td colSpan={3} style={{ textAlign: "right", color: "#a3aed0" }}>
                                            GRAND TOTAL
                                        </td>
                                        <td>₹ {totalAmount.toLocaleString()}</td>
                                        <td style={{ color: "#FFB547" }}>
                                            ₹ {totalDiscount.toLocaleString()}
                                        </td>
                                        <td style={{ color: "#05cd99" }}>
                                            ₹ {totalNet.toLocaleString()}
                                        </td>
                                    </TfootRow>
                                </tfoot>
                            )}
                        </StyledTable>
                    </TableContainer>
                </MainCard>
            </Container>
        </PageWrapper>
    );
};

export default PreethamHospitalLedger;