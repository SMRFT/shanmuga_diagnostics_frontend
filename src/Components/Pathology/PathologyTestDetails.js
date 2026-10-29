import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { ArrowLeft, Save, ChevronDown, History, User, Tag, FileText, FlaskConical, AlertCircle, CheckCircle2, Clock, Building, Plus, X as CloseIcon } from "lucide-react";
import apiRequest from "../Auth/apiRequest";

const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #a777e3; --primary-light: #c3abef; --secondary: #8b5cf6;
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
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0.75rem 1rem 1.5rem;
  @media (max-width: 768px) {
    padding: 0.5rem 0.5rem 1.25rem;
  }
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;
const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
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
    box-shadow: 0 0 0 3px rgba(167, 119, 227, 0.3);
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
  background-color: #a777e3;
  color: white;
  padding: 0.45rem 1.15rem;
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(167, 119, 227, 0.3);

  &:hover:not(:disabled) {
    background-color: #8b5cf6;
    box-shadow: 0 4px 10px rgba(167, 119, 227, 0.4);
  }

  &:disabled {
    background-color: var(--gray-light);
    color: var(--gray);
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
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
  background: linear-gradient(135deg, #a777e3 0%, #8b5cf6 100%);
  color: white;
  padding: 0.75rem 1rem;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.3px;
  border-radius: 8px 8px 0 0;
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
    box-shadow: 0 0 0 3px rgba(167, 119, 227, 0.1);
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
    box-shadow: 0 0 0 3px rgba(167, 119, 227, 0.1);
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
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 0.75rem 1.15rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
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
  background: linear-gradient(135deg, #a777e3 0%, #8b5cf6 100%);
  color: white;
  padding: 0.6rem 0.85rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 0.3px;
  margin-bottom: 0.75rem;
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
    box-shadow: 0 0 0 3px rgba(167, 119, 227, 0.1);
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

const MultiSelect = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  background-color: white;
  cursor: pointer;
  min-height: 100px;
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(167, 119, 227, 0.1);
  }
  &:disabled {
    background-color: var(--gray-light);
    cursor: not-allowed;
  }
`;
const InterpretationSection = styled.div`
  margin-bottom: 1.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  overflow: hidden;
`;
const InterpretationTitle = styled.div`
  background: linear-gradient(135deg, var(--secondary), var(--primary));
  color: white;
  padding: 0.6rem 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;
const InterpretationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  th {
    background-color: #f0f3ff;
    color: var(--secondary);
    padding: 0.6rem 1rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 1px solid var(--gray-light);
    border-right: 1px solid var(--gray-light);
    &:last-child {
      border-right: none;
    }
  }
  td {
    padding: 0.55rem 1rem;
    border-bottom: 1px solid var(--gray-light);
    border-right: 1px solid var(--gray-light);
    vertical-align: middle;
    &:last-child {
      border-right: none;
    }
  }
  tr:last-child td {
    border-bottom: none;
  }
  tr:nth-child(even) td {
    background-color: #fafbff;
  }
`;

const LodTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  th {
    background-color: #f0f3ff;
    color: var(--secondary);
    padding: 0.6rem 1rem;
    text-align: center;
    font-weight: 600;
    border: 1px solid var(--gray-light);
  }
  th.sample-header {
    background-color: #f0f3ff;
    text-align: left;
  }
  th.group-header {
    background-color: #e8ecff;
    text-align: center;
    font-size: 0.8rem;
  }
  td {
    padding: 0.55rem 1rem;
    border: 1px solid var(--gray-light);
    vertical-align: middle;
    text-align: center;
  }
  td.sample-cell {
    text-align: left;
    font-weight: 600;
    background-color: #fafbff;
  }
  tr:hover td {
    background-color: #f0f3ff;
  }
  tr:hover td.sample-cell {
    background-color: #e8ecff;
  }
`;

const HLBadge = styled.span`
  display: inline-block;
  padding: 0.1rem 0.45rem;
  margin-left: 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  vertical-align: middle;
  animation: blink 1s step-start infinite;

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  ${({ direction }) =>
    direction === "H"
      ? `background-color: #fff0f0; color: var(--danger); border: 1px solid var(--danger);`
      : `background-color: #fff8ec; color: var(--warning); border: 1px solid var(--warning);`}
`;

// Returns "H", "L", or null
const getHLFlag = (value, referenceRange) => {
  if (!referenceRange || !value) return null;
  const num = parseFloat(value);
  if (isNaN(num)) return null;
  const ref = referenceRange.trim();
  // Skip complex ranges
  if (ref.includes(":") || ref.includes(",")) return null;
  const rangeMatch = ref.match(/^([0-9.]+)\s*-\s*([0-9.]+)$/);
  if (rangeMatch) {
    if (num < parseFloat(rangeMatch[1])) return "L";
    if (num > parseFloat(rangeMatch[2])) return "H";
    return null;
  }
  const ltMatch = ref.match(/^<=?\s*([0-9.]+)$/);
  if (ltMatch) return num > parseFloat(ltMatch[1]) ? "H" : null;
  const gtMatch = ref.match(/^>=?\s*([0-9.]+)$/);
  if (gtMatch) return num < parseFloat(gtMatch[1]) ? "L" : null;
  return null;
};
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
  "TestCode 133",
];

const ALWAYS_EDITABLE_FIELDS = ["PT-CNTL", "PT-ISI", "APTT-C"];

const DEFAULT_FIELD_VALUES = {
  "PT-CNTL": "13.7",
  "PT-ISI": "1.1",
  "APTT-C": "25.0",
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

// ─── Normalize "neg" variants to "Negative" ──────────────────────────────────
const normalizeDisplayValue = (value) => {
  if (typeof value === "string" && value.trim().toLowerCase() === "neg") {
    return "Negative";
  }
  return value;
};

const formatApiValue = (value) => {
  if (!value && value !== 0) return value;
  const num = parseFloat(value);
  if (isNaN(num)) return value; // keep string values as-is

  // Only format if it has more than 3 decimal places
  const str = String(value).trim();
  const decimalIndex = str.indexOf(".");
  if (decimalIndex !== -1 && str.length - decimalIndex - 1 > 3) {
    return num.toFixed(3);
  }
  return str; // return as-is if 0, 1, or 2 decimal places
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

// ─── Normal range checker ─────────────────────────────────────────────────────
/**
 * Returns:
 *   true  → value is within normal range (safe to auto-approve)
 *   false → value is outside normal range
 *   null  → range is complex/descriptive and cannot be evaluated (skip auto-approve)
 *
 * Handles formats:
 *   "13.0 - 17.5"   → numeric range
 *   "<2"  / "<=2"   → upper bound only
 *   ">5"  / ">=5"   → lower bound only
 *   ""    / null    → no range defined → treat as normal (true)
 *   "Normal : 4.0 - 6.0, Good Control : ..." → complex → null (skip)
 */
const isWithinNormalRange = (value, referenceRange) => {
  // No range defined at all → cannot judge → skip auto-approve
  if (!referenceRange || referenceRange.trim() === "") return null; // ← was: return true

  const ref = referenceRange.trim();

  // Detect complex/descriptive ranges
  if (ref.includes(":") || ref.includes(",")) return null;

  const num = parseFloat(value);
  if (isNaN(num)) return false; // non-numeric value → skip

  // Format: "13.0 - 17.5"
  const rangeMatch = ref.match(/^([0-9.]+)\s*-\s*([0-9.]+)$/);
  if (rangeMatch) {
    return num >= parseFloat(rangeMatch[1]) && num <= parseFloat(rangeMatch[2]);
  }

  // Format: "<2" or "<=2"
  const ltMatch = ref.match(/^<=?\s*([0-9.]+)$/);
  if (ltMatch) return num <= parseFloat(ltMatch[1]);

  // Format: ">5" or ">=5"
  const gtMatch = ref.match(/^>=?\s*([0-9.]+)$/);
  if (gtMatch) return num >= parseFloat(gtMatch[1]);

  // Anything else unparseable → skip auto-approve
  return null;
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

  if (currentTest.test_id === 498 || currentTest.test_id === 551) {
    // Support both RANDOX and BS240 test codes
    const cholesterol =
      valuesByTestCode["13"] || valuesByTestCode["Total Cholesterol"] || 0;

    const triglycerides =
      valuesByTestCode["14"] || valuesByTestCode["Triglycerides"] || 0;

    const hdl =
      valuesByTestCode["15"] || valuesByTestCode["HDL-Cholesterol"] || 0;

    // Check if LDL Direct has a value from the machine
    const ldlDirectRaw =
      valuesByTestCode["18"] || valuesByTestCode["LDL-Cholesterol"] || 0;

    // If LDL Direct is missing/zero, calculate via Friedewald formula
    const ldlDirectParam = allParams.find(
      (p) => p.test_code === "18" || p.test_code === "LDL-Cholesterol",
    );
    const ldlDirectKey = ldlDirectParam
      ? `${testname}_${ldlDirectParam.name || ldlDirectParam.test_name}`
      : null;

    let ldlDirect = ldlDirectRaw;

    if (
      ldlDirectKey &&
      (!ldlDirectRaw || ldlDirectRaw === 0) &&
      cholesterol &&
      hdl &&
      triglycerides &&
      !manuallyEdited[ldlDirectKey]
    ) {
      // Friedewald: LDL = Total Cholesterol - HDL - (TGL / 5)
      const friedewald = cholesterol - hdl - triglycerides / 5;
      newValues[ldlDirectKey] = friedewald.toFixed(2);
      ldlDirect = friedewald;
    }

    // NON-HDL = Total Cholesterol - HDL
    const nonHdlParam = allParams.find((p) => p.test_code === "TESTCODE001");
    if (nonHdlParam && cholesterol && hdl) {
      const k = `${testname}_${nonHdlParam.name || nonHdlParam.test_name}`;
      if (!manuallyEdited[k]) newValues[k] = (cholesterol - hdl).toFixed(2);
    }

    // Cholesterol / HDL Ratio
    const ratioParam = allParams.find((p) => p.test_code === "TESTCODE002");
    if (ratioParam && cholesterol && hdl) {
      const k = `${testname}_${ratioParam.name || ratioParam.test_name}`;
      if (!manuallyEdited[k]) newValues[k] = (cholesterol / hdl).toFixed(2);
    }

    // VLDL = TGL / 5
    const vldlParam = allParams.find((p) => p.test_code === "TESTCODE003");
    if (vldlParam && triglycerides) {
      const k = `${testname}_${vldlParam.name || vldlParam.test_name}`;
      if (!manuallyEdited[k]) newValues[k] = (triglycerides / 5).toFixed(2);
    }

    // LDL / HDL Ratio — uses actual or Friedewald-calculated LDL
    const ldlRatioParam = allParams.find((p) => p.test_code === "TESTCODE004");
    if (ldlRatioParam && ldlDirect && hdl) {
      const k = `${testname}_${ldlRatioParam.name || ldlRatioParam.test_name}`;
      if (!manuallyEdited[k]) newValues[k] = (ldlDirect / hdl).toFixed(2);
    }
  }

  if (currentTest.test_id === 196 || currentTest.test_id === 550) {
    // Support both RANDOX and BS240 test codes
    const totalProtein =
      valuesByTestCode["26"] || valuesByTestCode["Total Protein"] || 0;

    const albumin = valuesByTestCode["06"] || valuesByTestCode["Albumin"] || 0;

    const bilirubinTotal =
      valuesByTestCode["07"] ||
      valuesByTestCode["Bilirubin Total (DSA Method)"] ||
      0;

    const bilirubinDirect =
      valuesByTestCode["24"] ||
      valuesByTestCode["Bilirubin Direct (DSA Method)"] ||
      0;

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
    const bilirubinDirect = valuesByTestCode["24"] || 0;
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
    const hba1c = valuesByTestCode["ValueHbA1c"] || 0;
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
  if (currentTest.test_id === 517) {
    const iron = valuesByTestCode["Iron"] || 0;
    const uibc = valuesByTestCode["Unsaturated Iron Binding Capacity"] || 0;
    const tibcParam = allParams.find((p) => p.test_code === "TestCode 133");
    if (tibcParam && iron && uibc) {
      const k = `${testname}_${tibcParam.name || tibcParam.test_name}`;
      if (!manuallyEdited[k]) newValues[k] = (iron + uibc).toFixed(2);
    }
  }

  return newValues;
};

const MultiSelectDropdown = ({ options, value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = React.useRef(null);
  const optionRefs = React.useRef([]);

  const selected = value
    ? value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
    : [];

  const toggleOption = (option) => {
    const updated = selected.includes(option)
      ? selected.filter((s) => s !== option)
      : [...selected, option];
    onChange(updated.join(", "));
  };

  const removeOption = (option) => {
    const updated = selected.filter((s) => s !== option);
    onChange(updated.join(", "));
  };

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll focused option into view
  React.useEffect(() => {
    if (focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex].scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  const handleTriggerKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
      setFocusedIndex(-1);
    }
  };

  const handleDropdownKeyDown = (e) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0) {
        toggleOption(options[focusedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setFocusedIndex(-1);
    } else if (e.key === "Tab") {
      setOpen(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <div
      ref={ref}
      style={{ position: "relative" }}
      onKeyDown={handleDropdownKeyDown}
    >
      {/* Trigger */}
      <div
        tabIndex={disabled ? -1 : 0}
        data-focusable="true"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        style={{
          minHeight: "42px",
          padding: "0.4rem 2rem 0.4rem 0.75rem",
          border: "1px solid var(--gray-light)",
          borderRadius: "var(--border-radius)",
          fontSize: "1rem",
          backgroundColor: disabled ? "var(--gray-light)" : "white",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.35rem",
          alignItems: "center",
          position: "relative",
          outline: "none",
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(167, 119, 227,0.1)";
          e.currentTarget.style.borderColor = "var(--primary)";
        }}
        onBlur={(e) => {
          // only blur-style if focus left the whole dropdown
          if (!ref.current?.contains(e.relatedTarget)) {
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.borderColor = "var(--gray-light)";
          }
        }}
      >
        {selected.length === 0 && (
          <span style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
            Select value(s)
          </span>
        )}
        {selected.map((s) => (
          <span
            key={s}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              backgroundColor: "var(--primary)",
              color: "white",
              borderRadius: "4px",
              padding: "0.1rem 0.5rem",
              fontSize: "0.8rem",
            }}
          >
            {s}
            {!disabled && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(s);
                }}
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginLeft: "2px",
                }}
              >
                ×
              </span>
            )}
          </span>
        ))}
        <ChevronDown
          size={16}
          style={{
            position: "absolute",
            right: "0.5rem",
            top: "50%",
            transform: open
              ? "translateY(-50%) rotate(180deg)"
              : "translateY(-50%)",
            color: "var(--gray)",
            pointerEvents: "none",
            transition: "transform 0.2s",
          }}
        />
      </div>

      {/* Dropdown list */}
      {open && !disabled && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid var(--gray-light)",
            borderRadius: "var(--border-radius)",
            zIndex: 999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {options.map((option, idx) => {
            const isSelected = selected.includes(option);
            const isFocused = focusedIndex === idx;
            return (
              <div
                key={option}
                ref={(el) => (optionRefs.current[idx] = el)}
                onClick={() => toggleOption(option)}
                style={{
                  padding: "0.6rem 0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: isFocused
                    ? "#dde3fb"
                    : isSelected
                      ? "#eef1fd"
                      : "white",
                  color: isSelected ? "var(--primary)" : "var(--dark)",
                  fontWeight: isSelected ? "600" : "400",
                  fontSize: "0.95rem",
                  borderBottom: "1px solid var(--gray-light)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: `2px solid ${isSelected ? "var(--primary)" : "var(--gray)"}`,
                    borderRadius: "3px",
                    backgroundColor: isSelected ? "var(--primary)" : "white",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {isSelected && (
                    <span
                      style={{
                        color: "white",
                        fontSize: "11px",
                        lineHeight: 1,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </span>
                {option}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
// ─── Component ────────────────────────────────────────────────────────────────

const QUICK_CHIPS = {
  RBC: [
    "Normocytic Normochromic.",
    "Microcytic Hypochromic.",
    "Macrocytic.",
    "Dimorphic anemia.",
    "Anisopoikilocytosis seen.",
  ],
  WBC: [
    "Total count is within normal limits.",
    "Leukocytosis with neutrophilia.",
    "Leukopenia.",
    "Normal morphology.",
    "Toxic granules seen.",
  ],
  PLATELETS: [
    "Adequate on smear. No hemoparasites seen.",
    "Adequate on smear.",
    "Reduced on smear.",
    "Adequate in number, morphology normal.",
    "Giant platelets seen.",
  ],
  IMPRESSION: [
    "Normocytic Normochromic blood picture.",
    "Microcytic Hypochromic blood picture.",
    "Dimorphic anemia.",
    "Normal study.",
    "Kindly correlate clinically.",
  ],
};


// ── Modern Responsive UI Styled Components ──
const PatientCard = styled.div`
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  margin-bottom: 0.85rem;
`;

const PatientCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const PatientIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const PatientNameTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PillBadge = styled.span`
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

const PatientDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.65rem 1rem;
  padding: 0.75rem 1rem;
  background: #ffffff;
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const GridLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const GridValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
`;

const StickyActionBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
  border-top: 1px solid #cbd5e1;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  padding: 0.85rem 2rem;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const ChipButton = styled.button`
  padding: 0.3rem 0.65rem;
  font-size: 0.78rem;
  font-weight: 500;
  background-color: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  &:hover {
    background-color: #e2e8f0;
    color: #0f172a;
    border-color: #94a3b8;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
    background-color: #cbd5e1;
  }
`;

function PathologyTestDetails() {
  const [testDetails, setTestDetails] = useState([]);
  const [labId, setLabId] = useState("");
  const [values, setValues] = useState({});
  const [differentialTests, setDifferentialTests] = useState({});

  const handleDifferentialValueChange = (testname, index, field, newValue) => {
    setDifferentialTests((prev) => {
      const current = prev[testname]
        ? [...prev[testname]]
        : [
          { id: 1, name: "Polymorphs", value: "" },
          { id: 2, name: "Lymphocytes", value: "" },
          { id: 3, name: "Eosinophils", value: "" },
          { id: 4, name: "Monocytes", value: "" },
          { id: 5, name: "Basophils", value: "" },
        ];
      current[index] = { ...current[index], [field]: newValue };
      return { ...prev, [testname]: current };
    });
  };

  const handleAddDifferentialRow = (testname) => {
    setDifferentialTests((prev) => {
      const current = prev[testname]
        ? [...prev[testname]]
        : [
          { id: 1, name: "Polymorphs", value: "" },
          { id: 2, name: "Lymphocytes", value: "" },
          { id: 3, name: "Eosinophils", value: "" },
          { id: 4, name: "Monocytes", value: "" },
          { id: 5, name: "Basophils", value: "" },
        ];
      return {
        ...prev,
        [testname]: [...current, { id: Date.now(), name: "", value: "" }],
      };
    });
  };

  const handleRemoveDifferentialRow = (testname, index) => {
    setDifferentialTests((prev) => {
      const current = prev[testname] ? [...prev[testname]] : [];
      const updated = current.filter((_, i) => i !== index);
      return { ...prev, [testname]: updated };
    });
  };

  const handleParameterValueChange = (testname, paramName, eventOrValue) => {
    const value =
      eventOrValue && eventOrValue.target !== undefined
        ? eventOrValue.target.value
        : eventOrValue;
    const uniqueKey = `${testname}_${paramName}`;
    setValues((prevValues) => ({ ...prevValues, [uniqueKey]: value }));
  };
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
  // stores { uniqueKey: { low, high } } for each param / test
  const [criticalRanges, setCriticalRanges] = useState({});
  // Set of keys that are CONFIRMED critical after debounce settles.
  // The badge, red border, and comment auto-fill all read from this —
  // never directly from values — so mid-type intermediates never show.
  const [criticalKeys, setCriticalKeys] = useState({});
  // Debounce timers for critical-value detection — one timer per field key.
  // Critical comment is only auto-filled after the user stops typing for 600 ms,
  // so typing "400" does not trigger on "4" or "40".
  const criticalTimers = React.useRef({});
  // Tracks which comment keys were auto-filled by the critical check.
  // If the user manually edits the comment, it is removed from this set
  // so we never auto-clear a comment the user intentionally wrote.
  const autoCriticalComments = React.useRef(new Set());

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get("date");
  const patientId = queryParams.get("patient_id");
  const patientname = queryParams.get("patientname");
  const age = queryParams.get("age");
  const gender = queryParams.get("gender"); // NEW: read gender from URL
  const barcode = queryParams.get("barcode");
  const phone = queryParams.get("phone"); // NEW
  const ref_doctor = queryParams.get("ref_doctor"); // NEW
  const barcode_by = queryParams.get("barcode_by"); // NEW
  const barcode_date = queryParams.get("barcode_date"); // NEW
  const locationId = queryParams.get("locationId");
  const testId = queryParams.get("test_id");
  const testName = queryParams.get("test_name");
  const navigate = useNavigate();
  const verified_by = localStorage.getItem("name") || "";
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [specimenSelections, setSpecimenSelections] = useState({});

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

      let response = await apiRequest(
        `${Labbaseurl}pathology-compare-test-details/?${qp}`,
        "GET",
      );
      if (!response.success && response.status === 404) {
        response = await apiRequest(
          `${Labbaseurl}compare_test_details/?${qp}`,
          "GET",
        );
      }

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

      const fetchedLabId = actualResponse.lab_id || (actualResponse.data && Array.isArray(actualResponse.data) ? (actualResponse.data.find((t) => t.lab_id)?.lab_id || "") : "");
      if (fetchedLabId) {
        setLabId(fetchedLabId);
      }

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
            device_id: "",
            test_id: test.test_id,
            test_code: test.test_code,
            department: test.department,
            NABL: test.NABL,
            specimen_type: test.specimen_type || "",
            method: test.method,
            sample_status: test.sample_status,
            parametersBySubtitle: {},
            saved_param_values: test.saved_param_values || {},
            differential_items: test.differential_items || [],
            test_value: test.test_value || test.value || test.report || "",
            remarks: test.remarks || "",
            comment: test.comment || "",
          };
        }

        if (Array.isArray(test.parameters) && test.parameters.length > 0) {
          test.parameters.forEach((param) => {
            const subtitle = param.sub_title || "BLOOD FILM MORPHOLOGY";
            if (!groupedTests[tName].parametersBySubtitle[subtitle]) {
              groupedTests[tName].parametersBySubtitle[subtitle] = [];
            }
            const pName = param.test_name || param.name || param.parameter_name;
            const alreadyExists = groupedTests[tName].parametersBySubtitle[subtitle].some(
              (p) => (p.name || p.test_name) === pName
            );
            if (!alreadyExists) {
              groupedTests[tName].parametersBySubtitle[subtitle].push({
                name: pName,
                test_name: pName,
                test_code: param.test_code,
                sub_title: subtitle,
                value: (test.saved_param_values && (test.saved_param_values[pName] || test.saved_param_values[pName.toUpperCase()])) || param.value || "",
              });
            }
          });
        }

        if (
          test.parameter_name &&
          test.parameter_name !== null &&
          test.parameter_name !== "N/A"
        ) {
          const subtitle = test.sub_title || "BLOOD FILM MORPHOLOGY";
          if (!groupedTests[tName].parametersBySubtitle[subtitle]) {
            groupedTests[tName].parametersBySubtitle[subtitle] = [];
          }
          const alreadyExists = groupedTests[tName].parametersBySubtitle[subtitle].some(
            (p) => (p.name || p.test_name) === test.parameter_name
          );
          if (!alreadyExists) {
            groupedTests[tName].parametersBySubtitle[subtitle].push({
              name: test.parameter_name,
              test_name: test.parameter_name,
              test_code: test.test_code,
              sub_title: subtitle,
              value: test.test_value || "",
            });
          }
        }
      });

      const transformedTests = Object.values(groupedTests);
      setTestDetails(transformedTests);

      const defaultDiff = [
        { id: 1, name: "Polymorphs", value: "" },
        { id: 2, name: "Lymphocytes", value: "" },
        { id: 3, name: "Eosinophils", value: "" },
        { id: 4, name: "Monocytes", value: "" },
        { id: 5, name: "Basophils", value: "" },
      ];

      const initialDiff = {};
      const tempValues = {};
      const tempRemarks = {};
      const tempComments = {};

      transformedTests.forEach((test) => {
        if (test.differential_items && test.differential_items.length > 0) {
          initialDiff[test.testname] = test.differential_items.map((item, idx) => ({
            id: item.id || idx + 1,
            name: item.name || "",
            value: item.value || "",
          }));
        } else {
          initialDiff[test.testname] = defaultDiff;
        }

        if (
          test.parametersBySubtitle &&
          Object.keys(test.parametersBySubtitle).length > 0
        ) {
          Object.values(test.parametersBySubtitle)
            .flat()
            .forEach((param) => {
              const pName = param.name || param.test_name;
              const uniqueKey = `${test.testname}_${pName}`;
              const savedVal =
                (test.saved_param_values && (test.saved_param_values[pName] || test.saved_param_values[pName.toUpperCase()])) ||
                param.value ||
                "";
              tempValues[uniqueKey] = savedVal;

              if (
                pName.toLowerCase().includes("differential") &&
                savedVal &&
                (!test.differential_items || test.differential_items.length === 0)
              ) {
                const lines = savedVal.split("\n");
                const parsed = [];
                lines.forEach((l, idx) => {
                  if (l.includes(":")) {
                    const [n, v] = l.split(":");
                    parsed.push({
                      id: idx + 1,
                      name: (n || "").trim(),
                      value: (v || "").replace("%", "").trim(),
                    });
                  }
                });
                if (parsed.length > 0) {
                  initialDiff[test.testname] = parsed;
                }
              }
            });
        } else {
          tempValues[test.testname] = test.test_value || "";
        }

        if (test.remarks) tempRemarks[test.testname] = test.remarks;
        if (test.comment) tempComments[test.testname] = test.comment;
      });

      setDifferentialTests(initialDiff);
      setValues(tempValues);
      setRemarks(tempRemarks);
      setComments(tempComments);

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

  // ── Enter-key → next field ────────────────────────────────────────────────
  useEffect(() => {
    const handleEnterKey = (e) => {
      if (e.key !== "Enter") return;

      // If focus is ON a button, let it click naturally
      if (e.target.tagName === "BUTTON") return;

      e.preventDefault();

      const focusable = Array.from(
        document.querySelectorAll("[data-focusable='true']"),
      ).filter((el) => el.offsetParent !== null && !el.disabled);

      const currentIndex = focusable.indexOf(e.target);
      if (currentIndex !== -1 && currentIndex < focusable.length - 1) {
        focusable[currentIndex + 1].focus();
      }
    };

    document.addEventListener("keydown", handleEnterKey);
    return () => document.removeEventListener("keydown", handleEnterKey);
  }, []);
  // ── Handlers ──────────────────────────────────────────────────────────────

  const getMachineTestValue = (param, uniqueKey) => {
    const extractVal = (val) => {
      if (!val || typeof val !== "string") return "";
      const trimmed = val.trim();
      if (!trimmed) return "";
      const match = trimmed.match(/\(([^)]+)\)/);
      if (match && match[1].trim()) return match[1].trim();
      return trimmed;
    };

    // 1. Initial values from load (API test value)
    const initVal = initialValues[uniqueKey];
    if (initVal) {
      const extracted = extractVal(initVal);
      if (extracted) return extracted;
    }

    // 2. Direct param or test object value from API
    if (param?.value) {
      const extracted = extractVal(param.value);
      if (extracted) return extracted;
    }

    // 3. Current value state (if it has parenthesized value or is numeric)
    const currVal = values[uniqueKey];
    if (currVal && typeof currVal === "string") {
      const match = currVal.match(/\(([^)]+)\)/);
      if (match && match[1].trim()) return match[1].trim();
      if (/^-?\d+(\.\d+)?$/.test(currVal.trim())) {
        return currVal.trim();
      }
    }

    return "";
  };

  const mergeOptionWithValue = (option, machineVal) => {
    if (!option) return "";
    if (!machineVal || !String(machineVal).trim()) {
      return option.replace(/\s*\(\s*\)/g, "").trim();
    }
    const cleanVal = String(machineVal).trim();

    // 1. If option explicitly has empty parentheses like "Reactive ()"
    if (/\(\s*\)/.test(option)) {
      return option.replace(/\(\s*\)/, `(${cleanVal})`).trim();
    }

    // 2. If option already has parentheses with content like "Present (+)" or "Reactive (0.010)"
    if (/\([^)]+\)/.test(option)) {
      return option;
    }

    // 3. If option is purely numeric (e.g. "6.0", "7.5", "1.020"), do not append
    if (/^-?\d+(\.\d+)?$/.test(option.trim())) {
      return option.trim();
    }

    // 4. If machine value is identical to option (e.g. option="Nil", machineVal="Nil"), don't make it "Nil (Nil)"
    if (option.trim().toLowerCase() === cleanVal.toLowerCase()) {
      return option.trim();
    }

    // 5. Qualitative options like "Reactive", "Non - Reactive", "Positive", "Negative"
    return `${option.trim()} (${cleanVal})`;
  };

  const handleValueChange = (testname, event) => {
    let newVal = event.target.value;
    const currentTest = testDetails.find((t) => t.testname === testname);

    if (currentTest?.is_value_edit) {
      const machineVal = getMachineTestValue(null, testname);
      if (machineVal) {
        if (/\(\s*\)/.test(newVal)) {
          newVal = newVal.replace(/\(\s*\)/, `(${machineVal})`).trim();
        } else if (
          currentTest?.value_option &&
          currentTest.value_option.some(
            (opt) =>
              opt.replace(/\s*\(\s*\)/g, "").trim().toLowerCase() ===
              newVal.trim().toLowerCase(),
          )
        ) {
          newVal = mergeOptionWithValue(newVal, machineVal);
        }
      }
    }

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
          if (
            !prev[testname] ||
            prev[testname] ===
            "Critical, Rechecked, Kindly correlate clinically"
          ) {
            autoCriticalComments.current.add(testname);
            return {
              ...prev,
              [testname]: "Critical, Rechecked, Kindly correlate clinically",
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
    return !isSubmitting && !!(labId && labId.trim() !== "");
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!labId || labId.trim() === "") {
      alert("Lab ID is mandatory. Please enter a valid Lab ID before saving.");
      setIsSubmitting(false);
      return;
    }

    try {
      const approveTime = formatDateTime(new Date());

      const testDetailsData = testDetails.map((test) => {
        let parametersList = [];
        let differentialSummary = "";
        let activeDifferentialRows = [];

        if (
          test.parametersBySubtitle &&
          Object.keys(test.parametersBySubtitle).length > 0
        ) {
          const allParams = Object.values(test.parametersBySubtitle).flat();

          allParams.forEach((param) => {
            const pName = param.name || param.test_name;
            const uniqueKey = `${test.testname}_${pName}`;
            const isDiff = pName.toLowerCase().includes("differential");

            if (isDiff) {
              const diffRows = differentialTests[test.testname] || [
                { id: 1, name: "Polymorphs", value: "" },
                { id: 2, name: "Lymphocytes", value: "" },
                { id: 3, name: "Eosinophils", value: "" },
                { id: 4, name: "Monocytes", value: "" },
                { id: 5, name: "Basophils", value: "" },
              ];
              activeDifferentialRows = diffRows.filter(
                (r) => (r.name && r.name.trim()) || (r.value && r.value.trim())
              );
              differentialSummary = activeDifferentialRows
                .map((r) => `${r.name.trim()} : ${r.value.trim()} %`)
                .join("\n");

              parametersList.push({
                test_code: param.test_code || "",
                test_name: pName,
                parameter_name: pName,
                value: differentialSummary,
                differential_items: activeDifferentialRows,
              });
            } else {
              const val = values[uniqueKey] || "";
              parametersList.push({
                test_code: param.test_code || "",
                test_name: pName,
                parameter_name: pName,
                value: val,
              });
            }
          });
        }

        let reportParts = [];
        const rbcVal = values[`${test.testname}_RBC`] || values[`${test.testname}_rbc`] || "";
        const wbcVal = values[`${test.testname}_WBC`] || values[`${test.testname}_wbc`] || "";
        const pltVal = values[`${test.testname}_PLATELETS`] || values[`${test.testname}_platelets`] || values[`${test.testname}_Platelets`] || "";
        const impVal = values[`${test.testname}_IMPRESSION`] || values[`${test.testname}_impression`] || values[`${test.testname}_Impression`] || "";

        if (rbcVal) reportParts.push(`RBC:\n${rbcVal}`);
        if (wbcVal || differentialSummary) {
          let wbcBlock = "WBC:";
          if (wbcVal) wbcBlock += `\n${wbcVal}`;
          if (differentialSummary) wbcBlock += `\nDifferential count:\n${differentialSummary}`;
          reportParts.push(wbcBlock);
        }
        if (pltVal) reportParts.push(`PLATELETS:\n${pltVal}`);
        if (impVal) reportParts.push(`IMPRESSION:\n${impVal}`);

        const fullReport = reportParts.length > 0 ? reportParts.join("\n\n") : (values[test.testname] || "");

        return {
          device_id: "",
          test_id: test.test_id,
          test_code: test.test_code || "",
          test_name: test.testname,
          lab_id: labId,
          value: fullReport,
          report: fullReport,
          parameters: parametersList,
          differential_items: activeDifferentialRows,
          remarks: remarks[test.testname] || "Remarks",
          comment: comments[test.testname] || "",
          approve: null,
          approve_time: null,
          approve_by: null,
          status: null,
          dispatch: false,
          dispatch_time: "null",
          verified_by,
        };
      });

      const payload = {
        date,
        barcode,
        locationId,
        lab_id: labId,
        testdetails: testDetailsData,
        processed_records: processedRecords,
      };

      const postResult = await apiRequest(
        `${Labbaseurl}pathology-test-value/save/`,
        "POST",
        payload,
      );

      if (postResult.success) {
        alert(postResult.data.message || "Pathology test details saved successfully!");
        fetchTestDetails(barcode, null, testName);
        setTimeout(() => handleBack(), 1000);
      } else {
        const isConflict =
          postResult.status === 409 ||
          (postResult.data &&
            postResult.data.error &&
            postResult.data.error.includes("already exists"));

        if (isConflict) {
          alert("Cannot save: " + (postResult.data?.error || "A test record already exists."));
        } else {
          alert("Failed to save test details: " + (postResult.data?.error || postResult.error || "Unknown error"));
        }
      }
    } catch (error) {
      console.error("Error saving test details:", error);
      alert("Error saving test details: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/PathologyPatientDetails", {
      state: {
        barcode: location.state?.barcode,
        fromDate: location.state?.fromDate || new Date(),
        toDate: location.state?.toDate || new Date(),
      },
    });
  };

  const isHMS =
    !locationId ||
    locationId.toLowerCase().includes("hms") ||
    (location.state?.locationId || "").toLowerCase().includes("hms");

  const handleHistoryClick = () => {
    if (!patientId) return;
    navigate("/WorkList", {
      state: {
        uhid: patientId,
        returnPath: `${location.pathname}${location.search}`,
        returnState: location.state,
        fromDate: date || location.state?.fromDate || null,
        toDate: date || location.state?.toDate || null,
      },
    });
  };

  // ── Render helpers ────────────────────────────────────────────────────────

  const isParamDisabled = (param, uniqueKey, testId, isValueEdit) => {
    // is_value_edit: true — all params always editable, machine value is just pre-filled
    if (isValueEdit) return false;
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
    <Container style={{ paddingBottom: "1.5rem" }}>
      <GlobalStyle />

      {/* ── Top Header Navigation ── */}
      <Header style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <FlaskConical size={22} color="#a777e3" />
          <Title style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
            Pathology Test Entry
          </Title>
          <span style={{ fontSize: "0.78rem", color: "#64748b", borderLeft: "2px solid #cbd5e1", paddingLeft: "0.5rem" }}>
            Morphological findings, differential counts & impressions
          </span>
        </div>
        <HeaderActions>
          <BackButton onClick={handleBack} style={{ borderRadius: "6px", border: "1px solid #cbd5e1", padding: "0.35rem 0.75rem", fontSize: "0.82rem", height: "32px", gap: "0.35rem" }}>
            <ArrowLeft size={14} />
            Back to Patients
          </BackButton>
        </HeaderActions>
      </Header>

      {/* ── First Container: Unified Patient Demographics & Pathology Lab ID ── */}
      {patientId && (
        <PatientCard>
          <PatientCardHeader>
            <PatientIdentity>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#f5f0fb",
                  color: "#a777e3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  flexShrink: 0,
                }}
              >
                <User size={16} />
              </div>
              <div>
                <PatientNameTitle style={{ fontSize: "1.05rem" }}>
                  {patientname || "Unnamed Patient"}
                </PatientNameTitle>
                <div style={{ display: "flex", gap: "0.35rem", alignItems: "center", marginTop: "0.15rem", flexWrap: "wrap" }}>
                  <PillBadge bg="#e0e7ff" color="#3730a3" border="1px solid #c7d2fe">
                    <Tag size={11} /> ID: {patientId}
                  </PillBadge>
                  {age && (
                    <PillBadge bg="#f1f5f9" color="#334155" border="1px solid #e2e8f0">
                      Age: {age} {gender ? `| ${gender}` : ""}
                    </PillBadge>
                  )}
                  {locationId && (
                    <PillBadge bg="#f0fdf4" color="#166534" border="1px solid #bbf7d0">
                      <Building size={11} /> {locationId}
                    </PillBadge>
                  )}
                  {labId && labId.trim() !== "" && (
                    <PillBadge bg="#e0e7ff" color="#3730a3" border="1px solid #c7d2fe" style={{ fontWeight: 700 }}>
                      <FlaskConical size={11} /> Lab ID: {labId}
                    </PillBadge>
                  )}
                </div>
              </div>
            </PatientIdentity>
          </PatientCardHeader>

          <PatientDetailsGrid>
            {barcode && (
              <GridItem>
                <GridLabel><FileText size={12} /> Specimen Barcode</GridLabel>
                <GridValue style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "#a777e3" }}>
                  {barcode}
                </GridValue>
              </GridItem>
            )}
            {date && (
              <GridItem>
                <GridLabel><Clock size={12} /> Specimen Date</GridLabel>
                <GridValue>{date}</GridValue>
              </GridItem>
            )}
            {ref_doctor && (
              <GridItem>
                <GridLabel><User size={12} /> Referring Doctor</GridLabel>
                <GridValue>{ref_doctor}</GridValue>
              </GridItem>
            )}
            {phone && (
              <GridItem>
                <GridLabel><Tag size={12} /> Contact Phone</GridLabel>
                <GridValue>{phone}</GridValue>
              </GridItem>
            )}
            {barcode_by && (
              <GridItem>
                <GridLabel><User size={12} /> Collected By</GridLabel>
                <GridValue>{barcode_by}</GridValue>
              </GridItem>
            )}
            {barcode_date && (
              <GridItem>
                <GridLabel><Clock size={12} /> Collected Date & Time</GridLabel>
                <GridValue>
                  {new Date(barcode_date).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </GridValue>
              </GridItem>
            )}

            {/* ── Pathology Specimen Lab ID Integrated into First Container ── */}
            <GridItem
              style={{
                backgroundColor: "#f5f0fb",
                padding: "0.45rem 0.65rem",
                borderRadius: "8px",
                border: "1.5px solid #a777e3",
                minWidth: "210px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                <GridLabel style={{ color: "#7c3aed", fontWeight: 700 }}>
                  <FlaskConical size={12} /> Pathology Specimen Lab ID
                </GridLabel>
              </div>
              <Input
                type="text"
                value={labId}
                onChange={(e) => setLabId(e.target.value)}
                placeholder="e.g. PS - 616/26"
                style={{
                  height: "34px",
                  padding: "0.3rem 0.65rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#ffffff",
                  letterSpacing: "0.5px",
                }}
              />
            </GridItem>
          </PatientDetailsGrid>
        </PatientCard>
      )}

      {/* ── Test Content Area ── */}
      {testDetails.length === 0 ? (
        <NoData style={{ borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
          <div>
            <AlertCircle size={32} style={{ color: "#94a3b8", marginBottom: "0.5rem" }} />
            <div>No test details available for the selected patient.</div>
            <small style={{ marginTop: "0.5rem", display: "block", color: "#64748b" }}>
              Barcode: {barcode} | Test Name: {testName || "All tests"}
            </small>
          </div>
        </NoData>
      ) : (
        <Form onSubmit={handleSubmit}>
          {testDetails.map((test, index) => {
            const hasParams =
              test.parametersBySubtitle &&
              Object.keys(test.parametersBySubtitle).length > 0;

            const diffRows = differentialTests[test.testname] || [
              { id: 1, name: "Polymorphs", value: "" },
              { id: 2, name: "Lymphocytes", value: "" },
              { id: 3, name: "Eosinophils", value: "" },
              { id: 4, name: "Monocytes", value: "" },
              { id: 5, name: "Basophils", value: "" },
            ];

            const diffTotal = diffRows.reduce((acc, curr) => {
              const num = parseFloat(curr.value);
              return !isNaN(num) ? acc + num : acc;
            }, 0);

            return (
              <TestCard
                key={index}
                style={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  marginBottom: "1.5rem",
                  overflow: "hidden",
                }}
              >
                <TestHeader
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                    padding: "1rem 1.35rem",
                    background: "linear-gradient(135deg, #a777e3 0%, #8b5cf6 100%)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <FlaskConical size={20} />
                    <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>{test.testname}</span>
                  </div>
                  {test.test_code && (
                    <span
                      style={{
                        fontSize: "0.78rem",
                        padding: "0.25rem 0.65rem",
                        borderRadius: "9999px",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                      }}
                    >
                      CODE: {test.test_code}
                    </span>
                  )}
                </TestHeader>

                <TestContent style={{ padding: "1.5rem" }}>
                  {hasParams ? (
                    <div>
                      {Object.entries(test.parametersBySubtitle).map(
                        ([subtitle, parameters], subIdx) => (
                          <div key={subIdx} style={{ marginBottom: "2rem" }}>
                            {subtitle && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                  fontSize: "0.95rem",
                                  fontWeight: 700,
                                  color: "#7c3aed",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.6px",
                                  marginBottom: "1.25rem",
                                  paddingBottom: "0.5rem",
                                  borderBottom: "2px solid #e2e8f0",
                                }}
                              >
                                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#a777e3" }}></span>
                                {subtitle}
                              </div>
                            )}

                            {parameters.map((param, pIdx) => {
                              const paramName = param.name || param.test_name;
                              const uniqueKey = `${test.testname}_${paramName}`;
                              const isDiff = paramName.toLowerCase().includes("differential");
                              const chips = QUICK_CHIPS[paramName.toUpperCase()] || [];

                              if (isDiff) {
                                return (
                                  <div
                                    key={pIdx}
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "1rem",
                                      marginBottom: "1.75rem",
                                      padding: "1.25rem 1.5rem",
                                      backgroundColor: "#f8fafc",
                                      borderRadius: "12px",
                                      border: "1.5px solid #e2e8f0",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: "0.75rem",
                                        paddingBottom: "0.75rem",
                                        borderBottom: "1px solid #e2e8f0",
                                      }}
                                    >
                                      <div>
                                        <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#0f172a" }}>
                                          {paramName} (DLC)
                                        </div>
                                        <div style={{ fontSize: "0.82rem", color: "#64748b" }}>
                                          Enter percentage values for each cell lineage. Values sum automatically.
                                        </div>
                                      </div>

                                      <div
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "0.4rem",
                                          padding: "0.35rem 0.85rem",
                                          borderRadius: "9999px",
                                          backgroundColor: diffTotal === 100 ? "#dcfce7" : "#e0e7ff",
                                          color: diffTotal === 100 ? "#15803d" : "#4338ca",
                                          border: diffTotal === 100 ? "1.5px solid #86efac" : "1.5px solid #c7d2fe",
                                          fontWeight: 700,
                                          fontSize: "0.88rem",
                                        }}
                                      >
                                        {diffTotal === 100 && <CheckCircle2 size={15} />}
                                        Total: {diffTotal}%
                                      </div>
                                    </div>

                                    {/* Responsive Differential Grid */}
                                    <div
                                      style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                        gap: "0.85rem",
                                      }}
                                    >
                                      {diffRows.map((row, rIdx) => (
                                        <div
                                          key={row.id || rIdx}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            padding: "0.5rem 0.75rem",
                                            backgroundColor: "#ffffff",
                                            borderRadius: "8px",
                                            border: "1px solid #e2e8f0",
                                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
                                          }}
                                        >
                                          <Input
                                            type="text"
                                            value={row.name}
                                            onChange={(e) =>
                                              handleDifferentialValueChange(
                                                test.testname,
                                                rIdx,
                                                "name",
                                                e.target.value
                                              )
                                            }
                                            placeholder="Cell Name"
                                            style={{
                                              flex: "1 1 130px",
                                              minWidth: "110px",
                                              height: "38px",
                                              padding: "0.4rem 0.65rem",
                                              fontSize: "0.92rem",
                                              fontWeight: 600,
                                              border: "1px solid #cbd5e1",
                                              borderRadius: "6px",
                                            }}
                                          />
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "0.35rem",
                                              flexShrink: 0,
                                            }}
                                          >
                                            <Input
                                              type="text"
                                              value={row.value}
                                              onChange={(e) =>
                                                handleDifferentialValueChange(
                                                  test.testname,
                                                  rIdx,
                                                  "value",
                                                  e.target.value
                                                )
                                              }
                                              placeholder="0"
                                              style={{
                                                width: "80px",
                                                minWidth: "80px",
                                                height: "38px",
                                                padding: "0.4rem 0.45rem",
                                                fontSize: "1rem",
                                                fontWeight: 700,
                                                textAlign: "center",
                                                color: "#0f172a",
                                                backgroundColor: "#f8fafc",
                                                border: "1.5px solid #94a3b8",
                                                borderRadius: "6px",
                                              }}
                                            />
                                            <span style={{ fontWeight: 700, color: "#64748b", fontSize: "0.95rem" }}>
                                              %
                                            </span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleRemoveDifferentialRow(
                                                test.testname,
                                                rIdx
                                              )
                                            }
                                            title="Remove cell type"
                                            style={{
                                              width: "28px",
                                              height: "28px",
                                              borderRadius: "6px",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              border: "none",
                                              background: "#fee2e2",
                                              color: "#dc2626",
                                              cursor: "pointer",
                                              fontSize: "1rem",
                                              fontWeight: 700,
                                              lineHeight: 1,
                                              flexShrink: 0,
                                              transition: "all 0.15s ease",
                                            }}
                                          >
                                            <CloseIcon size={14} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>

                                    <div>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleAddDifferentialRow(test.testname)
                                        }
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "0.4rem",
                                          padding: "0.45rem 0.95rem",
                                          fontSize: "0.85rem",
                                          fontWeight: 600,
                                          backgroundColor: "#f5f0fb",
                                          color: "#4338ca",
                                          border: "1.5px dashed #818cf8",
                                          borderRadius: "8px",
                                          cursor: "pointer",
                                          transition: "all 0.15s ease",
                                        }}
                                      >
                                        <Plus size={15} /> Add Cell Type & Value
                                      </button>
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={pIdx}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem",
                                    marginBottom: "1.5rem",
                                    padding: "1.1rem 1.35rem",
                                    backgroundColor: "#ffffff",
                                    borderRadius: "10px",
                                    border: "1.5px solid #e2e8f0",
                                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.02)",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      flexWrap: "wrap",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <Label
                                      style={{
                                        fontWeight: 700,
                                        fontSize: "0.98rem",
                                        color: "#0f172a",
                                        letterSpacing: "0.3px",
                                      }}
                                    >
                                      {paramName}
                                    </Label>
                                  </div>

                                  {/* Quick Chips Shortcuts */}
                                  {chips.length > 0 && (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        gap: "0.4rem",
                                        marginBottom: "0.35rem",
                                        padding: "0.4rem 0.6rem",
                                        backgroundColor: "#f8fafc",
                                        borderRadius: "8px",
                                        border: "1px solid #f1f5f9",
                                      }}
                                    >
                                      <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginRight: "0.25rem" }}>
                                        Quick Fill:
                                      </span>
                                      {chips.map((chip, cIdx) => (
                                        <ChipButton
                                          key={cIdx}
                                          type="button"
                                          onClick={() =>
                                            handleParameterValueChange(
                                              test.testname,
                                              paramName,
                                              chip
                                            )
                                          }
                                        >
                                          + {chip}
                                        </ChipButton>
                                      ))}
                                    </div>
                                  )}

                                  <TextArea
                                    data-focusable="true"
                                    rows={paramName.toUpperCase() === "IMPRESSION" ? 3 : 2}
                                    value={values[uniqueKey] || ""}
                                    onChange={(e) =>
                                      handleParameterValueChange(
                                        test.testname,
                                        paramName,
                                        e
                                      )
                                    }
                                    placeholder={`Type ${paramName} clinical observations and findings...`}
                                    style={{
                                      width: "100%",
                                      minHeight: paramName.toUpperCase() === "IMPRESSION" ? "85px" : "60px",
                                      padding: "0.65rem 0.85rem",
                                      fontSize: "0.92rem",
                                      lineHeight: "1.6",
                                      borderRadius: "8px",
                                      border: "1.5px solid #cbd5e1",
                                      backgroundColor: "#ffffff",
                                      color: "#0f172a",
                                      boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.04)",
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <FormGroup>
                      <Label style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a", marginBottom: "0.35rem" }}>
                        Report / Comprehensive Findings
                      </Label>
                      <TextArea
                        data-focusable="true"
                        rows={12}
                        value={values[test.testname] || ""}
                        onChange={(e) => handleValueChange(test.testname, e)}
                        placeholder="Type detailed pathology findings, microscopy narrative, and impressions..."
                        style={{
                          width: "100%",
                          minHeight: "260px",
                          fontSize: "0.95rem",
                          lineHeight: "1.6",
                          padding: "1rem",
                          borderRadius: "8px",
                          border: "1.5px solid #cbd5e1",
                        }}
                      />
                    </FormGroup>
                  )}

                  <FormGroup style={{ marginTop: "1.25rem" }}>
                    <Label style={{ fontWeight: 600, color: "#475569" }}>
                      Remarks / Internal Notes (Optional)
                    </Label>
                    <Input
                      data-focusable="true"
                      type="text"
                      value={remarks[test.testname] || ""}
                      onChange={(e) => handleRemarksChange(test.testname, e)}
                      placeholder="Optional notes for doctor review (not printed on patient report)..."
                      style={{
                        width: "100%",
                        height: "42px",
                        padding: "0.5rem 0.85rem",
                        fontSize: "0.9rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                      }}
                    />
                  </FormGroup>
                </TestContent>
              </TestCard>
            );
          })}

          {/* ── Docked Bottom Action Bar ── */}
          <ButtonContainer>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              {labId && labId.trim() !== "" ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#16a34a", fontWeight: 600, fontSize: "0.88rem" }}>
                  <CheckCircle2 size={17} />
                  <span>Lab ID: <strong>{labId}</strong></span>
                </div>
              ) : null}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <BackButton
                type="button"
                onClick={handleBack}
                style={{ padding: "0.65rem 1.15rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              >
                Cancel
              </BackButton>
              <SaveButton
                data-focusable="true"
                data-save-button
                type="submit"
                disabled={!isSaveButtonEnabled()}
                style={{
                  padding: "0.65rem 1.6rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  borderRadius: "8px",
                  background: isSaveButtonEnabled() ? "#10b981" : "#94a3b8",
                  boxShadow: isSaveButtonEnabled() ? "0 4px 14px rgba(16, 185, 129, 0.35)" : "none",
                  cursor: isSaveButtonEnabled() ? "pointer" : "not-allowed",
                }}
              >
                <Save size={18} />
                {isSubmitting ? "Saving..." : "Save Test Details"}
              </SaveButton>
            </div>
          </ButtonContainer>
        </Form>
      )}
    </Container>
  );
}

export default PathologyTestDetails;
