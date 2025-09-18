import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Wrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(120deg, #f1f5ff 0%, #fdf6ff 100%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 10px 40px;
`;

const MainCard = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 40px auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 28px rgba(43,72,104,0.08);
  padding: 2.5rem;
  min-height: 500px;
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    padding: 1.5rem 1rem;
    min-height: unset;
  }
`;

const Title = styled.h2`
  color: #35308d;
  font-weight: 700;
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: -1px;

  @media (max-width: 600px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  justify-content: space-between;
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1.5px solid #d0d7de;
  width: 200px;

  @media (max-width: 400px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1.5px solid #d0d7de;
  flex-grow: 1;

  @media (max-width: 400px) {
    width: 100%;
  }
`;

const ExportButton = styled.button`
  background: linear-gradient(90deg, #667eea 0%, #7646b8 100%);
  color: #fff;
  border: none;
  border-radius: 7px;
  font-weight: 700;
  font-size: 1rem;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(90deg, #7646b8 0%, #667eea 100%);
    opacity: 0.95;
  }
`;

const ScrollTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 520px;
  border-radius: 12px;
  border-collapse: collapse;
  background: #fbfbfe;
  box-shadow: 0 2px 8px rgba(99,102,241,0.06);
  font-size: 1rem;
`;

const TableHead = styled.thead`
  background: linear-gradient(90deg, #667eea 0%, #7646b8 100%);
  color: #fff;
`;

const Th = styled.th`
  padding: 12px 16px;
  font-weight: 700;
  text-align: left;
  min-width: 140px;

  @media (max-width: 600px) {
    font-size: 0.9rem;
    padding: 8px 12px;
  }
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background: #f4f5fa;
  }
`;

const Td = styled.td`
  padding: 12px 16px;
  
  @media (max-width: 600px) {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
`;

const Info = styled.p`
  padding: 2rem;
  color: #899;
  text-align: center;
  font-size: 1.1rem;
`;

export default function TestSummary() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch filtered data from API
  useEffect(() => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;

    axios.get("http://127.0.0.1:1071/_b_a_c_k_e_n_d/LIS/test-summary/", { params })
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [search, fromDate, toDate]);

  const totalCount = data.reduce((sum, row) => sum + Number(row.count || 0), 0);
  const totalAmount = data.reduce((sum, row) => sum + Number(row.total_amount || 0), 0);

const exportCSV = () => {
  if (!data.length) return;
  const csvRows = [
    ["Test Name", "Count", "Total Amount"].join(","),
    ...data.map(row =>
      [
        `"${(row?.test_name ?? "").replace(/"/g, '""')}"`,
        row.count,
        row.total_amount
      ].join(",")
    ),
    ["Total", totalCount, totalAmount].join(","),
  ];
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "test_summary.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


  return (
    <Wrapper>
      <MainCard>
        <Title>Test Summary</Title>

        <Controls>
          <SearchInput
            type="text"
            placeholder="Search test name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search test name"
          />
          <FilterInput
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            aria-label="From date"
            max={toDate || undefined}
          />
          <FilterInput
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            aria-label="To date"
            min={fromDate || undefined}
          />
          <ExportButton onClick={exportCSV}>⬇️ Export CSV</ExportButton>
        </Controls>

        <ScrollTableWrapper>
          <Table>
            <TableHead>
              <tr>
                <Th>Test Name</Th>
                <Th>Count</Th>
                <Th>Total Amount</Th>
              </tr>
            </TableHead>
            <tbody>
              {data.length === 0 ? (
                <Tr>
                  <Td colSpan={3} style={{ textAlign: "center", padding: "40px" }}>
                    No data found.
                  </Td>
                </Tr>
              ) : (
                data.map((t, i) => (
                  <Tr key={i}>
                    <Td>{t.test_name}</Td>
                    <Td>{t.count}</Td>
                    <Td>₹{Number(t.total_amount || 0).toLocaleString()}</Td>
                  </Tr>
                ))
              )}
            </tbody>
            {data.length > 0 && (
              <tfoot>
                <Tr>
                  <Td style={{ fontWeight: "bold" }}>Total</Td>
                  <Td style={{ fontWeight: "bold" }}>{totalCount}</Td>
                  <Td style={{ fontWeight: "bold" }}>
                    ₹{totalAmount.toLocaleString()}
                  </Td>
                </Tr>
              </tfoot>
            )}
          </Table>
        </ScrollTableWrapper>
      </MainCard>
    </Wrapper>
  );
}
