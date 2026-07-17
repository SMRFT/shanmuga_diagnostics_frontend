import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import {
  Search,
  Calendar,
  Eye,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertTriangle,
  Printer,
  Edit2,
} from "lucide-react";
import { format } from "date-fns";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
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
  .react-datepicker-wrapper { width: auto; display: inline-block; }
  .react-datepicker__input-container { display: inline-block; }
  .react-datepicker__input-container input {
    padding: 0.5rem 1rem;
    border: 1px solid var(--gray-light);
    border-radius: var(--border-radius);
    font-size: 0.765rem;
    background-color: white;
    cursor: pointer;
    transition: var(--transition);
    min-width: 140px;
    &:hover, &:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1); }
  }
  .react-datepicker { border: none; box-shadow: var(--box-shadow); font-family: inherit; z-index: 1000 !important; border: 1px solid var(--gray-light); }
  .react-datepicker-popper { z-index: 1000 !important; }
  .react-datepicker__header { background-color: var(--primary); border-bottom: none; padding-top: 0.8rem; border-radius: 0; }
  .react-datepicker__current-month, .react-datepicker__day-name { color: white; }
  .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected { background-color: var(--primary); &:hover { background-color: var(--primary-dark); } }
  .react-datepicker__day:hover { background-color: var(--gray-light); }
  .react-datepicker__day--disabled { color: var(--gray-light); cursor: not-allowed; }
  .react-datepicker__close-icon::after { background-color: var(--gray); font-size: 16px; }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

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
const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;
const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const DatePickerLabel = styled.label`
  font-size: 0.765rem;
  color: var(--gray);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
`;
const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.765rem;
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
  font-size: 0.765rem;
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
  font-size: 0.765rem;
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
  font-size: 0.765rem;
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
  overflow-y: auto;
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
    background-color: var(--gray-light);
    box-shadow:
      0 1px 0 var(--gray-light),
      0 2px 0 #dee2e6;
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
    font-size: 0.765rem;
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
  font-size: 0.765rem;
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
const PrintButton = styled(Button)`
  padding: 0.35rem 0.75rem;
  background-color: #6c757d;
  &:hover {
    background-color: #495057;
  }
  &:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
const ActionButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  font-size: 0.765rem;
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
const HistorySectionCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-top: 2rem;
`;
const HistorySectionHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const HistorySectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-dark);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;
const EditCountBadge = styled.span`
  background-color: rgba(67, 97, 238, 0.12);
  color: var(--primary);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 99px;
`;
const HistoryTableContainer = styled.div`
  overflow-x: auto;
`;
const HistoryEntryBlock = styled.div`
  background-color: #fffbf0;
  border-left: 3px solid var(--warning);
  border-radius: 0 4px 4px 0;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.4rem;
  font-size: 0.765rem;
  &:last-child {
    margin-bottom: 0;
  }
`;
const HistoryMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1rem;
  color: var(--gray);
  margin-bottom: 0.2rem;
  b {
    color: var(--dark);
    font-weight: 500;
  }
`;
const OldVal = styled.span`
  color: var(--danger);
  text-decoration: line-through;
`;
const NewVal = styled.span`
  color: #2d8a4e;
  font-weight: 600;
