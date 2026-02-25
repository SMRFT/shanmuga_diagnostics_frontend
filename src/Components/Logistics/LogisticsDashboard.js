'use client';

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import apiRequest from '../Auth/apiRequest';

// ============ Animations ============
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ============ Styled Components ============
const PageContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #f0f4ff 0%, #f3e5f5 100%);
  min-height: 100vh;
  font-family: 'Outfit', 'Inter', sans-serif;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const MainContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(14, 165, 233, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.6);
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  margin-bottom: 2rem;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 8s ease infinite;
  padding: 2.5rem 2rem;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const IconWrapper = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  
  svg {
    stroke-width: 2.5px;
  }
`;

const Title = styled.h1`
  font-size: 1.9rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
  margin-left: 72px;
`;

const FilterSection = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc, #f0f9ff);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Select = styled.select`
  padding: 12px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #334155;
  background: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
  }

  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  padding: 12px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #334155;
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #667eea, #764ba2); 
  color: white;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
  align-self: flex-end;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 1.5rem;
    gap: 1rem;
  }
`;

const StatCard = styled.div`
  background: ${props => props.gradient || 'linear-gradient(135deg, #f8fafc, #f1f5f9)'};
  border: 1.5px solid ${props => props.borderColor || '#e2e8f0'};
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${props => props.color || '#64748b'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.color || '#1e293b'};
  line-height: 1;
`;

const TabContainer = styled.div`
  padding: 2rem;
  border-top: 1px solid #e2e8f0;
`;

const TabList = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  border-bottom: 2px solid #e2e8f0;
`;

const Tab = styled.button`
  padding: 12px 24px;
  border: none;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea, #764ba2' : 'transparent'};
  color: ${props => props.active ? 'white' : '#64748b'};
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 12px 12px 0 0;
  transition: all 0.3s;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea, #764ba2' : 'transparent'};
  }

  &:hover:not(:disabled) {
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea, #764ba2' : '#f8fafc'};
  }
`;

const TabBadge = styled.span`
  margin-left: 0.5rem;
  padding: 2px 8px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(14, 165, 233, 0.1)'};
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const TableHead = styled.thead`
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem 1.25rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

const TableCell = styled.td`
  padding: 1rem 1.25rem;
  font-size: 0.9rem;
  color: #334155;
  font-weight: 500;
  vertical-align: middle;
`;

const StatusBadge = styled.div`
  padding: 6px 12px;
  background: ${props => {
    switch (props.status) {
      case 'Assigned': return 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(59, 130, 246, 0.1))';
      case 'Accepted': return 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))';
      case 'PickedUp': return 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))';
      case 'Billed': return 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))';
      default: return 'linear-gradient(135deg, rgba(148, 163, 184, 0.1), rgba(100, 116, 139, 0.1))';
    }
  }};
  border: 1.5px solid ${props => {
    switch (props.status) {
      case 'Assigned': return 'rgba(14, 165, 233, 0.3)';
      case 'Accepted': return 'rgba(251, 191, 36, 0.3)';
      case 'PickedUp': return 'rgba(34, 197, 94, 0.3)';
      case 'Billed': return 'rgba(139, 92, 246, 0.3)';
      default: return 'rgba(148, 163, 184, 0.3)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Assigned': return '#0369a1';
      case 'Accepted': return '#b45309';
      case 'PickedUp': return '#15803d';
      case 'Billed': return '#6d28d9';
      default: return '#475569';
    }
  }};
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
  white-space: nowrap;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 0.7s linear infinite;
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
`;

const LoadingSpinnerLarge = styled(LoadingSpinner)`
  width: 40px;
  height: 40px;
  border-width: 4px;
  border-color: #e2e8f0;
  border-top-color: #667eea;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
`;

const MessageContainer = styled.div`
  margin: 1.5rem 2rem;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${slideDown} 0.3s ease-out;
  border: 1.5px solid;

  @media (max-width: 768px) {
    margin: 1.5rem;
  }
`;

const ErrorMessage = styled(MessageContainer)`
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
  color: #b91c1c;
  border-color: rgba(239, 68, 68, 0.3);
`;

// ============ Icons ============
const DashboardIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const InboxIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// ============ Main Component ============
const LogisticsDashboard = () => {
  const [collectors, setCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('assigned');

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    fetchCollectors();
    // Set default dates (last 30 days)
      const today = new Date().toISOString().split('T')[0];
      setStartDate(today);
      setEndDate(today);

  }, []);

