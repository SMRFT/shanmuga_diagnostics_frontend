"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { DollarSign, Users, FileText, CreditCard, TrendingUp, BarChart3, RefreshCw } from "lucide-react"
import { toast } from "react-toastify"
import apiRequest from "../Auth/apiRequest";

/* ═══════════════════════════════════════════════
   DESIGN SYSTEM — viewport-locked, no page scroll
═══════════════════════════════════════════════ */
const Shell = styled.div`
  height: calc(100vh - 75px);
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);
  font-family: 'Inter', 'Segoe UI', sans-serif;
  overflow: hidden;
  box-sizing: border-box;
  padding: 1.25rem;
  gap: 1rem;
  border-radius: 24px;

  @media (max-width: 768px) { padding: 0.75rem; gap: 0.75rem; border-radius: 12px; }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;

  @media (max-width: 768px) { flex-direction: column; gap: 0.5rem; align-items: flex-start; }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Title = styled.h1`
  font-size: 1.35rem;
  color: #1e293b;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.4px;
  @media (max-width: 768px) { font-size: 1.1rem; }
`;

const Badge = styled.span`
  background: rgba(167, 119, 227, 0.08);
  color: #a777e3;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  border: 1px solid rgba(167, 119, 227, 0.2);
`;

const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  flex-shrink: 0;
  flex-wrap: wrap;
  background: white;
  padding: 0.85rem 1.25rem;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);

  @media (max-width: 768px) { flex-direction: column; align-items: stretch; }
`;

const FGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const FLabel = styled.label`
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FInput = styled.input`
  padding: 0.55rem 0.75rem;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  font-size: 0.85rem;
  color: #1e293b;
  outline: none;
  transition: all 0.15s;
  background: white;

  &:focus {
    border-color: #a777e3;
    box-shadow: 0 0 0 3px rgba(167, 119, 227, 0.1);
  }
`;

const IconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.55rem 0.85rem;
  border-radius: 14px;
  border: none;
  background: ${p => p.bg || "#a777e3"};
  color: ${p => p.color || "white"};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover { filter: brightness(0.94); transform: translateY(-1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  flex-shrink: 0;

  @media (max-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    padding-bottom: 6px;
    &::-webkit-scrollbar { height: 4px; }
    &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  }
`;

const MetricCard = styled.div`
  background: white;
  padding: 1rem 1.25rem;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  align-items: center;
  gap: 0.85rem;
  border-left: 4px solid ${p => p.accent || "#a777e3"};
  transition: transform 0.15s;
  &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }

  @media (max-width: 768px) {
    flex: 0 0 200px;
  }
`;

const MetricIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: ${p => p.bg || "rgba(167, 119, 227, 0.08)"};
  color: ${p => p.color || "#a777e3"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MetricInfo = styled.div`
  flex: 1;
`;

const MetricLabel = styled.div`
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const MetricValue = styled.div`
  font-size: 1.3rem;
  color: #1e293b;
  font-weight: 700;
  margin-top: 2px;
`;

const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  flex: 1;
  min-height: 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

const ChartTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 600;
`;

const COLORS = ["#a777e3", "#7c3aed", "#f472b6", "#06b6d4", "#10b981"];

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #94a3b8;
  font-size: 0.9rem;
`;

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
function ClinicalBillingDashboard() {
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const fetchDashboardData = async () => {
    if (!fromDate || !toDate) { toast.error("Please select both dates"); return; }
    setLoading(true);
    try {
      const url = `${Labbaseurl}clinical_billing_dashboard/?lab_id=${localStorage.getItem('employee_id') || localStorage.getItem('employeeId')}&from_date=${encodeURIComponent(fromDate)}&to_date=${encodeURIComponent(toDate)}`;
      const result = await apiRequest(url, "GET");
      if (result?.success) {
        setDashboardData(result.data || {});
      } else {
        toast.error(result?.error || "Failed to load dashboard");
      }
    } catch { toast.error("Failed to load dashboard"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const clearFilters = async () => {
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);

    setLoading(true);
    try {
      const url = `${Labbaseurl}clinical_billing_dashboard/?lab_id=${localStorage.getItem('employee_id') || localStorage.getItem('employeeId')}&from_date=${encodeURIComponent(today)}&to_date=${encodeURIComponent(today)}`;
      const result = await apiRequest(url, "GET");
      if (result?.success) {
        setDashboardData(result.data || {});
      }
    } catch {
      toast.error("Failed to clear filters");
    } finally {
      setLoading(false);
    }
  };

  const paymentStatusData = dashboardData
    ? Object.entries(dashboardData.payment_status).map(([name, value]) => ({ name: name || "N/A", value }))
    : [];

  const statusBreakdownData = dashboardData
    ? Object.entries(dashboardData.status_breakdown).map(([name, value]) => ({ name: name || "Unknown", value }))
    : [];

  return (
    <Shell>
      {/* Top */}
      <TopBar>
        <TitleGroup>
          <BarChart3 size={22} color="#a777e3" />
          <Title>Billing Dashboard</Title>
        </TitleGroup>
        <IconBtn bg="#a777e3" color="#f1f5f9" onClick={fetchDashboardData} disabled={loading} title="Refresh">
          <RefreshCw size={16} />
        </IconBtn>
      </TopBar>

      {/* Filters */}
      <FilterBar>
        <FGroup>
          <FLabel>From</FLabel>
          <FInput type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        </FGroup>
        <FGroup>
          <FLabel>To</FLabel>
          <FInput type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
        </FGroup>
        <IconBtn onClick={fetchDashboardData} disabled={loading} style={{ background: '#4361ee', color: 'white' }}>
          <TrendingUp size={15} />
          {loading ? "Loading..." : "Filter"}
        </IconBtn>
        <IconBtn onClick={clearFilters} disabled={loading} bg="#f1f5f9" color="#475569">
          Clear
        </IconBtn>
      </FilterBar>

      {/* Metrics */}
      {dashboardData && (
        <>
          <MetricsRow>
            <MetricCard accent="#a777e3">
              <MetricIcon bg="rgba(167,119,227,0.08)" color="#a777e3"><DollarSign size={20} /></MetricIcon>
              <MetricInfo>
                <MetricLabel>Total Amount</MetricLabel>
                <MetricValue>₹{dashboardData.total_amount?.toLocaleString() || 0}</MetricValue>
              </MetricInfo>
            </MetricCard>

            <MetricCard accent="#7c3aed">
              <MetricIcon bg="rgba(124,58,237,0.08)" color="#7c3aed"><FileText size={20} /></MetricIcon>
              <MetricInfo>
                <MetricLabel>Total Bills</MetricLabel>
                <MetricValue>{dashboardData.total_count || 0}</MetricValue>
              </MetricInfo>
            </MetricCard>

            <MetricCard accent="#06b6d4">
              <MetricIcon bg="rgba(6,182,212,0.08)" color="#06b6d4"><Users size={20} /></MetricIcon>
              <MetricInfo>
                <MetricLabel>Patients</MetricLabel>
                <MetricValue>{dashboardData.unique_patients || 0}</MetricValue>
              </MetricInfo>
            </MetricCard>

            <MetricCard accent="#f472b6">
              <MetricIcon bg="rgba(244,114,182,0.08)" color="#f472b6"><CreditCard size={20} /></MetricIcon>
              <MetricInfo>
                <MetricLabel>Credit</MetricLabel>
                <MetricValue>₹{dashboardData.total_credit?.toLocaleString() || 0}</MetricValue>
              </MetricInfo>
            </MetricCard>

            <MetricCard accent="#10b981">
              <MetricIcon bg="rgba(16,185,129,0.08)" color="#10b981"><FileText size={20} /></MetricIcon>
              <MetricInfo>
                <MetricLabel>Tests</MetricLabel>
                <MetricValue>{dashboardData.tests_count || 0}</MetricValue>
              </MetricInfo>
            </MetricCard>
          </MetricsRow>

          {/* Charts */}
          <ChartsRow>
            <ChartCard>
              <ChartTitle>Payment Status</ChartTitle>
              {paymentStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentStatusData} cx="50%" cy="50%" labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius="75%" fill="#8884d8" dataKey="value">
                      {paymentStatusData.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : <LoadingOverlay>No data</LoadingOverlay>}
            </ChartCard>

            <ChartCard>
              <ChartTitle>Billing Status</ChartTitle>
              {statusBreakdownData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusBreakdownData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" angle={-30} textAnchor="end" height={60}
                      tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#a777e3" name="Count" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <LoadingOverlay>No data</LoadingOverlay>}
            </ChartCard>
          </ChartsRow>
        </>
      )}

      {!dashboardData && !loading && (
        <LoadingOverlay>Click Refresh to load dashboard data</LoadingOverlay>
      )}
    </Shell>
  );
}

export default ClinicalBillingDashboard;
