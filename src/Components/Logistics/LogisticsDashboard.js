'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import * as XLSX from 'xlsx';
import {
  FaThLarge,
  FaSearch,
  FaCalendarAlt,
  FaUserTie,
  FaClipboardList,
  FaCheckCircle,
  FaTruck,
  FaTimesCircle,
  FaFileInvoiceDollar,
  FaFileExcel,
  FaRedo,
  FaChevronLeft,
  FaChevronRight,
  FaInbox,
  FaExclamationCircle,
} from 'react-icons/fa';
import apiRequest from '../Auth/apiRequest';

// ============ Animations ============
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// ============ Styled Components ============
const PageContainer = styled.div`
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7ff 0%, #ede9fe 50%, #fdf2f8 100%);
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const MainContent = styled.div`
  max-width: 1560px;
  margin: 0 auto;
`;

const DashboardCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 35px rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.3s ease-out;
`;

// Header
const HeaderSection = styled.div`
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%);
  padding: 28px 32px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
`;

const HeaderIconBox = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  flex-shrink: 0;
`;

const HeaderTitleGroup = styled.div`
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0 0 4px 0;
    letter-spacing: -0.3px;
    color: #ffffff;

    @media (max-width: 600px) {
      font-size: 1.4rem;
    }
  }
  p {
    margin: 0;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 400;
  }
`;

// Filter Toolbar
const FilterSection = styled.div`
  padding: 20px 32px;
  background: #ffffff;
  border-bottom: 1px solid #edf2f7;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 1.3fr) minmax(160px, 1fr) minmax(160px, 1fr) auto;
  gap: 16px;
  align-items: flex-end;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 12px;
    font-weight: 700;
    color: #4b5563;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 6px;

    svg {
      color: #6366f1;
    }
  }

  select, input {
    height: 44px;
    padding: 8px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 14px;
    color: #1f2937;
    background: #ffffff;
    font-family: inherit;
    transition: all 0.2s ease;
    outline: none;

    &:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }
  }

  select {
    cursor: pointer;
  }
`;

const FilterActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  height: 44px;
`;

const SearchBtn = styled.button`
  height: 44px;
  padding: 0 24px;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 3px 10px rgba(79, 70, 229, 0.25);
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResetBtn = styled.button`
  height: 44px;
  padding: 0 16px;
  background: #f8fafc;
  color: #64748b;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #f1f5f9;
    color: #334155;
    border-color: #cbd5e1;
  }
`;

// Tabs Section
const TabSection = styled.div`
  padding: 24px 32px 32px;

  @media (max-width: 768px) {
    padding: 16px 16px 24px;
  }
`;

const TabBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf2f7;
`;

const SegmentedTabs = styled.div`
  display: flex;
  background: #f1f5f9;
  padding: 5px;
  border-radius: 12px;
  gap: 4px;
  flex-wrap: wrap;
`;

const SegmentedTabItem = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 9px;
  border: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: ${props => props.active ? '700' : '600'};
  color: ${props => props.active ? '#1e293b' : '#64748b'};
  background: ${props => props.active ? '#ffffff' : 'transparent'};
  box-shadow: ${props => props.active ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none'};
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    font-size: 14px;
    color: ${props => props.active ? props.badgeColor : '#94a3b8'};
  }

  &:hover {
    color: #1e293b;
    background: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'};
  }
`;

const TabBadgeCounter = styled.span`
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  background: ${props => props.active ? props.badgeBg : '#e2e8f0'};
  color: ${props => props.active ? props.badgeColor : '#64748b'};
`;

const TabRightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const TableSearchInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 12px;
    color: #94a3b8;
    font-size: 14px;
  }

  input {
    height: 40px;
    padding: 0 12px 0 34px;
    border: 1.5px solid #e2e8f0;
    border-radius: 9px;
    font-size: 13px;
    font-family: inherit;
    color: #1e293b;
    outline: none;
    width: 220px;
    transition: all 0.2s ease;

    &:focus {
      border-color: #6366f1;
      width: 260px;
    }
  }
`;

const ExportExcelBtn = styled.button`
  height: 40px;
  padding: 0 16px;
  background: #10b981;
  color: #ffffff;
  border: none;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.25);
  white-space: nowrap;

  &:hover {
    background: #059669;
    transform: translateY(-1px);
  }
`;

