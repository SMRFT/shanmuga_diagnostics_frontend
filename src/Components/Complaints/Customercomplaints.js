import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes } from "styled-components";
import apiRequest from "../Auth/apiRequest";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ISSUE_TYPE_OPTIONS,
  OTHER_ISSUE_VALUE,
  COMPLAINT_STATUS,
} from "../Constantdata/Customercomplaintconstants";
import {
  FaHeadset,
  FaPlus,
  FaCalendarAlt,
  FaFileCsv,
  FaFilePdf,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaHospital,
  FaUser,
  FaCheckDouble,
  FaExclamationCircle,
} from "react-icons/fa";

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

// "allowed-actions" comes from the decoded JWT payload that index.js stores
// under "user_payload" at login (same source getUserRole() there reads).
const getAllowedActions = () => {
  try {
    const payload = JSON.parse(localStorage.getItem("user_payload") || "{}");
    return Array.isArray(payload["allowed-actions"]) ? payload["allowed-actions"] : [];
  } catch {
    return [];
  }
};

// "aud" in the decoded JWT payload (same "user_payload" localStorage key
// getAllowedActions() reads above) is the logged-in lab's own labcode —
// used to auto-fill labcode for SD-R-CL instead of showing the picker.
const getPayloadLabCode = () => {
  try {
    const payload = JSON.parse(localStorage.getItem("user_payload") || "{}");
    return payload?.aud || "";
  } catch {
    return "";
  }
};

// Local YYYY-MM-DD for today, used as the default From/To date.
const getTodayDate = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// Pulls a human-readable message out of a failed apiRequest call.
const getErrorMessage = (err, fallback) => {
  const data = err?.response?.data ?? err?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data?.error) return data.error;
  if (data?.message) return data.message;
  if (err?.message) return err.message;
  return fallback;
};

// Whole days between created_date and now — used for the Ageing column so
// a still-pending complaint shows how long it's been sitting.
const getAgeingDays = (createdDate) => {
  if (!createdDate) return null;
  const created = new Date(createdDate);
  if (Number.isNaN(created.getTime())) return null;
  const diffMs = Date.now() - created.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
};

// ── Styled components ──────────────────────────────────────────────────

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 24px 20px;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #f5f7ff 0%, #ede9fe 100%);
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.08);
  border-radius: 20px;
  padding: 28px;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 18px 14px;
    border-radius: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  background: linear-gradient(135deg, #f093fb, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 640px) {
    font-size: 22px;
  }
`;

const Subtitle = styled.span`
  color: #64748b;
  font-size: 13px;
  font-weight: 400;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  padding: 11px 22px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.35);
  transition: all 0.25s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.45);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const ControlsSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 18px;
  margin-bottom: 22px;
  padding: 18px 20px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 540px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FilterLabel = styled.label`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DateInput = styled.input`
  padding: 9px 13px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13.5px;
  color: #1e293b;
  background: #fff;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const StatusFilterSelect = styled.select`
  min-width: 140px;
  padding: 9px 13px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13.5px;
  color: #1e293b;
  background: #fff;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const StatsCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const StatBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 12px;
  background: ${(props) =>
    props.$type === "pending"
      ? "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.15))"
      : props.$type === "completed"
      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.15))"
      : "linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.12))"};
  border: 1px solid
    ${(props) =>
      props.$type === "pending"
        ? "rgba(245, 158, 11, 0.3)"
        : props.$type === "completed"
        ? "rgba(16, 185, 129, 0.3)"
        : "rgba(102, 126, 234, 0.25)"};
  color: ${(props) =>
    props.$type === "pending"
      ? "#b45309"
      : props.$type === "completed"
      ? "#047857"
      : "#4338ca"};
  font-size: 13px;
  font-weight: 600;

  span.count {
    font-size: 16px;
    font-weight: 700;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

const ExportGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ExportCsvBtn = styled.button`
  background: #ecfdf5;
  color: #059669;
  border: 1.5px solid #a7f3d0;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #059669;
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ExportPdfBtn = styled.button`
  background: #fef2f2;
  color: #dc2626;
  border: 1.5px solid #fecaca;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #dc2626;
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EntryCountBadge = styled.span`
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  background: #fff;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f8fafc;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 900px;
  font-size: 13.5px;
`;

const Th = styled.th`
  text-align: left;
  padding: 14px 16px;
  background: #f8fafc;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Td = styled.td`
  padding: 14px 16px;
  font-size: 13.5px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  color: #334155;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  color: ${(props) =>
    props.$status === COMPLAINT_STATUS.COMPLETED ? "#047857" : "#b45309"};
  background: ${(props) =>
    props.$status === COMPLAINT_STATUS.COMPLETED ? "#ecfdf5" : "#fffbeb"};
  border: 1px solid
    ${(props) =>
      props.$status === COMPLAINT_STATUS.COMPLETED ? "#a7f3d0" : "#fde68a"};
