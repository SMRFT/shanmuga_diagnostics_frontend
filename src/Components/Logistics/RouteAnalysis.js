import { useState, useEffect, useRef } from "react"
import Select from "react-select"
import styled, { keyframes, css } from "styled-components"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  FaRoute,
  FaPlay,
  FaStop,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaHospital,
  FaFlag,
  FaImage,
  FaLock,
} from "react-icons/fa"
import { MdAddAPhoto } from "react-icons/md"
import apiRequest from "../Auth/apiRequest"

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(102,126,234,0.4); }
  50%       { box-shadow: 0 0 0 8px rgba(102,126,234,0); }
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

// ─── Styled Components ────────────────────────────────────────────────────────
const PageContainer = styled.div`
  min-height: 100vh;
  padding: 24px 16px;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #f5f7ff 0%, #ede9fe 100%);
`

const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  max-width: 820px;
  margin: 0 auto 20px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.10);
  border: 1px solid rgba(102,126,234,0.08);
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: 600px) {
    padding: 18px 14px;
  }
`

const PageTitle = styled.h2`
  background: linear-gradient(135deg, #f093fb, #667eea, #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin: 0 0 24px;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;

  @media (max-width: 480px) { font-size: 1.5rem; }
`

const FormGroup = styled.div`
  margin-bottom: 18px;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #4c51bf;
    font-size: 13px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: state.isFocused ? "#667eea" : "#e1e8ff",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(102,126,234,0.15)" : "none",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 14,
    "&:hover": { borderColor: "#667eea" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#667eea"
      : state.isFocused
      ? "rgba(102,126,234,0.08)"
      : "#fff",
    color: state.isSelected ? "#fff" : state.isDisabled ? "#a0aec0" : "#2d3748",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 14,
  }),
  singleValue: (base) => ({ ...base, fontFamily: "'Poppins', sans-serif" }),
  placeholder: (base) => ({ ...base, color: "#a0aec0", fontFamily: "'Poppins', sans-serif" }),
}

const ActionButton = styled.button`
  background: ${({ disabled, variant }) =>
    disabled
      ? "linear-gradient(135deg, #e2e8f0, #cbd5e0)"
      : variant === "stop"
      ? "linear-gradient(135deg, #fc8181, #e53e3e)"
      : "linear-gradient(135deg, #f093fb, #667eea, #764ba2)"};
  color: ${({ disabled }) => (disabled ? "#718096" : "#fff")};
  font-size: 15px;
  font-weight: 700;
  padding: 13px 28px;
  border: none;
  border-radius: 50px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  ${({ variant, disabled }) =>
    !disabled && variant !== "stop"
      ? css`animation: ${pulse} 2s infinite;`
      : ""}

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
  }
`

const StatusBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background: linear-gradient(135deg, rgba(102,126,234,0.06), rgba(240,147,251,0.06));
  border: 1px solid rgba(102,126,234,0.12);
  border-radius: 14px;
  padding: 14px 18px;
  margin-bottom: 22px;
  font-size: 13px;
  color: #4c51bf;
  font-weight: 600;

  span {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #fff;
    border-radius: 30px;
    padding: 5px 12px;
    box-shadow: 0 2px 6px rgba(102,126,234,0.08);
  }
`

const ProgressBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #f093fb, #667eea);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 30px;
  margin-bottom: 16px;
`

const SectionLabel = styled.p`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #a0aec0;
  margin: 0 0 12px;
`

const PreviewClinics = styled.div`
  background: rgba(102,126,234,0.04);
  border: 1.5px dashed rgba(102,126,234,0.25);
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 18px;
  animation: ${fadeIn} 0.3s ease;
`

const PreviewClinicItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4a5568;
  padding: 5px 0;
  border-bottom: 1px solid rgba(102,126,234,0.08);
  font-weight: 500;

  &:last-child { border-bottom: none; }

  svg { color: #667eea; flex-shrink: 0; }
`

const VisitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const VisitCard = styled.div`
  border: 2px solid ${({ visited }) => (visited ? "#68d391" : "rgba(102,126,234,0.18)")};
  background: ${({ visited }) => (visited ? "rgba(154,230,180,0.08)" : "#fff")};
  border-radius: 16px;
  padding: 16px 18px;
  transition: all 0.2s ease;
  animation: ${fadeIn} 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(102,126,234,0.10);
  }
`

const VisitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`

const ClinicInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  .name {
    font-weight: 700;
    font-size: 15px;
    color: #2d3748;
  }

  .code {
    font-size: 11px;
    font-weight: 500;
    color: #a0aec0;
    letter-spacing: 0.4px;
  }
`

const VisitedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, #68d391, #38a169);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 30px;
`

const PhotoIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: ${({ uploading }) =>
    uploading
      ? "linear-gradient(135deg, #e2e8f0, #cbd5e0)"
      : "linear-gradient(135deg, #667eea, #764ba2)"};
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 700;
  cursor: ${({ uploading }) => (uploading ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  white-space: nowrap;

  svg {
    ${({ uploading }) =>
      uploading
        ? css`animation: ${spin} 0.8s linear infinite;`
        : ""}
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(102,126,234,0.4);
  }
`

const VisitMeta = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
  color: #718096;

  .meta-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`

const ThumbPreview = styled.img`
  margin-top: 12px;
  width: 100%;
  max-width: 200px;
  border-radius: 12px;
  border: 2px solid rgba(102,126,234,0.2);
  object-fit: cover;
  display: block;
`

const HiddenInput = styled.input`
  display: none;
`

const EmptyState = styled.div`
  text-align: center;
  color: #a0aec0;
  font-size: 14px;
  padding: 24px 0;

  svg {
    font-size: 32px;
    margin-bottom: 8px;
    color: #cbd5e0;
    display: block;
    margin: 0 auto 8px;
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(102,126,234,0.1);
  margin: 20px 0;
`

const StatusPill = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  background: ${({ status }) =>
    status === "completed"
      ? "rgba(56,161,105,0.15)"
      : status === "in_progress"
      ? "rgba(237,137,54,0.15)"
      : "transparent"};
  color: ${({ status }) =>
    status === "completed"
      ? "#38a169"
      : status === "in_progress"
      ? "#ed8936"
      : "transparent"};
  margin-left: 6px;
`

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getCurrentLocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) return resolve({ latitude: null, longitude: null })
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      () => resolve({ latitude: null, longitude: null }),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })

// ─── Component ────────────────────────────────────────────────────────────────
const RouteAnalysis = () => {
  const [routes, setRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [routeDetails, setRouteDetails] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loadingRoutes, setLoadingRoutes] = useState(false)
  const [starting, setStarting] = useState(false)
  const [ending, setEnding] = useState(false)
  const [uploadingCode, setUploadingCode] = useState(null)
  const [activeUploadCode, setActiveUploadCode] = useState(null)
  // map of route_id -> { status, analysis_id } for today
  const [todayStatusMap, setTodayStatusMap] = useState({})
  
  const todayDate = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayDate)

  const fileInputRef = useRef(null)

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  const role = localStorage.getItem("role")
  const employeeId = localStorage.getItem("employeeId")

  useEffect(() => {
    fetchRoutesAndStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  const fetchRoutesAndStatus = async () => {
    setLoadingRoutes(true)
    try {
      let routeParams = `?date=${selectedDate}&limit=500`
      if (employeeId) {
        routeParams += `&collector_id=${employeeId}`
      }

      // Fetch routes and analysis statuses in parallel for the selected date
      const [routeRes, statusRes] = await Promise.all([
        apiRequest(`${Labbaseurl}routesetup/${routeParams}`, "GET"),
        apiRequest(`${Labbaseurl}route-analysis/today-status/?date=${selectedDate}${employeeId ? `&collector_id=${employeeId}` : ""}`, "GET"),
      ])

      const list = routeRes?.data?.data || []

      // Build a map: route_id -> { status, analysis_id }
      const statuses = statusRes?.data?.route_statuses || []
      const statusMap = {}
      statuses.forEach((s) => {
        statusMap[s.route_id] = { status: s.status, analysis_id: s.analysis_id }
      })
      setTodayStatusMap(statusMap)

      setRoutes(
        list.map((r) => ({
          label: r.route_name,
          value: r.id,
          _raw: r,
          isDisabled: !!statusMap[r.id] && statusMap[r.id].status === "completed",
        }))
      )
    } catch (err) {
      console.error("Error fetching routes:", err.message)
      toast.error("Error loading routes")
    } finally {
      setLoadingRoutes(false)
    }
  }

  const handleRouteChange = async (option) => {
    setSelectedRoute(option)
    setRouteDetails(option?._raw || null)
    setAnalysis(null)

    if (!option) return

    // If this route already has an in_progress session today, load it automatically
    const existing = todayStatusMap[option.value]
    if (existing && existing.status === "in_progress") {
      try {
        const res = await apiRequest(
          `${Labbaseurl}route-analysis/active/${option.value}/`,
          "GET"
        )
        const data = res?.data?.data || null
        if (data) {
          setAnalysis(data)
          toast.info("Resumed existing in-progress session")
        }
      } catch (err) {
        console.error("Error resuming session:", err)
      }
    }
  }

  const handleStart = async () => {
    if (!selectedRoute) return toast.error("Please select a route first")
    setStarting(true)
    try {
      const res = await apiRequest(`${Labbaseurl}route-analysis/start/`, "POST", {
        route_id: selectedRoute.value,
      })
      const data = res?.data?.data || res?.data || res
      setAnalysis(data)
      // Refresh today's statuses so the dropdown reflects the new in_progress state
      await fetchRoutesAndStatus()
      toast.success("Route started!")
    } catch (err) {
      console.error("Error starting route:", err.message)
      toast.error(err.message || "Failed to start route")
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
      // Refresh today's statuses so the route is now marked completed/disabled
      await fetchRoutesAndStatus()
      toast.success("Route marked as completed!")
    } catch (err) {
      console.error("Error ending route:", err.message)
      toast.error(err.message || "Failed to end route")
    } finally {
      setEnding(false)
    }
  }

  const triggerPhotoInput = (referrerCode) => {
    setActiveUploadCode(referrerCode)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
      fileInputRef.current.click()
    }
  }

  // Upload image + mark visited — uses FormData with axios auto-detecting multipart
  const handleFileSelected = async (e) => {
    const file = e.target.files[0]
    e.target.value = ""
    if (!file || !activeUploadCode) return

    const codeToUpload = activeUploadCode
    setUploadingCode(codeToUpload)
    try {
      const { latitude, longitude } = await getCurrentLocation()

      const payload = new FormData()
      payload.append("analysis_id", analysis.id)
      payload.append("referrerCode", codeToUpload)
      payload.append("image", file)
      if (latitude !== null) payload.append("latitude", latitude)
      if (longitude !== null) payload.append("longitude", longitude)

      // Do NOT pass Content-Type header — let axios set it automatically for FormData
      // (it will set multipart/form-data with the correct boundary)
      const res = await apiRequest(
        `${Labbaseurl}route-analysis/mark/`,
        "PATCH",
        payload,
        { "Content-Type": undefined }   // override default JSON header → axios auto-detects FormData
      )

      if (!res.success) {
        throw new Error(res.error || "Upload failed")
      }

      const updated = res?.data || res
      setAnalysis(updated)
      toast.success("Visit confirmed & photo uploaded!")
    } catch (err) {
      console.error("Error uploading visit photo:", err.message)
      toast.error(err.message || "Failed to upload photo")
    } finally {
      setUploadingCode(null)
      setActiveUploadCode(null)
    }
  }

  const isActive = analysis?.status === "in_progress"
  const visits = (() => {
    const raw = analysis?.visits
    if (!raw) return []
    if (typeof raw === "string") {
      try { return JSON.parse(raw) } catch { return [] }
    }
    return raw
  })()
  const visitedCount = visits.filter((v) => v.visited).length
  const totalCount = visits.length

  // Clinical names preview from the selected route (before start)
  const previewClinics = routeDetails?.clinical_name_display || []

  return (
    <PageContainer>
      <Card>
        <PageTitle>🗺️ Route Analysis</PageTitle>

        {/* ── Date Selector ── */}
        <FormGroup>
          <label>
            <FaClock />
            Select Date
          </label>
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={isActive}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "12px",
              border: "2px solid #e1e8ff",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "14px",
              color: "#2d3748",
              outline: "none"
            }}
          />
        </FormGroup>

        {/* ── Route Selector ── */}
        <FormGroup>
          <label>
            <FaRoute />
            Select Route
          </label>
          <Select
            options={routes}
            isLoading={loadingRoutes}
            isSearchable
            isDisabled={isActive}
            placeholder="Search and select a route…"
            styles={selectStyles}
            value={selectedRoute}
            onChange={handleRouteChange}
            formatOptionLabel={(opt) => (
              <span>
                {opt.label}
                {todayStatusMap[opt.value]?.status === "completed" && (
                  <StatusPill status="completed">✓ Done Today</StatusPill>
                )}
                {todayStatusMap[opt.value]?.status === "in_progress" && (
                  <StatusPill status="in_progress">⚡ In Progress</StatusPill>
                )}
              </span>
            )}
          />
        </FormGroup>

        {/* ── Clinical Names Preview (before Start) ── */}
        {selectedRoute && !analysis && previewClinics.length > 0 && (
          <>
            <SectionLabel>
              Labs in this route ({previewClinics.length})
            </SectionLabel>
            <PreviewClinics>
              {previewClinics.map((c) => (
                <PreviewClinicItem key={c.referrerCode}>
                  <FaHospital size={11} />
                  <span>
                    <strong>{c.clinicalname || c.referrerCode}</strong>
                    &nbsp;
                    <span style={{ color: "#a0aec0", fontSize: 11 }}>({c.referrerCode})</span>
                  </span>
                </PreviewClinicItem>
              ))}
            </PreviewClinics>
          </>
        )}

        {/* ── Completed notice ── */}
        {selectedRoute && todayStatusMap[selectedRoute.value]?.status === "completed" && !analysis && (
          <div style={{
            background: "rgba(56,161,105,0.08)",
            border: "1.5px solid #68d391",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "#276749",
            fontWeight: 600,
          }}>
            <FaLock /> This route was already completed today and cannot be restarted.
          </div>
        )}

        {/* ── Start Button ── */}
        {!analysis && (
          <ActionButton
            onClick={handleStart}
            disabled={
              starting ||
              !selectedRoute ||
              todayStatusMap[selectedRoute?.value]?.status === "completed"
            }
          >
            <FaPlay />
            {starting ? "Starting…" : "Start Route"}
          </ActionButton>
        )}

        {/* ── Active / Completed Analysis ── */}
        {analysis && (
          <>
            {/* Status bar */}
            <StatusBar>
              <span>
                <FaClock />
                Started: {analysis.start_time ? new Date(analysis.start_time).toLocaleString() : "—"}
              </span>
              {analysis.logistics_mapping && (
                <span>
                  <FaTruck />
                  {analysis.logistics_mapping}
                </span>
              )}
              <span>
                <FaCheckCircle />
                {analysis.status === "in_progress" ? "In Progress" : "Completed"}
              </span>
              {analysis.end_time && (
                <span>
                  <FaFlag />
                  Ended: {new Date(analysis.end_time).toLocaleString()}
                </span>
              )}
            </StatusBar>

            {/* Progress badge */}
            {totalCount > 0 && (
              <ProgressBadge>
                <FaCheckCircle />
                {visitedCount} / {totalCount} labs visited
              </ProgressBadge>
            )}

            <SectionLabel>Labs</SectionLabel>

            {/* Visit cards */}
            <VisitList>
              {visits.length > 0 ? (
                visits.map((visit) => (
                  <VisitCard key={visit.referrerCode} visited={visit.visited}>
                    <VisitHeader>
                      <ClinicInfo>
                        <span className="name">{visit.clinicalname || visit.referrerCode}</span>
                        <span className="code">{visit.referrerCode}</span>
                      </ClinicInfo>

                      {visit.visited ? (
                        <VisitedBadge>
                          <FaCheckCircle /> Visited
                        </VisitedBadge>
                      ) : isActive ? (
                        <PhotoIconButton
                          uploading={uploadingCode === visit.referrerCode ? 1 : 0}
                          disabled={uploadingCode === visit.referrerCode}
                          onClick={() => triggerPhotoInput(visit.referrerCode)}
                          title="Take photo or upload image to mark as visited"
                        >
                          <MdAddAPhoto size={17} />
                          {uploadingCode === visit.referrerCode ? "Uploading…" : "Photo & Visit"}
                        </PhotoIconButton>
                      ) : null}
                    </VisitHeader>

                    {/* Visited meta */}
                    {visit.visited && (
                      <VisitMeta>
                        {visit.image && (
                          <ThumbPreview
                            src={`${Labbaseurl}route-analysis/image/${visit.image}/`}
                            alt={visit.clinicalname}
                            onError={(e) => { e.target.style.display = "none" }}
                          />
                        )}
                        {visit.uploaded_at && (
                          <div className="meta-row">
                            <FaClock />
                            Visited at: {new Date(visit.uploaded_at).toLocaleString()}
                          </div>
                        )}
                        {visit.latitude && visit.longitude && (
                          <div className="meta-row">
                            <FaMapMarkerAlt />
                            {parseFloat(visit.latitude).toFixed(5)}, {parseFloat(visit.longitude).toFixed(5)}
                          </div>
                        )}
                        {!visit.image && (
                          <div className="meta-row" style={{ color: "#a0aec0" }}>
                            <FaImage />
                            No photo uploaded
                          </div>
                        )}
                      </VisitMeta>
                    )}
                  </VisitCard>
                ))
              ) : (
                <EmptyState>
                  <FaHospital />
                  No clinical names found for this route.
                </EmptyState>
              )}
            </VisitList>

            {/* End button */}
            {isActive && (
              <>
                <Divider />
                <ActionButton variant="stop" onClick={handleEnd} disabled={ending}>
                  <FaStop />
                  {ending ? "Ending…" : "End Route"}
                </ActionButton>
              </>
            )}
          </>
        )}

        {/* Single hidden file input */}
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelected}
        />
      </Card>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
      />
    </PageContainer>
  )
}

export default RouteAnalysis