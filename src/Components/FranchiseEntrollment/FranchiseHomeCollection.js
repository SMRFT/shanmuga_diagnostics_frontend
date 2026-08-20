import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FaHome,
  FaPlus,
  FaSearch,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaUser,
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaSpinner,
  FaCalendarAlt,
  FaPaperPlane,
} from 'react-icons/fa';
import apiRequest from '../Auth/apiRequest';
import {
  LiquidBackground,
  GradientCard,
  PrimaryButton,
  Container as GlobalContainer,
} from './GlobalStyle';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const HeaderTitle = styled.div`
  h2 {
    font-size: 26px;
    font-weight: 700;
    color: #2d3748;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      color: #667eea;
    }
  }

  p {
    font-size: 14px;
    color: #718096;
    margin-top: 4px;
  }
`;

const FormCard = styled(GradientCard)`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1.5px solid #e2e8f0;
`;

const FormTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1.5px solid #edf2f7;

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: #1a202c;
    margin: 0;
  }

  span {
    font-size: 13px;
    color: #718096;
  }
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
  align-items: flex-end;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  &.full-width {
    grid-column: 1 / -1;
  }

  label {
    font-size: 13px;
    font-weight: 600;
    color: #4a5568;
    display: flex;
    align-items: center;
    gap: 6px;

    span.req {
      color: #e53e3e;
    }
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 14px;
    font-family: inherit;
    color: #2d3748;
    background: #ffffff;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
    }
  }

  textarea {
    resize: vertical;
    min-height: 44px;
  }

  span.error {
    font-size: 12px;
    color: #e53e3e;
    margin-top: 2px;
  }
`;

const SubmitButtonWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-top: 6px;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 16px 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .stat-info {
    span {
      font-size: 12px;
      font-weight: 600;
      color: #718096;
      text-transform: uppercase;
    }
    h3 {
      font-size: 22px;
      font-weight: 700;
      color: #1a202c;
      margin: 4px 0 0 0;
    }
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    background: ${(props) => props.bg || '#ebf4ff'};
    color: ${(props) => props.color || '#4c51bf'};
  }
`;

const SearchFilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #a0aec0;
    font-size: 15px;
  }

  input {
    width: 100%;
    padding: 11px 16px 11px 40px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 14px;
    font-family: inherit;
    background: #ffffff;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
    }
  }
