import React, { useState, useEffect, useRef, useMemo } from 'react';
import { APIProvider, Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Users, RefreshCw, Navigation } from 'lucide-react';
import styled from 'styled-components';
import apiRequest from '../Auth/apiRequest';

// --- Styled Components ---
const MapWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 80px);
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
`;

const OverlayPanel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: white;
  padding: 15px;
  border-radius: 10px;
  z-index: 10;
  width: 290px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #ef4444;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  animation: pulse 2s infinite;
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;

// --- Curated Vibrant Person Colors Palette ---
const PERSON_COLORS = [
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

// --- SVG Icons for Zomato/Swiggy style Start & Bike Travelling Markers ---
const START_MARKER_ICON = {
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
      <circle cx="17" cy="17" r="13" fill="#10B981" stroke="#FFFFFF" stroke-width="2.5"/>
      <text x="17" y="21" font-size="11" font-family="Arial, sans-serif" font-weight="bold" fill="#FFFFFF" text-anchor="middle">S</text>
    </svg>
  `),
};

const END_MARKER_ICON = {
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
      <circle cx="17" cy="17" r="13" fill="#EF4444" stroke="#FFFFFF" stroke-width="2.5"/>
      <text x="17" y="21" font-size="11" font-family="Arial, sans-serif" font-weight="bold" fill="#FFFFFF" text-anchor="middle">E</text>
    </svg>
  `),
};

// SVG Bike Rider Icon with Dynamic Heading Angle
const getBikeMarkerIcon = (heading = 0, color = '#2563EB') => ({
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
      <g transform="rotate(${heading}, 22, 22)">
        <circle cx="22" cy="22" r="17" fill="${color}" stroke="#FFFFFF" stroke-width="2.5" />
        <!-- Delivery Bike Symbol -->
        <path d="M13 27 C13 25, 15 23, 17 23 L23 23 L26 18 C26.5 17, 27.5 17, 28 18 L30 21 L32 21 M15 28 A 3.5 3.5 0 1 0 15 21 A 3.5 3.5 0 1 0 15 28 M29 28 A 3.5 3.5 0 1 0 29 21 A 3.5 3.5 0 1 0 29 28 M22 17 A 2 2 0 1 0 22 13 A 2 2 0 1 0 22 17 Z" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>
  `),
});

const calculateBearing = (startLat, startLng, destLat, destLng) => {
  const startPhi = (startLat * Math.PI) / 180;
  const destPhi = (destLat * Math.PI) / 180;
  const dDelta = ((destLng - startLng) * Math.PI) / 180;
  const y = Math.sin(dDelta) * Math.cos(destPhi);
  const x = Math.cos(startPhi) * Math.sin(destPhi) - Math.sin(startPhi) * Math.cos(destPhi) * Math.cos(dDelta);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
};

const formatDistance = (dist) => {
  if (dist === null || dist === undefined || dist === '') return '0 m';
  let val = parseFloat(dist);
  if (isNaN(val) || val <= 0) return '0 m';

  if (val > 500) {
    val = val / 1000;
  }

  if (val < 1.0) {
    const meters = Math.round(val * 1000);
    return `${meters} m`;
  }

  return `${val.toFixed(2)} km`;
};

