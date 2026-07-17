import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { format } from "date-fns";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import headerImage from "../Images/Header.png";
import FooterImage from "../Images/Footer.png";
import Rajesh from "../Images/Rajesh.png";
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
  MessageCircle,
} from "lucide-react";

// Styled components remain the same as TestSorting.js
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
    color: #db9bb9;
    font-weight: bold;
    margin-left: 4px;
  }
`;

const DispatchButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  background-color: ${(props) => (props.dispatched ? "#28A745" : "#DB9BB9")};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  gap: 6px;
  margin-left: 10px;

  &:hover {
    background-color: ${(props) => (props.dispatched ? "#218838" : "#c985a7")};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 20px;
  color: #555;
  font-size: 16px;
  font-weight: 500;
`;

const PreliminaryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  background-color: #7b2ff720;
  color: #7b2ff7;
  border: 1px solid #7b2ff7;
  white-space: nowrap;
  margin-left: 8px;
`;

const MBTestSorting = ({ patient, onClose }) => {
  const [tests, setTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [dispatchedTests, setDispatchedTests] = useState(new Set());
  const [showWhatsAppOptions, setShowWhatsAppOptions] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      setIsLoading(true);
      setLoadingMessage("Loading tests...");
      try {
        const response = await apiRequest(
          `${Labbaseurl}mb_patient_test_sorting/?barcode=${patient.barcode}&date=${patient.date}`,
          "GET",
          null,
          {},
          {},
        );

        if (response.success) {
          if (response.data[patient.barcode]) {
            const testDetails =
              response.data[patient.barcode].testdetails || [];
            const sortedTests = testDetails.sort((a, b) => {
              const numA = parseInt(a.test_name.match(/\d+/)?.[0]) || 0;
              const numB = parseInt(b.test_name.match(/\d+/)?.[0]) || 0;
              return numA - numB;
            });

            const testsWithDispatch = sortedTests.map((test) => ({
              test_id: test.test_id,
              testname: test.test_name,
              NABL: test.NABL || false,
              dispatched: test.dispatch || false,
              created_date: test.created_date, // Changed from test.dispatched to test.dispatch
              is_preliminary: test.is_preliminary || false, // ← ADD
              record_id: test.record_id || null,
            }));

            setTests(testsWithDispatch);

            // Initialize dispatched tests set
            const dispatchedSet = new Set();
            testsWithDispatch.forEach((test) => {
              if (test.dispatched) {
                dispatchedSet.add(test.record_id);
              }
            });
            setDispatchedTests(dispatchedSet);
          } else {
            setTests([]);
          }
        } else {
          console.error(
            "Error fetching tests:",
            response.error,
            response.status,
          );
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

  const handleDispatchTest = async (test, e) => {
    e.stopPropagation(); // Prevent test selection when clicking dispatch

    try {
      const response = await apiRequest(
        `${Labbaseurl}mb_update_dispatch_status/${patient.barcode}/`,
        "PATCH",
        {
          test_id: test.test_id,
          created_date: test.created_date, // Send the created_date to target specific document
        },
        {
          "Content-Type": "application/json",
        },
      );

      if (response.success) {
        toast.success(`Test "${test.testname}" dispatched successfully!`);

        // Update the dispatched tests set
        setDispatchedTests((prev) => {
          const newSet = new Set(prev);
          newSet.add(test.record_id);
          return newSet;
        });

        // Update the tests array
        setTests((prev) =>
          prev.map((t) =>
            t.record_id === test.record_id ? { ...t, dispatched: true } : t,
          ),
        );
      } else {
        toast.error(`Failed to dispatch test: ${response.error}`);
      }
    } catch (error) {
      console.error("Error dispatching test:", error);
      toast.error("Failed to dispatch test");
    }
  };

  const handleSelectTest = (test) => {
    setSelectedTests((prev) => {
      const isSelected = prev.some((t) => t.record_id === test.record_id);
      return isSelected
        ? prev.filter((t) => t.record_id !== test.record_id)
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
      // Build comma-separated record_ids from selected tests
      const recordIds = selectedTests
        .map((t) => t.record_id)
        .filter(Boolean)
        .join(",");

      const url = recordIds
        ? `${Labbaseurl}mb_get_patient_test_details/?barcode=${patient.barcode}&record_ids=${encodeURIComponent(recordIds)}`
        : `${Labbaseurl}mb_get_patient_test_details/?barcode=${patient.barcode}`;

      const response = await apiRequest(url, "GET");

      if (!response.success) {
        console.error("Failed to fetch patient details:", response.error);
        toast.error(response.error || "Failed to fetch patient details");
        return;
      }

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
            (record) => record.testdetails || [],
          ),
        };
      }

      // Filter tests by test_id
      const orderedTests = selectedTests
        .map((selectedTest) => {
          const testDetail = patientDetails.testdetails.find(
            (t) => t.record_id === selectedTest.record_id, // ← clean match by record_id
          );
          if (testDetail) {
            return {
              ...testDetail,
              record_id: selectedTest.record_id,
              is_preliminary: testDetail.is_preliminary,
            };
          }
          return null;
        })
        .filter((test) => test);

      if (!orderedTests.length) {
        toast.error("No matching tests found for the selected tests.");
        return;
      }

      const extractPatientRefNoNumber = (refNo) => {
        if (!refNo) return "N/A";
        const numberPart = refNo.split("+")[0];
        return numberPart;
      };

      // CORRECTED: Map designation codes to consultant positions
      // Note: Adjust designation codes based on your actual data
      const designationMapping = {
        DESIG101: { position: 0, title: "Consultant Microbiologist" },
        DESIG100: { position: 1, title: "Consultant Pathologist" },
        DESIG099: { position: 2, title: "Consultant Biochemist" },
      };

      // Build consultants array dynamically from signatures data
      const consultants = [];

      // Initialize with empty slot for Microbiologist
      consultants[0] = null;

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
            signatureImage,
          ];
        }
      });

      // Filter out null entries (positions without signatures)
      const activeConsultants = consultants.filter((c) => c !== null);

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
      const contentYStart = headerHeight + 25;
      const signatureHeight = 25;
      const tableHeaderHeight = 10;

      // Column widths for Microbiology
      const microbiologyColWidths = [
        contentWidth * 0.5, // Antimicrobial
        contentWidth * 0.25, // Result
        contentWidth * 0.25, // Zone of Inhibition (mm)
      ];

      const leftDetails = [
        { label: "Patient ID", value: patientDetails.patient_id || "N/A" },
        {
          label: "Name",
          value: patientDetails.patientname || "No name provided",
        },
        {
          label: "Age/Gender",
          value: `${patientDetails.age || "N/A"} ${patientDetails.age_type}/ ${
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
        {
          label: "Printed On",
          value: format(new Date(), "dd MMM yy / HH:mm"),
        },
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

        // FIX: Use the maximum length of both arrays
        const maxLength = Math.max(leftDetails.length, rightDetails.length);

        for (let i = 0; i < maxLength; i++) {
          const left = leftDetails[i];
          const right = rightDetails[i];

          // Handle left side (only if exists)
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

            leftValueLines.forEach((line, lineIndex) => {
              doc.text(line, leftValueX, patientInfoY + lineIndex * 4);
            });

            var leftRowHeight = leftValueLines.length * 4;
          } else {
            var leftRowHeight = 5; // Default height when no left detail
          }

          // Handle right side (only if exists)
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
                patientInfoY + 4,
                25,
                10,
              );
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
            headerHeight,
          );
          const footerY = doc.internal.pageSize.height - footerHeight;
          doc.addImage(
            FooterImage,
            "PNG",
            0,
            footerY,
            doc.internal.pageSize.width,
            footerHeight,
          );
        } else {
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(255, 255, 255);
          doc.text("Header Space", leftMargin, 10);
          doc.setTextColor(0, 0, 0);
        }
      };

      const drawMicrobiologyTableHeader = (yPos) => {
        // Top border of table
        doc.setDrawColor(0, 0, 0); // Black color
        doc.line(leftMargin, yPos, rightMargin, yPos);

        // Left border
        doc.line(leftMargin, yPos, leftMargin, yPos + 13);

        // Right border
        doc.line(rightMargin, yPos, rightMargin, yPos + 13);

        yPos += 5;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        const headers = ["Antimicrobial", "Result", "Zone of Inhibition (mm)"];

        const headerPadding = 2; // Left padding for first column
        let xPos = leftMargin + headerPadding;

        headers.forEach((header, index) => {
          if (index === 0) {
            // First column with padding
            doc.text(header, xPos, yPos);
            xPos = leftMargin + microbiologyColWidths[0]; // Reset to column boundary
          } else if (index === 2) {
            // Center the "Zone of Inhibition (mm)" header
            const headerWidth = microbiologyColWidths[index];
            const textWidth = doc.getTextWidth(header);
            doc.text(header, xPos + (headerWidth - textWidth) / 2, yPos);
          } else {
            doc.text(header, xPos, yPos);
            xPos += microbiologyColWidths[index];
          }
        });

        yPos += 3;
        doc.line(leftMargin, yPos, rightMargin, yPos);
        yPos += 7;
        return yPos;
      };

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
        lines.forEach((line, index) => {
          doc.text(line, startX, yPos + index * lineHeight);
        });
        return lines.length * lineHeight;
      };

      const addSignatures = () => {
        const pageHeight = doc.internal.pageSize.height;
        const signaturesY = pageHeight - footerHeight - signatureHeight - 10;
        const signatureWidth = 35;

        // Only show signatures if we have active consultants
        if (activeConsultants.length === 0) return;

        // Calculate spacing based on number of active consultants
        const totalConsultants = activeConsultants.length;

        // Calculate starting position from RIGHT side
        const rightEdge = rightMargin;
        const signatureSpacing = 60; // Fixed spacing between signatures

        // Start from right edge and work backwards
        const startX = rightEdge - totalConsultants * signatureSpacing;

        activeConsultants.forEach((consultant, index) => {
          // Position from the calculated start point, moving right
          const xPosition = startX + index * signatureSpacing;

          // Display signature image if available
          if (consultant[2]) {
            doc.addImage(
              consultant[2],
              "PNG",
              xPosition,
              signaturesY,
              signatureWidth,
              15,
            );
          }

          // Display full name with credentials
          const fullName = consultant[0];

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text(fullName, xPosition, signaturesY + 18);

          // Display title (Consultant position)
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text(consultant[1], xPosition, signaturesY + 23);
        });
      };

      const checkForNewPage = (
        yPos,
        estimatedHeight,
        shouldDrawTableHeader = false,
      ) => {
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
          if (shouldDrawTableHeader) {
            newYPos = drawMicrobiologyTableHeader(newYPos);
          }
          return newYPos;
        }
        return yPos;
      };

      addHeaderFooter();
      let currentYPosition = addPatientInfo(contentYStart);
      currentYPosition += 10;

      // Sort orderedTests by the selection order
      orderedTests.sort((a, b) => {
        const indexA = selectedTests.findIndex(
          (t) => t.record_id === a.record_id,
        );
        const indexB = selectedTests.findIndex(
          (t) => t.record_id === b.record_id,
        );
        return indexA - indexB;
      });

      if (orderedTests.length) {
        isTableStarted = true;
        currentYPosition = checkForNewPage(currentYPosition, tableHeaderHeight);
        let yPos = currentYPosition;

        orderedTests.forEach((test, testIndex) => {
          // Display Department (centered and bold)
          const departmentHeight = 15;
          yPos = checkForNewPage(yPos, departmentHeight);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          const departmentText = test.department.toUpperCase();
          const departmentTextWidth = doc.getTextWidth(departmentText);
          const centerX = leftMargin + contentWidth / 2;
          doc.text(departmentText, centerX, yPos, { align: "center" });
          doc.line(
            centerX - departmentTextWidth / 2,
            yPos + 2,
            centerX + departmentTextWidth / 2,
            yPos + 2,
          );
          yPos += 8;

          // Display Test Name (bold)
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text(test.testname, leftMargin, yPos);
          if (test.is_preliminary) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.setTextColor(123, 47, 247); // purple color matching badge
            doc.text("[ Preliminary Report ]", leftMargin, yPos + 5);
            doc.setTextColor(0, 0, 0); // reset to black
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            yPos += 5; // extra space for the label
          }
          yPos += 6;

          // Calculate max label width for proper alignment
          const testLabels = [
            "Specimen Type",
            "Colony Count",
            test.is_AG_title ? "Sputum for AFB" : "Organism Isolated",
          ];
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          const maxLabelWidth = Math.max(
            ...testLabels.map((label) => doc.getTextWidth(label)),
          );
          const colonX = leftMargin + maxLabelWidth + 2;
          const valueX = colonX + 3;

          // Display Specimen Type
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Specimen Type", leftMargin, yPos);
          doc.text(":", colonX, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(test.specimen_type || "N/A", valueX, yPos);
          yPos += 6;

          // Display Colony Count (if exists)
          if (test.colony_count && test.colony_count.trim() !== "") {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text("Colony Count", leftMargin, yPos);
            doc.text(":", colonX, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(test.colony_count, valueX, yPos);
            yPos += 6;
          }

          // Display Remarks (if exists)
          // Display Remarks (if exists)
          if (test.remarks && test.remarks.trim() !== "") {
            const remarksLabel = test.is_AG_title
              ? "Sputum for AFB"
              : "Organism Isolated";

            // Check if page break needed before rendering
            const estimatedLines = doc.splitTextToSize(
              test.remarks,
              contentWidth - (valueX - leftMargin) - 2,
            ).length;
            yPos = checkForNewPage(yPos, estimatedLines * 5 + 4);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text(remarksLabel, leftMargin, yPos);
            doc.text(":", colonX, yPos);
            doc.setFont("helvetica", "normal");

            const maxValueWidth = rightMargin - valueX - 2; // remaining width after label
            const remarksHeight = renderWrappedText(
              doc,
              test.remarks,
              maxValueWidth,
              valueX,
              yPos,
              5,
            );
            yPos += remarksHeight + 2;
          } else {
            yPos += 2;
          }
          // Only draw table header if parameters exist
          if (test.parameters && test.parameters.length > 0) {
            doc.setFont("helvetica", "normal");
            const tableStartY = yPos;
            yPos = drawMicrobiologyTableHeader(yPos);

            // Render parameters
            const validParameters = test.parameters.filter(
              (param) => param.result !== "Nil",
            );

            validParameters.forEach((param, paramIndex) => {
              const paramHeight = 11;
              // Pass true to indicate we need table header if page breaks
              yPos = checkForNewPage(yPos, paramHeight, true);

              doc.setFontSize(10);
              doc.setFont("helvetica", "normal");

              const paramPadding = 2; // Left padding for parameter names
              let xPos = leftMargin + paramPadding;

              // Check if zone value exists to determine if we should bold
              const hasZoneValue = param.value && param.value.trim() !== "";

              // Draw left border
              doc.setDrawColor(0, 0, 0);
              doc.line(leftMargin, yPos - 4, leftMargin, yPos + 2);

              // Antimicrobial (test_name) - with padding
              const antimicrobialText = param.test_name || "";
              renderWrappedText(
                doc,
                antimicrobialText,
                microbiologyColWidths[0] - paramPadding - 2,
                xPos,
                yPos,
              );
              xPos = leftMargin + microbiologyColWidths[0]; // Reset to column boundary

              // Result - make bold if zone value exists
              if (hasZoneValue) {
                doc.setFont("helvetica", "bold");
              }
              const resultText = param.result || "";
              doc.text(resultText, xPos, yPos);
              xPos += microbiologyColWidths[1];

              // Zone of Inhibition (value) - centered and bold if exists
              const zoneText = param.value || "";
              if (zoneText) {
                const zoneTextWidth = doc.getTextWidth(zoneText);
                const columnWidth = microbiologyColWidths[2];
                const centeredX = xPos + (columnWidth - zoneTextWidth) / 2;
                doc.text(zoneText, centeredX, yPos);
              }

              // Draw right border
              doc.line(rightMargin, yPos - 4, rightMargin, yPos + 2);

              // Reset font to normal
              doc.setFont("helvetica", "normal");
              yPos += 4;

              // Draw grey dotted line for parameter separation (skip for last parameter)
              const isLastParameter = paramIndex === validParameters.length - 1;
              if (!isLastParameter) {
                doc.setDrawColor(128, 128, 128); // Grey color
                doc.setLineDash([1, 1]); // Dotted pattern
                doc.line(leftMargin, yPos, rightMargin, yPos);
                doc.setLineDash([]); // Reset to solid line
                doc.setDrawColor(0, 0, 0); // Reset to black
              }

              yPos += 5;

              // Add comment for parameter if exists
              if (param.comment && param.comment.trim() !== "") {
                doc.setFont("helvetica", "italic");
                doc.setFontSize(8);
                const paramCommentText = `Note: ${param.comment}`;
                const paramCommentHeight = renderWrappedText(
                  doc,
                  paramCommentText,
                  contentWidth - 2,
                  leftMargin,
                  yPos,
                  3.5,
                );
                yPos += paramCommentHeight + 2;
              }

              // Reset styling
              doc.setFont("helvetica", "normal");
              doc.setFontSize(10);
            });

            // Draw bottom border of table
            doc.setDrawColor(0, 0, 0);
            doc.line(leftMargin, yPos - 4, rightMargin, yPos - 4);
          }

          // Add comment for main test (if no parameters and comment exists)
          if (
            (!test.parameters || test.parameters.length === 0) &&
            test.comment &&
            test.comment.trim() !== ""
          ) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(8);
            const commentText = `Note: ${test.comment}`;
            const commentHeight = renderWrappedText(
              doc,
              commentText,
              contentWidth - 2,
              leftMargin,
              yPos,
              3.5,
            );
            yPos += commentHeight + 2;
          }

          // Display "Verified by"
          if (test.verified_by && test.verified_by.trim() !== "") {
            yPos += 10;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`Verified by: ${test.verified_by}`, leftMargin, yPos);
            yPos += 4;
          }

          // Add spacing between tests
          yPos += testIndex === orderedTests.length - 1 ? 2 : 6;
        });

        currentYPosition = yPos;
      }

      isTableStarted = false;

      const ensureSpaceForFooter = (currentYPosition) => {
        const pageHeight = doc.internal.pageSize.height;
        const footerStart = pageHeight - (footerHeight + signatureHeight + 15);
        if (currentYPosition + 5 >= footerStart) {
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
      doc.text("***", centerX, currentYPosition, {
        align: "center",
      });

      addSignatures();

      const finalPageCount = pageCount;
      for (let i = 1; i <= finalPageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height;
        const pageNumberY = pageHeight - footerHeight - 6;
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

  const handleWhatsAppShare = async (patient, withLetterpad = true) => {
    if (!patient || !patient.phone) {
      toast.error("Patient phone number is missing");
      return;
    }

    const phoneNumber = patient.phone.startsWith("+91")
      ? patient.phone.replace("+", "")
      : `91${patient.phone}`;

    try {
      const pdfBlob = await handlePrint(patient, withLetterpad, false); // Generate PDF (no download)
      if (!pdfBlob) {
        toast.error("Failed to generate the PDF");
        return;
      }

      const pdfName = `${patient.patient_name || "Patient"}_TestDetails.pdf`;
      const pdfFile = new File([pdfBlob], pdfName, { type: "application/pdf" });

      // Upload PDF to server
      const formData = new FormData();
      formData.append("file", pdfFile);

      const uploadResponse = await axios.post(
        `${Labbaseurl}upload-pdf/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

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
        patient_id: patient.patient_id,
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

  const filteredTests = tests.filter((test) =>
    test.testname.toLowerCase().includes(searchTerm.toLowerCase()),
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
          <Title>Sort and Select Microbiology Tests</Title>
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
                (t) => t.record_id === test.record_id,
              );
              const isDispatched = dispatchedTests.has(test.record_id);

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
                      {test.testname}
                      {test.NABL && <span className="nabl-asterisk">*</span>}
                      {test.is_preliminary && ( // ← ADD
                        <PreliminaryBadge>Preliminary</PreliminaryBadge>
                      )}
                    </TestName>
                  </TestInfo>
                  <DispatchButton
                    dispatched={isDispatched}
                    onClick={(e) => handleDispatchTest(test, e)}
                    disabled={isDispatched}
                    title={
                      isDispatched ? "Already Dispatched" : "Dispatch Test"
                    }
                  >
                    <Flag size={14} />
                    {isDispatched ? "Dispatched" : "Dispatch"}
                  </DispatchButton>
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
            {/* WhatsApp Dropdown */}
            <div style={{ position: "relative" }}>
              <Button
                primary
                disabled={selectedTests.length === 0}
                onClick={() => {
                  setShowPrintOptions(false);
                  setShowWhatsAppOptions(!showWhatsAppOptions);
                }}
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle size={16} />
                WhatsApp
                {showWhatsAppOptions ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </Button>

              <PrintOptions show={showWhatsAppOptions}>
                <PrintOption
                  onClick={() => {
                    handleWhatsAppShare(patient, true);
                    setShowWhatsAppOptions(false);
                  }}
                >
                  <MessageCircle size={16} />
                  Send with Letterhead
                </PrintOption>
                <PrintOption
                  onClick={() => {
                    handleWhatsAppShare(patient, false);
                    setShowWhatsAppOptions(false);
                  }}
                >
                  <MessageCircle size={16} />
                  Send without Letterhead
                </PrintOption>
              </PrintOptions>
            </div>
            {/* Print Dropdown */}
            <div style={{ position: "relative" }}>
              <Button
                primary
                disabled={selectedTests.length === 0}
                onClick={() => {
                  setShowWhatsAppOptions(false);
                  setShowPrintOptions(!showPrintOptions);
                }}
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
            </div>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MBTestSorting;
