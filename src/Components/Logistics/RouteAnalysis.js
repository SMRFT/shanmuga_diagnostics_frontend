import { useState, useEffect, useRef } from "react"
import Select from "react-select"
import styled from "styled-components"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  FaRoute,
  FaPlay,
  FaStop,
  FaCamera,
  FaUpload,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaTruck,
} from "react-icons/fa"
import apiRequest from "../Auth/apiRequest"

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.05), rgba(102, 126, 234, 0.05));

  @media (max-width: 768px) {
    padding: 12px;
  }
`

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 30px;
  max-width: 800px;
  margin: 0 auto 20px;

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 15px;
  }
`

const StyledTitle = styled.h2`
  background: linear-gradient(135deg, #f093fb, #667eea, #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 25px;
  font-size: 2.2rem;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  label {
    margin-bottom: 8px;
    font-weight: 600;
    color: #4c51bf;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '46px',
    borderRadius: '10px',
    borderWidth: '2px',
    borderColor: state.isFocused ? '#667eea' : '#e1e8ff',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '14px',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#667eea'
      : state.isFocused
      ? 'rgba(102, 126, 234, 0.1)'
      : 'white',
    color: state.isSelected ? 'white' : '#2d3748',
    cursor: 'pointer',
  }),
}

const ActionButton = styled.button`
  background: ${(props) =>
    props.disabled
      ? "linear-gradient(135deg, #cbd5e0, #a0aec0)"
      : props.variant === "stop"
      ? "linear-gradient(135deg, #fc8181, #e53e3e)"
      : "linear-gradient(135deg, #f093fb, #667eea, #764ba2)"};
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 14px 30px;
  border: none;
  border-radius: 25px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
  }
`

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  background: rgba(102, 126, 234, 0.07);
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #4c51bf;
  font-weight: 600;

  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`

const VisitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const VisitCard = styled.div`
  border: 2px solid ${(props) => (props.visited ? "#9ae6b4" : "#e1e8ff")};
  background: ${(props) => (props.visited ? "rgba(154, 230, 180, 0.1)" : "rgba(255,255,255,0.9)")};
  border-radius: 14px;
  padding: 16px 18px;
  transition: all 0.2s ease;
`

const VisitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`

const ClinicName = styled.div`
  font-weight: 600;
  color: #2d3748;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  small {
    font-weight: 500;
    color: #a0aec0;
    font-size: 12px;
  }
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #4c51bf;
  cursor: pointer;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #667eea;
    cursor: pointer;
  }
`

const UploadArea = styled.div`
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`

const SmallButton = styled.button`
  background: rgba(102, 126, 234, 0.1);
  color: #4c51bf;
  border: 2px solid #e1e8ff;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const VisitMeta = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #718096;
  display: flex;
  flex-direction: column;
  gap: 4px;

  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`

const ThumbPreview = styled.img`
  margin-top: 10px;
  width: 100%;
  max-width: 220px;
  border-radius: 10px;
  border: 2px solid #e1e8ff;
`

const HiddenInput = styled.input`
  display: none;
`

const EmptyState = styled.p`
  text-align: center;
  color: #718096;
  font-size: 14px;
  padding: 20px 0;
