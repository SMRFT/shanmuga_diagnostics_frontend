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

const toastSlideIn = keyframes`
  from { transform: translateX(400px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const toastSlideOut = keyframes`
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(400px); opacity: 0; }
`;

// ============ Styled Components ============
const PageContainer = styled.div`
  padding: 2rem;
  min-height: 100vh;
  font-family: 'Outfit', 'Inter', sans-serif;
  @media (max-width: 768px) { padding: 1rem; }
`;

const MainContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormCard = styled.div`
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(14,165,233,0.15);
  border: 1px solid rgba(255,255,255,0.6);
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
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
    inset: 0;
    background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }
`;

const HeaderContent = styled.div`position: relative; z-index: 1;`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const IconWrapper = styled.div`
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  width: 56px; height: 56px;
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  color: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  svg { stroke-width: 2.5px; }
`;

const Title = styled.h1`
  font-size: 1.9rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: rgba(255,255,255,0.9);
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
  margin-left: 72px;
`;

const FormBody = styled.form`
  padding: 2.5rem;
  @media (max-width: 768px) { padding: 1.5rem; }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
  @media (min-width: 768px) {
    grid-template-columns: ${props => props.columns || '1fr 1fr'};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  ${props => props.required && `&::after { content: '*'; color: #ef4444; font-size: 1rem; }`}
`;

const InputWrapper = styled.div`position: relative; width: 100%;`;

const InputIcon = styled.div`
  position: absolute;
  left: 14px; top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  pointer-events: none;
  z-index: 1;
`;

const baseInputStyles = `
  width: 100%;
  padding: 13px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #334155;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #f8fafc;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 4px rgba(14,165,233,0.1);
  }
  &:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Select = styled.select`
  ${baseInputStyles}
  padding-left: ${props => props.hasIcon ? '44px' : '14px'};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%230ea5e9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 40px;
  &:hover:not(:disabled) { border-color: #667eea; }
  option { padding: 10px; background: white; }
`;

const Input = styled.input`
  ${baseInputStyles}
  padding-left: ${props => props.hasIcon ? '44px' : '14px'};
`;

const StatusBadgeWrapper = styled.div`display: flex; align-items: center; gap: 0.75rem;`;

const StatusBadge = styled.div`
  padding: 12px 18px;
  background: linear-gradient(135deg, rgba(14,165,233,0.1), rgba(59,130,246,0.1));
  border: 1.5px solid rgba(14,165,233,0.3);
  border-radius: 12px;
  color: #764ba2;
  font-size: 0.9rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.3px;
`;

const StatusDot = styled.div`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #667eea;
  box-shadow: 0 0 8px #764ba2;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  @media (max-width: 640px) { flex-direction: column; }
`;

const Button = styled.button`
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex: 1;
  letter-spacing: 0.3px;
  &:active:not(:disabled) { transform: translateY(1px); }
  &:disabled { cursor: not-allowed; opacity: 0.6; }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  color: white;
  box-shadow: 0 4px 20px rgba(14,165,233,0.4);
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(14,165,233,0.5); }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: #64748b;
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  &:hover:not(:disabled) {
    background: #f8fafc; border-color: #cbd5e1; color: #475569;
    transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
`;

const LoadingSpinner = styled.div`
  width: 18px; height: 18px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 0.7s linear infinite;
`;

// ============ Toast ============
const ToastContainer = styled.div`
  position: fixed;
  top: 2rem; right: 2rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  pointer-events: none;
  @media (max-width: 768px) { top: 1rem; right: 1rem; left: 1rem; }
`;

const Toast = styled.div`
  min-width: 320px; max-width: 450px;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: auto;
  animation: ${props => props.isExiting ? toastSlideOut : toastSlideIn} 0.3s ease-out;
  backdrop-filter: blur(10px);
  border: 1.5px solid;
  background: ${props => props.type === 'success'
    ? 'linear-gradient(135deg, rgba(34,197,94,0.95), rgba(22,163,74,0.95))'
    : 'linear-gradient(135deg, rgba(239,68,68,0.95), rgba(220,38,38,0.95))'};
  border-color: ${props => props.type === 'success'
    ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'};
  @media (max-width: 768px) { min-width: auto; width: 100%; }
`;

