"use client";

import { useEffect, useState, useCallback } from "react";
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
import Vijayan from "../Images/Vijayan.png";
import Muhsina from "../Images/Muhsina.png";
import DRPS from "../Images/DRPS.png";
import { useNavigate, useLocation } from "react-router-dom";
import apiRequest from "../Auth/apiRequest";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Global styles
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
 
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
 
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
        ? "0 2px 4px rgba(0, 0, 0, 0.1)"
        : "0 4px 8px rgba(0, 0, 0, 0.1)"};
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
    props.gender === "Female"
      ? "rgba(232, 62, 140, 0.1)"
      : "rgba(0, 123, 255, 0.1)"};
  color: ${(props) => (props.gender === "Female" ? "#E83E8C" : "#007BFF")};
`;

const PrintDropdown = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: green;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  min-width: 180px;
  z-index: 100;
  overflow: hidden;
  display: ${(props) => (props.isVisible ? "block" : "none")};
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

const CHCReport = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [investigationStatuses, setInvestigationStatuses] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activeDropdownPatientId, setActiveDropdownPatientId] = useState(null);
  const [refByOptions, setRefByOptions] = useState([]);
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
  const navigate = useNavigate();
  const location = useLocation();
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // ─────────────────────────────────────────────────────────────────────────
  const hasPendingInvestigations = (barcode) => {
    const data = investigationStatuses[barcode];
    if (!data) return false;
    const chcTests = data.chc_tests || [];
    if (chcTests.length === 0) return false;
    return chcTests.some(
      (t) =>
        !(t.has_file || t.has_report) || t.status?.toLowerCase() !== "approved", // ✅
    );
  };

  const getPendingInvestigations = (statusData) => {
    if (!statusData) return <span className="all-approved">All Approved</span>;

    const chcTests = statusData.chc_tests || [];

    if (chcTests.length === 0) {
      return <span className="all-approved">No CHC Tests</span>;
    }

    const allDone = chcTests.every(
      (t) =>
        (t.has_file || t.has_report) && t.status?.toLowerCase() === "approved",
    );

    if (allDone) {
      return <span className="all-approved">All Approved</span>;
    }

    // ✅ THIS RETURN WAS MISSING — that's why nothing rendered
    return (
      <>
        {chcTests.map((test, index) => {
          const collected = test.has_file || test.has_report;
          const approved = test.status?.toLowerCase() === "approved";

          // Only show tests that are NOT fully approved
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
  // ─────────────────────────────────────────────────────────────────────────
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
          };
        }
      });

      setStatuses(statusMap);
      setInvestigationStatuses(investigationStatusMap);
    } else {
      console.error("Error fetching combined patient data:", result.error);
      setError("Failed to load patient data");
    }

    setLoading(false);
  }, [startDate, endDate, Labbaseurl]);

  const handleApprovalSaved = useCallback(async () => {
    console.log("Approval saved, refreshing data...");
    await fetchCombinedPatientData();
    toast.success("Status updated successfully!");
  }, [fetchCombinedPatientData]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchCombinedPatientData();
    }
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
    setStatusFilter("");
    setInvestigationStatusFilter("");
    setFilteredPatients(patients);
  };

  // Set PDF.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const convertPdfToImages = async (base64Data) => {
    try {
      const cleanBase64 = base64Data.replace(/^data:.*?;base64,/, "");
      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const loadingTask = pdfjsLib.getDocument({
        data: bytes,
        verbosity: pdfjsLib.VerbosityLevel.ERRORS,
        cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
      });
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

  // ─────────────────────────────────────────────────────────────────────────
  // HELPER: Merge vitals from investigation status into patientDetails
  // Handles both key naming conventions (height_cm / height, weight_kg / weight)
  // ─────────────────────────────────────────────────────────────────────────
  const mergeInvestigationData = (patientDetails, invStatus) => {
    if (!invStatus) return patientDetails;

    const merged = { ...patientDetails };

    // ── 1. Vitals ──────────────────────────────────────────────────────────
    // get_investigation_status returns raw keys: height_cm, weight_kg, bmi,
    // blood_pressure, spo2/pulse.  corporate_health_report strips _cm/_kg.
    // We normalise to the stripped form so the PDF helpers work unchanged.
    const rawVitals = invStatus.vitals || {};
    if (Object.keys(rawVitals).length > 0) {
      const normalisedVitals = {};

      const pick = (...keys) => {
        for (const k of keys) {
          const v = rawVitals[k];
          if (v && String(v).trim() && String(v).trim() !== "0") return v;
        }
        return null;
      };

      const h = pick("height_cm", "height");
      if (h) normalisedVitals.height = h;

      const w = pick("weight_kg", "weight");
      if (w) normalisedVitals.weight = w;

      const bmi = pick("bmi");
      if (bmi) normalisedVitals.bmi = bmi;

      const bp = pick("blood_pressure");
      if (bp) normalisedVitals.blood_pressure = bp;

      // pulse stored as "pulse" or legacy "spo2"
      const pulse = pick("pulse", "spo2");
      if (pulse) normalisedVitals.spo2 = pulse; // keep key as spo2 — PDF helper reads vitals.spo2

      if (Object.keys(normalisedVitals).length > 0) {
        merged.vitals = { ...(merged.vitals || {}), ...normalisedVitals };
      }
    }

    // ── 2. Patient history ─────────────────────────────────────────────────
    const history = invStatus.patient_history;
    if (history && history.trim()) {
      merged.medical_history = {
        ...(merged.medical_history || {}),
        patient_history: history,
      };
    }

    // ── 3. Investigation notes from chc_tests ──────────────────────────────
    // Each chc_test carries { testname, report, notes, files }.
    // We map known test names → investigation_notes keys so the existing
    // addMiscellaneousInvestigations() PDF helper picks them up correctly.
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

        // notes field → miscellaneous investigation notes
        const notesKey = notesMap[name];
        if (
          notesKey &&
          test.notes &&
          test.notes.trim() &&
          !existingNotes[notesKey]
        ) {
          existingNotes[notesKey] = test.notes;
        }

        // report field → xray_report (multi-sentence radiology report)
        const reportKey = reportMap[name];
        if (
          reportKey &&
          test.report &&
          test.report.trim() &&
          !existingNotes[reportKey]
        ) {
          existingNotes[reportKey] = test.report;
        }

        // Also set xray_notes from report when no dedicated notes exist
        if (
          reportKey === "xray_report" &&
          test.report &&
          test.report.trim() &&
          !existingNotes["xray_notes"]
        ) {
          // Use first sentence as the brief xray_notes impression
          const firstSentence = test.report.split(/\.(?=\s|$)/)[0].trim();
          if (firstSentence) {
            existingNotes["xray_notes"] = firstSentence.endsWith(".")
              ? firstSentence
              : firstSentence + ".";
          }
        }
      });

      if (Object.keys(existingNotes).length > 0) {
        merged.investigation_notes = existingNotes;
      }
    }

    return merged;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // handlePrint — fetches both corporate_health_report AND
  // get_investigation_status, then merges vitals / history / notes
  // from the investigation record before generating the PDF.
  // ─────────────────────────────────────────────────────────────────────────
  const handlePrint = async (patient, withLetterpad = true) => {
    try {
      setLoading(true);

      // ── 1. Fetch main report data ────────────────────────────────────────
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
          testdetails: patientDetails.flatMap(
            (record) => record.testdetails || [],
          ),
        };
      }

      // ── 2. Fetch investigation status (vitals, history, notes, reports) ──
      const invResult = await apiRequest(
        `${Labbaseurl}get_investigation_status/?barcode=${patient.barcode}`,
        "GET",
      );

      if (invResult.success && invResult.data) {
        // Merge investigation data on top of patientDetails
        patientDetails = mergeInvestigationData(patientDetails, invResult.data);
      }

      // ── 3. Fetch investigation files from chc_tests ──────────────────────
      // Prefer enriched chc_tests from get_investigation_status (has files[])
      const chcTestsForFiles =
        invResult.success && invResult.data?.chc_tests?.length > 0
          ? invResult.data.chc_tests
          : investigationStatuses[patient.barcode]?.chc_tests || [];

      const investigationFiles = {};
      const filePromises = chcTestsForFiles.map(async (test) => {
        if (test.files && test.files.length > 0) {
          const testFiles = await Promise.all(
            test.files.map((fileId) => fetchInvestigationFile(fileId)),
          );
          investigationFiles[test.test_id] = {
            label: test.testname,
            files: testFiles.filter(Boolean),
          };
        }
      });
      await Promise.all(filePromises);

      patientDetails.investigation_files = investigationFiles;
      patientDetails.chc_tests_for_files = chcTestsForFiles;

      // ── 4. Signatures ────────────────────────────────────────────────────
      const designationMapping = {
        DESIG101: { position: 0, title: "Consultant Microbiologist" },
        DESIG100: { position: 1, title: "Consultant Pathologist" },
        DESIG099: { position: 2, title: "Consultant Biochemist" },
      };

      const consultants = [null, null, null];
      signaturesData.forEach((sig) => {
        const mapping = designationMapping[sig.designation];
        if (mapping) {
          const signatureImage = sig.signatureBase64
            ? `data:image/png;base64,${sig.signatureBase64}`
            : null;
          consultants[mapping.position] = [
            sig.employeeName,
            mapping.title,
            signatureImage,
          ];
        }
      });
      const activeConsultants = consultants.filter((c) => c !== null);

      // ── 5. Generate PDF (unchanged logic below) ──────────────────────────
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

      const addHeaderFooter = () => {
        if (withLetterpad) {
          doc.addImage(
            headerImage,
            "PNG",
            0,
            5,
            doc.internal.pageSize.width,
            headerHeight,
          );
          const footerY = doc.internal.pageSize.height - footerHeight;
          doc.addImage(
            FooterImage,
            "PNG",
            0,
            footerY,
            doc.internal.pageSize.width,
            footerHeight,
          );
        }
      };

      const checkForNewPage = (yPos, estimatedHeight) => {
        const pageHeight = doc.internal.pageSize.height;
        const footerStart = pageHeight - footerHeight - 30;
        if (yPos + estimatedHeight >= footerStart) {
          doc.addPage();
          pageCount++;
          addHeaderFooter();
          return headerHeight + 10;
        }
        return yPos;
      };

      const addMedicalExaminationHeader = (yPos) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        yPos += 15;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        const leftCol = [
          { label: "Name", value: patientDetails.patientname || "N/A" },
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
            label: "Reported Date",
            value: safeFormatDate(
              patientDetails.final_assessment?.approved_date,
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
              const wrappedText = doc.splitTextToSize(leftCol[i].value, 50);
              doc.text(wrappedText, leftMargin + 45, yPos);
              lineHeight = Math.max(lineHeight, (wrappedText.length - 1) * 5);
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
              const wrappedText = doc.splitTextToSize(rightCol[i].value, 65);
              doc.text(wrappedText, leftMargin + 130, yPos);
              lineHeight = Math.max(lineHeight, (wrappedText.length - 1) * 5);
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
          { label: "Employee ID", value: patientDetails.patient_id || "N/A" },
          { label: "Department", value: patientDetails.department || "N/A" },
          {
            label: "Medical History",
            // ← Now uses merged value from get_investigation_status
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
            const maxWidth = contentWidth - 55;
            const lines = doc.splitTextToSize(item.value, maxWidth);
            doc.text(lines, leftMargin + 55, yPos);
            yPos += lines.length * 6;
          } else {
            doc.text(item.value, leftMargin + 55, yPos);
            yPos += 6;
          }
        });
        return yPos + 5;
      };

      const addGeneralExamination = (yPos) => {
        yPos = checkForNewPage(yPos, 30);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("VITALS", leftMargin, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const colWidths = [60, 40, 50];
        const tableStartX = leftMargin;
        const rowHeight = 8;
        doc.rect(
          tableStartX,
          yPos,
          colWidths[0] + colWidths[1] + colWidths[2],
          rowHeight,
        );
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
        doc.text("Parameter", tableStartX + 2, yPos + 5);
        doc.text("Reading", tableStartX + colWidths[0] + 2, yPos + 5);
        doc.text(
          "Normal Range",
          tableStartX + colWidths[0] + colWidths[1] + 2,
          yPos + 5,
        );
        yPos += rowHeight;

        // ← Vitals now come from merged patientDetails (investigation status wins)
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
            range: "18.5 - 24.9",
          },
          {
            param: "Blood Pressure",
            value: (patientDetails.vitals?.blood_pressure || "N/A") + " mmHg",
            range: "120/80",
          },
          {
            param: "Pulse Rate",
            value: (patientDetails.vitals?.spo2 || "N/A") + " bpm",
            range: "60 - 100",
          },
        ];

        doc.setFont("helvetica", "normal");
        vitalSigns.forEach((item) => {
          const rowY = yPos;
          doc.rect(
            tableStartX,
            rowY,
            colWidths[0] + colWidths[1] + colWidths[2],
            rowHeight,
          );
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
          doc.text(item.param, tableStartX + 2, rowY + 5);
          doc.text(item.value, tableStartX + colWidths[0] + 2, rowY + 5);
          doc.text(
            item.range,
            tableStartX + colWidths[0] + colWidths[1] + 2,
            rowY + 5,
          );
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

        // ── Build list only from chc_tests that have a report/notes ──────────
        const chcTestsForMisc = patientDetails.chc_tests_for_files || [];

        // Filter only tests that have been collected (has_report or has_file)
        const availedTests = chcTestsForMisc.filter(
          (t) => t.has_report || t.has_file,
        );

        if (availedTests.length === 0) {
          doc.setFont("helvetica", "normal");
          doc.text(
            "No miscellaneous investigations recorded.",
            leftMargin,
            yPos,
          );
          return yPos + 10;
        }

        const maxWidth = 210 - leftMargin - 20 - 45;

        availedTests.forEach((test) => {
          const label = test.testname || "Unknown";
          // Prefer notes for brief display; fall back to first sentence of report
          let value = test.notes?.trim() || "";
          if (!value && test.report?.trim()) {
            // Use first sentence of the report as the brief note
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

      const addLabInvestigations = (yPos) => {
        if (
          !patientDetails.testdetails ||
          patientDetails.testdetails.length === 0
        )
          return yPos;
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
        const impression = patientDetails.final_assessment?.impression;
        const remarks = patientDetails.final_assessment?.remarks;
        if (impression && impression.trim()) {
          doc.text("Impression", leftMargin, yPos);
          doc.text(":", leftMargin + 30, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(impression, leftMargin + 35, yPos);
          doc.setFont("helvetica", "bold");
          yPos += 6;
        }
        if (remarks && remarks.trim()) {
          yPos += 10;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.text(remarks, leftMargin, yPos);
        }
        yPos += 15;
        const signatureX = leftMargin + 120;
        if (DRPS) doc.addImage(DRPS, "PNG", signatureX, yPos, 35, 25);
        yPos += 25;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Dr. P. PRABU SANKAR, MS, MRCS.", leftMargin + 120, yPos);
        yPos += 5;
        doc.text("GENERAL SURGEON", leftMargin + 120, yPos);
        yPos += 5;
        doc.text("Reg No. 80709", leftMargin + 120, yPos);
        yPos += 5;
        doc.text("Shanmuga Hospital Ltd, Salem-7.", leftMargin + 120, yPos);
        return yPos + 10;
      };

      const addXrayReportContent = () => {
        // ← xray_report now comes from merged investigation_notes (set by mergeInvestigationData)
        const xrayReport = patientDetails.investigation_notes?.xray_report;
        if (!xrayReport || !xrayReport.trim()) return;
        doc.addPage();
        pageCount++;
        addHeaderFooter();
        let yPos = headerHeight + 10;
        yPos = addMedicalExaminationHeader(yPos);
        yPos += 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("X-RAY CHEST PA VIEW", leftMargin + contentWidth / 2, yPos, {
          align: "center",
        });
        yPos += 15;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        // Normalise line endings then split into sentences at full stops
        const normalizedReport = xrayReport
          .replace(/\\r\\n/g, "\n")
          .replace(/\r\n/g, "\n");
        const paragraphs = normalizedReport
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
        const allSentences = [];
        paragraphs.forEach((paragraph) => {
          const sentences = paragraph
            .split(/\.(?=\s|$)/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
            .map((s) => (s.endsWith(".") ? s : s + "."));
          allSentences.push(...sentences);
        });
        // Each sentence on its own line
        allSentences.forEach((sentence) => {
          const wrappedLines = doc.splitTextToSize(sentence, contentWidth - 10);
          doc.text(wrappedLines, leftMargin, yPos);
          yPos += wrappedLines.length * 5.5 + 4;
        });

        yPos += 8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("IMPRESSION:", leftMargin, yPos);
        yPos += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const impressionText =
          patientDetails.investigation_notes?.xray_notes ||
          "No significant finding in the lungs or mediastinum.";
        const impressionLines = doc.splitTextToSize(
          impressionText,
          contentWidth - 10,
        );
        doc.text(impressionLines, leftMargin, yPos);
        yPos += impressionLines.length * 5.5 + 20;
        const signatureX = leftMargin + 120;
        if (Muhsina) doc.addImage(Muhsina, "PNG", signatureX, yPos, 35, 15);
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
      };

      const addInvestigationFiles = async () => {
        const files = patientDetails.investigation_files;
        const chcTestsOrder = patientDetails.chc_tests_for_files || [];
        const hasFiles =
          files &&
          Object.values(files).some((t) => t.files && t.files.length > 0);
        if (!hasFiles) return;

        const pageHeight = doc.internal.pageSize.height;

        for (const test of chcTestsOrder) {
          const testEntry = files[test.test_id];
          if (!testEntry || !testEntry.files || testEntry.files.length === 0)
            continue;
          const label = testEntry.label || test.testname;

          // ── Collect all rendered images for this test ──────────────────────
          const allImages = [];

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
            } catch (error) {
              console.error(`Error processing file in ${label}:`, error);
            }
          }

          if (allImages.length === 0) continue;

          // ── Layout decision ────────────────────────────────────────────────
          const isSingle = allImages.length === 1;
          const COLS = isSingle ? 1 : 2;
          const IMAGES_PER_PAGE = isSingle ? 1 : 4; // 2×2

          const colGap = 4;
          const rowGap = 6;

          // ── Calculate exact available space between header and footer ──────
          // Header area: headerHeight + 10 (top padding) + header section (name/age/date rows ~35) + title (~15)
          const headerSectionEnd = headerHeight + 10 + 35 + 15 + 10; // yPos after title
          // Footer area: footerHeight + page number area (10) + safe margin (5)
          const footerSectionStart = pageHeight - footerHeight - 10 - 5;

          const availableHeight = footerSectionStart - headerSectionEnd;

          // For 2×2: each image gets half the available height minus row gap
          // For 1×1: full available height
          const imgWidth = isSingle
            ? contentWidth
            : (contentWidth - colGap) / 2;

          const imgHeight = isSingle
            ? availableHeight
            : (availableHeight - rowGap) / 2;

          // ── Render pages ───────────────────────────────────────────────────
          let imageIndex = 0;
          const totalGridPages = Math.ceil(allImages.length / IMAGES_PER_PAGE);

          while (imageIndex < allImages.length) {
            doc.addPage();
            pageCount++;
            addHeaderFooter();

            // ── Rebuild header section to get exact yPos ───────────────────
            let yPos = headerHeight + 10;
            yPos = addMedicalExaminationHeader(yPos);
            yPos += 5;

            // Page title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            const currentGridPage =
              Math.floor(imageIndex / IMAGES_PER_PAGE) + 1;
            const pageTitle =
              totalGridPages > 1
                ? `${label} (Page ${currentGridPage}/${totalGridPages})`
                : label;
            doc.text(pageTitle, leftMargin + contentWidth / 2, yPos, {
              align: "center",
            });
            yPos += 10;

            // ── Use yPos as the exact grid start ──────────────────────────
            const gridStartY = yPos;

            // Draw images for this grid page
            const imagesOnThisPage = Math.min(
              IMAGES_PER_PAGE,
              allImages.length - imageIndex,
            );

            for (let slot = 0; slot < imagesOnThisPage; slot++) {
              const img = allImages[imageIndex + slot];
              const col = slot % COLS;
              const row = Math.floor(slot / COLS);

              const xPos = leftMargin + col * (imgWidth + colGap);
              const yPosCell = gridStartY + row * (imgHeight + rowGap);

              try {
                doc.addImage(
                  img.dataUri,
                  img.format,
                  xPos,
                  yPosCell,
                  imgWidth,
                  imgHeight,
                );
              } catch (imgError) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.text(
                  `[Image load error: ${imgError.message}]`,
                  xPos,
                  yPosCell + imgHeight / 2,
                );
              }
            }

            imageIndex += IMAGES_PER_PAGE;
          }
        }
      };

      const addLaboratoryReports = () => {
        if (
          !patientDetails.testdetails ||
          patientDetails.testdetails.length === 0
        )
          return;

        const labTests = patientDetails.testdetails.filter(
          (test) =>
            ![
              "Audiometry",
              "Pulmonary Function Test",
              "Chest - XRay",
              "ECG",
              "Eye examination",
            ].includes(test.testname),
        );
        if (labTests.length === 0) return;

        const unicodeMap = {
          μ: "µ",
          α: "α",
          β: "β",
          γ: "γ",
          δ: "δ",
          Ω: "Ω",
          "²": "²",
          "³": "³",
          "⁴": "⁴",
          "°": "°",
          "±": "±",
          "×": "x",
          "÷": "/",
          "\\u03bc": "µ",
          "\\u00b5": "µ",
          "\\u00b0": "°",
          "\\u00b1": "±",
          "\\u00b2": "²",
          "\\u00b3": "³",
        };
        const processUnicodeText = (text) => {
          if (!text) return "";
          let processedText = text;
          processedText = processedText.replace(
            /\\u([0-9a-fA-F]{4})/g,
            (match, hex) => {
              const char = String.fromCharCode(parseInt(hex, 16));
              return unicodeMap[char] || char;
            },
          );
          Object.keys(unicodeMap).forEach((unicode) => {
            processedText = processedText.replace(
              new RegExp(unicode, "g"),
              unicodeMap[unicode],
            );
          });
          return processedText;
        };

        const wrapText = (
          doc,
          text,
          maxWidth,
          startX,
          yPos,
          lineHeight = 4,
        ) => {
          if (!text) return 0;
          const splitText = doc.splitTextToSize(text, maxWidth);
          splitText.forEach((line, index) => {
            doc.text(line, startX, yPos + index * lineHeight);
          });
          return splitText.length * lineHeight;
        };

        const getHighLowStatus = (value, reference) => {
          if (!value || !reference) return null;
          const numValue = Number.parseFloat(value);
          if (isNaN(numValue)) return null;
          if (reference.includes("-")) {
            const [min, max] = reference
              .split("-")
              .map((v) => Number.parseFloat(v));
            if (!isNaN(min) && !isNaN(max)) {
              if (numValue < min) return "L";
              if (numValue > max) return "H";
            }
          } else if (reference.includes("<")) {
            const max = Number.parseFloat(reference.replace("<", ""));
            if (!isNaN(max) && numValue > max) return "H";
          } else if (reference.includes(">")) {
            const min = Number.parseFloat(reference.replace(">", ""));
            if (!isNaN(min) && numValue < min) return "L";
          }
          return null;
        };

        const drawArrowSymbol = (doc, x, y, direction) => {
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.5);
          if (direction === "up") {
            doc.line(x, y, x + 1, y - 1);
            doc.line(x + 1, y - 1, x + 2, y);
            doc.line(x + 1, y - 1, x + 1, y + 2);
          } else if (direction === "down") {
            doc.line(x, y, x + 1, y + 1);
            doc.line(x + 1, y + 1, x + 2, y);
            doc.line(x + 1, y + 1, x + 1, y - 2);
          }
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
          headers.forEach((header, index) => {
            if (header) doc.text(header, xPos, yPos);
            xPos += colWidths[index];
          });
          yPos += 3;
          doc.line(leftMargin, yPos, rightMargin, yPos);
          yPos += 5;
          return yPos;
        };

        const addLabReportHeader = (yPos) => {
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text("Reg.ID", leftMargin, yPos);
          doc.text(":", leftMargin + 30, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(patientDetails.patient_id || "N/A", leftMargin + 35, yPos);
          doc.setFont("helvetica", "bold");
          doc.text("Collected On", leftMargin + 100, yPos);
          doc.text(":", leftMargin + 140, yPos);
          doc.setFont("helvetica", "normal");
          const firstTest = labTests[0];
          if (firstTest?.samplecollected_time) {
            doc.text(
              safeFormatDate(
                firstTest.samplecollected_time,
                "dd MMM yy / HH:mm",
              ),
              leftMargin + 145,
              yPos,
            );
          }
          yPos += 5;

          doc.setFont("helvetica", "bold");
          doc.text("Name", leftMargin, yPos);
          doc.text(":", leftMargin + 30, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(patientDetails.patientname || "N/A", leftMargin + 35, yPos);
          doc.setFont("helvetica", "bold");
          doc.text("Received On", leftMargin + 100, yPos);
          doc.text(":", leftMargin + 140, yPos);
          doc.setFont("helvetica", "normal");
          if (firstTest?.received_time) {
            doc.text(
              safeFormatDate(firstTest.received_time, "dd MMM yy / HH:mm"),
              leftMargin + 145,
              yPos,
            );
          }
          yPos += 5;

          doc.setFont("helvetica", "bold");
          doc.text("Age/Gender", leftMargin, yPos);
          doc.text(":", leftMargin + 30, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(
            `${patientDetails.age || "N/A"} / ${patientDetails.gender || "N/A"}`,
            leftMargin + 35,
            yPos,
          );
          doc.setFont("helvetica", "bold");
          doc.text("Reported Date", leftMargin + 100, yPos);
          doc.text(":", leftMargin + 140, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(
            safeFormatDate(
              firstTest?.approve_time,
              "dd MMM yy / HH:mm",
              safeFormatDate(new Date().toISOString(), "dd MMM yy / HH:mm"),
            ),
            leftMargin + 145,
            yPos,
          );
          yPos += 5;

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
          const pageHeight = doc.internal.pageSize.height;
          const signatureHeight = 25;
          const signaturesY = pageHeight - footerHeight - signatureHeight - 10;
          if (activeConsultants.length === 0) return;
          const signatureWidth = 35;
          const totalConsultants = activeConsultants.length;
          const rightEdge = rightMargin;
          const signatureSpacing = 60;
          const startX = rightEdge - totalConsultants * signatureSpacing;
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

        const checkForNewPageLab = (yPos, estimatedHeight) => {
          const pageHeight = doc.internal.pageSize.height;
          const footerStart = pageHeight - footerHeight - 35;
          if (yPos + estimatedHeight >= footerStart) {
            addSignatures();
            doc.addPage();
            pageCount++;
            addHeaderFooter();
            let newYPos = headerHeight + 10;
            newYPos = addLabReportHeader(newYPos);
            newYPos = drawTableHeader(newYPos);
            return newYPos;
          }
          return yPos;
        };

        const testsByDepartment = labTests.reduce((acc, test) => {
          const dept = test.department || "LABORATORY";
          (acc[dept] = acc[dept] || []).push(test);
          return acc;
        }, {});

        const sortedDepartments = Object.keys(testsByDepartment).sort(
          (a, b) => {
            const indexA = departmentOrder.indexOf(a);
            const indexB = departmentOrder.indexOf(b);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
          },
        );

        doc.addPage();
        pageCount++;
        addHeaderFooter();
        let yPos = headerHeight + 10;
        yPos = addLabReportHeader(yPos);
        yPos = drawTableHeader(yPos);

        sortedDepartments.forEach((department) => {
          const verifiedBySet = new Set();
          testsByDepartment[department].forEach((test) => {
            if (test.verified_by && test.verified_by.trim() !== "")
              verifiedBySet.add(test.verified_by);
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

            const parametersBySubtitle = {};
            if (test.parameters && test.parameters.length > 0) {
              test.parameters.forEach((param) => {
                const subtitle = param.sub_title || "";
                if (!parametersBySubtitle[subtitle])
                  parametersBySubtitle[subtitle] = [];
                parametersBySubtitle[subtitle].push(param);
              });
            }

            yPos = checkForNewPageLab(yPos, 20);
            const testNameText = test.testname;
            const testNameLines = doc.splitTextToSize(
              testNameText,
              colWidths[0] - 2,
            );
            const valueText = test.value || "";
            const valueLines = doc.splitTextToSize(valueText, colWidths[3] - 2);
            const specimenLines = doc.splitTextToSize(
              test.specimen_type || "",
              colWidths[1] - 2,
            );
            const refLines = doc.splitTextToSize(
              test.reference_range || "",
              colWidths[5] - 2,
            );
            const methodText = (test.method || "")
              .replace(/\bMethod\b/i, "")
              .trim();
            const methodLines = doc.splitTextToSize(
              methodText,
              colWidths[6] - 2,
            );
            const unitText = processUnicodeText(test.unit || "");
            const unitLines = doc.splitTextToSize(unitText, colWidths[4] - 2);
            const maxContentHeight = Math.max(
              testNameLines.length * 4,
              specimenLines.length * 4,
              valueLines.length * 4,
              unitLines.length * 4,
              refLines.length * 4,
              methodLines.length * 4,
              6,
            );

            doc.setFontSize(10);
            let xPos = leftMargin;
            doc.setFont("helvetica", "bold");
            wrapText(doc, testNameText, colWidths[0] - 2, xPos, yPos, 4);
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

            const statusIndicator = test.isHigh
              ? "H"
              : test.isLow
                ? "L"
                : getHighLowStatus(test.value, test.reference_range);
            if (statusIndicator) {
              doc.setFont("helvetica", "bold");
              doc.setTextColor(
                statusIndicator === "H" ? 255 : 0,
                0,
                statusIndicator === "L" ? 255 : 0,
              );
            }
            wrapText(doc, valueText, colWidths[3] - 5, xPos, yPos, 4);
            if (statusIndicator && valueText) {
              const lastLineY = yPos + (valueLines.length - 1) * 4;
              const lastLine = valueLines[valueLines.length - 1];
              const valueWidth = doc.getTextWidth(lastLine);
              drawArrowSymbol(
                doc,
                xPos + valueWidth + 2,
                lastLineY - 1,
                statusIndicator === "H" ? "up" : "down",
              );
            }
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            xPos += colWidths[3];

            const processedUnit = processUnicodeText(test.unit || "");
            const unitSplitText = doc.splitTextToSize(
              processedUnit,
              colWidths[4] - 2,
            );
            unitSplitText.forEach((line, idx) => {
              if (line.includes("µ")) {
                const parts = line.split("µ");
                let currentX = xPos;
                parts.forEach((part, partIdx) => {
                  if (partIdx > 0) {
                    doc.text("µ", currentX, yPos + idx * 4);
                    currentX += doc.getTextWidth("µ");
                  }
                  if (part) {
                    doc.text(part, currentX, yPos + idx * 4);
                    currentX += doc.getTextWidth(part);
                  }
                });
              } else {
                doc.text(line, xPos, yPos + idx * 4);
              }
            });
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
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);

            if (test.outsourced === true) {
              doc.setFont("helvetica", "italic");
              doc.setFontSize(8);
              doc.text("(Outsourced)", leftMargin, yPos);
              yPos += 4;
            }
            if (!test.parameters || test.parameters.length === 0) {
              if (test.comment && test.comment.trim() !== "") {
                doc.setFont("helvetica", "italic");
                doc.setFontSize(8);
                const commentText = `Note: ${test.comment}`;
                const commentHeight = wrapText(
                  doc,
                  commentText,
                  colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] - 2,
                  leftMargin,
                  yPos,
                  3.5,
                );
                yPos += commentHeight + 2;
              }
            }
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);

            Object.keys(parametersBySubtitle).forEach((subtitle) => {
              if (subtitle && subtitle.trim() !== "") {
                yPos = checkForNewPageLab(yPos, 25);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.text(subtitle, leftMargin, yPos);
                yPos += 6;
              }
              parametersBySubtitle[subtitle].forEach((currentTest) => {
                const paramNameText = currentTest.name;
                const paramNameLines = doc.splitTextToSize(
                  paramNameText,
                  colWidths[0] - 2,
                );
                const specimenLines = doc.splitTextToSize(
                  currentTest.specimen_type || "",
                  colWidths[1] - 2,
                );
                const valueText = currentTest.value || "";
                const valueLines = doc.splitTextToSize(
                  valueText,
                  colWidths[3] - 2,
                );
                const unitText = processUnicodeText(currentTest.unit || "");
                const unitLines = doc.splitTextToSize(
                  unitText,
                  colWidths[4] - 2,
                );
                const refLines = doc.splitTextToSize(
                  currentTest.reference_range || "",
                  colWidths[5] - 2,
                );
                const methodText = (currentTest.method || "")
                  .replace(/\bMethod\b/i, "")
                  .trim();
                const methodLines = doc.splitTextToSize(
                  methodText,
                  colWidths[6] - 2,
                );
                const maxContentHeight = Math.max(
                  paramNameLines.length * 4,
                  specimenLines.length * 4,
                  valueLines.length * 4,
                  unitLines.length * 4,
                  refLines.length * 4,
                  methodLines.length * 4,
                  6,
                );
                yPos = checkForNewPageLab(yPos, maxContentHeight + 2);
                doc.setFontSize(10);
                let xPos = leftMargin;
                doc.setFont("helvetica", "normal");
                wrapText(doc, paramNameText, colWidths[0] - 2, xPos, yPos, 4);
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
                const statusIndicator = currentTest.isHigh
                  ? "H"
                  : currentTest.isLow
                    ? "L"
                    : getHighLowStatus(
                        currentTest.value,
                        currentTest.reference_range,
                      );
                if (statusIndicator) {
                  doc.setFont("helvetica", "bold");
                  doc.setTextColor(
                    statusIndicator === "H" ? 255 : 0,
                    0,
                    statusIndicator === "L" ? 255 : 0,
                  );
                }
                wrapText(doc, valueText, colWidths[3] - 5, xPos, yPos, 4);
                if (statusIndicator && valueText) {
                  const lastLineY = yPos + (valueLines.length - 1) * 4;
                  const lastLine = valueLines[valueLines.length - 1];
                  const valueWidth = doc.getTextWidth(lastLine);
                  drawArrowSymbol(
                    doc,
                    xPos + valueWidth + 2,
                    lastLineY - 1,
                    statusIndicator === "H" ? "up" : "down",
                  );
                }
                doc.setTextColor(0, 0, 0);
                doc.setFont("helvetica", "normal");
                xPos += colWidths[3];
                const processedUnit = processUnicodeText(
                  currentTest.unit || "",
                );
                const unitSplitText = doc.splitTextToSize(
                  processedUnit,
                  colWidths[4] - 2,
                );
                unitSplitText.forEach((line, idx) => {
                  if (line.includes("µ")) {
                    const parts = line.split("µ");
                    let currentX = xPos;
                    parts.forEach((part, partIdx) => {
                      if (partIdx > 0) {
                        doc.text("µ", currentX, yPos + idx * 4);
                        currentX += doc.getTextWidth("µ");
                      }
                      if (part) {
                        doc.text(part, currentX, yPos + idx * 4);
                        currentX += doc.getTextWidth(part);
                      }
                    });
                  } else {
                    doc.text(line, xPos, yPos + idx * 4);
                  }
                });
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
                wrapText(doc, methodText, colWidths[6] - 2, xPos, yPos, 4);
                yPos += maxContentHeight + 2;
                if (currentTest.comment && currentTest.comment.trim() !== "") {
                  doc.setFont("helvetica", "italic");
                  doc.setFontSize(8);
                  const paramCommentText = `Note: ${currentTest.comment}`;
                  const paramCommentHeight = wrapText(
                    doc,
                    paramCommentText,
                    colWidths[0] +
                      colWidths[1] +
                      colWidths[2] +
                      colWidths[3] -
                      2,
                    leftMargin,
                    yPos,
                    3.5,
                  );
                  yPos += paramCommentHeight + 2;
                }
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
              });
            });

            if (
              hasMultipleVerifiers &&
              test.verified_by &&
              test.verified_by.trim() !== ""
            ) {
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

        yPos += 4;
        yPos = checkForNewPageLab(yPos, 10);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const centerX = leftMargin + contentWidth / 2;
        doc.text("**End of the Report**", centerX, yPos, { align: "center" });
        addSignatures();
      };

      // ── Generate PDF ─────────────────────────────────────────────────────
      addHeaderFooter();
      currentYPosition = addMedicalExaminationHeader(currentYPosition);
      currentYPosition = addMedicalHistory(currentYPosition);
      currentYPosition = addGeneralExamination(currentYPosition);
      currentYPosition = addMiscellaneousInvestigations(currentYPosition);
      currentYPosition = addLabInvestigations(currentYPosition);
      currentYPosition = addFinalAssessment(currentYPosition);
      addXrayReportContent();
      await addInvestigationFiles();
      addLaboratoryReports();

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height;
        const pageNumberY = pageHeight - footerHeight - 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(
          `Page ${i} of ${pageCount}`,
          leftMargin + contentWidth / 2,
          pageNumberY,
          { align: "center" },
        );
      }

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
      console.error("Error while generating the PDF:", error);
      toast.error("An unexpected error occurred while generating the PDF");
      setLoading(false);
      return null;
    }
  };

  // ── handleOverallPrint, generateSimplePDFFromData, and all other handlers
  // are unchanged from the original — they do not use get_investigation_status
  // because batch printing uses get_batch_corporate_health_reports which already
  // embeds investigation data server-side (see corporate_health_report endpoint).
  // ─────────────────────────────────────────────────────────────────────────

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
      const BATCH_SIZE = 100;
      const barcodeBatches = [];
      for (let i = 0; i < allBarcodes.length; i += BATCH_SIZE)
        barcodeBatches.push(allBarcodes.slice(i, i + BATCH_SIZE));
      let allPatientData = {};
      for (
        let batchIndex = 0;
        batchIndex < barcodeBatches.length;
        batchIndex++
      ) {
        const batch = barcodeBatches[batchIndex];
        const batchNumber = batchIndex + 1;
        toast.info(
          `Fetching batch ${batchNumber}/${barcodeBatches.length} (${batch.length} reports)...`,
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
          const batchResults = result.data.results || {};
          allPatientData = { ...allPatientData, ...batchResults };
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
      toast.info(
        `Data fetched successfully. Generating ${successfulFetches} PDFs...`,
      );
      const zip = new JSZip();
      let successCount = 0;
      let failCount = 0;
      // AFTER — fetches investigation status + files for each patient, mirrors handlePrint
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

          // ── 1. Fetch investigation status (vitals, history, notes, files) ──────
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

          // ── 2. Fetch investigation files from chc_tests ──────────────────────
          const chcTestsForFiles =
            invResult.success && invResult.data?.chc_tests?.length > 0
              ? invResult.data.chc_tests
              : investigationStatuses[bc]?.chc_tests || [];

          const investigationFiles = {};
          const filePromises = chcTestsForFiles.map(async (test) => {
            if (test.files && test.files.length > 0) {
              const testFiles = await Promise.all(
                test.files.map((fileId) => fetchInvestigationFile(fileId)),
              );
              investigationFiles[test.test_id] = {
                label: test.testname,
                files: testFiles.filter(Boolean),
              };
            }
          });
          await Promise.all(filePromises);

          patientDetails.investigation_files = investigationFiles;
          patientDetails.chc_tests_for_files = chcTestsForFiles;

          // ── 3. Signatures ────────────────────────────────────────────────────
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

          const pdfBlob = await generateSimplePDFFromData(
            patientDetails,
            activeConsultants,
            true,
          );
          if (pdfBlob) {
            const fileName = `${patientDetails.patient_id}_${(patientDetails.patientname || "Unknown").replace(/\s+/g, "_")}.pdf`;
            zip.file(fileName, pdfBlob);
            successCount++;
          } else {
            failCount++;
          }

          if ((i + 1) % 5 === 0 || i === filteredPatients.length - 1)
            toast.info(
              `Progress: ${i + 1}/${filteredPatients.length} PDFs generated`,
            );
        } catch (error) {
          failCount++;
          console.error(
            `Error processing patient ${patient.patient_name}:`,
            error,
          );
        }
      }
      if (successCount > 0) {
        try {
          toast.info("Creating ZIP file...");
          const zipBlob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 },
          });
          const startDateStr = format(startDate, "yyyy-MM-dd");
          const endDateStr = format(endDate, "yyyy-MM-dd");
          saveAs(zipBlob, `CHC_Reports_${startDateStr}_to_${endDateStr}.zip`);
          toast.success(
            `Successfully generated ${successCount} reports! ${failCount > 0 ? `(${failCount} failed)` : ""}`,
          );
        } catch (zipError) {
          console.error("Error creating ZIP:", zipError);
          toast.error("Failed to create ZIP file");
        }
      } else {
        toast.error("Failed to generate any PDF reports");
      }
    } catch (error) {
      console.error("Error in batch processing:", error);
      toast.error(
        "Failed to process batch: " + (error.message || "Unknown error"),
      );
    }
    setLoading(false);
  };

  const generateSimplePDFFromData = async (
    patientDetails,
    activeConsultants = [],
    withLetterpad = true,
  ) => {
    try {
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

      const addHeaderFooter = () => {
        if (withLetterpad) {
          doc.addImage(
            headerImage,
            "PNG",
            0,
            5,
            doc.internal.pageSize.width,
            headerHeight,
          );
          const footerY = doc.internal.pageSize.height - footerHeight;
          doc.addImage(
            FooterImage,
            "PNG",
            0,
            footerY,
            doc.internal.pageSize.width,
            footerHeight,
          );
        }
      };

      const checkForNewPage = (yPos, estimatedHeight) => {
        const pageHeight = doc.internal.pageSize.height;
        const footerStart = pageHeight - footerHeight - 30;
        if (yPos + estimatedHeight >= footerStart) {
          doc.addPage();
          pageCount++;
          addHeaderFooter();
          return headerHeight + 10;
        }
        return yPos;
      };

      const addMedicalExaminationHeader = (yPos) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        yPos += 15;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        const leftCol = [
          { label: "Name", value: patientDetails.patientname || "N/A" },
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
            label: "Reported Date",
            value: safeFormatDate(
              patientDetails.final_assessment?.approved_date,
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
          { label: "Employee ID", value: patientDetails.patient_id || "N/A" },
          { label: "Department", value: patientDetails.department || "N/A" },
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
        return yPos + 5;
      };

      const addGeneralExamination = (yPos) => {
        yPos = checkForNewPage(yPos, 30);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("VITALS", leftMargin, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const colWidths = [60, 40, 50];
        const tableStartX = leftMargin;
        const rowHeight = 8;
        doc.rect(
          tableStartX,
          yPos,
          colWidths[0] + colWidths[1] + colWidths[2],
          rowHeight,
        );
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
        doc.text("Parameter", tableStartX + 2, yPos + 5);
        doc.text("Reading", tableStartX + colWidths[0] + 2, yPos + 5);
        doc.text(
          "Normal Range",
          tableStartX + colWidths[0] + colWidths[1] + 2,
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
            range: "18.5 - 24.9",
          },
          {
            param: "Blood Pressure",
            value: (patientDetails.vitals?.blood_pressure || "N/A") + " mmHg",
            range: "120/80",
          },
          {
            param: "Pulse Rate",
            value: (patientDetails.vitals?.spo2 || "N/A") + " bpm",
            range: "60 - 100",
          },
        ];
        doc.setFont("helvetica", "normal");
        vitalSigns.forEach((item) => {
          const rowY = yPos;
          doc.rect(
            tableStartX,
            rowY,
            colWidths[0] + colWidths[1] + colWidths[2],
            rowHeight,
          );
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
          doc.text(item.param, tableStartX + 2, rowY + 5);
          doc.text(item.value, tableStartX + colWidths[0] + 2, rowY + 5);
          doc.text(
            item.range,
            tableStartX + colWidths[0] + colWidths[1] + 2,
            rowY + 5,
          );
          yPos += rowHeight;
        });
        return yPos + 10;
      };

      // ── Dynamic miscellaneous — mirrors handlePrint exactly ──────────────
      const addMiscellaneousInvestigations = (yPos) => {
        yPos = checkForNewPage(yPos, 15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("MISCELLANEOUS", leftMargin, yPos);
        yPos += 10;
        doc.setFontSize(10);

        const chcTestsForMisc = patientDetails.chc_tests_for_files || [];
        const availedTests = chcTestsForMisc.filter(
          (t) => t.has_report || t.has_file,
        );

        if (availedTests.length === 0) {
          doc.setFont("helvetica", "normal");
          doc.text(
            "No miscellaneous investigations recorded.",
            leftMargin,
            yPos,
          );
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

      const addLabInvestigations = (yPos) => {
        if (
          !patientDetails.testdetails ||
          patientDetails.testdetails.length === 0
        )
          return yPos;
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
        const impression = patientDetails.final_assessment?.impression;
        const remarks = patientDetails.final_assessment?.remarks;
        if (impression && impression.trim()) {
          doc.text("Impression", leftMargin, yPos);
          doc.text(":", leftMargin + 30, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(impression, leftMargin + 35, yPos);
          doc.setFont("helvetica", "bold");
          yPos += 6;
        }
        if (remarks && remarks.trim()) {
          yPos += 10;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.text(remarks, leftMargin, yPos);
        }
        yPos += 15;
        const signatureX = leftMargin + 120;
        if (DRPS) doc.addImage(DRPS, "PNG", signatureX, yPos, 35, 25);
        yPos += 25;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Dr. P. PRABU SANKAR, MS, MRCS.,", leftMargin + 120, yPos);
        yPos += 5;
        doc.text("GENERAL SURGEON", leftMargin + 120, yPos);
        yPos += 5;
        doc.text("Reg No. 80709", leftMargin + 120, yPos);
        yPos += 5;
        doc.text("Shanmuga Hospital Ltd, Salem-7.", leftMargin + 120, yPos);
        return yPos + 10;
      };

      const addXrayReportContent = () => {
        const xrayReport = patientDetails.investigation_notes?.xray_report;
        if (!xrayReport || !xrayReport.trim()) return;
        doc.addPage();
        pageCount++;
        addHeaderFooter();
        let yPos = headerHeight + 10;
        yPos = addMedicalExaminationHeader(yPos);
        yPos += 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("X-RAY CHEST PA VIEW", leftMargin + contentWidth / 2, yPos, {
          align: "center",
        });
        yPos += 15;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const normalizedReport = xrayReport
          .replace(/\\r\\n/g, "\n")
          .replace(/\r\n/g, "\n");
        const paragraphs = normalizedReport
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
        const allSentences = [];
        paragraphs.forEach((paragraph) => {
          const sentences = paragraph
            .split(/\.(?=\s|$)/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
            .map((s) => (s.endsWith(".") ? s : s + "."));
          allSentences.push(...sentences);
        });
        allSentences.forEach((sentence) => {
          const wrappedLines = doc.splitTextToSize(sentence, contentWidth - 10);
          doc.text(wrappedLines, leftMargin, yPos);
          yPos += wrappedLines.length * 5.5 + 4;
        });
        yPos += 8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("IMPRESSION:", leftMargin, yPos);
        yPos += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const impressionText =
          patientDetails.investigation_notes?.xray_notes ||
          "No significant finding in the lungs or mediastinum.";
        const impressionLines = doc.splitTextToSize(
          impressionText,
          contentWidth - 10,
        );
        doc.text(impressionLines, leftMargin, yPos);
        yPos += impressionLines.length * 5.5 + 20;
        const signatureX = leftMargin + 120;
        if (Muhsina) doc.addImage(Muhsina, "PNG", signatureX, yPos, 35, 15);
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
      };

      // ── Investigation files — mirrors handlePrint exactly ────────────────
      const addInvestigationFiles = async () => {
        const files = patientDetails.investigation_files;
        const chcTestsOrder = patientDetails.chc_tests_for_files || [];
        const hasFiles =
          files &&
          Object.values(files).some((t) => t.files && t.files.length > 0);
        if (!hasFiles) return;

        const pageHeight = doc.internal.pageSize.height;

        for (const test of chcTestsOrder) {
          const testEntry = files[test.test_id];
          if (!testEntry || !testEntry.files || testEntry.files.length === 0)
            continue;
          const label = testEntry.label || test.testname;

          const allImages = [];
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
            } catch (error) {
              console.error(`Error processing file in ${label}:`, error);
            }
          }

          if (allImages.length === 0) continue;

          const isSingle = allImages.length === 1;
          const COLS = isSingle ? 1 : 2;
          const IMAGES_PER_PAGE = isSingle ? 1 : 4;
          const colGap = 4;
          const rowGap = 6;

          const headerSectionEnd = headerHeight + 10 + 35 + 15 + 10;
          const footerSectionStart = pageHeight - footerHeight - 10 - 5;
          const availableHeight = footerSectionStart - headerSectionEnd;

          const imgWidth = isSingle
            ? contentWidth
            : (contentWidth - colGap) / 2;
          const imgHeight = isSingle
            ? availableHeight
            : (availableHeight - rowGap) / 2;

          let imageIndex = 0;
          const totalGridPages = Math.ceil(allImages.length / IMAGES_PER_PAGE);

          while (imageIndex < allImages.length) {
            doc.addPage();
            pageCount++;
            addHeaderFooter();

            let yPos = headerHeight + 10;
            yPos = addMedicalExaminationHeader(yPos);
            yPos += 5;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            const currentGridPage =
              Math.floor(imageIndex / IMAGES_PER_PAGE) + 1;
            const pageTitle =
              totalGridPages > 1
                ? `${label} (Page ${currentGridPage}/${totalGridPages})`
                : label;
            doc.text(pageTitle, leftMargin + contentWidth / 2, yPos, {
              align: "center",
            });
            yPos += 10;

            const gridStartY = yPos;
            const imagesOnThisPage = Math.min(
              IMAGES_PER_PAGE,
              allImages.length - imageIndex,
            );

            for (let slot = 0; slot < imagesOnThisPage; slot++) {
              const img = allImages[imageIndex + slot];
              const col = slot % COLS;
              const row = Math.floor(slot / COLS);
              const xPos = leftMargin + col * (imgWidth + colGap);
              const yPosCell = gridStartY + row * (imgHeight + rowGap);
              try {
                doc.addImage(
                  img.dataUri,
                  img.format,
                  xPos,
                  yPosCell,
                  imgWidth,
                  imgHeight,
                );
              } catch (imgError) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.text(
                  `[Image load error: ${imgError.message}]`,
                  xPos,
                  yPosCell + imgHeight / 2,
                );
              }
            }
            imageIndex += IMAGES_PER_PAGE;
          }
        }
      };

      const addLaboratoryReports = () => {
        if (
          !patientDetails.testdetails ||
          patientDetails.testdetails.length === 0
        )
          return;

        const labTests = patientDetails.testdetails.filter(
          (test) =>
            ![
              "Audiometry",
              "Pulmonary Function Test",
              "Chest - XRay",
              "ECG",
              "Eye examination",
            ].includes(test.testname),
        );
        if (labTests.length === 0) return;

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
          α: "α",
          β: "β",
          γ: "γ",
          δ: "δ",
          Ω: "Ω",
          "²": "²",
          "³": "³",
          "⁴": "⁴",
          "°": "°",
          "±": "±",
          "×": "x",
          "÷": "/",
        };
        const processUnicodeText = (text) => {
          if (!text) return "";
          let t = text;
          t = t.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
            const char = String.fromCharCode(parseInt(hex, 16));
            return unicodeMap[char] || char;
          });
          Object.keys(unicodeMap).forEach((u) => {
            t = t.replace(new RegExp(u, "g"), unicodeMap[u]);
          });
          return t;
        };

        const wrapText = (
          doc,
          text,
          maxWidth,
          startX,
          yPos,
          lineHeight = 4,
        ) => {
          if (!text) return 0;
          const splitText = doc.splitTextToSize(text, maxWidth);
          splitText.forEach((line, index) => {
            doc.text(line, startX, yPos + index * lineHeight);
          });
          return splitText.length * lineHeight;
        };

        const getHighLowStatus = (value, reference) => {
          if (!value || !reference) return null;
          const numValue = parseFloat(value);
          if (isNaN(numValue)) return null;
          if (reference.includes("-")) {
            const [min, max] = reference.split("-").map((v) => parseFloat(v));
            if (!isNaN(min) && !isNaN(max)) {
              if (numValue < min) return "L";
              if (numValue > max) return "H";
            }
          } else if (reference.includes("<")) {
            const max = parseFloat(reference.replace("<", ""));
            if (!isNaN(max) && numValue > max) return "H";
          } else if (reference.includes(">")) {
            const min = parseFloat(reference.replace(">", ""));
            if (!isNaN(min) && numValue < min) return "L";
          }
          return null;
        };

        const drawArrowSymbol = (doc, x, y, direction) => {
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.5);
          if (direction === "up") {
            doc.line(x, y, x + 1, y - 1);
            doc.line(x + 1, y - 1, x + 2, y);
            doc.line(x + 1, y - 1, x + 1, y + 2);
          } else if (direction === "down") {
            doc.line(x, y, x + 1, y + 1);
            doc.line(x + 1, y + 1, x + 2, y);
            doc.line(x + 1, y + 1, x + 1, y - 2);
          }
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
          headers.forEach((header, index) => {
            if (header) doc.text(header, xPos, yPos);
            xPos += colWidths[index];
          });
          yPos += 3;
          doc.line(leftMargin, yPos, rightMargin, yPos);
          yPos += 5;
          return yPos;
        };

        const addLabReportHeader = (yPos) => {
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text("Reg.ID", leftMargin, yPos);
          doc.text(":", leftMargin + 30, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(patientDetails.patient_id || "N/A", leftMargin + 35, yPos);
          doc.setFont("helvetica", "bold");
          doc.text("Collected On", leftMargin + 100, yPos);
          doc.text(":", leftMargin + 140, yPos);
          doc.setFont("helvetica", "normal");
          const firstTest = labTests[0];
          if (firstTest?.samplecollected_time) {
            doc.text(
              safeFormatDate(
                firstTest.samplecollected_time,
                "dd MMM yy / HH:mm",
              ),
              leftMargin + 145,
              yPos,
            );
          }
          yPos += 5;

          doc.setFont("helvetica", "bold");
          doc.text("Name", leftMargin, yPos);
          doc.text(":", leftMargin + 30, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(patientDetails.patientname || "N/A", leftMargin + 35, yPos);
          doc.setFont("helvetica", "bold");
          doc.text("Received On", leftMargin + 100, yPos);
          doc.text(":", leftMargin + 140, yPos);
          doc.setFont("helvetica", "normal");
          if (firstTest?.received_time) {
            doc.text(
              safeFormatDate(firstTest.received_time, "dd MMM yy / HH:mm"),
              leftMargin + 145,
              yPos,
            );
          }
          yPos += 5;

          doc.setFont("helvetica", "bold");
          doc.text("Age/Gender", leftMargin, yPos);
          doc.text(":", leftMargin + 30, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(
            `${patientDetails.age || "N/A"} / ${patientDetails.gender || "N/A"}`,
            leftMargin + 35,
            yPos,
          );
          doc.setFont("helvetica", "bold");
          doc.text("Reported Date", leftMargin + 100, yPos);
          doc.text(":", leftMargin + 140, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(
            safeFormatDate(
              firstTest?.approve_time,
              "dd MMM yy / HH:mm",
              safeFormatDate(new Date().toISOString(), "dd MMM yy / HH:mm"),
            ),
            leftMargin + 145,
            yPos,
          );
          yPos += 5;

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
          const pageHeight = doc.internal.pageSize.height;
          const signatureHeight = 25;
          const signaturesY = pageHeight - footerHeight - signatureHeight - 10;
          if (activeConsultants.length === 0) return;
          const signatureWidth = 35;
          const totalConsultants = activeConsultants.length;
          const rightEdge = rightMargin;
          const signatureSpacing = 60;
          const startX = rightEdge - totalConsultants * signatureSpacing;
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

        const checkForNewPageLab = (yPos, estimatedHeight) => {
          const pageHeight = doc.internal.pageSize.height;
          const footerStart = pageHeight - footerHeight - 35;
          if (yPos + estimatedHeight >= footerStart) {
            addSignatures();
            doc.addPage();
            pageCount++;
            addHeaderFooter();
            let newYPos = headerHeight + 10;
            newYPos = addLabReportHeader(newYPos);
            newYPos = drawTableHeader(newYPos);
            return newYPos;
          }
          return yPos;
        };

        const testsByDepartment = labTests.reduce((acc, test) => {
          const dept = test.department || "LABORATORY";
          (acc[dept] = acc[dept] || []).push(test);
          return acc;
        }, {});

        const sortedDepartments = Object.keys(testsByDepartment).sort(
          (a, b) => {
            const iA = departmentOrder.indexOf(a);
            const iB = departmentOrder.indexOf(b);
            if (iA !== -1 && iB !== -1) return iA - iB;
            if (iA !== -1) return -1;
            if (iB !== -1) return 1;
            return a.localeCompare(b);
          },
        );

        doc.addPage();
        pageCount++;
        addHeaderFooter();
        let yPos = headerHeight + 10;
        yPos = addLabReportHeader(yPos);
        yPos = drawTableHeader(yPos);

        sortedDepartments.forEach((department) => {
          const verifiedBySet = new Set();
          testsByDepartment[department].forEach((test) => {
            if (test.verified_by && test.verified_by.trim() !== "")
              verifiedBySet.add(test.verified_by);
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

            const parametersBySubtitle = {};
            if (test.parameters && test.parameters.length > 0) {
              test.parameters.forEach((param) => {
                const subtitle = param.sub_title || "";
                if (!parametersBySubtitle[subtitle])
                  parametersBySubtitle[subtitle] = [];
                parametersBySubtitle[subtitle].push(param);
              });
            }

            yPos = checkForNewPageLab(yPos, 20);
            const testNameLines = doc.splitTextToSize(
              test.testname,
              colWidths[0] - 2,
            );
            const valueText = test.value || "";
            const valueLines = doc.splitTextToSize(valueText, colWidths[3] - 2);
            const specimenLines = doc.splitTextToSize(
              test.specimen_type || "",
              colWidths[1] - 2,
            );
            const refLines = doc.splitTextToSize(
              test.reference_range || "",
              colWidths[5] - 2,
            );
            const methodText = (test.method || "")
              .replace(/\bMethod\b/i, "")
              .trim();
            const methodLines = doc.splitTextToSize(
              methodText,
              colWidths[6] - 2,
            );
            const unitText = processUnicodeText(test.unit || "");
            const maxContentHeight = Math.max(
              testNameLines.length * 4,
              specimenLines.length * 4,
              valueLines.length * 4,
              doc.splitTextToSize(unitText, colWidths[4] - 2).length * 4,
              refLines.length * 4,
              methodLines.length * 4,
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

            const statusIndicator = getHighLowStatus(
              test.value,
              test.reference_range,
            );
            if (statusIndicator) {
              doc.setFont("helvetica", "bold");
              doc.setTextColor(
                statusIndicator === "H" ? 255 : 0,
                0,
                statusIndicator === "L" ? 255 : 0,
              );
            }
            wrapText(doc, valueText, colWidths[3] - 5, xPos, yPos, 4);
            if (statusIndicator && valueText) {
              const lastLineY = yPos + (valueLines.length - 1) * 4;
              const lastLine = valueLines[valueLines.length - 1];
              const valueWidth = doc.getTextWidth(lastLine);
              drawArrowSymbol(
                doc,
                xPos + valueWidth + 2,
                lastLineY - 1,
                statusIndicator === "H" ? "up" : "down",
              );
            }
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            xPos += colWidths[3];

            const processedUnit = processUnicodeText(test.unit || "");
            const unitSplitText = doc.splitTextToSize(
              processedUnit,
              colWidths[4] - 2,
            );
            unitSplitText.forEach((line, idx) => {
              doc.text(line, xPos, yPos + idx * 4);
            });
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

            if (test.outsourced === true) {
              doc.setFont("helvetica", "italic");
              doc.setFontSize(8);
              doc.text("(Outsourced)", leftMargin, yPos);
              yPos += 4;
            }
            if (!test.parameters || test.parameters.length === 0) {
              if (test.comment && test.comment.trim() !== "") {
                doc.setFont("helvetica", "italic");
                doc.setFontSize(8);
                const commentHeight = wrapText(
                  doc,
                  `Note: ${test.comment}`,
                  colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] - 2,
                  leftMargin,
                  yPos,
                  3.5,
                );
                yPos += commentHeight + 2;
              }
            }
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);

            Object.keys(parametersBySubtitle).forEach((subtitle) => {
              if (subtitle && subtitle.trim() !== "") {
                yPos = checkForNewPageLab(yPos, 25);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.text(subtitle, leftMargin, yPos);
                yPos += 6;
              }
              parametersBySubtitle[subtitle].forEach((currentTest) => {
                const paramNameLines = doc.splitTextToSize(
                  currentTest.name,
                  colWidths[0] - 2,
                );
                const pValueText = currentTest.value || "";
                const pValueLines = doc.splitTextToSize(
                  pValueText,
                  colWidths[3] - 2,
                );
                const pRefLines = doc.splitTextToSize(
                  currentTest.reference_range || "",
                  colWidths[5] - 2,
                );
                const pMethodText = (currentTest.method || "")
                  .replace(/\bMethod\b/i, "")
                  .trim();
                const pUnitText = processUnicodeText(currentTest.unit || "");
                const pMaxHeight = Math.max(
                  paramNameLines.length * 4,
                  doc.splitTextToSize(
                    currentTest.specimen_type || "",
                    colWidths[1] - 2,
                  ).length * 4,
                  pValueLines.length * 4,
                  doc.splitTextToSize(pUnitText, colWidths[4] - 2).length * 4,
                  pRefLines.length * 4,
                  doc.splitTextToSize(pMethodText, colWidths[6] - 2).length * 4,
                  6,
                );
                yPos = checkForNewPageLab(yPos, pMaxHeight + 2);
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
                const pStatus = getHighLowStatus(
                  currentTest.value,
                  currentTest.reference_range,
                );
                if (pStatus) {
                  doc.setFont("helvetica", "bold");
                  doc.setTextColor(
                    pStatus === "H" ? 255 : 0,
                    0,
                    pStatus === "L" ? 255 : 0,
                  );
                }
                wrapText(doc, pValueText, colWidths[3] - 5, xPos, yPos, 4);
                if (pStatus && pValueText) {
                  const lastLineY = yPos + (pValueLines.length - 1) * 4;
                  const lastLine = pValueLines[pValueLines.length - 1];
                  drawArrowSymbol(
                    doc,
                    xPos + doc.getTextWidth(lastLine) + 2,
                    lastLineY - 1,
                    pStatus === "H" ? "up" : "down",
                  );
                }
                doc.setTextColor(0, 0, 0);
                doc.setFont("helvetica", "normal");
                xPos += colWidths[3];
                doc
                  .splitTextToSize(pUnitText, colWidths[4] - 2)
                  .forEach((line, idx) => {
                    doc.text(line, xPos, yPos + idx * 4);
                  });
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
                wrapText(doc, pMethodText, colWidths[6] - 2, xPos, yPos, 4);
                yPos += pMaxHeight + 2;
                if (currentTest.comment && currentTest.comment.trim() !== "") {
                  doc.setFont("helvetica", "italic");
                  doc.setFontSize(8);
                  const h = wrapText(
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
                  yPos += h + 2;
                }
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
              });
            });

            if (
              hasMultipleVerifiers &&
              test.verified_by &&
              test.verified_by.trim() !== ""
            ) {
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

        yPos += 4;
        yPos = checkForNewPageLab(yPos, 10);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("**End of the Report**", leftMargin + contentWidth / 2, yPos, {
          align: "center",
        });
        addSignatures();
      };

      // ── Generate PDF ──────────────────────────────────────────────────────
      addHeaderFooter();
      currentYPosition = addMedicalExaminationHeader(currentYPosition);
      currentYPosition = addMedicalHistory(currentYPosition);
      currentYPosition = addGeneralExamination(currentYPosition);
      currentYPosition = addMiscellaneousInvestigations(currentYPosition);
      currentYPosition = addLabInvestigations(currentYPosition);
      currentYPosition = addFinalAssessment(currentYPosition);
      addXrayReportContent();
      await addInvestigationFiles(); // ← now async, mirrors handlePrint
      addLaboratoryReports();

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height;
        const pageNumberY = pageHeight - footerHeight - 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(
          `Page ${i} of ${pageCount}`,
          leftMargin + contentWidth / 2,
          pageNumberY,
          { align: "center" },
        );
      }
      return doc.output("blob");
    } catch (error) {
      console.error("Error generating PDF from data:", error);
      return null;
    }
  };

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
  const showDropdown = (patientId) => {
    setActiveDropdownPatientId(patientId);
  };
  const hideDropdown = () => {
    setActiveDropdownPatientId(null);
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
      const colWidths = [
        { wch: 12 },
        { wch: 15 },
        { wch: 15 },
        { wch: 25 },
        { wch: 10 },
        { wch: 8 },
        { wch: 20 },
        { wch: 40 },
        { wch: 12 },
        { wch: 15 },
        { wch: 20 },
      ];
      ws["!cols"] = colWidths;
      XLSX.utils.book_append_sheet(wb, ws, "CHC Report");
      const startDateStr = format(startDate, "yyyy-MM-dd");
      const endDateStr = format(endDate, "yyyy-MM-dd");
      XLSX.writeFile(wb, `CHC_Report_${startDateStr}_to_${endDateStr}.xlsx`);
      setLoading(false);
      toast.success(
        `Excel report exported successfully! (${excelData.length} records)`,
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error(
        "Failed to export Excel report: " + (error.message || "Unknown error"),
      );
      setLoading(false);
    }
  };

  return (
    <Container>
      <GlobalStyle />
      <Card>
        <CardHeader>
          <Title>Corporate Health Checkup - Approval Report</Title>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <OverallPrintButton
              onClick={handleOverallPrint}
              disabled={loading || filteredPatients.length === 0}
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
              <FilterLabel>Status</FilterLabel>
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
                <th>CHC Investigation Status</th>
                <th>Status</th>
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
                            onMouseEnter={() =>
                              isPrintMailEnabled &&
                              showDropdown(patient.patient_id)
                            }
                            onMouseLeave={hideDropdown}
                          >
                            <ActionButton
                              disabled={!isPrintMailEnabled}
                              title="Print Options"
                            >
                              <Printer size={16} />
                            </ActionButton>
                            {isPrintMailEnabled && (
                              <DropdownMenu
                                isVisible={
                                  activeDropdownPatientId === patient.patient_id
                                }
                              >
                                <DropdownItem
                                  onClick={() => handlePrint(patient, true)}
                                >
                                  Print with Letterpad
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => handlePrint(patient, false)}
                                >
                                  Print without Letterpad
                                </DropdownItem>
                              </DropdownMenu>
                            )}
                          </PrintDropdown>
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
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
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
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
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
          ></div>
        )}
      </Modal>
    </Container>
  );
};

export default CHCReport;
