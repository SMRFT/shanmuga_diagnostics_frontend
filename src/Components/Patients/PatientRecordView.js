import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { toast } from "react-toastify";
import apiRequest from "../Auth/apiRequest";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { exportToExcel } from "../../utils/xlsxUtils";
import {
  FaUser,
  FaSearch,
  FaTimes,
  FaIdCard,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaFilePrescription,
  FaClinicMedical,
  FaDownload,
  FaCalendarAlt,
  FaChartLine,
  FaMoneyBillWave
} from "react-icons/fa";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const PageContainer = styled.div`
  padding: 30px;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  background: #f4f7f6;
  animation: ${fadeIn} 0.4s ease-out;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);

  h2 {
    margin: 0;
    color: #7c70e7;
    font-size: 28px;
    font-weight: 700;
  }
`;

const DashboardCards = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: white;
  flex: 1;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  gap: 15px;

  .icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    
    &.blue { background: #e0f2fe; color: #0ea5e9; }
    &.green { background: #dcfce7; color: #22c55e; }
  }

  .content {
    h3 {
      margin: 0;
      color: #64748b;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .value {
      margin: 5px 0 0 0;
      color: #1e293b;
      font-size: 24px;
      font-weight: 700;
    }
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 15px;
  background: white;
  padding: 15px 30px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 20;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  
  label {
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
  }
  
  select, input, .react-datepicker-wrapper input {
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    background: #f8fafc;
    min-width: 150px;
    
    &:focus {
      border-color: #667eea;
    }
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0 12px;
  min-width: 250px;
  margin-left: auto;

  &:focus-within {
    border-color: #667eea;
  }

  input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 8px;
    font-size: 14px;
    outline: none;
    color: #333;
  }

  svg {
    color: #7f8c8d;
  }
`;

const Button = styled.button`
  background: ${props => props.primary ? "#7c70e7" : "#10b981"};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 37px;
  margin-top: 19px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.primary ? "#6b5ce7" : "#059669"};
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const TableScrollWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 16px 20px;
    text-align: left;
    border-bottom: 1px solid #edf2f9;
  }

  th {
    background: #f8fafc;
    color: #475569;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  td {
    color: #334155;
    font-size: 14px;
  }

  tr:hover {
    background-color: #f8fafc;
  }
