// src/components/FranchiseList.js
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import GradientText from './GradientText';
import apiRequest from '../Auth/apiRequest';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { 
  GlobalStyle, 
  PrimaryButton, 
  SecondaryButton, 
  Container as GlobalContainer, 
} from './GlobalStyle';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
`;

// Container with purple-tinted ambient background matching sidebar
const Container = styled.div`
  min-height: auto;
  position: relative;
  background: transparent;
  padding: 0;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
`;

const ListContainer = styled.div`
  max-width: 1400px;
  margin: auto;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(225, 232, 255, 0.8);
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.06);
  animation: ${fadeIn} 0.5s ease-out;
  
  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 14px;
  }
`;

const DirectoryHeader = styled.div`
  background: linear-gradient(135deg, rgba(243, 232, 255, 0.6) 0%, rgba(225, 232, 255, 0.6) 100%);
  border-radius: 16px;
  padding: 1.2rem 1.5rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.05);
  border: 1px solid rgba(216, 180, 254, 0.5);
  text-align: center;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 0.35rem;
  margin-bottom: 0;
  font-weight: 500;
`;

// Stats Section matching sidebar purple aesthetic
const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;
  animation: ${slideIn} 0.5s ease-out;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  border: 2px solid ${props => props.borderColor || '#e1e8ff'};
  border-radius: 16px;
  padding: 1.2rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: ${props => props.accentColor || '#667eea'};
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.12);
  }
`;

const StatIconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${props => props.bg || 'rgba(102, 126, 234, 0.1)'};
  color: ${props => props.color || '#667eea'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatNumber = styled.div`
  color: #1f2937;
  font-weight: 700;
  font-size: 1.6rem;
  line-height: 1.2;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
`;

const SearchSection = styled.div`
  margin-bottom: 2rem;
  animation: ${slideIn} 0.5s ease-out;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
`;

const SearchInput = styled.input`
  width: 100%;
  border: 2px solid #e1e8ff;
  border-radius: 12px;
  padding: 0.8rem 1.2rem 0.8rem 2.8rem;
  font-size: 0.95rem;
  font-weight: 500;
  background: #ffffff;
  transition: all 0.3s ease;
  color: #1f2937;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.1rem;
  pointer-events: none;
`;

// Franchise Grid & Card matching sidebar theme
const FranchiseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.75rem;
  margin-top: 1.5rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const FranchiseCard = styled.div`
  background: #ffffff;
  border: 1.5px solid rgba(225, 232, 255, 0.9);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.06);
  border-radius: 20px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.6s ease-in;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(135deg, #f093fb 0%, #667eea 50%, #764ba2 100%);
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 36px rgba(102, 126, 234, 0.16);
    border-color: #c7d2fe;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FranchiseName = styled.h4`
  font-weight: 700;
  font-size: 1.15rem;
  margin: 0;
  color: #4c51bf;
  line-height: 1.3;
`;

const FranchiseIdBadge = styled.span`
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.15), rgba(102, 126, 234, 0.15));
  color: #667eea;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  border: 1px solid rgba(102, 126, 234, 0.3);
  flex-shrink: 0;
`;

const PhotoSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const PhotoWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const FranchisePhoto = styled.img`
  width: 84px;
  height: 84px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f3e8ff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.08);
    border-color: #667eea;
    box-shadow: 0 0 18px rgba(102, 126, 234, 0.35);
  }
`;

const PhotoPlaceholder = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5f3ff, #ede9fe);
  border: 2px dashed #c4b5fd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7c3aed;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 1rem;
  background: #fdfaff;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #f3e8ff;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
`;

const InfoIcon = styled.span`
  font-size: 1rem;
  color: #667eea;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
`;

const InfoText = styled.span`
  color: #374151;
  font-weight: 500;
  word-break: break-all;
`;

const FilesSection = styled.div`
  margin-bottom: 1rem;
  padding: 0.85rem 1rem;
  background: #faf5ff;
  border-radius: 12px;
  border: 1px dashed #d8b4fe;
`;