const ToastIconWrapper = styled.div`
  flex-shrink: 0; width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center; color: white;
`;
const ToastContent = styled.div`flex: 1; display: flex; flex-direction: column; gap: 2px;`;
const ToastTitle   = styled.div`font-size: 0.95rem; font-weight: 700; color: white; letter-spacing: 0.3px;`;
const ToastMessage = styled.div`font-size: 0.85rem; font-weight: 500; color: rgba(255,255,255,0.9); line-height: 1.4;`;
const ToastCloseButton = styled.button`
  flex-shrink: 0; width: 24px; height: 24px;
  border: none; background: rgba(255,255,255,0.2); border-radius: 6px;
  color: white; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.3); }
`;

// ============ Table Styles ============
const TableCard = styled(FormCard)`margin-top: 0; overflow: hidden;`;

const TableHeader = styled.div`
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

/* ── NEW: from-to date range row ── */
const DateRangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 480px) {
    flex-direction: row;     /* 🔥 keep in row */
    flex-wrap: nowrap;
    overflow-x: auto;
  }
`;

const DateRangeLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
`;

const DateRangeSeparator = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
`;

const DateInput = styled.input`
  ${baseInputStyles}
  width: 150px;
  padding: 10px 13px;
  border-radius: 10px;
  font-size: 0.88rem;
`;

const FilterButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  white-space: nowrap;
  &:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(14,165,233,0.4); }
  &:active { transform: translateY(0); }
`;

const TableScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1.5rem;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar { height: 8px; }
  &::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

  @media (max-width: 768px) { padding: 1rem; }
`;

