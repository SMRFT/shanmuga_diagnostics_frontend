import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import {
  Search,
  Calendar,
  Eye,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertTriangle,
  Printer,
} from "lucide-react";
import { format } from "date-fns";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
import apiRequest from "../Auth/apiRequest";

// ===== Global styles =====
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
  .react-datepicker-wrapper { width: auto; display: inline-block; }
  .react-datepicker__input-container { display: inline-block; }
  .react-datepicker__input-container input {
    padding: 0.5rem 0.5rem;
    border: 1px solid var(--gray-light);
    border-radius: var(--border-radius);
    font-size: 0.765rem;
    background-color: white;
    cursor: pointer;
    transition: var(--transition);
    min-width: 100px;
    max-width: 110px;
    &:hover, &:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1); }
  }
  .react-datepicker { border: none; box-shadow: var(--box-shadow); font-family: inherit; z-index: 1000 !important; border: 1px solid var(--gray-light); }
  .react-datepicker-popper { z-index: 1000 !important; }
  .react-datepicker__header { background-color: var(--primary); border-bottom: none; padding-top: 0.8rem; border-radius: 0; }
  .react-datepicker__current-month, .react-datepicker__day-name { color: white; }
  .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected { background-color: var(--primary); &:hover { background-color: var(--primary-dark); } }
  .react-datepicker__day:hover { background-color: var(--gray-light); }
  .react-datepicker__day--disabled { color: var(--gray-light); cursor: not-allowed; }
  .react-datepicker__close-icon::after { background-color: var(--gray); font-size: 16px; }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
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
`;
const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
`;
const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
`;
const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  width: 100%;
  justify-content: flex-start;
`;
const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const DatePickerLabel = styled.label`
  font-size: 0.765rem;
  color: var(--gray);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
`;
const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.765rem;
  transition: var(--transition);
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;
const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
  pointer-events: none;
`;

const BarcodeSearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 350px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StepButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  background-color: var(--light);
  color: var(--primary);
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  line-height: 1;
  &:hover {
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 2px 8px rgba(67, 97, 238, 0.4);
  }
  &:active {
    transform: scale(0.95);
  }
`;
const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.765rem;
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
const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--gray);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.765rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  &:hover {
    background-color: var(--dark);
  }
`;
const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.765rem;
  background-color: white;
  cursor: pointer;
  transition: var(--transition);
  color: var(--dark);
  font-weight: 500;
  &:hover,
  &:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
  }
`;

/* ── KEY FIX: removed rotateX(180deg) from both container and table,
   added overflow-y: auto so the container itself scrolls vertically.
   This allows position: sticky on thead to work correctly. ── */
const TableContainer = styled.div`
  overflow-x: auto;
  overflow-y: auto;
  max-height: 600px;
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
  min-width: 1000px;
`;

/* ── background-color must be on each th individually (not just thead)
   and box-shadow replaces the bottom border because border-collapse
   eats real borders on sticky cells. ── */
const TableHead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 5;
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--gray);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
    background-color: var(--gray-light);
    box-shadow:
      0 1px 0 var(--gray-light),
      0 2px 0 #dee2e6;
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
    font-size: 0.765rem;
  }
`;
const NoData = styled.td`
  text-align: center;
  padding: 2rem !important;
  color: var(--gray);
  font-style: italic;
`;
const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
`;
const WaitingBadge = styled(StatusBadge)`
  background-color: rgba(248, 150, 30, 0.15);
  color: var(--warning);
`;
const EmergencyBadge = styled(StatusBadge)`
  background-color: rgba(247, 37, 133, 0.2);
  color: var(--danger);
  animation: ${blink} 1.5s ease-in-out infinite;
  font-weight: 700;
  border: 1px solid var(--danger);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const NormalBadge = styled(StatusBadge)`
  background-color: rgba(76, 201, 240, 0.15);
  color: var(--success);
  font-weight: 600;
`;
const OutsourcedBadge = styled(StatusBadge)`
  background-color: rgba(246, 160, 233, 0.15);
  color: #d75de0ff;
  animation: ${blink} 1.5s ease-in-out infinite;
  font-weight: 600;
  border: 1px solid #d75de0ff;
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
  font-size: 0.765rem;
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
const ViewButton = styled(Button)`
  padding: 0.35rem 0.75rem;
  background-color: var(--primary-light);
  &:hover {
    background-color: var(--primary);
  }
`;
const PrintButton = styled(Button)`
  padding: 0.35rem 0.75rem;
  background-color: #6c757d;
  &:hover {
    background-color: #495057;
  }
  &:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
const ActionButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const TestList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;
const TestItem = styled.li`
  white-space: nowrap;
  font-size: 0.765rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const StatusList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid var(--gray-light);
