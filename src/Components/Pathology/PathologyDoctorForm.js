import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  FileText,
  ChevronLeft,
  History,
  FlaskConical,
  User,
  Tag,
  Clock,
  Building,
  CheckCircle2,
} from "lucide-react";
import apiRequest from "../Auth/apiRequest";

// Global styles
const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #a777e3;
    --primary-light: #c3abef;
    --secondary: #8b5cf6;
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

const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 12px 16px;
  }

  .Toastify__toast--error {
    background-color: #ffffff;
    color: #b91c1c;
    border: 1.5px solid #ef4444;
    .Toastify__toast-icon svg {
      fill: #ef4444;
    }
    .Toastify__progress-bar {
      background: #ef4444;
    }
    .Toastify__close-button {
      color: #ef4444;
    }
  }

  .Toastify__toast--success {
    background-color: #ffffff;
    color: #15803d;
    border: 1.5px solid #22c55e;
    .Toastify__toast-icon svg {
      fill: #22c55e;
    }
    .Toastify__progress-bar {
      background: #22c55e;
    }
    .Toastify__close-button {
      color: #22c55e;
    }
  }

  .Toastify__toast--warning {
    background-color: #ffffff;
    color: #b45309;
    border: 1.5px solid #f59e0b;
    .Toastify__toast-icon svg {
      fill: #f59e0b;
    }
    .Toastify__progress-bar {
      background: #f59e0b;
    }
    .Toastify__close-button {
      color: #f59e0b;
    }
  }

  .Toastify__toast--info {
    background-color: #ffffff;
    color: #1d4ed8;
    border: 1.5px solid #3b82f6;
    .Toastify__toast-icon svg {
      fill: #3b82f6;
    }
    .Toastify__progress-bar {
      background: #3b82f6;
    }
    .Toastify__close-button {
      color: #7c3aed;
    }
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

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;
const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const HistoryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 9999px;
  border: 1px solid var(--primary, #a777e3)60;
  background: var(--primary, #a777e3)10;
  color: var(--primary, #a777e3);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  &:hover:not(:disabled) {
    background: var(--primary, #a777e3);
    color: white;
    border-color: var(--primary, #a777e3);
    box-shadow: 0 2px 8px rgba(167, 119, 227, 0.35);
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: var(--dark);
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const PatientInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.85rem;
  margin-bottom: 1.25rem;
  width: 100%;
`;

const InfoItem = styled.div`
  background-color: white;
  padding: 0.85rem 1.15rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #ede9fe;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  span {
    font-weight: 600;
    color: #475569;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
`;

const PatientHistoryCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--primary);
`;

const HistoryTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: var(--primary);
  margin-bottom: 0.75rem;
  font-weight: 600;
`;

const HistoryContent = styled.p`
  color: var(--dark);
  line-height: 1.6;
  font-size: 0.875rem;
  white-space: pre-wrap;
`;

const NoHistory = styled.p`
  color: var(--gray);
  font-style: italic;
  font-size: 0.875rem;
`;

const CommentNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: rgba(167, 119, 227, 0.08);
  border-left: 3px solid var(--primary);
  border-radius: 4px;
  font-size: 0.85rem;
  color: var(--secondary);
`;

const CommentLabel = styled.span`
  font-weight: 600;
  color: var(--primary);
  white-space: nowrap;
`;

const CommentText = styled.span`
  color: var(--dark);
  line-height: 1.4;
`;

const TopScrollTrack = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  height: 12px;
  background: #faf5ff;
  border: 1px solid #cbd5e1;
  border-bottom: none;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-top: 0.85rem;
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #a777e3;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #8b5cf6;
  }
`;

const InnerTableContainer = styled.div`
  overflow-x: auto;
  background-color: white;
  border-radius: ${(props) => (props.hasTopTrack ? "0 0 10px 10px" : "10px")};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid #ede9fe;
  margin-top: ${(props) => (props.hasTopTrack ? "0" : "0.85rem")};
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none !important;
    height: 0px !important;
    width: 0px !important;
  }
  &::-webkit-scrollbar:horizontal {
    display: none !important;
    height: 0px !important;
    width: 0px !important;
  }
  &::-webkit-scrollbar-thumb:horizontal {
    display: none !important;
  }
  &::-webkit-scrollbar-track:horizontal {
    display: none !important;
  }
`;

const TableContainer = ({ children, style, className }) => {
  const topScrollRef = useRef(null);
  const bottomScrollRef = useRef(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const isSyncingTop = useRef(false);
  const isSyncingBottom = useRef(false);

  useEffect(() => {
    const updateWidth = () => {
      if (bottomScrollRef.current) {
        const sw = bottomScrollRef.current.scrollWidth;
        const cw = bottomScrollRef.current.clientWidth;
        setScrollWidth(sw);
        setHasOverflow(sw > cw + 2);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    if (bottomScrollRef.current) {
      observer.observe(bottomScrollRef.current);
    }
    window.addEventListener("resize", updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const handleTopScroll = () => {
    if (!isSyncingTop.current) {
      isSyncingBottom.current = true;
      if (bottomScrollRef.current && topScrollRef.current) {
        bottomScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
      }
    }
    isSyncingTop.current = false;
  };

  const handleBottomScroll = () => {
    if (!isSyncingBottom.current) {
      isSyncingTop.current = true;
      if (topScrollRef.current && bottomScrollRef.current) {
        topScrollRef.current.scrollLeft = bottomScrollRef.current.scrollLeft;
      }
    }
    isSyncingBottom.current = false;
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {hasOverflow && (
        <TopScrollTrack ref={topScrollRef} onScroll={handleTopScroll}>
          <div style={{ width: `${scrollWidth}px`, height: "1px" }} />
        </TopScrollTrack>
      )}
      <InnerTableContainer
        ref={bottomScrollRef}
        onScroll={handleBottomScroll}
        hasTopTrack={hasOverflow}
        style={style}
        className={className}
      >
        {children}
      </InnerTableContainer>
    </div>
  );
};

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 950px;
`;

const TableHead = styled.thead`
  background: linear-gradient(135deg, #a777e3 0%, #8b5cf6 100%);
  color: #ffffff;

  th {
    padding: 0.65rem 0.65rem;
    text-align: left;
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    white-space: nowrap;
    border: none;
    color: #ffffff;

    &:first-child {
      border-top-left-radius: 10px;
    }

    &:last-child {
      border-top-right-radius: 10px;
    }
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #f1f5f9;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #f8fafc;
    }
  }

  td {
    padding: 0.55rem 0.65rem;
    font-size: 0.82rem;
    color: #1e293b;
    vertical-align: middle;
  }
`;

const TestHeaderRow = styled.tr`
  background-color: #faf5ff !important;
  border-bottom: 1.5px solid #ede9fe;

  &:hover {
    background-color: #e2e8f0 !important;
  }
`;

const ParameterRow = styled.tr`
  &:hover {
    background-color: rgba(167, 119, 227, 0.05);
  }
`;

const TestTitleCell = styled.td`
  font-weight: 700 !important;
  font-size: 0.95rem;
  color: #0f172a;
  padding: 0.6rem 0.85rem !important;
  background-color: #f1f5f9;
  border-left: 3.5px solid #a777e3;
`;

const TestTitleCellMerged = styled.td`
  font-weight: 700 !important;
  font-size: 0.95rem;
  color: #0f172a;
  padding: 0.6rem 0.85rem !important;
  background-color: #f1f5f9;
  border-left: 3.5px solid #a777e3;
`;

const TestRemarksCell = styled.td`
  font-weight: 500 !important;
  color: #64748b;
  font-style: italic;
  font-size: 0.82rem;
  padding: 0.6rem 0.75rem !important;
`;

const ParameterNameCell = styled.td`
  padding: 0.5rem 0.65rem 0.5rem 1.35rem !important;
  font-weight: 600;
  font-size: 0.84rem;
  color: #1e293b;
`;

const NoData = styled.td`
  text-align: center;
  padding: 2rem !important;
  color: var(--gray);
  font-style: italic;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-light);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(167, 119, 227, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BackButton = styled(Button)`
  background-color: var(--light);
  color: var(--dark);

  &:hover {
    background-color: var(--gray-light);
  }
`;

const ApproveButton = styled(Button)`
  background-color: ${(props) =>
    props.disabled ? "#dcfce7" : "#10b981"};
  color: ${(props) => (props.disabled ? "#15803d" : "#ffffff")};
  border: ${(props) => (props.disabled ? "1px solid #86efac" : "none")};
  padding: 0.35rem 0.75rem;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: 6px;
  box-shadow: ${(props) => (props.disabled ? "none" : "0 2px 6px rgba(16, 185, 129, 0.25)")};

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "#dcfce7" : "#059669"};
  }
`;

const RerunButton = styled(Button)`
  background-color: ${(props) =>
    props.disabled ? "#fee2e2" : "#ffffff"};
  color: ${(props) => (props.disabled ? "#dc2626" : "#d97706")};
  border: ${(props) => (props.disabled ? "1px solid #fca5a5" : "1px solid #fcd34d")};
  padding: 0.35rem 0.75rem;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: 6px;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "#fee2e2" : "#fef3c7"};
  }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.25rem;
