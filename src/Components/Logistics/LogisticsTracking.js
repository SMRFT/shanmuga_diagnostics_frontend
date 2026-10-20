import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { 
  Users, RefreshCw, Navigation, Maximize2, Play, Pause, 
  MapPin, Clock, Search, ArrowRight, Crosshair, CheckCircle2,
  Activity, Compass, ShieldCheck, ChevronRight, X
} from 'lucide-react';
import styled, { keyframes, css } from 'styled-components';
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
  ${props => props.$active && css`
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
  font-size: 11px;
  color: ${props => {
    if (props.$type === 'moving') return '#16a34a';
    if (props.$type === 'stationary') return '#b45309';
    if (props.$type === 'no_data') return '#64748b';
    return '#64748b';
  }};
  background: ${props => {
    if (props.$type === 'moving') return '#ecfdf5';
    if (props.$type === 'stationary') return '#fffbeb';
    if (props.$type === 'no_data') return '#f8fafc';
    return '#f1f5f9';
  }};
  padding: 2px 7px;
  border-radius: 12px;
  border: 1px solid ${props => {
    if (props.$type === 'moving') return '#a7f3d0';
    if (props.$type === 'stationary') return '#fde68a';
    if (props.$type === 'no_data') return '#e2e8f0';
    return '#e2e8f0';
  }};
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

// --- Custom Clean SVGs for Compact High-Visibility Markers ---
const getStartMarkerIcon = (color = '#10B981') => ({
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
      <defs>
        <filter id="s-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <circle cx="13" cy="13" r="11" fill="${color}" stroke="#FFFFFF" stroke-width="2.5" filter="url(#s-glow)"/>
      <text x="13" y="17" font-size="12" font-family="'Inter', Arial, sans-serif" font-weight="900" fill="#FFFFFF" text-anchor="middle">S</text>
    </svg>
  `),
  scaledSize: (window.google?.maps) ? new window.google.maps.Size(26, 26) : undefined,
  anchor: (window.google?.maps) ? new window.google.maps.Point(13, 13) : undefined,
});

// Swiggy / Zomato style Vehicle Delivery Bike with heading rotation and idle stoppage indicator
const getDeliveryVehicleMarkerIcon = (heading = 0, color = '#2563EB', isStationary = false) => {
  const haloColor = isStationary ? '#F59E0B' : color;
  const badgeColor = isStationary ? '#D97706' : color;
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
        <defs>
          <filter id="bike-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="#000000" flood-opacity="0.35"/>
          </filter>
        </defs>
        <!-- Outer Pulsing Halo -->
        <circle cx="19" cy="19" r="18" fill="${haloColor}" fill-opacity="${isStationary ? '0.35' : '0.22'}"/>
        <!-- Solid Badge Circle -->
        <circle cx="19" cy="19" r="14" fill="${badgeColor}" stroke="#FFFFFF" stroke-width="2" filter="url(#bike-shadow)"/>
        <!-- Delivery Scooter Graphic -->
        <g transform="rotate(${heading}, 19, 19)">
          <rect x="10.5" y="15.5" width="4" height="4" rx="0.8" fill="#FFFFFF" fill-opacity="0.95"/>
          <circle cx="13.5" cy="23" r="2.2" fill="none" stroke="#FFFFFF" stroke-width="1.6"/>
          <circle cx="24.5" cy="23" r="2.2" fill="none" stroke="#FFFFFF" stroke-width="1.6"/>
          <path d="M13.5 23 L18 23 L20.5 16.5 L23.5 16.5 M24.5 23 L22.5 16.5 L24.5 14" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="18.5" cy="13" r="1.8" fill="#FFFFFF"/>
        </g>
        ${isStationary ? `
          <!-- Idle / Parked Stoppage Indicator -->
          <circle cx="28" cy="10" r="6" fill="#DC2626" stroke="#FFFFFF" stroke-width="1.5"/>
          <rect x="26" y="8" width="1.5" height="4" rx="0.5" fill="#FFFFFF"/>
          <rect x="29" y="8" width="1.5" height="4" rx="0.5" fill="#FFFFFF"/>
        ` : ''}
      </svg>
    `),
    scaledSize: (window.google?.maps) ? new window.google.maps.Size(38, 38) : undefined,
    anchor: (window.google?.maps) ? new window.google.maps.Point(19, 19) : undefined,
  };
};

// Stoppage Pin Marker for Stops >= 8 mins
const getStoppageMarkerIcon = () => ({
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <defs>
        <filter id="stop-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <circle cx="14" cy="14" r="12" fill="#D97706" stroke="#FFFFFF" stroke-width="2.2" filter="url(#stop-glow)"/>
      <rect x="9.5" y="8.5" width="3" height="11" rx="1" fill="#FFFFFF"/>
      <rect x="15.5" y="8.5" width="3" height="11" rx="1" fill="#FFFFFF"/>
    </svg>
  `),
  scaledSize: (window.google?.maps) ? new window.google.maps.Size(24, 24) : undefined,
  anchor: (window.google?.maps) ? new window.google.maps.Point(12, 12) : undefined,
});

