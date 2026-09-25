import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import apiRequest from "../Auth/apiRequest";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  BarChart3,
  Table as TableIcon,
  Users,
  Target,
  Award,
  DollarSign,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

const ACCENT = "#219C9C";
const ACCENT_DARK = "#256565";

// Local YYYY-MM for the month picker, defaulting to the current month.
const getCurrentYearMonth = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
};

const getErrorMessage = (err, fallback) => {
  const data = err?.response?.data ?? err?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data?.error) return data.error;
  if (data?.message) return data.message;
  if (err?.message) return err.message;
  return fallback;
};

// ── Styled components ──────────────────────────────────────────────────

const Container = styled.div`
  padding: 24px;

  @media (max-width: 480px) {
    padding: 14px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h2`
  margin: 0;
  color: ${ACCENT_DARK};
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 480px) {
    font-size: 19px;
  }
`;

const SectionTitle = styled.h3`
  margin: 20px 0 8px;
  color: ${ACCENT_DARK};
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  padding: 14px 16px;
  background: #f2f9f9;
  border-radius: 10px;
  border: 1px solid #ddecde;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const FilterLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${ACCENT_DARK};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const MonthInput = styled.input`
  padding: 8px 10px;
  border: 1px solid #cfe0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background: #fff;

  &:focus {
    outline: none;
    border-color: ${ACCENT};
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 10px;
  }
`;

const CategorySelect = styled.select`
  min-width: 160px;
  padding: 8px 10px;
  border: 1px solid #cfe0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background: #fff;

  &:focus {
    outline: none;
    border-color: ${ACCENT};
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: 0;
    padding: 10px;
  }
`;

// ── Tab Controls ────────────────────────────────────────────────────────

const TabBar = styled.div`
  display: flex;
  gap: 8px;
  background: #e4f0f0;
  padding: 5px;
  border-radius: 12px;
  margin-bottom: 20px;
  width: fit-content;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $active }) => ($active ? "#fff" : "transparent")};
  color: ${({ $active }) => ($active ? ACCENT_DARK : "#5a7a7a")};
  box-shadow: ${({ $active }) => ($active ? "0 2px 8px rgba(33, 156, 156, 0.15)" : "none")};

  &:hover {
    color: ${ACCENT_DARK};
    background: ${({ $active }) => ($active ? "#fff" : "rgba(255, 255, 255, 0.5)")};
  }

  @media (max-width: 600px) {
    flex: 1;
    justify-content: center;
    padding: 8px 10px;
    font-size: 12.5px;
  }
`;

// ── Table styling ────────────────────────────────────────────────────────

const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid #d5dede;
  border-radius: 8px;
  margin-bottom: 24px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c3d0d0;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f2f7f7;
  }
`;

const Table = styled.table`
  border-collapse: collapse;
  min-width: 100%;
`;

const Th = styled.th`
  text-align: center;
  padding: 8px 10px;
  background: #f2f7f7;
  color: ${ACCENT_DARK};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  border-bottom: 1px solid #d5dede;
  border-right: 1px solid #eef2f2;
  white-space: nowrap;
`;

const GroupTh = styled(Th)`
  background: #e4f3f3;
  font-size: 12px;
`;

const Td = styled.td`
  padding: 8px 10px;
  font-size: 13px;
  text-align: center;
  border-bottom: 1px solid #eef2f2;
  border-right: 1px solid #f5f8f8;
  white-space: nowrap;
`;

const StickyTh = styled(Th)`
  position: sticky;
  left: 0;
  z-index: 2;
  text-align: left;
  background: #f2f7f7;
  min-width: 150px;
`;

const StickyTd = styled(Td)`
  position: sticky;
  left: 0;
  z-index: 1;
  text-align: left;
  background: #fff;
  font-weight: 600;
  min-width: 150px;
`;

const WeekTotalTh = styled(Th)`
  font-weight: 700;
  border-left: 2px solid #cfe0e0;
`;

const WeekTotalTd = styled(Td)`
  font-weight: 700;
  background: #d4f0f0;
  color: #1a6b6b;
  border-left: 2px solid #219C9C;
  border-right: 2px solid #219C9C;
`;

