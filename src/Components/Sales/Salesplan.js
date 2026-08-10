import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import apiRequest from "../Auth/apiRequest";
import { categories, monthNames } from "../Constantdata/Salesplanconstant";

const slideIn = keyframes`
  from { transform: translate(-50%, -20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translate(-50%, 0); opacity: 1; }
  to { transform: translate(-50%, -20px); opacity: 0; }
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: 1.5rem;
  left: 50%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
`;

const ToastItem = styled.div`
  min-width: 260px;
  max-width: 420px;
  padding: 0.9rem 1.25rem;
  border-radius: 12px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background: ${props => (props.$type === 'error'
    ? 'linear-gradient(135deg, #f5576c 0%, #d92550 100%)'
    : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)')};
  animation: ${props => (props.$leaving ? slideOut : slideIn)} 0.3s ease forwards;
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 100%;
  margin: 0 auto;
`;

const Header = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const CategorySelector = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #374151;
  transition: color 0.3s ease;

  &:hover {
    color: #667eea;
  }
`;

const RadioInput = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  accent-color: #667eea;
  cursor: pointer;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableWrapper = styled.div`
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Th = styled.th`
  padding: 1rem;
  text-align: ${props => props.align || 'center'};
  vertical-align: middle;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  min-width: ${props => props.minWidth || '80px'};

  ${props => props.sticky && `
    position: sticky;
    left: ${props.$left || '0px'};
    z-index: 20;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-right: 2px solid rgba(255, 255, 255, 0.2);
  `}
`;

const Tbody = styled.tbody``;

const WeekTh = styled.th`
  padding: 0.65rem 1rem;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #374151;
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.6);
  background: ${props => props.$bg || '#e5e7eb'};
`;

const WeekRange = styled.div`
  font-size: 0.68rem;
  font-weight: 500;
  color: #4b5563;
  margin-top: 0.15rem;
`;

const Tr = styled.tr`
  transition: background-color 0.2s ease;

  ${props => props.isTotal && `
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    font-weight: 700;
  `}

  ${props => props.isGrandTotal && `
    background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%);
    font-weight: 700;
    font-size: 1.1rem;
  `}

  &:hover {
    background-color: ${props => props.isTotal || props.isGrandTotal ? '' : '#f9fafb'};
  }
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #374151;
  position: relative;

  ${props => props.sticky && `
    position: sticky;
    left: ${props.$left || '0px'};
    z-index: 10;
    background: white;
    border-right: 2px solid #e5e7eb;
    font-weight: 600;
    vertical-align: middle;
  `}

  ${props => props.isTotal && `
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  `}

  ${props => props.isGrandTotal && `
    background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%);
  `}
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid ${props => (props.$saving ? '#fbbf24' : '#e5e7eb')};
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TotalCell = styled.div`
  padding: 0.5rem;
  text-align: center;
  font-weight: 700;
  color: #1f2937;
  font-size: 0.9rem;
`;

const RevenueDisplay = styled.div`
  padding: 0.4rem 0.5rem;
  border-radius: 8px;
  background: #f3f4f6;
  color: #667eea;
  font-weight: 700;
  font-size: 0.8rem;
  text-align: center;
