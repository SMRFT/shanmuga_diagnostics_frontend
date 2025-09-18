"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import styled from "styled-components"
import { APIProvider, Map, Marker, InfoWindow, useMap } from "@vis.gl/react-google-maps"
import {
  Calendar,
  User,
  Clock,
  Clipboard,
  ChevronRight,
  Check,
  X,
  FileText,
  Truck,
  MessageSquare,
  MapIcon,
  Navigation,
  MapPin,
  Route,
  Timer,
  AlertCircle,
} from "lucide-react"

// Fix for default marker icons
// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// })

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #334155;
  background-color: #f8fafc;
  min-height: 100vh;
`

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`

const Subtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
`

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
  }
`

const LiveTrackingCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  h3 {
    color: white;
    margin-bottom: 1rem;
  }
`

const ActiveCollectorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

const CollectorCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`

const CollectorName = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const CollectorStats = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  opacity: 0.9;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.75rem;
  margin-bottom: 2rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Select = styled.select`
  height: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 1rem;
  font-size: 0.9375rem;
  color: #334155;
  background-color: #f8fafc;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`

const Input = styled.input`
  height: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 1rem;
  font-size: 0.9375rem;
  color: #334155;
  background-color: ${(props) => (props.readOnly ? "#f1f5f9" : "#f8fafc")};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`

const Button = styled.button`
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }
`

const TimeDisplay = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #6366f1;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  background-color: #eff6ff;
  width: fit-content;
  margin-bottom: 1.5rem;
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
`

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f1f5f9;
    color: #334155;
  }
`

const MapWrapper = styled.div`
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  margin-bottom: 1rem;
  position: relative;
`

const TrackingStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
  background-color: ${(props) => (props.isActive ? "#f0fdf4" : "#fef2f2")};
  border-radius: 10px;
  border: 1px solid ${(props) => (props.isActive ? "#dcfce7" : "#fecaca")};
  color: ${(props) => (props.isActive ? "#16a34a" : "#dc2626")};
  font-weight: 600;
`

const LocationInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`

const InfoLabel = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
`

const InfoValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
`

const ViewLocationButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 8px;
  background-color: #eff6ff;
  color: #3b82f6;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #dbeafe;
    box-shadow: 0 2px 5px rgba(59, 130, 246, 0.2);
  }
`

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: 2rem;
  width: 100%;
  -webkit-overflow-scrolling: touch;

  table {
    white-space: nowrap;
  }
`

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 2rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`

const TableTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.5rem;
  font-weight: 600;
  color: #475569;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
`

const Tr = styled.tr`
  &:hover {
    background-color: #f8fafc;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
  }
`

