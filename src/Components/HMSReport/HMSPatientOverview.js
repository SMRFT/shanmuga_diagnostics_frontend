import React, { useEffect, useState } from "react";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";
import { format } from "date-fns";
import Modal from "react-modal";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "react-datepicker/dist/react-datepicker.css";
import HMSTestSorting from "./HMSTestSorting";
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
} from "lucide-react";
import { IoIosFemale, IoIosMale, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import images
import headerImage from "../Images/Header.png";
import FooterImage from "../Images/Footer.png";
// import Savitha from "../Images/Savitha.png";
import Vijayan from "../Images/Vijayan.png";
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
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.8rem;
  color: var(--gray);
  font-weight: 500;
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
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
  margin-top: 1rem;
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

const TableContainer = styled.div`
  overflow-x: auto;

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
  min-width: 800px;
`;

const TableHead = styled.thead`
  background-color: var(--gray-light);

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
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: green;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  min-width: 180px;
  z-index: 100;
  overflow: hidden;
  display: ${(props) => (props.isVisible ? "block" : "none")};
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
  margin-bottom: 20px;
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

const HMSPatientOverview = () => {
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
  const [opIpFilter, setopIpFilter] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("hms");
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

   // Set active tab based on current route
    useEffect(() => {
      if (location.pathname === "/HMSPatientOverview") {
        setActiveTab("hms");
      } else if (location.pathname === "/PatientOverview") {
        setActiveTab("reference");
        } else if (location.pathname === "/FranchiseOverview") {
        setActiveTab("franchise");
      }else if (location.pathname === "/CorporateOverview") {
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
         } else if (tab === "franchise") {
        navigate("/FranchiseOverview");
      }
      else if (tab === "corporate") {
        navigate("/CorporateOverview");
      }
    };

  // Fetch Refby
  useEffect(() => {
    const fetchRefby = async () => {
      console.log("Fetching Refby from:", `${Labbaseurl}refby/`);
      const result = await apiRequest(`${Labbaseurl}refby/`, "GET");

      if (result.success) {
        setRefByOptions(result.data);
      } else {
        console.error(
          "Error fetching Refby:",
          result.error,
          "Status:",
          result.status
        );
        setError("Failed to load referral options");
        toast.error(result.error || "Failed to load referral options");
      }
    };

    fetchRefby();
  }, []);

  

  // Fetch patients when component mounts
  useEffect(() => {
    const fetchCombinedPatientData = async () => {
      setLoading(true);
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const url = `${Labbaseurl}hms_overall_report/?from_date=${formattedStartDate}&to_date=${formattedEndDate}`;

      const result = await apiRequest(url, "GET");

      if (result.success) {
        const patientData = result.data;

        // Set the full and filtered patient list
        setPatients(patientData);
        setFilteredPatients(patientData);

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

  // Determine icon state based on patient status
  const isPrintAndMailEnabled = (status) =>
    status === "Approved" ||
    status === "Partially Approved" ||
    status === "Dispatched";
  const isSortingEnabled = (status) =>
    status === "Approved" ||
    status === "Partially Approved" ||
    status === "Dispatched";
  const isDispatchEnabled = (status) => status === "Approved";

  useEffect(() => {
     const startOfDay = new Date(startDate);
     startOfDay.setHours(0, 0, 0, 0);
     const endOfDay = new Date(endDate);
     endOfDay.setHours(23, 59, 59, 999);
     const filtered = patients.filter((patient) => {
  const patientDate = new Date(patient.date);
  // Use barcode to lookup status since it's the unique identifier
  const patientStatus = statuses[patient.barcode]?.status || '';
  return (
    patientDate >= startOfDay &&
    patientDate <= endOfDay &&        
    (!refBy || patient.refby === refBy) &&
    (!patientId || patient.patient_id.includes(patientId)) &&
    (!IPNumber || patient.ipnumber?.includes(IPNumber)) &&
    (!barcode || patient.barcode?.toLowerCase().includes(barcode.toLowerCase())) &&
    (!patientName || patient.patient_name?.toLowerCase().includes(patientName.toLowerCase())) &&
    (!statusFilter || patientStatus === statusFilter)&&
    (!opIpFilter || patient.opiptype === opIpFilter)
  );
});
     setFilteredPatients(filtered);
   }, [startDate,
    endDate,
    patients,    
    refBy,
    patientId,
    barcode,
    IPNumber,
    patientName,
    statusFilter,
    opIpFilter,
    statuses,]);
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
    setopIpFilter("");
    setFilteredPatients(patients);
  };

  const handleDispatch = async (patient) => {
    try {
      // Use the test_created_date field from the patient object
      const createdDate = patient.test_created_date || new Date().toISOString();

      const response = await apiRequest(
        `${Labbaseurl}hms_update_dispatch_status/${patient.barcode}/`,
        "PATCH",
        {
          created_date: createdDate, // Send the test_created_date as created_date parameter
        },
        {
          "Content-Type": "application/json",
        }
      );

      if (response.success) {
        toast.success(
          `Dispatch updated successfully for Patient: ${patient.barcode}`
        );

        // Refresh the data
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];

        const reportResponse = await apiRequest(
          `${Labbaseurl}overall_report/?from_date=${formattedStartDate}&to_date=${formattedEndDate}`,
          "GET"
        );

        if (reportResponse.success) {
          setPatients(reportResponse.data);
          setFilteredPatients(reportResponse.data);

          // Update the statuses as well
          const statusMap = {};
reportResponse.data.forEach((p) => {
  // Use barcode as key since it's unique
  statusMap[p.barcode] = {
    status: p.status,
    barcode: p.barcode,
  };
});
setStatuses(statusMap);
        } else {
          toast.error("Failed to refresh patient data");
        }
      } else {
        toast.error(
          `Failed to update dispatch status for Patient: ${patient.patient_name} - ${response.error}`
        );
      }
    } catch (error) {
      console.error("Error updating dispatch status:", error);
      toast.error(
        `Failed to update dispatch status for Patient: ${patient.patient_name}`
      );
    }
  };

const handleWhatsAppShare = async (patient) => {
  if (!patient || !patient.phone) {
    toast.error("Patient phone number is missing");
    return;
  }

  const phoneNumber = patient.phone.startsWith("+91")
    ? patient.phone.replace("+", "")
    : `91${patient.phone}`;

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


   const handleSendEmail = async (patient) => {
    try {
      const pdfBlob = await handlePrint(patient, true); // Generate PDF with letterpad
      if (!pdfBlob) {
        toast.error("Failed to generate the PDF.");
        return;
      }

      if (!patient.email) {
        toast.warning("Patient email is missing.");
        return;
      }

      const formData = new FormData();
      formData.append("subject", `Test Details for ${patient.patient_name}`);
      formData.append(
        "message",
        `Dear ${
          patient.patient_name || "Recipient"
        },\n\nWe hope this message finds you well. Please find attached the lab test results for ${
          patient.patient_name || "the patient"
        }. If you have any questions or require further assistance, feel free to contact us.\n\nThank you for choosing our services.`
      );
      formData.append("recipients", patient.email);
      formData.append(
        "attachments",
        new File([pdfBlob], `${patient.patient_name}_TestDetails.pdf`, {
          type: "application/pdf",
        })
      );

      const emailResponse = await apiRequest(
        `${Labbaseurl}send-email/`,
        "POST",
        formData,
        { "Content-Type": "multipart/form-data" }
      );

      if (emailResponse.success) {
        toast.success("Email sent successfully!");
      } else {
        toast.error(`Failed to send email: ${emailResponse.error}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email.");
    }
  };


  const handlePrint = async (patient, withLetterpad = true) => {
  try {
    console.log("Fetching patient details for barcode:", patient.barcode);
    const response = await apiRequest(
      `${Labbaseurl}get_hms_patient_test_details/?barcode=${patient.barcode}`,
      "GET"
    );

    if (!response.success) {
      console.error("Failed to fetch patient details:", response.error);
      toast.error(response.error || "Failed to fetch patient details");
      setLoading(false);
      return null;
    }

    console.log("API Response:", response.data);
    let patientDetails = response.data;

    if (Array.isArray(response.data)) {
      patientDetails = {
        ...response.data[0],
        testdetails: response.data.flatMap((record) => record.testdetails || []),
      };
    }

    console.log("Processed Patient Details:", patientDetails);

    if (!patientDetails.testdetails || patientDetails.testdetails.length === 0) {
      console.error("No test details found for the patient.");
      toast.error("No test details found for the patient.");
      setLoading(false);
      return null;
    }

    // Unicode character mapping
    const unicodeMap = {
      μ: "µ", α: "α", β: "β", γ: "γ", δ: "δ", Ω: "Ω",
      "²": "²", "³": "³", "⁴": "⁴",
      "°": "°", "±": "±", "×": "x", "÷": "/",
      "\\u03bc": "µ", "\\u00b5": "µ", "\\u00b0": "°",
      "\\u00b1": "±", "\\u00b2": "²", "\\u00b3": "³",
    };

    const processUnicodeText = (text) => {
      if (!text) return "";
      let processedText = text;
      processedText = processedText.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
        const char = String.fromCharCode(parseInt(hex, 16));
        return unicodeMap[char] || char;
      });
      Object.keys(unicodeMap).forEach((unicode) => {
        const regex = new RegExp(unicode, "g");
        processedText = processedText.replace(regex, unicodeMap[unicode]);
      });
      return processedText;
    };

    const extractPatientRefNoNumber = (refNo) => {
      if (!refNo) return "N/A";
      const numberPart = refNo.split("+")[0];
      return numberPart;
    };

    const consultants = [
      ["Dr. Rajesh Sengodan M.D.", "Consultant Microbiologist"],
      ["Dr. S. Brindha M.D.", "Consultant Pathologist", Brindha],
    ];

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
  "Molecular Biology"
];

    const patientRefNo = patientDetails.barcodes?.[0]?.match(/\d+/)?.[0] || "N/A";
    const patientRefNoNumber = extractPatientRefNoNumber(patientRefNo);

    // Generate Barcode
    let barcodeImage = null;
    if (patientRefNoNumber !== "N/A") {
      const barcodeCanvas = document.createElement("canvas");
      JsBarcode(barcodeCanvas, patientRefNoNumber, {
        format: "CODE128", lineColor: "#000", width: 1.5,
        height: 10, displayValue: false, margin: 0,
      });
      barcodeImage = barcodeCanvas.toDataURL("image/png");
    }

    // Document dimensions
    const leftMargin = 10;
    const rightMargin = leftMargin + 190;
    const contentWidth = rightMargin - leftMargin;
    const headerHeight = 30;
    const footerHeight = 20;
    const contentYStart = headerHeight + 20;
    const signatureHeight = 25;
    const tableHeaderHeight = 10;

    // Column widths
    const colWidths = [
      contentWidth * 0.28, // Test Description
      contentWidth * 0.12, // Specimen Type
      contentWidth * 0.05, // Extra Gap
      contentWidth * 0.13, // Value(s)
      contentWidth * 0.1,  // Unit
      contentWidth * 0.17, // Reference Range
      contentWidth * 0.15, // Method
    ];

    // Patient information - UPDATED TO MATCH SECOND HANDLEPRINT
    const leftDetails = [
      { label: "UHID", value: patientDetails.patient_id || "N/A" },
      { label: "Name", value: patientDetails.patientname || "No name provided" },
      { label: "Age/Gender", value: `${patientDetails.age || "N/A"} ${patientDetails.age_type || ""}/ ${patientDetails.gender || "N/A"}` },
      { label: "Referral", value: patientDetails.refby || "SELF" },
    ];

    const rightDetails = [
      {
        label: "Collected On",
        value: format(new Date(patientDetails.testdetails[0].samplecollected_time), "dd MMM yy / HH:mm") || "N/A",
      },
      {
        label: "Received On",
        value: format(new Date(patientDetails.testdetails[0].received_time), "dd MMM yy / HH:mm") || "N/A",
      },
      { label: "Reported Date", value: format(new Date(), "dd MMM yy / hh:mm") },
      { label: "Patient Ref.No", value: patientRefNoNumber },
    ];

    const calculateMaxLabelWidth = (details) => {
      const tempDoc = new jsPDF();
      return Math.max(...details.map((item) => tempDoc.getTextWidth(item.label)));
    };

    const doc = new jsPDF();
    let pageCount = 1;
    let isTableStarted = false;

  const addPatientInfo = (yPos) => {
  const leftMaxLabelWidth = calculateMaxLabelWidth(leftDetails);
  const rightMaxLabelWidth = calculateMaxLabelWidth(rightDetails);
  const centerPoint = (leftMargin + rightMargin) / 2;
  const leftLabelX = leftMargin;
  const leftColonX = leftLabelX + leftMaxLabelWidth + 2;
  const leftValueX = leftColonX + 3;
  const rightLabelX = centerPoint + 28;
  const rightColonX = rightLabelX + rightMaxLabelWidth + 2;
  const rightValueX = rightColonX + 1;

  doc.setFontSize(10);
  let patientInfoY = yPos;

  for (let i = 0; i < leftDetails.length; i++) {
    const left = leftDetails[i];
    const right = rightDetails[i];

    // Handle left side
    doc.setFont("helvetica", "bold");
    doc.text(left.label, leftLabelX, patientInfoY);
    doc.text(":", leftColonX, patientInfoY);
    doc.setFont("helvetica", "normal");
    
    // Wrap left value to prevent overlap with right side
    const maxLeftValueWidth = centerPoint + 25 - leftValueX; // Stop just before right side
    const leftValueLines = wrapTextAndGetLines(doc, left.value, maxLeftValueWidth);
    
    leftValueLines.forEach((line, lineIndex) => {
      doc.text(line, leftValueX, patientInfoY + (lineIndex * 4));
    });
    
    const leftRowHeight = leftValueLines.length * 4;

    // Handle right side
    if (right) {
      doc.setFont("helvetica", "bold");
      doc.text(right.label, rightLabelX, patientInfoY);
      doc.text(":", rightColonX, patientInfoY);
      doc.setFont("helvetica", "normal");
      doc.text(right.value, rightValueX, patientInfoY);

      if (right.label === "Patient Ref.No" && patientRefNoNumber !== "N/A" && barcodeImage) {
            doc.addImage(barcodeImage, "PNG", rightValueX + doc.getTextWidth(right.value) - 18,
              patientInfoY + 4, 25, 10);
          }
    }
    
    // Move to next row
    patientInfoY += Math.max(leftRowHeight, 5);
  }
  
  return patientInfoY;
};

    const addHeaderFooter = () => {
      if (withLetterpad) {
        doc.addImage(headerImage, "PNG", 0, 10, doc.internal.pageSize.width, headerHeight);
        const footerY = doc.internal.pageSize.height - footerHeight;
        doc.addImage(FooterImage, "PNG", 0, footerY, doc.internal.pageSize.width, footerHeight);
      } else {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(255, 255, 255);
        doc.text("Header Space", leftMargin, 10);
        doc.setTextColor(0, 0, 0);
      }
    };

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

    const drawTableHeader = (yPos) => {
      doc.line(leftMargin, yPos, rightMargin, yPos);
      yPos += 5;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const headers = ["Test", "Specimen", "", "Result", "Units", "Reference Value", "Method"];
      let xPos = leftMargin;
      headers.forEach((header, index) => {
        if (header) {
          doc.text(header, xPos, yPos);
        }
        xPos += colWidths[index];
      });

      yPos += 3;
      doc.line(leftMargin, yPos, rightMargin, yPos);
      yPos += 5;
      return yPos;
    };

    const wrapTextAndGetLines = (doc, text, maxWidth) => {
      if (!text) return [];
      return doc.splitTextToSize(text, maxWidth);
    };

    const renderWrappedText = (doc, text, maxWidth, startX, yPos, lineHeight = 4) => {
      if (!text) return 0;
      const lines = wrapTextAndGetLines(doc, text, maxWidth);
      lines.forEach((line, index) => {
        doc.text(line, startX, yPos + index * lineHeight);
      });
      return lines.length * lineHeight;
    };

    const addSignatures = () => {
      const pageHeight = doc.internal.pageSize.height;
      const signaturesY = pageHeight - footerHeight - signatureHeight - 10;
      const signatureWidth = 35;
      const availableWidth = contentWidth - (signatureWidth / 2) * 2;
      const signatureSpacing = availableWidth / (consultants.length - 1);

      const approvers = new Set();
      patientDetails.testdetails.forEach((test) => {
        if (test.approve_by && test.approve_by.trim() !== "") {
          approvers.add(test.approve_by.toLowerCase());
        }
      });

      consultants.forEach((consultant, index) => {
        const xPosition = leftMargin + index * signatureSpacing;
        const consultantName = consultant[0].toLowerCase();
        const shouldShowSignature =
          (consultantName.includes("brindha") && approvers.has("dr.brindha")) ||
          (consultantName.includes("vijayan") && approvers.has("vijayan"));

        if (consultant[2] && shouldShowSignature) {
          doc.addImage(consultant[2], "PNG", xPosition, signaturesY, signatureWidth, 15);
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(consultant[0], xPosition, signaturesY + 15);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(consultant[1], xPosition, signaturesY + 20);
      });
    };

    const checkForNewPage = (yPos, estimatedHeight) => {
      const pageHeight = doc.internal.pageSize.height;
      const footerStart = pageHeight - (footerHeight + signatureHeight + 15);

      if (yPos + estimatedHeight >= footerStart) {
        addSignatures();
        doc.addPage();
        pageCount++;
        addHeaderFooter();
        let newYPos = contentYStart;
        newYPos = addPatientInfo(newYPos);
        newYPos += 10;
        if (isTableStarted) {
          newYPos = drawTableHeader(newYPos);
        }
        return newYPos;
      }
      return yPos;
    };

    const getHighLowStatus = (value, reference) => {
      if (!value || !reference) return null;
      const numValue = Number.parseFloat(value);
      if (isNaN(numValue)) return null;

      if (reference.includes("-")) {
        const [min, max] = reference.split("-").map((v) => Number.parseFloat(v));
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

    // Start PDF generation
    addHeaderFooter();
    let currentYPosition = addPatientInfo(contentYStart);
    currentYPosition += 10;

    if (patientDetails.testdetails.length) {
      isTableStarted = true;
      currentYPosition = checkForNewPage(currentYPosition, tableHeaderHeight);
      let yPos = currentYPosition;
      yPos = drawTableHeader(yPos);

      const testsByDepartment = patientDetails.testdetails.reduce((acc, test) => {
  (acc[test.department] = acc[test.department] || []).push(test);
  return acc;
}, {});


// Sort departments according to the specified order
const sortedDepartments = Object.keys(testsByDepartment).sort((a, b) => {
  const indexA = departmentOrder.indexOf(a);
  const indexB = departmentOrder.indexOf(b);
  
  // If both departments are in the order list, sort by their index
  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  }
  // If only A is in the list, it comes first
  if (indexA !== -1) return -1;
  // If only B is in the list, it comes first
  if (indexB !== -1) return 1;
  // If neither is in the list, sort alphabetically
  return a.localeCompare(b);
});

      sortedDepartments.forEach((department) => {
  // Collect all verified_by values in this department
  const verifiedBySet = new Set();
  testsByDepartment[department].forEach((test) => {
    if (test.verified_by && test.verified_by.trim() !== "") {
      verifiedBySet.add(test.verified_by);
    }
  });

  // Check if multiple people verified tests in this department
  const hasMultipleVerifiers = verifiedBySet.size > 1;

  testsByDepartment[department].forEach((test, testIndex) => {
    const testsToRender =
      test.parameters && test.parameters.length > 0
        ? [test, ...test.parameters]
        : [test];

    // Calculate heights for each row
    const testRowHeights = [];
    
    testsToRender.forEach((currentTest, index) => {
      const testNameText = index === 0 ? currentTest.testname : `${currentTest.name}`;
      const testNameLines = wrapTextAndGetLines(doc, testNameText, colWidths[0] - 2);
      
      const valueText = currentTest.value || "";
      const valueLines = wrapTextAndGetLines(doc, valueText, colWidths[3] - 2);
      
      const referenceLines = wrapTextAndGetLines(
        doc,
        currentTest.reference_range || "",
        colWidths[5] - 2
      );
      
      const methodText = (currentTest.method || "").replace(/\bMethod\b/i, "").trim();
      const methodLines = wrapTextAndGetLines(doc, methodText, colWidths[6] - 2);
      
      const maxLines = Math.max(
        testNameLines.length,
        valueLines.length,
        referenceLines.length,
        methodLines.length
      );
      const lineHeight = 4;
      let actualRowHeight = maxLines * lineHeight + 2;
      
      // Add height for parameter-specific comment if exists
      if (index > 0 && currentTest.comment && currentTest.comment.trim() !== "") {
        const paramCommentText = `Note: ${currentTest.comment}`;
        const paramCommentLines = wrapTextAndGetLines(
          doc,
          paramCommentText,
          colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] - 2
        );
        actualRowHeight += (paramCommentLines.length * 3.5) + 2;
      }
      
      testRowHeights.push(actualRowHeight);
    });

    // Calculate minimum height needed
    const departmentHeight = 15; // Department header height
    let minRequiredHeight = testRowHeights[0] + 4; // Test name row
    if (testRowHeights.length > 1) {
      minRequiredHeight += testRowHeights[1] + 4; // First parameter row
    }

    // Add department header height only for first test in department
    if (testIndex === 0) {
      minRequiredHeight += departmentHeight;
    }

    // Add extra height for outsourced note if present
    if (test.outsourced === true) {
      minRequiredHeight += 4;
    }

    // Add extra height for comment if present
    if (test.comment && test.comment.trim() !== "") {
      const commentText = `Note: ${test.comment}`;
      const commentLines = wrapTextAndGetLines(
        doc,
        commentText,
        colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] - 2
      );
      minRequiredHeight += (commentLines.length * 3.5) + 2;
    }

    // Add height for individual "Verified by" if multiple verifiers in department
    if (hasMultipleVerifiers && test.verified_by && test.verified_by.trim() !== "") {
      minRequiredHeight += 6;
    }

    // CRITICAL CHECK: Ensure department + test name + at least first parameter fit together
    yPos = checkForNewPage(yPos, minRequiredHeight);

    // Render department header only for first test in department
    if (testIndex === 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      const textWidth = doc.getTextWidth(department.toUpperCase());
      const centerX = leftMargin + contentWidth / 2;
      doc.text(department.toUpperCase(), centerX, yPos, { align: "center" });
      doc.line(centerX - textWidth / 2, yPos + 2, centerX + textWidth / 2, yPos + 2);
      yPos += 10;
    }

    // NOW render all rows
    testsToRender.forEach((currentTest, index) => {
      doc.setFontSize(10);
      
      const testNameText = index === 0 ? currentTest.testname : `${currentTest.name}`;
      const valueText = currentTest.value || "";
      const methodText = (currentTest.method || "").replace(/\bMethod\b/i, "").trim();
      
      const lineHeight = 4;
      const actualRowHeight = testRowHeights[index];

      // For rows after the first parameter, check individually
      if (index > 1) {
        yPos = checkForNewPage(yPos, actualRowHeight);
      }

      let xPos = leftMargin;

      // Column 1: Test/Parameter Name
      if (index === 0) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }
      renderWrappedText(doc, testNameText, colWidths[0] - 2, xPos, yPos, lineHeight);
      xPos += colWidths[0];

      doc.setFont("helvetica", "normal");

      // Column 2: Specimen Type
      doc.text(currentTest.specimen_type || "", xPos, yPos);
      xPos += colWidths[1];

      // Column 3: Extra Gap
      xPos += colWidths[2];

      // Column 4: Value with High/Low indicators
      const statusIndicator = currentTest.isHigh
        ? "H"
        : currentTest.isLow
        ? "L"
        : getHighLowStatus(valueText, currentTest.reference_range);

      if (statusIndicator) {
        doc.setFont("helvetica", "bold");
        if (statusIndicator === "H") {
          doc.setTextColor(255, 0, 0);
        } else if (statusIndicator === "L") {
          doc.setTextColor(0, 0, 255);
        }
        renderWrappedText(doc, valueText, colWidths[3] - 5, xPos, yPos, lineHeight);
        const valueWidth = doc.getTextWidth(valueText);
        if (valueWidth < colWidths[3] - 5) {
          if (statusIndicator === "H") {
            drawArrowSymbol(doc, xPos + valueWidth + 2, yPos - 1, "up");
          } else if (statusIndicator === "L") {
            drawArrowSymbol(doc, xPos + valueWidth + 2, yPos - 1, "down");
          }
        }
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
      } else {
        renderWrappedText(doc, valueText, colWidths[3] - 2, xPos, yPos, lineHeight);
      }
      xPos += colWidths[3];

      // Column 5: Unit
      renderUnicodeText(currentTest.unit || "", xPos, yPos);
      xPos += colWidths[4];

      // Column 6: Reference Range
      renderWrappedText(
        doc,
        currentTest.reference_range || "",
        colWidths[5] - 2,
        xPos,
        yPos,
        lineHeight
      );
      xPos += colWidths[5];

      // Column 7: Method
      doc.setTextColor(0, 0, 0);
      renderWrappedText(doc, methodText, colWidths[6] - 2, xPos, yPos, lineHeight);

      // Move yPos down after rendering the row
      yPos += actualRowHeight + 3;

      // Add parameter-specific comment if exists (AFTER moving yPos)
      if (index > 0 && currentTest.comment && currentTest.comment.trim() !== "") {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        const paramCommentText = `Note: ${currentTest.comment}`;
        const paramCommentHeight = renderWrappedText(
          doc,
          paramCommentText,
          colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] - 2,
          leftMargin,
          yPos,
          3.5
        );
        yPos += paramCommentHeight + 2;
      }

      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
    });

    // Add outsourced note after all test rows
    if (test.outsourced === true) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.text("(Outsourced)", leftMargin, yPos);
      yPos += 4;
    }

    // Add test-level comment after all test rows
    if (test.comment && test.comment.trim() !== "") {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      const commentText = `Note: ${test.comment}`;
      const commentHeight = renderWrappedText(
        doc,
        commentText,
        colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] - 2,
        leftMargin,
        yPos,
        3.5
      );
      yPos += commentHeight + 2;
    }

    // Display "Verified by" under each test if multiple verifiers in department
    if (hasMultipleVerifiers && test.verified_by && test.verified_by.trim() !== "") {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`Verified by: ${test.verified_by}`, leftMargin, yPos);
      yPos += 6;
    }
  });

  // Display "Verified by" once at end of department only if single verifier
  if (!hasMultipleVerifiers && verifiedBySet.size > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const verifiedByText = `Verified by: ${Array.from(verifiedBySet).join(", ")}`;
    doc.text(verifiedByText, leftMargin, yPos);
    yPos += 8;
  }

  yPos += 4;
});

      currentYPosition = yPos;
    }

    isTableStarted = false;

    const ensureSpaceForFooter = (currentYPosition) => {
      const pageHeight = doc.internal.pageSize.height;
      const footerStart = pageHeight - (footerHeight + signatureHeight + 15);
      if (currentYPosition + 10 >= footerStart) {
        addSignatures();
        doc.addPage();
        pageCount++;
        addHeaderFooter();
        return addPatientInfo(contentYStart);
      }
      return currentYPosition;
    };

    currentYPosition = ensureSpaceForFooter(currentYPosition);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const centerX = leftMargin + contentWidth / 2;
    doc.text("**End of the Report**", centerX, currentYPosition, { align: "center" });

    addSignatures();

    const finalPageCount = pageCount;
    for (let i = 1; i <= finalPageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.height;
      const pageNumberY = pageHeight - footerHeight - 10;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const centerX = leftMargin + contentWidth / 2;
      doc.text(`Page ${i} of ${finalPageCount}`, centerX, pageNumberY, { align: "center" });
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

  const showDropdown = (patientId) => {
    setActiveDropdownPatientId(patientId);
  };

  const hideDropdown = () => {
    setActiveDropdownPatientId(null);
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "Registered":
        return "#6C757D"; // Gray for Registered
      case "Collected":
        return "#007BFF"; // Blue for Collected
      case "Partially Collected":
        return "#FFC107"; // Yellow for Partially Collected
      case "Received":
        return "#28A745"; // Green for Received
      case "Partially Received":
        return "#17A2B8"; // Teal for Partially Received
      case "Tested":
        return "#8A2BE2"; // Purple for Tested
      case "Partially Tested":
        return "#FFA500"; // Orange for Partially Tested
      case "Approved":
        return "#00C851"; // Bright Green for Approved
      case "Partially Approved":
        return "#FFBB33"; // Light Orange for Partially Approved
      case "Dispatched":
        return "#2a6e19ff"; // Grey for Dispatched
      default:
        return "#0f999eff"; // Default Gray
    }
  };

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
          <Title>Shanmuga Patient Status</Title>
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
              <FilterLabel>Select Referral</FilterLabel>
              <FilterSelect
                value={refBy}
                onChange={(e) => setRefBy(e.target.value)}
              >
                <option value="">Select Refby</option>
                {refByOptions.map((refby, index) => (
                  <option key={index} value={refby.name}>
                    {refby.name}
                  </option>
                ))}
              </FilterSelect>
               
            </FilterGroup>            
            <FilterGroup>
              <FilterLabel>OP Number</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter OP Number"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </FilterGroup>
             <FilterGroup>
              <FilterLabel>IP Number</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter IP Number"
                value={IPNumber}
                onChange={(e) => setIPNumber(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Barcode</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter Barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
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
              <FilterLabel>OP/IP Type</FilterLabel>
              <FilterSelect
                value={opIpFilter}
                onChange={(e) => setopIpFilter(e.target.value)}
              >
                <option value="">All Type</option>
                <option value="OP">OP</option>
                <option value="IP">IP</option>
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

        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <th>Date</th>
                <th>OP/IP Type</th>
                <th>OP Number</th>
                <th>IP Number</th>
                <th>Barcode</th>
                <th>Patient Name</th>                
                <th>Referral</th>
                <th>Status</th>
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
              ) : error ? (
                <tr>
                  <td
                    colSpan={9}
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
                const barcode = patientStatus.barcode || patient.barcode || "N/A";
                const isPrintMailEnabled = isPrintAndMailEnabled(status);
                const isDispatchEnabledFlag = isDispatchEnabled(status);
                const isSortingEnabledFlag = isSortingEnabled(status);
                const badgeColor = getBadgeColor(status);

                  return (
                    <tr key={`${patient.patient_id}-${patient.barcode}`}>
                      <td>
                        {patient.date
                          ? format(new Date(patient.date), "yyyy-MM-dd")
                          : "N/A"}
                      </td>
                      <td>{patient.opiptype}</td>
                      <td>{patient.patient_id}</td>
                      <td>{patient.ipnumber}</td>
                      <td>{barcode}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <GenderIcon gender={patient.gender}>
                            {patient.gender === "Female" ? (
                              <IoIosFemale size={14} />
                            ) : (
                              <IoIosMale size={14} />
                            )}
                          </GenderIcon>
                          {patient.patient_name}
                        </div>
                      </td>
                      <td>{patient.refby || "N/A"}</td>
                      <td>
                        <Badge color={badgeColor}>{status}</Badge>
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
                            onMouseEnter={() =>
                              isPrintMailEnabled &&
                              showDropdown(patient.patient_id)
                            }
                            onMouseLeave={hideDropdown}
                          >
                            <ActionButton
                              disabled={!isPrintMailEnabled}
                              title="Print Options"
                            >
                              <Printer size={16} />
                            </ActionButton>

                            {isPrintMailEnabled && (
                              <DropdownMenu
                                isVisible={
                                  activeDropdownPatientId === patient.patient_id
                                }
                              >
                                <DropdownItem
                                  onClick={() => handlePrint(patient, true)}
                                >
                                  Print with Letterpad
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => handlePrint(patient, false)}
                                >
                                  Print without Letterpad
                                </DropdownItem>
                              </DropdownMenu>
                            )}
                          </PrintDropdown>

                          <ActionButton
                            disabled={!isPrintMailEnabled}
                            onClick={() =>
                              isPrintMailEnabled && handleWhatsAppShare(patient)
                            }
                            title="Share via WhatsApp"
                          >
                            <MessageCircle size={16} />
                          </ActionButton>
                          <ActionButton
                            disabled={!isPrintMailEnabled}
                            onClick={() =>
                              isPrintMailEnabled && handleSendEmail(patient)
                            }
                            title="Send Email"
                          >
                            <Mail size={16} />
                          </ActionButton>

                          <ActionButton
                            disabled={!isDispatchEnabledFlag}
                            onClick={() =>
                              isDispatchEnabledFlag && handleDispatch(patient)
                            }
                            title="Dispatch"
                          >
                            <Flag size={16} />
                          </ActionButton>
                        </ActionContainer>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9}>
                    <NoData>No patients found</NoData>
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div
          style={{
            padding: "1rem 1.5rem",
            textAlign: "right",
            color: "var(--gray)",
            fontSize: "0.875rem",
            borderTop: "1px solid var(--gray-light)",
          }}
        >
          Showing {filteredPatients.length} {filteredPatients.length === 1 ? "entry" : "entries"}
        </div>
      </Card>

      {/* Test Sorting Modal */}
      {isTestModalOpen && (
        <HMSTestSorting
          patient={selectedPatient}
          onClose={() => setIsTestModalOpen(false)}
        />
      )}

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
          >
                     </div>
        )}
      </Modal>
    </Container>
  );
};

export default HMSPatientOverview;