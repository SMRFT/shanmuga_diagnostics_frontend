import { useState, useEffect, useRef, useContext } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import {
  MapPin,
  Navigation,
  Calendar,
  Users,
  Clock,
  Route,
  Timer,
  Eye,
  Activity,
  Filter,
  RefreshCw,
  MapIcon,
  AlertCircle,
  Loader,
  User,
  Play,
  Pause,
  Settings,
  Layers,
} from "lucide-react";
import axios from "axios";
// Google Maps imports
import { APIProvider, Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';

// Custom Polyline Component for @vis.gl/react-google-maps [1]
const Polyline = ({ path, options }) => {
  const map = useMap();
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!map || !path) return;

    // Create polyline if it doesn't exist
    if (!polylineRef.current) {
      polylineRef.current = new window.google.maps.Polyline({
        path: path,
        ...options
      });
      polylineRef.current.setMap(map);
    } else {
      // Update existing polyline
      polylineRef.current.setOptions({
        path: path,
        ...options
      });
    }

    // Cleanup function
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, path, options]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, []);

  return null; // This component doesn't render anything directly
};

// Animations
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const bounceIn = keyframes`
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #f7f9fc;
    color: #333;
    margin: 0;
    padding: 0;
  }
`;

// Enhanced styled components (keep all your existing styled components)
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background-color: #f8fafc;
  min-height: 100vh;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: ${bounceIn} 0.6s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(props) => props.color || "#6366f1"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const MapSection = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const MapHeader = styled.div`
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const MapTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MapControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  background-color: ${(props) =>
    props.variant === "secondary" ? "rgba(255, 255, 255, 0.2)" : 
    props.variant === "danger" ? "#ef4444" :
    props.variant === "success" ? "#10b981" : "#667eea"};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${(props) =>
      props.variant === "secondary" ? "rgba(255, 255, 255, 0.3)" : 
      props.variant === "danger" ? "#dc2626" :
      props.variant === "success" ? "#059669" : "#5b21b6"};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &.active {
    background-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
  }
`;

const MapContainer = styled.div`
  height: 700px;
  position: relative;
  background: #f1f5f9;
  overflow: hidden;
`;

const MapLoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

// Tracking Controls Panel
const TrackingPanel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 300px;
`;

const PanelTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TrackerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
`;

const TrackerItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 8px;
  background: ${props => props.isActive ? '#dcfce7' : '#f8fafc'};
  border: 1px solid ${props => props.isActive ? '#16a34a' : '#e2e8f0'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isActive ? '#bbf7d0' : '#f1f5f9'};
  }
`;

const TrackerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TrackerStatus = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.isActive ? '#16a34a' : '#64748b'};
  animation: ${props => props.isActive ? pulse : 'none'} 2s ease-in-out infinite;
`;

const TrackerName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
`;

const TrackerDistance = styled.span`
  font-size: 0.75rem;
  color: #64748b;
`;

// Keep all other styled components (Table components, etc.)
const TableSection = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TableTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DateFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DateInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #374151;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.5rem;
  font-weight: 600;
  color: #475569;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
  white-space: nowrap;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f8fafc;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
  }
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  color: #334155;
  font-size: 0.875rem;
  vertical-align: middle;
  white-space: nowrap;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: ${(props) =>
    props.status === "active"
      ? "#dcfce7"
      : props.status === "completed"
      ? "#e0e7ff"
      : "#f3f4f6"};
  color: ${(props) =>
    props.status === "active"
      ? "#16a34a"
      : props.status === "completed"
      ? "#4f46e5"
      : "#6b7280"};
`;

