'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
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
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseKeyframes = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
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
  max-width: 1400px;
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
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
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

const UserInfoSection = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc, #f0f9ff);

  @media (max-width: 768px) {
    padding: 1.25rem 1.5rem;
  }
`;

const UserInfoContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserName = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionHeader = styled.div`
  padding: 1.5rem 2rem 1rem;
  background: ${props => props.isPending ? 'linear-gradient(135deg, #fef3c7, #fef9ec)' : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)'};
  border-bottom: 2px solid ${props => props.isPending ? '#fbbf24' : '#0ea5e9'};
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.isPending ? '#b45309' : '#0369a1'};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const DateBadge = styled.span`
  padding: 6px 14px;
  background: ${props => props.isPending ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))' : 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(59, 130, 246, 0.2))'};
  border: 1.5px solid ${props => props.isPending ? 'rgba(251, 191, 36, 0.4)' : 'rgba(14, 165, 233, 0.4)'};
  color: ${props => props.isPending ? '#b45309' : '#0369a1'};
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.3px;
`;

const TaskCount = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.isPending ? '#92400e' : '#075985'};
  opacity: 0.8;
`;

const TableBody = styled.div`
  padding: 2rem;
  overflow-x: auto;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
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
  font-size: 0.8rem;
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
      default: return 'linear-gradient(135deg, rgba(148, 163, 184, 0.1), rgba(100, 116, 139, 0.1))';
    }
  }};
  border: 1.5px solid ${props => {
    switch (props.status) {
      case 'Assigned': return 'rgba(14, 165, 233, 0.3)';
      case 'Accepted': return 'rgba(251, 191, 36, 0.3)';
      case 'PickedUp': return 'rgba(34, 197, 94, 0.3)';
      default: return 'rgba(148, 163, 184, 0.3)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Assigned': return '#0369a1';
      case 'Accepted': return '#b45309';
      case 'PickedUp': return '#15803d';
      default: return '#475569';
    }
  }};
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.color || '#94a3b8'};
  box-shadow: 0 0 8px ${props => props.color || '#94a3b8'}66;

  ${({ pulse }) =>
    pulse &&
    css`
      animation: ${pulseKeyframes} 2s ease-in-out infinite;
    `}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const AcceptButton = styled(Button)`
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
  }
`;

const RejectButton = styled(Button)`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }
`;

const PickupButton = styled(Button)`
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 0.7s linear infinite;
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

const SuccessMessage = styled(MessageContainer)`
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1));
  color: #15803d;
  border-color: rgba(34, 197, 94, 0.3);
`;

const MessageIcon = styled.div`
  flex-shrink: 0;
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
  border-top-color: #0ea5e9;
`;

// ============ Modal Styles ============
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${slideDown} 0.3s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const ModalBody = styled.div`
  margin-bottom: 1.5rem;
