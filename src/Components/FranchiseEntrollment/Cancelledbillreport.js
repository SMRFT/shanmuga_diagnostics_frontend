import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import apiRequest from "../Auth/apiRequest";

// Styled Components matching Shanmuga Diagnostics Theme
const PageContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.04), rgba(102, 126, 234, 0.04));
  padding: 2rem;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const HeaderCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const TitleSection = styled.div`
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
    font-size: 1.02rem;
    margin: 0;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  border: ${props => props.$variant === 'secondary' ? '1px solid #cbd5e1' : 'none'};
  background: ${props => props.$variant === 'secondary' ? '#ffffff' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: ${props => props.$variant === 'secondary' ? '#4a5568' : '#ffffff'};
  box-shadow: ${props => props.$variant === 'secondary' ? '0 2px 8px rgba(0,0,0,0.04)' : '0 4px 14px rgba(102, 126, 234, 0.3)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$variant === 'secondary' ? '0 4px 12px rgba(0,0,0,0.08)' : '0 6px 18px rgba(102, 126, 234, 0.4)'};
  }
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
`;

const KpiCard = styled.div`
  background: #ffffff;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(225, 232, 255, 0.8);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
  }
`;

const KpiLabel = styled.div`
  color: #718096;
  font-size: 0.8rem;
  margin-bottom: 0.35rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const KpiValue = styled.div`
  font-size: 1.85rem;
  font-weight: 700;
  color: ${props => props.$color || "#667eea"};
  line-height: 1.2;
  margin-bottom: 0.35rem;
`;

const KpiSubtext = styled.div`
  font-size: 0.76rem;
  color: #a0aec0;
`;

const FilterCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(225, 232, 255, 0.8);
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  align-items: end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FilterLabel = styled.label`
  font-size: 0.82rem;
  font-weight: 600;
  color: #4c51bf;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const Input = styled.input`
  padding: 10px 14px;
  border-radius: 12px;
  border: 1.5px solid #e1e8ff;
  font-size: 0.88rem;
  color: #2d3748;
  background: #ffffff;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const Select = styled.select`
  padding: 10px 14px;
  border-radius: 12px;
  border: 1.5px solid #e1e8ff;
  font-size: 0.88rem;
  color: #2d3748;
  background: #ffffff;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const DatePresets = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 1.25rem;
  flex-wrap: wrap;
`;

const PresetBtn = styled.button`
  padding: 0.45rem 1rem;
  border-radius: 20px;
  border: 1px solid ${props => props.$active ? "#667eea" : "#e2e8f0"};
  background: ${props => props.$active ? "linear-gradient(135deg, #667eea, #764ba2)" : "#ffffff"};
  color: ${props => props.$active ? "#ffffff" : "#4a5568"};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #667eea;
    color: ${props => props.$active ? "#ffffff" : "#667eea"};
  }
`;

const TableCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid rgba(225, 232, 255, 0.8);
`;

const TableHeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid rgba(225, 232, 255, 0.8);
  flex-wrap: wrap;
  gap: 12px;
`;

const RecordCount = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #718096;
  span {
    color: #4c51bf;
    font-weight: 700;
  }
`;

const SearchInput = styled.input`
  padding: 0.55rem 1.2rem;
  border: 1.5px solid #e1e8ff;
  border-radius: 20px;
  font-size: 0.85rem;
  min-width: 280px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
  font-size: 0.88rem;
`;

const Thead = styled.thead`
  background: linear-gradient(135deg, #f093fb 0%, #667eea 100%);
`;

const Th = styled.th`
  padding: 1rem 1.2rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #ffffff;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 1rem 1.2rem;
  border-bottom: 1px solid rgba(225, 232, 255, 0.6);
  color: #2d3748;
  vertical-align: middle;
`;

const Tr = styled.tr`
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f8fafc;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;

  ${props => {
    const s = (props.$status || '').toLowerCase();
    if (s.includes('approved')) {
      return `background: #e6fffa; color: #234e52; border: 1px solid #b2f5ea;`;
    }
    if (s.includes('reject')) {
      return `background: #fff5f5; color: #742a2a; border: 1px solid #fed7d7;`;
    }
    return `background: #fffaf0; color: #7b341e; border: 1px solid #feebc8;`;
  }}
