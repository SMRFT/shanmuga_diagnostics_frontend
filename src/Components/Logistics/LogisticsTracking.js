import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { APIProvider, Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { 
  Users, RefreshCw, Navigation, Maximize2, Play, Pause, 
  MapPin, Clock, Search, ArrowRight, Crosshair, CheckCircle2,
  Activity, Compass, ShieldCheck, ChevronRight, X
} from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import apiRequest from '../Auth/apiRequest';

// --- Animations ---
const pulseGlow = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
`;

const liveBeacon = keyframes`
  0% { transform: scale(1); opacity: 0.9; }
  100% { transform: scale(2.2); opacity: 0; }
`;

// --- Styled Components ---
const Container = styled.div`
  padding: 16px 20px;
  background: #f1f5f9;
  min-height: 100vh;
  font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
  box-sizing: border-box;
`;

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 12px;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PageTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const SyncBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.$active ? '#ecfdf5' : '#f1f5f9'};
  color: ${props => props.$active ? '#065f46' : '#475569'};
  border: 1px solid ${props => props.$active ? '#a7f3d0' : '#cbd5e1'};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$active ? '#10b981' : '#94a3b8'};
  display: inline-block;
  ${props => props.$active && `
    box-shadow: 0 0 8px #10b981;
    animation: ${pulseGlow} 2s infinite;
  `}
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  cursor: pointer;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);

  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
    color: #0f172a;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 16px;
  height: calc(100vh - 95px);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const SidebarCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

const SearchBox = styled.div`
  position: relative;
  margin-bottom: 12px;

  input {
    width: 100%;
    padding: 9px 12px 9px 36px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    font-size: 13px;
    background: #f8fafc;
    outline: none;
    box-sizing: border-box;
    transition: all 0.2s ease;

    &:focus {
      background: #ffffff;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }
  }

  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 8px;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 6px 8px;
  border-radius: 6px;
  border: none;
  background: ${props => props.$active ? '#ffffff' : 'transparent'};
  color: ${props => props.$active ? '#0f172a' : '#64748b'};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${props => props.$active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'};
  transition: all 0.15s ease;
`;

const CollectorList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const CollectorItem = styled.div`
  padding: 12px;
  border-radius: 10px;
  border: 1.5px solid ${props => props.$selected ? '#6366f1' : '#f1f5f9'};
  background: ${props => props.$selected ? '#f5f3ff' : '#ffffff'};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$selected ? '0 4px 12px rgba(99,102,241,0.12)' : '0 1px 3px rgba(0,0,0,0.03)'};

  &:hover {
    border-color: ${props => props.$selected ? '#6366f1' : '#cbd5e1'};
    background: ${props => props.$selected ? '#f5f3ff' : '#f8fafc'};
    transform: translateY(-1px);
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const NameTag = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  color: #1e293b;
`;

const ColorPill = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$color};
  box-shadow: 0 0 6px ${props => props.$color};
  flex-shrink: 0;
`;

const DistanceBadge = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #4338ca;
  background: #eef2ff;
  padding: 3px 8px;
  border-radius: 6px;
`;

const ItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #64748b;
`;

const StatusChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  color: ${props => props.$active ? '#16a34a' : '#64748b'};
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  position: relative;
  border: 1px solid #e2e8f0;
`;

const MapOverlayControls = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OverlayBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    color: #4f46e5;
  }
`;

const BottomDetailCard = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  max-width: 620px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 16px 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.18);
  border: 1px solid rgba(226, 232, 240, 0.9);
  z-index: 20;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// --- Color Palette ---
const PERSON_COLORS = [
  '#4F46E5', '#059669', '#DC2626', '#D97706', '#7C3AED', 
  '#0891B2', '#BE185D', '#EA580C', '#2563EB', '#16A34A', '#9333EA', '#0284C7'
];

const getPersonColor = (index, name = '') => {
  if (typeof index === 'number' && index >= 0) {
    return PERSON_COLORS[index % PERSON_COLORS.length];
  }
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PERSON_COLORS[Math.abs(hash) % PERSON_COLORS.length];
};

export const formatDistance = (dist) => {
  if (dist === null || dist === undefined || dist === '') return '0.00 km';
  let val = parseFloat(dist);
  if (isNaN(val) || val <= 0) return '0.00 km';

  if (val < 0.1) {
    const meters = Math.round(val * 1000);
    return `${meters} m`;
  }
  return `${val.toFixed(2)} km`;
};

const calculateBearing = (startLat, startLng, destLat, destLng) => {
  const startPhi = (startLat * Math.PI) / 180;
  const destPhi = (destLat * Math.PI) / 180;
  const dDelta = ((destLng - startLng) * Math.PI) / 180;
  const y = Math.sin(dDelta) * Math.cos(destPhi);
  const x = Math.cos(startPhi) * Math.sin(destPhi) - Math.sin(startPhi) * Math.cos(destPhi) * Math.cos(dDelta);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
};

// --- Custom SVGs for High-Visibility Markers ---
const getStartMarkerIcon = (color = '#10B981') => ({
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="46" viewBox="0 0 38 46">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M19 0 C8.5 0 0 8.5 0 19 C0 32 19 46 19 46 C19 46 38 32 38 19 C38 8.5 29.5 0 19 0 Z" fill="#10B981" filter="url(#shadow)"/>
      <circle cx="19" cy="18" r="10" fill="#FFFFFF"/>
      <text x="19" y="22" font-size="10" font-family="Arial, sans-serif" font-weight="bold" fill="#10B981" text-anchor="middle">START</text>
    </svg>
  `),
});

const getBikeMarkerIcon = (heading = 0, color = '#2563EB', isLive = true) => ({
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.35"/>
        </filter>
      </defs>
      <!-- Outer Beacon Ring -->
      <circle cx="25" cy="25" r="22" fill="${color}" fill-opacity="0.25"/>
      <g transform="rotate(${heading}, 25, 25)">
        <!-- Center Solid Badge -->
        <circle cx="25" cy="25" r="18" fill="${color}" stroke="#FFFFFF" stroke-width="2.5" filter="url(#glow)"/>
        <!-- Delivery Bike Silhouette -->
        <path d="M15 31 C15 28.5, 17.5 26.5, 20 26.5 L26 26.5 L29.5 20.5 C30 19.5, 31.5 19.5, 32 20.5 L34.5 24 L37 24 M17 32.5 A 4 4 0 1 0 17 24.5 A 4 4 0 1 0 17 32.5 M33 32.5 A 4 4 0 1 0 33 24.5 A 4 4 0 1 0 33 32.5 M25.5 19.5 A 2.2 2.2 0 1 0 25.5 15.1 A 2.2 2.2 0 1 0 25.5 19.5 Z" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>
  `),
});

const getCompletedMarkerIcon = (color = '#64748B') => ({
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="46" viewBox="0 0 38 46">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M19 0 C8.5 0 0 8.5 0 19 C0 32 19 46 19 46 C19 46 38 32 38 19 C38 8.5 29.5 0 19 0 Z" fill="#EF4444" filter="url(#shadow)"/>
      <circle cx="19" cy="18" r="10" fill="#FFFFFF"/>
      <text x="19" y="22" font-size="10" font-family="Arial, sans-serif" font-weight="bold" fill="#EF4444" text-anchor="middle">END</text>
    </svg>
  `),
});

// --- Map Camera & Bounds Controller ---
const MapViewController = ({ targetCollector, fitAllTrigger, collectors }) => {
  const map = useMap();

  // Navigate & fit route when collector is selected
  useEffect(() => {
    if (!map || !targetCollector) return;

    const history = (targetCollector.routePoints && targetCollector.routePoints.length > 0)
      ? targetCollector.routePoints
      : [{ lat: targetCollector.latitudeStart, lng: targetCollector.longitudeStart }];

    if (history.length === 0) return;

    if (history.length === 1) {
      const lat = parseFloat(history[0].lat || history[0].latitude);
      const lng = parseFloat(history[0].lng || history[0].longitude);
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        map.panTo({ lat, lng });
        map.setZoom(15);
      }
    } else {
      const bounds = new window.google.maps.LatLngBounds();
      history.forEach(pt => {
        const lat = parseFloat(pt.lat || pt.latitude);
        const lng = parseFloat(pt.lng || pt.longitude);
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          bounds.extend({ lat, lng });
        }
      });
      map.fitBounds(bounds, { top: 60, right: 60, bottom: 120, left: 60 });
    }
  }, [map, targetCollector]);

  // Fit all collectors on screen
  useEffect(() => {
    if (!map || !collectors || collectors.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    let count = 0;

    collectors.forEach(c => {
      const history = (c.routePoints && c.routePoints.length > 0)
        ? c.routePoints
        : [{ lat: c.latitudeStart, lng: c.longitudeStart }];

      history.forEach(pt => {
        const lat = parseFloat(pt.lat || pt.latitude);
        const lng = parseFloat(pt.lng || pt.longitude);
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          bounds.extend({ lat, lng });
          count++;
        }
      });
    });

    if (count > 0) {
      map.fitBounds(bounds, { top: 70, right: 70, bottom: 70, left: 70 });
    }
  }, [map, fitAllTrigger]);

  return null;
};

// --- Stable Polyline Path Component ---
const TrackedPolyline = ({ points, color, isSelected }) => {
  const map = useMap();
  const polylineRef = useRef(null);
  const casingRef = useRef(null);
  const lastLenRef = useRef(0);

  const pathCoordinates = useMemo(() => {
    if (!points || !Array.isArray(points)) return [];
    return points
      .map(p => ({
        lat: parseFloat(p.latitude || p.lat),
        lng: parseFloat(p.longitude || p.lng)
      }))
      .filter(p => !isNaN(p.lat) && !isNaN(p.lng) && p.lat !== 0 && p.lng !== 0);
  }, [points]);

  useEffect(() => {
    if (!map || pathCoordinates.length < 2) return;

    // Only recreate polyline if point count changes or selection changes
    if (polylineRef.current && lastLenRef.current === pathCoordinates.length) {
      polylineRef.current.setOptions({
        strokeColor: color,
        strokeWeight: isSelected ? 5 : 3,
        strokeOpacity: isSelected ? 1.0 : 0.65,
        zIndex: isSelected ? 10 : 3
      });
      return;
    }
    lastLenRef.current = pathCoordinates.length;

    if (casingRef.current) casingRef.current.setMap(null);
    if (polylineRef.current) polylineRef.current.setMap(null);

    casingRef.current = new window.google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: '#FFFFFF',
      strokeOpacity: isSelected ? 0.9 : 0.6,
      strokeWeight: isSelected ? 7 : 5,
      map: map,
      zIndex: isSelected ? 9 : 2
    });

    polylineRef.current = new window.google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: isSelected ? 1.0 : 0.7,
      strokeWeight: isSelected ? 5 : 3,
      map: map,
      zIndex: isSelected ? 10 : 3
    });

    return () => {
      if (casingRef.current) casingRef.current.setMap(null);
      if (polylineRef.current) polylineRef.current.setMap(null);
    };
  }, [map, pathCoordinates, color, isSelected]);

  return null;
};

// --- Smooth Live Travelling Rider Marker ---
const LiveTravellingMarker = ({ points, collector, color, isLive, onClick }) => {
  const [currentPos, setCurrentPos] = useState(null);
  const [heading, setHeading] = useState(0);
  const prevTargetRef = useRef(null);
  const animFrameRef = useRef(null);

  const parsedPoints = useMemo(() => {
    if (!points || !Array.isArray(points)) return [];
    return points
      .map(p => ({
        lat: parseFloat(p.latitude || p.lat),
        lng: parseFloat(p.longitude || p.lng)
      }))
      .filter(p => !isNaN(p.lat) && !isNaN(p.lng) && p.lat !== 0 && p.lng !== 0);
  }, [points]);

  const lastPoint = useMemo(() => {
    return parsedPoints.length > 0 ? parsedPoints[parsedPoints.length - 1] : null;
  }, [parsedPoints]);

  useEffect(() => {
    if (!lastPoint) return;

    const prevTarget = prevTargetRef.current;
    if (!prevTarget) {
      setCurrentPos(lastPoint);
      prevTargetRef.current = lastPoint;
      return;
    }

    if (prevTarget.lat === lastPoint.lat && prevTarget.lng === lastPoint.lng) {
      return;
    }

    const brng = calculateBearing(prevTarget.lat, prevTarget.lng, lastPoint.lat, lastPoint.lng);
    setHeading(brng);

    const startLat = currentPos ? currentPos.lat : prevTarget.lat;
    const startLng = currentPos ? currentPos.lng : prevTarget.lng;
    const destLat = lastPoint.lat;
    const destLng = lastPoint.lng;

    let startTime = null;
    const duration = 10000;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const nextLat = startLat + (destLat - startLat) * progress;
      const nextLng = startLng + (destLng - startLng) * progress;

      setCurrentPos({ lat: nextLat, lng: nextLng });

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        prevTargetRef.current = lastPoint;
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [lastPoint]);

  if (!currentPos && !lastPoint) return null;

  const position = currentPos || lastPoint;
  const markerIcon = isLive ? getBikeMarkerIcon(heading, color, isLive) : getCompletedMarkerIcon(color);

  return (
    <Marker
      position={position}
      icon={markerIcon}
      onClick={onClick}
      title={`${collector.sampleCollector} (${isLive ? 'Live Travelling' : 'Shift Ended'})`}
    />
  );
};

// --- Main Dashboard Component ---
const LogisticsTracking = () => {
  const [collectors, setCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [navigationTarget, setNavigationTarget] = useState(null);
  const [fitAllTrigger, setFitAllTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'active' | 'completed'

  const [initialLoading, setInitialLoading] = useState(true);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(25);

  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const BASE_URL = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const today = new Date().toISOString().split('T')[0];

  const fetchData = useCallback(async (isManual = false) => {
    try {
      if (isManual) setIsManualSyncing(true);
      const res = await apiRequest(`${BASE_URL}sample-collector-location/?date=${today}`, 'GET');
      const dataArray = Array.isArray(res) ? res : (res?.data || res?.results || []);
      const validData = dataArray.filter(item => item.sampleCollector && ((item.routePoints && item.routePoints.length > 0) || item.latitudeStart));
      
      setCollectors(validData);

      // Keep selected collector synced with fresh data without breaking active view
      setSelectedCollector(prev => {
        if (!prev) return null;
        return validData.find(c => c.id === prev.id) || prev;
      });

      setCountdown(25);
    } catch (err) {
      console.error("Live Tracking Error:", err);
    } finally {
      setInitialLoading(false);
      if (isManual) setIsManualSyncing(false);
    }
  }, [BASE_URL, today]);

  // Initial load
  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // Auto-refresh timer & silent polling every 25s
  useEffect(() => {
    if (!autoRefresh) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchData(false);
          return 25;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefresh, fetchData]);

  // Filtered list
  const filteredCollectors = useMemo(() => {
    return collectors.filter(c => {
      const matchesSearch = c.sampleCollector.toLowerCase().includes(searchQuery.toLowerCase());
      if (filterTab === 'active') return matchesSearch && c.isActive;
      if (filterTab === 'completed') return matchesSearch && !c.isActive;
      return matchesSearch;
    });
  }, [collectors, searchQuery, filterTab]);

  const activeCount = useMemo(() => collectors.filter(c => c.isActive).length, [collectors]);
  const completedCount = useMemo(() => collectors.filter(c => !c.isActive).length, [collectors]);

  const handleSelectCollector = (collector) => {
    setSelectedCollector(collector);
    setNavigationTarget(collector);
  };

  return (
    <Container>
      {/* --- HEADER --- */}
      <HeaderBar>
        <TitleSection>
          <PageTitle>
            <Navigation color="#4F46E5" size={24} /> Live Sample Collector Tracking
          </PageTitle>
        </TitleSection>

        <HeaderActions>
          <SyncBadge $active={autoRefresh}>
            <LiveDot $active={autoRefresh} />
            {autoRefresh ? `Auto-sync in ${countdown}s` : 'Sync Paused'}
          </SyncBadge>

          <ActionBtn 
            onClick={() => setAutoRefresh(prev => !prev)}
            title={autoRefresh ? "Pause live auto-refresh while you inspect" : "Resume live auto-refresh"}
          >
            {autoRefresh ? <Pause size={14} color="#ef4444" /> : <Play size={14} color="#10b981" />}
            {autoRefresh ? "Pause Live" : "Resume Live"}
          </ActionBtn>

          <ActionBtn onClick={() => fetchData(true)} disabled={isManualSyncing}>
            <RefreshCw size={14} className={isManualSyncing ? 'animate-spin' : ''} />
            Sync Now
          </ActionBtn>
        </HeaderActions>
      </HeaderBar>

      {/* --- MAIN INTERFACE --- */}
      <MainGrid>
        {/* --- LEFT SIDEBAR --- */}
        <SidebarCard>
          <SearchBox>
            <Search size={15} />
            <input 
              type="text" 
              placeholder="Search sample collector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>

          <FilterTabs>
            <TabButton 
              $active={filterTab === 'all'} 
              onClick={() => setFilterTab('all')}
            >
              All ({collectors.length})
            </TabButton>
            <TabButton 
              $active={filterTab === 'active'} 
              onClick={() => setFilterTab('active')}
            >
              🟢 Moving ({activeCount})
            </TabButton>
            <TabButton 
              $active={filterTab === 'completed'} 
              onClick={() => setFilterTab('completed')}
            >
              🏁 Ended ({completedCount})
            </TabButton>
          </FilterTabs>

          <CollectorList>
            {filteredCollectors.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8', fontSize: '13px' }}>
                {initialLoading ? 'Loading collectors...' : 'No sample collectors found'}
              </div>
            )}

            {filteredCollectors.map((c, index) => {
              const personColor = getPersonColor(index, c.sampleCollector);
              const isSelected = selectedCollector?.id === c.id;

              return (
                <CollectorItem 
                  key={c.id || index}
                  $selected={isSelected}
                  onClick={() => handleSelectCollector(c)}
                >
                  <ItemHeader>
                    <NameTag>
                      <ColorPill $color={personColor} />
                      <span>{c.sampleCollector}</span>
                    </NameTag>
                    <DistanceBadge>
                      {formatDistance(c.distance_travelled)}
                    </DistanceBadge>
                  </ItemHeader>

                  <ItemMeta>
                    <StatusChip $active={c.isActive}>
                      {c.isActive ? '● Live Moving' : '✓ Shift Ended'}
                    </StatusChip>
                    <span>
                      {c.startTime ? `Started: ${new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                    </span>
                  </ItemMeta>
                </CollectorItem>
              );
            })}
          </CollectorList>
        </SidebarCard>

        {/* --- RIGHT GOOGLE MAP --- */}
        <MapContainer>
          <APIProvider apiKey={API_KEY}>
            <Map
              defaultCenter={{ lat: 11.6735, lng: 78.1525 }}
              defaultZoom={12}
              mapId="bf50a69a05151240"
              gestureHandling={'greedy'}
              disableDefaultUI={false}
            >
              <MapViewController 
                targetCollector={navigationTarget} 
                fitAllTrigger={fitAllTrigger} 
                collectors={collectors} 
              />

              {/* Render Paths and Markers */}
              {collectors.map((collector, index) => {
                const history = (collector.routePoints && collector.routePoints.length > 0)
                  ? collector.routePoints
                  : [
                      { lat: collector.latitudeStart, lng: collector.longitudeStart },
                      { lat: collector.currentLatitude || collector.latitudeEnd, lng: collector.currentLongitude || collector.longitudeEnd }
                    ].filter(p => p.lat && p.lng);

                if (!history.length) return null;
                const startPos = history[0];
                const personColor = getPersonColor(index, collector.sampleCollector);
                const isSelected = selectedCollector?.id === collector.id;

                const startLat = parseFloat(startPos.latitude || startPos.lat);
                const startLng = parseFloat(startPos.longitude || startPos.lng);

                return (
                  <React.Fragment key={collector.id || index}>
                    {/* Road Polyline */}
                    <TrackedPolyline 
                      points={history} 
                      color={personColor} 
                      isSelected={isSelected}
                    />

                    {/* Start Location Pin */}
                    {!isNaN(startLat) && !isNaN(startLng) && (
                      <Marker
                        position={{ lat: startLat, lng: startLng }}
                        icon={getStartMarkerIcon(personColor)}
                        onClick={() => handleSelectCollector(collector)}
                        title={`Start Point: ${collector.sampleCollector}`}
                      />
                    )}

                    {/* Current Live Moving Bike Marker */}
                    <LiveTravellingMarker
                      points={history}
                      collector={collector}
                      color={personColor}
                      isLive={collector.isActive}
                      onClick={() => handleSelectCollector(collector)}
                    />
                  </React.Fragment>
                );
              })}

              {/* FLOATING MAP CONTROLS */}
              <MapOverlayControls>
                <OverlayBtn onClick={() => setFitAllTrigger(prev => prev + 1)} title="Fit all sample collectors on screen">
                  <Maximize2 size={14} /> Fit All Riders
                </OverlayBtn>
              </MapOverlayControls>

              {/* BOTTOM DETAIL CARD FOR SELECTED COLLECTOR */}
              {selectedCollector && (
                <BottomDetailCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ColorPill $color={getPersonColor(0, selectedCollector.sampleCollector)} style={{ width: '16px', height: '16px' }} />
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
                          {selectedCollector.sampleCollector}
                        </h3>
                        <span style={{ fontSize: '12px', color: selectedCollector.isActive ? '#16a34a' : '#64748b', fontWeight: '600' }}>
                          {selectedCollector.isActive ? '🟢 Currently Travelling On Duty' : '🏁 Shift Completed'}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedCollector(null)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '8px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Distance Travelled</div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#4338ca' }}>
                        {formatDistance(selectedCollector.distance_travelled)}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Duty Started</div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                        {selectedCollector.startTime ? new Date(selectedCollector.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </div>
                    </div>

                    {selectedCollector.endTime && (
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Duty Ended</div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                          {new Date(selectedCollector.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <ActionBtn onClick={() => setNavigationTarget({ ...selectedCollector })}>
                      <Crosshair size={14} color="#4F46E5" /> Focus Route
                    </ActionBtn>
                  </div>
                </BottomDetailCard>
              )}
            </Map>
          </APIProvider>
        </MapContainer>
      </MainGrid>
    </Container>
  );
};

export default LogisticsTracking;
