import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import apiRequest from "../Auth/apiRequest";
import { categories, monthNames } from "../Constantdata/Salesplanconstant";
import {
  Calendar,
  Layers,
  Save,
  DollarSign,
  Briefcase,
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from "lucide-react";

/* ═══════════════════════════════════════════════
   ANIMATIONS & KEYFRAMES
═══════════════════════════════════════════════ */
const slideIn = keyframes`
  from { transform: translate(-50%, -20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translate(-50%, 0); opacity: 1; }
  to { transform: translate(-50%, -20px); opacity: 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

/* ═══════════════════════════════════════════════
   TOAST SYSTEM
═══════════════════════════════════════════════ */
const ToastWrapper = styled.div`
  position: fixed;
  top: 1.5rem;
  left: 50%;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  pointer-events: none;
`;

const ToastItem = styled.div`
  min-width: 280px;
  max-width: 440px;
  padding: 0.85rem 1.25rem;
  border-radius: 14px;
  color: white;
  font-size: 0.88rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.18);
  background: ${props => (props.$type === 'error'
    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)')};
  animation: ${props => (props.$leaving ? slideOut : slideIn)} 0.25s ease forwards;
  pointer-events: auto;
`;

/* ═══════════════════════════════════════════════
   LAYOUT CONTAINERS
═══════════════════════════════════════════════ */
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.5rem 2rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #1e293b;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

/* ═══════════════════════════════════════════════
   TOP CONTROL DECK & HEADER
═══════════════════════════════════════════════ */
const HeaderCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconBadge = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%);
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Title = styled.h1`
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  margin: 0.15rem 0 0;
  font-size: 0.82rem;
  color: #64748b;
`;

const StatsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const StatBadge = styled.div`
  background: ${props => props.$bg || '#f8fafc'};
  border: 1px solid ${props => props.$border || '#e2e8f0'};
  padding: 0.5rem 0.9rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.$color || '#334155'};

  strong {
    font-size: 0.92rem;
    font-weight: 700;
    color: ${props => props.$valColor || '#0f172a'};
  }
`;

/* ═══════════════════════════════════════════════
   CATEGORY TABS (SEGMENTED PILLS)
═══════════════════════════════════════════════ */
const CategoryTabBar = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  background: #f8fafc;
  padding: 0.35rem;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  width: fit-content;
  max-width: 100%;
`;

const CategoryTab = styled.button`
  border: none;
  background: ${props => props.$active ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : '#64748b'};
  font-weight: ${props => props.$active ? '700' : '600'};
  font-size: 0.84rem;
  padding: 0.55rem 1.15rem;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$active ? '0 3px 10px rgba(99, 102, 241, 0.25)' : 'none'};

  &:hover {
    color: ${props => props.$active ? '#ffffff' : '#1e293b'};
    background: ${props => props.$active ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : '#e2e8f0'};
  }
`;

/* ═══════════════════════════════════════════════
   CONTROLS BAR
═══════════════════════════════════════════════ */
const ControlsRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
`;

const ControlItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const ControlLabel = styled.label`
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const StyledSelect = styled.select`
  padding: 0.55rem 0.9rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #1e293b;
  background: #ffffff;
  cursor: pointer;
  outline: none;
  min-width: 140px;
  transition: all 0.15s ease;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputPrefix = styled.span`
  position: absolute;
  left: 0.75rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #94a3b8;
  pointer-events: none;
`;

const StyledNumberInput = styled.input`
  padding: 0.55rem 0.9rem;
  padding-left: ${props => props.$hasPrefix ? '1.65rem' : '0.9rem'};
  border: 1.5px solid ${props => (props.$saving ? '#fbbf24' : '#e2e8f0')};
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #1e293b;
  background: #ffffff;
  width: ${props => props.$width || '130px'};
  outline: none;
  transition: all 0.15s ease;

  ${props => props.$saving && css`
    animation: ${pulse} 1.5s infinite;
  `}

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  }

  &::placeholder {
    color: #cbd5e1;
    font-weight: 400;
  }
