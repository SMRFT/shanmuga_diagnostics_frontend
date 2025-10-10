import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { ArrowLeft, Save, Edit } from "lucide-react";
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

// Styled components (keeping your existing styles)
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

function TestDetails() {
  const [testDetails, setTestDetails] = useState([]);
  const [values, setValues] = useState({});
  const [remarks, setRemarks] = useState({});
  const [parameterRemarks, setParameterRemarks] = useState("");
  const [editMode, setEditMode] = useState({});
  const [parameterEditMode, setParameterEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [initialValues, setInitialValues] = useState({}); // Track initial values from API
  const [processedRecords, setProcessedRecords] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get("date");
  const patientId = queryParams.get("patient_id");
  const patientname = queryParams.get("patientname");
  const age = queryParams.get("age");
  const barcode = queryParams.get("barcode");
  const locationId = queryParams.get("locationId");
  const testName = queryParams.get("test_name");
  const navigate = useNavigate();
  const verified_by = localStorage.getItem("name") || "";
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const fetchTestDetails = async (barcode, deviceId = null, testName = null) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters - IMPORTANT: Include test_name for filtering
      let queryParams = `barcode=${encodeURIComponent(barcode)}`;
      if (deviceId) {
        queryParams += `&device_id=${encodeURIComponent(deviceId)}`;
      }
      // ADD TEST NAME FILTER TO API CALL
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

      // Log filtering information
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

      // The backend now does the filtering, so we don't need to filter again here
      // But we can add an extra safety check
      const filteredTests = testName
        ? allTests.filter((test) => test.testname === testName)
        : allTests;

      console.log(`DEBUG: Processing ${filteredTests.length} tests after filtering`);

      const groupedTests = filteredTests.reduce((acc, test) => {
        const testName = test.testname;
        const deviceId = test.device_id || "";
        const groupKey = `${testName}_${deviceId}`;

        if (!acc[groupKey]) {
          acc[groupKey] = {
            testname: testName,
            originalTestname: testName,
            test_id: test.test_id,
            department: test.department,
            NABL: test.NABL,
            specimen_type: test.specimen_type || "",
            method: test.method,
            sample_status: test.sample_status,
            device_id: deviceId,
            parameters: [],
          };
        }

        if (
          test.parameter_name &&
          test.parameter_name !== null &&
          test.parameter_name !== "N/A"
        ) {
          acc[groupKey].parameters.push({
            name: test.parameter_name,
            test_name: test.parameter_name,
            test_code: test.test_code,
            unit: test.unit,
            reference_range: test.reference_range,
            method: test.method,
            value: test.test_value,
            processing_status: test.processing_status,
          });
        } else if (!test.parameter_name || test.parameter_name === null) {
          acc[groupKey].unit = test.unit;
          acc[groupKey].reference_range = test.reference_range;
          acc[groupKey].test_value = test.test_value;
          acc[groupKey].test_code = test.test_code;
          acc[groupKey].processing_status = test.processing_status;
        }

        return acc;
      }, {});

      const transformedTests = Object.values(groupedTests);
      setTestDetails(transformedTests);

      let tempValues = {};
      let tempEditMode = {};
      let tempInitialValues = {};

      transformedTests.forEach((test) => {
        if (test.parameters && test.parameters.length > 0) {
          test.parameters.forEach((param) => {
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

      setValues(tempValues);
      setEditMode(tempEditMode);
      setInitialValues(tempInitialValues);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching test details:", error);
      setError(`Failed to load test details: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (barcode && testName) {
      // Pass the specific test name to fetch only that test's data
      fetchTestDetails(barcode, null, testName);
    } else if (barcode) {
      // Fallback to all tests if no specific test name
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

    setValues((prevValues) => ({
      ...prevValues,
      [uniqueKey]: value,
    }));
  };

  const handleRemarksChange = (testname, event) => {
    setRemarks((prevRemarks) => ({
      ...prevRemarks,
      [testname]: event.target.value,
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

  // Updated save button validation - all values must be filled and remarks required for edited fields
  const isSaveButtonEnabled = () => {
    // Check if all required values are filled
    let allValuesFilled = true;
    let remarksRequiredForEditedFields = true;

    testDetails.forEach((test) => {
      if (test.parameters && test.parameters.length > 0) {
        // For parameterized tests, check each parameter value
        let hasEditedParameters = false;

        test.parameters.forEach((param) => {
          const paramName = param.name || param.test_name;
          const uniqueKey = `${test.testname}_${paramName}`;
          const paramValue = values[uniqueKey];
          const initialValue = initialValues[uniqueKey];

          if (!paramValue || paramValue.trim() === "") {
            allValuesFilled = false;
          }

          // Check if this parameter was edited (initially empty and now has value)
          if (
            (!initialValue || initialValue.trim() === "") &&
            paramValue &&
            paramValue.trim() !== ""
          ) {
            hasEditedParameters = true;
          }
        });

        // If any parameters were edited, parameter remarks are required
        if (
          hasEditedParameters &&
          (!parameterRemarks || parameterRemarks.trim() === "")
        ) {
          remarksRequiredForEditedFields = false;
        }
      } else {
        // For non-parameterized tests, check the test value
        const testValue = values[test.testname];
        const initialValue = initialValues[test.testname];

        if (!testValue || testValue.trim() === "") {
          allValuesFilled = false;
        }

        // Check if this test was edited and remarks are required
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

    const validateTestValue = (value, paramName, testName) => {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        throw new Error(`Value for ${paramName} in ${testName} is required`);
      }
    };

    try {
      const validationErrors = [];

      testDetails.forEach((test) => {
        if (
          test.parameters &&
          Array.isArray(test.parameters) &&
          test.parameters.length > 0
        ) {
          test.parameters.forEach((param) => {
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
        return;
      }

      const testDetailsData = testDetails.map((test) => {
        if (
          test.parameters &&
          Array.isArray(test.parameters) &&
          test.parameters.length > 0
        ) {
          return {
            testname: test.testname,
            rerun: parameterEditMode ? false : test.rerun,
            approve: false,
            approve_time: "null",
            dispatch: false,
            dispatch_time: "null",
            department: test.department || "",
            NABL: test.NABL || "",
            remarks: parameterRemarks || "",
            verified_by: verified_by,
            parameters: test.parameters.map((param) => {
              const paramName = param.name || param.test_name;
              const uniqueKey = `${test.testname}_${paramName}`;
              return {
                name: paramName,
                value: values[uniqueKey] || "",
                unit: param.unit || "",
                specimen_type: test.specimen_type || "",
                reference_range: param.reference_range || "",
                method: param.method || "",
              };
            }),
          };
        } else {
          return {
            testname: test.testname,
            specimen_type: test.specimen_type || "",
            value: values[test.testname] || "",
            unit: test.unit || "",
            reference_range: test.reference_range || "",
            method: test.method || "",
            department: test.department || "",
            NABL: test.NABL || "",
            remarks: remarks[test.testname] || "",
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
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("An error occurred while saving test details. Please try again.");
    }
  };
const handleBack = () => {
  navigate("/PatientDetails", { state: { barcode, date } });
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
                {/* Test without parameters */}
                {!test.parameters ||
                !Array.isArray(test.parameters) ||
                test.parameters.length === 0 ? (
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
                    </FormRow>

                    <FormRow>
                      <FormGroup>
                        <Label>Value</Label>
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
                      </FormGroup>
                    </FormRow>

                    {/* Show remarks section if value was edited (initially empty and now has value) */}
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

                    <FormRow>
                      <FormGroup style={{ alignSelf: "flex-end" }}>
                        {/* <EditButton
                          type="button"
                          onClick={() => toggleEditMode(test.testname)}
                        >
                          <Edit size={16} />
                          {editMode[test.testname] ? "Cancel Edit" : "Edit"}
                        </EditButton> */}
                      </FormGroup>
                    </FormRow>

                    {editMode[test.testname] && (
                      <RemarksSection>
                        <FormGroup>
                          <Label>Remarks</Label>
                          <TextArea
                            value={remarks[test.testname] || ""}
                            onChange={(e) =>
                              handleRemarksChange(test.testname, e)
                            }
                            placeholder="Enter remarks"
                          />
                        </FormGroup>
                      </RemarksSection>
                    )}
                  </>
                ) : (
                  /* Test with parameters */
                  <ParameterSection>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <ParameterTitle>
                        Parameters ({test.parameters.length})
                      </ParameterTitle>
                    </div>

                    {test.parameters.map((param, paramIndex) => {
                      const paramName = param.name || param.test_name;
                      const uniqueKey = `${test.testname}_${paramName}`;

                      return (
                        <ParameterCard key={`${uniqueKey}-${paramIndex}`}>
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
                              <Label>Specimen Type</Label>
                              <Input
                                type="text"
                                value={test.specimen_type || ""}
                                disabled
                              />
                            </FormGroup>

                            <FormGroup>
                              <Label>Value</Label>
                              <Input
                                type="text"
                                value={values[uniqueKey] || ""}
                                onChange={
                                  !initialValues[uniqueKey] ||
                                  initialValues[uniqueKey].trim() === ""
                                    ? (e) =>
                                        handleParameterValueChange(
                                          test.testname,
                                          paramName,
                                          e
                                        )
                                    : undefined
                                }
                                disabled={
                                  initialValues[uniqueKey] &&
                                  initialValues[uniqueKey].trim() !== ""
                                }
                                placeholder={
                                  !initialValues[uniqueKey] ||
                                  initialValues[uniqueKey].trim() === ""
                                    ? "Enter value"
                                    : "Value available"
                                }
                              />
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
                          </FormRow>
                        </ParameterCard>
                      );
                    })}

                    {/* Check if any parameters were edited and show parameter remarks section */}
                    {test.parameters.some((param) => {
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

                    {/* <EditButton type="button" onClick={toggleParameterEditMode}>
                      <Edit size={16} />
                      {parameterEditMode ? "Cancel Edit" : "Edit Remarks"}
                    </EditButton> */}

                    {parameterEditMode && (
                      <RemarksSection>
                        <FormGroup>
                          <Label>
                            Parameter Remarks (Common for all parameters)
                          </Label>
                          <TextArea
                            value={parameterRemarks || ""}
                            onChange={handleParameterRemarksChange}
                            placeholder="Enter common remarks for all parameters"
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
              Save Test Details
            </SaveButton>
          </ButtonContainer>
        </Form>
      )}
    </Container>
  );
}

export default TestDetails;