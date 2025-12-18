"use client"

import { useState, useEffect, useRef } from "react"
import styled, { createGlobalStyle, keyframes } from "styled-components"
import { Users, Route, RefreshCw, MapIcon, AlertCircle, Play } from "lucide-react"
import { APIProvider, Map, Marker, InfoWindow, useMap } from "@vis.gl/react-google-maps"
import apiRequest from "../Auth/apiRequest"

const Polyline = ({ path, options }) => {
  const map = useMap()
  const polylineRef = useRef(null)

  useEffect(() => {
    if (!map || !path || path.length < 2) return

    if (!polylineRef.current) {
      polylineRef.current = new window.google.maps.Polyline({
        path: path,
        ...options,
      })
      polylineRef.current.setMap(map)
    } else {
      polylineRef.current.setOptions({
        path: path,
        ...options,
      })
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null)
      }
    }
  }, [map, path, options])

  return null
}

// Animations
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background-color: #f7f9fc;
    color: #333;
    margin: 0;
    padding: 0;
  }
`

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  background-color: #f8fafc;
  min-height: 100vh;
`

const MapSection = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin: 0;
  overflow: hidden;
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const MapHeader = styled.div`
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`

const MapTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const MapControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`

const Button = styled.button`
  background-color: ${(props) =>
    props.variant === "secondary"
      ? "rgba(255, 255, 255, 0.2)"
      : props.variant === "danger"
        ? "#ef4444"
        : props.variant === "success"
          ? "#10b981"
          : "#667eea"};
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
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.active {
    background-color: #10b981;
  }
`

const MapContainer = styled.div`
  flex: 1;
  position: relative;
  background: #f1f5f9;
  overflow: hidden;
`

// Tracking Panel
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
  max-width: 320px;
  max-height: 400px;
`

const PanelTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const TrackerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
`

const TrackerItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: 8px;
  background: ${(props) => (props.isActive ? "#dcfce7" : "#f8fafc")};
  border: 1px solid ${(props) => (props.isActive ? "#16a34a" : "#e2e8f0")};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.isActive ? "#bbf7d0" : "#f1f5f9")};
  }
`

const TrackerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`

const TrackerStatus = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => (props.isActive ? "#16a34a" : "#64748b")};
  animation: ${(props) => (props.isActive ? pulse : "none")} 2s ease-in-out infinite;
  flex-shrink: 0;
`

