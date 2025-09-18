import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import styled from "styled-components";
import { Search, Printer, Calendar, Filter } from "lucide-react";
import { format } from "date-fns";
import apiRequest from "../Auth/apiRequest";
import headerImage from "../Images/Header.png";

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
`;

const TitleContainer = styled.div`
  font-size: 28px;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
`;

const Subtitle = styled.div`
  font-size: 16px;
  opacity: 0.9;
  font-weight: 300;
`;

const FilterSection = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 25px;
  border: 1px solid #e2e8f0;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-weight: 600;
  color: #475569;
  font-size: 16px;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
    background: white;

    &:focus {
      border-color: #667eea;
      outline: none;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }
`;

const SearchContainer = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: 12px 16px 12px 45px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
    background: white;

    &:focus {
      border-color: #667eea;
      outline: none;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  svg {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }
`;

const ResultsSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e2e8f0;
`;

const ResultsHeader = styled.div`
  background: #f8fafc;
  padding: 20px 25px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
`;

const ResultsCount = styled.div`
  font-weight: 600;
  color: #475569;
  font-size: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;

  th,
  td {
    padding: 16px 20px;
    text-align: left;
    border-bottom: 1px solid #f1f5f9;
  }

  th {
    background: #f8fafc;
    font-weight: 600;
    color: #475569;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  tbody tr {
    transition: background 0.2s;
    
    &:hover {
      background: #f8fafc;
    }
  }

  td {
    font-size: 14px;
    color: #374151;
  }

  tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

const PrintButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  font-size: 13px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 25px;
  flex-wrap: wrap;

  button {
    padding: 10px 16px;
    border: 2px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    color: #374151;
    font-size: 14px;

    &:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    &.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-color: transparent;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    &:disabled {
      background: #f9fafb;
      cursor: not-allowed;
      color: #9ca3af;
      border-color: #f3f4f6;
    }
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  background: white;
  
  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  .message {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .submessage {
    font-size: 14px;
    opacity: 0.8;
  }
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch(props.type) {
      case 'B2B': return '#dbeafe';
      case 'B2C': return '#dcfce7';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'B2B': return '#1e40af';
      case 'B2C': return '#166534';
      default: return '#374151';
    }
  }};
`;

const PrintBill = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [patientsPerPage] = useState(15);
  const [loading, setLoading] = useState(false);
  
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    fetchPatients();
  }, [startDate, endDate]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const formattedStart = format(startDate, "yyyy-MM-dd");
      const formattedEnd = format(endDate, "yyyy-MM-dd");

      const response = await apiRequest(
        `${Labbaseurl}patients_by_date/?start_date=${formattedStart}&end_date=${formattedEnd}`,
        "GET",
      );
      
      const data = response.data.data;
      if (Array.isArray(data)) {
        const processedData = data.map((patient) => {
          // Parse testdetails if it's a string
          if (typeof patient.testdetails === "string") {
            try {
              patient.testdetails = JSON.parse(patient.testdetails);
            } catch (e) {
              console.error("Error parsing testdetails JSON:", e);
              patient.testdetails = [];
            }
          }

          // Parse payment_method if it's a string
          if (typeof patient.payment_method === "string") {
            try {
              patient.payment_method = JSON.parse(patient.payment_method);
            } catch (e) {
              console.error("Error parsing payment_method JSON:", e);
              patient.payment_method = {};
            }
          }

          return patient;
        });

        setPatients(processedData);
        setCurrentPage(1);
      } else {
        console.error("Invalid data format:", data);
        setPatients([]);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
    }
    setLoading(false);
  };

  const handlePrint = (patient) => {
    // Convert number to words for amount
    const numberToWords = (num) => {
      const a = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ];
      const b = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ];
      const toWords = (n) => {
        if (n < 20) return a[n];
        if (n < 100)
          return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
        if (n < 1000)
          return (
            a[Math.floor(n / 100)] +
            " Hundred" +
            (n % 100 ? " and " + toWords(n % 100) : "")
          );
        return (
          toWords(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 ? " " + toWords(n % 1000) : "")
        );
      };
      return toWords(parseInt(num));
    };

    // Use testdetails from API data and filter out refunded/cancelled tests
    const validTests = Array.isArray(patient.testdetails)
      ? patient.testdetails.filter((test) => !test.refund && !test.cancellation)
      : [];

    // Create table rows for valid tests only
    const tableRows = validTests
      .map(
        (test, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${test.testname}</td>
          <td style="text-align: right;">₹${parseFloat(test.amount || 0).toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    // Handle payment method display
    let displayPaymentMode = "NIL";
    if (patient.payment_method && typeof patient.payment_method === 'object') {
      displayPaymentMode = patient.payment_method.paymentmethod || "NIL";
      if (patient.payment_method.paymentDetails) {
        displayPaymentMode += ` (${patient.payment_method.paymentDetails})`;
      }
    }

    const netAmountInWords = patient.netAmount
      ? numberToWords(patient.netAmount) + " rupees only"
      : "";

    const formatDateTimeUTC = (isoString) => {
      if (!isoString) return "NIL";

      const dateObj = new Date(isoString);
      const formatted = dateObj.toLocaleString("en-IN", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Kolkata",
        hour12: true,
      });
      return formatted.replace(/am|pm/gi, (match) => match.toUpperCase());
    };

    // Updated printable content with total, net amount, and discount
    const printableContent = `
      <html>
       <head>
        <title>Shanmuga Diagnostics</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #000;
            font-size: 12px;
          }
          .container {
            width: 90%;
            margin: 10px auto;
            padding: 5px;
            border: 1px solid #000;
            font-size: 12px;
          }
          .header {
            text-align: center;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
            margin-bottom: 5px;
          }
          .header h1 {
            margin: 0;
            font-size: 14px;
          }
          .header p {
            margin: 2px 0;
            font-size: 10px;
          }
          .header div {
            font-size: 10px;
          }
          .header img {
            width: 100%;
            max-width: 100%;
            height: auto;
          }
          .details,
          .test-info,
          .payment-info {
            width: 100%;
            margin-bottom: 10px;
          }
          .details td,
          .test-info td,
          .payment-info td {
            padding: 2px;
            border-bottom: 1px solid #ddd;
            font-size: 12px;
          }
          .details th,
          .test-info th,
          .payment-info th {
            text-align: left;
            font-size: 12px;
          }
          .details table,
          .test-info table,
          .payment-info table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .payment-info th:first-child,
          .payment-info td:first-child {
            text-align: left;
            padding-left: 8px;
          }
          .signature {
            text-align: right;
            font-size: 12px;
          }
          .amount-row {
            font-weight: bold;
          }
          .total-row {
            border-top: 2px solid #000;
            font-weight: bold;
          }
        </style>
      </head>
        <body>
          <div class="container">
            <div class="header">
              <div>CIN : U85110TZ2020PTC033974</div>
              <img src="${headerImage}" alt="Shanmuga Diagnostics" />
              <h1>BILL CUM RECEIPT</h1>
              <p>Contact No: 0427-2706666 / 6369131631</p>
            </div>
            <div class="details">
              <table id="invoiceTable">
                <tr>
                  <td><strong>Bill Date:</strong> ${
                    formatDateTimeUTC(patient.date) || "NIL"
                  }</td>
                  <td><strong>Bill No / Lab ID:</strong> ${
                    patient.lab_id || "NIL"
                  }</td>
                </tr>
                <tr>
                  <td><strong>Patient ID:</strong> ${
                    patient.patient_id || "NIL"
                  }</td>
                  <td><strong>Lab Name:</strong> ${patient.B2B || "NIL"}</td>
                </tr>
                <tr>
                  <td><strong>Name:</strong> ${
                    patient.patientname || "NIL"
                  }</td>
                  <td><strong>Gender/Age:</strong> ${patient.gender || "NIL"}/${
      patient.age || "NIL"
    } Yrs</td>
                </tr>
                <tr>
                  <td><strong>Mobile:</strong> ${patient.phone || "NIL"}</td>
                  <td><strong>Ref By:</strong> ${patient.refby || "SELF"}</td>
                </tr>
              </table>
            </div>
            <div class="test-info">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th style="text-align:center";>Test Name</th>
                    <th style="text-align:right";>Amount(₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>
            </div>
            <div class="payment-info">
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align:right">Amount(₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total Amount</td>
                    <td style="text-align:right">₹${parseFloat(patient.totalAmount || 0).toFixed(2)}</td>
                  </tr>
                  ${
                    patient.discount && parseFloat(patient.discount) > 0
                      ? `<tr>
                          <td>Discount</td>
                          <td style="text-align:right">₹${parseFloat(patient.discount).toFixed(2)}</td>
                        </tr>`
                      : ""
                  }
                  <tr class="total-row">
                    <td><strong>Net Amount</strong></td>
                    <td style="text-align:right"><strong>₹${parseFloat(patient.netAmount || 0).toFixed(2)}</strong></td>
                  </tr>
                  <tr>
                    <td>Payment Mode</td>
                    <td style="text-align:right">${displayPaymentMode}</td>
                  </tr>
                </tbody>
              </table>
              <p><strong>Amount Paid in Words:</strong> ${netAmountInWords}</p>
              <div class="signature">
                <div class="signature-label">Signature of Employee</div>
                <div class="employee-name">${patient.created_by || patient.registeredby || ""}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=1000,height=800");
    printWindow.document.write(printableContent);
    setTimeout(() => {
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }, 1000);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.patient_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lab_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const pageCount = Math.ceil(filteredPatients.length / patientsPerPage);

  return (
    <Container>
      <PageHeader>
        <TitleContainer>Print Patient Bill</TitleContainer>
        <Subtitle>Generate and print patient bills with comprehensive details</Subtitle>
      </PageHeader>

      <FilterSection>
        <FilterHeader>
          <Filter size={20} />
          Search & Filter Options
        </FilterHeader>
        
        <FilterGrid>
          <FilterGroup>
            <Label>
              <Calendar size={16} />
              Start Date
            </Label>
            <DatePickerWrapper>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select start date"
              />
            </DatePickerWrapper>
          </FilterGroup>

          <FilterGroup>
            <Label>
              <Calendar size={16} />
              End Date
            </Label>
            <DatePickerWrapper>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select end date"
              />
            </DatePickerWrapper>
          </FilterGroup>

          <FilterGroup>
            <Label>
              <Search size={16} />
              Search Patients
            </Label>
            <SearchContainer>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by Patient ID, Name, or Lab ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
          </FilterGroup>
        </FilterGrid>
      </FilterSection>

      <ResultsSection>
        <ResultsHeader>
          <ResultsCount>
            {loading ? "Loading..." : `${filteredPatients.length} patient(s) found`}
          </ResultsCount>
        </ResultsHeader>

        {currentPatients.length === 0 ? (
          <NoResults>
            <div className="icon">📄</div>
            <div className="message">No patients found</div>
            <div className="submessage">Try adjusting your search criteria or date range</div>
          </NoResults>
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient ID</th>
                  <th>Lab ID</th>
                  <th>Name</th>
                  <th>Age/Gender</th>
                  <th>Segment</th>
                  <th>Total Amount</th>
                  <th>Net Amount</th>
                  <th>Discount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.map((patient) => (
                  <tr key={patient.patient_id}>
                    <td>{format(new Date(patient.date), "dd/MM/yyyy")}</td>
                    <td><strong>{patient.patient_id}</strong></td>
                    <td>{patient.lab_id}</td>
                    <td>{patient.patientname}</td>
                    <td>{`${patient.age || 'N/A'}/${patient.gender || 'N/A'}`}</td>
                    <td>
                      <Badge type={patient.segment}>{patient.segment}</Badge>
                    </td>
                    <td>₹{parseFloat(patient.totalAmount || 0).toFixed(2)}</td>
                    <td><strong>₹{parseFloat(patient.netAmount || 0).toFixed(2)}</strong></td>
                    <td>
                      {patient.discount && parseFloat(patient.discount) > 0 
                        ? `₹${parseFloat(patient.discount).toFixed(2)}` 
                        : '-'
                      }
                    </td>
                    <td>
                      <PrintButton onClick={() => handlePrint(patient)}>
                        <Printer size={15} />
                        Print
                      </PrintButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {pageCount > 1 && (
              <Pagination>
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: pageCount }, (_, i) => i + 1)
                  .filter(
                    (num) =>
                      num === 1 ||
                      num === pageCount ||
                      (num >= currentPage - 2 && num <= currentPage + 2)
                  )
                  .map((number) => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={currentPage === number ? "active" : ""}
                    >
                      {number}
                    </button>
                  ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, pageCount))
                  }
                  disabled={currentPage === pageCount}
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(pageCount)}
                  disabled={currentPage === pageCount}
                >
                  Last
                </button>
              </Pagination>
            )}
          </>
        )}
      </ResultsSection>
    </Container>
  );
};

export default PrintBill;