import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";
import { format } from "date-fns";
import Modal from "react-modal";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "react-datepicker/dist/react-datepicker.css";
import CorporateTestSorting from "./CorporateTestSorting";
import {
  Calendar,
  Search,
  Printer,
  Mail,
  Flag,
  X,
  List,
  user,
  ChevronDown,
  Filter,
  RefreshCw,
  CreditCard,
  MessageCircle,
  Eye,
} from "lucide-react";
import { IoIosFemale, IoIosMale, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import images
import headerImage from "../Images/Header.png";
import FooterImage from "../Images/Footer.png";
import NABLImage from "../Images/NABL.png";
// import Savitha from "../Images/Savitha.png";
import Dhana from "../Images/Dhana.png";
import Brindha from "../Images/Brindha.png";
import { useNavigate, useLocation } from "react-router-dom";
import apiRequest from "../Auth/apiRequest";

// Global styles
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
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f7fb;
    color: var(--dark);
    line-height: 1.5;
  }
`;

// Container for the main content
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
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-light);
`;

const FiltersContainer = styled.div`
  padding: 0.4rem 1rem;
  border-bottom: 1px solid var(--gray-light);
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.35rem;
  margin-bottom: 0.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const FilterLabel = styled.label`
  font-size: 0.7rem;
  color: var(--gray);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const FilterInput = styled.input`
  padding: 0.25rem 0.4rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.775rem;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;
const BarcodeSearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  width: 100%;
`;

const StepButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  flex-shrink: 0;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  background: white;
  color: var(--primary);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  line-height: 1;
  &:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 2px 8px rgba(67, 97, 238, 0.4);
  }
  &:active {
    transform: scale(0.95);
  }
`;

const FilterSelect = styled.select`
  padding: 0.25rem 0.4rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.775rem;
  transition: var(--transition);
  background-color: white;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.4rem;
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

const ClearButton = styled(Button)`
  background-color: var(--light);
  color: var(--dark);

  &:hover {
    background-color: var(--gray-light);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--gray-light);
`;

const StatCard = styled.div`
  background-color: var(--light);
  border-radius: var(--border-radius);
  padding: 0.85rem 1.15rem;
  border: 1px solid var(--gray-light);
`;

const StatLabel = styled.p`
  font-size: 0.8rem;
  color: var(--gray);
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
`;

const StatDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(p) => p.color};
  flex-shrink: 0;
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: ${(p) => p.color || "var(--dark)"};
  line-height: 1;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  transform: rotateX(180deg);

  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
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
  transform: rotateX(180deg);
`;

const TableHead = styled.thead`
  background-color: var(--gray-light);

  th {
    padding: 0.5rem 0.6rem;
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
    padding: 0.5rem 0.6rem;
    vertical-align: middle;
    font-size: 0.825rem;
  }
`;

const NoData = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray);
  font-style: italic;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${(props) => props.color || "var(--gray)"};
  color: white;
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  background-color: ${(props) =>
    props.disabled ? "var(--gray-light)" : "white"};
  color: ${(props) => (props.disabled ? "var(--gray)" : "var(--dark)")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: var(--transition);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
    props.disabled
      ? "0 2px 4px rgba(0, 0, 0, 0.1)"
      : "0 4px 8px rgba(0, 0, 0, 0.1)"};
  }
`;

const CreditAmount = styled.span`
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const GenderIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  background-color: ${(props) =>
    props.gender === "Female"
      ? "rgba(232, 62, 140, 0.1)"
      : "rgba(0, 123, 255, 0.1)"};
  color: ${(props) => (props.gender === "Female" ? "#E83E8C" : "#007BFF")};
`;

const PrintDropdown = styled.div`
  position: relative;
  &::after {
    content: "";
    position: fixed;
    width: 210px;
    height: 10px;
    left: ${(p) => p.left || 0}px;
    top: ${(p) => p.top || 0}px;
    z-index: 9998;
    pointer-events: auto;
    background: transparent;
  }
`;
const PortalDropdownMenu = styled.div`
  position: fixed;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  min-width: 200px;
  z-index: 9999;
  overflow: hidden;
  border: 1px solid #e9ecef;
  // Bridge the gap with invisible top padding
  padding-top: 6px;
  margin-top: -6px;
`;
const DropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  border: none;
  background-color: white;
  color: black;
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--gray-light);
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 2px solid #f0f0f0;
`;

const NavigationTab = styled.button`
  padding: 12px 24px;
  border: none;
  background: ${(props) =>
    props.active ? "var(--primary-dark)" : "transparent"};
  color: ${(props) => (props.active ? "white" : "#666")};
  font-weight: ${(props) => (props.active ? "600" : "400")};
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  margin-right: 4px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: ${(props) => (props.active ? "#0056b3" : "#f8f9fa")};
    color: ${(props) => (props.active ? "white" : "#333")};
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${(props) => (props.active ? "#ccc" : "transparent")};
  }
`;

const DepartmentBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
  background-color: ${(props) => (props.isPending ? "white" : props.color)};
  color: ${(props) => (props.isPending ? "#dc3545" : "white")};
  border: ${(props) => (props.isPending ? "2px solid #dc3545" : "none")};
  animation: ${(props) => (props.isPending ? "blink 1s infinite" : "none")};

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
`;

const DepartmentCell = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  max-width: 320px;
`;

const DepartmentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: nowrap;
`;

const DepartmentPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  background-color: ${(props) => (props.isPending ? "rgba(220, 53, 69, 0.1)" : props.color)};
  color: ${(props) => (props.isPending ? "#dc3545" : "white")};
  border: 1px solid ${(props) => (props.isPending ? "#dc3545" : "transparent")};
  animation: ${(props) => (props.isPending ? "blink 1s infinite" : "none")};
  white-space: nowrap;

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--gray-light);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--primary-dark);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--gray);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition);

  &:hover {
    background-color: var(--gray-light);
    color: var(--dark);
  }
`;

const TestStatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TestStatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  background-color: ${(props) =>
    props.highlight ? "rgba(67, 97, 238, 0.05)" : "white"};
  transition: var(--transition);

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const TestNameText = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--dark);
  flex: 1;
`;

const StatusBadgeContainer = styled.div`
  display: flex;
  align-items: center;s
  gap: 0.5rem;
`;

