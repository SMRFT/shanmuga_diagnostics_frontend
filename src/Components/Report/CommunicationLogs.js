import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import apiRequest from "../Auth/apiRequest";
import {
  Search,
  Filter,
  RefreshCw,
  Mail,
  MessageCircle,
  BarChart3,
  CheckCircle2,
  XCircle,
  Smartphone,
} from "lucide-react";
import { toast } from "react-toastify";

// --- Styled Components ---

const PageWrapper = styled.div`
  background-color: #f4f7fe;
  height: 100vh;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    padding: 1rem;
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-shrink: 0;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  color: #1b2559;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-shrink: 0;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  border-left: 5px solid ${(props) => props.color || "#4318FF"};
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.06);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatTitle = styled.span`
  color: #a3aed0;
  font-size: 0.875rem;
  font-weight: 500;
`;

const IconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.bg || "#f4f7fe"};
  color: ${(props) => props.color || "#4318FF"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.h2`
  color: #1b2559;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

const MainCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const FilterBar = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
  background-color: white;
  flex-shrink: 0;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 180px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #2b3674;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid #e0e5f2;
  font-size: 0.9rem;
  color: #1b2559;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #4318FF;
    box-shadow: 0 0 0 2px rgba(67, 24, 255, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid #e0e5f2;
  font-size: 0.9rem;
  color: #1b2559;
  background-color: white;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #4318FF;
  }
`;

const RefreshBtn = styled.button`
  background-color: #f4f7fe;
  color: #4318FF;
  border: none;
  padding: 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #e0e5f2;
    transform: rotate(180deg);
  }
`;

const TableContainer = styled.div`
  overflow: auto;
  width: 100%;
  flex: 1;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
`;

const Thead = styled.thead`
  background-color: #f9fafc;
  
  th {
    text-align: left;
    padding: 1rem 1.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #a3aed0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e0e5f2;
  }
`;

const Tr = styled.tr`
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }
  
  td {
    padding: 1.25rem 1.5rem;
    color: #1b2559;
    font-size: 0.95rem;
    vertical-align: middle;
  }
`;

const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: ${(props) => (props.type === "Email" ? "#EBF5FF" : "#E6FFFA")};
  color: ${(props) => (props.type === "Email" ? "#3366FF" : "#00C48C")};
`;

const StatusChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${(props) => (props.success ? "#05cd99" : "#ee5d50")};
`;

const EmptyState = styled.div`
  padding: 4rem;
  text-align: center;
  color: #a3aed0;
`;

const CommunicationLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [typeFilter, setTypeFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const response = await apiRequest(
        `${Labbaseurl}communication_logs/`,
        "POST",
        {
          from_date: formattedStartDate,
          to_date: formattedEndDate
        }
      );

      if (response.success) {
        setLogs(response.data.data || []);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Failed to load communication logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [startDate, endDate]);

  const filteredLogs = logs.filter((log) => {
    const matchesType = typeFilter === "All" || log.type === typeFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      log.patientName?.toLowerCase().includes(searchLower) ||
      log.patientId?.toLowerCase().includes(searchLower) ||
      log.barcode?.toLowerCase().includes(searchLower) ||
      log.recipient?.toLowerCase().includes(searchLower);

    return matchesType && matchesSearch;
  });

  // Calculate Counts
  const totalCount = filteredLogs.length;
  const whatsappCount = filteredLogs.filter(l => l.type === "WhatsApp").length;
  const emailCount = filteredLogs.filter(l => l.type === "Email").length;

  return (
    <PageWrapper>
      <Container>
        <HeaderSection>
          <PageTitle>
            <BarChart3 size={28} color="#4318FF" />
            Communication Logs
          </PageTitle>
        </HeaderSection>

        {/* Stats Dashboard */}
        <StatsGrid>
          <StatCard color="#4318FF">
            <StatHeader>
              <StatTitle>Total Logs</StatTitle>
              <IconBox bg="rgba(67, 24, 255, 0.1)" color="#4318FF">
                <BarChart3 size={20} />
              </IconBox>
            </StatHeader>
            <StatValue>{totalCount}</StatValue>
          </StatCard>

          <StatCard color="#00C48C">
            <StatHeader>
              <StatTitle>WhatsApp Sent</StatTitle>
              <IconBox bg="rgba(0, 196, 140, 0.1)" color="#00C48C">
                <Smartphone size={20} />
              </IconBox>
            </StatHeader>
            <StatValue>{whatsappCount}</StatValue>
          </StatCard>

          <StatCard color="#3366FF">
            <StatHeader>
              <StatTitle>Emails Sent</StatTitle>
              <IconBox bg="rgba(51, 102, 255, 0.1)" color="#3366FF">
                <Mail size={20} />
              </IconBox>
            </StatHeader>
            <StatValue>{emailCount}</StatValue>
          </StatCard>
        </StatsGrid>

        <MainCard>
          <FilterBar>
            <FilterGroup>
              <Label>From Date</Label>
              <Input
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </FilterGroup>

            <FilterGroup>
              <Label>To Date</Label>
              <Input
                type="date"
                value={endDate.toISOString().split("T")[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </FilterGroup>

            <FilterGroup>
              <Label>Type</Label>
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="All">All types</option>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
              </Select>
            </FilterGroup>

            <FilterGroup style={{ flex: 2 }}>
              <Label>Search</Label>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a3aed0' }} />
                <Input
                  type="text"
                  placeholder="Search by Patient Name, ID, Barcode or Phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.5rem', width: '100%' }}
                />
              </div>
            </FilterGroup>

            <RefreshBtn onClick={fetchLogs} title="Refresh Data">
              <RefreshCw size={20} />
            </RefreshBtn>
          </FilterBar>

          <TableContainer>
            <StyledTable>
              <Thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Barcode</th>
                  <th>Type</th>
                  <th>Recipient</th>
                  <th>Status</th>
                  {/* <th>Details</th> */}
                </tr>
              </Thead>
              <tbody>
                {loading ? (
                  <Tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "3rem" }}>
                      Loading logs...
                    </td>
                  </Tr>
                ) : filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <Tr key={log.id}>
                      <td>{format(new Date(log.date), "dd MMM yyyy, hh:mm a")}</td>
                      <td style={{ fontWeight: 600 }}>{log.patientId}</td>
                      <td>{log.patientName}</td>
                      <td style={{ fontWeight: 600, color: "#4318FF" }}>{log.barcode || "-"}</td>
                      <td>
                        <TypeBadge type={log.type}>
                          {log.type === "Email" ? <Mail size={14} /> : <MessageCircle size={14} />}
                          {log.type}
                        </TypeBadge>
                      </td>
                      <td>{log.recipient}</td>
                      <td>
                        <StatusChip success={log.status === "Success"}>
                          {log.status === "Success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                          {log.status}
                        </StatusChip>
                      </td>
                      {/* <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#707eae' }}>
                        {log.details}
                      </td> */}
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <td colSpan={7}>
                      <EmptyState>
                        <Filter size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No logs found for the selected criteria.</p>
                      </EmptyState>
                    </td>
                  </Tr>
                )}
              </tbody>
            </StyledTable>
          </TableContainer>
        </MainCard>
      </Container>
    </PageWrapper>
  );
};

export default CommunicationLogs;