const TotalsRow = styled.tr`
  background: #f7fbfb;
  font-weight: 700;

  ${Td} {
    border-top: 2px solid #d5dede;
  }

  ${StickyTd} {
    background: #f7fbfb;
    border-top: 2px solid #d5dede;
  }
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #7a8a8a;
`;

// ── Analytics Dashboard Styled Components ──────────────────────────────

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 16px;
`;

const KpiCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 18px;
  border: 1px solid #e0eeee;
  box-shadow: 0 2px 10px rgba(33, 156, 156, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(33, 156, 156, 0.1);
  }
`;

const KpiTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const KpiTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #557575;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const KpiIconBadge = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $bg }) => $bg || "#e8f7f7"};
  color: ${({ $color }) => $color || ACCENT};
`;

const KpiValue = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #1a3333;
  margin-bottom: 4px;
`;

const KpiSub = styled.div`
  font-size: 11.5px;
  color: #728c8c;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MiniProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #e6f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 8px;
`;

const MiniProgressFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => Math.min(100, Math.max(0, $pct))}%;
  background: ${({ $color }) => $color || ACCENT};
  border-radius: 3px;
  transition: width 0.4s ease;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e0eeee;
  box-shadow: 0 2px 10px rgba(33, 156, 156, 0.05);
  display: flex;
  flex-direction: column;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ChartTitle = styled.h4`
  margin: 0;
  font-size: 14.5px;
  font-weight: 700;
  color: #1a5c5c;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChartSub = styled.div`
  font-size: 11px;
  color: #728c8c;
  margin-top: 2px;
`;

const CustomTooltipBox = styled.div`
  background: #1b2e2e;
  color: #fff;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  line-height: 1.5;

  .tooltip-title {
    font-weight: 700;
    margin-bottom: 6px;
    color: #48d1cc;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    padding-bottom: 4px;
  }

  .tooltip-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 2px;
  }
`;

// ── Leaderboard Table ──────────────────────────────────────────────────

const LeaderboardCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e0eeee;
  box-shadow: 0 2px 10px rgba(33, 156, 156, 0.05);
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 12px;

  th {
    text-align: left;
    padding: 10px 12px;
    background: #f0f7f7;
    color: #1a5c5c;
    font-size: 11px;
    text-transform: uppercase;
    font-weight: 700;
    border-bottom: 1px solid #d5dede;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #f0f5f5;
    vertical-align: middle;
  }

  tr:hover td {
    background: #f7fcfc;
  }
`;

const AvatarInitials = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #d4f0f0;
  color: #1a6b6b;
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  background: ${({ $status }) =>
    $status === "exceed"
      ? "#e6f9f0"
      : $status === "good"
      ? "#e8f7f7"
      : "#fef3c7"};
  color: ${({ $status }) =>
    $status === "exceed"
      ? "#059669"
      : $status === "good"
      ? "#0d9488"
      : "#d97706"};
