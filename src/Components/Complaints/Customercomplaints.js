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

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

const ACCENT = "#b673c9";
const ACCENT_DARK = "#895697";

// NOTE: swap this for however auth-user-id is actually sourced elsewhere in
// the app (e.g. an Auth context/helper) — this is a placeholder that reads
// the same key other screens in this codebase have used.


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

// Pulls a human-readable message out of a failed apiRequest call. Backend
// errors come back as { error: "..." } (see customer_complaints view) but
// this checks a few common shapes so it degrades gracefully either way.
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

const Container = styled.div`
  padding: 24px;

  @media (max-width: 480px) {
    padding: 14px;
  }
`;

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  min-height: 40px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h2`
  margin: 0;
  color: ${ACCENT_DARK};
  font-size: 22px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;

  @media (max-width: 480px) {
    position: static;
    transform: none;
    text-align: center;
    font-size: 19px;
  }
`;

const AddButton = styled.button`
  background: ${ACCENT};
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: ${ACCENT_DARK};
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 18px;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid #d5dede;
  border-radius: 8px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c3d0d0;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f2f7f7;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 14px;
  background: #f2f7f7;
  color: ${ACCENT_DARK};
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  border-bottom: 1px solid #d5dede;
  white-space: nowrap;

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 12px;
  }
`;

const Td = styled.td`
  padding: 12px 14px;
  font-size: 14px;
  border-bottom: 1px solid #eef2f2;
  vertical-align: top;

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 13px;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  color: #fff;
  background: ${(props) =>
    props.$status === COMPLAINT_STATUS.COMPLETED ? "#2e9e5b" : "#d99a1b"};
`;

const AgeingBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: ${(props) => {
    if (props.$days === null) return "#9aa5a5";
    if (props.$days <= 2) return "#2e9e5b";
    if (props.$days <= 5) return "#d99a1b";
    return "#d64545";
  }};
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #7a8a8a;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;
  padding: 14px 16px;
  background: #f7f5fc;
  border-radius: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
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
  letter-spacing: 0.03em;
`;

const DateInput = styled.input`
  padding: 8px 10px;
  border: 1px solid #d5dede;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background: #fff;

  &:focus {
    outline: none;
    border-color: ${ACCENT};
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 10px;
  }
`;

const StatusFilterSelect = styled.select`
  min-width: 140px;
  padding: 8px 10px;
  border: 1px solid #d5dede;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background: #fff;

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

const ExportButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-left: auto;

  @media (max-width: 480px) {
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
  transition: background 0.15s ease;

  &:hover {
    background: #f7edfa;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    flex: 1;
  }
`;

const CompleteBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 220px;
`;

const CompleteInput = styled.textarea`
  padding: 8px 10px;
  border: 1px solid #d5dede;
  border-radius: 6px;
  font-size: 13px;
  resize: vertical;
  min-height: 44px;

  &:focus {
    outline: none;
    border-color: ${ACCENT};
  }
`;

const CompleteButton = styled.button`
  align-self: flex-start;
  background: ${ACCENT_DARK};
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CompleteErrorText = styled.div`
  color: #d64545;
  font-size: 12px;
`;

// ── Modal ──────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;

  @media (max-width: 480px) {
    padding: 0;
    align-items: flex-end;
  }
`;

const ModalContent = styled.div`
  position: relative;
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 480px) {
    padding: 18px;
    border-radius: 12px 12px 0 0;
    max-height: 92vh;
  }
`;

const CloseIconButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: #eef2f2;
  color: ${ACCENT_DARK};
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #dfe8e8;
  }
`;

const ModalTitle = styled.h3`
  margin: 0 0 18px;
  color: ${ACCENT_DARK};
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: ${ACCENT_DARK};
  margin-bottom: 6px;
`;

const Select = styled.select`
  width: 100%;
  padding: 9px 10px;
  border: 1px solid #d5dede;
  border-radius: 6px;
  font-size: 14px;
  background: #fff;

  &:focus {
    outline: none;
    border-color: ${ACCENT};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 9px 10px;
  border: 1px solid #d5dede;
  border-radius: 6px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${ACCENT};
  }
`;

const TextInput = styled.input`
  width: 100%;
  padding: 9px 10px;
  border: 1px solid #d5dede;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${ACCENT};
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
  border: 1px solid #d5dede;
  border-radius: 6px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  z-index: 10;
