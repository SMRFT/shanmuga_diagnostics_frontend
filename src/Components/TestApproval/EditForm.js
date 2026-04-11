import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  ChevronLeft,
  Edit2,
  Clock,
} from "lucide-react";
import apiRequest from "../Auth/apiRequest";

const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #4361ee;
    --primary-light: #4895ef;
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

const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast--success {
    background-color: var(--white);
  }
  .Toastify__toast--error {
    background-color: var(--danger);
  }
  .Toastify__toast--info {
    background-color: var(--info);
  }
  .Toastify__toast--warning {
    background-color: var(--warning);
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

const Title = styled.h1`
  font-size: 0.875rem;
  color: var(--dark);
  font-weight: 600;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const PatientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const InfoItem = styled.div`
  background-color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  span {
    font-weight: 600;
    margin-right: 0.5rem;
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
  font-size: 0.865rem;
  color: var(--primary);
  margin-bottom: 0.75rem;
  font-weight: 600;
`;

const HistoryContent = styled.p`
  color: var(--dark);
  line-height: 1.6;
  font-size: 0.765rem;
  white-space: pre-wrap;
`;

const NoHistory = styled.p`
  color: var(--gray);
  font-style: italic;
  font-size: 0.765rem;
`;

const CommentNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: rgba(67, 97, 238, 0.08);
  border-left: 3px solid var(--primary);
  border-radius: 4px;
  font-size: 0.765rem;
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

const TableContainer = styled.div`
  overflow-x: auto;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  transform: rotateX(180deg);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
  transform: rotateX(180deg);
`;

const TableHead = styled.thead`
  background-color: var(--primary);
  color: white;
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 500;
    white-space: nowrap;
    &:first-child {
      border-top-left-radius: var(--border-radius);
    }
    &:last-child {
      border-top-right-radius: var(--border-radius);
    }
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
  }
`;

const TestHeaderRow = styled.tr`
  background-color: rgba(67, 97, 238, 0.15) !important;
  &:hover {
    background-color: rgba(67, 97, 238, 0.2) !important;
  }
`;

const ParameterRow = styled.tr`
  &:hover {
    background-color: rgba(67, 97, 238, 0.05);
  }
`;

const TestTitleCell = styled.td`
  font-weight: 700 !important;
  font-size: 0.865rem;
  color: var(--primary);
  padding: 1.5rem 1rem !important;
  background-color: rgba(67, 97, 238, 0.1);
  border-left: 4px solid var(--primary);
`;

const TestRemarksCell = styled.td`
  font-weight: 500 !important;
  color: var(--secondary);
  font-style: italic;
  padding: 1.5rem 1rem !important;
`;

const ParameterNameCell = styled.td`
  padding-left: 2rem !important;
  font-weight: 500;
  color: var(--dark);
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
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3);
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

const EditButton = styled(Button)`
  background-color: var(--warning);
  color: white;
  padding: 0.35rem 0.75rem;
  font-size: 0.765rem;
  &:hover {
    background-color: #f9844a;
  }
`;

const SaveButton = styled(Button)`
  background-color: #2d8a4e;
  color: white;
  padding: 0.35rem 0.75rem;
  font-size: 0.765rem;
  &:hover {
    background-color: #256b3e;
  }
`;

const CancelEditButton = styled(Button)`
  background-color: var(--gray-light);
  color: var(--dark);
  padding: 0.35rem 0.75rem;
  font-size: 0.765rem;
  &:hover {
    background-color: #d0d3d8;
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

const NormalBadge = styled(StatusBadge)`
  background-color: rgba(45, 138, 78, 0.12);
  color: #2d8a4e;
`;

const AbnormalBadge = styled(StatusBadge)`
  background-color: rgba(247, 37, 133, 0.12);
  color: var(--danger);
  animation: ${blink} 2s infinite;
