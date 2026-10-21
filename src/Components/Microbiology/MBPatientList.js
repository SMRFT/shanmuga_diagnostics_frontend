import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import {
  Search,
  Calendar,
  Clock,
  Eye,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { format } from "date-fns";
import apiRequest from "../Auth/apiRequest";

// ===== Global styles =====
const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #4361ee;
    --primary-light: #4895ef;
    --primary-dark: #3a0ca3;
    --secondary: #3f37c9;
    --success: #4cc9f0;
    --danger: #f72585;
    --warning: #f8961e;
    --info: #90e0ef;
    --light: #f8f9fa;
    --dark: #212529;
    --gray: #6c757d;
    --gray-light: #e9ecef;
    --border-radius: 8px;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f7fb;
    color: var(--dark);
    line-height: 1.5;
  }
  
  /* DatePicker Styles */
  .react-datepicker-wrapper { 
    width: auto;
    display: inline-block;
  }
  
  .react-datepicker__input-container {
    display: inline-block;
  }
  
  .react-datepicker__input-container input {
    padding: 0.5rem 0.5rem;
    border: 1px solid var(--gray-light);
    border-radius: var(--border-radius);
    font-size: 0.765rem;
    background-color: white;
    cursor: pointer;
    transition: var(--transition);
    min-width: 100px;
    max-width: 110px;
    
    &:hover, &:focus { 
      border-color: var(--primary); 
      outline: none;
      box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
    }
  }
  
  .react-datepicker { 
    border: none; 
    box-shadow: var(--box-shadow); 
    font-family: inherit; 
    z-index: 1000 !important;
    border: 1px solid var(--gray-light);
  }
  
  .react-datepicker-popper { 
    z-index: 1000 !important; 
  }
  
  .react-datepicker__header { 
    background-color: var(--primary); 
    border-bottom: none; 
    padding-top: 0.8rem;
    border-radius: 0;
  }
  
  .react-datepicker__current-month, 
  .react-datepicker__day-name { 
    color: white; 
  }
  
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: var(--primary);
    &:hover { 
      background-color: var(--primary-dark); 
    }
  }
  
  .react-datepicker__day:hover {
    background-color: var(--gray-light);
  }
  
  .react-datepicker__day--disabled {
    color: var(--gray-light);
    cursor: not-allowed;
  }
  
  .react-datepicker__close-icon::after {
    background-color: var(--gray);
    font-size: 16px;
  }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

// ===== Layout components =====
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
`;

const SectionContainer = styled.div`
  margin-top: 1.5rem;
  &:first-of-type {
    margin-top: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: ${(props) => (props.backlog ? "#fffbeb" : "#f8f9fa")};
  border-bottom: 1px solid var(--gray-light);
  border-left: 4px solid
    ${(props) => (props.backlog ? "var(--warning)" : "var(--primary)")};
`;

const SectionTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => (props.backlog ? "#92400e" : "var(--primary-dark)")};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionSubtitle = styled.span`
  font-size: 0.8rem;
  color: var(--gray);
  font-weight: normal;
`;

const SectionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${(props) =>
    props.backlog ? "rgba(248, 150, 30, 0.15)" : "rgba(67, 97, 238, 0.1)"};
  color: ${(props) => (props.backlog ? "var(--warning)" : "var(--primary)")};
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
`;

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DatePickerLabel = styled.label`
  font-size: 0.875rem;
  color: var(--gray);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
`;

const BarcodeSearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  width: 320px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StepButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  background-color: white;
  color: var(--dark);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  user-select: none;
  flex-shrink: 0;

  &:hover {
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: var(--transition);
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
  pointer-events: none;
`;

const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  &:hover {
    background-color: var(--primary-dark);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3);
  }
`;

const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--gray);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  &:hover {
    background-color: var(--dark);
  }
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  background-color: white;
  cursor: pointer;
  transition: var(--transition);
  color: var(--dark);
  font-weight: 500;

  &:hover,
  &:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  max-height: 600px;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: var(--gray-light);
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--gray);
    border-radius: 20px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
`;

const TableHead = styled.thead`
  background-color: var(--gray-light);
  position: sticky;
  top: 0;
  z-index: 5;
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--gray);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--gray-light);
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: rgba(67, 97, 238, 0.05);
    }
  }
  td {
    padding: 1rem;
    vertical-align: middle;
    font-size: 0.875rem;
  }