const FilesSectionTitle = styled.div`
  color: #6b21a8;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const FileIconsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const FileBadge = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.65rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  text-align: left;
  
  &.available {
    background: #f3e8ff;
    color: #6b21a8;
    border: 1px solid #d8b4fe;
    
    &:hover {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #ffffff;
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(102, 126, 234, 0.25);
    }
  }
  
  &.unavailable {
    background: #f3f4f6;
    color: #9ca3af;
    border: 1px solid #e5e7eb;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #f3e8ff;
  gap: 0.75rem;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 48px;
  height: 26px;
  background: ${props => props.isActive 
    ? 'linear-gradient(135deg, #10b981, #059669)' 
    : '#cbd5e1'
  };
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const ToggleKnob = styled.div`
  position: absolute;
  top: 3px;
  left: ${props => props.isActive ? '25px' : '3px'};
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
`;

const ToggleLabel = styled.span`
  color: ${props => props.isActive ? '#10b981' : '#6b7280'};
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  
  &:hover {
    background: linear-gradient(135deg, #f093fb 0%, #667eea 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
  }
`;

// Modern Modal Preview
const ModalBackdrop = styled.div`
  display: ${props => props.show ? 'flex' : 'none'};
  position: fixed;
  z-index: 99999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalBox = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 1.5rem;
  width: 100%;
  max-width: 850px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(225, 232, 255, 0.8);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h5`
  margin: 0;
  color: #4c51bf;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ModalActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OpenExternalButton = styled.button`
  background: #f3e8ff;
  color: #6b21a8;
  border: 1px solid #d8b4fe;
  padding: 0.35rem 0.85rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #6b21a8;
    color: #ffffff;
  }
`;

const CloseButton = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s;
  
  &:hover {
    background: #ef4444;
    color: #ffffff;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 380px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 1rem;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  border-radius: 8px;
  object-fit: contain;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const ModalIframe = styled.iframe`
  width: 100%;
  height: 70vh;
  border: none;
  border-radius: 8px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  color: #667eea;
  font-size: 1.1rem;
  font-weight: 600;
  gap: 0.75rem;
`;

const NoDataMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 280px;
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  
  &::before {
    content: '📋';
    font-size: 3.5rem;
    margin-bottom: 0.75rem;
  }
`;

