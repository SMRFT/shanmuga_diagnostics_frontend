import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { format } from "date-fns";
import { Search, Eye, X, ChevronRight } from "lucide-react";
import { IoIosFemale, IoIosMale } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import apiRequest from "../Auth/apiRequest";

// ─── Global & Styled Components ──────────────────────────────────────────────

const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #4361ee;
    --primary-light: #4895ef;
    --primary-dark: #3a0ca3;
    --success: #28a745;
    --danger: #f72585;
    --warning: #f8961e;
    --light: #f8f9fa;
    --dark: #212529;
    --gray: #6c757d;
    --gray-light: #e9ecef;
    --border-radius: 8px;
    --box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    --transition: all 0.3s ease;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f5f7fb;
    color: var(--dark);
    line-height: 1.5;
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

const Card = styled.div`
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
`;

const SearchSection = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  flex-wrap: wrap;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.8rem;
  color: var(--gray);
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.55rem 0.9rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  width: 220px;
  transition: var(--transition);
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.12);
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1.1rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  height: 36px;
  &:hover {
    background: var(--primary-dark);
  }
  &:disabled {
    background: var(--gray);
    cursor: not-allowed;
  }
`;

const ClearButton = styled(Button)`
  background: var(--light);
  color: var(--dark);
  border: 1px solid var(--gray-light);
  &:hover {
    background: var(--gray-light);
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: var(--gray-light);
  }
  &::-webkit-scrollbar-thumb {
    background: var(--gray);
    border-radius: 20px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
`;

const TableHead = styled.thead`
  background: var(--gray-light);
  th {
    padding: 0.9rem 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--gray);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--gray-light);
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background: rgba(67, 97, 238, 0.04);
    }
  }
  td {
    padding: 0.9rem 1rem;
    vertical-align: middle;
    font-size: 0.875rem;
  }
`;

const GenderIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  margin-right: 0.4rem;
  background: ${(p) =>
    p.gender === "Female" ? "rgba(232,62,140,0.1)" : "rgba(0,123,255,0.1)"};
  color: ${(p) => (p.gender === "Female" ? "#E83E8C" : "#007BFF")};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  background: white;
  color: var(--dark);
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    color: var(--primary);
  }
`;

const NoData = styled.div`
  text-align: center;
  padding: 2.5rem;
  color: var(--gray);
  font-style: italic;
`;

const Footer = styled.div`
  padding: 0.9rem 1.5rem;
  text-align: right;
  color: var(--gray);
  font-size: 0.875rem;
  border-top: 1px solid var(--gray-light);
`;

// ─── Report Modal ─────────────────────────────────────────────────────────────

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: var(--border-radius);
  width: 90vw;
  max-width: 1100px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 2px solid var(--gray-light);
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
`;

const ModalTitle = styled.h2`
  font-size: 1.2rem;
  color: var(--primary-dark);
  margin: 0;
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  flex: 1;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--gray);
  display: flex;
  align-items: center;
  padding: 0.3rem;
  border-radius: 50%;
  transition: var(--transition);
  &:hover {
    background: var(--gray-light);
    color: var(--dark);
  }
`;

const SectionHeading = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary-dark);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 1.25rem 0 0.6rem;
  padding-bottom: 0.3rem;
  border-bottom: 2px solid var(--primary-light);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.6rem 1.2rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const InfoLabel = styled.span`
  font-size: 0.72rem;
  color: var(--gray);
  font-weight: 600;
  text-transform: uppercase;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: var(--dark);
  font-weight: 500;
`;

const TestTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  margin-top: 0.5rem;
`;

const TestTh = styled.th`
  padding: 0.5rem 0.75rem;
  background: var(--gray-light);
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--gray);
  text-transform: uppercase;
  white-space: nowrap;
`;

const TestTd = styled.td`
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--gray-light);
  vertical-align: top;
`;

const DeptHeading = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary-dark);
  text-align: center;
  padding: 0.4rem;
  background: rgba(67, 97, 238, 0.07);
  border-radius: 4px;
  margin: 0.75rem 0 0.3rem;
