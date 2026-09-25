import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { APIProvider, Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Calendar, Download, Search, MapPin, Clock, Users, Filter } from 'lucide-react';
import styled from 'styled-components';
import apiRequest from '../Auth/apiRequest';
import * as XLSX from 'xlsx';

// =============================================
// STYLED COMPONENTS
// =============================================
const PageContainer = styled.div`
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: #1e293b;
  font-size: 1.5rem;
`;

const MapSection = styled.div`
  width: 100%;
  height: 450px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid #e2e8f0;
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  min-width: 150px;
  &:focus {
    border-color: #4F46E5;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
  }
`;

const Select = styled.select`
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background: white;
  min-width: 180px;
  cursor: pointer;
  &:focus {
    border-color: #4F46E5;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #4F46E5, #6366f1);
  color: white;
  &:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(79,70,229,0.3); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

const SuccessButton = styled(Button)`
  background: linear-gradient(135deg, #059669, #10b981);
  color: white;
  &:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(5,150,105,0.3); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

const TableCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid #e2e8f0;
`;

const TableHeader = styled.div`
  padding: 16px 24px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 12px 16px;
  font-size: 13px;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
`;

const Tr = styled.tr`
  transition: background 0.15s;
  cursor: pointer;
  &:hover { background: #f8fafc; }
  &.selected { background: #eef2ff; }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  background: ${props => props.active ? '#dcfce7' : '#f1f5f9'};
  color: ${props => props.active ? '#166534' : '#64748b'};
`;

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`;

// --- Curated Vibrant Person Colors Palette ---
const ROUTE_COLORS = [
  '#4F46E5', // Indigo
  '#059669', // Emerald Green
  '#DC2626', // Bright Red
  '#D97706', // Amber / Orange
  '#7C3AED', // Royal Purple
  '#0891B2', // Cyan
  '#BE185D', // Pink / Rose
  '#EA580C', // Deep Orange
  '#2563EB', // Blue
  '#16A34A', // Forest Green
  '#9333EA', // Purple
  '#0284C7', // Sky Blue
];

const getRouteColor = (index, name = '') => {
  if (typeof index === 'number' && index >= 0) {
    return ROUTE_COLORS[index % ROUTE_COLORS.length];
  }
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ROUTE_COLORS[Math.abs(hash) % ROUTE_COLORS.length];
};

// --- SVG Icons for Start & End/Live Markers ---
const START_MARKER_ICON = {
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
      <defs>
        <filter id="hist-s-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <circle cx="13" cy="13" r="11" fill="#10B981" stroke="#FFFFFF" stroke-width="2.5" filter="url(#hist-s-glow)"/>
      <text x="13" y="17" font-size="12" font-family="'Inter', Arial, sans-serif" font-weight="900" fill="#FFFFFF" text-anchor="middle">S</text>
    </svg>
  `),
  scaledSize: (window.google?.maps) ? new window.google.maps.Size(26, 26) : undefined,
  anchor: (window.google?.maps) ? new window.google.maps.Point(13, 13) : undefined,
};

const END_MARKER_ICON = {
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
      <defs>
        <filter id="hist-e-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <circle cx="13" cy="13" r="11" fill="#EF4444" stroke="#FFFFFF" stroke-width="2.5" filter="url(#hist-e-glow)"/>
      <text x="13" y="17" font-size="11" font-family="'Inter', Arial, sans-serif" font-weight="900" fill="#FFFFFF" text-anchor="middle">E</text>
    </svg>
  `),
  scaledSize: (window.google?.maps) ? new window.google.maps.Size(26, 26) : undefined,
  anchor: (window.google?.maps) ? new window.google.maps.Point(13, 13) : undefined,
};

// Swiggy / Zomato style Delivery Vehicle Bike Marker
const getDeliveryVehicleMarkerIcon = (color = '#2563EB') => ({
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <defs>
        <filter id="hist-bike-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="#000000" flood-opacity="0.35"/>
        </filter>
      </defs>
      <circle cx="18" cy="18" r="17" fill="${color}" fill-opacity="0.22"/>
      <circle cx="18" cy="18" r="14" fill="${color}" stroke="#FFFFFF" stroke-width="2" filter="url(#hist-bike-shadow)"/>
      <g>
        <rect x="9.5" y="14.5" width="4" height="4" rx="0.8" fill="#FFFFFF" fill-opacity="0.95"/>
        <circle cx="12.5" cy="22" r="2.2" fill="none" stroke="#FFFFFF" stroke-width="1.6"/>
        <circle cx="23.5" cy="22" r="2.2" fill="none" stroke="#FFFFFF" stroke-width="1.6"/>
        <path d="M12.5 22 L17 22 L19.5 15.5 L22.5 15.5 M23.5 22 L21.5 15.5 L23.5 13" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="17.5" cy="12" r="1.8" fill="#FFFFFF"/>
      </g>
    </svg>
  `),
  scaledSize: (window.google?.maps) ? new window.google.maps.Size(36, 36) : undefined,
  anchor: (window.google?.maps) ? new window.google.maps.Point(18, 18) : undefined,
});

// =============================================
// SOLID TRAVELLING ROUTE POLYLINE COMPONENT
// =============================================
const TrackedPath = ({ collectorId, points, color = '#2563EB', onDistanceCalculated }) => {
  const map = useMap();
  const polylineRef = useRef(null);
  const shadowPolylineRef = useRef(null);

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
      if (shadowPolylineRef.current) { shadowPolylineRef.current.setMap(null); shadowPolylineRef.current = null; }
      if (polylineRef.current) { polylineRef.current.setMap(null); polylineRef.current = null; }
      return;
    }

    if (!polylineRef.current) {
      // 1. White border casing for high contrast on roads
      shadowPolylineRef.current = new window.google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.9,
        strokeWeight: 6,
        map: map,
        zIndex: 2
      });

      // 2. Main vibrant travelling polyline
      polylineRef.current = new window.google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: color || '#2563EB',
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map: map,
        zIndex: 3
      });
    } else {
      if (shadowPolylineRef.current) {
        shadowPolylineRef.current.setPath(pathCoordinates);
      }
      polylineRef.current.setPath(pathCoordinates);
      polylineRef.current.setOptions({
        strokeColor: color || '#2563EB',
        strokeWeight: 4,
        zIndex: 3
      });
    }

    // Compute distance
    if (onDistanceCalculated && collectorId) {
      let totalMeters = 0;
      for (let i = 0; i < pathCoordinates.length - 1; i++) {
        const p1 = new window.google.maps.LatLng(pathCoordinates[i].lat, pathCoordinates[i].lng);
        const p2 = new window.google.maps.LatLng(pathCoordinates[i + 1].lat, pathCoordinates[i + 1].lng);
        if (window.google.maps.geometry && window.google.maps.geometry.spherical) {
          totalMeters += window.google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
        } else {
          const R = 6371e3;
          const dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
          const dLng = (p2.lng() - p1.lng()) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
                    Math.sin(dLng/2) * Math.sin(dLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          totalMeters += R * c;
        }
      }
      onDistanceCalculated(collectorId, (totalMeters / 1000).toFixed(2));
    }

    return () => {
      if (shadowPolylineRef.current) {
        shadowPolylineRef.current.setMap(null);
        shadowPolylineRef.current = null;
      }
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, pathCoordinates, color, collectorId, onDistanceCalculated]);

  return null;
};

// =============================================
// HELPER FUNCTIONS
// =============================================
const formatDuration = (seconds) => {
  if (!seconds) return '-';
  const sec = parseFloat(seconds);
  if (isNaN(sec)) return '-';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const formatTime = (iso) => {
  if (!iso) return '-';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDistance = (dist) => {
  if (dist === null || dist === undefined || dist === '') return '0.00 km';
  let val = parseFloat(dist);
  if (isNaN(val) || val <= 0) return '0.00 km';

  if (val < 0.1) {
    const meters = Math.round(val * 1000);
    return `${meters} m`;
  }

  return `${val.toFixed(2)} km`;
};

// Reverse geocode cache to avoid repeated API calls
const geocodeCache = {};

const reverseGeocode = async (lat, lng, apiKey) => {
  if (!lat || !lng) return '-';
  const key = `${parseFloat(lat).toFixed(4)},${parseFloat(lng).toFixed(4)}`;
  if (geocodeCache[key]) return geocodeCache[key];
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    const data = await res.json();
    if (data.status === 'OK' && data.results.length > 0) {
      const components = data.results[0].address_components;
      const subloc = components.find(c => c.types.includes('sublocality_level_1'))?.long_name;
      const locality = components.find(c => c.types.includes('locality'))?.long_name;
      const route = components.find(c => c.types.includes('route'))?.long_name;
      const name = subloc || locality || route || data.results[0].formatted_address.split(',')[0];
      geocodeCache[key] = name;
      return name;
    }
  } catch (e) {
    console.error('Geocode error:', e);
  }
  return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
};

// =============================================
// MAIN COMPONENT
// =============================================
const TrackingHistory = () => {
  // Map date (single day view)
  const [mapDate, setMapDate] = useState(new Date().toISOString().split('T')[0]);
  const [mapData, setMapData] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [selectedMapCollector, setSelectedMapCollector] = useState(null);
  const [accurateDistances, setAccurateDistances] = useState({});

  // Table filters
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [collectorFilter, setCollectorFilter] = useState('');
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [allCollectors, setAllCollectors] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [locationNames, setLocationNames] = useState({});

  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const BASE_URL = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // --- Fetch map data for single date ---
  const fetchMapData = useCallback(async () => {
    try {
      setMapLoading(true);
      const res = await apiRequest(`${BASE_URL}sample-collector-location/?date=${mapDate}`, 'GET');
      const dataArray = Array.isArray(res) ? res : (res?.data || res?.results || []);
      const validData = dataArray.filter(item => item.sampleCollector && ((item.routePoints && item.routePoints.length > 0) || item.latitudeStart));
      setMapData(validData);
    } catch (err) {
      console.error("Map data error:", err);
    } finally {
      setMapLoading(false);
    }
  }, [mapDate, BASE_URL]);

  // --- Fetch table data for date range ---
  const fetchTableData = useCallback(async () => {
    try {
      setTableLoading(true);
      const res = await apiRequest(`${BASE_URL}sample-collector-location-history/?from_date=${fromDate}&to_date=${toDate}${collectorFilter ? `&sampleCollector=${encodeURIComponent(collectorFilter)}` : ''}`, 'GET');
      const dataArray = Array.isArray(res) ? res : (res?.data || res?.results || []);
      setTableData(dataArray);

      // Build unique collector names
      const names = [...new Set(dataArray.map(d => d.sampleCollector))].sort();
      setAllCollectors(prev => {
        const merged = [...new Set([...prev, ...names])];
        return merged.sort();
      });
    } catch (err) {
      console.error("Table data error:", err);
    } finally {
      setTableLoading(false);
    }
  }, [fromDate, toDate, collectorFilter, BASE_URL]);

  // --- Fetch sample collectors from the dedicated API ---
  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const res = await apiRequest(`${BASE_URL}sample-collector/`, 'GET');
        let names = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        names = names.map(c => {
          if (typeof c === 'object' && c !== null) {
            return { employeeId: c.employeeId || '', employeeName: c.employeeName || c.name || '' };
          }
          return { employeeId: c, employeeName: c };
        }).filter(c => c.employeeName && c.employeeName.trim() !== '');

        const uniqueCollectors = [];
        const seen = new Set();
        for (const c of names) {
          if (!seen.has(c.employeeId)) {
            seen.add(c.employeeId);
            uniqueCollectors.push(c);
          }
        }
        setAllCollectors(uniqueCollectors);
      } catch (err) {
        console.error('Failed to fetch collectors:', err);
      }
    };
    fetchCollectors();
    fetchMapData();
    fetchTableData();
  }, []);

  // --- Reverse geocode table rows after data loads ---
  useEffect(() => {
    if (!tableData.length) return;
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const geocodeRows = async () => {
      const updates = {};
      for (const row of tableData) {
        const id = row.id;
        const [startName, endName] = await Promise.all([
          reverseGeocode(row.latitudeStart, row.longitudeStart, apiKey),
          row.latitudeEnd ? reverseGeocode(row.latitudeEnd, row.longitudeEnd, apiKey) : Promise.resolve('-')
        ]);
        updates[id] = { start: startName, end: endName };
      }
      setLocationNames(prev => ({ ...prev, ...updates }));
    };
    geocodeRows();
  }, [tableData]);

  // --- Excel Download ---
  const handleDownloadExcel = () => {
    if (tableData.length === 0) return;

    const rows = tableData.map(row => ({
      'Date': formatDate(row.date),
      'Sample Collector': row.sampleCollector,
      'Start Time': formatTime(row.startTime),
      'Start Location': locationNames[row.id]?.start || (row.latitudeStart ? `${row.latitudeStart}, ${row.longitudeStart}` : '-'),
      'End Time': formatTime(row.endTime),
      'End Location': locationNames[row.id]?.end || (row.latitudeEnd ? `${row.latitudeEnd}, ${row.longitudeEnd}` : '-'),
      'Distance (km)': accurateDistances[row.id] || formatDistance(row.distance_travelled),
      'Duration': formatDuration(row.totalDuration),
      'Status': row.isActive ? 'Active' : 'Completed'
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tracking History');

    const colWidths = Object.keys(rows[0] || {}).map(key => ({
      wch: Math.max(key.length, ...rows.map(r => String(r[key] || '').length)) + 2
    }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `Tracking_History_${fromDate}_to_${toDate}.xlsx`);
  };

  // --- Row click -> show on map ---
  const handleRowClick = (row) => {
    setSelectedRow(row.id);

    const history = (row.routePoints && row.routePoints.length > 0)
      ? row.routePoints
      : [
          { lat: row.latitudeStart, lng: row.longitudeStart },
          { lat: row.currentLatitude || row.latitudeEnd, lng: row.currentLongitude || row.longitudeEnd }
        ].filter(p => p.lat && p.lng);

    if (history.length > 0) {
      setMapDate(row.date);
      setMapData([{ ...row, routePoints: history }]);
      setSelectedMapCollector({ ...row, routePoints: history });
    }
  };

  return (
    <PageContainer>
      {/* ---- HEADER ---- */}
      <PageHeader>
        <Title>
          <Clock color="#4F46E5" /> Tracking History
        </Title>
      </PageHeader>

      {/* ---- MAP SECTION ---- */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <Label style={{ margin: 0, minWidth: 'auto' }}>Map Date</Label>
          <Input
            type="date"
            value={mapDate}
            onChange={(e) => setMapDate(e.target.value)} max={new Date().toISOString().split("T")[0]}
            style={{ minWidth: '160px' }}
          />
          <PrimaryButton onClick={fetchMapData} disabled={mapLoading}>
            <Search size={14} /> {mapLoading ? 'Loading...' : 'View Routes'}
          </PrimaryButton>
        </div>
      </div>

      <MapSection>
        <APIProvider apiKey={API_KEY}>
          <Map
            defaultCenter={{ lat: 11.6735, lng: 78.1525 }}
            defaultZoom={11}
            mapId="bf50a69a05151240"
            gestureHandling={'greedy'}
            disableDefaultUI={false}
          >
            {mapData.map((collector, index) => {
              const history = (collector.routePoints && collector.routePoints.length > 0)
                ? collector.routePoints
                : [
                    { lat: collector.latitudeStart, lng: collector.longitudeStart },
                    { lat: collector.currentLatitude || collector.latitudeEnd, lng: collector.currentLongitude || collector.longitudeEnd }
                  ].filter(p => p.lat && p.lng);

              if (!history.length) return null;
              const startPos = history[0];
              const endPos = history[history.length - 1];
              const personColor = getRouteColor(index, collector.sampleCollector);

              const startLat = parseFloat(startPos.latitude || startPos.lat);
              const startLng = parseFloat(startPos.longitude || startPos.lng);
              const endLat = parseFloat(endPos.latitude || endPos.lat);
              const endLng = parseFloat(endPos.longitude || endPos.lng);

              return (
                <React.Fragment key={collector.id || index}>
                  <TrackedPath 
                    collectorId={collector.id}
                    points={history} 
                    color={collector.isActive ? (personColor || '#2563EB') : '#64748B'} 
                    onDistanceCalculated={(id, dist) => setAccurateDistances(prev => ({...prev, [id]: dist}))}
                  />
                  
                  {/* Start Location Marker */}
                  {!isNaN(startLat) && !isNaN(startLng) && (
                    <Marker
                      position={{ lat: startLat, lng: startLng }}
                      icon={START_MARKER_ICON}
                      onClick={() => setSelectedMapCollector(collector)}
                      title={`Start Location - ${collector.sampleCollector}`}
                    />
                  )}
                  
                  {/* End / Live Vehicle Location Marker */}
                  {!isNaN(endLat) && !isNaN(endLng) && (
                    <Marker
                      position={{ lat: endLat, lng: endLng }}
                      icon={collector.isActive ? getDeliveryVehicleMarkerIcon(personColor) : END_MARKER_ICON}
                      onClick={() => setSelectedMapCollector(collector)}
                      title={`${collector.isActive ? 'Live Delivery Vehicle' : 'End Location'} - ${collector.sampleCollector}`}
                    />
                  )}
                </React.Fragment>
              );
            })}

            {selectedMapCollector && (
              <InfoWindow
                position={{
                  lat: parseFloat(
                    (selectedMapCollector.routePoints && selectedMapCollector.routePoints.length > 0)
                      ? selectedMapCollector.routePoints.slice(-1)[0].latitude || selectedMapCollector.routePoints.slice(-1)[0].lat
                      : selectedMapCollector.currentLatitude || selectedMapCollector.latitudeEnd || selectedMapCollector.latitudeStart
                  ),
                  lng: parseFloat(
                    (selectedMapCollector.routePoints && selectedMapCollector.routePoints.length > 0)
                      ? selectedMapCollector.routePoints.slice(-1)[0].longitude || selectedMapCollector.routePoints.slice(-1)[0].lng
                      : selectedMapCollector.currentLongitude || selectedMapCollector.longitudeEnd || selectedMapCollector.longitudeStart
                  )
                }}
                onCloseClick={() => setSelectedMapCollector(null)}
              >
                <div style={{ color: '#333', minWidth: '180px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>{selectedMapCollector.sampleCollector}</h4>
                  <p style={{ fontSize: '12px', margin: '3px 0' }}>
                    <b>Status:</b> {selectedMapCollector.isActive ? '🔴 Active' : '✅ Completed'}
                  </p>
                  <p style={{ fontSize: '12px', margin: '3px 0' }}>
                    <b>Distance:</b> {formatDistance(accurateDistances[selectedMapCollector.id] || selectedMapCollector.distance_travelled)}
                  </p>
                  <p style={{ fontSize: '12px', margin: '3px 0' }}>
                    <b>Duration:</b> {formatDuration(selectedMapCollector.totalDuration)}
                  </p>
                  <p style={{ fontSize: '11px', color: '#666', margin: '3px 0' }}>
                    Start: {formatTime(selectedMapCollector.startTime)}
                  </p>
                  {selectedMapCollector.endTime && (
                    <p style={{ fontSize: '11px', color: '#666', margin: '3px 0' }}>
                      End: {formatTime(selectedMapCollector.endTime)}
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>

          {mapData.length > 0 && (
            <MapOverlay>
              <MapPin size={16} color="#4F46E5" />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                {mapData.length} route{mapData.length > 1 ? 's' : ''} on {formatDate(mapDate)}
              </span>
            </MapOverlay>
          )}
        </APIProvider>
      </MapSection>

      {/* ---- FILTER SECTION ---- */}
      <FilterCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Filter size={16} color="#4F46E5" />
          <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>Filter History</span>
        </div>
        <FilterRow>
          <FilterGroup>
            <Label>From Date</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)} max={toDate || new Date().toISOString().split("T")[0]}
            />
          </FilterGroup>
          <FilterGroup>
            <Label>To Date</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)} min={fromDate} max={new Date().toISOString().split("T")[0]}
            />
          </FilterGroup>
          <FilterGroup>
            <Label>Sample Collector</Label>
            <Select
              value={collectorFilter}
              onChange={(e) => setCollectorFilter(e.target.value)}
            >
              <option value="">All Collectors</option>
              {allCollectors.map(collector => (
                <option key={collector.employeeId} value={collector.employeeId}>{collector.employeeName}</option>
              ))}
            </Select>
          </FilterGroup>
          <PrimaryButton onClick={fetchTableData} disabled={tableLoading}>
            <Search size={14} /> {tableLoading ? 'Loading...' : 'Search'}
          </PrimaryButton>
          <SuccessButton onClick={handleDownloadExcel} disabled={tableData.length === 0}>
            <Download size={14} /> Download Excel
          </SuccessButton>
        </FilterRow>
      </FilterCard>

      {/* ---- TABLE SECTION ---- */}
      <TableCard>
        <TableHeader>
          <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>
            Tracking Records ({tableData.length})
          </span>
        </TableHeader>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Sample Collector</Th>
                <Th>Start Time</Th>
                <Th>Start Location</Th>
                <Th>End Time</Th>
                <Th>End Location</Th>
                <Th>Distance</Th>
                <Th>Duration</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <Td colSpan={9}>
                    <EmptyState>
                      <Calendar size={32} color="#cbd5e1" />
                      <div style={{ marginTop: '8px' }}>No tracking records found. Adjust filters and search.</div>
                    </EmptyState>
                  </Td>
                </tr>
              ) : (
                tableData.map((row, idx) => {
                  const personColor = getRouteColor(idx, row.sampleCollector);
                  return (
                    <Tr
                      key={row.id || idx}
                      className={selectedRow === row.id ? 'selected' : ''}
                      onClick={() => handleRowClick(row)}
                    >
                      <Td>{formatDate(row.date)}</Td>
                      <Td style={{ fontWeight: '600' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span 
                            style={{ 
                              width: '10px', 
                              height: '10px', 
                              borderRadius: '50%', 
                              backgroundColor: personColor, 
                              display: 'inline-block',
                              boxShadow: `0 0 5px ${personColor}`,
                              flexShrink: 0 
                            }} 
                            title={`Route Color: ${personColor}`}
                          />
                          {row.sampleCollector}
                        </div>
                      </Td>
                      <Td>{formatTime(row.startTime)}</Td>
                      <Td style={{ fontSize: '12px', color: '#334155' }}>
                        {locationNames[row.id]?.start 
                          ? locationNames[row.id].start 
                          : row.latitudeStart ? '⏳ Loading...' : '-'}
                      </Td>
                      <Td>{formatTime(row.endTime)}</Td>
                      <Td style={{ fontSize: '12px', color: '#334155' }}>
                        {locationNames[row.id]?.end && locationNames[row.id].end !== '-'
                          ? locationNames[row.id].end
                          : row.latitudeEnd ? '⏳ Loading...' : '-'}
                      </Td>
                      <Td style={{ fontWeight: '600' }}>{formatDistance(accurateDistances[row.id] || row.distance_travelled)}</Td>
                      <Td>{formatDuration(row.totalDuration)}</Td>
                      <Td>
                        <StatusBadge active={row.isActive}>
                          {row.isActive ? '● Active' : '✓ Done'}
                        </StatusBadge>
                      </Td>
                    </Tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
      </TableCard>
    </PageContainer>
  );
};

export default TrackingHistory;