`;

/* ═══════════════════════════════════════════════
   TABLE STRUCTURE
═══════════════════════════════════════════════ */
const TableCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  min-height: 380px;

  &::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f8fafc;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.85rem;
`;

const Thead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 30;
`;

const Th = styled.th`
  background: #f8fafc;
  color: #475569;
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.6rem 0.65rem;
  text-align: ${props => props.align || 'center'};
  vertical-align: middle;
  border-bottom: 1.5px solid #e2e8f0;
  border-right: 1px solid #f1f5f9;
  white-space: nowrap;
  min-width: ${props => props.minWidth || '64px'};

  ${props => props.sticky && css`
    position: sticky;
    left: ${props.$left || '0px'};
    z-index: 35;
    background: #f8fafc;
    border-right: 2px solid #e2e8f0;
    box-shadow: 4px 0 10px -2px rgba(0, 0, 0, 0.04);
  `}

  ${props => props.$isTotal && css`
    background: #f1f5f9;
    color: #1e293b;
    border-left: 2px solid #cbd5e1;
    font-size: 0.8rem;
  `}
`;

const WeekTh = styled.th`
  padding: 0.55rem 0.75rem;
  text-align: center;
  background: ${props => props.$bg || '#f8fafc'};
  border-bottom: 1.5px solid #e2e8f0;
  border-right: 1.5px solid #e2e8f0;
  color: ${props => props.$color || '#1e293b'};
`;

const WeekHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
`;

const WeekTitleBadge = styled.span`
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: inherit;
`;

const WeekRangeText = styled.span`
  font-size: 0.68rem;
  font-weight: 600;
  opacity: 0.85;
`;

const DayHeaderStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
`;

const DayWeekday = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  color: ${props => props.$isWeekend ? '#ef4444' : '#64748b'};
`;

const DayNumber = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: #1e293b;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  transition: background-color 0.12s ease;

  ${props => props.$isSubtotal && css`
    background: #faf5ff;
    font-weight: 700;
  `}

  ${props => props.$isGrandTotal && css`
    background: #0f172a;
    color: #ffffff;
    font-weight: 700;
  `}

  &:hover {
    background-color: ${props => props.$isGrandTotal ? '#0f172a' : props.$isSubtotal ? '#f5eeff' : '#f8faff'};
  }
`;

const Td = styled.td`
  padding: 0.45rem 0.5rem;
  border-bottom: 1px solid #f1f5f9;
  border-right: 1px solid #f1f5f9;
  font-size: 0.84rem;
  color: #334155;
  text-align: ${props => props.align || 'center'};
  vertical-align: middle;

  ${props => props.sticky && css`
    position: sticky;
    left: ${props.$left || '0px'};
    z-index: 20;
    background: #ffffff;
    border-right: 2px solid #e2e8f0;
    font-weight: 600;
    box-shadow: 4px 0 10px -2px rgba(0, 0, 0, 0.04);
  `}

  ${props => props.$isSubtotal && css`
    background: #faf5ff;
    border-bottom: 2px solid #e9d5ff;
    color: #7c3aed;
  `}

  ${props => props.$isGrandTotal && css`
    background: #0f172a;
    color: #ffffff;
    border-bottom: none;
    border-right: 1px solid #1e293b;
  `}

  ${props => props.$isTotalCol && css`
    background: #f8fafc;
    border-left: 2px solid #cbd5e1;
    font-weight: 700;
    color: #0f172a;
  `}
`;

const ExecCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-align: left;
  padding: 0.2rem 0.4rem;
`;

const ExecAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  font-size: 0.74rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.25);
`;

const ExecName = styled.div`
  font-size: 0.86rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
