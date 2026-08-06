import { useState, useEffect } from "react"
import axios from "axios"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import styled from "styled-components"
import { Download, Calendar, DollarSign, FileText, X, CreditCard, Eye, RefreshCw } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import apiRequest from "../Auth/apiRequest"

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; /* Centers the title */
  margin-bottom: 2rem;
  text-align: center;
`

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const DateFilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; /* Centers the date pickers */
  gap: 1rem;
  background: #f9fafb;
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap; /* Allows better responsiveness */
`

const DateLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: auto;
  }
  
  .react-datepicker__input-container input {
    padding: 0.5rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.875rem;
    color: #1f2937;
    background: white;
    transition: all 0.2s;
    
    &:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
  }
`

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow-x: auto; /* Enables horizontal scrolling on small screens */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  padding: 1rem;
  
  @media (max-width: 1024px) {
    padding: 0.5rem;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 700px; /* Prevents the table from shrinking too much */
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 0.875rem;

  @media (max-width: 1024px) {
    min-width: 600px; /* Slightly smaller for medium screens */
  }

  @media (max-width: 768px) {
    min-width: 100%; /* Takes full width on smaller screens */
    font-size: 0.75rem; /* Reduce font size for smaller screens */
  }
`;

const TableHeader = styled.thead`
  background-color: #f9fafb;

  th {
    padding: 1rem;
    text-align: center;
    font-weight: 600;
    color: #4b5563;
    border-bottom: 1px solid #e5e7eb;
    white-space: nowrap;

    @media (max-width: 1024px) {
      padding: 0.75rem; /* Reduce padding on medium screens */
    }

    @media (max-width: 768px) {
      padding: 0.5rem; /* Reduce padding on smaller screens */
      font-size: 0.7rem; /* Reduce font size further */
    }
  }
`;

const TableBody = styled.tbody`
  tr {
    transition: background-color 0.2s;

    &:hover {
      background-color: #f9fafb;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #e5e7eb;
    }
  }

  td {
    padding: 1rem;
    text-align: center;
    color: #1f2937;
    white-space: nowrap;

    @media (max-width: 1024px) {
      padding: 0.75rem;
      font-size: 0.8rem;
    }

    @media (max-width: 768px) {
      padding: 0.5rem; /* Adjust padding for small screens */
      font-size: 0.7rem;
    }
  }
`;