const Table = styled.table`
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const TableHead = styled.thead`
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  transition: background 0.2s;
  &:last-child { border-bottom: none; }
  &:hover { background: #f8fafc; }
`;

const TableHeaderCell = styled.th`
  padding: 1rem 1.25rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  white-space: nowrap;
`;

const TableCell = styled.td`
  padding: 1rem 1.25rem;
  font-size: 0.9rem;
  color: #334155;
  font-weight: 500;
  white-space: nowrap;
`;

const TableStatusBadge = styled.div`
  padding: 5px 11px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;

  background: ${({ status }) =>
    status === 'Assigned'  ? 'rgba(14,165,233,0.1)'  :
    status === 'Accepted'  ? 'rgba(251,191,36,0.1)'  :
    status === 'PickedUp'  ? 'rgba(34,197,94,0.1)'   :
    'rgba(148,163,184,0.1)'};

  border: 1.5px solid ${({ status }) =>
    status === 'Assigned'  ? 'rgba(14,165,233,0.3)'  :
    status === 'Accepted'  ? 'rgba(251,191,36,0.3)'  :
    status === 'PickedUp'  ? 'rgba(34,197,94,0.3)'   :
    'rgba(148,163,184,0.3)'};

  color: ${({ status }) =>
    status === 'Assigned'  ? '#0369a1'  :
    status === 'Accepted'  ? '#b45309'  :
    status === 'PickedUp'  ? '#15803d'  :
    '#475569'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: #94a3b8;
  font-size: 0.95rem;
  font-weight: 500;

  .emoji { font-size: 2.5rem; margin-bottom: 0.75rem; }
  .msg   { color: #475569; font-weight: 600; font-size: 1rem; margin-bottom: 0.35rem; }
  .sub   { font-size: 0.85rem; }
`;

// ============ Icons ============
const ClipboardIcon   = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const BuildingIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M9 8h1m-1 4h1m-1 4h1M15 8h1m-1 4h1m-1 4h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const UserIcon        = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const TruckIcon       = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8 0h2m-2 0a1 1 0 001 1h2a1 1 0 001-1m0 0h1a1 1 0 001-1v-4m0 0h-5m5 0a2 2 0 00-2-2h-2a2 2 0 00-2 2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const CheckCircleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const AlertCircleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const RefreshIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const TableIcon       = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3V3zm0 6h18M9 3v18" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const CloseIcon       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const SearchIcon      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const CalendarIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

// ============ Toast Component ============
const ToastNotification = ({ toasts, removeToast }) => (
  <ToastContainer>
    {toasts.map(t => (
      <Toast key={t.id} type={t.type} isExiting={t.isExiting}>
        <ToastIconWrapper>{t.type === 'success' ? <CheckCircleIcon/> : <AlertCircleIcon/>}</ToastIconWrapper>
        <ToastContent>
          <ToastTitle>{t.type === 'success' ? 'Success!' : 'Error'}</ToastTitle>
          <ToastMessage>{t.message}</ToastMessage>
        </ToastContent>
        <ToastCloseButton onClick={() => removeToast(t.id)}><CloseIcon/></ToastCloseButton>
      </Toast>
    ))}
  </ToastContainer>
);

// ============ Main Component ============
const LogisticsTaskAssign = () => {
  const today = new Date().toISOString().split('T')[0];

  const [clinicalNames,     setClinicalNames]     = useState([]);
  const [sampleCollectors,  setSampleCollectors]  = useState([]);
  const [tasks,             setTasks]             = useState([]);
  const [toasts,            setToasts]            = useState([]);

  /* ── NEW: from–to date range ── */
  const [dateRange, setDateRange] = useState({ from: today, to: today });
  /* tracks what was last fetched (to avoid re-fetching on every keystroke) */
  const [appliedRange, setAppliedRange] = useState({ from: today, to: today });

  const [formData, setFormData] = useState({
    clinicalname: '',
    sample_collector: '',
    sales_person: '',
    sampleordertime: '',
    sampleacceptedtime: '',
    samplepickeduptime: '',
    remarks: '',
  });

  const [reassigningTask, setReassigningTask] = useState(null); // stores task_id of task being reassigned
  const [newCollector, setNewCollector] = useState('');
  const [isReassignLoading, setIsReassignLoading] = useState(false);

  const [loading,            setLoading]            = useState(false);
  const [fetchingTasks,      setFetchingTasks]      = useState(true);
  const [fetchingCollectors, setFetchingCollectors] = useState(true);
  const [fetchingNames,      setFetchingNames]      = useState(true);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // ── Toast helpers ──
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, isExiting: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, isExiting: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, isExiting: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
  };

  useEffect(() => {
    fetchClinicalNames();
    fetchSampleCollectors();
    fetchTasks(today, today);    // initial load: today's tasks
  }, []);

  useEffect(() => {
    if (formData.clinicalname) fetchSalesMapping(formData.clinicalname);
    else setFormData(prev => ({ ...prev, sales_person: '' }));
  }, [formData.clinicalname]);

  // ── API calls ──
  const fetchClinicalNames = async () => {
    try {
      setFetchingNames(true);
      const response = await apiRequest(`${Labbaseurl}clinical_name/`, 'GET', null, null);
      const labs =
        Array.isArray(response)             ? response :
        Array.isArray(response?.data)       ? response.data :
        Array.isArray(response?.results)    ? response.results :
        Array.isArray(response?.clinicalNames) ? response.clinicalNames : [];
      setClinicalNames(labs);
    } catch (err) {
      console.error('Error fetching clinical names:', err);
      showToast('Failed to load lab names.', 'error');
      setClinicalNames([]);
    } finally { setFetchingNames(false); }
  };

  const fetchSampleCollectors = async () => {
    try {
      setFetchingCollectors(true);
      const response = await apiRequest(`${Labbaseurl}sample-collector/`, 'GET', null, null);
      let collectors = [];
      if (response?.data?.collectors) {
        collectors = Array.isArray(response.data.collectors)
          ? response.data.collectors
          : Object.values(response.data.collectors);
      } else if (Array.isArray(response))         collectors = response;
      else if (Array.isArray(response?.data))      collectors = response.data;
      else if (Array.isArray(response?.results))   collectors = response.results;
      // Keep the full object to use employeeId as value and employeeName as label
      collectors = collectors.map(c => {
        if (typeof c === 'object' && c !== null) {
          return { employeeId: c.employeeId || '', employeeName: c.employeeName || c.name || '' };
        }
        return { employeeId: c, employeeName: c }; // fallback for strings
      }).filter(c => c.employeeName.trim() !== '');
      
      setSampleCollectors(collectors);
    } catch (err) {
      console.error('Error fetching sample collectors:', err);
      showToast('Failed to load sample collectors.', 'error');
      setSampleCollectors([]);
    } finally { setFetchingCollectors(false); }
  };

  /* ── CORE FIX: pass start_date + end_date to backend ── */
  const fetchTasks = async (from, to) => {
    try {
      setFetchingTasks(true);
      const response = await apiRequest(
        `${Labbaseurl}logistics/?start_date=${from}&end_date=${to}`,
        'GET'
      );
      const tasksData = Array.isArray(response?.data?.results)
        ? response.data.results
        : Array.isArray(response?.results)
        ? response.results
        : [];
      setTasks(tasksData);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setTasks([]);
    } finally { setFetchingTasks(false); }
  };

  const fetchSalesMapping = async (clinicalName) => {
    try {
      const clinic = clinicalNames.find(item => item.clinicalname === clinicalName);
      if (clinic?.salesMapping) {
        setFormData(prev => ({ ...prev, sales_person: clinic.salesMapping }));
      } else {
        const data = await apiRequest(`${Labbaseurl}clinical_name/`, 'GET', null, { clinicalname: clinicalName });
        const sp = Array.isArray(data) && data.length > 0 ? data[0].salesMapping : data?.salesMapping;
        setFormData(prev => ({ ...prev, sales_person: sp || '' }));
      }
    } catch (err) {
      console.error('Error fetching sales mapping:', err);
      setFormData(prev => ({ ...prev, sales_person: '' }));
    }
  };

  /* ── Apply date filter ── */
  const handleApplyFilter = () => {
    if (!dateRange.from || !dateRange.to) { showToast('Please select both From and To dates.', 'error'); return; }
    if (dateRange.from > dateRange.to)    { showToast('From date cannot be after To date.', 'error'); return; }
    setAppliedRange({ ...dateRange });
    fetchTasks(dateRange.from, dateRange.to);
  };

  // ── Form handlers ──
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.clinicalname.trim())    { showToast('Please select a lab name', 'error');         return false; }
    if (!formData.sample_collector.trim()){ showToast('Please select a sample collector', 'error'); return false; }
    if (!formData.sales_person.trim())    { showToast('Sales person is required', 'error');         return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = {
        date:               today,
        clinicalname:       formData.clinicalname,
        sample_collector:   formData.sample_collector,
        sales_person:       formData.sales_person,
        sampleordertime:    formData.sampleordertime || new Date().toISOString(),
        sampleacceptedtime: formData.sampleacceptedtime || '',
        samplepickeduptime: formData.samplepickeduptime || '',
      };
      await apiRequest(`${Labbaseurl}logistics/`, 'POST', payload, null);
      showToast('Task assigned successfully!', 'success');
      setFormData({ clinicalname:'', sample_collector:'', sales_person:'', sampleordertime:'', sampleacceptedtime:'', samplepickeduptime:'', remarks:'' });
      // Refresh with currently applied range
      fetchTasks(appliedRange.from, appliedRange.to);
    } catch (err) {
      showToast(err.message || 'Failed to assign task.', 'error');
    } finally { setLoading(false); }
  };

  const handleReassign = async () => {
    if (!reassigningTask || !newCollector) {
      showToast('Please select a new collector', 'error');
      return;
    }
    setIsReassignLoading(true);
    try {
      await apiRequest(`${Labbaseurl}logistics/reassign/${reassigningTask}/`, 'PATCH', {
        new_collector: newCollector
      });
      showToast('Task reassigned successfully!', 'success');
      setReassigningTask(null);
      setNewCollector('');
      fetchTasks(appliedRange.from, appliedRange.to);
    } catch (err) {
      showToast(err.message || 'Failed to reassign task.', 'error');
    } finally {
      setIsReassignLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ clinicalname:'', sample_collector:'', sales_person:'', sampleordertime:'', sampleacceptedtime:'', samplepickeduptime:'', remarks:'' });
  };

  const formatDate = (ds) => {
    if (!ds) return 'N/A';
    return new Date(ds).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  };

  const formatTime = (ds) => {
    if (!ds) return '—';
    const d = new Date(ds);
    return isNaN(d.getTime()) ? '—' : d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
  };

  const formatDisplayDate = (ds) => {
    if (!ds) return '';
    return new Date(ds + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  };

  // ── Render ──
  return (
    <PageContainer>
      <ToastNotification toasts={toasts} removeToast={removeToast} />
      <MainContent>

        {/* Assignment Form */}
        <FormCard>
          <Header>
            <HeaderContent>
              <TitleGroup>
                <IconWrapper><ClipboardIcon/></IconWrapper>
                <Title>Assign Sample Collection Task</Title>
              </TitleGroup>
              <Subtitle>Coordinate sample collection logistics with ease</Subtitle>
            </HeaderContent>
          </Header>

          <FormBody onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label required>Lab Name</Label>
                <InputWrapper>
                  <InputIcon><BuildingIcon/></InputIcon>
                  <Select name="clinicalname" value={formData.clinicalname} onChange={handleInputChange} required hasIcon>
                    <option value="">Select Lab</option>
                    {clinicalNames.map((lab, i) => (
                      <option key={i} value={lab.clinicalname}>{lab.clinicalname}</option>
                    ))}
                  </Select>
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label required>Sales Person</Label>
                <InputWrapper>
                  <InputIcon><UserIcon/></InputIcon>
                  <Input type="text" value={formData.sales_person} disabled placeholder="Auto-filled from Lab Name" hasIcon/>
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label required>Sample Collector</Label>
                <InputWrapper>
                  <InputIcon><TruckIcon/></InputIcon>
                  <Select name="sample_collector" value={formData.sample_collector} onChange={handleInputChange} required hasIcon>
                    <option value="">{fetchingCollectors ? 'Loading collectors...' : 'Select Collector'}</option>
                    {sampleCollectors.map((c, i) => <option key={i} value={c.employeeId}>{c.employeeName}</option>)}
                  </Select>
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label>Status</Label>
                <StatusBadgeWrapper>
                  <StatusBadge><StatusDot/> Assigned</StatusBadge>
                </StatusBadgeWrapper>
              </FormGroup>
            </FormGrid>

            <ButtonGroup>
              <SecondaryButton type="button" onClick={handleReset} disabled={loading}>
                <RefreshIcon/> Reset Form
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={loading}>
                {loading ? <><LoadingSpinner/> Assigning Task...</> : <><CheckCircleIcon/> Assign Task</>}
              </PrimaryButton>
            </ButtonGroup>
          </FormBody>
        </FormCard>

        {/* Tasks Table */}
        <TableCard>
          <Header>
            <HeaderContent>
              <TitleGroup>
                <IconWrapper><TableIcon/></IconWrapper>
                <Title>Logistics Tasks</Title>
              </TitleGroup>
              <Subtitle>View sample collection tasks by date range</Subtitle>
            </HeaderContent>
          </Header>

          <TableHeader>

            {/* ── From – To date range filter ── */}
            <DateRangeRow>
              <DateRangeLabel>From</DateRangeLabel>
              <DateInput
                type="date"
                value={dateRange.from}
                max={dateRange.to || today}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              />
              <DateRangeSeparator>→</DateRangeSeparator>
              <DateRangeLabel>To</DateRangeLabel>
              <DateInput
                type="date"
                value={dateRange.to}
                min={dateRange.from}
                max={today}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              />
              <FilterButton type="button" onClick={handleApplyFilter}>
                <SearchIcon/> Search
              </FilterButton>
            </DateRangeRow>
          </TableHeader>

          <TableScrollWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>S.No</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Lab Name</TableHeaderCell>
                  <TableHeaderCell>Sample Collector</TableHeaderCell>
                  <TableHeaderCell>Reassigned To</TableHeaderCell>
                  <TableHeaderCell>Sales Person</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Order Time</TableHeaderCell>
                  <TableHeaderCell>Accepted Time</TableHeaderCell>
                  <TableHeaderCell>PickedUp Time</TableHeaderCell>
                  <TableHeaderCell>Remarks</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHead>

              <tbody>
                {fetchingTasks ? (
                  <TableRow>
                    <TableCell colSpan="12" style={{ textAlign:'center', color:'#94a3b8', padding:'2rem' }}>
                      <LoadingSpinner style={{ margin:'0 auto', borderTopColor:'#0ea5e9', borderColor:'rgba(14,165,233,0.2)' }}/>
                      <div style={{ marginTop:'0.5rem' }}>Loading tasks…</div>
                    </TableCell>
                  </TableRow>
                ) : tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="12" style={{ padding:0 }}>
                      <EmptyState>
                        <div className="emoji">📋</div>
                        <div className="msg">No tasks found</div>
                        <div className="sub">
                          {appliedRange.from === appliedRange.to
                            ? `No records for ${formatDisplayDate(appliedRange.from)}`
                            : `No records between ${formatDisplayDate(appliedRange.from)} and ${formatDisplayDate(appliedRange.to)}`}
                        </div>
                      </EmptyState>
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{formatDate(task.date || task.created_date)}</TableCell>
                      <TableCell>{task.clinicalname}</TableCell>
                      <TableCell>{sampleCollectors.find(c => c.employeeId === task.sample_collector)?.employeeName || task.sample_collector}</TableCell>
                      <TableCell>{task.reassigned_to || '—'}</TableCell>
                      <TableCell>{task.sales_person}</TableCell>
                      <TableCell>
                        <TableStatusBadge status={task.status}>
                          {(task.remarks && task.remarks.includes('REJECTED')) ? 'Rejected' : task.status}
                        </TableStatusBadge>
                      </TableCell>
                      <TableCell>{formatTime(task.sampleordertime)}</TableCell>
                      <TableCell>{formatTime(task.sampleacceptedtime)}</TableCell>
                      <TableCell>{formatTime(task.samplepickeduptime)}</TableCell>
                      <TableCell>{task.remarks || '—'}</TableCell>
                      <TableCell>
                        {(task.remarks && task.remarks.includes('REJECTED')) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {reassigningTask === task.task_id ? (
                              <>
                                <Select 
                                  style={{ width: '150px', padding: '5px' }}
                                  value={newCollector}
                                  onChange={(e) => setNewCollector(e.target.value)}
                                >
                                  <option value="">Select Collector</option>
                                  {sampleCollectors.map((c, i) => <option key={i} value={c.employeeId}>{c.employeeName}</option>)}
                                </Select>
                                <FilterButton 
                                   style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                                   onClick={handleReassign}
                                   disabled={isReassignLoading}
                                >
                                  {isReassignLoading ? '...' : '→'}
                                </FilterButton>
                                <SecondaryButton 
                                   style={{ padding: '5px 10px', fontSize: '0.75rem', minWidth: 'auto' }}
                                   onClick={() => setReassigningTask(null)}
                                >
                                  ✕
                                </SecondaryButton>
                              </>
                            ) : (
                              <FilterButton 
                                title="Reassign Task"
                                onClick={() => {
                                  setReassigningTask(task.task_id);
                                  setNewCollector('');
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>
                              </FilterButton>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </tbody>
            </Table>
          </TableScrollWrapper>
        </TableCard>

      </MainContent>
    </PageContainer>
  );
};

export default LogisticsTaskAssign;