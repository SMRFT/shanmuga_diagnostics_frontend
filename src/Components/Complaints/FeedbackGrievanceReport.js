import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes } from "styled-components";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

const ACCENT = "#b673c9";
const ACCENT_DARK = "#895697";

const getTodayDate = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// ── Styled Components ───────────────────────────────────────────────────

const Container = styled.div`
  padding: 24px;
  background-color: #f7f9fa;
  min-height: 100vh;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;

  h2 {
    margin: 0;
    color: ${ACCENT_DARK};
    font-size: 24px;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    margin-bottom: 14px;
    h2 {
      font-size: 20px;
    }
  }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #efe8f2;
  box-shadow: 0 2px 8px rgba(137, 86, 151, 0.06);

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
    gap: 12px;
  }
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const FilterLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${ACCENT_DARK};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #d5dede;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background: #fff;
  min-width: 160px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${ACCENT};
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: 0;
    padding: 10px;
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #d5dede;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background: #fff;
  min-width: 240px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${ACCENT};
  }

  &::placeholder {
    color: #9aa5a5;
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: 0;
    padding: 10px;
  }
`;

const ExportButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-left: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const ExportButton = styled.button`
  background: #fff;
  color: ${ACCENT_DARK};
  border: 1px solid ${ACCENT};
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  min-height: 38px;

  &:hover {
    background: #f7edfa;
    border-color: ${ACCENT_DARK};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    flex: 1;
    padding: 10px;
  }
`;

const TableWrapper = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid #efe8f2;
`;

const TableScroll = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
`;

const Th = styled.th`
  background-color: #faf5fc;
  color: ${ACCENT_DARK};
  padding: 13px 14px;
  text-align: left;
  font-size: 13px;
  font-weight: 700;
  border-bottom: 2px solid #ecdcf0;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 13px 14px;
  font-size: 13.5px;
  color: #333;
  border-bottom: 1px solid #f5edf8;
  vertical-align: top;
  line-height: 1.45;
`;

const EmptyState = styled.div`
  padding: 40px 16px;
  text-align: center;
  color: #7a8a8a;
  font-size: 14px;
`;

const toastSlideIn = keyframes`
  from {
    transform: translateX(24px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 3000;

  @media (max-width: 480px) {
    left: 14px;
    right: 14px;
    top: 14px;
  }
`;

const ToastItem = styled.div`
  min-width: 240px;
  max-width: 360px;
  padding: 12px 16px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  background: ${(props) => (props.$type === "error" ? "#d64545" : "#2e9e5b")};
  animation: ${toastSlideIn} 0.2s ease-out;

  @media (max-width: 480px) {
    max-width: 100%;
    min-width: 0;
  }
`;

// ── Main Component ─────────────────────────────────────────────────────

const FeedbackGrievanceReport = () => {
  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());
  const [searchTerm, setSearchTerm] = useState("");

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${Labbaseurl}customer_complaints_qr_scan/?from_date=${fromDate}&to_date=${toDate}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load feedbacks");
      const data = await res.json();
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load Feedback & Grievance data", "error");
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const filteredFeedbacks = useMemo(() => {
    if (!searchTerm.trim()) return feedbacks;
    const q = searchTerm.toLowerCase();
    return feedbacks.filter((fb) => {
      const name = (fb.labname || fb.labcode || "").toLowerCase();
      return (
        name.includes(q) ||
        (fb.patient_id && fb.patient_id.toLowerCase().includes(q)) ||
        (fb.issuetype && fb.issuetype.toLowerCase().includes(q)) ||
        (fb.comments && fb.comments.toLowerCase().includes(q))
      );
    });
  }, [feedbacks, searchTerm]);

  const exportCSV = () => {
    if (filteredFeedbacks.length === 0) return;
    const headers = [
      "ID",
      "Date & Time",
      "Lab Name",
      "Patient ID",
      "Issue Type",
      "Comments / Grievance Details",
    ];

    const rows = filteredFeedbacks.map((f) => [
      f.complaint_id,
      f.created_date || "",
      `"${(f.labname || f.labcode || "").replace(/"/g, '""')}"`,
      `"${(f.patient_id || "").replace(/"/g, '""')}"`,
      `"${(f.issuetype || "").replace(/"/g, '""')}"`,
      `"${(f.comments || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Feedback_Grievance_Report_${fromDate}_to_${toDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (filteredFeedbacks.length === 0) return;
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(16);
    doc.setTextColor(137, 86, 151);
    doc.text("Shanmuga Diagnostics - Feedback & Grievance Report", 14, 15);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Date Range: ${fromDate} to ${toDate}`, 14, 22);

    const tableHeaders = [
      "ID",
      "Date & Time",
      "Lab Name",
      "Patient ID",
      "Issue Type",
      "Comments / Grievance Details",
    ];

    const tableData = filteredFeedbacks.map((f) => [
      f.complaint_id,
      f.created_date || "—",
      f.labname || f.labcode || "—",
      f.patient_id || "—",
      f.issuetype || "—",
      f.comments || "—",
    ]);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 28,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [137, 86, 151], textColor: [255, 255, 255] },
      columnStyles: {
        5: { cellWidth: 90 },
      },
    });

    doc.save(`Feedback_Grievance_Report_${fromDate}_to_${toDate}.pdf`);
  };

  return (
    <Container>
      <Header>
        <h2>Feedback & Grievance Report</h2>
      </Header>

      <FilterBar>
        <FilterField>
          <FilterLabel>From Date</FilterLabel>
          <DateInput
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </FilterField>

        <FilterField>
          <FilterLabel>To Date</FilterLabel>
          <DateInput
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </FilterField>

        <FilterField>
          <FilterLabel>Search</FilterLabel>
          <SearchInput
            type="text"
            placeholder="Search lab, patient, issue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FilterField>

        <ExportButtonGroup>
          <ExportButton
            type="button"
            onClick={exportCSV}
            disabled={filteredFeedbacks.length === 0}
          >
            Export Excel
          </ExportButton>
          <ExportButton
            type="button"
            onClick={exportPDF}
            disabled={filteredFeedbacks.length === 0}
          >
            Export PDF
          </ExportButton>
        </ExportButtonGroup>
      </FilterBar>

      <TableWrapper>
        <TableScroll>
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Created Date</Th>
                <Th>Lab Name</Th>
                <Th>Patient ID</Th>
                <Th>Issue Type</Th>
                <Th>Comments / Grievance Details</Th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((fb) => (
                <tr key={fb.complaint_id}>
                  <Td><strong>#{fb.complaint_id}</strong></Td>
                  <Td style={{ whiteSpace: "nowrap" }}>{fb.created_date || "—"}</Td>
                  <Td><strong>{fb.labname || fb.labcode || "—"}</strong></Td>
                  <Td>{fb.patient_id || "—"}</Td>
                  <Td>{fb.issuetype || "—"}</Td>
                  <Td style={{ whiteSpace: "pre-wrap" }}>{fb.comments || "—"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableScroll>

        {!loading && filteredFeedbacks.length === 0 && (
          <EmptyState>No Feedback & Grievance records found for the selected range.</EmptyState>
        )}
        {loading && <EmptyState>Loading report data...</EmptyState>}
      </TableWrapper>

      {toasts.length > 0 &&
        ReactDOM.createPortal(
          <ToastContainer>
            {toasts.map((t) => (
              <ToastItem key={t.id} $type={t.type}>
                {t.message}
              </ToastItem>
            ))}
          </ToastContainer>,
          document.body
        )}
    </Container>
  );
};

export default FeedbackGrievanceReport;