const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  gap: 0.5rem;
  margin-left: auto;
  
  &:hover {
    background-color: #4f46e5;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  }
`

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  gap: 0.5rem;
  
  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.2);
  }
`

const ViewDetailsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  gap: 0.25rem;
  margin: 0 auto;
  
  &:hover {
    background-color: #059669;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: #f9fafb;
  border-radius: 12px;
  color: #6b7280;
`

const EmptyStateIcon = styled.div`
  margin-bottom: 1rem;
  color: #9ca3af;
`

const EmptyStateText = styled.p`
  font-size: 0.875rem;
  text-align: center;
  max-width: 300px;
  margin: 0;
`

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 1rem;
`
const ReportDownloadButton = styled(DownloadButton)`
  margin-left: auto;
  margin-bottom: 1rem;
  width: auto;
`;
const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 650px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  margin: auto;
  position: relative;
  
  @media (max-width: 768px) {
    width: 95%;
    max-height: 90vh;
  }
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
`

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const ModalCloseButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
`

const ModalBody = styled.div`
  padding: 1.5rem;
`

const PaymentMethodList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`

const PaymentMethodCard = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const PaymentMethodName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
`

const PaymentMethodAmount = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`

const PaymentSummary = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const PaymentSummaryLabel = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #4b5563;
`

const PaymentSummaryAmount = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
`

// PDF Document Component
const MyDocument = ({ reportData }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      backgroundColor: "#fff",
    },
    section: {
      marginBottom: 20,
    },
    table: {
      display: "table",
      width: "100%",
      borderCollapse: "collapse",
      marginTop: 20,
    },
    tableRow: {
      flexDirection: "row",
      borderBottom: "1px solid #ddd",
    },
    tableCell: {
      flex: 1,
      textAlign: "center",
      padding: 12,
      borderRight: "1px solid #ddd",
      fontSize: 11,
    },
    tableCellLast: {
      flex: 1,
      textAlign: "center",
      padding: 12,
      fontSize: 11,
    },
    header: {
      fontWeight: "bold",
      fontSize: 14,
      backgroundColor: "#F7F7F7",
      color: "#333",
      padding: 5,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
    },
    spacer: {
      marginBottom: 30,
    },
    footer: {
      textAlign: "center",
      marginTop: 30,
      fontSize: 10,
      color: "#777",
    },
  })

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Cash Tally Report</Text>
        <Text style={styles.subtitle}>Date: {String(reportData.date)}</Text>
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.header]}>
              <Text style={styles.tableCell}>Gross Amount</Text>
              <Text style={styles.tableCell}>Discount</Text>
              <Text style={styles.tableCell}>Due Amount</Text>
              <Text style={styles.tableCell}>Pending Paid</Text>
              <Text style={styles.tableCell}>Corporate Paid</Text>
              <Text style={styles.tableCellLast}>Total Collection</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{String(reportData.gross_amount)}</Text>
              <Text style={styles.tableCell}>{String(reportData.discount)}</Text>
              <Text style={styles.tableCell}>{String(reportData.due_amount)}</Text>
              <Text style={styles.tableCell}>{String(reportData.credit_payment_received)}</Text>
              <Text style={styles.tableCell}>{String(reportData.corporate_collection)}</Text>
              <Text style={styles.tableCellLast}>{String(reportData.total_collection)}</Text>
            </View>
          </View>
        </View>
        {reportData.segment_gross && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Segment Wise Breakdown</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.header]}>
                <Text style={styles.tableCell}>Segment</Text>
                <Text style={styles.tableCell}>Patients Count</Text>
                <Text style={styles.tableCellLast}>Revenue Amount</Text>
              </View>
              {['B2B', 'Walk-in', 'Home Collection', 'Hospital', 'Shanmuga 360'].map((seg) => (
                <View style={styles.tableRow} key={seg}>
                  <Text style={styles.tableCell}>{seg}</Text>
                  <Text style={styles.tableCell}>{reportData.segment_totals?.[seg] || 0}</Text>
                  <Text style={styles.tableCellLast}>₹ {reportData.segment_gross?.[seg] || 0}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {reportData.payment_totals && Object.keys(reportData.payment_totals).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Payment Method Totals</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.header]}>
                <Text style={styles.tableCell}>Payment Method</Text>
                <Text style={styles.tableCellLast}>Total Amount</Text>
              </View>
              {Object.entries(reportData.payment_totals).map(([method, total]) => (
                <View style={styles.tableRow} key={method}>
                  <Text style={styles.tableCell}>{String(method)}</Text>
                  <Text style={styles.tableCellLast}>{String(total)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        <View style={styles.spacer}></View>
        <Text style={styles.footer}>Generated by Cash Tally System</Text>
      </Page>
    </Document>
  )
}

// Payment Details Modal Component
const PaymentDetailsModal = ({ isOpen, onClose, reportData }) => {
  const [activeTab, setActiveTab] = useState("segment")

  if (!isOpen || !reportData) return null

  const paymentMethods = reportData.payment_totals || {}
  const segmentGross = reportData.segment_gross || {}
  const segmentTotals = reportData.segment_totals || {}

  const segmentList = [
    { name: "B2B", label: "B2B", color: "#8b5cf6" },
    { name: "Walk-in", label: "Walk-in", color: "#10b981" },
    { name: "Home Collection", label: "Home Collection", color: "#3b82f6" },
    { name: "Hospital", label: "Hospital", color: "#f59e0b" },
    { name: "Shanmuga 360", label: "Shanmuga 360", color: "#ec4899" },
  ]

  const getPaymentIcon = (method) => {
    switch (method.toLowerCase()) {
      case "cash":
        return <DollarSign size={20} />
      case "upi":
      case "neft":
      case "cheque":
      case "credit":
      default:
        return <CreditCard size={20} />
    }
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent style={{ maxWidth: "620px" }} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <CreditCard size={20} />
            Daily Breakdown - {reportData.date}
          </ModalTitle>
          <ModalCloseButton onClick={onClose}>
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
          <button
            type="button"
            onClick={() => setActiveTab("segment")}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderBottom: activeTab === "segment" ? "3px solid #6366f1" : "none",
              fontWeight: activeTab === "segment" ? "600" : "500",
              color: activeTab === "segment" ? "#6366f1" : "#6b7280",
              background: activeTab === "segment" ? "#ffffff" : "transparent",
              cursor: "pointer",
            }}
          >
            Segment Wise Breakdown
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("payment")}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderBottom: activeTab === "payment" ? "3px solid #6366f1" : "none",
              fontWeight: activeTab === "payment" ? "600" : "500",
              color: activeTab === "payment" ? "#6366f1" : "#6b7280",
              background: activeTab === "payment" ? "#ffffff" : "transparent",
              cursor: "pointer",
            }}
          >
            Payment Methods
          </button>
        </div>

        <ModalBody>
          {activeTab === "segment" ? (
            <div>
              <PaymentMethodList>
                {segmentList.map((seg) => {
                  const gross = segmentGross[seg.name] || 0
                  const count = segmentTotals[seg.name] || 0
                  return (
                    <PaymentMethodCard key={seg.name} style={{ borderLeft: `4px solid ${seg.color}` }}>
                      <PaymentMethodName style={{ color: seg.color, fontWeight: "600" }}>
                        {seg.label}
                      </PaymentMethodName>
                      <PaymentMethodAmount>₹ {gross}</PaymentMethodAmount>
                      <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>{count} Patient(s)</div>
                    </PaymentMethodCard>
                  )
                })}
              </PaymentMethodList>

              <PaymentSummary>
                <PaymentSummaryLabel>Gross Revenue</PaymentSummaryLabel>
                <PaymentSummaryAmount>₹ {reportData.gross_amount}</PaymentSummaryAmount>
              </PaymentSummary>
            </div>
          ) : (
            <div>
              <PaymentMethodList>
                {Object.entries(paymentMethods).map(([method, amount]) => (
                  <PaymentMethodCard key={method}>
                    <PaymentMethodName>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {getPaymentIcon(method)}
                        {method}
                      </div>
                    </PaymentMethodName>
                    <PaymentMethodAmount>₹ {amount}</PaymentMethodAmount>
                  </PaymentMethodCard>
                ))}
              </PaymentMethodList>

              <PaymentSummary>
                <PaymentSummaryLabel>Total Collection</PaymentSummaryLabel>
                <PaymentSummaryAmount>₹ {reportData.total_collection}</PaymentSummaryAmount>
              </PaymentSummary>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  )
}

const CashTally = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [reportData, setReportData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

const fetchReportData = async (start, end) => {
  if (!start || !end) {
    toast.error("Please select start date and end date");
    return;
  }

  setIsLoading(true);

  try {
    const url =
      `${Labbaseurl}patient_report/?start_date=${start}&end_date=${end}`;

    const response = await apiRequest(url, "GET");

    if (response.success) {
      setReportData(response.data.report || []);
    } else {
      toast.error(response.error);
      setReportData([]);
    }
  } catch (error) {
    console.error("Error fetching report:", error);
    toast.error("Failed to fetch report data");
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    if (startDate && endDate) {
      const formattedStart = startDate.toISOString().split("T")[0] // YYYY-MM-DD
      const formattedEnd = endDate.toISOString().split("T")[0] // YYYY-MM-DD
      fetchReportData(formattedStart, formattedEnd)
    }
  }, [startDate, endDate]) // Removed fetchReportData from dependencies

  const openModal = (report) => {
    setSelectedReport(report)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <Container>
      <Header>
        <Title>
          <DollarSign size={24} />
          Cash Tally Report
        </Title>
      </Header>

      <DateFilterContainer>
        <div>
          <DateLabel>
            <Calendar size={16} />
            Start Date
          </DateLabel>
          <DatePickerWrapper>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy-MM-dd" />
          </DatePickerWrapper>
        </div>

        <div>
          <DateLabel>
            <Calendar size={16} />
            End Date
          </DateLabel>
          <DatePickerWrapper>
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="yyyy-MM-dd" />
          </DatePickerWrapper>
        </div>

        <div style={{ alignSelf: 'flex-end' }}>
          <RefreshButton onClick={() => {
            const formattedStart = startDate.toISOString().split("T")[0];
            const formattedEnd = endDate.toISOString().split("T")[0];
            fetchReportData(formattedStart, formattedEnd);
          }}>
            <RefreshCw size={16} />
            Refresh
          </RefreshButton>
        </div>
      </DateFilterContainer>

      {isLoading ? (
        <EmptyState>
          <EmptyStateText>Loading report data...</EmptyStateText>
        </EmptyState>
      ) : reportData.length > 0 ? (
        <>
          {/* <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <PDFDownloadLink document={<MyDocument reportData={reportData[0]} />} fileName={`cash_tally_report.pdf`}>
              {({ loading }) => (
                <ReportDownloadButton>
                  {loading ? (
                    "Generating PDF..."
                  ) : (
                    <>
                      <Download size={16} />
                      Download Report
                    </>
                  )}
                </ReportDownloadButton>
              )}
            </PDFDownloadLink>
          </div> */}

          <TableContainer>
            <StyledTable>
              <TableHeader>
                <tr>
                  <th>Date</th>
                  <th>Gross Amount</th>
                  <th>Discount</th>
                  <th>Credit Amount</th>
                  <th>Pending Paid</th>
                  <th>Corporate Paid</th>
                  <th>Refund</th>
                  {/* <th>Net Amount</th> */}
                  <th>Total Collection</th>
                  <th>Payment Details</th>
                  <th>Download</th>
                </tr>
              </TableHeader>
              <TableBody>
                {reportData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td style={{ cursor: "pointer", color: "#6366f1", fontWeight: "600" }} onClick={() => openModal(item)} title="Click to view segment breakdown">
                      ₹ {item.gross_amount}
                    </td>
                    <td style={{ cursor: "pointer" }} onClick={() => openModal(item)} title="Click to view details">
                      ₹ {item.discount}
                    </td>
                    <td style={{ cursor: "pointer" }} onClick={() => openModal(item)} title="Click to view details">
                      ₹ {item.due_amount}
                    </td>
                    <td style={{ cursor: "pointer" }} onClick={() => openModal(item)} title="Click to view details">
                      ₹ {item.credit_payment_received}
                    </td>
                    <td style={{ cursor: "pointer" }} onClick={() => openModal(item)} title="Click to view details">
                      ₹ {item.corporate_collection}
                    </td>
                    <td style={{ cursor: "pointer" }} onClick={() => openModal(item)} title="Click to view details">
                      ₹ {item.refund_amount}
                    </td>
                    {/* <td>₹ {item.net_amount}</td> */}
                    <td style={{ cursor: "pointer", color: "#10b981", fontWeight: "700" }} onClick={() => openModal(item)} title="Click to view segment breakdown">
                      ₹ {item.total_collection}
                    </td>
                    <td>
                      <ViewDetailsButton onClick={() => openModal(item)}>
                        <Eye size={14} />
                        View
                      </ViewDetailsButton>
                    </td>
                    <td>
                      <PDFDownloadLink 
                        document={<MyDocument reportData={item} />} 
                        fileName={`cash_tally_report_${item.date}.pdf`}
                      >
                        {({ loading }) => (
                          <DownloadButton>
                            {loading ? "..." : <><Download size={14} /> PDF</>}
                          </DownloadButton>
                        )}
                      </PDFDownloadLink>
                    </td>
                  </tr>
                ))}
              </TableBody>
            </StyledTable>
          </TableContainer>

          <PaymentDetailsModal isOpen={isModalOpen} onClose={closeModal} reportData={selectedReport} />
        </>
      ) : (
        <EmptyState>
          <EmptyStateIcon>
            <FileText size={48} />
          </EmptyStateIcon>
          <EmptyStateText>
            No report data available for the selected date range. Try selecting different dates.
          </EmptyStateText>
        </EmptyState>
      )}
    </Container>
  )
}

export default CashTally