`;

const TextArea = styled.textarea`
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
  min-height: 120px;
  resize: vertical;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: #0ea5e9;
    background: white;
    box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const CancelButton = styled(Button)`
  background: white;
  color: #64748b;
  border: 1.5px solid #e2e8f0;

  &:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// ============ Icons ============
const TruckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8 0h2m-2 0a1 1 0 001 1h2a1 1 0 001-1m0 0h1a1 1 0 001-1v-4m0 0h-5m5 0a2 2 0 00-2-2h-2a2 2 0 00-2 2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const InboxIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ============ Main Component ============
const LocationTrackingButton = styled(Button)`
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  color: white;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }
`;

const LocationStatusContainer = styled.div`
  padding: 1rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1));
  border: 1.5px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const LocationStatusText = styled.p`
  margin: 0.5rem 0;
  color: #6b21a8;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogisticsTaskManagement = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [rejectRemarks, setRejectRemarks] = useState('');

  // Location tracking states
  const [locationTracking, setLocationTracking] = useState({
    isTracking: false,
    startTime: null,
    endTime: null,
    startLocation: null,
    distance: null,
  });

  const wakeLockRef = useRef(null);
  const watchIdRef = useRef(null);
  const lastPutTimeRef = useRef(0);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleStartLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, startLocation: true }));
      setError('');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const startTime = new Date();
          const today = new Date().toISOString().split('T')[0];

          // Initialize session storage for location history
          const sessionKey = `location_history_${today}`;
          const locationHistory = JSON.parse(sessionStorage.getItem(sessionKey) || '[]');

          locationHistory.push({
            latitude,
            longitude,
            timestamp: startTime.toISOString(),
            accuracy,
          });

          sessionStorage.setItem(sessionKey, JSON.stringify(locationHistory));
          sessionStorage.setItem(`location_start_${today}`, startTime.toISOString());

          setLocationTracking({
            isTracking: true,
            startTime,
            startLocation: { latitude, longitude },
            endTime: null,
            distance: null,
          });

          // Save to backend
          const userName = localStorage.getItem('name');
          try {
            await apiRequest(
              `${Labbaseurl}sample-collector-location/`,
              'POST',
              {
                sampleCollector: userName,
                date: today,
                latitudeStart: latitude,
                longitudeStart: longitude,
                startTime: startTime.toISOString()
              },
              null
            );
            setSuccess('Location tracking started!');
            setTimeout(() => setSuccess(''), 3000);

            // Start continuous tracking loop
            startWatchPosition(userName, today, startTime);
          } catch (err) {
            console.error('Error saving to backend:', err);
            setError('Failed to contact server');
          }

          setActionLoading(prev => ({ ...prev, startLocation: false }));
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to get your location. Please enable location services.');
          setActionLoading(prev => ({ ...prev, startLocation: false }));
        }
      );
    } catch (err) {
      setError('Failed to start location tracking');
      setActionLoading(prev => ({ ...prev, startLocation: false }));
    }
  };

  const handleEndLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, endLocation: true }));
      setError('');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const endTime = new Date();
          const today = new Date().toISOString().split('T')[0];

          // Get location history from session storage
          const sessionKey = `location_history_${today}`;
          const locationHistory = JSON.parse(sessionStorage.getItem(sessionKey) || '[]');

          locationHistory.push({
            latitude,
            longitude,
            timestamp: endTime.toISOString(),
          });

          // Calculate total distance fallback
          let totalDistance = 0;
          for (let i = 1; i < locationHistory.length; i++) {
            const prev = locationHistory[i - 1];
            const curr = locationHistory[i];
            const lat1 = prev.latitude || prev.lat;
            const lng1 = prev.longitude || prev.lng;
            const lat2 = curr.latitude || curr.lat;
            const lng2 = curr.longitude || curr.lng;
            if (lat1 && lng1 && lat2 && lng2) {
               totalDistance += calculateDistance(lat1, lng1, lat2, lng2);
            }
          }

          sessionStorage.setItem(sessionKey, JSON.stringify(locationHistory));
          sessionStorage.setItem(`location_end_${today}`, endTime.toISOString());
          sessionStorage.setItem(`location_distance_${today}`, totalDistance.toFixed(2));

          setLocationTracking(prev => ({
            ...prev,
            isTracking: false,
            endTime,
            distance: totalDistance.toFixed(2),
          }));

          // Clear watch interval and release wake lock
          if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
          }
          releaseWakeLock();

          // Save to backend using PUT method
          const userName = localStorage.getItem('name');
          try {
            const res = await apiRequest(
              `${Labbaseurl}sample-collector-location/`,
              'PUT',
              {
                sampleCollector: userName,
                date: today,
                latitudeEnd: latitude,
                longitudeEnd: longitude
              },
              null
            );
            
            if (res && res.distance) {
               setLocationTracking(prev => ({ ...prev, distance: res.distance }));
            }
            
            setSuccess('Location tracking ended! Distance calculated successfully.');
            setTimeout(() => setSuccess(''), 3000);
          } catch (err) {
            console.error('Error saving to backend:', err);
          }

          setActionLoading(prev => ({ ...prev, endLocation: false }));
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to get your location. Please enable location services.');
          setActionLoading(prev => ({ ...prev, endLocation: false }));
        }
      );
    } catch (err) {
      setError('Failed to end location tracking');
      setActionLoading(prev => ({ ...prev, endLocation: false }));
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem("name");

    if (storedName) {
      setUserInfo({ name: storedName });
      fetchTasks(storedName);
      checkActiveTracking(storedName);
    } else {
      setError("User name not found in local storage");
    }

    return () => {
       if (watchIdRef.current) {
          navigator.geolocation.clearWatch(watchIdRef.current);
       }
       releaseWakeLock();
    };
  }, []);

  const checkActiveTracking = async (userName) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await apiRequest(`${Labbaseurl}sample-collector-location/?sampleCollector=${encodeURIComponent(userName)}&date=${today}`, 'GET');
      
      if (response && response.length > 0) {
        const data = response[0];
        if (data.isActive) {
          // Resume tracking
          const startTime = new Date(data.startTime);
          setLocationTracking(prev => ({
            ...prev,
            isTracking: true,
            startTime,
            startLocation: { latitude: parseFloat(data.latitudeStart), longitude: parseFloat(data.longitudeStart) }
          }));
          
          startWatchPosition(userName, today, startTime);
        } else if (data.endTime) {
          setLocationTracking({
            isTracking: false,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            distance: data.distance_travelled,
            startLocation: { latitude: parseFloat(data.latitudeStart), longitude: parseFloat(data.longitudeStart) }
          });
        }
      }
    } catch (err) {
      console.error('Error checking active tracking status:', err);
    }
  };

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch (err) {
      console.error('Wake Lock error:', err);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current !== null) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch (err) {
         console.error(err);
      }
    }
  };

  const startWatchPosition = (userName, today, startTimeVal) => {
    requestWakeLock();
    lastPutTimeRef.current = 0; // Reset timer

    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Update session storage
          const sessionKey = `location_history_${today}`;
          const locationHistory = JSON.parse(sessionStorage.getItem(sessionKey) || '[]');
          
          // Avoid pushing same location too quickly
          locationHistory.push({
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
            accuracy
          });
          sessionStorage.setItem(sessionKey, JSON.stringify(locationHistory));
          if (!sessionStorage.getItem(`location_start_${today}`)) {
              sessionStorage.setItem(`location_start_${today}`, startTimeVal.toISOString());
          }

          // Throttle PUT requests to every 10 seconds to reduce server load
          const now = Date.now();
          if (now - lastPutTimeRef.current > 10000) {
            lastPutTimeRef.current = now;
            try {
              await apiRequest(
                `${Labbaseurl}sample-collector-location/`,
                'PUT',
                {
                  sampleCollector: userName,
                  date: today,
                  currentLatitude: latitude,
                  currentLongitude: longitude
                },
                null
              );
            } catch (err) {
              console.error('Error sending local updates to backend', err);
            }
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      watchIdRef.current = id;
    }
  };

  const fetchTasks = async (userName) => {
    if (!userName) return;

    try {
      setLoading(true);
      setError('');

      const response = await apiRequest(
        `${Labbaseurl}logistics_by_collector/?sample_collector=${encodeURIComponent(userName)}`,
        'GET'
      );

      const todayTasksData = Array.isArray(response?.data?.today_tasks)
        ? response.data.today_tasks
        : [];

      const pendingTasksData = Array.isArray(response?.data?.pending_tasks)
        ? response.data.pending_tasks
        : [];

      setTodayTasks(todayTasksData);
      setPendingTasks(pendingTasksData);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
      setTodayTasks([]);
      setPendingTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTask = async (task_id) => {
    try {
      setActionLoading(prev => ({ ...prev, [`accept_${task_id}`]: true }));
      setError('');
      setSuccess('');

      await apiRequest(
        `${Labbaseurl}logistics/accept/${task_id}/`,
        'PATCH'
      );

      setSuccess('Task accepted successfully!');
      
      // Re-fetch username from localStorage
      const storedName = localStorage.getItem("name");
      if (storedName) {
        fetchTasks(storedName);
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error accepting task:', err);
      setError(err.message || 'Failed to accept task');
    } finally {
      setActionLoading(prev => ({ ...prev, [`accept_${task_id}`]: false }));
    }
  };

  const openRejectModal = (task) => {
    setSelectedTask(task);
    setRejectRemarks('');
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedTask(null);
    setRejectRemarks('');
  };

  const handleRejectTask = async () => {
    if (!rejectRemarks.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [`reject_${selectedTask.task_id}`]: true }));
      setError('');
      setSuccess('');

      await apiRequest(
        `${Labbaseurl}logistics/reject/${selectedTask.task_id}/`,
        'PATCH',
        { remarks: rejectRemarks },
        null
      );

      setSuccess('Task rejected successfully!');
      closeRejectModal();
      
      // Re-fetch username from localStorage
      const storedName = localStorage.getItem("name");
      if (storedName) {
        fetchTasks(storedName);
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error rejecting task:', err);
      setError(err.message || 'Failed to reject task');
    } finally {
      setActionLoading(prev => ({ ...prev, [`reject_${selectedTask?.task_id}`]: false }));
    }
  };

  const handlePickupTask = async (task_id) => {
    try {
      setActionLoading(prev => ({ ...prev, [`pickup_${task_id}`]: true }));
      setError('');
      setSuccess('');

      await apiRequest(
        `${Labbaseurl}logistics/pickup/${task_id}/`,
        'PATCH',
        {},
        null
      );

      setSuccess('Sample picked up successfully!');
      
      // Re-fetch username from localStorage
      const storedName = localStorage.getItem("name");
      if (storedName) {
        fetchTasks(storedName);
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error marking pickup:', err);
      setError(err.message || 'Failed to mark as picked up');
    } finally {
      setActionLoading(prev => ({ ...prev, [`pickup_${task_id}`]: false }));
    }
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Assigned': return '#0ea5e9';
      case 'Accepted': return '#f59e0b';
      case 'PickedUp': return '#22c55e';
      default: return '#94a3b8';
    }
  };

  const renderActions = (task) => {
    if (task.status === 'Assigned') {
      return (
        <ActionButtons>
          <AcceptButton
            onClick={() => handleAcceptTask(task.task_id)}
            disabled={actionLoading[`accept_${task.task_id}`]}
          >
            {actionLoading[`accept_${task.task_id}`] ? (
              <LoadingSpinner />
            ) : (
              <>
                <CheckCircleIcon />
                Accept
              </>
            )}
          </AcceptButton>
          <RejectButton
            onClick={() => openRejectModal(task)}
            disabled={actionLoading[`reject_${task.task_id}`]}
          >
            <XCircleIcon />
            Reject
          </RejectButton>
        </ActionButtons>
      );
    } else if (task.status === 'Accepted') {
      return (
        <ActionButtons>
          <PickupButton
            onClick={() => handlePickupTask(task.task_id)}
            disabled={actionLoading[`pickup_${task.task_id}`]}
          >
            {actionLoading[`pickup_${task.task_id}`] ? (
              <LoadingSpinner />
            ) : (
              <>
                <PackageIcon />
                Sample Picked Up
              </>
            )}
          </PickupButton>
        </ActionButtons>
      );
    } else if (task.status === 'PickedUp') {
      return (
        <StatusBadge status="PickedUp">
          <StatusDot color="#22c55e" />
          Completed
        </StatusBadge>
      );
    }
    return null;
  };

  const renderTaskTable = (tasks) => (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>S.No</TableHeaderCell>
          <TableHeaderCell>Date</TableHeaderCell>
          <TableHeaderCell>Lab Name</TableHeaderCell>
          <TableHeaderCell>Sales Person</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Order Time</TableHeaderCell>
          <TableHeaderCell>Accepted Time</TableHeaderCell>
          <TableHeaderCell>Pickup Time</TableHeaderCell>
          <TableHeaderCell>Remarks</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </TableRow>
      </TableHead>
      <tbody>
        {tasks.map((task, index) => (
          <TableRow key={task.id || index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{formatDate(task.date)}</TableCell>
            <TableCell>{task.clinicalname}</TableCell>
            <TableCell>{task.sales_person}</TableCell>
            <TableCell>
              <StatusBadge status={task.status}>
                <StatusDot 
                  color={getStatusColor(task.status)}
                  pulse={task.status === 'Assigned'}
                />
                {task.status}
              </StatusBadge>
            </TableCell>
            <TableCell>{formatTime(task.sampleordertime)}</TableCell>
            <TableCell>{formatTime(task.sampleacceptedtime)}</TableCell>
            <TableCell>{formatTime(task.samplepickeduptime)}</TableCell>
            <TableCell>{task.remarks || '-'}</TableCell>
            <TableCell>{renderActions(task)}</TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );

  return (
    <PageContainer>
      <MainContent>
        <Card>
          <Header>
            <HeaderContent>
              <TitleGroup>
                <IconWrapper>
                  <TruckIcon />
                </IconWrapper>
                <Title>My Sample Collection Tasks</Title>
              </TitleGroup>
              <Subtitle>View and manage your assigned sample collection tasks</Subtitle>
            </HeaderContent>
          </Header>

          {userInfo && (
            <UserInfoSection>
              <UserInfoContent>
                <UserIcon />
                <UserName>{userInfo.name}</UserName>
              </UserInfoContent>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <LocationTrackingButton
                  onClick={handleStartLocation}
                  disabled={locationTracking.isTracking || actionLoading.startLocation}
                >
                  {actionLoading.startLocation ? (
                    <LoadingSpinner />
                  ) : (
                    '📍 Start Location'
                  )}
                </LocationTrackingButton>
                <LocationTrackingButton
                  onClick={handleEndLocation}
                  disabled={!locationTracking.isTracking || actionLoading.endLocation}
                  style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
                >
                  {actionLoading.endLocation ? (
                    <LoadingSpinner />
                  ) : (
                    '🏁 End Location'
                  )}
                </LocationTrackingButton>
              </div>
              {locationTracking.isTracking && (
                <LocationStatusContainer>
                  <LocationStatusText>
                    ✓ Tracking Active - Started at {locationTracking.startTime?.toLocaleTimeString()}
                  </LocationStatusText>
                </LocationStatusContainer>
              )}
              {locationTracking.endTime && (
                <LocationStatusContainer>
                  <LocationStatusText>
                    ✓ Tracking Ended at {locationTracking.endTime.toLocaleTimeString()}
                  </LocationStatusText>
                  <LocationStatusText>
                    📏 Distance Travelled: {locationTracking.distance} km
                  </LocationStatusText>
                </LocationStatusContainer>
              )}
            </UserInfoSection>
          )}

          {error && (
            <ErrorMessage>
              <MessageIcon><AlertCircleIcon /></MessageIcon>
              {error}
            </ErrorMessage>
          )}

          {success && (
            <SuccessMessage>
              <MessageIcon><CheckCircleIcon /></MessageIcon>
              {success}
            </SuccessMessage>
          )}

          {loading ? (
            <LoadingOverlay>
              <LoadingSpinnerLarge />
            </LoadingOverlay>
          ) : (
            <>
              {/* Today's Tasks Section */}
              <Card style={{ marginBottom: '0', boxShadow: 'none', border: 'none' }}>
                <SectionHeader isPending={false}>
                  <SectionTitle isPending={false}>
                    <CalendarIcon />
                    <span>Today's Tasks</span>
                    <DateBadge isPending={false}>{formatDate(new Date())}</DateBadge>
                    <TaskCount isPending={false}>({todayTasks.length} {todayTasks.length === 1 ? 'task' : 'tasks'})</TaskCount>
                  </SectionTitle>
                </SectionHeader>
                <TableBody>
                  {todayTasks.length === 0 ? (
                    <EmptyState>
                      <EmptyIcon><InboxIcon /></EmptyIcon>
                      <EmptyText>No tasks for today</EmptyText>
                    </EmptyState>
                  ) : (
                    renderTaskTable(todayTasks)
                  )}
                </TableBody>
              </Card>

              {/* Pending Tasks Section */}
              {pendingTasks.length > 0 && (
                <Card style={{ marginTop: '2rem', marginBottom: '0', boxShadow: 'none', border: 'none' }}>
                  <SectionHeader isPending={true}>
                    <SectionTitle isPending={true}>
                      <ClockIcon />
                      <span>Pending Tasks from Previous Dates</span>
                      <TaskCount isPending={true}>
                        ({pendingTasks.reduce((sum, group) => sum + group.tasks.length, 0)} pending)
                      </TaskCount>
                    </SectionTitle>
                  </SectionHeader>
                  {pendingTasks.map((dateGroup, idx) => (
                    <div key={idx}>
                      <div style={{ 
                        padding: '1rem 2rem', 
                        background: 'linear-gradient(135deg, #fef9ec, #fffbeb)',
                        borderBottom: '1px solid #fde68a'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.75rem',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          color: '#92400e'
                        }}>
                          <CalendarIcon />
                          <span>{formatDate(dateGroup.date)}</span>
                          <span style={{ 
                            fontSize: '0.85rem', 
                            opacity: '0.8',
                            fontWeight: '500'
                          }}>
                            ({dateGroup.tasks.length} {dateGroup.tasks.length === 1 ? 'task' : 'tasks'})
                          </span>
                        </div>
                      </div>
                      <TableBody>
                        {renderTaskTable(dateGroup.tasks)}
                      </TableBody>
                    </div>
                  ))}
                </Card>
              )}
            </>
          )}
        </Card>
      </MainContent>

      {/* Reject Modal */}
      {showRejectModal && (
        <ModalOverlay onClick={closeRejectModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <XCircleIcon />
              <ModalTitle>Reject Task</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Label style={{ marginBottom: '0.5rem', display: 'block' }}>
                Reason for Rejection *
              </Label>
              <TextArea
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
                placeholder="Please provide a reason for rejecting this task..."
                rows={4}
              />
            </ModalBody>
            <ModalFooter>
              <CancelButton onClick={closeRejectModal}>
                Cancel
              </CancelButton>
              <RejectButton
                onClick={handleRejectTask}
                disabled={!rejectRemarks.trim() || actionLoading[`reject_${selectedTask?.task_id}`]}
              >
                {actionLoading[`reject_${selectedTask?.task_id}`] ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <XCircleIcon />
                    Reject Task
                  </>
                )}
              </RejectButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default LogisticsTaskManagement;
