"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";
import styled, { createGlobalStyle } from "styled-components";
import { format } from "date-fns";
import Modal from "react-modal";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "react-datepicker/dist/react-datepicker.css";
import * as pdfjsLib from "pdfjs-dist";
import CHCApproval from "./CHCApproval";
import * as XLSX from "xlsx";
import { Printer, X, List, Download } from "lucide-react";
import { IoIosFemale, IoIosMale, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import headerImage from "../Images/Header.png";
import FooterImage from "../Images/Footer.png";
import NABLImage from "../Images/NABL.png";
import Muhsina from "../Images/Muhsina.png";
import drarun from "../Images/drarun.png";
import DRPS from "../Images/DRPS.png";
import { useNavigate, useLocation } from "react-router-dom";
import apiRequest from "../Auth/apiRequest";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// ─── Global styles ────────────────────────────────────────────────────────────
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
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f7fb;
    color: var(--dark);
    line-height: 1.5;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;
const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
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
const FiltersContainer = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
`;
const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const FilterLabel = styled.label`
  font-size: 0.8rem;
  color: var(--gray);
  font-weight: 500;
`;
const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  transition: var(--transition);
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;
const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: var(--transition);
  background-color: white;
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;
const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  &:hover {
    background-color: var(--primary-dark);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3);
  }
`;
const ClearButton = styled(Button)`
  background-color: var(--light);
  color: var(--dark);
  &:hover {
    background-color: var(--gray-light);
  }
`;
const TableContainer = styled.div`
  overflow-x: auto;
  transform: rotateX(180deg);
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: var(--gray-light);
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--gray);
    border-radius: 20px;
  }
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  transform: rotateX(180deg);
  min-width: 800px;
`;
const TableHead = styled.thead`
  background-color: var(--gray-light);
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--gray);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
`;
const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--gray-light);
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: rgba(67, 97, 238, 0.05);
    }
  }
  td {
    padding: 1rem;
    vertical-align: middle;
    font-size: 0.875rem;
  }
`;
const NoData = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray);
  font-style: italic;
`;
const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${(p) => p.color || "var(--gray)"};
  color: white;
`;
const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  background-color: ${(p) => (p.disabled ? "var(--gray-light)" : "white")};
  color: ${(p) => (p.disabled ? "var(--gray)" : "var(--dark)")};
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  transition: var(--transition);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:hover {
    transform: ${(p) => (p.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(p) =>
    p.disabled ? "0 2px 4px rgba(0,0,0,0.1)" : "0 4px 8px rgba(0,0,0,0.1)"};
  }
`;
const GenderIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  background-color: ${(p) =>
    p.gender === "Female" ? "rgba(232,62,140,0.1)" : "rgba(0,123,255,0.1)"};
  color: ${(p) => (p.gender === "Female" ? "#E83E8C" : "#007BFF")};
`;
const ExportButton = styled(Button)`
  background-color: #10b981;
  &:hover:not(:disabled) {
    background-color: #059669;
  }
`;
const OverallPrintButton = styled(Button)`
  background-color: #8b5cf6;
  &:hover:not(:disabled) {
    background-color: #7c3aed;
  }
  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
`;
const InvestigationStatusDisplay = styled.div`
  font-size: 13px;
  color: #333;
  line-height: 1.6;
  white-space: pre-line;
  padding: 8px 0;
  @keyframes blink {
    0%,
    49% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0.3;
    }
  }
  .pending-label {
    color: #ff0000;
    font-weight: 600;
    animation: blink 1s infinite;
    margin-left: 8px;
  }
  .all-approved {
    color: #69b444ff;
    font-weight: 600;
  }
`;

const StyledCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--primary);
  border-radius: 3px;
`;
const SelectionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1.5rem;
  background: #eff6ff;
  border-bottom: 1px solid #bfdbfe;
  font-size: 0.875rem;
  color: var(--primary-dark);
  font-weight: 500;
`;
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--gray-light);
`;
const StatCard = styled.div`
  background-color: var(--light);
  border-radius: var(--border-radius);
  padding: 1rem 1.25rem;
`;
const StatLabel = styled.p`
  font-size: 0.8rem;
  color: var(--gray);
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 6px;
`;
const StatDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(p) => p.color};
  flex-shrink: 0;
`;
const StatValue = styled.p`
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0;
  color: ${(p) => p.color || "var(--dark)"};
  line-height: 1;
`;
const StatSub = styled.p`
  font-size: 0.75rem;
  color: var(--gray);
  margin: 5px 0 0;
`;

const ManualNameList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const ManualNameRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--gray);
`;
const ManualNameCount = styled.span`
  font-weight: 600;
  color: var(--primary-dark);
  background: var(--gray-light);
  border-radius: 10px;
  padding: 1px 7px;
  font-size: 0.7rem;
`;

// ── PrintDropdown: just a relative wrapper for the trigger button ─────────────
const PrintDropdown = styled.div`
  position: relative;
  &::after {
    content: "";
    position: fixed;
    width: 210px;
    height: 10px;
    left: ${(p) => p.left || 0}px;
    top: ${(p) => p.top || 0}px;
    z-index: 9998;
    pointer-events: auto;
    background: transparent;
  }
`;
const PortalDropdownMenu = styled.div`
  position: fixed;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  min-width: 200px;
  z-index: 9999;
  overflow: hidden;
  border: 1px solid #e9ecef;
  // Bridge the gap with invisible top padding
  padding-top: 6px;
  margin-top: -6px;
`;
const DropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  border: none;
  background-color: white;
  color: black;
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);
  &:hover {
    background-color: var(--gray-light);
  }
