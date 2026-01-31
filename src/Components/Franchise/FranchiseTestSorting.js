import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import headerImage from "../Images/Header.png";
import FooterImage from "../Images/Footer.png";
import apiRequest from "../Auth/apiRequest";
import { toast } from "react-toastify";
import {
  X,
  Printer,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  Flag,
} from "lucide-react";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  width: 70%;
  max-width: 900px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
`;

const Title = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 15px;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #db9bb9;
    box-shadow: 0 0 0 2px rgba(219, 155, 185, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
`;

const TestList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 10px 0;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #db9bb9;
    border-radius: 10px;
  }
`;

const TestItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  margin: 8px 0;
  transition: all 0.2s;

  &:hover {
    background: #f9f0f4;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
`;

const TestInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const CheckboxContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 2px solid ${(props) => (props.checked ? "#DB9BB9" : "#d1d1d1")};
  border-radius: 6px;
  margin-right: 15px;
  transition: all 0.2s;
  background: ${(props) => (props.checked ? "#DB9BB9" : "transparent")};
  cursor: pointer;

  &:hover {
    border-color: #db9bb9;
  }
`;

const TestName = styled.span`
  font-size: 15px;
  color: #333;
  font-weight: ${(props) => (props.selected ? "600" : "400")};
  
  .nabl-asterisk {
    color: #DB9BB9;
    font-weight: bold;
    margin-left: 4px;
  }
`;



const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
`;

const SelectAllContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${(props) =>
    props.primary &&
    `
    background-color: #DB9BB9;
    color: white;
    
    &:hover {
      background-color: #c985a7;
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}

  ${(props) =>
    props.secondary &&
    `
    background-color: #f5f5f5;
    color: #333;
    
    &:hover {
      background-color: #e9e9e9;
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SelectedCount = styled.div`
  background-color: #f0f0f0;
  color: #555;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  margin-left: 10px;
`;

const PrintOptions = styled.div`
  position: absolute;
  bottom: 70px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
  transition: all 0.3s;
  transform-origin: bottom right;
  transform: ${(props) => (props.show ? "scale(1)" : "scale(0)")};
  opacity: ${(props) => (props.show ? "1" : "0")};
`;

const PrintOption = styled.div`
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: #f9f0f4;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 20;
  border-radius: 16px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #db9bb9;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 20px;
  color: #555;
  font-size: 16px;
  font-weight: 500;
`;

const FranchiseTestSorting = ({ patient, onClose }) => {
  const [tests, setTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [dispatchedTests, setDispatchedTests] = useState(new Set());

  useEffect(() => {
    const fetchTests = async () => {
      setIsLoading(true);
      setLoadingMessage("Loading tests...");
      try {
        const response = await apiRequest(
          `${Labbaseurl}patient_test_sorting/?barcode=${patient.barcode}&date=${patient.date}`,
          "GET",
          null,
          {},
          {}
        );

        if (response.success) {
          if (response.data[patient.barcode]) {
            const testDetails = response.data[patient.barcode].testdetails || [];
            const sortedTests = testDetails.sort((a, b) => {
              const numA = parseInt(a.test_name.match(/\d+/)?.[0]) || 0;
              const numB = parseInt(b.test_name.match(/\d+/)?.[0]) || 0;
              return numA - numB;
            });
            
            const testsWithDispatch = sortedTests.map((test) => ({
              test_id: test.test_id,
              test_name: test.test_name,
              NABL: test.NABL || false,
              dispatched: test.dispatch || false,
              created_date: test.created_date  // Changed from test.dispatched to test.dispatch
            }));
            
            setTests(testsWithDispatch);
            
            // Initialize dispatched tests set
            const dispatchedSet = new Set();
            testsWithDispatch.forEach(test => {
              if (test.dispatched) {
                dispatchedSet.add(test.test_id);
              }
            });
            setDispatchedTests(dispatchedSet);
          } else {
            console.log("No test data found for this barcode");
            setTests([]);
          }
        } else {
          console.error("Error fetching tests:", response.error, response.status);
          toast.error("Failed to load tests");
        }
      } catch (error) {
        console.error("Unexpected error fetching tests:", error);
        toast.error("An error occurred while loading tests");
      } finally {
        setIsLoading(false);
        setLoadingMessage("");
      }
    };

    fetchTests();
  }, [patient.patient_id, patient.barcode, patient.date]);

   const handleSelectTest = (test) => {
    setSelectedTests((prev) => {
      const isSelected = prev.some((t) => t.test_id === test.test_id);
      return isSelected
        ? prev.filter((t) => t.test_id !== test.test_id)
        : [...prev, test];
    });
  };

  const handleSelectAll = () => {
    if (selectAllChecked) {
      setSelectedTests([]);
    } else {
      setSelectedTests([...tests]);
    }
    setSelectAllChecked(!selectAllChecked);
  };

  const handlePrint = async (withLetterpad) => {
    if (!selectedTests.length) {
      toast.error("Please select at least one test to print.");
      return;
    }

    try {
      console.log("Fetching patient details for barcode:", patient.barcode);
      const response = await apiRequest(
        `${Labbaseurl}franchise_patient_test_details/?barcode=${patient.barcode}`,
        "GET"
      );

      if (!response.success) {
        console.error("Failed to fetch patient details:", response.error);
        toast.error(response.error || "Failed to fetch patient details");
        return;
      }

      console.log("API Response:", response.data);
      
      // Extract patient data and signatures from the new response structure
      let patientDetails;
      let signaturesData = [];
      
      if (response.data.patient_data && response.data.signatures) {
        // New structure with signatures
        patientDetails = response.data.patient_data;
        signaturesData = response.data.signatures;
      } else {
        // Fallback for old structure
        patientDetails = response.data;
      }

      if (Array.isArray(patientDetails)) {
        patientDetails = {
          ...patientDetails[0],
          testdetails: patientDetails.flatMap(
            (record) => record.testdetails || []
          ),
        };
      }

      console.log("Processed Patient Details:", patientDetails);
      console.log("Signatures Data:", signaturesData);
      console.log("Selected Tests:", selectedTests);

      // Filter tests by test_id
      const orderedTests = selectedTests
        .map((selectedTest) =>
          patientDetails.testdetails.find((t) => t.test_id === selectedTest.test_id)
        )
        .filter((test) => test);

      console.log("Ordered Tests:", orderedTests);
      if (!orderedTests.length) {
        toast.error("No matching tests found for the selected tests.");
        return;
      }

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
        let processedText = text;
        processedText = processedText.replace(
          /\\u([0-9a-fA-F]{4})/g,
          (match, hex) => {
            const char = String.fromCharCode(parseInt(hex, 16));
            return unicodeMap[char] || char;
          }
        );
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

      // CORRECTED: Map designation codes to consultant positions
      const designationMapping = {
        "DESIG101": { position: 0, title: "Consultant Microbiologist" },
        "DESIG100": { position: 1, title: "Consultant Pathologist" },
        "DESIG099": { position: 2, title: "Consultant Biochemist" },
      };

      // Build consultants array dynamically from signatures data
      const consultants = [];
      
      // Initialize with empty slots
      consultants[0] = null; // Microbiologist
      consultants[1] = null; // Pathologist
      consultants[2] = null; // Biochemist
      
      // Fill in the consultants based on signatures data
      signaturesData.forEach((sig) => {
        const mapping = designationMapping[sig.designation];
        if (mapping) {
          const signatureImage = sig.signatureBase64 
            ? `data:image/png;base64,${sig.signatureBase64}` 
            : null;
          
          consultants[mapping.position] = [
            sig.employeeName,
            mapping.title,
            signatureImage
          ];
        }
      });
      
      // Filter out null entries (positions without signatures)
      const activeConsultants = consultants.filter(c => c !== null);

      console.log("Active Consultants:", activeConsultants);

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
      const contentYStart = headerHeight + 20; // CHANGED from 25 to 20
      const signatureHeight = 35;
      const tableHeaderHeight = 10;

      const colWidths = [
        contentWidth * 0.28,
        contentWidth * 0.12,
        contentWidth * 0.05,
        contentWidth * 0.13,
        contentWidth * 0.1,
        contentWidth * 0.17,
        contentWidth * 0.15,
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

      const calculateMaxLabelWidth = (details) => {
        const tempDoc = new jsPDF();
        return Math.max(
          ...details.map((item) => tempDoc.getTextWidth(item.label))
        );
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
          const maxLeftValueWidth = centerPoint + 25 - leftValueX;
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
          doc.addImage(
            headerImage,
            "PNG",
            0,
            10,
            doc.internal.pageSize.width,
            headerHeight
          );
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

      // UPDATED: addSignatures function - Right-aligned with full name (MATCHING SECOND DOCUMENT)
      const addSignatures = () => {
        const pageHeight = doc.internal.pageSize.height;
        const signaturesY = pageHeight - footerHeight - signatureHeight - 2; // CHANGED from 5 to 2
        const signatureWidth = 35;
        
        // Only show signatures if we have active consultants
        if (activeConsultants.length === 0) return;
        
        // Calculate spacing based on number of active consultants
        const totalConsultants = activeConsultants.length;
        
        // Calculate starting position from RIGHT side
        const rightEdge = rightMargin;
        const signatureSpacing = 45; // Fixed spacing between signatures
        
        // Start from right edge and work backwards
        const startX = rightEdge - (totalConsultants * signatureSpacing);

        activeConsultants.forEach((consultant, index) => {
          // Position from the calculated start point, moving right
          const xPosition = startX + (index * signatureSpacing);
          
          // Display signature image if available
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

          // Display full name with credentials
          const fullName = consultant[0];
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text(fullName, xPosition, signaturesY + 20);

          // Display title (Consultant position)
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text(consultant[1], xPosition, signaturesY + 25);
        });
      };

      const checkForNewPage = (yPos, estimatedHeight) => {
        const pageHeight = doc.internal.pageSize.height;
        const footerStart = pageHeight - (footerHeight + signatureHeight + 5); // CHANGED from 10 to 5

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

      addHeaderFooter();
      let currentYPosition = addPatientInfo(contentYStart);
      currentYPosition += 10;

      // Sort orderedTests by the selection order
      orderedTests.sort((a, b) => {
        const indexA = selectedTests.findIndex((t) => t.test_id === a.test_id);
        const indexB = selectedTests.findIndex((t) => t.test_id === b.test_id);
        return indexA - indexB;
      });

      if (orderedTests.length) {
        isTableStarted = true;
        currentYPosition = checkForNewPage(currentYPosition, tableHeaderHeight);
        let yPos = currentYPosition;
        yPos = drawTableHeader(yPos);

        // CRITICAL FIX: Use orderedTests instead of patientDetails.testdetails
        const testsByDepartment = orderedTests.reduce((acc, test) => {
          (acc[test.department] = acc[test.department] || []).push(test);
          return acc;
        }, {});

        // Sort departments according to the specified order
        const sortedDepartments = Object.keys(testsByDepartment).sort((a, b) => {
          const indexA = departmentOrder.indexOf(a);
          const indexB = departmentOrder.indexOf(b);

          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
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
        const footerStart = pageHeight - (footerHeight + signatureHeight + 15); // CHANGED from 10 to 15
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
      doc.text("**End of the Report**", centerX, currentYPosition, {
        align: "center",
      });

      addSignatures();

      const finalPageCount = pageCount;
      for (let i = 1; i <= finalPageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height;
        const pageNumberY = pageHeight - footerHeight - 2;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        const centerX = leftMargin + contentWidth / 2;
        doc.text(`Page ${i} of ${finalPageCount}`, centerX, pageNumberY, {
          align: "center",
        });
      }

      // Generate the PDF as a Blob
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Open the PDF in a new tab for preview
      window.open(pdfUrl, "_blank");

      return pdfBlob;
    } catch (error) {
      console.error("Error while generating the PDF:", error);
      toast.error("An unexpected error occurred while generating the PDF");
    }
  };
  const filteredTests = tests.filter((test) =>
    test.test_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModalOverlay>
      <ModalContent>
        {isLoading && (
          <LoadingOverlay>
            <LoadingSpinner />
            <LoadingText>{loadingMessage}</LoadingText>
          </LoadingOverlay>
        )}
        <ModalHeader>
          <Title>Sort and Select Tests</Title>
        </ModalHeader>

        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon>
            <Search size={18} />
          </SearchIcon>
        </SearchContainer>

        <SelectAllContainer>
          <CheckboxContainer
            checked={selectAllChecked}
            onClick={handleSelectAll}
          >
            {selectAllChecked && <Check size={14} color="white" />}
          </CheckboxContainer>
          <span>Select All</span>
          {selectedTests.length > 0 && (
            <SelectedCount>{selectedTests.length} selected</SelectedCount>
          )}
        </SelectAllContainer>

        <TestList>
          {filteredTests.length === 0 ? (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#888" }}
            >
              No tests found matching your search
            </div>
          ) : (
            filteredTests.map((test) => {
              const isSelected = selectedTests.some(
                (t) => t.test_id === test.test_id
              );
              

              return (
                <TestItem
                  key={test.test_id}
                  onClick={() => handleSelectTest(test)}
                >
                  <TestInfo>
                    <CheckboxContainer checked={isSelected}>
                      {isSelected && <Check size={14} color="white" />}
                    </CheckboxContainer>
                    <TestName selected={isSelected}>
                      {test.test_name}
                      {test.NABL && <span className="nabl-asterisk">*</span>}
                    </TestName>
                  </TestInfo>
                
                </TestItem>
              );
            })
          )}
        </TestList>

        <ModalFooter>
          <Button secondary onClick={onClose}>
            <X size={16} />
            Close
          </Button>

          <ButtonGroup>
            <Button
              primary
              disabled={selectedTests.length === 0}
              onClick={() => setShowPrintOptions(!showPrintOptions)}
            >
              <Printer size={16} />
              Print Options
              {showPrintOptions ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </Button>

            <PrintOptions show={showPrintOptions}>
              <PrintOption onClick={() => handlePrint(true)}>
                <Printer size={16} />
                Print with Letterhead
              </PrintOption>
              <PrintOption onClick={() => handlePrint(false)}>
                <Printer size={16} />
                Print without Letterhead
              </PrintOption>
            </PrintOptions>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FranchiseTestSorting;