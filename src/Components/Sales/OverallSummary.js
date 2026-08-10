import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import apiRequest from "../Auth/apiRequest";

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

// ── Styled ────────────────────────────────────────────────────────────────────

const Page = styled.div`
  padding: 20px 24px;
  font-family: "Segoe UI", sans-serif;
  color: #2d2d2d;
  @media (max-width: 600px) { padding: 12px; }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #256565;
  margin: 0 0 4px;
  font-size: 20px;
`;

const SubTitle = styled.div`
  font-size: 12px;
  color: #8fa8a8;
`;

const Filters = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterLabel = styled.label`
  font-size: 12px;
  color: #6b7b7b;
  font-weight: 600;
`;

const Select = styled.select`
  padding: 7px 11px;
  border: 1px solid #cfe3e3;
  border-radius: 8px;
  font-size: 13px;
  color: #256565;
  background: #fff;
  font-weight: 600;
  cursor: pointer;
  &:focus { outline: none; border-color: #219c9c; }
`;

// ── Table ─────────────────────────────────────────────────────────────────────

const TableScroll = styled.div`
  overflow-x: auto;
  border: 1px solid #d5e8e8;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(33,156,156,0.08);
  margin-bottom: 28px;
`;

const Table = styled.table`
  border-collapse: collapse;
  min-width: 100%;
  font-size: 13px;
`;

// Category header spanning entire row
const CatHeaderRow = styled.tr`
  background: linear-gradient(90deg, #219c9c 0%, #256565 100%);
`;

const CatHeaderTd = styled.td`
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  padding: 9px 14px;
  letter-spacing: 0.4px;
`;

const CatHeaderMeta = styled.span`
  font-size: 11px;
  font-weight: 400;
  opacity: 0.85;
  margin-left: 12px;
`;

const Th = styled.th`
  padding: 8px 12px;
  text-align: ${({ $left }) => ($left ? "left" : "right")};
  background: #e8f5f5;
  color: #256565;
  font-size: 11.5px;
  font-weight: 700;
  border-bottom: 2px solid #c5e0e0;
  border-right: 1px solid #d5e8e8;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.2px;
`;

const Td = styled.td`
  padding: 8px 12px;
  text-align: ${({ $left }) => ($left ? "left" : "right")};
  border-bottom: 1px solid #eef5f5;
  border-right: 1px solid #f0f8f8;
  font-size: 13px;
  white-space: nowrap;
`;

const PersonRow = styled.tr`
  background: ${({ $alt }) => ($alt ? "#fafefe" : "#fff")};
  &:hover { background: #f0fbfb; }
`;

// Subtotal row for each category
const SubtotalRow = styled.tr`
  background: #e4f3f3;
  font-weight: 700;
`;

// Grand total row
const GrandRow = styled.tr`
  background: linear-gradient(90deg, #fff3e0, #ffe8c0);
  font-weight: 700;
`;

const DiffTd = styled(Td)`
  color: ${({ $v }) => ($v > 0 ? "#c94b4b" : $v < 0 ? "#1a9c6b" : "#6b7b7b")};
  font-weight: 600;
`;

const PctTd = styled(Td)`
  font-weight: 700;
  color: ${({ $v }) => ($v >= 100 ? "#1a9c6b" : $v >= 70 ? "#d97706" : "#c94b4b")};
`;

const EmptyState = styled.div`
  padding: 50px;
  text-align: center;
  color: #8fa8a8;
  font-size: 14px;
`;

