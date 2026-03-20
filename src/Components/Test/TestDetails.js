import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { ArrowLeft, Save, ChevronDown } from "lucide-react";
import apiRequest from "../Auth/apiRequest";

const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #4361ee; --primary-light: #4895ef; --secondary: #3f37c9;
    --success: #4cc9f0; --danger: #f72585; --warning: #f8961e;
    --info: #90e0ef; --light: #f8f9fa; --dark: #212529;
    --gray: #6c757d; --gray-light: #e9ecef;
    --border-radius: 8px; --box-shadow: 0 4px 6px rgba(0,0,0,0.1); --transition: all 0.3s ease;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f7fb; color: var(--dark); line-height: 1.5;
  }
`;

const Container = styled.div`
  max-width: 1200px;
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
const PatientInfoBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
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
    background-color: var(--gray-light);
    color: var(--gray);
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
const BackButton = styled(Button)`
  background-color: var(--light);
  color: var(--dark);
  &:hover {
    background-color: var(--gray-light);
  }
`;
const SaveButton = styled(Button)`
  background-color: var(--success);
  &:hover {
    background-color: var(--info);
  }
  &:disabled {
    background-color: var(--gray-light);
    color: var(--gray);
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
const NoData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  font-size: 1.125rem;
  color: var(--gray);
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const TestCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
`;
const TestHeader = styled.div`
  background-color: var(--primary);
  color: white;
  padding: 1rem;
  font-weight: 600;
  font-size: 1.125rem;
`;
const TestContent = styled.div`
  padding: 1rem;
`;
const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray);
`;
const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
  &:disabled {
    background-color: var(--gray-light);
    cursor: not-allowed;
  }
`;
const WrappedInput = styled(Input)`
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  min-height: 2rem;
  height: auto;
  resize: none;
  line-height: 1.2;
`;
const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;
const CommentBox = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: var(--border-radius);
  border: 1px solid var(--gray-light);
`;
const CommentLabel = styled(Label)`
  color: var(--secondary);
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
`;
// Critical comment textarea gets a red border hint
const CommentTextArea = styled(TextArea)`
  min-height: 5px;
  min-width: 100%;
  background-color: white;
  ${(props) =>
    props.isCritical &&
    `
    border-color: var(--danger);
    background-color: #fff5f5;
  `}
`;
const CriticalBadge = styled.span`
  display: inline-block;
  padding: 0.15rem 0.5rem;
  margin-left: 0.5rem;
  background-color: #fff0f0;
  color: var(--danger);
  border: 1px solid var(--danger);
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  vertical-align: middle;
`;
const ParameterSection = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid var(--gray-light);
  padding-top: 1.5rem;
`;
const ParameterTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: var(--secondary);
`;
const ParameterCard = styled.div`
  background-color: var(--light);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1rem;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;
const RemarksSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-light);
`;
const SubtitleSection = styled.div`
  margin-bottom: 2rem;
  &:last-child {
    margin-bottom: 0;
  }
`;
const SubtitleHeader = styled.div`
  background: linear-gradient(135deg, var(--secondary), var(--primary));
  color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const ParameterGrid = styled.div`
  display: grid;
  gap: 1rem;
`;
const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  padding-right: 2.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  appearance: none;
  background-color: white;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
  &:disabled {
    background-color: var(--gray-light);
    cursor: not-allowed;
  }
`;
const SelectIcon = styled(ChevronDown)`
  position: absolute;
  right: 0.75rem;
  pointer-events: none;
  color: var(--gray);
