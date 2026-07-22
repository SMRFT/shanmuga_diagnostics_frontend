import React, { useState, useEffect } from "react";
import styled from "styled-components";
import apiRequest from "../Auth/apiRequest";
import {
  Search, RefreshCw, Download, DollarSign, FileText, Building2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

/* ═══════════════════════════════════════════════
   DESIGN SYSTEM — viewport-locked, no page scroll
═══════════════════════════════════════════════ */
const Shell = styled.div`
  height: calc(100vh - 75px);
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);
  font-family: 'Inter', 'Segoe UI', sans-serif;
  overflow: hidden;
  box-sizing: border-box;
  padding: 1.25rem;
  gap: 1rem;
  border-radius: 24px;

  @media (max-width: 768px) { padding: 0.75rem; gap: 0.75rem; border-radius: 12px; }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;

  @media (max-width: 768px) { flex-direction: column; gap: 0.5rem; align-items: flex-start; }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Title = styled.h1`
  font-size: 1.35rem;
  color: #1e293b;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.4px;
  @media (max-width: 768px) { font-size: 1.1rem; }
`;

const Badge = styled.span`
  background: rgba(167, 119, 227, 0.08);
  color: #a777e3;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  border: 1px solid rgba(167, 119, 227, 0.2);
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    padding-bottom: 6px;
    &::-webkit-scrollbar { height: 4px; }
    &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 1rem 1.25rem;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid ${p => p.accent || "#a777e3"};
  transition: transform 0.15s;
  &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }

  @media (max-width: 768px) {
    flex: 0 0 200px;
  }
`;

const StatIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: ${p => p.bg || "rgba(167, 119, 227, 0.08)"};
  color: ${p => p.color || "#a777e3"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const StatValue = styled.div`
  font-size: 1.35rem;
  color: #1e293b;
  font-weight: 700;
  margin-top: 2px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: white;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  overflow: hidden;
`;

const FilterBar = styled.div`
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: flex-end;
  flex-shrink: 0;
  background: #fafbfd;

  @media (max-width: 768px) { flex-direction: column; align-items: stretch; }
`;

const FGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: ${p => p.grow || "0 1 auto"};
  min-width: ${p => p.minW || "150px"};
`;

const FLabel = styled.label`
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FInput = styled.input`
  padding: 0.55rem 0.75rem;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  font-size: 0.85rem;
  color: #1e293b;
  outline: none;
  transition: all 0.15s;
  background: white;

  &:focus {
    border-color: #a777e3;
    box-shadow: 0 0 0 3px rgba(167, 119, 227, 0.1);
  }
`;

const IconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: ${p => p.pad || "0.55rem 0.85rem"};
  border-radius: 14px;
  border: none;
  background: ${p => p.bg || "#f1f5f9"};
  color: ${p => p.color || "#475569"};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover { filter: brightness(0.94); transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;

const TableWrap = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 0;

  &::-webkit-scrollbar { width: 5px; height: 5px; }
  &::-webkit-scrollbar-track { background: #f8fafc; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
`;

