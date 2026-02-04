import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
    Calendar,
    Search,
    Printer,
    RefreshCw,
    Download,
    Filter,
    FileText,
    FileImage
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../Components/Auth/apiRequest";
import headerImage from "../Images/Header.png";
import FooterImage from "../Images/Footer.png";
import Dhana from "../Images/Dhana.png";
import Brindha from "../Images/Brindha.png";
import JsBarcode from "jsbarcode";

// -----------------------------------------------------------------------------
// Styled Components (Modern Premium UI)
// -----------------------------------------------------------------------------
// ... (Keeping styled components imports implicit as they occupy lines before this block in global scope, 
// but here we are just updating the component logic which is far down, 
// wait, the imports are at the top. I need to be careful with targeting.)

// Let's target the component body for the logic changes and the import block for imports.
// I will split this into two calls if needed, or just replace the component body parts.
// Actually, `replace_file_content` works on line ranges. 
// I'll do the imports first.


const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
  margin-bottom: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  padding: 1.5rem 2rem;
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  background: linear-gradient(45deg, #1a237e, #4361ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
`;

const FiltersContainer = styled.div`
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FilterLabel = styled.label`
  font-size: 0.85rem;
  color: #4a5568;
  font-weight: 600;
  margin-left: 0.25rem;
`;

const FilterInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background-color: white;
  color: #2d3748;

  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.15);
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: ${(props) =>
        props.variant === "secondary"
            ? "linear-gradient(to bottom, #718096, #4a5568)"
            : "linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)"};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) =>
        props.variant === "secondary"
            ? "0 4px 6px rgba(113, 128, 150, 0.2)"
            : "0 4px 14px 0 rgba(67, 97, 238, 0.39)"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
        props.variant === "secondary"
            ? "0 6px 8px rgba(113, 128, 150, 0.3)"
            : "0 6px 20px rgba(67, 97, 238, 0.23)"};
    filter: brightness(110%);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 0 0 20px 20px;
  
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 900px;
`;

const TableHead = styled.thead`
  background-color: #f8fafc;
  
  th {
    padding: 1.25rem 1.5rem;
    text-align: left;
    font-weight: 700;
    color: #4a5568;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
    
    &:first-child {
      padding-left: 2rem;
    }
  }
`;

const TableBody = styled.tbody`
  tr {
    background-color: white;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f0f4ff;
      transform: scale(1.002);
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      z-index: 10;
      position: relative;
    }

    td {
      padding: 1.25rem 1.5rem;
      vertical-align: middle;
      font-size: 0.95rem;
      color: #2d3748;
      border-bottom: 1px solid #edf2f7;

      &:first-child {
        padding-left: 2rem;
        font-weight: 500;
      }
    }

    &:last-child td {
      border-bottom: none;
    }
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: ${(props) => props.color}20; 
  color: ${(props) => props.color};
  border: 1px solid ${(props) => props.color}40;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background-color: #4361ee;
    color: white;
    border-color: #4361ee;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
  }
`;

const EmptyState = styled.div`
  padding: 4rem;
  text-align: center;
  color: #718096;
  background-color: #f8fafc;
  border-radius: 12px;
  margin: 1rem;
