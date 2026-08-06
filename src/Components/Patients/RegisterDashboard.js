import { useState, useEffect } from "react"
import styled from "styled-components"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Calendar, Users, FileText, Search, RefreshCw, Download } from "lucide-react"
import apiRequest from "../Auth/apiRequest"

// Styled Components
const FormContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.05), rgba(102, 126, 234, 0.05));
  
  @media (max-width: 768px) {
    padding: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
    border-radius: 10px;
  }
`

const StyledTitle = styled.h2`
  background: linear-gradient(135deg, #f093fb, #667eea, #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const DatePickerContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const DateInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const DateLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
`

const DateInput = styled.input`
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  align-self: flex-end;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    align-self: stretch;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  }
`

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #f093fb, #667eea);
  color: white;
`

const RupeeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3h12M6 8h12M6 13h3M9 13c6.667 0 6.667 8 0 8M9 13v8" />
  </svg>
)

const StatTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin: 0;
`

const StatValue = styled.p`
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`

const TableContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`

const TableHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`

const TableTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea, #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`

const TableWrapper = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`

const Th = styled.th`
  text-align: left;
  white-space: nowrap;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`

const Td = styled.td`
  padding: 1rem 1.5rem;
  white-space: nowrap;
  font-size: 0.875rem;
  color: #1a1a1a;
  border-bottom: 1px solid #e2e8f0;
`

const TotalRow = styled.tr`
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.1), rgba(102, 126, 234, 0.1));
  font-weight: 600;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #64748b;
  text-align: center;
`

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: white;
  
  .info {
    font-size: 0.875rem;
    color: #64748b;
  }
  
  .controls {
    display: flex;
    gap: 0.5rem;
    
    button {
      padding: 0.5rem 0.75rem;
      border: 1px solid #e2e8f0;
      background: white;
      border-radius: 0.375rem;
      cursor: pointer;
      color: #64748b;
      font-size: 0.875rem;
      transition: all 0.2s;
      
      &:hover:not(:disabled) {
        background: #f8fafc;
        color: #0f172a;
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      &.active {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
      }
    }
  }
`

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.billed ?
    'linear-gradient(135deg, #dcfce7, #bbf7d0)' :
    'linear-gradient(135deg, #fee2e2, #fecaca)'};
  color: ${props => props.billed ? '#166534' : '#b91c1c'};