// Table Styles
const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f8fafc;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const ModernTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px;

  thead {
    background: #f8fafc;
    border-bottom: 2px solid #e2e8f0;

    th {
      padding: 14px 16px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.6px;
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.15s ease;

      &:hover {
        background: #f8faff;
      }

      &:last-child {
        border-bottom: none;
      }
    }

    td {
      padding: 13px 16px;
      color: #334155;
      vertical-align: middle;
      white-space: nowrap;
    }
  }
`;

const PillCode = styled.span`
  background: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-weight: 600;
`;

const TagBadge = styled.span`
  background: rgba(99, 102, 241, 0.08);
  color: #4f46e5;
  padding: 4px 9px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
`;

const AmountText = styled.span`
  font-weight: 700;
  color: #0f172a;
`;

const ModernStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  ${props => {
    switch (props.status?.toLowerCase()) {
      case 'billed':
        return `background: #ede9fe; color: #6d28d9;`;
      case 'pickedup':
      case 'picked_up':
        return `background: #dcfce7; color: #15803d;`;
      case 'accepted':
        return `background: #fef3c7; color: #b45309;`;
      case 'assigned':
        return `background: #e0f2fe; color: #0369a1;`;
      case 'rejected':
        return `background: #fee2e2; color: #b91c1c;`;
      default:
        return `background: #f1f5f9; color: #475569;`;
    }
  }}
`;

const PaginationFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 8px 0;
  font-size: 13px;
  color: #64748b;
  flex-wrap: wrap;
  gap: 12px;
`;

const PageSizeSelect = styled.select`
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 12px;
  font-family: inherit;
  color: #334155;
  background: #ffffff;
  outline: none;
  cursor: pointer;
  margin-left: 6px;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const PageBtn = styled.button`
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border-radius: 6px;
  border: 1px solid ${props => props.active ? '#6366f1' : '#e2e8f0'};
  background: ${props => props.active ? '#6366f1' : '#ffffff'};
  color: ${props => props.active ? '#ffffff' : props.disabled ? '#cbd5e1' : '#475569'};
  font-weight: ${props => props.active ? '700' : '500'};
  font-size: 12px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.active ? '#6366f1' : '#f1f5f9'};
    border-color: #6366f1;
  }
`;

const EmptyStateBox = styled.div`
  text-align: center;
  padding: 48px 20px;
  color: #94a3b8;

  .icon {
    font-size: 42px;
    margin-bottom: 12px;
    opacity: 0.6;
    color: #6366f1;
  }

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #475569;
    margin: 0 0 6px;
  }

  p {
    font-size: 13px;
    margin: 0;
    color: #94a3b8;
  }
`;

const LoadingSpinnerBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6366f1;
  font-weight: 600;
  gap: 12px;

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #e0e7ff;
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }
`;

const AlertBanner = styled.div`
  margin: 16px 32px 0;
  padding: 12px 18px;
  background: #fee2e2;
  color: #b91c1c;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #fecaca;
`;

