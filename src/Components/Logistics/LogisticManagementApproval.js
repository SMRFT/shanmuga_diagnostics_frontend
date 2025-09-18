"use client"

import { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import styled, { css, createGlobalStyle } from "styled-components"
import { AlertCircle, CheckCircle, Save, Truck, Clock, FileText, Navigation, MapPin, Play, Square } from "lucide-react"
import axios from "axios"
import { APIProvider, Map, Marker, InfoWindow, useMap } from "@vis.gl/react-google-maps"

// Enhanced Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #f7f9fc;
    color: #333;
    margin: 0;
    padding: 0;
  }
`

// Enhanced Tracker Container
const TrackerContainer = styled.div`
  margin: 0 auto 2rem auto;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
`

const TrackerHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`

const TrackerTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`

const TrackerSubtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 0.875rem;
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
`

const TrackerButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${(props) => props.color || "#4CAF50"};
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: ${(props) => props.hoverColor || "#45a049"};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
`

const TrackingStatus = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const StatusLabel = styled.span`
  font-size: 0.875rem;
  opacity: 0.9;
`

const StatusValue = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
`

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.875rem;
`

// Main Container Components (keeping existing styles)
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  width: 100%;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`

export const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 1rem;
  color: white;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.15);
`

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`

export const Subtitle = styled.p`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-top: 0.5rem;
  margin-bottom: 0;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`

// Alert and other existing styled components remain the same...
export const AlertWrapper = styled.div`
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  animation: slideDown 0.3s ease-out;
  
  @keyframes slideDown {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  ${(props) =>
    props.variant === "success" &&
    css`
      background-color: #ecfdf5;
      color: #065f46;
      border-left: 4px solid #10b981;
    `}
  
  ${(props) =>
    props.variant === "danger" &&
    css`
      background-color: #fef2f2;
      color: #991b1b;
      border-left: 4px solid #ef4444;
    `}
`

// Enhanced Polyline component
const Polyline = ({ path, options }) => {
  const map = useMap()
  const polylineRef = useRef(null)

  useEffect(() => {
    if (!map || !path) return

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

  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null)
        polylineRef.current = null
      }
    }
  }, [])

  return null
}

// Enhanced Tracking Map Component
const TrackingMapComponent = ({ startPosition, currentPosition, routePoints, isTracking }) => {
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

  // Auto-fit map bounds
  useEffect(() => {
    if (map && (startPosition || currentPosition)) {
      const bounds = new window.google.maps.LatLngBounds()
      let hasValidBounds = false

      if (startPosition) {
        bounds.extend(startPosition)
        hasValidBounds = true
      }

      if (currentPosition) {
        bounds.extend(currentPosition)
        hasValidBounds = true
      }

      if (hasValidBounds) {
        map.fitBounds(bounds)
        if (map.getZoom() > 15) {
          map.setZoom(15)
        }
      }
    }
  }, [map, startPosition, currentPosition])

  return (
    <>
      {/* Start Marker */}
      {startPosition && (
        <Marker
          position={startPosition}
          icon={createCustomMarkerIcon("#10b981", true, false)}
          onClick={() => setInfoWindow("start")}
        />
      )}

      {/* Current Position Marker */}
      {currentPosition && (
        <Marker
          position={currentPosition}
          icon={createCustomMarkerIcon(isTracking ? "#ef4444" : "#6366f1", false, isTracking)}
          onClick={() => setInfoWindow("current")}
        />
      )}

      {/* Route Polyline */}
      {routePoints && routePoints.length > 1 && (
        <Polyline
          path={routePoints}
          options={{
            strokeColor: isTracking ? "#ef4444" : "#3b82f6",
            strokeWeight: 4,
            strokeOpacity: 0.7,
          }}
        />
      )}

      {/* Info Windows */}
      {infoWindow === "start" && startPosition && (
        <InfoWindow position={startPosition} onCloseClick={() => setInfoWindow(null)}>
          <div>
            <strong>Start Point</strong>
            <br />
            Tracking started here
          </div>
        </InfoWindow>
      )}

      {infoWindow === "current" && currentPosition && (
        <InfoWindow position={currentPosition} onCloseClick={() => setInfoWindow(null)}>
          <div>
            <strong>{isTracking ? "Current Location" : "End Point"}</strong>
            <br />
            {isTracking ? "Live tracking active" : "Tracking completed"}
          </div>
        </InfoWindow>
      )}
    </>
  )
}