`;

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------
const getStatusColor = (status) => {
    switch (status) {
        case "Registered":
            return "#1890ff";
        case "Collected":
            return "#52c41a";
        case "Received":
            return "#faad14";
        case "Tested":
            return "#722ed1";
        case "Approved":
            return "#1890ff";
        case "Dispatched":
            return "#13c2c2";
        case "Outsource": // Mapped to Received color or separate? User didn't specify. Using Received color for now or Purple?
            return "#faad14"; // Defaulting to yellow/orange for in-progress
        default:
            return "#666";
    }
};

// -----------------------------------------------------------------------------
// Component Logic
// -----------------------------------------------------------------------------

const PreethamPatientOverview = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
    const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const url = `${Labbaseurl}preetham_hospital_report/?from_date=${encodeURIComponent(fromDate)}&to_date=${encodeURIComponent(toDate)}`;
            const response = await apiRequest(url, "GET");

            if (response && response.length >= 0) {
                setPatients(response);
                setFilteredPatients(response);
                toast.success(`Loaded ${response.length} records`);
            } else if (response.success && response.data) {
                setPatients(response.data);
                setFilteredPatients(response.data);
            } else {
                setPatients([]);
                setFilteredPatients([]);
                if (response.error) toast.error(response.error);
            }
        } catch (error) {
            console.error("Error fetching patients:", error);
            toast.error("Failed to load patient data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [fromDate, toDate]);

    // Filter Logic
    useEffect(() => {
        let filtered = patients;

        // Apply Status Filter
        if (statusFilter) {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        // Apply Search Query
        if (searchQuery.trim()) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (patient) =>
                    (patient.patient_id && patient.patient_id.toLowerCase().includes(lowerQuery)) ||
                    (patient.patient_name && patient.patient_name.toLowerCase().includes(lowerQuery)) ||
                    (patient.barcode && String(patient.barcode).toLowerCase().includes(lowerQuery)) ||
                    (patient.bill_no && String(patient.bill_no).toLowerCase().includes(lowerQuery)) ||
                    (patient.status && patient.status.toLowerCase().includes(lowerQuery))
            );
        }

        setFilteredPatients(filtered);
    }, [searchQuery, statusFilter, patients]);

    const clearFilters = () => {
        setFromDate(new Date().toISOString().split("T")[0]);
        setToDate(new Date().toISOString().split("T")[0]);
        setSearchQuery("");
        setStatusFilter("");
        fetchPatients();
    };

    // ---------------------------------------------------------------------------
    // PDF Generation (Adapted from PreethamHospitalReport.js)
    // ---------------------------------------------------------------------------
    const handlePrint = async (patient, withLetterpad = true) => {
        try {
            console.log("Fetching patient details for barcode:", patient.barcode);
            const response = await apiRequest(
                `${Labbaseurl}get_patient_test_details/?barcode=${patient.barcode}`,
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
                ["Dr. V. Dhana Rangesh Kumar Ph.D.", "Consultant Biochemist", Dhana],
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
            const signatureHeight = 35;
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
                { label: "Patient ID", value: patientDetails.patient_id || "N/A" },
                { label: "Name", value: patientDetails.patientname || "No name provided" },
                { label: "Age/Gender", value: `${patientDetails.age || "N/A"} ${patientDetails.age_type || ""}/ ${patientDetails.gender || "N/A"}` },
                { label: "Referral", value: patientDetails.refby || "SELF" },
                { label: "Branch", value: patientDetails.branch || "N/A" },
                { label: "Source", value: patientDetails.B2B || "N/A" },
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
                            doc.addImage(barcodeImage, "PNG", rightValueX + doc.getTextWidth(right.value) - 10,
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
                    // Modern Text Header
                    doc.setFontSize(16);
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(0, 0, 0);
                    const headerText = "PREETHAM HOSPITAL";
                    const headerX = (doc.internal.pageSize.width / 2) - (doc.getTextWidth(headerText) / 2);
                    doc.text(headerText, headerX, 15);

                    // Optional sub-text or line
                    doc.setLineWidth(0.5);
                    doc.line(leftMargin, 18, rightMargin, 18);

                    doc.setFontSize(10);
                    doc.setFont("helvetica", "bolditalic");
                    const footerText = "Sample Processed at SHANMUGA HOSPITAL";
                    const footerX = (doc.internal.pageSize.width / 2) - (doc.getTextWidth(footerText) / 2);
                    const footerY = doc.internal.pageSize.height - 10;
                    doc.text(footerText, footerX, footerY);

                    doc.setFont("helvetica", "normal"); // Reset
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

                // Better spacing calculation to utilize full width
                const totalConsultants = consultants.length;
                const signatureSpacing = (contentWidth - signatureWidth) / (totalConsultants - 0.7);

                const approvers = new Set();
                patientDetails.testdetails.forEach((test) => {
                    if (test.approve_by && test.approve_by.trim() !== "") {
                        approvers.add(test.approve_by.toLowerCase());
                    }
                });

                consultants.forEach((consultant, index) => {
                    const xPosition = leftMargin + (index * signatureSpacing);
                    const consultantName = consultant[0].toLowerCase();
                    const shouldShowSignature =
                        (consultantName.includes("brindha") && approvers.has("dr.brindha")) ||
                        (consultantName.includes("dhana") && approvers.has("dr dhana rangesh kumar"));

                    if (consultant[2] && shouldShowSignature) {
                        doc.addImage(
                            consultant[2],
                            "PNG",
                            xPosition,
                            signaturesY,
                            signatureWidth,
                            15
                        );
                    }

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
                        // Render department header only for first test in department
                        if (testIndex === 0) {
                            const departmentHeight = 15;
                            yPos = checkForNewPage(yPos, departmentHeight);

                            doc.setFont("helvetica", "bold");
                            doc.setFontSize(10);
                            const textWidth = doc.getTextWidth(department.toUpperCase());
                            const centerX = leftMargin + contentWidth / 2;
                            doc.text(department.toUpperCase(), centerX, yPos, { align: "center" });
                            doc.line(centerX - textWidth / 2, yPos + 2, centerX + textWidth / 2, yPos + 2);
                            yPos += 10;
                        }

                        // Group parameters by sub_title
                        const parametersBySubtitle = {};

                        if (test.parameters && test.parameters.length > 0) {
                            test.parameters.forEach((param) => {
                                const subtitle = param.sub_title || "";
                                if (!parametersBySubtitle[subtitle]) {
                                    parametersBySubtitle[subtitle] = [];
                                }
                                parametersBySubtitle[subtitle].push(param);
                            });
                        }

                        // Check if we need a new page for the test name
                        const testHeaderHeight = 20;
                        yPos = checkForNewPage(yPos, testHeaderHeight);

                        // Render main test
                        doc.setFontSize(10);

                        // Calculate all text wrapping FIRST to get accurate height
                        const testNameText = test.testname;
                        const testNameLines = wrapTextAndGetLines(doc, testNameText, colWidths[0] - 2);

                        const valueText = test.value || "";
                        const valueLines = wrapTextAndGetLines(doc, valueText, colWidths[3] - 2);

                        const referenceLines = wrapTextAndGetLines(doc, test.reference_range || "", colWidths[5] - 2);

                        const methodText = (test.method || "").replace(/\bMethod\b/i, "").trim();
                        const methodLines = wrapTextAndGetLines(doc, methodText, colWidths[6] - 2);

                        // Calculate actual row height
                        const maxLines = Math.max(
                            testNameLines.length,
                            valueLines.length,
                            referenceLines.length,
                            methodLines.length
                        );
                        const lineHeight = 4;
                        const actualRowHeight = maxLines * lineHeight + 2;

                        // Check for new page with accurate height
                        yPos = checkForNewPage(yPos, actualRowHeight);

                        // Now render the row
                        let xPos = leftMargin;

                        // Test Name
                        doc.setFont("helvetica", "bold");
                        renderWrappedText(doc, testNameText, colWidths[0] - 2, xPos, yPos, lineHeight);
                        xPos += colWidths[0];

                        doc.setFont("helvetica", "normal");

                        // Specimen Type
                        doc.text(test.specimen_type || "", xPos, yPos);
                        xPos += colWidths[1];

                        // Extra Gap
                        xPos += colWidths[2];

                        // Value(s) - Now with text wrapping
                        const statusIndicator = test.isHigh
                            ? "H"
                            : test.isLow
                                ? "L"
                                : getHighLowStatus(valueText, test.reference_range);

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

                        // Unit
                        renderUnicodeText(test.unit || "", xPos, yPos);
                        xPos += colWidths[4];

                        // Reference Range
                        renderWrappedText(doc, test.reference_range || "", colWidths[5] - 2, xPos, yPos, lineHeight);
                        xPos += colWidths[5];

                        // Method
                        doc.setTextColor(0, 0, 0);
                        renderWrappedText(doc, methodText, colWidths[6] - 2, xPos, yPos, lineHeight);

                        // Move Y position by actual row height
                        yPos += actualRowHeight + 4;

                        doc.setFont("helvetica", "normal");
                        doc.setTextColor(0, 0, 0);

                        // Add outsourced label
                        if (test.outsourced === true) {
                            doc.setFont("helvetica", "italic");
                            doc.setFontSize(8);
                            doc.text("(Outsourced)", leftMargin, yPos);
                            yPos += 4;
                        }

                        // Add comment for main test (when no parameters)
                        if (!test.parameters || test.parameters.length === 0) {
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
                        }

                        // Reset styling
                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(10);
                        doc.setTextColor(0, 0, 0);

                        // Render parameters grouped by sub_title
                        Object.keys(parametersBySubtitle).forEach((subtitle) => {
                            // Render subtitle if it exists
                            if (subtitle && subtitle.trim() !== "") {
                                const subtitleWithParamHeight = 25;
                                yPos = checkForNewPage(yPos, subtitleWithParamHeight);

                                doc.setFont("helvetica", "bold");
                                doc.setFontSize(9);
                                doc.text(subtitle, leftMargin, yPos);
                                yPos += 6;
                            }

                            // Render all parameters under this subtitle
                            parametersBySubtitle[subtitle].forEach((currentTest) => {
                                // Calculate all text wrapping FIRST
                                doc.setFontSize(10);

                                const paramNameText = currentTest.name;
                                const paramNameLines = wrapTextAndGetLines(doc, paramNameText, colWidths[0] - 2);

                                const paramValueText = currentTest.value || "";
                                const paramValueLines = wrapTextAndGetLines(doc, paramValueText, colWidths[3] - 2);

                                const paramReferenceLines = wrapTextAndGetLines(
                                    doc,
                                    currentTest.reference_range || "",
                                    colWidths[5] - 2
                                );

                                const paramMethodText = (currentTest.method || "").replace(/\bMethod\b/i, "").trim();
                                const paramMethodLines = wrapTextAndGetLines(doc, paramMethodText, colWidths[6] - 2);

                                // Calculate actual row height
                                const paramMaxLines = Math.max(
                                    paramNameLines.length,
                                    paramValueLines.length,
                                    paramReferenceLines.length,
                                    paramMethodLines.length
                                );
                                const paramLineHeight = 4;
                                const paramActualRowHeight = paramMaxLines * paramLineHeight + 2;

                                // Check for new page
                                yPos = checkForNewPage(yPos, paramActualRowHeight);

                                // Render parameter row
                                let xPos = leftMargin;

                                // Parameter name
                                doc.setFont("helvetica", "normal");
                                renderWrappedText(doc, paramNameText, colWidths[0] - 2, xPos, yPos, paramLineHeight);
                                xPos += colWidths[0];

                                // Specimen Type
                                doc.text(currentTest.specimen_type || "", xPos, yPos);
                                xPos += colWidths[1];

                                // Extra Gap
                                xPos += colWidths[2];

                                // Value(s) with wrapping
                                const paramStatusIndicator = currentTest.isHigh
                                    ? "H"
                                    : currentTest.isLow
                                        ? "L"
                                        : getHighLowStatus(paramValueText, currentTest.reference_range);

                                if (paramStatusIndicator) {
                                    doc.setFont("helvetica", "bold");
                                    if (paramStatusIndicator === "H") {
                                        doc.setTextColor(255, 0, 0);
                                    } else if (paramStatusIndicator === "L") {
                                        doc.setTextColor(0, 0, 255);
                                    }
                                    renderWrappedText(doc, paramValueText, colWidths[3] - 5, xPos, yPos, paramLineHeight);
                                    const paramValueWidth = doc.getTextWidth(paramValueText);
                                    if (paramValueWidth < colWidths[3] - 5) {
                                        if (paramStatusIndicator === "H") {
                                            drawArrowSymbol(doc, xPos + paramValueWidth + 2, yPos - 1, "up");
                                        } else if (paramStatusIndicator === "L") {
                                            drawArrowSymbol(doc, xPos + paramValueWidth + 2, yPos - 1, "down");
                                        }
                                    }
                                    doc.setTextColor(0, 0, 0);
                                    doc.setFont("helvetica", "normal");
                                } else {
                                    renderWrappedText(doc, paramValueText, colWidths[3] - 2, xPos, yPos, paramLineHeight);
                                }
                                xPos += colWidths[3];

                                // Unit
                                renderUnicodeText(currentTest.unit || "", xPos, yPos);
                                xPos += colWidths[4];

                                // Reference Range
                                renderWrappedText(
                                    doc,
                                    currentTest.reference_range || "",
                                    colWidths[5] - 2,
                                    xPos,
                                    yPos,
                                    paramLineHeight
                                );
                                xPos += colWidths[5];

                                // Method
                                doc.setTextColor(0, 0, 0);
                                renderWrappedText(doc, paramMethodText, colWidths[6] - 2, xPos, yPos, paramLineHeight);

                                // Move Y position
                                yPos += paramActualRowHeight;

                                // Add comment for parameter
                                if (currentTest.comment && currentTest.comment.trim() !== "") {
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

                                // Reset styling
                                doc.setFont("helvetica", "normal");
                                doc.setFontSize(10);
                                doc.setTextColor(0, 0, 0);
                            });
                        });

                        // Display "Verified by" under each test if multiple verifiers in department
                        if (hasMultipleVerifiers && test.verified_by && test.verified_by.trim() !== "") {
                            doc.setFont("helvetica", "normal");
                            doc.setFontSize(10);
                            doc.text(`Verified by: ${test.verified_by}`, leftMargin, yPos);
                            yPos += 8;
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
    return (
        <Container>
            <Card>
                <CardHeader>
                    <Title>Preetham Hospital - Patient Overview</Title>
                    <Button onClick={fetchPatients} disabled={loading}>
                        {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                        Refresh
                    </Button>
                </CardHeader>

                <FiltersContainer>
                    <FilterRow>
                        <FilterGroup>
                            <FilterLabel>From Date</FilterLabel>
                            <FilterInput
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </FilterGroup>
                        <FilterGroup>
                            <FilterLabel>To Date</FilterLabel>
                            <FilterInput
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </FilterGroup>
                        <FilterGroup>
                            <FilterLabel>Status</FilterLabel>
                            <select
                                style={{
                                    padding: '0.75rem 1rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    backgroundColor: 'white',
                                    color: '#2d3748',
                                    outline: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="Approved">Approved</option>
                                <option value="Tested">Tested</option>
                                <option value="Received">Received</option>
                                <option value="Collected">Collected</option>
                                {/* <option value="Outsource">Outsource</option> */}
                                <option value="Registered">Registered</option>
                            </select>
                        </FilterGroup>
                        <FilterGroup>
                            <FilterLabel>Search</FilterLabel>
                            <FilterInput
                                type="text"
                                placeholder="Name, ID, Barcode, Bill No..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </FilterGroup>
                        <FilterGroup style={{ justifyContent: 'flex-end' }}>
                            <Button variant="secondary" onClick={clearFilters}>
                                Clear
                            </Button>
                        </FilterGroup>
                    </FilterRow>
                </FiltersContainer>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <tr>
                                <th>Date</th>
                                <th>Bill No</th>
                                <th>Patient Name</th>
                                <th>Age/Sex</th>
                                <th>Barcode</th>
                                <th>Tests</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </TableHead>
                        <TableBody>
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient, index) => (
                                    <tr key={index}>
                                        <td>{patient.date}</td>
                                        <td>{patient.bill_no}</td>
                                        <td>
                                            <div>{patient.patient_name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{patient.patient_id}</div>
                                        </td>
                                        <td>{patient.age} / {patient.gender}</td>
                                        <td>{patient.barcode}</td>
                                        <td>
                                            <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={patient.test_names?.join(", ")}>
                                                {Array.isArray(patient.tests) ? patient.tests.map(t => t.testname).join(", ") : (patient.test_names?.join(", ") || patient.no_of_tests + " Tests")}
                                            </div>
                                        </td>
                                        <td>
                                            <Badge color={getStatusColor(patient.status)}>
                                                {patient.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            <ActionButtons>
                                                <ActionButton
                                                    onClick={() => handlePrint(patient, true)}
                                                    title="Report with Letterpad"
                                                >
                                                    <FileImage size={18} />
                                                </ActionButton>
                                                <ActionButton
                                                    onClick={() => handlePrint(patient, false)}
                                                    title="Report without Letterpad"
                                                >
                                                    <FileText size={18} />
                                                </ActionButton>
                                            </ActionButtons>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">
                                        <EmptyState>No records found</EmptyState>
                                    </td>
                                </tr>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Container>
    );
};

export default PreethamPatientOverview;
