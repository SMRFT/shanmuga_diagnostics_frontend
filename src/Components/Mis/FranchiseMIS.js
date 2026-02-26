"use client";

import { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Download,
  Search,
  Clock,
  User,
  FileText,
  Activity,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import apiRequest from "../Auth/apiRequest";

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
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f7fb;
    color: var(--dark);
    line-height: 1.5;
  }
`;

// --- Sticky column left offsets (px) ---
const STICKY_LEFT = [0, 100, 210, 370, 490, 550];
const STICKY_WIDTH = [100, 110, 160, 120, 60, 160];

const stickyTh = (i) => `
  position: sticky;
  left: ${STICKY_LEFT[i]}px;
  z-index: 3;
  background-color: #f9fafb;
  min-width: ${STICKY_WIDTH[i]}px;
  max-width: ${STICKY_WIDTH[i]}px;
  &::after {
    content: '';
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 1px;
    background: #e5e7eb;
  }
`;

const stickyTd = (i) => `
  position: sticky;
  left: ${STICKY_LEFT[i]}px;
  z-index: 2;
  background-color: white;
  min-width: ${STICKY_WIDTH[i]}px;
  max-width: ${STICKY_WIDTH[i]}px;
  &::after {
    content: '';
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 1px;
    background: #e5e7eb;
  }
