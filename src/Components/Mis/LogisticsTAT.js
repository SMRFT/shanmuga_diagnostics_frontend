import React, { useEffect, useState } from "react";
import styled from "styled-components";
import apiRequest from "../Auth/apiRequest";
/* -------------------- Styles -------------------- */
const Container = styled.div`
  max-width: 1400px;
  margin: auto;
  padding: 2rem;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  min-height: 100vh;
`;
const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin: 0 0 0.5rem 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  p {
    color: rgba(255,255,255,0.9);
    font-size: 1rem;
  }
`;
const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const DateFilters = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.2);
  label {
    color: white;
    font-weight: 500;
    font-size: 0.875rem;
  }
`;
const DateInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: white;
  font-size: 0.875rem;
  color: #334155;
  outline: none;
  transition: all 0.2s;
  &:focus {
    box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
  }
`;
const RefreshButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: white;
  color: #667EEA;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
  &:active {
    transform: translateY(0);
  }
`;
const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  overflow: hidden;
`;
const TableWrapper = styled.div`
  overflow-x: auto;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Thead = styled.thead`
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
`;
const Th = styled.th`
  padding: 1rem;
  text-align: left;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
`;
const Tbody = styled.tbody`
  tr {
    transition: background 0.2s;
    &:hover {
      background: #F8FAFC;
    }
    &:not(:last-child) {
      border-bottom: 1px solid #E2E8F0;
    }
  }
`;
const Td = styled.td`
  padding: 1rem;
  color: #334155;
  font-size: 0.875rem;
  white-space: nowrap;
`;
const Badge = styled.span`
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  background: ${(p) =>
    !p.val ? "#E5E7EB" :
    parseInt(p.val.split(":")[0]) < 1 ? "#DCFCE7" :
    parseInt(p.val.split(":")[0]) < 2 ? "#FEF9C3" : "#FEE2E2"};
  color: ${(p) =>
    !p.val ? "#6B7280" :
    parseInt(p.val.split(":")[0]) < 1 ? "#166534" :
    parseInt(p.val.split(":")[0]) < 2 ? "#854D0E" : "#991B1B"};
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;
const LoadingState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #64748B;
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #E2E8F0;
    border-top-color: #667EEA;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #64748B;
  svg {
    width: 64px;
    height: 64px;
    margin: 0 auto 1rem;
    opacity: 0.5;
  }
`;
/* -------------------- Helpers -------------------- */
const toDateTime = (time, isoDate) => {
  if (!time || !isoDate) return null;
  const [t, mer] = time.split(" ");
  const parts = t.split(":");
  let h = parseInt(parts[0]);
  let m = parseInt(parts[1]);
  let s = parts[2] ? parseInt(parts[2]) : 0;
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  const d = new Date(isoDate);
  d.setHours(h, m, s, 0);
  return isNaN(d.getTime()) ? null : d;
};
const diffTime = (a, b) => {
  if (!a || !b) return null;
  const diff = Math.abs(b - a) / 1000;
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = Math.floor(diff % 60);
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
};
/* -------------------- Component -------------------- */
const LogisticsTAT = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  useEffect(() => {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 7);
    setStartDate(from.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, []);
  const fetchLogisticData = async () => {
    setIsLoading(true);
    try {
      const url =
        `${Labbaseurl}get_logistic_task/` +
        `?start_date=${encodeURIComponent(startDate)}` +
        `&end_date=${encodeURIComponent(endDate)}`;
      const response = await apiRequest(url, "GET");
      // :white_check_mark: NORMALIZE RESPONSE (MANDATORY)
      const list = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      setEmployeeData(list);
    } catch (error) {
      console.error("Error fetching logistic data:", error);
      setEmployeeData([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (startDate && endDate) fetchLogisticData();
  }, [startDate, endDate]);
  return (
    <Container>
      <Header>
        <h1>Logistics Turnaround Time</h1>
        <p>Track and monitor logistics performance metrics</p>
      </Header>
      <Controls>
        <RefreshButton onClick={fetchLogisticData}>
          :arrows_counterclockwise: Refresh Data
        </RefreshButton>
        <DateFilters>
          <label>From</label>
          <DateInput
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <label>To</label>
          <DateInput
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </DateFilters>
      </Controls>
      <Card>
        {isloading ? (
          <LoadingState>
            <div className="spinner"></div>
            <p>Loading logistics data...</p>
          </LoadingState>
        ) : employeeData.length === 0 ? (
          <EmptyState>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No data found for the selected date range</p>
          </EmptyState>
        ) : (
          <TableWrapper>
            <Table>
              <Thead>
                <tr>
                  <Th>Lab</Th>
                  <Th>Date</Th>
                  <Th>Order</Th>
                  <Th>Accepted</Th>
                  <Th>Picked</Th>
                  <Th>O → A</Th>
                  <Th>A → P</Th>
                  <Th>O → P</Th>
                </tr>
              </Thead>
              <Tbody>
                {employeeData.map((item, i) => {
                  const o = toDateTime(item.sampleordertime, item.date);
                  const a = toDateTime(item.sampleacceptedtime, item.date);
                  const p = toDateTime(item.samplepickeduptime, item.date);
                  return (
                    <tr key={i}>
                      <Td><strong>{item.lab_name}</strong></Td>
                      <Td>{new Date(item.date).toISOString().split("T")[0]}</Td>
                      <Td>{item.sampleordertime || "—"}</Td>
                      <Td>{item.sampleacceptedtime || "—"}</Td>
                      <Td>{item.samplepickeduptime || "—"}</Td>
                      <Td><Badge val={diffTime(o,a)}>{diffTime(o,a) || "N/A"}</Badge></Td>
                      <Td><Badge val={diffTime(a,p)}>{diffTime(a,p) || "N/A"}</Badge></Td>
                      <Td><Badge val={diffTime(o,p)}>{diffTime(o,p) || "N/A"}</Badge></Td>
                    </tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableWrapper>
        )}
      </Card>
    </Container>
  );
};
export default LogisticsTAT;