`;

const ActionButton = styled.button`
  background: #ebf4ff;
  color: #3b82f6;
  border: none;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: #3b82f6;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border-top: 1px solid #edf2f9;

  .page-info {
    color: #64748b;
    font-size: 14px;
  }

  .controls {
    display: flex;
    gap: 10px;

    button {
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      color: #334155;
      font-weight: 500;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background: #f1f5f9;
        border-color: #94a3b8;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalHeader = styled.div`
  padding: 20px 30px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 { margin: 0; color: #7c70e7; }
  button { background: transparent; border: none; cursor: pointer; color: #64748b; font-size: 20px; }
`;

const ModalBody = styled.div`
  padding: 30px;
  overflow-y: auto;
`;

const InfoCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GridInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  label {
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  span {
    font-size: 15px;
    color: #1e293b;
    font-weight: 500;
  }
`;

const BillCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  
  .bill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px dashed #cbd5e1;
    
    .bill-no { font-size: 16px; font-weight: 600; color: #3b82f6; }
    .bill-date { color: #64748b; font-size: 14px; }
  }

  .bill-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 15px;
    margin-bottom: 15px;
  }

  .bill-stat {
    display: flex;
    flex-direction: column;
    span:first-child { font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; }
    span:last-child { font-size: 15px; color: #1e293b; font-weight: 500; }
  }
`;

const Pill = styled.span`
  background: #f1f5f9;
  color: #475569;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #cbd5e1;
  
  &.B2B { background: #fef3c7; color: #d97706; border-color: #fde68a; }
  &.Walk-in { background: #dcfce7; color: #16a34a; border-color: #bbf7d0; }
`;

const PrescriptionBtn = styled.button`
  background: #f8fafc;
  color: #6366f1;
  border: 1px solid #e0e7ff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  &:hover { background: #e0e7ff; }
`;

const TestList = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TestItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
`;

const TestName = styled.div`
  color: #334155;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TestAmount = styled.div`
  color: #10b981;
  font-weight: 600;
`;

const TotalRow = styled.tr`
  background: #f8fafc !important;
  font-weight: 700;
  td {
    color: #1e293b !important;
    font-size: 15px !important;
    border-top: 2px solid #e2e8f0;
  }
`;

const PatientRecordView = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [sampleCollector, setSampleCollector] = useState("");
  const [salesMapping, setSalesMapping] = useState("");
  const [segment, setSegment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [collectorOptions, setCollectorOptions] = useState([]);
  const [salesOptions, setSalesOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const limit = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullRecord, setFullRecord] = useState(null);
  const [recordLoading, setRecordLoading] = useState(false);
  const [prescriptionVisibilities, setPrescriptionVisibilities] = useState({});

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const fetchDashboardData = useCallback(async (page = 1, exportData = false) => {
    if (!exportData) setLoading(true);
    try {
      let url = `${Labbaseurl}patient_record_dashboard/?page=${page}&limit=${limit}`;
      if (startDate) url += `&start_date=${startDate.toISOString().split('T')[0]}`;
      if (endDate) url += `&end_date=${endDate.toISOString().split('T')[0]}`;
      if (sampleCollector) url += `&sample_collector=${sampleCollector}`;
      if (salesMapping) url += `&salesMapping=${salesMapping}`;
      if (segment) url += `&segment=${segment}`;
      if (searchQuery) url += `&search=${searchQuery}`;
      if (exportData) url += `&export=true`;

      const response = await apiRequest(url, "GET");

      if (response && response.success && response.data) {
        if (exportData) return response.data.data;
        setBills(response.data.data || []);
        setTotalPages(response.data.total_pages || 1);
        setTotalCount(response.data.total_records || 0);
        setTotalRevenue(response.data.total_revenue || 0);
      } else {
        toast.error(response.data?.error || "Failed to fetch records");
      }
    } catch (error) {
      toast.error("Error connecting to server");
    } finally {
      if (!exportData) setLoading(false);
    }
  }, [Labbaseurl, limit, startDate, endDate, sampleCollector, salesMapping, searchQuery]);

  useEffect(() => {
    fetchDashboardData(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [collectorRes, salesRes] = await Promise.all([
          apiRequest(`${Labbaseurl}sample-collector/`, "GET"),
          apiRequest(`${Labbaseurl}sales_person/`, "GET")
        ]);
        if (collectorRes && collectorRes.success && Array.isArray(collectorRes.data)) {
          setCollectorOptions(collectorRes.data);
        }
        if (salesRes && salesRes.success && Array.isArray(salesRes.data)) {
          setSalesOptions(salesRes.data);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchOptions();
  }, [Labbaseurl]);

  const getCollectorName = (val) => {
    if (!val) return "-";
    const found = collectorOptions.find(c => String(c.employeeId) === String(val) || c.employeeName === val);
    return found ? found.employeeName : val;
  };

  const handleExport = async () => {
    const data = await fetchDashboardData(1, true);
    if (data && data.length > 0) {
      const mappedData = data.map(row => ({
        ...row,
        "Sample Collector": getCollectorName(row["Sample Collector"])
      }));
      exportToExcel(mappedData, `Patient_Records_${new Date().toISOString().split('T')[0]}.xlsx`, {
        sheetName: "Patient Records",
      });
    } else {
      toast.info("No records to export.");
    }
  };

  const handleViewClick = async (patient_id) => {
    setRecordLoading(true);
    setIsModalOpen(true);
    setFullRecord(null);
    setPrescriptionVisibilities({});
    try {
      const response = await apiRequest(`${Labbaseurl}patient_full_record/${patient_id}/`, "GET");
      if (response && response.success) {
        setFullRecord(response);
      } else {
        toast.error("Failed to fetch patient record");
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("Error connecting to server");
      setIsModalOpen(false);
    } finally {
      setRecordLoading(false);
    }
  };

  const togglePrescription = (billId) => {
    setPrescriptionVisibilities((prev) => ({ ...prev, [billId]: !prev[billId] }));
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);

  const parseTestDetails = (testDetailsStr) => {
    try {
      return typeof testDetailsStr === 'string' ? JSON.parse(testDetailsStr) : (testDetailsStr || []);
    } catch (e) { return []; }
  };

  const pageTotal = bills.reduce((acc, bill) => acc + (parseFloat(bill.totalAmount) || 0), 0);

  return (
    <PageContainer>
      <HeaderSection>
        <h2>Patient Records Dashboard</h2>
      </HeaderSection>

      <DashboardCards>
        <Card><div className="icon blue"><FaChartLine /></div><div className="content"><h3>Total Records</h3><p className="value">{totalCount}</p></div></Card>
        <Card><div className="icon green"><FaMoneyBillWave /></div><div className="content"><h3>Total Revenue</h3><p className="value">{formatCurrency(totalRevenue)}</p></div></Card>
      </DashboardCards>

      <FilterSection>
        <FormGroup><label>Start Date</label><DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy-MM-dd" isClearable /></FormGroup>
        <FormGroup><label>End Date</label><DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="yyyy-MM-dd" isClearable /></FormGroup>
        <FormGroup>
          <label>Segment</label>
          <select value={segment} onChange={(e) => setSegment(e.target.value)}>
            <option value="">All Segments</option>
            <option value="B2B">B2B</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Home Collection">Home Collection</option>
          </select>
        </FormGroup>
        <FormGroup>
          <label>Sample Collector</label>
          <select value={sampleCollector} onChange={(e) => setSampleCollector(e.target.value)}>
            <option value="">All Collectors</option>
            {collectorOptions.map((c, i) => (
              <option key={i} value={c.employeeId}>{c.employeeName}</option>
            ))}
          </select>
        </FormGroup>
        <FormGroup>
          <label>Sales Mapping</label>
          <select value={salesMapping} onChange={(e) => setSalesMapping(e.target.value)}>
            <option value="">All Sales Reps</option>
            {salesOptions.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </FormGroup>
        <SearchBox><FaSearch /><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></SearchBox>
        <Button onClick={() => { setCurrentPage(1); fetchDashboardData(1); }}><FaSearch /> Filter</Button>
        <Button onClick={handleExport} primary><FaDownload /> Export</Button>
      </FilterSection>

      <TableContainer>
        <TableScrollWrapper>
          <StyledTable>
            <thead><tr><th>Bill Date</th><th>Patient ID</th><th>Name</th><th>Sample Collector</th><th>Sales Mapping</th><th>Amount</th><th>Action</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>Loading...</td></tr> : bills.length === 0 ? <tr><td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>No records found.</td></tr> : (
                <>
                  {bills.map((bill, index) => (
                    <tr key={`${bill.bill_no}-${index}`}>
                      <td>{bill.date ? new Date(bill.date).toLocaleDateString() : "-"}</td>
                      <td><strong>{bill.patient_id}</strong></td>
                      <td>{bill.patient_details?.patientname || "-"}</td>
                      <td>{getCollectorName(bill.sample_collector)}</td>
                      <td>{bill.salesMapping || "-"}</td>
                      <td style={{ color: "#10b981", fontWeight: "600" }}>{formatCurrency(bill.totalAmount)}</td>
                      <td><ActionButton onClick={() => handleViewClick(bill.patient_id)}><FaEye /> View</ActionButton></td>
                    </tr>
                  ))}
                  <TotalRow><td colSpan="5" style={{ textAlign: "right", paddingRight: "20px" }}>Page Total:</td><td colSpan="2" style={{ color: "#10b981" }}>{formatCurrency(pageTotal)}</td></TotalRow>
                </>
              )}
            </tbody>
          </StyledTable>
        </TableScrollWrapper>
        {!loading && bills.length > 0 && <Pagination><div className="page-info">Showing page {currentPage} of {totalPages}</div><div className="controls"><button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><FaChevronLeft /> Prev</button><button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next <FaChevronRight /></button></div></Pagination>}
      </TableContainer>

      {isModalOpen && (
        <ModalOverlay onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <ModalContent>
            <ModalHeader><h3><FaUser /> Patient History</h3><button onClick={() => setIsModalOpen(false)}><FaTimes /></button></ModalHeader>
            <ModalBody>
              {recordLoading ? <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div> : fullRecord && fullRecord.patient ? (
                <>
                  <InfoCard>
                    <CardTitle><FaIdCard /> Demographic Details</CardTitle>
                    <GridInfo>
                      <InfoItem>
                        <label>Patient ID</label>
                        <span>{fullRecord.patient.patient_id}</span>
                      </InfoItem>
                      <InfoItem>
                        <label>Name</label>
                        <span>{fullRecord.patient.patientname}</span>
                      </InfoItem>
                      <InfoItem>
                        <label>Age & Gender</label>
                        <span>{fullRecord.patient.age} {fullRecord.patient.age_type} / {fullRecord.patient.gender}</span>
                      </InfoItem>
                      <InfoItem>
                        <label>Phone</label>
                        <span>{fullRecord.patient.phone || "N/A"}</span>
                      </InfoItem>
                      <InfoItem>
                        <label>Email</label>
                        <span>{fullRecord.patient.email || "N/A"}</span>
                      </InfoItem>
                    </GridInfo>
                  </InfoCard>

                  <h4 style={{ color: "#334155", marginTop: "30px", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaClinicMedical /> Billing & Visit History
                  </h4>

                  {fullRecord.bills && fullRecord.bills.length > 0 ? (
                    fullRecord.bills.map((bill, index) => (
                      <BillCard key={index}>
                        <div className="bill-header">
                          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <span className="bill-no">#{bill.bill_no}</span>
                            <Pill className={bill.segment}>{bill.segment}</Pill>
                            {bill.B2B && <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>{bill.B2B}</span>}
                          </div>
                          <span className="bill-date">
                            <FaCalendarAlt style={{ marginRight: "5px" }} />
                            {bill.date ? new Date(bill.date).toLocaleString() : "N/A"}
                          </span>
                        </div>

                        <div className="bill-grid">
                          <div className="bill-stat">
                            <span>Lab ID</span>
                            <span>{bill.lab_id || "N/A"}</span>
                          </div>
                          <div className="bill-stat">
                            <span>Ref By</span>
                            <span>{bill.refby || "Self"}</span>
                          </div>
                          <div className="bill-stat">
                            <span>Total Amount</span>
                            <span style={{ color: "#10b981", fontWeight: "700" }}>₹{bill.totalAmount}</span>
                          </div>
                          <div className="bill-stat">
                            <span>Status</span>
                            <span>{bill.status}</span>
                          </div>
                        </div>

                        {bill.prescription_file_id && (
                          <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px dashed #e2e8f0" }}>
                            <PrescriptionBtn onClick={() => togglePrescription(bill.bill_no)}>
                              <FaFilePrescription />
                              {prescriptionVisibilities[bill.bill_no] ? 'Hide Prescription' : 'View Prescription'}
                            </PrescriptionBtn>

                            {prescriptionVisibilities[bill.bill_no] && (
                              <div style={{ marginTop: "15px", textAlign: "center", background: "#f8fafc", padding: "10px", borderRadius: "8px" }}>
                                <img
                                  src={`${Labbaseurl}prescription_image/${bill.prescription_file_id}/`}
                                  alt="Prescription"
                                  style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                                />
                              </div>
                            )}
                          </div>
                        )}

                        <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px dashed #e2e8f0" }}>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Tests Conducted</span>
                          <TestList>
                            {parseTestDetails(bill.testdetails).map((test, idx) => (
                              <TestItem key={idx}>
                                <TestName>
                                  <div style={{ width: "6px", height: "6px", background: "#3b82f6", borderRadius: "50%" }}></div>
                                  {test.testname}
                                </TestName>
                                <TestAmount>₹{test.amount}</TestAmount>
                              </TestItem>
                            ))}
                          </TestList>
                        </div>
                      </BillCard>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: "30px", background: "#f8fafc", borderRadius: "12px", color: "#64748b" }}>
                      No billing history found for this patient.
                    </div>
                  )}
                </>
              ) : null}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default PatientRecordView;
