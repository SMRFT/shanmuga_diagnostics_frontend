import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import apiRequest from "../Auth/apiRequest";

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

const Page = styled.div`
  padding: 20px 24px;
  font-family: "Segoe UI", sans-serif;
  color: #2d2d2d;
  @media (max-width: 600px) { padding: 12px; }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
`;

const Title = styled.h2`
  color: #256565;
  margin: 0;
  font-size: 20px;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const DateLabel = styled.label`
  font-size: 12px;
  color: #6b7b7b;
  font-weight: 600;
`;

const DateInput = styled.input`
  padding: 7px 11px;
  border: 1px solid #cfe3e3;
  border-radius: 8px;
  color: #256565;
  font-weight: 600;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  &:focus { outline: none; border-color: #219c9c; }
`;

const SubLabel = styled.div`
  font-size: 11px;
  color: #8fa8a8;
  margin-top: 2px;
`;

const TableScroll = styled.div`
  overflow-x: auto;
  border: 1px solid #d5e8e8;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(33,156,156,0.08);
`;

const Table = styled.table`
  border-collapse: collapse;
  min-width: 100%;
  font-size: 12.5px;
`;

const GroupTh = styled.th`
  text-align: center;
  padding: 8px 6px;
  background: #c8eaea;
  color: #1a5c5c;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #b0d8d8;
  white-space: nowrap;
`;

const Th = styled.th`
  text-align: center;
  padding: 7px 6px;
  background: #e8f5f5;
  color: #256565;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #cce4e4;
  white-space: nowrap;
  text-transform: uppercase;
`;

const StickyTh = styled(Th)`
  position: sticky;
  left: 0;
  z-index: 3;
  text-align: left;
  min-width: 160px;
  background: #daf0f0;
`;

const StickyGroupTh = styled(GroupTh)`
  position: sticky;
  left: 0;
  z-index: 3;
  text-align: left;
  min-width: 160px;
  background: #c8eaea;
`;

const Td = styled.td`
  padding: 7px 8px;
  text-align: right;
  border: 1px solid #e0efef;
  white-space: nowrap;
  font-size: 12.5px;
`;

const StickyTd = styled(Td)`
  position: sticky;
  left: 0;
  z-index: 1;
  text-align: left;
  font-weight: 600;
  background: #f7fcfc;
  color: #1a5c5c;
`;

const PctTd = styled(Td)`
  color: ${({ $ok }) => ($ok === null ? "#999" : $ok === "high" ? "#1a9c6b" : $ok === "mid" ? "#d97706" : "#c94b4b")};
  font-weight: 700;
`;

const TrendTd = styled(Td)`
  color: #219c9c;
  font-weight: 600;
`;

const ProjTd = styled(Td)`
  color: ${({ $ok }) => ($ok === "high" ? "#1a9c6b" : $ok === "mid" ? "#d97706" : "#c94b4b")};
  font-weight: 700;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px;
  color: #8fa8a8;
  font-size: 14px;
`;

const LoadingState = styled(EmptyState)`
  color: #219c9c;
  font-weight: 600;
`;

const toDateInput = (d) => {
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().split("T")[0];
};

const fmt = (v) =>
  !v || v === 0
    ? "-"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(v);

const fmtPct = (v) => (v === 0 ? "-" : `${v}%`);

const pctOk = (v) =>
  v === null ? null : v >= 100 ? "high" : v >= 70 ? "mid" : "low";

const SalesSummary = () => {
  const [selectedDate, setSelectedDate] = useState(toDateInput(new Date()));
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (dateStr) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest(
        `${Labbaseurl}salesplan_summary/?date=${dateStr}`,
        "GET"
      );
      // apiRequest wraps response as { success, data, status }
      const payload = res?.data;
      if (res?.success && payload?.rows) {
        setResp(payload);
      } else {
        setError(res?.error || "Unexpected response from server.");
        setResp(null);
      }
    } catch (err) {
      setError("Failed to load sales summary.");
      setResp(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate, fetchData]);

  const rows = resp?.rows || [];
  const todayLabel = resp?.today_label || "-";
  const wtdLabel = resp?.wtd_label || "WTD";
  const mtdLabel = resp?.mtd_label || "MTD";
  const reportUpto = resp?.report_upto || "";

  return (
    <Page>
      <Header>
        <div>
          <Title>Sales Summary</Title>
          {reportUpto && (
            <SubLabel>
              Data up to: <strong>{reportUpto}</strong>
            </SubLabel>
          )}
        </div>
        <FilterRow>
          <DateLabel htmlFor="sum-date">As of date</DateLabel>
          <DateInput
            id="sum-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </FilterRow>
      </Header>

      {loading && <LoadingState>Loading…</LoadingState>}
      {!loading && error && <EmptyState>{error}</EmptyState>}
      {!loading && !error && rows.length === 0 && (
        <EmptyState>No sales data found for this period.</EmptyState>
      )}

      {!loading && !error && rows.length > 0 && (
        <TableScroll>
          <Table>
            <thead>
              <tr>
                <StickyGroupTh rowSpan={2}>Segment Name</StickyGroupTh>
                <GroupTh colSpan={3}>{todayLabel}</GroupTh>
                <GroupTh colSpan={3}>WTD ({wtdLabel})</GroupTh>
                <GroupTh colSpan={3}>MTD ({mtdLabel})</GroupTh>
                <GroupTh rowSpan={2}>Trending</GroupTh>
                <GroupTh rowSpan={2}>Projection %</GroupTh>
              </tr>
              <tr>
                {[
                  "Plan","Actual","% Achieve",
                  "Plan","Actual","% Achieve",
                  "Plan","Actual","% Achieve",
                ].map((lbl, i) => (
                  <Th key={i}>{lbl}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const isTotal = row.category === "Total";
                const bg = isTotal ? "#fff3e0" : undefined;
                const bdColor = isTotal ? "#f0c890" : undefined;
                return (
                  <tr key={idx} style={{ background: bg }}>
                    <StickyTd style={{ background: bg || "#f7fcfc", borderColor: bdColor }}>
                      {row.category}
                    </StickyTd>

                    {/* Today */}
                    <Td style={{ borderColor: bdColor }}>{fmt(row.today_plan)}</Td>
                    <Td style={{ borderColor: bdColor }}>{fmt(row.today_actual)}</Td>
                    <PctTd $ok={row.today_plan > 0 ? pctOk(row.today_pct) : null} style={{ borderColor: bdColor }}>
                      {row.today_plan > 0 ? fmtPct(row.today_pct) : "-"}
                    </PctTd>

                    {/* WTD */}
                    <Td style={{ borderColor: bdColor }}>{fmt(row.wtd_plan)}</Td>
                    <Td style={{ borderColor: bdColor }}>{fmt(row.wtd_actual)}</Td>
                    <PctTd $ok={row.wtd_plan > 0 ? pctOk(row.wtd_pct) : null} style={{ borderColor: bdColor }}>
                      {row.wtd_plan > 0 ? fmtPct(row.wtd_pct) : "-"}
                    </PctTd>

                    {/* MTD */}
                    <Td style={{ borderColor: bdColor }}>{fmt(row.mtd_plan)}</Td>
                    <Td style={{ borderColor: bdColor }}>{fmt(row.mtd_actual)}</Td>
                    <PctTd $ok={row.mtd_plan > 0 ? pctOk(row.mtd_pct) : null} style={{ borderColor: bdColor }}>
                      {row.mtd_plan > 0 ? fmtPct(row.mtd_pct) : "-"}
                    </PctTd>

                    {/* Trending */}
                    <TrendTd style={{ borderColor: bdColor }}>{fmt(row.trending)}</TrendTd>

                    {/* Projection */}
                    <ProjTd $ok={pctOk(row.projection)} style={{ borderColor: bdColor }}>
                      {row.projection > 0 ? fmtPct(row.projection) : "-"}
                    </ProjTd>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableScroll>
      )}
    </Page>
  );
};

export default SalesSummary;