`;

const HistoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  background-color: rgba(67, 97, 238, 0.12);
  color: var(--primary);
  cursor: pointer;
  margin-left: 0.5rem;
  vertical-align: middle;
  transition: background-color 0.2s;
  &:hover {
    background-color: rgba(67, 97, 238, 0.22);
  }
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

const ValueText = styled.span`
  font-weight: 600;
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.25rem;
`;

const EditInput = styled.input`
  width: 100px;
  padding: 0.35rem 0.5rem;
  border: 1.5px solid var(--primary);
  border-radius: 4px;
  font-size: 0.765rem;
  font-weight: 600;
  color: var(--dark);
  outline: none;
  &:focus {
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 0.4rem;
  align-items: center;
`;

const SubTitleRow = styled.tr`
  background-color: rgba(67, 97, 238, 0.08) !important;
  &:hover {
    background-color: rgba(67, 97, 238, 0.12) !important;
  }
`;

const SubTitleCell = styled.td`
  font-weight: 600 !important;
  font-size: 0.95rem;
  color: var(--secondary);
  padding: 0.75rem 1rem !important;
  padding-left: 2rem !important;
  font-style: italic;
  border-left: 3px solid var(--secondary);
`;

const OutsourcedBadge = styled(StatusBadge)`
  background-color: rgba(246, 160, 233, 0.15);
  color: #d75de0ff;
  animation: ${blink} 1.5s ease-in-out infinite;
  font-weight: 600;
  border: 1px solid #d75de0ff;
`;

const StatusRadioGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.4rem;
  flex-wrap: wrap;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  color: ${(p) => (p.value === "Normal" ? "#2d8a4e" : "#c0392b")};
  input[type="radio"] {
    accent-color: ${(p) => (p.value === "Normal" ? "#2d8a4e" : "#c0392b")};
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.75rem;
  width: 420px;
  max-width: 92vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 1.25rem;
`;

const ModalLabel = styled.p`
  font-size: 0.78rem;
  color: var(--gray);
  margin-bottom: 0.3rem;
  font-weight: 500;
`;

const ModalRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ModalValueBox = styled.div`
  padding: 0.5rem 0.75rem;
  background: #f5f7fb;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.765rem;
  color: ${(p) => (p.isnew ? "var(--primary)" : "var(--dark)")};
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: 6px;
  font-size: 0.765rem;
  resize: vertical;
  min-height: 90px;
  font-family: inherit;
  color: var(--dark);
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
  }
`;

const ModalError = styled.p`
  font-size: 0.75rem;
  color: var(--danger);
  margin-top: 0.3rem;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
  margin-top: 1.25rem;
`;

const HistoryPanel = styled.div`
  margin-top: 0.6rem;
  background: #fffbf0;
  border-left: 3px solid var(--warning);
  border-radius: 4px;
  padding: 0.6rem 0.75rem;
  font-size: 0.78rem;
`;

const HistoryEntry = styled.div`
  padding: 0.4rem 0;
  border-bottom: 0.5px solid var(--gray-light);
  &:last-child {
    border-bottom: none;
  }
`;

const HistoryEntryLabel = styled.div`
  font-weight: 600;
  color: var(--warning);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.25rem;
`;

const HistoryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const HistoryKV = styled.div`
  display: flex;
  gap: 0.3rem;
  font-size: 0.75rem;
`;

const HistoryK = styled.span`
  color: var(--gray);
`;
const HistoryV = styled.span`
  font-weight: 600;
  color: var(--dark);
`;

// ─────────────────────────────────────────────────────────────────────────────

function EditForm() {
  const [testValues, setTestValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientHistory, setPatientHistory] = useState("");

  // Edit state
  const [editingKey, setEditingKey] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [editStatuses, setEditStatuses] = useState({});
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [pendingSave, setPendingSave] = useState(null);
  const [editReason, setEditReason] = useState("");
  const [reasonError, setReasonError] = useState(false);

  // History panel toggle: key → boolean
  const [historyOpen, setHistoryOpen] = useState({});

  const approved_by = localStorage.getItem("employeeId");
  const location = useLocation();
  const navigate = useNavigate();
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const queryParams = new URLSearchParams(location.search);
  const selectedDate = queryParams.get("date");
  const patientId = queryParams.get("patient_id");

  // ── Wrapped in useCallback so it can safely be listed as a useEffect dependency ──
  const fetchTestData = useCallback(
    async (date, pid) => {
      setLoading(true);
      try {
        const qp = new URLSearchParams({ patient_id: pid, date });
        const response = await apiRequest(
          `${Labbaseurl}test-values/?${qp}`,
          "GET",
        );
        if (!response.success)
          throw new Error(response.error || "Failed to fetch");
        const processed = response.data.map((item) => ({
          ...item,
          testdetails:
            typeof item.testdetails === "string"
              ? JSON.parse(item.testdetails)
              : item.testdetails,
        }));
        setTestValues(processed);
        if (processed[0]?.patient_history)
          setPatientHistory(processed[0].patient_history);
        setError(null);
      } catch (err) {
        setError("Failed to load test data. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [Labbaseurl],
  );

  useEffect(() => {
    if (location.state?.patientHistory) {
      setPatientHistory(location.state.patientHistory);
    }
    if (location.state?.skipFetch && location.state?.patientData) {
      const pd = location.state.patientData;
      setTestValues([
        {
          ...pd,
          testdetails:
            typeof pd.testdetails === "string"
              ? JSON.parse(pd.testdetails)
              : pd.testdetails,
        },
      ]);
      setLoading(false);
    } else if (selectedDate && patientId) {
      fetchTestData(selectedDate, patientId);
    } else {
      setLoading(false);
    }
  }, [location.state, selectedDate, patientId, fetchTestData]);

  const formatDateTime = (date) => {
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  // ── Edit helpers ────────────────────────────────────────────────────────────
  const makeKey = (ri, di, pi = null) =>
    pi !== null ? `${ri}-${di}-${pi}` : `${ri}-${di}`;

  const startEdit = (key, currentValue, currentStatus) => {
    setEditingKey(key);
    setEditValues((p) => ({ ...p, [key]: currentValue ?? "" }));
    setEditStatuses((p) => ({ ...p, [key]: currentStatus ?? "" }));
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValues({});
    setEditStatuses({});
  };

  const promptSave = (
    key,
    oldVal,
    recordIndex,
    detailIndex,
    paramIndex = null,
  ) => {
    const newVal = (editValues[key] ?? "").trim();
    const newStatus = editStatuses[key] ?? "";

    if (!newVal && !newStatus) {
      cancelEdit();
      return;
    }

    setPendingSave({
      key,
      oldVal,
      newVal,
      newStatus,
      recordIndex,
      detailIndex,
      paramIndex,
    });
    setEditReason("");
    setReasonError(false);
    setShowReasonModal(true);
  };

  const confirmSave = async () => {
    if (!editReason.trim()) {
      setReasonError(true);
      return;
    }

    const {
      key,
      oldVal,
      newVal,
      newStatus,
      recordIndex,
      detailIndex,
      paramIndex,
    } = pendingSave;
    const test = testValues[recordIndex];
    const detail = test?.testdetails[detailIndex];
    const editedAt = formatDateTime(new Date());

    const histEntry = {
      old_value: String(oldVal ?? ""),
      new_value: newVal,
      edited_by: approved_by,
      reason: editReason.trim(),
      edited_at: editedAt,
    };

    const payload = {
      barcode: test.barcode,
      created_date: detail.created_date,
      test_id: detail.test_id,
      new_value: newVal || undefined,
      new_status: newStatus || undefined,
      history_entry: histEntry,
      param_index: paramIndex,
    };

    try {
      const response = await apiRequest(
        `${Labbaseurl}test-edit/${test.barcode}/edit/`,
        "PATCH",
        payload,
      );
      if (!response.success)
        throw new Error(response.error || "Failed to save");

      // Optimistic update
      setTestValues((prev) =>
        prev.map((record, ri) => {
          if (ri !== recordIndex) return record;
          return {
            ...record,
            testdetails: record.testdetails.map((d, di) => {
              if (di !== detailIndex) return d;
              if (paramIndex !== null) {
                return {
                  ...d,
                  parameters: d.parameters.map((p, pi) => {
                    if (pi !== paramIndex) return p;
                    return {
                      ...p,
                      ...(newVal && { value: newVal }),
                      ...(newStatus && { status: newStatus }),
                      history: [histEntry, ...(p.history || [])],
                    };
                  }),
                };
              }
              return {
                ...d,
                ...(newVal && { value: newVal }),
                ...(newStatus && { status: newStatus }),
                history: [histEntry, ...(d.history || [])],
              };
            }),
          };
        }),
      );

      setShowReasonModal(false);
      cancelEdit();
      toast.success("Updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error("Error saving: " + err.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // ── History ─────────────────────────────────────────────────────────────────
  const toggleHistory = (key) =>
    setHistoryOpen((p) => ({ ...p, [key]: !p[key] }));

  const renderHistoryBadge = (history, key) => {
    if (!history?.length) return null;
    return (
      <HistoryBadge onClick={() => toggleHistory(key)}>
        <Clock size={10} />
        {history.length} edit{history.length > 1 ? "s" : ""}
      </HistoryBadge>
    );
  };

  const renderHistoryPanel = (history, key) => {
    if (!historyOpen[key] || !history?.length) return null;
    return (
      <HistoryPanel>
        {history.map((h, i) => (
          <HistoryEntry key={i}>
            <HistoryEntryLabel>Edit {i + 1}</HistoryEntryLabel>
            <HistoryRow>
              <HistoryKV>
                <HistoryK>Value:</HistoryK>
                <HistoryV>
                  {h.old_value} → {h.new_value}
                </HistoryV>
              </HistoryKV>
              <HistoryKV>
                <HistoryK>By:</HistoryK>
                <HistoryV>{h.edited_by}</HistoryV>
              </HistoryKV>
              <HistoryKV>
                <HistoryK>At:</HistoryK>
                <HistoryV>{h.edited_at}</HistoryV>
              </HistoryKV>
            </HistoryRow>
            <HistoryKV style={{ marginTop: "0.25rem" }}>
              <HistoryK>Reason:</HistoryK>
              <HistoryV>{h.reason}</HistoryV>
            </HistoryKV>
          </HistoryEntry>
        ))}
      </HistoryPanel>
    );
  };

  // ── Display helpers ─────────────────────────────────────────────────────────
  const getStatusBadge = (value, referenceRange) => {
    if (!value || !referenceRange) return null;
    const num = parseFloat(value);
    if (isNaN(num)) return null;
    const parts = referenceRange.split("-").map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      if (num < parts[0])
        return (
          <LowBadge>
            <AlertTriangle size={12} /> Low
          </LowBadge>
        );
      if (num > parts[1])
        return (
          <HighBadge>
            <AlertTriangle size={12} /> High
          </HighBadge>
        );
    }
    return null;
  };

  const renderStatusDisplayBadge = (status) => {
    if (status === "Normal")
      return (
        <NormalBadge>
          <CheckCircle size={11} /> Normal
        </NormalBadge>
      );
    if (status === "Abnormal")
      return (
        <AbnormalBadge>
          <AlertTriangle size={11} /> Abnormal
        </AbnormalBadge>
      );
    return null;
  };

  const renderValueCell = (
    key,
    currentValue,
    currentStatus,
    referenceRange,
  ) => {
    const isEditing = editingKey === key;
    return (
      <ValueContainer>
        {isEditing ? (
          <>
            <EditInput
              type="text"
              value={editValues[key] ?? currentValue ?? ""}
              onChange={(e) =>
                setEditValues((p) => ({ ...p, [key]: e.target.value }))
              }
              autoFocus
            />
            <StatusRadioGroup>
              {["Normal", "Abnormal"].map((val) => (
                <RadioLabel key={val} value={val}>
                  <input
                    type="radio"
                    name={`status-${key}`}
                    value={val}
                    checked={(editStatuses[key] ?? currentStatus ?? "") === val}
                    onChange={() =>
                      setEditStatuses((p) => ({ ...p, [key]: val }))
                    }
                  />
                  {val}
                </RadioLabel>
              ))}
            </StatusRadioGroup>
          </>
        ) : (
          <>
            <ValueText>{currentValue || "N/A"}</ValueText>
            <BadgeContainer>
              {getStatusBadge(currentValue, referenceRange)}
              {renderStatusDisplayBadge(currentStatus)}
            </BadgeContainer>
          </>
        )}
      </ValueContainer>
    );
  };

  const renderActionCell = (
    key,
    oldVal,
    recordIndex,
    detailIndex,
    paramIndex = null,
  ) =>
    editingKey === key ? (
      <ActionGroup>
        <SaveButton
          onClick={() =>
            promptSave(key, oldVal, recordIndex, detailIndex, paramIndex)
          }
        >
          <CheckCircle size={13} /> Save
        </SaveButton>
        <CancelEditButton onClick={cancelEdit}>✕</CancelEditButton>
      </ActionGroup>
    ) : (
      <EditButton
        onClick={() => {
          const record = testValues[recordIndex];
          const detail = record.testdetails[detailIndex];
          const currentStatus =
            paramIndex !== null
              ? detail.parameters[paramIndex]?.status
              : detail.status;
          const currentValue =
            paramIndex !== null
              ? detail.parameters[paramIndex]?.value
              : detail.value;
          startEdit(key, currentValue, currentStatus);
        }}
      >
        <Edit2 size={13} /> Edit
      </EditButton>
    );

  const handleBack = () => navigate("/ApprovedList");

  const getRomanNumeral = (num) => {
    const list = [
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
    return list[num] || String(num + 1);
  };

  // ── Table rows ──────────────────────────────────────────────────────────────
  const generateTableRows = () => {
    const rows = [];
    let testNumber = 1;

    testValues.forEach((test, recordIndex) => {
      test.testdetails.forEach((detail, detailIndex) => {
        const hasParams = detail.parameters?.length > 0;
        const testKey = makeKey(recordIndex, detailIndex);

        if (hasParams) {
          // ── Header row ────────────────────────────────────────────────────
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
                  {renderHistoryBadge(detail.history, testKey)}
                  {detail.comment && (
                    <CommentNote>
                      <CommentLabel>Note:</CommentLabel>
                      <CommentText>{detail.comment}</CommentText>
                    </CommentNote>
                  )}
                  {renderHistoryPanel(detail.history, testKey)}
                </div>
              </TestTitleCell>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <TestRemarksCell>{detail.remarks || "N/A"}</TestRemarksCell>
              <td />
            </TestHeaderRow>,
          );

          // ── Parameter rows ────────────────────────────────────────────────
          const groups = {};
          detail.parameters.forEach((p) => {
            const sub = p.sub_title || "Other";
            if (!groups[sub]) groups[sub] = [];
            groups[sub].push(p);
          });

          let pc = 0;
          // "subtitle" is the group key — "key" renamed to avoid lint warning
          Object.entries(groups).forEach(([subtitle, params]) => {
            if (subtitle && subtitle !== "Other") {
              rows.push(
                <SubTitleRow
                  key={`sub-${recordIndex}-${detailIndex}-${subtitle}`}
                >
                  <td />
                  <SubTitleCell colSpan="7">{subtitle}</SubTitleCell>
                  <td colSpan="3" />
                </SubTitleRow>,
              );
            }
            params.forEach((parameter) => {
              const paramKey = makeKey(recordIndex, detailIndex, pc);
              const capturedPc = pc;
              rows.push(
                <ParameterRow key={`param-${recordIndex}-${detailIndex}-${pc}`}>
                  <td />
                  <ParameterNameCell>
                    <div>
                      {getRomanNumeral(pc)}. {parameter.parameter_name || "N/A"}
                      {renderHistoryBadge(parameter.history, paramKey)}
                      {parameter.comment && (
                        <CommentNote>
                          <CommentLabel>Note:</CommentLabel>
                          <CommentText>{parameter.comment}</CommentText>
                        </CommentNote>
                      )}
                      {renderHistoryPanel(parameter.history, paramKey)}
                    </div>
                  </ParameterNameCell>
                  <td>{detail.department || "N/A"}</td>
                  <td>{detail.specimen_type || "N/A"}</td>
                  <td>{detail.collection_container || "N/A"}</td>
                  <ValueCell>
                    {renderValueCell(
                      paramKey,
                      parameter.value,
                      parameter.status,
                      parameter.reference_range,
                    )}
                  </ValueCell>
                  <td>{parameter.unit || "N/A"}</td>
                  <td>{parameter.reference_range || "N/A"}</td>
                  <td />
                  <td>
                    {renderActionCell(
                      paramKey,
                      parameter.value,
                      recordIndex,
                      detailIndex,
                      capturedPc,
                    )}
                  </td>
                </ParameterRow>,
              );
              pc++;
            });
          });

          testNumber++;
        } else {
          // ── Single-value test row ─────────────────────────────────────────
          rows.push(
            <TestHeaderRow key={`test-nop-${recordIndex}-${detailIndex}`}>
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
                  {renderHistoryBadge(detail.history, testKey)}
                  {detail.comment && (
                    <CommentNote>
                      <CommentLabel>Note:</CommentLabel>
                      <CommentText>{detail.comment}</CommentText>
                    </CommentNote>
                  )}
                  {renderHistoryPanel(detail.history, testKey)}
                </div>
              </TestTitleCell>
              <td>{detail.department || "N/A"}</td>
              <td>{detail.specimen_type || "N/A"}</td>
              <td>{detail.collection_container || "N/A"}</td>
              <ValueCell>
                {renderValueCell(
                  testKey,
                  detail.value,
                  detail.status,
                  detail.reference_range,
                )}
              </ValueCell>
              <td>{detail.unit || "N/A"}</td>
              <td>{detail.reference_range || "N/A"}</td>
              <TestRemarksCell>{detail.remarks || "N/A"}</TestRemarksCell>
              <td>
                {renderActionCell(
                  testKey,
                  detail.value,
                  recordIndex,
                  detailIndex,
                  null,
                )}
              </td>
            </TestHeaderRow>,
          );
          testNumber++;
        }
      });
    });

    return rows;
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading)
    return (
      <Container>
        <GlobalStyle />
        <div>Loading test data...</div>
      </Container>
    );
  if (error)
    return (
      <Container>
        <GlobalStyle />
        <div>{error}</div>
      </Container>
    );

  return (
    <Container>
      <GlobalStyle />
      <StyledToastContainer />

      {/* Reason modal */}
      {showReasonModal && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>Reason for edit</ModalTitle>
            <ModalRow>
              <div>
                <ModalLabel>Old value</ModalLabel>
                <ModalValueBox>{pendingSave?.oldVal ?? "—"}</ModalValueBox>
              </div>
              <div>
                <ModalLabel>New value</ModalLabel>
                <ModalValueBox isnew>
                  {pendingSave?.newVal || "—"}
                </ModalValueBox>
              </div>
            </ModalRow>
            {pendingSave?.newStatus && (
              <div style={{ marginBottom: "1rem" }}>
                <ModalLabel>Status</ModalLabel>
                <ModalValueBox isnew>{pendingSave.newStatus}</ModalValueBox>
              </div>
            )}
            <ModalLabel>
              Reason <span style={{ color: "var(--danger)" }}>*</span>
            </ModalLabel>
            <ModalTextarea
              value={editReason}
              onChange={(e) => {
                setEditReason(e.target.value);
                setReasonError(false);
              }}
              placeholder="Enter reason for this change..."
            />
            {reasonError && <ModalError>Reason is required.</ModalError>}
            <ModalActions>
              <CancelEditButton
                onClick={() => {
                  setShowReasonModal(false);
                  cancelEdit();
                }}
              >
                Cancel
              </CancelEditButton>
              <SaveButton onClick={confirmSave}>
                <CheckCircle size={14} /> Confirm Save
              </SaveButton>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}

      <Header>
        <Title>Shanmuga Diagnosis</Title>
        <BackButton onClick={handleBack}>
          <ChevronLeft size={18} /> Back
        </BackButton>
      </Header>

      <PatientInfo>
        <InfoItem>
          <span>Patient ID:</span> {patientId}
        </InfoItem>
        {selectedDate && (
          <InfoItem>
            <span>Date:</span> {selectedDate}
          </InfoItem>
        )}
        {testValues.length > 0 && (
          <>
            <InfoItem>
              <span>Patient Name:</span> {testValues[0].patientname || "N/A"}
            </InfoItem>
            <InfoItem>
              <span>Age:</span> {testValues[0].age || "N/A"}
            </InfoItem>
            <InfoItem>
              <span>Location:</span> {testValues[0].locationId || "N/A"}
            </InfoItem>
          </>
        )}
      </PatientInfo>

      {patientHistory ? (
        <PatientHistoryCard>
          <HistoryTitle>
            <FileText size={18} /> Patient History
          </HistoryTitle>
          <HistoryContent>{patientHistory}</HistoryContent>
        </PatientHistoryCard>
      ) : testValues.length > 0 ? (
        <PatientHistoryCard>
          <HistoryTitle>
            <FileText size={18} /> Patient History
          </HistoryTitle>
          <NoHistory>No patient history available</NoHistory>
        </PatientHistoryCard>
      ) : null}

      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <th>Sl. No</th>
              <th>Test Name / Parameters</th>
              <th>Department</th>
              <th>Specimen Type</th>
              <th>Container</th>
              <th>Value / Status</th>
              <th>Unit</th>
              <th>Reference Range</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </TableHead>
          <TableBody>
            {testValues.length > 0 ? (
              generateTableRows()
            ) : (
              <tr>
                <NoData colSpan="10">No test data available.</NoData>
              </tr>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default EditForm;
