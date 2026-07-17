// Pure helper functions / constants extracted from TestDetails.
// None of these read component state directly — any state they need is
// passed in as an explicit argument — so they're safe to import anywhere.

export const ALL_CALCULATED_FIELDS = [
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

export const ALWAYS_EDITABLE_FIELDS = ["PT-CNTL", "PT-ISI", "APTT-C"];

export const DEFAULT_FIELD_VALUES = {
  "PT-CNTL": "13.7",
  "PT-ISI": "1.1",
  "APTT-C": "25.0",
};

export const formatDateTime = (date) => {
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
export const normalizeDisplayValue = (value) => {
  if (typeof value === "string" && value.trim().toLowerCase() === "neg") {
    return "Negative";
  }
  return value;
};

export const formatApiValue = (value) => {
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

// Returns "H", "L", or null
export const getHLFlag = (value, referenceRange) => {
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

// ─── Critical range checker ───────────────────────────────────────────────────
/**
 * Parses the `low` and `high` fields from the test definition.
 * Format examples:
 *   low: "<5"   → critical if value < 5
 *   high: ">100" → critical if value > 100
 * Returns true if the numeric value is outside the critical range.
 */
export const isCriticalValue = (value, low, high) => {
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
export const isWithinNormalRange = (value, referenceRange) => {
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

export const calculateDerivedValues = (
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

// ─── UI-facing computed helpers (kept pure by taking explicit args) ─────────

// test_id 429 — all params always editable, machine value is just pre-filled
export const isParamDisabled = (param, uniqueKey, testId, initialValues) => {
  if (testId === 429) return false;
  if (ALL_CALCULATED_FIELDS.includes(param.test_code)) return false;
  if (ALWAYS_EDITABLE_FIELDS.includes(param.test_code)) return false;
  return !!(
    initialValues[uniqueKey] && initialValues[uniqueKey].trim() !== ""
  );
};

export const isSaveButtonEnabled = ({
  isSubmitting,
  testDetails,
  values,
  initialValues,
  parameterRemarks,
  remarks,
}) => {
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