`;

// ─── Tiny concurrency limiter (no npm package needed) ─────────────────────────
const pLimit = (concurrency) => {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active >= concurrency || !queue.length) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    fn()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        active--;
        next();
      });
  };
  return (fn) =>
    new Promise((res, rej) => {
      queue.push({ fn, resolve: res, reject: rej });
      next();
    });
};

// ─── Component ────────────────────────────────────────────────────────────────
const CHCReport = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [investigationStatuses, setInvestigationStatuses] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activeDropdownPatientId, setActiveDropdownPatientId] = useState(null);
  const [activeDropdownType, setActiveDropdownType] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [barcode, setBarcode] = useState("");
  const [refBy, setRefBy] = useState("");
  const [patientId, setPatientId] = useState("");
  const [IPNumber, setIPNumber] = useState("");
  const [patientName, setPatientName] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [investigationStatusFilter, setInvestigationStatusFilter] =
    useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [selectedBarcodes, setSelectedBarcodes] = useState(new Set());
  const navigate = useNavigate();
  const location = useLocation();
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const showDropdown = (id, type, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 4,
      left: rect.right - 200,
    });
    setActiveDropdownPatientId(id);
    setActiveDropdownType(type);
  };

  const hideDropdown = () => {
    setActiveDropdownPatientId(null);
    setActiveDropdownType(null);
  };
  const hasPendingInvestigations = (bc) => {
    const data = investigationStatuses[bc];
    if (!data) return false;
    if (data.lab_approval?.toLowerCase() === "pending") return true;
    // Trust chc_investigation_status from API directly
    if (data.chc_investigation_status === "All Approved") return false;
    const chcTests = data.chc_tests || [];
    if (chcTests.length === 0) return false;
    return chcTests.some((t) => t.status?.toLowerCase() !== "approved");
  };

  const getPendingInvestigations = (statusData) => {
    if (!statusData) return <span className="all-approved">All Approved</span>;
    const labPending = statusData.lab_approval?.toLowerCase() === "pending";
    const chcTests = statusData.chc_tests || [];

    // Trust chc_investigation_status from API as the primary source
    const chcAllDone = statusData.chc_investigation_status === "All Approved";

    if (!labPending && chcAllDone)
      return <span className="all-approved">All Approved</span>;

    if (chcTests.length === 0 && !labPending)
      return <span className="all-approved">No CHC Tests</span>;

    return (
      <>
        {labPending && (
          <div>
            Lab Tests<span className="pending-label">Pending</span>
          </div>
        )}
        {!chcAllDone &&
          chcTests.map((test, index) => {
            // Only show pending ones — trust status from API, not has_file/has_report
            if (test.status?.toLowerCase() === "approved") return null;
            return (
              <div key={index}>
                {test.testname}
                <span className="pending-label">Pending</span>
              </div>
            );
          })}
      </>
    );
  };
  // ─── Data fetching ────────────────────────────────────────────────────────
  const fetchCombinedPatientData = useCallback(async () => {
    setLoading(true);
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];
    const url = `${Labbaseurl}corporate_approval_report/?from_date=${formattedStartDate}&to_date=${formattedEndDate}`;
    const result = await apiRequest(url, "GET");
    if (result.success) {
      const patientData = result.data;
      setPatients(patientData);
      setFilteredPatients(patientData);
      const statusMap = {};
      const investigationStatusMap = {};
      patientData.forEach((patient) => {
        statusMap[patient.patient_id] = {
          status: patient.status,
          barcode: patient.barcode,
        };
        if (patient.barcode) {
          investigationStatusMap[patient.barcode] = {
            chc_tests: patient.chc_tests || [],
            chc_investigation_status:
              patient.chc_investigation_status || "Pending",
            lab_approval: patient.lab_approval || "Pending",
          };
        }
      });
      setStatuses(statusMap);
      setInvestigationStatuses(investigationStatusMap);
    } else {
      setError("Failed to load patient data");
    }
    setLoading(false);
  }, [startDate, endDate, Labbaseurl]);

  const branchNames = useMemo(() => {
    const names = patients.map((p) => p.branch_name).filter(Boolean);
    return [...new Set(names)].sort();
  }, [patients]);

  const approvalCounts = useMemo(() => {
    let auto = 0;
    const manualByName = {}; // { "Dr. X": 3, "Dr. Y": 1 }

    filteredPatients.forEach((p) => {
      if (p.approval_type === "auto") {
        auto++;
      } else if (p.approval_type === "manual") {
        const name = p.approved_by_name || "Unknown";
        manualByName[name] = (manualByName[name] || 0) + 1;
      }
    });

    const manualTotal = Object.values(manualByName).reduce((s, n) => s + n, 0);
    return { auto, manualByName, manualTotal, total: auto + manualTotal };
  }, [filteredPatients]);

  const handleApprovalSaved = useCallback(async () => {
    await fetchCombinedPatientData();
    toast.success("Status updated successfully!");
  }, [fetchCombinedPatientData]);

  useEffect(() => {
    if (startDate && endDate) fetchCombinedPatientData();
  }, [fetchCombinedPatientData, startDate, endDate]);

  const isPrintAndMailEnabled = (status) =>
    status === "Approved" ||
    status === "Partially Approved" ||
    status === "Dispatched";

  useEffect(() => {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    const filtered = patients.filter((patient) => {
      const patientDate = new Date(patient.date);
      const patientStatus = statuses[patient.patient_id]?.status || "";
      const hasPending = hasPendingInvestigations(patient.barcode);
      return (
        patientDate >= startOfDay &&
        patientDate <= endOfDay &&
        (!refBy || patient.refby === refBy) &&
        (!patientId || patient.patient_id.includes(patientId)) &&
        (!IPNumber || patient.ipnumber?.includes(IPNumber)) &&
        (!barcode ||
          patient.barcode?.toLowerCase().includes(barcode.toLowerCase())) &&
        (!patientName ||
          patient.patient_name
            ?.toLowerCase()
            .includes(patientName.toLowerCase())) &&
        (!branchFilter || patient.branch_name === branchFilter) &&
        (!statusFilter || patientStatus === statusFilter) &&
        (!investigationStatusFilter ||
          (investigationStatusFilter === "Pending" && hasPending) ||
          (investigationStatusFilter === "All Approved" && !hasPending))
      );
    });
    setFilteredPatients(filtered);
    setSelectedBarcodes(new Set()); // reset selection when filters change
  }, [
    startDate,
    endDate,
    patients,
    refBy,
    patientId,
    barcode,
    IPNumber,
    patientName,
    branchFilter,
    statusFilter,
    investigationStatusFilter,
    statuses,
    investigationStatuses,
  ]);

  const clearFilters = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setBarcode("");
    setRefBy("");
    setPatientId("");
    setIPNumber("");
    setPatientName("");
    setBranchFilter("");
    setStatusFilter("");
    setInvestigationStatusFilter("");
    setFilteredPatients(patients);
  };

  // ─── PDF utilities ────────────────────────────────────────────────────────
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  // OPTIMIZED: scale 1.5 + JPEG + parallel page rendering
  const convertPdfToImages = async (base64Data) => {
    try {
      const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "").trim();
      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++)
        bytes[i] = binaryString.charCodeAt(i);

      const loadingTask = pdfjsLib.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;

      // Render all pages in parallel
      const pagePromises = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        pagePromises.push(
          (async (num) => {
            const page = await pdf.getPage(num);
            const viewport = page.getViewport({ scale: 1.5 }); // was 2.0 — 44% fewer pixels
            const canvas = document.createElement("canvas");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({
              canvasContext: canvas.getContext("2d"),
              viewport,
            }).promise;
            return canvas.toDataURL("image/jpeg", 0.85); // JPEG: 60-80% smaller than PNG
          })(pageNum),
        );
      }
      const results = await Promise.all(pagePromises);
      return results.map((dataUri) => ({ dataUri, format: "JPEG" }));
    } catch (error) {
      console.error("Error converting PDF to images:", error);
      return [];
    }
  };

  const fetchInvestigationFile = async (fileId) => {
    if (!fileId) return null;
    try {
      const result = await apiRequest(
        `${Labbaseurl}get_investigation_file/?file_id=${fileId}`,
        "GET",
      );
      if (!result.success) return null;
      return {
        data: result.data.data,
        contentType: result.data.contentType,
        filename: result.data.filename,
      };
    } catch (error) {
      console.error(`Error fetching file ${fileId}:`, error);
      return null;
    }
  };

  // NEW: Pre-convert all PDF files → images BEFORE PDF generation starts
  // This separates I/O (slow) from PDF building (CPU) so both can be parallelized
  const preProcessInvestigationFiles = async (
    investigationFiles,
    chcTestsForFiles,
  ) => {
    const processed = {};
    await Promise.all(
      chcTestsForFiles.map(async (test) => {
        const testEntry = investigationFiles[test.test_id];
        if (!testEntry) return;

        const testNameLower = (test.testname || "").toLowerCase();
        const isOphthal =
          testNameLower.includes("optho") ||
          testNameLower.includes("ophth") ||
          test.test_id === "CHCT001";
        if (isOphthal) return;

        const processedImages = [];
        if (testEntry.files?.length > 0) {
          await Promise.all(
            testEntry.files.map(async (file) => {
              if (!file?.data) return;
              const contentType = file.contentType || "";
              const filename = (file.filename || "").toLowerCase();
              const isPDF =
                contentType.includes("pdf") || filename.endsWith(".pdf");
              if (isPDF) {
                const imgs = await convertPdfToImages(file.data);
                imgs.forEach((img) => processedImages.push(img));
              } else {
                let fmt = "PNG";
                if (
                  contentType.includes("jpeg") ||
                  contentType.includes("jpg") ||
                  filename.endsWith(".jpg") ||
                  filename.endsWith(".jpeg")
                )
                  fmt = "JPEG";
                processedImages.push({
                  dataUri: `data:${contentType || "image/png"};base64,${file.data}`,
                  format: fmt,
                });
              }
            }),
          );
        }
        processed[test.test_id] = { ...testEntry, processedImages };
      }),
    );
    return processed;
  };

  // ─── mergeInvestigationData ───────────────────────────────────────────────
  const mergeInvestigationData = (patientDetails, invStatus) => {
    if (!invStatus) return patientDetails;
    const merged = { ...patientDetails };

    const rawVitals = invStatus.vitals || {};
    if (Object.keys(rawVitals).length > 0) {
      const pick = (...keys) => {
        for (const k of keys) {
          const v = rawVitals[k];
          if (v && String(v).trim() && String(v).trim() !== "0") return v;
        }
        return null;
      };
      const normalisedVitals = {};
      const h = pick("height_cm", "height");
      if (h) normalisedVitals.height = h;
      const w = pick("weight_kg", "weight");
      if (w) normalisedVitals.weight = w;
      const bmi = pick("bmi");
      if (bmi) normalisedVitals.bmi = bmi;
      const bp = pick("blood_pressure");
      if (bp) normalisedVitals.blood_pressure = bp;
      const pulse = pick("pulse", "spo2");
      if (pulse) normalisedVitals.spo2 = pulse;
      if (Object.keys(normalisedVitals).length > 0)
        merged.vitals = { ...(merged.vitals || {}), ...normalisedVitals };
    }

    const history = invStatus.patient_history;
    if (history && history.trim())
      merged.medical_history = {
        ...(merged.medical_history || {}),
        patient_history: history,
      };

    const chcTests = invStatus.chc_tests || [];
    if (chcTests.length > 0) {
      const notesMap = {
        ECG: "ecg_notes",
        PFT: "pft_notes",
        Spirometry: "pft_notes",
        "Pulmonary Function Test": "pft_notes",
        "X-Ray Chest": "xray_notes",
        "Chest - XRay": "xray_notes",
        "X-Ray": "xray_notes",
        Audiometry: "audiometry_notes",
      };
      const reportMap = {
        "X-Ray Chest": "xray_report",
        "Chest - XRay": "xray_report",
        "X-Ray": "xray_report",
      };
      const existingNotes = { ...(merged.investigation_notes || {}) };
      chcTests.forEach((test) => {
        const name = test.testname || "";
        const notesKey = notesMap[name];
        if (notesKey && test.notes?.trim() && !existingNotes[notesKey])
          existingNotes[notesKey] = test.notes;
        const reportKey = reportMap[name];
        if (reportKey && test.report?.trim() && !existingNotes[reportKey])
          existingNotes[reportKey] = test.report;
        if (
          reportKey === "xray_report" &&
          test.report?.trim() &&
          !existingNotes["xray_notes"]
        ) {
          const firstSentence = test.report.split(/\.(?=\s|$)/)[0].trim();
          if (firstSentence)
            existingNotes["xray_notes"] = firstSentence.endsWith(".")
              ? firstSentence
              : firstSentence + ".";
        }
      });
      if (Object.keys(existingNotes).length > 0)
        merged.investigation_notes = existingNotes;
    }

    const ophthalTest = chcTests.find(
      (t) =>
        t.test_id === "CHCT001" ||
        (t.testname || "").toLowerCase().includes("eye") ||
        (t.testname || "").toLowerCase().includes("ophthal"),
    );
    if (ophthalTest?.report?.trim()) {
      try {
        const parsed = JSON.parse(ophthalTest.report);
        if (
          parsed &&
          (parsed.distance || parsed.nearVision || parsed.colourVision)
        ) {
          merged.chc_ophthalmology = {
            distance: parsed.distance || {},
            nearVision: parsed.nearVision || {},
            colourVision: parsed.colourVision || {},
            ocularmovement: parsed.ocularmovement || {},
            complaints: ophthalTest.notes?.trim() || parsed.complaints || "",
            remarks: parsed.remarks || "",
          };
        }
      } catch (e) {
        /* plain text — leave chc_ophthalmology unset */
      }
    }

    return merged;
  };

  // ─── buildPdfDocument ─────────────────────────────────────────────────────
  // 4th param preProcessedFiles: if provided, addInvestigationFiles uses pre-rendered
  // images instead of converting on-the-fly (used in batch mode)
  const buildPdfDocument = async (
    patientDetails,
    activeConsultants = [],
    withLetterpad = true,
    preProcessedFiles = null, // NEW param
  ) => {
    const doc = new jsPDF();
    let pageCount = 1;
    const leftMargin = 15;
    const rightMargin = leftMargin + 180;
    const contentWidth = rightMargin - leftMargin;
    const headerHeight = 25;
    const footerHeight = 15;
    let currentYPosition = headerHeight + 10;

    const unicodeMap = {
      μ: "µ",
      "×": "x",
      "÷": "/",
      "°": "°",
      "±": "±",
      "²": "²",
      "³": "³",
    };

    const processUnicodeText = (text) => {
      if (!text) return "";
      let t = text;
      t = t.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
        const ch = String.fromCharCode(parseInt(hex, 16));
        return unicodeMap[ch] || ch;
      });
      Object.keys(unicodeMap).forEach((k) => {
        t = t.replace(new RegExp(k, "g"), unicodeMap[k]);
      });
      return t;
    };

    const wrapTextAndGetLines = (doc, text, maxWidth) => {
      if (!text) return [];
      return doc.splitTextToSize(text, maxWidth);
    };

    const renderWrappedText = (
      doc,
      text,
      maxWidth,
      startX,
      yPos,
      lineHeight = 4,
    ) => {
      if (!text) return 0;
      const lines = wrapTextAndGetLines(doc, text, maxWidth);
      lines.forEach((line, index) => {
        doc.text(line, startX, yPos + index * lineHeight);
      });
      return lines.length * lineHeight;
    };

    const renderUnicodeText = (text, x, y, options = {}) => {
      const processedText = processUnicodeText(text);
      if (processedText.includes("µ")) {
        const parts = processedText.split("µ");
        let currentX = x;
        parts.forEach((part, index) => {
          if (index > 0) {
            doc.setFont("helvetica", options.fontStyle || "normal");
            doc.text("µ", currentX, y);
            currentX += doc.getTextWidth("µ");
          }
          if (part) {
            doc.text(part, currentX, y);
            currentX += doc.getTextWidth(part);
          }
        });
      } else {
        doc.text(processedText, x, y);
      }
    };

    const renderValueWithSuperscript = (
      doc,
      text,
      x,
      y,
      maxWidth = null,
      lineHeight = 4,
    ) => {
      if (!text) return 0;

      const lines = maxWidth ? doc.splitTextToSize(text, maxWidth) : text.split("\n");
      let currentY = y;
      let totalHeight = 0;

      lines.forEach((lineText) => {
        const superscriptRegex = /(\d+[xX×]?\d*)\^(-?\d+)/;
        const match = lineText.match(superscriptRegex);

        if (!match) {
          doc.text(lineText, x, currentY);
        } else {
          const before = lineText.slice(0, match.index);
          const base = match[1].replace(/[xX]/, "×");
          const exponent = match[2];
          const after = lineText.slice(match.index + match[0].length);

          let currentX = x;
          const normalSize = doc.getFontSize();

          if (before) {
            doc.text(before, currentX, currentY);
            currentX += doc.getTextWidth(before);
          }

          doc.text(base, currentX, currentY);
          currentX += doc.getTextWidth(base);

          doc.setFontSize(7);
          doc.text(exponent, currentX, currentY - 2);
          currentX += doc.getTextWidth(exponent);
          doc.setFontSize(normalSize);

          if (after) {
            doc.text(after, currentX, currentY);
          }
        }
        currentY += lineHeight;
        totalHeight += lineHeight;
      });

      return totalHeight;
    };

    const billingOrder = patientDetails.test_names
      ? patientDetails.test_names.split(",").map((name) => name.trim().toUpperCase())
      : [];

    const findBillingIndex = (testName) => {
      if (!testName || !billingOrder.length) return -1;
      const cleanName = testName.trim().toUpperCase();

      let idx = billingOrder.indexOf(cleanName);
      if (idx !== -1) return idx;

      const normName = cleanName.replace(/[^A-Z0-9]/g, "");
      idx = billingOrder.findIndex(boName => {
        const normBo = boName.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
        return normBo.includes(normName) || normName.includes(normBo);
      });
      if (idx !== -1) return idx;

      const words = cleanName.split(/[^A-Z0-9]/).filter(w => w.length >= 4);
      if (words.length > 0) {
        idx = billingOrder.findIndex(boName => {
          const boClean = boName.trim().toUpperCase();
          return words.some(word => boClean.includes(word));
        });
        if (idx !== -1) return idx;
      }

      return -1;
    };

    const sortTestsByBillingOrder = (testsArray, getNameFn) => {
      if (!testsArray || !testsArray.length || !billingOrder.length) return;
      testsArray.sort((a, b) => {
        let indexA = findBillingIndex(getNameFn(a));
        let indexB = findBillingIndex(getNameFn(b));

        if (indexA === -1) indexA = 999;
        if (indexB === -1) indexB = 999;

        return indexA - indexB;
      });
    };

    // Sort both testdetails and chc_tests_for_files
    sortTestsByBillingOrder(patientDetails.testdetails, (t) => t.testname || "");
    sortTestsByBillingOrder(patientDetails.chc_tests_for_files, (t) => t.testname || "");

    const safeFormatDate = (dateStr, formatStr, fallback = "N/A") => {
      try {
        if (!dateStr) return fallback;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return fallback;
        return format(date, formatStr);
      } catch (e) {
        return fallback;
      }
    };

    const drawArrowSymbol = (doc, x, y, direction) => {
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      if (direction === "up") {
        doc.line(x, y, x + 1, y - 1);
        doc.line(x + 1, y - 1, x + 2, y);
        doc.line(x + 1, y - 1, x + 1, y + 2);
      } else {
        doc.line(x, y, x + 1, y + 1);
        doc.line(x + 1, y + 1, x + 2, y);
        doc.line(x + 1, y + 1, x + 1, y - 2);
      }
    };

    const addHeaderFooter = (withNabl = false) => {
      if (withLetterpad) {
        doc.addImage(
          headerImage,
          "PNG",
          0,
          5,
          doc.internal.pageSize.width,
          headerHeight,
        );
        doc.addImage(
          FooterImage,
          "PNG",
          0,
          doc.internal.pageSize.height - footerHeight,
          doc.internal.pageSize.width,
          footerHeight,
        );
      }
      if (withNabl && NABLImage) {
        const nablLogoWidth = 20,
          nablLogoHeight = 20;
        const nablLogoX = doc.internal.pageSize.width - 45 - nablLogoWidth;
        doc.addImage(
          NABLImage,
          "PNG",
          nablLogoX,
          7,
          nablLogoWidth,
          nablLogoHeight,
        );
      }
    };

    const checkForNewPage = (yPos, estimatedHeight) => {
      const pageHeight = doc.internal.pageSize.height;
      if (yPos + estimatedHeight >= pageHeight - footerHeight - 30) {
        doc.addPage();
        pageCount++;
        addHeaderFooter(false);
        return headerHeight + 10;
      }
      return yPos;
    };

    const addMedicalExaminationHeader = (yPos) => {
      yPos += 15;
      doc.setFontSize(10);
      const leftCol = [
        { label: "Employee ID", value: patientDetails.patient_id || "N/A" },
        { label: "Employee Name", value: patientDetails.patientname || "N/A" },
        {
          label: "Age / Sex",
          value: `${patientDetails.age || "N/A"} / ${patientDetails.gender || "N/A"}`,
        },
      ];
      const rightCol = [
        {
          label: "Date",
          value: safeFormatDate(new Date().toISOString(), "dd/MM/yyyy"),
        },
        {
          label: "Approved Date",
          value: safeFormatDate(
            patientDetails.final_assessment?.approved_date ||
            patientDetails.testdetails?.[0]?.approve_time,
            "dd/MM/yyyy",
          ),
        },
        { label: "Ref. By", value: patientDetails.company_name || "N/A" },
        { label: "Barcode", value: patientDetails.barcode || "N/A" },
      ];
      for (let i = 0; i < Math.max(leftCol.length, rightCol.length); i++) {
        let lineHeight = 0;
        if (leftCol[i]) {
          doc.setFont("helvetica", "bold");
          doc.text(leftCol[i].label, leftMargin, yPos);
          doc.text(":", leftMargin + 40, yPos);
          doc.setFont("helvetica", "normal");
          if (leftCol[i].label === "Name") {
            const wt = doc.splitTextToSize(leftCol[i].value, 50);
            doc.text(wt, leftMargin + 45, yPos);
            lineHeight = Math.max(lineHeight, (wt.length - 1) * 5);
          } else {
            doc.text(leftCol[i].value, leftMargin + 45, yPos);
          }
        }
        if (rightCol[i]) {
          doc.setFont("helvetica", "bold");
          doc.text(rightCol[i].label, leftMargin + 100, yPos);
          doc.text(":", leftMargin + 125, yPos);
          doc.setFont("helvetica", "normal");
          if (rightCol[i].label === "Ref. By") {
            const wt = doc.splitTextToSize(rightCol[i].value, 65);
            doc.text(wt, leftMargin + 130, yPos);
            lineHeight = Math.max(lineHeight, (wt.length - 1) * 5);
          } else {
            doc.text(rightCol[i].value, leftMargin + 130, yPos);
          }
        }
        yPos += 6 + lineHeight;
      }
      return yPos + 10;
    };

    const addMedicalHistory = (yPos) => {
      yPos = checkForNewPage(yPos, 15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(
        "MEDICAL EXAMINATION REPORT",
        leftMargin + contentWidth / 2,
        yPos,
        { align: "center" },
      );
      yPos += 10;
      doc.setFontSize(10);
      const historyItems = [
        { label: "Department", value: patientDetails.department || "N/A" },
        {
          label: "DOJ",
          value: patientDetails.doj
            ? (() => {
              try {
                const d = new Date(patientDetails.doj);
                if (isNaN(d.getTime())) return "N/A";
                return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
              } catch {
                return "N/A";
              }
            })()
            : "N/A",
        },
        {
          label: "Employment Type",
          value: patientDetails.employee_type || "N/A",
        },
        {
          label: "Medical History",
          value:
            patientDetails.medical_history?.patient_history ||
            "Nil Significant",
        },
      ];
      historyItems.forEach((item) => {
        doc.setFont("helvetica", "bold");
        doc.text(item.label, leftMargin, yPos);
        doc.text(":", leftMargin + 50, yPos);
        doc.setFont("helvetica", "normal");
        if (item.label === "Medical History") {
          const lines = doc.splitTextToSize(item.value, contentWidth - 55);
          doc.text(lines, leftMargin + 55, yPos);
          yPos += lines.length * 6;
        } else {
          doc.text(item.value, leftMargin + 55, yPos);
          yPos += 6;
        }
      });

      if (patientDetails.dynamic_fields?.length > 0) {
        yPos += 5;
        patientDetails.dynamic_fields.forEach((field) => {
          yPos = checkForNewPage(yPos, 15);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.text(field.field_name || "Clinical Findings", leftMargin, yPos);
          yPos += 7;
          doc.setFontSize(10);
          if (field.field_values?.length > 0) {
            const colWidths = [55, contentWidth - 55];
            const tableStartX = leftMargin;
            const rowHeight = 8;
            const tableWidth = colWidths[0] + colWidths[1];
            doc.rect(tableStartX, yPos, tableWidth, rowHeight);
            doc.line(
              tableStartX + colWidths[0],
              yPos,
              tableStartX + colWidths[0],
              yPos + rowHeight,
            );
            doc.setFont("helvetica", "bold");
            doc.text("Parameter", tableStartX + 2, yPos + 5);
            doc.text("Finding", tableStartX + colWidths[0] + 2, yPos + 5);
            yPos += rowHeight;
            doc.setFont("helvetica", "normal");
            field.field_values.forEach((fv) => {
              yPos = checkForNewPage(yPos, rowHeight);
              const valueLines = doc.splitTextToSize(
                fv.value || "",
                colWidths[1] - 4,
              );
              const rowH = Math.max(rowHeight, valueLines.length * 5 + 3);
              doc.rect(tableStartX, yPos, tableWidth, rowH);
              doc.line(
                tableStartX + colWidths[0],
                yPos,
                tableStartX + colWidths[0],
                yPos + rowH,
              );
              doc.setFont("helvetica", "bold");
              doc.text(fv.key || "", tableStartX + 2, yPos + 5);
              doc.setFont("helvetica", "normal");
              doc.text(valueLines, tableStartX + colWidths[0] + 2, yPos + 5);
              yPos += rowH;
            });
            yPos += 4;
          }
        });
      }
      return yPos + 5;
    };

    const addGeneralExamination = (yPos) => {
      yPos = checkForNewPage(yPos, 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("VITALS", leftMargin, yPos);
      yPos += 10;
      doc.setFontSize(10);
      const colWidths = [55, 40, 45, 35];
      const tableStartX = leftMargin;
      const rowHeight = 8;
      const tableWidth =
        colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3];
      doc.rect(tableStartX, yPos, tableWidth, rowHeight);
      doc.line(
        tableStartX + colWidths[0],
        yPos,
        tableStartX + colWidths[0],
        yPos + rowHeight,
      );
      doc.line(
        tableStartX + colWidths[0] + colWidths[1],
        yPos,
        tableStartX + colWidths[0] + colWidths[1],
        yPos + rowHeight,
      );
      doc.line(
        tableStartX + colWidths[0] + colWidths[1] + colWidths[2],
        yPos,
        tableStartX + colWidths[0] + colWidths[1] + colWidths[2],
        yPos + rowHeight,
      );
      doc.setFont("helvetica", "bold");
      doc.text("Parameter", tableStartX + 2, yPos + 5);
      doc.text("Value", tableStartX + colWidths[0] + 2, yPos + 5);
      doc.text(
        "Normal Range",
        tableStartX + colWidths[0] + colWidths[1] + 2,
        yPos + 5,
      );
      doc.text(
        "Status",
        tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 2,
        yPos + 5,
      );
      yPos += rowHeight;
      const vitalSigns = [
        {
          param: "Height",
          value: (patientDetails.vitals?.height || "N/A") + " cms",
          range: "",
        },
        {
          param: "Weight",
          value: (patientDetails.vitals?.weight || "N/A") + " kgs",
          range: "",
        },
        {
          param: "BMI",
          value: (patientDetails.vitals?.bmi || "N/A") + " kg/m²",
          range: "18.5 - 24.9 kg/m²",
          status: patientDetails.vitals?.bmi_status || "N/A",
        },
        {
          param: "Blood Pressure",
          value: (patientDetails.vitals?.blood_pressure || "N/A") + " mmHg",
          range: "120/80 mmHg",
          status: patientDetails.vitals?.BP_status || "N/A",
        },
        {
          param: "Pulse Rate",
          value: (patientDetails.vitals?.spo2 || "N/A") + " bpm",
          range: "60 - 100 bpm",
          status: patientDetails.vitals?.spo2_status || "N/A",
        },
      ];
      doc.setFont("helvetica", "normal");
      vitalSigns.forEach((item) => {
        const rowY = yPos;
        doc.rect(tableStartX, rowY, tableWidth, rowHeight);
        doc.line(
          tableStartX + colWidths[0],
          rowY,
          tableStartX + colWidths[0],
          rowY + rowHeight,
        );
        doc.line(
          tableStartX + colWidths[0] + colWidths[1],
          rowY,
          tableStartX + colWidths[0] + colWidths[1],
          rowY + rowHeight,
        );
        doc.line(
          tableStartX + colWidths[0] + colWidths[1] + colWidths[2],
          rowY,
          tableStartX + colWidths[0] + colWidths[1] + colWidths[2],
          rowY + rowHeight,
        );
        doc.line(
          tableStartX +
          colWidths[0] +
          colWidths[1] +
          colWidths[2] +
          colWidths[3],
          rowY,
          tableStartX +
          colWidths[0] +
          colWidths[1] +
          colWidths[2] +
          colWidths[3],
          rowY + rowHeight,
        );
        doc.text(item.param, tableStartX + 2, rowY + 5);
        doc.text(item.value, tableStartX + colWidths[0] + 2, rowY + 5);
        doc.text(
          item.range || "",
          tableStartX + colWidths[0] + colWidths[1] + 2,
          rowY + 5,
        );
        if (item.status && item.status !== "N/A") {
          const isAbnormal = ["High", "Low", "Obese", "Overweight"].includes(
            item.status,
          );
          doc.setTextColor(isAbnormal ? 220 : 0, 0, 0);
          doc.setFont("helvetica", "bold");
          doc.text(
            item.status,
            tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 2,
            rowY + 5,
          );
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
        }
        yPos += rowHeight;
      });
      return yPos + 10;
    };

    const addMiscellaneousInvestigations = (yPos) => {
      yPos = checkForNewPage(yPos, 15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("MISCELLANEOUS", leftMargin, yPos);
      yPos += 10;
      doc.setFontSize(10);
      const chcTestsForMisc = patientDetails.chc_tests_for_files || [];
      const availedTests = chcTestsForMisc.filter((t) => {
        const hasContent =
          t.has_file || t.has_report || t.report?.trim() || t.notes?.trim();
        if (!hasContent) return false;
        const name = (t.testname || "").toLowerCase();
        return (
          !name.includes("optho") &&
          !name.includes("ophth") &&
          t.test_id !== "CHCT001"
        );
      });
      if (availedTests.length === 0) {
        doc.setFont("helvetica", "normal");
        doc.text("No miscellaneous investigations recorded.", leftMargin, yPos);
        return yPos + 10;
      }
      const maxWidth = 210 - leftMargin - 20 - 45;
      availedTests.forEach((test) => {
        const label = test.testname || "Unknown";
        let value = test.notes?.trim() || "";
        if (!value && test.report?.trim()) {
          value = test.report.split(/\.(?=\s|$)/)[0].trim();
          if (value && !value.endsWith(".")) value += ".";
        }
        if (!value) value = "Normal";
        yPos = checkForNewPage(yPos, 15);
        doc.setFont("helvetica", "bold");
        doc.text(label, leftMargin, yPos);
        doc.text(":", leftMargin + 40, yPos);
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(value, maxWidth);
        for (let i = 0; i < lines.length; i++) {
          if (i > 0) {
            yPos += 6;
            yPos = checkForNewPage(yPos, 6);
          }
          doc.text(lines[i], leftMargin + 45, yPos);
        }
        yPos += 6;
      });
      return yPos + 5;
    };

    const addOphthalmologyReport = (yPos) => {
      const chcOphthal = patientDetails.chc_ophthalmology;
      const legacyOphthal = patientDetails.ophthalmology;
      if (!chcOphthal && !legacyOphthal) return yPos;
      yPos = checkForNewPage(yPos, 70);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("OPHTHALMOLOGY REPORT", leftMargin, yPos);
      yPos += 10;
      const getEyes = (chcKey, legacyKey) => {
        if (chcOphthal) {
          const obj = chcOphthal[chcKey] || {};
          return { right: obj.right || "N/A", left: obj.left || "N/A" };
        }
        const obj = legacyOphthal?.[legacyKey] || {};
        return { right: obj.right || "N/A", left: obj.left || "N/A" };
      };
      const rows = [
        { label: "Distant Vision", eyes: getEyes("distance", "distance") },
        { label: "Near Vision", eyes: getEyes("nearVision", "near_vision") },
        {
          label: "Colour Vision",
          eyes: getEyes("colourVision", "color_vision"),
        },
        {
          label: "Ocular Movement",
          eyes: getEyes("ocularmovement", "ocularmovement"),
        },
      ];
      const tableX = leftMargin,
        tableWidth = 155;
      const col1Width = 52,
        col2Width = 51.5,
        col3Width = 51.5;
      const rowHeight = 10;
      doc.setLineWidth(0.3);
      doc.setFontSize(10);
      doc.rect(tableX, yPos, tableWidth, rowHeight * (rows.length + 1));
      doc.line(
        tableX + col1Width,
        yPos,
        tableX + col1Width,
        yPos + rowHeight * (rows.length + 1),
      );
      doc.line(
        tableX + col1Width + col2Width,
        yPos,
        tableX + col1Width + col2Width,
        yPos + rowHeight * (rows.length + 1),
      );
      for (let i = 1; i <= rows.length; i++)
        doc.line(
          tableX,
          yPos + rowHeight * i,
          tableX + tableWidth,
          yPos + rowHeight * i,
        );
      doc.setFont("helvetica", "bold");
      doc.text("Test", tableX + col1Width / 2 - 5, yPos + 6);
      doc.text("Right Eye", tableX + col1Width + col2Width / 2 - 10, yPos + 6);
      doc.text(
        "Left Eye",
        tableX + col1Width + col2Width + col3Width / 2 - 8,
        yPos + 6,
      );
      doc.setFont("helvetica", "normal");
      rows.forEach((row, idx) => {
        const ry = yPos + rowHeight * (idx + 1);
        doc.setFont("helvetica", "bold");
        doc.text(row.label, tableX + 5, ry + 6);
        doc.setFont("helvetica", "normal");
        const r = String(row.eyes.right),
          l = String(row.eyes.left);
        doc.text(
          r,
          tableX + col1Width + col2Width / 2 - doc.getTextWidth(r) / 2,
          ry + 6,
        );
        doc.text(
          l,
          tableX +
          col1Width +
          col2Width +
          col3Width / 2 -
          doc.getTextWidth(l) / 2,
          ry + 6,
        );
      });
      yPos = yPos + rowHeight * (rows.length + 1) + 10;
      const complaints =
        chcOphthal?.complaints?.trim() ||
        legacyOphthal?.patient_complaints?.trim();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Patient Complaints:", leftMargin, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const cl = doc.splitTextToSize(complaints || "Nil", contentWidth - 10);
      doc.text(cl, leftMargin, yPos);
      yPos += cl.length * 5 + 8;
      const remarks =
        chcOphthal?.remarks?.trim() || legacyOphthal?.remarks?.trim();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Remarks:", leftMargin, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const remarksTxt =
        remarks || "Both Eyes: Normal Vision. Review after 6 months or 1 year.";
      const rl = doc.splitTextToSize(remarksTxt, contentWidth - 10);
      doc.text(rl, leftMargin, yPos);
      yPos += rl.length * 5 + 10;
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      const vn =
        "This spectacle prescription is valid for correction, only for three months from the date of consultation.";
      const vl = doc.splitTextToSize(vn, contentWidth);
      doc.text(vl, leftMargin, yPos);
      return yPos + 15;
    };

    const addCHC012LabSummary = (yPos) => {
      const INLINE_TESTS_BY_NAME = {
        "GLUCOSE - RANDOM": { paramNames: "all" },
        "COMPLETE BLOOD COUNT": {
          paramNames: ["Haemoglobin", "Platelet Count"],
        },
        "VDRL/ RPR": { paramNames: "all" },
      };
      if (
        !patientDetails.testdetails ||
        patientDetails.testdetails.length === 0
      ) {
        yPos = checkForNewPage(yPos, 15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Lab Investigations", leftMargin, yPos);
        doc.text(":", leftMargin + 50, yPos);
        doc.setFont("helvetica", "normal");
        doc.text("Enclosed", leftMargin + 55, yPos);
        return yPos + 10;
      }
      const getHighLowStatus = (value, reference) => {
        if (!value || !reference) return null;
        const num = parseFloat(value);
        if (isNaN(num)) return null;
        if (reference.includes("-")) {
          const parts = reference.split("-").map((v) => parseFloat(v));
          if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            if (num < parts[0]) return "L";
            if (num > parts[1]) return "H";
          }
        } else if (reference.includes("<")) {
          const max = parseFloat(reference.replace("<", ""));
          if (!isNaN(max) && num > max) return "H";
        } else if (reference.includes(">")) {
          const min = parseFloat(reference.replace(">", ""));
          if (!isNaN(min) && num < min) return "L";
        }
        return null;
      };
      const rows = [];
      patientDetails.testdetails.forEach((test) => {
        const config = INLINE_TESTS_BY_NAME[test.testname];
        if (!config) return;
        if (config.paramNames === "all") {
          const src = test.value?.trim()
            ? test
            : test.parameters?.length > 0
              ? test.parameters[0]
              : test;
          rows.push({
            testname: test.testname || "Test",
            value: src.value || "",
            unit: src.unit || "",
            status: getHighLowStatus(src.value, src.reference_range),
            reference_range: src.reference_range || "",
          });
        } else {
          (test.parameters || []).forEach((p) => {
            if (config.paramNames.includes(p.name))
              rows.push({
                testname: p.name,
                value: p.value || "",
                unit: p.unit || "",
                status: getHighLowStatus(p.value, p.reference_range),
                reference_range: p.reference_range || "",
              });
          });
        }
      });
      yPos = checkForNewPage(yPos, 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Lab Investigations", leftMargin, yPos);
      yPos += 8;
      if (rows.length > 0) {
        doc.setFontSize(10);
        const colW = [
          contentWidth * 0.42,
          contentWidth * 0.2,
          contentWidth * 0.18,
          contentWidth * 0.2,
        ];
        const tableX = leftMargin;
        const rowH = 8;
        const tableW = colW.reduce((a, b) => a + b, 0);
        doc.rect(tableX, yPos, tableW, rowH);
        let cx = tableX;
        colW.forEach((w) => {
          cx += w;
          if (cx < tableX + tableW) doc.line(cx, yPos, cx, yPos + rowH);
        });
        doc.setFont("helvetica", "bold");
        const headers = ["Test Name", "Value", "Unit", "Reference"];
        let hx = tableX;
        headers.forEach((h, i) => {
          doc.text(h, hx + 2, yPos + 5);
          hx += colW[i];
        });
        yPos += rowH;
        doc.setFont("helvetica", "normal");
        rows.forEach((row) => {
          yPos = checkForNewPage(yPos, rowH);
          doc.rect(tableX, yPos, tableW, rowH);
          let rx = tableX;
          colW.forEach((w) => {
            rx += w;
            if (rx < tableX + tableW) doc.line(rx, yPos, rx, yPos + rowH);
          });
          doc.setFont("helvetica", "normal");
          doc.text(String(row.testname).substring(0, 34), tableX + 2, yPos + 5);
          const valueX = tableX + colW[0] + 2;
          const valueStr = String(row.value);
          doc.text(valueStr, valueX, yPos + 5);
          if (row.status === "H" || row.status === "L") {
            const indicatorX = valueX + doc.getTextWidth(valueStr) + 2;
            doc.setFont("helvetica", "bold");
            if (row.status === "H") {
              doc.setTextColor(220, 0, 0);
              doc.text("H", indicatorX + 3, yPos + 5);
              drawArrowSymbol(doc, indicatorX, yPos + 4, "up");
            } else {
              doc.setTextColor(0, 0, 220);
              doc.text("L", indicatorX + 3, yPos + 5);
              drawArrowSymbol(doc, indicatorX, yPos + 4, "down");
            }
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
          }
          doc.text(
            String(row.unit).substring(0, 10),
            tableX + colW[0] + colW[1] + 2,
            yPos + 5,
          );
          doc.text(
            String(row.reference_range).substring(0, 18),
            tableX + colW[0] + colW[1] + colW[2] + 2,
            yPos + 5,
          );
          yPos += rowH;
        });
        yPos += 4;
      }
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.text("Other Lab Reports are Enclosed", leftMargin, yPos);
      doc.setFont("helvetica", "normal");
      return yPos + 70;
    };

    const addLabInvestigations = (yPos) => {
      if (!patientDetails.testdetails?.length) return yPos;
      if (patientDetails.company_id === "CHC012")
        return addCHC012LabSummary(yPos);
      yPos = checkForNewPage(yPos, 15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Lab Investigations", leftMargin, yPos);
      doc.text(":", leftMargin + 50, yPos);
      doc.setFont("helvetica", "normal");
      doc.text("Enclosed", leftMargin + 55, yPos);
      return yPos + 10;
    };

    const addFinalAssessment = (yPos) => {
      yPos = checkForNewPage(yPos, 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      const impression =
        patientDetails.final_assessment?.impression ||
        "Reports within Normal Limits.";
      const remarks =
        patientDetails.final_assessment?.remarks ||
        "The above candidate was examined and found Medically Fit for the Job.";
      if (impression?.trim()) {
        const impressionLines = [
          ...new Set(
            impression
              .split("\n")
              .map((l) => l.trim())
              .filter((l) => l),
          ),
        ];
        doc.setFont("helvetica", "bold");
        doc.text("Impression", leftMargin, yPos);
        doc.text(":", leftMargin + 30, yPos);
        doc.setFont("helvetica", "normal");
        impressionLines.forEach((line) => {
          const wrapped = doc.splitTextToSize(line, contentWidth - 40);
          wrapped.forEach((wl) => {
            doc.text(wl, leftMargin + 35, yPos);
            yPos += 6;
          });
        });
        doc.setFont("helvetica", "bold");
        yPos += 4;
      }
      if (remarks?.trim()) {
        yPos += 4;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(remarks, leftMargin, yPos);
      }
      yPos += 8;
      const pageHeight = doc.internal.pageSize.height;
      if (yPos + 40 >= pageHeight - footerHeight) {
        doc.addPage();
        pageCount++;
        addHeaderFooter(false);
        yPos = headerHeight + 10;
      }
      const signatureX = leftMargin + 120;
      if (DRPS) doc.addImage(DRPS, "PNG", signatureX, yPos, 35, 25);
      yPos += 25;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Dr. P. PRABU SANKAR, MS, MRCS.", signatureX, yPos);
      yPos += 5;
      doc.text("GENERAL SURGEON", signatureX, yPos);
      yPos += 5;
      doc.text("Reg No. 80709", signatureX, yPos);
      yPos += 5;
      doc.text("Shanmuga Hospital Ltd, Salem-7.", signatureX, yPos);
      return yPos + 10;
    };

    // ORIGINAL addInvestigationFiles — used by single handlePrint (converts on the fly)
    const addInvestigationFiles = async () => {
      const files = patientDetails.investigation_files;
      const chcTestsOrder = patientDetails.chc_tests_for_files || [];
      if (!files) return;
      const pageHeight = doc.internal.pageSize.height;

      for (const test of chcTestsOrder) {
        const testNameLower = (test.testname || "").toLowerCase();
        if (
          testNameLower.includes("optho") ||
          testNameLower.includes("ophth") ||
          test.test_id === "CHCT001"
        )
          continue;
        const testEntry = files[test.test_id];
        if (!testEntry) continue;
        const label = testEntry.label || test.testname;
        const reportText = testEntry.report || test.report?.trim() || "";
        const notesText = testEntry.notes || test.notes?.trim() || "";
        const hasFiles = testEntry.files?.length > 0;
        if (!reportText && !notesText && !hasFiles) continue;
        const isXRay =
          testNameLower.includes("x-ray") ||
          testNameLower.includes("xray") ||
          testNameLower.includes("chest");
        const isEcho =
          testNameLower.includes("echo") ||
          testNameLower.includes("echocardiogram");

        const allImages = [];
        if (hasFiles) {
          for (const file of testEntry.files) {
            if (!file?.data) continue;
            try {
              const contentType = file.contentType || "";
              const filename = (file.filename || "").toLowerCase();
              const isPDF =
                contentType.includes("pdf") || filename.endsWith(".pdf");
              if (isPDF) {
                const pdfImages = await convertPdfToImages(file.data);
                pdfImages.forEach((img) => allImages.push(img));
              } else {
                let fmt = "PNG";
                if (
                  contentType.includes("jpeg") ||
                  contentType.includes("jpg") ||
                  filename.endsWith(".jpg") ||
                  filename.endsWith(".jpeg")
                )
                  fmt = "JPEG";
                allImages.push({
                  dataUri: `data:${contentType || "image/png"};base64,${file.data}`,
                  format: fmt,
                });
              }
            } catch (err) {
              console.error(`Error processing file in ${label}:`, err);
            }
          }
        }
        await _renderTestPages(
          label,
          reportText,
          notesText,
          allImages,
          isXRay,
          isEcho,
        );
      }
    };

    // FAST addInvestigationFiles — uses pre-converted images (used by batch handleOverallPrint)
    const addInvestigationFiles_Fast = async (preProc) => {
      if (!preProc) return;
      const chcTestsOrder = patientDetails.chc_tests_for_files || [];
      for (const test of chcTestsOrder) {
        const testNameLower = (test.testname || "").toLowerCase();
        if (
          testNameLower.includes("optho") ||
          testNameLower.includes("ophth") ||
          test.test_id === "CHCT001"
        )
          continue;
        const testEntry = preProc[test.test_id];
        if (!testEntry) continue;
        const label = testEntry.label || test.testname;
        const reportText = testEntry.report || "";
        const notesText = testEntry.notes || "";
        const allImages = testEntry.processedImages || [];
        if (!reportText && !notesText && !allImages.length) continue;
        const isXRay =
          testNameLower.includes("x-ray") ||
          testNameLower.includes("xray") ||
          testNameLower.includes("chest");
        const isEcho =
          testNameLower.includes("echo") ||
          testNameLower.includes("echocardiogram");
        await _renderTestPages(
          label,
          reportText,
          notesText,
          allImages,
          isXRay,
          isEcho,
        );
      }
    };

    // Shared page-rendering logic for both addInvestigationFiles variants
    const _renderTestPages = async (
      label,
      reportText,
      notesText,
      allImages,
      isXRay,
      isEcho,
    ) => {
      const pageHeight = doc.internal.pageSize.height;
      if (reportText) {
        doc.addPage();
        pageCount++;
        addHeaderFooter(false);
        let yPos = headerHeight + 10;
        yPos = addMedicalExaminationHeader(yPos);
        yPos += 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(label.toUpperCase(), leftMargin + contentWidth / 2, yPos, {
          align: "center",
        });
        yPos += 3;
        const titleWidth = doc.getTextWidth(label.toUpperCase());
        doc.setLineWidth(0.5);
        doc.line(
          leftMargin + contentWidth / 2 - titleWidth / 2,
          yPos,
          leftMargin + contentWidth / 2 + titleWidth / 2,
          yPos,
        );
        yPos += 12;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const normalizedReport = reportText
          .replace(/\\r\\n/g, "\n")
          .replace(/\r\n/g, "\n");
        const paragraphs = normalizedReport
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
        const allSentences = [];
        paragraphs.forEach((p) => {
          p.split(/\.(?=\s|$)/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
            .map((s) => (s.endsWith(".") ? s : s + "."))
            .forEach((s) => allSentences.push(s));
        });
        allSentences.forEach((sentence) => {
          const lines = doc.splitTextToSize(sentence, contentWidth - 10);
          doc.text(lines, leftMargin, yPos);
          yPos += lines.length * 5.5 + 4;
        });
        if (notesText) {
          yPos += 8;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("IMPRESSION:", leftMargin, yPos);
          yPos += 7;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          const impressionLines = doc.splitTextToSize(
            notesText,
            contentWidth - 10,
          );
          doc.text(impressionLines, leftMargin, yPos);
          yPos += impressionLines.length * 5.5 + 20;
          if (isXRay) {
            const sx = leftMargin + 120;
            if (Muhsina) doc.addImage(Muhsina, "PNG", sx, yPos, 35, 15);
            yPos += 20;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.text("DR. MUHSINA ABOOBAKER, MBBS, MDRD", sx, yPos);
            yPos += 5;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text("CONSULTANT RADIOLOGIST", sx, yPos);
            yPos += 5;
            doc.text("REG NO: 143512 (TNMC)", sx, yPos);
          }
          if (isEcho) {
            const sx = leftMargin + 110;
            if (drarun) doc.addImage(drarun, "PNG", sx, yPos, 40, 20);
            yPos += 20;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.text("Dr. ARUN KUMAR.B, MD(MED), DNB(CARDIO)", sx, yPos);
            yPos += 5;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text("CONSULTANT INTERVENTIONAL CARDIOLOGIST", sx, yPos);
            yPos += 5;
            doc.text("REG NO: 91581", sx, yPos);
            yPos += 5;
            doc.text("Shanmuga Hospital & Salem Cancer Institute", sx, yPos);
          }
        }
      }
      for (const img of allImages) {
        doc.addPage();
        pageCount++;
        addHeaderFooter(false);
        let imgYPos = headerHeight + 10;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(label.toUpperCase(), leftMargin + contentWidth / 2, imgYPos, {
          align: "center",
        });
        imgYPos += 3;
        const imgTitleWidth = doc.getTextWidth(label.toUpperCase());
        doc.setLineWidth(0.5);
        doc.line(
          leftMargin + contentWidth / 2 - imgTitleWidth / 2,
          imgYPos,
          leftMargin + contentWidth / 2 + imgTitleWidth / 2,
          imgYPos,
        );
        imgYPos += 5;
        const availableHeight = pageHeight - footerHeight - imgYPos - 5;
        try {
          doc.addImage(
            img.dataUri,
            img.format,
            leftMargin,
            imgYPos,
            contentWidth,
            availableHeight,
          );
        } catch (e) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.text(
            `[Image error: ${e.message}]`,
            leftMargin,
            imgYPos + availableHeight / 2,
          );
        }
      }
    };

    const addLaboratoryReports = () => {
      if (!patientDetails.testdetails?.length) return;
      const labTests = patientDetails.testdetails.filter(
        (t) =>
          ![
            "Audiometry",
            "Pulmonary Function Test",
            "Chest - XRay",
            "ECG",
            "Eye examination",
          ].includes(t.testname),
      );
      if (labTests.length === 0) return;
      const nablTrueTests = labTests.filter((t) => t.NABL === true);
      const nablFalseTests = labTests.filter((t) => t.NABL !== true);

      const departmentOrder = [
        "Haematology",
        "Coagulation",
        "Biochemistry",
        "Immunology",
        "Immunoassay",
        "Serology",
        "Clinical Pathology",
        "Clinical Chemistry",
        "Cytology",
        "Genetics",
        "Histopathology",
        "Immunohistochemistry",
        "Microbiology",
        "Molecular Biology",
      ];
      const unicodeMap = {
        μ: "µ",
        "×": "x",
        "÷": "/",
        "°": "°",
        "±": "±",
        "²": "²",
        "³": "³",
      };
      const processUnicodeText = (text) => {
        if (!text) return "";
        let t = text;
        t = t.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
          const ch = String.fromCharCode(parseInt(hex, 16));
          return unicodeMap[ch] || ch;
        });
        Object.keys(unicodeMap).forEach((k) => {
          t = t.replace(new RegExp(k, "g"), unicodeMap[k]);
        });
        return t;
      };
      const wrapText = (doc, text, maxWidth, startX, yPos, lineHeight = 4) => {
        if (!text) return 0;
        const split = doc.splitTextToSize(text, maxWidth);
        split.forEach((line, i) =>
          doc.text(line, startX, yPos + i * lineHeight),
        );
        return split.length * lineHeight;
      };
      const getHighLowStatus = (value, reference) => {
        if (!value || !reference) return null;
        const num = parseFloat(value);
        if (isNaN(num)) return null;
        if (reference.includes("-")) {
          const [min, max] = reference.split("-").map((v) => parseFloat(v));
          if (!isNaN(min) && !isNaN(max)) {
            if (num < min) return "L";
            if (num > max) return "H";
          }
        } else if (reference.includes("<")) {
          const max = parseFloat(reference.replace("<", ""));
          if (!isNaN(max) && num > max) return "H";
        } else if (reference.includes(">")) {
          const min = parseFloat(reference.replace(">", ""));
          if (!isNaN(min) && num < min) return "L";
        }
        return null;
      };
      const colWidths = [
        contentWidth * 0.28,
        contentWidth * 0.12,
        contentWidth * 0.05,
        contentWidth * 0.18,
        contentWidth * 0.1,
        contentWidth * 0.27,
        0,
      ];
      const drawTableHeader = (yPos) => {
        doc.line(leftMargin, yPos, rightMargin, yPos);
        yPos += 5;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const headers = [
          "Test",
          "Specimen",
          "",
          "Result",
          "Units",
          "Reference Range / Method",
          "",
        ];
        let xPos = leftMargin;
        headers.forEach((h, i) => {
          if (h) doc.text(h, xPos, yPos);
          xPos += colWidths[i];
        });
        yPos += 3;
        doc.line(leftMargin, yPos, rightMargin, yPos);
        yPos += 5;
        return yPos;
      };
      const addLabReportHeader = (yPos) => {
        doc.setFontSize(10);
        const firstTest = labTests[0];
        const rows = [
          [
            "Reg.ID",
            patientDetails.patient_id || "N/A",
            "Collected On",
            firstTest?.samplecollected_time
              ? safeFormatDate(
                firstTest.samplecollected_time,
                "dd MMM yy / HH:mm",
              )
              : "N/A",
          ],
          [
            "Name",
            patientDetails.patientname || "N/A",
            "Received On",
            firstTest?.received_time
              ? safeFormatDate(firstTest.received_time, "dd MMM yy / HH:mm")
              : "N/A",
          ],
          [
            "Age/Gender",
            `${patientDetails.age || "N/A"} / ${patientDetails.gender || "N/A"}`,
            "Approved Date",
            safeFormatDate(
              firstTest?.approve_time,
              "dd MMM yy / HH:mm",
              safeFormatDate(new Date().toISOString(), "dd MMM yy / HH:mm"),
            ),
          ],
        ];
        rows.forEach(([l1, v1, l2, v2]) => {
          doc.setFont("helvetica", "bold");
          doc.text(l1, leftMargin, yPos);
          doc.text(":", leftMargin + 30, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(v1, leftMargin + 35, yPos);
          doc.setFont("helvetica", "bold");
          doc.text(l2, leftMargin + 100, yPos);
          doc.text(":", leftMargin + 140, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(v2, leftMargin + 145, yPos);
          yPos += 5;
        });
        doc.setFont("helvetica", "bold");
        doc.text("Referral", leftMargin, yPos);
        doc.text(":", leftMargin + 30, yPos);
        doc.setFont("helvetica", "normal");
        const refByText =
          patientDetails.company_name || patientDetails.refby || "SELF";
        const wrappedRefBy = doc.splitTextToSize(refByText, 60);
        doc.text(wrappedRefBy, leftMargin + 35, yPos);
        yPos += wrappedRefBy.length * 5;
        return yPos + 5;
      };
      const addSignatures = () => {
        if (!activeConsultants.length) return;
        const signaturesY = doc.internal.pageSize.height - footerHeight - 35;
        const signatureWidth = 35,
          signatureSpacing = 60;
        const startX =
          rightMargin - activeConsultants.length * signatureSpacing;
        activeConsultants.forEach((consultant, index) => {
          const xPosition = startX + index * signatureSpacing;
          if (consultant[2])
            doc.addImage(
              consultant[2],
              "PNG",
              xPosition,
              signaturesY,
              signatureWidth,
              15,
            );
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text(consultant[0], xPosition, signaturesY + 20);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text(consultant[1], xPosition, signaturesY + 25);
        });
      };

      let sharedYPos = 0,
        sharedCheckFn = null;

      const renderTestGroup = (testsToRender, withNabl) => {
        if (!testsToRender.length) return;
        const checkForNewPageLab = (yPos, estimatedHeight) => {
          if (
            yPos + estimatedHeight >=
            doc.internal.pageSize.height - footerHeight - 35
          ) {
            addSignatures();
            doc.addPage();
            pageCount++;
            addHeaderFooter(withNabl);
            let newYPos = headerHeight + 10;
            newYPos = addLabReportHeader(newYPos);
            newYPos = drawTableHeader(newYPos);
            return newYPos;
          }
          return yPos;
        };
        const testsByDepartment = testsToRender.reduce((acc, test) => {
          const dept = test.department || "LABORATORY";
          (acc[dept] = acc[dept] || []).push(test);
          return acc;
        }, {});

        const getDeptMinBillingIndex = (deptName) => {
          const deptTests = testsToRender.filter(t => (t.department || "LABORATORY") === deptName);
          let minIndex = 999;
          deptTests.forEach(test => {
            let idx = findBillingIndex(test.testname);
            if (idx !== -1 && idx < minIndex) {
              minIndex = idx;
            }
          });
          return minIndex;
        };

        const sortedDepartments = Object.keys(testsByDepartment).sort(
          (a, b) => {
            if (billingOrder.length > 0) {
              const idxA = getDeptMinBillingIndex(a);
              const idxB = getDeptMinBillingIndex(b);
              if (idxA !== idxB) {
                return idxA - idxB;
              }
            }
            const ia = departmentOrder.indexOf(a),
              ib = departmentOrder.indexOf(b);
            if (ia !== -1 && ib !== -1) return ia - ib;
            if (ia !== -1) return -1;
            if (ib !== -1) return 1;
            return a.localeCompare(b);
          },
        );

        doc.addPage();
        pageCount++;
        addHeaderFooter(withNabl);
        let yPos = headerHeight + 10;
        yPos = addLabReportHeader(yPos);
        yPos = drawTableHeader(yPos);

        sortedDepartments.forEach((department) => {
          const verifiedBySet = new Set();
          testsByDepartment[department].forEach((t) => {
            if (t.verified_by?.trim()) verifiedBySet.add(t.verified_by);
          });
          const hasMultipleVerifiers = verifiedBySet.size > 1;

          testsByDepartment[department].forEach((test, testIndex) => {
            if (testIndex === 0) {
              yPos = checkForNewPageLab(yPos, 25);
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              const textWidth = doc.getTextWidth(department.toUpperCase());
              const centerX = leftMargin + contentWidth / 2;
              doc.text(department.toUpperCase(), centerX, yPos, {
                align: "center",
              });
              doc.line(
                centerX - textWidth / 2,
                yPos + 2,
                centerX + textWidth / 2,
                yPos + 2,
              );
              yPos += 10;
            }
            const paramsBySubtitle = {};
            (test.parameters || []).forEach((p) => {
              const sub = p.sub_title || "";
              (paramsBySubtitle[sub] = paramsBySubtitle[sub] || []).push(p);
            });

            yPos = checkForNewPageLab(yPos, 20);
            doc.setFontSize(10);
            const testNameText = test.testname;
            const valueText = test.value || "";
            const methodText = (test.method || "")
              .replace(/\bMethod\b/i, "")
              .trim();
            const hasParameters = test.parameters && test.parameters.length > 0;
            const testNameWidth = hasParameters ? contentWidth - 2 : colWidths[0] - 2;
            const testNameLines = wrapTextAndGetLines(doc, testNameText, testNameWidth);
            const valueLines = wrapTextAndGetLines(doc, valueText, colWidths[3] - 2);
            const refMethodText = [test.reference_range, methodText].filter(p => p && p.trim() !== "").join(" / ");
            const refMethodLines = wrapTextAndGetLines(doc, refMethodText, colWidths[5] - 2);
            const maxLines = Math.max(
              testNameLines.length,
              valueLines.length,
              refMethodLines.length,
            );
            const lineHeight = 4.5;
            const actualRowHeight = maxLines * lineHeight + 2;

            yPos = checkForNewPageLab(yPos, actualRowHeight);
            let xPos = leftMargin;
            doc.setFont("helvetica", "bold");
            renderWrappedText(
              doc,
              testNameText,
              testNameWidth,
              xPos,
              yPos,
              lineHeight,
            );

            if (!hasParameters) {
              xPos += colWidths[0];
              doc.setFont("helvetica", "normal");
              doc.text(test.specimen_type || "", xPos, yPos);
              xPos += colWidths[1];
              xPos += colWidths[2];
              const statusIndicator = test.isHigh
                ? "H"
                : test.isLow
                  ? "L"
                  : getHighLowStatus(valueText, test.reference_range);
              if (statusIndicator) {
                doc.setFont("helvetica", "bold");
                doc.setTextColor(
                  statusIndicator === "H" ? 255 : 0,
                  0,
                  statusIndicator === "L" ? 255 : 0,
                );
                renderValueWithSuperscript(
                  doc,
                  valueText,
                  xPos,
                  yPos,
                  colWidths[3] - 5,
                  lineHeight,
                );
                const valueWidth = doc.getTextWidth(valueText);
                if (valueWidth < colWidths[3] - 5)
                  drawArrowSymbol(
                    doc,
                    xPos + valueWidth + 2,
                    yPos - 1,
                    statusIndicator === "H" ? "up" : "down",
                  );
                doc.setTextColor(0, 0, 0);
                doc.setFont("helvetica", "normal");
              } else {
                renderValueWithSuperscript(
                  doc,
                  valueText,
                  xPos,
                  yPos,
                  colWidths[3] - 2,
                  lineHeight,
                );
              }
              xPos += colWidths[3];
              renderUnicodeText(test.unit || "", xPos, yPos);
              xPos += colWidths[4];
              renderWrappedText(
                doc,
                refMethodText,
                colWidths[5] - 2,
                xPos,
                yPos,
                lineHeight,
              );
            }

            yPos += actualRowHeight + (hasParameters ? 1.5 : 3.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);

            if (test.outsourced === true) {
              doc.setFont("helvetica", "italic");
              doc.setFontSize(8);
              yPos = checkForNewPageLab(yPos, 4);
              doc.text("(Outsourced)", leftMargin, yPos);
              yPos += 4;
            }

            if (!test.parameters || test.parameters.length === 0) {
              if (test.comment && test.comment.trim() !== "") {
                doc.setFont("helvetica", "italic");
                doc.setFontSize(8);
                const commentLines = wrapTextAndGetLines(doc, `Comment: ${test.comment}`, contentWidth);
                yPos = checkForNewPageLab(yPos, commentLines.length * 3.5 + 2);
                const commentHeight = renderWrappedText(
                  doc,
                  `Comment: ${test.comment}`,
                  contentWidth,
                  leftMargin,
                  yPos,
                  3.5,
                );
                yPos += commentHeight + 2;
              }
              if (test.notes && test.notes.trim() !== "") {
                doc.setFont("helvetica", "italic");
                doc.setFontSize(8);
                const notesLines = wrapTextAndGetLines(doc, `Notes: ${test.notes}`, contentWidth);
                yPos = checkForNewPageLab(yPos, notesLines.length * 3.5 + 2);
                const notesHeight = renderWrappedText(
                  doc,
                  `Notes: ${test.notes}`,
                  contentWidth,
                  leftMargin,
                  yPos,
                  3.5,
                );
                yPos += notesHeight + 2;
              }
            }

            Object.keys(paramsBySubtitle).forEach((subtitle) => {
              if (subtitle && subtitle.trim() !== "") {
                yPos = checkForNewPageLab(yPos, 25);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.text(subtitle, leftMargin, yPos);
                yPos += 6;
              }
              paramsBySubtitle[subtitle].forEach((currentTest) => {
                doc.setFontSize(10);
                const paramNameText = currentTest.name;
                const paramValueText = currentTest.value || "";
                const paramMethodText = (currentTest.method || "")
                  .replace(/\bMethod\b/i, "")
                  .trim();
                const paramNameLines = wrapTextAndGetLines(
                  doc,
                  paramNameText,
                  colWidths[0] - 2,
                );
                const paramValueLines = wrapTextAndGetLines(
                  doc,
                  paramValueText,
                  colWidths[3] - 2,
                );
                const paramRefMethodText = [currentTest.reference_range, paramMethodText].filter(p => p && p.trim() !== "").join(" / ");
                const paramRefMethodLines = wrapTextAndGetLines(
                  doc,
                  paramRefMethodText,
                  colWidths[5] - 2,
                );
                const paramMaxLines = Math.max(
                  paramNameLines.length,
                  paramValueLines.length,
                  paramRefMethodLines.length,
                );
                const paramLineHeight = 4.5;
                const paramRowHeight = paramMaxLines * paramLineHeight + 2;

                yPos = checkForNewPageLab(yPos, paramRowHeight);
                let xPos = leftMargin;
                doc.setFont("helvetica", "normal");
                renderWrappedText(
                  doc,
                  paramNameText,
                  colWidths[0] - 2,
                  xPos,
                  yPos,
                  paramLineHeight,
                );
                xPos += colWidths[0];
                doc.text(currentTest.specimen_type || "", xPos, yPos);
                xPos += colWidths[1];
                xPos += colWidths[2];

                const paramStatus = currentTest.isHigh
                  ? "H"
                  : currentTest.isLow
                    ? "L"
                    : getHighLowStatus(
                      paramValueText,
                      currentTest.reference_range,
                    );
                if (paramStatus) {
                  doc.setFont("helvetica", "bold");
                  doc.setTextColor(
                    paramStatus === "H" ? 255 : 0,
                    0,
                    paramStatus === "L" ? 255 : 0,
                  );
                  renderValueWithSuperscript(
                    doc,
                    paramValueText,
                    xPos,
                    yPos,
                    colWidths[3] - 5,
                    paramLineHeight,
                  );
                  const paramValueWidth = doc.getTextWidth(paramValueText);
                  if (paramValueWidth < colWidths[3] - 5)
                    drawArrowSymbol(
                      doc,
                      xPos + paramValueWidth + 2,
                      yPos - 1,
                      paramStatus === "H" ? "up" : "down",
                    );
                  doc.setTextColor(0, 0, 0);
                  doc.setFont("helvetica", "normal");
                } else {
                  renderValueWithSuperscript(
                    doc,
                    paramValueText,
                    xPos,
                    yPos,
                    colWidths[3] - 2,
                    paramLineHeight,
                  );
                }
                xPos += colWidths[3];
                renderUnicodeText(currentTest.unit || "", xPos, yPos);
                xPos += colWidths[4];
                renderWrappedText(
                  doc,
                  paramRefMethodText,
                  colWidths[5] - 2,
                  xPos,
                  yPos,
                  paramLineHeight,
                );
                yPos += paramRowHeight;

                if (currentTest.comment && currentTest.comment.trim() !== "") {
                  doc.setFont("helvetica", "italic");
                  doc.setFontSize(8);
                  const commentLines = wrapTextAndGetLines(doc, `Comment: ${currentTest.comment}`, contentWidth);
                  yPos = checkForNewPageLab(yPos, commentLines.length * 3.5 + 2);
                  const paramCommentHeight = renderWrappedText(
                    doc,
                    `Comment: ${currentTest.comment}`,
                    contentWidth,
                    leftMargin,
                    yPos,
                    3.5,
                  );
                  yPos += paramCommentHeight + 2;
                }
                if (currentTest.notes && currentTest.notes.trim() !== "") {
                  doc.setFont("helvetica", "italic");
                  doc.setFontSize(8);
                  const notesLines = wrapTextAndGetLines(doc, `Notes: ${currentTest.notes}`, contentWidth);
                  yPos = checkForNewPageLab(yPos, notesLines.length * 3.5 + 2);
                  const notesHeight = renderWrappedText(
                    doc,
                    `Notes: ${currentTest.notes}`,
                    contentWidth,
                    leftMargin,
                    yPos,
                    3.5,
                  );
                  yPos += notesHeight + 2;
                }
                yPos += 1;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
              });
            });

            if (test.parameters && test.parameters.length > 0 && test.notes && test.notes.trim() !== "") {
              doc.setFont("helvetica", "italic");
              doc.setFontSize(8);
              const testNotesLines = wrapTextAndGetLines(doc, `Notes: ${test.notes}`, contentWidth);
              yPos = checkForNewPageLab(yPos, testNotesLines.length * 3.5 + 2);
              const testNotesHeight = renderWrappedText(
                doc,
                `Notes: ${test.notes}`,
                contentWidth,
                leftMargin,
                yPos,
                3.5,
              );
              yPos += testNotesHeight + 2;
            }

            if (hasMultipleVerifiers && test.verified_by?.trim()) {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(10);
              doc.text(`Verified by: ${test.verified_by}`, leftMargin, yPos);
              yPos += 8;
            }
          });
          if (!hasMultipleVerifiers && verifiedBySet.size > 0) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(
              `Verified by: ${Array.from(verifiedBySet).join(", ")}`,
              leftMargin,
              yPos,
            );
            yPos += 8;
          }
          yPos += 4;
        });
        sharedYPos = yPos;
        sharedCheckFn = checkForNewPageLab;
      };

      if (nablTrueTests.length > 0) {
        renderTestGroup(nablTrueTests, true);
        if (nablFalseTests.length > 0) {
          addSignatures();
        }
      }
      if (nablFalseTests.length > 0) {
        renderTestGroup(nablFalseTests, false);
      }
      const ensureSpaceForFooter = (currentYPosition) => {
        const pageHeight = doc.internal.pageSize.height;
        const footerStart = pageHeight - (footerHeight + 35 - 1);
        if (currentYPosition + 5 >= footerStart) {
          addSignatures();
          doc.addPage();
          pageCount++;
          const finalNabl = nablFalseTests.length > 0 ? false : true;
          addHeaderFooter(finalNabl);
          let newYPos = headerHeight + 10;
          newYPos = addLabReportHeader(newYPos);
          newYPos = drawTableHeader(newYPos);
          return newYPos;
        }
        return currentYPosition;
      };

      if (sharedCheckFn) {
        sharedYPos = ensureSpaceForFooter(sharedYPos);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(
          "**End of the Report**",
          leftMargin + contentWidth / 2,
          sharedYPos + 4,
          { align: "center" },
        );
        addSignatures();
      }
    };

    // ── Assemble the PDF ──────────────────────────────────────────────────────
    addHeaderFooter(false);
    currentYPosition = addMedicalExaminationHeader(currentYPosition);
    currentYPosition = addMedicalHistory(currentYPosition);
    currentYPosition = addGeneralExamination(currentYPosition);
    currentYPosition = addMiscellaneousInvestigations(currentYPosition);
    currentYPosition = addOphthalmologyReport(currentYPosition);
    currentYPosition = addLabInvestigations(currentYPosition);
    currentYPosition = addFinalAssessment(currentYPosition);

    // Use pre-processed images in batch mode, original conversion in single print
    if (preProcessedFiles) {
      await addInvestigationFiles_Fast(preProcessedFiles);
    } else {
      await addInvestigationFiles();
    }

    addLaboratoryReports();

    // Page numbers
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount}`,
        leftMargin + contentWidth / 2,
        doc.internal.pageSize.height - footerHeight - 5,
        { align: "center" },
      );
    }

    return doc;
  };

  // ─── handlePrint (single patient — unchanged logic) ───────────────────────
  const handlePrint = async (patient, withLetterpad = true) => {
    try {
      setLoading(true);
      const response = await apiRequest(
        `${Labbaseurl}corporate_health_report/?barcode=${patient.barcode}`,
        "GET",
      );
      if (!response.success) {
        toast.error(response.error || "Failed to fetch patient details");
        setLoading(false);
        return null;
      }
      let patientDetails,
        signaturesData = [];
      if (response.data.patient_data && response.data.signatures) {
        patientDetails = response.data.patient_data;
        signaturesData = response.data.signatures;
      } else {
        patientDetails = response.data;
      }
      if (Array.isArray(patientDetails)) {
        patientDetails = {
          ...patientDetails[0],
          testdetails: patientDetails.flatMap((r) => r.testdetails || []),
        };
      }
      const invResult = await apiRequest(
        `${Labbaseurl}get_investigation_status/?barcode=${patient.barcode}`,
        "GET",
      );
      if (invResult.success && invResult.data)
        patientDetails = mergeInvestigationData(patientDetails, invResult.data);

      const chcTestsForFiles =
        invResult.success && invResult.data?.chc_tests?.length > 0
          ? invResult.data.chc_tests
          : investigationStatuses[patient.barcode]?.chc_tests || [];

      const investigationFiles = {};
      await Promise.all(
        chcTestsForFiles.map(async (test) => {
          investigationFiles[test.test_id] = {
            label: test.testname,
            report: test.report?.trim() || "",
            notes: test.notes?.trim() || "",
            files: [],
          };
          if (test.files?.length > 0) {
            const testFiles = await Promise.all(
              test.files.map((fileId) => fetchInvestigationFile(fileId)),
            );
            investigationFiles[test.test_id].files = testFiles.filter(Boolean);
          }
        }),
      );
      patientDetails.investigation_files = investigationFiles;
      patientDetails.chc_tests_for_files = chcTestsForFiles;
      patientDetails.test_names = patient.test_names;

      const designationMapping = {
        DESIG101: { position: 0, title: "Consultant Microbiologist" },
        DESIG100: { position: 1, title: "Consultant Pathologist" },
        DESIG099: { position: 2, title: "Consultant Biochemist" },
      };
      const consultants = [null, null, null];
      signaturesData.forEach((sig) => {
        const mapping = designationMapping[sig.designation];
        if (mapping)
          consultants[mapping.position] = [
            sig.employeeName,
            mapping.title,
            sig.signatureBase64
              ? `data:image/png;base64,${sig.signatureBase64}`
              : null,
          ];
      });
      const activeConsultants = consultants.filter((c) => c !== null);

      // Single print: no preProcessedFiles — converts on the fly
      const doc = await buildPdfDocument(
        patientDetails,
        activeConsultants,
        withLetterpad,
      );
      const patientID = patientDetails.patient_id || "Unknown";
      const pdfFileName = `MedicalReport_${patientID}_${patientDetails.patientname.replace(/\s+/g, "_")}.pdf`;
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = pdfFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
      setLoading(false);
      toast.success("Medical report generated successfully!");
      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("An unexpected error occurred while generating the PDF");
      setLoading(false);
      return null;
    }
  };

  // ─── handleOverallPrint (OPTIMIZED) ───────────────────────────────────────
  const handleOverallPrint = async (withLetterpad = true) => {
    // Use selected patients if any checkboxes are ticked, otherwise fall back to all filtered
    const patientsToPrint =
      selectedPrintCount > 0 ? printTargetPatients : filteredPatients;

    if (!patientsToPrint.length) {
      toast.error("No patients to print");
      return;
    }
    if (patientsToPrint.length > 100) {
      toast.warning("Please select ≤100 patients at a time.");
      return;
    }
    if (patientsToPrint.length > 20)
      toast.warning("Large number of records. This may take a while...");

    setLoading(true);

    try {
      const allBarcodes = patientsToPrint.map((p) => p.barcode).filter(Boolean);
      if (!allBarcodes.length) {
        toast.error("No valid barcodes found");
        setLoading(false);
        return;
      }

      // ── PHASE 1: Batch fetch report data (1 API call) ─────────────────────
      toast.info(`Fetching report data for ${allBarcodes.length} patients...`);
      let allPatientData = {};
      try {
        const result = await apiRequest(
          `${Labbaseurl}get_batch_corporate_health_reports/`,
          "POST",
          { barcodes: allBarcodes },
          { "Content-Type": "application/json" },
        );
        if (result.success) allPatientData = result.data.results || {};
        else toast.error("Batch fetch failed: " + result.error);
      } catch (err) {
        toast.error("Batch fetch error: " + err.message);
      }

      const validBarcodes = allBarcodes.filter(
        (bc) => allPatientData[bc] && !allPatientData[bc].error,
      );
      if (!validBarcodes.length) {
        toast.error("No valid patient data found");
        setLoading(false);
        return;
      }

      // ── PHASE 2: Batch fetch ALL investigation statuses (1 API call) ──────
      toast.info(`Fetching investigation data...`);
      let batchInvResults = {};
      try {
        const invRes = await apiRequest(
          `${Labbaseurl}get_batch_investigation_status/`,
          "POST",
          { barcodes: validBarcodes },
          { "Content-Type": "application/json" },
        );
        if (invRes.success) batchInvResults = invRes.data.results || {};
      } catch (e) {
        console.warn("Batch inv status failed:", e);
      }

      // ── PHASE 3: Fetch files + pre-convert PDFs to images IN PARALLEL ─────
      toast.info(`Fetching & converting files...`);
      const limit6 = pLimit(6);
      const fileDataMap = {};
      let filesDone = 0;

      await Promise.all(
        validBarcodes.map((bc) =>
          limit6(async () => {
            const invResult = batchInvResults[bc] || {};
            const chcTestsForFiles =
              invResult.chc_tests?.length > 0
                ? invResult.chc_tests
                : investigationStatuses[bc]?.chc_tests || [];

            // Fetch raw files for this barcode
            const investigationFiles = {};
            await Promise.all(
              chcTestsForFiles.map(async (test) => {
                investigationFiles[test.test_id] = {
                  label: test.testname,
                  report: test.report?.trim() || "",
                  notes: test.notes?.trim() || "",
                  files: [],
                };
                if (test.files?.length > 0) {
                  const fetched = await Promise.all(
                    test.files.map((fid) => fetchInvestigationFile(fid)),
                  );
                  investigationFiles[test.test_id].files =
                    fetched.filter(Boolean);
                }
              }),
            );

            // Pre-convert PDF pages → images (parallel within each barcode)
            const preProc = await preProcessInvestigationFiles(
              investigationFiles,
              chcTestsForFiles,
            );
            preProc._raw = investigationFiles;
            preProc._chcTests = chcTestsForFiles;
            fileDataMap[bc] = preProc;

            filesDone++;
            if (filesDone % 5 === 0 || filesDone === validBarcodes.length)
              toast.info(`Files ready: ${filesDone} / ${validBarcodes.length}`);
          }),
        ),
      );

      // ── PHASE 4: Build patientDetails objects ─────────────────────────────
      const designationMapping = {
        DESIG101: { position: 0, title: "Consultant Microbiologist" },
        DESIG100: { position: 1, title: "Consultant Pathologist" },
        DESIG099: { position: 2, title: "Consultant Biochemist" },
      };

      const patientDataList = validBarcodes.map((bc) => {
        const barcodeData = allPatientData[bc];
        const invResult = batchInvResults[bc] || {};
        let patientDetails = barcodeData.patient_data ?? barcodeData;
        const signaturesData = barcodeData.signatures ?? [];

        if (Object.keys(invResult).length) {
          patientDetails = mergeInvestigationData(patientDetails, {
            chc_tests: invResult.chc_tests || [],
            vitals: invResult.vitals || {},
            patient_history: invResult.patient_history || "",
          });
        }

        const fdEntry = fileDataMap[bc] || {};
        const matchingPatient = patientsToPrint.find((p) => p.barcode === bc);
        if (matchingPatient) {
          patientDetails.test_names = matchingPatient.test_names;
        }
        patientDetails.investigation_files = fdEntry._raw || {};
        patientDetails.chc_tests_for_files = fdEntry._chcTests || [];

        const consultants = [null, null, null];
        signaturesData.forEach((sig) => {
          const m = designationMapping[sig.designation];
          if (m)
            consultants[m.position] = [
              sig.employeeName,
              m.title,
              sig.signatureBase64
                ? `data:image/png;base64,${sig.signatureBase64}`
                : null,
            ];
        });

        return {
          patientDetails,
          activeConsultants: consultants.filter(Boolean),
          preProcessedFiles: fdEntry,
        };
      });

      // ── PHASE 5: Generate PDFs — 3 at a time ─────────────────────────────
      toast.info(`Generating ${patientDataList.length} PDFs...`);
      const zip = new JSZip();
      let successCount = 0,
        failCount = 0,
        completed = 0;
      const limit3 = pLimit(3);

      await Promise.all(
        patientDataList.map(
          ({ patientDetails, activeConsultants, preProcessedFiles }) =>
            limit3(async () => {
              try {
                const doc = await buildPdfDocument(
                  patientDetails,
                  activeConsultants,
                  withLetterpad,
                  preProcessedFiles,
                );
                const pdfBlob = doc.output("blob");
                const safeName = (
                  patientDetails.patientname || "Unknown"
                ).replace(/\s+/g, "_");
                zip.file(
                  `${patientDetails.patient_id}_${safeName}.pdf`,
                  pdfBlob,
                );
                successCount++;
              } catch (err) {
                failCount++;
                console.error(
                  `PDF failed for ${patientDetails.patient_id}:`,
                  err,
                );
              } finally {
                completed++;
                if (completed % 3 === 0 || completed === patientDataList.length)
                  toast.info(`PDFs: ${completed} / ${patientDataList.length}`);
              }
            }),
        ),
      );

      // ── PHASE 6: Create ZIP and download ──────────────────────────────────
      if (successCount > 0) {
        toast.info("Creating ZIP...");
        const zipBlob = await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 3 },
        });
        saveAs(
          zipBlob,
          `CHC_Reports_${format(startDate, "yyyy-MM-dd")}_to_${format(endDate, "yyyy-MM-dd")}.zip`,
        );
        toast.success(
          `✅ ${successCount} reports downloaded!${failCount ? ` (${failCount} failed)` : ""}`,
        );
        clearSelection(); // reset checkboxes after successful download
      } else {
        toast.error("No PDFs could be generated.");
      }
    } catch (err) {
      console.error("Overall print error:", err);
      toast.error("Failed: " + (err.message || "Unknown error"));
    }

    setLoading(false);
  };

  // ─── Excel export ─────────────────────────────────────────────────────────
  const handleExportToExcel = async () => {
    try {
      setLoading(true);
      const barcodes = filteredPatients.map((p) => p.barcode).filter(Boolean);
      if (!barcodes.length) {
        toast.error("No patients with barcodes found");
        setLoading(false);
        return;
      }
      const excelData = filteredPatients.map((patient) => {
        const bc = patient.barcode;
        const invData = investigationStatuses[bc] || {};
        const chcTests = invData.chc_tests || {};
        const chcTestColumns = {};
        chcTests.forEach &&
          chcTests.forEach((test) => {
            const collected = test.has_file || test.has_report;
            chcTestColumns[`${test.testname} - Collection`] = collected
              ? "Collected"
              : "Pending";
            chcTestColumns[`${test.testname} - Approval`] =
              test.status?.toLowerCase() === "approved"
                ? "Approved"
                : "Pending";
          });
        return {
          Date: patient.date
            ? format(new Date(patient.date), "yyyy-MM-dd")
            : "N/A",
          "Employee ID": patient.patient_id || "N/A",
          Barcode: bc || "N/A",
          "Employee Name": patient.patient_name || "N/A",
          Gender: patient.gender || "N/A",
          Age: patient.age || "N/A",
          Branch: patient.branch || "N/A",
          "Test Names": patient.test_names || "N/A",
          "No of Tests": patient.no_of_tests || 0,
          "Overall Status": patient.status || "N/A",
          ...chcTestColumns,
          "Lab Approval": invData.lab_approval || "N/A",
        };
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      ws["!cols"] = Object.keys(excelData[0] || {}).map(() => ({ wch: 18 }));
      XLSX.utils.book_append_sheet(wb, ws, "CHC Report");
      XLSX.writeFile(
        wb,
        `CHC_Report_${format(startDate, "yyyy-MM-dd")}_to_${format(endDate, "yyyy-MM-dd")}.xlsx`,
      );
      setLoading(false);
      toast.success(`Excel report exported! (${excelData.length} records)`);
    } catch (error) {
      toast.error(
        "Failed to export Excel: " + (error.message || "Unknown error"),
      );
      setLoading(false);
    }
  };

  // ─── Checkbox selection helpers ───────────────────────────────────────────
  const approvedFilteredPatients = filteredPatients.filter((p) =>
    isPrintAndMailEnabled(statuses[p.patient_id]?.status || ""),
  );

  const isAllSelected =
    approvedFilteredPatients.length > 0 &&
    approvedFilteredPatients.every((p) => selectedBarcodes.has(p.barcode));

  const isIndeterminate =
    !isAllSelected &&
    approvedFilteredPatients.some((p) => selectedBarcodes.has(p.barcode));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all approved rows
      setSelectedBarcodes((prev) => {
        const next = new Set(prev);
        approvedFilteredPatients.forEach((p) => next.delete(p.barcode));
        return next;
      });
    } else {
      // Select all approved rows
      setSelectedBarcodes((prev) => {
        const next = new Set(prev);
        approvedFilteredPatients.forEach((p) => {
          if (p.barcode) next.add(p.barcode);
        });
        return next;
      });
    }
  };

  const toggleSelectOne = (barcode) => {
    setSelectedBarcodes((prev) => {
      const next = new Set(prev);
      next.has(barcode) ? next.delete(barcode) : next.add(barcode);
      return next;
    });
  };

  const clearSelection = () => setSelectedBarcodes(new Set());

  // ─── UI helpers ───────────────────────────────────────────────────────────
  const openModal = (patient) => {
    setSelectedPatient(patient);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPatient(null);
  };
  const openTestModal = (patient) => {
    setSelectedPatient(patient);
    setIsTestModalOpen(true);
  };
  const getBadgeColor = (status) => {
    switch (status) {
      case "Approved":
        return "#69b444ff";
      case "Pending":
        return "#FFBB33";
      default:
        return "#0f999eff";
    }
  };
  const allPatientsApproved =
    filteredPatients.length > 0 &&
    filteredPatients.every(
      (p) => (statuses[p.patient_id]?.status || "") === "Approved",
    );

  // Patients to print: selected ones if any are checked, else all filtered approved
  const selectedPrintCount = selectedBarcodes.size;
  const printTargetPatients =
    selectedPrintCount > 0
      ? filteredPatients.filter((p) => selectedBarcodes.has(p.barcode))
      : filteredPatients;

  const canOverallPrint =
    !loading &&
    (selectedPrintCount > 0
      ? printTargetPatients.every((p) =>
        isPrintAndMailEnabled(statuses[p.patient_id]?.status || ""),
      )
      : allPatientsApproved);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Container>
      <GlobalStyle />
      <Card>
        <CardHeader>
          <Title>Corporate Health Checkup - Approval Report</Title>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <PrintDropdown
              onMouseEnter={(e) =>
                canOverallPrint &&
                showDropdown("overall", "overallPrint", e)
              }
              onMouseLeave={hideDropdown}
            >
              <OverallPrintButton
                disabled={!canOverallPrint}
                title={
                  selectedPrintCount > 0
                    ? `Print ${selectedPrintCount} selected report(s)`
                    : "Download all filtered approved reports as ZIP"
                }
              >
                <Download size={16} />
                {selectedPrintCount > 0
                  ? `Print Selected (${selectedPrintCount})`
                  : `Overall Print (${filteredPatients.length})`}
              </OverallPrintButton>
            </PrintDropdown>
            <ExportButton
              onClick={handleExportToExcel}
              disabled={loading || filteredPatients.length === 0}
            >
              <Download size={16} /> Export to Excel
            </ExportButton>
          </div>
        </CardHeader>

        <FiltersContainer>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Start Date</FilterLabel>
              <FilterInput
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))} max={endDate ? endDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>End Date</FilterLabel>
              <FilterInput
                type="date"
                value={endDate.toISOString().split("T")[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))} min={startDate ? startDate.toISOString().split("T")[0] : undefined} max={new Date().toISOString().split("T")[0]}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Employee ID</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter Employee ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Barcode</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter Barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Employee Name</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter employee name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Branch Name</FilterLabel>
              <FilterSelect
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
              >
                <option value="">All Branches</option>
                {branchNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Approval Status</FilterLabel>
              <FilterSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Investigation Status</FilterLabel>
              <FilterSelect
                value={investigationStatusFilter}
                onChange={(e) => setInvestigationStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="All Approved">All Approved</option>
                <option value="Pending">Pending</option>
              </FilterSelect>
            </FilterGroup>
          </FilterRow>
          <ButtonContainer>
            <ClearButton onClick={clearFilters}>
              <X size={16} /> Clear Filters
            </ClearButton>
          </ButtonContainer>
        </FiltersContainer>
        <StatsGrid>
          <StatCard>
            <StatLabel>
              <StatDot color="#4cc9f0" />
              Auto approvals
            </StatLabel>
            <StatValue color="#0891b2">{approvalCounts.auto}</StatValue>
            <StatSub>All criteria met automatically</StatSub>
          </StatCard>

          <StatCard>
            <StatLabel>
              <StatDot color="#4361ee" />
              Manual approvals
            </StatLabel>
            <StatValue color="#3730a3">{approvalCounts.manualTotal}</StatValue>
            <StatSub>Approved via overall approval</StatSub>
            {Object.keys(approvalCounts.manualByName).length > 0 && (
              <ManualNameList>
                {Object.entries(approvalCounts.manualByName)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, count]) => (
                    <ManualNameRow key={name}>
                      <span>{name}</span>
                      <ManualNameCount>{count}</ManualNameCount>
                    </ManualNameRow>
                  ))}
              </ManualNameList>
            )}
          </StatCard>

          <StatCard>
            <StatLabel>
              <StatDot color="#6c757d" />
              Total approved
            </StatLabel>
            <StatValue>{approvalCounts.total}</StatValue>
            <StatSub>Out of {filteredPatients.length} filtered records</StatSub>
          </StatCard>

          <StatCard>
            <StatLabel>
              <StatDot color="#f72585" />
              Pending
            </StatLabel>
            <StatValue color="#be123c">
              {filteredPatients.length - approvalCounts.total}
            </StatValue>
            <StatSub>Awaiting approval</StatSub>
          </StatCard>
        </StatsGrid>

        {selectedBarcodes.size > 0 && (
          <SelectionBar>
            <span>
              ✓ {selectedBarcodes.size} row
              {selectedBarcodes.size !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={clearSelection}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                cursor: "pointer",
                fontSize: "0.8rem",
                textDecoration: "underline",
              }}
            >
              Clear selection
            </button>
          </SelectionBar>
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <th style={{ width: "40px", textAlign: "center" }}>
                  <StyledCheckbox
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={toggleSelectAll}
                    title={
                      isAllSelected ? "Deselect all" : "Select all approved"
                    }
                  />
                </th>
                <th>Date</th>
                <th>Employee ID</th>
                <th>Barcode</th>
                <th>Employee Name</th>
                <th>Company Name</th>
                <th>CHC Investigation Status</th>
                <th>Approval Status</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Loading patient data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--danger)",
                    }}
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  const patientStatus = statuses[patient.patient_id] || {};
                  const status = patientStatus.status || "Loading...";
                  const bc = patientStatus.barcode || "N/A";
                  const isPrintMailEnabled = isPrintAndMailEnabled(status);
                  const badgeColor = getBadgeColor(status);
                  const isChecked = selectedBarcodes.has(patient.barcode);
                  return (
                    <tr
                      key={patient.patient_id}
                      style={
                        isChecked
                          ? { backgroundColor: "rgba(67,97,238,0.07)" }
                          : {}
                      }
                    >
                      <td style={{ textAlign: "center" }}>
                        <StyledCheckbox
                          checked={isChecked}
                          disabled={!isPrintMailEnabled}
                          onChange={() =>
                            isPrintMailEnabled &&
                            toggleSelectOne(patient.barcode)
                          }
                          title={
                            !isPrintMailEnabled
                              ? "Only approved patients can be selected"
                              : ""
                          }
                        />
                      </td>
                      <td>
                        {patient.date
                          ? format(new Date(patient.date), "yyyy-MM-dd")
                          : "N/A"}
                      </td>
                      <td>{patient.patient_id}</td>
                      <td>{bc}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <GenderIcon gender={patient.gender}>
                            {patient.gender === "Female" ? (
                              <IoIosFemale size={14} />
                            ) : (
                              <IoIosMale size={14} />
                            )}
                          </GenderIcon>
                          {patient.patient_name}
                        </div>
                      </td>
                      <td>{patient.branch_name}</td>
                      <td>
                        <InvestigationStatusDisplay>
                          {getPendingInvestigations(
                            investigationStatuses[patient.barcode],
                          )}
                        </InvestigationStatusDisplay>
                      </td>
                      <td>
                        <Badge color={badgeColor}>{status}</Badge>
                      </td>
                      <td>
                        <ActionContainer>
                          <ActionButton
                            onClick={() => openTestModal(patient)}
                            disabled={status === "Approved"}
                            title="Sort Tests"
                          >
                            <List size={16} />
                          </ActionButton>
                          <PrintDropdown
                            onMouseEnter={(e) =>
                              isPrintMailEnabled &&
                              showDropdown(patient.barcode, "print", e)
                            }
                            onMouseLeave={hideDropdown}
                          >
                            <ActionButton
                              disabled={!isPrintMailEnabled}
                              title="Print Options"
                            >
                              <Printer size={16} />
                            </ActionButton>
                          </PrintDropdown>
                        </ActionContainer>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9}>
                    <NoData>No patients found</NoData>
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <div
          style={{
            padding: "1rem 1.5rem",
            textAlign: "right",
            color: "var(--gray)",
            fontSize: "0.875rem",
            borderTop: "1px solid var(--gray-light)",
          }}
        >
          Showing {filteredPatients.length}{" "}
          {filteredPatients.length === 1 ? "entry" : "entries"}
        </div>
      </Card>

      {isTestModalOpen && (
        <CHCApproval
          patient={selectedPatient}
          onClose={() => setIsTestModalOpen(false)}
          onApprovalSaved={handleApprovalSaved}
        />
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
          content: {
            width: "800px",
            height: "fit-content",
            position: "absolute",
            left: "400px",
            right: "auto",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            overflowY: "auto",
          },
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "15px",
            right: "20px",
            cursor: "pointer",
            fontSize: "20px",
            color: "#333",
          }}
          onClick={closeModal}
        >
          <IoMdClose />
        </div>
        {selectedPatient && (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          />
        )}
      </Modal>

      {activeDropdownPatientId &&
        activeDropdownType === "print" &&
        ReactDOM.createPortal(
          <PortalDropdownMenu
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onMouseEnter={() => {
              setActiveDropdownPatientId(activeDropdownPatientId);
              setActiveDropdownType(activeDropdownType);
            }}
            onMouseLeave={hideDropdown}
          >
            <DropdownItem
              onClick={() => {
                const p = patients.find((pat) => pat.barcode === activeDropdownPatientId);
                if (p) handlePrint(p, true);
                hideDropdown();
              }}
            >
              Print with Letterpad
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                const p = patients.find((pat) => pat.barcode === activeDropdownPatientId);
                if (p) handlePrint(p, false);
                hideDropdown();
              }}
            >
              Print without Letterpad
            </DropdownItem>
          </PortalDropdownMenu>,
          document.body,
        )}

      {activeDropdownPatientId === "overall" &&
        activeDropdownType === "overallPrint" &&
        ReactDOM.createPortal(
          <PortalDropdownMenu
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onMouseEnter={() => {
              setActiveDropdownPatientId("overall");
              setActiveDropdownType("overallPrint");
            }}
            onMouseLeave={hideDropdown}
          >
            <DropdownItem
              onClick={() => {
                handleOverallPrint(true);
                hideDropdown();
              }}
            >
              {selectedPrintCount > 0 ? "Print Selected with Letterpad" : "Print with Letterpad"}
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                handleOverallPrint(false);
                hideDropdown();
              }}
            >
              {selectedPrintCount > 0 ? "Print Selected without Letterpad" : "Print without Letterpad"}
            </DropdownItem>
          </PortalDropdownMenu>,
          document.body,
        )}
    </Container>
  );
};

export default CHCReport;
