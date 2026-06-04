import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import apiRequest from "../Auth/apiRequest";
import { FaSearch, FaFileDownload, FaCalendarAlt, FaFlask, FaChartBar } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
    background: #f8f9fa;
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

  &.test-id {
    font-weight: 600;
    color: #636e72;
    font-family: 'Space Mono', monospace;
  }

  &.count {
    span {
        background: #f1f5f9;
        color: #636e72;
        padding: 4px 12px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 0.9rem;
    }
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

const LoadingOverlay = styled.div`
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(255,255,255,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
`;

const Spinner = styled.div`
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #a777e3;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

export default function HMSTestCount() {
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const fetchData = async () => {
    setLoading(true);
    try {
      const payload = {
        from_date: fromDate,
        to_date: toDate
      };
      const result = await apiRequest(`${Labbaseurl}hms-test-count/`, 'POST', payload);
      if (result.success) {
        setData(result.data.data || []);
      } else {
        console.error(result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate]);

  const filteredData = data.filter(item => 
    (item.test_name || "").toLowerCase().includes(search.toLowerCase()) ||
    String(item.test_id || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalTests = filteredData.reduce((sum, item) => sum + item.count, 0);
  const uniqueTestTypes = filteredData.length;

  const exportExcel = () => {
    if (!filteredData.length) return;
    
    const exportData = filteredData.map(item => ({
        "Test ID": item.test_id,
        "Test Name": item.test_name,
        "Count": item.count,
        "Male Count": item.male_count || 0,
        "Female Count": item.female_count || 0
    }));

    exportData.push({
        "Test ID": "Total",
        "Test Name": "",
        "Count": totalTests,
        "Male Count": filteredData.reduce((sum, item) => sum + (item.male_count || 0), 0),
        "Female Count": filteredData.reduce((sum, item) => sum + (item.female_count || 0), 0)
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "HMS Test Count");
    
    // Auto-width for columns
    const maxWidths = [
        { wch: 15 },
        { wch: 40 },
        { wch: 10 },
        { wch: 15 },
        { wch: 15 }
    ];
    ws['!cols'] = maxWidths;

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(dataBlob, `HMS_Test_Count_${fromDate}_to_${toDate}.xlsx`);
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
              <StatLabel>Total HMS Tests</StatLabel>
              <StatValue>{totalTests.toLocaleString()}</StatValue>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon bg="rgba(167, 119, 227, 0.1)" color="#a777e3">
              <FaChartBar />
            </StatIcon>
            <StatInfo>
              <StatLabel>Unique Test Types</StatLabel>
              <StatValue>{uniqueTestTypes.toLocaleString()}</StatValue>
            </StatInfo>
          </StatCard>
        </StatsGrid>

        {/* Main Content Card */}
        <MainCard style={{ position: 'relative' }}>
          {loading && <LoadingOverlay><Spinner /></LoadingOverlay>}
          
          <CardHeader>
            <Title>HMS Test Frequency Analysis</Title>
            <ControlsGrid>
              <InputGroup>
                <Icon><FaSearch /></Icon>
                <Input
                  type="text"
                  placeholder="Filter by test name or ID..."
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
              <Button onClick={exportExcel}>
                <FaFileDownload /> Export Excel
              </Button>
            </ControlsGrid>
          </CardHeader>

          <TableContainer>
            <StyledTable>
              <THead>
                <tr>
                  <th style={{ width: '20%' }}>Test ID</th>
                  <th style={{ width: '40%' }}>Test Name</th>
                  <th style={{ width: '15%' }}>Count</th>
                  <th style={{ width: '15%' }}>Male Count</th>
                  <th style={{ width: '10%' }}>Female Count</th>
                </tr>
              </THead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState>
                        <FaSearch />
                        <p>{loading ? "Loading data..." : "No HMS test data found for the selected period"}</p>
                      </EmptyState>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((t, i) => (
                    <TRow key={i}>
                      <TCell className="test-id">{t.test_id}</TCell>
                      <TCell style={{ fontWeight: '500' }}>{t.test_name}</TCell>
                      <TCell className="count">
                        <span>{t.count}</span>
                      </TCell>
                      <TCell className="count">
                        <span>{t.male_count || 0}</span>
                      </TCell>
                      <TCell className="count">
                        <span>{t.female_count || 0}</span>
                      </TCell>
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