`;

const HighBadge = styled(StatusBadge)`
  background-color: rgba(247, 37, 133, 0.15);
  color: var(--danger);
  animation: ${blink} 2s infinite;
`;

const LowBadge = styled(StatusBadge)`
  background-color: rgba(248, 150, 30, 0.15);
  color: var(--warning);
  animation: ${blink} 2s infinite;
`;
const NearBadge = styled(StatusBadge)`
  background-color: rgba(237, 194, 243, 0.15);

  color: #bf63db;
  border: 1px solid #d309ee;
`;

const EditedBadge = styled(StatusBadge)`
  background-color: rgba(63, 55, 201, 0.15);
  color: var(--secondary);
`;

const ValueCell = styled.td`
  position: relative;
  font-weight: 600 !important;
`;

const ValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ValueText = styled.div`
  font-weight: 600;
  color: #0f172a;
  font-size: 0.84rem;
  line-height: 1.45;
  white-space: pre-line;
  background: #faf5ff;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #ede9fe;
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.25rem;
`;

const SubTitleRow = styled.tr`
  background-color: #faf5ff !important;
  border-bottom: 1px solid #e2e8f0;
`;

const SubTitleCell = styled.td`
  font-weight: 700 !important;
  font-size: 0.8rem;
  color: #7c3aed;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.4rem 0.75rem 0.4rem 1.35rem !important;
  background-color: #f8fafc;
  border-left: 3.5px solid #c3abef;
