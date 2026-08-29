import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import apiRequest from "../Auth/apiRequest";

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
  justify-content: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
  color: ${ACCENT_DARK};
  font-size: 22px;

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
  margin-bottom: 8px;
  padding: 14px 16px;
  background: #f2f9f9;
  border-radius: 8px;

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

// Sticky first column ("Sales Executive" / "Total") so the employee
// name stays visible while scrolling through a month's worth of day
// columns.
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

// The per-week subtotal column at the end of each "Week NN" group —
// visually separated with a heavier left border so it reads as a
// boundary between weeks.
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

// ── Component ──────────────────────────────────────────────────────────

const SalesReport = () => {
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth());
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const [employees, setEmployees] = useState([]);
  // Day column metadata from the backend: [{ day, week, weekday, label }, ...]
  const [days, setDays] = useState([]);
  // One row per sales executive: { employee_id, employee_name, plan: {"1": n, ...}, actual: {"1": n, ...} }
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

  // If the currently-selected category filter no longer exists in the
  // dropdown options once real data comes back, silently fall back to
  // "all" rather than showing a stuck/empty filtered view.
  useEffect(() => {
    if (category !== "all" && categories.length > 0 && !categories.includes(category)) {
      setCategory("all");
    }
  }, [categories, category]);

  // Group consecutive days that fall in the same ISO week into one
  // merged "Week NN" header cell spanning that week's day columns.
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

  // Per-day column totals across all employees, for the Total row.
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

  // Format a number as Indian Rupee — e.g. 1234.5 → "₹1,234.50"
  const fmtAmt = (val) => {
    const n = Number(val) || 0;
    if (n === 0) return "";
    return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  // Always sum from daily values for the displayed week group.
  // (Do NOT use SalesPlan.weekly_totals — those are pre-computed with
  //  different week boundaries and will show the wrong number here.)
  const weekSum = (valuesByDay, group) =>
    group.days.reduce(
      (sum, d) => sum + (Number(valuesByDay?.[String(d.day)]) || Number(valuesByDay?.[d.day]) || 0),
      0
    );

  // Grand-total week sum across all employees — sum daily column totals
  const grandWeekSum = (totalsObj, group) =>
    group.days.reduce(
      (sum, d) => sum + (Number(totalsObj?.[d.day]) || 0),
      0
    );

  const loading = loadingEmployees || loadingReport;

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
                {weekGroups.map((g, i) => (
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
                      {volumeMetric ? <div style={{fontSize: '11px', color: '#66b2b2', fontWeight: 600, marginBottom: '2px'}}>Vol: {weekSum(row[volumeMetric], g)}</div> : null}
                      <div>{fmtAmt(weekSum(row[metric], g))}</div>
                    </WeekTotalTd>
                  </React.Fragment>
                ))}
                <WeekTotalTd>
                  {volumeMetric ? <div style={{fontSize: '11px', color: '#66b2b2', fontWeight: 600, marginBottom: '2px'}}>Vol: {monthVolTotal}</div> : null}
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
              {weekGroups.map((g, i) => (
                <React.Fragment key={`${g.week}-${i}`}>
                  {g.days.map((d) => (
                    <Td key={d.day}>
                      {volumeMetric && volumeTotals[d.day] ? <div style={{fontSize: '11px', color: '#66b2b2', fontWeight: 600, marginBottom: '2px'}}>Vol: {volumeTotals[d.day]}</div> : null}
                      <div>{fmtAmt(totals[d.day] ?? 0)}</div>
                    </Td>
                  ))}
                  <WeekTotalTd>
                    {volumeMetric ? <div style={{fontSize: '11px', color: '#66b2b2', fontWeight: 600, marginBottom: '2px'}}>Vol: {grandWeekSum(volumeTotals, g)}</div> : null}
                    <div>{fmtAmt(grandWeekSum(totals, g))}</div>
                  </WeekTotalTd>
                </React.Fragment>
              ))}
              <WeekTotalTd>
                {volumeMetric ? <div style={{fontSize: '11px', color: '#66b2b2', fontWeight: 600, marginBottom: '2px'}}>Vol: {Object.values(volumeTotals || {}).reduce((s, v) => s + (Number(v) || 0), 0)}</div> : null}
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
        <Title>Sales Plan Report — Actual vs Plan</Title>
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
      </FilterBar>

      {error && <EmptyState>{error}</EmptyState>}

      {!error && (
        <>
          <SectionTitle>Plan Amount (₹) — from Sales Plan</SectionTitle>
          {renderGrid("plan_by_day", planTotals, "plan_volume_by_day", planVolumeTotals)}

          <SectionTitle>Actual Amount (₹) — from Billing</SectionTitle>
          {renderGrid("actual_by_day", actualTotals)}
        </>
      )}
    </Container>
  );
};

export default SalesReport;