`;

const ViewBtn = styled.button`
  padding: 0.4rem 0.9rem;
  border-radius: 16px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 50px 20px;
  color: #718096;
  font-size: 1rem;
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: 50px 20px;
  color: #a0aec0;
  font-size: 0.95rem;
`;

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  max-width: 620px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 1px solid rgba(225, 232, 255, 0.8);
  animation: popIn 0.2s ease-out;

  @keyframes popIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #f093fb 0%, #667eea 100%);
  color: white;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalClose = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.4rem;
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.2s;
  &:hover { opacity: 1; }
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.88rem;

  strong {
    color: #4c51bf;
  }
  span {
    color: #2d3748;
    font-weight: 500;
  }
`;

const Cancelledbillreport = () => {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL || "/_b_a_c_k_e_n_d/LIS/";

  // State
  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({
    total_records: 0,
    total_approved: 0,
    total_rejected: 0,
    total_pending: 0,
    total_cancelled_amount: 0
  });
  const [loading, setLoading] = useState(false);

  // Filters
  const todayStr = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [franchiseId, setFranchiseId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activePreset, setActivePreset] = useState("all");

  // Modal State
  const [selectedRow, setSelectedRow] = useState(null);

  // Fetch Report Data
  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);
      if (franchiseId) params.append("franchise_id", franchiseId);
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);

      const url = `${Labbaseurl}cancelled-bill-report/?${params.toString()}`;
      const res = await apiRequest(url, "GET");

      if (res.success && res.data) {
        setReportData(res.data.report || []);
        setSummary(res.data.summary || {
          total_records: 0,
          total_approved: 0,
          total_rejected: 0,
          total_pending: 0,
          total_cancelled_amount: 0
        });
      } else {
        toast.error(res.error || "Failed to load cancelled bill report");
      }
    } catch (err) {
      console.error("Error fetching report:", err);
      toast.error("Error fetching cancelled bill report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [fromDate, toDate, franchiseId, statusFilter]);

  // Date Preset Handlers
  const handlePreset = (preset) => {
    setActivePreset(preset);
    const now = new Date();

    if (preset === "today") {
      setFromDate(todayStr);
      setToDate(todayStr);
    } else if (preset === "yesterday") {
      const yest = new Date(now);
      yest.setDate(yest.getDate() - 1);
      const yestStr = yest.toISOString().split("T")[0];
      setFromDate(yestStr);
      setToDate(yestStr);
    } else if (preset === "last7") {
      const past = new Date(now);
      past.setDate(past.getDate() - 7);
      setFromDate(past.toISOString().split("T")[0]);
      setToDate(todayStr);
    } else if (preset === "thisMonth") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
      setFromDate(firstDay);
      setToDate(todayStr);
    } else {
      // All time
      setFromDate("");
      setToDate("");
    }
  };

  // Filtered Rows for Search Term
  const filteredRows = useMemo(() => {
    if (!searchTerm) return reportData;
    const term = searchTerm.toLowerCase();
    return reportData.filter(r =>
      (r.patient_id || "").toLowerCase().includes(term) ||
      (r.patient_name || "").toLowerCase().includes(term) ||
      (r.barcode || "").toLowerCase().includes(term) ||
      (r.franchise_id || "").toLowerCase().includes(term) ||
      (r.franchise_name || "").toLowerCase().includes(term) ||
      (r.test_name || "").toLowerCase().includes(term) ||
      (r.referredDoctor || "").toLowerCase().includes(term) ||
      (r.approved_by || "").toLowerCase().includes(term) ||
      (r.status || "").toLowerCase().includes(term)
    );
  }, [reportData, searchTerm]);

  // Format Timestamps
  const formatDateTime = (val) => {
    if (!val) return "—";
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return val;
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
    } catch {
      return val;
    }
  };

  // CSV Export
  const exportToCSV = () => {
    if (!filteredRows.length) {
      toast.info("No records to export");
      return;
    }

    const headers = [
      "S.No",
      "Patient ID",
      "Patient Name",
      "Barcode",
      "Franchise ID",
      "Franchise Name",
      "Doctor",
      "Registration Date",
      "Test ID",
      "Test Name",
      "MRP (INR)",
      "Status",
      "Requested Date",
      "Requested By",
      "Approved Date",
      "Approved By",
      "Rejected Date",
      "Rejected By"
    ];

    const rows = filteredRows.map((r, i) => [
      i + 1,
      r.patient_id,
      `"${r.patient_name || ''}"`,
      r.barcode,
      r.franchise_id,
      `"${r.franchise_name || ''}"`,
      `"${r.referredDoctor || ''}"`,
      `"${r.registrationDate || ''}"`,
      r.test_id,
      `"${r.test_name || ''}"`,
      r.MRP,
      r.status,
      `"${r.requested_date || ''}"`,
      r.requested_by,
      `"${r.approved_date || ''}"`,
      r.approved_by,
      `"${r.rejected_date || ''}"`,
      r.rejected_by
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Cancelled_Bill_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Report exported to CSV successfully!");
  };

  return (
    <PageContainer>
      {/* Header */}
      <HeaderCard>
        <TitleSection>
          <h1>Cancelled Bill Report</h1>
          <p>Complete historical log of cancellation requests, approvals, refunds & audit trail</p>
        </TitleSection>
        <HeaderActions>
          <ActionBtn onClick={exportToCSV}>
            📥 Export CSV
          </ActionBtn>
          <ActionBtn $variant="secondary" onClick={fetchReport}>
            🔄 Refresh
          </ActionBtn>
        </HeaderActions>
      </HeaderCard>

      {/* KPI Cards */}
      <KpiGrid>
        <KpiCard $accent="#3b82f6">
          <KpiLabel>Total Requests</KpiLabel>
          <KpiValue>{summary.total_records}</KpiValue>
          <KpiSubtext>All filtered cancellations</KpiSubtext>
        </KpiCard>
        <KpiCard $accent="#10b981">
          <KpiLabel>Cancel Approved</KpiLabel>
          <KpiValue $color="#059669">{summary.total_approved}</KpiValue>
          <KpiSubtext>Refunds / Adjustments processed</KpiSubtext>
        </KpiCard>
        <KpiCard $accent="#f59e0b">
          <KpiLabel>Pending Requests</KpiLabel>
          <KpiValue $color="#d97706">{summary.total_pending}</KpiValue>
          <KpiSubtext>Awaiting lab approval</KpiSubtext>
        </KpiCard>
        <KpiCard $accent="#ef4444">
          <KpiLabel>Rejected</KpiLabel>
          <KpiValue $color="#dc2626">{summary.total_rejected}</KpiValue>
          <KpiSubtext>Requests turned down</KpiSubtext>
        </KpiCard>
        <KpiCard $accent="#8b5cf6">
          <KpiLabel>Total Cancelled Amount</KpiLabel>
          <KpiValue $color="#7c3aed">₹{summary.total_cancelled_amount.toLocaleString('en-IN')}</KpiValue>
          <KpiSubtext>Total MRP of approved cancellations</KpiSubtext>
        </KpiCard>
      </KpiGrid>

      {/* Filter Card */}
      <FilterCard>
        <FilterGrid>
          <FilterGroup>
            <FilterLabel>From Date</FilterLabel>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); setActivePreset("custom"); }}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>To Date</FilterLabel>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => { setToDate(e.target.value); setActivePreset("custom"); }}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Franchise ID / Name</FilterLabel>
            <Input
              type="text"
              placeholder="e.g. SHF004"
              value={franchiseId}
              onChange={(e) => setFranchiseId(e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Cancellation Status</FilterLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="Cancel Approved">Cancel Approved</option>
              <option value="Cancel Requested">Cancel Requested (Pending)</option>
              <option value="Rejected">Rejected</option>
            </Select>
          </FilterGroup>
        </FilterGrid>

        {/* Date Presets */}
        <DatePresets>
          <PresetBtn $active={activePreset === 'all'} onClick={() => handlePreset('all')}>All Time</PresetBtn>
          <PresetBtn $active={activePreset === 'today'} onClick={() => handlePreset('today')}>Today</PresetBtn>
          <PresetBtn $active={activePreset === 'yesterday'} onClick={() => handlePreset('yesterday')}>Yesterday</PresetBtn>
          <PresetBtn $active={activePreset === 'last7'} onClick={() => handlePreset('last7')}>Last 7 Days</PresetBtn>
          <PresetBtn $active={activePreset === 'thisMonth'} onClick={() => handlePreset('thisMonth')}>This Month</PresetBtn>
        </DatePresets>
      </FilterCard>

      {/* Report Table Card */}
      <TableCard>
        <TableHeaderSection>
          <RecordCount>
            Showing <span>{filteredRows.length}</span> of <span>{reportData.length}</span> Records
          </RecordCount>
          <SearchInput
            type="text"
            placeholder="🔍 Search Patient, Barcode, Doctor, Franchise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </TableHeaderSection>

        {loading ? (
          <LoadingContainer>Loading cancelled bills data...</LoadingContainer>
        ) : filteredRows.length === 0 ? (
          <EmptyContainer>No cancelled bill records found for the selected criteria.</EmptyContainer>
        ) : (
          <TableScroll>
            <Table>
              <thead>
                <tr>
                  <Th>#</Th>
                  <Th>Patient Details</Th>
                  <Th>Barcode</Th>
                  <Th>Franchise Details</Th>
                  <Th>Doctor</Th>
                  <Th>Test Name</Th>
                  <Th>MRP (₹)</Th>
                  <Th>Status</Th>
                  <Th>Requested Date & By</Th>
                  <Th>Approval / Action Details</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, idx) => (
                  <Tr key={idx}>
                    <Td style={{ fontWeight: 600, color: "#64748b" }}>{idx + 1}</Td>
                    <Td>
                      <div style={{ fontWeight: 700, color: "#1e3c72" }}>{row.patient_name || "—"}</div>
                      <div style={{ fontSize: "0.76rem", color: "#64748b", fontFamily: "monospace" }}>{row.patient_id}</div>
                    </Td>
                    <Td style={{ fontFamily: "monospace", fontWeight: 600 }}>{row.barcode}</Td>
                    <Td>
                      <div style={{ fontWeight: 600, color: "#1e293b" }}>{row.franchise_name || "—"}</div>
                      <span style={{ background: "#e0e7ff", color: "#3730a3", padding: "2px 6px", borderRadius: "4px", fontWeight: 600, fontSize: "0.74rem" }}>
                        {row.franchise_id}
                      </span>
                    </Td>
                    <Td>{row.referredDoctor || "—"}</Td>
                    <Td style={{ fontWeight: 600 }}>{row.test_name}</Td>
                    <Td style={{ fontWeight: 700 }}>₹{row.MRP}</Td>
                    <Td><StatusBadge $status={row.status}>{row.status}</StatusBadge></Td>
                    <Td>
                      <div style={{ fontSize: "0.82rem", fontWeight: 600 }}>{formatDateTime(row.requested_date)}</div>
                      <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                        By: {row.requested_by || "—"} {row.requested_by_id && row.requested_by_id !== row.requested_by ? `(${row.requested_by_id})` : ''}
                      </div>
                    </Td>
                    <Td>
                      {row.approved_date ? (
                        <>
                          <div style={{ fontSize: "0.82rem", color: "#166534", fontWeight: 600 }}>Approved: {formatDateTime(row.approved_date)}</div>
                          <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                            By: {row.approved_by || "—"} {row.approved_by_id && row.approved_by_id !== row.approved_by ? `(${row.approved_by_id})` : ''}
                          </div>
                        </>
                      ) : row.rejected_date ? (
                        <>
                          <div style={{ fontSize: "0.82rem", color: "#991b1b", fontWeight: 600 }}>Rejected: {formatDateTime(row.rejected_date)}</div>
                          <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                            By: {row.rejected_by || "—"} {row.rejected_by_id && row.rejected_by_id !== row.rejected_by ? `(${row.rejected_by_id})` : ''}
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: "0.82rem", color: "#d97706", fontWeight: 600 }}>Pending Review</div>
                      )}
                    </Td>
                    <Td>
                      <ViewBtn onClick={() => setSelectedRow(row)}>View Details</ViewBtn>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableScroll>
        )}
      </TableCard>

      {/* Details Modal */}
      {selectedRow &&
        createPortal(
          <ModalOverlay onClick={() => setSelectedRow(null)}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Cancelled Test Details</h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.84rem", opacity: 0.9 }}>
                    Patient: {selectedRow.patient_name || selectedRow.patient_id} ({selectedRow.patient_id}) • Barcode: {selectedRow.barcode}
                  </p>
                </div>
                <ModalClose onClick={() => setSelectedRow(null)}>✕</ModalClose>
              </ModalHeader>
              <ModalBody>
                <DetailRow>
                  <strong>Patient Name:</strong>
                  <span style={{ fontWeight: 700, color: "#1e3c72" }}>{selectedRow.patient_name || "—"} (ID: {selectedRow.patient_id})</span>
                </DetailRow>
                <DetailRow>
                  <strong>Franchise:</strong>
                  <span>{selectedRow.franchise_name ? `${selectedRow.franchise_name} (${selectedRow.franchise_id})` : selectedRow.franchise_id}</span>
                </DetailRow>
                <DetailRow>
                  <strong>Test Name:</strong>
                  <span>{selectedRow.test_name} (ID: {selectedRow.test_id})</span>
                </DetailRow>
                <DetailRow>
                  <strong>MRP Amount:</strong>
                  <span style={{ fontWeight: 700, color: "#1e3c72" }}>₹{selectedRow.MRP}</span>
                </DetailRow>
                <DetailRow>
                  <strong>Status:</strong>
                  <span><StatusBadge $status={selectedRow.status}>{selectedRow.status}</StatusBadge></span>
                </DetailRow>
                <DetailRow>
                  <strong>Referred Doctor:</strong>
                  <span>{selectedRow.referredDoctor || "—"}</span>
                </DetailRow>
                <DetailRow>
                  <strong>Bill Registration Date:</strong>
                  <span>{formatDateTime(selectedRow.registrationDate)}</span>
                </DetailRow>
                <DetailRow>
                  <strong>Cancellation Requested By:</strong>
                  <span>{selectedRow.requested_by}</span>
                </DetailRow>
                <DetailRow>
                  <strong>Cancellation Request Date & Time:</strong>
                  <span>{formatDateTime(selectedRow.requested_date)}</span>
                </DetailRow>
                {selectedRow.approved_date && (
                  <>
                    <DetailRow>
                      <strong>Approved By:</strong>
                      <span style={{ color: "#166534", fontWeight: 700 }}>{selectedRow.approved_by || "—"}</span>
                    </DetailRow>
                    <DetailRow>
                      <strong>Approval Timestamp:</strong>
                      <span style={{ color: "#166534" }}>{formatDateTime(selectedRow.approved_date)}</span>
                    </DetailRow>
                  </>
                )}
                {selectedRow.rejected_date && (
                  <>
                    <DetailRow>
                      <strong>Rejected By:</strong>
                      <span style={{ color: "#991b1b", fontWeight: 700 }}>{selectedRow.rejected_by || "—"}</span>
                    </DetailRow>
                    <DetailRow>
                      <strong>Rejection Timestamp:</strong>
                      <span style={{ color: "#991b1b" }}>{formatDateTime(selectedRow.rejected_date)}</span>
                    </DetailRow>
                  </>
                )}
                <DetailRow>
                  <strong>Original Net Bill Amount:</strong>
                  <span>₹{selectedRow.netAmount} ({selectedRow.paymentMode || "Cash"})</span>
                </DetailRow>
              </ModalBody>
            </ModalCard>
          </ModalOverlay>,
          document.body
        )}
    </PageContainer>
  );
};

export default Cancelledbillreport;