`;

const LabDropdownItem = styled.div`
  padding: 9px 10px;
  font-size: 14px;
  color: #333;
  cursor: pointer;

  &:hover {
    background: #f7edfa;
  }
`;

const LabDropdownEmpty = styled.div`
  padding: 9px 10px;
  font-size: 13px;
  color: #7a8a8a;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
`;

const ErrorText = styled.div`
  color: #d64545;
  font-size: 12px;
  margin-top: 4px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

const CancelButton = styled.button`
  background: #eef2f2;
  color: ${ACCENT_DARK};
  border: 1px solid #d5dede;
  padding: 9px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 16px;
  }
`;

const SaveButton = styled.button`
  background: ${ACCENT};
  color: #fff;
  border: none;
  padding: 9px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

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
  z-index: 2000;

  @media (max-width: 480px) {
    left: 16px;
    right: 16px;
    top: 16px;
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
`;

// ── Component ──────────────────────────────────────────────────────────

const initialFormData = {
  labcode: "",
  patientId: "",
  issuetype: [], // array of selected checkbox values
  otherIssueText: "",
  comments: "",
  assignedby: "",
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

  // Lab Name is a searchable combobox rather than a plain <select> — these
  // track what's typed and whether the filtered dropdown is showing.
  const [labSearchTerm, setLabSearchTerm] = useState("");
  const [labDropdownOpen, setLabDropdownOpen] = useState(false);

  // Per-row "complete with comments" state, keyed by complaint_id
  const [completingId, setCompletingId] = useState(null);
  const [completionText, setCompletionText] = useState("");
  const [completeError, setCompleteError] = useState("");
  const [completing, setCompleting] = useState(false);

  // Toasts — shown for save/update success and for backend error messages.
  const [toasts, setToasts] = useState([]);

  // SD-R-CL (Clinical Reports) users don't get to pick who a complaint is
  // assigned to — the Assigned By combobox is hidden for that role.
  const isClinicalReports = useMemo(
    () => getAllowedActions().includes("SD-R-CL"),
    []
  );

  // SD-R-CL always files complaints against their own lab — labcode comes
  // straight from the JWT's aud claim, never from the Lab Name picker.
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

  // Date range filter — defaults to "today" for both ends so the table
  // initially shows just today's complaints.
  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());

  // Status filter — All / Pending / Completed. "all" means no status param
  // is sent, so the backend returns everything in the date range.
  const [statusFilter, setStatusFilter] = useState("all");

  // ── Loaders ─────────────────────────────────────────────────────────

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
      // Defensive sort — the backend already orders by complaint_id
      // ascending, but sorting again here keeps the table correct even if
      // that ever changes upstream.
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
      const res = await apiRequest(`${Labbaseurl}clinical_name/`, "GET");
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
      const res = await apiRequest(`${Labbaseurl}get_b2b_lab_employees/`, "GET");
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];
      setEmployees(list);
    } catch (err) {
      console.error("Failed to load B2B lab employees:", err);
      showToast(
        getErrorMessage(err, "Failed to load employees for Assigned By."),
        "error"
      );
      setEmployees([]);
    }
  }, [showToast]);

  useEffect(() => {
    loadClinicalNames();
    loadEmployees();
  }, [loadClinicalNames, loadEmployees]);

  useEffect(() => {
    loadComplaints(fromDate, toDate, statusFilter);
  }, [fromDate, toDate, statusFilter, loadComplaints]);

  // Lab is stored as referrerCode (labcode) but always displayed as
  // clinicalname — this maps one to the other for the table.
  const labCodeToName = useMemo(() => {
    const map = {};
    clinicalNames.forEach((cn) => {
      map[cn.referrerCode] = cn.clinicalname;
    });
    return map;
  }, [clinicalNames]);

  // Assigned By is stored as employeeId but always displayed as
  // employeeName — same mapping pattern as labCodeToName above.
  const employeeIdToName = useMemo(() => {
    const map = {};
    employees.forEach((emp) => {
      map[emp.employeeId] = emp.employeeName;
    });
    return map;
  }, [employees]);

  // Row scoping (e.g. SD-R-CL seeing only their own complaints, or
  // SD-R-GM/SD-R-MAVP seeing everything) is done by the backend based on
  // auth-user-id — the table just renders whatever it gets back.
  const visibleComplaints = complaints;

  // ── Add-complaint modal ─────────────────────────────────────────────

  const openModal = () => {
    setFormData(
      isClinicalReports
        ? { ...initialFormData, labcode: clinicalReportsLabCode }
        : initialFormData
    );
    setErrors({});
    setLabSearchTerm("");
    setLabDropdownOpen(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Filters the lab dropdown as the user types. Matches on clinicalname,
  // case-insensitive, substring match.
  const filteredClinicalNames = useMemo(() => {
    const term = labSearchTerm.trim().toLowerCase();
    if (!term) return clinicalNames;
    return clinicalNames.filter((cn) =>
      (cn.clinicalname || "").toLowerCase().includes(term)
    );
  }, [clinicalNames, labSearchTerm]);

  const handleLabSearchChange = (e) => {
    const value = e.target.value;
    setLabSearchTerm(value);
    setLabDropdownOpen(true);
    // Typing invalidates whatever was previously selected until the user
    // picks a fresh match from the dropdown — keeps labcode honest.
    setFormData((prev) => ({ ...prev, labcode: "" }));
  };

  const handleSelectLab = (cn) => {
    setFormData((prev) => ({ ...prev, labcode: cn.referrerCode }));
    setLabSearchTerm(cn.clinicalname);
    setLabDropdownOpen(false);
  };

  const handleIssueTypeToggle = (value) => {
    setFormData((prev) => {
      const isSelected = prev.issuetype.includes(value);
      const nextIssueType = isSelected
        ? prev.issuetype.filter((v) => v !== value)
        : [...prev.issuetype, value];

      // Clear the free-text "other" reason if "Other" gets unchecked.
      const nextOtherText = nextIssueType.includes(OTHER_ISSUE_VALUE)
        ? prev.otherIssueText
        : "";

      return { ...prev, issuetype: nextIssueType, otherIssueText: nextOtherText };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (isClinicalReports) {
      if (!clinicalReportsLabCode)
        newErrors.labcode = "Lab code missing from session — please re-login";
    } else if (!formData.labcode) {
      newErrors.labcode = "Lab name is required";
    }
    if (formData.issuetype.length === 0)
      newErrors.issuetype = "Select at least one issue type";
    if (
      formData.issuetype.includes(OTHER_ISSUE_VALUE) &&
      !formData.otherIssueText.trim()
    ) {
      newErrors.otherIssueText = "Please describe the issue";
    }
    if (!formData.comments.trim()) newErrors.comments = "Comments are required";
    if (!isClinicalReports && !formData.assignedby)
      newErrors.assignedby = "Assigned by is required";

    setErrors(newErrors);
    return newErrors;
  };

  // Field order used to pick which single message to toast when several
  // fields are missing at once — top-to-bottom as they appear in the form.
  const FIELD_ORDER = ["labcode", "issuetype", "otherIssueText", "comments", "assignedby"];

  const handleSave = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      const firstField = FIELD_ORDER.find((key) => newErrors[key]);
      showToast(newErrors[firstField], "error");
      return;
    }

    setSaving(true);
    try {
      // Build the stored issue-type string: selected labels, with "Other"
      // replaced by whatever the user actually typed.
      const issuetypeString = formData.issuetype
        .map((value) =>
          value === OTHER_ISSUE_VALUE ? formData.otherIssueText.trim() : value
        )
        .join(", ");

      const payload = {
       
        labcode: isClinicalReports ? clinicalReportsLabCode : formData.labcode,
        patient_id: formData.patientId.trim() || null,
        issuetype: issuetypeString,
        comments: formData.comments.trim(),
        assignedby: formData.assignedby,
      };

      await apiRequest(`${Labbaseurl}customer_complaints/`, "POST", payload);

      closeModal();
      loadComplaints(fromDate, toDate, statusFilter);
      showToast("Complaint saved successfully.", "success");
    } catch (err) {
      console.error("Failed to save customer complaint:", err);
      showToast(
        getErrorMessage(err, "Failed to save complaint. Please try again."),
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Complete-with-comments (per row) ────────────────────────────────

  const openCompleteBox = (complaintId) => {
    setCompletingId(complaintId);
    setCompletionText("");
    setCompleteError("");
  };

  const cancelCompleteBox = () => {
    setCompletingId(null);
    setCompletionText("");
    setCompleteError("");
  };

  const submitCompletion = async (complaintId) => {
    if (!completionText.trim()) {
      setCompleteError("Completion comments are required");
      return;
    }

    setCompleting(true);
    try {
      await apiRequest(`${Labbaseurl}customer_complaints/`, "PATCH", {
       
        complaint_id: complaintId,
        completion_comments: completionText.trim(),
      });

      setCompletingId(null);
      setCompletionText("");
      setCompleteError("");
      loadComplaints(fromDate, toDate, statusFilter);
      showToast("Complaint marked as completed.", "success");
    } catch (err) {
      console.error("Failed to complete customer complaint:", err);
      const message = getErrorMessage(err, "Failed to update. Please try again.");
      setCompleteError(message);
      showToast(message, "error");
    } finally {
      setCompleting(false);
    }
  };

  // ── Export (CSV / PDF) ───────────────────────────────────────────────
  //
  // Both exports work off `complaints`, which already reflects whatever
  // the From/To dates + Status dropdown currently have selected (the
  // backend GET request applies those filters), so "export" always means
  // "export exactly what's on screen right now."

  // SD-R-CL never assigns complaints and doesn't see Ageing on screen for
  // that reason — mirror the same hiding in the exports so the columns
  // aren't just blank there.
  const EXPORT_COLUMNS = [
    "ID",
    "Lab Name",
    "Patient ID",
    "Issue Type",
    "Comments",
    ...(isClinicalReports ? [] : ["Assigned By"]),
    "Status",
    ...(isClinicalReports ? [] : ["Ageing (Days)"]),
    "Completion Comments",
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
        ...(isClinicalReports
          ? []
          : [employeeIdToName[row.assignedby] || row.assignedby || ""]),
        row.status || "",
        ...(isClinicalReports ? [] : [ageing === null ? "—" : `${ageing}`]),
        row.completion_comments || "",
      ];
    });

  const getExportFilename = (ext) => {
    const statusLabel = statusFilter === "all" ? "all" : statusFilter;
    return `customer_complaints_${statusLabel}_${fromDate}_to_${toDate}.${ext}`;
  };

  const handleExportCSV = () => {
    if (visibleComplaints.length === 0) {
      showToast("No data to export for the current filters.", "error");
      return;
    }

    const escapeCsvField = (field) => {
      const str = String(field ?? "");
      if (/[",\n]/.test(str)) {
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
      showToast("No data to export for the current filters.", "error");
      return;
    }

    try {
      const doc = new jsPDF({ orientation: "landscape" });

      doc.setFontSize(14);
      doc.text("Customer Complaints", 14, 15);

      doc.setFontSize(10);
      const statusLabel = statusFilter === "all" ? "All" : statusFilter;
      doc.text(
        `Status: ${statusLabel}   |   From: ${fromDate}   To: ${toDate}`,
        14,
        22
      );

      autoTable(doc, {
        startY: 28,
        head: [EXPORT_COLUMNS],
        body: buildExportRows(),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [182, 115, 201] }, // ACCENT
      });

      doc.save(getExportFilename("pdf"));
      showToast("PDF exported.", "success");
    } catch (err) {
      console.error("Failed to export PDF:", err);
      showToast("Failed to generate PDF. Please try again.", "error");
    }
  };

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <Container>
      <Header>
        <Title>Customer Complaints</Title>
        <AddButton onClick={openModal}>+ Add Complaint</AddButton>
      </Header>

      <FilterBar>
        <FilterField>
          <FilterLabel htmlFor="complaint-from-date">From</FilterLabel>
          <DateInput
            id="complaint-from-date"
            type="date"
            value={fromDate}
            max={toDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </FilterField>
        <FilterField>
          <FilterLabel htmlFor="complaint-to-date">To</FilterLabel>
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
            <option value="all">All</option>
            <option value={COMPLAINT_STATUS.PENDING}>Pending</option>
            <option value={COMPLAINT_STATUS.COMPLETED}>Completed</option>
          </StatusFilterSelect>
        </FilterField>

        <ExportButtonGroup>
          <ExportButton type="button" onClick={handleExportCSV} disabled={loading}>
            Export CSV
          </ExportButton>
          <ExportButton type="button" onClick={handleExportPDF} disabled={loading}>
            Export PDF
          </ExportButton>
        </ExportButtonGroup>
      </FilterBar>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              {!isClinicalReports && <Th>ID</Th>}
              <Th>Lab Name</Th>
              <Th>Patient ID</Th>
              <Th>Issue Type</Th>
              <Th>Comments</Th>
              {!isClinicalReports && <Th>Assigned By</Th>}
              <Th>Status</Th>
              <Th>Ageing (Days)</Th>
              <Th>Completion Comments</Th>
            </tr>
          </thead>
          <tbody>
            {visibleComplaints.map((row) => (
              <tr key={row.complaint_id}>
                {!isClinicalReports && <Td>{row.complaint_id}</Td>}
                <Td>{labCodeToName[row.labcode] || row.labcode}</Td>
                <Td>{row.patient_id || "—"}</Td>
                <Td>{row.issuetype}</Td>
                <Td>{row.comments}</Td>
                {!isClinicalReports && (
                  <Td>{employeeIdToName[row.assignedby] || row.assignedby}</Td>
                )}
                <Td>
                  <StatusBadge $status={row.status}>{row.status}</StatusBadge>
                </Td>
                <Td>
                  {row.status === COMPLAINT_STATUS.PENDING ? (
                    (() => {
                      const days = getAgeingDays(row.created_date);
                      return (
                        <AgeingBadge $days={days}>
                          {days === null ? "—" : `${days} ${days === 1 ? "day" : "days"}`}
                        </AgeingBadge>
                      );
                    })()
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>
                  {row.status === COMPLAINT_STATUS.COMPLETED ? (
                    row.completion_comments || "—"
                  ) : isClinicalReports ? (
                    "—"
                  ) : completingId === row.complaint_id ? (
                    <CompleteBox>
                      <CompleteInput
                        placeholder="Enter completion comments"
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
                          {completing ? "Updating..." : "Update"}
                        </CompleteButton>
                        <CompleteButton
                          onClick={cancelCompleteBox}
                          disabled={completing}
                          style={{ background: "#8a9a9a" }}
                        >
                          Cancel
                        </CompleteButton>
                      </div>
                    </CompleteBox>
                  ) : (
                    <CompleteButton onClick={() => openCompleteBox(row.complaint_id)}>
                      Complete with Comments
                    </CompleteButton>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        {!loading && visibleComplaints.length === 0 && (
          <EmptyState>No customer complaints found.</EmptyState>
        )}
        {loading && <EmptyState>Loading...</EmptyState>}
      </TableWrapper>

      {showModal &&
        ReactDOM.createPortal(
          <Overlay onClick={closeModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseIconButton onClick={closeModal} aria-label="Close" title="Close">
                ×
              </CloseIconButton>
              <ModalTitle>Add Customer Complaint</ModalTitle>

              {!isClinicalReports && (
                <FormGroup>
                  <Label htmlFor="complaint-labname">Lab Name</Label>
                  <LabSearchWrapper>
                    <TextInput
                      id="complaint-labname"
                      placeholder="Search and select a lab"
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
              {isClinicalReports && errors.labcode && (
                <FormGroup>
                  <ErrorText>{errors.labcode}</ErrorText>
                </FormGroup>
              )}

              <FormGroup>
                <Label htmlFor="complaint-patientid">Patient ID</Label>
                <TextInput
                  id="complaint-patientid"
                  placeholder="Optional"
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
                    style={{ marginTop: "8px" }}
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
                  value={formData.comments}
                  onChange={handleChange("comments")}
                />
                {errors.comments && <ErrorText>{errors.comments}</ErrorText>}
              </FormGroup>

              {!isClinicalReports && (
                <FormGroup>
                  <Label htmlFor="complaint-assignedby">Assigned By</Label>
                  <Select
                    id="complaint-assignedby"
                    value={formData.assignedby}
                    onChange={handleChange("assignedby")}
                  >
                    <option value="">Select employee</option>
                    {employees.map((emp, idx) => (
                      <option key={`${emp.employeeId}-${idx}`} value={emp.employeeId}>
                        {emp.employeeName}
                      </option>
                    ))}
                  </Select>
                  {errors.assignedby && <ErrorText>{errors.assignedby}</ErrorText>}
                </FormGroup>
              )}

              <ModalActions>
                <CancelButton onClick={closeModal}>Cancel</CancelButton>
                <SaveButton onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
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
    </Container>
  );
};

export default CustomerComplaints;