`;

const FilterSelect = styled.select`
  padding: 11px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  background: #ffffff;
  color: #4a5568;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const TableCard = styled(GradientCard)`
  background: #ffffff;
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th {
    background: #f8fafc;
    color: #4a5568;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 14px 18px;
    border-bottom: 1.5px solid #edf2f7;
  }

  td {
    padding: 16px 18px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 14px;
    color: #2d3748;
    vertical-align: middle;
  }

  tbody tr {
    transition: background 0.15s ease;
    &:hover {
      background: #f8fafc;
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;

  background: ${(props) => {
    switch (props.status?.toLowerCase()) {
      case 'accepted':
      case 'collected':
        return '#def7ec';
      case 'in progress':
        return '#fef08a';
      case 'cancelled':
        return '#fee2e2';
      case 'assigned':
      default:
        return '#e0e7ff';
    }
  }};

  color: ${(props) => {
    switch (props.status?.toLowerCase()) {
      case 'accepted':
      case 'collected':
        return '#03543f';
      case 'in progress':
        return '#713f12';
      case 'cancelled':
        return '#991b1b';
      case 'assigned':
      default:
        return '#3730a3';
    }
  }};
`;

const StatusSelect = styled.select`
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 13px;
  background: #ffffff;
  color: #334155;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #667eea;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1500;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Toast = styled.div`
  background: ${(props) => (props.type === 'error' ? '#fee2e2' : '#def7ec')};
  color: ${(props) => (props.type === 'error' ? '#991b1b' : '#03543f')};
  border: 1px solid ${(props) => (props.type === 'error' ? '#f87171' : '#34d399')};
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideInDown 0.3s ease-out;

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 20px;
  color: #718096;

  svg {
    font-size: 40px;
    color: #cbd5e1;
    margin-bottom: 12px;
  }

  p {
    font-size: 15px;
    margin: 0;
  }
`;

const FranchiseHomeCollection = () => {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL || '/_b_a_c_k_e_n_d/LIS/';

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [collections, setCollections] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toasts, setToasts] = useState([]);

  // Form state displaying the manual input fields alone:
  // patient_name, phone, franchise_id, address
  const [formData, setFormData] = useState({
    patient_name: '',
    phone: '',
    address: '',
    franchise_id: '',
    status: 'Assigned',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCollections();
    fetchFranchises();
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`${Labbaseurl}franchise-home-collection/`, 'GET');
      if (response.success && Array.isArray(response.data)) {
        setCollections(response.data);
      } else {
        setCollections([]);
      }
    } catch (err) {
      console.error('Error fetching home collections:', err);
      showToast('Failed to load home collection requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFranchises = async () => {
    try {
      const response = await apiRequest(`${Labbaseurl}get-franchise/`, 'GET');
      if (response.success && Array.isArray(response.data)) {
        setFranchises(response.data);
      }
    } catch (err) {
      console.error('Error fetching franchises:', err);
    }
  };

  const getFranchiseName = (franchiseId) => {
    if (!franchiseId) return '';
    const found = franchises.find((f) => f.franchise_id === franchiseId);
    return found?.franchise_name || found?.franchiser_name || '';
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.patient_name.trim()) {
      errors.patient_name = 'Patient name is required';
    }
    if (!formData.franchise_id.trim()) {
      errors.franchise_id = 'Franchise ID is required';
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/[- ]/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const response = await apiRequest(
        `${Labbaseurl}franchise-home-collection/`,
        'POST',
        formData
      );

      if (response.success) {
        showToast('Home collection request added successfully!');
        setFormData({
          patient_name: '',
          phone: '',
          address: '',
          franchise_id: '',
          status: 'Assigned',
        });
        fetchCollections();
      } else {
        showToast(response.error || 'Failed to save home collection request', 'error');
      }
    } catch (err) {
      console.error('Error submitting home collection:', err);
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (collectionId, newStatus) => {
    try {
      const response = await apiRequest(
        `${Labbaseurl}franchise-home-collection/${collectionId}/`,
        'POST',
        { status: newStatus }
      );

      if (response.success) {
        showToast(`Status updated to ${newStatus}`);
        setCollections((prev) =>
          prev.map((item) =>
            item._id === collectionId || item.id === collectionId
              ? { ...item, status: newStatus }
              : item
          )
        );
      } else {
        showToast(response.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Failed to update status', 'error');
    }
  };

  const filteredCollections = collections.filter((item) => {
    const matchesSearch =
      (item.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.franchise_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.address || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (item.status || '').toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: collections.length,
    assigned: collections.filter((c) => (c.status || '').toLowerCase() === 'assigned').length,
    accepted: collections.filter((c) => (c.status || '').toLowerCase() === 'accepted').length,
  };

  return (
    <LiquidBackground>
      <GlobalContainer style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
        <PageHeader>
          <HeaderTitle>
            <h2>
              <FaHome /> Franchise Home Collection
            </h2>
            <p>Direct entry and tracking for patient sample home collection requests assigned to franchises</p>
          </HeaderTitle>
        </PageHeader>

        {/* ── INPUT FIELDS FORM CARD ── */}
        <FormCard>
          <FormTitle>
            <FaPlus style={{ color: '#667eea', fontSize: '16px' }} />
            <div>
              <h3>Add Home Collection Request</h3>
              <span>Enter patient and franchise details to schedule home sample collection</span>
            </div>
          </FormTitle>

          <FormGrid onSubmit={handleSubmit}>
            {/* 1. patient_name */}
            <FormGroup>
              <label>
                <FaUser style={{ color: '#667eea' }} /> Patient Name <span className="req">*</span>
              </label>
              <input
                type="text"
                name="patient_name"
                placeholder="Enter patient full name"
                value={formData.patient_name}
                onChange={handleInputChange}
              />
              {formErrors.patient_name && (
                <span className="error">{formErrors.patient_name}</span>
              )}
            </FormGroup>

            {/* 2. phone */}
            <FormGroup>
              <label>
                <FaPhoneAlt style={{ color: '#667eea' }} /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="10-digit phone number"
                value={formData.phone}
                onChange={handleInputChange}
              />
              {formErrors.phone && <span className="error">{formErrors.phone}</span>}
            </FormGroup>

            {/* 3. franchise_id */}
            <FormGroup>
              <label>
                <FaBuilding style={{ color: '#667eea' }} /> Franchise ID <span className="req">*</span>
              </label>
              {franchises.length > 0 ? (
                <select
                  name="franchise_id"
                  value={formData.franchise_id}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Franchise ID --</option>
                  {franchises.map((f) => (
                    <option key={f.franchise_id} value={f.franchise_id}>
                      {f.franchise_id} {f.franchise_name ? `- ${f.franchise_name}` : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="franchise_id"
                  placeholder="e.g. SHF001"
                  value={formData.franchise_id}
                  onChange={handleInputChange}
                />
              )}
              {formErrors.franchise_id && (
                <span className="error">{formErrors.franchise_id}</span>
              )}
            </FormGroup>

            {/* 4. address */}
            <FormGroup className="full-width">
              <label>
                <FaMapMarkerAlt style={{ color: '#e53e3e' }} /> Address
              </label>
              <textarea
                name="address"
                placeholder="Enter complete patient address for home collection"
                value={formData.address}
                onChange={handleInputChange}
              />
            </FormGroup>

            <SubmitButtonWrapper>
              <PrimaryButton type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
                {isSubmitting ? (
                  <>
                    <FaSpinner className="fa-spin" style={{ marginRight: '8px' }} /> Saving...
                  </>
                ) : (
                  <>
                    <FaPaperPlane style={{ marginRight: '8px' }} /> Save Home Collection
                  </>
                )}
              </PrimaryButton>
            </SubmitButtonWrapper>
          </FormGrid>
        </FormCard>

        {/* Stats Overview */}
        <StatsGrid>
          <StatCard bg="#ebf4ff" color="#4c51bf">
            <div className="stat-info">
              <span>Total Requests</span>
              <h3>{stats.total}</h3>
            </div>
            <div className="stat-icon">
              <FaHome />
            </div>
          </StatCard>
          <StatCard bg="#e0e7ff" color="#3730a3">
            <div className="stat-info">
              <span>Assigned</span>
              <h3>{stats.assigned}</h3>
            </div>
            <div className="stat-icon">
              <FaClock />
            </div>
          </StatCard>
          <StatCard bg="#def7ec" color="#03543f">
            <div className="stat-info">
              <span>Accepted</span>
              <h3>{stats.accepted}</h3>
            </div>
            <div className="stat-icon">
              <FaCheckCircle />
            </div>
          </StatCard>
        </StatsGrid>

        {/* Search & Filter Bar */}
        <SearchFilterBar>
          <SearchInputWrapper>
            <FaSearch />
            <input
              type="text"
              placeholder="Search by Patient Name, Phone, Franchise ID, Address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInputWrapper>

          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="assigned">Assigned</option>
            <option value="accepted">Accepted</option>
          </FilterSelect>
        </SearchFilterBar>

        {/* Data Table */}
        <TableCard>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#667eea' }}>
              <FaSpinner className="fa-spin" style={{ fontSize: '28px' }} />
              <p style={{ marginTop: '10px', fontSize: '14px' }}>Loading Home Collections...</p>
            </div>
          ) : filteredCollections.length === 0 ? (
            <EmptyState>
              <FaHome />
              <p>No home collection requests found.</p>
            </EmptyState>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Franchise ID & Name</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCollections.map((item, index) => {
                    const id = item._id || item.id || index;
                    const formattedDate = item.date
                      ? new Date(item.date).toLocaleDateString('en-GB')
                      : item.created_date
                        ? new Date(item.created_date).toLocaleDateString('en-GB')
                        : '-';
                    const franchiseName = item.franchise_name || getFranchiseName(item.franchise_id);

                    return (
                      <tr key={id}>
                        <td style={{ fontWeight: '600', color: '#1a202c' }}>
                          <FaUser style={{ marginRight: '8px', color: '#667eea', fontSize: '13px' }} />
                          {item.patient_name}
                        </td>
                        <td>
                          {item.phone ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <FaPhoneAlt style={{ color: '#a0aec0', fontSize: '12px' }} />
                              {item.phone}
                            </span>
                          ) : (
                            <span style={{ color: '#a0aec0' }}>-</span>
                          )}
                        </td>
                        <td style={{ maxWidth: '240px', whiteSpace: 'normal' }}>
                          {item.address ? (
                            <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '6px' }}>
                              <FaMapMarkerAlt style={{ color: '#e53e3e', fontSize: '13px', marginTop: '2px' }} />
                              {item.address}
                            </span>
                          ) : (
                            <span style={{ color: '#a0aec0' }}>-</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                background: '#edf2f7',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontWeight: '600',
                                fontSize: '13px',
                                color: '#4a5568',
                                display: 'inline-flex',
                                alignItems: 'center',
                              }}
                            >
                              <FaBuilding style={{ marginRight: '5px', fontSize: '11px' }} />
                              {item.franchise_id}
                            </span>
                            {franchiseName && (
                              <span style={{ fontWeight: '600', color: '#2d3748', fontSize: '13px' }}>
                                {franchiseName}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ fontSize: '13px', color: '#718096' }}>
                          <FaCalendarAlt style={{ marginRight: '5px', fontSize: '12px' }} />
                          {formattedDate}
                        </td>
                        <td>
                          <StatusBadge status={item.status}>{item.status || 'Assigned'}</StatusBadge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </StyledTable>
            </div>
          )}
        </TableCard>

        {/* Feedback Toasts */}
        <ToastContainer>
          {toasts.map((toast) => (
            <Toast key={toast.id} type={toast.type}>
              {toast.type === 'error' ? <FaTimes /> : <FaCheckCircle />}
              {toast.message}
            </Toast>
          ))}
        </ToastContainer>
      </GlobalContainer>
    </LiquidBackground>
  );
};

export default FranchiseHomeCollection;