const fetchCollectors = async () => {
  try {
    const response = await apiRequest(
      `${Labbaseurl}sample-collector/`,
      'GET'
    );

    console.log('Raw collectors response:', response);

    let collectorsList = [];

    const collectorsData =
      response?.data?.collectors ?? response?.data ?? [];

    if (Array.isArray(collectorsData)) {
      collectorsList = collectorsData;
    } 
    else if (typeof collectorsData === 'object') {
      collectorsList = Object.values(collectorsData);
    } 
    else if (typeof collectorsData === 'string') {
      collectorsList = [collectorsData];
    }

    // Clean + dedupe
    collectorsList = [...new Set(
      collectorsList
        .map(c => c?.trim())
        .filter(Boolean)
    )];

    console.log('Final collectors list:', collectorsList);
    setCollectors(collectorsList);

  } catch (err) {
    console.error('Error fetching collectors:', err);
    setError('Failed to load sample collectors');
  }
};


  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (selectedCollector) params.append('sample_collector', selectedCollector);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const response = await apiRequest(
        `${Labbaseurl}logistics-dashboard/?${params.toString()}`,
        'GET'
      );
      
      setDashboardData(response?.data || null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchDashboardData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderTaskTable = (tasks, type) => {
    if (!tasks || tasks.length === 0) {
      return (
        <EmptyState>
          <EmptyIcon><InboxIcon /></EmptyIcon>
          <EmptyText>No {type} tasks found</EmptyText>
        </EmptyState>
      );
    }

    if (type === 'billed') {
      return (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>S.No</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Bill No</TableHeaderCell>
                <TableHeaderCell>Patient ID</TableHeaderCell>
                <TableHeaderCell>Lab ID</TableHeaderCell>
                <TableHeaderCell>Segment</TableHeaderCell>
                <TableHeaderCell>B2B</TableHeaderCell>
                <TableHeaderCell>Total Amount</TableHeaderCell>
                <TableHeaderCell>Net Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <tbody>
              {tasks.map((task, index) => (
                <TableRow key={task._id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{formatDate(task.date)}</TableCell>
                  <TableCell>{task.bill_no || 'N/A'}</TableCell>
                  <TableCell>{task.patient_id || 'N/A'}</TableCell>
                  <TableCell>{task.lab_id || 'N/A'}</TableCell>
                  <TableCell>{task.segment || 'N/A'}</TableCell>
                  <TableCell>{task.B2B || 'N/A'}</TableCell>
                  <TableCell>₹{task.totalAmount || '0'}</TableCell>
                  <TableCell>₹{task.netAmount || '0'}</TableCell>
                  <TableCell>
                    <StatusBadge status="Billed">{task.status}</StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      );
    }

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>S.No</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Task ID</TableHeaderCell>
              <TableHeaderCell>Lab Name</TableHeaderCell>
              <TableHeaderCell>Sales Person</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Order Time</TableHeaderCell>
              <TableHeaderCell>Accepted Time</TableHeaderCell>
              <TableHeaderCell>Pickup Time</TableHeaderCell>
              <TableHeaderCell>Remarks</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {tasks.map((task, index) => (
              <TableRow key={task.id || index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{formatDate(task.date)}</TableCell>
                <TableCell>{task.task_id || 'N/A'}</TableCell>
                <TableCell>{task.clinicalname || 'N/A'}</TableCell>
                <TableCell>{task.sales_person || 'N/A'}</TableCell>
                <TableCell>
                  <StatusBadge status={task.status}>{task.status}</StatusBadge>
                </TableCell>
                <TableCell>{formatTime(task.sampleordertime)}</TableCell>
                <TableCell>{formatTime(task.sampleacceptedtime)}</TableCell>
                <TableCell>{formatTime(task.samplepickeduptime)}</TableCell>
                <TableCell>{task.remarks || '-'}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <PageContainer>
      <MainContent>
        <Card>
          <Header>
            <HeaderContent>
              <TitleGroup>
                <IconWrapper>
                  <DashboardIcon />
                </IconWrapper>
                <Title>Logistics Dashboard</Title>
              </TitleGroup>
              <Subtitle>Monitor and analyze sample collection performance</Subtitle>
            </HeaderContent>
          </Header>

          <FilterSection>
            <FilterGrid>
              <FilterItem>
                <Label>Sample Collector</Label>
                <Select
                  value={selectedCollector}
                  onChange={(e) => setSelectedCollector(e.target.value)}
                >
                  <option value="">All Collectors</option>
                  {collectors.map((collector, index) => (
                    <option key={index} value={collector}>
                      {collector}
                    </option>
                  ))}
                </Select>
              </FilterItem>

              <FilterItem>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FilterItem>

              <FilterItem>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FilterItem>

              <FilterItem style={{ justifyContent: 'flex-end' }}>
                <PrimaryButton onClick={handleSearch} disabled={loading}>
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <SearchIcon />
                      Search
                    </>
                  )}
                </PrimaryButton>
              </FilterItem>
            </FilterGrid>
          </FilterSection>

          {error && (
            <ErrorMessage>
              <AlertCircleIcon />
              {error}
            </ErrorMessage>
          )}

          {dashboardData?.summary && dashboardData?.tasks && (
            <>
              <SummaryGrid>
                <StatCard
                  gradient="linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(59, 130, 246, 0.1))"
                  borderColor="rgba(14, 165, 233, 0.3)"
                >
                  <StatLabel color="#0369a1">Total Assigned</StatLabel>
                  <StatValue color="#0ea5e9">{dashboardData?.summary?.total_assigned ?? 0}</StatValue>
                </StatCard>

                <StatCard
                  gradient="linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))"
                  borderColor="rgba(251, 191, 36, 0.3)"
                >
                  <StatLabel color="#b45309">Total Accepted</StatLabel>
                  <StatValue color="#f59e0b">{dashboardData.summary.total_accepted}</StatValue>
                </StatCard>

                <StatCard
                  gradient="linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))"
                  borderColor="rgba(34, 197, 94, 0.3)"
                >
                  <StatLabel color="#15803d">Total Picked Up</StatLabel>
                  <StatValue color="#22c55e">{dashboardData.summary.total_picked_up}</StatValue>
                </StatCard>

                <StatCard
                  gradient="linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))"
                  borderColor="rgba(239, 68, 68, 0.3)"
                >
                  <StatLabel color="#b91c1c">Total Rejected</StatLabel>
                  <StatValue color="#ef4444">{dashboardData.summary.total_rejected}</StatValue>
                </StatCard>

                <StatCard
                  gradient="linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))"
                  borderColor="rgba(139, 92, 246, 0.3)"
                >
                  <StatLabel color="#6d28d9">Total Billed</StatLabel>
                  <StatValue color="#8b5cf6">{dashboardData.summary.total_billed}</StatValue>
                </StatCard>

                <StatCard
                  gradient="linear-gradient(135deg, rgba(148, 163, 184, 0.1), rgba(100, 116, 139, 0.1))"
                  borderColor="rgba(148, 163, 184, 0.3)"
                >
                  <StatLabel color="#475569">Pending Assigned</StatLabel>
                  <StatValue color="#64748b">{dashboardData.summary.pending_assigned}</StatValue>
                </StatCard>
              </SummaryGrid>

              <TabContainer>
                <TabList>
                  <Tab
                    active={activeTab === 'assigned'}
                    onClick={() => setActiveTab('assigned')}
                  >
                    Assigned
                    <TabBadge active={activeTab === 'assigned'}>
                      {dashboardData.tasks.assigned.count}
                    </TabBadge>
                  </Tab>

                  <Tab
                    active={activeTab === 'accepted'}
                    onClick={() => setActiveTab('accepted')}
                  >
                    Accepted
                    <TabBadge active={activeTab === 'accepted'}>
                      {dashboardData.tasks.accepted.count}
                    </TabBadge>
                  </Tab>

                  <Tab
                    active={activeTab === 'picked_up'}
                    onClick={() => setActiveTab('picked_up')}
                  >
                    Picked Up
                    <TabBadge active={activeTab === 'picked_up'}>
                      {dashboardData.tasks.picked_up.count}
                    </TabBadge>
                  </Tab>

                  <Tab
                    active={activeTab === 'rejected'}
                    onClick={() => setActiveTab('rejected')}
                  >
                    Rejected
                    <TabBadge active={activeTab === 'rejected'}>
                      {dashboardData.tasks.rejected.count}
                    </TabBadge>
                  </Tab>

                  <Tab
                    active={activeTab === 'billed'}
                    onClick={() => setActiveTab('billed')}
                  >
                    Billed
                    <TabBadge active={activeTab === 'billed'}>
                      {dashboardData.tasks.billed.count}
                    </TabBadge>
                  </Tab>
                </TabList>

                {activeTab === 'assigned' && renderTaskTable(dashboardData.tasks.assigned.data, 'assigned')}
                {activeTab === 'accepted' && renderTaskTable(dashboardData.tasks.accepted.data, 'accepted')}
                {activeTab === 'picked_up' && renderTaskTable(dashboardData.tasks.picked_up.data, 'picked up')}
                {activeTab === 'rejected' && renderTaskTable(dashboardData.tasks.rejected.data, 'rejected')}
                {activeTab === 'billed' && renderTaskTable(dashboardData.tasks.billed.data, 'billed')}
              </TabContainer>
            </>
          )}

          {!dashboardData && !loading && (
            <EmptyState>
              <EmptyIcon><InboxIcon /></EmptyIcon>
              <EmptyText>Select filters and click Search to view dashboard data</EmptyText>
            </EmptyState>
          )}

          {loading && (
            <LoadingOverlay>
              <LoadingSpinnerLarge />
            </LoadingOverlay>
          )}
        </Card>
      </MainContent>
    </PageContainer>
  );
};

export default LogisticsDashboard;