`;

const NoData = styled.td`
  text-align: center;
  padding: 2rem !important;
  color: var(--gray);
  font-style: italic;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
`;

const WaitingBadge = styled(StatusBadge)`
  background-color: rgba(248, 150, 30, 0.15);
  color: var(--warning);
`;

const EmergencyBadge = styled(StatusBadge)`
  background-color: rgba(247, 37, 133, 0.2);
  color: var(--danger);
  animation: ${blink} 1.5s ease-in-out infinite;
  font-weight: 700;
  border: 1px solid var(--danger);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const NormalBadge = styled(StatusBadge)`
  background-color: rgba(76, 201, 240, 0.15);
  color: var(--success);
  font-weight: 600;
`;

const OutsourcedBadge = styled(StatusBadge)`
  background-color: rgba(246, 160, 233, 0.15);
  color: #d75de0ff;
  animation: ${blink} 1.5s ease-in-out infinite;
  font-weight: 600;
  border: 1px solid #d75de0ff;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  &:hover {
    background-color: var(--primary-dark);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3);
  }
`;

const ViewButton = styled(Button)`
  padding: 0.35rem 0.75rem;
  background-color: var(--primary-light);
  &:hover {
    background-color: var(--primary);
  }
`;

const TestList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TestItem = styled.li`
  white-space: nowrap;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid var(--gray-light);
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--gray-light);
  background-color: white;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  &:hover {
    background-color: var(--gray-light);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.div`
  margin: 0 1rem;
  font-size: 0.765rem;
  color: var(--gray);