`;

const OutsourcedBadge = styled(StatusBadge)`
  background-color: rgba(246, 160, 233, 0.15);
  color: #d75de0ff;
  animation: ${blink} 1.5s ease-in-out infinite;
  font-weight: 600;
  border: 1px solid #d75de0ff;
`;

// ── Normal / Abnormal radio styles (CHC locations only) ───────────────────
const StatusRadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  color: ${(props) =>
    props.value === "Normal"
      ? "#2d8a4e"
      : props.value === "Abnormal"
        ? "#c0392b"
        : "inherit"};

  input[type="radio"] {
    accent-color: ${(props) =>
    props.value === "Normal" ? "#2d8a4e" : "#c0392b"};
    width: 14px;
    height: 14px;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  }
`;

const RequiredHint = styled.span`
  font-size: 0.7rem;
  color: var(--danger);
  display: block;
  margin-top: 0.2rem;
  font-style: italic;
`;

const ExpandToggleCell = styled.td`
  padding: 0.25rem 1rem !important;
  background-color: rgba(167, 119, 227, 0.04);
  border-bottom: 1px solid var(--gray-light);
`;

const ExpandButton = styled.button`
  background: none;
  border: 1px solid var(--primary);
  border-radius: 4px;
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: var(--transition);
  &:hover {
    background-color: rgba(167, 119, 227, 0.08);
  }
`;

const ExpandedRow = styled.tr`
  background-color: #fafbff !important;
  &:hover {
    background-color: #fafbff !important;
  }
`;

const ExpandedCell = styled.td`
  padding: 1rem 2rem !important;
  border-bottom: 2px solid var(--gray-light);
`;

const InfoTableSection = styled.div`
  margin-bottom: 1rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  overflow: hidden;
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoTableTitle = styled.div`
  background: linear-gradient(135deg, var(--secondary), var(--primary));
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  th {
    background-color: #f0f3ff;
    color: var(--secondary);
    padding: 0.5rem 1rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 1px solid var(--gray-light);
    border-right: 1px solid var(--gray-light);
    &:last-child {
      border-right: none;
    }
  }
  th.center {
    text-align: center;
  }
  td {
    padding: 0.45rem 1rem;
    border-bottom: 1px solid var(--gray-light);
    border-right: 1px solid var(--gray-light);
    vertical-align: middle;
    &:last-child {
      border-right: none;
    }
  }
  td.center {
    text-align: center;
  }
  td.bold {
    font-weight: 600;
    background-color: #fafbff;
  }
  tr:last-child td {
    border-bottom: none;
  }
  tr:nth-child(even) td:not(.bold) {
    background-color: #fafbff;
  }
`;
// ─────────────────────────────────────────────────────────────────────────────


// ── Modern Responsive UI Components for Doctor Form ──
const PatientBannerCard = styled.div`
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #ede9fe;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  margin-bottom: 0.75rem;
`;

const PatientBannerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const PatientIdentityGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const PatientTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TagPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
  background: ${(props) => props.bg || "#e0e7ff"};
  color: ${(props) => props.color || "#3730a3"};
  border: ${(props) => props.border || "1px solid #c7d2fe"};
`;

const PatientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 0.5rem 1rem;
  padding: 0.65rem 1rem;
  background: #ffffff;
`;

const GridCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const ColLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const ColValue = styled.span`
  font-size: 0.92rem;
  font-weight: 600;
  color: #1e293b;