`

// Reads the browser's current location as a promise.
const getCurrentLocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ latitude: null, longitude: null })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => resolve({ latitude: null, longitude: null }),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })

const RouteAnalysis = () => {
  const [routes, setRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [analysis, setAnalysis] = useState(null) // current RouteAnalysis row (route + logistics_mapping + visits[])
  const [loadingRoutes, setLoadingRoutes] = useState(false)
  const [starting, setStarting] = useState(false)
  const [ending, setEnding] = useState(false)
  const [uploadingCode, setUploadingCode] = useState(null) // referrerCode currently uploading
  const [activeCode, setActiveCode] = useState(null) // referrerCode whose upload controls are open

  const cameraInputRef = useRef(null)
  const uploadInputRef = useRef(null)

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  useEffect(() => {
    fetchRoutes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchRoutes = async () => {
    setLoadingRoutes(true)
    try {
      const res = await apiRequest(`${Labbaseurl}routesetup/`, "GET")
      const list = res?.data || res || []
      setRoutes(
        list.map((r) => ({
          label: r.route_name,
          value: r.id,
        }))
      )
    } catch (error) {
      console.error("Error fetching routes:", error.message)
      toast.error("Error loading routes")
    } finally {
      setLoadingRoutes(false)
    }
  }

  const handleStart = async () => {
    if (!selectedRoute) {
      toast.error("Please select a route first")
      return
    }
    setStarting(true)
    try {
      const res = await apiRequest(`${Labbaseurl}route-analysis/start/`, "POST", {
        route_id: selectedRoute.value,
      })
      const data = res?.data || res
      setAnalysis(data)
      toast.success("Route started!")
    } catch (error) {
      console.error("Error starting route:", error.message)
      toast.error(error.message || "Failed to start route")
    } finally {
      setStarting(false)
    }
  }

  const handleEnd = async () => {
    if (!analysis) return
    setEnding(true)
    try {
      const res = await apiRequest(`${Labbaseurl}route-analysis/end/`, "POST", {
        analysis_id: analysis.id,
      })
      const data = res?.data || res
      setAnalysis(data)
      toast.success("Route ended!")
    } catch (error) {
      console.error("Error ending route:", error.message)
      toast.error(error.message || "Failed to end route")
    } finally {
      setEnding(false)
    }
  }

  // Toggling the checkbox just reveals/hides the camera+upload controls;
  // the clinic is only marked visited=true once an image is uploaded.
  const handleVisitedToggle = (referrerCode, checked) => {
    setActiveCode(checked ? referrerCode : null)
  }

  const triggerCamera = (referrerCode) => {
    setActiveCode(referrerCode)
    cameraInputRef.current.click()
  }

  const triggerUpload = (referrerCode) => {
    setActiveCode(referrerCode)
    uploadInputRef.current.click()
  }

  const handleFileSelected = async (e) => {
    const file = e.target.files[0]
    e.target.value = "" // allow re-selecting the same file later
    if (!file || !activeCode) return

    setUploadingCode(activeCode)
    try {
      const { latitude, longitude } = await getCurrentLocation()

      const payload = new FormData()
      payload.append("analysis_id", analysis.id)
      payload.append("referrerCode", activeCode)
      payload.append("image", file)
      if (latitude !== null) payload.append("latitude", latitude)
      if (longitude !== null) payload.append("longitude", longitude)

      const res = await apiRequest(
        `${Labbaseurl}route-analysis/mark/`,
        "POST",
        payload,
        true // tell apiRequest this is multipart/form-data, adjust to your helper's signature
      )
      const updated = res?.data || res
      setAnalysis(updated)
      toast.success("Visit confirmed and photo uploaded!")
    } catch (error) {
      console.error("Error uploading visit photo:", error.message)
      toast.error(error.message || "Failed to upload photo")
    } finally {
      setUploadingCode(null)
    }
  }

  const isActive = analysis && analysis.status === "in_progress"

  return (
    <PageContainer>
      <Card>
        <StyledTitle>Route Analysis</StyledTitle>

        <FormGroup>
          <label>
            <FaRoute />
            Select Route
          </label>
          <Select
            options={routes}
            isLoading={loadingRoutes}
            isSearchable
            isDisabled={!!analysis && isActive}
            placeholder="Search and select a route"
            styles={selectStyles}
            value={selectedRoute}
            onChange={setSelectedRoute}
          />
        </FormGroup>

        {!analysis && (
          <ActionButton onClick={handleStart} disabled={starting || !selectedRoute}>
            <FaPlay />
            {starting ? "Starting..." : "Start"}
          </ActionButton>
        )}

        {analysis && (
          <>
            <StatusBar>
              <span>
                <FaClock />
                Started: {analysis.start_time ? new Date(analysis.start_time).toLocaleString() : "-"}
              </span>
              <span>
                <FaTruck />
                Collector: {analysis.logistics_mapping}
              </span>
              <span>
                <FaCheckCircle />
                Status: {analysis.status === "in_progress" ? "In Progress" : "Completed"}
              </span>
              {analysis.end_time && (
                <span>
                  <FaClock />
                  Ended: {new Date(analysis.end_time).toLocaleString()}
                </span>
              )}
            </StatusBar>

            <VisitList>
              {analysis.visits && analysis.visits.length > 0 ? (
                analysis.visits.map((visit) => (
                  <VisitCard key={visit.referrerCode} visited={visit.visited}>
                    <VisitHeader>
                      <ClinicName>
                        {visit.clinicalname || visit.referrerCode}
                        <small>{visit.referrerCode}</small>
                      </ClinicName>
                      <CheckboxLabel>
                        <input
                          type="checkbox"
                          checked={visit.visited || activeCode === visit.referrerCode}
                          disabled={visit.visited || !isActive}
                          onChange={(e) => handleVisitedToggle(visit.referrerCode, e.target.checked)}
                        />
                        Visited
                      </CheckboxLabel>
                    </VisitHeader>

                    {!visit.visited && activeCode === visit.referrerCode && isActive && (
                      <UploadArea>
                        <SmallButton
                          type="button"
                          disabled={uploadingCode === visit.referrerCode}
                          onClick={() => triggerCamera(visit.referrerCode)}
                        >
                          <FaCamera />
                          {uploadingCode === visit.referrerCode ? "Uploading..." : "Take Photo"}
                        </SmallButton>
                        <SmallButton
                          type="button"
                          disabled={uploadingCode === visit.referrerCode}
                          onClick={() => triggerUpload(visit.referrerCode)}
                        >
                          <FaUpload />
                          {uploadingCode === visit.referrerCode ? "Uploading..." : "Upload"}
                        </SmallButton>
                      </UploadArea>
                    )}

                    {visit.visited && (
                      <>
                        {visit.image && <ThumbPreview src={visit.image} alt={visit.clinicalname} />}
                        <VisitMeta>
                          {visit.uploaded_at && (
                            <span>
                              <FaClock />
                              Uploaded: {new Date(visit.uploaded_at).toLocaleString()}
                            </span>
                          )}
                          {visit.latitude && visit.longitude && (
                            <span>
                              <FaMapMarkerAlt />
                              {visit.latitude}, {visit.longitude}
                            </span>
                          )}
                        </VisitMeta>
                      </>
                    )}
                  </VisitCard>
                ))
              ) : (
                <EmptyState>No clinical names found for this route.</EmptyState>
              )}
            </VisitList>

            {isActive && (
              <div style={{ marginTop: "24px" }}>
                <ActionButton variant="stop" onClick={handleEnd} disabled={ending}>
                  <FaStop />
                  {ending ? "Ending..." : "End"}
                </ActionButton>
              </div>
            )}
          </>
        )}

        {/* Hidden inputs driving the camera capture / gallery upload buttons */}
        <HiddenInput
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelected}
        />
        <HiddenInput
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelected}
        />
      </Card>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </PageContainer>
  )
}

export default RouteAnalysis