`;

const ValueSpan = styled.span`
  font-weight: 600;
  color: ${(p) =>
    p.status === "H"
      ? "#dc3545"
      : p.status === "L"
        ? "#0d6efd"
        : "var(--dark)"};
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-light);
  position: sticky;
  bottom: 0;
  background: white;
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getHighLow = (value, reference) => {
  if (!value || !reference) return null;
  const num = parseFloat(value);
  if (isNaN(num)) return null;
  if (reference.includes("-")) {
    const [mn, mx] = reference.split("-").map(parseFloat);
    if (!isNaN(mn) && !isNaN(mx)) {
      if (num < mn) return "L";
      if (num > mx) return "H";
    }
  } else if (reference.includes("<")) {
    const mx = parseFloat(reference.replace("<", ""));
    if (!isNaN(mx) && num > mx) return "H";
  } else if (reference.includes(">")) {
    const mn = parseFloat(reference.replace(">", ""));
    if (!isNaN(mn) && num < mn) return "L";
  }
  return null;
};

const DEPT_ORDER = [
  "Haematology",
  "Coagulation",
  "Biochemistry",
  "Immunology",
  "Immunoassay",
  "Serology",
  "Clinical Pathology",
  "Clinical Chemistry",
  "Cytology",
  "Genetics",
  "Histopathology",
  "Immunohistochemistry",
  "Microbiology",
  "Molecular Biology",
];

// ─── ReportModal Component ────────────────────────────────────────────────────