`;

const AgeingBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => {
    if (props.$days === null) return "#64748b";
    if (props.$days <= 2) return "#047857";
    if (props.$days <= 5) return "#b45309";
    return "#b91c1c";
  }};
  background: ${(props) => {
    if (props.$days === null) return "#f1f5f9";
    if (props.$days <= 2) return "#ecfdf5";
    if (props.$days <= 5) return "#fffbeb";
    return "#fef2f2";
  }};
  border: 1px solid
    ${(props) => {
      if (props.$days === null) return "#e2e8f0";
      if (props.$days <= 2) return "#a7f3d0";
      if (props.$days <= 5) return "#fde68a";
      return "#fecaca";
    }};
`;

const CompleteBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 240px;
`;

const CompleteInput = styled.textarea`
  padding: 8px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  resize: vertical;
  min-height: 50px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
  }
`;

const CompleteButton = styled.button`
  align-self: flex-start;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CompleteCancelButton = styled.button`
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

const CompleteErrorText = styled.div`
  color: #ef4444;
  font-size: 12px;
  font-weight: 500;
`;

const EmptyState = styled.div`
  padding: 48px 20px;
  text-align: center;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

// ── Modal Styled Components ───────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 10000;

  @media (max-width: 480px) {
    padding: 0;
    align-items: flex-end;
  }
`;

const ModalContent = styled.div`
  position: relative;
  background: #fff;
  border-radius: 20px;
  padding: 26px;
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  font-family: 'Poppins', sans-serif;

  @media (max-width: 480px) {
    padding: 22px 18px calc(18px + env(safe-area-inset-bottom, 0px));
    border-radius: 20px 20px 0 0;
    max-height: 92vh;
  }
`;

const CloseIconButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

const ModalTitle = styled.h3`
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  background: #fff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  min-height: 85px;
  resize: vertical;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const TextInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const LabSearchWrapper = styled.div`
  position: relative;
`;

const LabDropdownList = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  z-index: 20;
`;

const LabDropdownItem = styled.div`
  padding: 10px 14px;
  font-size: 13.5px;
  color: #1e293b;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #f5f7ff;
    color: #4338ca;
  }