const Thead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 2;
  background: #f8fafc;

  th {
    text-align: left;
    padding: 0.75rem 1.25rem;
    font-size: 0.72rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #e2e8f0;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
    transition: color 0.15s;

    &:hover { color: #a777e3; }
  }
`;

const Tr = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.12s;

  &:hover { background-color: #f8faff; }

  td {
    padding: 0.7rem 1.25rem;
    color: #334155;
    font-size: 0.88rem;
    vertical-align: middle;
  }
`;

const TfootRow = styled.tr`
  background: #f8fafc;
  border-top: 2px solid #e2e8f0;

  td {
    padding: 0.75rem 1.25rem;
    font-weight: 700;
    color: #1e293b;
    font-size: 0.88rem;
  }
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
`;

/* ── Pagination ── */
const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1.25rem;
  border-top: 1px solid #f1f5f9;
  background: #fafbfd;
  flex-shrink: 0;
  font-size: 0.8rem;
  color: #64748b;

  @media (max-width: 768px) { flex-direction: column; gap: 0.5rem; }
`;

const PageControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const PageBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 12px;
  border: 1px solid ${p => p.active ? "#a777e3" : "#e2e8f0"};
  background: ${p => p.active ? "#a777e3" : "white"};
  color: ${p => p.active ? "white" : "#475569"};
  font-size: 0.78rem;
  font-weight: ${p => p.active ? "700" : "500"};
  cursor: pointer;
  transition: all 0.12s;

  &:hover:not(:disabled) { border-color: #a777e3; color: ${p => p.active ? "white" : "#a777e3"}; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
const ClinicalLedgerBalance = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [loading, setLoading] = useState(false);

  const currentDate = new Date();

  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" });

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const fmt = (d) => {
    const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const url = `${Labbaseurl}clinical_hospital_ledger/?lab_id=${localStorage.getItem('employee_id') || localStorage.getItem('employeeId')}&from_date=${fmt(startDate)}&to_date=${fmt(endDate)}`;
      const response = await apiRequest(url, "GET");
      let fetched = [];
      if (response.success) {
        fetched = response.data?.data || response.data || [];
      } else {
        toast.error(response.error || "Failed to fetch ledger data");
      }
      setData(fetched);

      // Apply client-side search query
      let result = fetched;
      if (searchQuery.trim()) {
        const lower = searchQuery.toLowerCase();
        result = result.filter(i =>
          (i.bill_no || "").toLowerCase().includes(lower) ||
          (i.patient_name || "").toLowerCase().includes(lower)
        );
      }
      setFilteredData(result);
    } catch {
      toast.error("Failed to load ledger data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilter();
  }, []);

  const clearFilters = async () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
    setSearchQuery("");

    setLoading(true);
    try {
      const url = `${Labbaseurl}clinical_hospital_ledger/?lab_id=${localStorage.getItem('employee_id') || localStorage.getItem('employeeId')}&from_date=${fmt(today)}&to_date=${fmt(today)}`;
      const response = await apiRequest(url, "GET");
      let fetched = [];
      if (response.success) {
        fetched = response.data?.data || response.data || [];
      }
      setData(fetched);
      setFilteredData(fetched);
    } catch {
      toast.error("Failed to clear filters");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" }));
  const arrow = (key) => sortConfig.key === key ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : "";

  const sorted = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalAmount = filteredData.reduce((s, i) => s + (i.total_amount || 0), 0);
  const totalNet = filteredData.reduce((s, i) => s + (i.net_amount || 0), 0);
  const totalDiscount = filteredData.reduce((s, i) => s + (i.discount || 0), 0);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const currentItems = sorted.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [filteredData]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData.map(i => ({
      Date: i.date, "Bill No": i.bill_no, "Patient Name": i.patient_name,
      "Total Amount": i.total_amount, Discount: i.discount, "Net Amount": i.net_amount,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clinical Ledger");
    XLSX.writeFile(wb, "Clinical_Ledger.xlsx");
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, safeCurrentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <Shell>
      <TopBar>
        <TitleGroup>
          <Building2 size={22} color="#a777e3" />
          <Title>Ledger Balance</Title>
        </TitleGroup>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <IconBtn bg="#a777e3" color="#f1f5f9" onClick={handleFilter} title="Refresh">
            <RefreshCw size={16} />
          </IconBtn>
          <IconBtn bg="#a777e3" color="white" onClick={exportToExcel}>
            <Download size={16} /> Export
          </IconBtn>
        </div>
      </TopBar>

      {/* Stats */}
      <StatsRow>
        <StatCard accent="#4361ee">
          <StatIcon bg="rgba(67,97,238,0.08)" color="#4361ee"><DollarSign size={20} /></StatIcon>
          <StatInfo>
            <StatLabel>Total Amount</StatLabel>
            <StatValue>₹{totalAmount.toLocaleString()}</StatValue>
          </StatInfo>
        </StatCard>
        <StatCard accent="#10b981">
          <StatIcon bg="rgba(16,185,129,0.08)" color="#10b981"><FileText size={20} /></StatIcon>
          <StatInfo>
            <StatLabel>Net Amount</StatLabel>
            <StatValue>₹{totalNet.toLocaleString()}</StatValue>
          </StatInfo>
        </StatCard>
        <StatCard accent="#f59e0b">
          <StatIcon bg="rgba(245,158,11,0.08)" color="#f59e0b"><DollarSign size={20} /></StatIcon>
          <StatInfo>
            <StatLabel>Discount</StatLabel>
            <StatValue>₹{totalDiscount.toLocaleString()}</StatValue>
          </StatInfo>
        </StatCard>
      </StatsRow>

      {/* Main Card */}
      <Card>
        <FilterBar>
          <FGroup minW="140px">
            <FLabel>From</FLabel>
            <FInput type="date" value={fmt(startDate)} onChange={e => setStartDate(new Date(e.target.value))} />
          </FGroup>
          <FGroup minW="140px">
            <FLabel>To</FLabel>
            <FInput type="date" value={fmt(endDate)} onChange={e => setEndDate(new Date(e.target.value))} />
          </FGroup>
          <FGroup grow="1" minW="200px">
            <FLabel>Search</FLabel>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <FInput type="text" placeholder="Bill No or Patient Name..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: "2.2rem", width: "100%", boxSizing: "border-box" }} />
            </div>
          </FGroup>
          <IconBtn bg="#a777e3" color="white" onClick={handleFilter} title="Filter">Filter</IconBtn>
          <IconBtn bg="#f1f5f9" color="#475569" onClick={clearFilters} title="Clear">Clear</IconBtn>
        </FilterBar>

        <TableWrap>
          <StyledTable>
            <Thead>
              <tr>
                <th onClick={() => handleSort("date")}>Date{arrow("date")}</th>
                <th onClick={() => handleSort("bill_no")}>Bill No{arrow("bill_no")}</th>
                <th onClick={() => handleSort("patient_name")}>Patient{arrow("patient_name")}</th>
                <th onClick={() => handleSort("total_amount")}>Total{arrow("total_amount")}</th>
                <th onClick={() => handleSort("discount")}>Discount{arrow("discount")}</th>
                <th onClick={() => handleSort("net_amount")}>Net{arrow("net_amount")}</th>
              </tr>
            </Thead>
            <tbody>
              {loading ? (
                <Tr><td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "#94a3b8" }}>Loading...</td></Tr>
              ) : currentItems.length > 0 ? currentItems.map((item, i) => (
                <Tr key={item.id || i}>
                  <td>{item.date}</td>
                  <td style={{ fontWeight: 600 }}>{item.bill_no}</td>
                  <td>{item.patient_name}</td>
                  <td>₹{item.total_amount?.toLocaleString()}</td>
                  <td style={{ color: item.discount > 0 ? "#f59e0b" : "inherit" }}>
                    {item.discount > 0 ? `₹${item.discount.toLocaleString()}` : "-"}
                  </td>
                  <td style={{ fontWeight: 600, color: "#10b981" }}>₹{item.net_amount?.toLocaleString()}</td>
                </Tr>
              )) : (
                <Tr><td colSpan={6}>
                  <EmptyState>
                    <Building2 size={36} style={{ marginBottom: "0.75rem", opacity: 0.25 }} />
                    <div>No records found for the selected date range.</div>
                  </EmptyState>
                </td></Tr>
              )}
            </tbody>
            {filteredData.length > 0 && (
              <tfoot>
                <TfootRow>
                  <td colSpan={3} style={{ textAlign: "right", color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Grand Total</td>
                  <td>₹{totalAmount.toLocaleString()}</td>
                  <td style={{ color: "#f59e0b" }}>₹{totalDiscount.toLocaleString()}</td>
                  <td style={{ color: "#10b981" }}>₹{totalNet.toLocaleString()}</td>
                </TfootRow>
              </tfoot>
            )}
          </StyledTable>
        </TableWrap>

        {/* Pagination */}
        <PaginationBar>
          <span>Showing {(safeCurrentPage - 1) * itemsPerPage + 1}–{Math.min(safeCurrentPage * itemsPerPage, filteredData.length)} of {filteredData.length}</span>
          <PageControls>
            <PageBtn disabled={safeCurrentPage === 1} onClick={() => setCurrentPage(1)}><ChevronsLeft size={14} /></PageBtn>
            <PageBtn disabled={safeCurrentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={14} /></PageBtn>
            {getPageNumbers().map(n => (
              <PageBtn key={n} active={n === safeCurrentPage} onClick={() => setCurrentPage(n)}>{n}</PageBtn>
            ))}
            <PageBtn disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={14} /></PageBtn>
            <PageBtn disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage(totalPages)}><ChevronsRight size={14} /></PageBtn>
          </PageControls>
        </PaginationBar>
      </Card>
    </Shell>
  );
};

export default ClinicalLedgerBalance;