// --- Thin Polyline Component (Zomato/Swiggy 3px Thin Line) ---
const TrackedPath = ({ collectorId, points, color, onDistanceCalculated }) => {
  const map = useMap();
  const polylineRef = useRef(null);
  const shadowPolylineRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const lastPathStrRef = useRef('');

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

    const pathStr = JSON.stringify(pathCoordinates);
    if (lastPathStrRef.current === pathStr) return;
    lastPathStrRef.current = pathStr;

    // Clean up existing renderers
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    if (shadowPolylineRef.current) {
      shadowPolylineRef.current.setMap(null);
      shadowPolylineRef.current = null;
    }

    // 1. Thin Line (3px main line + 4px casing)
    shadowPolylineRef.current = new window.google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: '#FFFFFF',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map: map,
      zIndex: 1
    });

    polylineRef.current = new window.google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 0.9,
      strokeWeight: 3,
      map: map,
      zIndex: 2
    });

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

    // Try road route via DirectionsService
    if (window.google.maps.DirectionsService) {
      const directionsService = new window.google.maps.DirectionsService();
      const origin = pathCoordinates[0];
      const destination = pathCoordinates[pathCoordinates.length - 1];

      let waypoints = [];
      if (pathCoordinates.length > 2) {
        const intermediate = pathCoordinates.slice(1, -1);
        const step = intermediate.length > 23 ? intermediate.length / 23 : 1;
        const count = Math.min(intermediate.length, 23);
        for (let i = 0; i < count; i++) {
          waypoints.push({
            location: intermediate[Math.floor(i * step)],
            stopover: false
          });
        }
      }

      directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          if (polylineRef.current) polylineRef.current.setMap(null);
          if (shadowPolylineRef.current) shadowPolylineRef.current.setMap(null);

          directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
            map,
            suppressMarkers: true,
            directions: result,
            polylineOptions: {
              strokeColor: color,
              strokeOpacity: 0.9,
              strokeWeight: 3,
              zIndex: 3
            }
          });

          if (onDistanceCalculated && collectorId && result.routes[0]) {
            let totalM = 0;
            result.routes[0].legs.forEach(leg => {
              totalM += leg.distance.value;
            });
            onDistanceCalculated(collectorId, (totalM / 1000).toFixed(2));
          }
        }
      });
    }

    return () => {
      if (directionsRendererRef.current) directionsRendererRef.current.setMap(null);
      if (polylineRef.current) polylineRef.current.setMap(null);
      if (shadowPolylineRef.current) shadowPolylineRef.current.setMap(null);
    };
  }, [map, pathCoordinates, color, collectorId, onDistanceCalculated]);

  return null;
};

// --- Smooth Continuous Animated Bike Marker for Live Travelling Rider ---
const AnimatedBikeMarker = ({ points, collector, color, isLive, onClick }) => {
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
    const duration = 14000; // Continuous smooth glide matching 15s polling window

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
  const markerIcon = isLive ? getBikeMarkerIcon(heading, color) : END_MARKER_ICON;

  return (
    <Marker
      position={position}
      icon={markerIcon}
      onClick={onClick}
      title={`${isLive ? 'Live Travelling (Bike)' : 'End Location'} - ${collector.sampleCollector}`}
    />
  );
};