`

const ExportButton = styled(Button)`
  background: linear-gradient(135deg, #10b981, #059669);
  
  &:hover {
    box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
  }
`

const PatientDashboard = () => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [patients, setPatients] = useState([])
  const [segmentFilter, setSegmentFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Mock API URL - replace with your actual API endpoint
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

    const getCurrentDate = () => new Date().toISOString().split("T")[0]

    const [dateFilters, setDateFilters] = useState({
    fromDate: getCurrentDate(),
    toDate:   getCurrentDate(),
  })

  useEffect(() => {
    if (dateFilters.fromDate && dateFilters.toDate) fetchData()
  }, [])

  useEffect(() => {
    if (dateFilters.fromDate && dateFilters.toDate) fetchData()
  }, [dateFilters])

  const fetchData = async () => {
    if (!dateFilters.fromDate || !dateFilters.toDate) { toast.warning("Please select both dates"); return }
    setLoading(true)
    try {
      // Replace this with your actual API call
      const response = await apiRequest(
        `${Labbaseurl}patients_by_date/?start_date=${dateFilters.fromDate}&end_date=${dateFilters.toDate}`, "GET"
      )
      const data = response.data

      // Handle the API response structure
      if (data.success && Array.isArray(data.data)) {
        setPatients(data.data)
      } else if (Array.isArray(data)) {
        setPatients(data)
      } else {
        setPatients([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (startDate && endDate) {
      fetchData(startDate, endDate)
    }
  }

  const safePatients = Array.isArray(patients) ? patients : []
  const filteredPatients = safePatients.filter(p => 
    segmentFilter === "all" || (p.segment && p.segment.toLowerCase() === segmentFilter.toLowerCase())
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [segmentFilter, patients])

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)
  const currentPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getNumericDiscount = (p) => {
    const discount = p?.discount;
    if (!discount) return 0;
    const strDisc = String(discount).trim();
    const tot = parseFloat(p.totalAmount || 0);
    if (strDisc.endsWith("%")) {
      const pct = parseFloat(strDisc);
      return isNaN(pct) ? 0 : (tot * pct) / 100;
    }
    const val = parseFloat(strDisc);
    return isNaN(val) ? 0 : val;
  };

  const formatDiscountDisplay = (p) => {
    const discount = p?.discount;
    if (!discount || discount === "0" || discount === 0 || discount === "0.0" || discount === "0.00") {
      return "₹0.00";
    }
    const strDisc = String(discount).trim();
    const tot = parseFloat(p.totalAmount || 0);

    if (strDisc.endsWith("%")) {
      const pct = parseFloat(strDisc);
      if (!isNaN(pct) && tot > 0) {
        const amt = (tot * pct) / 100;
        return `${strDisc} (₹${amt.toFixed(2)})`;
      }
      return strDisc;
    }

    const val = parseFloat(strDisc);
    if (!isNaN(val) && val > 0) {
      if (tot > 0 && val <= tot) {
        const pct = ((val / tot) * 100).toFixed(1);
        return `₹${val.toFixed(2)} (${pct}%)`;
      }
      return `₹${val.toFixed(2)}`;
    }

    return strDisc;
  };

  const getNetBillAmount = (p) => {
    if (p.netAmount) return parseFloat(p.netAmount) || 0;
    const tot = parseFloat(p.totalAmount || 0);
    const disc = getNumericDiscount(p);
    return Math.max(0, tot - disc);
  };

  const totalPatients = filteredPatients.length

  const totalTests = filteredPatients.reduce(
    (sum, p) => sum + (p.testdetails?.length || 0),
    0
  )

  const totalAmount = filteredPatients
    .reduce((sum, p) => sum + (parseFloat(p.totalAmount) || 0), 0)
    .toFixed(2)

  const totalDiscountVal = filteredPatients
    .reduce((sum, p) => sum + getNumericDiscount(p), 0)
    .toFixed(2)

  const totalNetAmountVal = filteredPatients
    .reduce((sum, p) => sum + getNetBillAmount(p), 0)
    .toFixed(2)

  const billedPatients = filteredPatients.filter(
    (p) => parseFloat(p.totalAmount || 0) > 0
  ).length

  const exportToCSV = () => {
    if (filteredPatients.length === 0) return

    const headers = ["Bill No", "Patient Name", "Phone", "Age", "Gender", "Ref By", "Test Count", "Billing Status", "Gross Amount", "Discount", "Net Amount"]

    const data = filteredPatients.map((p) => [
      p.bill_no || "",
      p.patientname || "",
      p.phone || "N/A",
      p.age || "",
      p.gender || "",
      p.refby || "",
      p.testdetails?.length || 0,
      parseFloat(p.totalAmount || 0) > 0 ? "Billed" : "Not Billed",
      parseFloat(p.totalAmount || 0).toFixed(2),
      formatDiscountDisplay(p),
      getNetBillAmount(p).toFixed(2),
    ])

    data.push(["", "Grand Total", "", "", "", "", totalTests.toString(), "", totalAmount, totalDiscountVal, totalNetAmountVal])

    const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `patient-data-${dateFilters.fromDate}-to-${dateFilters.toDate}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <FormContainer>
      <FormCard>
        <StyledTitle>Patient Registration Dashboard</StyledTitle>

        <Header>
          <DatePickerContainer>
            <DateInputGroup>
              <DateLabel>Start Date</DateLabel>
              <DateInput
                type="date"
                value={dateFilters.fromDate}
                onChange={(e)=>setDateFilters(p=>({...p,fromDate:e.target.value}))} 
              />
            </DateInputGroup>

            <DateInputGroup>
              <DateLabel>End Date</DateLabel>
              <DateInput
                type="date"
                value={dateFilters.toDate}
                onChange={(e)=>setDateFilters(p=>({...p,fromDate:e.target.value}))} 
              />
            </DateInputGroup>

            <DateInputGroup>
              <DateLabel>Segment</DateLabel>
              <DateInput
                as="select"
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="B2B">B2B</option>
                <option value="Hospital">Hospital</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Home Collection">Home Collection</option>
                <option value="Shanmuga 360">Shanmuga 360</option>
              </DateInput>
            </DateInputGroup>

            <Button onClick={handleSearch}>
              <Search size={16} />
              Search
            </Button>
          </DatePickerContainer>
        </Header>

        <StatsGrid>
          <StatCard>
            <StatHeader>
              <StatIcon>
                <Users size={20} />
              </StatIcon>
              <StatTitle>Total Registrations</StatTitle>
            </StatHeader>
            <StatValue>{totalPatients}</StatValue>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon>
                <FileText size={20} />
              </StatIcon>
              <StatTitle>Total Tests</StatTitle>
            </StatHeader>
            <StatValue>{totalTests}</StatValue>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon>
                <RupeeIcon />
              </StatIcon>
              <StatTitle>Total Amount</StatTitle>
            </StatHeader>
            <StatValue>₹{totalAmount}</StatValue>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon>
                <Calendar size={20} />
              </StatIcon>
              <StatTitle>Billed Patients</StatTitle>
            </StatHeader>
            <StatValue>{billedPatients}</StatValue>
          </StatCard>
        </StatsGrid>

        <TableContainer>
          <TableHeader>
            <TableTitle>Patient Registrations</TableTitle>
            {patients.length > 0 && (
              <ExportButton onClick={exportToCSV}>
                <Download size={16} />
                Export CSV
              </ExportButton>
            )}
          </TableHeader>

          {loading ? (
            <EmptyState>
              <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
              <p>Loading patient data...</p>
            </EmptyState>
          ) : patients.length > 0 ? (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>Bill No</Th>
                    <Th>Patient Name</Th>
                    <Th>Phone</Th>
                    <Th>Age</Th>
                    <Th>Gender</Th>
                    <Th>Ref By</Th>
                    <Th>Test Count</Th>
                    <Th>Status</Th>
                    <Th>Gross Amt</Th>
                    <Th>Discount</Th>
                    <Th>Net Amt</Th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatients.map((p, idx) => (
                    <tr key={idx}>
                      <Td>{p.bill_no}</Td>
                      <Td>{p.patientname}</Td>
                      <Td>{p.phone || "N/A"}</Td>
                      <Td>{p.age}</Td>
                      <Td>{p.gender}</Td>
                      <Td>{p.refby}</Td>
                      <Td>{p.testdetails?.length || 0}</Td>
                      <Td>
                        <StatusBadge billed={parseFloat(p.totalAmount || 0) > 0}>
                          {parseFloat(p.totalAmount || 0) > 0 ? "Billed" : "Not Billed"}
                        </StatusBadge>
                      </Td>
                      <Td>₹{parseFloat(p.totalAmount || 0).toFixed(2)}</Td>
                      <Td style={{ color: "#e11d48", fontWeight: 600 }}>{formatDiscountDisplay(p)}</Td>
                      <Td style={{ color: "#10b981", fontWeight: 700 }}>₹{getNetBillAmount(p).toFixed(2)}</Td>
                    </tr>
                  ))}
                  <TotalRow>
                    <Td colSpan={6}>Grand Total (Filtered)</Td>
                    <Td>{totalTests}</Td>
                    <Td></Td>
                    <Td>₹{totalAmount}</Td>
                    <Td style={{ color: "#e11d48" }}>₹{totalDiscountVal}</Td>
                    <Td style={{ color: "#10b981" }}>₹{totalNetAmountVal}</Td>
                  </TotalRow>
                </tbody>
              </Table>
              {totalPages > 1 && (
                <PaginationContainer>
                  <div className="info">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} entries
                  </div>
                  <div className="controls">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(n => n === 1 || n === totalPages || (n >= currentPage - 2 && n <= currentPage + 2))
                      .map((page, i, arr) => {
                        const prev = arr[i - 1]
                        return (
                          <span key={page} style={{ display: "inline-flex", alignItems: "center" }}>
                            {prev && page - prev > 1 && <span style={{ color: "#9ca3af", padding: "0 4px" }}>…</span>}
                            <button
                              className={currentPage === page ? "active" : ""}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </span>
                        )
                    })}
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </PaginationContainer>
              )}
            </TableWrapper>
          ) : (
            <EmptyState>
              <p>No patient registrations found for this date range.</p>
              <Button onClick={handleSearch} style={{ marginTop: "1rem" }}>
                <RefreshCw size={16} />
                Refresh Data
              </Button>
            </EmptyState>
          )}
        </TableContainer>
      </FormCard>
    </FormContainer>
  )
}

export default PatientDashboard