import React, { useState, useEffect } from 'react';
import apiRequest from '../Auth/apiRequest';
import styled, { keyframes, css } from 'styled-components';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { 
  Edit2, Trash2, Save, X, FileText, Building2, 
  CalendarRange, CheckSquare, Receipt, AlertCircle,
  Filter, RotateCcw, ChevronDown, Check, History, Clock, Printer
} from 'lucide-react';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  bg: '#ffffff',
  surface: '#ffffff',
  surfaceOffset: '#fcfcfb',
  border: 'rgba(0, 0, 0, 0.08)',
  divider: '#f0eeea',
  text: '#1e1c17',
  textMuted: '#6b6964',
  textFaint: '#b0aea9',
  textInverse: '#f9f8f4',
  primary: '#01696f',
  primaryHover: '#0c4e54',
  primaryLight: '#e8f4f4',
  success: '#437a22',
  successLight: '#eef4e8',
  error: '#9b2a2a',
  errorLight: '#fdf0f0',
  blue: '#006494',
  blueLight: '#e8f3fa',
  warning: '#875f00',
  warningLight: '#fdf6e3',
  font: "'Satoshi', 'Inter', -apple-system, sans-serif",
  r: { sm: '6px', md: '8px', lg: '12px', xl: '16px', full: '9999px' },
  shadowSm: '0 1px 2px rgba(0,0,0,0.06)',
  shadowMd: '0 4px 12px rgba(0,0,0,0.08)',
  shadowLg: '0 8px 24px rgba(0,0,0,0.10)',
};

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// ─── Styled Components ────────────────────────────────────────────────────────
const PageWrapper = styled.div`
  font-family: ${T.font};
  background: ${T.bg};
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px;
  color: ${T.text};
  overflow: hidden;

  @media (max-height: 600px) {
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 16px;
  @media (max-width: 768px) { flex-direction: column; }
`;

const TitleGroup = styled.div``;

const PageTitle = styled.h1`
  font-weight: 800;
  fontSize: clamp(1.25rem, 2.5vw, 1.75rem);
  letter-spacing: -0.02em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${T.text};
`;

const PageSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${T.textMuted};
  font-weight: 500;
  margin-top: 6px;
`;

const KPICard = styled.div`
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: ${T.r.xl};
  padding: 16px 24px;
  box-shadow: ${T.shadowSm};
  text-align: right;
  min-width: 200px;
`;

const KPILabel = styled.div`
  font-size: 0.65rem;
  font-weight: 800;
  color: ${T.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
`;

const KPIValue = styled.div`
  font-weight: 800;
  font-size: 1.5rem;
  color: ${T.primary};
  letter-spacing: -0.03em;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 32px;
  border-bottom: 1px solid ${T.divider};
  margin-bottom: 24px;
`;

const TabItem = styled.div`
  padding: 12px 4px;
  font-weight: 700;
  font-size: 0.875rem;
  color: ${props => props.active ? T.primary : T.textMuted};
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 3px;
    background: ${T.primary};
    border-radius: 3px 3px 0 0;
    opacity: ${props => props.active ? 1 : 0};
    transition: opacity 0.2s;
  }
