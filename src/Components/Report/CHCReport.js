"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
  background-color: ${(props) => props.color || "var(--gray)"};
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
  background-color: ${(props) =>
    props.disabled ? "var(--gray-light)" : "white"};
  color: ${(props) => (props.disabled ? "var(--gray)" : "var(--dark)")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: var(--transition);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.disabled
        ? "0 2px 4px rgba(0,0,0,0.1)"
        : "0 4px 8px rgba(0,0,0,0.1)"};
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
  background-color: ${(props) =>
    props.gender === "Female" ? "rgba(232,62,140,0.1)" : "rgba(0,123,255,0.1)"};
  color: ${(props) => (props.gender === "Female" ? "#E83E8C" : "#007BFF")};
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

// ─── Component ────────────────────────────────────────────────────────────────
const CHCReport = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [investigationStatuses, setInvestigationStatuses] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activeDropdownPatientId, setActiveDropdownPatientId] = useState(null);
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
  const navigate = useNavigate();
  const location = useLocation();
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const hasPendingInvestigations = (bc) => {
    const data = investigationStatuses[bc];
    if (!data) return false;
    // If lab is pending, the whole thing is pending
    if (data.lab_approval?.toLowerCase() === "pending") return true;
    const chcTests = data.chc_tests || [];
    if (chcTests.length === 0) return false;
    return chcTests.some(
      (t) =>
        !(t.has_file || t.has_report) || t.status?.toLowerCase() !== "approved",
    );
  };

  const getPendingInvestigations = (statusData) => {
    if (!statusData) return <span className="all-approved">All Approved</span>;

    const labPending = statusData.lab_approval?.toLowerCase() === "pending";
    const chcTests = statusData.chc_tests || [];

    if (chcTests.length === 0 && !labPending)
      return <span className="all-approved">No CHC Tests</span>;

    const chcAllDone =
      chcTests.length === 0 ||
      chcTests.every(
        (t) =>
          (t.has_file || t.has_report) &&
          t.status?.toLowerCase() === "approved",
      );

    if (!labPending && chcAllDone)
      return <span className="all-approved">All Approved</span>;

    return (
      <>
        {labPending && (
          <div>
            Lab Tests
            <span className="pending-label">Pending</span>
          </div>
        )}
        {chcTests.map((test, index) => {
          const collected = test.has_file || test.has_report;
          const approved = test.status?.toLowerCase() === "approved";
          if (collected && approved) return null;
          const label = !collected ? "Not Collected" : "Not Approved";
          return (
            <div key={index}>
              {test.testname}
              <span className="pending-label">{label}</span>
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
            lab_approval: patient.lab_approval || "Pending", // ← ADD THIS
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

  // Derive unique branch names from fetched patients
  const branchNames = useMemo(() => {
    const names = patients.map((p) => p.branch_name).filter(Boolean);
    return [...new Set(names)].sort();
  }, [patients]);

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

  const convertPdfToImages = async (base64Data) => {
    try {
      const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "").trim();
      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++)
        bytes[i] = binaryString.charCodeAt(i);

      // No cMapUrl / verbosity — avoids CDN version mismatch errors
      const loadingTask = pdfjsLib.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;

      const images = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        images.push(canvas.toDataURL("image/png"));
      }
      return images;
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

  // ─── mergeInvestigationData ───────────────────────────────────────────────
  const mergeInvestigationData = (patientDetails, invStatus) => {
    if (!invStatus) return patientDetails;
    const merged = { ...patientDetails };

    // Vitals
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

    // Patient history
    const history = invStatus.patient_history;
    if (history && history.trim())
      merged.medical_history = {
        ...(merged.medical_history || {}),
        patient_history: history,
      };

    // Investigation notes from chc_tests
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

    // Extract ophthalmology from CHCT001 in chc_tests
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
        // report is plain text, not JSON — leave chc_ophthalmology unset
        // addOphthalmologyReport will fall back to patientDetails.ophthalmology
      }
    }

    return merged;
  };

  // ─── buildPdfDocument ─────────────────────────────────────────────────────
  // Shared PDF-building logic used by both handlePrint and generateSimplePDFFromData.
  // patientDetails must already have:
  //   .vitals, .medical_history, .investigation_notes, .chc_tests_for_files,
  //   .investigation_files, .chc_ophthalmology (optional), .ophthalmology (optional),
  //   .testdetails, .final_assessment
  // activeConsultants: [[name, title, signatureDataUri|null], ...]
  // ─── buildPdfDocument ─────────────────────────────────────────────────────
  // ALL inner functions use closure variables (doc, patientDetails, leftMargin,
  // contentWidth, rightMargin, headerHeight, footerHeight, checkForNewPage, etc.)
  // so they all take only (yPos) as their argument.
  const buildPdfDocument = async (
    patientDetails,
    activeConsultants = [],
    withLetterpad = true,
  ) => {
    const doc = new jsPDF();
    let pageCount = 1;
    const leftMargin = 15;
    const rightMargin = leftMargin + 180;
    const contentWidth = rightMargin - leftMargin;
    const headerHeight = 25;
    const footerHeight = 15;
    let currentYPosition = headerHeight + 10;

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

    // ── Header / Footer ──────────────────────────────────────────────────────
    // withNabl = true  → show NABL logo (lab investigation pages only)
    // withNabl = false → no NABL logo (all other pages)
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
        if (withNabl && NABLImage) {
          const nablLogoWidth = 20;
          const nablLogoHeight = 20;
          const nablLogoX = doc.internal.pageSize.width - 45 - nablLogoWidth;
          const nablLogoY = 7;
          doc.addImage(
            NABLImage,
            "PNG",
            nablLogoX,
            nablLogoY,
            nablLogoWidth,
            nablLogoHeight,
          );
        }
        doc.addImage(
          FooterImage,
          "PNG",
          0,
          doc.internal.pageSize.height - footerHeight,
          doc.internal.pageSize.width,
          footerHeight,
        );
      }
    };

    // Non-lab pages never get NABL logo
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

    // ── Patient info header ──────────────────────────────────────────────────
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

    // ── Medical history ──────────────────────────────────────────────────────
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
                  const day = String(d.getDate()).padStart(2, "0");
                  const month = String(d.getMonth() + 1).padStart(2, "0");
                  const year = d.getFullYear();
                  return `${day}/${month}/${year}`;
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

      if (
        patientDetails.dynamic_fields &&
        patientDetails.dynamic_fields.length > 0
      ) {
        yPos += 5;
        patientDetails.dynamic_fields.forEach((field) => {
          yPos = checkForNewPage(yPos, 15);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.text(field.field_name || "Clinical Findings", leftMargin, yPos);
          yPos += 7;
          doc.setFontSize(10);

          if (field.field_values && field.field_values.length > 0) {
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

    // ── Vitals ───────────────────────────────────────────────────────────────
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

    // ── Miscellaneous ────────────────────────────────────────────────────────
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

    // ── Ophthalmology ────────────────────────────────────────────────────────
    const addOphthalmologyReport = (yPos) => {
      const chcOphthal = patientDetails.chc_ophthalmology;
      const legacyOphthal = patientDetails.ophthalmology;
      const hasEither = chcOphthal || legacyOphthal;
      if (!hasEither) return yPos;

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

      const tableX = leftMargin;
      const tableWidth = 155;
      const col1Width = 52,
        col2Width = 51.5,
        col3Width = 51.5;
      const rowHeight = 10;
      const totalRows = rows.length;

      doc.setLineWidth(0.3);
      doc.setFontSize(10);
      doc.rect(tableX, yPos, tableWidth, rowHeight * (totalRows + 1));
      doc.line(
        tableX + col1Width,
        yPos,
        tableX + col1Width,
        yPos + rowHeight * (totalRows + 1),
      );
      doc.line(
        tableX + col1Width + col2Width,
        yPos,
        tableX + col1Width + col2Width,
        yPos + rowHeight * (totalRows + 1),
      );
      for (let i = 1; i <= totalRows; i++)
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
        const r = String(row.eyes.right);
        const l = String(row.eyes.left);
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

      yPos = yPos + rowHeight * (totalRows + 1) + 10;

      const complaints =
        chcOphthal?.complaints?.trim() ||
        legacyOphthal?.patient_complaints?.trim();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Patient Complaints:", leftMargin, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const complaintsTxt = complaints || "Nil";
      const cl = doc.splitTextToSize(complaintsTxt, contentWidth - 10);
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

    // ── CHC012 Lab Summary (inline table) ────────────────────────────────────
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
          const status = getHighLowStatus(test.value, test.reference_range);
          rows.push({
            testname: test.testname || "Test",
            value: test.value || "",
            unit: test.unit || "",
            status,
            reference_range: test.reference_range || "",
          });
        } else {
          const params = test.parameters || [];
          params.forEach((p) => {
            if (config.paramNames.includes(p.name)) {
              const status = getHighLowStatus(p.value, p.reference_range);
              rows.push({
                testname: p.name,
                value: p.value || "",
                unit: p.unit || "",
                status,
                reference_range: p.reference_range || "",
              });
            }
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
            const valueWidth = doc.getTextWidth(valueStr);
            const indicatorX = valueX + valueWidth + 2;
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
          const unitX = tableX + colW[0] + colW[1] + 2;
          doc.text(String(row.unit).substring(0, 10), unitX, yPos + 5);
          const refX = tableX + colW[0] + colW[1] + colW[2] + 2;
          doc.text(
            String(row.reference_range).substring(0, 18),
            refX,
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

    // ── Lab investigations (summary line on medical report page) ─────────────
    const addLabInvestigations = (yPos) => {
      if (!patientDetails.testdetails?.length) return yPos;

      if (patientDetails.company_id === "CHC012") {
        return addCHC012LabSummary(yPos);
      }

      yPos = checkForNewPage(yPos, 15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Lab Investigations", leftMargin, yPos);
      doc.text(":", leftMargin + 50, yPos);
      doc.setFont("helvetica", "normal");
      doc.text("Enclosed", leftMargin + 55, yPos);
      return yPos + 10;
    };

    // ── Final assessment + surgeon signature ─────────────────────────────────
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
        let firstLine = true;
        impressionLines.forEach((line) => {
          const wrapped = doc.splitTextToSize(line, contentWidth - 40);
          wrapped.forEach((wl) => {
            doc.text(wl, leftMargin + 35, yPos);
            yPos += 6;
            firstLine = false;
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

      yPos += 4;
      yPos += 4;
      const signatureBlockHeight = 40;
      const pageHeight = doc.internal.pageSize.height;
      if (yPos + signatureBlockHeight >= pageHeight - footerHeight) {
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

    // ── Investigation files ───────────────────────────────────────────────────
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
          for (let fileIdx = 0; fileIdx < testEntry.files.length; fileIdx++) {
            const file = testEntry.files[fileIdx];
            if (!file || !file.data) continue;
            try {
              const contentType = file.contentType || "";
              const filename = (file.filename || "").toLowerCase();
              const isPDF =
                contentType.includes("pdf") || filename.endsWith(".pdf");
              if (isPDF) {
                const pdfImages = await convertPdfToImages(file.data);
                pdfImages.forEach((imgDataUri) => {
                  allImages.push({ dataUri: imgDataUri, format: "PNG" });
                });
              } else {
                let imageFormat = "PNG";
                if (
                  contentType.includes("jpeg") ||
                  contentType.includes("jpg") ||
                  filename.endsWith(".jpg") ||
                  filename.endsWith(".jpeg")
                )
                  imageFormat = "JPEG";
                const imgData = `data:${contentType || "image/png"};base64,${file.data}`;
                allImages.push({ dataUri: imgData, format: imageFormat });
              }
            } catch (err) {
              console.error(`Error processing file in ${label}:`, err);
            }
          }
        }

        // STEP A: Report text page — no NABL logo
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
          paragraphs.forEach((paragraph) => {
            paragraph
              .split(/\.(?=\s|$)/)
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
              .map((s) => (s.endsWith(".") ? s : s + "."))
              .forEach((s) => allSentences.push(s));
          });
          allSentences.forEach((sentence) => {
            const wrappedLines = doc.splitTextToSize(
              sentence,
              contentWidth - 10,
            );
            doc.text(wrappedLines, leftMargin, yPos);
            yPos += wrappedLines.length * 5.5 + 4;
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
              const signatureX = leftMargin + 120;
              if (Muhsina)
                doc.addImage(Muhsina, "PNG", signatureX, yPos, 35, 15);
              yPos += 20;
              doc.setFont("helvetica", "bold");
              doc.setFontSize(9);
              doc.text("DR. MUHSINA ABOOBAKER, MBBS, MDRD", signatureX, yPos);
              yPos += 5;
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              doc.text("CONSULTANT RADIOLOGIST", signatureX, yPos);
              yPos += 5;
              doc.text("REG NO: 143512 (TNMC)", signatureX, yPos);
            }

            if (isEcho) {
              const signatureX = leftMargin + 110;
              if (drarun) doc.addImage(drarun, "PNG", signatureX, yPos, 40, 20);
              yPos += 20;
              doc.setFont("helvetica", "bold");
              doc.setFontSize(9);
              doc.text(
                "Dr. ARUN KUMAR.B, MD(MED), DNB(CARDIO)",
                signatureX,
                yPos,
              );
              yPos += 5;
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              doc.text(
                "CONSULTANT INTERVENTIONAL CARDIOLOGIST",
                signatureX,
                yPos,
              );
              yPos += 5;
              doc.text("REG NO: 91581", signatureX, yPos);
              yPos += 5;
              doc.text(
                "Shanmuga Hospital & Salem Cancer Institute",
                signatureX,
                yPos,
              );
            }
          }
        }

        // STEP B: Image pages — no NABL logo
        for (let imgIdx = 0; imgIdx < allImages.length; imgIdx++) {
          const img = allImages[imgIdx];
          doc.addPage();
          pageCount++;
          addHeaderFooter(false);

          let imgYPos = headerHeight + 10;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(13);
          doc.text(
            label.toUpperCase(),
            leftMargin + contentWidth / 2,
            imgYPos,
            { align: "center" },
          );
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
          } catch (imgError) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.text(
              `[Image load error: ${imgError.message}]`,
              leftMargin,
              imgYPos + availableHeight / 2,
            );
          }
        }
      }
    };

    // ── Lab reports section ───────────────────────────────────────────────────
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

      // ── Split into NABL=true and NABL=false groups ───────────────────────
      const nablTrueTests = labTests.filter((t) => t.NABL === true);
      const nablFalseTests = labTests.filter((t) => t.NABL !== true);

      // ── Shared helpers ───────────────────────────────────────────────────
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
        contentWidth * 0.13,
        contentWidth * 0.1,
        contentWidth * 0.17,
        contentWidth * 0.15,
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
          "Reference Value",
          "Method",
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
        const pageHeight = doc.internal.pageSize.height;
        const signaturesY = pageHeight - footerHeight - 35;
        const signatureWidth = 35;
        const signatureSpacing = 60;
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

      // ── State shared across both render groups ───────────────────────────
      let sharedYPos = 0;
      let sharedCheckFn = null;

      // ── renderTestGroup ──────────────────────────────────────────────────
      // Renders one group of tests. withNabl controls NABL logo on all pages
      // within this group. Does NOT render "End of Report" — that happens once
      // after both groups finish.
      const renderTestGroup = (testsToRender, withNabl) => {
        if (!testsToRender.length) return;

        const checkForNewPageLab = (yPos, estimatedHeight) => {
          const pageHeight = doc.internal.pageSize.height;
          if (yPos + estimatedHeight >= pageHeight - footerHeight - 35) {
            addSignatures();
            doc.addPage();
            pageCount++;
            addHeaderFooter(withNabl); // ← correct logo per group
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

        const sortedDepartments = Object.keys(testsByDepartment).sort(
          (a, b) => {
            const ia = departmentOrder.indexOf(a),
              ib = departmentOrder.indexOf(b);
            if (ia !== -1 && ib !== -1) return ia - ib;
            if (ia !== -1) return -1;
            if (ib !== -1) return 1;
            return a.localeCompare(b);
          },
        );

        // Start a fresh page for this group with the correct logo
        doc.addPage();
        pageCount++;
        addHeaderFooter(withNabl); // ← correct logo per group
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
            const testNameLines = doc.splitTextToSize(
              test.testname,
              colWidths[0] - 2,
            );
            const valueText = test.value || "";
            const valueLines = doc.splitTextToSize(valueText, colWidths[3] - 2);
            const methodText = (test.method || "")
              .replace(/\bMethod\b/i, "")
              .trim();
            const maxContentHeight = Math.max(
              testNameLines.length * 4,
              doc.splitTextToSize(test.specimen_type || "", colWidths[1] - 2)
                .length * 4,
              valueLines.length * 4,
              doc.splitTextToSize(
                processUnicodeText(test.unit || ""),
                colWidths[4] - 2,
              ).length * 4,
              doc.splitTextToSize(test.reference_range || "", colWidths[5] - 2)
                .length * 4,
              doc.splitTextToSize(methodText, colWidths[6] - 2).length * 4,
              6,
            );

            doc.setFontSize(10);
            let xPos = leftMargin;
            doc.setFont("helvetica", "bold");
            wrapText(doc, test.testname, colWidths[0] - 2, xPos, yPos, 4);
            xPos += colWidths[0];
            doc.setFont("helvetica", "normal");
            wrapText(
              doc,
              test.specimen_type || "",
              colWidths[1] - 2,
              xPos,
              yPos,
              4,
            );
            xPos += colWidths[1];
            xPos += colWidths[2];

            const si = test.isHigh
              ? "H"
              : test.isLow
                ? "L"
                : getHighLowStatus(test.value, test.reference_range);
            if (si) {
              doc.setFont("helvetica", "bold");
              doc.setTextColor(si === "H" ? 255 : 0, 0, si === "L" ? 255 : 0);
            }
            wrapText(doc, valueText, colWidths[3] - 5, xPos, yPos, 4);
            if (si && valueText) {
              const ly = yPos + (valueLines.length - 1) * 4;
              const lw = doc.getTextWidth(valueLines[valueLines.length - 1]);
              drawArrowSymbol(
                doc,
                xPos + lw + 2,
                ly - 1,
                si === "H" ? "up" : "down",
              );
            }
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            xPos += colWidths[3];
            doc
              .splitTextToSize(
                processUnicodeText(test.unit || ""),
                colWidths[4] - 2,
              )
              .forEach((line, idx) => doc.text(line, xPos, yPos + idx * 4));
            xPos += colWidths[4];
            wrapText(
              doc,
              test.reference_range || "",
              colWidths[5] - 2,
              xPos,
              yPos,
              4,
            );
            xPos += colWidths[5];
            wrapText(doc, methodText, colWidths[6] - 2, xPos, yPos, 4);
            yPos += maxContentHeight + 2;

            if (test.outsourced) {
              doc.setFont("helvetica", "italic");
              doc.setFontSize(8);
              doc.text("(Outsourced)", leftMargin, yPos);
              yPos += 4;
            }
            if (!test.parameters?.length && test.comment?.trim()) {
              doc.setFont("helvetica", "italic");
              doc.setFontSize(8);
              const ch = wrapText(
                doc,
                `Note: ${test.comment}`,
                colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] - 2,
                leftMargin,
                yPos,
                3.5,
              );
              yPos += ch + 2;
            }
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);

            Object.keys(paramsBySubtitle).forEach((subtitle) => {
              if (subtitle?.trim()) {
                yPos = checkForNewPageLab(yPos, 25);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.text(subtitle, leftMargin, yPos);
                yPos += 6;
              }
              paramsBySubtitle[subtitle].forEach((currentTest) => {
                const pnl = doc.splitTextToSize(
                  currentTest.name,
                  colWidths[0] - 2,
                );
                const pvl = doc.splitTextToSize(
                  currentTest.value || "",
                  colWidths[3] - 2,
                );
                const pmh = Math.max(
                  pnl.length * 4,
                  doc.splitTextToSize(
                    currentTest.specimen_type || "",
                    colWidths[1] - 2,
                  ).length * 4,
                  pvl.length * 4,
                  doc.splitTextToSize(
                    processUnicodeText(currentTest.unit || ""),
                    colWidths[4] - 2,
                  ).length * 4,
                  doc.splitTextToSize(
                    currentTest.reference_range || "",
                    colWidths[5] - 2,
                  ).length * 4,
                  doc.splitTextToSize(
                    (currentTest.method || "")
                      .replace(/\bMethod\b/i, "")
                      .trim(),
                    colWidths[6] - 2,
                  ).length * 4,
                  6,
                );
                yPos = checkForNewPageLab(yPos, pmh + 2);
                doc.setFontSize(10);
                let xPos = leftMargin;
                doc.setFont("helvetica", "normal");
                wrapText(
                  doc,
                  currentTest.name,
                  colWidths[0] - 2,
                  xPos,
                  yPos,
                  4,
                );
                xPos += colWidths[0];
                wrapText(
                  doc,
                  currentTest.specimen_type || "",
                  colWidths[1] - 2,
                  xPos,
                  yPos,
                  4,
                );
                xPos += colWidths[1];
                xPos += colWidths[2];
                const psi = currentTest.isHigh
                  ? "H"
                  : currentTest.isLow
                    ? "L"
                    : getHighLowStatus(
                        currentTest.value,
                        currentTest.reference_range,
                      );
                if (psi) {
                  doc.setFont("helvetica", "bold");
                  doc.setTextColor(
                    psi === "H" ? 255 : 0,
                    0,
                    psi === "L" ? 255 : 0,
                  );
                }
                wrapText(
                  doc,
                  currentTest.value || "",
                  colWidths[3] - 5,
                  xPos,
                  yPos,
                  4,
                );
                if (psi && currentTest.value) {
                  const ply = yPos + (pvl.length - 1) * 4;
                  const plw = doc.getTextWidth(pvl[pvl.length - 1]);
                  drawArrowSymbol(
                    doc,
                    xPos + plw + 2,
                    ply - 1,
                    psi === "H" ? "up" : "down",
                  );
                }
                doc.setTextColor(0, 0, 0);
                doc.setFont("helvetica", "normal");
                xPos += colWidths[3];
                doc
                  .splitTextToSize(
                    processUnicodeText(currentTest.unit || ""),
                    colWidths[4] - 2,
                  )
                  .forEach((line, idx) => doc.text(line, xPos, yPos + idx * 4));
                xPos += colWidths[4];
                wrapText(
                  doc,
                  currentTest.reference_range || "",
                  colWidths[5] - 2,
                  xPos,
                  yPos,
                  4,
                );
                xPos += colWidths[5];
                wrapText(
                  doc,
                  (currentTest.method || "").replace(/\bMethod\b/i, "").trim(),
                  colWidths[6] - 2,
                  xPos,
                  yPos,
                  4,
                );
                yPos += pmh + 2;
                if (currentTest.comment?.trim()) {
                  doc.setFont("helvetica", "italic");
                  doc.setFontSize(8);
                  const pch = wrapText(
                    doc,
                    `Note: ${currentTest.comment}`,
                    colWidths[0] +
                      colWidths[1] +
                      colWidths[2] +
                      colWidths[3] -
                      2,
                    leftMargin,
                    yPos,
                    3.5,
                  );
                  yPos += pch + 2;
                }
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
              });
            });

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

        // ── Save state so "End of Report" can be placed after all groups ──
        sharedYPos = yPos;
        sharedCheckFn = checkForNewPageLab;
      };

      // ── Render NABL=true first (with logo), then NABL=false (without) ────
      if (nablTrueTests.length > 0) {
        renderTestGroup(nablTrueTests, true);
      }
      if (nablFalseTests.length > 0) {
        renderTestGroup(nablFalseTests, false);
      }

      // ── Single "End of the Report" + signatures ONCE after all groups ────
      if (sharedCheckFn) {
        sharedYPos += 4;
        sharedYPos = sharedCheckFn(sharedYPos, 10);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(
          "**End of the Report**",
          leftMargin + contentWidth / 2,
          sharedYPos,
          { align: "center" },
        );
        addSignatures();
      }
    };

    // ── Assemble the PDF ──────────────────────────────────────────────────────
    addHeaderFooter(false); // first page — no NABL logo
    currentYPosition = addMedicalExaminationHeader(currentYPosition);
    currentYPosition = addMedicalHistory(currentYPosition);
    currentYPosition = addGeneralExamination(currentYPosition);
    currentYPosition = addMiscellaneousInvestigations(currentYPosition);
    currentYPosition = addOphthalmologyReport(currentYPosition);
    currentYPosition = addLabInvestigations(currentYPosition);
    currentYPosition = addFinalAssessment(currentYPosition);
    await addInvestigationFiles();
    addLaboratoryReports();

    // ── Page numbers ──────────────────────────────────────────────────────────
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
  // ─── handlePrint ──────────────────────────────────────────────────────────
  const handlePrint = async (patient, withLetterpad = true) => {
    try {
      setLoading(true);

      // 1. Fetch main report data
      const response = await apiRequest(
        `${Labbaseurl}corporate_health_report/?barcode=${patient.barcode}`,
        "GET",
      );
      if (!response.success) {
        toast.error(response.error || "Failed to fetch patient details");
        setLoading(false);
        return null;
      }

      let patientDetails;
      let signaturesData = [];
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

      // 2. Fetch investigation status — vitals, history, notes, CHC tests + ophthalmology
      const invResult = await apiRequest(
        `${Labbaseurl}get_investigation_status/?barcode=${patient.barcode}`,
        "GET",
      );
      if (invResult.success && invResult.data) {
        patientDetails = mergeInvestigationData(patientDetails, invResult.data);
      }

      // 3. Fetch investigation files from chc_tests
      const chcTestsForFiles =
        invResult.success && invResult.data?.chc_tests?.length > 0
          ? invResult.data.chc_tests
          : investigationStatuses[patient.barcode]?.chc_tests || [];

      // In handlePrint, replace the investigationFiles fetch block:
      const investigationFiles = {};
      await Promise.all(
        chcTestsForFiles.map(async (test) => {
          // Always register the test entry (even if no files)
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

      // 4. Signatures
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

      // 5. Build and download PDF
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

  // ─── handleOverallPrint ───────────────────────────────────────────────────
  const handleOverallPrint = async () => {
    if (filteredPatients.length === 0) {
      toast.error("No patients to print");
      return;
    }
    if (filteredPatients.length > 20)
      toast.warning("Large number of records. This may take a while...");

    setLoading(true);
    toast.info(`Fetching data for ${filteredPatients.length} reports...`);

    try {
      const allBarcodes = filteredPatients
        .map((p) => p.barcode)
        .filter(Boolean);
      if (allBarcodes.length === 0) {
        toast.error("No valid barcodes found");
        setLoading(false);
        return;
      }

      // Batch-fetch main report data (100 per call)
      const BATCH_SIZE = 100;
      let allPatientData = {};
      for (let i = 0; i < allBarcodes.length; i += BATCH_SIZE) {
        const batch = allBarcodes.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(allBarcodes.length / BATCH_SIZE);
        toast.info(
          `Fetching batch ${batchNumber}/${totalBatches} (${batch.length} reports)...`,
        );
        try {
          const result = await apiRequest(
            `${Labbaseurl}get_batch_corporate_health_reports/`,
            "POST",
            { barcodes: batch },
            { "Content-Type": "application/json" },
          );
          if (!result.success)
            throw new Error(
              result.error || `Failed to fetch batch ${batchNumber}`,
            );
          allPatientData = {
            ...allPatientData,
            ...(result.data.results || {}),
          };
        } catch (batchError) {
          console.error(`Error in batch ${batchNumber}:`, batchError);
          toast.error(
            `Failed to fetch batch ${batchNumber}: ${batchError.message}`,
          );
        }
      }

      const successfulFetches = Object.keys(allPatientData).length;
      if (successfulFetches === 0) {
        toast.error("Failed to fetch any patient data");
        setLoading(false);
        return;
      }
      toast.info(`Generating ${successfulFetches} PDFs...`);

      const zip = new JSZip();
      let successCount = 0,
        failCount = 0;

      for (let i = 0; i < filteredPatients.length; i++) {
        const patient = filteredPatients[i];
        const bc = patient.barcode;
        try {
          const barcodeData = allPatientData[bc];
          if (!barcodeData || barcodeData.error) {
            failCount++;
            continue;
          }

          let patientDetails;
          let signaturesData = [];
          if (barcodeData.patient_data && barcodeData.signatures) {
            patientDetails = barcodeData.patient_data;
            signaturesData = barcodeData.signatures;
          } else {
            patientDetails = barcodeData;
          }

          // Fetch investigation status (vitals, history, notes, CHC tests, ophthalmology)
          const invResult = await apiRequest(
            `${Labbaseurl}get_investigation_status/?barcode=${bc}`,
            "GET",
          );
          if (invResult.success && invResult.data) {
            patientDetails = mergeInvestigationData(
              patientDetails,
              invResult.data,
            );
          }

          // Fetch investigation files
          const chcTestsForFiles =
            invResult.success && invResult.data?.chc_tests?.length > 0
              ? invResult.data.chc_tests
              : investigationStatuses[bc]?.chc_tests || [];

          // In handlePrint, replace the investigationFiles fetch block:
          const investigationFiles = {};
          await Promise.all(
            chcTestsForFiles.map(async (test) => {
              // Always register the test entry (even if no files)
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
                investigationFiles[test.test_id].files =
                  testFiles.filter(Boolean);
              }
            }),
          );
          patientDetails.investigation_files = investigationFiles;
          patientDetails.chc_tests_for_files = chcTestsForFiles;

          // Signatures
          const designationMapping = {
            DESIG101: { position: 0, title: "Consultant Microbiologist" },
            DESIG100: { position: 1, title: "Consultant Pathologist" },
            DESIG099: { position: 2, title: "Consultant Biochemist" },
          };
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
          const activeConsultants = consultants.filter((c) => c !== null);

          const doc = await buildPdfDocument(
            patientDetails,
            activeConsultants,
            true,
          );
          const pdfBlob = doc.output("blob");
          const fileName = `${patientDetails.patient_id}_${(patientDetails.patientname || "Unknown").replace(/\s+/g, "_")}.pdf`;
          zip.file(fileName, pdfBlob);
          successCount++;

          if ((i + 1) % 5 === 0 || i === filteredPatients.length - 1)
            toast.info(
              `Progress: ${i + 1}/${filteredPatients.length} PDFs generated`,
            );
        } catch (error) {
          failCount++;
          console.error(`Error processing ${patient.patient_name}:`, error);
        }
      }

      if (successCount > 0) {
        toast.info("Creating ZIP file...");
        const zipBlob = await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 6 },
        });
        saveAs(
          zipBlob,
          `CHC_Reports_${format(startDate, "yyyy-MM-dd")}_to_${format(endDate, "yyyy-MM-dd")}.zip`,
        );
        toast.success(
          `Successfully generated ${successCount} reports!${failCount > 0 ? ` (${failCount} failed)` : ""}`,
        );
      } else {
        toast.error("Failed to generate any PDF reports");
      }
    } catch (error) {
      console.error("Batch processing error:", error);
      toast.error(
        "Failed to process batch: " + (error.message || "Unknown error"),
      );
    }
    setLoading(false);
  };

  // ─── Excel export ─────────────────────────────────────────────────────────
  const handleExportToExcel = async () => {
    try {
      setLoading(true);
      const barcodes = filteredPatients.map((p) => p.barcode).filter(Boolean);
      if (barcodes.length === 0) {
        toast.error("No patients with barcodes found");
        setLoading(false);
        return;
      }
      const excelData = filteredPatients.map((patient) => {
        const bc = patient.barcode;
        const invData = investigationStatuses[bc] || {};
        const chcTests = invData.chc_tests || [];
        const chcTestColumns = {};
        chcTests.forEach((test) => {
          const collected = test.has_file || test.has_report;
          chcTestColumns[`${test.testname} - Collection`] = collected
            ? "Collected"
            : "Pending";
          chcTestColumns[`${test.testname} - Approval`] =
            test.status?.toLowerCase() === "approved" ? "Approved" : "Pending";
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
        "Failed to export Excel report: " + (error.message || "Unknown error"),
      );
      setLoading(false);
    }
  };

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
  const showDropdown = (pid) => setActiveDropdownPatientId(pid);
  const hideDropdown = () => setActiveDropdownPatientId(null);
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

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Container>
      <GlobalStyle />
      <Card>
        <CardHeader>
          <Title>Corporate Health Checkup - Approval Report</Title>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <OverallPrintButton
              onClick={handleOverallPrint}
              disabled={loading || !allPatientsApproved}
              title="Download all filtered reports as ZIP"
            >
              <Download size={16} /> Overall Print ({filteredPatients.length})
            </OverallPrintButton>
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
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>End Date</FilterLabel>
              <FilterInput
                type="date"
                value={endDate.toISOString().split("T")[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
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

        <TableContainer>
          <Table>
            <TableHead>
              <tr>
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
                    colSpan={7}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Loading patient data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
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
                  return (
                    <tr key={patient.patient_id}>
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
                          <ActionButton
                            onClick={() =>
                              isPrintMailEnabled && handlePrint(patient)
                            }
                            disabled={!isPrintMailEnabled}
                            title="Print Report"
                          >
                            <Printer size={16} />
                          </ActionButton>
                        </ActionContainer>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7}>
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
    </Container>
  );
};

export default CHCReport;