`;

const MetricLabel = styled.div`
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${props => props.$type === 'volume' ? '#0369a1' : props.$type === 'revenue' ? '#059669' : '#7c3aed'};
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const CellInput = styled.input`
  width: 100%;
  padding: 0.35rem 0.3rem;
  border: 1.5px solid ${props => (props.$saving ? '#fbbf24' : '#e2e8f0')};
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #1e293b;
  background: #f8fafc;
  text-align: center;
  outline: none;
  box-sizing: border-box;
  transition: all 0.15s ease;

  ${props => props.$saving && css`
    animation: ${pulse} 1.2s infinite;
  `}

  &:hover {
    border-color: #cbd5e1;
    background: #ffffff;
  }

  &:focus {
    background: #ffffff;
    border-color: #6366f1;
    box-shadow: 0 0 0 2.5px rgba(99, 102, 241, 0.15);
  }

  &::placeholder {
    color: #cbd5e1;
  }
`;

const RevenuePill = styled.div`
  padding: 0.3rem 0.4rem;
  border-radius: 6px;
  background: #ecfdf5;
  color: #059669;
  font-weight: 700;
  font-size: 0.78rem;
  text-align: center;
  white-space: nowrap;
`;

const WeekSubtotalBadge = styled.div`
  font-size: 0.82rem;
  font-weight: 700;
  color: #7c3aed;
  text-align: center;
`;

const RowTotalBadge = styled.div`
  font-size: 0.88rem;
  font-weight: 800;
  color: ${props => props.$highlight ? '#6366f1' : '#0f172a'};
  text-align: center;
  white-space: nowrap;
`;

const GrandTotalBadge = styled.div`
  font-size: 0.92rem;
  font-weight: 800;
  color: ${props => props.$accent ? '#34d399' : '#ffffff'};
  text-align: center;
  white-space: nowrap;
`;

