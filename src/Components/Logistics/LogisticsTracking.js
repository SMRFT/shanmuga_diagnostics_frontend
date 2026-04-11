import React, { useState, useEffect, useRef, useMemo } from 'react';
import { APIProvider, Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Users, Route, RefreshCw, Map as MapIcon, Navigation } from 'lucide-react';
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
  width: 280px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

// --- Helper: Polyline Component ---
const TrackedPath = ({ points, isLive }) => {
  const map = useMap();
  const polylineRef = useRef(null);

  const pathCoordinates = useMemo(() => 
    points.map(p => ({ lat: parseFloat(p.latitude || p.lat), lng: parseFloat(p.longitude || p.lng) })), 
    [points]
  );

  useEffect(() => {
    if (!map) return;
    if (!polylineRef.current) {
      polylineRef.current = new window.google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: isLive ? '#4F46E5' : '#94A3B8',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map: map
      });
    } else {
      polylineRef.current.setPath(pathCoordinates);
    }
    return () => { if (polylineRef.current) polylineRef.current.setMap(null); };
  }, [map, pathCoordinates, isLive]);

  return null;
};

// --- Main Dashboard Component ---
const LogisticsTracking = () => {
  const [collectors, setCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const BASE_URL = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiRequest(`${BASE_URL}sample-collector-location/`, 'GET', null, { date });
      // Filter out null/invalid entries
      const dataArray = Array.isArray(res) ? res : (res?.data || res?.results || []);
      const validData = dataArray.filter(item => item.sampleCollector && item.routePoints && item.routePoints.length > 0);
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
  }, [date]);

  return (
    <div style={{ padding: '20px', background: '#f0f2f5', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Navigation color="#4F46E5" /> Logistics Control Center
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
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
            mapId="bf50a69a05151240" // Optional: Google Vector Map ID
            gestureHandling={'greedy'}
            disableDefaultUI={false}
          >
            {collectors.map((collector, index) => {
              const history = collector.routePoints || [];
              const lastPos = history[history.length - 1];
              const isLive = collector.isActive;

              return (
                <React.Fragment key={collector.id || index}>
                  {/* Draw the Route Line */}
                  <TrackedPath points={history} isLive={isLive} />

                  {/* Marker for Current Position */}
                  <Marker
                    position={{ lat: parseFloat(lastPos.latitude || lastPos.lat), lng: parseFloat(lastPos.longitude || lastPos.lng) }}
                    onClick={() => setSelectedCollector(collector)}
                    label={{
                      text: collector.sampleCollector,
                      className: 'marker-label',
                      color: 'white',
                      fontSize: '12px'
                    }}
                  />
                </React.Fragment>
              );
            })}

            {selectedCollector && (
              <InfoWindow
                position={{
                  lat: parseFloat(selectedCollector.routePoints.slice(-1)[0].latitude || selectedCollector.routePoints.slice(-1)[0].lat),
                  lng: parseFloat(selectedCollector.routePoints.slice(-1)[0].longitude || selectedCollector.routePoints.slice(-1)[0].lng)
                }}
                onCloseClick={() => setSelectedCollector(null)}
              >
                <div style={{ color: '#333' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{selectedCollector.sampleCollector}</h4>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>
                    <b>Status:</b> {selectedCollector.isActive ? '🔴 Live' : '✅ Completed'}
                  </p>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>
                    <b>Distance:</b> {selectedCollector.distance_travelled || 'Calculating...'} km
                  </p>
                  <p style={{ fontSize: '10px', color: '#666' }}>Started: {new Date(selectedCollector.startTime).toLocaleTimeString()}</p>
                </div>
              </InfoWindow>
            )}
          </Map>

          <OverlayPanel>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 15px 0' }}>
              <Users size={18} /> Collectors ({collectors.length})
            </h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {collectors.map(c => (
                <div 
                  key={c.id} 
                  style={{ 
                    padding: '10px', 
                    borderBottom: '1px solid #eee', 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: selectedCollector?.id === c.id ? '#f0f4ff' : 'transparent'
                  }}
                  onClick={() => setSelectedCollector(c)}
                >
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{c.sampleCollector}</div>
                    <div style={{ fontSize: '11px', color: c.isActive ? '#22c55e' : '#777' }}>
                      {c.isActive ? 'Currently Tracking' : 'Shift Ended'}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {c.distance_travelled || 0} km
                  </div>
                </div>
              ))}
            </div>
          </OverlayPanel>
        </APIProvider>
      </MapWrapper>
    </div>
  );
};

export default LogisticsTracking;
