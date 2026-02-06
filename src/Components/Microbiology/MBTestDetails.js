import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { ArrowLeft, Save, Edit, ChevronDown, X, Check } from "lucide-react";
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--gray-light);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--dark);
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--gray);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition);

  &:hover {
    background-color: var(--gray-light);
    color: var(--dark);
  }
`;

const PreviewTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
`;

const TableHeader = styled.th`
  background-color: var(--primary);
  color: white;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  border: 1px solid var(--gray-light);
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: var(--light);
  }
  
  &:hover {
    background-color: #e3f2fd;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
`;

const ModalButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const CancelButton = styled(Button)`
  background-color: var(--gray);
  
  &:hover {
    background-color: var(--dark);
  }
`;

const ConfirmButton = styled(Button)`
  background-color: var(--success);
  
  &:hover {
    background-color: var(--info);
  }
`;

const ResultBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${props => 
    props.type === 'Sensitive' ? '#4caf50' : 
    props.type === 'Intermediate' ? '#ff9800' : 
    props.type === 'Nil' ? '#0f0d0a' : 
    '#f44336'};
  color: white;
`;

// Helper function to get result status
const getResultStatus = (value) => {
  if (!value || value.trim() === "") {
    return "Resistant";
  }
  return "Sensitive";
};

function MBTestDetails() {
  const [testDetails, setTestDetails] = useState([]);
  const [values, setValues] = useState({});
  const [result, setResult] = useState({});
  const [remarks, setRemarks] = useState({});
  const [comments, setComments] = useState({});
  const [parameterComments, setParameterComments] = useState({});
  const [parameterRemarks, setParameterRemarks] = useState("");
  const [colonyCount, setColonyCount] = useState({});
  const [editMode, setEditMode] = useState({});
  const [parameterEditMode, setParameterEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [initialValues, setInitialValues] = useState({});
  const [processedRecords, setProcessedRecords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [parameterResults, setParameterResults] = useState({});

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
  const parameterType = queryParams.get("parameter_type");
  const navigate = useNavigate();
  const verified_by = localStorage.getItem("name") || "";
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const colonyCountOptions = [
    ">10,000 CFU /mL",
    ">50,000 CFU /mL",
    ">1,00,000 CFU /mL"
  ];

  // Update the remarksOptions constant to include shorter titles:
const remarksOptions = [
  {
    title: "24hrs - No growth",
    text: "No growth in culture, Culture is sterile after 24 hrs of incubation."
  },
  {
    title: "48hrs - No growth",
    text: "No significant Growth in culture after 48 hrs of incubation."
  }
];

  const fetchTestDetails = async (barcode, test_id = null, testName = null, parameterType = null) => {
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
      if (parameterType) {
        queryParams += `&parameter_type=${encodeURIComponent(parameterType)}`;
      }

      console.log(`DEBUG: Fetching test details with query: ${queryParams}`);

      const response = await apiRequest(
        `${Labbaseurl}mb-compare_test_details/?${queryParams}`,
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
            test_id: test.test_id,
            test_code: test.test_code,
            department: test.department,
            NABL: test.NABL,
            specimen_type: test.specimen_type || "",
            method: test.method,
            sample_status: test.sample_status,
            parameter_type: test.parameter_type || "",
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
      let tempResults = {};

      transformedTests.forEach((test) => {
        if (test.parametersBySubtitle && Object.keys(test.parametersBySubtitle).length > 0) {
          Object.values(test.parametersBySubtitle).flat().forEach((param) => {
            const paramName = param.name || param.test_name;
            const uniqueKey = `${test.testname}_${paramName}`;
            const paramValue = param.value || "";
            tempValues[uniqueKey] = paramValue;
            tempInitialValues[uniqueKey] = paramValue;
            tempResults[uniqueKey] = getResultStatus(paramValue);
          });
        } else {
          const testValue = test.test_value || "";
          tempValues[test.testname] = testValue;
          tempEditMode[test.testname] = false;
          tempInitialValues[test.testname] = testValue;
          tempResults[test.testname] = getResultStatus(testValue);
        }
      });

      setEditMode(tempEditMode);
      setInitialValues(tempInitialValues);
      setValues(tempValues);
      setParameterResults(tempResults);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching test details:", error);
      setError(`Failed to load test details: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (barcode && testName) {
      fetchTestDetails(barcode, null, testName, parameterType);
    } else if (barcode) {
      fetchTestDetails(barcode, null, null, parameterType);
    } else {
      setError("No barcode provided");
      setLoading(false);
    }
  }, [barcode, testName, parameterType]);

  const handleValueChange = (testname, event) => {
    setValues((prevValues) => ({
      ...prevValues,
      [testname]: event.target.value,
    }));
  };

  const handleParameterValueChange = (testname, paramName, event) => {
    const { value } = event.target;
    const uniqueKey = `${testname}_${paramName}`;

    setValues((prevValues) => ({
      ...prevValues,
      [uniqueKey]: value,
    }));
    
    // Update result when value changes
    setParameterResults((prevResults) => ({
      ...prevResults,
      [uniqueKey]: getResultStatus(value),
    }));
  };

  const handleResultChange = (testname, paramName, event) => {
    const { value } = event.target;
    const uniqueKey = paramName ? `${testname}_${paramName}` : testname;
    
    setParameterResults((prevResults) => ({
      ...prevResults,
      [uniqueKey]: value,
    }));
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

  const handleColonyCountChange = (testname, event) => {
    setColonyCount((prevCounts) => ({
      ...prevCounts,
      [testname]: event.target.value,
    }));
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

  const preparePreviewData = () => {
    const preview = [];
    
    if (parameterType === 'Normal') {
      testDetails.forEach((test) => {
        const previewItem = {
          testName: test.testname,
          department: test.department || "-",
          specimen_type: test.specimen_type || "-",
          remarks: parameterRemarks || remarks[test.testname] || "-"
        };
        
        if (test.specimen_type === "URINE") {
          previewItem.colony_count = colonyCount[test.testname] || "-";
        }
        
        preview.push(previewItem);
      });
    } else {
      testDetails.forEach((test) => {
        const testRows = [];
        
        if (test.parametersBySubtitle && Object.keys(test.parametersBySubtitle).length > 0) {
          Object.entries(test.parametersBySubtitle).forEach(([subtitle, parameters]) => {
            parameters.forEach((param) => {
              const paramName = param.name || param.test_name;
              const uniqueKey = `${test.testname}_${paramName}`;
              const value = values[uniqueKey] || "";
              
              testRows.push({
                subtitle: subtitle,
                antimicrobial: paramName,
                zoneOfInhibition: value,
                result: parameterResults[uniqueKey] || getResultStatus(value),
                comment: parameterComments[uniqueKey] || "-",
              });
            });
          });
        } else {
          testRows.push({
            subtitle: "-",
            antimicrobial: "-",
            zoneOfInhibition: values[test.testname] || "",
            result: parameterResults[test.testname] || getResultStatus(values[test.testname]),
            comment: comments[test.testname] || "-",
          });
        }
        
        const previewItem = {
          testName: test.testname,
          rows: testRows,
          remarks: parameterRemarks || remarks[test.testname] || "-"
        };
        
        if (test.specimen_type === "URINE") {
          previewItem.colony_count = colonyCount[test.testname] || "-";
        }
        
        preview.push(previewItem);
      });
    }
    
    return preview;
  };

  const handlePreviewSubmit = (event) => {
    event.preventDefault();
    const preview = preparePreviewData();
    setPreviewData(preview);
    setShowPreview(true);
  };

  const handleConfirmSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const testDetailsData = testDetails.map((test) => {
        const isNormalType = parameterType === 'Normal';
        const isUrineSpecimen = test.specimen_type === "URINE";
        
        const baseData = {
          parameter_type: test.parameter_type,
          test_id: test.test_id,
          test_code: test.test_code,
          remarks: parameterRemarks || remarks[test.testname] || "",
          rerun: false,
          approve: false,
          approve_time: "null",
          dispatch: false,
          dispatch_time: "null",
          verified_by: verified_by,
        };

        if (isUrineSpecimen) {
          baseData.colony_count = colonyCount[test.testname] || "";
        }
        
        if (isNormalType) {
          return baseData;
        }
        
        if (test.parametersBySubtitle && Object.keys(test.parametersBySubtitle).length > 0) {
          const parameters = [];
          Object.entries(test.parametersBySubtitle).forEach(([subtitle, params]) => {
            params.forEach((param) => {
              const paramName = param.name || param.test_name;
              const uniqueKey = `${test.testname}_${paramName}`;
              parameters.push({
                test_code: param.test_code || "",
                result: parameterResults[uniqueKey] || getResultStatus(values[uniqueKey]),
                value: values[uniqueKey] || "",
                comment: parameterComments[uniqueKey] || "",
              });
            });
          });

          return {
            ...baseData,
            parameters: parameters,
          };
        } else {
          return {
            ...baseData,
            result: parameterResults[test.testname] || getResultStatus(values[test.testname]),
            value: values[test.testname] || "",
            comment: comments[test.testname] || "",
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
        `${Labbaseurl}mb-test-value/save/`,
        "POST",
        payload
      );

      if (postResult.success) {
        alert(postResult.data.message || "Test details saved successfully!");
        setShowPreview(false);
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

  const handleCancelPreview = () => {
    setShowPreview(false);
    setIsSubmitting(false);
  };

  const handleBack = () => {
    const barcode = location.state?.barcode;
    const stateFromDate = location.state?.fromDate;
    const stateToDate = location.state?.toDate;
    
    navigate("/MBPatientDetails", { 
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
          {parameterType && (
            <InfoItem>
              <span>Type:</span> {parameterType}
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
        <Form onSubmit={handlePreviewSubmit}>
          {testDetails.map((test, index) => (
            <TestCard key={index}>
              <TestHeader>{test.testname}</TestHeader>
              <TestContent>
                {parameterType === 'Normal' ? (
                  <>
                    <FormRow>
                      <FormGroup>
                        <Label>Specimen Type</Label>
                        <Input type="text" value={test.specimen_type || ""} disabled />
                      </FormGroup>
                      
                    </FormRow>
                    
                    <RemarksSection>
  <FormGroup>
    <Label>
      Impression <span style={{ color: "red" }}>*</span>
    </Label>
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
      {remarksOptions.map((option, idx) => (
        <Button
          key={idx}
          type="button"
          onClick={() => {
            setParameterRemarks(option.text);
            handleRemarksChange(test.testname, { target: { value: option.text } });
          }}
          style={{
            fontSize: '0.875rem',
            padding: '0.5rem 0.75rem',
            backgroundColor: 'var(--secondary)',
            minWidth: '45%'
          }}
        >
          {option.title}
        </Button>
      ))}
    </div>
    <TextArea
      value={parameterRemarks || remarks[test.testname] || ""}
      onChange={(e) => {
        setParameterRemarks(e.target.value);
        handleRemarksChange(test.testname, e);
      }}
      placeholder="Enter remarks or select from options above (required)"
      style={{
        borderColor:
          (!parameterRemarks && !remarks[test.testname]) ||
          (parameterRemarks?.trim() === "" && remarks[test.testname]?.trim() === "")
            ? "red"
            : undefined,
      }}
    />
  </FormGroup>
</RemarksSection>
                  </>
                ) : (
                  <>
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
                          
                          {test.specimen_type === "URINE" && (
                            <FormGroup>
                              <Label>Colony Count <span style={{ color: "red" }}>*</span></Label>
                              <SelectWrapper>
                                <Select
                                  value={colonyCount[test.testname] || ""}
                                  onChange={(e) => handleColonyCountChange(test.testname, e)}
                                  required
                                >
                                  <option value="">Select colony count</option>
                                  {colonyCountOptions.map((option, idx) => (
                                    <option key={idx} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Select>
                                <SelectIcon size={18} />
                              </SelectWrapper>
                            </FormGroup>
                          )}
                          
                          <FormGroup>
                            <Label>Result</Label>
                            <SelectWrapper>
                              <Select
                                value={parameterResults[test.testname] || getResultStatus(values[test.testname])}
                                onChange={(e) => handleResultChange(test.testname, null, e)}
                                style={{
                                  color: (parameterResults[test.testname] || getResultStatus(values[test.testname])) === 'Sensitive' ? '#4caf50' : 
                                         (parameterResults[test.testname] || getResultStatus(values[test.testname])) === 'Intermediate' ? '#ff9800' : 
                                         (parameterResults[test.testname] || getResultStatus(values[test.testname])) === 'Nil' ? '#151310' : 
                                         '#f44336',
                                  fontWeight: '600'
                                }}
                              >
                                <option value="Sensitive" style={{ color: '#4caf50' }}>Sensitive</option>
                                <option value="Intermediate" style={{ color: '#ff9800' }}>Intermediate</option>
                                <option value="Resistant" style={{ color: '#f44336' }}>Resistant</option>
                                <option value="Nil" style={{ color: '#1f1a1a' }}>Nil</option>
                              </Select>
                              <SelectIcon size={18} />
                            </SelectWrapper>
                          </FormGroup>
                        </FormRow>

                        <FormRow>
                          <FormGroup>
                            <Label>Value</Label>
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
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          {remarksOptions.map((option, idx) => (
            <Button
              key={idx}
              type="button"
              onClick={() => {
                handleRemarksChange(test.testname, { target: { value: option.text } });
              }}
              style={{
                fontSize: '0.875rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--secondary)',
                minWidth: '45%'
              }}
            >
              {option.title}
            </Button>
          ))}
        </div>
        <TextArea
          value={remarks[test.testname] || ""}
          onChange={(e) =>
            handleRemarksChange(test.testname, e)
          }
          placeholder="Enter remarks or select from options above (required)"
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
                          
                          {test.specimen_type === "URINE" && (
                            <FormGroup>
                              <Label>Colony Count <span style={{ color: "red" }}>*</span></Label>
                              <SelectWrapper>
                                <Select
                                  value={colonyCount[test.testname] || ""}
                                  onChange={(e) => handleColonyCountChange(test.testname, e)}
                                  required
                                >
                                  <option value="">Select colony count</option>
                                  {colonyCountOptions.map((option, idx) => (
                                    <option key={idx} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </Select>
                                <SelectIcon size={18} />
                              </SelectWrapper>
                            </FormGroup>
                          )}
                          
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
                                const isDisabled = initialValues[uniqueKey] && initialValues[uniqueKey].trim() !== "";

                                return (
                                  <ParameterCard key={paramIndex}>
                                    <FormRow>
                                      <FormGroup>
                                        <Label>Antimicrobial</Label>
                                        <WrappedInput
                                          as="textarea"
                                          value={paramName}
                                          disabled
                                          style={{ resize: "none" }}
                                        />
                                      </FormGroup>
                                      <FormGroup>
                                        <Label>Result</Label>
                                        <SelectWrapper>
                                          <Select
                                            value={parameterResults[uniqueKey] || getResultStatus(values[uniqueKey])}
                                            onChange={(e) => handleResultChange(test.testname, paramName, e)}
                                            style={{
                                              color: (parameterResults[uniqueKey] || getResultStatus(values[uniqueKey])) === 'Sensitive' ? '#4caf50' : 
                                                     (parameterResults[uniqueKey] || getResultStatus(values[uniqueKey])) === 'Intermediate' ? '#ff9800' : 
                                                     (parameterResults[uniqueKey] || getResultStatus(values[uniqueKey])) === 'Nil' ? '#100e0b' : 
                                                     '#f44336',
                                              fontWeight: '600'
                                            }}
                                          >
                                            <option value="Sensitive" style={{ color: '#4caf50' }}>Sensitive</option>
                                            <option value="Intermediate" style={{ color: '#ff9800' }}>Intermediate</option>
                                            <option value="Resistant" style={{ color: '#f44336' }}>Resistant</option>
                                            <option value="Nil" style={{ color: '#111010' }}>Nil</option>
                                          </Select>
                                          <SelectIcon size={18} />
                                        </SelectWrapper>
                                      </FormGroup>

                                      <FormGroup>
                                        <Label>Zone of Inhibition (mm)</Label>
                                        {hasValueOptions ? (
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
                                            onChange={(e) => handleParameterValueChange(test.testname, paramName, e)}
                                            disabled={isDisabled}
                                            placeholder={!isDisabled ? "Enter value" : "Value available"}
                                          />
                                        )}
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
        Impression <span style={{ color: "red" }}>*</span>
      </Label>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
        {remarksOptions.map((option, idx) => (
          <Button
            key={idx}
            type="button"
            onClick={() => {
              setParameterRemarks(option.text);
            }}
            style={{
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem',
              backgroundColor: 'var(--secondary)',
              minWidth: '45%'
            }}
          >
            {option.title}
          </Button>
        ))}
      </div>
      <TextArea
        value={parameterRemarks || ""}
        onChange={handleParameterRemarksChange}
        placeholder="Enter remarks or select from options above (required)"
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
                  </>
                )}
              </TestContent>
            </TestCard>
          ))}
          <ButtonContainer>
            <SaveButton type="submit">
              <Save size={18} />
              Preview & Save
            </SaveButton>
          </ButtonContainer>
        </Form>
      )}

      {showPreview && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Preview Test Details</ModalTitle>
              <CloseButton onClick={handleCancelPreview}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>

            {parameterType === 'Normal' ? (
              <>
                <PreviewTable>
                  <thead>
                    <tr>
                      <TableHeader>Test Name</TableHeader>
                      <TableHeader>Department</TableHeader>
                      <TableHeader>Specimen Type</TableHeader>
                      {previewData.some(item => item.colony_count) && (
                        <TableHeader>Colony Count</TableHeader>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.testName}</TableCell>
                        <TableCell>{item.department}</TableCell>
                        <TableCell>{item.specimen_type}</TableCell>
                        {previewData.some(i => i.colony_count) && (
                          <TableCell>{item.colony_count || "-"}</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </tbody>
                </PreviewTable>
                
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1rem', 
                  backgroundColor: 'var(--light)', 
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid var(--gray-light)'
                }}>
                  <strong style={{ color: 'var(--secondary)', fontSize: '1rem' }}>Impression:</strong>
                  <p style={{ marginTop: '0.5rem', color: 'var(--dark)', whiteSpace: 'pre-wrap' }}>
                    {previewData[0]?.remarks || "-"}
                  </p>
                </div>
              </>
            ) : (
              <>
                {previewData.map((testData, testIndex) => (
                  <div key={testIndex} style={{ marginBottom: '2rem' }}>
                    <div style={{ 
                      backgroundColor: 'var(--primary)', 
                      color: 'white', 
                      padding: '0.75rem 1rem',
                      fontWeight: '600',
                      fontSize: '1.125rem',
                      borderRadius: '8px 8px 0 0'
                    }}>
                      {testData.testName}
                    </div>
                    
                    {testData.colony_count && (
                      <div style={{
                        backgroundColor: '#fff3cd',
                        padding: '0.75rem 1rem',
                        borderLeft: '4px solid var(--warning)',
                        marginBottom: '1rem'
                      }}>
                        <strong>Colony Count:</strong> {testData.colony_count}
                      </div>
                    )}
                    
                    <PreviewTable style={{ marginTop: 0 }}>
                      <thead>
                        <tr>
                          <TableHeader>Subtitle</TableHeader>
                          <TableHeader>Antimicrobial</TableHeader>
                          <TableHeader>Zone of Inhibition (mm)</TableHeader>
                          <TableHeader>Result</TableHeader>
                          <TableHeader>Comment</TableHeader>
                        </tr>
                      </thead>
                      <tbody>
                        {testData.rows.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            <TableCell>{row.subtitle}</TableCell>
                            <TableCell>{row.antimicrobial}</TableCell>
                            <TableCell>{row.zoneOfInhibition || "-"}</TableCell>
                            <TableCell>
                              {row.result !== "-" ? (
                                <ResultBadge type={row.result}>{row.result}</ResultBadge>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>{row.comment}</TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </PreviewTable>
                    
                    {testData.remarks && testData.remarks !== "-" && (
                      <div style={{ 
                        marginTop: '0.5rem', 
                        padding: '1rem', 
                        backgroundColor: 'var(--light)', 
                        borderRadius: '0 0 8px 8px',
                        border: '1px solid var(--gray-light)',
                        borderTop: 'none'
                      }}>
                        <strong style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>Impression:</strong>
                        <p style={{ marginTop: '0.25rem', color: 'var(--dark)', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                          {testData.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            <ModalButtonContainer>
              <CancelButton type="button" onClick={handleCancelPreview}>
                <X size={18} />
                Cancel
              </CancelButton>
              <ConfirmButton type="button" onClick={handleConfirmSubmit} disabled={isSubmitting}>
                <Check size={18} />
                {isSubmitting ? "Submitting..." : "Confirm & Submit"}
              </ConfirmButton>
            </ModalButtonContainer>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}

export default MBTestDetails;