`;

// ── Component ──────────────────────────────────────────────────────────

const SalesReport = () => {
  const [activeTab, setActiveTab] = useState("report"); // "report" | "dashboard"
  const [selectedExecutive, setSelectedExecutive] = useState("all");
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth());
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [days, setDays] = useState([]);
  const [rows, setRows] = useState([]);

  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState("");

  const [year, month] = useMemo(
    () => yearMonth.split("-").map((v) => parseInt(v, 10)),
    [yearMonth]
  );

  // ── Load sales executives once ──────────────────────────────────────

  const loadEmployees = useCallback(async () => {
    setLoadingEmployees(true);
    try {
      const res = await apiRequest(`${Labbaseurl}get_sales_executives/`, "GET");
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.results)
        ? res.results
        : [];
      setEmployees(list);
    } catch (err) {
      console.error("Failed to load sales executives:", err);
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // ── Load the week-grid Plan vs Actual report ────────────────────────

  const loadReport = useCallback(async () => {
    if (employees.length === 0) return;

    setLoadingReport(true);
    setError("");
    try {
      const payload = {
        month,
        year,
        category,
        employees: employees.map((e) => ({
          employeeId: e.employeeId,
          employeeName: e.employeeName,
        })),
      };
      const res = await apiRequest(`${Labbaseurl}salesplanreport/`, "POST", payload);
      const data = res?.data ?? res;
      setDays(Array.isArray(data?.days) ? data.days : []);
      setRows(Array.isArray(data?.results) ? data.results : []);
      setCategories(Array.isArray(data?.categories) ? data.categories : []);
    } catch (err) {
      console.error("Failed to load sales plan report:", err);
      setError(getErrorMessage(err, "Failed to load the report. Please try again."));
      setDays([]);
      setRows([]);
    } finally {
      setLoadingReport(false);
    }
  }, [employees, month, year, category]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  useEffect(() => {
    if (category !== "all" && categories.length > 0 && !categories.includes(category)) {
      setCategory("all");
    }
  }, [categories, category]);

  const weekGroups = useMemo(() => {
    const groups = [];
    days.forEach((d) => {
      const last = groups[groups.length - 1];
      if (last && last.week === d.week) {
        last.days.push(d);
      } else {
        groups.push({ week: d.week, days: [d] });
      }
    });
    return groups;
  }, [days]);

  const buildTotals = useCallback(
    (metric) => {
      const totals = {};
      days.forEach((d) => {
        totals[d.day] = rows.reduce(
          (sum, row) => sum + (row[metric]?.[String(d.day)] || 0),
          0
        );
      });
      return totals;
    },
    [days, rows]
  );

  const planTotals = useMemo(() => buildTotals("plan_by_day"), [buildTotals]);
  const planVolumeTotals = useMemo(() => buildTotals("plan_volume_by_day"), [buildTotals]);
  const actualTotals = useMemo(() => buildTotals("actual_by_day"), [buildTotals]);
  const actualVolumeTotals = useMemo(() => buildTotals("actual_volume_by_day"), [buildTotals]);

  const fmtAmt = (val) => {
    const n = Number(val) || 0;
    if (n === 0) return "";
    return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const fmtNum = (val) => (Number(val) || 0).toLocaleString("en-IN");

  const weekSum = (valuesByDay, group) =>
    group.days.reduce(
      (sum, d) => sum + (Number(valuesByDay?.[String(d.day)]) || Number(valuesByDay?.[d.day]) || 0),
      0
    );

  const grandWeekSum = (totalsObj, group) =>
    group.days.reduce(
      (sum, d) => sum + (Number(totalsObj?.[d.day]) || 0),
      0
    );

  const loading = loadingEmployees || loadingReport;

  // ── Analytics calculations ───────────────────────────────────────────

  const analyticsSummary = useMemo(() => {
    const activeRows = selectedExecutive === "all"
      ? rows
      : rows.filter((r) => r.employee_id === selectedExecutive);

    let planRev = 0;
    let actRev = 0;
    let planVol = 0;
    let actVol = 0;

    activeRows.forEach((r) => {
      planRev += Object.values(r.plan_by_day || {}).reduce((s, v) => s + (Number(v) || 0), 0);
      actRev += Object.values(r.actual_by_day || {}).reduce((s, v) => s + (Number(v) || 0), 0);
      planVol += Object.values(r.plan_volume_by_day || {}).reduce((s, v) => s + (Number(v) || 0), 0);
      actVol += Object.values(r.actual_volume_by_day || {}).reduce((s, v) => s + (Number(v) || 0), 0);
    });

    const achievePct = planRev > 0 ? (actRev / planRev) * 100 : 0;
    const variance = actRev - planRev;

    return {
      planRev,
      actRev,
      planVol,
      actVol,
      achievePct: achievePct.toFixed(1),
      variance,
    };
  }, [rows, selectedExecutive]);

  // Executive comparison data for charts
  const executiveComparisonData = useMemo(() => {
    return rows.map((r) => {
      const pRev = Object.values(r.plan_by_day || {}).reduce((s, v) => s + (Number(v) || 0), 0);
      const aRev = Object.values(r.actual_by_day || {}).reduce((s, v) => s + (Number(v) || 0), 0);
      const pVol = Object.values(r.plan_volume_by_day || {}).reduce((s, v) => s + (Number(v) || 0), 0);
      const aVol = Object.values(r.actual_volume_by_day || {}).reduce((s, v) => s + (Number(v) || 0), 0);
      const pct = pRev > 0 ? (aRev / pRev) * 100 : 0;

      return {
        id: r.employee_id,
        name: r.employee_name,
        "Plan (₹)": Math.round(pRev),
        "Actual (₹)": Math.round(aRev),
        "Plan Volume": pVol,
        "Actual Volume": aVol,
        achievement: pct.toFixed(1),
      };
    });
  }, [rows]);

  // Daily timeline data for AreaChart
  const dailyTimelineData = useMemo(() => {
    return days.map((d) => {
      const dayKey = String(d.day);
      let dayPlan = 0;
      let dayActual = 0;

      if (selectedExecutive === "all") {
        dayPlan = planTotals[d.day] || 0;
        dayActual = actualTotals[d.day] || 0;
      } else {
        const target = rows.find((r) => r.employee_id === selectedExecutive);
        if (target) {
          dayPlan = target.plan_by_day?.[dayKey] || 0;
          dayActual = target.actual_by_day?.[dayKey] || 0;
        }
      }

      return {
        day: d.label,
        "Plan (₹)": Math.round(dayPlan),
        "Actual (₹)": Math.round(dayActual),
      };
    });
  }, [days, rows, selectedExecutive, planTotals, actualTotals]);

  // Weekly performance data for charts
  const weeklyPerformanceData = useMemo(() => {
    return weekGroups.map((g) => {
      let wkPlan = 0;
      let wkActual = 0;

      if (selectedExecutive === "all") {
        wkPlan = grandWeekSum(planTotals, g);
        wkActual = grandWeekSum(actualTotals, g);
      } else {
        const target = rows.find((r) => r.employee_id === selectedExecutive);
        if (target) {
          wkPlan = weekSum(target.plan_by_day, g);
          wkActual = weekSum(target.actual_by_day, g);
        }
      }

      return {
        week: `Wk ${g.week}`,
        "Plan (₹)": Math.round(wkPlan),
        "Actual (₹)": Math.round(wkActual),
      };
    });
  }, [weekGroups, rows, selectedExecutive, planTotals, actualTotals]);

  const renderGrid = (metric, totals, volumeMetric, volumeTotals) => (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <StickyTh rowSpan={2}>Sales Executive</StickyTh>
            {weekGroups.map((g, i) => (
              <GroupTh key={`${g.week}-${i}`} colSpan={g.days.length + 1}>
                Week {g.week}
              </GroupTh>
            ))}
            <GroupTh>Monthly Total</GroupTh>
          </tr>
          <tr>
            {weekGroups.map((g, i) => (
              <React.Fragment key={`${g.week}-${i}`}>
                {g.days.map((d) => (
                  <Th key={d.day}>
                    {d.weekday}
                    <br />
                    {d.label}
                  </Th>
                ))}
                <WeekTotalTh>Wk {g.week} Total</WeekTotalTh>
              </React.Fragment>
            ))}
            <WeekTotalTh>Total (₹)</WeekTotalTh>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const monthTotal = Object.values(row[metric] || {}).reduce(
              (s, v) => s + (Number(v) || 0), 0
            );
            const monthVolTotal = volumeMetric ? Object.values(row[volumeMetric] || {}).reduce(
              (s, v) => s + (Number(v) || 0), 0
            ) : 0;
            return (
              <tr key={row.employee_id}>
                <StickyTd>{row.employee_name}</StickyTd>
                {weekGroups.map((g, i) => {
                  const wkVol = volumeMetric ? weekSum(row[volumeMetric], g) : 0;
                  return (
                    <React.Fragment key={`${g.week}-${i}`}>
                      {g.days.map((d) => {
                        const value = row[metric]?.[String(d.day)];
                        const volValue = volumeMetric ? row[volumeMetric]?.[String(d.day)] : null;
                        return (
                          <Td key={d.day}>
                            {volumeMetric && volValue ? <div style={{fontSize: '11px', color: '#66b2b2', fontWeight: 600, marginBottom: '2px'}}>Vol: {volValue}</div> : null}
                            <div>{value ? fmtAmt(value) : ""}</div>
                          </Td>
                        );
                      })}
                      <WeekTotalTd>
                        {volumeMetric && wkVol ? <div style={{fontSize: '11px', color: '#66b2b2', fontWeight: 600, marginBottom: '2px'}}>Vol: {wkVol}</div> : null}
                        <div>{fmtAmt(weekSum(row[metric], g))}</div>
                      </WeekTotalTd>
                    </React.Fragment>
                  );
                })}
                <WeekTotalTd>
                  {volumeMetric && monthVolTotal ? <div style={{fontSize: '11px', color: '#66b2b2', fontWeight: 600, marginBottom: '2px'}}>Vol: {monthVolTotal}</div> : null}
                  <div>{fmtAmt(monthTotal)}</div>
                </WeekTotalTd>
              </tr>
            );
          })}
        </tbody>
        {rows.length > 0 && (
          <tfoot>
            <TotalsRow>
              <StickyTd>Total</StickyTd>
              {weekGroups.map((g, i) => {
                const gWkVol = volumeMetric ? grandWeekSum(volumeTotals, g) : 0;
                return (
                  <React.Fragment key={`${g.week}-${i}`}>
                    {g.days.map((d) => (
                      <Td key={d.day}>
                        {volumeMetric && volumeTotals[d.day] ? <div style={{fontSize: '11px', color: '#66b2b2', fontWeight: 600, marginBottom: '2px'}}>Vol: {volumeTotals[d.day]}</div> : null}
                        <div>{fmtAmt(totals[d.day] ?? 0)}</div>
                      </Td>
                    ))}
                    <WeekTotalTd>
                      {volumeMetric && gWkVol ? <div style={{fontSize: '11px', color: '#66b2b2', fontWeight: 600, marginBottom: '2px'}}>Vol: {gWkVol}</div> : null}
                      <div>{fmtAmt(grandWeekSum(totals, g))}</div>
                    </WeekTotalTd>
                  </React.Fragment>
                );
              })}
              <WeekTotalTd>
                {volumeMetric && Object.values(volumeTotals || {}).reduce((s, v) => s + (Number(v) || 0), 0) ? <div style={{fontSize: '11px', color: '#66b2b2', fontWeight: 600, marginBottom: '2px'}}>Vol: {Object.values(volumeTotals || {}).reduce((s, v) => s + (Number(v) || 0), 0)}</div> : null}
                <div>{fmtAmt(Object.values(totals).reduce((s, v) => s + (Number(v) || 0), 0))}</div>
              </WeekTotalTd>
            </TotalsRow>
          </tfoot>
        )}
      </Table>
      {!loading && rows.length === 0 && (
        <EmptyState>No sales executives to report on.</EmptyState>
      )}
      {loading && <EmptyState>Loading...</EmptyState>}
    </TableWrapper>
  );

  return (
    <Container>
      <Header>
        <Title>
          <TrendingUp size={24} color={ACCENT} />
          Sales Performance & Analytics
        </Title>
      </Header>

      <FilterBar>
        <FilterField>
          <FilterLabel htmlFor="sales-report-month">Month</FilterLabel>
          <MonthInput
            id="sales-report-month"
            type="month"
            value={yearMonth}
            onChange={(e) => setYearMonth(e.target.value)}
          />
        </FilterField>

        <FilterField>
          <FilterLabel htmlFor="sales-report-category">Category</FilterLabel>
          <CategorySelect
            id="sales-report-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </CategorySelect>
        </FilterField>

        {activeTab === "dashboard" && (
          <FilterField>
            <FilterLabel htmlFor="sales-exec-filter">Executive View</FilterLabel>
            <CategorySelect
              id="sales-exec-filter"
              value={selectedExecutive}
              onChange={(e) => setSelectedExecutive(e.target.value)}
            >
              <option value="all">All Sales Executives</option>
              {rows.map((r) => (
                <option key={r.employee_id} value={r.employee_id}>
                  {r.employee_name}
                </option>
              ))}
            </CategorySelect>
          </FilterField>
        )}
      </FilterBar>

      <TabBar>
        <TabButton
          $active={activeTab === "report"}
          onClick={() => setActiveTab("report")}
        >
          <TableIcon size={16} />
          <span>Sales Report</span>
        </TabButton>
        <TabButton
          $active={activeTab === "dashboard"}
          onClick={() => setActiveTab("dashboard")}
        >
          <BarChart3 size={16} />
          <span>Analytics Dashboard</span>
        </TabButton>
      </TabBar>

      {error && <EmptyState>{error}</EmptyState>}

      {!error && activeTab === "report" && (
        <>
          <SectionTitle>Plan Amount (₹) — from Sales Plan</SectionTitle>
          {renderGrid("plan_by_day", planTotals, "plan_volume_by_day", planVolumeTotals)}

          <SectionTitle>Actual Amount (₹) — from Billing</SectionTitle>
          {renderGrid("actual_by_day", actualTotals, "actual_volume_by_day", actualVolumeTotals)}
        </>
      )}

      {!error && activeTab === "dashboard" && (
        <DashboardWrapper>
          {/* KPI Summary Cards */}
          <KpiGrid>
            <KpiCard>
              <KpiTop>
                <KpiTitle>Target Revenue</KpiTitle>
                <KpiIconBadge $bg="#e6f7f7" $color="#0d9488">
                  <Target size={18} />
                </KpiIconBadge>
              </KpiTop>
              <KpiValue>{fmtAmt(analyticsSummary.planRev) || "₹0"}</KpiValue>
              <KpiSub>Total planned target for month</KpiSub>
            </KpiCard>

            <KpiCard>
              <KpiTop>
                <KpiTitle>Actual Revenue</KpiTitle>
                <KpiIconBadge $bg="#ecfdf5" $color="#10b981">
                  <DollarSign size={18} />
                </KpiIconBadge>
              </KpiTop>
              <KpiValue>{fmtAmt(analyticsSummary.actRev) || "₹0"}</KpiValue>
              <KpiSub>Total billed revenue</KpiSub>
            </KpiCard>

            <KpiCard>
              <KpiTop>
                <KpiTitle>Achievement Rate</KpiTitle>
                <KpiIconBadge
                  $bg={analyticsSummary.achievePct >= 100 ? "#ecfdf5" : analyticsSummary.achievePct >= 70 ? "#fffbeb" : "#fef2f2"}
                  $color={analyticsSummary.achievePct >= 100 ? "#10b981" : analyticsSummary.achievePct >= 70 ? "#f59e0b" : "#ef4444"}
                >
                  <Award size={18} />
                </KpiIconBadge>
              </KpiTop>
              <KpiValue>{analyticsSummary.achievePct}%</KpiValue>
              <KpiSub>
                {analyticsSummary.achievePct >= 100
                  ? "Target achieved 🎉"
                  : analyticsSummary.achievePct >= 70
                  ? "On track towards target"
                  : "Behind target"}
              </KpiSub>
              <MiniProgressBar>
                <MiniProgressFill
                  $pct={Number(analyticsSummary.achievePct)}
                  $color={analyticsSummary.achievePct >= 100 ? "#10b981" : analyticsSummary.achievePct >= 70 ? "#f59e0b" : "#ef4444"}
                />
              </MiniProgressBar>
            </KpiCard>

            <KpiCard>
              <KpiTop>
                <KpiTitle>Volume (Bills / Rx)</KpiTitle>
                <KpiIconBadge $bg="#f0f9ff" $color="#0284c7">
                  <Layers size={18} />
                </KpiIconBadge>
              </KpiTop>
              <KpiValue>
                {fmtNum(analyticsSummary.actVol)} / {fmtNum(analyticsSummary.planVol)}
              </KpiValue>
              <KpiSub>Completed vs Target volume</KpiSub>
            </KpiCard>

            <KpiCard>
              <KpiTop>
                <KpiTitle>Variance / Shortfall</KpiTitle>
                <KpiIconBadge
                  $bg={analyticsSummary.variance >= 0 ? "#ecfdf5" : "#fef2f2"}
                  $color={analyticsSummary.variance >= 0 ? "#10b981" : "#ef4444"}
                >
                  {analyticsSummary.variance >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </KpiIconBadge>
              </KpiTop>
              <KpiValue style={{ color: analyticsSummary.variance >= 0 ? "#10b981" : "#dc2626" }}>
                {analyticsSummary.variance >= 0 ? "+" : ""}
                {fmtAmt(analyticsSummary.variance) || "₹0"}
              </KpiValue>
              <KpiSub>
                {analyticsSummary.variance >= 0 ? "Surplus over plan" : "Deficit to achieve"}
              </KpiSub>
            </KpiCard>
          </KpiGrid>

          {/* Charts Row 1: Executive Comparison */}
          <ChartsGrid>
            <ChartCard>
              <ChartHeader>
                <div>
                  <ChartTitle>
                    <BarChart3 size={16} color={ACCENT} />
                    Revenue by Sales Person (Plan vs Actual)
                  </ChartTitle>
                  <ChartSub>Comparison of target revenue vs actual billing in ₹</ChartSub>
                </div>
              </ChartHeader>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={executiveComparisonData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f2" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#557575" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#557575" }} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <CustomTooltipBox>
                              <div className="tooltip-title">{label}</div>
                              {payload.map((entry, index) => (
                                <div key={index} className="tooltip-row">
                                  <span style={{ color: entry.color }}>{entry.name}:</span>
                                  <strong>₹{Number(entry.value).toLocaleString("en-IN")}</strong>
                                </div>
                              ))}
                            </CustomTooltipBox>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Bar dataKey="Plan (₹)" fill="#219C9C" radius={[4, 4, 0, 0]} maxBarSize={45} />
                    <Bar dataKey="Actual (₹)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard>
              <ChartHeader>
                <div>
                  <ChartTitle>
                    <Layers size={16} color="#0284c7" />
                    Volume by Sales Person (Plan vs Actual)
                  </ChartTitle>
                  <ChartSub>Target prescription volume vs actual bills count</ChartSub>
                </div>
              </ChartHeader>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={executiveComparisonData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f2" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#557575" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#557575" }} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <CustomTooltipBox>
                              <div className="tooltip-title">{label}</div>
                              {payload.map((entry, index) => (
                                <div key={index} className="tooltip-row">
                                  <span style={{ color: entry.color }}>{entry.name}:</span>
                                  <strong>{Number(entry.value).toLocaleString("en-IN")}</strong>
                                </div>
                              ))}
                            </CustomTooltipBox>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Bar dataKey="Plan Volume" fill="#0284c7" radius={[4, 4, 0, 0]} maxBarSize={45} />
                    <Bar dataKey="Actual Volume" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </ChartsGrid>

          {/* Charts Row 2: Timeline Trends */}
          <ChartsGrid>
            <ChartCard>
              <ChartHeader>
                <div>
                  <ChartTitle>
                    <TrendingUp size={16} color="#059669" />
                    Daily Performance Trend
                  </ChartTitle>
                  <ChartSub>
                    {selectedExecutive === "all"
                      ? "Daily Plan vs Actual Revenue across all executives"
                      : `Daily Plan vs Actual for ${rows.find((r) => r.employee_id === selectedExecutive)?.employee_name || "selected executive"}`}
                  </ChartSub>
                </div>
              </ChartHeader>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <AreaChart data={dailyTimelineData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorPlan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#219C9C" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#219C9C" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f2" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#557575" }} interval={2} />
                    <YAxis tick={{ fontSize: 11, fill: "#557575" }} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <CustomTooltipBox>
                              <div className="tooltip-title">{label}</div>
                              {payload.map((entry, index) => (
                                <div key={index} className="tooltip-row">
                                  <span style={{ color: entry.color }}>{entry.name}:</span>
                                  <strong>₹{Number(entry.value).toLocaleString("en-IN")}</strong>
                                </div>
                              ))}
                            </CustomTooltipBox>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Area type="monotone" dataKey="Plan (₹)" stroke="#219C9C" strokeWidth={2} fillOpacity={1} fill="url(#colorPlan)" />
                    <Area type="monotone" dataKey="Actual (₹)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard>
              <ChartHeader>
                <div>
                  <ChartTitle>
                    <Target size={16} color="#0e7490" />
                    Weekly Performance
                  </ChartTitle>
                  <ChartSub>Plan vs Actual revenue broken down by ISO week</ChartSub>
                </div>
              </ChartHeader>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={weeklyPerformanceData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f2" />
                    <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#557575" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#557575" }} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <CustomTooltipBox>
                              <div className="tooltip-title">{label}</div>
                              {payload.map((entry, index) => (
                                <div key={index} className="tooltip-row">
                                  <span style={{ color: entry.color }}>{entry.name}:</span>
                                  <strong>₹{Number(entry.value).toLocaleString("en-IN")}</strong>
                                </div>
                              ))}
                            </CustomTooltipBox>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Bar dataKey="Plan (₹)" fill="#219C9C" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Actual (₹)" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </ChartsGrid>

          {/* Performance Leaderboard */}
          <LeaderboardCard>
            <ChartHeader>
              <div>
                <ChartTitle>
                  <Award size={18} color="#d97706" />
                  Sales Person Performance Leaderboard
                </ChartTitle>
                <ChartSub>Detailed executive progress and targets achievement overview</ChartSub>
              </div>
            </ChartHeader>

            <LeaderboardTable>
              <thead>
                <tr>
                  <th>Sales Person</th>
                  <th>Target Revenue</th>
                  <th>Actual Billed</th>
                  <th>Achievement %</th>
                  <th>Target Volume</th>
                  <th>Actual Volume</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const pRev = Object.values(row.plan_by_day || {}).reduce((s, v) => s + (Number(v) || 0), 0);
                  const aRev = Object.values(row.actual_by_day || {}).reduce((s, v) => s + (Number(v) || 0), 0);
                  const pVol = Object.values(row.plan_volume_by_day || {}).reduce((s, v) => s + (Number(v) || 0), 0);
                  const aVol = Object.values(row.actual_volume_by_day || {}).reduce((s, v) => s + (Number(v) || 0), 0);
                  const pct = pRev > 0 ? (aRev / pRev) * 100 : 0;
                  const status = pct >= 100 ? "exceed" : pct >= 70 ? "good" : "behind";

                  const initials = row.employee_name
                    ? row.employee_name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
                    : "SE";

                  return (
                    <tr key={row.employee_id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <AvatarInitials>{initials}</AvatarInitials>
                          <div>
                            <div style={{ fontWeight: 700, color: "#1e3a3a" }}>{row.employee_name}</div>
                            <div style={{ fontSize: 11, color: "#7a9595" }}>ID: {row.employee_id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{fmtAmt(pRev) || "₹0"}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: "#10b981" }}>{fmtAmt(aRev) || "₹0"}</div>
                      </td>
                      <td style={{ minWidth: 150 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 12 }}>{pct.toFixed(1)}%</span>
                        </div>
                        <MiniProgressBar>
                          <MiniProgressFill
                            $pct={pct}
                            $color={pct >= 100 ? "#10b981" : pct >= 70 ? "#f59e0b" : "#ef4444"}
                          />
                        </MiniProgressBar>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{fmtNum(pVol)}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: "#0284c7" }}>{fmtNum(aVol)}</span>
                      </td>
                      <td>
                        <StatusPill $status={status}>
                          {status === "exceed" ? (
                            <>
                              <CheckCircle2 size={12} /> Exceeding
                            </>
                          ) : status === "good" ? (
                            <>
                              <CheckCircle2 size={12} /> On Track
                            </>
                          ) : (
                            <>
                              <AlertTriangle size={12} /> Behind Target
                            </>
                          )}
                        </StatusPill>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </LeaderboardTable>
          </LeaderboardCard>
        </DashboardWrapper>
      )}
    </Container>
  );
};

export default SalesReport;