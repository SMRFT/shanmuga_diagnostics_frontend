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

// Local YYYY-MM-DD for the "Date wise" date picker, defaulting to today.
const getCurrentDateISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatAmount = (value) =>
  value === null || value === undefined ? "—" : currencyFormatter.format(value);

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

const FilterBar = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;
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

const NoticeText = styled.div`
  font-size: 12px;
  color: #7a8a8a;
  margin-left: auto;
  align-self: center;

  @media (max-width: 480px) {
    margin-left: 0;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid #d5dede;
  border-radius: 8px;

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
  width: 100%;
  border-collapse: collapse;
  min-width: 480px;
`;

const Th = styled.th`
  text-align: ${(props) => (props.$align === "left" ? "left" : "right")};
  padding: 12px 14px;
  background: #f2f7f7;
  color: ${ACCENT_DARK};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  border-bottom: 1px solid #d5dede;
  white-space: nowrap;

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 11px;
  }
`;

const GroupTh = styled(Th)`
  text-align: center;
  background: #e4f3f3;
`;

const Td = styled.td`
  padding: 12px 14px;
  font-size: 14px;
  text-align: ${(props) => (props.$align === "left" ? "left" : "right")};
  border-bottom: 1px solid #eef2f2;
  white-space: nowrap;

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 13px;
  }
`;

const TotalsRow = styled.tr`
  background: #f7fbfb;
  font-weight: 700;

  ${Td} {
    border-top: 2px solid #d5dede;
    border-bottom: none;
  }
`;

const DiffBadge = styled.span`
  display: inline-block;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: ${(props) => {
    if (props.$value === null || props.$value === undefined) return "#9aa5a5";
    // diff = plan - actual: positive means behind target (shortfall),
    // zero or negative means target met or exceeded.
    return props.$value > 0 ? "#d64545" : "#2e9e5b";
  }};
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #7a8a8a;
`;

// ── Component ──────────────────────────────────────────────────────────