// ============ Component ============
const LogisticsDashboard = () => {
  const userRole = localStorage.getItem('role') || '';
  const userEmployeeId = localStorage.getItem('employeeId') || '';
  const userName = localStorage.getItem('name') || '';

  // Check if Diagnostics General Manager (or GM / Admin / Sales Person)
  const isGeneralManager =
    userRole === 'Diagnostics General Manager' ||
    userRole === 'General Manager' ||
    userRole === 'GM' ||
    userRole === 'Admin' ||
    userRole === 'Sales Person' ||
    userRole === 'Sales Executive' ||
    userRole === 'Sales person' ||
    userRole === 'Sales';

  const [collectors, setCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('assigned');

  // Table local search & pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);

    if (isGeneralManager) {
      fetchCollectors();
    } else {
      // For Sample Collector, lock to themselves and auto-fetch their tasks for today
      const myId = userEmployeeId || userName;
      setSelectedCollector(myId);
      fetchDashboardData(myId, today, today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCollectors = async () => {
    try {
      const response = await apiRequest(`${Labbaseurl}sample-collector/`, 'GET');
      let collectorsList = [];
      const collectorsData = response?.data?.collectors ?? response?.data ?? [];

      if (Array.isArray(collectorsData)) {
        collectorsList = collectorsData;
      } else if (typeof collectorsData === 'object') {
        collectorsList = Object.values(collectorsData);
      } else if (typeof collectorsData === 'string') {
        collectorsList = [collectorsData];
      }

      collectorsList = collectorsList
        .map(c => {
          if (typeof c === 'object' && c !== null) {
            return {
              employeeId: c.employeeId || '',
              employeeName: c.employeeName || c.name || '',
            };
          }
          return { employeeId: c, employeeName: c };
        })
        .filter(c => c.employeeName && c.employeeName.trim() !== '');

      const uniqueCollectors = [];
      const seen = new Set();
      for (const c of collectorsList) {
        if (!seen.has(c.employeeId)) {
          seen.add(c.employeeId);
          uniqueCollectors.push(c);
        }
      }
      setCollectors(uniqueCollectors);
    } catch (err) {
      console.error('Error fetching collectors:', err);
      setError('Failed to load sample collectors');
    }
  };

  const fetchDashboardData = async (forcedCollector, forcedStart, forcedEnd) => {
    try {
      setLoading(true);
      setError('');

      const collectorToUse = !isGeneralManager
        ? (userEmployeeId || userName)
        : (forcedCollector !== undefined ? forcedCollector : selectedCollector);

      const startToUse = forcedStart !== undefined ? forcedStart : startDate;
      const endToUse = forcedEnd !== undefined ? forcedEnd : endDate;

      const params = new URLSearchParams();
      if (collectorToUse) params.append('sample_collector', collectorToUse);
      if (startToUse) params.append('start_date', startToUse);
      if (endToUse) params.append('end_date', endToUse);

      const response = await apiRequest(
        `${Labbaseurl}logistics-dashboard/?${params.toString()}`,
        'GET'
      );

      setDashboardData(response?.data || null);
      setCurrentPage(1);
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

  const handleReset = () => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    setSearchQuery('');
    if (isGeneralManager) {
      setSelectedCollector('');
    } else {
      const myId = userEmployeeId || userName;
      setSelectedCollector(myId);
      fetchDashboardData(myId, today, today);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  // Get active task list
  const rawTaskList = useMemo(() => {
    if (!dashboardData?.tasks?.[activeTab]?.data) return [];
    return dashboardData.tasks[activeTab].data;
  }, [dashboardData, activeTab]);

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return rawTaskList;
    const q = searchQuery.toLowerCase().trim();

    if (activeTab === 'billed') {
      return rawTaskList.filter(
        t =>
          (t.bill_no && String(t.bill_no).toLowerCase().includes(q)) ||
          (t.patient_id && String(t.patient_id).toLowerCase().includes(q)) ||
          (t.lab_id && String(t.lab_id).toLowerCase().includes(q)) ||
          (t.segment && String(t.segment).toLowerCase().includes(q)) ||
          (t.B2B && String(t.B2B).toLowerCase().includes(q)) ||
          (t.status && String(t.status).toLowerCase().includes(q))
      );
    }

    return rawTaskList.filter(
      t =>
        (t.task_id && String(t.task_id).toLowerCase().includes(q)) ||
        (t.clinicalname && String(t.clinicalname).toLowerCase().includes(q)) ||
        (t.sales_person && String(t.sales_person).toLowerCase().includes(q)) ||
        (t.status && String(t.status).toLowerCase().includes(q)) ||
        (t.remarks && String(t.remarks).toLowerCase().includes(q))
    );
  }, [rawTaskList, searchQuery, activeTab]);

  // Paginated tasks
  const totalItems = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  // Switch tab resets page and search
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleExportExcel = () => {
    if (filteredTasks.length === 0) return;

    let excelRows = [];
    if (activeTab === 'billed') {
      excelRows = filteredTasks.map((t, idx) => ({
        'S.No': idx + 1,
        'Date': formatDate(t.date),
        'Bill No': t.bill_no || '-',
        'Patient ID': t.patient_id || '-',
        'Lab ID': t.lab_id || '-',
        'Segment': t.segment || '-',
        'B2B': t.B2B || '-',
        'Total Amount': t.totalAmount || 0,
        'Net Amount': t.netAmount || 0,
        'Status': t.status || 'Billed',
      }));
    } else {
      excelRows = filteredTasks.map((t, idx) => ({
        'S.No': idx + 1,
        'Date': formatDate(t.date),
        'Task ID': t.task_id || '-',
        'Lab Name': t.clinicalname || '-',
        'Sales Person': t.sales_person || '-',
        'Status': t.status || '-',
        'Order Time': formatTime(t.sampleordertime),
        'Accepted Time': formatTime(t.sampleacceptedtime),
        'Pickup Time': formatTime(t.samplepickeduptime),
        'Remarks': t.remarks || '-',
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab.toUpperCase());
    XLSX.writeFile(
      workbook,
      `Logistics_${activeTab.toUpperCase()}_${startDate}_to_${endDate}.xlsx`
    );
  };

  return (
    <PageContainer>
      <MainContent>
        <DashboardCard>
          {/* Header */}
          <HeaderSection>
            <HeaderLeft>
              <HeaderIconBox>
                <FaThLarge />
              </HeaderIconBox>
              <HeaderTitleGroup>
                <h1>Logistics Dashboard</h1>
                <p>Monitor, track and analyze sample collection performance</p>
              </HeaderTitleGroup>
            </HeaderLeft>
          </HeaderSection>

          {/* Filter Toolbar */}
          <FilterSection>
            <FilterGrid>
              {isGeneralManager ? (
                <FilterField>
                  <label>
                    <FaUserTie /> Sample Collector
                  </label>
                  <select
                    value={selectedCollector}
                    onChange={(e) => setSelectedCollector(e.target.value)}
                  >
                    <option value="">All Collectors</option>
                    {collectors.map((c, i) => (
                      <option key={i} value={c.employeeId || c.employeeName}>
                        {c.employeeName}
                      </option>
                    ))}
                  </select>
                </FilterField>
              ) : (
                <FilterField>
                  <label>
                    <FaUserTie /> Sample Collector
                  </label>
                  <div
                    style={{
                      height: '44px',
                      padding: '0 14px',
                      border: '1.5px solid #e0e7ff',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4338ca',
                      background: '#f5f7ff',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {userName || userEmployeeId || 'My Assigned Tasks'}
                  </div>
                </FilterField>
              )}

              <FilterField>
                <label>
                  <FaCalendarAlt /> Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FilterField>

              <FilterField>
                <label>
                  <FaCalendarAlt /> End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FilterField>

              <FilterActions>
                <SearchBtn onClick={handleSearch} disabled={loading}>
                  <FaSearch /> Search
                </SearchBtn>
                <ResetBtn onClick={handleReset} title="Reset filters">
                  <FaRedo /> Reset
                </ResetBtn>
              </FilterActions>
            </FilterGrid>
          </FilterSection>

          {error && (
            <AlertBanner>
              <FaExclamationCircle /> {error}
            </AlertBanner>
          )}

          {/* Tabs and Data Tables */}
          {dashboardData && (
            <TabSection>
              <TabBarContainer>
                {/* Segmented Tab Controls */}
                <SegmentedTabs>
                  <SegmentedTabItem
                    active={activeTab === 'assigned'}
                    badgeColor="#0284c7"
                    badgeBg="#e0f2fe"
                    onClick={() => handleTabChange('assigned')}
                  >
                    <FaClipboardList /> Assigned
                    <TabBadgeCounter active={activeTab === 'assigned'} badgeColor="#0284c7" badgeBg="#e0f2fe">
                      {dashboardData.tasks?.assigned?.count ?? 0}
                    </TabBadgeCounter>
                  </SegmentedTabItem>

                  <SegmentedTabItem
                    active={activeTab === 'accepted'}
                    badgeColor="#d97706"
                    badgeBg="#fef3c7"
                    onClick={() => handleTabChange('accepted')}
                  >
                    <FaCheckCircle /> Accepted
                    <TabBadgeCounter active={activeTab === 'accepted'} badgeColor="#d97706" badgeBg="#fef3c7">
                      {dashboardData.tasks?.accepted?.count ?? 0}
                    </TabBadgeCounter>
                  </SegmentedTabItem>

                  <SegmentedTabItem
                    active={activeTab === 'picked_up'}
                    badgeColor="#16a34a"
                    badgeBg="#dcfce7"
                    onClick={() => handleTabChange('picked_up')}
                  >
                    <FaTruck /> Picked Up
                    <TabBadgeCounter active={activeTab === 'picked_up'} badgeColor="#16a34a" badgeBg="#dcfce7">
                      {dashboardData.tasks?.picked_up?.count ?? 0}
                    </TabBadgeCounter>
                  </SegmentedTabItem>

                  <SegmentedTabItem
                    active={activeTab === 'rejected'}
                    badgeColor="#dc2626"
                    badgeBg="#fee2e2"
                    onClick={() => handleTabChange('rejected')}
                  >
                    <FaTimesCircle /> Rejected
                    <TabBadgeCounter active={activeTab === 'rejected'} badgeColor="#dc2626" badgeBg="#fee2e2">
                      {dashboardData.tasks?.rejected?.count ?? 0}
                    </TabBadgeCounter>
                  </SegmentedTabItem>

                  <SegmentedTabItem
                    active={activeTab === 'billed'}
                    badgeColor="#7c3aed"
                    badgeBg="#ede9fe"
                    onClick={() => handleTabChange('billed')}
                  >
                    <FaFileInvoiceDollar /> Billed
                    <TabBadgeCounter active={activeTab === 'billed'} badgeColor="#7c3aed" badgeBg="#ede9fe">
                      {dashboardData.tasks?.billed?.count ?? 0}
                    </TabBadgeCounter>
                  </SegmentedTabItem>
                </SegmentedTabs>

                {/* Right actions: quick search & export */}
                <TabRightActions>
                  <TableSearchInput>
                    <FaSearch />
                    <input
                      type="text"
                      placeholder={`Search in ${activeTab}...`}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </TableSearchInput>

                  <ExportExcelBtn
                    onClick={handleExportExcel}
                    disabled={filteredTasks.length === 0}
                    title="Export table to Excel"
                  >
                    <FaFileExcel /> Export Excel
                  </ExportExcelBtn>
                </TabRightActions>
              </TabBarContainer>

              {/* Table Render */}
              {loading ? (
                <LoadingSpinnerBox>
                  <div className="spinner" />
                  <span>Loading dashboard data...</span>
                </LoadingSpinnerBox>
              ) : filteredTasks.length === 0 ? (
                <EmptyStateBox>
                  <div className="icon">
                    <FaInbox />
                  </div>
                  <h4>No records found</h4>
                  <p>
                    {searchQuery
                      ? `No results matching "${searchQuery}" in ${activeTab}`
                      : `There are no ${activeTab.replace('_', ' ')} tasks for the selected date range.`}
                  </p>
                </EmptyStateBox>
              ) : activeTab === 'billed' ? (
                /* BILLED TABLE */
                <>
                  <TableWrapper>
                    <ModernTable>
                      <thead>
                        <tr>
                          <th style={{ width: '60px', textAlign: 'center' }}>S.No</th>
                          <th>Date</th>
                          <th>Bill No</th>
                          <th>Patient ID</th>
                          <th>Lab ID</th>
                          <th>Segment</th>
                          <th>B2B</th>
                          <th style={{ textAlign: 'right' }}>Total Amount</th>
                          <th style={{ textAlign: 'right' }}>Net Amount</th>
                          <th style={{ textAlign: 'center' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedTasks.map((task, idx) => (
                          <tr key={task._id || idx}>
                            <td style={{ textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>
                              {startIndex + idx + 1}
                            </td>
                            <td>{formatDate(task.date)}</td>
                            <td>
                              <PillCode>{task.bill_no || '-'}</PillCode>
                            </td>
                            <td>
                              <span style={{ fontWeight: 600, color: '#4338ca' }}>
                                {task.patient_id || '-'}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontWeight: 600 }}>{task.lab_id || '-'}</span>
                            </td>
                            <td>
                              <TagBadge>{task.segment || '-'}</TagBadge>
                            </td>
                            <td>{task.B2B || '-'}</td>
                            <td style={{ textAlign: 'right' }}>
                              <AmountText>₹{Number(task.totalAmount || 0).toFixed(2)}</AmountText>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <AmountText style={{ color: '#059669' }}>
                                ₹{Number(task.netAmount || 0).toFixed(2)}
                              </AmountText>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <ModernStatusBadge status="Billed">
                                {task.status || 'Billed'}
                              </ModernStatusBadge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </ModernTable>
                  </TableWrapper>

                  <PaginationFooter>
                    <div>
                      Showing <strong>{startIndex + 1}</strong> to{' '}
                      <strong>{Math.min(endIndex, totalItems)}</strong> of{' '}
                      <strong>{totalItems}</strong> records
                      <label style={{ marginLeft: '12px' }}>
                        Rows per page:
                        <PageSizeSelect
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </PageSizeSelect>
                      </label>
                    </div>

                    {totalPages > 1 && (
                      <PaginationButtons>
                        <PageBtn
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          title="Previous page"
                        >
                          <FaChevronLeft size={10} />
                        </PageBtn>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                          .map((p, i, arr) => (
                            <React.Fragment key={p}>
                              {i > 0 && p - arr[i - 1] > 1 && <span style={{ padding: '0 4px', color: '#94a3b8' }}>...</span>}
                              <PageBtn
                                active={p === currentPage}
                                onClick={() => setCurrentPage(p)}
                              >
                                {p}
                              </PageBtn>
                            </React.Fragment>
                          ))}
                        <PageBtn
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          title="Next page"
                        >
                          <FaChevronRight size={10} />
                        </PageBtn>
                      </PaginationButtons>
                    )}
                  </PaginationFooter>
                </>
              ) : (
                /* REGULAR TASKS TABLE */
                <>
                  <TableWrapper>
                    <ModernTable>
                      <thead>
                        <tr>
                          <th style={{ width: '60px', textAlign: 'center' }}>S.No</th>
                          <th>Date</th>
                          <th>Task ID</th>
                          <th>Lab Name</th>
                          <th>Sales Person</th>
                          <th style={{ textAlign: 'center' }}>Status</th>
                          <th>Order Time</th>
                          <th>Accepted Time</th>
                          <th>Pickup Time</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedTasks.map((task, idx) => (
                          <tr key={task.id || idx}>
                            <td style={{ textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>
                              {startIndex + idx + 1}
                            </td>
                            <td>{formatDate(task.date)}</td>
                            <td>
                              <PillCode>{task.task_id || `TASK-${task.id}`}</PillCode>
                            </td>
                            <td>
                              <strong style={{ color: '#1e293b' }}>{task.clinicalname || '-'}</strong>
                            </td>
                            <td>{task.sales_person || '-'}</td>
                            <td style={{ textAlign: 'center' }}>
                              <ModernStatusBadge status={task.status}>
                                {task.status}
                              </ModernStatusBadge>
                            </td>
                            <td>{formatTime(task.sampleordertime)}</td>
                            <td>{formatTime(task.sampleacceptedtime)}</td>
                            <td>{formatTime(task.samplepickeduptime)}</td>
                            <td style={{ color: task.remarks ? '#dc2626' : '#94a3b8' }}>
                              {task.remarks || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </ModernTable>
                  </TableWrapper>

                  <PaginationFooter>
                    <div>
                      Showing <strong>{startIndex + 1}</strong> to{' '}
                      <strong>{Math.min(endIndex, totalItems)}</strong> of{' '}
                      <strong>{totalItems}</strong> records
                      <label style={{ marginLeft: '12px' }}>
                        Rows per page:
                        <PageSizeSelect
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </PageSizeSelect>
                      </label>
                    </div>

                    {totalPages > 1 && (
                      <PaginationButtons>
                        <PageBtn
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          title="Previous page"
                        >
                          <FaChevronLeft size={10} />
                        </PageBtn>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                          .map((p, i, arr) => (
                            <React.Fragment key={p}>
                              {i > 0 && p - arr[i - 1] > 1 && <span style={{ padding: '0 4px', color: '#94a3b8' }}>...</span>}
                              <PageBtn
                                active={p === currentPage}
                                onClick={() => setCurrentPage(p)}
                              >
                                {p}
                              </PageBtn>
                            </React.Fragment>
                          ))}
                        <PageBtn
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          title="Next page"
                        >
                          <FaChevronRight size={10} />
                        </PageBtn>
                      </PaginationButtons>
                    )}
                  </PaginationFooter>
                </>
              )}
            </TabSection>
          )}

          {!dashboardData && !loading && (
            <EmptyStateBox>
              <div className="icon">
                <FaInbox />
              </div>
              <h4>No Data Loaded</h4>
              <p>Select your filters above and click Search to view live logistics performance</p>
            </EmptyStateBox>
          )}
        </DashboardCard>
      </MainContent>
    </PageContainer>
  );
};

export default LogisticsDashboard;
