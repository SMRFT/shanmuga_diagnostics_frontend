import { useEffect, useRef, useState } from "react";
import apiRequest from "../../Auth/apiRequest";
import {
  DEFAULT_FIELD_VALUES,
  ALL_CALCULATED_FIELDS,
  calculateDerivedValues,
  formatApiValue,
  formatDateTime,
  isCriticalValue,
  isWithinNormalRange,
  normalizeDisplayValue,
} from "./helpers";

// Owns every piece of state that TestDetails' data-fetch (and the editing /
// critical-value / save logic layered on top of it) needs, plus the
// fetch + handler functions themselves. Extracted verbatim from the
// component body — logic is unchanged, only relocated and parameterized
// via the args object below instead of closing over component-scope
// variables directly.
export default function useTestDetailsData({
  barcode,
  testId,
  testName,
  gender,
  date,
  locationId,
  Labbaseurl,
  verified_by,
  onSaveSuccess,
}) {
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
  const [specimenSelections, setSpecimenSelections] = useState({});
  // Debounce timers for critical-value detection — one timer per field key.
  // Critical comment is only auto-filled after the user stops typing for 600 ms,
  // so typing "400" does not trigger on "4" or "40".
  const criticalTimers = useRef({});
  // Tracks which comment keys were auto-filled by the critical check.
  // If the user manually edits the comment, it is removed from this set
  // so we never auto-clear a comment the user intentionally wrote.
  const autoCriticalComments = useRef(new Set());

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setTimeout(() => onSaveSuccess && onSaveSuccess(), 1000);
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
              .map((b) => `• Test ID ${b.test_id}: ${b.reason}`)
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

  return {
    testDetails,
    values,
    remarks,
    comments,
    parameterComments,
    parameterRemarks,
    editMode,
    parameterEditMode,
    loading,
    error,
    patientName,
    initialValues,
    processedRecords,
    isSubmitting,
    criticalKeys,
    specimenSelections,
    setSpecimenSelections,
    handleValueChange,
    handleParameterValueChange,
    handleRemarksChange,
    handleCommentChange,
    handleParameterCommentChange,
    handleParameterRemarksChange,
    toggleEditMode,
    toggleParameterEditMode,
    handleSubmit,
    fetchTestDetails,
  };
}