const Td = styled.td`
  padding: 1rem 1.5rem;
  color: #334155;
  font-size: 0.875rem;
  vertical-align: top;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
  font-size: 1rem;
  background-color: #f8fafc;
`

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  font-size: 0.875rem;
`

// Custom Map Component using vanilla Leaflet (no React Leaflet)
// const LeafletMap = ({ locationData, routePoints, collectorName, onMapReady }) => {
//   const mapRef = useRef(null)
//   const mapInstanceRef = useRef(null)
//   const markersRef = useRef([])
//   const polylineRef = useRef(null)

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "N/A"
//     const date = new Date(dateString)
//     return date.toLocaleString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })
//   }

//   const clearMapElements = () => {
//     // Clear existing markers
//     markersRef.current.forEach((marker) => {
//       if (mapInstanceRef.current && marker) {
//         mapInstanceRef.current.removeLayer(marker)
//       }
//     })
//     markersRef.current = []

//     // Clear existing polyline
//     if (polylineRef.current && mapInstanceRef.current) {
//       mapInstanceRef.current.removeLayer(polylineRef.current)
//       polylineRef.current = null
//     }
//   }

//   const addMapElements = () => {
//     if (!mapInstanceRef.current || !locationData) return

//     clearMapElements()

//     // Add start marker
//     if (locationData.latitudeStart && locationData.longitudeStart) {
//       const startIcon = L.icon({
//         iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
//         shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
//         iconSize: [25, 41],
//         iconAnchor: [12, 41],
//         popupAnchor: [1, -34],
//         shadowSize: [41, 41],
//       })

//       const startMarker = L.marker(
//         [Number.parseFloat(locationData.latitudeStart), Number.parseFloat(locationData.longitudeStart)],
//         {
//           icon: startIcon,
//         },
//       )
//         .bindPopup(`<strong>Start Point</strong><br/>${formatDateTime(locationData.startTime)}`)
//         .addTo(mapInstanceRef.current)

//       markersRef.current.push(startMarker)
//     }

//     // Add current/end marker
//     if (locationData.currentLatitude && locationData.currentLongitude) {
//       const currentIcon = L.icon({
//         iconUrl: locationData.isActive
//           ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png"
//           : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
//         shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
//         iconSize: [25, 41],
//         iconAnchor: [12, 41],
//         popupAnchor: [1, -34],
//         shadowSize: [41, 41],
//       })

//       const currentMarker = L.marker(
//         [Number.parseFloat(locationData.currentLatitude), Number.parseFloat(locationData.currentLongitude)],
//         { icon: currentIcon },
//       )
//         .bindPopup(
//           `<strong>${locationData.isActive ? "Current Location" : "End Point"}</strong><br/>${collectorName}<br/>Last updated: ${formatDateTime(locationData.lastUpdated)}`,
//         )
//         .addTo(mapInstanceRef.current)

//       markersRef.current.push(currentMarker)
//     }

//     // Add route polyline
//     if (routePoints && routePoints.length > 1) {
//       const latlngs = routePoints.map((point) => [point.lat, point.lng])
//       polylineRef.current = L.polyline(latlngs, {
//         color: "#3b82f6",
//         weight: 4,
//         opacity: 0.7,
//       }).addTo(mapInstanceRef.current)
//     }

//     // Center map on current or start location
//     const centerLat = Number.parseFloat(locationData.currentLatitude || locationData.latitudeStart)
//     const centerLng = Number.parseFloat(locationData.currentLongitude || locationData.latitudeStart)
//     if (centerLat && centerLng) {
//       mapInstanceRef.current.setView([centerLat, centerLng], 15)
//     }
//   }

//   useEffect(() => {
//     if (!mapRef.current || mapInstanceRef.current) return

//     // Initialize map
//     mapInstanceRef.current = L.map(mapRef.current, {
//       center: [51.505, -0.09], // Default center
//       zoom: 13,
//       zoomControl: true,
//     })

//     // Add tile layer
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     }).addTo(mapInstanceRef.current)

//     // Call onMapReady callback
//     if (onMapReady) {
//       onMapReady(mapInstanceRef.current)
//     }

//     return () => {
//       // Cleanup function
//       if (mapInstanceRef.current) {
//         clearMapElements()
//         mapInstanceRef.current.remove()
//         mapInstanceRef.current = null
//       }
//     }
//   }, [])

//   useEffect(() => {
//     if (mapInstanceRef.current && locationData) {
//       addMapElements()
//     }
//   }, [locationData, routePoints, collectorName])

//   return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
// }

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

// Enhanced Location Modal Component with Vanilla Leaflet
// const EnhancedLocationModal = ({ isOpen, onClose, collectorName, collectorData }) => {
//   const [locationData, setLocationData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [routePoints, setRoutePoints] = useState([])
//   const intervalRef = useRef(null)
//   const mapRef = useRef(null)
//   const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

//   const fetchCollectorLocation = async () => {
//     try {
//       const today = new Date().toISOString().split("T")[0]

//       const response = await axios.get(`${Labbaseurl}sample_collector_location/`, {
//         params: { date: today, sampleCollector: collectorName },
//       })

//       if (response.data.success) {
//         const locationData = response.data.data && response.data.data.length > 0 ? response.data.data[0] : null

//         setLocationData(locationData)

//         if (locationData && locationData.routePoints) {
//           setRoutePoints(locationData.routePoints)
//         }

//         // Pan map to current location if available
//         if (locationData && locationData.currentLatitude && locationData.currentLongitude && mapRef.current) {
//           mapRef.current.setView(
//             [Number.parseFloat(locationData.currentLatitude), Number.parseFloat(locationData.currentLongitude)],
//             15,
//           )
//         }
//       } else {
//         setError(response.data.message || "Failed to fetch location data")
//       }
//       setLoading(false)
//     } catch (err) {
//       console.error("Error fetching location data:", err)
//       setError("Failed to fetch location data. Please try again later.")
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (isOpen) {
//       setLoading(true)
//       setError(null)
//       setLocationData(null)
//       setRoutePoints([])

//       fetchCollectorLocation()
//       intervalRef.current = setInterval(fetchCollectorLocation, 5000)
//     }

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current)
//         intervalRef.current = null
//       }
//     }
//   }, [isOpen, collectorName])

//   const calculateTotalDistance = (points) => {
//     if (!points || points.length < 2) return 0

//     let totalDistance = 0
//     for (let i = 1; i < points.length; i++) {
//       const [lat1, lng1] = [points[i - 1].lat, points[i - 1].lng]
//       const [lat2, lng2] = [points[i].lat, points[i].lng]

//       const R = 6371 // Earth's radius in km
//       const dLat = ((lat2 - lat1) * Math.PI) / 180
//       const dLon = ((lng2 - lng1) * Math.PI) / 180
//       const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
//       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
//       const d = R * c
//       totalDistance += d
//     }

//     return totalDistance.toFixed(2)
//   }

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "N/A"

//     const date = new Date(dateString)
//     return date.toLocaleString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })
//   }

//   if (!isOpen) return null

//   return (
//     <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
//       <ModalContent>
//         <ModalHeader>
//           <ModalTitle>
//             <Navigation size={20} />
//             Enhanced Live Tracking: {collectorName}
//           </ModalTitle>
//           <CloseButton onClick={onClose}>
//             <X size={20} />
//           </CloseButton>
//         </ModalHeader>

//         <TrackingStatus isActive={locationData?.isActive}>
//           {locationData?.isActive ? (
//             <>
//               <Navigation size={16} />
//               Live Tracking Active
//             </>
//           ) : (
//             <>
//               <MapPin size={16} />
//               Tracking Inactive
//             </>
//           )}
//         </TrackingStatus>

//         {loading && !locationData ? (
//           <LoadingSpinner>Loading location data...</LoadingSpinner>
//         ) : error ? (
//           <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>{error}</div>
//         ) : locationData ? (
//           <>
//             <LocationInfo>
//               <InfoItem>
//                 <InfoLabel>Status</InfoLabel>
//                 <InfoValue
//                   style={{
//                     color: locationData.isActive ? "#16a34a" : "#dc2626",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "0.25rem",
//                   }}
//                 >
//                   {locationData.isActive ? <Navigation size={14} /> : <MapPin size={14} />}
//                   {locationData.isActive ? "Active - Live Tracking" : "Tracking Completed"}
//                 </InfoValue>
//               </InfoItem>

//               <InfoItem>
//                 <InfoLabel>Start Time</InfoLabel>
//                 <InfoValue>{formatDateTime(locationData.startTime)}</InfoValue>
//               </InfoItem>

//               {locationData.endTime && (
//                 <InfoItem>
//                   <InfoLabel>End Time</InfoLabel>
//                   <InfoValue>{formatDateTime(locationData.endTime)}</InfoValue>
//                 </InfoItem>
//               )}

//               <InfoItem>
//                 <InfoLabel>Total Distance</InfoLabel>
//                 <InfoValue>
//                   {locationData.distance_travelled
//                     ? `${Number.parseFloat(locationData.distance_travelled).toFixed(2)} meters`
//                     : routePoints.length > 1
//                       ? `${calculateTotalDistance(routePoints)} km`
//                       : "N/A"}
//                 </InfoValue>
//               </InfoItem>

//               {locationData.totalDuration && (
//                 <InfoItem>
//                   <InfoLabel>Total Duration</InfoLabel>
//                   <InfoValue>{locationData.totalDuration}</InfoValue>
//                 </InfoItem>
//               )}

//               <InfoItem>
//                 <InfoLabel>Route Points</InfoLabel>
//                 <InfoValue>{routePoints.length} waypoints</InfoValue>
//               </InfoItem>
//             </LocationInfo>

//             <MapWrapper>
//               {locationData && (locationData.currentLatitude || locationData.latitudeStart) ? (
//                 <LeafletMap
//                   locationData={locationData}
//                   routePoints={routePoints}
//                   collectorName={collectorName}
//                   onMapReady={(mapInstance) => {
//                     mapRef.current = mapInstance
//                   }}
//                 />
//               ) : (
//                 <LoadingSpinner>No location data available</LoadingSpinner>
//               )}
//             </MapWrapper>

//             <div style={{ textAlign: "center", color: "#64748b", fontSize: "0.875rem", marginTop: "0.5rem" }}>
//               {locationData.isActive
//                 ? "Location is automatically updated every 5 seconds"
//                 : "Tracking session completed"}
//             </div>
//           </>
//         ) : (
//           <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
//             No location data available for this collector today.
//           </div>
//         )}
//       </ModalContent>
//     </ModalOverlay>
//   )
// }

const GoogleMapComponent = ({ locationData, routePoints, collectorName, onMapReady }) => {
  const [infoWindow, setInfoWindow] = useState(null)
  const map = useMap()

  const defaultCenter = { lat: 11.0168, lng: 76.9558 } // Salem, Tamil Nadu

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

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
    if (map && locationData) {
      const bounds = new window.google.maps.LatLngBounds()
      let hasValidBounds = false

      if (locationData.latitudeStart && locationData.longitudeStart) {
        const startLat = Number.parseFloat(locationData.latitudeStart)
        const startLng = Number.parseFloat(locationData.longitudeStart)
        if (!isNaN(startLat) && !isNaN(startLng)) {
          bounds.extend({ lat: startLat, lng: startLng })
          hasValidBounds = true
        }
      }

      if (locationData.currentLatitude && locationData.currentLongitude) {
        const currentLat = Number.parseFloat(locationData.currentLatitude)
        const currentLng = Number.parseFloat(locationData.currentLongitude)
        if (!isNaN(currentLat) && !isNaN(currentLng)) {
          bounds.extend({ lat: currentLat, lng: currentLng })
          hasValidBounds = true
        }
      }

      if (hasValidBounds) {
        map.fitBounds(bounds)
        if (map.getZoom() > 15) {
          map.setZoom(15)
        }
      }
    }
  }, [map, locationData])

  // Call onMapReady callback
  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map)
    }
  }, [map, onMapReady])

  if (!locationData) return null

  const startPosition =
    locationData.latitudeStart && locationData.longitudeStart
      ? {
          lat: Number.parseFloat(locationData.latitudeStart),
          lng: Number.parseFloat(locationData.longitudeStart),
        }
      : null

  const currentPosition =
    locationData.currentLatitude && locationData.currentLongitude
      ? {
          lat: Number.parseFloat(locationData.currentLatitude),
          lng: Number.parseFloat(locationData.currentLongitude),
        }
      : null

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

      {/* Current/End Marker */}
      {currentPosition && (
        <Marker
          position={currentPosition}
          icon={createCustomMarkerIcon(locationData.isActive ? "#ef4444" : "#6366f1", false, locationData.isActive)}
          onClick={() => setInfoWindow("current")}
        />
      )}

      {/* Route Polyline */}
      {routePoints && routePoints.length > 1 && (
        <Polyline
          path={routePoints.map((point) => ({ lat: point.lat, lng: point.lng }))}
          options={{
            strokeColor: "#3b82f6",
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
            {formatDateTime(locationData.startTime)}
          </div>
        </InfoWindow>
      )}

      {infoWindow === "current" && currentPosition && (
        <InfoWindow position={currentPosition} onCloseClick={() => setInfoWindow(null)}>
          <div>
            <strong>{locationData.isActive ? "Current Location" : "End Point"}</strong>
            <br />
            {collectorName}
            <br />
            Last updated: {formatDateTime(locationData.lastUpdated)}
          </div>
        </InfoWindow>
      )}
    </>
  )
}

const EnhancedLocationModal = ({ isOpen, onClose, collectorName, collectorData }) => {
  const [locationData, setLocationData] = useState(null)
  const [routePoints, setRoutePoints] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)
  const mapRef = useRef(null)

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyDjW5Ryg_Of6RG2kGxV85-voG2sXHq0XZk"

  const fetchCollectorLocation = async () => {
    try {
      const currentDate = new Date().toISOString().split("T")[0]
      const response = await axios.get(`${Labbaseurl}sample_collector_location/`, {
        params: {
          sampleCollector: collectorName,
          date: currentDate,
        },
      })

      if (response.data && response.data.length > 0) {
        const data = response.data[0]

        // Determine if tracking is active
        const isActive = data.latitudeStart && !data.latitudeEnd && data.currentLatitude && data.currentLongitude

        const processedData = {
          ...data,
          isActive,
          lastUpdated: new Date().toISOString(),
        }

        setLocationData(processedData)

        // Generate route points if we have start and current positions
        if (data.latitudeStart && data.longitudeStart && data.currentLatitude && data.currentLongitude) {
          const startLat = Number.parseFloat(data.latitudeStart)
          const startLng = Number.parseFloat(data.longitudeStart)
          const currentLat = Number.parseFloat(data.currentLatitude)
          const currentLng = Number.parseFloat(data.currentLongitude)

          if (!isNaN(startLat) && !isNaN(startLng) && !isNaN(currentLat) && !isNaN(currentLng)) {
            const points = [
              { lat: startLat, lng: startLng },
              { lat: currentLat, lng: currentLng },
            ]
            setRoutePoints(points)
          }
        }
      } else {
        setLocationData(null)
        setRoutePoints([])
      }
      setError(null)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching location:", error)
      setError("Failed to fetch location data")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      setError(null)
      setLocationData(null)
      setRoutePoints([])

      fetchCollectorLocation()
      intervalRef.current = setInterval(fetchCollectorLocation, 5000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isOpen, collectorName])

  const calculateTotalDistance = (points) => {
    if (!points || points.length < 2) return 0

    let totalDistance = 0
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]

      // Haversine formula for distance calculation
      const R = 6371 // Earth's radius in km
      const dLat = ((curr.lat - prev.lat) * Math.PI) / 180
      const dLng = ((curr.lng - prev.lng) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((prev.lat * Math.PI) / 180) *
          Math.cos((curr.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      totalDistance += R * c
    }

    return totalDistance.toFixed(2)
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  if (!isOpen) return null

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <Navigation size={20} />
            Enhanced Live Tracking: {collectorName}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <TrackingStatus isActive={locationData?.isActive}>
          {locationData?.isActive ? (
            <>
              <Navigation size={16} />
              Live Tracking Active
            </>
          ) : (
            <>
              <MapPin size={16} />
              Tracking Inactive
            </>
          )}
        </TrackingStatus>

        {loading && !locationData ? (
          <LoadingSpinner>Loading location data...</LoadingSpinner>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>{error}</div>
        ) : locationData ? (
          <>
            <LocationInfo>
              <InfoItem>
                <InfoLabel>Status</InfoLabel>
                <InfoValue
                  style={{
                    color: locationData.isActive ? "#16a34a" : "#dc2626",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  {locationData.isActive ? <Navigation size={14} /> : <MapPin size={14} />}
                  {locationData.isActive ? "Active - Live Tracking" : "Tracking Completed"}
                </InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Start Time</InfoLabel>
                <InfoValue>{formatDateTime(locationData.startTime)}</InfoValue>
              </InfoItem>

              {locationData.endTime && (
                <InfoItem>
                  <InfoLabel>End Time</InfoLabel>
                  <InfoValue>{formatDateTime(locationData.endTime)}</InfoValue>
                </InfoItem>
              )}

              <InfoItem>
                <InfoLabel>Total Distance</InfoLabel>
                <InfoValue>
                  {locationData.distance_travelled
                    ? `${Number.parseFloat(locationData.distance_travelled).toFixed(2)} meters`
                    : routePoints.length > 1
                      ? `${calculateTotalDistance(routePoints)} km`
                      : "N/A"}
                </InfoValue>
              </InfoItem>

              {locationData.totalDuration && (
                <InfoItem>
                  <InfoLabel>Total Duration</InfoLabel>
                  <InfoValue>{locationData.totalDuration}</InfoValue>
                </InfoItem>
              )}

              <InfoItem>
                <InfoLabel>Route Points</InfoLabel>
                <InfoValue>{routePoints.length} waypoints</InfoValue>
              </InfoItem>
            </LocationInfo>

            <MapWrapper>
              {GOOGLE_MAPS_API_KEY ? (
                <APIProvider
                  apiKey={GOOGLE_MAPS_API_KEY}
                  onLoad={() => console.log("Google Maps API loaded for location tracking")}
                >
                  <Map
                    defaultCenter={{ lat: 11.0168, lng: 76.9558 }}
                    defaultZoom={13}
                    gestureHandling={"greedy"}
                    disableDefaultUI={false}
                    style={{ width: "100%", height: "100%" }}
                    mapTypeId="roadmap"
                  >
                    <GoogleMapComponent
                      locationData={locationData}
                      routePoints={routePoints}
                      collectorName={collectorName}
                      onMapReady={(mapInstance) => {
                        mapRef.current = mapInstance
                      }}
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
            </MapWrapper>

            <div style={{ textAlign: "center", color: "#64748b", fontSize: "0.875rem", marginTop: "0.5rem" }}>
              {locationData.isActive
                ? "Location is automatically updated every 5 seconds"
                : "Tracking session completed"}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
            No location data available for this collector today.
          </div>
        )}
      </ModalContent>
    </ModalOverlay>
  )
}

// Main Enhanced Admin Component
// const LogisticManagementAdmin = () => {
//   const [clinicalNames, setClinicalNames] = useState([])
//   const [selectedLabName, setSelectedLabName] = useState("")
//   const [salesperson, setSalesperson] = useState("")
//   const [sampleCollectorOptions, setSampleCollectorOptions] = useState([])
//   const [selectedSampleCollector, setSelectedSampleCollector] = useState("")
//   const [selectedDate, setSelectedDate] = useState(new Date())
//   const [message, setMessage] = useState("")
//   const [messageType, setMessageType] = useState("")
//   const [logisticData, setLogisticData] = useState([])
//   const [getlogisticData, setGetLogisticData] = useState([])
//   const [time, setTime] = useState(
//     new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
//   )
//   const [selectedTask, setSelectedTask] = useState("")
//   const [showLocationModal, setShowLocationModal] = useState(false)
//   const [selectedCollector, setSelectedCollector] = useState(null)
//   const [selectedCollectorData, setSelectedCollectorData] = useState(null)
//   const [activeCollectors, setActiveCollectors] = useState([])

//   const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

//   // Update time every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }))
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [])

//   // Fetch clinical names
//   useEffect(() => {
//     if (Labbaseurl) {
//       axios
//         .get(`${Labbaseurl}get_clinicalname/`)
//         .then((response) => {
//           setClinicalNames(response.data)
//         })
//         .catch((error) => {
//           console.error("Error fetching clinical names:", error)
//         })
//     }
//   }, [Labbaseurl])

//   // Fetch sample collectors
//   useEffect(() => {
//     const fetchSampleCollector = async () => {
//       if (Labbaseurl) {
//         try {
//           const response = await axios.get(`${Labbaseurl}sample-collector/`)
//           setSampleCollectorOptions(response.data)
//         } catch (error) {
//           console.error("Error fetching sample collectors:", error)
//         }
//       }
//     }
//     fetchSampleCollector()
//   }, [Labbaseurl])

//   const fetchLogisticData = async () => {
//     if (Labbaseurl) {
//       try {
//         const response = await axios.get(`${Labbaseurl}savesamplecollector/`)
//         setLogisticData(response.data)
//       } catch (error) {
//         console.error("Error fetching logistic data:", error)
//       }
//     }
//   }

//   const getfetchLogistic = async () => {
//     if (Labbaseurl) {
//       try {
//         const response = await axios.get(`${Labbaseurl}get_logistic_data/`)
//         setGetLogisticData(response.data)
//       } catch (error) {
//         console.error("Error fetching logistic data:", error)
//       }
//     }
//   }

//   useEffect(() => {
//     fetchLogisticData()
//     getfetchLogistic()
//   }, [])

//   const handleLabNameChange = (e) => {
//     const selectedName = e.target.value
//     setSelectedLabName(selectedName)
//     const selectedLab = clinicalNames.find((lab) => lab.clinicalname === selectedName)
//     if (selectedLab) {
//       setSalesperson(selectedLab.salesMapping || "")
//     } else {
//       setSalesperson("")
//     }
//   }

//   const handleViewLocation = (collectorName, data) => {
//     setSelectedCollector(collectorName)
//     setSelectedCollectorData(data)
//     setShowLocationModal(true)
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     })
//   }

//   const handleSave = () => {
//     if (!selectedLabName || !selectedSampleCollector || !selectedTask) {
//       setMessage("Please fill in all required fields.")
//       setMessageType("danger")
//       setTimeout(() => {
//         setMessage("")
//       }, 5000)
//       return
//     }

//     const formattedDate = selectedDate.toISOString().split("T")[0]
//     const payload = {
//       labName: selectedLabName,
//       salesMapping: salesperson,
//       sampleCollector: selectedSampleCollector,
//       date: formattedDate,
//       sampleordertime: time,
//       task: selectedTask,
//     }

//     if (Labbaseurl) {
//       axios
//         .post(`${Labbaseurl}save-logistic-data/`, payload)
//         .then(() => {
//           setMessage("Task assigned successfully!")
//           setMessageType("success")
//           setSelectedLabName("")
//           setSalesperson("")
//           setSelectedSampleCollector("")
//           setSelectedTask("")
//           fetchLogisticData()
//           getfetchLogistic()
//           setTimeout(() => {
//             setMessage("")
//           }, 5000)
//         })
//         .catch((error) => {
//           console.error("Error saving data:", error)
//           setMessage("Failed to assign task. Please try again.")
//           setMessageType("danger")
//           setTimeout(() => {
//             setMessage("")
//           }, 5000)
//         })
//     }
//   }

//   const filterTodayData = () => {
//     const today = new Date().toISOString().split("T")[0]
//     return logisticData.filter((data) => data.date === today)
//   }

//   const renderStatusBadge = (status) => {
//     if (!status) return null

//     const statusLower = status.toLowerCase()

//     return (
//       <span
//         style={{
//           display: "inline-flex",
//           alignItems: "center",
//           gap: "0.375rem",
//           padding: "0.375rem 0.75rem",
//           fontSize: "0.75rem",
//           fontWeight: "600",
//           borderRadius: "9999px",
//           backgroundColor:
//             statusLower === "assigned"
//               ? "#e0e7ff"
//               : statusLower === "accepted"
//                 ? "#dcfce7"
//                 : statusLower === "picked"
//                   ? "#cffafe"
//                   : "#f3f4f6",
//           color:
//             statusLower === "assigned"
//               ? "#4f46e5"
//               : statusLower === "accepted"
//                 ? "#16a34a"
//                 : statusLower === "picked"
//                   ? "#0891b2"
//                   : "#6b7280",
//         }}
//       >
//         {statusLower === "assigned" && <Clipboard size={14} />}
//         {statusLower === "accepted" && <Check size={14} />}
//         {statusLower === "picked" && <Truck size={14} />}
//         {status}
//       </span>
//     )
//   }

//   return (
//     <PageContainer>
//       <PageHeader>
//         <Title>Enhanced Logistic Management Admin</Title>
//         <Subtitle>Assign, track, and monitor sample collections with real-time location tracking</Subtitle>
//       </PageHeader>

//       <TimeDisplay>
//         <Clock size={18} />
//         {time}
//       </TimeDisplay>

//       {/* Live Tracking Dashboard */}
//       {activeCollectors.length > 0 && (
//         <LiveTrackingCard>
//           <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
//             <Navigation size={20} />
//             Live Tracking Dashboard ({activeCollectors.length} Active)
//           </h3>
//           <ActiveCollectorGrid>
//             {activeCollectors.map((collector, index) => (
//               <CollectorCard key={index}>
//                 <CollectorName>
//                   <MapPin size={16} />
//                   {collector.sampleCollector}
//                 </CollectorName>
//                 <CollectorStats>
//                   <span>
//                     <Timer size={12} style={{ marginRight: "0.25rem" }} />
//                     Started: {new Date(collector.startTime).toLocaleTimeString()}
//                   </span>
//                   <span>
//                     <Route size={12} style={{ marginRight: "0.25rem" }} />
//                     {collector.distance_travelled
//                       ? `${Number.parseFloat(collector.distance_travelled).toFixed(2)}m`
//                       : "0m"}
//                   </span>
//                 </CollectorStats>
//                 <ViewLocationButton
//                   onClick={() => handleViewLocation(collector.sampleCollector, collector)}
//                   style={{ marginTop: "0.5rem", width: "100%", justifyContent: "center" }}
//                 >
//                   <Map size={14} />
//                   View Live Location
//                 </ViewLocationButton>
//               </CollectorCard>
//             ))}
//           </ActiveCollectorGrid>
//         </LiveTrackingCard>
//       )}

//       {message && (
//         <div
//           style={{
//             padding: "1rem",
//             borderRadius: "0.75rem",
//             marginBottom: "1.5rem",
//             display: "flex",
//             alignItems: "center",
//             gap: "0.75rem",
//             fontWeight: "500",
//             backgroundColor: messageType === "success" ? "#ecfdf5" : "#fef2f2",
//             color: messageType === "success" ? "#065f46" : "#991b1b",
//             borderLeft: `4px solid ${messageType === "success" ? "#10b981" : "#ef4444"}`,
//           }}
//         >
//           {messageType === "success" ? <Check size={20} /> : <X size={20} />}
//           {message}
//         </div>
//       )}

//       <Card>
//         <Label style={{ textAlign: "center", display: "block", marginBottom: "1rem" }}>
//           <Calendar size={18} />
//           Select Assignment Date
//         </Label>

//         <div style={{ maxWidth: "250px", margin: "0 auto 2rem auto" }}>
//           <DatePicker
//             selected={selectedDate}
//             onChange={(date) => setSelectedDate(date)}
//             dateFormat="dd-MM-yyyy"
//             style={{
//               height: "48px",
//               width: "100%",
//               border: "1px solid #e2e8f0",
//               borderRadius: "12px",
//               padding: "0 1rem",
//               fontSize: "0.9375rem",
//               color: "#334155",
//               backgroundColor: "#f8fafc",
//             }}
//           />
//         </div>

//         <FormGrid>
//           <FormGroup>
//             <Label>
//               <FileText size={16} />
//               Lab Name
//             </Label>
//             <Select value={selectedLabName} onChange={handleLabNameChange}>
//               <option value="">Select Lab Name</option>
//               {clinicalNames.map((lab) => (
//                 <option key={lab.clinicalname} value={lab.clinicalname}>
//                   {lab.clinicalname}
//                 </option>
//               ))}
//             </Select>
//           </FormGroup>

//           <FormGroup>
//             <Label>
//               <User size={16} />
//               Salesperson
//             </Label>
//             <Input type="text" placeholder="Salesperson" value={salesperson} readOnly />
//           </FormGroup>

//           <FormGroup>
//             <Label>
//               <Truck size={16} />
//               Sample Collector
//             </Label>
//             <Select value={selectedSampleCollector} onChange={(e) => setSelectedSampleCollector(e.target.value)}>
//               <option value="">Select Sample Collector</option>
//               {sampleCollectorOptions.map((collector) => (
//                 <option key={collector.id} value={collector.name}>
//                   {collector.name}
//                 </option>
//               ))}
//             </Select>
//           </FormGroup>

//           <FormGroup>
//             <Label>
//               <Clipboard size={16} />
//               Task
//             </Label>
//             <Select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
//               <option value="">Select Task</option>
//               <option value="assigned">Assigned</option>
//             </Select>
//           </FormGroup>
//         </FormGrid>

//         <div style={{ display: "flex", justifyContent: "flex-end" }}>
//           <Button onClick={handleSave}>
//             Assign Task
//             <ChevronRight size={18} />
//           </Button>
//         </div>
//       </Card>

//       {/* Enhanced Location Modal */}
//       {showLocationModal && (
//         <EnhancedLocationModal
//           isOpen={showLocationModal}
//           onClose={() => setShowLocationModal(false)}
//           collectorName={selectedCollector}
//           collectorData={selectedCollectorData}
//         />
//       )}

//       <SectionTitle>All Logistic Data</SectionTitle>
//       <TableContainer>
//         <TableHeader>
//           <FileText size={20} color="#6366f1" />
//           <TableTitle>Complete Logistics History</TableTitle>
//         </TableHeader>
//         {filterTodayData().length > 0 ? (
//           <Table>
//             <thead>
//               <tr>
//                 <Th>Date</Th>
//                 <Th>Lab Name</Th>
//                 <Th>Salesperson</Th>
//                 <Th>Sample Collector</Th>
//                 <Th>Order Time</Th>
//                 <Th>Status</Th>
//                 <Th>Accepted Time</Th>
//                 <Th>Picked Up Time</Th>
//                 <Th>Remarks</Th>
//                 <Th>Live Tracking</Th>
//               </tr>
//             </thead>
//             <tbody>
//               {filterTodayData().map((data, index) => (
//                 <Tr key={index}>
//                   <Td>{formatDate(data.date)}</Td>
//                   <Td>{data.lab_name}</Td>
//                   <Td>{data.salesMapping}</Td>
//                   <Td>{data.sampleCollector}</Td>
//                   <Td>{data.sampleordertime}</Td>
//                   <Td>{renderStatusBadge(data.task)}</Td>
//                   <Td>{data.sampleacceptedtime || "—"}</Td>
//                   <Td>{data.samplepickeduptime || "—"}</Td>
//                   <Td>
//                     {data.remarks ? (
//                       <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
//                         <MessageSquare size={14} />
//                         {data.remarks}
//                       </div>
//                     ) : (
//                       "—"
//                     )}
//                   </Td>
//                   <Td>
//                     <ViewLocationButton onClick={() => handleViewLocation(data.sampleCollector, data)}>
//                       <Map size={14} />
//                       View Map
//                     </ViewLocationButton>
//                   </Td>
//                 </Tr>
//               ))}
//             </tbody>
//           </Table>
//         ) : (
//           <EmptyState>
//             No logistics data available for today. Task history will appear here once tasks are assigned.
//           </EmptyState>
//         )}
//       </TableContainer>
//     </PageContainer>
//   )
// }

const LogisticManagementAdmin = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [logisticData, setLogisticData] = useState([])
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")
  const [time, setTime] = useState(new Date().toLocaleTimeString())
  const [activeCollectors, setActiveCollectors] = useState([])
  const [selectedCollector, setSelectedCollector] = useState(null)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [selectedCollectorData, setSelectedCollectorData] = useState(null)

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyDjW5Ryg_Of6RG2kGxV85-voG2sXHq0XZk"

  const [clinicalNames, setClinicalNames] = useState([])
  const [selectedLabName, setSelectedLabName] = useState("")
  const [salesperson, setSalesperson] = useState("")
  const [sampleCollectorOptions, setSampleCollectorOptions] = useState([])
  const [selectedSampleCollector, setSelectedSampleCollector] = useState("")
  const [selectedTask, setSelectedTask] = useState("")
  const [getlogisticData, setGetLogisticData] = useState([])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch clinical names
  useEffect(() => {
    if (Labbaseurl) {
      axios
        .get(`${Labbaseurl}get_clinicalname/`)
        .then((response) => {
          setClinicalNames(response.data)
        })
        .catch((error) => {
          console.error("Error fetching clinical names:", error)
        })
    }
  }, [Labbaseurl])

  // Fetch sample collectors
  useEffect(() => {
    const fetchSampleCollector = async () => {
      if (Labbaseurl) {
        try {
          const response = await axios.get(`${Labbaseurl}sample-collector/`)
          setSampleCollectorOptions(response.data)
        } catch (error) {
          console.error("Error fetching sample collectors:", error)
        }
      }
    }
    fetchSampleCollector()
  }, [Labbaseurl])

  const fetchLogisticData = async () => {
    if (Labbaseurl) {
      try {
        const response = await axios.get(`${Labbaseurl}savesamplecollector/`)
        setLogisticData(response.data)
      } catch (error) {
        console.error("Error fetching logistic data:", error)
      }
    }
  }

  const getfetchLogistic = async () => {
    if (Labbaseurl) {
      try {
        const response = await axios.get(`${Labbaseurl}get_logistic_data/`)
        setGetLogisticData(response.data)
      } catch (error) {
        console.error("Error fetching logistic data:", error)
      }
    }
  }

  useEffect(() => {
    fetchLogisticData()
    getfetchLogistic()
  }, [])

  const handleLabNameChange = (e) => {
    const selectedName = e.target.value
    setSelectedLabName(selectedName)
    const selectedLab = clinicalNames.find((lab) => lab.clinicalname === selectedName)
    if (selectedLab) {
      setSalesperson(selectedLab.salesMapping || "")
    } else {
      setSalesperson("")
    }
  }

  // Fetch active collectors for live tracking
  useEffect(() => {
    const fetchActiveCollectors = async () => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]
        const response = await axios.get(`${Labbaseurl}sample_collector_location/`, {
          params: { date: currentDate },
        })

        if (response.data && Array.isArray(response.data)) {
          const active = response.data.filter(
            (collector) =>
              collector.latitudeStart &&
              !collector.latitudeEnd &&
              collector.currentLatitude &&
              collector.currentLongitude,
          )
          setActiveCollectors(active)
        }
      } catch (error) {
        console.error("Error fetching active collectors:", error)
      }
    }

    fetchActiveCollectors()
    const interval = setInterval(fetchActiveCollectors, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleSave = () => {
    if (!selectedLabName || !selectedSampleCollector || !selectedTask) {
      setMessage("Please fill in all required fields.")
      setMessageType("danger")
      setTimeout(() => {
        setMessage("")
      }, 5000)
      return
    }

    const formattedDate = selectedDate.toISOString().split("T")[0]
    const payload = {
      labName: selectedLabName,
      salesMapping: salesperson,
      sampleCollector: selectedSampleCollector,
      date: formattedDate,
      sampleordertime: time,
      task: selectedTask,
    }

    if (Labbaseurl) {
      axios
        .post(`${Labbaseurl}save-logistic-data/`, payload)
        .then(() => {
          setMessage("Task assigned successfully!")
          setMessageType("success")
          setSelectedLabName("")
          setSalesperson("")
          setSelectedSampleCollector("")
          setSelectedTask("")
          fetchLogisticData()
          getfetchLogistic()
          setTimeout(() => {
            setMessage("")
          }, 5000)
        })
        .catch((error) => {
          console.error("Error saving data:", error)
          setMessage("Failed to assign task. Please try again.")
          setMessageType("danger")
          setTimeout(() => {
            setMessage("")
          }, 5000)
        })
    }
  }

  const filterTodayData = () => {
    const today = new Date().toISOString().split("T")[0]
    return logisticData.filter((data) => data.date === today)
  }

  const renderStatusBadge = (status) => {
    if (!status) return null

    const statusLower = status.toLowerCase()

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          padding: "0.375rem 0.75rem",
          fontSize: "0.75rem",
          fontWeight: "600",
          borderRadius: "9999px",
          backgroundColor:
            statusLower === "assigned"
              ? "#e0e7ff"
              : statusLower === "accepted"
                ? "#dcfce7"
                : statusLower === "picked"
                  ? "#cffafe"
                  : "#f3f4f6",
          color:
            statusLower === "assigned"
              ? "#4f46e5"
              : statusLower === "accepted"
                ? "#16a34a"
                : statusLower === "picked"
                  ? "#0891b2"
                  : "#6b7280",
        }}
      >
        {statusLower === "assigned" && <Clipboard size={14} />}
        {statusLower === "accepted" && <Check size={14} />}
        {statusLower === "picked" && <Truck size={14} />}
        {status}
      </span>
    )
  }

  const handleViewLocation = (collectorName, collectorData) => {
    setSelectedCollector(collectorName)
    setSelectedCollectorData(collectorData)
    setIsLocationModalOpen(true)
  }

  return (
    <PageContainer>
      <PageHeader>
        <Title>Enhanced Logistic Management Admin</Title>
        <Subtitle>Assign, track, and monitor sample collections with real-time location tracking</Subtitle>
      </PageHeader>

      <TimeDisplay>
        <Clock size={18} />
        {time}
      </TimeDisplay>

      {/* Live Tracking Dashboard */}
      {activeCollectors.length > 0 && (
        <LiveTrackingCard>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Navigation size={20} />
            Live Tracking Dashboard ({activeCollectors.length} Active)
          </h3>
          <ActiveCollectorGrid>
            {activeCollectors.map((collector, index) => (
              <CollectorCard key={index}>
                <CollectorName>
                  <MapPin size={16} />
                  {collector.sampleCollector}
                </CollectorName>
                <CollectorStats>
                  <span>
                    <Timer size={12} style={{ marginRight: "0.25rem" }} />
                    Started: {new Date(collector.startTime).toLocaleTimeString()}
                  </span>
                  <span>
                    <Route size={12} style={{ marginRight: "0.25rem" }} />
                    {collector.distance_travelled
                      ? `${Number.parseFloat(collector.distance_travelled).toFixed(2)}m`
                      : "0m"}
                  </span>
                </CollectorStats>
                <ViewLocationButton
                  onClick={() => handleViewLocation(collector.sampleCollector, collector)}
                  style={{ marginTop: "0.5rem", width: "100%", justifyContent: "center" }}
                >
                  <MapIcon size={14} />
                  View Live Location
                </ViewLocationButton>
              </CollectorCard>
            ))}
          </ActiveCollectorGrid>
        </LiveTrackingCard>
      )}

      {message && (
        <div
          style={{
            padding: "1rem",
            borderRadius: "0.75rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontWeight: "500",
            backgroundColor: messageType === "success" ? "#ecfdf5" : "#fef2f2",
            color: messageType === "success" ? "#065f46" : "#991b1b",
            borderLeft: `4px solid ${messageType === "success" ? "#10b981" : "#ef4444"}`,
          }}
        >
          {messageType === "success" ? <Check size={20} /> : <X size={20} />}
          {message}
        </div>
      )}

      <Card>
        <Label style={{ textAlign: "center", display: "block", marginBottom: "1rem" }}>
          <Calendar size={18} />
          Select Assignment Date
        </Label>

        <div style={{ maxWidth: "250px", margin: "0 auto 2rem auto" }}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd-MM-yyyy"
            style={{
              height: "48px",
              width: "100%",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "0 1rem",
              fontSize: "0.9375rem",
              color: "#334155",
              backgroundColor: "#f8fafc",
            }}
          />
        </div>

        <FormGrid>
          <FormGroup>
            <Label>
              <FileText size={16} />
              Lab Name
            </Label>
            <Select value={selectedLabName} onChange={handleLabNameChange}>
              <option value="">Select Lab Name</option>
              {clinicalNames.map((lab) => (
                <option key={lab.clinicalname} value={lab.clinicalname}>
                  {lab.clinicalname}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              <User size={16} />
              Salesperson
            </Label>
            <Input type="text" placeholder="Salesperson" value={salesperson} readOnly />
          </FormGroup>

          <FormGroup>
            <Label>
              <Truck size={16} />
              Sample Collector
            </Label>
            <Select value={selectedSampleCollector} onChange={(e) => setSelectedSampleCollector(e.target.value)}>
              <option value="">Select Sample Collector</option>
              {sampleCollectorOptions.map((collector) => (
                <option key={collector.id} value={collector.name}>
                  {collector.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              <Clipboard size={16} />
              Task
            </Label>
            <Select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
              <option value="">Select Task</option>
              <option value="assigned">Assigned</option>
            </Select>
          </FormGroup>
        </FormGrid>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleSave}>
            Assign Task
            <ChevronRight size={18} />
          </Button>
        </div>
      </Card>

      <EnhancedLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => {
          setIsLocationModalOpen(false)
          setSelectedCollector(null)
          setSelectedCollectorData(null)
        }}
        collectorName={selectedCollector}
        collectorData={selectedCollectorData}
      />

      <SectionTitle>All Logistic Data</SectionTitle>
      <TableContainer>
        <TableHeader>
          <FileText size={20} color="#6366f1" />
          <TableTitle>Complete Logistics History</TableTitle>
        </TableHeader>
        {filterTodayData().length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Lab Name</Th>
                <Th>Salesperson</Th>
                <Th>Sample Collector</Th>
                <Th>Order Time</Th>
                <Th>Status</Th>
                <Th>Accepted Time</Th>
                <Th>Picked Up Time</Th>
                <Th>Remarks</Th>
                <Th>Live Tracking</Th>
              </tr>
            </thead>
            <tbody>
              {filterTodayData().map((data, index) => (
                <Tr key={index}>
                  <Td>{formatDate(data.date)}</Td>
                  <Td>{data.lab_name}</Td>
                  <Td>{data.salesMapping}</Td>
                  <Td>{data.sampleCollector}</Td>
                  <Td>{data.sampleordertime}</Td>
                  <Td>{renderStatusBadge(data.task)}</Td>
                  <Td>{data.sampleacceptedtime || "—"}</Td>
                  <Td>{data.samplepickeduptime || "—"}</Td>
                  <Td>
                    {data.remarks ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <MessageSquare size={14} />
                        {data.remarks}
                      </div>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td>
                    <ViewLocationButton onClick={() => handleViewLocation(data.sampleCollector, data)}>
                      <MapIcon size={14} />
                      View Map
                    </ViewLocationButton>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>
            No logistics data available for today. Task history will appear here once tasks are assigned.
          </EmptyState>
        )}
      </TableContainer>
    </PageContainer>
  )
}

export default LogisticManagementAdmin
