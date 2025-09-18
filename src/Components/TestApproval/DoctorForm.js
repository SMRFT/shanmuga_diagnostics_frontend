import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from "styled-components";
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

// Container
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Header
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

// Table styles
const TableContainer = styled.div`
  overflow-x: auto;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
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

// Special row styles for test headers and parameters
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

// Button styles
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

// Status indicators
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

function DoctorForm() {
  const [testValues, setTestValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const approved_by = localStorage.getItem("name");
  const location = useLocation();
  const navigate = useNavigate();
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Extract date and patient_id from URL query params
  const queryParams = new URLSearchParams(location.search);
  const selectedDate = queryParams.get("date");
  const patientId = queryParams.get("patient_id");
  const testName = queryParams.get("testname");

  useEffect(() => {
    // Fetch data when date or patientId changes
    if (selectedDate && patientId) {
      fetchTestData(selectedDate, patientId);
    } else {
      setLoading(false);
    }
  }, [selectedDate, patientId]);

  const fetchTestData = async (date, patientId) => {
    setLoading(true);

    try {
      // Build query parameters for filtering
      const queryParams = new URLSearchParams();
      queryParams.append("patient_id", patientId);
      queryParams.append("date", date);
      queryParams.append("testname", testName);

      const url = `${Labbaseurl}test-values/?${queryParams.toString()}`;

      const response = await apiRequest(url, "GET");

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch test data");
      }

      // Parse testdetails if it's a string
      const processedData = response.data.map((item) => ({
        ...item,
        testdetails:
          typeof item.testdetails === "string"
            ? JSON.parse(item.testdetails)
            : item.testdetails,
      }));

      setTestValues(processedData);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load test data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle approve for a test (affects all parameters of that test)
  const handleTestApprove = async (patientId, testIndex, approve_by) => {
    console.log("Requesting approval for:", {
      patientId,
      testIndex,
      approve_by,
    });
    try {
      const test = testValues.find((test) => test.patient_id === patientId);
      const testDetail = test?.testdetails[testIndex];

      if (!test || !testDetail) {
        throw new Error("Test or test detail not found");
      }

      const response = await apiRequest(
        `${Labbaseurl}test-approval/${patientId}/${testIndex}/approve/`,
        "PATCH",
        {
          approve: true,
          approve_by,
          barcode: test.barcode, // Document-level barcode
          created_date: test.created_date, // Document-level created_date
        }
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to approve test");
      }

      if (
        response.data.message &&
        (response.data.message.includes("Test approved successfully") ||
          response.data.message.includes("Test detail approved successfully"))
      ) {
        setTestValues((prevValues) => {
          return prevValues.map((test) => {
            if (test.patient_id === patientId) {
              return {
                ...test,
                testdetails: test.testdetails.map((detail, idx) =>
                  idx === testIndex
                    ? {
                        ...detail,
                        approve: true,
                        approve_by,
                        barcode: test.barcode, // Store at testdetail level
                        created_date: test.created_date, // Store at testdetail level
                      }
                    : detail
                ),
              };
            }
            return test;
          });
        });
        alert("Test approved successfully!");
      } else {
        alert("Approval failed: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Error during approval: " + error.message);
    }
  };

  // Handle rerun for a test (affects all parameters of that test)
  const handleTestRerun = async (patientId, testIndex) => {
    try {
      // Find the test details to get barcode and created_date
      const test = testValues.find((test) => test.patient_id === patientId);
      const testDetail = test?.testdetails[testIndex];

      if (!testDetail) {
        throw new Error("Test detail not found");
      }

      const response = await apiRequest(
        `${Labbaseurl}test-rerun/${patientId}/${testIndex}/rerun/`,
        "PATCH",
        {
          rerun: true,
          barcode: test.barcode, // ✅ use document-level
          created_date: test.created_date, // ✅ use document-level
        }
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to initiate rerun");
      }

      setTestValues((prevValues) => {
        return prevValues.map((test) => {
          if (test.patient_id === patientId) {
            return {
              ...test,
              testdetails: test.testdetails.map((detail, idx) =>
                idx === testIndex
                  ? {
                      ...detail,
                      rerun: true,
                      barcode: detail.barcode, // Preserve barcode
                      created_date: detail.created_date, // Preserve created_date
                    }
                  : detail
              ),
            };
          }
          return test;
        });
      });
      alert("Test rerun initiated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Error during rerun: " + error.message);
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

  const handleBack = () => {
    // Extract barcode from testValues (assuming it's consistent across testValues)
    const barcode = testValues.length > 0 ? testValues[0].barcode : "";
    navigate("/PatientList", { state: { barcode } });
  };

  // Convert Roman numerals for parameter numbering
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

  // Generate rows for hierarchical display
  const generateTableRows = () => {
    const rows = [];
    let testNumber = 1;

    testValues.forEach((test, testIndex) => {
      test.testdetails.forEach((detail, detailIndex) => {
        // Add test title row with approve/rerun buttons and remarks
        if (detail.parameters && detail.parameters.length > 0) {
          rows.push(
            <TestHeaderRow key={`test-${testIndex}-${detailIndex}`}>
              <TestTitleCell colSpan="2">
                <strong>
                  {testNumber}. {detail.testname || "N/A"}
                </strong>
              </TestTitleCell>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <TestRemarksCell>{detail.remarks || "N/A"}</TestRemarksCell>
              <td>
                <RerunButton
                  onClick={() => handleTestRerun(test.patient_id, detailIndex)}
                  disabled={detail.approve || detail.rerun}
                >
                  <RotateCcw size={14} />
                  {detail.rerun ? "Rerun Initiated" : "Rerun"}
                </RerunButton>
              </td>
              <td>
                <ApproveButton
                  onClick={() =>
                    handleTestApprove(test.patient_id, detailIndex, approved_by)
                  }
                  disabled={detail.approve || detail.rerun}
                >
                  <CheckCircle size={14} />
                  {detail.approve ? "Approved" : "Approve"}
                </ApproveButton>
              </td>
            </TestHeaderRow>
          );

          // Add parameter rows (without approve/rerun buttons)
          detail.parameters.forEach((parameter, paramIndex) => {
            rows.push(
              <ParameterRow
                key={`param-${testIndex}-${detailIndex}-${paramIndex}`}
              >
                <td></td>
                <ParameterNameCell>
                  {getRomanNumeral(paramIndex)}. {parameter.name || "N/A"}
                </ParameterNameCell>
                <td>{parameter.specimen_type || "N/A"}</td>
                <ValueCell>
                  <ValueContainer>
                    <ValueText>{parameter.value || "N/A"}</ValueText>
                    <BadgeContainer>
                      {getStatusBadge(
                        parameter.value,
                        parameter.reference_range
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
                <td colSpan="3"></td>{" "}
                {/* Empty cells for approve/rerun columns */}
              </ParameterRow>
            );
          });

          testNumber++;
        } else {
          // If no parameters, show test with its actual values and buttons using TestHeaderRow for consistency
          // Merge the first two columns (Sl. No and Test Name) for tests without parameters
          rows.push(
            <TestHeaderRow key={`test-no-params-${testIndex}-${detailIndex}`}>
              <TestTitleCellMerged colSpan="2">
                <strong>
                  {testNumber}. {detail.testname || "N/A"}
                </strong>
              </TestTitleCellMerged>
              <td>{detail.specimen_type || "N/A"}</td>
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
              <td>
                <RerunButton
                  onClick={() => handleTestRerun(test.patient_id, detailIndex)}
                  disabled={detail.approve || detail.rerun}
                >
                  <RotateCcw size={14} />
                  {detail.rerun ? "Rerun Initiated" : "Rerun"}
                </RerunButton>
              </td>
              <td>
                <ApproveButton
                  onClick={() =>
                    handleTestApprove(test.patient_id, detailIndex, approved_by)
                  }
                  disabled={detail.approve || detail.rerun}
                >
                  <CheckCircle size={14} />
                  {detail.approve ? "Approved" : "Approve"}
                </ApproveButton>
              </td>
            </TestHeaderRow>
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
      <Header>
        <Title>Shanmuga Diagnosis</Title>
        <BackButton onClick={handleBack}>
          <ChevronLeft size={18} />
          Back
        </BackButton>
      </Header>

      {patientId && (
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
            </>
          )}
        </PatientInfo>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <th>Sl. No</th>
              <th>Test Name / Parameters</th>
              <th>Specimen Type</th>
              <th>Value</th>
              <th>Unit</th>
              <th>Reference Range</th>
              <th>Remarks</th>
              <th>Rerun</th>
              <th>Approve</th>
            </tr>
          </TableHead>
          <TableBody>
            {testValues.length > 0 ? (
              generateTableRows()
            ) : (
              <tr>
                <NoData colSpan="9">
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