`;

// ─── Constants ───────────────────────────────────────────────────────────────

const ALL_CALCULATED_FIELDS = [
  "TESTCODE001",
  "TESTCODE002",
  "TESTCODE003",
  "TESTCODE004",
  "LFT03",
  "LFT09",
  "LFT10",
  "HBA1C02",
  "INR",
  "ACR",
  "PCR-RATIO",
];

const ALWAYS_EDITABLE_FIELDS = ["PT-CNTL", "PT-ISI", "APTT-C"];

const DEFAULT_FIELD_VALUES = {
  "PT-CNTL": "13.7",
  "PT-ISI": "1.1",
  "APTT-C": "25.0",
};

// ─── Normalize "neg" variants to "Negative" ──────────────────────────────────
const normalizeDisplayValue = (value) => {
  if (typeof value === "string" && value.trim().toLowerCase() === "neg") {
    return "Negative";
  }
  return value;
};

// ─── Critical range checker ───────────────────────────────────────────────────
/**
 * Parses the `low` and `high` fields from the test definition.
 * Format examples:
 *   low: "<5"   → critical if value < 5
 *   high: ">100" → critical if value > 100
 * Returns true if the numeric value is outside the critical range.
 */
const isCriticalValue = (value, low, high) => {
  const num = parseFloat(value);
  if (isNaN(num) || (!low && !high)) return false;

  let tooLow = false;
  let tooHigh = false;

  if (low) {
    // low field: e.g. "<5" means critical LOW if value < 5
    const lowNum = parseFloat(low.replace(/[^0-9.-]/g, ""));
    if (!isNaN(lowNum) && num < lowNum) tooLow = true;
  }

  if (high) {
    // high field: e.g. ">100" means critical HIGH if value > 100
    const highNum = parseFloat(high.replace(/[^0-9.-]/g, ""));
    if (!isNaN(highNum) && num > highNum) tooHigh = true;
  }

  return tooLow || tooHigh;
};

// ─── Derived-value calculator ────────────────────────────────────────────────

const calculateDerivedValues = (
  testname,
  currentValues,
  currentTest,
  manuallyEdited = {},
) => {
  if (!currentTest) return currentValues;
  const newValues = { ...currentValues };
  const allParams = Object.values(
    currentTest.parametersBySubtitle || {},
  ).flat();

  const valuesByTestCode = {};
  allParams.forEach((param) => {
    const pName = param.name || param.test_name;
    const key = `${testname}_${pName}`;
    const val = parseFloat(newValues[key]) || 0;
    valuesByTestCode[param.test_code] = val;
  });

  if (currentTest.test_id === 498) {
    const cholesterol = valuesByTestCode["13"] || 0;
    const triglycerides = valuesByTestCode["14"] || 0;
    const hdl = valuesByTestCode["15"] || 0;
    const ldlDirect = valuesByTestCode["18"] || 0;
    const nonHdlParam = allParams.find((p) => p.test_code === "TESTCODE001");
    if (nonHdlParam && cholesterol && hdl) {
      const k = `${testname}_${nonHdlParam.name || nonHdlParam.test_name}`;
      if (!manuallyEdited[k]) newValues[k] = (cholesterol - hdl).toFixed(2);
    }
    const ratioParam = allParams.find((p) => p.test_code === "TESTCODE002");
    if (ratioParam && cholesterol && hdl) {
      const k = `${testname}_${ratioParam.name || ratioParam.test_name}`;
      if (!manuallyEdited[k]) newValues[k] = (cholesterol / hdl).toFixed(2);
    }
    const vldlParam = allParams.find((p) => p.test_code === "TESTCODE003");
    if (vldlParam && triglycerides) {
      const k = `${testname}_${vldlParam.name || vldlParam.test_name}`;
      if (!manuallyEdited[k]) newValues[k] = (triglycerides / 5).toFixed(2);
    }
    const ldlRatioParam = allParams.find((p) => p.test_code === "TESTCODE004");
    if (ldlRatioParam && ldlDirect && hdl) {
      const k = `${testname}_${ldlRatioParam.name || ldlRatioParam.test_name}`;
      if (!manuallyEdited[k]) newValues[k] = (ldlDirect / hdl).toFixed(2);
    }
  }

  if (currentTest.test_id === 196) {
    const totalProtein = valuesByTestCode["26"] || 0;
    const albumin = valuesByTestCode["06"] || 0;
    const bilirubinTotal = valuesByTestCode["07"] || 0;
    const bilirubinDirect = valuesByTestCode["LFT02"] || 0;
    const globulinParam = allParams.find((p) => p.test_code === "LFT09");
    if (globulinParam && totalProtein && albumin) {
      const k = `${testname}_${globulinParam.name || globulinParam.test_name}`;
      if (!manuallyEdited[k])
        newValues[k] = (totalProtein - albumin).toFixed(2);
    }
    const agRatioParam = allParams.find((p) => p.test_code === "LFT10");
    if (agRatioParam && albumin && totalProtein) {
      const globulin = totalProtein - albumin;
      if (globulin > 0) {
        const k = `${testname}_${agRatioParam.name || agRatioParam.test_name}`;
        if (!manuallyEdited[k]) newValues[k] = (albumin / globulin).toFixed(2);
      }
    }
    const bilirubinIndirectParam = allParams.find(
      (p) => p.test_code === "LFT03",
    );
    if (bilirubinIndirectParam && bilirubinTotal && bilirubinDirect) {
      const k = `${testname}_${bilirubinIndirectParam.name || bilirubinIndirectParam.test_name}`;
      if (!manuallyEdited[k])
        newValues[k] = (bilirubinTotal - bilirubinDirect).toFixed(2);
    }
  }

  if (currentTest.test_id === 449) {
    const bilirubinTotal = valuesByTestCode["07"] || 0;
    const bilirubinDirect = valuesByTestCode["LFT02"] || 0;
    const bilirubinIndirectParam = allParams.find(
      (p) => p.test_code === "LFT03",
    );
    if (bilirubinIndirectParam && bilirubinTotal && bilirubinDirect) {
      const k = `${testname}_${bilirubinIndirectParam.name || bilirubinIndirectParam.test_name}`;
      if (!manuallyEdited[k])
        newValues[k] = (bilirubinTotal - bilirubinDirect).toFixed(2);
    }
  }

  if (currentTest.test_id === 467) {
    const hba1c = valuesByTestCode["HBA1C01"] || 0;
    const eagParam = allParams.find((p) => p.test_code === "HBA1C02");
    if (eagParam && hba1c) {
      const k = `${testname}_${eagParam.name || eagParam.test_name}`;
      if (!manuallyEdited[k]) newValues[k] = (hba1c * 28.7 - 46.1).toFixed(2);
    }
  }

  if (currentTest.test_id === 315) {
    const ptTest = valuesByTestCode["PT-TEST"] || 0;
    const ptCntl = valuesByTestCode["PT-CNTL"] || 0;
    const ptIsi = valuesByTestCode["PT-ISI"] || 0;
    const inrParam = allParams.find((p) => p.test_code === "INR");
    if (inrParam && ptTest && ptCntl && ptIsi) {
      const k = `${testname}_${inrParam.name || inrParam.test_name}`;
      if (!manuallyEdited[k]) newValues[k] = (ptTest / ptCntl).toFixed(2);
    }
  }

  if (currentTest.test_id === 362) {
    const um = valuesByTestCode["UM"] || 0;
    const uc = valuesByTestCode["UC"] || 0;
    const acrParam = allParams.find((p) => p.test_code === "ACR");
    if (acrParam && um && uc) {
      const k = `${testname}_${acrParam.name || acrParam.test_name}`;
      if (!manuallyEdited[k]) newValues[k] = ((um / 10 / uc) * 1000).toFixed(2);
    }
  }

  if (currentTest.test_id === 205) {
    const urPro = valuesByTestCode["UR-PRO"] || 0;
    const urCrea = valuesByTestCode["UR-CREA"] || 0;
    const pcrParam = allParams.find((p) => p.test_code === "PCR-RATIO");
    if (pcrParam && urPro && urCrea) {
      const k = `${testname}_${pcrParam.name || pcrParam.test_name}`;
      if (!manuallyEdited[k]) newValues[k] = (urPro / urCrea).toFixed(2);
    }
  }

  return newValues;
};

// ─── Component ────────────────────────────────────────────────────────────────

function TestDetails() {
  const [testDetails, setTestDetails] = useState([]);
  const [values, setValues] = useState({});
  const [remarks, setRemarks] = useState({});
  const [comments, setComments] = useState({});
  const [parameterComments, setParameterComments] = useState({});
  const [parameterRemarks, setParameterRemarks] = useState("");
  const [editMode, setEditMode] = useState({});
  const [parameterEditMode, setParameterEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [initialValues, setInitialValues] = useState({});
  const [processedRecords, setProcessedRecords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manuallyEditedCalculatedFields, setManuallyEditedCalculatedFields] =
    useState({});
  const [criticalRanges, setCriticalRanges] = useState({});
  const [criticalKeys, setCriticalKeys] = useState({});
  const criticalTimers = React.useRef({});
  const autoCriticalComments = React.useRef(new Set());

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get("date");
  const patientId = queryParams.get("patient_id");
  const patientname = queryParams.get("patientname");
  const age = queryParams.get("age");
  const gender = queryParams.get("gender"); // NEW: read gender from URL
  const barcode = queryParams.get("barcode");
  const locationId = queryParams.get("locationId");
  const testId = queryParams.get("test_id");
  const testName = queryParams.get("test_name");
  const navigate = useNavigate();
  const verified_by = localStorage.getItem("name") || "";
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchTestDetails = async (barcode, test_id = null, testName = null) => {
    try {
      setLoading(true);
      setError(null);

      let qp = `barcode=${encodeURIComponent(barcode)}`;
      if (testId) qp += `&test_id=${encodeURIComponent(testId)}`;
      if (testName) qp += `&test_name=${encodeURIComponent(testName)}`;
      // NEW: pass gender to backend so it can return gender-based reference_range, low, high
      if (gender) qp += `&gender=${encodeURIComponent(gender)}`;

      const response = await apiRequest(
        `${Labbaseurl}compare_test_details/?${qp}`,
        "GET",
      );

      let actualResponse =
        response.data && typeof response.data === "object"
          ? response.data
          : response;

      if (!actualResponse.success)
        throw new Error(actualResponse.error || "Failed to fetch test details");

      if (
        actualResponse.processed_records &&
        Array.isArray(actualResponse.processed_records)
      ) {
        setProcessedRecords(actualResponse.processed_records);
      } else {
        setProcessedRecords([]);
      }

      const patientInfo = actualResponse.patient_info || {};
      setPatientName(patientInfo.patient_name || "");

      let allTests;
      if (Array.isArray(actualResponse.data)) {
        allTests = actualResponse.data;
      } else if (Array.isArray(actualResponse)) {
        allTests = actualResponse;
      } else {
        throw new Error(
          "Invalid response structure: test data is not an array",
        );
      }

      if (allTests.length === 0) {
        setTestDetails([]);
        setLoading(false);
        return;
      }

      const filteredTests = testName
        ? allTests.filter((t) => t.testname === testName)
        : allTests;

      const groupedTests = {};

      filteredTests.forEach((test) => {
        const tName = test.testname;
        if (!groupedTests[tName]) {
          groupedTests[tName] = {
            testname: tName,
            originalTestname: tName,
            device_id: test.device_id,
            test_id: test.test_id,
            test_code: test.test_code,
            department: test.department,
            NABL: test.NABL,
            specimen_type: test.specimen_type || "",
            method: test.method,
            sample_status: test.sample_status,
            parametersBySubtitle: {},
          };
        }

        if (
          test.parameter_name &&
          test.parameter_name !== null &&
          test.parameter_name !== "N/A"
        ) {
          const subtitle = test.sub_title || "";
          if (!groupedTests[tName].parametersBySubtitle[subtitle]) {
            groupedTests[tName].parametersBySubtitle[subtitle] = [];
          }
          groupedTests[tName].parametersBySubtitle[subtitle].push({
            name: test.parameter_name,
            test_name: test.parameter_name,
            test_code: test.test_code,
            unit: test.unit,
            reference_range: test.reference_range, // gender-resolved by backend
            low: test.low || "", // NEW from backend
            high: test.high || "", // NEW from backend
            method: test.method,
            value: test.test_value,
            value_option: test.value_option || [],
            sub_title: subtitle,
            processing_status: test.processing_status,
          });
        } else if (!test.parameter_name || test.parameter_name === null) {
          groupedTests[tName].unit = test.unit;
          groupedTests[tName].reference_range = test.reference_range; // gender-resolved
          groupedTests[tName].low = test.low || ""; // NEW
          groupedTests[tName].high = test.high || ""; // NEW
          groupedTests[tName].test_value = test.test_value;
          groupedTests[tName].test_code = test.test_code;
          groupedTests[tName].processing_status = test.processing_status;
          groupedTests[tName].value_option = test.value_option || [];
        }
      });

      const transformedTests = Object.values(groupedTests);
      setTestDetails(transformedTests);

      let tempValues = {};
      let tempEditMode = {};
      let tempInitialValues = {};
      // NEW: build criticalRanges map  { key -> { low, high } }
      const tempCriticalRanges = {};

      transformedTests.forEach((test) => {
        if (
          test.parametersBySubtitle &&
          Object.keys(test.parametersBySubtitle).length > 0
        ) {
          Object.values(test.parametersBySubtitle)
            .flat()
            .forEach((param) => {
              const paramName = param.name || param.test_name;
              const uniqueKey = `${test.testname}_${paramName}`;
              let paramValue = param.value || "";
              if (
                !paramValue &&
                DEFAULT_FIELD_VALUES[param.test_code] !== undefined
              ) {
                paramValue = DEFAULT_FIELD_VALUES[param.test_code];
              }
              // Normalize "neg" → "Negative" on load for ALL tests
              tempValues[uniqueKey] = normalizeDisplayValue(paramValue);
              // Store normalized API value as initial (used for editability check)
              tempInitialValues[uniqueKey] = normalizeDisplayValue(
                param.value || "",
              );
              // store low/high for this param
              tempCriticalRanges[uniqueKey] = {
                low: param.low || "",
                high: param.high || "",
              };
            });
        } else {
          const testValue = test.test_value || "";
          tempValues[test.testname] = testValue;
          tempEditMode[test.testname] = false;
          tempInitialValues[test.testname] = testValue;
          // store low/high for single-value test
          tempCriticalRanges[test.testname] = {
            low: test.low || "",
            high: test.high || "",
          };
        }
      });

      setEditMode(tempEditMode);
      setInitialValues(tempInitialValues);
      setCriticalRanges(tempCriticalRanges);

      // Auto-calculate derived values
      transformedTests.forEach((test) => {
        if (
          [498, 196, 449, 467, 315, 362, 205].includes(test.test_id) &&
          test.parametersBySubtitle &&
          Object.keys(test.parametersBySubtitle).length > 0
        ) {
          tempValues = calculateDerivedValues(test.testname, tempValues, test);
        }
      });

      setValues(tempValues);

      // NEW: auto-fill Critical for any pre-loaded values that are out of critical range
      const initialComments = {};
      const initialParamComments = {};
      transformedTests.forEach((test) => {
        if (
          test.parametersBySubtitle &&
          Object.keys(test.parametersBySubtitle).length > 0
        ) {
          Object.values(test.parametersBySubtitle)
            .flat()
            .forEach((param) => {
              const paramName = param.name || param.test_name;
              const uniqueKey = `${test.testname}_${paramName}`;
              const val = tempValues[uniqueKey];
              const { low, high } = tempCriticalRanges[uniqueKey] || {};
              if (val && isCriticalValue(val, low, high)) {
                initialParamComments[uniqueKey] = "Critical.";
              }
            });
        } else {
          const val = tempValues[test.testname];
          const { low, high } = tempCriticalRanges[test.testname] || {};
          if (val && isCriticalValue(val, low, high)) {
            initialComments[test.testname] = "Critical.";
          }
        }
      });
      // Seed criticalKeys for any pre-loaded values that are already critical
      const initialCriticalKeys = {};
      Object.keys(tempCriticalRanges).forEach((key) => {
        const val = tempValues[key];
        const { low, high } = tempCriticalRanges[key] || {};
        if (val && isCriticalValue(val, low, high))
          initialCriticalKeys[key] = true;
      });
      setCriticalKeys(initialCriticalKeys);
      // Mark pre-loaded critical comments as auto-filled so they can be cleared on edit
      autoCriticalComments.current = new Set(Object.keys(initialCriticalKeys));
      setComments(initialComments);
      setParameterComments(initialParamComments);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching test details:", error);
      setError(`Failed to load test details: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (barcode && testName) {
      fetchTestDetails(barcode, null, testName);
    } else if (barcode) {
      fetchTestDetails(barcode);
    } else {
      setError("No barcode provided");
      setLoading(false);
    }
  }, [barcode, testName]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleValueChange = (testname, event) => {
    const newVal = event.target.value;
    setValues((prev) => ({ ...prev, [testname]: newVal }));

    // Debounced critical check — fires only after typing stops for 600 ms.
    // Both the badge/border (criticalKeys) and comment update here,
    // so nothing shows mid-type.
    clearTimeout(criticalTimers.current[testname]);
    criticalTimers.current[testname] = setTimeout(() => {
      const { low, high } = criticalRanges[testname] || {};
      const isCrit = isCriticalValue(newVal, low, high);
      // Update criticalKeys so badge + border reflect settled value
      setCriticalKeys((prev) => {
        if (isCrit === !!prev[testname]) return prev;
        const next = { ...prev };
        if (isCrit) next[testname] = true;
        else delete next[testname];
        return next;
      });
      if (isCrit) {
        // Auto-fill only if empty or already the auto-text; mark as auto-filled
        setComments((prev) => {
          if (!prev[testname] || prev[testname] === "Critical.") {
            autoCriticalComments.current.add(testname);
            return {
              ...prev,
              [testname]: "Critical.",
            };
          }
          return prev; // user wrote their own comment — leave it
        });
      } else {
        // Value no longer critical — clear ONLY if it was auto-filled, not manually edited
        if (autoCriticalComments.current.has(testname)) {
          autoCriticalComments.current.delete(testname);
          setComments((prev) => {
            const next = { ...prev };
            delete next[testname];
            return next;
          });
        }
      }
    }, 600);
  };

  const handleParameterValueChange = (testname, paramName, event) => {
    const { value } = event.target;
    const uniqueKey = `${testname}_${paramName}`;

    // Normalize "neg" → "Negative" on user input for test_id 429
    const currentTestForNorm = testDetails.find((t) => t.testname === testname);
    const normalizedValue =
      currentTestForNorm?.test_id === 429
        ? normalizeDisplayValue(value)
        : value;

    setValues((prevValues) => {
      const newValues = { ...prevValues, [uniqueKey]: normalizedValue };
      const currentTest = testDetails.find((t) => t.testname === testname);
      const param = Object.values(currentTest?.parametersBySubtitle || {})
        .flat()
        .find((p) => (p.name || p.test_name) === paramName);

      const isCalculatedField = ALL_CALCULATED_FIELDS.includes(
        param?.test_code,
      );

      if (isCalculatedField) {
        setManuallyEditedCalculatedFields((prev) => ({
          ...prev,
          [uniqueKey]: true,
        }));
        return newValues;
      }

      setManuallyEditedCalculatedFields((prev) => {
        const updated = { ...prev };
        const allParams = Object.values(
          currentTest?.parametersBySubtitle || {},
        ).flat();
        allParams.forEach((p) => {
          if (ALL_CALCULATED_FIELDS.includes(p.test_code)) {
            delete updated[`${testname}_${p.name || p.test_name}`];
          }
        });
        return updated;
      });

      if ([498, 196, 449, 467, 315, 362, 205].includes(currentTest?.test_id)) {
        return calculateDerivedValues(
          testname,
          newValues,
          currentTest,
          manuallyEditedCalculatedFields,
        );
      }
      return newValues;
    });

    // Debounced critical check for parameter — fires only after typing stops for 600 ms.
    // Both the badge/border (criticalKeys) and comment update inside the timeout,
    // so nothing shows mid-type.
    clearTimeout(criticalTimers.current[uniqueKey]);
    criticalTimers.current[uniqueKey] = setTimeout(() => {
      const { low, high } = criticalRanges[uniqueKey] || {};
      const isCrit = isCriticalValue(normalizedValue, low, high);
      // Update criticalKeys so badge + border reflect settled value
      setCriticalKeys((prev) => {
        if (isCrit === !!prev[uniqueKey]) return prev;
        const next = { ...prev };
        if (isCrit) next[uniqueKey] = true;
        else delete next[uniqueKey];
        return next;
      });
      if (isCrit) {
        // Auto-fill only if empty or already the auto-text; mark as auto-filled
        setParameterComments((prev) => {
          if (!prev[uniqueKey] || prev[uniqueKey] === "Critical.") {
            autoCriticalComments.current.add(uniqueKey);
            return {
              ...prev,
              [uniqueKey]: "Critical.",
            };
          }
          return prev; // user wrote their own comment — leave it
        });
      } else {
        // Value no longer critical — clear ONLY if it was auto-filled, not manually edited
        if (autoCriticalComments.current.has(uniqueKey)) {
          autoCriticalComments.current.delete(uniqueKey);
          setParameterComments((prev) => {
            const next = { ...prev };
            delete next[uniqueKey];
            return next;
          });
        }
      }
    }, 600);
  };

  const handleRemarksChange = (testname, event) => {
    setRemarks((prev) => ({ ...prev, [testname]: event.target.value }));
  };

  const handleCommentChange = (testname, event) => {
    // User manually edited the comment — it is no longer auto-managed
    autoCriticalComments.current.delete(testname);
    setComments((prev) => ({ ...prev, [testname]: event.target.value }));
  };

  const handleParameterCommentChange = (testname, paramName, event) => {
    const uniqueKey = `${testname}_${paramName}`;
    // User manually edited the comment — it is no longer auto-managed
    autoCriticalComments.current.delete(uniqueKey);
    setParameterComments((prev) => ({
      ...prev,
      [uniqueKey]: event.target.value,
    }));
  };

  const handleParameterRemarksChange = (event) => {
    setParameterRemarks(event.target.value);
  };

  const toggleEditMode = (testname) => {
    setEditMode((prev) => ({ ...prev, [testname]: !prev[testname] }));
  };

  const toggleParameterEditMode = () => {
    setParameterEditMode(!parameterEditMode);
  };

  // ── Save-button guard ─────────────────────────────────────────────────────

  const isSaveButtonEnabled = () => {
    if (isSubmitting) return false;
    let allValuesFilled = true;
    let remarksRequiredForEditedFields = true;

    testDetails.forEach((test) => {
      if (
        test.parametersBySubtitle &&
        Object.keys(test.parametersBySubtitle).length > 0
      ) {
        let hasEditedParameters = false;
        Object.values(test.parametersBySubtitle)
          .flat()
          .forEach((param) => {
            const paramName = param.name || param.test_name;
            const uniqueKey = `${test.testname}_${paramName}`;
            const paramValue = values[uniqueKey];
            const initialValue = initialValues[uniqueKey];
            if (!paramValue || paramValue.trim() === "")
              allValuesFilled = false;
            if (
              (!initialValue || initialValue.trim() === "") &&
              paramValue &&
              paramValue.trim() !== ""
            ) {
              hasEditedParameters = true;
            }
          });
        if (
          hasEditedParameters &&
          (!parameterRemarks || parameterRemarks.trim() === "")
        ) {
          remarksRequiredForEditedFields = false;
        }
      } else {
        const testValue = values[test.testname];
        const initialValue = initialValues[test.testname];
        if (!testValue || testValue.trim() === "") allValuesFilled = false;
        if (
          (!initialValue || initialValue.trim() === "") &&
          testValue &&
          testValue.trim() !== ""
        ) {
          if (!remarks[test.testname] || remarks[test.testname].trim() === "") {
            remarksRequiredForEditedFields = false;
          }
        }
      }
    });

    return allValuesFilled && remarksRequiredForEditedFields;
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const validateTestValue = (value, paramName, testName) => {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        throw new Error(`Value for ${paramName} in ${testName} is required`);
      }
    };

    try {
      const validationErrors = [];
      testDetails.forEach((test) => {
        if (
          test.parametersBySubtitle &&
          Object.keys(test.parametersBySubtitle).length > 0
        ) {
          Object.values(test.parametersBySubtitle)
            .flat()
            .forEach((param) => {
              const paramName = param.name || param.test_name;
              const uniqueKey = `${test.testname}_${paramName}`;
              try {
                validateTestValue(values[uniqueKey], paramName, test.testname);
              } catch (error) {
                validationErrors.push(error.message);
              }
            });
        } else {
          try {
            validateTestValue(
              values[test.testname],
              test.testname,
              test.testname,
            );
          } catch (error) {
            validationErrors.push(error.message);
          }
        }
      });

      if (validationErrors.length > 0) {
        alert(
          "Please fill in all required values:\n\n" +
            validationErrors.map((e, i) => `${i + 1}. ${e}`).join("\n"),
        );
        setIsSubmitting(false);
        return;
      }

      const testDetailsData = testDetails.map((test) => {
        if (
          test.parametersBySubtitle &&
          Object.keys(test.parametersBySubtitle).length > 0
        ) {
          const parameters = [];
          Object.entries(test.parametersBySubtitle).forEach(
            ([subtitle, params]) => {
              params.forEach((param) => {
                const paramName = param.name || param.test_name;
                const uniqueKey = `${test.testname}_${paramName}`;
                parameters.push({
                  test_code: param.test_code || "",
                  value: values[uniqueKey] || "",
                  comment: parameterComments[uniqueKey] || "",
                });
              });
            },
          );
          return {
            device_id: test.device_id,
            test_id: test.test_id,
            rerun: parameterEditMode ? false : test.rerun,
            approve: false,
            approve_time: "null",
            dispatch: false,
            dispatch_time: "null",
            remarks: parameterRemarks || "",
            verified_by,
            parameters,
          };
        } else {
          return {
            device_id: test.device_id,
            test_id: test.test_id,
            test_code: test.test_code,
            value: values[test.testname] || "",
            remarks: remarks[test.testname] || "",
            comment: comments[test.testname] || "",
            rerun: editMode[test.testname] ? false : test.rerun,
            approve: false,
            approve_time: "null",
            dispatch: false,
            dispatch_time: "null",
            verified_by,
          };
        }
      });

      const payload = {
        date,
        barcode,
        locationId,
        testdetails: testDetailsData,
        processed_records: processedRecords,
      };
      const postResult = await apiRequest(
        `${Labbaseurl}test-value/save/`,
        "POST",
        payload,
      );

      if (postResult.success) {
        alert(postResult.data.message || "Test details saved successfully!");
        fetchTestDetails(barcode, null, testName);
        setEditMode({});
        setParameterEditMode(false);
        setTimeout(() => handleBack(), 1000);
      } else {
        alert(postResult.error || "Failed to save test details.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("An error occurred while saving test details. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/PatientDetails", {
      state: {
        barcode: location.state?.barcode,
        fromDate: location.state?.fromDate || new Date(),
        toDate: location.state?.toDate || new Date(),
      },
    });
  };

  // ── Render helpers ────────────────────────────────────────────────────────

  const isParamDisabled = (param, uniqueKey, testId) => {
    // test_id 429 — all params always editable, machine value is just pre-filled
    if (testId === 429) return false;
    if (ALL_CALCULATED_FIELDS.includes(param.test_code)) return false;
    if (ALWAYS_EDITABLE_FIELDS.includes(param.test_code)) return false;
    return !!(
      initialValues[uniqueKey] && initialValues[uniqueKey].trim() !== ""
    );
  };

  if (loading) {
    return (
      <Container>
        <GlobalStyle />
        <div>Loading test details...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <GlobalStyle />
        <div
          style={{
            color: "red",
            padding: "1rem",
            backgroundColor: "#ffe6e6",
            borderRadius: "8px",
          }}
        >
          <strong>Error:</strong> {error}
          <br />
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: "1rem" }}
          >
            Retry
          </button>
        </div>
      </Container>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Container>
      <GlobalStyle />
      <Header>
        <Title>Test Details</Title>
        <BackButton onClick={handleBack}>
          <ArrowLeft size={18} />
          Back to Patient Details
        </BackButton>
      </Header>

      {patientId && (
        <PatientInfoBar>
          <InfoItem>
            <span>Patient ID:</span> {patientId}
          </InfoItem>
          {patientname && (
            <InfoItem>
              <span>Patient Name:</span> {patientname}
            </InfoItem>
          )}
          {age && (
            <InfoItem>
              <span>Age:</span> {age}
            </InfoItem>
          )}
          {/* NEW: show gender if present */}
          {gender && (
            <InfoItem>
              <span>Gender:</span> {gender}
            </InfoItem>
          )}
          {date && (
            <InfoItem>
              <span>Date:</span> {date}
            </InfoItem>
          )}
          {barcode && (
            <InfoItem>
              <span>Barcode:</span> {barcode}
            </InfoItem>
          )}
          {locationId && (
            <InfoItem>
              <span>From:</span> {locationId}
            </InfoItem>
          )}
        </PatientInfoBar>
      )}

      {testDetails.length === 0 ? (
        <NoData>
          No test details available for the selected patient.
          <br />
          <small style={{ marginTop: "1rem", display: "block" }}>
            Barcode: {barcode} | Test Name: {testName || "All tests"}
          </small>
        </NoData>
      ) : (
        <Form onSubmit={handleSubmit}>
          {testDetails.map((test, index) => (
            <TestCard key={index}>
              <TestHeader>{test.testname}</TestHeader>
              <TestContent>
                {!test.parametersBySubtitle ||
                Object.keys(test.parametersBySubtitle).length === 0 ? (
                  // ── Single-value test ────────────────────────────────────
                  <>
                    <FormRow>
                      <FormGroup>
                        <Label>Specimen Type</Label>
                        <Input
                          type="text"
                          value={test.specimen_type || ""}
                          disabled
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Unit</Label>
                        <Input type="text" value={test.unit || ""} disabled />
                      </FormGroup>
                      <FormGroup>
                        <Label>Reference Range</Label>
                        <Input
                          type="text"
                          value={test.reference_range || ""}
                          disabled
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Method</Label>
                        <Input type="text" value={test.method || ""} disabled />
                      </FormGroup>
                    </FormRow>

                    <FormRow>
                      <FormGroup>
                        <Label>
                          Value{" "}
                          {(!initialValues[test.testname] ||
                            initialValues[test.testname].trim() === "") && (
                            <span style={{ color: "red" }}>*</span>
                          )}
                        </Label>
                        {test.value_option && test.value_option.length > 0 ? (
                          !initialValues[test.testname] ||
                          initialValues[test.testname].trim() === "" ? (
                            <SelectWrapper>
                              <Select
                                value={values[test.testname] || ""}
                                onChange={(e) =>
                                  handleValueChange(test.testname, e)
                                }
                              >
                                <option value="">Select value</option>
                                {test.value_option.map((option, optIndex) => (
                                  <option key={optIndex} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </Select>
                              <SelectIcon size={18} />
                            </SelectWrapper>
                          ) : (
                            <Input
                              type="text"
                              value={values[test.testname] || ""}
                              disabled
                              placeholder="Value available"
                            />
                          )
                        ) : (
                          <Input
                            type="text"
                            value={values[test.testname] || ""}
                            onChange={
                              !initialValues[test.testname] ||
                              initialValues[test.testname].trim() === ""
                                ? (e) => handleValueChange(test.testname, e)
                                : undefined
                            }
                            disabled={
                              !!(
                                initialValues[test.testname] &&
                                initialValues[test.testname].trim() !== ""
                              )
                            }
                            placeholder={
                              !initialValues[test.testname] ||
                              initialValues[test.testname].trim() === ""
                                ? "Enter value"
                                : "Value available"
                            }
                          />
                        )}
                      </FormGroup>
                    </FormRow>

                    {/* Critical indicator for single-value test — reads from
                         criticalKeys (debounced) not values (live), so the badge
                         and red border only appear after typing settles. */}
                    {(() => {
                      const critical = !!criticalKeys[test.testname];
                      return (
                        <CommentBox>
                          <CommentLabel>
                            Comments (Optional)
                            {critical && (
                              <CriticalBadge>⚠ Critical</CriticalBadge>
                            )}
                          </CommentLabel>
                          <CommentTextArea
                            isCritical={critical}
                            value={comments[test.testname] || ""}
                            onChange={(e) =>
                              handleCommentChange(test.testname, e)
                            }
                            placeholder="Add any comments or observations..."
                          />
                        </CommentBox>
                      );
                    })()}

                    {(!initialValues[test.testname] ||
                      initialValues[test.testname].trim() === "") &&
                      values[test.testname] &&
                      values[test.testname].trim() !== "" && (
                        <RemarksSection>
                          <FormGroup>
                            <Label>
                              Remarks (Required for edited values){" "}
                              <span style={{ color: "red" }}>*</span>
                            </Label>
                            <TextArea
                              value={remarks[test.testname] || ""}
                              onChange={(e) =>
                                handleRemarksChange(test.testname, e)
                              }
                              placeholder="Enter remarks (required)"
                              style={{
                                borderColor:
                                  !remarks[test.testname] ||
                                  remarks[test.testname].trim() === ""
                                    ? "red"
                                    : undefined,
                              }}
                            />
                          </FormGroup>
                        </RemarksSection>
                      )}
                  </>
                ) : (
                  // ── Parameter test ───────────────────────────────────────
                  <ParameterSection>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <ParameterTitle>
                        Parameters (
                        {Object.values(test.parametersBySubtitle).flat().length}
                        )
                      </ParameterTitle>
                    </div>

                    <FormRow style={{ marginBottom: "1.5rem" }}>
                      <FormGroup>
                        <Label>Specimen Type</Label>
                        <Input
                          type="text"
                          value={test.specimen_type || ""}
                          disabled
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Department</Label>
                        <Input
                          type="text"
                          value={test.department || ""}
                          disabled
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>NABL</Label>
                        <Input
                          type="text"
                          value={test.NABL ? "Yes" : "No"}
                          disabled
                        />
                      </FormGroup>
                    </FormRow>

                    {Object.entries(test.parametersBySubtitle).map(
                      ([subtitle, parameters], subtitleIndex) => (
                        <SubtitleSection key={subtitleIndex}>
                          <SubtitleHeader>{subtitle}</SubtitleHeader>
                          <ParameterGrid>
                            {parameters.map((param, paramIndex) => {
                              const paramName = param.name || param.test_name;
                              const uniqueKey = `${test.testname}_${paramName}`;
                              const hasValueOptions =
                                param.value_option &&
                                param.value_option.length > 0;
                              const disabled = isParamDisabled(
                                param,
                                uniqueKey,
                                test.test_id,
                              );
                              const isAlwaysEditable =
                                ALWAYS_EDITABLE_FIELDS.includes(
                                  param.test_code,
                                ) || test.test_id === 429;

                              // Critical reads from criticalKeys (debounced) not values (live)
                              const critical = !!criticalKeys[uniqueKey];

                              return (
                                <ParameterCard key={paramIndex}>
                                  <FormRow>
                                    <FormGroup>
                                      <Label>Parameter Name</Label>
                                      <WrappedInput
                                        as="textarea"
                                        value={paramName}
                                        disabled
                                        style={{ resize: "none" }}
                                      />
                                    </FormGroup>

                                    <FormGroup>
                                      <Label>
                                        Value{" "}
                                        {!disabled && (
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        )}
                                        {isAlwaysEditable && (
                                          <span
                                            style={{
                                              color: "var(--secondary)",
                                              fontSize: "0.75rem",
                                              marginLeft: "0.4rem",
                                            }}
                                          >
                                            (editable)
                                          </span>
                                        )}
                                      </Label>
                                      {hasValueOptions && !disabled ? (
                                        <SelectWrapper>
                                          <Select
                                            value={values[uniqueKey] || ""}
                                            onChange={(e) =>
                                              handleParameterValueChange(
                                                test.testname,
                                                paramName,
                                                e,
                                              )
                                            }
                                          >
                                            <option value="">
                                              Select value
                                            </option>
                                            {param.value_option.map(
                                              (option, optIndex) => (
                                                <option
                                                  key={optIndex}
                                                  value={option}
                                                >
                                                  {option}
                                                </option>
                                              ),
                                            )}
                                          </Select>
                                          <SelectIcon size={18} />
                                        </SelectWrapper>
                                      ) : (
                                        <Input
                                          type="text"
                                          value={values[uniqueKey] || ""}
                                          onChange={
                                            !disabled
                                              ? (e) =>
                                                  handleParameterValueChange(
                                                    test.testname,
                                                    paramName,
                                                    e,
                                                  )
                                              : undefined
                                          }
                                          disabled={disabled}
                                          placeholder={
                                            !disabled
                                              ? "Enter value"
                                              : "Value available"
                                          }
                                          // NEW: highlight input red if critical
                                          style={
                                            critical
                                              ? {
                                                  borderColor: "var(--danger)",
                                                  backgroundColor: "#fff5f5",
                                                }
                                              : {}
                                          }
                                        />
                                      )}
                                    </FormGroup>

                                    <FormGroup>
                                      <Label>Unit</Label>
                                      <Input
                                        type="text"
                                        value={param.unit || ""}
                                        disabled
                                      />
                                    </FormGroup>

                                    <FormGroup>
                                      <Label>Reference Range</Label>
                                      <Input
                                        type="text"
                                        value={param.reference_range || ""}
                                        disabled
                                      />
                                    </FormGroup>

                                    <FormGroup>
                                      <Label>Method</Label>
                                      <Input
                                        type="text"
                                        value={param.method || ""}
                                        disabled
                                      />
                                    </FormGroup>
                                  </FormRow>

                                  {/* NEW: Critical badge + red comment box for parameter */}
                                  <CommentBox>
                                    <CommentLabel>
                                      Comments (Optional)
                                      {critical && (
                                        <CriticalBadge>
                                          ⚠ Critical
                                        </CriticalBadge>
                                      )}
                                    </CommentLabel>
                                    <CommentTextArea
                                      isCritical={critical}
                                      value={parameterComments[uniqueKey] || ""}
                                      onChange={(e) =>
                                        handleParameterCommentChange(
                                          test.testname,
                                          paramName,
                                          e,
                                        )
                                      }
                                      placeholder="Add any comments or observations for this parameter..."
                                    />
                                  </CommentBox>
                                </ParameterCard>
                              );
                            })}
                          </ParameterGrid>
                        </SubtitleSection>
                      ),
                    )}

                    {Object.values(test.parametersBySubtitle)
                      .flat()
                      .some((param) => {
                        const paramName = param.name || param.test_name;
                        const uniqueKey = `${test.testname}_${paramName}`;
                        const initialValue = initialValues[uniqueKey];
                        const currentValue = values[uniqueKey];
                        return (
                          (!initialValue || initialValue.trim() === "") &&
                          currentValue &&
                          currentValue.trim() !== ""
                        );
                      }) && (
                      <RemarksSection>
                        <FormGroup>
                          <Label>
                            Parameter Remarks (Required for edited parameters){" "}
                            <span style={{ color: "red" }}>*</span>
                          </Label>
                          <TextArea
                            value={parameterRemarks || ""}
                            onChange={handleParameterRemarksChange}
                            placeholder="Enter remarks for edited parameters (required)"
                            style={{
                              borderColor:
                                !parameterRemarks ||
                                parameterRemarks.trim() === ""
                                  ? "red"
                                  : undefined,
                            }}
                          />
                        </FormGroup>
                      </RemarksSection>
                    )}
                  </ParameterSection>
                )}
              </TestContent>
            </TestCard>
          ))}

          <ButtonContainer>
            <SaveButton type="submit" disabled={!isSaveButtonEnabled()}>
              <Save size={18} />
              {isSubmitting ? "Saving..." : "Save Test Details"}
            </SaveButton>
          </ButtonContainer>
        </Form>
      )}
    </Container>
  );
}

export default TestDetails;