// Enhanced styled component for map container
const MapContainer = styled.div`
  height: 300px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

// Enhanced Logistic Management Approval Component
const LogisticManagementApproval = () => {
  const location = useLocation()
  const userName = location.state?.userName || localStorage.getItem("name")
  const [todayTasks, setTodayTasks] = useState([])
  const [alert, setAlert] = useState({ message: "", type: "", visible: false })
  const [loading, setLoading] = useState(true)
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyDjW5Ryg_Of6RG2kGxV85-voG2sXHq0XZk"

  // Enhanced tracking state
  const [isTracking, setIsTracking] = useState(() => {
    return localStorage.getItem("trackingActive") === "true"
  })
  const [error, setError] = useState(null)
  const [startPosition, setStartPosition] = useState(() => {
    const savedStartPos = localStorage.getItem("startPosition")
    return savedStartPos ? JSON.parse(savedStartPos) : null
  })
  const [currentPosition, setCurrentPosition] = useState(() => {
    const savedCurrentPos = localStorage.getItem("currentPosition")
    return savedCurrentPos ? JSON.parse(savedCurrentPos) : null
  })
  const [routePoints, setRoutePoints] = useState(() => {
    const savedRoutePoints = localStorage.getItem("routePoints")
    return savedRoutePoints ? JSON.parse(savedRoutePoints) : []
  })
  const [trackingStats, setTrackingStats] = useState({
    startTime: null,
    endTime: null,
    totalDistance: 0,
    duration: null,
  })

  const watchIdRef = useRef(null)
  const locationUpdateIntervalRef = useRef(null)

  // Fetch today's tasks
  useEffect(() => {
    if (userName) {
      setLoading(true)
      axios
        .get(`${Labbaseurl}getlogisticdata/?sampleCollector=${userName}`)
        .then((response) => {
          const currentDate = new Date().toISOString().split("T")[0]
          setTodayTasks(response.data.filter((task) => task.date === currentDate))
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching logistic data:", error)
          setLoading(false)
        })
    }
  }, [userName])

  // Enhanced tracking initialization
  useEffect(() => {
    const storedUserName = localStorage.getItem("userName") || userName

    if (isTracking && startPosition) {
      // Restart position watching
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const newPosition = { lat: latitude, lng: longitude }
          setCurrentPosition(newPosition)
          localStorage.setItem("currentPosition", JSON.stringify(newPosition))

          setRoutePoints((prevPoints) => {
            const updatedPoints = [...prevPoints, newPosition]
            localStorage.setItem("routePoints", JSON.stringify(updatedPoints))
            return updatedPoints
          })

          // Send location update to server
          updateCurrentLocation(newPosition)
        },
        (error) => {
          setError(`Error tracking location: ${error.message}`)
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      )

      // Set up periodic location updates
      locationUpdateIntervalRef.current = setInterval(() => {
        if (currentPosition) {
          updateCurrentLocation(currentPosition)
        }
      }, 30000) // Update every 30 seconds
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
      if (locationUpdateIntervalRef.current) {
        clearInterval(locationUpdateIntervalRef.current)
      }
    }
  }, [isTracking, startPosition])

  // Enhanced function to update current location on server
  const updateCurrentLocation = async (position) => {
    try {
      const currentDate = new Date().toISOString().split("T")[0]
      const collectorName = localStorage.getItem("userName") || userName

      const payload = {
        sampleCollector: collectorName,
        date: currentDate,
        currentLatitude: position.lat,
        currentLongitude: position.lng,
      }

      await axios.put(`${Labbaseurl}sample_collector_location/`, payload)
    } catch (error) {
      console.error("Error updating current location:", error)
    }
  }

  // Enhanced start tracking function
  const startTracking = () => {
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    const collectorName = userName
    localStorage.setItem("userName", collectorName)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const currentPos = { lat: latitude, lng: longitude }

        // Update state
        setStartPosition(currentPos)
        setCurrentPosition(currentPos)
        setIsTracking(true)
        setRoutePoints([currentPos])

        // Update localStorage
        localStorage.setItem("startPosition", JSON.stringify(currentPos))
        localStorage.setItem("currentPosition", JSON.stringify(currentPos))
        localStorage.setItem("routePoints", JSON.stringify([currentPos]))
        localStorage.setItem("trackingActive", "true")
        localStorage.setItem("trackingDate", new Date().toISOString().split("T")[0])

        // Update tracking stats
        const startTime = new Date()
        setTrackingStats((prev) => ({
          ...prev,
          startTime: startTime,
          endTime: null,
          totalDistance: 0,
        }))

        // Save start location to backend
        saveStartLocation(currentPos)

        // Start watching position
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            const newPosition = { lat: latitude, lng: longitude }
            setCurrentPosition(newPosition)
            localStorage.setItem("currentPosition", JSON.stringify(newPosition))

            setRoutePoints((prevPoints) => {
              const updatedPoints = [...prevPoints, newPosition]
              localStorage.setItem("routePoints", JSON.stringify(updatedPoints))
              return updatedPoints
            })

            updateCurrentLocation(newPosition)
          },
          (error) => {
            setError(`Error tracking location: ${error.message}`)
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
        )

        // Set up periodic updates
        locationUpdateIntervalRef.current = setInterval(() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                setCurrentPosition(newPos)

                setRoutePoints((prevPoints) => {
                  const updatedPoints = [...prevPoints, newPos]
                  localStorage.setItem("routePoints", JSON.stringify(updatedPoints))
                  return updatedPoints
                })

                updateCurrentLocation(newPos)
              },
              (err) => console.error("Periodic location update error:", err),
              { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
            )
          }
        }, 30000)
      },
      (error) => {
        setError(`Error getting location: ${error.message}`)
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    )
  }

  // Enhanced stop tracking function
  const stopTracking = () => {
    if (currentPosition) {
      const positionToSend = {
        lat: currentPosition.lat,
        lng: currentPosition.lng,
      }

      // Update tracking stats
      const endTime = new Date()
      setTrackingStats((prev) => ({
        ...prev,
        endTime: endTime,
        duration: prev.startTime ? Math.round((endTime - prev.startTime) / 1000 / 60) : 0,
      }))

      // Update end location using PUT
      updateEndLocation(positionToSend)
    }

    // Update state and localStorage
    setIsTracking(false)
    localStorage.setItem("trackingActive", "false")

    // Clear intervals and watches
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    if (locationUpdateIntervalRef.current) {
      clearInterval(locationUpdateIntervalRef.current)
      locationUpdateIntervalRef.current = null
    }
  }

  // Enhanced save start location function
  const saveStartLocation = (position) => {
    const currentDate = new Date().toISOString().split("T")[0]
    const collectorName = userName
    localStorage.setItem("userName", collectorName)

    const payload = {
      sampleCollector: collectorName,
      date: currentDate,
      latitudeStart: position.lat,
      longitudeStart: position.lng,
    }

    axios
      .post(`${Labbaseurl}sample_collector_location/`, payload)
      .then((response) => {
        if (response.data.success) {
          console.log("Start location saved successfully:", response.data)
          setAlert({
            message: "Location tracking started successfully!",
            type: "success",
            visible: true,
          })
          setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 3000)
        } else {
          setError(`Failed to save start location data: ${response.data.message}`)
        }
      })
      .catch((error) => {
        console.error("Error saving start location:", error)
        setError("Failed to save start location data. Please try again.")
      })
  }

  // Enhanced update end location function
  const updateEndLocation = (position) => {
    const currentDate = new Date().toISOString().split("T")[0]
    const collectorName = localStorage.getItem("userName") || userName

    const payload = {
      sampleCollector: collectorName,
      date: currentDate,
      latitudeEnd: position.lat,
      longitudeEnd: position.lng,
    }

    axios
      .put(`${Labbaseurl}sample_collector_location/`, payload)
      .then((response) => {
        if (response.data.success) {
          console.log("End location updated successfully:", response.data)

          // Update tracking stats with server response
          if (response.data.data) {
            setTrackingStats((prev) => ({
              ...prev,
              totalDistance: response.data.data.distance_travelled || 0,
            }))
          }

          setAlert({
            message: "Location tracking completed successfully!",
            type: "success",
            visible: true,
          })
          setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 3000)
        } else {
          setError(`Failed to update end location data: ${response.data.message}`)
        }
      })
      .catch((error) => {
        console.error("Error updating end location:", error)
        if (error.response) {
          setError(`Server error: ${error.response.data.message || "Unknown error"}`)
        } else {
          setError("Failed to update end location data. Please try again.")
        }
      })
  }

  // Format duration helper
  const formatDuration = (minutes) => {
    if (!minutes) return "0m"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  // Existing task management functions remain the same...
  const handleCheckboxChange = (index, checked) => {
    setTodayTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index
          ? {
              ...task,
              samplePickedUp: checked,
              samplePickedUpTime: checked
                ? new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })
                : "",
            }
          : task,
      ),
    )
  }

  const handleTaskChange = (index, taskValue) => {
    setTodayTasks((prevTasks) => prevTasks.map((task, i) => (i === index ? { ...task, task: taskValue } : task)))
  }

  const handleRemarksChange = (index, remarks) => {
    setTodayTasks((prevTasks) => prevTasks.map((task, i) => (i === index ? { ...task, remarks } : task)))
  }

  const saveTask = (index) => {
    const taskToUpdate = todayTasks[index]
    if (!taskToUpdate) {
      console.error("Invalid task index")
      return
    }

    const payload = {
      sampleCollector: userName,
      date: taskToUpdate.date,
      sampleordertime: taskToUpdate.sampleordertime,
      lab_name: taskToUpdate.labName,
      salesMapping: taskToUpdate.salesMapping,
    }

    setAlert({ message: "Saving task...", type: "pending", visible: true })

    axios
      .get(`${Labbaseurl}savesamplecollector/`, { params: payload })
      .then((response) => {
        const existingTasks = response.data
        const matchedTask = existingTasks.find(
          (task) =>
            task.date === taskToUpdate.date &&
            task.time === taskToUpdate.time &&
            task.lab_name === taskToUpdate.labName,
        )

        if (matchedTask) {
          const updatePayload = {
            ...payload,
            samplePickedUp: taskToUpdate.samplePickedUp,
            samplePickedUpTime: taskToUpdate.samplePickedUpTime,
            remarks: taskToUpdate.remarks || "",
            salesperson: taskToUpdate.salesperson,
          }

          axios
            .patch(`${Labbaseurl}updatesamplecollectordetails/`, updatePayload)
            .then(() => {
              setAlert({ message: "Task updated successfully", type: "success", visible: true })
              setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 3000)
            })
            .catch((error) => {
              console.error("Error updating task:", error)
              setAlert({ message: "Error updating task", type: "danger", visible: true })
              setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 3000)
            })
        } else {
          const savePayload = {
            ...payload,
            task: taskToUpdate.task || "Accepted",
            samplePickedUp: taskToUpdate.samplePickedUp,
            samplePickedUpTime: taskToUpdate.samplePickedUpTime,
            remarks: taskToUpdate.remarks || "",
            sampleacceptedtime: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }),
          }

          axios
            .post(`${Labbaseurl}savesamplecollector/`, savePayload)
            .then(() => {
              setAlert({ message: "Task saved successfully", type: "success", visible: true })
              setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 3000)
              setTodayTasks((prevTasks) => prevTasks.map((task, i) => (i === index ? { ...task, saved: true } : task)))
            })
            .catch((error) => {
              console.error("Error saving task:", error)
              setAlert({ message: "Error saving task", type: "danger", visible: true })
              setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 3000)
            })
        }
      })
      .catch((error) => {
        console.error("Error checking existing task:", error)
        setAlert({ message: "Error checking task existence", type: "danger", visible: true })
        setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 3000)
      })
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>Enhanced Sample Collection Tracking</Title>
          <Subtitle>Manage tasks and track your location in real-time with Google Maps</Subtitle>
        </Header>

        {/* Enhanced Tracking Container */}
        <TrackerContainer>
          <TrackerHeader>
            <TrackerTitle>
              <Navigation size={20} />
              Location Tracking System
            </TrackerTitle>
            <TrackerSubtitle>Track your route and calculate distances automatically</TrackerSubtitle>
          </TrackerHeader>

          <ButtonContainer>
            {!isTracking ? (
              <TrackerButton onClick={startTracking} color="#10b981" hoverColor="#059669">
                <Play size={16} />
                Start Tracking
              </TrackerButton>
            ) : (
              <TrackerButton onClick={stopTracking} color="#ef4444" hoverColor="#dc2626">
                <Square size={16} />
                Stop Tracking
              </TrackerButton>
            )}
          </ButtonContainer>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          {(isTracking || trackingStats.startTime) && (
            <TrackingStatus>
              <StatusRow>
                <StatusLabel>Status:</StatusLabel>
                <StatusValue
                  style={{
                    color: isTracking ? "#10b981" : "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  {isTracking ? <Navigation size={14} /> : <MapPin size={14} />}
                  {isTracking ? "Active Tracking" : "Tracking Stopped"}
                </StatusValue>
              </StatusRow>

              {trackingStats.startTime && (
                <StatusRow>
                  <StatusLabel>Started:</StatusLabel>
                  <StatusValue>{trackingStats.startTime.toLocaleTimeString()}</StatusValue>
                </StatusRow>
              )}

              {trackingStats.endTime && (
                <StatusRow>
                  <StatusLabel>Ended:</StatusLabel>
                  <StatusValue>{trackingStats.endTime.toLocaleTimeString()}</StatusValue>
                </StatusRow>
              )}

              {trackingStats.duration > 0 && (
                <StatusRow>
                  <StatusLabel>Duration:</StatusLabel>
                  <StatusValue>{formatDuration(trackingStats.duration)}</StatusValue>
                </StatusRow>
              )}

              {trackingStats.totalDistance > 0 && (
                <StatusRow>
                  <StatusLabel>Distance:</StatusLabel>
                  <StatusValue>{Number.parseFloat(trackingStats.totalDistance).toFixed(2)} meters</StatusValue>
                </StatusRow>
              )}

              <StatusRow>
                <StatusLabel>Route Points:</StatusLabel>
                <StatusValue>{routePoints.length} waypoints</StatusValue>
              </StatusRow>
            </TrackingStatus>
          )}

          {(startPosition || currentPosition) && (
            <MapContainer>
              {GOOGLE_MAPS_API_KEY ? (
                <APIProvider
                  apiKey={GOOGLE_MAPS_API_KEY}
                  onLoad={() => console.log("Google Maps API loaded for tracking")}
                >
                  <Map
                    defaultCenter={startPosition || currentPosition || { lat: 11.0168, lng: 76.9558 }}
                    defaultZoom={15}
                    gestureHandling={"greedy"}
                    disableDefaultUI={false}
                    style={{ width: "100%", height: "100%" }}
                    mapTypeId="roadmap"
                  >
                    <TrackingMapComponent
                      startPosition={startPosition}
                      currentPosition={currentPosition}
                      routePoints={routePoints}
                      isTracking={isTracking}
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
                  <div style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                    Please set REACT_APP_GOOGLE_MAPS_API_KEY in your environment variables
                  </div>
                </div>
              )}
            </MapContainer>
          )}
        </TrackerContainer>

        {alert.visible && (
          <AlertWrapper variant={alert.type}>
            {alert.type === "success" ? (
              <CheckCircle size={20} />
            ) : alert.type === "danger" ? (
              <AlertCircle size={20} />
            ) : (
              <Clock size={20} />
            )}
            {alert.message}
          </AlertWrapper>
        )}

        {/* Rest of the existing task management UI remains the same */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            <Clock size={24} style={{ marginBottom: "1rem" }} />
            <p>Loading tasks...</p>
          </div>
        ) : todayTasks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            <Truck size={24} style={{ marginBottom: "1rem" }} />
            <p>No tasks scheduled for today</p>
          </div>
        ) : (
          <div
            style={{
              background: "white",
              borderRadius: "1rem",
              padding: "1.5rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.03)",
            }}
          >
            <h3
              style={{
                margin: "0 0 1.5rem 0",
                color: "#1e293b",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FileText size={20} />
              Today's Tasks ({todayTasks.length})
            </h3>

            {todayTasks.map((task, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.75rem",
                  padding: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: "#f8fafc",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gap: "1rem",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem", display: "block" }}>
                      Lab Name
                    </label>
                    <div style={{ fontWeight: "600", color: "#1e293b" }}>{task.labName}</div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem", display: "block" }}>
                      Order Time
                    </label>
                    <div style={{ fontWeight: "600", color: "#1e293b" }}>{task.sampleordertime}</div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem", display: "block" }}>
                      Task Status
                    </label>
                    <select
                      value={task.task || "Accepted"}
                      onChange={(e) => handleTaskChange(index, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #d1d5db",
                        fontSize: "0.875rem",
                      }}
                    >
                      <option value="Accepted">Accepted</option>
                      <option value="Not Accepted">Not Accepted</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={task.samplePickedUp || false}
                      onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                      style={{ marginRight: "0.25rem" }}
                    />
                    <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                      {task.samplePickedUp ? "Sample Picked Up" : "Mark as Picked Up"}
                    </span>
                  </label>

                  {task.samplePickedUpTime && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#16a34a",
                        backgroundColor: "#dcfce7",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.375rem",
                        fontWeight: "600",
                      }}
                    >
                      Picked up at: {task.samplePickedUpTime}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem", display: "block" }}>
                    Remarks
                  </label>
                  <input
                    type="text"
                    placeholder="Enter remarks (optional)"
                    value={task.remarks || ""}
                    onChange={(e) => handleRemarksChange(index, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #d1d5db",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => saveTask(index)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 1rem",
                      backgroundColor: "#6366f1",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#4f46e5")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#6366f1")}
                  >
                    <Save size={16} />
                    Save Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}

export default LogisticManagementApproval