`;

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
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

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;
  @media (min-width: 768px) {
    flex-direction: row;
    width: auto;
  }
`;

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f9fafb;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  &:focus-within {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
`;

const DateInput = styled.input`
  border: none;
  background: transparent;
  font-size: 0.875rem;
  color: #374151;
  outline: none;
  padding: 0.25rem;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f9fafb;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  width: 100%;
  &:focus-within {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
  @media (min-width: 768px) {
    width: 300px;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  font-size: 0.875rem;
  color: #374151;
  outline: none;
  width: 100%;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #6366f1;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #4f46e5;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
  th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 500;
    color: #4b5563;
    border-bottom: 1px solid #e5e7eb;
    white-space: nowrap;
  }
  th.sticky-0 {
    ${stickyTh(0)}
  }
  th.sticky-1 {
    ${stickyTh(1)}
  }
  th.sticky-2 {
    ${stickyTh(2)}
  }
  th.sticky-3 {
    ${stickyTh(3)}
  }
  th.sticky-4 {
    ${stickyTh(4)}
  }
  th.sticky-5 {
    ${stickyTh(5)}
  }
`;

const TableBody = styled.tbody`
  tr {
    &:hover td {
      background-color: #f0f4ff !important;
    }
    &:not(:last-child) {
      border-bottom: 1px solid #f3f4f6;
    }
  }
  td {
    padding: 0.75rem 1rem;
    color: #374151;
    vertical-align: top;
    background-color: white;
  }
  td.sticky-0 {
    ${stickyTd(0)}
  }
  td.sticky-1 {
    ${stickyTd(1)}
  }
  td.sticky-2 {
    ${stickyTd(2)}
  }
  td.sticky-3 {
    ${stickyTd(3)}
  }
  td.sticky-4 {
    ${stickyTd(4)}
  }
  td.sticky-5 {
    ${stickyTd(5)}
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #6366f1;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6b7280;
  text-align: center;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #e0e7ff;
  color: #4f46e5;
`;

const TATBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${(props) => (props.exceeded ? "#fee2e2" : "#e0e7ff")};
  color: ${(props) => (props.exceeded ? "#dc2626" : "#4f46e5")};
`;

const NavigationContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
`;

const NavigationTab = styled.button`
  padding: 12px 24px;
  border: none;
  background: ${(props) =>
    props.active ? "var(--primary-dark)" : "transparent"};
  color: ${(props) => (props.active ? "white" : "#666")};
  font-weight: ${(props) => (props.active ? "600" : "400")};
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  margin-right: 4px;
  transition: all 0.3s ease;
  position: relative;
  &:hover {
    background: ${(props) => (props.active ? "#0056b3" : "#f8f9fa")};
    color: ${(props) => (props.active ? "white" : "#333")};
  }
  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${(props) => (props.active ? "#ccc" : "transparent")};
  }
`;

const OverageBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.75rem;
`;

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-light);
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const PaginationInfo = styled.span`
  color: var(--gray);
  font-size: 0.875rem;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 0.375rem;
  border: 1px solid ${(props) => (props.active ? "#6366f1" : "#e5e7eb")};
  background-color: ${(props) => (props.active ? "#6366f1" : "white")};
  color: ${(props) => (props.active ? "white" : "#374151")};
  font-size: 0.813rem;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? "0.4" : "1")};
  transition: all 0.15s ease;
  &:hover:not(:disabled):not([data-active="true"]) {
    background-color: #f5f3ff;
    border-color: #a5b4fc;
  }
`;
const FilterSelect = styled.select`
  display: flex;
  align-items: center;
  background-color: #f9fafb;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #374151;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
`;

const ITEMS_PER_PAGE = 25;

const FranchiseMIS = () => {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tatFilter, setTatFilter] = useState("all");

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("franchise");

  useEffect(() => {
    if (location.pathname === "/ShanmugaMIS") setActiveTab("hms");
    else if (location.pathname === "/MIS") setActiveTab("mis");
    else if (location.pathname === "/FranchiseMIS") setActiveTab("franchise");
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "hms") navigate("/ShanmugaMIS");
    else if (tab === "mis") navigate("/MIS");
    else if (tab === "franchise") navigate("/FranchiseMIS");
  };

  useEffect(() => {
    fetchConsolidatedData(fromDate, toDate);
  }, [fromDate, toDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, fromDate, toDate, tatFilter]);

  const fetchConsolidatedData = async (selectedFromDate, selectedToDate) => {
    setLoading(true);
    try {
      const url = `${Labbaseurl}franchise-consolidated-data/?from_date=${encodeURIComponent(selectedFromDate)}&to_date=${encodeURIComponent(selectedToDate)}`;
      const result = await apiRequest(url, "GET");
      if (result.success) {
        const responseData = result.data.data || result.data;
        setData(responseData);
      } else {
        console.error("Error fetching consolidated data:", result.error);
        setData([]);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr) => {
    if (dateStr === "pending" || !dateStr || dateStr === null) return "Pending";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Pending";
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }).format(date);
  };

  const formatDuration = (durationStr) => {
    if (durationStr === "pending" || !durationStr) return "Pending";
    try {
      const parts = durationStr.split(", ");
      let timeStr = parts.length > 1 ? parts[1] : parts[0];
      let days = parts.length > 1 ? parseInt(parts[0].split(" ")[0]) : 0;
      const timeParts = timeStr.split(":");
      const hours = parseInt(timeParts[0]) + days * 24;
      const minutes = parseInt(timeParts[1]);
      const seconds = parseInt(timeParts[2]);
      return `${String(hours).padStart(2, "0")}H:${String(minutes).padStart(2, "0")}M:${String(seconds).padStart(2, "0")}S`;
    } catch {
      return durationStr;
    }
  };

  const groupedData = data.reduce((acc, row) => {
    const key = `${row.patient_name}_${row.age}`;
    if (!acc[key]) acc[key] = { ...row, tests: [] };
    acc[key].tests.push(row);
    return acc;
  }, {});

  const filteredPatients = Object.values(groupedData).filter((patient) => {
    const matchesSearch =
      patient.patient_name
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase()) ||
      patient.patient_id?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      patient.barcode?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      patient.tests.some(
        (test) =>
          test.test_name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          test.department?.toLowerCase().includes(searchQuery?.toLowerCase()),
      );

    if (!matchesSearch) return false;

    if (tatFilter === "all") return true;

    // Keep patient if at least one test matches the TAT filter
    return patient.tests.some((test) => {
      if (tatFilter === "ontime") return test.tat_status === "within_limit";
      if (tatFilter === "overage") return test.tat_status === "exceeded";
      return true;
    });
  });

  // Build pages keeping patient groups intact
  const pages = [];
  let currentPageGroups = [];
  let currentRowCount = 0;
  filteredPatients.forEach((group) => {
    const rowsInGroup = group.tests.length;
    if (currentRowCount > 0 && currentRowCount + rowsInGroup > ITEMS_PER_PAGE) {
      pages.push(currentPageGroups);
      currentPageGroups = [];
      currentRowCount = 0;
    }
    currentPageGroups.push(group);
    currentRowCount += rowsInGroup;
  });
  if (currentPageGroups.length > 0) pages.push(currentPageGroups);

  const totalPages = pages.length || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedGroups = pages[safeCurrentPage - 1] || [];
  const totalRows = filteredPatients.reduce(
    (sum, g) => sum + g.tests.length,
    0,
  );
  const startRow =
    pages
      .slice(0, safeCurrentPage - 1)
      .reduce(
        (sum, pg) => sum + pg.reduce((s, g) => s + g.tests.length, 0),
        0,
      ) + 1;
  const endRow =
    startRow + paginatedGroups.reduce((sum, g) => sum + g.tests.length, 0) - 1;

  const getPageNumbers = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const ps = new Set([1, totalPages, safeCurrentPage]);
    if (safeCurrentPage > 2) ps.add(safeCurrentPage - 1);
    if (safeCurrentPage < totalPages - 1) ps.add(safeCurrentPage + 1);
    const sorted = Array.from(ps).sort((a, b) => a - b);
    const result = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) result.push("...");
      result.push(p);
    });
    return result;
  };

  const exportToExcel = () => {
    if (!fromDate || !toDate) {
      alert("Please select from and to dates!");
      return;
    }
    if (data.length === 0) {
      alert("No data available for the selected date range!");
      return;
    }
    try {
      const formattedFromDate = new Date(fromDate)
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");
      const formattedToDate = new Date(toDate)
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");
      const dataToExport = searchQuery
        ? filteredPatients.flatMap((g) => g.tests)
        : data;
      const formattedData = dataToExport.map((row) => ({
        Date: new Date(row.date)
          .toLocaleDateString("en-GB")
          .replace(/\//g, "-"),
        "Patient ID": row.patient_id,
        "Patient Name": row.patient_name,
        Barcode: row.barcode,
        Age: row.age,
        "Test Name": row.test_name,
        Department: row.department,
        "Registered Time": formatTime(row.date),
        "Collected Time": formatTime(row.collected_time),
        "Received Time": formatTime(row.received_time),
        "Approval Time": formatTime(row.approval_time),
        "Expected TAT": row.expected_tat || "N/A",
        "Actual TAT": formatDuration(row.tat_time),
        "TAT Overage": row.tat_out_time
          ? `+${formatDuration(row.tat_out_time)}`
          : row.tat_status === "within_limit"
            ? "On Time"
            : "—",
        "TAT Status":
          row.tat_status === "exceeded"
            ? "EXCEEDED"
            : row.tat_status === "within_limit"
              ? "ON TIME"
              : "PENDING",
        "Processing Time": formatDuration(row.total_processing_time),
      }));
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "MIS Data");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAs(
        new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `Franchise_MIS_Report_${formattedFromDate}_to_${formattedToDate}.xlsx`,
      );
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("An error occurred while exporting the data.");
    }
  };

  return (
    <Container>
      <GlobalStyle />
      <CardHeader>
        <NavigationContainer>
          <NavigationTab
            active={activeTab === "hms"}
            onClick={() => handleTabChange("hms")}
          >
            Shanmuga Lab
          </NavigationTab>
          <NavigationTab
            active={activeTab === "mis"}
            onClick={() => handleTabChange("mis")}
          >
            Shanmuga Diagnostics
          </NavigationTab>
          <NavigationTab
            active={activeTab === "franchise"}
            onClick={() => handleTabChange("franchise")}
          >
            Franchise
          </NavigationTab>
        </NavigationContainer>
        <Title>Franchise Overall TAT Report</Title>
      </CardHeader>

      <Controls>
        <DatePickerWrapper>
          <Calendar size={16} color="#6b7280" />
          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>From:</span>
          <DateInput
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </DatePickerWrapper>
        <DatePickerWrapper>
          <Calendar size={16} color="#6b7280" />
          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>To:</span>
          <DateInput
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </DatePickerWrapper>
        <SearchWrapper>
          <Search size={16} color="#6b7280" />
          <SearchInput
            type="text"
            placeholder="Search patient, test, department, barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchWrapper>
        <FilterSelect
          value={tatFilter}
          onChange={(e) => setTatFilter(e.target.value)}
        >
          <option value="all">All TAT Status</option>
          <option value="ontime">✓ On Time</option>
          <option value="overage">⚠ Overage</option>
        </FilterSelect>
        <ExportButton onClick={exportToExcel}>
          <Download size={16} />
          <span>Export</span>
        </ExportButton>
      </Controls>

      {loading ? (
        <LoadingWrapper>
          <LoadingSpinner />
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading data...</p>
        </LoadingWrapper>
      ) : (
        <>
          <TableContainer>
            <StyledTable>
              <TableHead>
                <tr>
                  <th className="sticky-0">Date</th>
                  <th className="sticky-1">Patient ID</th>
                  <th className="sticky-2">Patient Name</th>
                  <th className="sticky-3">Barcode</th>
                  <th className="sticky-4">Age</th>
                  <th className="sticky-5">Test Name</th>
                  <th>Department</th>
                  <th>Registered</th>
                  <th>Collected</th>
                  <th>Received</th>
                  <th>Approved</th>
                  <th>Expected TAT</th>
                  <th>Actual TAT(C-A)</th>
                  <th>TAT Overage</th>
                  <th>Processing Time(R-D)</th>
                </tr>
              </TableHead>
              <TableBody>
                {paginatedGroups.length > 0 ? (
                  paginatedGroups.map((group, groupIndex) =>
                    group.tests.map((test, testIndex) => (
                      <tr key={`${groupIndex}-${testIndex}`}>
                        {testIndex === 0 && (
                          <>
                            <td
                              className="sticky-0"
                              rowSpan={group.tests.length}
                            >
                              {new Date(group.date).toLocaleDateString("en-IN")}
                            </td>
                            <td
                              className="sticky-1"
                              rowSpan={group.tests.length}
                            >
                              <Badge>{group.patient_id}</Badge>
                            </td>
                            <td
                              className="sticky-2"
                              rowSpan={group.tests.length}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <User size={16} color="#6b7280" />
                                <span>{group.patient_name}</span>
                              </div>
                            </td>
                            <td
                              className="sticky-3"
                              rowSpan={group.tests.length}
                            >
                              {group.barcode}
                            </td>
                            <td
                              className="sticky-4"
                              rowSpan={group.tests.length}
                            >
                              {group.age}
                            </td>
                          </>
                        )}
                        <td className="sticky-5">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <FileText size={16} color="#6b7280" />
                            <span>{test.test_name}</span>
                          </div>
                        </td>
                        <td>{test.department}</td>
                        <td>
                          {new Date(test.date).toLocaleTimeString("en-IN", {
                            hour12: false,
                          })}
                        </td>
                        <td>{formatTime(test.collected_time)}</td>
                        <td>{formatTime(test.received_time)}</td>
                        <td>{formatTime(test.approval_time)}</td>
                        <td>
                          <TATBadge exceeded={false}>
                            {test.expected_tat || "N/A"}
                          </TATBadge>
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              color:
                                test.tat_status === "exceeded"
                                  ? "#dc2626"
                                  : test.tat_status === "within_limit"
                                    ? "#10b981"
                                    : "#6b7280",
                              fontWeight:
                                test.tat_status === "exceeded" ? "600" : "400",
                            }}
                          >
                            <Clock size={16} />
                            <span>{formatDuration(test.tat_time)}</span>
                          </div>
                        </td>
                        <td>
                          {test.tat_out_time ? (
                            <OverageBadge>
                              <Clock size={14} />
                              <span>+{formatDuration(test.tat_out_time)}</span>
                            </OverageBadge>
                          ) : (
                            <span
                              style={{
                                color:
                                  test.tat_status === "within_limit"
                                    ? "#10b981"
                                    : "#9ca3af",
                                fontSize: "0.875rem",
                                fontWeight:
                                  test.tat_status === "within_limit"
                                    ? "500"
                                    : "400",
                              }}
                            >
                              {test.tat_status === "within_limit"
                                ? "✓ On Time"
                                : "—"}
                            </span>
                          )}
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <Clock size={16} color="#6b7280" />
                            <span>
                              {formatDuration(test.total_processing_time)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )),
                  )
                ) : (
                  <tr>
                    <td colSpan={15}>
                      <EmptyState>
                        <Activity size={32} color="#9ca3af" />
                        <p>No data available for the selected criteria</p>
                      </EmptyState>
                    </td>
                  </tr>
                )}
              </TableBody>
            </StyledTable>
          </TableContainer>

          <PaginationWrapper>
            <PaginationInfo>
              Showing {filteredPatients.length}{" "}
              {filteredPatients.length === 1 ? "entry" : "entries"}
            </PaginationInfo>
            <PaginationControls>
              <PageButton
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} />
              </PageButton>
              {getPageNumbers().map((item, idx) =>
                item === "..." ? (
                  <span
                    key={`e-${idx}`}
                    style={{
                      padding: "0 4px",
                      color: "#9ca3af",
                      userSelect: "none",
                    }}
                  >
                    …
                  </span>
                ) : (
                  <PageButton
                    key={item}
                    active={item === safeCurrentPage}
                    data-active={item === safeCurrentPage}
                    onClick={() => setCurrentPage(item)}
                  >
                    {item}
                  </PageButton>
                ),
              )}
              <PageButton
                disabled={safeCurrentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                <ChevronRight size={14} />
              </PageButton>
            </PaginationControls>
          </PaginationWrapper>
        </>
      )}
    </Container>
  );
};

export default FranchiseMIS;