// --- Main Dashboard Component (LIVE ONLY — today's date, no date picker) ---
const LogisticsTracking = () => {
  const [collectors, setCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accurateDistances, setAccurateDistances] = useState({});

  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const BASE_URL = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const today = new Date().toISOString().split('T')[0];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiRequest(`${BASE_URL}sample-collector-location/?date=${today}`, 'GET');
      const dataArray = Array.isArray(res) ? res : (res?.data || res?.results || []);
      const validData = dataArray.filter(item => item.sampleCollector && ((item.routePoints && item.routePoints.length > 0) || item.latitudeStart));
      setCollectors(validData);
    } catch (err) {
      console.error("Tracking Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Poll for live updates every 15 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f0f2f5', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
          <Navigation color="#4F46E5" /> Live Logistics Tracking
        </h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <LiveBadge>● LIVE</LiveBadge>
          <span style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>{today}</span>
          <button onClick={fetchData} style={{ padding: '8px 15px', cursor: 'pointer', borderRadius: '5px', background: '#fff', border: '1px solid #ddd' }}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <MapWrapper>
        <APIProvider apiKey={API_KEY}>
          <Map
            defaultCenter={{ lat: 11.6735, lng: 78.1525 }}
            defaultZoom={11}
            mapId="bf50a69a05151240"
            gestureHandling={'greedy'}
            disableDefaultUI={false}
          >
            {collectors.map((collector, index) => {
              const history = (collector.routePoints && collector.routePoints.length > 0)
                ? collector.routePoints
                : [
                    { lat: collector.latitudeStart, lng: collector.longitudeStart },
                    { lat: collector.currentLatitude || collector.latitudeEnd, lng: collector.currentLongitude || collector.longitudeEnd }
                  ].filter(p => p.lat && p.lng);

              if (!history.length) return null;
              const startPos = history[0];
              const lastPos = history[history.length - 1];
              const isLive = collector.isActive;
              const personColor = getPersonColor(index, collector.sampleCollector);

              const startLat = parseFloat(startPos.latitude || startPos.lat);
              const startLng = parseFloat(startPos.longitude || startPos.lng);
              const lastLat = parseFloat(lastPos.latitude || lastPos.lat);
              const lastLng = parseFloat(lastPos.longitude || lastPos.lng);

              return (
                <React.Fragment key={collector.id || index}>
                  <TrackedPath 
                    collectorId={collector.id}
                    points={history} 
                    color={personColor} 
                    onDistanceCalculated={(id, dist) => setAccurateDistances(prev => ({...prev, [id]: dist}))}
                  />

                  {/* Start Location Marker */}
                  {!isNaN(startLat) && !isNaN(startLng) && (
                    <Marker
                      position={{ lat: startLat, lng: startLng }}
                      icon={START_MARKER_ICON}
                      onClick={() => setSelectedCollector(collector)}
                      title={`Start Location - ${collector.sampleCollector}`}
                    />
                  )}

                  {/* Smooth Continuous Animated Bike Rider for Current / Live Location */}
                  {!isNaN(lastLat) && !isNaN(lastLng) && (
                    <AnimatedBikeMarker
                      points={history}
                      collector={collector}
                      color={personColor}
                      isLive={isLive}
                      onClick={() => setSelectedCollector(collector)}
                    />
                  )}
                </React.Fragment>
              );
            })}

            {selectedCollector && (
              <InfoWindow
                position={{
                  lat: parseFloat(
                    (selectedCollector.routePoints && selectedCollector.routePoints.length > 0)
                      ? selectedCollector.routePoints.slice(-1)[0].latitude || selectedCollector.routePoints.slice(-1)[0].lat
                      : selectedCollector.currentLatitude || selectedCollector.latitudeEnd || selectedCollector.latitudeStart
                  ),
                  lng: parseFloat(
                    (selectedCollector.routePoints && selectedCollector.routePoints.length > 0)
                      ? selectedCollector.routePoints.slice(-1)[0].longitude || selectedCollector.routePoints.slice(-1)[0].lng
                      : selectedCollector.currentLongitude || selectedCollector.longitudeEnd || selectedCollector.longitudeStart
                  )
                }}
                onCloseClick={() => setSelectedCollector(null)}
              >
                <div style={{ color: '#333', minWidth: '160px' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{selectedCollector.sampleCollector}</h4>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>
                    <b>Status:</b> {selectedCollector.isActive ? '🔴 Live Travelling' : '✅ Completed'}
                  </p>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>
                    <b>Distance:</b> {formatDistance(accurateDistances[selectedCollector.id] || selectedCollector.distance_travelled)}
                  </p>
                  {selectedCollector.startTime && (
                    <p style={{ fontSize: '11px', color: '#666', margin: '2px 0' }}>
                      Started: {new Date(selectedCollector.startTime).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>

          <OverlayPanel>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 15px 0' }}>
              <Users size={18} /> Active Collectors ({collectors.length})
            </h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {collectors.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
                  No active collectors today
                </div>
              )}
              {collectors.map((c, index) => {
                const personColor = getPersonColor(index, c.sampleCollector);
                return (
                  <div 
                    key={c.id} 
                    style={{ 
                      padding: '10px', 
                      borderBottom: '1px solid #eee', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      background: selectedCollector?.id === c.id ? '#f0f4ff' : 'transparent',
                      borderRadius: '6px'
                    }}
                    onClick={() => setSelectedCollector(c)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span 
                        style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: personColor, 
                          display: 'inline-block',
                          boxShadow: `0 0 6px ${personColor}`,
                          flexShrink: 0
                        }} 
                        title={`Route Color: ${personColor}`}
                      />
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{c.sampleCollector}</div>
                        <div style={{ fontSize: '11px', color: c.isActive ? '#22c55e' : '#777' }}>
                          {c.isActive ? 'Currently Travelling' : 'Shift Ended'}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                      {formatDistance(accurateDistances[c.id] || c.distance_travelled)}
                    </div>
                  </div>
                );
              })}
            </div>
          </OverlayPanel>
        </APIProvider>
      </MapWrapper>
    </div>
  );
};

export default LogisticsTracking;