const ViewButton = styled.button`
  background-color: #eff6ff;
  color: #3b82f6;
  border: none;
  border-radius: 6px;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.375rem;

  &:hover {
    background-color: #dbeafe;
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
  font-size: 1rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6366f1;
  font-size: 0.875rem;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Enhanced Google Maps Component with Multi-Person Tracking
const GoogleMapComponent = ({ trackingData, selectedItem, onMarkerClick, isLiveTracking, showRoutes }) => {
  const [infoWindow, setInfoWindow] = useState(null);
  const map = useMap();

  const defaultCenter = { lat: 11.0168, lng: 76.9558 }; // Salem, Tamil Nadu

  // Create custom marker icons for different states
  const createCustomMarkerIcon = (color, isStart = false, isActive = false) => {
    const baseIcon = {
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: isActive ? 3 : 2,
      scale: isActive ? 10 : 8,
    };

    if (isStart) {
      return {
        ...baseIcon,
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        scale: isActive ? 1.2 : 1,
      };
    }

    return {
      ...baseIcon,
      path: 'M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0',
    };
  };

  // Generate distinct colors for different collectors
  const getCollectorColor = (index) => {
    const colors = [
      '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', 
      '#10b981', '#06b6d4', '#84cc16', '#f97316'
    ];
    return colors[index % colors.length];
  };

  // Create markers for all tracked people
  const createMarkersData = () => {
    const markers = [];
    const polylines = [];

    trackingData.forEach((item, index) => {
      const isActive = item.isActive;
      const collectorColor = getCollectorColor(index);

      // Start marker
      if (item.latitudeStart && item.longitudeStart) {
        const startLat = parseFloat(item.latitudeStart);
        const startLng = parseFloat(item.longitudeStart);
        
        if (!isNaN(startLat) && !isNaN(startLng)) {
          markers.push({
            id: `start-${index}`,
            position: { lat: startLat, lng: startLng },
            type: 'start',
            data: item,
            title: `${item.sampleCollector} - Start`,
            color: '#10b981',
            isActive: false
          });
        }
      }

      // Current/End marker
      const currentLat = item.currentLatitude || item.latitudeEnd;
      const currentLng = item.currentLongitude || item.longitudeEnd;

      if (currentLat && currentLng) {
        const lat = parseFloat(currentLat);
        const lng = parseFloat(currentLng);

        if (!isNaN(lat) && !isNaN(lng)) {
          markers.push({
            id: `current-${index}`,
            position: { lat, lng },
            type: isActive ? 'active' : 'completed',
            data: item,
            title: `${item.sampleCollector} - ${isActive ? 'Live' : 'Completed'}`,
            color: isActive ? '#ef4444' : collectorColor,
            isActive: isActive
          });
        }
      }

      // Create route polylines if route points exist
      if (showRoutes && item.routePoints && Array.isArray(item.routePoints) && item.routePoints.length > 1) {
        const validRoutePoints = item.routePoints
          .map((point) => {
            const lat = parseFloat(point.lat || point.latitude);
            const lng = parseFloat(point.lng || point.longitude);
            return !isNaN(lat) && !isNaN(lng) ? { lat, lng } : null;
          })
          .filter((point) => point !== null);

        if (validRoutePoints.length > 1) {
          polylines.push({
            id: `route-${index}`,
            path: validRoutePoints,
            strokeColor: isActive ? '#ef4444' : collectorColor,
            strokeOpacity: 0.8,
            strokeWeight: isActive ? 4 : 3,
            data: item
          });
        }
      }
    });

    return { markers, polylines };
  };

  // Auto-fit map bounds to show all markers
  useEffect(() => {
    if (map && trackingData.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      let hasValidBounds = false;

      trackingData.forEach((item) => {
        // Add start position to bounds
        if (item.latitudeStart && item.longitudeStart) {
          const startLat = parseFloat(item.latitudeStart);
          const startLng = parseFloat(item.longitudeStart);
          if (!isNaN(startLat) && !isNaN(startLng)) {
            bounds.extend({ lat: startLat, lng: startLng });
            hasValidBounds = true;
          }
        }

        // Add current/end position to bounds
        const currentLat = item.currentLatitude || item.latitudeEnd;
        const currentLng = item.currentLongitude || item.longitudeEnd;
        if (currentLat && currentLng) {
          const lat = parseFloat(currentLat);
          const lng = parseFloat(currentLng);
          if (!isNaN(lat) && !isNaN(lng)) {
            bounds.extend({ lat, lng });
            hasValidBounds = true;
          }
        }
      });

      if (hasValidBounds) {
        map.fitBounds(bounds, { padding: 50 });
      }
    }
  }, [map, trackingData]);

  const { markers, polylines } = createMarkersData();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Render route polylines using our custom Polyline component */}
      {polylines.map((polyline) => (
        <Polyline
          key={polyline.id}
          path={polyline.path}
          options={{
            strokeColor: polyline.strokeColor,
            strokeOpacity: polyline.strokeOpacity,
            strokeWeight: polyline.strokeWeight,
          }}
        />
      ))}

      {/* Render markers */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          onClick={() => {
            setInfoWindow(marker);
            if (onMarkerClick) onMarkerClick(marker.data);
          }}
          icon={createCustomMarkerIcon(marker.color, marker.type === 'start', marker.isActive)}
        />
      ))}

      {/* Info Window */}
      {infoWindow && (
        <InfoWindow
          position={infoWindow.position}
          onCloseClick={() => setInfoWindow(null)}
        >
          <div style={{ padding: '8px', minWidth: '200px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>
              {infoWindow.data.sampleCollector}
            </h4>
            <p style={{ 
              margin: '0', 
              color: infoWindow.color, 
              fontSize: '12px', 
              fontWeight: '600' 
            }}>
              {infoWindow.type === 'start' ? 'START LOCATION' : 
               infoWindow.type === 'active' ? '🔴 LIVE TRACKING' : '✅ COMPLETED'}
            </p>
            <p style={{ margin: '4px 0 0 0', color: '#374151', fontSize: '13px' }}>
              {infoWindow.type === 'start' 
                ? (infoWindow.data.startTime ? new Date(infoWindow.data.startTime).toLocaleString() : 'N/A')
                : `Distance: ${infoWindow.data.distance_travelled || '0.00'} km`
              }
            </p>
            {infoWindow.type !== 'start' && (
              <p style={{ margin: '4px 0 0 0', color: '#374151', fontSize: '13px' }}>
                {infoWindow.data.isActive ? 'Last Update:' : 'End Time:'} {' '}
                {new Date(infoWindow.data.lastUpdated || infoWindow.data.endTime).toLocaleString()}
              </p>
            )}
          </div>
        </InfoWindow>
      )}

      {/* Tracking Control Panel */}
      <TrackingPanel>
        <PanelTitle>
          <Users size={16} />
          Active Trackers
        </PanelTitle>
        <TrackerList>
          {trackingData.map((item, index) => (
            <TrackerItem key={item.id} isActive={item.isActive}>
              <TrackerInfo>
                <TrackerStatus isActive={item.isActive} />
                <div>
                  <TrackerName>{item.sampleCollector}</TrackerName>
                  <TrackerDistance>{item.distance_travelled || '0.00'} km</TrackerDistance>
                </div>
              </TrackerInfo>
              <ViewButton 
                onClick={() => onMarkerClick && onMarkerClick(item)}
                style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
              >
                <Eye size={12} />
              </ViewButton>
            </TrackerItem>
          ))}
        </TrackerList>
      </TrackingPanel>
    </div>
  );
};

// Main Dashboard Component
const LiveTrackingDashboard = () => {
  // FIXED: Correct date initialization
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T") // Returns: "2025-09-13"
  );
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [stats, setStats] = useState({
    totalCollectors: 0,
    activeCollectors: 0,
    completedToday: 0,
  });

  // Environment variables
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyDjW5Ryg_Of6RG2kGxV85-voG2sXHq0XZk";

  // Fetch tracking data
  const fetchCollectorsByDate = async (date) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${Labbaseurl}sample_collector_location/`,
        { params: { date: date } }
      );

      if (response.data.success) {
        const locationData = response.data.data || [];

        const transformedData = locationData.map((item) => ({
          id: item.id,
          sampleCollector: item.sampleCollector,
          date: new Date(item.date).toISOString().split("T"), // FIXED: Correct date format
          latitudeStart: item.latitudeStart,
          longitudeStart: item.longitudeStart,
          latitudeEnd: item.latitudeEnd,
          longitudeEnd: item.longitudeEnd,
          distance_travelled: item.distance_travelled || "0.00",
          startTime: item.startTime,
          endTime: item.endTime,
          totalDuration: item.totalDuration,
          isActive: item.isActive,
          currentLatitude: item.currentLatitude,
          currentLongitude: item.currentLongitude,
          lastUpdated: item.lastUpdated,
          routePoints: typeof item.routePoints === "string" 
            ? JSON.parse(item.routePoints) 
            : item.routePoints || [],
        }));

        setTrackingData(transformedData);

        // Update stats
        const activeCount = transformedData.filter(item => item.isActive).length;
        const completedCount = transformedData.filter(item => !item.isActive && item.endTime).length;

        setStats({
          totalCollectors: transformedData.length,
          activeCollectors: activeCount,
          completedToday: completedCount,
        });
      } else {
        setError(response.data.message || "No data found for selected date");
        setTrackingData([]);
        setStats({ totalCollectors: 0, activeCollectors: 0, completedToday: 0 });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data for selected date.");
      setTrackingData([]);
      setStats({ totalCollectors: 0, activeCollectors: 0, completedToday: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (Labbaseurl && selectedDate) {
      fetchCollectorsByDate(selectedDate);
    }
  }, [selectedDate, Labbaseurl]);

  // Real-time updates for live tracking
  useEffect(() => {
    let interval;
    if (isLiveTracking && Labbaseurl && selectedDate) {
      interval = setInterval(() => {
        const today = new Date().toISOString().split("T"); // FIXED: Correct format
        if (selectedDate === today) {
          fetchCollectorsByDate(selectedDate);
        }
      }, 15000); // Update every 15 seconds for real-time tracking
    }
    return () => clearInterval(interval);
  }, [selectedDate, Labbaseurl, isLiveTracking]);

  // Helper functions
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDuration = (duration) => {
    return duration || "In Progress";
  };

  const handleRefresh = () => {
    if (Labbaseurl && selectedDate) {
      fetchCollectorsByDate(selectedDate);
    }
  };

  const handleViewRoute = (item) => {
    setSelectedItem(item);
    document.querySelector('#map-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMarkerClick = (item) => {
    setSelectedItem(item);
  };

  const toggleLiveTracking = () => {
    setIsLiveTracking(!isLiveTracking);
  };

  const toggleRoutes = () => {
    setShowRoutes(!showRoutes);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>
            <Navigation size={28} />
            Multi-Person Live Tracking System
          </Title>
          <Subtitle>
            Real-time monitoring and route tracking for multiple sample collectors
          </Subtitle>
        </Header>

        {error && (
          <div
            style={{
              padding: "1rem",
              borderRadius: "0.75rem",
              marginBottom: "1.5rem",
              backgroundColor: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fecaca",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Enhanced Stats Grid */}
        <StatsGrid>
          <StatCard>
            <StatIcon color="#6366f1">
              <Users size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.totalCollectors}</StatValue>
              <StatLabel>Total Collectors</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon color="#10b981">
              <Activity size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.activeCollectors}</StatValue>
              <StatLabel>Live Tracking</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon color="#f59e0b">
              <Timer size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.completedToday}</StatValue>
              <StatLabel>Completed Today</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon color="#ef4444">
              <Route size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>
                {trackingData.reduce((sum, item) => sum + parseFloat(item.distance_travelled || 0), 0).toFixed(2)}
              </StatValue>
              <StatLabel>Total Distance (km)</StatLabel>
            </StatContent>
          </StatCard>
        </StatsGrid>

        {/* Enhanced Map Section */}
        <MapSection id="map-section">
          <MapHeader>
            <MapTitle>
              <MapIcon size={20} />
              Live Tracking Map ({trackingData.length} Active)
            </MapTitle>
            <MapControls>
              <Button
                onClick={toggleLiveTracking}
                className={isLiveTracking ? 'active' : ''}
                variant={isLiveTracking ? 'success' : 'secondary'}
              >
                {isLiveTracking ? <Pause size={16} /> : <Play size={16} />}
                {isLiveTracking ? 'Live On' : 'Live Off'}
              </Button>
              <Button
                onClick={toggleRoutes}
                variant={showRoutes ? 'success' : 'secondary'}
              >
                <Layers size={16} />
                {showRoutes ? 'Routes On' : 'Routes Off'}
              </Button>
              <Button onClick={handleRefresh} disabled={loading}>
                <RefreshCw size={16} />
                {loading ? "Updating..." : "Refresh"}
              </Button>
            </MapControls>
          </MapHeader>

          <MapContainer>
            {GOOGLE_MAPS_API_KEY ? (
              <APIProvider 
                apiKey={GOOGLE_MAPS_API_KEY}
                onLoad={() => console.log('Google Maps API loaded for multi-person tracking')}
              >
                <Map
                  defaultCenter={{ lat: 11.0168, lng: 76.9558 }}
                  defaultZoom={12}
                  gestureHandling={'greedy'}
                  disableDefaultUI={false}
                  style={{ width: '100%', height: '100%' }}
                  mapTypeId="roadmap"
                >
                  <GoogleMapComponent 
                    trackingData={trackingData}
                    selectedItem={selectedItem}
                    onMarkerClick={handleMarkerClick}
                    isLiveTracking={isLiveTracking}
                    showRoutes={showRoutes}
                  />
                </Map>
              </APIProvider>
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: '#ef4444',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <AlertCircle size={48} />
                <div>Google Maps API Key not configured</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                  Please set REACT_APP_GOOGLE_MAPS_API_KEY in your environment variables
                </div>
              </div>
            )}
          </MapContainer>
        </MapSection>

        {/* Enhanced Table Section */}
        <TableSection>
          <TableHeader>
            <TableTitle>
              <Calendar size={20} />
              Tracking History & Status
            </TableTitle>
            <DateFilter>
              <Filter size={16} color="#6b7280" />
              <DateInput
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </DateFilter>
          </TableHeader>

          {loading ? (
            <EmptyState>
              <LoadingSpinner>
                <RefreshCw size={24} />
                Loading tracking data...
              </LoadingSpinner>
            </EmptyState>
          ) : trackingData.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <Table>
                <thead>
                  <tr>
                    <Th>Collector Name</Th>
                    <Th>Status</Th>
                    <Th>Start Time</Th>
                    <Th>End Time</Th>
                    <Th>Duration</Th>
                    <Th>Distance (km)</Th>
                    <Th>Last Updated</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {trackingData.map((item, index) => (
                    <Tr key={item.id}>
                      <Td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <User size={16} color="#6366f1" />
                          {item.sampleCollector}
                        </div>
                      </Td>
                      <Td>
                        <StatusBadge status={item.isActive ? "active" : "completed"}>
                          {item.isActive ? (
                            <>
                              <Activity size={12} />
                              🔴 Live
                            </>
                          ) : (
                            <>
                              <Clock size={12} />
                              ✅ Done
                            </>
                          )}
                        </StatusBadge>
                      </Td>
                      <Td>{formatDateTime(item.startTime)}</Td>
                      <Td>{formatDateTime(item.endTime)}</Td>
                      <Td>{formatDuration(item.totalDuration)}</Td>
                      <Td style={{ fontWeight: 'bold' }}>
                        {item.distance_travelled || '0.00'}
                      </Td>
                      <Td>{formatDateTime(item.lastUpdated)}</Td>
                      <Td>
                        <ViewButton onClick={() => handleViewRoute(item)}>
                          <Eye size={14} />
                          Track
                        </ViewButton>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <EmptyState>
              <Navigation size={48} color="#94a3b8" />
              <h3>No tracking data found</h3>
              <p>Select a date to view tracking history</p>
            </EmptyState>
          )}
        </TableSection>
      </Container>
    </>
  );
};

export default LiveTrackingDashboard;