const TrackerName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TrackerDistance = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  white-space: nowrap;
`

const GoogleMapComponent = ({ trackingData, onMarkerClick, isLiveTracking, showRoutes }) => {
  const [infoWindow, setInfoWindow] = useState(null)
  const map = useMap()

  // Create custom marker icons
  const createCustomMarkerIcon = (color, isStart = false, isActive = false) => {
    const baseIcon = {
      fillColor: color,
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: isActive ? 3 : 2,
      scale: isActive ? 10 : 8,
    }

    if (isStart) {
      return {
        ...baseIcon,
        path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
        scale: isActive ? 1.2 : 1,
      }
    }

    return {
      ...baseIcon,
      path: "M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0",
    }
  }

  // Generate distinct colors for collectors
  const getCollectorColor = (index) => {
    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#84cc16", "#f97316"]
    return colors[index % colors.length]
  }

  const createMarkersData = () => {
    const markers = []
    const polylines = []

    trackingData.forEach((item, index) => {
      const isActive = item.isActive
      const collectorColor = getCollectorColor(index)

      // Start marker
      if (item.latitudeStart && item.longitudeStart) {
        const startLat = Number.parseFloat(item.latitudeStart)
        const startLng = Number.parseFloat(item.longitudeStart)

        if (!isNaN(startLat) && !isNaN(startLng)) {
          markers.push({
            id: `start-${index}`,
            position: { lat: startLat, lng: startLng },
            type: "start",
            data: item,
            title: `${item.sampleCollector} - Start`,
            color: "#10b981",
            isActive: false,
          })
        }
      }

      // Current position marker (live tracking)
      const currentLat = item.currentLatitude || item.latitudeEnd
      const currentLng = item.currentLongitude || item.longitudeEnd

      if (currentLat && currentLng) {
        const lat = Number.parseFloat(currentLat)
        const lng = Number.parseFloat(currentLng)

        if (!isNaN(lat) && !isNaN(lng)) {
          markers.push({
            id: `current-${index}`,
            position: { lat, lng },
            type: isActive ? "active" : "completed",
            data: item,
            title: `${item.sampleCollector} - ${isActive ? "Live" : "Completed"}`,
            color: isActive ? "#ef4444" : collectorColor,
            isActive: isActive,
          })
        }
      }

      // Create route polylines from location history
      if (showRoutes && item.routePoints && Array.isArray(item.routePoints)) {
        const validRoutePoints = item.routePoints
          .map((point) => {
            const lat = Number.parseFloat(point.lat || point.latitude)
            const lng = Number.parseFloat(point.lng || point.longitude)
            return !isNaN(lat) && !isNaN(lng) ? { lat, lng } : null
          })
          .filter((point) => point !== null)

        if (validRoutePoints.length > 1) {
          polylines.push({
            id: `route-${index}`,
            path: validRoutePoints,
            strokeColor: isActive ? "#ef4444" : collectorColor,
            strokeOpacity: 0.8,
            strokeWeight: isActive ? 4 : 3,
            data: item,
          })
        }
      }
    })

    return { markers, polylines }
  }

  // Auto-fit map bounds
  useEffect(() => {
    if (map && trackingData.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      let hasValidBounds = false

      trackingData.forEach((item) => {
        if (item.latitudeStart && item.longitudeStart) {
          const startLat = Number.parseFloat(item.latitudeStart)
          const startLng = Number.parseFloat(item.longitudeStart)
          if (!isNaN(startLat) && !isNaN(startLng)) {
            bounds.extend({ lat: startLat, lng: startLng })
            hasValidBounds = true
          }
        }

        const currentLat = item.currentLatitude || item.latitudeEnd
        const currentLng = item.currentLongitude || item.longitudeEnd
        if (currentLat && currentLng) {
          const lat = Number.parseFloat(currentLat)
          const lng = Number.parseFloat(currentLng)
          if (!isNaN(lat) && !isNaN(lng)) {
            bounds.extend({ lat, lng })
            hasValidBounds = true
          }
        }
      })

      if (hasValidBounds) {
        map.fitBounds(bounds, { padding: 50 })
      }
    }
  }, [map, trackingData])

  const { markers, polylines } = createMarkersData()

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Route polylines */}
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

      {/* Markers */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          onClick={() => {
            setInfoWindow(marker)
            if (onMarkerClick) onMarkerClick(marker.data)
          }}
          icon={createCustomMarkerIcon(marker.color, marker.type === "start", marker.isActive)}
        />
      ))}

      {/* Info Window */}
      {infoWindow && (
        <InfoWindow position={infoWindow.position} onCloseClick={() => setInfoWindow(null)}>
          <div style={{ padding: "8px", minWidth: "220px" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#1e293b", fontSize: "14px" }}>
              {infoWindow.data.sampleCollector}
            </h4>
            <p
              style={{
                margin: "0",
                color: infoWindow.color,
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {infoWindow.type === "start"
                ? "START LOCATION"
                : infoWindow.type === "active"
                  ? "🔴 LIVE TRACKING"
                  : "✅ COMPLETED"}
            </p>
            <p style={{ margin: "4px 0 0 0", color: "#374151", fontSize: "12px" }}>
              {infoWindow.type === "start"
                ? new Date(infoWindow.data.startTime).toLocaleString()
                : `Distance: ${infoWindow.data.distance_travelled || "0.00"} m`}
            </p>
            {infoWindow.type !== "start" && (
              <p style={{ margin: "4px 0 0 0", color: "#374151", fontSize: "12px" }}>
                {infoWindow.data.isActive ? "Last Update: " : "End Time: "}
                {new Date(infoWindow.data.lastUpdated || infoWindow.data.endTime).toLocaleString()}
              </p>
            )}
          </div>
        </InfoWindow>
      )}

      {/* Tracking Panel */}
      <TrackingPanel>
        <PanelTitle>
          <Users size={16} />
          Live Collectors ({trackingData.filter((d) => d.isActive).length})
        </PanelTitle>
        <TrackerList>
          {trackingData.map((item, index) => (
            <TrackerItem key={item.id} isActive={item.isActive}>
              <TrackerInfo>
                <TrackerStatus isActive={item.isActive} />
                <TrackerName title={item.sampleCollector}>{item.sampleCollector}</TrackerName>
              </TrackerInfo>
              <TrackerDistance>{item.distance_travelled || "0"} m</TrackerDistance>
            </TrackerItem>
          ))}
        </TrackerList>
      </TrackingPanel>
    </div>
  )
}

const LiveTrackingDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [trackingData, setTrackingData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isLiveTracking, setIsLiveTracking] = useState(true)
  const [showRoutes, setShowRoutes] = useState(true)
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

  const fetchTrackingData = async (date) => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiRequest(`${Labbaseurl}sample_collector_location/`, "GET", null, { date: date })

      if (response.success && response.data) {
        const locationData = Array.isArray(response.data) ? response.data : [response.data]

        const transformedData = locationData.map((item) => ({
          id: item.id,
          sampleCollector: item.sampleCollector,
          date: item.date,
          latitudeStart: item.latitudeStart,
          longitudeStart: item.longitudeStart,
          latitudeEnd: item.latitudeEnd,
          longitudeEnd: item.longitudeEnd,
          currentLatitude: item.currentLatitude,
          currentLongitude: item.currentLongitude,
          distance_travelled: item.distance_travelled || "0",
          startTime: item.startTime,
          endTime: item.endTime,
          lastUpdated: item.lastUpdated,
          isActive: item.isActive || (item.latitudeStart && !item.latitudeEnd),
          routePoints: Array.isArray(item.routePoints) ? item.routePoints : [],
        }))

        setTrackingData(transformedData)
      } else {
        setTrackingData([])
      }
    } catch (err) {
      console.error("Error fetching tracking data:", err)
      setError("Failed to fetch tracking data")
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (Labbaseurl && selectedDate) {
      fetchTrackingData(selectedDate)
    }
  }, [selectedDate, Labbaseurl])

  useEffect(() => {
    let interval
    if (isLiveTracking && Labbaseurl && selectedDate) {
      interval = setInterval(() => {
        fetchTrackingData(selectedDate)
      }, 10000) // Update every 10 seconds
    }
    return () => clearInterval(interval)
  }, [selectedDate, Labbaseurl, isLiveTracking])

  const handleRefresh = () => {
    fetchTrackingData(selectedDate)
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <MapSection>
          <MapHeader>
            <MapTitle>
              <MapIcon size={20} />
              Live Employee Tracking ({trackingData.length} employees)
            </MapTitle>
            <MapControls>
              <Button
                onClick={() => setIsLiveTracking(!isLiveTracking)}
                className={isLiveTracking ? "active" : ""}
                variant={isLiveTracking ? "success" : "secondary"}
              >
                <Play size={16} />
                {isLiveTracking ? "Live On" : "Live Off"}
              </Button>
              <Button onClick={() => setShowRoutes(!showRoutes)} variant={showRoutes ? "success" : "secondary"}>
                <Route size={16} />
                {showRoutes ? "Routes On" : "Routes Off"}
              </Button>
              <Button onClick={handleRefresh} disabled={loading}>
                <RefreshCw size={16} />
                Refresh
              </Button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "0.875rem",
                }}
              />
            </MapControls>
          </MapHeader>

          <MapContainer>
            {GOOGLE_MAPS_API_KEY ? (
              <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                <Map
                  defaultCenter={{ lat: 11.0168, lng: 76.9558 }}
                  defaultZoom={12}
                  gestureHandling="greedy"
                  style={{ width: "100%", height: "100%" }}
                >
                  <GoogleMapComponent
                    trackingData={trackingData}
                    isLiveTracking={isLiveTracking}
                    showRoutes={showRoutes}
                  />
                </Map>
              </APIProvider>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#ef4444",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <AlertCircle size={48} />
                <div>Google Maps API Key not configured</div>
              </div>
            )}
          </MapContainer>
        </MapSection>
      </Container>
    </>
  )
}

export default LiveTrackingDashboard
