import React, { useEffect, useState } from "react";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";
import { format } from "date-fns";
import Modal from "react-modal";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "react-datepicker/dist/react-datepicker.css";
import FranchiseTestSorting from "./FranchiseTestSorting";
import PatientOverallReport from "../Finance/PatientOverallReport";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import images
import headerImage from "../Images/Header.png";
import FooterImage from "../Images/Footer.png";
import Vijayan from "../Images/Vijayan.png";
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

const FranchiseOverview = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activeDropdownPatientId, setActiveDropdownPatientId] = useState(null);
  const [branch, setBranch] = useState("");
  const [refBy, setRefBy] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("hms");
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

 // Set active tab based on current route
  useEffect(() => {
    if (location.pathname === "/PatientOverview") {
      setActiveTab("reference");
    } else if (location.pathname === "/FranchiseOverview") {
      setActiveTab("franchise");
      } else if (location.pathname === "/HMSPatientOverview") {
      setActiveTab("hms");
    }
  }, [location.pathname]);

  // Handle tab navigation
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "reference") {
      navigate("/PatientOverview");
    } else if (tab === "franchise") {
      navigate("/FranchiseOverview");
       } else if (tab === "hms") {
      navigate("/HMSPatientOverview");
    }
  };

  // Fetch patients when component mounts
  useEffect(() => {
    const fetchCombinedPatientData = async () => {
      setLoading(true);
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      try {
        const response = await apiRequest(
          `${Labbaseurl}franchise_overall_report/`,
          "GET",
          null,
          {},
          {
            params: {
              from_date: formattedStartDate,
              to_date: formattedEndDate,
            },
          }
        );

        if (response.success) {
          const patientData = response.data;

          // Set the full and filtered patient list
          setPatients(patientData);
          setFilteredPatients(patientData);

          // Optional: extract and store status/barcode mappings if needed separately
          const statusMap = {};
          patientData.forEach((patient) => {
            statusMap[patient.patient_id] = {
              status: patient.status,
              barcode: patient.barcode,
            };
          });
          setStatuses(statusMap); // if you're maintaining a separate `statuses` state
        } else {
          console.error("API Error:", response.error);
          setError(response.error || "Failed to load patient data");

          // Optional: Show toast notification
          toast.error(response.error || "Failed to load patient data");
        }
      } catch (error) {
        console.error("Unexpected error in fetchCombinedPatientData:", error);
        setError("An unexpected error occurred");

        // Optional: Show toast notification
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
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

  // Filter patients based on multiple criteria
  useEffect(() => {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    const filtered = patients.filter((patient) => {
      const patientDate = new Date(patient.date);
      const patientStatus = statuses[patient.patient_id]?.status || "";
      return (
        patientDate >= startOfDay &&
        patientDate <= endOfDay &&
        (!branch || patient.branch === branch) &&
        (!refBy || patient.refby === refBy) &&
        (!patientId || patient.patient_id.includes(patientId)) &&
        (!patientName ||
          patient.patient_name
            ?.toLowerCase()
            .includes(patientName.toLowerCase())) &&
        (!statusFilter || patientStatus === statusFilter)
      );
    });
    setFilteredPatients(filtered);
  }, [
    startDate,
    endDate,
    patients,
    branch,
    refBy,
    patientId,
    patientName,
    statusFilter,
    statuses,
  ]);
  // Update the clearFilters function to reset the status filter
  const clearFilters = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setBranch("");
    setRefBy("");
    setPatientId("");
    setPatientName("");
    setStatusFilter("");
    setFilteredPatients(patients);
  };

  const handleDispatch = async (patient) => {
    try {
      const response = await axios.patch(
        `${Labbaseurl}update_dispatch_status/${patient.patient_id}/`
      );

      if (response.status === 200) {
        alert(
          `Dispatch updated successfully for Patient: ${patient.patient_name}`
        );
        // Refresh the data
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];

        axios
          .get(`${Labbaseurl}overall_report/`, {
            params: {
              from_date: formattedStartDate,
              to_date: formattedEndDate,
            },
          })
          .then((response) => {
            setPatients(response.data);
            setFilteredPatients(response.data);
          });
      }
    } catch (error) {
      console.error("Error updating dispatch status:", error);
      alert(
        `Failed to update dispatch status for Patient: ${patient.patientname}`
      );
    }
  };
  const handleWhatsAppShare = async (patient) => {
    // console.log("handleWhatsAppShare called with patient:", patient);

    if (!patient || !patient.phone) {
      toast.error("Patient phone number is missing");
      return;
    }

    // Ensure phone number starts with +91
    let phoneNumber = patient.phone.startsWith("+91")
      ? patient.phone
      : `+91${patient.phone}`;
    // console.log("Updated Phone Number:", phoneNumber);

    try {
      // console.log("Uploading PDF...");

      // **Open a blank tab first (avoids popup blocking)**
      const whatsappWindow = window.open("about:blank", "_blank");

      // Generate the PDF file
      const pdfBlob = await handlePrint(patient, true);
      if (!pdfBlob) {
        toast.error("Failed to generate the PDF");
        return;
      }

      // Prepare FormData for file upload
      const formData = new FormData();
      formData.append(
        "file",
        new File(
          [pdfBlob],
          `${patient.patient_name || "Patient"}_TestDetails.pdf`,
          {
            type: "application/pdf",
          }
        )
      );

      // Upload PDF file
      const uploadResponse = await axios.post(
        `${Labbaseurl}upload-pdf/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Get the uploaded file URL
      const fileUrl = uploadResponse.data.file_url;
      if (!fileUrl) {
        toast.error("File upload failed");
        return;
      }

      // **Formatted WhatsApp Message**
      const labName = "Shanmuga Diagnostic"; // Replace with actual lab name
      const labPhone = "+91 98765 43210"; // Replace with actual lab contact number
      const address = "24, Saratha Clg Rd, Salem, PIN-636007"; // Replace with actual address
      const footerNote = "_For any queries, please contact our lab._"; // Italicized message for support

      const message = encodeURIComponent(
        `🧪 *${labName}* 🏥\n` +
          `📍 *Address:* ${address}\n` +
          `📞 *Contact:* ${labPhone}\n\n` +
          `👤 *Patient Name:* ${patient.patient_name || "N/A"}\n` +
          `🆔 *Patient ID:* ${patient.patient_id || "N/A"}\n\n` +
          `📝 *Test Details:*\n` +
          `📄 Your test report is ready!\n` +
          `🔗 *Download Report:* ${fileUrl}\n\n` +
          `${footerNote}`
      );

      // **Generate the final WhatsApp Web URL**
      const finalWhatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
      // console.log("Opening WhatsApp Web:", finalWhatsAppUrl);

      // **Update the previously opened tab with the WhatsApp Web URL**
      if (whatsappWindow) {
        whatsappWindow.location.href = finalWhatsAppUrl;
      } else {
        window.open(finalWhatsAppUrl, "_blank");
      }

      toast.success("WhatsApp message sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to share via WhatsApp.");
    }
  };

  const handleSendEmail = async (patient) => {
    try {
      const pdfBlob = await handlePrint(patient, true); // Generate PDF with letterpad
      if (!pdfBlob) {
        toast.error(":x: Failed to generate the PDF.");
        return;
      }
      if (!patient.email) {
        toast.warning(":warning: Patient email is missing.");
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
      await axios.post(`${Labbaseurl}send-email/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(":white_check_mark: Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(":x: Failed to send email.");
    }
  };

  const handlePrint = async (patient, withLetterpad = true) => {
    try {
      // setLoading(true);

      console.log("Fetching patient details for barcode:", patient.barcode);
      const response = await apiRequest(
        `${Labbaseurl}franchise_patient_test_details/?barcode=${patient.barcode}`,
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
        // Merge testdetails from all records
        patientDetails = {
          ...response.data[0], // Use first record for base patient info
          testdetails: response.data.flatMap(
            (record) => record.testdetails || []
          ),
        };
      }

      console.log("Processed Patient Details:", patientDetails);
      if (
        !patientDetails.testdetails ||
        patientDetails.testdetails.length === 0
      ) {
        console.error("No test details found for the patient.");
        toast.error("No test details found for the patient.");
        setLoading(false);
        return null;
      }

      // Enhanced Unicode character mapping for medical units
      const unicodeMap = {
        // Greek letters
        μ: "µ", // Alternative mu symbol that works better in PDF
        α: "α",
        β: "β",
        γ: "γ",
        δ: "δ",
        Ω: "Ω",
        // Superscript numbers
        "²": "²",
        "³": "³",
        "⁴": "⁴",
        // Medical symbols
        "°": "°",
        "±": "±",
        "×": "x",
        "÷": "/",
        // Common Unicode escapes
        "\\u03bc": "µ", // μ
        "\\u00b5": "µ", // µ (micro sign)
        "\\u00b0": "°", // degree
        "\\u00b1": "±", // plus-minus
        "\\u00b2": "²", // superscript 2
        "\\u00b3": "³", // superscript 3
      };

      // Enhanced function to handle Unicode characters in text
      const processUnicodeText = (text) => {
        if (!text) return "";

        let processedText = text;

        // Handle Unicode escape sequences first
        processedText = processedText.replace(
          /\\u([0-9a-fA-F]{4})/g,
          (match, hex) => {
            const char = String.fromCharCode(parseInt(hex, 16));
            return unicodeMap[char] || char;
          }
        );

        // Handle direct Unicode characters
        Object.keys(unicodeMap).forEach((unicode) => {
          const regex = new RegExp(unicode, "g");
          processedText = processedText.replace(regex, unicodeMap[unicode]);
        });

        return processedText;
      };

      // Function to extract the number from patient_ref_no
      const extractPatientRefNoNumber = (refNo) => {
        if (!refNo) return "N/A";
        const numberPart = refNo.split("+")[0];
        return numberPart;
      };

      // Adding Consultant names and qualifications
      const consultants = [
        ["Dr. S. Brindha M.D.", "Consultant Pathologist"],
        ["Dr. Rajesh Sengodan M.D.", "Consultant Microbiologist"],
        ["Dr. R. VIJAYAN Ph.D.", "Consultant Biochemist", Vijayan],
      ];

      const patientRefNo =
        patientDetails.barcodes?.[0]?.match(/\d+/)?.[0] || "N/A";
      const patientRefNoNumber = extractPatientRefNoNumber(patientRefNo);

      // Generate Barcode only if patientRefNoNumber is not "N/A"
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

      // FIXED: Define consistent margins and dimensions regardless of letterpad
      const leftMargin = 10;
      const rightMargin = leftMargin + 190; // Total document width is 210, content width is 190
      const contentWidth = rightMargin - leftMargin; // Consistent content width (190)

      // FIXED: Consistent header and footer heights regardless of letterpad
      const headerHeight = 30; // Always reserve space for header
      const footerHeight = 20; // Always reserve space for footer
      const contentYStart = headerHeight + 15; // Start content below the header area
      const signatureHeight = 25; // Height needed for signatures
      const disclaimerHeight = 0; // No disclaimer needed
      const tableHeaderHeight = 10; // Height needed for table header

      // Column widths adjusted to fit within content margins
      const colWidths = [
        contentWidth * 0.28, // Test Description
        contentWidth * 0.12, // Specimen Type
        contentWidth * 0.05, // Extra Gap (Added)
        contentWidth * 0.13, // Value(s)
        contentWidth * 0.1, // Unit
        contentWidth * 0.17, // Reference Range
        contentWidth * 0.15, // Method (Moved to last)
      ];

      // Patient information (left and right sides)
      const leftDetails = [
        { label: "Reg.ID", value: patientDetails.patient_id || "N/A" },
        {
          label: "Name",
          value: patientDetails.patientname || "No name provided",
        },
        {
          label: "Age/Gender",
          value: `${patientDetails.age || "N/A"} / ${
            patientDetails.gender || "N/A"
          }`,
        },
        { label: "Referral", value: patientDetails.refby || "SELF" },
        { label: "Branch", value: patientDetails.branch || "N/A" },
        { label: "Source", value: patientDetails.B2B || "N/A" },
      ];

      const rightDetails = [
        {
          label: "Collected On",
          value:
            format(
              new Date(patientDetails.testdetails[0].samplecollected_time),
              "dd MMM yy / HH:mm"
            ) || "N/A",
        },
        {
          label: "Received On",
          value:
            format(
              new Date(patientDetails.testdetails[0].received_time),
              "dd MMM yy / HH:mm"
            ) || "N/A",
        },
        {
          label: "Reported Date",
          value: format(new Date(), "dd MMM yy / hh:mm"),
        },
        { label: "Patient Ref.No", value: patientRefNoNumber },
      ];

      // Function to calculate max width for alignment
      const calculateMaxLabelWidth = (details) => {
        const tempDoc = new jsPDF();
        return Math.max(
          ...details.map((item) => tempDoc.getTextWidth(item.label))
        );
      };

      // Create the actual document
      const doc = new jsPDF();
      let pageCount = 1;
      let isTableStarted = false; // Track if we're in the table section

      // Add Patient Info function
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

          doc.setFont("helvetica", "bold");
          doc.text(left.label, leftLabelX, patientInfoY);
          doc.text(":", leftColonX, patientInfoY);
          doc.setFont("helvetica", "bold");
          doc.text(left.value, leftValueX, patientInfoY);

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
              doc.addImage(
                barcodeImage,
                "PNG",
                rightValueX + doc.getTextWidth(right.value) - 10,
                patientInfoY + 2,
                25,
                8
              );
            }
          }

          patientInfoY += 5;
        }

        return patientInfoY;
      };

      // Function to add header and footer with consistent positioning
      const addHeaderFooter = () => {
        if (withLetterpad) {
          // Position header at the very top of the page with no left margin
          doc.addImage(
            headerImage,
            "PNG",
            0,
            5,
            doc.internal.pageSize.width,
            headerHeight
          );

          // Position footer at the very bottom of the page with no left margin
          const footerY = doc.internal.pageSize.height - footerHeight;
          doc.addImage(
            FooterImage,
            "PNG",
            0,
            footerY,
            doc.internal.pageSize.width,
            footerHeight
          );
        } else {
          // For non-letterpad version, add a simple header placeholder to maintain consistent spacing
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(255, 255, 255); // White text (invisible)
          doc.text("Header Space", leftMargin, 10);
          doc.setTextColor(0, 0, 0); // Reset to black
        }
      };

      // Enhanced text rendering function with Unicode support
      const renderUnicodeText = (text, x, y, options = {}) => {
        const processedText = processUnicodeText(text);

        // Handle special cases for common medical units
        if (processedText.includes("µ")) {
          // Split text around µ symbol and render parts separately
          const parts = processedText.split("µ");
          let currentX = x;

          parts.forEach((part, index) => {
            if (index > 0) {
              // Render µ symbol
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
          // Normal text rendering
          doc.text(processedText, x, y);
        }
      };

      // Function to draw table header
      const drawTableHeader = (yPos) => {
        // Draw Top Line - Use leftMargin and rightMargin for consistency
        doc.line(leftMargin, yPos, rightMargin, yPos);
        yPos += 5;

        // Table Header
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        // Updated headers array to match colWidths
        const headers = [
          "Test",
          "Specimen",
          "",
          "Result",
          "Units",
          "Reference Value",
          "Method",
        ];

        let xPos = leftMargin;

        headers.forEach((header, index) => {
          if (header) {
            // Avoid printing the extra gap column header
            doc.text(header, xPos, yPos);
          }
          xPos += colWidths[index]; // Move to the next column
        });

        yPos += 3;

        // Draw Bottom Line - Use leftMargin and rightMargin for consistency
        doc.line(leftMargin, yPos, rightMargin, yPos);
        yPos += 5;

        return yPos;
      };

      // Function to wrap text and return height with improved line height
      const wrapText = (doc, text, maxWidth, startX, yPos, lineHeight = 4) => {
        if (!text) return 0;
        const splitText = doc.splitTextToSize(text, maxWidth);
        splitText.forEach((line, index) => {
          doc.text(line, startX, yPos + index * lineHeight);
        });
        return splitText.length * lineHeight;
      };

      // Function to add signatures with consistent positioning
      const addSignatures = () => {
        const pageHeight = doc.internal.pageSize.height;
        // Calculate signature position with more space from footer
        const signaturesY = pageHeight - footerHeight - signatureHeight - 10; // Added extra 10 units for more space

        // REDUCED signature width from 40 to 30
        const signatureWidth = 35;
        const availableWidth = contentWidth - (signatureWidth / 2) * 2; // Space between left and right most signatures
        const signatureSpacing = availableWidth / (consultants.length - 1); // Space between each signature

        consultants.forEach((consultant, index) => {
          // Calculate position based on leftMargin to ensure consistency
          const xPosition = leftMargin + index * signatureSpacing;

          // Add Signature (if available) with reduced width
          if (consultant[2]) {
            doc.addImage(
              consultant[2],
              "PNG",
              xPosition,
              signaturesY,
              signatureWidth,
              15
            );
          }

          // Print name below the signature with REDUCED spacing
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text(consultant[0], xPosition, signaturesY + 15);

          // Print qualification below the name with REDUCED spacing
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text(consultant[1], xPosition, signaturesY + 20);
        });
      };

      // Function to check if we need to add a new page with consistent calculations
      const checkForNewPage = (yPos, estimatedHeight) => {
        const pageHeight = doc.internal.pageSize.height;
        // Use consistent footer space calculation for both versions
        const footerStart =
          pageHeight - (footerHeight + signatureHeight + disclaimerHeight + 12); // Added extra space

        // If content is approaching footer, move to a new page
        if (yPos + estimatedHeight >= footerStart) {
          // Add signatures to current page before creating new page
          addSignatures();

          doc.addPage();
          pageCount++;
          addHeaderFooter(); // Add header/footer

          let newYPos = contentYStart;
          newYPos = addPatientInfo(newYPos); // Add patient info on new page

          // If we're in the table section, add table header on new page
          if (isTableStarted) {
            newYPos = drawTableHeader(newYPos);
          }

          return newYPos; // Reset Y position for new page
        }
        return yPos;
      };

      // Function to determine whether a value is high or low compared to reference range
      const getHighLowStatus = (value, reference) => {
        if (!value || !reference) return null;

        // Convert value to number if possible
        const numValue = Number.parseFloat(value);
        if (isNaN(numValue)) return null;

        // Handle different reference range formats
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

      // Function to draw arrow symbols using lines (compatible with all PDF fonts)
      const drawArrowSymbol = (doc, x, y, direction) => {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);

        if (direction === "up") {
          // Draw up arrow using lines
          doc.line(x, y, x + 1, y - 1); // Left diagonal
          doc.line(x + 1, y - 1, x + 2, y); // Right diagonal
          doc.line(x + 1, y - 1, x + 1, y + 2); // Vertical line
        } else if (direction === "down") {
          // Draw down arrow using lines
          doc.line(x, y, x + 1, y + 1); // Left diagonal
          doc.line(x + 1, y + 1, x + 2, y); // Right diagonal
          doc.line(x + 1, y + 1, x + 1, y - 2); // Vertical line
        }
      };

      // Start generating the actual PDF
      addHeaderFooter();

      // Use addPatientInfo function
      let currentYPosition = addPatientInfo(contentYStart);

      // Test rendering logic with better page break handling and consistent alignment
      if (patientDetails.testdetails.length) {
        // Mark that we're starting the table section
        isTableStarted = true;

        // Check if we need a new page for the table header
        currentYPosition = checkForNewPage(currentYPosition, tableHeaderHeight);

        let yPos = currentYPosition;

        // Draw initial table header
        yPos = drawTableHeader(yPos);

        // Group Tests by Department
        const testsByDepartment = patientDetails.testdetails.reduce(
          (acc, test) => {
            (acc[test.department] = acc[test.department] || []).push(test);
            return acc;
          },
          {}
        );

        Object.keys(testsByDepartment).forEach((department) => {
          // Check if we need a new page for the department
          const departmentHeight = 15; // Height for department header
          yPos = checkForNewPage(yPos, departmentHeight);

          // Department Title with Underline - Center within content margins
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          const textWidth = doc.getTextWidth(department.toUpperCase());

          // Center within content margins
          const centerX = leftMargin + contentWidth / 2;
          doc.text(department.toUpperCase(), centerX, yPos, {
            align: "center",
          });
          doc.line(
            centerX - textWidth / 2,
            yPos + 2,
            centerX + textWidth / 2,
            yPos + 2
          );

          yPos += 10;

          // Render each test and its parameters
          testsByDepartment[department].forEach((test) => {
            // Check if parameters exist
            const testsToRender =
              test.parameters && test.parameters.length > 0
                ? [test, ...test.parameters]
                : [test];

            testsToRender.forEach((currentTest, index) => {
              // UPDATED: Increased estimated height for better text wrapping display
              const estimatedHeight = 18;

              // Check if we need a new page with better height estimation
              yPos = checkForNewPage(yPos, estimatedHeight);

              // Table data font size
              doc.setFontSize(10);

              // Start positions for each column
              let xPos = leftMargin;

              // Test Name should be in bold, parameter names normal
              if (index === 0) {
                doc.setFont("helvetica", "bold"); // Bold for main test
              } else {
                doc.setFont("helvetica", "normal"); // Normal for parameters
              }

              // Test Description with * for NABL tests
              const testNameText =
                index === 0 && currentTest.NABL
                  ? `${currentTest.testname}*`
                  : index === 0
                  ? currentTest.testname
                  : `${currentTest.name}`;
              const testNameHeight = wrapText(
                doc,
                testNameText,
                colWidths[0] - 2,
                xPos,
                yPos,
                4
              );
              xPos += colWidths[0];

              // Reset font to normal for other columns
              doc.setFont("helvetica", "normal");

              // Specimen Type
              doc.text(currentTest.specimen_type || "", xPos, yPos);
              xPos += colWidths[1];

              // Extra Gap
              xPos += colWidths[2];

              // Value(s) - Show indicator after the value
              const statusIndicator = currentTest.isHigh
                ? "H"
                : currentTest.isLow
                ? "L"
                : getHighLowStatus(
                    currentTest.value,
                    currentTest.reference_range
                  );

              const valueText = currentTest.value || "";

              // Keep value bold when there's an indicator
              if (statusIndicator) {
                doc.setFont("helvetica", "bold");
                if (statusIndicator === "H") {
                  doc.setTextColor(255, 0, 0); // Red for high
                } else if (statusIndicator === "L") {
                  doc.setTextColor(0, 0, 255); // Blue for low
                }
                doc.text(valueText, xPos, yPos);

                // Display indicator AFTER the value
                const valueWidth = doc.getTextWidth(valueText);
                if (statusIndicator === "H") {
                  drawArrowSymbol(doc, xPos + valueWidth + 2, yPos - 1, "up");
                } else if (statusIndicator === "L") {
                  drawArrowSymbol(doc, xPos + valueWidth + 2, yPos - 1, "down");
                }
                doc.setTextColor(0, 0, 0); // Reset to black
                doc.setFont("helvetica", "normal");
              } else {
                doc.text(valueText, xPos, yPos);
              }
              xPos += colWidths[3];

              // Unit
              doc.setFont("helvetica", "normal");
              renderUnicodeText(currentTest.unit || "", xPos, yPos);
              xPos += colWidths[4];

              // Reference Range with improved line height
              const referenceRangeHeight = wrapText(
                doc,
                currentTest.reference_range || "",
                colWidths[5] - 2,
                xPos,
                yPos,
                4
              );
              xPos += colWidths[5];

              // Method with improved line height
              doc.setTextColor(0, 0, 0);

              // Remove "Method" from the method name
              const methodText = (currentTest.method || "")
                .replace(/\bMethod\b/i, "")
                .trim();

              // Wrap the method text with improved line height
              const methodHeight = wrapText(
                doc,
                methodText,
                colWidths[6] - 2,
                xPos,
                yPos,
                4
              );

              doc.setTextColor(0, 0, 0); // Reset to black

              // Calculate row height based on maximum content height
              const maxContentHeight = Math.max(
                testNameHeight,
                referenceRangeHeight,
                methodHeight
              );

              // Increased minimum row spacing
              yPos += Math.max(maxContentHeight, 6) + 2;

              // Reset styling
              doc.setFont("helvetica", "normal");
              doc.setTextColor(0, 0, 0);
            });

            // Add "Verified by" under each test
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(
              `Verified by: ${test.verified_by || "N/A"}`,
              leftMargin,
              yPos
            );
            yPos += 8;

            // Reset font
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
          });

          yPos += 4;
        });

        currentYPosition = yPos;
      }

      // Mark that we're no longer in the table section
      isTableStarted = false;

      // Consistent space checking for both versions
      const ensureSpaceForFooter = (currentYPosition) => {
        const pageHeight = doc.internal.pageSize.height;
        const footerStart =
          pageHeight - (footerHeight + signatureHeight + disclaimerHeight + 12);

        if (currentYPosition + 10 >= footerStart) {
          addSignatures();
          doc.addPage();
          pageCount++;
          addHeaderFooter();
          return addPatientInfo(contentYStart);
        }
        return currentYPosition;
      };

      // Use this function before adding final content
      currentYPosition = ensureSpaceForFooter(currentYPosition);

      // Check for NABL tests
      const hasNABLTests = patientDetails.testdetails.some(
        (test) => test.NABL === true
      );

      if (hasNABLTests) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("*Test under NABL Scope", leftMargin, currentYPosition);
        currentYPosition += 5;
      }

      // End of report - Center within content margins
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const centerX = leftMargin + contentWidth / 2;
      doc.text("**End of the Report**", centerX, currentYPosition, {
        align: "center",
      });

      // Add signatures at the bottom of the last page
      addSignatures();

      // Get the final page count AFTER all content is rendered
      const finalPageCount = pageCount;

      // Add page numbers with consistent positioning for both versions
      for (let i = 1; i <= finalPageCount; i++) {
        doc.setPage(i);

        // Calculate position below signatures consistently
        const pageHeight = doc.internal.pageSize.height;
        const pageNumberY = pageHeight - footerHeight - 5;

        // Add the page number centered below signatures
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        const centerX = leftMargin + contentWidth / 2;
        doc.text(`Page ${i} of ${finalPageCount}`, centerX, pageNumberY, {
          align: "center",
        });
      }

      // Generate the PDF as a Blob and set file name with patientID
      const patientID = patientDetails.patient_id || "Unknown";
      const pdfFileName = `PatientReport_${patientID}.pdf`;
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create a temporary link to trigger download
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = pdfFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl); // Clean up the URL

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
        return "#808080"; // Grey for Dispatched
      default:
        return "#6C757D"; // Default Gray
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
          </NavigationContainer>
          <Title>Franchise Patient Status</Title>
        </CardHeader>

        <FiltersContainer>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Branch</FilterLabel>
              <FilterSelect
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              >
                <option value="">Select a Branch</option>
                <option value="Shanmuga Reference Lab">
                  Shanmuga Reference Lab
                </option>
              </FilterSelect>
            </FilterGroup>

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
                placeholder="Enter patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
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
                <th>Patient ID</th>
                <th>Barcode</th>
                <th>Patient Name</th>
                <th>Franchise ID</th>
                <th>Referral</th>
                <th>Status</th>
                <th>Credit</th>
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
                  const patientStatus = statuses[patient.patient_id] || {};
                  const status = patientStatus.status || "Loading...";
                  const barcode = patientStatus.barcode || "N/A";
                  const isPrintMailEnabled = isPrintAndMailEnabled(status);
                  const isDispatchEnabledFlag = isDispatchEnabled(status);
                  const isSortingEnabledFlag = isSortingEnabled(status);
                  const badgeColor = getBadgeColor(status);

                  return (
                    <tr key={patient.patient_id}>
                      <td>
                        {patient.date
                          ? format(new Date(patient.date), "yyyy-MM-dd")
                          : "N/A"}
                      </td>
                      <td>{patient.patient_id}</td>
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
                      <td>{patient.branch || "N/A"}</td>
                      <td>{patient.refby || "N/A"}</td>
                      <td>
                        <Badge color={badgeColor}>{status}</Badge>
                      </td>
                      <td>
                        <CreditAmount onClick={() => openModal(patient)}>
                          {patient.credit_amount || "0"}
                        </CreditAmount>
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
      </Card>

      {/* Test Sorting Modal */}
      {isTestModalOpen && (
        <FranchiseTestSorting
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
            <PatientOverallReport
              patient_id={selectedPatient.patient_id}
              date={selectedPatient.date}
            />
          </div>
        )}
      </Modal>
    </Container>
  );
};

export default FranchiseOverview;