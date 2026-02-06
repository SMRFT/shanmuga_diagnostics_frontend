import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import apiRequest from "../Auth/apiRequest";
import {
  faDownload,
  faFilter,
  faCalendarDay,
  faCalendarWeek,
  faCalendarAlt,
  faUser,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  background-color: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Select = styled.select`
  appearance: none;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #4a5568;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234A5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }
`;

const DateInput = styled.input`
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #4a5568;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: ${(props) => (props.primary ? "#4299e1" : "white")};
  color: ${(props) => (props.primary ? "white" : "#4a5568")};
  border: 1px solid ${(props) => (props.primary ? "#4299e1" : "#e2e8f0")};
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.primary ? "#3182ce" : "#f7fafc")};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const TableHead = styled.thead`
  background-color: #f7fafc;

  th {
    padding: 1rem;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 600;
    color: #4a5568;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
  }

  th:nth-child(1) {
    min-width: 100px;
    width: 120px;
  }

  th:nth-child(2) {
    min-width: 120px;
    width: 140px;
  }
`;

const TableBody = styled.tbody`
  tr {
    &:hover {
      background-color: #f7fafc;
    }

    &:not(:last-child) td {
      border-bottom: 1px solid #e2e8f0;
    }
  }

  td {
    padding: 1rem;
    font-size: 0.875rem;
    color: #4a5568;
  }

  td:nth-child(1) {
    min-width: 100px;
    width: 120px;
  }

  td:nth-child(2) {
    min-width: 120px;
    width: 140px;
  }
`;

const EmptyRow = styled.tr`
  td {
    text-align: center;
    padding: 2rem;
    color: #a0aec0;
  }
`;

const SummarySection = styled.div`
  margin-top: 2rem;
  background-color: #f7fafc;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  text-align: center;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const SummaryCard = styled.div`
  background-color: white;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const SummaryLabel = styled.p`
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 0.5rem;
`;

const SummaryValue = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
`;

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Helper function to format date as dd-mm-yy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
};

// Main Component
const SalesVisitLogReport = () => {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [logs, setLogs] = useState([]);
  const [salesMapping, setSalesMapping] = useState([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [salespersonVisits, setSalespersonVisits] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState({
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    salesPerson: "",
  });

  useEffect(() => {
    fetchSalesMapping();
  }, []);

  useEffect(() => {
    if (filter.fromDate && filter.toDate) {
      fetchLogs();
    }
  }, [filter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const url = `${Labbaseurl}salesexecutive_report/`;

      const params = {
        fromDate: filter.fromDate,
        toDate: filter.toDate,
      };

      if (filter.salesPerson) {
        params.salesExecutive = filter.salesPerson;
      }

      const response = await apiRequest(url, "POST", params);

      if (response.success && Array.isArray(response.data)) {
        setLogs(response.data);
        updateVisitCounts(response.data);
      } else {
        console.error("Invalid response format or API error:", response);
        setLogs([]);
        updateVisitCounts([]);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };



  const fetchSalesMapping = async () => {
    try {
      const url = `${Labbaseurl}get_sales_executives/`;
      const response = await apiRequest(url, "GET"); // ✅ use apiRequest

      if (response.success && Array.isArray(response.data)) {
        const salesMappingArray = [
          { id: 0, name: "All" },
          ...response.data.map((person, index) => ({
            id: index + 1,
            name: person.employeeName,
            employeeId: person.employeeId,
          })),
        ];

        setSalesMapping(salesMappingArray);
      } else {
        console.error("Failed to fetch sales executives:", response);
      }
    } catch (error) {
      console.error("Error fetching salesMapping:", error);
    }
  };



  const updateVisitCounts = (data) => {
    if (!Array.isArray(data)) {
      setSalespersonVisits([]);
      setTotalVisits(0);
      return;
    }

    const visitCounts = {};
    let total = 0;

    data.forEach((log) => {
      const name = log.salesPersonName || "Unknown";
      const visits = parseInt(log.noOfVisits, 10) || 0;
      visitCounts[name] = (visitCounts[name] || 0) + visits;
      total += visits;
    });

    const visitData = Object.entries(visitCounts).map(([name, count]) => ({
      name,
      count,
    }));
    setSalespersonVisits(visitData);
    setTotalVisits(total);
  };

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const downloadCSV = () => {
    const escapeCSV = (value) => {
      if (value == null) return ""; // handles undefined/null
      const str = value.toString().replace(/"/g, '""'); // escape quotes
      return `"${str}"`; // wrap in quotes
    };

    const csvRows = [
      [
        "Date",
        "Time",
        "Salesperson",
        "Clinical Name",
        "Type",
        "Person Who Met",
        "Designation",
        "Location",
        "Visits",
        "Comments",
        "Image Link",
      ],
      ...logs.map((log) => [
        escapeCSV(formatDate(log.date)),
        escapeCSV(log.time || "N/A"),
        escapeCSV(log.salesMapping || "N/A"),
        escapeCSV(log.clinicalname || "N/A"),
        escapeCSV(log.type || "N/A"),
        escapeCSV(log.personMet || "N/A"),
        escapeCSV(log.designation || "N/A"),
        escapeCSV(log.location || "N/A"),
        escapeCSV(log.noOfVisits || 0),
        escapeCSV(log.comments || "No comments"),
        escapeCSV(log.visit_image_id ? `${Labbaseurl}serve_sales_image/${log.visit_image_id}/` : "N/A"),
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sales_visit_log.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageContainer>
      <Header>
        <Title>Sales Visit Analytics</Title>
      </Header>

      <FilterContainer>
        <FilterGroup>
          <FilterLabel>
            <FontAwesomeIcon icon={faCalendarAlt} />
            From Date:
          </FilterLabel>
          <DateInput
            type="date"
            value={filter.fromDate}
            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>
            <FontAwesomeIcon icon={faCalendarAlt} />
            To Date:
          </FilterLabel>
          <DateInput
            type="date"
            value={filter.toDate}
            onChange={(e) => handleFilterChange("toDate", e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>
            <FontAwesomeIcon icon={faUser} />
            SalesExecutive:
          </FilterLabel>
          <Select
            value={filter.salesPerson}
            onChange={(e) => handleFilterChange("salesPerson", e.target.value)}
          >
            {salesMapping.map((person) => (
              <option key={person.id} value={person.name === "All" ? "" : person.name}>
                {person.name}
              </option>
            ))}
          </Select>

        </FilterGroup>

        <Button primary onClick={downloadCSV}>
          <FontAwesomeIcon icon={faDownload} />
          Export
        </Button>
      </FilterContainer>

      <Table>
        <TableHead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Salesperson</th>
            <th>Clinical Name</th>
            <th>Type</th>
            <th>Person Who Met</th>
            <th>Designation</th>
            <th>Location</th>
            <th>Visits</th>
            <th>Comments</th>
            <th>Image</th>
          </tr>
        </TableHead>
        <TableBody>
          {loading ? (
            <EmptyRow>
              <td colSpan={11}>Loading data...</td>
            </EmptyRow>
          ) : logs.length > 0 ? (
            logs.map((log, index) => (
              <tr key={index}>
                <td>{formatDate(log.date)}</td>
                <td>{log.time || "N/A"}</td>
                <td>{log.salesMapping || "N/A"}</td>
                <td>{log.clinicalname || "N/A"}</td>
                <td>{log.type || "N/A"}</td>
                <td>{log.personMet || "N/A"}</td>
                <td>{log.designation || "N/A"}</td>
                <td>{log.location || "N/A"}</td>
                <td>{log.noOfVisits || 0}</td>
                <td>{log.comments || "No comments"}</td>
                <td>
                  {log.visit_image_id ? (
                    <a
                      href={`${Labbaseurl}serve_sales_image/${log.visit_image_id}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#4299e1", display: "flex", justifyContent: "center" }}
                      title="View Image"
                    >
                      <FontAwesomeIcon icon={faImage} />
                    </a>
                  ) : (
                    <span style={{ color: "#a0aec0", display: "block", textAlign: "center" }}>-</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <EmptyRow>
              <td colSpan={11}>No data available for the selected filters.</td>
            </EmptyRow>
          )}
        </TableBody>
      </Table>

      <SummarySection>
        <SummaryTitle>Performance Summary</SummaryTitle>
        <SummaryGrid>
          <SummaryCard
            style={{
              gridColumn: "1 / -1",
              maxWidth: "300px",
              margin: "0 auto",
            }}
          >
            <SummaryLabel>Total Visits</SummaryLabel>
            <SummaryValue>{totalVisits}</SummaryValue>
          </SummaryCard>
        </SummaryGrid>
      </SummarySection>
    </PageContainer>
  );
};

export default SalesVisitLogReport;