`;
const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--gray-light);
  background-color: white;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  &:hover {
    background-color: var(--gray-light);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const PaginationInfo = styled.div`
  margin: 0 1rem;
  font-size: 0.765rem;
  color: var(--gray);
`;

// ===== Helpers =====
const formatYmd = (d) => {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const parseYmd = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  date.setHours(0, 0, 0, 0);
  return isNaN(date.getTime()) ? null : date;
};

// ===== Component =====
function PatientList() {
  const navigate = useNavigate();
  const location = useLocation();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const initialFrom = useMemo(() => {
    try {
      return parseYmd(sessionStorage.getItem("patient_from")) || today;
    } catch {
      return today;
    }
  }, [today]);
  const initialTo = useMemo(() => {
    try {
      return parseYmd(sessionStorage.getItem("patient_to")) || today;
    } catch {
      return today;
    }
  }, [today]);

  const [fromDate, setFromDate] = useState(initialFrom);
  const [toDate, setToDate] = useState(initialTo);
  const [emergencyFilter, setEmergencyFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [patientList, setPatientList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBarcodeStep = (delta) => {
    setSearchQuery((prev) => {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [printingBarcode, setPrintingBarcode] = useState(null);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    try {
      sessionStorage.setItem(
        "patient_from",
        fromDate ? formatYmd(fromDate) : "",
      );
      sessionStorage.setItem("patient_to", toDate ? formatYmd(toDate) : "");
    } catch (e) {
      console.error("Failed to save to sessionStorage:", e);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    if (location.state?.barcode) {
      setSearchQuery(location.state.barcode);
      setCurrentPage(1);
    }
  }, [location.state]);

  const fetchPatientData = async (
    fromDateParam,
    toDateParam,
    emergency = "all",
  ) => {
    setLoading(true);
    setError(null);
    const queryParams = new URLSearchParams();
    if (fromDateParam)
      queryParams.append(
        "from_date",
        fromDateParam.toLocaleDateString("en-CA"),
      );
    if (toDateParam)
      queryParams.append("to_date", toDateParam.toLocaleDateString("en-CA"));
    if (emergency && emergency !== "all")
      queryParams.append("emergency", emergency);
    const queryString = queryParams.toString();
    const url = `${Labbaseurl}test-values/${queryString ? `?${queryString}` : ""}`;
    try {
      const patientResponse = await apiRequest(url, "GET");
      if (!patientResponse.success)
        throw new Error(
          patientResponse.error || "Failed to fetch patient data",
        );
      const patientData = Array.isArray(patientResponse.data)
        ? patientResponse.data
        : [];
      setPatientList(patientData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setPatientList([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData(fromDate, toDate, emergencyFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = () => {
    fetchPatientData(fromDate, toDate, emergencyFilter);
    setCurrentPage(1);
  };
  const handleClearFilter = () => {
    setFromDate(today);
    setToDate(today);
    setEmergencyFilter("all");
    setLocationFilter("all");
    fetchPatientData(today, today, "all");
    setCurrentPage(1);
  };

  const handleViewDetails = (patient) => {
    if (!patient || !patient.date) {
      console.error("Invalid patient data:", patient);
      return;
    }
    const date = new Date(patient.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    navigate(
      `/DoctorForm?patient_id=${patient.patient_id}&date=${formattedDate}`,
      {
        state: {
          patientHistory: patient.patient_history || "",
          patientData: {
            patient_id: patient.patient_id,
            patientname: patient.patientname,
            age: patient.age,
            barcode: patient.barcode,
            date: patient.date,
            locationId: patient.locationId,
            created_date: patient.created_date,
            testdetails: patient.testdetails || [],
            is_emergency: patient.is_emergency || false,
            patient_history: patient.patient_history || "",
          },
          skipFetch: true,
        },
      },
    );
  };

  // ===== handlePrint — uses already-fetched grouped patient object =====
  const handlePrint = (patient) => {
    if (!patient) return;
    setPrintingBarcode(patient.barcode);

    try {
      if (!patient.testdetails || patient.testdetails.length === 0) {
        toast.error("No test details found for this patient.");
        setPrintingBarcode(null);
        return;
      }

      // ── Unicode helpers ──
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
        let t = String(text);
        t = t.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
          const char = String.fromCharCode(parseInt(hex, 16));
          return unicodeMap[char] || char;
        });
        Object.keys(unicodeMap).forEach((u) => {
          t = t.replace(new RegExp(u, "g"), unicodeMap[u]);
        });
        return t;
      };

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

      // ── Barcode image ──
      const patientRefNoNumber = patient.barcode || "N/A";
      let barcodeImage = null;
      if (patientRefNoNumber !== "N/A") {
        try {
          const barcodeCanvas = document.createElement("canvas");
          JsBarcode(barcodeCanvas, patientRefNoNumber, {
            format: "CODE128",
            lineColor: "#000",
            width: 1.5,
            height: 10,
            displayValue: false,
            margin: 0,
          });
          barcodeImage = barcodeCanvas.toDataURL("image/png");
        } catch (e) {
          console.warn("Barcode generation failed:", e);
        }
      }

      // ── PDF layout ──
      const leftMargin = 10;
      const rightMargin = leftMargin + 190;
      const contentWidth = rightMargin - leftMargin;
      const headerHeight = 30;
      const footerHeight = 20;
      const contentYStart = headerHeight + 20;
      const tableHeaderHeight = 10;
      const colWidths = [
        contentWidth * 0.28,
        contentWidth * 0.12,
        contentWidth * 0.05,
        contentWidth * 0.13,
        contentWidth * 0.1,
        contentWidth * 0.17,
        contentWidth * 0.15,
      ];

      const ageLabel = [
        patient.age != null ? String(patient.age) : "",
        patient.age_type ? patient.age_type : "",
      ]
        .filter(Boolean)
        .join(" ");
      const genderLabel = patient.gender ? String(patient.gender) : "";
      const ageGenderVal =
        ageLabel && genderLabel
          ? `${ageLabel} / ${genderLabel}`
          : ageLabel || genderLabel || "N/A";

      const leftDetails = [
        { label: "UHID", value: patient.patient_id || "" },
        { label: "Name", value: patient.patientname || "" },
        { label: "Age/Gender", value: ageGenderVal },
        ...(patient.ref_doctor
          ? [{ label: "Referral", value: patient.ref_doctor }]
          : []),
        ...(patient.phone ? [{ label: "Phone", value: patient.phone }] : []),
      ];

      const verifiedOn = patient.created_date
        ? (() => {
          try {
            return format(
              new Date(patient.created_date),
              "dd MMM yy / HH:mm",
            );
          } catch {
            return "N/A";
          }
        })()
        : "N/A";

      const rightDetails = [
        { label: "Verified On", value: verifiedOn },
        {
          label: "Printed Date",
          value: format(new Date(), "dd MMM yy / HH:mm"),
        },
        { label: "Ref.No", value: patientRefNoNumber },
      ];

      // ── jsPDF helpers ──
      const doc = new jsPDF();
      let pageCount = 1;
      let isTableStarted = false;
      const centerX = leftMargin + contentWidth / 2;

      const wrapLines = (text, maxWidth) => {
        if (!text) return [];
        return doc.splitTextToSize(String(text), maxWidth);
      };
      const renderWrapped = (text, maxWidth, x, y, lh = 4) => {
        if (!text) return 0;
        const lines = wrapLines(text, maxWidth);
        lines.forEach((l, i) => doc.text(l, x, y + i * lh));
        return lines.length * lh;
      };
      const renderUnicode = (text, x, y) => {
        const processed = processUnicodeText(text);
        if (processed.includes("µ")) {
          const parts = processed.split("µ");
          let cx = x;
          parts.forEach((part, i) => {
            if (i > 0) {
              doc.text("µ", cx, y);
              cx += doc.getTextWidth("µ");
            }
            if (part) {
              doc.text(part, cx, y);
              cx += doc.getTextWidth(part);
            }
          });
        } else {
          doc.text(processed, x, y);
        }
      };
      const calcMaxLabelWidth = (details) => {
        const tmp = new jsPDF();
        return Math.max(...details.map((d) => tmp.getTextWidth(d.label)));
      };

      const addPatientInfo = (yPos) => {
        const leftMaxLW = calcMaxLabelWidth(leftDetails);
        const rightMaxLW = calcMaxLabelWidth(rightDetails);
        const cp = (leftMargin + rightMargin) / 2;
        const lLabelX = leftMargin;
        const lColonX = lLabelX + leftMaxLW + 2;
        const lValueX = lColonX + 3;
        const rLabelX = cp + 28;
        const rColonX = rLabelX + rightMaxLW + 2;
        const rValueX = rColonX + 1;

        doc.setFontSize(10);
        let iy = yPos;
        const maxLen = Math.max(leftDetails.length, rightDetails.length);

        for (let i = 0; i < maxLen; i++) {
          const left = leftDetails[i];
          const right = rightDetails[i];
          let leftRowH = 5;

          if (left) {
            doc.setFont("helvetica", "bold");
            doc.text(left.label, lLabelX, iy);
            doc.text(":", lColonX, iy);
            doc.setFont("helvetica", "normal");
            const maxW = cp + 25 - lValueX;
            const lines = wrapLines(left.value, maxW);
            lines.forEach((line, li) => doc.text(line, lValueX, iy + li * 4));
            leftRowH = lines.length * 4;
          }

          if (right) {
            doc.setFont("helvetica", "bold");
            doc.text(right.label, rLabelX, iy);
            doc.text(":", rColonX, iy);
            doc.setFont("helvetica", "normal");
            doc.text(String(right.value), rValueX, iy);
            if (right.label === "Ref.No" && barcodeImage) {
              doc.addImage(
                barcodeImage,
                "PNG",
                rValueX + doc.getTextWidth(String(right.value)) - 18,
                iy + 4,
                25,
                10,
              );
            }
          }

          iy += Math.max(leftRowH, 5);
        }
        return iy;
      };

      const addHeaderFooter = () => {
        // Plug in your headerImage / FooterImage here if available
      };

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

      const addPreliminaryReport = () => {
        const ph = doc.internal.pageSize.height;
        const prelimY = ph - footerHeight - 15;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text("(Preliminary Report)", centerX, prelimY, { align: "center" });
      };

      const checkNewPage = (yPos, neededHeight) => {
        const ph = doc.internal.pageSize.height;
        const footerStart = ph - (footerHeight + 30);
        if (yPos + neededHeight >= footerStart) {
          addPreliminaryReport();
          doc.addPage();
          pageCount++;
          addHeaderFooter();
          let ny = contentYStart;
          ny = addPatientInfo(ny);
          ny += 10;
          if (isTableStarted) ny = drawTableHeader(ny);
          return ny;
        }
        return yPos;
      };

      const getHighLow = (value, reference) => {
        if (!value || !reference) return null;
        const num = Number.parseFloat(value);
        if (isNaN(num)) return null;
        if (reference.includes("-")) {
          const parts = reference.split("-");
          const min = Number.parseFloat(parts[0]);
          const max = Number.parseFloat(parts[1]);
          if (!isNaN(min) && !isNaN(max)) {
            if (num < min) return "L";
            if (num > max) return "H";
          }
        } else if (reference.includes("<")) {
          const max = Number.parseFloat(reference.replace("<", ""));
          if (!isNaN(max) && num > max) return "H";
        } else if (reference.includes(">")) {
          const min = Number.parseFloat(reference.replace(">", ""));
          if (!isNaN(min) && num < min) return "L";
        }
        return null;
      };

      const drawArrow = (x, y, direction) => {
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

      const renderRow = (
        nameText,
        specimenType,
        valueText,
        referenceRange,
        unitText,
        methodRaw,
        yPos,
        boldName = false,
      ) => {
        const methodText = (methodRaw || "").replace(/\bMethod\b/i, "").trim();
        const lh = 4;
        const nameLns = wrapLines(nameText, colWidths[0] - 2);
        const valLns = wrapLines(valueText, colWidths[3] - 2);
        const refLns = wrapLines(referenceRange || "", colWidths[5] - 2);
        const methLns = wrapLines(methodText, colWidths[6] - 2);
        const maxLns = Math.max(
          nameLns.length,
          valLns.length,
          refLns.length,
          methLns.length,
          1,
        );
        const rowH = maxLns * lh + 2;

        yPos = checkNewPage(yPos, rowH);

        let xPos = leftMargin;

        doc.setFont("helvetica", boldName ? "bold" : "normal");
        renderWrapped(nameText, colWidths[0] - 2, xPos, yPos, lh);
        xPos += colWidths[0];

        doc.setFont("helvetica", "normal");
        doc.text(specimenType || "", xPos, yPos);
        xPos += colWidths[1];

        xPos += colWidths[2];

        const status = getHighLow(valueText, referenceRange);
        if (status) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(
            status === "H" ? 255 : 0,
            0,
            status === "L" ? 255 : 0,
          );
          renderWrapped(valueText, colWidths[3] - 5, xPos, yPos, lh);
          const vw = doc.getTextWidth(String(valueText));
          if (vw < colWidths[3] - 5)
            drawArrow(xPos + vw + 2, yPos - 1, status === "H" ? "up" : "down");
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
        } else {
          renderWrapped(valueText, colWidths[3] - 2, xPos, yPos, lh);
        }
        xPos += colWidths[3];

        renderUnicode(unitText || "", xPos, yPos);
        xPos += colWidths[4];

        renderWrapped(referenceRange || "", colWidths[5] - 2, xPos, yPos, lh);
        xPos += colWidths[5];

        doc.setTextColor(0, 0, 0);
        renderWrapped(methodText, colWidths[6] - 2, xPos, yPos, lh);

        return yPos + rowH + 4;
      };

      // ── Build PDF ──
      addHeaderFooter();
      let yPos = addPatientInfo(contentYStart);
      yPos += 10;

      const testsByDept = patient.testdetails.reduce((acc, test) => {
        const dept = test.department || "Other";
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(test);
        return acc;
      }, {});

      const sortedDepts = Object.keys(testsByDept).sort((a, b) => {
        const iA = departmentOrder.indexOf(a);
        const iB = departmentOrder.indexOf(b);
        if (iA !== -1 && iB !== -1) return iA - iB;
        if (iA !== -1) return -1;
        if (iB !== -1) return 1;
        return a.localeCompare(b);
      });

      if (sortedDepts.length > 0) {
        isTableStarted = true;
        yPos = checkNewPage(yPos, tableHeaderHeight);
        yPos = drawTableHeader(yPos);

        sortedDepts.forEach((dept) => {
          const tests = testsByDept[dept];

          const verifiedBySet = new Set();
          tests.forEach((t) => {
            if (t.verified_by?.trim()) verifiedBySet.add(t.verified_by.trim());
          });
          const hasMultipleVerifiers = verifiedBySet.size > 1;

          tests.forEach((test, testIndex) => {
            if (testIndex === 0) {
              yPos = checkNewPage(yPos, 15);
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              const deptLabel = dept.toUpperCase();
              const tw = doc.getTextWidth(deptLabel);
              doc.text(deptLabel, centerX, yPos, { align: "center" });
              doc.line(centerX - tw / 2, yPos + 2, centerX + tw / 2, yPos + 2);
              yPos += 10;
            }

            const testName = test.test_name || "";
            const hasParams = test.parameters && test.parameters.length > 0;

            yPos = checkNewPage(yPos, 20);
            doc.setFontSize(10);

            if (hasParams) {
              yPos = renderRow(testName, "", "", "", "", "", yPos, true);
            } else {
              yPos = renderRow(
                testName,
                test.specimen_type || "",
                test.value || "",
                test.reference_range || "",
                test.unit || "",
                test.method || "",
                yPos,
                true,
              );
            }

            if (test.outsourced === true) {
              doc.setFont("helvetica", "italic");
              doc.setFontSize(8);
              doc.text("(Outsourced)", leftMargin, yPos);
              yPos += 4;
            }

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);

            if (hasParams) {
              const paramsBySubtitle = test.parameters.reduce((acc, param) => {
                const subKey = param.sub_title || "";
                if (!acc[subKey]) acc[subKey] = [];
                acc[subKey].push(param);
                return acc;
              }, {});

              Object.keys(paramsBySubtitle).forEach((subtitle) => {
                if (subtitle.trim()) {
                  yPos = checkNewPage(yPos, 25);
                  doc.setFont("helvetica", "bold");
                  doc.setFontSize(9);
                  doc.text(subtitle, leftMargin, yPos);
                  yPos += 6;
                }

                paramsBySubtitle[subtitle].forEach((param) => {
                  doc.setFontSize(10);
                  yPos = renderRow(
                    param.parameter_name || param.name || "",
                    param.specimen_type || test.specimen_type || "",
                    param.value || "",
                    param.reference_range || "",
                    param.unit || "",
                    param.method || "",
                    yPos,
                    false,
                  );

                  if (param.comment?.trim()) {
                    doc.setFont("helvetica", "italic");
                    doc.setFontSize(8);
                    const ch = renderWrapped(
                      `Note: ${param.comment}`,
                      colWidths[0] +
                      colWidths[1] +
                      colWidths[2] +
                      colWidths[3] -
                      2,
                      leftMargin,
                      yPos,
                      3.5,
                    );
                    yPos += ch + 2;
                  }

                  doc.setFont("helvetica", "normal");
                  doc.setFontSize(10);
                  doc.setTextColor(0, 0, 0);
                });
              });
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
      }

      isTableStarted = false;

      const ph = doc.internal.pageSize.height;
      if (yPos + 10 >= ph - (footerHeight + 30)) {
        addPreliminaryReport();
        doc.addPage();
        pageCount++;
        addHeaderFooter();
        yPos = addPatientInfo(contentYStart);
      }

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("**End of the Report**", centerX, yPos, { align: "center" });

      const finalPageCount = pageCount;
      for (let i = 1; i <= finalPageCount; i++) {
        doc.setPage(i);
        addPreliminaryReport();
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(
          `Page ${i} of ${finalPageCount}`,
          centerX,
          doc.internal.pageSize.height - footerHeight - 2,
          { align: "center" },
        );
      }

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    } catch (err) {
      console.error("Error generating PDF:", err);
      toast.error("An unexpected error occurred while generating the PDF");
    } finally {
      setPrintingBarcode(null);
    }
  };

  const getPriorityBadge = (isEmergency) =>
    isEmergency ? (
      <EmergencyBadge>
        <AlertTriangle size={12} /> Emergency
      </EmergencyBadge>
    ) : (
      <NormalBadge>Normal</NormalBadge>
    );

  // ── Grouping ──
  const safePatientList = Array.isArray(patientList) ? patientList : [];
  const groupedByBarcode = safePatientList.reduce((acc, patient) => {
    const barcode = patient.barcode;
    if (!acc[barcode]) {
      acc[barcode] = {
        ...patient,
        testdetails: patient.testdetails
          ? patient.testdetails.map((test) => ({
            ...test,
            created_date: patient.created_date,
          }))
          : [],
        is_emergency: patient.is_emergency || false,
        patient_history: patient.patient_history || "",
        age_type: patient.age_type || "",
        gender: patient.gender || "",
        phone: patient.phone || "",
        ref_doctor: patient.ref_doctor || "",
      };
    } else {
      const testsWithCreatedDate = patient.testdetails
        ? patient.testdetails.map((test) => ({
          ...test,
          created_date: patient.created_date,
        }))
        : [];
      acc[barcode].testdetails = [
        ...acc[barcode].testdetails,
        ...testsWithCreatedDate,
      ];
    }
    return acc;
  }, {});
  const uniquePatients = Object.values(groupedByBarcode);

  const uniqueLocations = useMemo(() => {
    const locations = uniquePatients
      .map((p) => p.locationId)
      .filter((loc) => loc && loc.trim() !== "");
    return [...new Set(locations)].sort();
  }, [uniquePatients]);

  const filteredPatients = uniquePatients.filter((p) => {
    const matchesSearch =
      p.patientname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patient_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      locationFilter === "all" || p.locationId === locationFilter;
    return matchesSearch && matchesLocation;
  });

  const patientsPerPage = 10;
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient,
  );
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const showClear =
    (fromDate && formatYmd(fromDate) !== formatYmd(today)) ||
    (toDate && formatYmd(toDate) !== formatYmd(today)) ||
    emergencyFilter !== "all" ||
    locationFilter !== "all";

  if (error) {
    return (
      <Container>
        <GlobalStyle />
        <Card>
          <Header>
            <Title>Error</Title>
          </Header>
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>Failed to load patient data: {error}</p>
            <Button
              onClick={() =>
                fetchPatientData(fromDate, toDate, emergencyFilter)
              }
              style={{ marginTop: "1rem" }}
            >
              Retry
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <GlobalStyle />
      <Card>
        <Header>
          <Title>Patient List</Title>
          <FiltersContainer>
            <DatePickerWrapper>
              <DatePickerLabel>
                <Calendar size={16} /> From:
              </DatePickerLabel>
              <DatePicker
                selected={fromDate}
                onChange={(date) => {
                  setFromDate(date);
                  if (date && toDate && toDate < date) setToDate(date);
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select from date"
                isClearable
                maxDate={today}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
              />
            </DatePickerWrapper>
            <DatePickerWrapper>
              <DatePickerLabel>To:</DatePickerLabel>
              <DatePicker
                selected={toDate}
                onChange={(date) => setToDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select to date"
                isClearable
                minDate={fromDate || undefined}
                maxDate={today}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
              />
            </DatePickerWrapper>

            <BarcodeSearchWrapper>
              <SearchContainer style={{ flex: 1, minWidth: 0, width: "auto" }}>
                <SearchIconWrapper>
                  <Search size={16} />
                </SearchIconWrapper>
                <SearchInput
                  type="text"
                  placeholder="Search by name, ID, or barcode"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </SearchContainer>
              <StepButton
                type="button"
                title="Decrement barcode number"
                onClick={() => handleBarcodeStep(-1)}
              >
                −
              </StepButton>
              <StepButton
                type="button"
                title="Increment barcode number"
                onClick={() => handleBarcodeStep(1)}
              >
                +
              </StepButton>
            </BarcodeSearchWrapper>

            <Select
              value={emergencyFilter}
              onChange={(e) => {
                setEmergencyFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Priority</option>
              <option value="emergency">Emergency</option>
              <option value="normal">Normal</option>
            </Select>
            <Select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </Select>
            <FilterButton onClick={handleFilter}>
              <Filter size={16} /> Apply Filter
            </FilterButton>
            {showClear && (
              <ClearButton onClick={handleClearFilter}>Clear All</ClearButton>
            )}
          </FiltersContainer>
        </Header>

        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <th>Date</th>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Location</th>
                <th>Barcode</th>
                <th>Age</th>
                <th>Priority Status</th>
                <th>Test Name</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {loading ? (
                <tr>
                  <td
                    colSpan={10}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Loading patient data...
                  </td>
                </tr>
              ) : currentPatients.length > 0 ? (
                currentPatients.map((patient, index) => (
                  <tr key={`${patient.barcode}-${index}`}>
                    <td>
                      {patient.date
                        ? new Date(patient.date).toLocaleDateString()
                        : "Invalid Date"}
                    </td>
                    <td>{patient.patient_id}</td>
                    <td>{patient.patientname}</td>
                    <td>{patient.locationId}</td>
                    <td>{patient.barcode}</td>
                    <td>{patient.age}</td>
                    <td>{getPriorityBadge(patient.is_emergency)}</td>
                    <td>
                      <TestList>
                        {patient.testdetails &&
                          patient.testdetails.length > 0 ? (
                          patient.testdetails.map((test, idx) => (
                            <TestItem key={idx}>
                              <span>
                                {test.test_id} - {test.test_name}
                              </span>
                              {test.outsourced && (
                                <OutsourcedBadge>Outsourced</OutsourcedBadge>
                              )}
                            </TestItem>
                          ))
                        ) : (
                          <TestItem>No tests available</TestItem>
                        )}
                      </TestList>
                    </td>

                    <td>
                      <ActionButtonsContainer>
                        <ViewButton onClick={() => handleViewDetails(patient)}>
                          <Eye size={14} /> View
                        </ViewButton>
                        <PrintButton
                          onClick={() => handlePrint(patient)}
                          disabled={printingBarcode === patient.barcode}
                          title="Print preliminary report"
                        >
                          <Printer size={14} />
                          {printingBarcode === patient.barcode
                            ? "Printing…"
                            : "Print"}
                        </PrintButton>
                      </ActionButtonsContainer>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <NoData colSpan={10}>
                    No patient data available for the selected criteria.
                  </NoData>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredPatients.length > 10 && (
          <PaginationContainer>
            <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
              <ChevronLeft size={16} />
            </PaginationButton>
            <PaginationInfo>
              Page {currentPage} of {totalPages}
            </PaginationInfo>
            <PaginationButton
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </PaginationButton>
          </PaginationContainer>
        )}
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
    </Container>
  );
}

export default PatientList;