const CorporatePatientOverview = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activeDropdownPatientId, setActiveDropdownPatientId] = useState(null);
  const [refByOptions, setRefByOptions] = useState([]);
  const [branch, setBranch] = useState("");
  const [barcode, setBarcode] = useState("");
  const [refBy, setRefBy] = useState("");
  const [patientId, setPatientId] = useState("");
  const [IPNumber, setIPNumber] = useState("");
  const [patientName, setPatientName] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [opIpFilter, setopIpFilter] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("hms");
  const [isTestStatusModalOpen, setIsTestStatusModalOpen] = useState(false);
  const [selectedPatientForStatus, setSelectedPatientForStatus] =
    useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Set active tab based on current route
  useEffect(() => {
    if (location.pathname === "/HMSPatientOverview") {
      setActiveTab("hms");
    } else if (location.pathname === "/PatientOverview") {
      setActiveTab("reference");
    } else if (location.pathname === "/360Overview") {
      setActiveTab("shanmuga360");
    } else if (location.pathname === "/FranchiseOverview") {
      setActiveTab("franchise");
    } else if (location.pathname === "/CorporateOverview") {
      setActiveTab("corporate");
    }
  }, [location.pathname]);

  // Handle tab navigation
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "hms") {
      navigate("/HMSPatientOverview");
    } else if (tab === "reference") {
      navigate("/PatientOverview");
    } else if (tab === "shanmuga360") {
      navigate("/360Overview");
    } else if (tab === "franchise") {
      navigate("/FranchiseOverview");
    } else if (tab === "corporate") {
      navigate("/CorporateOverview");
    }
  };

  // Fetch patients when component mounts
  useEffect(() => {
    const fetchCombinedPatientData = async () => {
      setLoading(true);
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const url = `${Labbaseurl}corporate_overall_report/?from_date=${formattedStartDate}&to_date=${formattedEndDate}`;

      const result = await apiRequest(url, "GET");

      if (result.success) {
        const patientData = result.data || [];
        const sortedData = [...patientData].sort((a, b) => {
          const dateA = new Date(a.date || a.created_at || a.created_date || 0).getTime();
          const dateB = new Date(b.date || b.created_at || b.created_date || 0).getTime();
          if (dateA !== dateB) return dateB - dateA;
          const idA = String(a.patient_id || a.barcode || a.id || "");
          const idB = String(b.patient_id || b.barcode || b.id || "");
          return idB.localeCompare(idA, undefined, { numeric: true, sensitivity: "base" });
        });
        setPatients(sortedData);
        setFilteredPatients(sortedData);

        const statusMap = {};
        patientData.forEach((patient) => {
          // Use barcode as the unique key since same patient can have multiple barcodes with different statuses
          statusMap[patient.barcode] = {
            status: patient.status,
            barcode: patient.barcode,
          };
        });
        setStatuses(statusMap);
      } else {
        console.error("Error fetching combined patient data:", result.error);
        setError("Failed to load patient data");
      }

      setLoading(false);
    };

    if (startDate && endDate) {
      fetchCombinedPatientData();
    }
  }, [startDate, endDate]);

  const TestStatusModal = () => {
    if (!isTestStatusModalOpen || !selectedPatientForStatus) return null;

    const testStatuses = selectedPatientForStatus.test_statuses || [];

    return (
      <ModalOverlay onClick={() => setIsTestStatusModalOpen(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              Test Status - {selectedPatientForStatus.patient_name}
            </ModalTitle>
            <CloseButton onClick={() => setIsTestStatusModalOpen(false)}>
              <X size={24} />
            </CloseButton>
          </ModalHeader>

          <TestStatusList>
            {testStatuses.length > 0 ? (
              testStatuses.map((test, index) => (
                <TestStatusItem
                  key={index}
                  highlight={
                    test.status === "Approved" || test.status === "Dispatched"
                  }
                >
                  <TestNameText>{test.test_name}</TestNameText>
                  <Badge color={getBadgeColor(test.status)}>
                    {test.status}
                  </Badge>
                </TestStatusItem>
              ))
            ) : (
              <NoData>No test status information available</NoData>
            )}
          </TestStatusList>
        </ModalContent>
      </ModalOverlay>
    );
  };

  // Determine icon state based on patient status
  const isPrintAndMailEnabled = (status) =>
    status === "Approved" || status === "Dispatched";
  const isSortingEnabled = (status) =>
    status === "Approved" ||
    status === "Partially Approved" ||
    status === "Partially Dispatched" ||
    status === "Dispatched";

  useEffect(() => {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    const filtered = patients.filter((patient) => {
      const patientDate = new Date(patient.date);
      // Use barcode to lookup status since it's the unique identifier
      const patientStatus = statuses[patient.barcode]?.status || "";
      // Department filter logic
      const matchesDepartment =
        !departmentFilter ||
        (patient.department &&
          patient.department
            .split(",")
            .some((dept) => dept.trim() === departmentFilter));
      return (
        patientDate >= startOfDay &&
        patientDate <= endOfDay &&
        (!refBy || patient.refby === refBy) &&
        (!patientId || patient.patient_id.includes(patientId)) &&
        (!IPNumber || patient.ipnumber?.includes(IPNumber)) &&
        (!barcode ||
          patient.barcode?.toLowerCase().includes(barcode.toLowerCase())) &&
        (!patientName ||
          patient.patient_name
            ?.toLowerCase()
            .includes(patientName.toLowerCase())) &&
        (!statusFilter || patientStatus === statusFilter) &&
        (!opIpFilter || patient.opiptype === opIpFilter) &&
        matchesDepartment // Add this line
      );
    });
    const sortedFiltered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date || a.created_at || a.created_date || 0).getTime();
      const dateB = new Date(b.date || b.created_at || b.created_date || 0).getTime();
      if (dateA !== dateB) return dateB - dateA;
      const idA = String(a.patient_id || a.barcode || a.id || "");
      const idB = String(b.patient_id || b.barcode || b.id || "");
      return idB.localeCompare(idA, undefined, { numeric: true, sensitivity: "base" });
    });
    setFilteredPatients(sortedFiltered);
  }, [
    startDate,
    endDate,
    patients,
    refBy,
    patientId,
    barcode,
    IPNumber,
    patientName,
    statusFilter,
    departmentFilter,
    opIpFilter,
    statuses,
  ]);
  // Update the clearFilters function to reset the status filter
  const clearFilters = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setBarcode("");
    setRefBy("");
    setPatientId("");
    setIPNumber("");
    setPatientName("");
    setStatusFilter("");
    setDepartmentFilter("");
    setopIpFilter("");
    setFilteredPatients(patients);
  };
  const handleBarcodeStep = (delta) => {
    setBarcode((prev) => {
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

  const handleWhatsAppShare = async (patient) => {
    if (!patient || !patient.mobile) {
      toast.error("Patient phone number is missing");
      return;
    }

    const phoneNumber = patient.mobile.startsWith("+91")
      ? patient.mobile.replace("+", "")
      : `91${patient.mobile}`;

    try {
      const pdfBlob = await handlePrint(patient, true);
      if (!pdfBlob) {
        toast.error("Failed to generate the PDF");
        return;
      }

      const pdfName = `${patient.patient_name || "Patient"}_TestDetails.pdf`;
      const pdfFile = new File([pdfBlob], pdfName, { type: "application/pdf" });

      // Upload PDF to server
      const formData = new FormData();
      formData.append("file", pdfFile);

      const uploadResponse = await axios.post(`${Labbaseurl}upload-pdf/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileUrl = uploadResponse.data.file_url;
      if (!fileUrl) {
        toast.error("File upload failed");
        return;
      }

      // Call Django proxy instead of Botify directly
      const res = await axios.post(`${Labbaseurl}send-whatsapp/`, {
        patient_name: patient.patient_name || "Valued Patient",
        phone: phoneNumber,
        collection_time: patient.collection_time || "N/A",
        collected_date: patient.collected_date || "N/A",
        file_url: fileUrl,
        pdf_name: pdfName,
        barcode: patient.barcode || "",
        template_name: "chc_report",
      });

      if (res.data.success) {
        toast.success("WhatsApp PDF message sent successfully!");
      } else {
        toast.error("Failed to send WhatsApp template message.");
        console.error("Backend error:", res.data.error);
      }
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      toast.error("Error sending WhatsApp message.");
    }
  };

  //  const handleSendEmail = async (patient) => {
  //   try {
  //     const pdfBlob = await handlePrint(patient, true); // Generate PDF with letterpad
  //     if (!pdfBlob) {
  //       toast.error("Failed to generate the PDF.");
  //       return;
  //     }

  //     if (!patient.email) {
  //       toast.warning("Patient email is missing.");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("subject", `Test Details for ${patient.patient_name}`);
  //     formData.append(
  //       "message",
  //       `Dear ${
  //         patient.patient_name || "Recipient"
  //       },\n\nWe hope this message finds you well. Please find attached the lab test results for ${
  //         patient.patient_name || "the patient"
  //       }. If you have any questions or require further assistance, feel free to contact us.\n\nThank you for choosing our services.`
  //     );
  //     formData.append("recipients", patient.email);
  //     formData.append(
  //       "attachments",
  //       new File([pdfBlob], `${patient.patient_name}_TestDetails.pdf`, {
  //         type: "application/pdf",
  //       })
  //     );

  //     const emailResponse = await apiRequest(
  //       `${Labbaseurl}send-email/`,
  //       "POST",
  //       formData,
  //       { "Content-Type": "multipart/form-data" }
  //     );

  //     if (emailResponse.success) {
  //       toast.success("Email sent successfully!");
  //     } else {
  //       toast.error(`Failed to send email: ${emailResponse.error}`);
  //     }
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //     toast.error("Failed to send email.");
  //   }
  // };

  const handlePrint = async (patient, withLetterpad = true) => {
    try {
      const response = await apiRequest(
        `${Labbaseurl}corporate_patient_test_details/?barcode=${patient.barcode}`,
        "GET",
      );
      if (!response.success) {
        toast.error(response.error || "Failed to fetch patient details");
        setLoading(false);
        return null;
      }

      let patientDetails;
      let signaturesData = [];
      if (response.data.patient_data && response.data.signatures) {
        patientDetails = response.data.patient_data;
        signaturesData = response.data.signatures;
      } else {
        patientDetails = response.data;
      }
      if (Array.isArray(patientDetails)) {
        patientDetails = {
          ...patientDetails[0],
          testdetails: patientDetails.flatMap(
            (record) => record.testdetails || [],
          ),
        };
      }
      if (
        !patientDetails.testdetails ||
        patientDetails.testdetails.length === 0
      ) {
        toast.error("No test details found for the patient.");
        setLoading(false);
        return null;
      }
      // Keep a copy of all fetched tests (including Molecular Biology) for unapproved tests comparison
      const allFetchedTests = [...(patientDetails.testdetails || [])];

      // Skip Molecular Biology tests from the printed report
      patientDetails.testdetails = patientDetails.testdetails.filter(
        (test) => test.department !== "Molecular Biology",
      );

      if (patientDetails.testdetails.length === 0) {
        toast.error(
          "No printable test details found (Molecular Biology tests are excluded).",
        );
        setLoading(false);
        return null;
      }

      // ── NABL SPLIT: separate NABL=true and NABL=false tests ──────────────
      const nablTrueTests = patientDetails.testdetails.filter(
        (t) => t.NABL === true,
      );
      const nablFalseTests = patientDetails.testdetails.filter(
        (t) => t.NABL !== true,
      );
      // We will render NABL=true tests first (pages with NABL logo),
      // then NABL=false tests (pages WITHOUT NABL logo).
      // ──────────────────────────────────────────────────────────────────────

      const unicodeMap = {
        μ: "µ",
        α: "α",
        β: "β",
        γ: "γ",
        δ: "δ",
        Ω: "Ω",
        "²": "²",
        "³": "³",
        "⁴": "⁴",
        "°": "°",
        "±": "±",
        "×": "x",
        "÷": "/",
        "\\u03bc": "µ",
        "\\u00b5": "µ",
        "\\u00b0": "°",
        "\\u00b1": "±",
        "\\u00b2": "²",
        "\\u00b3": "³",
      };
      const processUnicodeText = (text) => {
        if (!text) return "";
        let t = text;
        t = t.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
          const char = String.fromCharCode(parseInt(hex, 16));
          return unicodeMap[char] || char;
        });
        Object.keys(unicodeMap).forEach((u) => {
          t = t.replace(new RegExp(u, "g"), unicodeMap[u]);
        });
        return t;
      };
      const extractPatientRefNoNumber = (refNo) => {
        if (!refNo) return "N/A";
        return refNo.split("+")[0];
      };
      const designationMapping = {
        DESIG101: { position: 0, title: "Consultant Microbiologist" },
        DESIG100: { position: 1, title: "Consultant Pathologist" },
        DESIG099: { position: 2, title: "Consultant Biochemist" },
      };
      const consultants = [null, null, null];
      signaturesData.forEach((sig) => {
        const mapping = designationMapping[sig.designation];
        if (mapping)
          consultants[mapping.position] = [
            sig.employeeName,
            mapping.title,
            sig.signatureBase64
              ? `data:image/png;base64,${sig.signatureBase64}`
              : null,
          ];
      });
      const activeConsultants = consultants.filter((c) => c !== null);
      const departmentOrder = [
        "Haematology",
        "Coagulation",
        "Biochemistry",
        "Immunology",
        "Immunoassay",
        "Serology",
        "Clinical Pathology",
        "Clinical Chemistry",
        "Cytology",
        "Genetics",
        "Histopathology",
        "Immunohistochemistry",
        "Microbiology",
        "Molecular Biology",
      ];
      const patientRefNo =
        patientDetails.barcodes?.[0]?.match(/\d+/)?.[0] || "N/A";
      const patientRefNoNumber = extractPatientRefNoNumber(patientRefNo);
      let barcodeImage = null;
      if (patientRefNoNumber !== "N/A") {
        const barcodeCanvas = document.createElement("canvas");
        JsBarcode(barcodeCanvas, patientRefNoNumber, {
          format: "CODE128",
          lineColor: "#000",
          width: 1.5,
          height: 10,
          displayValue: false,
          margin: 0,
        });
        barcodeImage = barcodeCanvas.toDataURL("image/png");
      }
      const leftMargin = 10;
      const rightMargin = leftMargin + 190;
      const contentWidth = rightMargin - leftMargin;
      const headerHeight = 30;
      const footerHeight = 20;
      const contentYStart = headerHeight + 20;
      const signatureHeight = 35;
      const tableHeaderHeight = 10;
      const colWidths = [
        contentWidth * 0.28,
        contentWidth * 0.12,
        contentWidth * 0.05,
        contentWidth * 0.18,
        contentWidth * 0.1,
        contentWidth * 0.27,
        0,
      ];
      const leftDetails = [
        { label: "Patient ID", value: patientDetails.patient_id || "N/A" },
        {
          label: "Name",
          value: patientDetails.patientname || "No name provided",
        },
        {
          label: "Age/Gender",
          value: `${patientDetails.age || "N/A"} ${patientDetails.age_type || ""}/ ${patientDetails.gender || "N/A"}`,
        },
        { label: "Referral", value: patientDetails.refby || "SELF" },
      ];
      const rightDetails = [
        {
          label: "Collected On",
          value:
            format(
              new Date(patientDetails.testdetails[0].samplecollected_time),
              "dd MMM yy / HH:mm",
            ) || "N/A",
        },
        {
          label: "Received On",
          value:
            format(
              new Date(patientDetails.testdetails[0].received_time),
              "dd MMM yy / HH:mm",
            ) || "N/A",
        },
        ...(patientDetails.testdetails[0].dispatch_time &&
          patientDetails.testdetails[0].dispatch_time !== "null"
          ? [
            {
              label: "Released On",
              value: format(
                new Date(patientDetails.testdetails[0].dispatch_time),
                "dd MMM yy / HH:mm",
              ),
            },
          ]
          : []),
        { label: "Printed On", value: format(new Date(), "dd MMM yy / HH:mm") },
        { label: "Patient Ref.No", value: patientRefNoNumber },
      ];
      const calculateMaxLabelWidth = (details) => {
        const tempDoc = new jsPDF();
        return Math.max(
          ...details.map((item) => tempDoc.getTextWidth(item.label)),
        );
      };

      const doc = new jsPDF();
      let pageCount = 1;
      let isTableStarted = false;
      let patientInfoEndY = 0;

      // ── Track which "section" we are currently rendering ─────────────────
      // showNablLogo = true  → pages for NABL=true tests
      // showNablLogo = false → pages for NABL=false tests
      let showNablLogo = nablTrueTests.length > 0; // start with NABL pages if any exist
      // ──────────────────────────────────────────────────────────────────────

      const leftMaxLabelWidth = calculateMaxLabelWidth(leftDetails);
      const rightMaxLabelWidth = calculateMaxLabelWidth(rightDetails);
      const centerPoint = (leftMargin + rightMargin) / 2;
      const leftLabelX = leftMargin;
      const leftColonX = leftLabelX + leftMaxLabelWidth + 2;
      const leftValueX = leftColonX + 3;
      const rightLabelX = centerPoint + 28;
      const rightColonX = rightLabelX + rightMaxLabelWidth + 2;
      const rightValueX = rightColonX + 1;

      const wrapTextAndGetLines = (doc, text, maxWidth) => {
        if (!text) return [];
        return doc.splitTextToSize(text, maxWidth);
      };
      const renderWrappedText = (
        doc,
        text,
        maxWidth,
        startX,
        yPos,
        lineHeight = 4,
      ) => {
        if (!text) return 0;
        const lines = wrapTextAndGetLines(doc, text, maxWidth);
        lines.forEach((line, index) =>
          doc.text(line, startX, yPos + index * lineHeight),
        );
        return lines.length * lineHeight;
      };
      const addPatientInfo = (yPos) => {
        doc.setFontSize(10);
        let patientInfoY = yPos;
        let barcodeBottomY = 0;
        const maxLength = Math.max(leftDetails.length, rightDetails.length);
        for (let i = 0; i < maxLength; i++) {
          const left = leftDetails[i];
          const right = rightDetails[i];
          if (left) {
            doc.setFont("helvetica", "bold");
            doc.text(left.label, leftLabelX, patientInfoY);
            doc.text(":", leftColonX, patientInfoY);
            doc.setFont("helvetica", "normal");
            const maxLeftValueWidth = centerPoint + 25 - leftValueX;
            const leftValueLines = wrapTextAndGetLines(
              doc,
              left.value,
              maxLeftValueWidth,
            );
            leftValueLines.forEach((line, lineIndex) =>
              doc.text(line, leftValueX, patientInfoY + lineIndex * 4),
            );
            var leftRowHeight = leftValueLines.length * 4;
          } else {
            var leftRowHeight = 5;
          }
          if (right) {
            doc.setFont("helvetica", "bold");
            doc.text(right.label, rightLabelX, patientInfoY);
            doc.text(":", rightColonX, patientInfoY);
            doc.setFont("helvetica", "normal");
            doc.text(right.value, rightValueX, patientInfoY);
            if (
              right.label === "Patient Ref.No" &&
              patientRefNoNumber !== "N/A" &&
              barcodeImage
            ) {
              const barcodeY = patientInfoY + 4;
              doc.addImage(
                barcodeImage,
                "PNG",
                rightValueX + doc.getTextWidth(right.value) - 10,
                barcodeY,
                25,
                10,
              );
              barcodeBottomY = barcodeY + 10;
            }
          }
          patientInfoY += Math.max(leftRowHeight, 5);
        }
        return Math.max(patientInfoY, barcodeBottomY);
      };

      // ── addHeaderFooter now accepts a boolean: whether to show NABL logo ──
      const addHeaderFooter = (withNabl = false) => {
        if (withLetterpad) {
          doc.addImage(
            headerImage,
            "PNG",
            0,
            10,
            doc.internal.pageSize.width,
            headerHeight,
          );
          // ── Place NABL logo beside NABH logo (≈2 inches = 50.8 mm from right) ──
          if (withNabl && NABLImage) {
            // nablLogoImage is the imported/loaded NABL png (see note below)
            const nablLogoWidth = 20; // adjust as needed (mm)
            const nablLogoHeight = 20;
            const nablLogoX = doc.internal.pageSize.width - 45 - nablLogoWidth;
            const nablLogoY = 14; // vertically centred in header band
            doc.addImage(
              NABLImage,
              "PNG",
              nablLogoX,
              nablLogoY,
              nablLogoWidth,
              nablLogoHeight,
            );
          }
          doc.addImage(
            FooterImage,
            "PNG",
            0,
            doc.internal.pageSize.height - footerHeight,
            doc.internal.pageSize.width,
            footerHeight,
          );
        } else {
          // Without letterpad – still overlay NABL logo at the same position
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(255, 255, 255);
          doc.text("Header Space", leftMargin, 10);
          doc.setTextColor(0, 0, 0);
          if (withNabl && NABLImage) {
            const nablLogoWidth = 25;
            const nablLogoHeight = 25;
            const nablLogoX = doc.internal.pageSize.width - 30 - nablLogoWidth;
            const nablLogoY = 5;
            doc.addImage(
              NABLImage,
              "PNG",
              nablLogoX,
              nablLogoY,
              nablLogoWidth,
              nablLogoHeight,
            );
          }
        }
      };
      // ──────────────────────────────────────────────────────────────────────

      const renderUnicodeText = (text, x, y, options = {}) => {
        const processedText = processUnicodeText(text);
        if (processedText.includes("µ")) {
          const parts = processedText.split("µ");
          let currentX = x;
          parts.forEach((part, index) => {
            if (index > 0) {
              doc.setFont("helvetica", options.fontStyle || "normal");
              doc.text("µ", currentX, y);
              currentX += doc.getTextWidth("µ");
            }
            if (part) {
              doc.text(part, currentX, y);
              currentX += doc.getTextWidth(part);
            }
          });
        } else {
          doc.text(processedText, x, y);
        }
      };
      const renderValueWithSuperscript = (
        doc,
        text,
        x,
        y,
        maxWidth = null,
        lineHeight = 4,
      ) => {
        if (!text) return 0;

        const lines = maxWidth ? doc.splitTextToSize(text, maxWidth) : text.split("\n");
        let currentY = y;
        let totalHeight = 0;

        lines.forEach((lineText) => {
          const superscriptRegex = /(\d+[xX×]?\d*)\^(-?\d+)/;
          const match = lineText.match(superscriptRegex);

          if (!match) {
            doc.text(lineText, x, currentY);
          } else {
            const before = lineText.slice(0, match.index);
            const base = match[1].replace(/[xX]/, "×");
            const exponent = match[2];
            const after = lineText.slice(match.index + match[0].length);

            let currentX = x;
            const normalSize = doc.getFontSize();

            if (before) {
              doc.text(before, currentX, currentY);
              currentX += doc.getTextWidth(before);
            }

            doc.text(base, currentX, currentY);
            currentX += doc.getTextWidth(base);

            doc.setFontSize(7);
            doc.text(exponent, currentX, currentY - 2);
            currentX += doc.getTextWidth(exponent);
            doc.setFontSize(normalSize);

            if (after) {
              doc.text(after, currentX, currentY);
            }
          }
          currentY += lineHeight;
          totalHeight += lineHeight;
        });

        return totalHeight;
      };
      const drawTableHeader = (yPos) => {
        doc.line(leftMargin, yPos, rightMargin, yPos);
        yPos += 5;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const headers = [
          "Test",
          "Specimen",
          "",
          "Result",
          "Units",
          "Reference Range / Method",
          "",
        ];
        let xPos = leftMargin;
        headers.forEach((header, index) => {
          if (header) doc.text(header, xPos, yPos);
          xPos += colWidths[index];
        });
        yPos += 3;
        doc.line(leftMargin, yPos, rightMargin, yPos);
        yPos += 5;
        return yPos;
      };
      const addSignatures = () => {
        const pageHeight = doc.internal.pageSize.height;
        const signaturesY = pageHeight - footerHeight - signatureHeight - 2;
        const signatureWidth = 35;
        if (activeConsultants.length === 0) return;
        const startX = rightMargin - activeConsultants.length * 60;
        activeConsultants.forEach((consultant, index) => {
          const xPosition = startX + index * 60;
          if (consultant[2])
            doc.addImage(
              consultant[2],
              "PNG",
              xPosition,
              signaturesY,
              signatureWidth,
              15,
            );
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text(consultant[0], xPosition, signaturesY + 20);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text(consultant[1], xPosition, signaturesY + 25);
        });
      };
      const checkForNewPage = (yPos, estimatedHeight) => {
        const pageHeight = doc.internal.pageSize.height;
        const footerStart = pageHeight - (footerHeight + signatureHeight - 1);
        if (yPos + estimatedHeight >= footerStart) {
          addSignatures();
          doc.addPage();
          pageCount++;
          addHeaderFooter(showNablLogo); // ← pass current NABL flag
          let newYPos = contentYStart;
          newYPos = addPatientInfo(newYPos);
          newYPos += 12;
          if (isTableStarted) newYPos = drawTableHeader(newYPos);
          return newYPos;
        }
        return yPos;
      };
      const getHighLowStatus = (value, reference) => {
        if (!value || !reference) return null;
        const numValue = Number.parseFloat(value);
        if (isNaN(numValue)) return null;
        if (reference.includes("-")) {
          const [min, max] = reference
            .split("-")
            .map((v) => Number.parseFloat(v));
          if (!isNaN(min) && !isNaN(max)) {
            if (numValue < min) return "L";
            if (numValue > max) return "H";
          }
        } else if (reference.includes("<")) {
          const max = Number.parseFloat(reference.replace("<", ""));
          if (!isNaN(max) && numValue > max) return "H";
        } else if (reference.includes(">")) {
          const min = Number.parseFloat(reference.replace(">", ""));
          if (!isNaN(min) && numValue < min) return "L";
        }
        return null;
      };
      const drawArrowSymbol = (doc, x, y, direction) => {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        if (direction === "up") {
          doc.line(x, y, x + 1, y - 1);
          doc.line(x + 1, y - 1, x + 2, y);
          doc.line(x + 1, y - 1, x + 1, y + 2);
        } else if (direction === "down") {
          doc.line(x, y, x + 1, y + 1);
          doc.line(x + 1, y + 1, x + 2, y);
          doc.line(x + 1, y + 1, x + 1, y - 2);
        }
      };

      // ── helper: render one ordered list of tests onto the PDF ────────────
      const renderTestGroup = (testsToRender, yPos) => {
        if (!testsToRender.length) return yPos;

        isTableStarted = true;
        yPos = checkForNewPage(yPos, tableHeaderHeight);
        yPos = drawTableHeader(yPos);

        const testsByDepartment = testsToRender.reduce((acc, test) => {
          (acc[test.department] = acc[test.department] || []).push(test);
          return acc;
        }, {});
        const sortedDepartments = Object.keys(testsByDepartment).sort(
          (a, b) => {
            const iA = departmentOrder.indexOf(a);
            const iB = departmentOrder.indexOf(b);
            if (iA !== -1 && iB !== -1) return iA - iB;
            if (iA !== -1) return -1;
            if (iB !== -1) return 1;
            return a.localeCompare(b);
          },
        );

        sortedDepartments.forEach((department) => {
          const verifiedBySet = new Set();
          testsByDepartment[department].forEach((test) => {
            if (test.verified_by && test.verified_by.trim() !== "")
              verifiedBySet.add(test.verified_by);
          });
          const hasMultipleVerifiers = verifiedBySet.size > 1;

          testsByDepartment[department].forEach((test, testIndex) => {
            if (testIndex === 0) {
              yPos = checkForNewPage(yPos, 15);
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              const textWidth = doc.getTextWidth(department.toUpperCase());
              const centerX = leftMargin + contentWidth / 2;
              doc.text(department.toUpperCase(), centerX, yPos, {
                align: "center",
              });
              doc.line(
                centerX - textWidth / 2,
                yPos + 2,
                centerX + textWidth / 2,
                yPos + 2,
              );
              yPos += 10;
            }

            const parametersBySubtitle = {};
            if (test.parameters && test.parameters.length > 0) {
              test.parameters.forEach((param) => {
                const subtitle = param.sub_title || "";
                if (!parametersBySubtitle[subtitle])
                  parametersBySubtitle[subtitle] = [];
                parametersBySubtitle[subtitle].push(param);
              });
            }

            yPos = checkForNewPage(yPos, 20);
            doc.setFontSize(10);
            const testNameText = test.testname;
            const valueText = test.value || "";
            const methodText = (test.method || "")
              .replace(/\bMethod\b/i, "")
              .trim();
            const hasParameters = test.parameters && test.parameters.length > 0;
            const testNameWidth = hasParameters ? contentWidth - 2 : colWidths[0] - 2;
            const testNameLines = wrapTextAndGetLines(
              doc,
              testNameText,
              testNameWidth,
            );
            const valueLines = wrapTextAndGetLines(
              doc,
              valueText,
              colWidths[3] - 2,
            );
            const refMethodText = [test.reference_range, methodText].filter(p => p && p.trim() !== "").join(" / ");
            const refMethodLines = wrapTextAndGetLines(
              doc,
              refMethodText,
              colWidths[5] - 2,
            );
            const maxLines = Math.max(
              testNameLines.length,
              valueLines.length,
              refMethodLines.length,
            );
            const lineHeight = 4.5;
            const actualRowHeight = maxLines * lineHeight + 2;

            yPos = checkForNewPage(yPos, actualRowHeight);
            let xPos = leftMargin;
            doc.setFont("helvetica", "bold");
            renderWrappedText(
              doc,
              testNameText,
              testNameWidth,
              xPos,
              yPos,
              lineHeight,
            );
            xPos += colWidths[0];
            doc.setFont("helvetica", "normal");
            doc.text(test.specimen_type || "", xPos, yPos);
            xPos += colWidths[1];
            xPos += colWidths[2];
            const statusIndicator = test.isHigh
              ? "H"
              : test.isLow
                ? "L"
                : getHighLowStatus(valueText, test.reference_range);
            if (statusIndicator) {
              doc.setFont("helvetica", "bold");
              doc.setTextColor(
                statusIndicator === "H" ? 255 : 0,
                0,
                statusIndicator === "L" ? 255 : 0,
              );
              renderValueWithSuperscript(
                doc,
                valueText,
                xPos,
                yPos,
                colWidths[3] - 5,
                lineHeight,
              );
              const valueWidth = doc.getTextWidth(valueText);
              if (valueWidth < colWidths[3] - 5)
                drawArrowSymbol(
                  doc,
                  xPos + valueWidth + 2,
                  yPos - 1,
                  statusIndicator === "H" ? "up" : "down",
                );
              doc.setTextColor(0, 0, 0);
              doc.setFont("helvetica", "normal");
            } else {
              renderValueWithSuperscript(
                doc,
                valueText,
                xPos,
                yPos,
                colWidths[3] - 2,
                lineHeight,
              );
            }
            xPos += colWidths[3];
            renderUnicodeText(test.unit || "", xPos, yPos);
            xPos += colWidths[4];
            renderWrappedText(
              doc,
              refMethodText,
              colWidths[5] - 2,
              xPos,
              yPos,
              lineHeight,
            );
            yPos += actualRowHeight + (hasParameters ? 1.5 : 3.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);

            if (test.outsourced === true) {
              doc.setFont("helvetica", "italic");
              doc.setFontSize(8);
              yPos = checkForNewPage(yPos, 4);
              doc.text("(Outsourced)", leftMargin, yPos);
              yPos += 4;
            }
            if (!test.parameters || test.parameters.length === 0) {
              if (test.comment && test.comment.trim() !== "") {
                doc.setFont("helvetica", "italic");
                doc.setFontSize(8);
                const commentLines = wrapTextAndGetLines(doc, `Comment: ${test.comment}`, contentWidth);
                yPos = checkForNewPage(yPos, commentLines.length * 3.5 + 2);
                const commentHeight = renderWrappedText(
                  doc,
                  `Comment: ${test.comment}`,
                  contentWidth,
                  leftMargin,
                  yPos,
                  3.5,
                );
                yPos += commentHeight + 2;
              }
              if (test.notes && test.notes.trim() !== "") {
                doc.setFont("helvetica", "italic");
                doc.setFontSize(8);
                const notesLines = wrapTextAndGetLines(doc, `Notes: ${test.notes}`, contentWidth);
                yPos = checkForNewPage(yPos, notesLines.length * 3.5 + 2);
                const notesHeight = renderWrappedText(
                  doc,
                  `Notes: ${test.notes}`,
                  contentWidth,
                  leftMargin,
                  yPos,
                  3.5,
                );
                yPos += notesHeight + 2;
              }
            }
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);

            Object.keys(parametersBySubtitle).forEach((subtitle) => {
              if (subtitle && subtitle.trim() !== "") {
                yPos = checkForNewPage(yPos, 25);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.text(subtitle, leftMargin, yPos);
                yPos += 6;
              }
              parametersBySubtitle[subtitle].forEach((currentTest) => {
                doc.setFontSize(10);
                const paramNameText = currentTest.name;
                const paramValueText = currentTest.value || "";
                const paramMethodText = (currentTest.method || "")
                  .replace(/\bMethod\b/i, "")
                  .trim();
                const paramNameLines = wrapTextAndGetLines(
                  doc,
                  paramNameText,
                  colWidths[0] - 2,
                );
                const paramValueLines = wrapTextAndGetLines(
                  doc,
                  paramValueText,
                  colWidths[3] - 2,
                );
                const paramRefMethodText = [currentTest.reference_range, paramMethodText].filter(p => p && p.trim() !== "").join(" / ");
                const paramRefMethodLines = wrapTextAndGetLines(
                  doc,
                  paramRefMethodText,
                  colWidths[5] - 2,
                );
                const paramMaxLines = Math.max(
                  paramNameLines.length,
                  paramValueLines.length,
                  paramRefMethodLines.length,
                );
                const paramLineHeight = 4.5;
                const paramRowHeight = paramMaxLines * paramLineHeight + 2;
                yPos = checkForNewPage(yPos, paramRowHeight);
                let xPos = leftMargin;
                doc.setFont("helvetica", "normal");
                renderWrappedText(
                  doc,
                  paramNameText,
                  colWidths[0] - 2,
                  xPos,
                  yPos,
                  paramLineHeight,
                );
                xPos += colWidths[0];
                doc.text(currentTest.specimen_type || "", xPos, yPos);
                xPos += colWidths[1];
                xPos += colWidths[2];
                const paramStatus = currentTest.isHigh
                  ? "H"
                  : currentTest.isLow
                    ? "L"
                    : getHighLowStatus(
                      paramValueText,
                      currentTest.reference_range,
                    );
                if (paramStatus) {
                  doc.setFont("helvetica", "bold");
                  doc.setTextColor(
                    paramStatus === "H" ? 255 : 0,
                    0,
                    paramStatus === "L" ? 255 : 0,
                  );
                  renderValueWithSuperscript(
                    doc,
                    paramValueText,
                    xPos,
                    yPos,
                    colWidths[3] - 5,
                    paramLineHeight,
                  );
                  const paramValueWidth = doc.getTextWidth(paramValueText);
                  if (paramValueWidth < colWidths[3] - 5)
                    drawArrowSymbol(
                      doc,
                      xPos + paramValueWidth + 2,
                      yPos - 1,
                      paramStatus === "H" ? "up" : "down",
                    );
                  doc.setTextColor(0, 0, 0);
                  doc.setFont("helvetica", "normal");
                } else {
                  renderValueWithSuperscript(
                    doc,
                    paramValueText,
                    xPos,
                    yPos,
                    colWidths[3] - 2,
                    paramLineHeight,
                  );
                }
                xPos += colWidths[3];
                renderUnicodeText(currentTest.unit || "", xPos, yPos);
                xPos += colWidths[4];
                renderWrappedText(
                  doc,
                  paramRefMethodText,
                  colWidths[5] - 2,
                  xPos,
                  yPos,
                  paramLineHeight,
                );
                yPos += paramRowHeight;

                if (currentTest.comment && currentTest.comment.trim() !== "") {
                  doc.setFont("helvetica", "italic");
                  doc.setFontSize(8);
                  const commentLines = wrapTextAndGetLines(
                    doc,
                    `Comment: ${currentTest.comment}`,
                    contentWidth
                  );
                  yPos = checkForNewPage(yPos, commentLines.length * 3.5 + 2);
                  const paramCommentHeight = renderWrappedText(
                    doc,
                    `Comment: ${currentTest.comment}`,
                    contentWidth,
                    leftMargin,
                    yPos,
                    3.5,
                  );
                  yPos += paramCommentHeight + 2;
                }
                if (currentTest.notes && currentTest.notes.trim() !== "") {
                  doc.setFont("helvetica", "italic");
                  doc.setFontSize(8);
                  const notesLines = wrapTextAndGetLines(doc, `Notes: ${currentTest.notes}`, contentWidth);
                  yPos = checkForNewPage(yPos, notesLines.length * 3.5 + 2);
                  const notesHeight = renderWrappedText(
                    doc,
                    `Notes: ${currentTest.notes}`,
                    contentWidth,
                    leftMargin,
                    yPos,
                    3.5,
                  );
                  yPos += notesHeight + 2;
                }
                yPos += 1;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
              });
            });

            if (test.parameters && test.parameters.length > 0 && test.notes && test.notes.trim() !== "") {
              doc.setFont("helvetica", "italic");
              doc.setFontSize(8);
              const testNotesLines = wrapTextAndGetLines(doc, `Notes: ${test.notes}`, contentWidth);
              yPos = checkForNewPage(yPos, testNotesLines.length * 3.5 + 2);
              const testNotesHeight = renderWrappedText(
                doc,
                `Notes: ${test.notes}`,
                contentWidth,
                leftMargin,
                yPos,
                3.5,
              );
              yPos += testNotesHeight + 2;
            }

            if (
              hasMultipleVerifiers &&
              test.verified_by &&
              test.verified_by.trim() !== ""
            ) {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(10);
              doc.text(`Verified by: ${test.verified_by}`, leftMargin, yPos);
              yPos += 5;
            }
          });

          if (!hasMultipleVerifiers && verifiedBySet.size > 0) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(
              `Verified by: ${Array.from(verifiedBySet).join(", ")}`,
              leftMargin,
              yPos,
            );
            yPos += 5;
          }
          const isLastDept =
            department === sortedDepartments[sortedDepartments.length - 1];
          yPos += isLastDept ? 2 : 4;
        });

        return yPos;
      };
      // ──────────────────────────────────────────────────────────────────────

      // ── FIRST PAGE: always starts with NABL logo state = nablTrueTests exist ─
      addHeaderFooter(showNablLogo);
      let currentYPosition = addPatientInfo(contentYStart);
      patientInfoEndY = currentYPosition;
      currentYPosition += 12;

      // ── Render NABL=true tests (with logo) ───────────────────────────────
      if (nablTrueTests.length > 0) {
        currentYPosition = renderTestGroup(nablTrueTests, currentYPosition);
      }

      // ── Switch to non-NABL section ────────────────────────────────────────
      if (nablFalseTests.length > 0) {
        // If we already have NABL=true tests rendered, start a new page for false tests
        if (nablTrueTests.length > 0) {
          addSignatures();
          showNablLogo = false; // ← flip the flag BEFORE adding the new page
          doc.addPage();
          pageCount++;
          addHeaderFooter(false); // no NABL logo
          currentYPosition = contentYStart;
          currentYPosition = addPatientInfo(currentYPosition);
          currentYPosition += 12;
        } else {
          // No NABL=true tests at all – first (and only) section, no logo
          showNablLogo = false;
        }
        currentYPosition = renderTestGroup(nablFalseTests, currentYPosition);
      }

      isTableStarted = false;

      const ensureSpaceForFooter = (currentYPosition) => {
        const pageHeight = doc.internal.pageSize.height;
        const footerStart = pageHeight - (footerHeight + signatureHeight - 1);
        if (currentYPosition + 5 >= footerStart) {
          addSignatures();
          doc.addPage();
          pageCount++;
          addHeaderFooter(showNablLogo);
          return addPatientInfo(contentYStart) + 12;
        }
        return currentYPosition;
      };
      currentYPosition = ensureSpaceForFooter(currentYPosition);

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const centerX = leftMargin + contentWidth / 2;
      doc.text("**End of the Report**", centerX, currentYPosition, {
        align: "center",
      });
      currentYPosition += 6;

      const allTestStatuses = patient.test_statuses || [];
      const unapprovedTests = allTestStatuses.filter((hmsTest) => {
        return !allFetchedTests.some((fetchedTest) => fetchedTest.test_id === hmsTest.test_id);
      });

      if (unapprovedTests.length > 0) {
        currentYPosition = checkForNewPage(currentYPosition, 10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("Result/s to follow:", leftMargin, currentYPosition);
        currentYPosition += 4.5;

        doc.setFont("helvetica", "normal");
        unapprovedTests.forEach((t) => {
          currentYPosition = checkForNewPage(currentYPosition, 5);
          doc.text(`- ${t.test_name}`, leftMargin + 2, currentYPosition);
          currentYPosition += 4.5;
        });
      }

      addSignatures();

      // ── Page numbering ────────────────────────────────────────────────────
      const finalPageCount = pageCount;
      const barcodeX = rightValueX + doc.getTextWidth(patientRefNoNumber) - 10;
      const pageNumberX = barcodeX + 12.5; // Centered under the barcode
      for (let i = 1; i <= finalPageCount; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(
          `Page ${i} of ${finalPageCount}`,
          pageNumberX,
          patientInfoEndY + 4,
          { align: "center" },
        );
      }

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
      setLoading(false);
      return pdfBlob;
    } catch (error) {
      console.error("Error while generating the PDF:", error);
      toast.error("An unexpected error occurred while generating the PDF");
      setLoading(false);
      return null;
    }
  };
  // Open modal for editing credit amount
  const openModal = (patient) => {
    setSelectedPatient(patient);
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPatient(null);
  };

  const openTestModal = (patient) => {
    setSelectedPatient(patient);
    setIsTestModalOpen(true);
  };

  const showDropdown = (barcode, e) => {
    // Calculate where to place the portal menu based on the trigger button position
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 4, // 4px gap below the button
      left: rect.right - 190, // align right edge of menu with button right edge
    });
    setActiveDropdownPatientId(barcode);
  };

  const hideDropdown = () => {
    setActiveDropdownPatientId(null);
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "Registered":
        return "#6c757d"; // Gray
      case "Collected":
        return "#0d6efd"; // Bright Blue
      case "Partially Collected":
        return "#6610f2"; // Indigo/Purple
      case "Received":
        return "#17a2b8"; // Cyan/Turquoise (distinctly different)
      case "Partially Received":
        return "#20c997"; // Teal/Mint Green
      case "Tested":
        return "#d63384"; // Pink/Magenta
      case "Partially Tested":
        return "#fd7e14"; // Orange
      case "Approved":
        return "#28a745"; // Success Green
      case "Partially Approved":
        return "#ffc107"; // Yellow/Amber
      case "Dispatched":
        return "#155724"; // Dark Forest Green
      case "Partially Dispatched":
        return "#617c68";
      default:
        return "#dc3545"; // Red for unknown/error
    }
  };

  const getDepartmentStatus = (patient) => {
    if (!patient.department) return [];

    const departments = patient.department.split(",").map((d) => d.trim());
    const departmentStatuses = patient.department_statuses || {};

    return departments.map((dept) => {
      const backendStatus = departmentStatuses[dept] || "Pending";
      let status = backendStatus;
      let color = "#dc3545";
      let isPending = true;

      switch (backendStatus) {
        case "Dispatched":
          color = "#155724";
          isPending = false;
          break;
        case "Approved":
          color = "#28a745";
          isPending = false;
          break;
        case "Tested":
          color = "#d63384";
          isPending = false;
          break;
        case "Received":
          color = "#17a2b8";
          isPending = false;
          break;
        case "Collected":
          color = "#0d6efd";
          isPending = false;
          break;
        case "In Progress":
          color = "#ffc107";
          isPending = false;
          status = "In Progress";
          break;
        default:
          color = "#dc3545";
          isPending = true;
          status = "Pending";
      }

      return { department: dept, status, color, isPending };
    });
  };

  const totalSamplesCount = filteredPatients.length;
  const approvedCount = filteredPatients.filter(
    (p) => (statuses[p.barcode]?.status || p.status) === "Approved"
  ).length;
  const partiallyApprovedCount = filteredPatients.filter(
    (p) => (statuses[p.barcode]?.status || p.status) === "Partially Approved"
  ).length;
  const dispatchedCount = filteredPatients.filter(
    (p) => (statuses[p.barcode]?.status || p.status) === "Dispatched"
  ).length;
  const partiallyDispatchedCount = filteredPatients.filter(
    (p) => (statuses[p.barcode]?.status || p.status) === "Partially Dispatched"
  ).length;

  return (
    <Container>
      <GlobalStyle />
      <Card>
        <CardHeader>
          {/* Navigation Tabs */}
          <NavigationContainer>
            <NavigationTab
              active={activeTab === "hms"}
              onClick={() => handleTabChange("hms")}
            >
              Shanmuga Lab
            </NavigationTab>
            <NavigationTab
              active={activeTab === "reference"}
              onClick={() => handleTabChange("reference")}
            >
              Shanmuga Diagnostics
            </NavigationTab>
            <NavigationTab
              active={activeTab === "shanmuga360"}
              onClick={() => handleTabChange("shanmuga360")}
            >
              Shanmuga 360
            </NavigationTab>
            <NavigationTab
              active={activeTab === "franchise"}
              onClick={() => handleTabChange("franchise")}
            >
              Franchise
            </NavigationTab>
            <NavigationTab
              active={activeTab === "corporate"}
              onClick={() => handleTabChange("corporate")}
            >
              Corporate Health Checkup
            </NavigationTab>
          </NavigationContainer>
          <Title>CHC Patient Status</Title>
        </CardHeader>

        <FiltersContainer>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Start Date</FilterLabel>
              <FilterInput
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>End Date</FilterLabel>
              <FilterInput
                type="date"
                value={endDate.toISOString().split("T")[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Patient ID</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter Patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Barcode</FilterLabel>
              <BarcodeSearchWrapper>
                <FilterInput
                  type="text"
                  placeholder="Enter Barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  style={{ flex: 1, minWidth: 0 }}
                />
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
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Patient Name</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter patient name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <FilterSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Registered">Registered</option>
                <option value="Collected">Collected</option>
                <option value="Partially Collected">Partially Collected</option>
                <option value="Received">Received</option>
                <option value="Partially Received">Partially Received</option>
                <option value="Tested">Tested</option>
                <option value="Partially Tested">Partially Tested</option>
                <option value="Approved">Approved</option>
                <option value="Partially Approved">Partially Approved</option>
                <option value="Dispatched">Dispatched</option>
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Department</FilterLabel>
              <FilterSelect
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="Haematology">Haematology</option>
                <option value="Coagulation">Coagulation</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Immunology">Immunology</option>
                <option value="Immunoassay">Immunoassay</option>
                <option value="Serology">Serology</option>
                <option value="Clinical Pathology">Clinical Pathology</option>
                <option value="Clinical Chemistry">Clinical Chemistry</option>
                <option value="Cytology">Cytology</option>
                <option value="Genetics">Genetics</option>
                <option value="Histopathology">Histopathology</option>
                <option value="Immunohistochemistry">
                  Immunohistochemistry
                </option>
                <option value="Microbiology">Microbiology</option>
                <option value="Molecular Biology">Molecular Biology</option>
              </FilterSelect>
            </FilterGroup>
          </FilterRow>

          <ButtonContainer>
            <ClearButton onClick={clearFilters}>
              <X size={16} />
              Clear Filters
            </ClearButton>
          </ButtonContainer>
        </FiltersContainer>

        <StatsGrid>
          <StatCard>
            <StatLabel>
              <StatDot color="#4361ee" />
              Total Samples
            </StatLabel>
            <StatValue color="#4361ee">{totalSamplesCount}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>
              <StatDot color="#f59e0b" />
              Partially Approved
            </StatLabel>
            <StatValue color="#d97706">{partiallyApprovedCount}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>
              <StatDot color="#2ec4b6" />
              Approved
            </StatLabel>
            <StatValue color="#2ec4b6">{approvedCount}</StatValue>
          </StatCard>
        </StatsGrid>

        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <th>Date</th>
                <th>Patient ID</th>
                <th>Barcode</th>
                <th>Patient Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Loading patient data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--danger)",
                    }}
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  // Use barcode to look up status since it's unique per test registration
                  const patientStatus = statuses[patient.barcode] || {};
                  const status = patientStatus.status || "Loading...";
                  const barcode =
                    patientStatus.barcode || patient.barcode || "N/A";
                  const isPrintMailEnabled = isPrintAndMailEnabled(status);
                  const isSortingEnabledFlag = isSortingEnabled(status);
                  const badgeColor = getBadgeColor(status);

                  return (
                    <tr key={`${patient.patient_id}-${patient.barcode}`}>
                      <td>
                        {patient.date
                          ? format(new Date(patient.date), "yyyy-MM-dd")
                          : "N/A"}
                      </td>
                      <td>{patient.patient_id}</td>
                      <td>{barcode}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", fontWeight: 500 }}>
                          <GenderIcon gender={patient.gender}>
                            {patient.gender === "Female" ? (
                              <IoIosFemale size={14} />
                            ) : (
                              <IoIosMale size={14} />
                            )}
                          </GenderIcon>
                          {patient.patient_name}
                        </div>
                        {patient.mobile && (
                          <div style={{ fontSize: "0.7rem", color: "var(--gray)", marginLeft: "2rem", marginTop: "0.15rem" }}>
                            Mob: {patient.mobile}
                          </div>
                        )}
                      </td>
                      <td>
                        <DepartmentCell>
                          {getDepartmentStatus(patient).map((deptInfo, idx) => (
                            <DepartmentPill
                              key={idx}
                              color={deptInfo.color}
                              isPending={deptInfo.isPending}
                            >
                              {deptInfo.department}: {deptInfo.status}
                            </DepartmentPill>
                          ))}
                        </DepartmentCell>
                      </td>
                      <td>
                        <StatusBadgeContainer>
                          <Badge color={badgeColor}>{status}</Badge>
                          <ActionButton
                            onClick={() => {
                              setSelectedPatientForStatus(patient);
                              setIsTestStatusModalOpen(true);
                            }}
                            title="View Test Details"
                            style={{
                              width: "1.75rem",
                              height: "1.75rem",
                              marginLeft: "0.5rem",
                            }}
                          >
                            <Eye size={14} />
                          </ActionButton>
                        </StatusBadgeContainer>
                      </td>
                      <td>
                        <ActionContainer>
                          <ActionButton
                            onClick={() => openTestModal(patient)}
                            title="Sort Tests"
                            disabled={!isSortingEnabledFlag}
                          >
                            <List size={16} />
                          </ActionButton>

                          <PrintDropdown
                            onMouseEnter={(e) =>
                              isPrintMailEnabled &&
                              showDropdown(patient.barcode, e)
                            }
                            onMouseLeave={hideDropdown}
                          >
                            <ActionButton
                              disabled={!isPrintMailEnabled}
                              title="Print Options"
                            >
                              <Printer size={16} />
                            </ActionButton>
                          </PrintDropdown>
                          <ActionButton
                            disabled={!isPrintMailEnabled || !patient.mobile}
                            onClick={() =>
                              isPrintMailEnabled && patient.mobile && handleWhatsAppShare(patient)
                            }
                            title={patient.mobile ? "Share via WhatsApp" : "Phone number missing"}
                          >
                            <MessageCircle size={16} />
                          </ActionButton>
                          {/* 
                          <ActionButton
                            disabled={!isPrintMailEnabled}
                            onClick={() =>
                              isPrintMailEnabled && handleSendEmail(patient)
                            }
                            title="Send Email"
                          >
                            <Mail size={16} />
                          </ActionButton> */}
                        </ActionContainer>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7}>
                    <NoData>No patients found</NoData>
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {activeDropdownPatientId &&
          ReactDOM.createPortal(
            (() => {
              // Find which patient triggered the dropdown so we can pass it to handlePrint
              const activePatient = filteredPatients.find(
                (p) => p.barcode === activeDropdownPatientId,
              );
              if (!activePatient) return null;

              return (
                <PortalDropdownMenu
                  style={{ top: dropdownPos.top, left: dropdownPos.left }}
                  // Keep the menu open while hovering over it
                  onMouseEnter={() =>
                    setActiveDropdownPatientId(activeDropdownPatientId)
                  }
                  onMouseLeave={hideDropdown}
                >
                  <DropdownItem
                    onClick={() => {
                      handlePrint(activePatient, true);
                      hideDropdown();
                    }}
                  >
                    Print with Letterpad
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      handlePrint(activePatient, false);
                      hideDropdown();
                    }}
                  >
                    Print without Letterpad
                  </DropdownItem>
                </PortalDropdownMenu>
              );
            })(),
            document.body,
          )}
      </Card>

      {/* Test Sorting Modal */}
      {isTestModalOpen && (
        <CorporateTestSorting
          patient={selectedPatient}
          onClose={() => setIsTestModalOpen(false)}
        />
      )}

      {/* Test Status Modal */}
      <TestStatusModal />
      {/* Credit Amount Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "800px",
            height: "fit-content",
            position: "absolute",
            left: "400px", // Adjusted for sidebar width
            right: "auto",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adding shadow
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            overflowY: "auto",
          },
        }}
      >
        {/* Close Icon at Top-Right */}
        <div
          style={{
            position: "absolute",
            top: "15px",
            right: "20px",
            cursor: "pointer",
            fontSize: "20px",
            color: "#333",
          }}
          onClick={closeModal}
        >
          <IoMdClose />
        </div>
        {/* Pass patient_id and date as props */}
        {selectedPatient && (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          ></div>
        )}
      </Modal>
    </Container>
  );
};

export default CorporatePatientOverview;