`;

// ===== Helpers =====
const formatYmd = (d) => {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const parseYmd = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  date.setHours(0, 0, 0, 0);
  return isNaN(date.getTime()) ? null : date;
};

// ===== Component =====
function MBPatientList() {
  const navigate = useNavigate();
  const location = useLocation();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const initialFrom = useMemo(() => {
    try {
      return parseYmd(sessionStorage.getItem("patient_from")) || today;
    } catch {
      return today;
    }
  }, [today]);

  const initialTo = useMemo(() => {
    try {
      return parseYmd(sessionStorage.getItem("patient_to")) || today;
    } catch {
      return today;
    }
  }, [today]);

  const [fromDate, setFromDate] = useState(initialFrom);
  const [toDate, setToDate] = useState(initialTo);
  const [emergencyFilter, setEmergencyFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [currentDatePatients, setCurrentDatePatients] = useState([]);
  const [backlogPatients, setBacklogPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [backlogPage, setBacklogPage] = useState(1);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const handleBarcodeStep = (delta) => {
    setSearchQuery((prev) => {
      const match = prev.match(/^(.*?)(\d+)$/);
      if (match) {
        const prefix = match[1];
        const num = parseInt(match[2], 10);
        const padLength = match[2].length;
        const next = Math.max(0, num + delta);
        return prefix + String(next).padStart(padLength, "0");
      }
      return delta > 0 ? prev + "1" : prev;
    });
  };

  // Save filter state to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(
        "patient_from",
        fromDate ? formatYmd(fromDate) : "",
      );
      sessionStorage.setItem("patient_to", toDate ? formatYmd(toDate) : "");
    } catch (e) {
      console.error("Failed to save to sessionStorage:", e);
    }
  }, [fromDate, toDate]);

  // Handle barcode search from location state
  useEffect(() => {
    if (location.state?.barcode) {
      setSearchQuery(location.state.barcode);
      setCurrentPage(1);
      setBacklogPage(1);
    }
  }, [location.state]);

  const fetchPatientData = async (
    fromDateParam,
    toDateParam,
    emergency = "all",
  ) => {
    setLoading(true);
    setError(null);
    const queryParams = new URLSearchParams();
    if (fromDateParam)
      queryParams.append(
        "from_date",
        fromDateParam.toLocaleDateString("en-CA"),
      );
    if (toDateParam)
      queryParams.append("to_date", toDateParam.toLocaleDateString("en-CA"));
    if (emergency && emergency !== "all") {
      queryParams.append("emergency", emergency);
    }
    queryParams.append("scope", "split");

    const queryString = queryParams.toString();
    const url = `${Labbaseurl}mb-test-values/${queryString ? `?${queryString}` : ""}`;

    try {
      const patientResponse = await apiRequest(url, "GET");
      if (!patientResponse.success)
        throw new Error(
          patientResponse.error || "Failed to fetch patient data",
        );

      let currentData = [];
      let backlogData = [];

      let rawData = patientResponse.data;
      if (
        rawData &&
        rawData.data &&
        (rawData.data.selected_date !== undefined ||
          rawData.data.all_days !== undefined ||
          Array.isArray(rawData.data))
      ) {
        rawData = rawData.data;
      }

      if (
        rawData &&
        (rawData.selected_date !== undefined || rawData.all_days !== undefined)
      ) {
        currentData = rawData.selected_date || [];
        backlogData = rawData.all_days || [];
      } else if (Array.isArray(rawData)) {
        const fromStr = fromDateParam
          ? formatYmd(fromDateParam)
          : formatYmd(today);
        const toStr = toDateParam ? formatYmd(toDateParam) : formatYmd(today);
        rawData.forEach((p) => {
          let pDate = "";
          if (p.date) {
            try {
              pDate = formatYmd(new Date(p.date));
            } catch {
              pDate = String(p.date).slice(0, 10);
            }
          }
          if (pDate >= fromStr && pDate <= toStr) {
            currentData.push(p);
          } else {
            backlogData.push(p);
          }
        });
      }

      setCurrentDatePatients(currentData);
      setBacklogPatients(backlogData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setCurrentDatePatients([]);
      setBacklogPatients([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData(fromDate, toDate, emergencyFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = () => {
    fetchPatientData(fromDate, toDate, emergencyFilter);
    setCurrentPage(1);
    setBacklogPage(1);
  };

  const handleClearFilter = () => {
    setFromDate(today);
    setToDate(today);
    setSearchQuery("");
    setEmergencyFilter("all");
    setLocationFilter("all");
    try {
      sessionStorage.removeItem("patient_from");
      sessionStorage.removeItem("patient_to");
    } catch (e) {
      console.error(e);
    }
    fetchPatientData(today, today, "all");
    setCurrentPage(1);
    setBacklogPage(1);
  };

  const handleViewDetails = (patient) => {
    if (!patient || !patient.date) {
      console.error("Invalid patient data:", patient);
      return;
    }

    const date = new Date(patient.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    navigate(
      `/MBDoctorForm?patient_id=${patient.patient_id}&date=${formattedDate}`,
      {
        state: {
          patientHistory: patient.patient_history || "",
          patientData: {
            patient_id: patient.patient_id,
            patientname: patient.patientname,
            age: patient.age,
            barcode: patient.barcode,
            date: patient.date,
            locationId: patient.locationId || patient.location_id || "Shanmuga Reference Lab",
            created_date: patient.created_date,
            testdetails: patient.testdetails || [],
            is_emergency: patient.is_emergency || false,
            patient_history: patient.patient_history || "",
          },
          skipFetch: true,
        },
      },
    );
  };

  const getStatusBadge = () => (
    <WaitingBadge>
      <AlertCircle size={12} /> Waiting for Approval
    </WaitingBadge>
  );

  const getPriorityBadge = (isEmergency) => {
    if (isEmergency) {
      return (
        <EmergencyBadge>
          <AlertTriangle size={12} /> Emergency
        </EmergencyBadge>
      );
    }
    return <NormalBadge>Normal</NormalBadge>;
  };

  const uniqueLocations = useMemo(() => {
    const locSet = new Set();
    [...currentDatePatients, ...backlogPatients].forEach((p) => {
      const loc = p.locationId || p.location_id || "Shanmuga Reference Lab";
      if (loc) locSet.add(loc);
    });
    return Array.from(locSet).sort();
  }, [currentDatePatients, backlogPatients]);

  const filterList = (list) => {
    return list.filter((patient) => {
      const pName = (patient.patientname || "").toLowerCase();
      const pId = (patient.patient_id || "").toLowerCase();
      const pBarcode = (patient.barcode || "").toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        pName.includes(q) || pId.includes(q) || pBarcode.includes(q);

      const matchesEmergency =
        emergencyFilter === "all" ||
        (emergencyFilter === "emergency" && patient.is_emergency) ||
        (emergencyFilter === "normal" && !patient.is_emergency);

      const pLoc =
        patient.locationId || patient.location_id || "Shanmuga Reference Lab";
      const matchesLocation =
        locationFilter === "all" || pLoc === locationFilter;

      return matchesSearch && matchesEmergency && matchesLocation;
    });
  };

  const filteredCurrentPatients = useMemo(
    () => filterList(currentDatePatients),
    [currentDatePatients, searchQuery, emergencyFilter, locationFilter],
  );
  const filteredBacklogPatients = useMemo(
    () => filterList(backlogPatients),
    [backlogPatients, searchQuery, emergencyFilter, locationFilter],
  );

  const patientsPerPage = 10;
  const indexOfLastCurrent = currentPage * patientsPerPage;
  const indexOfFirstCurrent = indexOfLastCurrent - patientsPerPage;
  const paginatedCurrentPatients = filteredCurrentPatients.slice(
    indexOfFirstCurrent,
    indexOfLastCurrent,
  );
  const totalCurrentPages =
    Math.ceil(filteredCurrentPatients.length / patientsPerPage) || 1;

  const indexOfLastBacklog = backlogPage * patientsPerPage;
  const indexOfFirstBacklog = indexOfLastBacklog - patientsPerPage;
  const paginatedBacklogPatients = filteredBacklogPatients.slice(
    indexOfFirstBacklog,
    indexOfLastBacklog,
  );
  const totalBacklogPages =
    Math.ceil(filteredBacklogPatients.length / patientsPerPage) || 1;

  // ── Reusable Table Renderer ──
  const renderPatientTable = (
    patients,
    paginatedList,
    page,
    setPage,
    totalPages,
    emptyMessage,
  ) => {
    return (
      <>
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <th>Date</th>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Location</th>
                <th>Barcode</th>
                <th>Age</th>
                <th>Priority Status</th>
                <th>Test Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {loading ? (
                <tr>
                  <td
                    colSpan={10}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Loading patient data...
                  </td>
                </tr>
              ) : paginatedList.length > 0 ? (
                paginatedList.map((patient, index) => (
                  <tr key={`${patient.barcode}-${index}`}>
                    <td>
                      {patient.date
                        ? new Date(patient.date).toLocaleDateString()
                        : "Invalid Date"}
                    </td>
                    <td>{patient.patient_id}</td>
                    <td>{patient.patientname}</td>
                    <td>{patient.locationId || patient.location_id || "-"}</td>
                    <td>{patient.barcode}</td>
                    <td>{patient.age}</td>
                    <td>{getPriorityBadge(patient.is_emergency)}</td>
                    <td>
                      <TestList>
                        {patient.testdetails &&
                        patient.testdetails.length > 0 ? (
                          patient.testdetails.map((test, idx) => (
                            <TestItem key={idx}>
                              <span>
                                {test.test_id} -{" "}
                                {test.test_name || test.testname || "Test"}
                              </span>
                              {test.outsourced && (
                                <OutsourcedBadge>Outsourced</OutsourcedBadge>
                              )}
                            </TestItem>
                          ))
                        ) : (
                          <TestItem>No tests available</TestItem>
                        )}
                      </TestList>
                    </td>
                    <td>
                      <StatusList>
                        {patient.testdetails &&
                        patient.testdetails.length > 0 ? (
                          patient.testdetails.map((test, idx) => (
                            <li key={idx}>{getStatusBadge()}</li>
                          ))
                        ) : (
                          <li>No status available</li>
                        )}
                      </StatusList>
                    </td>
                    <td>
                      <ViewButton onClick={() => handleViewDetails(patient)}>
                        <Eye size={14} /> View
                      </ViewButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <NoData colSpan={10}>
                    {emptyMessage ||
                      "No patient data available for the selected criteria."}
                  </NoData>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {patients.length > 10 && (
          <PaginationContainer>
            <PaginationButton
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={16} />
            </PaginationButton>
            <PaginationInfo>
              Page {page} of {totalPages}
            </PaginationInfo>
            <PaginationButton
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight size={16} />
            </PaginationButton>
          </PaginationContainer>
        )}
        <div
          style={{
            padding: "0.75rem 1.5rem",
            textAlign: "right",
            color: "var(--gray)",
            fontSize: "0.85rem",
            borderTop: "1px solid var(--gray-light)",
          }}
        >
          Showing {patients.length}{" "}
          {patients.length === 1 ? "entry" : "entries"}
        </div>
      </>
    );
  };



  if (error) {
    return (
      <Container>
        <GlobalStyle />
        <Card>
          <Header>
            <Title>Error</Title>
          </Header>
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>Failed to load patient data: {error}</p>
            <Button
              onClick={() =>
                fetchPatientData(fromDate, toDate, emergencyFilter)
              }
              style={{ marginTop: "1rem" }}
            >
              Retry
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <GlobalStyle />
      <Card>
        <Header>
          <Title>M/B Patient List</Title>
          <FiltersContainer>
            <DatePickerWrapper>
              <DatePickerLabel>
                <Calendar size={16} /> From:
              </DatePickerLabel>
              <DatePicker
                selected={fromDate}
                onChange={(date) => {
                  setFromDate(date);
                  if (date && toDate && toDate < date) setToDate(date);
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select from date"
                isClearable
                maxDate={today}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
              />
            </DatePickerWrapper>
            <DatePickerWrapper>
              <DatePickerLabel>To:</DatePickerLabel>
              <DatePicker
                selected={toDate}
                onChange={(date) => setToDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select to date"
                isClearable
                minDate={fromDate || undefined}
                maxDate={today}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
              />
            </DatePickerWrapper>

            <BarcodeSearchWrapper>
              <SearchContainer style={{ flex: 1, minWidth: 0, width: "auto" }}>
                <SearchIconWrapper>
                  <Search size={16} />
                </SearchIconWrapper>
                <SearchInput
                  type="text"
                  placeholder="Search by name, ID, or barcode"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                    setBacklogPage(1);
                  }}
                />
              </SearchContainer>
              <StepButton
                type="button"
                title="Decrement barcode number"
                onClick={() => handleBarcodeStep(-1)}
              >
                −
              </StepButton>
              <StepButton
                type="button"
                title="Increment barcode number"
                onClick={() => handleBarcodeStep(1)}
              >
                +
              </StepButton>
            </BarcodeSearchWrapper>

            <Select
              value={emergencyFilter}
              onChange={(e) => {
                setEmergencyFilter(e.target.value);
                setCurrentPage(1);
                setBacklogPage(1);
              }}
            >
              <option value="all">All Priority</option>
              <option value="emergency">Emergency</option>
              <option value="normal">Normal</option>
            </Select>

            <Select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setCurrentPage(1);
                setBacklogPage(1);
              }}
            >
              <option value="all">All Locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </Select>

            <FilterButton onClick={handleFilter}>
              <Filter size={16} /> Apply Filter
            </FilterButton>
            <ClearButton
              onClick={handleClearFilter}
              title="Clear all filters and reset to today"
            >
              <RotateCcw size={16} /> Clear Filters
            </ClearButton>
          </FiltersContainer>
        </Header>

        {/* ── TABLE 1: Current Date Data ── */}
        <SectionContainer>
          <SectionHeader>
            <SectionTitleGroup>
              <SectionTitle>
                <Calendar size={18} />
                Current Date Pending Approvals
              </SectionTitle>
              <SectionSubtitle>
                ({fromDate ? format(fromDate, "MMM dd, yyyy") : ""} to{" "}
                {toDate ? format(toDate, "MMM dd, yyyy") : ""})
              </SectionSubtitle>
            </SectionTitleGroup>
            <SectionBadge>
              {filteredCurrentPatients.length} Patients
            </SectionBadge>
          </SectionHeader>
          {renderPatientTable(
            filteredCurrentPatients,
            paginatedCurrentPatients,
            currentPage,
            setCurrentPage,
            totalCurrentPages,
            "No pending approvals found for the selected date.",
          )}
        </SectionContainer>

        {/* ── TABLE 2: All Pending Approvals (Backlog) ── */}
        <SectionContainer style={{ marginTop: "2rem" }}>
          <SectionHeader backlog>
            <SectionTitleGroup>
              <SectionTitle backlog>
                <Clock size={18} />
                Waiting for Approval - All Days Backlog
              </SectionTitle>
              <SectionSubtitle>
                (Pending approvals from previous days / other dates)
              </SectionSubtitle>
            </SectionTitleGroup>
            <SectionBadge backlog>
              {filteredBacklogPatients.length} Backlog Patients
            </SectionBadge>
          </SectionHeader>
          {renderPatientTable(
            filteredBacklogPatients,
            paginatedBacklogPatients,
            backlogPage,
            setBacklogPage,
            totalBacklogPages,
            "No pending approvals found from other days.",
          )}
        </SectionContainer>
      </Card>
    </Container>
  );
}

export default MBPatientList;
