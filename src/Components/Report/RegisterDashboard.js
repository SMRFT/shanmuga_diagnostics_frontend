"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  Calendar,
  Users,
  FileText,
  Search,
  RefreshCw,
  Download,
} from "lucide-react";

// Styled Components
const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const DatePickerContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const DateInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: #ebf5ff;
  color: #3b82f6;
`;

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
);

const StatTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin: 0;
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const TableTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #1a1a1a;
  border-bottom: 1px solid #e2e8f0;
`;

const TotalRow = styled.tr`
  background-color: #f8fafc;
  font-weight: 600;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #64748b;
  text-align: center;
`;

const PatientDashboard = () => {
  const [date, setDate] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  // Set today's date as default when component mounts
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    fetchData(today);
  }, []);

  const fetchData = async (selectedDate) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${Labbaseurl}patients-by-date/?date=${selectedDate}`
      );
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchData(date);
  };

  const exportToCSV = () => {
    if (patients.length === 0) return;

    // Create CSV headers
    const headers = [
      "Bill No",
      "Patient Name",
      "Test Count",
      "Billing Status",
      "Total Amount",
    ];

    // Format patient data
    const data = patients.map((p) => [
      p.bill_no,
      p.patientname,
      p.test_count,
      Number.parseFloat(p.totalAmount || 0) > 0 ? "Billed" : "Not Billed",
      Number.parseFloat(p.totalAmount || 0).toFixed(2),
    ]);

    // Add total row
    data.push(["", "Grand Total", totalTests.toString(), "", totalAmount]);

    // Combine headers and data
    const csvContent = [
      headers.join(","),
      ...data.map((row) => row.join(",")),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `patient-data-${date}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate statistics
  const totalPatients = patients.length;
  const totalTests = patients.reduce(
    (sum, p) => sum + (Number.parseInt(p.test_count) || 0),
    0
  );
  const totalAmount = patients
    .reduce((sum, p) => sum + (Number.parseFloat(p.totalAmount) || 0), 0)
    .toFixed(2);
  const billedPatients = patients.filter(
    (p) => Number.parseFloat(p.totalAmount) > 0
  ).length;

  return (
    <DashboardContainer>
      <Header>
        <Title>Patient Registration Dashboard</Title>
        <DatePickerContainer>
          <DateInput
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TableTitle>Patient Registrations</TableTitle>
            {patients.length > 0 && (
              <Button
                onClick={exportToCSV}
                style={{ backgroundColor: "#10b981" }}
              >
                <Download size={16} />
                Export CSV
              </Button>
            )}
          </div>
        </TableHeader>

        {loading ? (
          <EmptyState>
            <RefreshCw size={24} className="animate-spin mb-2" />
            <p>Loading patient data...</p>
          </EmptyState>
        ) : patients.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Bill No</Th>
                <Th>Patient Name</Th>
                <Th>Test Count</Th>
                <Th>Billing Status</Th>
                <Th>Total Amount</Th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, idx) => (
                <tr key={idx}>
                  <Td>{p.bill_no}</Td>
                  <Td>{p.patientname}</Td>
                  <Td>{p.test_count}</Td>
                  <Td>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        fontSize: "0.75rem",
                        backgroundColor:
                          Number.parseFloat(p.totalAmount || 0) > 0
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          Number.parseFloat(p.totalAmount || 0) > 0
                            ? "#166534"
                            : "#b91c1c",
                        fontWeight: "500",
                      }}
                    >
                      {Number.parseFloat(p.totalAmount || 0) > 0
                        ? "Billed"
                        : "Not Billed"}
                    </span>
                  </Td>
                  <Td>₹{Number.parseFloat(p.totalAmount || 0).toFixed(2)}</Td>
                </tr>
              ))}
              <TotalRow>
                <Td colSpan={2}>Grand Total</Td>
                <Td>{totalTests}</Td>
                <Td></Td>
                <Td>₹{totalAmount}</Td>
              </TotalRow>
            </tbody>
          </Table>
        ) : (
          <EmptyState>
            <p>No patient registrations found for this date.</p>
            <Button onClick={handleSearch} style={{ marginTop: "1rem" }}>
              <RefreshCw size={16} />
              Refresh Data
            </Button>
          </EmptyState>
        )}
      </TableContainer>
    </DashboardContainer>
  );
};

export default PatientDashboard;