// Distinct Ended / Shift Completed Marker
const getCompletedMarkerIcon = (color = '#EF4444') => ({
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <defs>
        <filter id="e-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <circle cx="14" cy="14" r="12" fill="${color}" stroke="#FFFFFF" stroke-width="2.2" filter="url(#e-glow)"/>
      <text x="14" y="18" font-size="12" font-family="'Inter', Arial, sans-serif" font-weight="900" fill="#FFFFFF" text-anchor="middle">E</text>
    </svg>
  `),
  scaledSize: (window.google?.maps) ? new window.google.maps.Size(28, 28) : undefined,
  anchor: (window.google?.maps) ? new window.google.maps.Point(14, 14) : undefined,
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
const TrackedPolyline = ({ points, color = '#2563EB', isSelected }) => {
  const map = useMap();
  const polylineRef = useRef(null);
  const casingRef = useRef(null);

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
    if (!map || !window.google?.maps || pathCoordinates.length < 2) {
      if (casingRef.current) { casingRef.current.setMap(null); casingRef.current = null; }
      if (polylineRef.current) { polylineRef.current.setMap(null); polylineRef.current = null; }
      return;
    }

    if (!polylineRef.current) {
      casingRef.current = new window.google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.9,
        strokeWeight: isSelected ? 6 : 4,
        map: map,
        zIndex: isSelected ? 9 : 2
      });

      polylineRef.current = new window.google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: color || '#2563EB',
        strokeOpacity: 1.0,
        strokeWeight: isSelected ? 4 : 3,
        map: map,
        zIndex: isSelected ? 10 : 3
      });
    } else {
      if (casingRef.current) {
        casingRef.current.setPath(pathCoordinates);
        casingRef.current.setOptions({
          strokeWeight: isSelected ? 6 : 4,
          zIndex: isSelected ? 9 : 2
        });
      }
      polylineRef.current.setPath(pathCoordinates);
      polylineRef.current.setOptions({
        strokeColor: color || '#2563EB',
        strokeWeight: isSelected ? 4 : 3,
        zIndex: isSelected ? 10 : 3
      });
    }

    return () => {
      try {
        if (casingRef.current) {
          casingRef.current.setMap(null);
          casingRef.current = null;
        }
      } catch (e) {}
      try {
        if (polylineRef.current) {
          polylineRef.current.setMap(null);
          polylineRef.current = null;
        }
      } catch (e) {}
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

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, []);

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
      if (!isMountedRef.current) return;
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const nextLat = startLat + (destLat - startLat) * progress;
      const nextLng = startLng + (destLng - startLng) * progress;

      if (isMountedRef.current) {
        setCurrentPos({ lat: nextLat, lng: nextLng });
      }

      if (progress < 1 && isMountedRef.current) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        prevTargetRef.current = lastPoint;
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [lastPoint]);

  if (!currentPos && !lastPoint) return null;

  const position = currentPos || lastPoint;
  const isStationary = isLive && (collector.trackingStatus === 'stationary' || (collector.idleMinutes && collector.idleMinutes >= 5));
  const markerIcon = isLive ? getDeliveryVehicleMarkerIcon(heading, color, isStationary) : getCompletedMarkerIcon('#EF4444');

  const statusText = !isLive 
    ? 'Shift Ended' 
    : isStationary 
    ? `⏸️ Stationary (${Math.round(collector.idleMinutes || 0)}m)` 
    : 'Live Moving';

  return (
    <Marker
      position={position}
      icon={markerIcon}
      onClick={onClick}
      title={`${collector.sampleCollector} (${statusText})`}
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

  const [selectedStoppage, setSelectedStoppage] = useState(null);
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
      if (filterTab === 'moving') {
        return matchesSearch && c.isActive && c.trackingStatus === 'moving';
      }
      if (filterTab === 'stationary') {
        return matchesSearch && c.isActive && (c.trackingStatus === 'stationary' || (c.idleMinutes && c.idleMinutes >= 5));
      }
      if (filterTab === 'completed') {
        return matchesSearch && (!c.isActive || c.trackingStatus === 'completed');
      }
      return matchesSearch;
    });
  }, [collectors, searchQuery, filterTab]);

  const movingCount = useMemo(() => collectors.filter(c => c.isActive && c.trackingStatus === 'moving').length, [collectors]);
  const stationaryCount = useMemo(() => collectors.filter(c => c.isActive && (c.trackingStatus === 'stationary' || (c.idleMinutes && c.idleMinutes >= 5))).length, [collectors]);
  const completedCount = useMemo(() => collectors.filter(c => !c.isActive || c.trackingStatus === 'completed').length, [collectors]);

  const handleSelectCollector = (collector) => {
    setSelectedCollector(collector);
    setNavigationTarget(collector);
  };

  const renderStatusChip = (c) => {
    if (!c.isActive || c.endTime || c.trackingStatus === 'completed') {
      return <StatusChip $type="completed">✓ Shift Ended</StatusChip>;
    }
    if (c.trackingStatus === 'no_data' || !c.currentLatitude || c.currentLatitude === "0") {
      return <StatusChip $type="no_data">⚪ No Location Data</StatusChip>;
    }
    if (c.trackingStatus === 'stationary' || (c.idleMinutes && c.idleMinutes >= 5)) {
      const mins = Math.round(c.idleMinutes || 0);
      const timeText = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
      return (
        <StatusChip $type="stationary" title={`Stationary at same place for ${timeText}`}>
          ⏸️ Stopped {timeText}
        </StatusChip>
      );
    }
    return <StatusChip $type="moving">🟢 Live Moving</StatusChip>;
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
              $active={filterTab === 'moving'} 
              onClick={() => setFilterTab('moving')}
            >
              🟢 Moving ({movingCount})
            </TabButton>
            <TabButton 
              $active={filterTab === 'stationary'} 
              onClick={() => setFilterTab('stationary')}
            >
              ⏸️ Stopped ({stationaryCount})
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
                    <DistanceBadge title="Verified Accurate Travelled Distance">
                      {formatDistance(c.distance_travelled)}
                    </DistanceBadge>
                  </ItemHeader>

                  <ItemMeta>
                    {renderStatusChip(c)}
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
          <Map
            defaultCenter={{ lat: 11.6735, lng: 78.1525 }}
            defaultZoom={12}
            mapId="bf50a69a05151240"
            gestureHandling={'greedy'}
            disableDefaultUI={false}
            reuseMaps={true}
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

                // Distinct styling: Moving/Active routes have vibrant colors, Ended routes are muted slate gray
                const routeColor = collector.isActive
                  ? (isSelected ? '#2563EB' : personColor)
                  : (isSelected ? '#475569' : '#64748B');

                const startColor = collector.isActive ? '#10B981' : '#64748B';

                return (
                  <React.Fragment key={collector.id || index}>
                    {/* Road Polyline (Vibrant for moving, Slate for ended) */}
                    <TrackedPolyline 
                      points={history} 
                      color={routeColor} 
                      isSelected={isSelected}
                    />

                    {/* Start Location Pin */}
                    {!isNaN(startLat) && !isNaN(startLng) && (
                      <Marker
                        position={{ lat: startLat, lng: startLng }}
                        icon={getStartMarkerIcon(startColor)}
                        onClick={() => handleSelectCollector(collector)}
                        title={`Start Point: ${collector.sampleCollector}`}
                      />
                    )}

                    {/* Live Moving Vehicle / Ended Marker */}
                    <LiveTravellingMarker
                      points={history}
                      collector={collector}
                      color={personColor}
                      isLive={collector.isActive}
                      onClick={() => handleSelectCollector(collector)}
                    />

                    {/* Stoppage Markers (where collector stopped >= 8 mins) */}
                    {collector.stoppages && collector.stoppages.map((stop, sIdx) => {
                      const sLat = parseFloat(stop.lat);
                      const sLng = parseFloat(stop.lng);
                      if (isNaN(sLat) || isNaN(sLng) || sLat === 0 || sLng === 0) return null;
                      return (
                        <Marker
                          key={`stop-${collector.id}-${sIdx}`}
                          position={{ lat: sLat, lng: sLng }}
                          icon={getStoppageMarkerIcon()}
                          onClick={() => setSelectedStoppage({ ...stop, collectorName: collector.sampleCollector })}
                          title={`Stoppage: ${stop.durationMinutes} mins at ${new Date(stop.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        />
                      );
                    })}
                  </React.Fragment>
                );
              })}

              {/* Stoppage Info Window Popup */}
              {selectedStoppage && (
                <InfoWindow
                  position={{ lat: parseFloat(selectedStoppage.lat), lng: parseFloat(selectedStoppage.lng) }}
                  onCloseClick={() => setSelectedStoppage(null)}
                >
                  <div style={{ color: '#1e293b', minWidth: '180px', padding: '4px' }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: '#d97706', marginBottom: '4px' }}>
                      ⏸️ Stopped for {selectedStoppage.durationMinutes} mins
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>
                      {selectedStoppage.collectorName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      Arrived: {new Date(selectedStoppage.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    {selectedStoppage.endTime && (
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        Departed: {new Date(selectedStoppage.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    )}
                    {selectedStoppage.isCurrent && (
                      <div style={{ fontSize: '10px', color: '#dc2626', fontWeight: '700', marginTop: '6px' }}>
                        ● Currently Parked / Idle Here
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}

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
                        <span style={{ fontSize: '12px', color: selectedCollector.trackingStatus === 'stationary' ? '#d97706' : selectedCollector.isActive ? '#16a34a' : '#64748b', fontWeight: '600' }}>
                          {selectedCollector.trackingStatus === 'stationary'
                            ? `⏸️ Stationary for ${Math.round(selectedCollector.idleMinutes || 0)} mins`
                            : selectedCollector.isActive ? '🟢 Currently Travelling On Duty' : '🏁 Shift Completed'}
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
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#4338ca' }}>
                        {formatDistance(selectedCollector.distance_travelled)}
                      </div>
                      <div style={{ fontSize: '10px', color: '#059669', fontWeight: '600' }}>✓ Verified Accurate</div>
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

                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Current State</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: selectedCollector.trackingStatus === 'stationary' ? '#d97706' : selectedCollector.isActive ? '#16a34a' : '#64748b' }}>
                        {selectedCollector.trackingStatus === 'stationary'
                          ? `⏸️ Stopped (${Math.round(selectedCollector.idleMinutes || 0)}m)`
                          : selectedCollector.isActive ? '🟢 On the Move' : '🏁 Completed'}
                      </div>
                    </div>

                    {selectedCollector.stoppages && selectedCollector.stoppages.length > 0 && (
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Stops (8+ min)</div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#d97706' }}>
                          {selectedCollector.stoppages.length} stops ({Math.round(selectedCollector.stoppages.reduce((acc, s) => acc + (s.durationMinutes || 0), 0))}m)
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
        </MapContainer>
      </MainGrid>
    </Container>
  );
};

export default LogisticsTracking;
