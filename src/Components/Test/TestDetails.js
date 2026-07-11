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
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
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
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(67,97,238,0.1)";
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
            specimen_options: test.specimen_options || [],
            comment_options: test.comment_options || [],
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
          // ✅ CORRECT — only ONE push with the real data
          if (test.specimen_options && test.specimen_options.length > 0) {
            groupedTests[tName].specimen_options = test.specimen_options;
          }

          groupedTests[tName].parametersBySubtitle[subtitle].push({
            name: test.parameter_name,
            test_name: test.parameter_name,
            test_code: test.test_code,
            unit: test.unit,
            reference_range: test.reference_range,
            low: test.low || "",
            high: test.high || "",
            method: test.method,
            value: test.test_value,
            value_option: test.value_option || [],
            comment_options: test.comment_options || [],
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
          groupedTests[tName].comment_options = test.comment_options || [];
          groupedTests[tName].interpretation = test.interpretation || {}; // ADD
          groupedTests[tName].critical_range = test.critical_range || {}; // ADD
          groupedTests[tName].specimen_options = test.specimen_options || []; // ADD
          groupedTests[tName].lod = test.lod || null; // ADD
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
              tempValues[uniqueKey] = normalizeDisplayValue(
                formatApiValue(paramValue),
              );
              // Store normalized API value as initial (used for editability check)
              tempInitialValues[uniqueKey] = normalizeDisplayValue(
                formatApiValue(param.value || ""),
              );
              // store low/high for this param
              tempCriticalRanges[uniqueKey] = {
                low: param.low || "",
                high: param.high || "",
              };
            });
        } else {
          const testValue = test.test_value || "";
          tempValues[test.testname] = formatApiValue(testValue);
          tempEditMode[test.testname] = false;
          tempInitialValues[test.testname] = formatApiValue(testValue);
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
          [498, 551, 196, 550, 449, 467, 315, 362, 205, 517].includes(
            test.test_id,
          ) &&
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
                initialParamComments[uniqueKey] =
                  "Critical, Rechecked, Kindly correlate clinically";
              }
            });
        } else {
          const val = tempValues[test.testname];
          const { low, high } = tempCriticalRanges[test.testname] || {};
          if (val && isCriticalValue(val, low, high)) {
            initialComments[test.testname] =
              "Critical, Rechecked, Kindly correlate clinically";
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

      if (
        [498, 551, 196, 550, 449, 467, 315, 362, 205, 517].includes(
          currentTest?.test_id,
        )
      ) {
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
          if (
            !prev[uniqueKey] ||
            prev[uniqueKey] ===
            "Critical, Rechecked, Kindly correlate clinically"
          ) {
            autoCriticalComments.current.add(uniqueKey);
            return {
              ...prev,
              [uniqueKey]: "Critical, Rechecked, Kindly correlate clinically",
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

      const approveTime = formatDateTime(new Date());

      const testDetailsData = testDetails.map((test) => {
        // ── Auto-approve check ─────────────────────────────────────────────────
        // true  → all values within parseable normal range → approve
        // false → any value out of range or complex/descriptive range → approve:null
        let allNormal = true;

        if (
          test.parametersBySubtitle &&
          Object.keys(test.parametersBySubtitle).length > 0
        ) {
          const allParams = Object.values(test.parametersBySubtitle).flat();
          for (const param of allParams) {
            const paramName = param.name || param.test_name;
            const uniqueKey = `${test.testname}_${paramName}`;
            const result = isWithinNormalRange(
              values[uniqueKey],
              param.reference_range,
            );
            if (result === null || result === false) {
              allNormal = false;
              break;
            }
          }
        } else {
          const result = isWithinNormalRange(
            values[test.testname],
            test.reference_range,
          );
          if (result === null || result === false) allNormal = false;
        }

        const approveFields = allNormal
          ? {
            approve: true,
            approve_time: approveTime,
            status: "Normal",
          }
          : {
            approve: null,
            approve_time: null,
            approve_by: null,
            status: null,
          };
        // ──────────────────────────────────────────────────────────────────────

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
            ...(specimenSelections[test.testname]
              ? { specimen_type: specimenSelections[test.testname] }
              : {}), // ✅ ADD THIS
            rerun: parameterEditMode ? false : test.rerun,
            ...approveFields,
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
            ...(specimenSelections[test.testname]
              ? { specimen_type: specimenSelections[test.testname] }
              : {}), // only include if user selected from dropdown
            value: values[test.testname] || "",
            remarks: remarks[test.testname] || "",
            comment: comments[test.testname] || "",
            rerun: editMode[test.testname] ? false : test.rerun,
            ...approveFields,
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
        // ── Handle 409 Conflict ───────────────────────────────────────────────
        const isConflict =
          postResult.status === 409 ||
          (postResult.error &&
            postResult.error.toLowerCase().includes("blocked"));

        if (isConflict) {
          const blockedTests = postResult.data?.blocked_tests || [];
          if (blockedTests.length > 0) {
            const details = blockedTests
              .map((b) => `\u2022 Test ID ${b.test_id}: ${b.reason}`)
              .join("\n");
            alert(
              "Save was blocked because test data already exists:\n\n" +
              details +
              "\n\nTo re-enter values, the test must first be flagged for rerun by the doctor.",
            );
          } else {
            alert(
              postResult.error ||
              "Save blocked: test data already exists or has already been approved.",
            );
          }
        } else {
          alert(postResult.error || "Failed to save test details.");
        }

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
          {/* NEW: barcode_by, barcode_date, phone, ref_doctor */}
          {barcode_by && (
            <InfoItem>
              <span>Barcode By:</span> {barcode_by}
            </InfoItem>
          )}
          {barcode_date && (
            <InfoItem>
              <span>Barcode Date:</span>{" "}
              {new Date(barcode_date).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </InfoItem>
          )}
          {phone && (
            <InfoItem>
              <span>Phone:</span> {phone}
            </InfoItem>
          )}
          {ref_doctor && (
            <InfoItem>
              <span>Ref. Doctor:</span> {ref_doctor}
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
                        <Label>
                          Specimen Type
                          {test.specimen_options &&
                            test.specimen_options.length > 0 && (
                              <span style={{ color: "red" }}> *</span>
                            )}
                        </Label>
                        {test.specimen_options &&
                          test.specimen_options.length > 0 ? (
                          <SelectWrapper>
                            <Select
                              value={specimenSelections[test.testname] || ""}
                              onChange={(e) =>
                                setSpecimenSelections((prev) => ({
                                  ...prev,
                                  [test.testname]: e.target.value,
                                }))
                              }
                              required
                            >
                              <option value="">Select specimen type</option>
                              {test.specimen_options.map((opt, i) => (
                                <option key={i} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </Select>
                            <SelectIcon size={18} />
                          </SelectWrapper>
                        ) : (
                          <Input value={test.specimen_type || ""} disabled />
                        )}
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
                    {/* ── Interpretation table ── */}
                    {test.interpretation &&
                      Object.keys(test.interpretation).length > 0 && (
                        <InterpretationSection>
                          <InterpretationTitle>
                            Interpretation
                          </InterpretationTitle>
                          <InterpretationTable>
                            <thead>
                              <tr>
                                <th>Results</th>
                                <th>Comments</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(test.interpretation).map(
                                ([result, comment], i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 500 }}>
                                      {result}
                                    </td>
                                    <td>{comment}</td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </InterpretationTable>
                        </InterpretationSection>
                      )}

                    {/* ── Critical range table ── */}
                    {test.critical_range &&
                      Object.keys(test.critical_range).length > 0 && (
                        <InterpretationSection>
                          <InterpretationTitle>
                            Critical Range
                          </InterpretationTitle>
                          <InterpretationTable>
                            <thead>
                              <tr>
                                <th>Result</th>
                                <th>Ct Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(test.critical_range).map(
                                ([result, ctvalue], i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 500 }}>
                                      {result}
                                    </td>
                                    <td>{ctvalue}</td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </InterpretationTable>
                        </InterpretationSection>
                      )}
                    {/* ── LOD table ── */}
                    {test.lod &&
                      Object.keys(test.lod).length > 0 &&
                      (() => {
                        const samples = Object.keys(test.lod);
                        const maxGenotypes = Math.max(
                          ...samples.map((s) => test.lod[s].length),
                        );
                        const genotypeLabels = Array.from(
                          { length: maxGenotypes },
                          (_, i) => `Genotype ${i + 1}`,
                        );

                        return (
                          <InterpretationSection>
                            <InterpretationTitle>
                              LOD in IU/ml
                            </InterpretationTitle>
                            <LodTable>
                              <thead>
                                <tr>
                                  <th className="sample-header" rowSpan={2}>
                                    SAMPLE
                                  </th>
                                  <th
                                    colSpan={maxGenotypes}
                                    style={{
                                      textAlign: "center",
                                      backgroundColor: "#e8ecff",
                                    }}
                                  >
                                    LOD in IU/ml
                                  </th>
                                </tr>
                                <tr>
                                  {genotypeLabels.map((label, i) => (
                                    <th key={i} className="group-header">
                                      {label}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {samples.map((sample, rowIdx) => (
                                  <tr key={rowIdx}>
                                    <td className="sample-cell">{sample}</td>
                                    {test.lod[sample].map((val, colIdx) => (
                                      <td key={colIdx}>{val}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </LodTable>
                          </InterpretationSection>
                        );
                      })()}

                    <FormRow>
                      <FormGroup>
                        <Label>
                          Value{" "}
                          {(!initialValues[test.testname] ||
                            initialValues[test.testname].trim() === "") && (
                              <span style={{ color: "red" }}>*</span>
                            )}
                          {(() => {
                            const flag = getHLFlag(
                              values[test.testname],
                              test.reference_range,
                            );
                            return flag ? (
                              <HLBadge direction={flag}>{flag}</HLBadge>
                            ) : null;
                          })()}
                        </Label>
                        {test.value_option && test.value_option.length > 0 ? (
                          <div>
                            <Input
                              data-focusable="true"
                              type="text"
                              list={`options-${test.testname}`}
                              value={values[test.testname] || ""}
                              onChange={(e) =>
                                handleValueChange(test.testname, e)
                              }
                              placeholder="Select or type value"
                            />
                            <datalist id={`options-${test.testname}`}>
                              {test.value_option.map((option, optIndex) => (
                                <option key={optIndex} value={option} />
                              ))}
                            </datalist>
                          </div>
                        ) : (
                          <Input
                            data-focusable="true"
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
                          {test.comment_options && test.comment_options.length > 0 && (
                            <div style={{ marginBottom: "8px" }}>
                              <Input
                                type="text"
                                list={`comments-search-${test.testname}`}
                                value={comments[test.testname] || ""}
                                onChange={(e) =>
                                  handleCommentChange(test.testname, e)
                                }
                                placeholder="🔍 Search or select comment option..."
                                style={{ width: "100%" }}
                              />
                              <datalist id={`comments-search-${test.testname}`}>
                                {test.comment_options.map((option, optIndex) => (
                                  <option key={optIndex} value={option} />
                                ))}
                              </datalist>
                            </div>
                          )}
                          <CommentTextArea
                            data-focusable="true"
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
                              data-focusable="true"
                              value={remarks[test.testname] || ""}
                              onChange={(e) =>
                                handleRemarksChange(test.testname, e)
                              }
                              onKeyDown={(e) => {
                                {
                                  /* ← ADD THIS */
                                }
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  document
                                    .querySelector("[data-save-button]")
                                    ?.focus();
                                }
                              }}
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
                        <Label>
                          Specimen Type
                          {test.specimen_options &&
                            test.specimen_options.length > 0 && (
                              <span style={{ color: "red" }}> *</span>
                            )}
                        </Label>
                        {test.specimen_options &&
                          test.specimen_options.length > 0 ? (
                          <SelectWrapper>
                            <Select
                              value={specimenSelections[test.testname] || ""}
                              onChange={(e) =>
                                setSpecimenSelections((prev) => ({
                                  ...prev,
                                  [test.testname]: e.target.value,
                                }))
                              }
                              required
                            >
                              <option value="">Select specimen type</option>
                              {test.specimen_options.map((opt, i) => (
                                <option key={i} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </Select>
                            <SelectIcon size={18} />
                          </SelectWrapper>
                        ) : (
                          <Input
                            type="text"
                            value={test.specimen_type || ""}
                            disabled
                          />
                        )}
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
                                        {(() => {
                                          const flag = getHLFlag(
                                            values[uniqueKey],
                                            param.reference_range,
                                          );
                                          return flag ? (
                                            <HLBadge direction={flag}>
                                              {flag}
                                            </HLBadge>
                                          ) : null;
                                        })()}
                                      </Label>
                                      {(() => {
                                        const MULTI_SELECT_CODES = [
                                          "UR19",
                                          "UR20",
                                          "UR23",
                                        ];
                                        const isMultiSelect =
                                          hasValueOptions &&
                                          !disabled &&
                                          MULTI_SELECT_CODES.includes(
                                            param.test_code,
                                          );
                                        const isSingleSelect =
                                          hasValueOptions &&
                                          !disabled &&
                                          !MULTI_SELECT_CODES.includes(
                                            param.test_code,
                                          );

                                        if (isMultiSelect) {
                                          return (
                                            <MultiSelectDropdown
                                              options={param.value_option}
                                              value={values[uniqueKey] || ""}
                                              disabled={disabled}
                                              onChange={(val) =>
                                                handleParameterValueChange(
                                                  test.testname,
                                                  paramName,
                                                  { target: { value: val } },
                                                )
                                              }
                                            />
                                          );
                                        }

                                        if (isSingleSelect) {
                                          return (
                                            <div
                                              style={{ position: "relative" }}
                                            >
                                              <Input
                                                data-focusable="true"
                                                type="text"
                                                list={`options-${uniqueKey}`}
                                                value={values[uniqueKey] || ""}
                                                onChange={(e) =>
                                                  handleParameterValueChange(
                                                    test.testname,
                                                    paramName,
                                                    e,
                                                  )
                                                }
                                                disabled={disabled}
                                                placeholder="Select or type value"
                                                style={
                                                  critical
                                                    ? {
                                                      borderColor:
                                                        "var(--danger)",
                                                      backgroundColor:
                                                        "#fff5f5",
                                                    }
                                                    : {}
                                                }
                                              />
                                              <datalist
                                                id={`options-${uniqueKey}`}
                                              >
                                                {param.value_option.map(
                                                  (option, optIndex) => (
                                                    <option
                                                      key={optIndex}
                                                      value={option}
                                                    />
                                                  ),
                                                )}
                                              </datalist>
                                            </div>
                                          );
                                        }

                                        // No options — plain text input
                                        return (
                                          <Input
                                            data-focusable="true"
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
                                            style={
                                              critical
                                                ? {
                                                  borderColor:
                                                    "var(--danger)",
                                                  backgroundColor: "#fff5f5",
                                                }
                                                : {}
                                            }
                                          />
                                        );
                                      })()}
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
                                    {test.comment_options && test.comment_options.length > 0 && (
                                      <div style={{ marginBottom: "8px" }}>
                                        <Input
                                          type="text"
                                          list={`comments-search-${uniqueKey}`}
                                          value={parameterComments[uniqueKey] || ""}
                                          onChange={(e) =>
                                            handleParameterCommentChange(
                                              test.testname,
                                              paramName,
                                              e,
                                            )
                                          }
                                          placeholder="🔍 Search or select comment option..."
                                          style={{ width: "100%" }}
                                        />
                                        <datalist id={`comments-search-${uniqueKey}`}>
                                          {test.comment_options.map((option, optIndex) => (
                                            <option key={optIndex} value={option} />
                                          ))}
                                        </datalist>
                                      </div>
                                    )}
                                    <CommentTextArea
                                      data-focusable="true"
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
                              data-focusable="true"
                              value={parameterRemarks || ""}
                              onChange={handleParameterRemarksChange}
                              onKeyDown={(e) => {
                                {
                                  /* ← ADD THIS */
                                }
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  document
                                    .querySelector("[data-save-button]")
                                    ?.focus();
                                }
                              }}
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
            <SaveButton
              data-focusable="true"
              data-save-button
              type="submit"
              disabled={!isSaveButtonEnabled()}
            >
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
