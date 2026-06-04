import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import apiRequest from "../Auth/apiRequest";
import { FaSearch, FaFileDownload, FaCalendarAlt, FaFlask, FaRupeeSign } from "react-icons/fa";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  height: 100vh;
  padding: 1.5rem;
  font-family: 'Inter', sans-serif;
  color: #2d3436;
  overflow: hidden; 
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1rem;
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.6s ease-out;
`;

// Stats Cards
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid rgba(0,0,0,0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: ${props => props.bg || '#f0f2f5'};
  color: ${props => props.color || '#636e72'};
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  color: #636e72;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.span`
  color: #2d3436;
  font-size: 1.5rem;
  font-weight: 700;
`;

// Card Styles
const MainCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.05);
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3436;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:before {
    content: '';
    display: block;
    width: 6px;
    height: 24px;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    border-radius: 3px;
  }
`;

// Controls
const ControlsGrid = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Icon = styled.span`
  position: absolute;
  left: 12px;
  color: #a777e3;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const Input = styled.input`
  padding: 10px 10px 10px 36px;
  border: 1.5px solid #e1e4e8;
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.2s;
  background: #fff;
  color: #2d3436;
  min-width: 160px;

  &:focus {
    outline: none;
    border-color: #a777e3;
    box-shadow: 0 0 0 3px rgba(167, 119, 227, 0.1);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

// Table Styles
const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  padding: 0;
  
  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const THead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f8f9fa;
  
  th {
    padding: 16px;
    color: #4a5568;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #edf2f7;
    background: #f8f9fa; /* Ensure header isn't transparent */
  }
`;

const TRow = styled.tr`
  border-bottom: 1px solid #edf2f7;
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f9ff;
  }
`;

const TCell = styled.td`
  padding: 14px 16px;
  color: #2d3436;
  font-size: 0.95rem;

  &.amount {
    font-weight: 600;
    color: #2d3436;
    font-family: 'Space Mono', monospace;
  }

  &.count {
    color: #636e72;
    background: #f1f5f9;
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 0.85rem;
    font-weight: 600;
  }
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #b2bec3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  svg {
    font-size: 2.5rem;
    color: #dfe6e9;
  }
`;

export default function TestSummary() {
  // Initialize dates with current month range
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          search: search.trim(),
          from_date: fromDate,
          to_date: toDate
        };
        const result = await apiRequest(`${Labbaseurl}test-summary/`, 'POST', payload);
        if (result.success) {
          setData(result.data);
        } else {
          console.error(result.error);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [search, fromDate, toDate, Labbaseurl]);

  const totalCount = data.reduce((sum, row) => sum + Number(row.count || 0), 0);
  const totalAmount = data.reduce((sum, row) => sum + Number(row.total_amount || 0), 0);

    const exportCSV = () => {
    if (!data.length) return;
    const csvRows = [
      ["Test Name", "Count", "Male Count", "Female Count", "Total Amount"].join(","),
      ...data.map(row =>
        [
          `"${(row?.test_name ?? "").replace(/"/g, '""')}"`,
          row.count,
          row.male_count || 0,
          row.female_count || 0,
          row.total_amount
        ].join(",")
      ),
      ["Total", totalCount, data.reduce((sum, row) => sum + Number(row.male_count || 0), 0), data.reduce((sum, row) => sum + Number(row.female_count || 0), 0), totalAmount].join(","),
    ];
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `test_summary_${fromDate}_to_${toDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Wrapper>
      <Container>
        {/* Top Stats Area */}
        <StatsGrid>
          <StatCard>
            <StatIcon bg="rgba(110, 142, 251, 0.1)" color="#6e8efb">
              <FaFlask />
            </StatIcon>
            <StatInfo>
              <StatLabel>Total Tests Performed</StatLabel>
              <StatValue>{totalCount.toLocaleString()}</StatValue>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon bg="rgba(167, 119, 227, 0.1)" color="#a777e3">
              <FaRupeeSign />
            </StatIcon>
            <StatInfo>
              <StatLabel>Total Revenue Generated</StatLabel>
              <StatValue>₹{totalAmount.toLocaleString()}</StatValue>
            </StatInfo>
          </StatCard>
        </StatsGrid>

        {/* Main Content Card */}
        <MainCard>
          <CardHeader>
            <Title>Test Analysis</Title>
            <ControlsGrid>
              <InputGroup>
                <Icon><FaSearch /></Icon>
                <Input
                  type="text"
                  placeholder="Search test names..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <Icon><FaCalendarAlt /></Icon>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <Icon><FaCalendarAlt /></Icon>
                <Input
                  type="date"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  min={fromDate}
                />
              </InputGroup>
              <Button onClick={exportCSV}>
                <FaFileDownload /> Export
              </Button>
            </ControlsGrid>
          </CardHeader>

          <TableContainer>
            <StyledTable>
              <THead>
                <tr>
                  <th>Test Name</th>
                  <th>Count</th>
                  <th>Male Count</th>
                  <th>Female Count</th>
                  <th>Total Revenue</th>
                </tr>
              </THead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState>
                        <FaSearch />
                        <p>No test data found for the selected period</p>
                      </EmptyState>
                    </td>
                  </tr>
                ) : (
                  data.map((t, i) => (
                    <TRow key={i}>
                      <TCell style={{ fontWeight: '500' }}>{t.test_name}</TCell>
                      <TCell>
                        <span className="count">{t.count}</span>
                      </TCell>
                      <TCell>
                        <span className="count">{t.male_count || 0}</span>
                      </TCell>
                      <TCell>
                        <span className="count">{t.female_count || 0}</span>
                      </TCell>
                      <TCell className="amount">₹{Number(t.total_amount || 0).toLocaleString()}</TCell>
                    </TRow>
                  ))
                )}
              </tbody>
            </StyledTable>
          </TableContainer>
        </MainCard>
      </Container>
    </Wrapper>
  );
}
