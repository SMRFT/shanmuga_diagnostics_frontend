import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import apiRequest from "../Auth/apiRequest";

// Global styles
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
  font-size: 1.75rem;
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
  background-color: rgba(67, 97, 238, 0.08);
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
  min-width: 800px;
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
  font-size: 1.1rem;
  color: var(--primary);
  padding: 1.5rem 1rem !important;
  background-color: rgba(67, 97, 238, 0.1);
  border-left: 4px solid var(--primary);
`;

const TestTitleCellMerged = styled.td`
  font-weight: 700 !important;
  font-size: 1.1rem;
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

const ApproveButton = styled(Button)`
  background-color: ${(props) =>
    props.disabled ? "var(--gray-light)" : "var(--success)"};
  color: ${(props) => (props.disabled ? "var(--gray)" : "white")};
  padding: 0.35rem 0.75rem;
  font-size: 0.875rem;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "var(--gray-light)" : "var(--info)"};
  }
`;

const RerunButton = styled(Button)`
  background-color: ${(props) =>
    props.disabled ? "var(--gray-light)" : "var(--warning)"};
  color: ${(props) => (props.disabled ? "var(--gray)" : "white")};
  padding: 0.35rem 0.75rem;
  font-size: 0.875rem;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "var(--gray-light)" : "#f9844a"};
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

const ValueText = styled.span`
  font-weight: 600;
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.25rem;
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
// ─────────────────────────────────────────────────────────────────────────────

function DoctorForm() {
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

      const url = `${Labbaseurl}test-values/?${qp.toString()}`;
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
        created_date: testDetail.created_date,
        test_id: testDetail.test_id,
      };
      if (isCHC) {
        payload.status = testStatusMap[statusKey(recordIndex, testIndex)];
      }

      const response = await apiRequest(
        `${Labbaseurl}test-approval/${test.barcode}/approve/`,
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
      toast.error("Error during approval: " + error.message, {
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
        `${Labbaseurl}test-rerun/${test.barcode}/rerun/`,
        "PATCH",
        {
          rerun: true,
          rerun_by,
          rerun_time: rerunTime,
          barcode: test.barcode,
          created_date: testDetail.created_date,
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
      toast.error("Error during rerun: " + error.message, {
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
        return (
          <LowBadge>
            <AlertTriangle size={12} /> Low
          </LowBadge>
        );
      } else if (numericValue > max) {
        return (
          <HighBadge>
            <AlertTriangle size={12} /> High
          </HighBadge>
        );
      }
    }
    return null;
  };

  const handleBack = () => navigate("/PatientList");

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

  return (
    <Container>
      <GlobalStyle />
      <StyledToastContainer />
      <Header>
        <Title>Shanmuga Diagnosis</Title>
        <BackButton onClick={handleBack}>
          <ChevronLeft size={18} />
          Back
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

      {patientHistory && (
        <PatientHistoryCard>
          <HistoryTitle>
            <FileText size={18} />
            Patient History
          </HistoryTitle>
          <HistoryContent>{patientHistory}</HistoryContent>
        </PatientHistoryCard>
      )}

      {!patientHistory && testValues.length > 0 && (
        <PatientHistoryCard>
          <HistoryTitle>
            <FileText size={18} />
            Patient History
          </HistoryTitle>
          <NoHistory>No patient history available</NoHistory>
        </PatientHistoryCard>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <th>Sl. No</th>
              <th>Test Name / Parameters</th>
              <th>Department</th>
              <th>Specimen Type</th>
              <th>Container</th>
              <th>Value</th>
              <th>Unit</th>
              <th>Reference Range</th>
              <th>Remarks</th>
              {/* Status column header — only for CHC locations */}
              {isCHC && <th>Status</th>}
              <th>Rerun</th>
              <th>Approve</th>
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
    </Container>
  );
}

export default DoctorForm;