const SalesReport = () => {
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth());
  // Only used when view === "date" — the exact date the user picked.
  const [selectedDate, setSelectedDate] = useState(getCurrentDateISO());
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  // "date" (Date wise, pick any specific day), "wtd" (Week to Date), or
  // "mtd" (Month to Date) — controls which single set of columns is
  // displayed and which picker (date vs month) is shown. Defaults to
  // "date" so the report opens showing today's plan vs actual.
  const [view, setView] = useState("date");

  const [employees, setEmployees] = useState([]);
  const [results, setResults] = useState([]);
  const [weekToDateApplicable, setWeekToDateApplicable] = useState(true);

  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState("");

  // "Date wise" derives month/year/day from the date picker; Week/Month
  // to Date derive month/year from the month picker and have no day.
  const [year, month, day] = useMemo(() => {
    if (view === "date") {
      const [y, m, d] = selectedDate.split("-").map((v) => parseInt(v, 10));
      return [y, m, d];
    }
    const [y, m] = yearMonth.split("-").map((v) => parseInt(v, 10));
    return [y, m, null];
  }, [view, yearMonth, selectedDate]);

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

  // ── Load the Actual vs Plan report ──────────────────────────────────

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
        ...(day !== null ? { day } : {}),
      };
      const res = await apiRequest(`${Labbaseurl}salesplanreport/`, "POST", payload);
      const data = res?.data ?? res;
      setResults(Array.isArray(data?.results) ? data.results : []);
      setCategories(Array.isArray(data?.categories) ? data.categories : []);
      setWeekToDateApplicable(Boolean(data?.week_to_date_applicable));
    } catch (err) {
      console.error("Failed to load sales plan report:", err);
      setError(getErrorMessage(err, "Failed to load the report. Please try again."));
      setResults([]);
    } finally {
      setLoadingReport(false);
    }
  }, [employees, month, year, day, category]);

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

  // Week to Date only means something for the month currently in
  // progress (Date wise works for any date, so it needs no fallback).
  // If the selected month isn't the current one and the user still has
  // "Week to Date" selected, fall back to "Month to Date" rather than
  // showing an empty/null view.
  useEffect(() => {
    if (view === "wtd" && !weekToDateApplicable) {
      setView("mtd");
    }
  }, [weekToDateApplicable, view]);

  const KEY_MAP = {
    date: { plan: "plan_day", actual: "actual_day", diff: "diff_day", label: "Date wise" },
    wtd: { plan: "plan_wtd", actual: "actual_wtd", diff: "diff_wtd", label: "Week to Date" },
    mtd: { plan: "plan_mtd", actual: "actual_mtd", diff: "diff_mtd", label: "Month to Date" },
  };
  const { plan: planKey, actual: actualKey, diff: diffKey, label: viewLabel } = KEY_MAP[view];

  const totals = useMemo(() => {
    return results.reduce(
      (acc, row) => {
        acc.plan += row[planKey] || 0;
        acc.actual += row[actualKey] || 0;
        acc.diff += row[diffKey] || 0;
        return acc;
      },
      { plan: 0, actual: 0, diff: 0 }
    );
  }, [results, planKey, actualKey, diffKey]);

  const loading = loadingEmployees || loadingReport;

  return (
    <Container>
      <Header>
        <Title>Sales Plan Report — Actual vs Plan</Title>
      </Header>

      <FilterBar>
        <FilterField>
          <FilterLabel htmlFor="sales-report-view">Period</FilterLabel>
          <CategorySelect
            id="sales-report-view"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <option value="date">Date wise</option>
            <option value="wtd" disabled={!weekToDateApplicable}>
              Week to Date
            </option>
            <option value="mtd">Month to Date</option>
          </CategorySelect>
        </FilterField>

        {view === "date" ? (
          <FilterField>
            <FilterLabel htmlFor="sales-report-date">Date</FilterLabel>
            <MonthInput
              id="sales-report-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </FilterField>
        ) : (
          <FilterField>
            <FilterLabel htmlFor="sales-report-month">Month</FilterLabel>
            <MonthInput
              id="sales-report-month"
              type="month"
              value={yearMonth}
              onChange={(e) => setYearMonth(e.target.value)}
            />
          </FilterField>
        )}

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

        {!weekToDateApplicable && (
          <NoticeText>
            Week to Date only applies to the current month — showing Month to Date.
          </NoticeText>
        )}
      </FilterBar>

      {error && <EmptyState>{error}</EmptyState>}

      {!error && (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th $align="left" rowSpan={2}>
                  Sales Executive
                </Th>
                <GroupTh colSpan={3}>{viewLabel}</GroupTh>
              </tr>
              <tr>
                <Th>Plan</Th>
                <Th>Actual</Th>
                <Th>Difference</Th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) => {
                const plan = row[planKey];
                const actual = row[actualKey];
                const diff = row[diffKey];
                return (
                  <tr key={row.employee_id}>
                    <Td $align="left">{row.employee_name}</Td>
                    <Td>{formatAmount(plan)}</Td>
                    <Td>{formatAmount(actual)}</Td>
                    <Td>
                      {diff === null || diff === undefined ? (
                        "—"
                      ) : (
                        <DiffBadge $value={diff}>
                          {diff > 0 ? "-" : diff < 0 ? "+" : ""}
                          {formatAmount(Math.abs(diff))}
                        </DiffBadge>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
            {results.length > 0 && (
              <tfoot>
                <TotalsRow>
                  <Td $align="left">Total</Td>
                  <Td>{formatAmount(totals.plan)}</Td>
                  <Td>{formatAmount(totals.actual)}</Td>
                  <Td>
                    <DiffBadge $value={totals.diff}>
                      {totals.diff > 0 ? "-" : totals.diff < 0 ? "+" : ""}
                      {formatAmount(Math.abs(totals.diff))}
                    </DiffBadge>
                  </Td>
                </TotalsRow>
              </tfoot>
            )}
          </Table>
          {!loading && results.length === 0 && (
            <EmptyState>No sales executives to report on.</EmptyState>
          )}
          {loading && <EmptyState>Loading...</EmptyState>}
        </TableWrapper>
      )}
    </Container>
  );
};

export default SalesReport;