`;

function PathologyDoctorForm() {
  const [testValues, setTestValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientHistory, setPatientHistory] = useState("");

  // Key: `${recordIndex}-${detailIndex}` → "Normal" | "Abnormal" | ""
  const [testStatusMap, setTestStatusMap] = useState({});

  const approved_by = localStorage.getItem("employeeId");
  const userRole = localStorage.getItem("role");
  const location = useLocation();
  const navigate = useNavigate();
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const queryParams = new URLSearchParams(location.search);
  const selectedDate = queryParams.get("date");
  const patientId = queryParams.get("patient_id");
  const [expandedRows, setExpandedRows] = useState({});

  // True when the record's locationId starts with "CHC" (case-sensitive)
  const isCHC =
    testValues.length > 0 &&
    String(testValues[0].locationId || "").startsWith("CHC");

  useEffect(() => {
    if (location.state?.patientHistory) {
      setPatientHistory(location.state.patientHistory);
    }

    if (location.state?.skipFetch && location.state?.patientData) {
      const patientData = location.state.patientData;
      const processedData = [
        {
          ...patientData,
          testdetails:
            typeof patientData.testdetails === "string"
              ? JSON.parse(patientData.testdetails)
              : patientData.testdetails,
        },
      ];
      setTestValues(processedData);
      setLoading(false);
    } else if (selectedDate && patientId) {
      fetchTestData(selectedDate, patientId);
    } else {
      setLoading(false);
    }
  }, [location.state, selectedDate, patientId]);

  const fetchTestData = async (date, patientId) => {
    setLoading(true);
    try {
      const qp = new URLSearchParams();
      qp.append("patient_id", patientId);
      qp.append("date", date);

      const url = `${Labbaseurl}pathology-test-values/?${qp.toString()}`;
      const response = await apiRequest(url, "GET");

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch test data");
      }

      const processedData = response.data.map((item) => ({
        ...item,
        testdetails:
          typeof item.testdetails === "string"
            ? JSON.parse(item.testdetails)
            : item.testdetails,
      }));

      setTestValues(processedData);

      if (processedData.length > 0 && processedData[0].patient_history) {
        setPatientHistory(processedData[0].patient_history);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load test data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const statusKey = (recordIndex, detailIndex) =>
    `${recordIndex}-${detailIndex}`;

  const handleStatusChange = (recordIndex, detailIndex, value) => {
    setTestStatusMap((prev) => ({
      ...prev,
      [statusKey(recordIndex, detailIndex)]: value,
    }));
  };

  const handleTestApprove = async (recordIndex, testIndex, approve_by) => {
    // CHC locations require Normal/Abnormal selection before approving
    if (isCHC) {
      const key = statusKey(recordIndex, testIndex);
      const selectedStatus = testStatusMap[key] || "";
      if (!selectedStatus) {
        toast.warning("Please select Normal or Abnormal before approving.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    }

    try {
      const test = testValues[recordIndex];
      const testDetail = test?.testdetails[testIndex];
      if (!test || !testDetail) {
        throw new Error("Test or test detail not found");
      }

      const approveTime = formatDateTime(new Date());

      // Include status in payload only for CHC locations
      const payload = {
        approve: true,
        approve_by,
        approve_time: approveTime,
        barcode: test.barcode,
        created_date: testDetail.created_date || test.created_date,
        test_id: testDetail.test_id,
      };
      if (isCHC) {
        payload.status = testStatusMap[statusKey(recordIndex, testIndex)];
      }

      const response = await apiRequest(
        `${Labbaseurl}pathology-test-approval/${test.barcode}/approve/`,
        "PATCH",
        payload,
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to approve test");
      }

      if (
        response.data.message &&
        (response.data.message.includes("Test approved successfully") ||
          response.data.message.includes("Test detail approved successfully"))
      ) {
        setTestValues((prevValues) =>
          prevValues.map((record, idx) => {
            if (idx !== recordIndex) return record;
            return {
              ...record,
              testdetails: record.testdetails.map((detail) =>
                detail.test_id === testDetail.test_id
                  ? {
                    ...detail,
                    approve: true,
                    approve_by,
                    approve_time: approveTime,
                    ...(isCHC && {
                      status:
                        testStatusMap[statusKey(recordIndex, testIndex)],
                    }),
                  }
                  : detail,
              ),
            };
          }),
        );

        const statusLabel = isCHC
          ? ` as ${testStatusMap[statusKey(recordIndex, testIndex)]}`
          : "";
        toast.success(`Test approved successfully${statusLabel}!`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(
          "Approval failed: " + (response.data.message || "Unknown error"),
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          },
        );
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error(error.message || "Error during approval", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleTestRerun = async (recordIndex, testIndex) => {
    try {
      const test = testValues[recordIndex];
      const testDetail = test?.testdetails[testIndex];
      if (!testDetail) {
        throw new Error("Test detail not found");
      }
      const rerun_by = localStorage.getItem("name");
      const rerunTime = formatDateTime(new Date());

      const response = await apiRequest(
        `${Labbaseurl}pathology-test-rerun/${test.barcode}/rerun/`,
        "PATCH",
        {
          rerun: true,
          rerun_by,
          rerun_time: rerunTime,
          barcode: test.barcode,
          created_date: testDetail.created_date || test.created_date,
          test_id: testDetail.test_id,
        },
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to initiate rerun");
      }

      setTestValues((prevValues) =>
        prevValues.map((record, idx) => {
          if (idx !== recordIndex) return record;
          return {
            ...record,
            testdetails: record.testdetails.map((detail) =>
              detail.test_id === testDetail.test_id
                ? { ...detail, rerun: true, rerun_by, rerun_time: rerunTime }
                : detail,
            ),
          };
        }),
      );

      toast.success("Test rerun initiated successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error(error.message || "Error during rerun", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const getStatusBadge = (value, referenceRange) => {
    if (!value || !referenceRange) return null;
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return null;

    const rangeParts = referenceRange
      .split("-")
      .map((part) => parseFloat(part.trim()));

    if (
      rangeParts.length === 2 &&
      !isNaN(rangeParts[0]) &&
      !isNaN(rangeParts[1])
    ) {
      const [min, max] = rangeParts;

      if (numericValue < min) {
        // Within 1 point below min → Orange "Near Low"
        if (numericValue >= min - 1) {
          return (
            <NearBadge>
              <AlertTriangle size={12} /> Slightly Low
            </NearBadge>
          );
        }
        return (
          <LowBadge>
            <AlertTriangle size={12} /> Low
          </LowBadge>
        );
      } else if (numericValue > max) {
        // Within 1 point above max → Orange "Near High"
        if (numericValue <= max + 1) {
          return (
            <NearBadge>
              <AlertTriangle size={12} /> Slightly High
            </NearBadge>
          );
        }
        return (
          <HighBadge>
            <AlertTriangle size={12} /> High
          </HighBadge>
        );
      }
    }
    return null;
  };

  const handleBack = () =>
    navigate("/PathologyPatientList", {
      state: {
        barcode:
          testValues[0]?.barcode || location.state?.patientData?.barcode,
      },
    });

  const rawLoc =
    (testValues.length > 0 ? testValues[0].locationId : "") ||
    location.state?.patientData?.locationId ||
    "";
  const isHMS =
    !rawLoc ||
    rawLoc.toLowerCase().includes("hms");

  const handleHistoryClick = () => {
    if (!patientId) {
      toast.warning("No patient ID available");
      return;
    }
    navigate("/WorkList", {
      state: {
        uhid: patientId,
        returnPath: `${location.pathname}${location.search}`,
        returnState: location.state,
        fromDate: selectedDate || null,
        toDate: selectedDate || null,
      },
    });
  };
  const toggleExpand = (key) => {
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getRomanNumeral = (num) => {
    const romanNumerals = [
      "i",
      "ii",
      "iii",
      "iv",
      "v",
      "vi",
      "vii",
      "viii",
      "ix",
      "x",
      "xi",
      "xii",
      "xiii",
      "xiv",
      "xv",
      "xvi",
      "xvii",
      "xviii",
      "xix",
      "xx",
    ];
    return romanNumerals[num] || (num + 1).toString();
  };

  // Renders Normal/Abnormal radio buttons — only called when isCHC is true
  const renderStatusRadios = (recordIndex, detailIndex, detail) => {
    const key = statusKey(recordIndex, detailIndex);
    const isDisabled = detail.approve || detail.rerun;
    // When already approved/rerrun show the saved value; otherwise show local selection
    const current = isDisabled ? detail.status || "" : testStatusMap[key] || "";
    const showHint = !isDisabled && !current;

    return (
      <StatusRadioGroup>
        <RadioLabel value="Normal" disabled={isDisabled}>
          <input
            type="radio"
            name={`status-${key}`}
            value="Normal"
            checked={current === "Normal"}
            onChange={() =>
              handleStatusChange(recordIndex, detailIndex, "Normal")
            }
            disabled={isDisabled}
          />
          Normal
        </RadioLabel>
        <RadioLabel value="Abnormal" disabled={isDisabled}>
          <input
            type="radio"
            name={`status-${key}`}
            value="Abnormal"
            checked={current === "Abnormal"}
            onChange={() =>
              handleStatusChange(recordIndex, detailIndex, "Abnormal")
            }
            disabled={isDisabled}
          />
          Abnormal
        </RadioLabel>
        {showHint && <RequiredHint>* required</RequiredHint>}
      </StatusRadioGroup>
    );
  };

  const generateTableRows = () => {
    const rows = [];
    let testNumber = 1;

    testValues.forEach((test, recordIndex) => {
      test.testdetails.forEach((detail, detailIndex) => {
        if (detail.parameters && detail.parameters.length > 0) {
          // ── Test header row WITH parameters ──────────────────────────────
          rows.push(
            <TestHeaderRow key={`test-${recordIndex}-${detailIndex}`}>
              <TestTitleCell colSpan="2">
                <div>
                  <strong>
                    {testNumber}. {detail.test_name || "N/A"}
                    {detail.outsourced && (
                      <OutsourcedBadge style={{ marginLeft: "0.5rem" }}>
                        Outsourced
                      </OutsourcedBadge>
                    )}
                  </strong>
                  {detail.comment && (
                    <CommentNote>
                      <CommentLabel>Note:</CommentLabel>
                      <CommentText>{detail.comment}</CommentText>
                    </CommentNote>
                  )}
                </div>
              </TestTitleCell>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <TestRemarksCell>{detail.remarks || "N/A"}</TestRemarksCell>
              {/* Status radios — CHC only */}
              {isCHC && (
                <td>{renderStatusRadios(recordIndex, detailIndex, detail)}</td>
              )}
              <td>
                <RerunButton
                  onClick={() => handleTestRerun(recordIndex, detailIndex)}
                  disabled={detail.approve || detail.rerun}
                >
                  <RotateCcw size={14} />
                  {detail.rerun ? "Rerun Initiated" : "Rerun"}
                </RerunButton>
              </td>
              <td>
                {userRole !== "Lab Technician" && (
                  <ApproveButton
                    onClick={() =>
                      handleTestApprove(recordIndex, detailIndex, approved_by)
                    }
                    disabled={detail.approve || detail.rerun}
                  >
                    <CheckCircle size={14} />
                    {detail.approve ? "Approved" : "Approve"}
                  </ApproveButton>
                )}
              </td>
            </TestHeaderRow>,
          );
          const infoTables = renderInfoTables(
            detail,
            `${recordIndex}-${detailIndex}`,
          );
          if (infoTables) rows.push(infoTables);

          // ── Parameter sub-rows ────────────────────────────────────────────
          const groupedParams = {};
          detail.parameters.forEach((param) => {
            const subtitle = param.sub_title || "Other";
            if (!groupedParams[subtitle]) groupedParams[subtitle] = [];
            groupedParams[subtitle].push(param);
          });

          let paramCounter = 0;
          Object.entries(groupedParams).forEach(([subtitle, params]) => {
            if (subtitle && subtitle !== "Other" && subtitle !== "") {
              rows.push(
                <SubTitleRow
                  key={`subtitle-${recordIndex}-${detailIndex}-${subtitle}`}
                >
                  <td></td>
                  <SubTitleCell colSpan="7">{subtitle}</SubTitleCell>
                  {/* Pad with an extra empty cell when CHC adds the Status column */}
                  <td colSpan={isCHC ? 4 : 3}></td>
                </SubTitleRow>,
              );
            }

            params.forEach((parameter) => {
              rows.push(
                <ParameterRow
                  key={`param-${recordIndex}-${detailIndex}-${paramCounter}`}
                >
                  <td></td>
                  <ParameterNameCell>
                    <div>
                      {getRomanNumeral(paramCounter)}.{" "}
                      {parameter.parameter_name || "N/A"}
                      {parameter.comment && (
                        <CommentNote>
                          <CommentLabel>Note:</CommentLabel>
                          <CommentText>{parameter.comment}</CommentText>
                        </CommentNote>
                      )}
                    </div>
                  </ParameterNameCell>
                  <td>{detail.department || "N/A"}</td>
                  <td>{detail.specimen_type || "N/A"}</td>
                  <td>{detail.collection_container || "N/A"}</td>
                  <ValueCell>
                    <ValueContainer>
                      <ValueText>{parameter.value || "N/A"}</ValueText>
                      <BadgeContainer>
                        {getStatusBadge(
                          parameter.value,
                          parameter.reference_range,
                        )}
                        {parameter.remarks && (
                          <EditedBadge>
                            <FileText size={12} /> Edited
                          </EditedBadge>
                        )}
                      </BadgeContainer>
                    </ValueContainer>
                  </ValueCell>
                  <td>{parameter.unit || "N/A"}</td>
                  <td>{parameter.reference_range || "N/A"}</td>
                  {/* Pad trailing cells to match header column count */}
                  <td colSpan={isCHC ? 4 : 3}></td>
                </ParameterRow>,
              );
              paramCounter++;
            });
          });

          testNumber++;
        } else {
          // ── Test header row WITHOUT parameters ────────────────────────────
          rows.push(
            <TestHeaderRow key={`test-no-params-${recordIndex}-${detailIndex}`}>
              <TestTitleCellMerged colSpan="2">
                <div>
                  <strong>
                    {testNumber}. {detail.test_name || "N/A"}
                    {detail.outsourced && (
                      <OutsourcedBadge style={{ marginLeft: "0.5rem" }}>
                        Outsourced
                      </OutsourcedBadge>
                    )}
                  </strong>
                  {detail.comment && (
                    <CommentNote>
                      <CommentLabel>Note:</CommentLabel>
                      <CommentText>{detail.comment}</CommentText>
                    </CommentNote>
                  )}
                </div>
              </TestTitleCellMerged>
              <td>{detail.department || "N/A"}</td>
              <td>{detail.specimen_type || "N/A"}</td>
              <td>{detail.collection_container || "N/A"}</td>
              <ValueCell>
                <ValueContainer>
                  <ValueText>{detail.value || "N/A"}</ValueText>
                  <BadgeContainer>
                    {getStatusBadge(detail.value, detail.reference_range)}
                    {detail.remarks && (
                      <EditedBadge>
                        <FileText size={12} /> Edited
                      </EditedBadge>
                    )}
                  </BadgeContainer>
                </ValueContainer>
              </ValueCell>
              <td>{detail.unit || "N/A"}</td>
              <td>{detail.reference_range || "N/A"}</td>
              <TestRemarksCell>{detail.remarks || "N/A"}</TestRemarksCell>
              {/* Status radios — CHC only */}
              {isCHC && (
                <td>{renderStatusRadios(recordIndex, detailIndex, detail)}</td>
              )}
              <td>
                <RerunButton
                  onClick={() => handleTestRerun(recordIndex, detailIndex)}
                  disabled={detail.approve || detail.rerun}
                >
                  <RotateCcw size={14} />
                  {detail.rerun ? "Rerun Initiated" : "Rerun"}
                </RerunButton>
              </td>
              <td>
                {userRole !== "Lab Technician" && (
                  <ApproveButton
                    onClick={() =>
                      handleTestApprove(recordIndex, detailIndex, approved_by)
                    }
                    disabled={detail.approve || detail.rerun}
                  >
                    <CheckCircle size={14} />
                    {detail.approve ? "Approved" : "Approve"}
                  </ApproveButton>
                )}
              </td>
            </TestHeaderRow>,
          );
          const infoTables = renderInfoTables(
            detail,
            `${recordIndex}-${detailIndex}`,
          );
          if (infoTables) rows.push(infoTables);
          testNumber++;
        }
      });
    });

    return rows;
  };

  if (loading) {
    return (
      <Container>
        <GlobalStyle />
        <div>Loading test data...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <GlobalStyle />
        <div>{error}</div>
      </Container>
    );
  }

  const renderInfoTables = (detail, expandKey) => {
    const hasInterpretation =
      detail.interpretation &&
      typeof detail.interpretation === "object" &&
      Object.keys(detail.interpretation).length > 0;

    const hasCriticalRange =
      detail.critical_range &&
      typeof detail.critical_range === "object" &&
      Object.keys(detail.critical_range).length > 0;

    const hasLod =
      detail.lod &&
      typeof detail.lod === "object" &&
      Object.keys(detail.lod).length > 0;

    if (!hasInterpretation && !hasCriticalRange && !hasLod) return null;

    const totalCols = isCHC ? 12 : 11;

    return (
      <>
        {/* Toggle button row */}
        <tr key={`toggle-${expandKey}`}>
          <ExpandToggleCell colSpan={totalCols}>
            <ExpandButton onClick={() => toggleExpand(expandKey)}>
              {expandedRows[expandKey] ? "▲ Hide" : "▼ View"} Interpretation /
              LOD
            </ExpandButton>
          </ExpandToggleCell>
        </tr>

        {/* Expanded content row */}
        {expandedRows[expandKey] && (
          <ExpandedRow key={`expanded-${expandKey}`}>
            <ExpandedCell colSpan={totalCols}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "1rem",
                }}
              >
                {/* Interpretation */}
                {hasInterpretation && (
                  <InfoTableSection>
                    <InfoTableTitle>Interpretation</InfoTableTitle>
                    <InfoTable>
                      <thead>
                        <tr>
                          <th>Result</th>
                          <th>Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(detail.interpretation).map(
                          ([result, comment], i) => (
                            <tr key={i}>
                              <td style={{ fontWeight: 500 }}>{result}</td>
                              <td>{comment}</td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </InfoTable>
                  </InfoTableSection>
                )}

                {/* Critical Range */}
                {hasCriticalRange && (
                  <InfoTableSection>
                    <InfoTableTitle>Critical Range</InfoTableTitle>
                    <InfoTable>
                      <thead>
                        <tr>
                          <th>Result</th>
                          <th>Ct Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(detail.critical_range).map(
                          ([result, ctvalue], i) => (
                            <tr key={i}>
                              <td style={{ fontWeight: 500 }}>{result}</td>
                              <td>{ctvalue}</td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </InfoTable>
                  </InfoTableSection>
                )}
              </div>

              {/* LOD — full width below */}
              {hasLod &&
                (() => {
                  const samples = Object.keys(detail.lod);
                  const maxGenotypes = Math.max(
                    ...samples.map((s) => detail.lod[s].length),
                  );
                  const genotypeLabels = Array.from(
                    { length: maxGenotypes },
                    (_, i) => `Genotype ${i + 1}`,
                  );
                  return (
                    <InfoTableSection
                      style={{
                        marginTop:
                          hasInterpretation || hasCriticalRange ? "1rem" : 0,
                      }}
                    >
                      <InfoTableTitle>LOD in IU/ml</InfoTableTitle>
                      <InfoTable>
                        <thead>
                          <tr>
                            <th rowSpan={2}>SAMPLE</th>
                            <th colSpan={maxGenotypes} className="center">
                              LOD in IU/ml
                            </th>
                          </tr>
                          <tr>
                            {genotypeLabels.map((label, i) => (
                              <th key={i} className="center">
                                {label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {samples.map((sample, rowIdx) => (
                            <tr key={rowIdx}>
                              <td className="bold">{sample}</td>
                              {detail.lod[sample].map((val, colIdx) => (
                                <td key={colIdx} className="center">
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </InfoTable>
                    </InfoTableSection>
                  );
                })()}
            </ExpandedCell>
          </ExpandedRow>
        )}
      </>
    );
  };

  return (
    <Container style={{ maxWidth: "1400px", width: "100%", margin: "0 auto", padding: "0.75rem 1rem 1.5rem" }}>
      <GlobalStyle />
      <StyledToastContainer />

      {/* ── Top Header ── */}
      <Header style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <FlaskConical size={22} color="#a777e3" />
          <Title style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
            Pathology Authorization
          </Title>
          <span style={{ fontSize: "0.78rem", color: "#64748b", borderLeft: "2px solid #cbd5e1", paddingLeft: "0.6rem" }}>
            Review findings, verify morphology interpretations and authorize reports
          </span>
        </div>
        <BackButton onClick={handleBack} style={{ borderRadius: "6px", border: "1px solid #cbd5e1", padding: "0.35rem 0.75rem", fontSize: "0.82rem", height: "32px", gap: "0.35rem" }}>
          <ChevronLeft size={16} />
          Back to Worklist
        </BackButton>
      </Header>

      {/* ── Modern Patient Information Banner ── */}
      <PatientBannerCard>
        <PatientBannerHeader>
          <PatientIdentityGroup>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                backgroundColor: "#f5f0fb",
                color: "#a777e3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              <User size={20} />
            </div>
            <div>
              <PatientTitle>
                {testValues[0]?.patientname || "Patient Record"}
              </PatientTitle>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.25rem", flexWrap: "wrap" }}>
                <TagPill bg="#e0e7ff" color="#3730a3" border="1px solid #c7d2fe">
                  <Tag size={12} /> ID: {patientId}
                </TagPill>
                {testValues[0]?.age && (
                  <TagPill bg="#f1f5f9" color="#334155" border="1px solid #e2e8f0">
                    Age: {testValues[0].age}
                  </TagPill>
                )}
                {testValues[0]?.locationId && (
                  <TagPill bg="#f0fdf4" color="#166534" border="1px solid #bbf7d0">
                    <Building size={12} /> {testValues[0].locationId}
                  </TagPill>
                )}
                {(testValues[0]?.lab_id || testValues[0]?.testdetails?.[0]?.lab_id) && (
                  <TagPill bg="#e0e7ff" color="#3730a3" border="1.5px solid #818cf8" style={{ fontWeight: 700 }}>
                    <FlaskConical size={12} /> Lab ID: {testValues[0].lab_id || testValues[0].testdetails?.[0]?.lab_id}
                  </TagPill>
                )}
              </div>
            </div>
          </PatientIdentityGroup>

          
        </PatientBannerHeader>

        <PatientGrid>
          <GridCol>
            <ColLabel><Clock size={12} /> Date</ColLabel>
            <ColValue>{selectedDate || testValues[0]?.date ? new Date(selectedDate || testValues[0]?.date).toLocaleDateString() : "N/A"}</ColValue>
          </GridCol>
          <GridCol>
            <ColLabel><FileText size={12} /> Barcode</ColLabel>
            <ColValue style={{ fontFamily: "monospace", color: "#a777e3" }}>
              {testValues[0]?.barcode || "N/A"}
            </ColValue>
          </GridCol>
          <GridCol style={{ backgroundColor: "#f5f0fb", padding: "0.5rem 0.85rem", borderRadius: "8px", border: "1.5px solid #a777e3" }}>
            <ColLabel style={{ color: "#7c3aed", fontWeight: 700 }}>
              <FlaskConical size={12} /> Pathology Specimen Lab ID
            </ColLabel>
            <ColValue style={{ fontSize: "1.1rem", fontWeight: 800, color: "#581c87", letterSpacing: "0.5px" }}>
              {testValues[0]?.lab_id || testValues[0]?.testdetails?.[0]?.lab_id || (
                <span style={{ color: "#dc2626", fontSize: "0.85rem", fontWeight: 600 }}>⚠ Not Assigned</span>
              )}
            </ColValue>
          </GridCol>
          <GridCol>
            <ColLabel><Building size={12} /> Location / Branch</ColLabel>
            <ColValue>{testValues[0]?.locationId || "Shanmuga Reference Lab"}</ColValue>
          </GridCol>
        </PatientGrid>
      </PatientBannerCard>



      {/* ── Authorization Table ── */}
      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <th style={{ width: "50px", textAlign: "center" }}>Sl.</th>
              <th>Test Name / Parameters</th>
              <th>Department</th>
              <th>Specimen</th>
              <th>Container</th>
              <th style={{ minWidth: "220px" }}>Reported Findings & Values</th>
              <th>Unit</th>
              <th>Reference Range</th>
              <th>Remarks</th>
              {isCHC && <th>Status</th>}
              <th style={{ textAlign: "center", width: "100px" }}>Rerun</th>
              <th style={{ textAlign: "center", width: "110px" }}>Approve</th>
            </tr>
          </TableHead>
          <TableBody>
            {testValues.length > 0 ? (
              generateTableRows()
            ) : (
              <tr>
                <NoData colSpan={isCHC ? 12 : 11}>
                  No test data available for the selected patient and date.
                </NoData>
              </tr>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Footer style={{ justifyContent: "space-between", marginTop: "1.75rem" }}>
        <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
          Shanmuga Diagnostics Pathology Verification Module
        </div>
        <BackButton onClick={handleBack} style={{ borderRadius: "8px", border: "1px solid #cbd5e1" }}>
          <ChevronLeft size={18} />
          Back to Worklist
        </BackButton>
      </Footer>
    </Container>
  );
}

export default PathologyDoctorForm;