/* ═══════════════════════════════════════════════
   FOOTER ACTIONS
═══════════════════════════════════════════════ */
const TableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FooterNote = styled.div`
  font-size: 0.8rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const SaveButton = styled.button`
  padding: 0.65rem 1.4rem;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  font-weight: 700;
  font-size: 0.88rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
  opacity: ${props => (props.disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.92rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

/* ═══════════════════════════════════════════════
   HARMONIOUS PASTEL PALETTE FOR WEEKS
═══════════════════════════════════════════════ */
const weekThemes = [
  { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' }, // Sky
  { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' }, // Violet
  { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' }, // Emerald
  { bg: '#fffbeb', color: '#b45309', border: '#fde68a' }, // Amber
  { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' }, // Rose
  { bg: '#ecfeff', color: '#0e7490', border: '#a5f3fc' }, // Cyan
];

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const Salesplan = () => {
  const [salesMappings, setSalesMappings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('B2B');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // 1-indexed (Jan=1 ... Dec=12)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [planData, setPlanData] = useState({});
  const [planRecords, setPlanRecords] = useState([]);
  const [workingDays, setWorkingDays] = useState('');
  const [avgRevenuePerPrescription, setAvgRevenuePerPrescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savingCells, setSavingCells] = useState({});
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    const toastId = Date.now() + Math.random();
    setToasts(prev => [...prev, { id: toastId, message, type, leaving: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => (t.id === toastId ? { ...t, leaving: true } : t)));
    }, 3700);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 4000);
  };

  const getAuthUserId = () => localStorage.getItem('employeeId');
  const planIdMapRef = useRef({});
  const patchQueueRef = useRef(Promise.resolve());

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  const daysArray = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Standard ISO week number (1-53), Monday to Sunday calendar week
  const getISOWeek = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  // Start (Monday) and end (Sunday) dates for the week containing `date`
  const getWeekDateRange = (date) => {
    const dayOfWeek = date.getDay(); // 0 is Sun, 1 is Mon, ... 6 is Sat
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() + diffToMonday);
    const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6);
    return { weekStart, weekEnd };
  };

  const formatShortDate = (date) => {
    const shortMonth = monthNames[date.getMonth()].slice(0, 3);
    return `${shortMonth} ${String(date.getDate()).padStart(2, '0')}`;
  };

  // Groups the selected month's days under "Week N" header cells
  const monthWeekGroups = useMemo(() => {
    const groups = [];
    daysArray.forEach(day => {
      const date = new Date(currentYear, currentMonth - 1, day);
      const weekNumber = getISOWeek(date);
      const last = groups[groups.length - 1];
      if (last && last.weekNumber === weekNumber) {
        last.count += 1;
        last.endDay = day;
      } else {
        const { weekStart, weekEnd } = getWeekDateRange(date);
        groups.push({
          weekNumber,
          count: 1,
          startDay: day,
          endDay: day,
          weekStart,
          weekEnd,
        });
      }
    });
    return groups;
  }, [daysArray, currentMonth, currentYear]);

  // Fetch Sales Executives
  useEffect(() => {
    const fetchSalesExecutives = async () => {
      try {
        const res = await apiRequest(`${Labbaseurl}get_sales_executives/`, "GET");
        const data = res?.data || [];

        const mappings = data.map((exec, index) => ({
          id: index + 1,
          name: exec.employeeName,
          employeeId: exec.employeeId
        }));

        setSalesMappings(mappings);
      } catch (error) {
        console.error("Error fetching sales mappings:", error.message || error);
        setSalesMappings([]);
      }
    };

    fetchSalesExecutives();
  }, [Labbaseurl]);

  // Fetch saved plan data whenever month/year changes
  useEffect(() => {
    const fetchPlanData = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest(
          `${Labbaseurl}salesplan/?month=${currentMonth}&year=${currentYear}`,
          "GET"
        );
        const records = res?.data || [];

        const rebuilt = {};
        const idMap = {};
        records.forEach(record => {
          const rowKey = `${record.category}_${record.employee_id}`;
          idMap[rowKey] = record.sales_plan_id;
          (record.entries || []).forEach(entry => {
            const cellKey = `${record.category}_${record.employee_id}_${entry.date}`;
            rebuilt[`${cellKey}_volume`] = entry.volume;
          });
        });
        planIdMapRef.current = idMap;
        setPlanData(rebuilt);
        setPlanRecords(records);
      } catch (error) {
        console.error("Error fetching sales plan:", error.message || error);
        planIdMapRef.current = {};
        setPlanData({});
        setPlanRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanData();
  }, [Labbaseurl, currentMonth, currentYear]);

  useEffect(() => {
    const record = planRecords.find(r => r.category === selectedCategory);
    setWorkingDays(record?.working_days != null ? String(record.working_days) : '');
    setAvgRevenuePerPrescription(
      record?.avg_revenue_per_prescription != null ? String(record.avg_revenue_per_prescription) : ''
    );
  }, [planRecords, selectedCategory]);

  const handleInputChange = (salesExecId, day, field, value) => {
    setPlanData(prev => ({
      ...prev,
      [`${selectedCategory}_${salesExecId}_${day}_${field}`]: value
    }));
  };

  const getInputValue = (salesExecId, day, field) => {
    const val = planData[`${selectedCategory}_${salesExecId}_${day}_${field}`];
    return val === undefined || val === null ? '' : val;
  };

  const getRevenue = (salesExecId, day) => {
    const volume = parseFloat(getInputValue(salesExecId, day, 'volume')) || 0;
    const avgRevenue = parseFloat(avgRevenuePerPrescription) || 0;
    return volume * avgRevenue;
  };

  const handleWorkingDaysChange = (value) => {
    setWorkingDays(value);
  };

  const handleAvgRevenueChange = (value) => {
    setAvgRevenuePerPrescription(value);
  };

  const handleCellBlur = (salesExecId, day) => {
    const cellKey = `${selectedCategory}_${salesExecId}_${day}`;
    setSavingCells(prev => ({ ...prev, [cellKey]: true }));

    patchQueueRef.current = patchQueueRef.current
      .then(async () => {
        const volume = getInputValue(salesExecId, day, 'volume');
        const mapKey = `${selectedCategory}_${salesExecId}`;
        try {
          const res = await apiRequest(`${Labbaseurl}salesplan/`, "PATCH", {
            'auth-user-id': getAuthUserId(),
            sales_plan_id: planIdMapRef.current[mapKey],
            employee_id: salesExecId,
            category: selectedCategory,
            month: currentMonth,
            year: currentYear,
            day,
            volume: parseFloat(volume) || 0
          });
          if (res?.data?.sales_plan_id) {
            planIdMapRef.current[mapKey] = res.data.sales_plan_id;
          }
        } catch (error) {
          console.error("Error saving cell:", error.message || error);
          showToast(`Failed to save value for day ${day}.`, 'error');
        } finally {
          setSavingCells(prev => {
            const next = { ...prev };
            delete next[cellKey];
            return next;
          });
        }
      });
  };

  const handleWorkingDaysBlur = () => {
    const savingKey = `${selectedCategory}_workingdays`;
    setSavingCells(prev => ({ ...prev, [savingKey]: true }));

    patchQueueRef.current = patchQueueRef.current
      .then(async () => {
        const value = parseInt(workingDays, 10) || 0;

        const results = await Promise.allSettled(salesMappings.map(async (exec) => {
          const rowKey = `${selectedCategory}_${exec.employeeId}`;
          const res = await apiRequest(`${Labbaseurl}salesplan/`, "PATCH", {
            'auth-user-id': getAuthUserId(),
            sales_plan_id: planIdMapRef.current[rowKey],
            employee_id: exec.employeeId,
            category: selectedCategory,
            month: currentMonth,
            year: currentYear,
            working_days: value
          });
          if (res?.data?.sales_plan_id) {
            planIdMapRef.current[rowKey] = res.data.sales_plan_id;
          }
        }));

        const failed = results
          .map((r, idx) => (r.status === 'rejected' ? salesMappings[idx] : null))
          .filter(Boolean);

        if (failed.length > 0) {
          showToast(
            `Failed to save working days for ${failed.length} sales executive(s).`,
            'error'
          );
        }

        setSavingCells(prev => {
          const next = { ...prev };
          delete next[savingKey];
          return next;
        });
      });
  };

  const handleAvgRevenueBlur = () => {
    const savingKey = `${selectedCategory}_avgrevenue`;
    setSavingCells(prev => ({ ...prev, [savingKey]: true }));

    patchQueueRef.current = patchQueueRef.current
      .then(async () => {
        const value = parseFloat(avgRevenuePerPrescription) || 0;

        const results = await Promise.allSettled(salesMappings.map(async (exec) => {
          const rowKey = `${selectedCategory}_${exec.employeeId}`;
          const res = await apiRequest(`${Labbaseurl}salesplan/`, "PATCH", {
            'auth-user-id': getAuthUserId(),
            sales_plan_id: planIdMapRef.current[rowKey],
            employee_id: exec.employeeId,
            category: selectedCategory,
            month: currentMonth,
            year: currentYear,
            avg_revenue_per_prescription: value
          });
          if (res?.data?.sales_plan_id) {
            planIdMapRef.current[rowKey] = res.data.sales_plan_id;
          }
        }));

        const failed = results
          .map((r, idx) => (r.status === 'rejected' ? salesMappings[idx] : null))
          .filter(Boolean);

        if (failed.length > 0) {
          showToast(
            `Failed to save avg revenue per prescription for ${failed.length} sales executive(s).`,
            'error'
          );
        }

        setSavingCells(prev => {
          const next = { ...prev };
          delete next[savingKey];
          return next;
        });
      });
  };

  const getRowTotal = (salesExecId) => {
    let total = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      total += getRevenue(salesExecId, day);
    }
    return total;
  };

  const getGrandTotal = () => {
    let total = 0;
    salesMappings.forEach(exec => {
      total += getRowTotal(exec.employeeId);
    });
    return total;
  };

  const getWeekTotal = (salesExecId, weekNumber) => {
    let total = 0;
    daysArray.forEach(day => {
      const dayWeek = getISOWeek(new Date(currentYear, currentMonth - 1, day));
      if (dayWeek === weekNumber) {
        total += getRevenue(salesExecId, day);
      }
    });
    return total;
  };

  const getWeekGrandTotal = (weekNumber) => {
    let total = 0;
    salesMappings.forEach(exec => {
      total += getWeekTotal(exec.employeeId, weekNumber);
    });
    return total;
  };

  const handleSavePlan = async () => {
    setIsSaving(true);

    const plans = salesMappings.map(exec => ({
      employee_id: exec.employeeId,
      category: selectedCategory,
      month: currentMonth,
      year: currentYear,
      working_days: parseInt(workingDays, 10) || 0,
      avg_revenue_per_prescription: parseFloat(avgRevenuePerPrescription) || 0,
      entries: daysArray
        .map(day => ({
          date: day,
          volume: parseFloat(getInputValue(exec.employeeId, day, 'volume')) || 0
        }))
        .filter(e => e.volume > 0)
    }));

    try {
      await apiRequest(`${Labbaseurl}salesplan/`, "POST", {
        'auth-user-id': getAuthUserId(),
        plans
      });
      showToast(`Sales plan saved successfully! Total: ₹${getGrandTotal().toLocaleString('en-IN')}`, 'success');
    } catch (error) {
      console.error("Error saving plan:", error.message || error);
      showToast("Failed to save sales plan.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "SE";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const grandTotalAmount = getGrandTotal();

  return (
    <Container>
      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <ToastWrapper>
          {toasts.map(toast => (
            <ToastItem key={toast.id} $type={toast.type} $leaving={toast.leaving}>
              {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              {toast.message}
            </ToastItem>
          ))}
        </ToastWrapper>
      )}

      <ContentWrapper>
        {/* Header & Controls Card */}
        <HeaderCard>
          <TopRow>
            <TitleGroup>
              <IconBadge>
                <TrendingUp size={22} />
              </IconBadge>
              <div>
                <Title>Sales Target & Revenue Plan</Title>
                <Subtitle>Configure daily prescription targets, working parameters, and revenue projections</Subtitle>
              </div>
            </TitleGroup>

            <StatsGroup>
              <StatBadge $bg="#f0fdf4" $border="#bbf7d0" $color="#166534" $valColor="#15803d">
                <DollarSign size={16} color="#16a34a" />
                <span>Projected Total:</span>
                <strong>₹{grandTotalAmount.toLocaleString('en-IN')}</strong>
              </StatBadge>
              <StatBadge $bg="#f0f9ff" $border="#bae6fd" $color="#075985" $valColor="#0369a1">
                <Users size={16} color="#0284c7" />
                <span>Executives:</span>
                <strong>{salesMappings.length}</strong>
              </StatBadge>
            </StatsGroup>
          </TopRow>

          {/* Segmented Pill Category Selector */}
          <CategoryTabBar>
            {categories.map((category) => (
              <CategoryTab
                key={category}
                type="button"
                $active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                <Briefcase size={14} />
                {category}
              </CategoryTab>
            ))}
          </CategoryTabBar>

          {/* Filter Controls Row */}
          <ControlsRow>
            <ControlItem>
              <ControlLabel>
                <Calendar size={13} color="#6366f1" />
                Month
              </ControlLabel>
              <StyledSelect
                value={currentMonth}
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </StyledSelect>
            </ControlItem>

            <ControlItem>
              <ControlLabel>
                <Calendar size={13} color="#6366f1" />
                Year
              </ControlLabel>
              <StyledSelect
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
              >
                {[2024, 2025, 2026, 2027].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </StyledSelect>
            </ControlItem>

            <ControlItem>
              <ControlLabel>
                <Layers size={13} color="#6366f1" />
                Working Days
              </ControlLabel>
              <StyledNumberInput
                type="number"
                value={workingDays}
                onChange={(e) => handleWorkingDaysChange(e.target.value)}
                onBlur={handleWorkingDaysBlur}
                placeholder="Days"
                min="0"
                $saving={!!savingCells[`${selectedCategory}_workingdays`]}
              />
            </ControlItem>

            <ControlItem>
              <ControlLabel>
                <DollarSign size={13} color="#6366f1" />
                Avg Revenue / Prescription
              </ControlLabel>
              <InputWrapper>
                <InputPrefix>₹</InputPrefix>
                <StyledNumberInput
                  type="number"
                  $hasPrefix
                  $width="160px"
                  value={avgRevenuePerPrescription}
                  onChange={(e) => handleAvgRevenueChange(e.target.value)}
                  onBlur={handleAvgRevenueBlur}
                  placeholder="0.00"
                  min="0"
                  $saving={!!savingCells[`${selectedCategory}_avgrevenue`]}
                />
              </InputWrapper>
            </ControlItem>
          </ControlsRow>
        </HeaderCard>

        {/* Table Container Card */}
        <TableCard>
          {isLoading ? (
            <EmptyState>
              <TrendingUp size={36} color="#94a3b8" />
              <span>Loading sales plan data...</span>
            </EmptyState>
          ) : salesMappings.length === 0 ? (
            <EmptyState>
              <Users size={36} color="#94a3b8" />
              <span>No sales executives mapped. Please add executives in the master settings.</span>
            </EmptyState>
          ) : (
            <TableWrapper>
              <Table>
                <Thead>
                  {/* Top Header: Sticky Columns & Week Groups */}
                  <tr>
                    <Th sticky $left="0px" align="left" rowSpan={2} minWidth="160px">
                      Sales Executive
                    </Th>
                    <Th sticky $left="160px" align="left" rowSpan={2} minWidth="120px">
                      Metric
                    </Th>
                    {monthWeekGroups.map((group, idx) => {
                      const theme = weekThemes[idx % weekThemes.length];
                      return (
                        <WeekTh
                          key={idx}
                          colSpan={group.count}
                          $bg={theme.bg}
                          $color={theme.color}
                        >
                          <WeekHeaderContent>
                            <WeekTitleBadge>Week {group.weekNumber}</WeekTitleBadge>
                            <WeekRangeText>
                              {formatShortDate(group.weekStart)} – {formatShortDate(group.weekEnd)}
                            </WeekRangeText>
                          </WeekHeaderContent>
                        </WeekTh>
                      );
                    })}
                    <Th rowSpan={2} $isTotal minWidth="110px">
                      Monthly Total
                    </Th>
                  </tr>

                  {/* Sub Header: Daily Columns */}
                  <tr>
                    {daysArray.map(day => {
                      const d = new Date(currentYear, currentMonth - 1, day);
                      const dayOfWeek = d.getDay();
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                      const weekdayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
                      const monthStr = monthNames[currentMonth - 1].slice(0, 3);
                      return (
                        <Th key={day} minWidth="72px">
                          <DayHeaderStack>
                            <DayWeekday $isWeekend={isWeekend}>{weekdayStr}</DayWeekday>
                            <DayNumber>{String(day).padStart(2, '0')} {monthStr}</DayNumber>
                          </DayHeaderStack>
                        </Th>
                      );
                    })}
                  </tr>
                </Thead>

                <Tbody>
                  {salesMappings.map((exec) => (
                    <React.Fragment key={exec.id}>
                      {/* 1. Volume Row */}
                      <Tr>
                        <Td sticky $left="0px" rowSpan={3} align="left">
                          <ExecCell>
                            <ExecAvatar>{getInitials(exec.name)}</ExecAvatar>
                            <ExecName>{exec.name}</ExecName>
                          </ExecCell>
                        </Td>
                        <Td sticky $left="160px" align="left">
                          <MetricLabel $type="volume">
                            <Layers size={13} />
                            Volume
                          </MetricLabel>
                        </Td>
                        {daysArray.map(day => {
                          const cellKey = `${selectedCategory}_${exec.employeeId}_${day}`;
                          return (
                            <Td key={day}>
                              <CellInput
                                type="number"
                                value={getInputValue(exec.employeeId, day, 'volume')}
                                onChange={(e) => handleInputChange(exec.employeeId, day, 'volume', e.target.value)}
                                onBlur={() => handleCellBlur(exec.employeeId, day)}
                                placeholder="0"
                                min="0"
                                $saving={!!savingCells[cellKey]}
                              />
                            </Td>
                          );
                        })}
                        <Td $isTotalCol>
                          <RowTotalBadge>
                            {daysArray.reduce((acc, d) => acc + (parseFloat(getInputValue(exec.employeeId, d, 'volume')) || 0), 0)}
                          </RowTotalBadge>
                        </Td>
                      </Tr>

                      {/* 2. Revenue Row */}
                      <Tr>
                        <Td sticky $left="160px" align="left">
                          <MetricLabel $type="revenue">
                            <DollarSign size={13} />
                            Revenue
                          </MetricLabel>
                        </Td>
                        {daysArray.map(day => {
                          const rev = getRevenue(exec.employeeId, day);
                          return (
                            <Td key={day}>
                              {rev > 0 ? (
                                <RevenuePill>₹{rev.toLocaleString('en-IN')}</RevenuePill>
                              ) : (
                                <span style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>—</span>
                              )}
                            </Td>
                          );
                        })}
                        <Td $isTotalCol>
                          <RowTotalBadge $highlight>
                            ₹{getRowTotal(exec.employeeId).toLocaleString('en-IN')}
                          </RowTotalBadge>
                        </Td>
                      </Tr>

                      {/* 3. Weekly Subtotal Row */}
                      <Tr $isSubtotal>
                        <Td sticky $left="160px" align="left" $isSubtotal>
                          <MetricLabel $type="subtotal">
                            <TrendingUp size={13} />
                            Weekly Total
                          </MetricLabel>
                        </Td>
                        {monthWeekGroups.map((group, idx) => (
                          <Td key={idx} colSpan={group.count} $isSubtotal>
                            <WeekSubtotalBadge>
                              ₹{getWeekTotal(exec.employeeId, group.weekNumber).toLocaleString('en-IN')}
                            </WeekSubtotalBadge>
                          </Td>
                        ))}
                        <Td $isSubtotal $isTotalCol>
                          <RowTotalBadge $highlight>
                            ₹{getRowTotal(exec.employeeId).toLocaleString('en-IN')}
                          </RowTotalBadge>
                        </Td>
                      </Tr>
                    </React.Fragment>
                  ))}

                  {/* Grand Total Row */}
                  <Tr $isGrandTotal>
                    <Td sticky $left="0px" colSpan={2} $isGrandTotal align="left">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.5rem' }}>
                        <TrendingUp size={16} color="#38bdf8" />
                        <span>Overall Total (All Executives)</span>
                      </div>
                    </Td>
                    {monthWeekGroups.map((group, idx) => (
                      <Td key={idx} colSpan={group.count} $isGrandTotal>
                        <GrandTotalBadge $accent>
                          ₹{getWeekGrandTotal(group.weekNumber).toLocaleString('en-IN')}
                        </GrandTotalBadge>
                      </Td>
                    ))}
                    <Td $isGrandTotal $isTotalCol style={{ background: '#0f172a' }}>
                      <GrandTotalBadge $accent style={{ fontSize: '1rem', color: '#fbbf24' }}>
                        ₹{grandTotalAmount.toLocaleString('en-IN')}
                      </GrandTotalBadge>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableWrapper>
          )}

          {/* Table Footer with Summary and Action */}
          <TableFooter>
            <FooterNote>
              <CheckCircle2 size={15} color="#10b981" />
              <span>Changes to individual day cells and monthly parameters auto-save on blur.</span>
            </FooterNote>

            <SaveButton onClick={handleSavePlan} disabled={isSaving}>
              <Save size={16} />
              {isSaving ? 'Saving Plan...' : 'Save Plan'}
            </SaveButton>
          </TableFooter>
        </TableCard>
      </ContentWrapper>
    </Container>
  );
};

export default Salesplan;