`;

const LabDropdownEmpty = styled.div`
  padding: 10px 14px;
  font-size: 13px;
  color: #94a3b8;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: #334155;
  cursor: pointer;
  user-select: none;

  input[type="checkbox"] {
    accent-color: #667eea;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

const CancelButton = styled.button`
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #1e293b;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 16px;
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.25s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 18px;
  }
`;

// ── Toasts ─────────────────────────────────────────────────────────────

const toastSlideIn = keyframes`
  from {
    transform: translateY(-15px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 99999;

  @media (max-width: 480px) {
    left: 14px;
    right: 14px;
    top: 14px;
  }
`;

const ToastItem = styled.div`
  min-width: 240px;
  max-width: 380px;
  padding: 12px 18px;
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
  background: ${(props) =>
    props.$type === "error"
      ? "linear-gradient(135deg, #ef4444, #dc2626)"
      : "linear-gradient(135deg, #10b981, #059669)"};
  animation: ${toastSlideIn} 0.25s ease-out;
`;

// ── Component ──────────────────────────────────────────────────────────

const initialFormData = {
  labcode: "",
  patientId: "",
  issuetype: [],
  otherIssueText: "",
  comments: "",
  assignedto: "",
};

const CustomerComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const [clinicalNames, setClinicalNames] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [labSearchTerm, setLabSearchTerm] = useState("");
  const [labDropdownOpen, setLabDropdownOpen] = useState(false);

  const [completingId, setCompletingId] = useState(null);
  const [completionText, setCompletionText] = useState("");
  const [completeError, setCompleteError] = useState("");
  const [completing, setCompleting] = useState(false);

  const [toasts, setToasts] = useState([]);

  const isClinicalReports = useMemo(
    () => getAllowedActions().includes("SD-R-CL"),
    []
  );

  const clinicalReportsLabCode = useMemo(
    () => (isClinicalReports ? getPayloadLabCode() : ""),
    [isClinicalReports]
  );

  const showToast = useCallback((message, type = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());
  const [statusFilter, setStatusFilter] = useState("all");

  const loadComplaints = useCallback(async (from, to, statusValue) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (from) params.append("from_date", from);
      if (to) params.append("to_date", to);
      if (statusValue && statusValue !== "all") params.append("status", statusValue);
      const qs = params.toString();
      const res = await apiRequest(
        `${Labbaseurl}customer_complaints/${qs ? `?${qs}` : ""}`,
        "GET"
      );
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.results)
            ? res.results
            : [];
      const sorted = [...list].sort((a, b) => a.complaint_id - b.complaint_id);
      setComplaints(sorted);
    } catch (err) {
      console.error("Failed to load customer complaints:", err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadClinicalNames = useCallback(async () => {
    try {
      const res = await apiRequest(`${Labbaseurl}get_all_clinicalnames/`, "GET");
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.results)
            ? res.results
            : [];
      setClinicalNames(list);
    } catch (err) {
      console.error("Failed to load clinical names:", err);
      setClinicalNames([]);
    }
  }, []);

  const loadEmployees = useCallback(async () => {
    try {
      const res = await apiRequest(`${Labbaseurl}get_b2b_employees/`, "GET");
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.results)
            ? res.results
            : [];
      setEmployees(list);
    } catch (err) {
      console.error("Failed to load employees:", err);
      setEmployees([]);
    }
  }, []);

  useEffect(() => {
    loadComplaints(fromDate, toDate, statusFilter);
  }, [loadComplaints, fromDate, toDate, statusFilter]);

  useEffect(() => {
    loadClinicalNames();
    loadEmployees();
  }, [loadClinicalNames, loadEmployees]);

  const labCodeToName = useMemo(() => {
    const map = {};
    clinicalNames.forEach((item) => {
      if (item?.referrerCode) {
        map[item.referrerCode] = item.clinicalname || item.referrerCode;
      }
    });
    return map;
  }, [clinicalNames]);

  const employeeIdToName = useMemo(() => {
    const map = {};
    employees.forEach((emp) => {
      if (emp?.employeeId) {
        map[emp.employeeId] = emp.employeeName || emp.employeeId;
      }
    });
    return map;
  }, [employees]);

  const filteredClinicalNames = useMemo(() => {
    const term = labSearchTerm.trim().toLowerCase();
    if (!term) return clinicalNames;
    return clinicalNames.filter((cn) => {
      const name = (cn.clinicalname || "").toLowerCase();
      const code = (cn.referrerCode || "").toLowerCase();
      return name.includes(term) || code.includes(term);
    });
  }, [clinicalNames, labSearchTerm]);

  const visibleComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (!isClinicalReports) return true;
      if (!clinicalReportsLabCode) return true;
      return String(c.labcode) === String(clinicalReportsLabCode);
    });
  }, [complaints, isClinicalReports, clinicalReportsLabCode]);

  const pendingCount = useMemo(
    () => visibleComplaints.filter((c) => c.status === COMPLAINT_STATUS.PENDING).length,
    [visibleComplaints]
  );

  const completedCount = useMemo(
    () => visibleComplaints.filter((c) => c.status === COMPLAINT_STATUS.COMPLETED).length,
    [visibleComplaints]
  );

  const openModal = () => {
    setFormData({
      ...initialFormData,
      labcode: isClinicalReports ? clinicalReportsLabCode : "",
    });
    setLabSearchTerm("");
    setLabDropdownOpen(false);
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(initialFormData);
    setLabSearchTerm("");
    setLabDropdownOpen(false);
    setErrors({});
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleIssueTypeToggle = (value) => {
    setFormData((prev) => {
      const exists = prev.issuetype.includes(value);
      const next = exists
        ? prev.issuetype.filter((v) => v !== value)
        : [...prev.issuetype, value];
      return {
        ...prev,
        issuetype: next,
        otherIssueText: exists && value === OTHER_ISSUE_VALUE ? "" : prev.otherIssueText,
      };
    });
    if (errors.issuetype) {
      setErrors((prev) => ({ ...prev, issuetype: "" }));
    }
  };

  const handleLabSearchChange = (e) => {
    const text = e.target.value;
    setLabSearchTerm(text);
    setLabDropdownOpen(true);
    setFormData((prev) => ({ ...prev, labcode: "" }));
    if (errors.labcode) {
      setErrors((prev) => ({ ...prev, labcode: "" }));
    }
  };

  const handleSelectLab = (cn) => {
    setFormData((prev) => ({ ...prev, labcode: cn.referrerCode }));
    setLabSearchTerm(cn.clinicalname || cn.referrerCode);
    setLabDropdownOpen(false);
    if (errors.labcode) {
      setErrors((prev) => ({ ...prev, labcode: "" }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!isClinicalReports && !formData.labcode) {
      errs.labcode = "Please select a lab from the list";
    }
    if (formData.issuetype.length === 0) {
      errs.issuetype = "Select at least one issue type";
    }
    if (
      formData.issuetype.includes(OTHER_ISSUE_VALUE) &&
      !formData.otherIssueText.trim()
    ) {
      errs.otherIssueText = "Please describe the 'Other' issue";
    }
    if (!formData.comments.trim()) {
      errs.comments = "Comments are required";
    }
    if (!isClinicalReports && !formData.assignedto) {
      errs.assignedto = "Please assign this complaint to an employee";
    }
    return errs;
  };

  const handleSave = async () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      labcode: isClinicalReports ? clinicalReportsLabCode : formData.labcode,
      patientId: formData.patientId.trim() || undefined,
      issuetype: formData.issuetype,
      otherIssueText: formData.issuetype.includes(OTHER_ISSUE_VALUE)
        ? formData.otherIssueText.trim()
        : undefined,
      comments: formData.comments.trim(),
      ...(isClinicalReports ? {} : { assignedto: formData.assignedto }),
    };

    setSaving(true);
    try {
      const res = await apiRequest(
        `${Labbaseurl}customer_complaints/`,
        "POST",
        payload
      );
      const message =
        res?.message || res?.data?.message || "Complaint registered successfully.";
      showToast(message, "success");
      closeModal();
      loadComplaints(fromDate, toDate, statusFilter);
    } catch (err) {
      console.error("Failed to save complaint:", err);
      const message = getErrorMessage(
        err,
        "Failed to register complaint. Please try again."
      );
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const openCompleteBox = (id) => {
    setCompletingId(id);
    setCompletionText("");
    setCompleteError("");
  };

  const cancelCompleteBox = () => {
    setCompletingId(null);
    setCompletionText("");
    setCompleteError("");
  };

  const submitCompletion = async (complaintId) => {
    const trimmed = completionText.trim();
    if (!trimmed) {
      setCompleteError("Completion comments cannot be empty.");
      return;
    }

    setCompleting(true);
    setCompleteError("");
    try {
      const res = await apiRequest(
        `${Labbaseurl}customer_complaints/${complaintId}/complete/`,
        "PATCH",
        { completion_comments: trimmed }
      );
      const message =
        res?.message || res?.data?.message || "Complaint marked as completed.";
      showToast(message, "success");
      cancelCompleteBox();
      loadComplaints(fromDate, toDate, statusFilter);
    } catch (err) {
      console.error("Failed to complete complaint:", err);
      const message = getErrorMessage(
        err,
        "Failed to complete complaint. Please try again."
      );
      setCompleteError(message);
      showToast(message, "error");
    } finally {
      setCompleting(false);
    }
  };

  // ── Export (CSV / PDF) ───────────────────────────────────────────────

  const EXPORT_COLUMNS = [
    "ID",
    "Lab Name",
    "Patient ID",
    "Issue Type",
    "Comments",
    ...(isClinicalReports ? [] : ["Assigned To"]),
    "Status",
    ...(isClinicalReports ? [] : ["Ageing (Days)"]),
    "Completion Comments",
    "Created By",
  ];

  const buildExportRows = () =>
    visibleComplaints.map((row) => {
      const ageing =
        row.status === COMPLAINT_STATUS.PENDING
          ? getAgeingDays(row.created_date)
          : null;
      return [
        row.complaint_id,
        labCodeToName[row.labcode] || row.labcode || "",
        row.patient_id || "",
        row.issuetype || "",
        row.comments || "",
        ...(isClinicalReports ? [] : [row.assignedby_name || row.assigned_to_name || employeeIdToName[row.assignedby] || row.assignedby || ""]),
        row.status || "",
        ...(isClinicalReports ? [] : [ageing === null ? "" : ageing]),
        row.completion_comments || "",
        row.created_by_name || employeeIdToName[row.created_by] || row.created_by || "",
      ];
    });

  const getExportFilename = (extension) => {
    const fromStr = fromDate || "all";
    const toStr = toDate || "all";
    return `customer_complaints_${fromStr}_to_${toStr}.${extension}`;
  };

  const handleExportCSV = () => {
    if (visibleComplaints.length === 0) {
      showToast("No complaints to export.", "error");
      return;
    }

    const escapeCsvField = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      if (/[",\n\r]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = buildExportRows();
    const csvLines = [
      EXPORT_COLUMNS.map(escapeCsvField).join(","),
      ...rows.map((row) => row.map(escapeCsvField).join(",")),
    ];
    const csvContent = csvLines.join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = getExportFilename("csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("CSV exported.", "success");
  };

  const handleExportPDF = () => {
    if (visibleComplaints.length === 0) {
      showToast("No complaints to export.", "error");
      return;
    }

    try {
      const doc = new jsPDF({ orientation: "landscape" });
      const title = "Customer Complaints Report";
      const subtitle = `Date Range: ${fromDate} to ${toDate} | Status: ${statusFilter.toUpperCase()}`;

      doc.setFontSize(14);
      doc.text(title, 14, 15);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(subtitle, 14, 22);

      autoTable(doc, {
        startY: 26,
        head: [EXPORT_COLUMNS],
        body: buildExportRows(),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [102, 126, 234] },
      });

      doc.save(getExportFilename("pdf"));
      showToast("PDF exported.", "success");
    } catch (err) {
      console.error("Failed to export PDF:", err);
      showToast("Failed to generate PDF. Please try again.", "error");
    }
  };

  return (
    <PageContainer>
      <ContentCard>
        <Header>
          <TitleWrapper>
            <Title>
              <FaHeadset style={{ color: "#667eea" }} /> Customer Complaints
            </Title>
            <Subtitle>Manage, track and resolve customer feedback and service complaints</Subtitle>
          </TitleWrapper>
          <AddButton onClick={openModal}>
            <FaPlus size={13} /> Add Complaint
          </AddButton>
        </Header>

        <ControlsSection>
          <FilterGroup>
            <FilterField>
              <FilterLabel htmlFor="complaint-from-date">
                <FaCalendarAlt size={12} color="#667eea" /> From Date
              </FilterLabel>
              <DateInput
                id="complaint-from-date"
                type="date"
                value={fromDate}
                max={toDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </FilterField>
            <FilterField>
              <FilterLabel htmlFor="complaint-to-date">
                <FaCalendarAlt size={12} color="#667eea" /> To Date
              </FilterLabel>
              <DateInput
                id="complaint-to-date"
                type="date"
                value={toDate}
                min={fromDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </FilterField>
            <FilterField>
              <FilterLabel htmlFor="complaint-status-filter">Status</FilterLabel>
              <StatusFilterSelect
                id="complaint-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value={COMPLAINT_STATUS.PENDING}>Pending</option>
                <option value={COMPLAINT_STATUS.COMPLETED}>Completed</option>
              </StatusFilterSelect>
            </FilterField>
          </FilterGroup>

          <StatsCluster>
            <StatBadge $type="pending">
              <FaClock size={13} />
              <span>Pending:</span>
              <span className="count">{pendingCount}</span>
            </StatBadge>
            <StatBadge $type="completed">
              <FaCheckCircle size={13} />
              <span>Completed:</span>
              <span className="count">{completedCount}</span>
            </StatBadge>
          </StatsCluster>
        </ControlsSection>

        <ActionBar>
          <ExportGroup>
            <ExportCsvBtn type="button" onClick={handleExportCSV} disabled={loading}>
              <FaFileCsv size={14} /> Export CSV
            </ExportCsvBtn>
            <ExportPdfBtn type="button" onClick={handleExportPDF} disabled={loading}>
              <FaFilePdf size={14} /> Export PDF
            </ExportPdfBtn>
          </ExportGroup>
          <EntryCountBadge>
            Showing {visibleComplaints.length} {visibleComplaints.length === 1 ? "complaint" : "complaints"}
          </EntryCountBadge>
        </ActionBar>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Lab Name</Th>
                <Th>Patient ID</Th>
                <Th>Issue Type</Th>
                <Th>Comments</Th>
                {!isClinicalReports && <Th>Assigned To</Th>}
                <Th>Status</Th>
                <Th>Ageing (Days)</Th>
                <Th>Completion Comments</Th>
                <Th>Created By</Th>
              </tr>
            </thead>
            <tbody>
              {visibleComplaints.map((row) => (
                <tr key={row.complaint_id}>
                  <Td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                      <FaHospital size={12} color="#6366f1" />
                      {labCodeToName[row.labcode] || row.labcode || "—"}
                    </span>
                  </Td>
                  <Td>
                    {row.patient_id ? (
                      <span
                        style={{
                          background: "#eef2ff",
                          color: "#4f46e5",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontWeight: 600,
                          fontSize: "12px",
                        }}
                      >
                        {row.patient_id}
                      </span>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td>
                    <span style={{ fontWeight: 500, color: "#475569" }}>
                      {row.issuetype || "—"}
                    </span>
                  </Td>
                  <Td style={{ maxWidth: 220, whiteSpace: "normal" }}>
                    {row.comments || "—"}
                  </Td>
                  {!isClinicalReports && (
                    <Td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <FaUser size={11} color="#64748b" />
                        {row.assignedto_name ||
                          row.assigned_to_name ||
                          row.assignedby_name ||
                          employeeIdToName[row.assignedto] ||
                          employeeIdToName[row.assignedby] ||
                          row.assignedto ||
                          row.assignedby ||
                          "—"}
                      </span>
                    </Td>
                  )}
                  <Td>
                    <StatusBadge $status={row.status}>
                      {row.status === COMPLAINT_STATUS.COMPLETED ? (
                        <FaCheckCircle size={11} />
                      ) : (
                        <FaClock size={11} />
                      )}
                      {row.status || "—"}
                    </StatusBadge>
                  </Td>
                  <Td>
                    {row.status === COMPLAINT_STATUS.PENDING ? (
                      (() => {
                        const days = getAgeingDays(row.created_date);
                        return (
                          <AgeingBadge $days={days}>
                            <FaExclamationCircle size={10} />
                            {days === null ? "—" : `${days} ${days === 1 ? "day" : "days"}`}
                          </AgeingBadge>
                        );
                      })()
                    ) : (
                      <span style={{ color: "#94a3b8" }}>—</span>
                    )}
                  </Td>
                  <Td>
                    {row.status === COMPLAINT_STATUS.COMPLETED ? (
                      <span style={{ color: "#059669", fontWeight: 500 }}>
                        {row.completion_comments || "—"}
                      </span>
                    ) : isClinicalReports ? (
                      <span style={{ color: "#94a3b8" }}>—</span>
                    ) : completingId === row.complaint_id ? (
                      <CompleteBox>
                        <CompleteInput
                          placeholder="Enter completion comments..."
                          value={completionText}
                          onChange={(e) => setCompletionText(e.target.value)}
                        />
                        {completeError && (
                          <CompleteErrorText>{completeError}</CompleteErrorText>
                        )}
                        <div style={{ display: "flex", gap: "8px" }}>
                          <CompleteButton
                            onClick={() => submitCompletion(row.complaint_id)}
                            disabled={completing}
                          >
                            <FaCheckDouble size={11} />
                            {completing ? "Updating..." : "Update"}
                          </CompleteButton>
                          <CompleteCancelButton
                            onClick={cancelCompleteBox}
                            disabled={completing}
                          >
                            Cancel
                          </CompleteCancelButton>
                        </div>
                      </CompleteBox>
                    ) : (
                      <CompleteButton onClick={() => openCompleteBox(row.complaint_id)}>
                        <FaCheckDouble size={11} /> Complete with Comments
                      </CompleteButton>
                    )}
                  </Td>
                  <Td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 500 }}>
                      <FaUser size={11} color="#6366f1" />
                      {row.created_by_name || employeeIdToName[row.created_by] || row.created_by || "—"}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          {!loading && visibleComplaints.length === 0 && (
            <EmptyState>
              <FaHeadset size={44} style={{ color: "#cbd5e1", marginBottom: 12 }} />
              <div style={{ fontWeight: 600, fontSize: 16, color: "#475569" }}>
                No customer complaints found
              </div>
              <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
                Adjust your date or status filters, or add a new complaint.
              </div>
            </EmptyState>
          )}

          {loading && (
            <EmptyState>
              <div style={{ fontWeight: 600, color: "#667eea", fontSize: 15 }}>
                Loading customer complaints...
              </div>
            </EmptyState>
          )}
        </TableWrapper>
      </ContentCard>

      {showModal &&
        ReactDOM.createPortal(
          <Overlay onClick={closeModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseIconButton onClick={closeModal} aria-label="Close" title="Close">
                <FaTimes size={14} />
              </CloseIconButton>
              <ModalTitle>
                <FaHeadset size={18} style={{ color: "#667eea" }} />
                Feedback & Grievance
              </ModalTitle>

              {!isClinicalReports && (
                <FormGroup>
                  <Label htmlFor="complaint-labname">Lab Name</Label>
                  <LabSearchWrapper>
                    <TextInput
                      id="complaint-labname"
                      placeholder="Search and select a lab..."
                      autoComplete="off"
                      value={labSearchTerm}
                      onChange={handleLabSearchChange}
                      onFocus={() => setLabDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setLabDropdownOpen(false), 150)}
                    />
                    {labDropdownOpen && (
                      <LabDropdownList>
                        {filteredClinicalNames.length === 0 ? (
                          <LabDropdownEmpty>No labs found</LabDropdownEmpty>
                        ) : (
                          filteredClinicalNames.map((cn) => (
                            <LabDropdownItem
                              key={cn.referrerCode}
                              onMouseDown={() => handleSelectLab(cn)}
                            >
                              {cn.clinicalname}
                            </LabDropdownItem>
                          ))
                        )}
                      </LabDropdownList>
                    )}
                  </LabSearchWrapper>
                  {errors.labcode && <ErrorText>{errors.labcode}</ErrorText>}
                </FormGroup>
              )}

              <FormGroup>
                <Label htmlFor="complaint-patientid">Patient ID</Label>
                <TextInput
                  id="complaint-patientid"
                  placeholder="Optional patient ID"
                  value={formData.patientId}
                  onChange={handleChange("patientId")}
                />
              </FormGroup>

              <FormGroup>
                <Label>Issue Type</Label>
                <CheckboxGroup>
                  {ISSUE_TYPE_OPTIONS.map((opt) => (
                    <CheckboxLabel key={opt.value}>
                      <input
                        type="checkbox"
                        checked={formData.issuetype.includes(opt.value)}
                        onChange={() => handleIssueTypeToggle(opt.value)}
                      />
                      {opt.label}
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
                {formData.issuetype.includes(OTHER_ISSUE_VALUE) && (
                  <TextInput
                    style={{ marginTop: "10px" }}
                    placeholder="Please specify the issue"
                    value={formData.otherIssueText}
                    onChange={handleChange("otherIssueText")}
                  />
                )}
                {errors.issuetype && <ErrorText>{errors.issuetype}</ErrorText>}
                {errors.otherIssueText && (
                  <ErrorText>{errors.otherIssueText}</ErrorText>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="complaint-comments">Comments</Label>
                <TextArea
                  id="complaint-comments"
                  placeholder="Describe the complaint in detail..."
                  value={formData.comments}
                  onChange={handleChange("comments")}
                />
                {errors.comments && <ErrorText>{errors.comments}</ErrorText>}
              </FormGroup>

              {!isClinicalReports && (
                <FormGroup>
                  <Label htmlFor="complaint-assignedto">Assigned To</Label>
                  <Select
                    id="complaint-assignedto"
                    value={formData.assignedto || formData.assignedby || ""}
                    onChange={handleChange("assignedto")}
                  >
                    <option value="">Select employee</option>
                    {employees.map((emp, idx) => (
                      <option key={`${emp.employeeId}-${idx}`} value={emp.employeeId}>
                        {emp.employeeName}
                      </option>
                    ))}
                  </Select>
                  {(errors.assignedto || errors.assignedby) && (
                    <ErrorText>{errors.assignedto || errors.assignedby}</ErrorText>
                  )}
                </FormGroup>
              )}

              <ModalActions>
                <CancelButton onClick={closeModal}>Cancel</CancelButton>
                <SaveButton onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Complaint"}
                </SaveButton>
              </ModalActions>
            </ModalContent>
          </Overlay>,
          document.body
        )}

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
    </PageContainer>
  );
};

export default CustomerComplaints;