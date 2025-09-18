import { useState, useEffect } from "react"
import axios from "axios"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import styled from "styled-components"
import { Download, Calendar, DollarSign, FileText, X, CreditCard, Eye } from "lucide-react"

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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`
const ReportDownloadButton = styled(DownloadButton)`
  margin-left: auto;
  margin-bottom: 1rem;
  width: auto;
`;
const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
        <Text style={styles.subtitle}>Date: {reportData.date}</Text>
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.header]}>
              <Text style={styles.tableCell}>Gross Amount</Text>
              <Text style={styles.tableCell}>Discount</Text>
              <Text style={styles.tableCell}>Due Amount</Text>
              <Text style={styles.tableCell}>Net Amount</Text>
              <Text style={styles.tableCell}>Pending Amount</Text>
              <Text style={styles.tableCellLast}>Total Collection</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{reportData.gross_amount}</Text>
              <Text style={styles.tableCell}>{reportData.discount}</Text>
              <Text style={styles.tableCell}>{reportData.due_amount}</Text>
              <Text style={styles.tableCell}>{reportData.net_amount}</Text>
              <Text style={styles.tableCell}>{reportData.pending_amount}</Text>
              <Text style={styles.tableCellLast}>{reportData.total_collection}</Text>
            </View>
          </View>
        </View>
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
                  <Text style={styles.tableCell}>{method}</Text>
                  <Text style={styles.tableCellLast}>{total}</Text>
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
  if (!isOpen || !reportData) return null

  const paymentMethods = reportData.payment_totals || {}

  // Get payment method icon
  const getPaymentIcon = (method) => {
    switch (method.toLowerCase()) {
      case "cash":
        return <DollarSign size={20} />
      case "upi":
      case "neft":
      case "cheque":
      case "credit":
      case "partialpayment":
      default:
        return <CreditCard size={20} />
    }
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <CreditCard size={20} />
            Payment Details - {reportData.date}
          </ModalTitle>
          <ModalCloseButton onClick={onClose}>
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
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
  setIsLoading(true);
  try {
    const response = await axios.get(`${Labbaseurl}patient_report/`, {
      params: { start_date: start, end_date: end },
      headers: {
        Authorization: localStorage.getItem("access_token") || "",
        "Branch-Code": localStorage.getItem("selected_branch") || "",
        "Content-Type": "application/json",
      },
    });
    setReportData(response.data.report || []);
  } catch (error) {
    console.error("Error fetching report data:", error);
    setReportData([]); // clear data on error
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
                  <th>Refund</th>
                  <th>Net Amount</th>
                  <th>Total Collection</th>
                  <th>Payment Details</th>
                  <th>Download</th>
                </tr>
              </TableHeader>
              <TableBody>
                {reportData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>₹ {item.gross_amount}</td>
                    <td>₹ {item.discount}</td>
                    <td>₹ {item.due_amount}</td>
                    <td>₹ {item.credit_payment_received}</td>
                    <td>₹ {item.refund_amount}</td>
                    <td>₹ {item.net_amount}</td>
                    <td>₹ {item.total_collection}</td>
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