// Main Component
const FranchiseList = () => {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  // Modal State
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [activeFileUrl, setActiveFileUrl] = useState('');
  const [activeFileType, setActiveFileType] = useState('image'); // 'image' | 'pdf'
  const [modalLoading, setModalLoading] = useState(false);

  const navigate = useNavigate();

  const handleViewDetails = (franchiseId) => {
    navigate(`/EmployeeDetails/${franchiseId}`);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`${Labbaseurl}get-franchise/`);
      if (response.success) {
        setEmployees(response.data || []);
        calculateStats(response.data || []);
      } else {
        console.error('Error fetching franchises:', response.error);
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching franchises:', error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const active = data.filter(emp => emp.is_active || emp.status === 'Active').length;
    const inactive = total - active;
    setStats({ total, active, inactive });
  };

  const filterEmployees = () => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = employees.filter(employee =>
      (employee.franchise_name || "").toLowerCase().includes(term) ||
      (employee.franchise_id || "").toLowerCase().includes(term) ||
      (employee.location_id || "").toLowerCase().includes(term) ||
      (employee.email || "").toLowerCase().includes(term) ||
      (employee.contact_no || "").includes(term)
    );
    setFilteredEmployees(filtered);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleStatusToggle = async (franchiseId) => {
    try {
      const response = await apiRequest(`${Labbaseurl}toggle-franchise-status/${franchiseId}/`, 'PATCH');
      if (response.success) {
        const newStatus = response.data?.is_active;
        const updatedEmployees = employees.map(emp =>
          emp.franchise_id === franchiseId 
            ? { ...emp, is_active: newStatus !== undefined ? newStatus : !emp.is_active } 
            : emp
        );
        setEmployees(updatedEmployees);
        calculateStats(updatedEmployees);
      } else {
        console.error('Error toggling status:', response.error);
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      fetchEmployees();
    }
  };

  const getEmployeeStatus = (employee) => (employee.is_active ? "Active" : "Inactive");

  const openDocumentModal = (fileId, docLabel, franchiseName) => {
    if (!fileId) return;
    const directUrl = `${Labbaseurl}get-file/${fileId}/`;
    
    setModalTitle(`${docLabel} - ${franchiseName}`);
    setActiveFileUrl(directUrl);
    
    // Check if label or file is an image vs pdf/document
    const isImage = docLabel.toLowerCase().includes('photo') || docLabel.toLowerCase().includes('image');
    setActiveFileType(isImage ? 'image' : 'pdf');
    setModalShow(true);
  };

  const closeModal = () => {
    setModalShow(false);
    setActiveFileUrl('');
    setModalTitle('');
  };

  const renderFileBadges = (employee) => {
    const files = [
      { id: employee.aadhaar_file_id, label: "Aadhaar", icon: "🆔" },
      { id: employee.pan_file_id, label: "PAN Card", icon: "📑" },
      { id: employee.payment_file_id, label: "Payment", icon: "💳" },
      { id: employee.agreement_file_id, label: "Agreement", icon: "📄" },
    ];

    return files.map((file, idx) => (
      <FileBadge
        key={idx}
        className={file.id ? "available" : "unavailable"}
        onClick={() => file.id && openDocumentModal(file.id, file.label, employee.franchise_name || employee.franchise_id)}
        title={file.id ? `Click to view ${file.label}` : `${file.label} not uploaded`}
        type="button"
        disabled={!file.id}
      >
        <span>{file.icon}</span>
        <span>{file.label}</span>
      </FileBadge>
    ));
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <ContentWrapper>
          <GlobalContainer>
            <ListContainer>
              <DirectoryHeader>
                <GradientText
                  colors={["#f093fb", "#667eea", "#764ba2", "#f093fb", "#667eea"]}
                  animationSpeed={4}
                  showBorder={false}
                  className="custom-class"
                >
                  Franchise Directory
                </GradientText>
                <Subtitle>Manage enrolled franchise partners, verification documents, and active statuses</Subtitle>
              </DirectoryHeader>

              {/* Stats Section with Purple Sidebar Theme */}
              <StatsSection>
                <StatCard borderColor="rgba(102, 126, 234, 0.3)" accentColor="#667eea">
                  <StatIconWrapper bg="rgba(102, 126, 234, 0.12)" color="#667eea">
                    🏢
                  </StatIconWrapper>
                  <StatInfo>
                    <StatNumber>{stats.total}</StatNumber>
                    <StatLabel>Total Franchises</StatLabel>
                  </StatInfo>
                </StatCard>

                <StatCard borderColor="rgba(16, 185, 129, 0.3)" accentColor="#10b981">
                  <StatIconWrapper bg="rgba(16, 185, 129, 0.12)" color="#10b981">
                    ✅
                  </StatIconWrapper>
                  <StatInfo>
                    <StatNumber style={{ color: '#059669' }}>{stats.active}</StatNumber>
                    <StatLabel>Active Franchises</StatLabel>
                  </StatInfo>
                </StatCard>

                <StatCard borderColor="rgba(244, 63, 94, 0.3)" accentColor="#f43f5e">
                  <StatIconWrapper bg="rgba(244, 63, 94, 0.12)" color="#f43f5e">
                    ⏸️
                  </StatIconWrapper>
                  <StatInfo>
                    <StatNumber style={{ color: '#e11d48' }}>{stats.inactive}</StatNumber>
                    <StatLabel>Inactive Franchises</StatLabel>
                  </StatInfo>
                </StatCard>
              </StatsSection>

              {/* Search Bar */}
              <SearchSection>
                <SearchWrapper>
                  <SearchIcon>🔍</SearchIcon>
                  <SearchInput
                    type="text"
                    placeholder="Search by franchise name, ID, location, phone..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </SearchWrapper>
              </SearchSection>

              {/* Content Grid */}
              {loading ? (
                <LoadingSpinner>
                  <div className="spinner-border text-primary" role="status"></div>
                  <span>Loading franchise partners...</span>
                </LoadingSpinner>
              ) : filteredEmployees.length === 0 ? (
                <NoDataMessage>
                  {searchTerm ? "No franchises found matching your search criteria" : "No franchises registered yet"}
                </NoDataMessage>
              ) : (
                <FranchiseGrid>
                  {filteredEmployees.map((employee, idx) => (
                    <FranchiseCard key={employee.id || employee.franchise_id || idx}>
                      <CardHeader>
                        <FranchiseName>
                          {employee.franchise_name || "Franchise Partner"}
                        </FranchiseName>
                        <FranchiseIdBadge>
                          {employee.franchise_id || "N/A"}
                        </FranchiseIdBadge>
                      </CardHeader>

                      <PhotoSection>
                        <PhotoWrapper>
                          {employee.franchise_photo_file_id ? (
                            <FranchisePhoto
                              src={`${Labbaseurl}get-file/${employee.franchise_photo_file_id}/`}
                              alt="Franchise Photo"
                              onClick={() => openDocumentModal(employee.franchise_photo_file_id, "Franchise Photo", employee.franchise_name || employee.franchise_id)}
                              title="Click to view full photo"
                            />
                          ) : (
                            <PhotoPlaceholder>
                              <span>📷</span>
                              <span>No Photo</span>
                            </PhotoPlaceholder>
                          )}
                        </PhotoWrapper>
                      </PhotoSection>

                      <CardBody>
                        <InfoRow>
                          <InfoIcon>📍</InfoIcon>
                          <InfoText><strong>Cluster:</strong> {employee.location_id || "N/A"}</InfoText>
                        </InfoRow>
                        <InfoRow>
                          <InfoIcon>📞</InfoIcon>
                          <InfoText><strong>Contact:</strong> {employee.contact_no || "N/A"}</InfoText>
                        </InfoRow>
                        <InfoRow>
                          <InfoIcon>✉️</InfoIcon>
                          <InfoText><strong>Email:</strong> {employee.email || "N/A"}</InfoText>
                        </InfoRow>
                      </CardBody>

                      <FilesSection>
                        <FilesSectionTitle>
                          <span>📁</span>
                          <span>Verification Documents</span>
                        </FilesSectionTitle>
                        <FileIconsContainer>
                          {renderFileBadges(employee)}
                        </FileIconsContainer>
                      </FilesSection>

                      <CardFooter>
                        <ToggleContainer>
                          <ToggleSwitch
                            isActive={getEmployeeStatus(employee) === "Active"}
                            onClick={() => handleStatusToggle(employee.franchise_id)}
                            title="Toggle status"
                          >
                            <ToggleKnob isActive={getEmployeeStatus(employee) === "Active"} />
                          </ToggleSwitch>
                          <ToggleLabel isActive={getEmployeeStatus(employee) === "Active"}>
                            {getEmployeeStatus(employee)}
                          </ToggleLabel>
                        </ToggleContainer>

                        <ActionButton onClick={() => handleViewDetails(employee.franchise_id)}>
                          View Details →
                        </ActionButton>
                      </CardFooter>
                    </FranchiseCard>
                  ))}
                </FranchiseGrid>
              )}
            </ListContainer>
          </GlobalContainer>
        </ContentWrapper>

        {/* Modal for viewing Documents & Images */}
        <ModalBackdrop show={modalShow} onClick={closeModal}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <span>📑</span>
                <span>{modalTitle}</span>
              </ModalTitle>
              <ModalActions>
                {activeFileUrl && (
                  <OpenExternalButton onClick={() => window.open(activeFileUrl, '_blank')}>
                    Open in New Window ↗
                  </OpenExternalButton>
                )}
                <CloseButton onClick={closeModal} title="Close">✕</CloseButton>
              </ModalActions>
            </ModalHeader>

            <ModalBody>
              {activeFileType === 'image' ? (
                <ModalImage src={activeFileUrl} alt={modalTitle} />
              ) : (
                <ModalIframe src={activeFileUrl} title={modalTitle} />
              )}
            </ModalBody>
          </ModalBox>
        </ModalBackdrop>
      </Container>
    </>
  );
};

export default FranchiseList;