const LoadingState = styled(EmptyState)`
  color: #219c9c;
  font-weight: 600;
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const fmt = (v) =>
  !v && v !== 0
    ? "-"
    : new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(v);

const fmtNum = (v) =>
  v == null ? "-" : new Intl.NumberFormat("en-IN").format(v);

// ── Component ─────────────────────────────────────────────────────────────────

const OverallSummary = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (m, y) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest(
        `${Labbaseurl}overall_summary/?month=${m}&year=${y}`,
        "GET"
      );
      if (res?.success && res?.data?.categories) {
        setData(res.data);
      } else {
        setError(res?.error || "Unexpected response.");
        setData(null);
      }
    } catch (err) {
      setError("Failed to load summary.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(month, year); }, [month, year, fetchData]);

  const categories = data?.categories || [];
  const grand = data?.grand_total;

  const colHeaders = ["Sales Person", "Volume", "Plan (₹)", "Actual (₹)", "Difference (₹)", "% Achieve"];

  return (
    <Page>
      <PageHeader>
        <div>
          <Title>Overall Sales Summary</Title>
          <SubTitle>Per-category breakdown — Volume, Plan, Actual & Difference</SubTitle>
        </div>
        <Filters>
          <FilterLabel htmlFor="os-month">Month</FilterLabel>
          <Select
            id="os-month"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {monthNames.map((n, i) => (
              <option key={i} value={i + 1}>{n}</option>
            ))}
          </Select>

          <FilterLabel htmlFor="os-year">Year</FilterLabel>
          <Select
            id="os-year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Select>
        </Filters>
      </PageHeader>

      {loading && <LoadingState>Loading…</LoadingState>}
      {!loading && error && <EmptyState>{error}</EmptyState>}
      {!loading && !error && categories.length === 0 && (
        <EmptyState>No plan data found for {monthNames[month - 1]} {year}.</EmptyState>
      )}

      {!loading && !error && categories.length > 0 && (
        <TableScroll>
          <Table>
            {/* Column headers — shown once at top */}
            <thead>
              <tr>
                {colHeaders.map((h, i) => (
                  <Th key={i} $left={i === 0}>{h}</Th>
                ))}
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => {
                const sub = cat.subtotal;
                return (
                  <React.Fragment key={cat.category}>
                    {/* ── Category Banner ─────────────────────────── */}
                    <CatHeaderRow>
                      <CatHeaderTd colSpan={6}>
                        {cat.category}
                        <CatHeaderMeta>
                          {cat.persons.length} sales person{cat.persons.length !== 1 ? "s" : ""}
                        </CatHeaderMeta>
                      </CatHeaderTd>
                    </CatHeaderRow>

                    {/* ── Sales persons ────────────────────────────── */}
                    {cat.persons.length === 0 ? (
                      <tr>
                        <Td $left colSpan={6} style={{ color: "#aaa", fontStyle: "italic" }}>
                          No data for this category
                        </Td>
                      </tr>
                    ) : (
                      cat.persons.map((p, idx) => (
                        <PersonRow key={p.employee_id} $alt={idx % 2 === 1}>
                          <Td $left style={{ paddingLeft: 24 }}>{p.employee_name}</Td>
                          <Td>{fmtNum(p.volume)}</Td>
                          <Td>{fmt(p.plan)}</Td>
                          <Td>{fmt(p.actual)}</Td>
                          <DiffTd $v={p.diff}>{fmt(p.diff)}</DiffTd>
                          <PctTd $v={p.pct}>{p.plan > 0 ? `${p.pct}%` : "-"}</PctTd>
                        </PersonRow>
                      ))
                    )}

                    {/* ── Category Subtotal ────────────────────────── */}
                    <SubtotalRow>
                      <Td $left style={{ paddingLeft: 24, color: "#256565" }}>
                        {cat.category} — Total
                      </Td>
                      <Td>{fmtNum(sub.volume)}</Td>
                      <Td>{fmt(sub.plan)}</Td>
                      <Td>{fmt(sub.actual)}</Td>
                      <DiffTd $v={sub.diff}>{fmt(sub.diff)}</DiffTd>
                      <PctTd $v={sub.pct}>{sub.plan > 0 ? `${sub.pct}%` : "-"}</PctTd>
                    </SubtotalRow>
                  </React.Fragment>
                );
              })}

              {/* ── Grand Total ───────────────────────────────────── */}
              {grand && (
                <GrandRow>
                  <Td $left style={{ fontSize: 13.5, letterSpacing: 0.3 }}>
                    Grand Total
                  </Td>
                  <Td>{fmtNum(grand.volume)}</Td>
                  <Td>{fmt(grand.plan)}</Td>
                  <Td>{fmt(grand.actual)}</Td>
                  <DiffTd $v={grand.diff}>{fmt(grand.diff)}</DiffTd>
                  <PctTd $v={grand.pct}>{grand.plan > 0 ? `${grand.pct}%` : "-"}</PctTd>
                </GrandRow>
              )}
            </tbody>
          </Table>
        </TableScroll>
      )}
    </Page>
  );
};

export default OverallSummary;
