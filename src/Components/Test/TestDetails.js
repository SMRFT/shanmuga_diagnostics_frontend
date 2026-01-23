
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { ArrowLeft, Save, Edit, ChevronDown } from "lucide-react";
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

// Styled components
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

const PatientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

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

    &:hover {
      background-color: var(--gray-light);
    }
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

    &:hover {
      background-color: var(--gray-light);
    }
  }
`;

const EditButton = styled(Button)`
  background-color: var(--secondary);
  padding: 0.35rem 0.75rem;
  font-size: 0.875rem;

  &:hover {
    background-color: var(--primary);
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

  &:disabled {
    background-color: var(--gray-light);
    cursor: not-allowed;
  }
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

const CommentTextArea = styled(TextArea)`
  min-height: 5px;
  min-width: 1000px;
  background-color: white;
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
  &:last-child { margin-bottom: 0; }
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

// Helper function to calculate derived values for tests with calculated parameters
// MUST BE DEFINED OUTSIDE THE COMPONENT
const calculateDerivedValues = (testname, currentValues, currentTest, manuallyEdited = {}) => {
  if (!currentTest) {
    return currentValues;
  }

  const newValues = { ...currentValues };
  const allParams = Object.values(currentTest.parametersBySubtitle || {}).flat();
  
  // Create a map of test_code to value
  const valuesByTestCode = {};
  allParams.forEach(param => {
    const pName = param.name || param.test_name;
    const key = `${testname}_${pName}`;
    const val = parseFloat(newValues[key]) || 0;
    valuesByTestCode[param.test_code] = val;
  });

  // LIPID PROFILE (test_id 498) calculations
  if (currentTest.test_id === 498) {
    const cholesterol = valuesByTestCode['13'] || 0;
    const triglycerides = valuesByTestCode['14'] || 0;
    const hdl = valuesByTestCode['15'] || 0;
    const ldlDirect = valuesByTestCode['18'] || 0;

    console.log('LIPID PROFILE - Calculating with values:', { cholesterol, triglycerides, hdl, ldlDirect });

    // Calculate TESTCODE001: NON-HDL CHOLESTEROL (Cholesterol - HDL)
    const nonHdlParam = allParams.find(p => p.test_code === 'TESTCODE001');
    if (nonHdlParam && cholesterol && hdl) {
      const nonHdlKey = `${testname}_${nonHdlParam.name || nonHdlParam.test_name}`;
      if (!manuallyEdited[nonHdlKey]) {
        const nonHdl = cholesterol - hdl;
        newValues[nonHdlKey] = nonHdl.toFixed(2);
        console.log(`NON-HDL: ${nonHdl.toFixed(2)}`);
      }
    }

    // Calculate TESTCODE002: Cholesterol/HDL Ratio
    const ratioParam = allParams.find(p => p.test_code === 'TESTCODE002');
    if (ratioParam && cholesterol && hdl) {
      const ratioKey = `${testname}_${ratioParam.name || ratioParam.test_name}`;
      if (!manuallyEdited[ratioKey]) {
        const ratio = cholesterol / hdl;
        newValues[ratioKey] = ratio.toFixed(2);
        console.log(`Cholesterol/HDL Ratio: ${ratio.toFixed(2)}`);
      }
    }

    // Calculate TESTCODE003: VLDL-Cholesterol (Triglycerides / 5)
    const vldlParam = allParams.find(p => p.test_code === 'TESTCODE003');
    if (vldlParam && triglycerides) {
      const vldlKey = `${testname}_${vldlParam.name || vldlParam.test_name}`;
      if (!manuallyEdited[vldlKey]) {
        const vldl = triglycerides / 5;
        newValues[vldlKey] = vldl.toFixed(2);
        console.log(`VLDL: ${vldl.toFixed(2)}`);
      }
    }

    // Calculate TESTCODE004: LDL/HDL Ratio
    const ldlRatioParam = allParams.find(p => p.test_code === 'TESTCODE004');
    if (ldlRatioParam && ldlDirect && hdl) {
      const ldlRatioKey = `${testname}_${ldlRatioParam.name || ldlRatioParam.test_name}`;
      if (!manuallyEdited[ldlRatioKey]) {
        const ldlHdlRatio = ldlDirect / hdl;
        newValues[ldlRatioKey] = ldlHdlRatio.toFixed(2);
        console.log(`LDL/HDL Ratio: ${ldlHdlRatio.toFixed(2)}`);
      }
    }
  }

  // LIVER FUNCTION TEST (test_id 196) calculations
  if (currentTest.test_id === 196) {
    const totalProtein = valuesByTestCode['05'] || 0; // Total Protein
    const albumin = valuesByTestCode['06'] || 0; // Albumin
    const bilirubinTotal = valuesByTestCode['07'] || 0; // Bilirubin - Total
    const bilirubinDirect = valuesByTestCode['LFT02'] || 0; // Bilirubin - Direct

    console.log('LIVER FUNCTION TEST - Calculating with values:', { totalProtein, albumin, bilirubinTotal, bilirubinDirect });

    // Calculate LFT09: Globulin (Total Protein - Albumin)
    const globulinParam = allParams.find(p => p.test_code === 'LFT09');
    if (globulinParam && totalProtein && albumin) {
      const globulinKey = `${testname}_${globulinParam.name || globulinParam.test_name}`;
      if (!manuallyEdited[globulinKey]) {
        const globulin = totalProtein - albumin;
        newValues[globulinKey] = globulin.toFixed(2);
        console.log(`Globulin: ${globulin.toFixed(2)}`);
      }
    }

    // Calculate LFT10: A/G Ratio (Albumin / Globulin)
    const agRatioParam = allParams.find(p => p.test_code === 'LFT10');
    if (agRatioParam && albumin && totalProtein) {
      const agRatioKey = `${testname}_${agRatioParam.name || agRatioParam.test_name}`;
      if (!manuallyEdited[agRatioKey]) {
        const globulin = totalProtein - albumin;
        if (globulin > 0) {
          const agRatio = albumin / globulin;
          newValues[agRatioKey] = agRatio.toFixed(2);
          console.log(`A/G Ratio: ${agRatio.toFixed(2)}`);
        }
      }
    }

    // Calculate LFT03: Bilirubin - Indirect (Bilirubin Total - Bilirubin Direct)
    const bilirubinIndirectParam = allParams.find(p => p.test_code === 'LFT03');
    if (bilirubinIndirectParam && bilirubinTotal && bilirubinDirect) {
      const bilirubinIndirectKey = `${testname}_${bilirubinIndirectParam.name || bilirubinIndirectParam.test_name}`;
      if (!manuallyEdited[bilirubinIndirectKey]) {
        const bilirubinIndirect = bilirubinTotal - bilirubinDirect;
        newValues[bilirubinIndirectKey] = bilirubinIndirect.toFixed(2);
        console.log(`Bilirubin - Indirect: ${bilirubinIndirect.toFixed(2)}`);
      }
    }
  }
  // HbA1c (test_id 467) calculations
  if (currentTest.test_id === 467) {
    const hba1c = valuesByTestCode['HBA1C01'] || 0; // Glycosylated Haemoglobin (HbA1C)

    console.log('HbA1c - Calculating with values:', { hba1c });

    // Calculate HBA1C02: Estimated Average Glucose (EAG) = (HbA1c * 28.7) - 46.1
    const eagParam = allParams.find(p => p.test_code === 'HBA1C02');
    if (eagParam && hba1c) {
      const eagKey = `${testname}_${eagParam.name || eagParam.test_name}`;
      if (!manuallyEdited[eagKey]) {
        const eag = (hba1c * 28.7) - 46.1;
        newValues[eagKey] = eag.toFixed(2);
        console.log(`Estimated Average Glucose (EAG): ${eag.toFixed(2)}`);
      }
    }
  }

  return newValues;
};

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

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get("date");
  const patientId = queryParams.get("patient_id");
  const patientname = queryParams.get("patientname");
  const age = queryParams.get("age");
  const barcode = queryParams.get("barcode");
  const locationId = queryParams.get("locationId");
  const testId = queryParams.get("test_id");
  const testName = queryParams.get("test_name");
  const navigate = useNavigate();
  const verified_by = localStorage.getItem("name") || "";
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [manuallyEditedCalculatedFields, setManuallyEditedCalculatedFields] = useState({});

  const fetchTestDetails = async (barcode, test_id = null, testName = null) => {
    try {
      setLoading(true);
      setError(null);

      let queryParams = `barcode=${encodeURIComponent(barcode)}`;
      if (testId) {
        queryParams += `&test_id=${encodeURIComponent(testId)}`;
      }
      if (testName) {
        queryParams += `&test_name=${encodeURIComponent(testName)}`;
      }

      console.log(`DEBUG: Fetching test details with query: ${queryParams}`);

      const response = await apiRequest(
        `${Labbaseurl}compare_test_details/?${queryParams}`,
        "GET"
      );

      let actualResponse;
      if (response.data && typeof response.data === "object") {
        actualResponse = response.data;
      } else {
        actualResponse = response;
      }

      if (!actualResponse.success) {
        throw new Error(actualResponse.error || "Failed to fetch test details");
      }

      if (actualResponse.filtered_by_test) {
        console.log(`DEBUG: Results filtered by test: ${actualResponse.filtered_by_test}`);
      }

      if (
        actualResponse.processed_records &&
        Array.isArray(actualResponse.processed_records)
      ) {
        setProcessedRecords(actualResponse.processed_records);
        console.log(
          `DEBUG: Stored ${actualResponse.processed_records.length} processed records`
        );
      } else {
        console.log("DEBUG: No processed records found in response");
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
          "Invalid response structure: test data is not an array"
        );
      }

      if (allTests.length === 0) {
        setTestDetails([]);
        setLoading(false);
        return;
      }

      const filteredTests = testName 
        ? allTests.filter(test => test.testname === testName)
        : allTests;

      const groupedTests = {};

      filteredTests.forEach((test) => {
        const testName = test.testname;
        if (!groupedTests[testName]) {
          groupedTests[testName] = {
            testname: testName,
            originalTestname: testName,
            device_id: test.device_id,
            test_id: test.test_id,
            test_code: test.test_code,
            department: test.department,
            NABL: test.NABL,
            specimen_type: test.specimen_type || "",
            method: test.method,
            sample_status: test.sample_status,
            device_id: test.device_id || "",
            parametersBySubtitle: {},
          };
        }

        if (
          test.parameter_name &&
          test.parameter_name !== null &&
          test.parameter_name !== "N/A"
        ) {
          const subtitle = test.sub_title || "";
          if (!groupedTests[testName].parametersBySubtitle[subtitle]) {
            groupedTests[testName].parametersBySubtitle[subtitle] = [];
          }

          groupedTests[testName].parametersBySubtitle[subtitle].push({
            name: test.parameter_name,
            test_name: test.parameter_name,
            test_code: test.test_code,
            unit: test.unit,
            reference_range: test.reference_range,
            method: test.method,
            value: test.test_value,
            value_option: test.value_option || [],
            sub_title: subtitle,
            processing_status: test.processing_status,
          });
        } else if (!test.parameter_name || test.parameter_name === null) {
          groupedTests[testName].unit = test.unit;
          groupedTests[testName].reference_range = test.reference_range;
          groupedTests[testName].test_value = test.test_value;
          groupedTests[testName].test_code = test.test_code;
          groupedTests[testName].processing_status = test.processing_status;
          groupedTests[testName].value_option = test.value_option || [];
        }
      });

      const transformedTests = Object.values(groupedTests);
      setTestDetails(transformedTests);

      let tempValues = {};
      let tempEditMode = {};
      let tempInitialValues = {};

      transformedTests.forEach((test) => {
        if (test.parametersBySubtitle && Object.keys(test.parametersBySubtitle).length > 0) {
          Object.values(test.parametersBySubtitle).flat().forEach((param) => {
            const paramName = param.name || param.test_name;
            const uniqueKey = `${test.testname}_${paramName}`;
            const paramValue = param.value || "";
            tempValues[uniqueKey] = paramValue;
            tempInitialValues[uniqueKey] = paramValue;
          });
        } else {
          const testValue = test.test_value || "";
          tempValues[test.testname] = testValue;
          tempEditMode[test.testname] = false;
          tempInitialValues[test.testname] = testValue;
        }
      });

      setEditMode(tempEditMode);
      setInitialValues(tempInitialValues);
      
      // Auto-calculate derived values for LIPID PROFILE tests after loading from API
      console.log('Running auto-calculation for loaded data...');
      transformedTests.forEach((test) => {
        // Calculate for LIPID PROFILE (498) and LIVER FUNCTION TEST (196), and HbA1c (467)
        if ((test.test_id === 498 || test.test_id === 196|| test.test_id === 467) && 
            test.parametersBySubtitle && 
            Object.keys(test.parametersBySubtitle).length > 0) {
          console.log(`Found test with calculations: ${test.testname} (ID: ${test.test_id})`);
          tempValues = calculateDerivedValues(test.testname, tempValues, test);
        }
      });
      
      // Update values with calculated results
      setValues(tempValues);
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

  const handleValueChange = (testname, event) => {
    setValues((prevValues) => ({
      ...prevValues,
      [testname]: event.target.value,
    }));
  };

  const handleParameterValueChange = (testname, paramName, event) => {
  const { value } = event.target;
  const uniqueKey = `${testname}_${paramName}`;

  setValues((prevValues) => {
    const newValues = {
      ...prevValues,
      [uniqueKey]: value,
    };

    // Check if this is a calculated field being manually edited
    const currentTest = testDetails.find(t => t.testname === testname);
    const param = Object.values(currentTest?.parametersBySubtitle || {})
      .flat()
      .find(p => (p.name || p.test_name) === paramName);
    
    // Calculated fields for both LIPID PROFILE and LIVER FUNCTION TEST
    const calculatedFields = [
  'TESTCODE001', 'TESTCODE002', 'TESTCODE003', 'TESTCODE004', // LIPID PROFILE
  'LFT03', 'LFT09', 'LFT10', // LIVER FUNCTION TEST
  'HBA1C02' // HbA1c
];
const isCalculatedField = calculatedFields.includes(param.test_code);
const isDisabled = !isCalculatedField && initialValues[uniqueKey] && initialValues[uniqueKey].trim() !== "";
    
    if (isCalculatedField) {
      // Mark this field as manually edited
      setManuallyEditedCalculatedFields(prev => ({
        ...prev,
        [uniqueKey]: true
      }));
      // Don't auto-calculate, just return the new values
      return newValues;
    }

    // Auto-calculate for tests with calculated parameters
    if (currentTest?.test_id === 498 || currentTest?.test_id === 196 || currentTest?.test_id === 467) {
      return calculateDerivedValues(testname, newValues, currentTest, manuallyEditedCalculatedFields);
    }
    
    return newValues;
  });
};

  const handleRemarksChange = (testname, event) => {
    setRemarks((prevRemarks) => ({
      ...prevRemarks,
      [testname]: event.target.value,
    }));
  };

  const handleCommentChange = (testname, event) => {
    setComments((prevComments) => ({
      ...prevComments,
      [testname]: event.target.value,
    }));
  };

  const handleParameterCommentChange = (testname, paramName, event) => {
    const uniqueKey = `${testname}_${paramName}`;
    setParameterComments((prevComments) => ({
      ...prevComments,
      [uniqueKey]: event.target.value,
    }));
  };

  const handleParameterRemarksChange = (event) => {
    setParameterRemarks(event.target.value);
  };

  const toggleEditMode = (testname) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [testname]: !prevEditMode[testname],
    }));
  };

  const toggleParameterEditMode = () => {
    setParameterEditMode(!parameterEditMode);
  };

  const isSaveButtonEnabled = () => {
    if (isSubmitting) return false;

    let allValuesFilled = true;
    let remarksRequiredForEditedFields = true;

    testDetails.forEach((test) => {
      if (test.parametersBySubtitle && Object.keys(test.parametersBySubtitle).length > 0) {
        let hasEditedParameters = false;

        Object.values(test.parametersBySubtitle).flat().forEach((param) => {
          const paramName = param.name || param.test_name;
          const uniqueKey = `${test.testname}_${paramName}`;
          const paramValue = values[uniqueKey];
          const initialValue = initialValues[uniqueKey];

          if (!paramValue || paramValue.trim() === "") {
            allValuesFilled = false;
          }

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

        if (!testValue || testValue.trim() === "") {
          allValuesFilled = false;
        }

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


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

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
          Object.values(test.parametersBySubtitle).flat().forEach((param) => {
            const paramName = param.name || param.test_name;
            const uniqueKey = `${test.testname}_${paramName}`;
            const paramValue = values[uniqueKey];

            try {
              validateTestValue(paramValue, paramName, test.testname);
            } catch (error) {
              validationErrors.push(error.message);
            }
          });
        } else {
          const testValue = values[test.testname];
          try {
            validateTestValue(testValue, test.testname, test.testname);
          } catch (error) {
            validationErrors.push(error.message);
          }
        }
      });

      if (validationErrors.length > 0) {
        const errorMessage =
          "Please fill in all required values:\n\n" +
          validationErrors
            .map((error, index) => `${index + 1}. ${error}`)
            .join("\n");
        alert(errorMessage);
        setIsSubmitting(false);
        return;
      }

      const testDetailsData = testDetails.map((test) => {
        if (
          test.parametersBySubtitle &&
          Object.keys(test.parametersBySubtitle).length > 0
        ) {
          const parameters = [];
          Object.entries(test.parametersBySubtitle).forEach(([subtitle, params]) => {
            params.forEach((param) => {
              const paramName = param.name || param.test_name;
              const uniqueKey = `${test.testname}_${paramName}`;
              parameters.push({
                test_code: param.test_code || "",
                value: values[uniqueKey] || "",
                comment: parameterComments[uniqueKey] || "",
              });
            });
          });

          return {
            device_id: test.device_id,
            test_id: test.test_id,
            rerun: parameterEditMode ? false : test.rerun,
            approve: false,
            approve_time: "null",
            dispatch: false,
            dispatch_time: "null",
            remarks: parameterRemarks || "",
            verified_by: verified_by,
            parameters: parameters,
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
            verified_by: verified_by,
          };
        }
      });

      const payload = {
        date: date,
        barcode: barcode,
        locationId: locationId,
        testdetails: testDetailsData,
        processed_records: processedRecords,
      };

      console.log("DEBUG: Sending POST request with payload:", payload);

      const postResult = await apiRequest(
        `${Labbaseurl}test-value/save/`,
        "POST",
        payload
      );

      if (postResult.success) {
        alert(postResult.data.message || "Test details saved successfully!");
        fetchTestDetails(barcode, null, testName);
        setEditMode({});
        setParameterEditMode(false);

        setTimeout(() => {
          handleBack();
        }, 1000);
      } else {
        console.error("Error saving test details:", postResult);
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
    const barcode = location.state?.barcode;
    const stateFromDate = location.state?.fromDate;
    const stateToDate = location.state?.toDate;
    
    navigate("/PatientDetails", { 
      state: { 
        barcode: barcode,
        fromDate: stateFromDate || new Date(),
        toDate: stateToDate || new Date()
      } 
    });
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
        <PatientInfo>
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
        </PatientInfo>
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
                        <Input
                          type="text"
                          value={test.method || ""}
                          disabled
                        />
                      </FormGroup>
                    </FormRow>

                    <FormRow>
                      <FormGroup>
                        <Label>
                          Value {(!initialValues[test.testname] || initialValues[test.testname].trim() === "") && 
                                 <span style={{ color: "red" }}>*</span>}
                        </Label>
                        {test.value_option && test.value_option.length > 0 ? (
                          (!initialValues[test.testname] || initialValues[test.testname].trim() === "") ? (
                            <SelectWrapper>
                              <Select
                                value={values[test.testname] || ""}
                                onChange={(e) => handleValueChange(test.testname, e)}
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
                              initialValues[test.testname] &&
                              initialValues[test.testname].trim() !== ""
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

                    <CommentBox>
                      <CommentLabel>Comments (Optional)</CommentLabel>
                      <CommentTextArea
                        value={comments[test.testname] || ""}
                        onChange={(e) => handleCommentChange(test.testname, e)}
                        placeholder="Add any comments or observations..."
                      />
                    </CommentBox>

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
                        Parameters ({Object.values(test.parametersBySubtitle).flat().length})
                      </ParameterTitle>
                    </div>

                    <FormRow style={{ marginBottom: "1.5rem" }}>
                      <FormGroup>
                        <Label>Specimen Type</Label>
                        <Input type="text" value={test.specimen_type || ""} disabled />
                      </FormGroup>
                      <FormGroup>
                        <Label>Department</Label>
                        <Input type="text" value={test.department || ""} disabled />
                      </FormGroup>
                      <FormGroup>
                        <Label>NABL</Label>
                        <Input type="text" value={test.NABL ? "Yes" : "No"} disabled />
                      </FormGroup>
                    </FormRow>

                    {Object.entries(test.parametersBySubtitle).map(([subtitle, parameters], subtitleIndex) => (
                      <SubtitleSection key={subtitleIndex}>
                        <SubtitleHeader>{subtitle}</SubtitleHeader>
                        <ParameterGrid>
                          {parameters.map((param, paramIndex) => {
                            const paramName = param.name || param.test_name;
                            const uniqueKey = `${test.testname}_${paramName}`;
                            const hasValueOptions = param.value_option && param.value_option.length > 0;
                            const isCalculatedField = ['TESTCODE001', 'TESTCODE002', 'TESTCODE003', 'TESTCODE004'].includes(param.test_code);
                            const isDisabled = !isCalculatedField && initialValues[uniqueKey] && initialValues[uniqueKey].trim() !== "";

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
                                    <Label>Value {!isDisabled && <span style={{ color: "red" }}>*</span>}</Label>
                                    {hasValueOptions && !isDisabled ? (
                                      <SelectWrapper>
                                        <Select
                                          value={values[uniqueKey] || ""}
                                          onChange={(e) => handleParameterValueChange(test.testname, paramName, e)}
                                          disabled={isDisabled}
                                        >
                                          <option value="">Select value</option>
                                          {param.value_option.map((option, optIndex) => (
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
                                        value={values[uniqueKey] || ""}
                                        onChange={!isDisabled ? (e) => handleParameterValueChange(test.testname, paramName, e) : undefined}
                                        disabled={isDisabled}
                                        placeholder={!isDisabled ? "Enter value" : "Value available"}
                                      />
                                    )}
                                  </FormGroup>

                                  <FormGroup>
                                    <Label>Unit</Label>
                                    <Input type="text" value={param.unit || ""} disabled />
                                  </FormGroup>

                                  <FormGroup>
                                    <Label>Reference Range</Label>
                                    <Input type="text" value={param.reference_range || ""} disabled />
                                  </FormGroup>

                                  <FormGroup>
                                    <Label>Method</Label>
                                    <Input type="text" value={param.method || ""} disabled />
                                  </FormGroup>
                                </FormRow>

                                <CommentBox>
                                  <CommentLabel>Comments (Optional)</CommentLabel>
                                  <CommentTextArea
                                    value={parameterComments[uniqueKey] || ""}
                                    onChange={(e) => handleParameterCommentChange(test.testname, paramName, e)}
                                    placeholder="Add any comments or observations for this parameter..."
                                  />
                                </CommentBox>
                              </ParameterCard>
                            );
                          })}
                        </ParameterGrid>
                      </SubtitleSection>
                    ))}

                    {Object.values(test.parametersBySubtitle).flat().some((param) => {
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