`;
const ReasonText = styled.div`
  color: var(--gray);
  font-style: italic;
  font-size: 0.75rem;
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
function ApprovedList() {
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
  const [patientList, setPatientList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [printingBarcode, setPrintingBarcode] = useState(null);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

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

  useEffect(() => {
    if (location.state?.barcode) {
      setSearchQuery(location.state.barcode);
      setCurrentPage(1);
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
    if (emergency && emergency !== "all")
      queryParams.append("emergency", emergency);
    const queryString = queryParams.toString();
    const url = `${Labbaseurl}test-approved-values/${queryString ? `?${queryString}` : ""}`;
    try {
      const patientResponse = await apiRequest(url, "GET");
      if (!patientResponse.success)
        throw new Error(
          patientResponse.error || "Failed to fetch patient data",
        );
      const patientData = Array.isArray(patientResponse.data?.data)
        ? patientResponse.data.data
        : [];
      setPatientList(patientData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setPatientList([]);
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
  };

  const handleClearFilter = () => {
    setFromDate(today);
    setToDate(today);
    setEmergencyFilter("all");
    setLocationFilter("all");
    fetchPatientData(today, today, "all");
    setCurrentPage(1);
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
      `/EditForm?patient_id=${patient.patient_id}&date=${formattedDate}`,
      {
        state: {
          patientHistory: patient.patient_history || "",
          patientData: {
            patient_id: patient.patient_id,
            patientname: patient.patientname,
            age: patient.age,
            barcode: patient.barcode,
            date: patient.date,
            locationId: patient.locationId,
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

  const getPriorityBadge = (isEmergency) =>
    isEmergency ? (
      <EmergencyBadge>
        <AlertTriangle size={12} /> Emergency
      </EmergencyBadge>
    ) : (
      <NormalBadge>Normal</NormalBadge>
    );

  // ── Grouping ──
  const safePatientList = Array.isArray(patientList) ? patientList : [];
  const groupedByBarcode = safePatientList.reduce((acc, patient) => {
    const barcode = patient.barcode;
    if (!acc[barcode]) {
      acc[barcode] = {
        ...patient,
        testdetails: patient.testdetails
          ? patient.testdetails.map((test) => ({
              ...test,
              created_date: patient.created_date,
            }))
          : [],
        is_emergency: patient.is_emergency || false,
        patient_history: patient.patient_history || "",
        age_type: patient.age_type || "",
        gender: patient.gender || "",
        phone: patient.phone || "",
        ref_doctor: patient.ref_doctor || "",
      };
    } else {
      const testsWithCreatedDate = patient.testdetails
        ? patient.testdetails.map((test) => ({
            ...test,
            created_date: patient.created_date,
          }))
        : [];
      acc[barcode].testdetails = [
        ...acc[barcode].testdetails,
        ...testsWithCreatedDate,
      ];
    }
    return acc;
  }, {});
  const uniquePatients = Object.values(groupedByBarcode);

  const uniqueLocations = useMemo(() => {
    const locations = uniquePatients
      .map((p) => p.locationId)
      .filter((loc) => loc && loc.trim() !== "");
    return [...new Set(locations)].sort();
  }, [uniquePatients]);

  const filteredPatients = uniquePatients.filter((p) => {
    const matchesSearch =
      p.patientname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patient_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      locationFilter === "all" || p.locationId === locationFilter;
    return matchesSearch && matchesLocation;
  });

  const patientsPerPage = 10;
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient,
  );
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const showClear =
    (fromDate && formatYmd(fromDate) !== formatYmd(today)) ||
    (toDate && formatYmd(toDate) !== formatYmd(today)) ||
    emergencyFilter !== "all" ||
    locationFilter !== "all";

  // ── Edit History — ALL hooks must be called before any early return ──
  const editHistoryRows = useMemo(() => {
    const rows = [];
    uniquePatients.forEach((patient) => {
      (patient.testdetails || []).forEach((test) => {
        const hasParams =
          Array.isArray(test.parameters) && test.parameters.length > 0;
        if (hasParams) {
          test.parameters.forEach((param, pi) => {
            if (Array.isArray(param.history) && param.history.length > 0) {
              rows.push({
                date: patient.date,
                patientname: patient.patientname,
                patient_id: patient.patient_id,
                barcode: patient.barcode,
                test_name: test.test_name || String(test.test_id),
                parameter_name: param.parameter_name || `Param ${pi + 1}`,
                editCount: param.history.length,
                history: param.history,
              });
            }
          });
        } else {
          if (Array.isArray(test.history) && test.history.length > 0) {
            rows.push({
              date: patient.date,
              patientname: patient.patientname,
              patient_id: patient.patient_id,
              barcode: patient.barcode,
              test_name: test.test_name || String(test.test_id),
              parameter_name: null,
              editCount: test.history.length,
              history: test.history,
            });
          }
        }
      });
    });
    return rows;
  }, [uniquePatients]);

  const totalEditCount = useMemo(
    () => editHistoryRows.reduce((sum, r) => sum + r.editCount, 0),
    [editHistoryRows],
  );

  const handlePrintHistory = () => {
    const win = window.open("", "_blank");
    win.document.write(`
    <html>
      <head>
        <title>Edit History Report</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 12px; margin: 2rem; color: #222; }
          
          .report-header { text-align: center; margin-bottom: 1.5rem; border-bottom: 2px solid #4361ee; padding-bottom: 1rem; }
          .report-header h1 { font-size: 18px; color: #3a0ca3; margin: 0 0 4px 0; }
          .report-header p { color: #555; font-size: 11px; margin: 0; }

          table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
          th { background: #4361ee; color: white; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
          td { border: 1px solid #dee2e6; padding: 8px 10px; vertical-align: top; font-size: 11px; }
          tr:nth-child(even) td { background-color: #f8f9ff; }
          tr:nth-child(odd) td { background-color: #ffffff; }

          .patient-name { font-weight: 600; color: #212529; }
          .patient-id { color: #6c757d; font-size: 10px; margin-top: 2px; }

          .history-block { border-left: 3px solid #f8961e; background: #fffbf0; padding: 5px 8px; margin-bottom: 5px; border-radius: 0 3px 3px 0; }
          .history-block:last-child { margin-bottom: 0; }
          
          .history-meta { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 3px; }
          .history-meta span { font-size: 10.5px; color: #444; }
          .history-meta b { color: #222; }
          
          .value-change { display: inline-flex; align-items: center; gap: 6px; }
          .old-val { color: #c0392b; text-decoration: line-through; }
          .new-val { color: #1a7a3f; font-weight: 600; }
          .arrow { color: #888; font-size: 12px; }

          .reason { color: #777; font-style: italic; font-size: 10.5px; margin-top: 3px; }
          .reason::before { content: "Reason: "; font-weight: 600; color: #555; font-style: normal; }

          .edit-badge { background: #fff3cd; color: #856404; border: 1px solid #ffc107; padding: 2px 7px; border-radius: 10px; font-size: 10px; font-weight: 600; }

          .footer { margin-top: 2rem; text-align: right; color: #888; font-size: 10px; border-top: 1px solid #dee2e6; padding-top: 0.5rem; }
          .sl-col { width: 40px; text-align: center; }
          .date-col { width: 80px; white-space: nowrap; }
          .barcode-col { width: 90px; }
          .edits-col { width: 70px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>Edit History Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th class="sl-col">Sl.No</th>
              <th class="date-col">Date</th>
              <th>Patient</th>
              <th class="barcode-col">Barcode</th>
              <th>Test Name</th>
              <th>Parameter</th>
              <th class="edits-col">Total Edits</th>
              <th>Edit History</th>
            </tr>
          </thead>
          <tbody>
            ${editHistoryRows
              .map(
                (row, idx) => `
              <tr>
                <td class="sl-col" style="text-align:center;">${idx + 1}</td>
                <td class="date-col">${row.date ? new Date(row.date).toLocaleDateString() : "—"}</td>
                <td>
                  <div class="patient-name">${row.patientname}</div>
                  <div class="patient-id">${row.patient_id}</div>
                </td>
                <td class="barcode-col">${row.barcode}</td>
                <td>${row.test_name}</td>
                <td>${row.parameter_name || "—"}</td>
                <td class="edits-col" style="text-align:center;">
                  <span class="edit-badge">${row.editCount} edit${row.editCount !== 1 ? "s" : ""}</span>
                </td>
                <td>
                  ${row.history
                    .map(
                      (h) => `
                    <div class="history-block">
                      <div class="history-meta">
                        <span><b>By:</b> ${h.edited_by}</span>
                        <span><b>At:</b> ${h.edited_at}</span>
                        ${
                          h.old_value !== undefined || h.new_value !== undefined
                            ? `
                          <span class="value-change">
                            <b>Value:</b>
                            <span class="old-val">${h.old_value ?? "—"}</span>
                            <span class="arrow">→</span>
                            <span class="new-val">${h.new_value ?? "—"}</span>
                          </span>
                        `
                            : ""
                        }
                      </div>
                      ${h.reason ? `<div class="reason">${h.reason}</div>` : ""}
                    </div>
                  `,
                    )
                    .join("")}
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          Total Records: ${editHistoryRows.length} &nbsp;|&nbsp;
          Total Edits: ${totalEditCount}
        </div>
      </body>
    </html>
  `);
    win.document.close();
    win.focus();
    win.print();
  };

  // ── Early return AFTER all hooks ──
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
          <Title>Report List</Title>
          <FiltersContainer>
            <DateRangeContainer>
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
              <Select
                value={emergencyFilter}
                onChange={(e) => {
                  setEmergencyFilter(e.target.value);
                  setCurrentPage(1);
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
              {showClear && (
                <ClearButton onClick={handleClearFilter}>Clear All</ClearButton>
              )}
            </DateRangeContainer>
            <SearchContainer>
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
                }}
              />
            </SearchContainer>
          </FiltersContainer>
        </Header>

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
                <th>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Loading patient data...
                  </td>
                </tr>
              ) : currentPatients.length > 0 ? (
                currentPatients.map((patient, index) => (
                  <tr key={`${patient.barcode}-${index}`}>
                    <td>
                      {patient.date
                        ? new Date(patient.date).toLocaleDateString()
                        : "Invalid Date"}
                    </td>
                    <td>{patient.patient_id}</td>
                    <td>{patient.patientname}</td>
                    <td>{patient.locationId}</td>
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
                                {test.test_id} - {test.test_name}
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
                      <ActionButtonsContainer>
                        <ViewButton onClick={() => handleViewDetails(patient)}>
                          <Eye size={14} /> View
                        </ViewButton>
                      </ActionButtonsContainer>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <NoData colSpan={9}>
                    No patient data available for the selected criteria.
                  </NoData>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredPatients.length > 10 && (
          <PaginationContainer>
            <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
              <ChevronLeft size={16} />
            </PaginationButton>
            <PaginationInfo>
              Page {currentPage} of {totalPages}
            </PaginationInfo>
            <PaginationButton
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </PaginationButton>
          </PaginationContainer>
        )}

        <div
          style={{
            padding: "1rem 1.5rem",
            textAlign: "right",
            color: "var(--gray)",
            fontSize: "0.875rem",
            borderTop: "1px solid var(--gray-light)",
          }}
        >
          Showing {filteredPatients.length}{" "}
          {filteredPatients.length === 1 ? "entry" : "entries"}
        </div>
      </Card>

      {/* ── Edit History Section ── */}
      {editHistoryRows.length > 0 && (
        <HistorySectionCard>
          <HistorySectionHeader>
            <HistorySectionTitle>
              <Edit2 size={16} />
              Edit History
              <EditCountBadge>
                {totalEditCount} edit{totalEditCount !== 1 ? "s" : ""} across{" "}
                {editHistoryRows.length} record
                {editHistoryRows.length !== 1 ? "s" : ""}
              </EditCountBadge>
            </HistorySectionTitle>
            <Button
              onClick={handlePrintHistory}
              style={{ padding: "0.4rem 1rem", fontSize: "0.82rem" }}
            >
              <Printer size={14} /> Print History
            </Button>
          </HistorySectionHeader>

          {/* This div is what gets printed — no styled-components wrapper so innerHTML is clean */}
          <div id="edit-history-print-area">
            <HistoryTableContainer>
              <Table style={{ minWidth: "950px" }}>
                <TableHead>
                  <tr>
                    <th>Sl.No</th>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Barcode</th>
                    <th>Test Name</th>
                    <th>Parameter</th>
                    <th>Total Edits</th>
                    <th>Edit History</th>
                  </tr>
                </TableHead>
                <TableBody>
                  {editHistoryRows.map((row, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        {row.date
                          ? new Date(row.date).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{row.patientname}</div>
                        <div
                          style={{ color: "var(--gray)", fontSize: "0.75rem" }}
                        >
                          {row.patient_id}
                        </div>
                      </td>
                      <td>{row.barcode}</td>
                      <td>{row.test_name}</td>
                      <td style={{ color: "var(--gray)" }}>
                        {row.parameter_name || "—"}
                      </td>
                      <td>
                        <WaitingBadge>
                          {row.editCount} edit{row.editCount !== 1 ? "s" : ""}
                        </WaitingBadge>
                      </td>
                      <td>
                        {row.history.map((h, hi) => (
                          <HistoryEntryBlock key={hi}>
                            <HistoryMetaRow>
                              <span>
                                <b>By:</b> {h.edited_by}
                              </span>
                              <span>
                                <b>At:</b> {h.edited_at}
                              </span>
                              {(h.old_value !== undefined ||
                                h.new_value !== undefined) && (
                                <span>
                                  <OldVal>{h.old_value ?? "—"}</OldVal>
                                  {" → "}
                                  <NewVal>{h.new_value ?? "—"}</NewVal>
                                </span>
                              )}
                            </HistoryMetaRow>
                            {h.reason && <ReasonText>{h.reason}</ReasonText>}
                          </HistoryEntryBlock>
                        ))}
                      </td>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </HistoryTableContainer>
          </div>

          <div
            style={{
              padding: "0.75rem 1.5rem",
              textAlign: "right",
              color: "var(--gray)",
              fontSize: "0.875rem",
              borderTop: "1px solid var(--gray-light)",
            }}
          >
            Showing {editHistoryRows.length} edited record
            {editHistoryRows.length !== 1 ? "s" : ""}
          </div>
        </HistorySectionCard>
      )}
    </Container>
  );
}

export default ApprovedList;
