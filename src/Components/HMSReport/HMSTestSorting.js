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
import apiRequest from "../Auth/apiRequest";
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
const HMSTestSorting = ({ patient, onClose }) => {
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
          `${Labbaseurl}patient_test_sorting/?barcode=${patient.barcode}&date=${patient.date}`,
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
      console.log("Fetching patient details for barcode:", patient.barcode);
      const response = await apiRequest(
        `${Labbaseurl}get_hms_patient_test_details/?barcode=${patient.barcode}`,
        "GET"
      );

      if (!response.success) {
        console.error("Failed to fetch patient details:", response.error);
        toast.error(response.error || "Failed to fetch patient details");
        return;
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
      console.log("Selected Tests:", selectedTests);
      const orderedTests = selectedTests
        .map((test) =>
          patientDetails.testdetails.find((t) => t.testname === test.testname)
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

      const consultants = [
        ["Dr. S. Brindha M.D.", "Consultant Pathologist"],
        ["Dr. Rajesh Sengodan M.D.", "Consultant Microbiologist"],
        ["Dr. R. VIJAYAN Ph.D.", "Consultant Biochemist", Vijayan],
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
      const contentYStart = headerHeight + 15;
      const signatureHeight = 25;
      const disclaimerHeight = 0;
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

      const addHeaderFooter = () => {
        if (withLetterpad) {
          doc.addImage(
            headerImage,
            "PNG",
            0,
            5,
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

      const wrapText = (doc, text, maxWidth, startX, yPos, lineHeight = 4) => {
        if (!text) return 0;
        const splitText = doc.splitTextToSize(text, maxWidth);
        splitText.forEach((line, index) => {
          doc.text(line, startX, yPos + index * lineHeight);
        });
        return splitText.length * lineHeight;
      };

      const addSignatures = () => {
        const pageHeight = doc.internal.pageSize.height;
        const signaturesY = pageHeight - footerHeight - signatureHeight - 10;
        const signatureWidth = 35;
        const availableWidth = contentWidth - (signatureWidth / 2) * 2;
        const signatureSpacing = availableWidth / (consultants.length - 1);
        consultants.forEach((consultant, index) => {
          const xPosition = leftMargin + index * signatureSpacing;
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
        const footerStart =
          pageHeight - (footerHeight + signatureHeight + disclaimerHeight + 12);
        if (yPos + estimatedHeight >= footerStart) {
          addSignatures();
          doc.addPage();
          pageCount++;
          addHeaderFooter();
          let newYPos = contentYStart;
          newYPos = addPatientInfo(newYPos);
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

      orderedTests.sort((a, b) => {
        const indexA = selectedTests.findIndex(
          (t) => t.testname === a.testname
        );
        const indexB = selectedTests.findIndex(
          (t) => t.testname === b.testname
        );
        return indexA - indexB;
      });

      if (orderedTests.length) {
        isTableStarted = true;
        currentYPosition = checkForNewPage(currentYPosition, tableHeaderHeight);
        let yPos = currentYPosition;
        yPos = drawTableHeader(yPos);

        const testsByDepartment = orderedTests.reduce((acc, test) => {
          (acc[test.department] = acc[test.department] || []).push(test);
          return acc;
        }, {});

        Object.keys(testsByDepartment).forEach((department) => {
          const departmentHeight = 15;
          yPos = checkForNewPage(yPos, departmentHeight);
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
            yPos + 2
          );
          yPos += 10;

          testsByDepartment[department].forEach((test) => {
            const testsToRender =
              test.parameters && test.parameters.length > 0
                ? [test, ...test.parameters]
                : [test];
            testsToRender.forEach((currentTest, index) => {
              const estimatedHeight = 18;
              yPos = checkForNewPage(yPos, estimatedHeight);
              doc.setFontSize(10);
              let xPos = leftMargin;
              if (index === 0) {
                doc.setFont("helvetica", "bold");
              } else {
                doc.setFont("helvetica", "normal");
              }
              const testNameHeight = wrapText(
                doc,
                index === 0
                  ? test.NABL
                    ? `${currentTest.testname}*`
                    : currentTest.testname
                  : `${currentTest.name}`,
                colWidths[0] - 2,
                xPos,
                yPos,
                4
              );
              xPos += colWidths[0];
              doc.setFont("helvetica", "normal");
              doc.text(currentTest.specimen_type || "", xPos, yPos);
              xPos += colWidths[1];
              xPos += colWidths[2];
              const statusIndicator = currentTest.isHigh
                ? "H"
                : currentTest.isLow
                ? "L"
                : getHighLowStatus(
                    currentTest.value,
                    currentTest.reference_range
                  );
              const valueText = currentTest.value || "";
              if (statusIndicator) {
                doc.setFont("helvetica", "bold");
                if (statusIndicator === "H") {
                  doc.setTextColor(255, 0, 0);
                } else if (statusIndicator === "L") {
                  doc.setTextColor(0, 0, 255);
                }
                doc.text(valueText, xPos, yPos);
                const valueWidth = doc.getTextWidth(valueText);
                if (statusIndicator === "H") {
                  drawArrowSymbol(doc, xPos + valueWidth + 2, yPos - 1, "up");
                } else if (statusIndicator === "L") {
                  drawArrowSymbol(doc, xPos + valueWidth + 2, yPos - 1, "down");
                }
                doc.setTextColor(0, 0, 0);
                doc.setFont("helvetica", "normal");
              } else {
                doc.text(valueText, xPos, yPos);
              }
              xPos += colWidths[3];
              doc.setFont("helvetica", "normal");
              renderUnicodeText(currentTest.unit || "", xPos, yPos);
              xPos += colWidths[4];
              const referenceRangeHeight = wrapText(
                doc,
                currentTest.reference_range || "",
                colWidths[5] - 2,
                xPos,
                yPos,
                4
              );
              xPos += colWidths[5];
              doc.setTextColor(0, 0, 0);
              const methodText = (currentTest.method || "")
                .replace(/\bMethod\b/i, "")
                .trim();
              const methodHeight = wrapText(
                doc,
                methodText,
                colWidths[6] - 2,
                xPos,
                yPos,
                4
              );
              doc.setTextColor(0, 0, 0);
              const maxContentHeight = Math.max(
                testNameHeight,
                referenceRangeHeight,
                methodHeight
              );
              yPos += Math.max(maxContentHeight, 6) + 2;
              doc.setFont("helvetica", "normal");
              doc.setTextColor(0, 0, 0);
            });
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(
              `Verified by: ${test.verified_by || "N/A"}`,
              leftMargin,
              yPos
            );
            yPos += 8;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
          });
          yPos += 4;
        });
        currentYPosition = yPos;
      }

      isTableStarted = false;
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

      currentYPosition = ensureSpaceForFooter(currentYPosition);

      const hasNABLTests = orderedTests.some((test) => test.NABL === true);

      if (hasNABLTests) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("*Test under NABL Scope", leftMargin, currentYPosition);
        currentYPosition += 5;
      }

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
        const pageNumberY = pageHeight - footerHeight - 5;
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

export default HMSTestSorting;