`;

const Card = styled.div`
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: ${T.r.xl};
  padding: ${props => props.compact ? '0' : '24px'};
  box-shadow: ${T.shadowSm};
  margin-bottom: ${props => props.noMargin ? '0' : '24px'};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  ${props => props.flex && css`
    flex: 1; 
    min-height: 300px;
  `}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.cols || 1}, 1fr);
  gap: ${props => props.gap || '16px'};
  align-items: ${props => props.align || 'stretch'};
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${T.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border-radius: ${T.r.lg};
  border: 1px solid ${T.border};
  font-family: ${T.font};
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
  
  &:focus {
    border-color: ${T.primary};
    box-shadow: 0 0 0 3px ${T.primary}15;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 14px;
  border-radius: ${T.r.lg};
  border: 1px solid ${T.border};
  font-family: ${T.font};
  font-size: 0.875rem;
  outline: none;
  background: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b6964' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  transition: all 0.2s;

  &:focus {
    border-color: ${T.primary};
    box-shadow: 0 0 0 3px ${T.primary}15;
  }
`;

const Button = styled.button`
  font-family: ${T.font};
  font-weight: 700;
  font-size: 0.813rem;
  padding: 10px 20px;
  border-radius: ${T.r.lg};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  border: 1px solid transparent;
  white-space: nowrap;

  ${props => props.variant === 'primary' && css`
    background: ${T.primary};
    color: white;
    &:hover:not(:disabled) { background: ${T.primaryHover}; transform: translateY(-1px); }
  `}

  ${props => props.variant === 'success' && css`
    background: ${T.success};
    color: white;
    &:hover:not(:disabled) { background: #2e5c10; transform: translateY(-1px); }
  `}

  ${props => props.variant === 'outline' && css`
    background: transparent;
    border-color: ${T.divider};
    color: ${T.textMuted};
    &:hover:not(:disabled) { border-color: ${T.primary}; color: ${T.primary}; background: ${T.primaryLight}; }
  `}

  ${props => props.variant === 'ghost' && css`
    background: transparent;
    padding: 8px;
    border: none;
    color: ${T.textMuted};
    &:hover:not(:disabled) { background: ${T.surfaceOffset}; color: ${T.primary}; }
  `}

  ${props => props.danger && css`
    &:hover:not(:disabled) { color: ${T.error}; background: ${T.errorLight}; border-color: ${T.error}33; }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
`;

const TableContainer = styled.div`
  width: 100%;
  overflow: auto;
  flex: 1;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  font-size: 0.65rem;
  font-weight: 800;
  color: ${T.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 14px 20px;
  background: ${T.surfaceOffset};
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid ${T.divider};
`;

const Td = styled.td`
  padding: 14px 20px;
  font-size: 0.875rem;
  border-bottom: 1px solid ${T.divider};
  vertical-align: middle;
`;

const Tr = styled.tr`
  transition: background 0.15s;
  background: ${props => props.selected ? 'rgba(1, 105, 111, 0.04)' : 'transparent'};
  &:hover { background: ${props => props.selected ? 'rgba(1, 105, 111, 0.06)' : '#fafaf8'}; }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: ${T.r.full};
  font-size: 0.7rem;
  font-weight: 800;
  
  ${props => props.type === 'Generated' && css` background: ${T.blueLight}; color: ${T.blue}; `}
  ${props => props.type === 'Partially Paid' && css` background: ${T.warningLight}; color: ${T.warning}; `}
  ${props => props.type === 'Paid' && css` background: ${T.successLight}; color: ${T.success}; `}
  ${props => props.type === 'Cancelled' && css` background: ${T.errorLight}; color: ${T.error}; `}
  
  &:before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
`;

const Chip = styled.span`
  padding: 2px 8px;
  border-radius: ${T.r.md};
  font-size: 0.7rem;
  font-weight: 700;
  background: ${T.blueLight}88;
  color: ${T.blue};
  border: 1px solid ${T.blue}22;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${T.surface};
  width: 100%;
  max-width: ${props => props.width || '500px'};
  border-radius: ${T.r.xl};
  box-shadow: ${T.shadowLg};
  overflow: hidden;
  animation: modalIn 0.3s ease-out;

  @keyframes modalIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${T.divider};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 800;
  color: ${T.text};
`;

const ModalBody = styled.div`
  padding: 24px;
  background: ${T.bg}44;
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${T.divider};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: white;
`;

const Checkbox = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid ${props => props.checked ? T.primary : T.textFaint};
  background: ${props => props.checked ? T.primary : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.15s;

  &:hover { border-color: ${T.primary}; }
`;

const SkeletonBox = styled.div`
  height: 14px;
  width: ${props => props.width || '100%'};
  border-radius: 4px;
  background: linear-gradient(90deg, ${T.surfaceOffset} 25%, #e9e7e2 50%, ${T.surfaceOffset} 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

// ─── Main Component ───────────────────────────────────────────────────────────
const CorporateCreditBilling = () => {
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [generatedInvoices, setGeneratedInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Credit');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [filters, setFilters] = useState({ company_id: '', from_date: '', to_date: '' });

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => { fetchCompaniesAndData(); }, []);

  useEffect(() => {
    if (tabValue === 1) fetchGeneratedInvoices();
    else fetchCompaniesAndData();
  }, [tabValue]);

  const fetchCompaniesAndData = async () => {
    try {
      setLoading(true);
      let url = `${Labbaseurl}corporate_credit_billing/?`;
      if (filters.company_id) url += `company_id=${filters.company_id}&`;
      if (filters.from_date) url += `from_date=${filters.from_date}&`;
      if (filters.to_date) url += `to_date=${filters.to_date}&`;
      const response = await apiRequest(url, 'GET');
      if (response?.success) {
        setData(response.data?.data || []);
        if (response.data?.companies) setCompanies(response.data.companies);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchGeneratedInvoices = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`${Labbaseurl}get_corporate_invoices/`, 'GET');
      if (response?.success) setGeneratedInvoices(response.data?.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => fetchCompaniesAndData();
  const clearFilters = () => { setFilters({ company_id: '', from_date: '', to_date: '' }); setTimeout(fetchCompaniesAndData, 0); };

  const handleSelectAll = () => {
    setSelectedIds(selectedIds.length === data.length ? [] : data.map(r => r._id));
  };
  const handleSelectRow = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleGenerateInvoice = async () => {
    if (!filters.company_id || !filters.from_date || !filters.to_date) {
      toast.error('Please select Company and Date Range before generating an invoice');
      return;
    }
    try {
      setLoading(true);
      const selectedRecords = data.filter(r => selectedIds.includes(r._id));
      if (selectedRecords.length === 0) {
        toast.warning('Please select at least one record');
        return;
      }
      const totalAmount = selectedRecords.reduce((s, r) => s + (Number(r.netAmount) || 0), 0);
      const payload = {
        company_id: selectedRecords[0].company_id,
        company_name: selectedRecords[0].company_name,
        from_date: filters.from_date,
        to_date: filters.to_date,
        total_amount: totalAmount,
        bill_items: selectedRecords.map(r => ({
          bill_id: r._id, 
          employee_id: r.employee_id,
          patient_name: r.employee_name || r.patientname || 'N/A',
          barcode: r.barcode, 
          amount: r.netAmount, 
          date: r.date,
          package_id: r.chctestdetails?.[0]?.test_id || r.package_id || 'N/A',
          package_name: r.chctestdetails?.[0]?.test_name || r.package_name || 'N/A'
        })),
        payment_method: paymentMethod,
      };
      const response = await apiRequest(`${Labbaseurl}generate_corporate_invoice/`, 'POST', payload);
      if (response?.success) {
        Swal.fire({ title: 'Invoice Generated', text: `Invoice ${response.data?.invoice_number} created successfully`, icon: 'success', confirmButtonColor: T.primary });
        setSelectedIds([]);
        fetchCompaniesAndData();
      } else { toast.error(response?.error || 'Failed to generate invoice'); }
    } catch (err) { console.error(err); toast.error('An error occurred'); }
    finally { setLoading(false); }
  };

  const handleEditClick = (invoice) => { 
    setEditingInvoice({ 
      ...invoice, 
      new_payment: 0,
      payment_date: new Date().toISOString().split('T')[0],
      note: ''
    }); 
    setShowEditModal(true); 
  };

  const handleUpdateInvoice = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`${Labbaseurl}update_corporate_invoice/`, 'POST', editingInvoice);
      if (response?.success) {
        toast.success('Invoice updated successfully');
        setShowEditModal(false);
        fetchGeneratedInvoices();
      } else { toast.error(response?.error || 'Failed to update invoice'); }
    } catch (err) { console.error(err); toast.error('An error occurred'); }
    finally { setLoading(false); }
  };

  const handleDeleteInvoice = async (invoiceNumber) => {
    const result = await Swal.fire({
      title: 'Delete Invoice?', text: 'This action cannot be undone.', icon: 'warning',
      showCancelButton: true, confirmButtonColor: T.error, confirmButtonText: 'Delete',
    });
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await apiRequest(`${Labbaseurl}delete_corporate_invoice/`, 'POST', { invoice_number: invoiceNumber });
        if (response?.success) {
          Swal.fire({ title: 'Deleted', text: 'Invoice removed.', icon: 'success', confirmButtonColor: T.primary });
          fetchGeneratedInvoices();
        } else { toast.error(response?.error || 'Failed to delete invoice'); }
      } catch (err) { console.error(err); toast.error('An error occurred'); }
      finally { setLoading(false); }
    }
  };

  const handleExportPDF = (invoiceNumber) => {
    window.open(`${Labbaseurl}export_corporate_invoice_pdf/?invoice_number=${invoiceNumber}`, '_blank');
  };

  const formatDate = (ds) => {
    if (!ds) return '—';
    try { return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(ds)); }
    catch { return ds; }
  };

  const formatAmount = (v) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  const selectedTotal = data.filter(r => selectedIds.includes(r._id)).reduce((s, r) => s + (Number(r.netAmount) || 0), 0);

  return (
    <PageWrapper>
      <Header>
        <TitleGroup>
          <PageTitle><Receipt size={24} color={T.primary} /> Corporate Invoicing</PageTitle>
          <PageSubtitle>Manage corporate credit billings and payments</PageSubtitle>
        </TitleGroup>
        {tabValue === 0 && (
          <KPICard>
            <KPILabel>Selected Total</KPILabel>
            <KPIValue>₹{formatAmount(selectedTotal)}</KPIValue>
            <div style={{ fontSize: '0.7rem', color: T.textMuted, fontWeight: 600 }}>{selectedIds.length} records selected</div>
          </KPICard>
        )}
      </Header>

      <TabContainer>
        <TabItem active={tabValue === 0} onClick={() => setTabValue(0)}><FileText size={16} /> Generate Invoice</TabItem>
        <TabItem active={tabValue === 1} onClick={() => setTabValue(1)}><CheckSquare size={16} /> Generated Invoices</TabItem>
      </TabContainer>

      {tabValue === 0 && (
        <>
          <Card>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: T.textMuted, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={14} /> Selection Filters
            </div>
            <Grid cols={5} align="flex-end">
              <InputGroup>
                <Label>Company</Label>
                <StyledSelect name="company_id" value={filters.company_id} onChange={handleFilterChange}>
                  <option value="">All Companies</option>
                  {companies.map(c => <option key={c.company_id} value={c.company_id}>{c.company_name}</option>)}
                </StyledSelect>
              </InputGroup>
              <InputGroup>
                <Label>From Date</Label>
                <StyledInput type="date" name="from_date" value={filters.from_date} onChange={handleFilterChange} />
              </InputGroup>
              <InputGroup>
                <Label>To Date</Label>
                <StyledInput type="date" name="to_date" value={filters.to_date} onChange={handleFilterChange} />
              </InputGroup>
              <InputGroup>
                <Label>Method</Label>
                <StyledSelect value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  {['Credit', 'Cash', 'UPI', 'Bank Transfer'].map(m => <option key={m} value={m}>{m}</option>)}
                </StyledSelect>
              </InputGroup>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="primary" onClick={applyFilters} disabled={loading} style={{ flex: 1 }}>Filter</Button>
                <Button variant="outline" onClick={clearFilters} disabled={loading}><RotateCcw size={16} /></Button>
              </div>
            </Grid>
          </Card>

          <Toolbar>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: T.textMuted }}>
              Found {data.length} records · {selectedIds.length} selected
            </span>
            <Button variant="success" onClick={handleGenerateInvoice} disabled={selectedIds.length === 0}>
              <Check size={16} /> Create Invoice
            </Button>
          </Toolbar>

          <Card compact flex noMargin>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <Th style={{ width: '40px' }}>
                      <Checkbox checked={data.length > 0 && selectedIds.length === data.length} onClick={handleSelectAll}>
                        {data.length > 0 && selectedIds.length === data.length && <Check size={12} />}
                      </Checkbox>
                    </Th>
                    <Th>Date</Th>
                    <Th>Patient Name</Th>
                    <Th>Employee ID</Th>
                    <Th>Package ID</Th>
                    <Th>Barcode</Th>
                    <Th>Company</Th>
                    <Th>Tests</Th>
                    <Th style={{ textAlign: 'right' }}>Amount (₹)</Th>
                  </tr>
                </thead>
                <tbody>
                    {loading ? (
                      [...Array(6)].map((_, i) => (
                        <tr key={i}><Td colSpan={9}><SkeletonBox /></Td></tr>
                      ))
                    ) : data.length === 0 ? (
                      <tr><Td colSpan={9} style={{ textAlign: 'center', padding: '60px' }}>No records found</Td></tr>
                  ) : data.map(row => (
                    <Tr key={row._id} selected={selectedIds.includes(row._id)}>
                      <Td>
                        <Checkbox checked={selectedIds.includes(row._id)} onClick={() => handleSelectRow(row._id)}>
                          {selectedIds.includes(row._id) && <Check size={12} />}
                        </Checkbox>
                      </Td>
                      <Td style={{ color: T.textMuted }}>{formatDate(row.date)}</Td>
                      <Td style={{ fontWeight: 600 }}>{row.employee_name || row.patientname || '—'}</Td>
                      <Td style={{ fontWeight: 700 }}>{row.employee_id}</Td>
                      <Td style={{ fontSize: '0.75rem' }}>{row.chctestdetails?.[0]?.test_id || row.package_id || '—'}</Td>
                      <Td><code>{row.barcode}</code></Td>
                      <Td style={{ fontWeight: 600 }}>{row.company_name}</Td>
                      <Td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {row.testdetails?.map((t, i) => <Chip key={i}>{t.testname}</Chip>)}
                        </div>
                      </Td>
                      <Td style={{ textAlign: 'right', fontWeight: 800, color: T.success }}>₹{formatAmount(row.netAmount)}</Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}

      {tabValue === 1 && (
        <Card compact flex noMargin>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Invoice #</Th>
                  <Th>Date</Th>
                  <Th>Company</Th>
                  <Th>Items</Th>
                  <Th style={{ textAlign: 'right' }}>Total (₹)</Th>
                  <Th style={{ textAlign: 'right' }}>Paid (₹)</Th>
                  <Th style={{ textAlign: 'right' }}>Pending (₹)</Th>
                  <Th>Status</Th>
                  <Th style={{ textAlign: 'right' }}>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   [...Array(5)].map((_, i) => (
                    <tr key={i}><Td colSpan={9}><SkeletonBox /></Td></tr>
                  ))
                ) : generatedInvoices.length === 0 ? (
                  <tr><Td colSpan={9} style={{ textAlign: 'center', padding: '60px' }}>No invoices found</Td></tr>
                ) : generatedInvoices.map(inv => (
                  <Tr key={inv.invoice_number}>
                    <Td style={{ fontWeight: 800, color: T.blue }}>{inv.invoice_number}</Td>
                    <Td style={{ color: T.textMuted }}>{formatDate(inv.created_at)}</Td>
                    <Td style={{ fontWeight: 700 }}>{inv.company_name}</Td>
                    <Td><Chip>{inv.bill_items?.length || 0}</Chip></Td>
                    <Td style={{ textAlign: 'right', fontWeight: 600 }}>₹{formatAmount(inv.total_amount)}</Td>
                    <Td style={{ textAlign: 'right', fontWeight: 600, color: T.success }}>₹{formatAmount(inv.paid_amount)}</Td>
                    <Td style={{ textAlign: 'right', fontWeight: 800, color: T.error }}>₹{formatAmount(inv.remaining_amount)}</Td>
                    <Td><Badge type={inv.status}>{inv.status}</Badge></Td>
                    <Td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        <Button variant="ghost" onClick={() => handleExportPDF(inv.invoice_number)} title="Print PDF"><Printer size={14} /></Button>
                        <Button variant="ghost" onClick={() => handleEditClick(inv)}><Edit2 size={14} /></Button>
                        {Number(inv.paid_amount || 0) <= 0 && (
                          <Button variant="ghost" danger onClick={() => handleDeleteInvoice(inv.invoice_number)}><Trash2 size={14} /></Button>
                        )}
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {showEditModal && (
        <ModalOverlay onClick={() => setShowEditModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit2 size={18} color={T.primary} /> Edit Invoice {editingInvoice?.invoice_number}
              </div>
              <Button variant="ghost" onClick={() => setShowEditModal(false)}><X size={20} /></Button>
            </ModalHeader>
            <ModalBody>
              <Grid gap="16px">
                {/* Compact Summary Header */}
                <div style={{ 
                  padding: '12px 16px', background: T.primaryLight, borderRadius: T.r.lg, 
                  border: `1px solid ${T.primary}22`, display: 'flex', flexWrap: 'wrap', gap: '16px',
                  justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <Label style={{ color: T.primary, fontSize: '0.65rem' }}>Company</Label>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: T.primary }}>{editingInvoice.company_name}</div>
                  </div>
                  <div>
                    <Label style={{ color: T.primary, fontSize: '0.65rem' }}>Period</Label>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: T.text }}>{editingInvoice.from_date || '—'} → {editingInvoice.to_date || '—'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Label style={{ color: T.primary, fontSize: '0.65rem' }}>Invoice Total</Label>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: T.text }}>₹{formatAmount(editingInvoice.total_amount)}</div>
                  </div>
                </div>

                {/* Payment Entry Section */}
                <div style={{ padding: '16px', background: 'white', borderRadius: T.r.lg, border: `1px solid ${T.divider}` }}>
                  <Label style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: T.text }}>
                    <Receipt size={14} /> New Payment Details
                  </Label>
                  <Grid cols={2} gap="12px">
                    <InputGroup>
                      <Label>Payment Amount (₹)</Label>
                      <StyledInput type="number" value={editingInvoice.new_payment} onChange={e => setEditingInvoice({...editingInvoice, new_payment: e.target.value})} placeholder="0.00" autoFocus />
                    </InputGroup>
                    <InputGroup>
                      <Label>Payment Date</Label>
                      <StyledInput type="date" value={editingInvoice.payment_date} onChange={e => setEditingInvoice({...editingInvoice, payment_date: e.target.value})} />
                    </InputGroup>
                    <InputGroup>
                      <Label>Method</Label>
                      <StyledSelect value={editingInvoice.payment_method} onChange={e => setEditingInvoice({...editingInvoice, payment_method: e.target.value})}>
                        {['Credit', 'Cash', 'UPI', 'Bank Transfer'].map(m => <option key={m} value={m}>{m}</option>)}
                      </StyledSelect>
                    </InputGroup>
                    <InputGroup>
                      <Label>Note</Label>
                      <StyledInput value={editingInvoice.note} onChange={e => setEditingInvoice({...editingInvoice, note: e.target.value})} placeholder="Ref #, Bank name..." />
                    </InputGroup>
                  </Grid>
                </div>

                {/* Pending Balance Indicator */}
                <div style={{ padding: '12px', background: T.warningLight, borderRadius: T.r.md, display: 'flex', gap: '10px', alignItems: 'center', border: `1px solid ${T.warning}22` }}>
                  <AlertCircle size={16} color={T.warning} />
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: T.warning }}>
                    Pending Balance: ₹{formatAmount(editingInvoice.remaining_amount - editingInvoice.new_payment)}
                  </div>
                </div>

                {/* Payment History */}
                {editingInvoice.payment_history?.length > 0 && (
                  <div style={{ marginTop: '4px' }}>
                    <Label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <History size={12} /> Previous Payment History
                    </Label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', padding: '2px' }}>
                      {editingInvoice.payment_history.map((h, i) => (
                        <div key={i} style={{ 
                          padding: '10px 14px', background: 'white', borderRadius: T.r.md, 
                          border: `1px solid ${T.divider}`, fontSize: '0.75rem',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontWeight: 800, color: T.text, fontSize: '0.8rem' }}>₹{formatAmount(h.amount)} <span style={{ fontWeight: 500, color: T.textMuted }}>via {h.method}</span></div>
                            <div style={{ color: T.textMuted, fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <CalendarRange size={10} /> {formatDate(h.date)} {h.note && `· ${h.note}`}
                            </div>
                          </div>
                          <Badge type="Paid">Success</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleUpdateInvoice} disabled={loading}><Save size={16} /> Save Changes</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

export default CorporateCreditBilling;