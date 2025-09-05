import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  faTimes,
  faDownload,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import JsBarcode from "jsbarcode"; // Import JsBarcode
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import headerImage from "../Images/Header.png";
import FooterImage from "../Images/Footer.png";
import Vijayan from "../Images/Vijayan.png";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import apiRequest from "../auth/apiRequest";
import { toast } from "react-toastify";
import {
  X,
  Printer,
  Download,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
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

  /* Custom scrollbar */
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
  cursor: pointer;
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
`;

const TestNumber = styled.span`
  font-size: 13px;
  color: #888;
  margin-left: 8px;
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

// **Main Component**
const TestSorting = ({ patient, onClose }) => {
  const [tests, setTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await apiRequest(
          `http://127.0.0.1:1071/_b_a_c_k_e_n_d/Diagnostics/patient_test_sorting/?barcode=${patient.barcode}&date=${patient.date}`,
          "GET",
          null,
          {}, // Additional headers, if any
          {} // No additional config needed since params are in the URL
        );

        if (response.success) {
          // Use barcode as key since backend returns data with barcode as key
          if (response.data[patient.barcode]) {
            const testDetails =
              response.data[patient.barcode].testdetails || [];

            // Order by number (assumes test name contains a number)
            const sortedTests = testDetails.sort((a, b) => {
              const numA = parseInt(a.testname.match(/\d+/)?.[0]) || 0;
              const numB = parseInt(b.testname.match(/\d+/)?.[0]) || 0;
              return numA - numB;
            });

            setTests(sortedTests.map((test) => ({ testname: test.testname })));
          } else {
            console.log("No test data found for this barcode");
            setTests([]);
          }
        } else {
          console.error(
            "Error fetching tests:",
            response.error,
            response.status
          );
        }
      } catch (error) {
        console.error("Unexpected error fetching tests:", error);
      }
    };

    fetchTests();
  }, [patient.patient_id]);
  const handleSelectTest = (test) => {
    setSelectedTests((prev) => {
      const isSelected = prev.some((t) => t.testname === test.testname);
      return isSelected
        ? prev.filter((t) => t.testname !== test.testname)
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
      // Use apiRequest instead of direct axios call
      const response = await apiRequest(
        `${Labbaseurl}get_patient_test_details/?barcode=${patient.barcode}`,
        "GET"
      );

      // Handle the response based on the apiRequest return format
      if (!response.success) {
        console.error("Failed to fetch patient details:", response.error);
        toast.error(response.error || "Failed to fetch patient details");
        return;
      }

      const patientDetails = response.data;

      const orderedTests = selectedTests
        .map((test) =>
          patientDetails.testdetails.find((t) => t.testname === test.testname)
        )
        .filter((test) => test); // Ensure no undefined values

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
      const contentYStart = headerHeight + 20; // Start content below the header area
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

      // FIXED: Function to add header and footer with consistent positioning
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

      // UPDATED: Function to wrap text and return height with improved line height
      const wrapText = (doc, text, maxWidth, startX, yPos, lineHeight = 4) => {
        if (!text) return 0;
        const splitText = doc.splitTextToSize(text, maxWidth);
        splitText.forEach((line, index) => {
          doc.text(line, startX, yPos + index * lineHeight);
        });
        return splitText.length * lineHeight;
      };

      // FIXED: Function to add signatures with consistent positioning
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
              signatureWidth, // Reduced from 40 to 30
              15
            );
          }

          // Print name below the signature with REDUCED spacing
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text(consultant[0], xPosition, signaturesY + 15); // Reduced from 20 to 17

          // Print qualification below the name with REDUCED spacing
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text(consultant[1], xPosition, signaturesY + 20); // Reduced from 25 to 22
        });

        // Removed disclaimer - no longer needed
      };

      // FIXED: Function to check if we need to add a new page with consistent calculations
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

      // FIXED: Use consistent starting position for both versions
      let currentYPosition = contentYStart;

      // Better alignment for patient details
      const leftMaxLabelWidth = calculateMaxLabelWidth(leftDetails);
      const rightMaxLabelWidth = calculateMaxLabelWidth(rightDetails);

      // Calculate positions for patient details aligned with the margins
      const centerPoint = (leftMargin + rightMargin) / 2;

      // Left side details positioning
      const leftLabelX = leftMargin;
      const leftColonX = leftLabelX + leftMaxLabelWidth + 2;
      const leftValueX = leftColonX + 3;

      // Right side details positioning
      const rightLabelX = centerPoint + 28;
      const rightColonX = rightLabelX + rightMaxLabelWidth + 2;
      const rightValueX = rightColonX + 1;

      // Uniform font size for patient details
      doc.setFontSize(10);

      for (let i = 0; i < leftDetails.length; i++) {
        const left = leftDetails[i];
        const right = rightDetails[i];

        // Left Side
        doc.setFont("helvetica", "bold");
        doc.text(left.label, leftLabelX, currentYPosition);
        doc.text(":", leftColonX, currentYPosition);
        doc.setFont("helvetica", "bold");
        doc.text(left.value, leftValueX, currentYPosition);

        if (right) {
          // Right Side
          doc.setFont("helvetica", "bold");
          doc.text(right.label, rightLabelX, currentYPosition);
          doc.text(":", rightColonX, currentYPosition);
          doc.setFont("helvetica", "normal");
          doc.text(right.value, rightValueX, currentYPosition);

          // Only add barcode if there's a valid reference number
          if (
            right.label === "Patient Ref.No" &&
            patientRefNoNumber !== "N/A" &&
            barcodeImage
          ) {
            doc.addImage(
              barcodeImage,
              "PNG",
              rightValueX + doc.getTextWidth(right.value) - 10,
              currentYPosition + 2,
              25,
              8
            );
          }
        }

        currentYPosition += 5; // Reduced spacing between rows
      }

      // Sort ordered tests to maintain selection order
      orderedTests.sort((a, b) => {
        const indexA = selectedTests.findIndex(
          (t) => t.testname === a.testname
        );
        const indexB = selectedTests.findIndex(
          (t) => t.testname === b.testname
        );
        return indexA - indexB;
      });

      // Test rendering logic with better page break handling and consistent alignment
      if (orderedTests.length) {
        // Mark that we're starting the table section
        isTableStarted = true;

        // Check if we need a new page for the table header
        currentYPosition = checkForNewPage(currentYPosition, tableHeaderHeight);

        let yPos = currentYPosition;

        // Draw initial table header
        yPos = drawTableHeader(yPos);

        // Group Tests by Department
        const testsByDepartment = orderedTests.reduce((acc, test) => {
          (acc[test.department] = acc[test.department] || []).push(test);
          return acc;
        }, {});

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
              const estimatedHeight = 18; // Increased from 15 to 18

              // Check if we need a new page with better height estimation
              yPos = checkForNewPage(yPos, estimatedHeight);

              // Table data font size
              doc.setFontSize(10);

              // Start positions for each column
              let xPos = leftMargin;

              // MODIFIED: Test Name should be in bold, parameter names normal
              if (index === 0) {
                doc.setFont("helvetica", "bold"); // Bold for main test
              } else {
                doc.setFont("helvetica", "normal"); // Normal for parameters
              }

              // UPDATED: Test Description with improved line height
              const testNameHeight = wrapText(
                doc,
                index === 0 ? currentTest.testname : `${currentTest.name}`,
                colWidths[0] - 2,
                xPos,
                yPos,
                4 // Increased line height from 3 to 4
              );
              xPos += colWidths[0];

              // Reset font to normal for other columns
              doc.setFont("helvetica", "normal");

              // Specimen Type
              doc.text(currentTest.specimen_type || "", xPos, yPos);
              xPos += colWidths[1];

              // Extra Gap
              xPos += colWidths[2];

              // Value(s) - MODIFIED: Show indicator after the value
              const statusIndicator = currentTest.isHigh
                ? "H"
                : currentTest.isLow
                ? "L"
                : getHighLowStatus(
                    currentTest.value,
                    currentTest.reference_range
                  );

              const valueText = currentTest.value || "";

              // FIXED: Keep value bold when there's an indicator
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

              // UPDATED: Reference Range with improved line height
              const referenceRangeHeight = wrapText(
                doc,
                currentTest.reference_range || "",
                colWidths[5] - 2,
                xPos,
                yPos,
                4 // Increased line height from 3 to 4
              );
              xPos += colWidths[5];

              // UPDATED: Method with improved line height
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
                4 // Increased line height from 3 to 4
              );

              doc.setTextColor(0, 0, 0); // Reset to black

              // UPDATED: Calculate row height based on maximum content height
              const maxContentHeight = Math.max(
                testNameHeight,
                referenceRangeHeight,
                methodHeight
              );

              // UPDATED: Increased minimum row spacing
              yPos += Math.max(maxContentHeight, 6) + 2; // Increased base height and spacing

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
            yPos += 8; // Reduced space after verified by from 6 to 5

            // Reset font
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
          });

          yPos += 4; // Reduced space between departments from 5 to 4
        });

        currentYPosition = yPos;
      }

      // Mark that we're no longer in the table section
      isTableStarted = false;

      // FIXED: Consistent space checking for both versions
      const ensureSpaceForFooter = (currentYPosition) => {
        const pageHeight = doc.internal.pageSize.height;
        const footerStart =
          pageHeight - (footerHeight + signatureHeight + disclaimerHeight + 12); // Added extra space

        if (currentYPosition + 5 >= footerStart) {
          // Reduced from 10 to 5
          addSignatures();
          doc.addPage();
          pageCount++;
          addHeaderFooter();
          return contentYStart;
        }
        return currentYPosition;
      };

      // Use this function before adding final content
      currentYPosition = ensureSpaceForFooter(currentYPosition);

      // End of report - Center within content margins
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const centerX = leftMargin + contentWidth / 2;
      doc.text("**End Of Report**", centerX, currentYPosition, {
        align: "center",
      });

      // Add signatures at the bottom of the last page
      addSignatures();

      // CRITICAL: Get the final page count AFTER all content is rendered
      const finalPageCount = pageCount;

      // FIXED: Add page numbers with consistent positioning for both versions
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

      // Generate the PDF as a Blob
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Open the PDF in a new tab for preview
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error while generating the PDF:", error);
      toast.error("An unexpected error occurred while generating the PDF");
    }
  };
  const filteredTests = tests.filter((test) =>
    test.testname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Extract test number for display
  const extractTestNumber = (testname) => {
    const match = testname.match(/\d+/);
    return match ? match[0] : "";
  };
  return (
    <ModalOverlay>
      <ModalContent>
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
                (t) => t.testname === test.testname
              );
              const testNumber = extractTestNumber(test.testname);

              return (
                <TestItem
                  key={test.testname}
                  onClick={() => handleSelectTest(test)}
                >
                  <TestInfo>
                    <CheckboxContainer checked={isSelected}>
                      {isSelected && <Check size={14} color="white" />}
                    </CheckboxContainer>
                    <TestName selected={isSelected}>
                      {test.testname}
                      {testNumber && <TestNumber>#{testNumber}</TestNumber>}
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

export default TestSorting;