`;

const SaveButton = styled.button`
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  float: right;
  opacity: ${props => (props.disabled ? 0.6 : 1)};

  &:hover {
    transform: ${props => (props.disabled ? 'none' : 'translateY(-2px)')};
    box-shadow: ${props => (props.disabled ? '0 4px 15px rgba(102, 126, 234, 0.3)' : '0 6px 20px rgba(102, 126, 234, 0.4)')};
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoadingText = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
`;

const WorkingDaysFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const WorkingDaysFieldLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const GlobalWorkingDaysInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => (props.$saving ? '#fbbf24' : '#e5e7eb')};
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  width: 140px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Salesplan = () => {
  const [salesMappings, setSalesMappings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('B2B');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // 1-indexed (Jan=1 ... Dec=12) to match backend
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [planData, setPlanData] = useState({});
  // Raw records fetched for the current month/year (all categories),
  // kept around so the global working-days field can be re-derived
  // whenever the selected category changes.
  const [planRecords, setPlanRecords] = useState([]);
  // Single working-days value for the whole month, shared by every
  // sales executive under the selected category — entered once in the
  // Controls row rather than per employee.
  const [workingDays, setWorkingDays] = useState('');
  // Single average-revenue-per-prescription value for the whole month,
  // shared by every sales executive under the selected category —
  // entered once, same pattern as workingDays. Revenue per day is
  // volume * this value (no more per-day revenue-per-cost input).
  const [avgRevenuePerPrescription, setAvgRevenuePerPrescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savingCells, setSavingCells] = useState({});
  const [toasts, setToasts] = useState([]);

  // Shows a toast at the top of the page; auto-dismisses after 4s.
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

  // Matches the employeeId key convention used by get_sales_executives/
  // and the rest of this app — this is the logged-in user's own id.
  const getAuthUserId = () => localStorage.getItem('employeeId');

  // Caches sales_plan_id per category_employeeId so cell PATCHes can hit
  // the record directly instead of relying on the compound employee/
  // category/month/year lookup after the first save.
  const planIdMapRef = useRef({});

  // Chains PATCH calls one after another so a fast tab-through of cells
  // can't fire overlapping requests that read stale data and clobber
  // each other's writes.
  const patchQueueRef = useRef(Promise.resolve());


  // month is 1-indexed (Jan=1...Dec=12). new Date(year, month, 0) uses JS's
  // 0-indexed month param, so passing our 1-indexed month with day 0 lands
  // on the last day of the *previous* (0-indexed) month, i.e. our target month.
  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const daysArray = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Week-of-year, counted as simple sequential 7-day blocks from Jan 1
  // (Week 1 = Jan 1-7, Week 2 = Jan 8-14, ...) rather than ISO weeks —
  // matches how the business wants weeks labeled.
  const getDayOfYear = (date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    return Math.floor((date - start) / 86400000) + 1;
  };

  const getWeekOfYear = (date) => Math.ceil(getDayOfYear(date) / 7);

  // "Jul1", "Oct1"... — short month abbreviation + day, used on the day
  // column headers instead of a bare day number.
  const formatShortDayLabel = (day) => {
    const shortMonth = monthNames[currentMonth - 1].slice(0, 3);
    return `${shortMonth}${day}`;
  };

  const formatShortDate = (date) => {
    const shortMonth = monthNames[date.getMonth()].slice(0, 3);
    return `${shortMonth} ${date.getDate()}`;
  };

  // A week's full start-end date range, even where it extends outside the
  // currently displayed month (e.g. Week 26 = Jun 29 - Jul 5 while viewing
  // July, where only Jul 1-5 have their own day columns).
  const getWeekDateRange = (weekNumber, year) => {
    const yearStart = new Date(year, 0, 1);
    const weekStart = new Date(yearStart.getTime() + (weekNumber - 1) * 7 * 86400000);
    const weekEnd = new Date(weekStart.getTime() + 6 * 86400000);
    return { weekStart, weekEnd };
  };

  // Mild/pastel background colors cycled across adjacent week header cells
  // so weeks are visually distinguishable from one another at a glance.
  const weekColorPalette = ['#FDE68A', '#BFDBFE', '#BBF7D0', '#FBCFE8', '#DDD6FE', '#FED7AA'];

  // Groups the selected month's days under "Week N" header cells so
  // consecutive days sharing a week number get one colSpan-ed cell.
  const monthWeekGroups = useMemo(() => {
    const groups = [];
    daysArray.forEach(day => {
      const weekNumber = getWeekOfYear(new Date(currentYear, currentMonth - 1, day));
      const last = groups[groups.length - 1];
      if (last && last.weekNumber === weekNumber) {
        last.count += 1;
      } else {
        groups.push({ weekNumber, count: 1 });
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

  // Fetch saved plan data whenever month/year changes (all categories at once)
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

  // The working-days value is stored per employee record on the backend,
  // but entered once for the whole category/month/year — every record
  // under the selected category should carry the same value, so read it
  // off the first one found (falls back to blank for a brand-new month).
  useEffect(() => {
    const record = planRecords.find(r => r.category === selectedCategory);
    setWorkingDays(record?.working_days != null ? String(record.working_days) : '');
    setAvgRevenuePerPrescription(
      record?.avg_revenue_per_prescription != null ? String(record.avg_revenue_per_prescription) : ''
    );
  }, [planRecords, selectedCategory]);

  // field is 'volume' (the only per-day editable field now)
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

  // revenue = volume * average revenue per prescription (month-level),
  // recalculated live as either input changes
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

  // PATCH a single cell on blur (upserts the SalesPlan doc for that employee/category/month/year).
  // Queued through patchQueueRef so overlapping edits can't race each other.
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
          // First edit for this employee/category/month/year creates the
          // record — cache its id so later edits go straight to it.
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

  // PATCH the one-time-per-month working-days value on blur, applied to every
  // sales executive's record for the selected category/month/year (no `day`
  // sent — backend updates the plan-level field only, leaving entries
  // untouched). Each employee's document is independent, so these PATCHes
  // still run in parallel; they're chained behind patchQueueRef so they
  // don't race a cell edit that's mid-flight for the same document.
  //
  // Uses Promise.allSettled (not Promise.all) so one employee's request
  // failing doesn't hide whether the others succeeded — with N parallel
  // creates firing on a brand-new month, a single transient failure
  // (network blip, etc.) shouldn't read as "nothing saved." The backend's
  // sales_plan_id assignment is now atomic (see get_next_sequence_value
  // in the backend), which was the actual cause of intermittent
  // lost/duplicated records under this exact parallel-create pattern.
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
          results.forEach((r, idx) => {
            if (r.status === 'rejected') {
              console.error(
                `Error saving working days for ${salesMappings[idx].name}:`,
                r.reason?.message || r.reason
              );
            }
          });
          showToast(
            `Failed to save working days for ${failed.length} of ${salesMappings.length} sales executive(s): ${failed.map(f => f.name).join(', ')}.`,
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

  // PATCH the one-time-per-month average-revenue-per-prescription value on
  // blur, applied to every sales executive's record for the selected
  // category/month/year — same pattern as handleWorkingDaysBlur.
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
          results.forEach((r, idx) => {
            if (r.status === 'rejected') {
              console.error(
                `Error saving avg revenue per prescription for ${salesMappings[idx].name}:`,
                r.reason?.message || r.reason
              );
            }
          });
          showToast(
            `Failed to save avg revenue per prescription for ${failed.length} of ${salesMappings.length} sales executive(s): ${failed.map(f => f.name).join(', ')}.`,
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

  // Calculate row total (revenue) for a sales executive
  const getRowTotal = (salesExecId) => {
    let total = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      total += getRevenue(salesExecId, day);
    }
    return total;
  };

  // Calculate grand total for the selected category
  const getGrandTotal = () => {
    let total = 0;
    salesMappings.forEach(exec => {
      total += getRowTotal(exec.employeeId);
    });
    return total;
  };

  // Total revenue for one sales executive within a single week (week
  // numbers come from monthWeekGroups, so this always matches the header)
  const getWeekTotal = (salesExecId, weekNumber) => {
    let total = 0;
    daysArray.forEach(day => {
      const dayWeek = getWeekOfYear(new Date(currentYear, currentMonth - 1, day));
      if (dayWeek === weekNumber) {
        total += getRevenue(salesExecId, day);
      }
    });
    return total;
  };

  // Total revenue across every sales executive for a single week
  const getWeekGrandTotal = (weekNumber) => {
    let total = 0;
    salesMappings.forEach(exec => {
      total += getWeekTotal(exec.employeeId, weekNumber);
    });
    return total;
  };

  // Bulk save the entire grid for the currently selected category
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
      showToast(`Sales plan saved successfully! Total: ₹${getGrandTotal().toLocaleString()}`, 'success');
    } catch (error) {
      console.error("Error saving plan:", error.message || error);
      showToast("Failed to save sales plan.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <ToastWrapper>
        {toasts.map(toast => (
          <ToastItem key={toast.id} $type={toast.type} $leaving={toast.leaving}>
            {toast.message}
          </ToastItem>
        ))}
      </ToastWrapper>
      <ContentWrapper>
        <Header>
          <Title>Sales Management System</Title>

          <Controls>
            <Select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(Number(e.target.value))}
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
              ))}
            </Select>
            <Select
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
            >
              {[2024, 2025, 2026, 2027].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
            <WorkingDaysFieldWrapper>
              <WorkingDaysFieldLabel>Working Days</WorkingDaysFieldLabel>
              <GlobalWorkingDaysInput
                type="number"
                value={workingDays}
                onChange={(e) => handleWorkingDaysChange(e.target.value)}
                onBlur={handleWorkingDaysBlur}
                placeholder="No. of days"
                min="0"
                $saving={!!savingCells[`${selectedCategory}_workingdays`]}
              />
            </WorkingDaysFieldWrapper>
            <WorkingDaysFieldWrapper>
              <WorkingDaysFieldLabel>Avg Revenue / Prescription</WorkingDaysFieldLabel>
              <GlobalWorkingDaysInput
                type="number"
                value={avgRevenuePerPrescription}
                onChange={(e) => handleAvgRevenueChange(e.target.value)}
                onBlur={handleAvgRevenueBlur}
                placeholder="₹ per prescription"
                min="0"
                $saving={!!savingCells[`${selectedCategory}_avgrevenue`]}
              />
            </WorkingDaysFieldWrapper>
          </Controls>

          <CategorySelector>
            {categories.map((category) => (
              <RadioLabel key={category}>
                <RadioInput
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                <span>{category}</span>
              </RadioLabel>
            ))}
          </CategorySelector>
        </Header>

        <TableContainer>
          {isLoading ? (
            <LoadingText>Loading sales plan…</LoadingText>
          ) : (
            <TableWrapper>
              <Table>
                <Thead>
                  <tr>
                    <Th sticky $left="0px" align="left" rowSpan={2} minWidth="150px">Sales Executive</Th>
                    <Th sticky $left="150px" align="left" rowSpan={2} minWidth="170px">Metric</Th>
                    {monthWeekGroups.map((group, idx) => {
                      const { weekStart, weekEnd } = getWeekDateRange(group.weekNumber, currentYear);
                      return (
                        <WeekTh
                          key={idx}
                          colSpan={group.count}
                          $bg={weekColorPalette[idx % weekColorPalette.length]}
                        >
                          Week {group.weekNumber}
                          <WeekRange>{formatShortDate(weekStart)} - {formatShortDate(weekEnd)}</WeekRange>
                        </WeekTh>
                      );
                    })}
                    <Th rowSpan={2}>Total</Th>
                  </tr>
                  <tr>
                    {daysArray.map(day => (
                      <Th key={day} minWidth="100px">{formatShortDayLabel(day)}</Th>
                    ))}
                  </tr>
                </Thead>
                <Tbody>
                  {salesMappings.map((exec) => (
                    <React.Fragment key={exec.id}>
                      <Tr>
                        <Td sticky $left="0px" rowSpan={3}>{exec.name}</Td>
                        <Td sticky $left="150px">Volume</Td>
                        {daysArray.map(day => {
                          const cellKey = `${selectedCategory}_${exec.employeeId}_${day}`;
                          return (
                            <Td key={day}>
                              <Input
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
                        <Td />
                      </Tr>
                      <Tr>
                        <Td sticky $left="150px">Revenue</Td>
                        {daysArray.map(day => (
                          <Td key={day}>
                            <RevenueDisplay>₹{getRevenue(exec.employeeId, day).toLocaleString()}</RevenueDisplay>
                          </Td>
                        ))}
                        <Td>
                          <TotalCell>₹{getRowTotal(exec.employeeId).toLocaleString()}</TotalCell>
                        </Td>
                      </Tr>
                      <Tr isTotal>
                        <Td sticky $left="150px" isTotal>Weekly Total</Td>
                        {monthWeekGroups.map((group, idx) => (
                          <Td key={idx} colSpan={group.count} isTotal>
                            <TotalCell>
                              ₹{getWeekTotal(exec.employeeId, group.weekNumber).toLocaleString()}
                            </TotalCell>
                          </Td>
                        ))}
                        <Td isTotal>
                          <TotalCell>₹{getRowTotal(exec.employeeId).toLocaleString()}</TotalCell>
                        </Td>
                      </Tr>
                    </React.Fragment>
                  ))}
                  <Tr isGrandTotal>
                    <Td sticky $left="0px" colSpan={2} isGrandTotal>Overall Total (All Sales Executives)</Td>
                    {monthWeekGroups.map((group, idx) => (
                      <Td key={idx} colSpan={group.count} isGrandTotal>
                        <TotalCell>₹{getWeekGrandTotal(group.weekNumber).toLocaleString()}</TotalCell>
                      </Td>
                    ))}
                    <Td isGrandTotal>
                      <TotalCell>₹{getGrandTotal().toLocaleString()}</TotalCell>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableWrapper>
          )}
        </TableContainer>

        <SaveButton onClick={handleSavePlan} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Plan'}
        </SaveButton>
      </ContentWrapper>
    </Container>
  );
};

export default Salesplan;