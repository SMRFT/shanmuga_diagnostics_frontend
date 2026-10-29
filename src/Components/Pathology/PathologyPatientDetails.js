"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import styled, {
  createGlobalStyle,
  ThemeProvider,
  keyframes,
  css,
} from "styled-components";
import {
  Calendar,
  Search,
  AlertCircle,
  ChevronRight,
  CheckCircle,
  RefreshCcw,
  Clock,
  User,
  Tag,
  FileText,
  CalendarDays,
  Users,
  Stethoscope,
  History,
  FlaskConical,
  UserCheck,
  Send,
  RotateCcw,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from "react-router-dom";
import apiRequest from "../Auth/apiRequest";

const theme = {
  colors: {
    primary: "#a777e3",
    primaryHover: "#8b5cf6",
    secondary: "#6B7280",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    background: "#F4F6F9",
    backgroundAlt: "#FFFFFF",
    backgroundHover: "#F9FBFC",
    text: "#1F2937",
    textLight: "#6B7280",
    border: "#E5E7EB",
    borderDark: "#D1D5DB",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1)",
    lg: "0 10px 15px -3px rgba(0,0,0,0.1)",
    xl: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  breakpoints: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px" },
  transitions: {
    default: "all 0.2s ease-in-out",
    slow: "all 0.3s ease-in-out",
  },
};

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: ${(props) => props.theme.colors.text};
    background-color: ${(props) => props.theme.colors.background};
    line-height: 1.5;
  }
  .react-datepicker-wrapper { width: auto; }
  .react-datepicker {
    font-family: inherit;
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: ${(props) => props.theme.borderRadius.lg};
    box-shadow: ${(props) => props.theme.shadows.lg};
  }
  .react-datepicker__header {
    background-color: ${(props) => props.theme.colors.background};
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }
  .react-datepicker__day--selected { background-color: ${(props) => props.theme.colors.primary}; color: white; }
  .react-datepicker__day:hover { background-color: ${(props) => props.theme.colors.primaryHover}; color: white; }
  .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range {
    background-color: ${(props) => props.theme.colors.primary}30;
    color: ${(props) => props.theme.colors.text};
  }
  .react-datepicker__day--selecting-range-start,
  .react-datepicker__day--range-start,
  .react-datepicker__day--range-end {
    background-color: ${(props) => props.theme.colors.primary}; color: white;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0.5rem 0.85rem;
  background: transparent;
  box-shadow: none;
  @media (max-width: 768px) {
    padding: 0.35rem 0.5rem;
  }
`;

const CardContainer = styled.div`
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  padding: 0.85rem 1rem;
  @media (max-width: 768px) {
    padding: 0.65rem 0.75rem;
  }
`;

// ── Top Header & Tab Navigation Bar ──
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-bottom: 0.65rem;
  margin-bottom: 0.65rem;
  border-bottom: 1px solid #e2e8f0;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  color: #0f172a;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  letter-spacing: -0.2px;
`;

const Subtitle = styled.span`
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 500;
  padding-left: 0.5rem;
  border-left: 2px solid #cbd5e1;
  @media (max-width: 640px) {
    display: none;
  }
`;

const TabsContainer = styled.div`
  display: inline-flex;
  background: #f1f5f9;
  padding: 0.2rem;
  border-radius: 8px;
  gap: 0.3rem;
  border: 1px solid #e2e8f0;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    width: 100%;
    justify-content: stretch;
  }
`;

const TabButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.35rem 0.8rem;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  background: ${(props) => (props.active ? "#a777e3" : "transparent")};
  color: ${(props) => (props.active ? "#FFFFFF" : "#475569")};
  box-shadow: ${(props) =>
    props.active ? "0 2px 6px rgba(167, 119, 227, 0.28)" : "none"};

  &:hover {
    color: ${(props) => (props.active ? "#FFFFFF" : "#0f172a")};
    background: ${(props) =>
      props.active ? "#8b5cf6" : "rgba(255, 255, 255, 0.65)"};
  }

  @media (max-width: 768px) {
    flex: 1;
    padding: 0.35rem 0.5rem;
    font-size: 0.78rem;
  }
`;

const TabBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem 0.45rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.2;
  background: ${(props) =>
    props.active ? "rgba(255, 255, 255, 0.25)" : "#e2e8f0"};
  color: ${(props) => (props.active ? "#FFFFFF" : "#a777e3")};
`;

// ── Compact Filter Toolbar ──
const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem 0.55rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  background: #f8fafc;
  padding: 0.45rem 0.65rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const DateRangeWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: #ffffff;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  height: 32px;
`;

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  label {
    color: #64748b;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
  }
  .react-datepicker-wrapper {
    width: 74px;
  }
  input {
    border: none;
    background: transparent;
    color: #0f172a;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0;
    cursor: pointer;
    width: 74px;
    &:focus {
      outline: none;
    }
  }
`;

const DateRangeLabel = styled.span`
  color: #94a3b8;
  font-size: 0.74rem;
  font-weight: 500;
`;

const BarcodeSearchWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  flex: 1 1 180px;
  max-width: 260px;
  min-width: 155px;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0.2rem 0.45rem 0.2rem 1.75rem;
  border: 1px solid #cbd5e1;
  border-right: none;
  border-radius: 6px 0 0 6px;
  font-size: 0.8rem;
  background: #ffffff;
  transition: all 0.15s ease-in-out;
  &:focus {
    outline: none;
    border-color: #a777e3;
    box-shadow: 0 0 0 2px rgba(167, 119, 227, 0.15);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
`;

const StepButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 100%;
  flex-shrink: 0;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #a777e3;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  line-height: 1;
  &:first-of-type {
    border-right: none;
  }
  &:last-of-type {
    border-radius: 0 6px 6px 0;
  }
  &:hover {
    background: #a777e3;
    color: white;
    border-color: #a777e3;
  }
  &:active {
    transform: scale(0.95);
  }
`;

const FilterSelect = styled.select`
  height: 32px;
  padding: 0.2rem 1.4rem 0.2rem 0.45rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #1e293b;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.45rem center;
  background-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  appearance: none;
  &:hover {
    border-color: #a777e3;
  }
  &:focus {
    outline: none;
    border-color: #a777e3;
    box-shadow: 0 0 0 2px rgba(167, 119, 227, 0.15);
  }
`;

const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  height: 32px;
  padding: 0.2rem 0.65rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  white-space: nowrap;
  margin-left: auto;

  &:hover {
    background-color: #fee2e2;
    color: #dc2626;
    border-color: #fca5a5;
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    margin-left: 0;
  }
`;

// ── Table Section Styling ──
const TableSection = styled.div`
  margin-bottom: 0.85rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.35rem;
  padding: 0.35rem 0.65rem;
  background: ${(props) => (props.backlog ? "#FFFBEB" : "#faf5ff")};
  border-left: 3.5px solid ${(props) => (props.backlog ? "#F59E0B" : "#a777e3")};
  border-radius: 6px;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const SectionTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
`;

const SectionTitle = styled.h2`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${(props) => (props.backlog ? "#92400E" : "#7c3aed")};
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
`;

const SectionSubtitle = styled.span`
  font-size: 0.76rem;
  color: #64748b;
  font-weight: 500;
`;

const SectionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.12rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
  background: ${(props) => (props.backlog ? "#FEF3C7" : "#f5f0fb")};
  color: ${(props) => (props.backlog ? "#92400E" : "#7c3aed")};
  border: 1px solid ${(props) => (props.backlog ? "#FCD34D" : "#ddd6fe")};
`;

const TopScrollTrack = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  height: 12px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-bottom: none;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  &::-webkit-scrollbar {
    height: 9px;
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

const TableWrapperContainer = styled.div`
  position: relative;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: ${(props) => (props.hasTopTrack ? "0 0 8px 8px" : "8px")};
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
    height: 0;
  }
`;

const TableWrapper = ({ children, style, className }) => {
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
      <TableWrapperContainer
        ref={bottomScrollRef}
        onScroll={handleBottomScroll}
        hasTopTrack={hasOverflow}
        style={style}
        className={className}
      >
        {children}
      </TableWrapperContainer>
    </div>
  );
};

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
`;

const TableHead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 10;
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
    background: transparent;

    &:first-child {
      border-top-left-radius: 8px;
      padding-left: 0.85rem;
    }

    &:last-child {
      border-top-right-radius: 8px;
      padding-right: 0.85rem;
    }
  }
`;

const Th = styled.th`
  padding: 0.65rem 0.65rem;
  text-align: left;
  font-weight: 700;
  font-size: 0.76rem;
  color: #ffffff;
  border: none;
  white-space: nowrap;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  background: transparent;
  &:first-child {
    padding-left: 0.85rem;
  }
  &:last-child {
    padding-right: 0.85rem;
  }
`;

const Td = styled.td`
  padding: 0.5rem 0.65rem;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
  &:first-child {
    padding-left: 0.75rem;
  }
  &:last-child {
    padding-right: 0.75rem;
  }
`;

const Tr = styled.tr`
  transition: background-color 0.15s ease;
  &:hover {
    background-color: #f8fafc;
  }
  &:last-child td {
    border-bottom: none;
  }
`;

const TestButton = styled.button`
  display: inline-flex;
  align-items: flex-start;
  gap: 0.35rem;
  padding: 0.35rem 0.55rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  color: #1e293b;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  width: 100%;
  text-align: left;
  flex-direction: column;
  &:hover:not(:disabled) {
    background: #f0f9ff;
    border-color: #a777e3;
    color: #a777e3;
  }
  &:disabled {
    background: #f8fafc;
    color: #94a3b8;
    border-color: #e2e8f0;
    cursor: not-allowed !important;
    opacity: 0.7;
    * {
      cursor: not-allowed !important;
    }
  }
`;

const TestNameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0.35rem;
`;

const UserInfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  font-size: 0.7rem;
  color: #64748b;
  margin-top: 0.15rem;
`;

const TATIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.68rem;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  font-weight: 600;
  min-width: 90px;
  justify-content: center;
  opacity: 1 !important;
  background-color: ${(props) => {
    if (props.isRerun) return "#dc2626";
    if (
      props.secondsLeft === null ||
      props.secondsLeft === undefined ||
      isNaN(props.secondsLeft)
    )
      return "#e0e7ff";
    if (props.secondsLeft < 0) return "#dc2626"; // Overdue
    if (props.secondsLeft < 7200) return "#f59e0b"; // Critical (< 2h)
    return "#16a34a"; // Normal
  }};
  color: ${(props) =>
    props.isRerun ||
    (props.secondsLeft !== null &&
      props.secondsLeft !== undefined &&
      !isNaN(props.secondsLeft))
      ? "white"
      : "#3730a3"};
`;

const TATText = styled.span`
  white-space: nowrap;
  font-family: monospace;
  letter-spacing: 0.3px;
`;

const TATLabel = styled.div`
  font-size: 0.62rem;
  opacity: 0.9;
  text-transform: uppercase;
  line-height: 1;
`;

const UserBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.1rem 0.3rem;
  background: #f1f5f9;
  border-radius: 4px;
  white-space: nowrap;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
  ${(props) => {
    switch (props.status) {
      case "Approved":
      case "Waiting for Dispatch":
        return css`
          background-color: #dcfce7;
          color: #15803d;
          border: 1px solid #bbf7d0;
        `;
      case "Dispatched":
        return css`
          background-color: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        `;
      case "Rerun Initiated":
        return css`
          background-color: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        `;
      case "Waiting for Doctor's Approval":
        return css`
          background-color: #fef3c7;
          color: #b45309;
          border: 1px solid #fde68a;
        `;
      default:
        return css`
          background-color: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        `;
    }
  }}
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  text-align: center;
  background: #ffffff;
  border-radius: 8px;
  border: 1.5px dashed #cbd5e1;
`;

const EmptyStateText = styled.p`
  color: #64748b;
  margin-top: 0.4rem;
  font-size: 0.82rem;
  max-width: 28rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1.75rem;
  height: 1.75rem;
  border: 2px solid #cbd5e1;
  border-top-color: #a777e3;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const PatientInfo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #334155;
  font-size: 0.8rem;
  svg {
    color: #94a3b8;
  }
`;

const TestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const blink = keyframes` 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } `;

const EmergencyBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  ${(props) =>
    props.emergency &&
    css`
      background-color: #ef4444;
      color: white;
      animation: ${blink} 1.5s ease-in-out infinite;
    `}
  ${(props) =>
    props.normal &&
    css`
      background-color: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
    `}
`;

const DepartmentGroup = styled.div`
  margin-bottom: 0.45rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const DepartmentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.55rem;
  background: #faf5ff;
  border: 1px solid #ede9fe;
  border-radius: 4px;
  margin-bottom: 0.25rem;
  font-weight: 700;
  font-size: 0.74rem;
  color: #7c3aed;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const PriorityCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
`;
const PathologyPatientDetails = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const location = useLocation();

  // ── Tab state: "technician" | "doctor" ──
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab ?? "technician",
  );

  const [searchQuery, setSearchQuery] = useState(
    location.state?.searchQuery ??
      location.state?.barcode ??
      location.state?.uhid ??
      "",
  );

  const [fromDate, setFromDate] = useState(
    location.state?.fromDate ? new Date(location.state.fromDate) : new Date(),
  );
  const [toDate, setToDate] = useState(
    location.state?.toDate ? new Date(location.state.toDate) : new Date(),
  );

  // Separate states for Technicians, Doctors, and Dispatch to maintain independent tab badges, eliminate count flickering, and enable instant tab switching
  const [techSelectedDatePatients, setTechSelectedDatePatients] = useState([]);
  const [techAllDaysPatients, setTechAllDaysPatients] = useState([]);
  const [techSelectedLoading, setTechSelectedLoading] = useState(
    (location.state?.activeTab ?? "technician") === "technician",
  );
  const [techAllDaysLoading, setTechAllDaysLoading] = useState(
    (location.state?.activeTab ?? "technician") === "technician",
  );
  const [techSelectedError, setTechSelectedError] = useState(null);
  const [techAllDaysError, setTechAllDaysError] = useState(null);

  const [docSelectedDatePatients, setDocSelectedDatePatients] = useState([]);
  const [docAllDaysPatients, setDocAllDaysPatients] = useState([]);
  const [docSelectedLoading, setDocSelectedLoading] = useState(
    (location.state?.activeTab ?? "technician") === "doctor",
  );
  const [docAllDaysLoading, setDocAllDaysLoading] = useState(
    (location.state?.activeTab ?? "technician") === "doctor",
  );
  const [docSelectedError, setDocSelectedError] = useState(null);
  const [docAllDaysError, setDocAllDaysError] = useState(null);

  const [dispatchSelectedDatePatients, setDispatchSelectedDatePatients] = useState([]);
  const [dispatchAllDaysPatients, setDispatchAllDaysPatients] = useState([]);
  const [dispatchSelectedLoading, setDispatchSelectedLoading] = useState(
    (location.state?.activeTab ?? "technician") === "dispatch",
  );
  const [dispatchAllDaysLoading, setDispatchAllDaysLoading] = useState(
    (location.state?.activeTab ?? "technician") === "dispatch",
  );
  const [dispatchSelectedError, setDispatchSelectedError] = useState(null);
  const [dispatchAllDaysError, setDispatchAllDaysError] = useState(null);

  const [tabCounts, setTabCounts] = useState({
    technician: null,
    doctor: null,
    dispatch: null,
  });
  const [loadedTabsForCurrentDate, setLoadedTabsForCurrentDate] = useState({
    technician: false,
    doctor: false,
    dispatch: false,
  });

  const [statusFilter, setStatusFilter] = useState("all");
  const [emergencyFilter, setEmergencyFilter] = useState("all");
  const [fromFilter, setFromFilter] = useState("all");
  const [opipFilter, setOpipFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [currentTime, setCurrentTime] = useState(new Date());

  // Reset status filter when active tab switches
  useEffect(() => {
    setStatusFilter("all");
  }, [activeTab]);

  // Update current time every second for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const parseTatToSeconds = (tatStr) => {
    if (!tatStr || tatStr === "N/A") return null;
    let totalMinutes = 0;
    const str = String(tatStr).toUpperCase();
    const d = str.match(/(\d+)\s*D/);
    const h = str.match(/(\d+)\s*H/);
    const m = str.match(/(\d+)\s*M/);
    if (d) totalMinutes += parseInt(d[1], 10) * 1440;
    if (h) totalMinutes += parseInt(h[1], 10) * 60;
    if (m) totalMinutes += parseInt(m[1], 10);
    if (!d && !h && !m) {
      const num = str.match(/(\d+)/);
      if (num) {
        if (str.includes("DAY")) totalMinutes += parseInt(num[1], 10) * 1440;
        else if (str.includes("MIN")) totalMinutes += parseInt(num[1], 10);
        else totalMinutes += parseInt(num[1], 10) * 60;
      }
    }
    return totalMinutes ? totalMinutes * 60 : null;
  };

  const formatTimeRemaining = (seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return null;
    const absSeconds = Math.abs(seconds);
    const days = Math.floor(absSeconds / 86400);
    const hours = Math.floor((absSeconds % 86400) / 3600);
    const minutes = Math.floor((absSeconds % 3600) / 60);
    const secs = Math.floor(absSeconds % 60);

    let parts = [];
    if (days > 0) parts.push(`${days}D`);
    if (hours > 0 || days > 0) parts.push(`${hours}H`);
    if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}M`);
    parts.push(`${secs}S`);

    return parts.join(":");
  };

  const calculateLiveSecondsLeft = (test, patient) => {
    // If rerun is initiated, it is active and pending re-entry, NOT completed
    if (test.rerun) {
      const tatSeconds = parseTatToSeconds(test.tat_time || test.TAT_Time || test.tat);
      const rerunTime = test.rerun_time;
      if (!tatSeconds || !rerunTime) return null;
      const rerunDt = new Date(String(rerunTime).replace(" ", "T"));
      if (isNaN(rerunDt.getTime())) return null;
      const deadline = new Date(rerunDt.getTime() + tatSeconds * 1000);
      const diff = Math.floor((deadline - currentTime) / 1000);
      return isNaN(diff) ? null : diff;
    }

    // Only after doctor's approval or dispatch is a test completed
    const isCompleted = Boolean(
      test.approve === true ||
        test.approve === "true" ||
        test.dispatch === true ||
        test.dispatch === "true" ||
        test.is_dispatched === true ||
        test.is_dispatched === "true",
    );

    if (
      isCompleted &&
      test.tat_status === "completed" &&
      typeof test.seconds_left === "number" &&
      !isNaN(test.seconds_left)
    ) {
      return test.seconds_left;
    }

    if (!isCompleted && test.tat_status === "pending" && test.tat_deadline) {
      const deadline = new Date(test.tat_deadline);
      if (!isNaN(deadline.getTime())) {
        return Math.floor((deadline - currentTime) / 1000);
      }
    }

    if (!isCompleted && typeof test.seconds_left === "number" && !isNaN(test.seconds_left)) {
      return test.seconds_left;
    }

    const tatSeconds = parseTatToSeconds(test.tat_time || test.TAT_Time || test.tat);
    const sampleTime =
      test.samplecollected_time ||
      test.sample_collected_time ||
      test.collected_time ||
      test.created_date ||
      (patient ? patient.created_date || patient.date : null);

    if (!tatSeconds || !sampleTime) return null;

    const collectedDt = new Date(String(sampleTime).replace(" ", "T"));
    if (isNaN(collectedDt.getTime())) return null;

    if (isCompleted) {
      const validApproveTime =
        test.approve_time &&
        test.approve_time !== "null" &&
        test.approve_time !== "undefined"
          ? test.approve_time
          : null;
      const validDispatchTime =
        test.dispatch_time &&
        test.dispatch_time !== "null" &&
        test.dispatch_time !== "undefined"
          ? test.dispatch_time
          : null;
      const endDtStr = validApproveTime || validDispatchTime;
      const endDt = endDtStr
        ? new Date(String(endDtStr).replace(" ", "T"))
        : new Date();
      const validEndTime = !isNaN(endDt.getTime()) ? endDt : new Date();
      const timeTakenSeconds = Math.floor((validEndTime - collectedDt) / 1000);
      if (isNaN(timeTakenSeconds)) return null;
      return tatSeconds - timeTakenSeconds;
    } else {
      const deadline = new Date(collectedDt.getTime() + tatSeconds * 1000);
      const diff = Math.floor((deadline - currentTime) / 1000);
      return isNaN(diff) ? null : diff;
    }
  };

  const formatTATDisplay = (test, patient) => {
    const tatTimeVal = test.tat_time || test.TAT_Time || test.tat;
    const liveSecondsLeft = calculateLiveSecondsLeft(test, patient);

    // If rerun is initiated, display actual status "Rerun Initiated", NOT "Completed"
    if (test.rerun) {
      if (liveSecondsLeft === null || isNaN(liveSecondsLeft)) {
        return {
          label: "Rerun Initiated",
          time: tatTimeVal || "Pending",
          isOverdue: false,
          isRerun: true,
        };
      }
      const timeStr = formatTimeRemaining(liveSecondsLeft);
      if (liveSecondsLeft > 0) {
        return {
          label: "Rerun Initiated",
          time: timeStr || "Pending",
          isOverdue: false,
          isRerun: true,
        };
      } else {
        return {
          label: "Rerun Initiated",
          time: timeStr ? `${timeStr} late` : "Overdue",
          isOverdue: true,
          isRerun: true,
        };
      }
    }

    // Only after approval or dispatch is TAT marked as completed
    const isCompleted =
      !test.rerun &&
      Boolean(
        test.approve === true ||
          test.approve === "true" ||
          test.dispatch === true ||
          test.dispatch === "true" ||
          test.is_dispatched === true ||
          test.is_dispatched === "true",
      );

    if (isCompleted) {
      if (liveSecondsLeft === null || isNaN(liveSecondsLeft)) {
        return tatTimeVal
          ? { label: "Completed", time: tatTimeVal, isOverdue: false }
          : { label: "Completed", time: "Approved", isOverdue: false };
      }
      const timeStr = formatTimeRemaining(liveSecondsLeft);
      if (liveSecondsLeft >= 0) {
        return {
          label: "Completed",
          time: timeStr ? `${timeStr} early` : "On Time",
          isOverdue: false,
        };
      } else {
        return {
          label: "Completed",
          time: timeStr ? `${timeStr} late` : "Overdue",
          isOverdue: true,
        };
      }
    } else {
      // Pending tests (Technicians Pending & Doctors Pending): show live TAT countdown
      if (liveSecondsLeft === null || isNaN(liveSecondsLeft)) {
        return tatTimeVal
          ? { label: "TAT", time: tatTimeVal, isOverdue: false }
          : null;
      }
      const timeStr = formatTimeRemaining(liveSecondsLeft);
      if (liveSecondsLeft > 0) {
        return {
          label: "Time Left",
          time: timeStr || tatTimeVal,
          isOverdue: false,
        };
      } else {
        return {
          label: "Overdue",
          time: timeStr || "Overdue",
          isOverdue: true,
        };
      }
    }
  };

  // ── Clear all filters on page reload ──
  useEffect(() => {
    const isReload =
      window.performance &&
      (window.performance.navigation?.type === 1 ||
        window.performance.getEntriesByType?.("navigation")?.[0]?.type ===
          "reload");

    if (isReload && !location.state) {
      setSearchQuery("");
      setFromDate(new Date());
      setToDate(new Date());
      setStatusFilter("all");
      setEmergencyFilter("all");
      setFromFilter("all");
      setOpipFilter("all");
      setDepartmentFilter("all");
    }
  }, [location.state]);

  // ── Unified Data Fetcher for Active Tab using scope=split ──
  const fetchTabData = useCallback(
    async (tabToFetch, customFromDate, customToDate) => {
      if (tabToFetch === "technician") {
        setTechSelectedLoading(true);
        setTechAllDaysLoading(true);
        setTechSelectedError(null);
        setTechAllDaysError(null);
      } else if (tabToFetch === "doctor") {
        setDocSelectedLoading(true);
        setDocAllDaysLoading(true);
        setDocSelectedError(null);
        setDocAllDaysError(null);
      } else {
        setDispatchSelectedLoading(true);
        setDispatchAllDaysLoading(true);
        setDispatchSelectedError(null);
        setDispatchAllDaysError(null);
      }

      const activeFrom = customFromDate || fromDate;
      const activeTo = customToDate || toDate;
      const formattedFromDate = format(activeFrom, "yyyy-MM-dd");
      const formattedToDate = format(activeTo, "yyyy-MM-dd");

      try {
        const res = await apiRequest(
          `${Labbaseurl}pathology_testvalue/?from_date=${formattedFromDate}&to_date=${formattedToDate}&pending_type=${tabToFetch}&scope=split&exclude_dispatched=true`,
          "GET",
        );

        if (res.success && res.data) {
          const selected = res.data.selected_date || [];
          const allDays = res.data.all_days || [];

          if (tabToFetch === "technician") {
            setTechSelectedDatePatients(selected);
            setTechAllDaysPatients(allDays);
            setTechSelectedError(null);
            setTechAllDaysError(null);
          } else if (tabToFetch === "doctor") {
            setDocSelectedDatePatients(selected);
            setDocAllDaysPatients(allDays);
            setDocSelectedError(null);
            setDocAllDaysError(null);
          } else {
            setDispatchSelectedDatePatients(selected);
            setDispatchAllDaysPatients(allDays);
            setDispatchSelectedError(null);
            setDispatchAllDaysError(null);
          }

          if (res.data.counts) {
            setTabCounts((prev) => ({
              ...prev,
              ...res.data.counts,
            }));
          }

          setLoadedTabsForCurrentDate((prev) => ({
            ...prev,
            [tabToFetch]: true,
          }));
        } else {
          const errMsg = res.error || `Failed to fetch ${tabToFetch} data`;
          if (tabToFetch === "technician") {
            setTechSelectedError(errMsg);
            setTechAllDaysError(errMsg);
            setTechSelectedDatePatients([]);
            setTechAllDaysPatients([]);
          } else if (tabToFetch === "doctor") {
            setDocSelectedError(errMsg);
            setDocAllDaysError(errMsg);
            setDocSelectedDatePatients([]);
            setDocAllDaysPatients([]);
          } else {
            setDispatchSelectedError(errMsg);
            setDispatchAllDaysError(errMsg);
            setDispatchSelectedDatePatients([]);
            setDispatchAllDaysPatients([]);
          }
        }
      } catch (err) {
        const errMsg = err.message || `Failed to fetch ${tabToFetch} data`;
        if (tabToFetch === "technician") {
          setTechSelectedError(errMsg);
          setTechAllDaysError(errMsg);
          setTechSelectedDatePatients([]);
          setTechAllDaysPatients([]);
        } else if (tabToFetch === "doctor") {
          setDocSelectedError(errMsg);
          setDocAllDaysError(errMsg);
          setDocSelectedDatePatients([]);
          setDocAllDaysPatients([]);
        } else {
          setDispatchSelectedError(errMsg);
          setDispatchAllDaysError(errMsg);
          setDispatchSelectedDatePatients([]);
          setDispatchAllDaysPatients([]);
        }
      } finally {
        if (tabToFetch === "technician") {
          setTechSelectedLoading(false);
          setTechAllDaysLoading(false);
        } else if (tabToFetch === "doctor") {
          setDocSelectedLoading(false);
          setDocAllDaysLoading(false);
        } else {
          setDispatchSelectedLoading(false);
          setDispatchAllDaysLoading(false);
        }
      }
    },
    [fromDate, toDate, Labbaseurl],
  );

  // ── On Date Change or Mount: Fetch ONLY the active tab ──
  useEffect(() => {
    setLoadedTabsForCurrentDate({
      technician: false,
      doctor: false,
      dispatch: false,
    });
    fetchTabData(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, fetchTabData]);

  // ── On Tab Switch: Fetch only if not already loaded for current date range ──
  const handleTabSwitch = (newTab) => {
    if (newTab === activeTab) return;
    setActiveTab(newTab);
    if (!loadedTabsForCurrentDate[newTab]) {
      fetchTabData(newTab);
    }
  };

  const handleClearFilters = () => {
    const today = new Date();
    const isFromToday =
      format(fromDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
    const isToToday =
      format(toDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

    setSearchQuery("");
    setFromFilter("all");
    setOpipFilter("all");
    setDepartmentFilter("all");
    setStatusFilter("all");
    setEmergencyFilter("all");

    if (isFromToday && isToToday) {
      fetchTabData(activeTab, today, today);
    } else {
      setFromDate(today);
      setToDate(today);
    }
  };

  // ── Technician Test Click -> Enter test values ──
  const handlePatientClick = (
    patientId,
    patientname,
    age,
    gender,
    barcode,
    location_id,
    testId,
    testName,
    patientDate,
    createdDate,
    phone,
    ref_doctor,
    barcode_by,
    barcode_date,
    labId = "",
  ) => {
    const formattedPatientDate = patientDate
      ? format(new Date(patientDate), "yyyy-MM-dd")
      : "";
    const rawCreated = createdDate || "";
    const formattedCreatedDate = rawCreated
      ? format(new Date(rawCreated.replace("T", " ") + "Z"), "yyyy-MM-dd")
      : "";
    const encodedTestName = encodeURIComponent(testName || "");
    const encodedBarcode = encodeURIComponent(barcode || "");
    const encodedGender = encodeURIComponent(gender || "");
    const encodedPhone = encodeURIComponent(phone || "");
    const encodedRefDoctor = encodeURIComponent(ref_doctor || "");
    const encodedBarcodeBy = encodeURIComponent(barcode_by || "");
    const encodedBarcodeDate = encodeURIComponent(barcode_date || "");
    const encodedLabId = encodeURIComponent(labId || "");

    navigate(
      `/PathologyTestDetails?date=${formattedPatientDate}&created_date=${formattedCreatedDate}` +
        `&patient_id=${patientId}&patientname=${patientname}&age=${age}` +
        `&gender=${encodedGender}&barcode=${encodedBarcode}` +
        `&locationId=${location_id || "Shanmuga Referrence Lab"}&test_id=${testId}` +
        `&test_name=${encodedTestName}` +
        `&phone=${encodedPhone}&ref_doctor=${encodedRefDoctor}` +
        `&barcode_by=${encodedBarcodeBy}&barcode_date=${encodedBarcodeDate}` +
        `&lab_id=${encodedLabId}`,
      { state: { fromDate, toDate, barcode, lab_id: labId || "", activeTab: "technician", fromPathology: true } },
    );
  };

  // ── History Navigation ──
  const handleHistoryClick = (patientId) => {
    navigate("/WorkList", {
      state: {
        uhid: patientId,
        fromDate: fromDate ? fromDate.toISOString() : null,
        toDate: toDate ? toDate.toISOString() : null,
        searchQuery,
      },
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
      case "Waiting for Dispatch":
      case "Dispatched":
        return <CheckCircle size={12} />;
      case "Rerun Initiated":
        return <RefreshCcw size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  const getTestStatus = (test) => {
    if (test.dispatch) return "Dispatched";
    if (!test.test_value_exists) return "Waiting for Technician's Approval";
    return test.rerun
      ? "Rerun Initiated"
      : test.approve
        ? "Approved"
        : "Waiting for Doctor's Approval";
  };

  const groupTestsByDepartment = (testdetails) => {
    const grouped = {};
    testdetails.forEach((test) => {
      const dept = test.department || "Other";
      if (!grouped[dept]) grouped[dept] = [];
      grouped[dept].push(test);
    });
    return grouped;
  };

  const getAllDepartments = () => {
    const departments = new Set();
    const currentList =
      activeTab === "technician"
        ? [...techSelectedDatePatients, ...techAllDaysPatients]
        : activeTab === "doctor"
          ? [...docSelectedDatePatients, ...docAllDaysPatients]
          : [...dispatchSelectedDatePatients, ...dispatchAllDaysPatients];
    currentList.forEach((patient) => {
      if (activeTab === "dispatch") {
        const locLower = (patient.location_id || "Shanmuga Reference Lab").toLowerCase();
        if (!locLower.includes("hms") && !locLower.includes("shanmuga") && !locLower.includes("reference")) {
          return;
        }
      }
      patient.testdetails?.forEach((test) => {
        const testStatus = getTestStatus(test);
        if (testStatus === "Dispatched") return;
        if (
          activeTab === "technician" &&
          !(
            testStatus === "Waiting for Technician's Approval" ||
            testStatus === "Rerun Initiated"
          )
        )
          return;
        if (
          activeTab === "doctor" &&
          testStatus !== "Waiting for Doctor's Approval"
        )
          return;
        if (
          activeTab === "dispatch" &&
          !(testStatus === "Approved" || testStatus === "Waiting for Dispatch")
        )
          return;
        if (test.department) departments.add(test.department);
      });
    });
    return Array.from(departments).sort();
  };

  const getUniqueLocations = () => {
    const locations = new Set();
    const currentList =
      activeTab === "technician"
        ? [...techSelectedDatePatients, ...techAllDaysPatients]
        : activeTab === "doctor"
          ? [...docSelectedDatePatients, ...docAllDaysPatients]
          : [...dispatchSelectedDatePatients, ...dispatchAllDaysPatients];
    currentList.forEach((p) => {
      const loc = p.location_id || "Shanmuga Reference Lab";
      if (activeTab === "dispatch") {
        const locLower = loc.toLowerCase();
        if (locLower.includes("hms") || locLower.includes("shanmuga") || locLower.includes("reference")) {
          locations.add(loc);
        }
      } else {
        locations.add(loc);
      }
    });
    return Array.from(locations).sort();
  };

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

  // ── Unified Filtering function for both tables ──
  const filterPatientsList = (patientList, targetTab = activeTab) => {
    return patientList.filter((patient) => {
      // In dispatch tab, strictly allow only HMS and Shanmuga Reference Lab
      if (targetTab === "dispatch") {
        const locLower = (patient.location_id || "Shanmuga Reference Lab").toLowerCase();
        const isAllowedLocation =
          locLower.includes("hms") ||
          locLower.includes("shanmuga") ||
          locLower.includes("reference");
        if (!isAllowedLocation) return false;
      }

      const matchesSearch =
        (patient.patientname || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (patient.barcode || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (patient.patient_id || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      const patientLocation = patient.location_id || "Shanmuga Reference Lab";
      if (fromFilter !== "all" && patientLocation !== fromFilter) return false;
      if (opipFilter !== "all" && patient.opiptype !== opipFilter) return false;

      const matchesEmergency =
        emergencyFilter === "all" ||
        (emergencyFilter === "emergency" && patient.is_emergency) ||
        (emergencyFilter === "normal" && !patient.is_emergency);
      if (!matchesEmergency) return false;

      // Filter tests strictly according to targetTab (never allow dispatched)
      const validTests = (patient.testdetails || []).filter((test) => {
        const testStatus = getTestStatus(test);
        if (testStatus === "Dispatched") return false;
        if (targetTab === "technician") {
          return (
            testStatus === "Waiting for Technician's Approval" ||
            testStatus === "Rerun Initiated"
          );
        } else if (targetTab === "doctor") {
          return testStatus === "Waiting for Doctor's Approval";
        } else if (targetTab === "dispatch") {
          return (
            testStatus === "Approved" ||
            testStatus === "Waiting for Dispatch"
          );
        }
        return false;
      });

      if (validTests.length === 0) return false;

      if (departmentFilter !== "all") {
        const hasDepartment = validTests.some(
          (test) => test.department === departmentFilter,
        );
        if (!hasDepartment) return false;
      }

      if (statusFilter === "all") return true;
      return validTests.some((test) => {
        const testStatus = getTestStatus(test);
        if (statusFilter === "technician")
          return testStatus === "Waiting for Technician's Approval";
        if (statusFilter === "doctor")
          return testStatus === "Waiting for Doctor's Approval";
        if (statusFilter === "dispatch")
          return (
            testStatus === "Approved" ||
            testStatus === "Waiting for Dispatch"
          );
        if (statusFilter === "rerun") return testStatus === "Rerun Initiated";
        return false;
      });
    });
  };

  const filteredTechSelected = filterPatientsList(
    techSelectedDatePatients,
    "technician",
  );
  const filteredTechAllDays = filterPatientsList(
    techAllDaysPatients,
    "technician",
  );
  const filteredDocSelected = filterPatientsList(
    docSelectedDatePatients,
    "doctor",
  );
  const filteredDocAllDays = filterPatientsList(
    docAllDaysPatients,
    "doctor",
  );
  const filteredDispatchSelected = filterPatientsList(
    dispatchSelectedDatePatients,
    "dispatch",
  );
  const filteredDispatchAllDays = filterPatientsList(
    dispatchAllDaysPatients,
    "dispatch",
  );

  const hasActiveFilter =
    searchQuery.trim() !== "" ||
    emergencyFilter !== "all" ||
    fromFilter !== "all" ||
    opipFilter !== "all" ||
    departmentFilter !== "all" ||
    statusFilter !== "all";

  const techUniqueCount =
    filteredTechSelected.length + filteredTechAllDays.length;
  const docUniqueCount =
    filteredDocSelected.length + filteredDocAllDays.length;
  const dispatchUniqueCount =
    filteredDispatchSelected.length + filteredDispatchAllDays.length;

  const techCount = hasActiveFilter
    ? techUniqueCount
    : tabCounts.technician !== null && tabCounts.technician !== undefined
      ? tabCounts.technician
      : techUniqueCount;

  const docCount = hasActiveFilter
    ? docUniqueCount
    : tabCounts.doctor !== null && tabCounts.doctor !== undefined
      ? tabCounts.doctor
      : docUniqueCount;

  const dispatchCount = hasActiveFilter
    ? dispatchUniqueCount
    : tabCounts.dispatch !== null && tabCounts.dispatch !== undefined
      ? tabCounts.dispatch
      : dispatchUniqueCount;

  const currentSelectedPatients =
    activeTab === "technician"
      ? filteredTechSelected
      : activeTab === "doctor"
        ? filteredDocSelected
        : filteredDispatchSelected;
  const currentAllDaysPatients =
    activeTab === "technician"
      ? filteredTechAllDays
      : activeTab === "doctor"
        ? filteredDocAllDays
        : filteredDispatchAllDays;

  const currentSelectedLoading =
    activeTab === "technician"
      ? techSelectedLoading
      : activeTab === "doctor"
        ? docSelectedLoading
        : dispatchSelectedLoading;
  const currentAllDaysLoading =
    activeTab === "technician"
      ? techAllDaysLoading
      : activeTab === "doctor"
        ? docAllDaysLoading
        : dispatchAllDaysLoading;

  const currentSelectedError =
    activeTab === "technician"
      ? techSelectedError
      : activeTab === "doctor"
        ? docSelectedError
        : dispatchSelectedError;
  const currentAllDaysError =
    activeTab === "technician"
      ? techAllDaysError
      : activeTab === "doctor"
        ? docAllDaysError
        : dispatchAllDaysError;

  // ── Reusable Table Renderer ──
  const renderPatientTable = (
    patients,
    isLoading,
    fetchError,
    emptyText,
    isBacklog = false,
  ) => {
    if (isLoading) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      );
    }

    if (fetchError) {
      return (
        <EmptyState>
          <AlertCircle size={24} color={theme.colors.danger} />
          <EmptyStateText>{fetchError}</EmptyStateText>
        </EmptyState>
      );
    }

    if (patients.length === 0) {
      return (
        <EmptyState>
          <AlertCircle size={24} color={theme.colors.textLight} />
          <EmptyStateText>{emptyText}</EmptyStateText>
        </EmptyState>
      );
    }

    return (
      <>
        <TableWrapper>
          <Table>
            <colgroup>
              <col style={{ width: "8%", minWidth: "85px" }} />
              <col style={{ width: "18%", minWidth: "180px" }} />
              <col style={{ width: "5%", minWidth: "55px" }} />
              <col style={{ width: "10%", minWidth: "100px" }} />
              <col style={{ width: "8%", minWidth: "85px" }} />
              <col style={{ width: "41%", minWidth: "420px" }} />
              <col style={{ width: "10%", minWidth: "110px" }} />
            </colgroup>
            <TableHead>
              <tr>
                <Th style={{ width: "8%", minWidth: "85px" }}>Date</Th>
                <Th style={{ width: "18%", minWidth: "180px" }}>Patient Info</Th>
                <Th style={{ width: "5%", minWidth: "55px" }}>Type</Th>
                <Th style={{ width: "10%", minWidth: "100px" }}>From</Th>
                <Th style={{ width: "8%", minWidth: "85px" }}>Priority</Th>
                <Th style={{ width: "41%", minWidth: "420px" }}>
                  Tests (Grouped by Department)
                </Th>
                <Th style={{ width: "10%", minWidth: "110px" }}>Status</Th>
              </tr>
            </TableHead>
            <tbody>
              {patients.map((patient, index) => {
                const relevantTests = (patient.testdetails || []).filter(
                  (test) => {
                    const testStatus = getTestStatus(test);
                    if (testStatus === "Dispatched") return false;
                    if (
                      departmentFilter !== "all" &&
                      test.department !== departmentFilter
                    ) {
                      return false;
                    }
                    if (activeTab === "technician") {
                      if (statusFilter === "technician") {
                        return testStatus === "Waiting for Technician's Approval";
                      }
                      if (statusFilter === "rerun") {
                        return testStatus === "Rerun Initiated";
                      }
                      return (
                        testStatus === "Waiting for Technician's Approval" ||
                        testStatus === "Rerun Initiated"
                      );
                    } else if (activeTab === "doctor") {
                      return testStatus === "Waiting for Doctor's Approval";
                    } else if (activeTab === "dispatch") {
                      return (
                        testStatus === "Approved" ||
                        testStatus === "Waiting for Dispatch"
                      );
                    }
                    return false;
                  },
                );

                const groupedTests = groupTestsByDepartment(relevantTests);

                return (
                  <Tr key={index}>
                    <Td>
                      <PatientInfo>
                        <Calendar size={14} />
                        {patient.date
                          ? format(new Date(patient.date), "MMM dd, yyyy")
                          : patient.created_date
                            ? format(
                                new Date(patient.created_date),
                                "MMM dd, yyyy",
                              )
                            : "N/A"}
                      </PatientInfo>
                    </Td>
                    <Td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.2rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.85rem" }}>
                            {patient.patientname || "Unknown Patient"}
                          </span>
                          {(patient.age || patient.gender) && (
                            <span style={{ fontSize: "0.72rem", background: "#f1f5f9", padding: "0.08rem 0.35rem", borderRadius: "4px", color: "#475569", fontWeight: 600 }}>
                              {patient.age ? `${patient.age}Y` : ""} {patient.gender ? `• ${patient.gender}` : ""}
                            </span>
                          )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap", fontSize: "0.78rem" }}>
                          <span style={{ color: "#64748b" }}>
                            ID: <strong style={{ color: "#334155" }}>{patient.patient_id || "N/A"}</strong>
                          </span>
                          {patient.barcode && (
                            <span style={{ fontFamily: "monospace", color: "#2563eb", background: "#eff6ff", border: "1px solid #bfdbfe", padding: "0.05rem 0.35rem", borderRadius: "4px", fontWeight: 700 }}>
                              {patient.barcode}
                            </span>
                          )}
                        </div>

                        {(patient.ref_doctor || patient.phone) && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap", fontSize: "0.74rem", color: "#64748b" }}>
                            {patient.ref_doctor && <span>Ref: <strong style={{ color: "#334155" }}>{patient.ref_doctor}</strong></span>}
                            {patient.phone && <span>Ph: <span style={{ color: "#334155" }}>{patient.phone}</span></span>}
                          </div>
                        )}

                        {(patient.barcode_by || patient.barcode_date) && (
                          <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                            {patient.barcode_by ? `B/B: ${patient.barcode_by}` : ""}
                            {patient.barcode_date ? ` (${format(new Date(new Date(patient.barcode_date).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })), "MMM dd, hh:mm a")})` : ""}
                          </div>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <StatusBadge status={patient.opiptype}>
                        {patient.opiptype || "N/A"}
                      </StatusBadge>
                    </Td>
                    <Td>
                      <PatientInfo>
                        {patient.location_id || "Shanmuga Reference Lab"}
                      </PatientInfo>
                    </Td>

                    <Td>
                      <PriorityCell>
                        {patient.is_emergency ? (
                          <EmergencyBadge emergency>
                            <AlertCircle size={12} />
                            Emergency
                          </EmergencyBadge>
                        ) : (
                          <EmergencyBadge normal>
                            <CheckCircle size={12} />
                            Normal
                          </EmergencyBadge>
                        )}
                        
                      </PriorityCell>
                    </Td>

                    <Td style={{ width: "41%", minWidth: "420px" }}>
                      {Object.entries(groupedTests).map(
                        ([department, tests]) => (
                          <DepartmentGroup key={department}>
                            <DepartmentHeader>
                              <Stethoscope size={14} />
                              {department}
                            </DepartmentHeader>
                            <TestList>
                              {tests.map((test, idx) => {
                                const testStatus = getTestStatus(test);
                                const tatDisplay = formatTATDisplay(test, patient);
                                const liveSecondsLeft =
                                  calculateLiveSecondsLeft(test, patient);
                                const isClickable =
                                  testStatus ===
                                    "Waiting for Technician's Approval" ||
                                  testStatus === "Rerun Initiated";
                                return (
                                  <TestButton
                                    key={idx}
                                    disabled={!isClickable}
                                    onClick={
                                      isClickable
                                        ? () => {
                                            handlePatientClick(
                                              patient.patient_id,
                                              patient.patientname,
                                              patient.age,
                                              patient.gender,
                                              patient.barcode,
                                              patient.location_id,
                                              test.test_id,
                                              test.testname,
                                              patient.date,
                                              patient.created_date,
                                              patient.phone,
                                              patient.ref_doctor,
                                              patient.barcode_by,
                                              patient.barcode_date,
                                            );
                                          }
                                        : undefined
                                    }
                                    title={
                                      isClickable
                                        ? testStatus ===
                                          "Waiting for Technician's Approval"
                                          ? "Enter Test Values"
                                          : "Rerun Test"
                                        : testStatus === "Approved"
                                          ? "Doctor approval completed / Waiting for Dispatch"
                                          : "Technician approval completed / Waiting for Doctor's Approval"
                                    }
                                  >
                                    <TestNameRow>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "0.5rem",
                                          flex: 1,
                                          flexWrap: "wrap",
                                        }}
                                      >
                                        <span>
                                          {test.test_id} - {test.testname}
                                        </span>
                                        {tatDisplay && (
                                          <TATIndicator
                                            secondsLeft={liveSecondsLeft}
                                            isRerun={Boolean(
                                              test.rerun || tatDisplay.isRerun,
                                            )}
                                          >
                                            <div
                                              style={{ textAlign: "center" }}
                                            >
                                              <TATLabel>
                                                {tatDisplay.label}
                                              </TATLabel>
                                              <TATText>
                                                {tatDisplay.time}
                                              </TATText>
                                            </div>
                                          </TATIndicator>
                                        )}
                                      </div>
                                      {isClickable && <ChevronRight size={16} />}
                                    </TestNameRow>
                                    <UserInfoRow>
                                      {test.collectd_by && (
                                        <UserBadge>
                                          <Users size={10} />
                                          C/B: {test.collectd_by}
                                        </UserBadge>
                                      )}
                                      {test.received_by && (
                                        <UserBadge>
                                          <Users size={10} />
                                          R/B: {test.received_by}
                                        </UserBadge>
                                      )}
                                      {test.verified_by && (
                                        <UserBadge>
                                          <Users size={10} />
                                          V/B: {test.verified_by}
                                        </UserBadge>
                                      )}
                                      {test.approve_by && (
                                        <UserBadge>
                                          <Users size={10} />
                                          A/B: {test.approve_by}
                                        </UserBadge>
                                      )}
                                      {test.rerun_by && (
                                        <UserBadge>
                                          <Users size={10} />
                                          RR/B: {test.rerun_by}
                                        </UserBadge>
                                      )}
                                    </UserInfoRow>
                                  </TestButton>
                                );
                              })}
                            </TestList>
                          </DepartmentGroup>
                        ),
                      )}
                    </Td>
                    <Td style={{ width: "10%", minWidth: "110px" }}>
                      {Object.entries(groupedTests).map(
                        ([department, tests]) => (
                          <DepartmentGroup key={department}>
                            <TestList>
                              {tests.map((test, idx) => {
                                const testStatus = getTestStatus(test);
                                return (
                                  <StatusBadge key={idx} status={testStatus}>
                                    {getStatusIcon(testStatus)}
                                    {testStatus}
                                  </StatusBadge>
                                );
                              })}
                            </TestList>
                          </DepartmentGroup>
                        ),
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrapper>
        <div
          style={{
            padding: "0.75rem 1.25rem",
            textAlign: "right",
            color: theme.colors.textLight,
            fontSize: "0.85rem",
          }}
        >
          Showing {patients.length} {patients.length === 1 ? "entry" : "entries"}
        </div>
      </>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <CardContainer>
          {/* ── Sleek Executive Header & Tabs ── */}
          <TopBar>
            <HeaderLeft>
              <Title>
                <FlaskConical size={20} color="#a777e3" />
                Pathology Specimen Management
              </Title>
              <Subtitle>
                Technician Testing • Doctor Authorization • Dispatch
              </Subtitle>
            </HeaderLeft>

            <TabsContainer>
              <TabButton
                type="button"
                active={activeTab === "technician"}
                onClick={() => handleTabSwitch("technician")}
              >
                <FlaskConical size={15} />
                Technicians Pending
                <TabBadge active={activeTab === "technician"}>
                  {techCount}
                </TabBadge>
              </TabButton>
              <TabButton
                type="button"
                active={activeTab === "doctor"}
                onClick={() => handleTabSwitch("doctor")}
              >
                <UserCheck size={15} />
                Doctors Pending
                <TabBadge active={activeTab === "doctor"}>
                  {docCount}
                </TabBadge>
              </TabButton>
              <TabButton
                type="button"
                active={activeTab === "dispatch"}
                onClick={() => handleTabSwitch("dispatch")}
              >
                <Send size={15} />
                Dispatch Pending
                <TabBadge active={activeTab === "dispatch"}>
                  {dispatchCount}
                </TabBadge>
              </TabButton>
            </TabsContainer>
          </TopBar>

          {/* ── Unified Compact Filter Toolbar ── */}
          <Controls>
            <DateRangeWrapper>
              <DatePickerWrapper>
                <Calendar size={13} color="#64748b" />
                <label>From:</label>
                <DatePicker
                  ref={fromDateRef}
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="From date"
                  selectsStart
                  startDate={fromDate}
                  endDate={toDate}
                  maxDate={toDate}
                />
              </DatePickerWrapper>
              <DateRangeLabel>to</DateRangeLabel>
              <DatePickerWrapper>
                <CalendarDays size={13} color="#64748b" />
                <label>To:</label>
                <DatePicker
                  ref={toDateRef}
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="To date"
                  selectsEnd
                  startDate={fromDate}
                  endDate={toDate}
                  minDate={fromDate}
                />
              </DatePickerWrapper>
            </DateRangeWrapper>

            <BarcodeSearchWrapper>
              <SearchWrapper>
                <SearchIcon>
                  <Search size={14} />
                </SearchIcon>
                <SearchInput
                  type="text"
                  placeholder="Barcode, Name or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchWrapper>
              <StepButton
                type="button"
                title="Decrement barcode number"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  fromDateRef.current?.setOpen(false);
                  toDateRef.current?.setOpen(false);
                  handleBarcodeStep(-1);
                }}
              >
                −
              </StepButton>
              <StepButton
                type="button"
                title="Increment barcode number"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  fromDateRef.current?.setOpen(false);
                  toDateRef.current?.setOpen(false);
                  handleBarcodeStep(1);
                }}
              >
                +
              </StepButton>
            </BarcodeSearchWrapper>

            <FilterSelect
              value={fromFilter}
              onChange={(e) => setFromFilter(e.target.value)}
              style={{ flex: "1 1 125px", maxWidth: "150px" }}
            >
              <option value="all">All Locations</option>
              {getUniqueLocations().map((location, idx) => (
                <option key={idx} value={location}>
                  {location}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              value={opipFilter}
              onChange={(e) => setOpipFilter(e.target.value)}
              style={{ flex: "0 1 80px", minWidth: "75px" }}
            >
              <option value="all">All Type</option>
              <option value="OP">OP</option>
              <option value="IP">IP</option>
            </FilterSelect>

            <FilterSelect
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={{ flex: "1 1 130px", maxWidth: "155px" }}
            >
              <option value="all">All Departments</option>
              {getAllDepartments().map((dept, idx) => (
                <option key={idx} value={dept}>
                  {dept}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ flex: "1 1 130px", maxWidth: "155px" }}
            >
              {activeTab === "technician" ? (
                <>
                  <option value="all">All Status</option>
                  <option value="technician">Waiting for Tech</option>
                  <option value="rerun">Rerun Initiated</option>
                </>
              ) : activeTab === "doctor" ? (
                <option value="all">All Status (Waiting Doctor)</option>
              ) : (
                <option value="all">All Status (Waiting Dispatch)</option>
              )}
            </FilterSelect>

            <FilterSelect
              value={emergencyFilter}
              onChange={(e) => setEmergencyFilter(e.target.value)}
              style={{ flex: "0 1 100px", minWidth: "95px" }}
            >
              <option value="all">All Priority</option>
              <option value="emergency">Emergency</option>
              <option value="normal">Normal</option>
            </FilterSelect>

            <ClearButton
              type="button"
              onClick={handleClearFilters}
              title="Clear all filters and reset to today"
            >
              <RotateCcw size={14} />
              Clear Filters
            </ClearButton>
          </Controls>

          {/* ── TABLE 1: Selected Date Pending Data ── */}
          <TableSection>
            <SectionHeader>
              <SectionTitleGroup>
                <SectionTitle>
                  <Calendar size={15} />
                  {activeTab === "technician"
                    ? "Technicians Pending - Selected Date"
                    : activeTab === "doctor"
                      ? "Doctors Pending - Selected Date"
                      : "Dispatch Pending - Selected Date"}
                </SectionTitle>
                <SectionSubtitle>
                  ({format(fromDate, "MMM dd, yyyy")} to{" "}
                  {format(toDate, "MMM dd, yyyy")})
                </SectionSubtitle>
              </SectionTitleGroup>
              <SectionBadge>
                {currentSelectedPatients.length} Patients
              </SectionBadge>
            </SectionHeader>

            {renderPatientTable(
              currentSelectedPatients,
              currentSelectedLoading,
              currentSelectedError,
              `No ${
                activeTab === "technician"
                  ? "technician"
                  : activeTab === "doctor"
                    ? "doctor"
                    : "dispatch"
              } pending tests found for the selected date range.`,
              false,
            )}
          </TableSection>

          {/* ── TABLE 2: All Days Pending Backlog ── */}
          <TableSection>
            <SectionHeader backlog>
              <SectionTitleGroup>
                <SectionTitle backlog>
                  <Clock size={15} />
                  {activeTab === "technician"
                    ? "Waiting for Technician's Approval - All Days Backlog"
                    : activeTab === "doctor"
                      ? "Waiting for Doctor's Approval - All Days Backlog"
                      : "Waiting for Dispatch - All Days Backlog"}
                </SectionTitle>
                <SectionSubtitle>
                  (Pending requests from previous days / other dates)
                </SectionSubtitle>
              </SectionTitleGroup>
              <SectionBadge backlog>
                {currentAllDaysPatients.length} Backlog Patients
              </SectionBadge>
            </SectionHeader>

            {renderPatientTable(
              currentAllDaysPatients,
              currentAllDaysLoading,
              currentAllDaysError,
              `No pending backlog tests found across all days.`,
              true,
            )}
          </TableSection>
        </CardContainer>
      </Container>
    </ThemeProvider>
  );
};

export default PathologyPatientDetails;