const ReportModal = ({
  reportData,
  onClose,
  currentIndex,
  totalBarcodes,
  onPrev,
  onNext,
  reportDate,
}) => {
  if (!reportData) return null;

  const { patient_data, signatures } = reportData;
  const patient = Array.isArray(patient_data) ? patient_data[0] : patient_data;
  if (!patient) return null;

  const tests = patient.testdetails || [];

  const testsByDept = tests.reduce((acc, t) => {
    const dept = t.department || "Other";
    (acc[dept] = acc[dept] || []).push(t);
    return acc;
  }, {});

  const sortedDepts = Object.keys(testsByDept).sort((a, b) => {
    const ia = DEPT_ORDER.indexOf(a),
      ib = DEPT_ORDER.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });

  const collectedTime = tests[0]?.samplecollected_time;
  const receivedTime = tests[0]?.received_time;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            Lab Report — {patient.patientname}
            {reportDate && (
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 400,
                  color: "var(--gray)",
                  marginLeft: "0.75rem",
                }}
              >
                {format(new Date(reportDate), "dd MMM yyyy")}
              </span>
            )}
          </ModalTitle>
          <CloseBtn onClick={onClose}>
            <X size={20} />
          </CloseBtn>
        </ModalHeader>

        <ModalBody>
          {/* Patient Info */}
          <SectionHeading>Patient Information</SectionHeading>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>UHID</InfoLabel>
              <InfoValue>{patient.patient_id || "N/A"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Name</InfoLabel>
              <InfoValue>{patient.patientname || "N/A"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Age / Gender</InfoLabel>
              <InfoValue>
                {patient.age} {patient.age_type} / {patient.gender}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Referral</InfoLabel>
              <InfoValue>{patient.refby || "SELF"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Barcode</InfoLabel>
              <InfoValue>{patient.barcode || "N/A"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Bill No</InfoLabel>
              <InfoValue>{patient.bill_no || "N/A"}</InfoValue>
            </InfoItem>
            {collectedTime && (
              <InfoItem>
                <InfoLabel>Collected On</InfoLabel>
                <InfoValue>
                  {format(new Date(collectedTime), "dd MMM yyyy, HH:mm")}
                </InfoValue>
              </InfoItem>
            )}
            {receivedTime && (
              <InfoItem>
                <InfoLabel>Received On</InfoLabel>
                <InfoValue>
                  {format(new Date(receivedTime), "dd MMM yyyy, HH:mm")}
                </InfoValue>
              </InfoItem>
            )}
            <InfoItem>
              <InfoLabel>Reported On</InfoLabel>
              <InfoValue>{format(new Date(), "dd MMM yyyy, HH:mm")}</InfoValue>
            </InfoItem>
          </InfoGrid>

          {/* Test Results */}
          <SectionHeading>Test Results</SectionHeading>
          {sortedDepts.map((dept) => (
            <div key={dept}>
              <DeptHeading>{dept.toUpperCase()}</DeptHeading>
              <TestTable>
                <thead>
                  <tr>
                    <TestTh>Test</TestTh>
                    <TestTh>Specimen</TestTh>
                    <TestTh>Result</TestTh>
                    <TestTh>Unit</TestTh>
                    <TestTh>Reference Range</TestTh>
                    <TestTh>Method</TestTh>
                  </tr>
                </thead>
                <tbody>
                  {testsByDept[dept].map((test, ti) => {
                    const hasParams =
                      test.parameters && test.parameters.length > 0;
                    return (
                      <React.Fragment key={ti}>
                        {/* Main test row */}
                        <tr>
                          <TestTd>
                            <strong>{test.testname}</strong>
                          </TestTd>
                          <TestTd>{test.specimen_type || ""}</TestTd>
                          <TestTd>
                            {!hasParams &&
                              (() => {
                                const hl = getHighLow(
                                  test.value,
                                  test.reference_range,
                                );
                                return (
                                  <ValueSpan status={hl}>
                                    {test.value || ""}{" "}
                                    {hl &&
                                      `▲`.replace("▲", hl === "H" ? "↑" : "↓")}
                                  </ValueSpan>
                                );
                              })()}
                          </TestTd>
                          <TestTd>{!hasParams ? test.unit || "" : ""}</TestTd>
                          <TestTd>
                            {!hasParams ? test.reference_range || "" : ""}
                          </TestTd>
                          <TestTd>
                            {!hasParams
                              ? (test.method || "")
                                  .replace(/\bMethod\b/i, "")
                                  .trim()
                              : ""}
                          </TestTd>
                        </tr>
                        {/* Parameter rows */}
                        {hasParams &&
                          test.parameters.map((param, pi) => {
                            const hl = getHighLow(
                              param.value,
                              param.reference_range,
                            );
                            const subtitle = param.sub_title;
                            return (
                              <React.Fragment key={pi}>
                                {subtitle &&
                                  pi ===
                                    test.parameters.findIndex(
                                      (p) => p.sub_title === subtitle,
                                    ) && (
                                    <tr>
                                      <TestTd
                                        colSpan={6}
                                        style={{
                                          paddingLeft: "1.5rem",
                                          fontWeight: 700,
                                          color: "var(--gray)",
                                          fontSize: "0.75rem",
                                          background: "rgba(0,0,0,0.02)",
                                        }}
                                      >
                                        {subtitle}
                                      </TestTd>
                                    </tr>
                                  )}
                                <tr>
                                  <TestTd
                                    style={{
                                      paddingLeft: "1.5rem",
                                      color: "var(--gray)",
                                    }}
                                  >
                                    {param.name}
                                  </TestTd>
                                  <TestTd>{param.specimen_type || ""}</TestTd>
                                  <TestTd>
                                    <ValueSpan status={hl}>
                                      {param.value || ""}
                                      {hl && ` ${hl === "H" ? "↑" : "↓"}`}
                                    </ValueSpan>
                                  </TestTd>
                                  <TestTd>{param.unit || ""}</TestTd>
                                  <TestTd>{param.reference_range || ""}</TestTd>
                                  <TestTd>
                                    {(param.method || "")
                                      .replace(/\bMethod\b/i, "")
                                      .trim()}
                                  </TestTd>
                                </tr>
                                {param.comment && (
                                  <tr>
                                    <TestTd
                                      colSpan={6}
                                      style={{
                                        paddingLeft: "1.5rem",
                                        fontStyle: "italic",
                                        fontSize: "0.78rem",
                                        color: "var(--gray)",
                                      }}
                                    >
                                      Note: {param.comment}
                                    </TestTd>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        {test.comment && !hasParams && (
                          <tr>
                            <TestTd
                              colSpan={6}
                              style={{
                                fontStyle: "italic",
                                fontSize: "0.78rem",
                                color: "var(--gray)",
                              }}
                            >
                              Note: {test.comment}
                            </TestTd>
                          </tr>
                        )}
                        {test.verified_by && (
                          <tr>
                            <TestTd
                              colSpan={6}
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--gray)",
                                fontStyle: "italic",
                              }}
                            >
                              Verified by: {test.verified_by}
                            </TestTd>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </TestTable>
            </div>
          ))}

          {/* Signatures */}
          {signatures && signatures.length > 0 && (
            <>
              <SectionHeading>Authorized Signatories</SectionHeading>
              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                  flexWrap: "wrap",
                  marginTop: "0.5rem",
                }}
              >
                {signatures.map((sig, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    {sig.signatureBase64 && (
                      <img
                        src={`data:image/png;base64,${sig.signatureBase64}`}
                        alt="signature"
                        style={{ height: 40, objectFit: "contain" }}
                      />
                    )}
                    <InfoValue style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                      {sig.employeeName}
                    </InfoValue>
                    <InfoLabel style={{ fontSize: "0.7rem" }}>
                      {sig.designation}
                    </InfoLabel>
                  </div>
                ))}
              </div>
            </>
          )}
        </ModalBody>

        <ModalActions>
          <ClearButton onClick={onClose}>
            <X size={14} /> Close
          </ClearButton>
          {totalBarcodes > 1 && (
            <>
              <Button onClick={onPrev} disabled={currentIndex === 0}>
                ← Previous
              </Button>
              <span
                style={{
                  alignSelf: "center",
                  fontSize: "0.82rem",
                  color: "var(--gray)",
                  padding: "0 0.25rem",
                }}
              >
                {currentIndex + 1} / {totalBarcodes}
              </span>
              <Button
                onClick={onNext}
                disabled={currentIndex === totalBarcodes - 1}
              >
                Next →
              </Button>
            </>
          )}
        </ModalActions>
      </ModalBox>
    </ModalOverlay>
  );
};

// ─── Main WorkList Component ──────────────────────────────────────────────────

const WorkList = () => {
  const [uhid, setUhid] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);

  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [activeBarcode, setActiveBarcode] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [activeDate, setActiveDate] = useState(null);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const handleSearch = async () => {
    if (!uhid.trim()) {
      toast.warning("Please enter a UHID / OP Number");
      return;
    }
    setLoading(true);
    setSearched(true);
    setRecords([]);
    setPatientInfo(null);

    const url = `${Labbaseurl}worklist/?uhid=${uhid.trim()}`;
    const result = await apiRequest(url, "GET");

    if (result.success) {
      const data = result.data;
      setRecords(data.barcodes || []);
      setPatientInfo(data.patient || null);
    } else {
      toast.error(result.error || "Failed to fetch records");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearSearch = () => {
    setUhid("");
    setRecords([]);
    setSearched(false);
    setPatientInfo(null);
    setReportData(null);
  };

  const handleViewReport = async (barcode, index) => {
    setReportLoading(true);
    setActiveBarcode(barcode);
    setCurrentIndex(index);
    setActiveDate(records[index]?.date || null);
    const result = await apiRequest(
      `${Labbaseurl}get_hms_patient_test_details/?barcode=${barcode}`,
      "GET",
    );
    if (result.success) {
      setReportData(result.data);
    } else {
      toast.error(result.error || "No approved tests found for this barcode");
      setReportData(null);
    }
    setReportLoading(false);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = records[currentIndex - 1];
      setActiveDate(prev.date || null);
      handleViewReport(prev.barcode, currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < records.length - 1) {
      const next = records[currentIndex + 1];
      setActiveDate(next.date || null);
      handleViewReport(next.barcode, currentIndex + 1);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Container>
      <GlobalStyle />
      <Card>
        <CardHeader>
          <Title>Patient Work List</Title>
        </CardHeader>

        <SearchSection>
          <InputGroup>
            <Label>UHID / OP Number</Label>
            <Input
              type="text"
              placeholder="e.g. OP2024001234"
              value={uhid}
              onChange={(e) => setUhid(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </InputGroup>
          <Button onClick={handleSearch} disabled={loading}>
            <Search size={15} />
            {loading ? "Searching…" : "Search"}
          </Button>
          {(records.length > 0 || searched) && (
            <ClearButton onClick={clearSearch}>
              <X size={14} /> Clear
            </ClearButton>
          )}
        </SearchSection>

        {/* Patient Summary Banner */}
        {patientInfo && (
          <div
            style={{
              padding: "1rem 1.5rem",
              background: "rgba(67,97,238,0.06)",
              borderBottom: "1px solid var(--gray-light)",
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div>
              <InfoLabel>Patient Name</InfoLabel>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 2,
                }}
              >
                <GenderIcon gender={patientInfo.gender}>
                  {patientInfo.gender === "Female" ? (
                    <IoIosFemale size={13} />
                  ) : (
                    <IoIosMale size={13} />
                  )}
                </GenderIcon>
                <strong style={{ fontSize: "0.95rem" }}>
                  {patientInfo.name}
                </strong>
              </div>
            </div>
            {[
              ["UHID", patientInfo.uhid],
              ["Age", `${patientInfo.age} ${patientInfo.age_type || ""}`],
              ["Gender", patientInfo.gender],
            ].map(([l, v]) => (
              <div key={l}>
                <InfoLabel>{l}</InfoLabel>
                <div
                  style={{ fontSize: "0.9rem", fontWeight: 500, marginTop: 2 }}
                >
                  {v || "N/A"}
                </div>
              </div>
            ))}
          </div>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Barcode</th>
                <th>OP / IP Type</th>
                <th>IP Number</th>
                <th>Tests</th>
                <th>Action</th>
              </tr>
            </TableHead>
            <TableBody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "2.5rem",
                      color: "var(--gray)",
                    }}
                  >
                    Searching…
                  </td>
                </tr>
              ) : searched && records.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <NoData>
                      No records found for UHID: <strong>{uhid}</strong>
                    </NoData>
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((rec, idx) => (
                  <tr key={rec.barcode}>
                    <td style={{ color: "var(--gray)", fontSize: "0.8rem" }}>
                      {idx + 1}
                    </td>
                    <td>
                      {rec.date
                        ? format(new Date(rec.date), "dd MMM yyyy")
                        : "N/A"}
                    </td>
                    <td style={{ fontFamily: "monospace", fontWeight: 600 }}>
                      {rec.barcode}
                    </td>
                    <td>{rec.opiptype || "N/A"}</td>
                    <td>{rec.ipnumber || "—"}</td>
                    <td
                      style={{
                        maxWidth: 200,
                        fontSize: "0.8rem",
                        color: "var(--gray)",
                      }}
                    >
                      {rec.test_names || "N/A"}
                    </td>
                    <td>
                      <ActionButton
                        title="View Report"
                        onClick={() => handleViewReport(rec.barcode, idx)}
                        disabled={
                          reportLoading && activeBarcode === rec.barcode
                        }
                      >
                        {reportLoading && activeBarcode === rec.barcode ? (
                          <span style={{ fontSize: 10 }}>…</span>
                        ) : (
                          <Eye size={15} />
                        )}
                      </ActionButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <NoData>Enter a UHID above and click Search</NoData>
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {records.length > 0 && (
          <Footer>
            {records.length} barcode{records.length !== 1 ? "s" : ""} found for
            UHID <strong>{uhid}</strong>
          </Footer>
        )}
      </Card>

      {/* Report Modal */}
      {reportData && (
        <ReportModal
          reportData={reportData}
          onClose={() => {
            setReportData(null);
            setActiveBarcode(null);
            setCurrentIndex(null);
            setActiveDate(null);
          }}
          currentIndex={currentIndex}
          totalBarcodes={records.length}
          onPrev={handlePrev}
          onNext={handleNext}
          reportDate={activeDate}
        />
      )}
    </Container>
  );
};

export default WorkList;
