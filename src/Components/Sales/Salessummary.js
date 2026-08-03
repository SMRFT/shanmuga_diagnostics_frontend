import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import apiRequest from "../Auth/apiRequest";

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

// ─────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────

const Page = styled.div`
  padding: 24px;
  font-family: "Segoe UI", sans-serif;
  color: #2d2d2d;

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #256565;
  margin: 0;
  font-size: 22px;
`;

const Filters = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const DateLabel = styled.label`
  font-size: 12px;
  color: #6b7b7b;
  margin-right: 6px;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #cfe3e3;
  border-radius: 8px;
  color: #256565;
  font-weight: 600;
  background: #fff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #219c9c;
  }
`;

const SummaryStrip = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  flex: 1;
  min-width: 150px;
  background: linear-gradient(135deg, #219c9c 0%, #256565 100%);
  color: #fff;
  border-radius: 12px;
  padding: 16px 18px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  opacity: 0.85;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const StatValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  margin-top: 4px;
`;

const CardsWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const EmployeeCard = styled.div`
  background: #fff;
  border: 1px solid #e5eeee;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 2px 6px rgba(37, 101, 101, 0.06);
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(37, 101, 101, 0.14);
    transform: translateY(-2px);
  }
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const EmpName = styled.div`
  font-weight: 700;
  color: #256565;
  font-size: 15px;
`;

const EmpId = styled.div`
  font-size: 11px;
  color: #8fa8a8;
  margin-top: 2px;
`;

const TrendBadge = styled.div`
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  background: ${({ $status }) =>
    $status === "up" ? "#e4f7ef" : $status === "down" ? "#fdeaea" : "#f1f3f3"};
  color: ${({ $status }) =>
    $status === "up" ? "#1a9c6b" : $status === "down" ? "#c94b4b" : "#6b7b7b"};
`;

const AmountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
`;

const BilledAmount = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1f2d2d;
`;

const ProjectedAmount = styled.div`
  font-size: 13px;
  color: #d97706;
  font-weight: 600;
`;

const TrendingAmount = styled.div`
  font-size: 13px;
  color: #219c9c;
  font-weight: 600;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  background: #eef4f4;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
`;

const fillIn = keyframes`
  from { width: 0%; }
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 6px;
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  background: ${({ $pct }) =>
    $pct >= 100
      ? "linear-gradient(90deg, #219c9c, #256565)"
      : $pct >= 70
      ? "linear-gradient(90deg, #6fc3c3, #219c9c)"
      : "linear-gradient(90deg, #f0b93a, #e08e2b)"};
  animation: ${fillIn} 0.6s ease-out;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7b7b;
`;

const MetaItem = styled.div`
  text-align: center;
  flex: 1;

  strong {
    display: block;
    color: #2d2d2d;
    font-size: 13px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #8fa8a8;
  font-size: 14px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #219c9c;
  font-weight: 600;
`;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val || 0);

// yyyy-mm-dd for <input type="date">, local time (not UTC)
const toDateInputValue = (date) => {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().split("T")[0];
};

const getYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
};

// Normalizes whatever shape the API returns into a plain array,
// so a crash upstream never turns into "data.reduce is not a function"
const normalizeToArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.results)) return res.results;
  return [];
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const SalesSummary = () => {
  const [selectedDate, setSelectedDate] = useState(toDateInputValue(getYesterday()));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async (dateStr) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest(
        `${Labbaseurl}salesplan_summary/?date=${dateStr}`,
        "GET"
      );
      const list = normalizeToArray(res);
      if (list.length === 0 && res && !Array.isArray(res) && res.error) {
        setError(res.error);
      }
      setData(list);
    } catch (err) {
      setError("Failed to load sales summary. Please try again.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const safeData = Array.isArray(data) ? data : [];
  const totalBilled = safeData.reduce((sum, d) => sum + (d.billed_amount || 0), 0);
  const totalTrending = safeData.reduce((sum, d) => sum + (d.trending_amount || 0), 0);
  const avgProjectedPercentage = safeData.length ? safeData.reduce((sum, d) => sum + (d.projected_percentage || 0), 0) / safeData.length : 0;
  const adjustedDaysSoFar = safeData.length ? safeData[0].adjusted_days : 0;

  return (
    <Page>
      <Header>
        <Title>Sales Plan Summary</Title>
        <Filters>
          <DateLabel htmlFor="summary-date">Data as of</DateLabel>
          <DateInput
            id="summary-date"
            type="date"
            max={toDateInputValue(getYesterday())}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </Filters>
      </Header>

      {!loading && safeData.length > 0 && (
        <SummaryStrip>
          <StatCard>
            <StatLabel>Total Billed (up to {selectedDate})</StatLabel>
            <StatValue>{formatCurrency(totalBilled)}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Total Trending (projected month-end)</StatLabel>
            <StatValue>{formatCurrency(totalTrending)}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Avg Projected Achievement</StatLabel>
            <StatValue>{avgProjectedPercentage.toFixed(1)}%</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Adjusted Days So Far</StatLabel>
            <StatValue>{adjustedDaysSoFar}</StatValue>
          </StatCard>
        </SummaryStrip>
      )}

      {loading && <LoadingState>Loading sales summary…</LoadingState>}

      {!loading && error && <EmptyState>{error}</EmptyState>}

      {!loading && !error && safeData.length === 0 && (
        <EmptyState>No sales data found for this period.</EmptyState>
      )}

      {!loading && !error && safeData.length > 0 && (
        <CardsWrap>
          {safeData.map((emp) => {
            const trendingAmount = emp.trending_amount ?? 0;
            const projectedPercentage = emp.projected_percentage ?? 0;
            const pct = Math.min(projectedPercentage, 100);
            const status = projectedPercentage >= 100 ? "up" : "down";

            return (
              <EmployeeCard key={emp.employee_id}>
                <CardTop>
                  <div>
                    <EmpName>{emp.employee_name}</EmpName>
                    <EmpId>ID: {emp.employee_id}</EmpId>
                  </div>
                  <TrendBadge $status={status}>
                    {status === "up" ? "▲ On Track" : status === "down" ? "▼ Behind" : "—"}
                  </TrendBadge>
                </CardTop>

                <AmountRow>
                  <BilledAmount>{formatCurrency(emp.billed_amount)}</BilledAmount>
                  <div>
                    <TrendingAmount>Trending: {formatCurrency(trendingAmount)}</TrendingAmount>
                    <ProjectedAmount>Projected: {projectedPercentage.toFixed(1)}%</ProjectedAmount>
                  </div>
                </AmountRow>

                <ProgressTrack>
                  <ProgressFill $pct={Math.min(pct, 100)} />
                </ProgressTrack>

                <MetaRow>
                  <MetaItem>
                    <strong>{emp.working_days}</strong>
                    Working Days
                  </MetaItem>
                  <MetaItem>
                    <strong>{emp.adjusted_days}</strong>
                    Adjusted Days
                  </MetaItem>
                  <MetaItem>
                    <strong>{emp.sundays}</strong>
                    Sundays
                  </MetaItem>
                  <MetaItem>
                    <strong>{emp.total_days}</strong>
                    Total Days
                  </MetaItem>
                </MetaRow>
              </EmployeeCard>
            );
          })}
        </CardsWrap>
      )}
    </Page>
  );
};

export default SalesSummary;