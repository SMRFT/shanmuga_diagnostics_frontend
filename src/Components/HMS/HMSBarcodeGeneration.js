import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiRequest from "../Auth/apiRequest";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Calendar,
  User,
  ChevronRight,
  Search,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Minus,
  RefreshCw
} from "lucide-react";

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
  min-width: ${p => p.minW || "140px"};
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

const FSelect = styled.select`
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

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 0.55rem 0.75rem 0.55rem 2.2rem;
  font-size: 0.85rem;
  width: 100%;
  background-color: white;
  color: #1e293b;
  outline: none;
  transition: all 0.15s;
  box-sizing: border-box;

  &:focus {
    border-color: #a777e3;
    box-shadow: 0 0 0 3px rgba(167, 119, 227, 0.1);
  }
`;

const StepButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #a777e3;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: #a777e3;
    color: white;
    border-color: #a777e3;
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
  background: ${p => p.bg || "#a777e3"};
  color: ${p => p.color || "white"};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover { filter: brightness(0.94); transform: translateY(-1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

const TableWrap = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 0;

  &::-webkit-scrollbar { width: 5px; height: 5px; }
  &::-webkit-scrollbar-track { background: #f8fafc; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
`;

const TableHead = styled.thead`
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
    white-space: nowrap;
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

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem 0.65rem;
  font-size: 0.72rem;
  font-weight: 700;
  border-radius: 9999px;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  background: #a777e3;
  border: none;
  color: white;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  transition: all 0.15s;

  &:hover {
    background: #8b5cf6;
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(167, 119, 227, 0.25);
  }
`;

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

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
`;

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
const HMSBarcodeGeneration = () => {
  const getTodayStr = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  const parseDateToYYYYMMDD = (d) => {
    if (!d) return getTodayStr();
    const parsed = new Date(d);
    if (isNaN(parsed)) return getTodayStr();
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const dd = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  const location = useLocation();
  const [allPatients, setAllPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [displayedPatients, setDisplayedPatients] = useState([]);
  const [fromDate, setFromDate] = useState(() => parseDateToYYYYMMDD(location?.state?.fromDate));
  const [toDate, setToDate] = useState(() => parseDateToYYYYMMDD(location?.state?.toDate));
  const [searchTerm, setSearchTerm] = useState(() => {
    return location?.state?.searchTerm || "";
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [ipopFilter, setIpopFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const patientsPerPage = 15;
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const navigate = useNavigate();

  // Add search stepping logic like HMSPatientOverview
  const handleBarcodeStep = (delta) => {
    setSearchTerm((prev) => {
      const match = prev.match(/^(.*?)(\d+)$/);
      if (match) {
        const prefix = match[1];
        const num = parseInt(match[2], 10);
        const padLength = match[2].length;
        const next = Math.max(0, num + delta);
        return prefix + String(next).padStart(padLength, "0");
      }
      return delta > 0 ? prev + "1" : prev;
    });
  };



  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest(
        `${Labbaseurl}hms_patients_get_barcode/?from_date=${fromDate}&to_date=${toDate}`,
        "GET",
      );

      if (response.success) {
        const data = response.data.data;
        if (Array.isArray(data)) {
          setAllPatients(data);
          setFilteredPatients(data);
          setTotalPages(Math.max(1, Math.ceil(data.length / patientsPerPage)));
        } else {
          setAllPatients([]);
          setFilteredPatients([]);
          setTotalPages(1);
        }
      } else {
        setAllPatients([]);
        setFilteredPatients([]);
        setTotalPages(1);
        toast.error(response.error || "Failed to fetch patients");
      }
    } catch (error) {
      console.error("Unexpected error in fetchPatients:", error);
      setAllPatients([]);
      setFilteredPatients([]);
      setTotalPages(1);
      toast.error("An unexpected error occurred while fetching patients");
    } finally {
      setIsLoading(false);
    }
  };

  const extractBarcodeFromBillNo = (billNumber, billType) => {
    if (!billNumber) return "";
    const parts = String(billNumber).split("/");
    if (parts.length !== 2) {
      return String(billNumber).replace(/[^a-zA-Z0-9]/g, "");
    }
    const year = parts[0];
    const number = parts[1];
    return `${year}${billType || ""}${number}`;
  };

  const handleGenerateBarcode = (patient, e) => {
    e.stopPropagation();

    const d = new Date(patient.date);
    const selectedDateStr = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");

    const computedBarcode = extractBarcodeFromBillNo(patient.bill_no, patient.IPOPType || patient.BillType);
    const effectiveSearchTerm = searchTerm.trim() || computedBarcode || patient.bill_no || "";

    navigate("/HMSBarcodeTestDetails", {
      state: {
        patientId: patient.patient_id,
        patientName: patient.patientname,
        age: patient.age,
        gender: patient.gender,
        bill_no: patient.bill_no,
        bill_type: patient.BillType || patient.IPOPType,
        selectedDate: selectedDateStr,
        fromDate: fromDate,
        toDate: toDate,
        searchTerm: effectiveSearchTerm,
      },
    });
  };

  useEffect(() => {
    fetchPatients();
  }, [fromDate, toDate]);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    let filtered = allPatients;

    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((patient) => {
        const computedBarcode = extractBarcodeFromBillNo(patient.bill_no, patient.IPOPType || patient.BillType)?.toLowerCase() || "";
        const testBarcodes = (patient.testdetails || [])
          .map((t) => (t.barcode || "").toLowerCase())
          .join(" ");

        return (
          patient.patientname?.toLowerCase().includes(searchLower) ||
          patient.patient_id?.toLowerCase().includes(searchLower) ||
          patient.bill_no?.toString().toLowerCase().includes(searchLower) ||
          patient.age?.toString().includes(searchLower) ||
          patient.gender?.toLowerCase().includes(searchLower) ||
          computedBarcode.includes(searchLower) ||
          testBarcodes.includes(searchLower) ||
          (patient.barcode && patient.barcode.toLowerCase().includes(searchLower))
        );
      });
    }

    if (ipopFilter !== "ALL") {
      filtered = filtered.filter((patient) => patient.IPOPType === ipopFilter);
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (patient) => patient.barcode_status === statusFilter,
      );
    }

    setFilteredPatients(filtered);
    setCurrentPage(1);
    setTotalPages(Math.max(1, Math.ceil(filtered.length / patientsPerPage)));
  }, [searchTerm, ipopFilter, statusFilter, allPatients]);

  // Update displayed patients based on current page
  useEffect(() => {
    const startIndex = (currentPage - 1) * patientsPerPage;
    setDisplayedPatients(
      filteredPatients.slice(startIndex, startIndex + patientsPerPage),
    );
  }, [currentPage, filteredPatients]);



  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getGenderBadgeStyle = (gender) => {
    if ((gender || "").toLowerCase() === "male") {
      return { bg: "#dbeafe", color: "#2563eb" };
    } else if ((gender || "").toLowerCase() === "female") {
      return { bg: "#fce7f3", color: "#db2777" };
    }
    return { bg: "#e0e7ff", color: "#4f46e5" };
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setIpopFilter("ALL");
    setStatusFilter("ALL");
    const today = getTodayStr();
    setFromDate(today);
    setToDate(today);
  };

  return (
    <Shell>
      {/* Top Bar */}
      <TopBar>
        <TitleGroup>
          <Calendar size={22} color="#a777e3" />
          <Title>HMS Patient Barcode Generation</Title>
        </TitleGroup>
        <IconBtn bg="#f1f5f9" color="#a777e3" onClick={() => { setSearchTerm(""); fetchPatients(); }} disabled={isLoading} title="Refresh">
          <RefreshCw size={16} />
        </IconBtn>
      </TopBar>

      <Card>
        {/* Unified Responsive Filter Row */}
        <FilterBar>
          <FGroup minW="140px">
            <FLabel>From Date</FLabel>
            <FInput
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setSearchTerm("");
              }}
            />
          </FGroup>

          <FGroup minW="140px">
            <FLabel>To Date</FLabel>
            <FInput
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setSearchTerm("");
              }}
            />
          </FGroup>

          <FGroup minW="110px">
            <FLabel>IP/OP</FLabel>
            <FSelect value={ipopFilter} onChange={(e) => {
                setIpopFilter(e.target.value);
                setSearchTerm("");
              }}>
              <option value="ALL">All IP/OP</option>
              <option value="IP">IP</option>
              <option value="OP">OP</option>
            </FSelect>
          </FGroup>

          <FGroup minW="120px">
            <FLabel>Status</FLabel>
            <FSelect value={statusFilter} onChange={(e) => {
                setStatusFilter(e.target.value);
                setSearchTerm("");
              }}>
              <option value="ALL">All Status</option>
              <option value="Generated">Generated</option>
              <option value="Pending">Pending</option>
            </FSelect>
          </FGroup>

          <FGroup grow="1" minW="220px">
            <FLabel>Search Barcode</FLabel>
            <div style={{ display: "flex", gap: "0.35rem", alignItems: "center", width: "100%" }}>
              <SearchContainer>
                <SearchIcon>
                  <Search size={15} />
                </SearchIcon>
                <SearchInput
                  type="text"
                  placeholder="ID, Name, Bill No..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchContainer>
              <StepButton
                type="button"
                title="Decrement barcode/bill number"
                onClick={() => handleBarcodeStep(-1)}
              >
                <Minus size={14} />
              </StepButton>
              <StepButton
                type="button"
                title="Increment barcode/bill number"
                onClick={() => handleBarcodeStep(1)}
              >
                <Plus size={14} />
              </StepButton>
            </div>
          </FGroup>

          <IconBtn bg="#f1f5f9" color="#475569" onClick={clearFilters} title="Clear filters">Clear</IconBtn>
        </FilterBar>

        {/* Scrollable Table Area */}
        <TableWrap>
          <Table>
            <TableHead>
              <tr>
                <th style={{ width: "60px", textAlign: "center" }}>S.No</th>
                <th>Date</th>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>IP/OP</th>
                <th>Bill No</th>
                <th>Status</th>
                <th style={{ width: "180px", textAlign: "center" }}>Action</th>
              </tr>
            </TableHead>
            <tbody>
              {isLoading ? (
                <Tr><td colSpan={10} style={{ textAlign: "center", padding: "2.5rem", color: "#94a3b8" }}>Loading patients...</td></Tr>
              ) : displayedPatients.length > 0 ? (
                displayedPatients.map((patient, index) => {
                  const genderStyle = getGenderBadgeStyle(patient.gender);
                  return (
                    <Tr key={index}>
                      <td style={{ textAlign: "center" }}>
                        {(currentPage - 1) * patientsPerPage + index + 1}
                      </td>
                      <td>{formatDate(patient.date)}</td>
                      <td>{patient.patient_id}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <User size={15} color="#64748b" />
                          <span style={{ fontWeight: "600" }}>{patient.patientname}</span>
                        </div>
                      </td>
                      <td>{patient.age} years</td>
                      <td>
                        <Badge style={{ backgroundColor: genderStyle.bg, color: genderStyle.color }}>
                          {patient.gender}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          style={{
                            backgroundColor: patient.IPOPType === "IP" ? "#fee2e2" : "#dcfce7",
                            color: patient.IPOPType === "IP" ? "#b91c1c" : "#166534",
                          }}
                        >
                          {patient.IPOPType || "-"}
                        </Badge>
                      </td>
                      <td style={{ fontWeight: 600 }}>{patient.bill_no || "-"}</td>
                      <td>
                        <Badge
                          style={{
                            backgroundColor: patient.barcode_status === "Generated" ? "#dcfce7" : "#fef3c7",
                            color: patient.barcode_status === "Generated" ? "#166534" : "#92400e",
                          }}
                        >
                          {patient.barcode_status || "Pending"}
                        </Badge>
                      </td>
                      <td>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <ActionButton
                            onClick={(e) => handleGenerateBarcode(patient, e)}
                            style={{
                              background:
                                patient.barcode_status === "Generated"
                                  ? "#10b981"
                                  : "#a777e3",
                            }}
                          >
                            {patient.barcode_status === "Generated"
                              ? "View Barcode"
                              : "Generate Barcode"}
                            <ChevronRight size={14} />
                          </ActionButton>
                        </div>
                      </td>
                    </Tr>
                  );
                })
              ) : (
                <Tr>
                  <td colSpan={10}>
                    <EmptyState>
                      <Calendar size={36} style={{ opacity: 0.25, marginBottom: "0.50rem" }} />
                      <div>No patients found. Select date range or refine search queries.</div>
                    </EmptyState>
                  </td>
                </Tr>
              )}
            </tbody>
          </Table>
        </TableWrap>

        {/* Unified Bottom Pagination */}
        {filteredPatients.length > 0 && (
          <PaginationBar>
            <span>Showing {(currentPage - 1) * patientsPerPage + 1}–{Math.min(currentPage * patientsPerPage, filteredPatients.length)} of {filteredPatients.length}</span>
            <PageControls>
              <PageBtn disabled={currentPage === 1} onClick={() => goToPage(1)}><ChevronsLeft size={14} /></PageBtn>
              <PageBtn disabled={currentPage === 1} onClick={goToPreviousPage}><ChevronLeft size={14} /></PageBtn>
              {getPageNumbers().map(n => (
                <PageBtn key={n} active={n === currentPage} onClick={() => goToPage(n)}>{n}</PageBtn>
              ))}
              <PageBtn disabled={currentPage === totalPages} onClick={goToNextPage}><ChevronRightIcon size={14} /></PageBtn>
              <PageBtn disabled={currentPage === totalPages} onClick={() => goToPage(totalPages)}><ChevronsRight size={14} /></PageBtn>
            </PageControls>
          </PaginationBar>
        )}
      </Card>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Shell>
  );
};

export default HMSBarcodeGeneration;
