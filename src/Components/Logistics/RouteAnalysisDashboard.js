import React, { useState, useEffect, useMemo } from "react"
import Select from "react-select"
import styled from "styled-components"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import * as XLSX from "xlsx"
import {
  FaCalendarAlt,
  FaUserTie,
  FaRoute,
  FaCheckCircle,
  FaFlask,
  FaImages,
  FaFileExcel,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa"
import apiRequest from "../Auth/apiRequest"

// ─── Styled Components ────────────────────────────────────────────────────────
const PageContainer = styled.div`
  min-height: 100vh;
  padding: 24px 16px;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #f5f7ff 0%, #ede9fe 100%);
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  
  h3 {
    margin-top: 16px;
    margin-bottom: 8px;
    color: #2d3748;
    font-size: 1.1rem;
    border-bottom: 2px solid #edf2f7;
    padding-bottom: 4px;
  }
  
  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: #e2e8f0;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    
    &:hover {
      background: #cbd5e0;
    }
  }
`

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  h2 {
    background: linear-gradient(135deg, #f093fb, #667eea, #764ba2);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
  }
`

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.08);
  align-items: flex-end;
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 180px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #4c51bf;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`

const ExportBtn = styled.button`
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(56, 161, 105, 0.3);
  }
  
  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`

const SummaryCard = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
  border-left: 5px solid ${({ color }) => color || "#667eea"};

  .icon {
    font-size: 28px;
    color: ${({ color }) => color || "#667eea"};
    margin-bottom: 12px;
  }

  .value {
    font-size: 32px;
    font-weight: 700;
    color: #2d3748;
    line-height: 1.2;
  }

  .label {
    font-size: 14px;
    color: #718096;
    font-weight: 500;
    margin-top: 4px;
  }
`

const TableCard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.1);
  overflow: hidden;
  padding: 24px;
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid rgba(102, 126, 234, 0.08);
  }

  th {
    background: rgba(102, 126, 234, 0.05);
    color: #4c51bf;
    font-weight: 600;
    font-size: 13px;
    white-space: nowrap;
  }

  tr:hover td {
    background: rgba(102, 126, 234, 0.02);
  }

  td {
    font-size: 13px;
    color: #4a5568;
    vertical-align: middle;
  }

  .date-col {
    text-align: center;
    width: 60px;
  }

  .y-badge {
    color: #38a169;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .n-badge {
    color: #e53e3e;
    font-weight: bold;
  }
`

const RouteCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08);
  margin-bottom: 24px;
  overflow: hidden;
  border: 1px solid rgba(102, 126, 234, 0.12);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 6px 24px rgba(102, 126, 234, 0.12);
  }
`

const RouteCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: linear-gradient(135deg, #f8faff 0%, #eef2ff 100%);
  border-bottom: 1px solid rgba(102, 126, 234, 0.12);
  flex-wrap: wrap;
  gap: 12px;
`

const RouteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  .route-icon {
    color: #667eea;
    font-size: 18px;
  }

  .route-name {
    font-weight: 700;
    font-size: 16px;
    color: #2d3748;
  }

  .collector-badge {
    color: #4a5568;
    font-size: 13px;
    font-weight: 500;
    background: rgba(102, 126, 234, 0.08);
    padding: 3px 10px;
    border-radius: 20px;
  }

  .labs-badge {
    background: #ede9fe;
    color: #6d28d9;
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 12px;
  }
`

const ScrollButtonsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  .scroll-hint {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
    margin-right: 4px;
  }
`

const ScrollBtn = styled.button`
  background: #ffffff;
  border: 1px solid #c7d2fe;
  color: #4f46e5;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  &:hover {
    background: #4f46e5;
    color: #ffffff;
    border-color: #4f46e5;
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(79, 70, 229, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`

const RouteScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  position: relative;
  
  /* Prominent & clean custom horizontal scrollbar */
  &::-webkit-scrollbar {
    height: 9px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  &::-webkit-scrollbar-thumb {
    background: #a5b4fc;
    border-radius: 6px;
    border: 2px solid #f1f5f9;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #6366f1;
  }
`

const StickyHeaderCell = styled.th`
  position: sticky !important;
  left: 0 !important;
  z-index: 10;
  background: #f8faff !important;
  min-width: 240px;
  max-width: 300px;
  box-shadow: 3px 0 6px -2px rgba(0, 0, 0, 0.08);
`

const StickyBodyCell = styled.td`
  position: sticky !important;
  left: 0 !important;
  z-index: 5;
  background: #ffffff !important;
  min-width: 240px;
  max-width: 300px;
  box-shadow: 3px 0 6px -2px rgba(0, 0, 0, 0.08);

  tr:hover & {
    background: #f8faff !important;
  }
`

const selectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: '8px',
    borderColor: '#e1e8ff',
    minHeight: '40px',
  }),
}

const PhotoLink = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  padding: 0;
  margin-left: 6px;
  display: inline-flex;
  align-items: center;
  
  &:hover {
    color: #4c51bf;
  }
`

// ─── Component ────────────────────────────────────────────────────────────────
const RouteAnalysisDashboard = () => {
  const todayDate = new Date().toISOString().split("T")[0]

  const userRole = localStorage.getItem("role") || ""
  const isSampleCollector = userRole === "Sample Collector"
  const userEmployeeId = localStorage.getItem("employeeId") || localStorage.getItem("employee_id") || ""
  const userName = localStorage.getItem("name") || ""
  
  const [fromDate, setFromDate] = useState(todayDate)
  const [toDate, setToDate] = useState(todayDate)
  const [selectedCollector, setSelectedCollector] = useState(() => {
    if (isSampleCollector) {
      return {
        label: userName || userEmployeeId || "My Routes",
        value: userEmployeeId || userName
      }
    }
    return null
  })
  
  const [reportData, setReportData] = useState(null)
  const [collectorOptions, setCollectorOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisit, setModalVisit] = useState(null)

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  useEffect(() => {
    fetchCollectors()
  }, [])

  useEffect(() => {
    if (fromDate && toDate) {
      fetchReport()
    }
  }, [fromDate, toDate, selectedCollector])

  const fetchCollectors = async () => {
    try {
      const res = await apiRequest(`${Labbaseurl}sample-collector/`, "GET")
      const list = res?.data || res || []
      const opts = list.map(c => ({
        label: c.employeeName || c.name || c,
        value: c.employeeId || c.employeeName || c
      }))
      setCollectorOptions(opts)

      if (isSampleCollector) {
        const myCollector = opts.find(c =>
          (userEmployeeId && c.value?.toString().toLowerCase() === userEmployeeId.toString().toLowerCase()) ||
          (userName && c.label?.toString().toLowerCase().includes(userName.toString().toLowerCase())) ||
          (userName && c.value?.toString().toLowerCase().includes(userName.toString().toLowerCase()))
        )
        if (myCollector) {
          setSelectedCollector(myCollector)
        }
      }
    } catch (err) {
      console.error("Error fetching collectors:", err)
    }
  }

  const fetchReport = async () => {
    setLoading(true)
    try {
      let url = `${Labbaseurl}route-analysis/admin-report/?from_date=${fromDate}&to_date=${toDate}`
      const collectorParam = isSampleCollector
        ? (selectedCollector?.value || userEmployeeId || userName)
        : selectedCollector?.value

      if (collectorParam) {
        url += `&collector_id=${encodeURIComponent(collectorParam)}`
      }
      
      const res = await apiRequest(url, "GET")
      setReportData(res?.data || res)
    } catch (err) {
      console.error("Error fetching report:", err)
      toast.error("Failed to load report data")
    } finally {
      setLoading(false)
    }
  }

  const handleExportExcel = () => {
    if (!reportData || routes.length === 0) return;
    
    const dates = reportData.dates || [];
    
    // Prepare rows for Excel
    const excelRows = [];
    
    routes.forEach(route => {
      route.labs.forEach((lab, index) => {
        const row = {
          "Route Name": index === 0 ? route.route_name : "",
          "Sample Collector": index === 0 ? route.collector_name : "",
          "Lab Code": lab.referrerCode,
          "Lab Name": lab.clinicalname,
        };
        
        // Add date columns
        dates.forEach(d => {
          const visit = lab.visits[d];
          row[d] = visit?.visited ? "Y" : "N";
        });
        
        row["Total Visits"] = lab.total_visits;
        excelRows.push(row);
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Route Analysis");
    
    const fileName = `Route_Analysis_Report_${fromDate}_to_${toDate}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  const openImage = (imageId) => {
    window.open(`${Labbaseurl}route-analysis/image/${imageId}/`, "_blank")
  }

  const openModal = (visit) => {
    setModalVisit(visit)
  }

  const closeModal = () => {
    setModalVisit(null)
  }

  const scrollRoute = (routeId, offset) => {
    const el = document.getElementById(`route-scroll-${routeId}`)
    if (el) {
      el.scrollBy({ left: offset, behavior: "smooth" })
    }
  }

  const routes = useMemo(() => {
    const rawRoutes = reportData?.routes || []
    if (!isSampleCollector) return rawRoutes

    return rawRoutes.filter(route => {
      const cId = (route.collector_id || "").toString().toLowerCase()
      const cName = (route.collector_name || "").toString().toLowerCase()
      const myId = (userEmployeeId || "").toString().toLowerCase()
      const myName = (userName || "").toString().toLowerCase()
      const selectedVal = (selectedCollector?.value || "").toString().toLowerCase()

      return (
        (myId && cId === myId) ||
        (selectedVal && cId === selectedVal) ||
        (myName && (cName.includes(myName) || myName.includes(cName))) ||
        (cId && (cId.includes(myName) || myName.includes(cId)))
      )
    })
  }, [reportData, isSampleCollector, userEmployeeId, userName, selectedCollector])

  const summary = useMemo(() => {
    if (!isSampleCollector) {
      return reportData?.summary || {
        total_routes: 0,
        total_labs: 0, 
        visited_labs: 0
      }
    }
    const dates = reportData?.dates || []
    let total_labs = 0
    let visited_labs = 0
    routes.forEach(r => {
      total_labs += (r.labs?.length || 0) * dates.length
      r.labs?.forEach(lab => {
        visited_labs += lab.total_visits || 0
      })
    })
    return {
      total_routes: routes.length,
      total_labs,
      visited_labs
    }
  }, [reportData, routes, isSampleCollector])

  const dates = reportData?.dates || []

  return (
    <PageContainer>
      <DashboardHeader>
        <h2>Route Analysis Dashboard</h2>
        
        <FiltersContainer>
          <FilterGroup>
            <label><FaCalendarAlt /> From Date</label>
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)} max={toDate || new Date().toISOString().split("T")[0]}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #e1e8ff",
                fontFamily: "'Poppins', sans-serif",
              }}
            />
          </FilterGroup>

          <FilterGroup>
            <label><FaCalendarAlt /> To Date</label>
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)} min={fromDate} max={new Date().toISOString().split("T")[0]}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #e1e8ff",
                fontFamily: "'Poppins', sans-serif",
              }}
            />
          </FilterGroup>
          
          <FilterGroup>
            <label><FaUserTie /> Sample Collector {isSampleCollector ? "" : "(Optional)"}</label>
            {isSampleCollector ? (
              <div
                style={{
                  height: "40px",
                  padding: "0 14px",
                  border: "1.5px solid #c7d2fe",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#4338ca",
                  background: "#f5f7ff",
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedCollector?.label || userName || userEmployeeId || "My Routes"}
              </div>
            ) : (
              <Select 
                options={collectorOptions}
                value={selectedCollector}
                onChange={setSelectedCollector}
                isClearable
                placeholder="All Collectors"
                styles={selectStyles}
              />
            )}
          </FilterGroup>

          <ExportBtn 
            onClick={handleExportExcel} 
            disabled={!reportData || routes.length === 0}
          >
            <FaFileExcel /> Export to Excel
          </ExportBtn>
        </FiltersContainer>
      </DashboardHeader>

      {loading ? (
        <TableCard>
          <div style={{ textAlign: "center", padding: "40px", color: "#667eea", fontWeight: 600 }}>
            Loading route analysis data...
          </div>
        </TableCard>
      ) : routes.length === 0 ? (
        <TableCard>
          <div style={{ textAlign: "center", padding: "40px", color: "#a0aec0" }}>
            No routes found for this selection.
          </div>
        </TableCard>
      ) : (
        routes.map((route) => (
          <RouteCard key={route.route_id}>
            <RouteCardHeader>
              <RouteInfo>
                <FaRoute className="route-icon" />
                <span className="route-name">{route.route_name}</span>
                <span className="collector-badge">({route.collector_name})</span>
                <span className="labs-badge">{route.labs.length} Labs</span>
              </RouteInfo>
              <ScrollButtonsGroup>
                <span className="scroll-hint">Scroll:</span>
                <ScrollBtn
                  type="button"
                  onClick={() => scrollRoute(route.route_id, -300)}
                  title="Scroll Left"
                >
                  <FaChevronLeft size={13} />
                </ScrollBtn>
                <ScrollBtn
                  type="button"
                  onClick={() => scrollRoute(route.route_id, 300)}
                  title="Scroll Right"
                >
                  <FaChevronRight size={13} />
                </ScrollBtn>
              </ScrollButtonsGroup>
            </RouteCardHeader>

            <RouteScrollWrapper id={`route-scroll-${route.route_id}`}>
              <StyledTable>
                <thead>
                  <tr>
                    <StickyHeaderCell>Lab Name</StickyHeaderCell>
                    {dates.map((d) => (
                      <th key={d} className="date-col">
                        {new Date(d).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </th>
                    ))}
                    <th style={{ textAlign: "center", minWidth: "90px" }}>Total Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {route.labs.map((lab, i) => (
                    <tr key={i}>
                      <StickyBodyCell>
                        <span style={{ fontWeight: 600 }}>
                          {lab.clinicalname || lab.referrerCode}
                        </span>
                        {lab.referrerCode && lab.referrerCode !== lab.clinicalname && (
                          <span
                            style={{
                              color: "#a0aec0",
                              fontSize: "11px",
                              marginLeft: "6px",
                            }}
                          >
                            ({lab.referrerCode})
                          </span>
                        )}
                      </StickyBodyCell>

                      {dates.map((d) => {
                        const visit = lab.visits[d]
                        return (
                          <td key={d} className="date-col">
                            {visit?.visited ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <span className="y-badge">
                                  Y
                                  <PhotoLink
                                    onClick={() =>
                                      openModal({
                                        ...visit,
                                        clinicalname: lab.clinicalname,
                                      })
                                    }
                                    title="View Details"
                                  >
                                    <FaCheckCircle
                                      size={12}
                                      style={{ marginLeft: "4px" }}
                                    />
                                  </PhotoLink>
                                </span>
                              </div>
                            ) : (
                              <span className="n-badge">N</span>
                            )}
                          </td>
                        )
                      })}

                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {lab.total_visits}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </RouteScrollWrapper>
          </RouteCard>
        ))
      )}

      {modalVisit && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>×</button>
            <h2 style={{marginTop: 0, color: "#4c51bf"}}>Visit Details</h2>
            
            {modalVisit.visited_at && (
              <>
                <h3>Uploaded Time</h3>
                <p style={{marginBottom: "16px"}}>{new Date(modalVisit.visited_at).toLocaleString()}</p>
              </>
            )}

            {modalVisit.image_id && (
              <>
                <h3>Uploaded image</h3>
                <img 
                  src={`${Labbaseurl}route-analysis/image/${modalVisit.image_id}/`} 
                  alt="Visit" 
                  style={{width: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: "8px"}} 
                />
              </>
            )}

            {(modalVisit.latitude && modalVisit.longitude) && (
              <>
                <h3>Uploaded Location</h3>
                {modalVisit.clinicalname && (
                  <p style={{marginBottom: "12px", fontWeight: "600", color: "#4a5568"}}>
                    Lab Name: {modalVisit.clinicalname}
                  </p>
                )}
                <iframe
                  title="Location Map"
                  width="100%"
                  height="250"
                  frameBorder="0"
                  style={{ border: 0, borderRadius: "8px" }}
                  src={`https://maps.google.com/maps?q=${modalVisit.latitude},${modalVisit.longitude}%20(${encodeURIComponent(modalVisit.clinicalname || 'Location')})&hl=en&z=15&output=embed`}
                  allowFullScreen
                />
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      <ToastContainer position="top-right" />
    </PageContainer>
  )
}

export default RouteAnalysisDashboard
