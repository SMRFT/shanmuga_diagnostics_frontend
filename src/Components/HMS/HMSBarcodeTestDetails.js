import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import JsBarcode from "jsbarcode";
import styled from "styled-components";
import apiRequest from "../Auth/apiRequest";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowLeft,
  Printer,
  ScanBarcodeIcon as BarcodeScan,
  RefreshCw,
  User,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";

// Toast notification component
const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Toast = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out forwards;
  max-width: 350px;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  &.success {
    background-color: #ecfdf5;
    border-left: 4px solid #10b981;
    color: #065f46;
  }

  &.error {
    background-color: #fef2f2;
    border-left: 4px solid #ef4444;
    color: #991b1b;
  }

  &.warning {
    background-color: #fffbeb;
    border-left: 4px solid #f59e0b;
    color: #92400e;
  }

  &.info {
    background-color: #eff6ff;
    border-left: 4px solid #3b82f6;
    color: #1e40af;
  }
`;

const ToastMessage = styled.div`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
`;

// Main container
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: transparent;
  border: none;
  color: #6366f1;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  margin-bottom: 1.5rem;

  &:hover {
    background-color: rgba(99, 102, 241, 0.1);
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const PatientCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const PatientCardHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 1rem 1.5rem;
  color: white;
`;

const PatientName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
`;

const PatientCardBody = styled.div`
  padding: 1rem 1.5rem;
`;

const PatientInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const PatientInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: #334155;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
`;

const TableHead = styled.thead`
  background-color: #f8fafc;

  th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e2e8f0;

    &:first-child {
      border-top-left-radius: 12px;
    }

    &:last-child {
      border-top-right-radius: 12px;
    }
  }
`;

const TableBody = styled.tbody`
  tr {
    &:hover {
      background-color: #f8fafc;
    }

    &:not(:last-child) td {
      border-bottom: 1px solid #e2e8f0;
    }
  }

  td {
    padding: 1rem;
    font-size: 0.875rem;
    color: #334155;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #6366f1;
  color: white;

  &:hover:not(:disabled) {
    background-color: #4f46e5;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #f8fafc;
  color: #334155;
  border: 1px solid #e2e8f0;

  &:hover:not(:disabled) {
    background-color: #f1f5f9;
  }
`;

const PrintSection = styled.div`
  display: none;
`;

const BarcodeItem = styled.div`
  width: 50mm;
  height: 25mm;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
  overflow: hidden;
  page-break-before: always;
  padding: 1mm;
  box-sizing: border-box;
`;

const BarcodeText = styled.p`
  font-size: 8px;
  margin: 0 0 1px 0;
  white-space: nowrap;
  text-align: left;
  width: 100%;
`;

const BarcodeDate = styled.p`
  font-size: 7px;
  margin: 0 0 2px 0;
  text-align: left;
  width: 100%;
`;

const ContainerName = styled.div`
  font-size: 6px;
  font-weight: bold;
  margin: 1px 0 0 0;
  text-align: left;
  width: 100%;
  color: #333;
`;

const BarcodeContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin: 1px 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
  text-align: center;
`;

const EmptyStateText = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin: 0.5rem 0 0;
`;

// Toast notification system
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const ToastDisplay = () => (
    <ToastContainer>
      {toasts.map((toast) => (
        <Toast key={toast.id} className={toast.type}>
          {toast.type === "success" && <CheckCircle2 size={18} />}
          {toast.type === "error" && <AlertCircle size={18} />}
          {toast.type === "warning" && <AlertCircle size={18} />}
          {toast.type === "info" && <Info size={18} />}
          <ToastMessage>{toast.message}</ToastMessage>
        </Toast>
      ))}
    </ToastContainer>
  );

  return {
    success: (message) => addToast(message, "success"),
    error: (message) => addToast(message, "error"),
    warning: (message) => addToast(message, "warning"),
    info: (message) => addToast(message, "info"),
    ToastDisplay,
  };
};

const HMSBarcodeTestDetails = () => {
  const location = useLocation();
  const toast = useToast();
  const printSectionRef = useRef(null);
  const navigate = useNavigate();
  const { patientId, selectedDate, gender, bill_no } = location.state || {};
  const [testDetails, setTestDetails] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [barcodeData, setBarcodeData] = useState([]);

  // Function to extract barcode from bill number
  const extractBarcodeFromBillNo = (billNumber) => {
    if (!billNumber) return null;
    
    // Split by '/' and take the last part
    const parts = billNumber.split('/');
    if (parts.length > 1) {
      return parts[parts.length - 1]; // Returns '000056' from '2425/000056'
    }
    
    // If no '/' found, return the original bill number
    return billNumber;
  };

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const formatDate = (dateString) => {
    // Create date object and get UTC components to avoid timezone issues
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleGenerateBarcode = async () => {
    if (!selectedPatient || !bill_no) {
      toast.error("Patient information or bill number is missing.");
      return false;
    }

    try {
      setIsGenerating(true);

      // Extract barcode from bill number
      const patientBarcode = extractBarcodeFromBillNo(bill_no);
      
      if (!patientBarcode) {
        toast.error("Could not extract barcode from bill number.");
        return false;
      }

      // Group tests by container
      const containerGroups = {};
      testDetails.forEach((test) => {
        const container = test.container || "";
        if (!containerGroups[container]) {
          containerGroups[container] = [];
        }
        containerGroups[container].push(test);
      });

      // Update test details with barcode
      const updatedTestDetails = testDetails.map((test) => {
        return {
          ...test,
          barcode: patientBarcode,
        };
      });

      setTestDetails(updatedTestDetails);

      // Create barcode data for UI
      const newBarcodeData = [
        ...Object.entries(containerGroups).map(([container, testdetails]) => ({
          barcode: patientBarcode,
          containerName: container,
          isExtra: false,
        })),
        {
          barcode: patientBarcode,
          containerName: "",
          isExtra: true,
        },
      ];

      setBarcodeData(newBarcodeData);

      // Prepare payload for saving
      const payload = {        
        date: formatDate(selectedPatient?.date),
        billnumber: bill_no,
        testdetails: updatedTestDetails,
        barcode: patientBarcode,        
      };

      // Save the barcode using your apiRequest method
      const saveUrl = `${Labbaseurl}save-hms-barcodes/`;
      const saveResponse = await apiRequest(saveUrl, "POST", payload);

      // Check if save was successful and handle errors properly
      if (saveResponse && saveResponse.error) {
        toast.error(saveResponse.error);
        return false;
      } else if (saveResponse) {
        toast.success("All barcodes saved successfully!");
        return true;
      }
    } catch (error) {
      console.error("Error generating barcode:", error);
      toast.error("Failed to generate barcode.");
      return false;
    } finally {
      setIsGenerating(false);
    }

    return false;
  };

  const handleReGenerateBarcode = async () => {
    if (!selectedPatient || !selectedDate || !bill_no) {
      toast.error("Patient, date, or bill number is missing.");
      return;
    }

    try {
      setIsGenerating(true);

      // Extract barcode from bill number
      const patientBarcode = extractBarcodeFromBillNo(bill_no);
      
      if (!patientBarcode) {
        toast.error("Could not extract barcode from bill number.");
        return;
      }

      // Group tests by container
      const containerGroups = {};
      testDetails.forEach((test) => {
        const container = test.container || "";
        if (!containerGroups[container]) {
          containerGroups[container] = [];
        }
        containerGroups[container].push(test);
      });

      const updatedTestDetails = testDetails.map((test) => {
        return { ...test, barcode: patientBarcode };
      });

      setTestDetails(updatedTestDetails);

      const newBarcodeData = [
        ...Object.entries(containerGroups).map(
          ([container, testdetails]) => ({
            barcode: patientBarcode,
            containerName: container,
            isExtra: false,
          })
        ),
        {
          barcode: patientBarcode,
          containerName: "",
          isExtra: true,
        },
      ];

      setBarcodeData(newBarcodeData);

      toast.success("Barcodes updated successfully!");
    } catch (error) {
      console.error("Error regenerating barcode:", error);
      toast.error("Failed to regenerate barcode.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAndPrint = async () => {
    const newBarcodesGenerated = await handleGenerateBarcode();
    if (newBarcodesGenerated) {
      setTimeout(() => {
        handlePrintBarcodes();
      }, 2000);
    }
  };

  const handleReGenerateAndPrint = () => {
    handleReGenerateBarcode();
    setTimeout(() => {
      handlePrintBarcodes();
    }, 2000);
  };

  const handlePrintBarcodes = () => {
    if (!printSectionRef.current) return;

    setIsPrinting(true);

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";

    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;

    doc.open();
    doc.write(`
 <html>
 <head>
 <style>
 @page {
 size: 50mm 25mm;
 margin: 0;
 }
 body {
 font-family: Arial, sans-serif;
 margin: 0;
 padding: 0;
 display: flex;
 flex-wrap: wrap;
 justify-content: flex-start;
 align-items: flex-start;
 }
 .barcode-item {
 width: 50mm;
 height: 25mm;
 display: flex;
 flex-direction: column;
 align-items: flex-start;
 justify-content: flex-start;
 text-align: left;
 overflow: hidden;
 page-break-before: always;
 padding: 1mm;
 box-sizing: border-box;
 }
 .barcode-text {
 font-size: 10px;
 margin: 0 0 1px 0;
 white-space: nowrap;
 text-align: left;
 width: 60%;
 }
 .barcode-date {
 font-size: 7px;
 margin: 0 0 2px 0;
 text-align: left;
 width: 100%;
 }
 .container-name {
 font-size: 8px;
 font-weight: bold;
 margin: 1px 0 0 0;
 text-align: left;
 width: 100%;
 color: #333;
 }
 .barcode-container {
 display: flex;
 justify-content: flex-start;
 align-items: left;
 width: 100%;
 margin: 1px 0;
 }
 svg {
 width: 35mm !important;
 height: 12mm !important;
 align-self: flex-start;
 }
 </style>
 </head>
 <body>
 ${printSectionRef.current.innerHTML}
 </body>
 </html>
 `);
    doc.close();

    iframe.contentWindow.onload = () => {
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
        setIsPrinting(false);
        toast.success("Barcodes sent to printer");
      }, 1000);
    };
  };

  const handleBack = () => {
    navigate("/HMSBarcodeGeneration");
  };

  useEffect(() => {
    const fetchTestDetails = async () => {
      const dateString = selectedDate.toISOString().split("T")[0];

      // Get patient data from hms_patients_get_barcode
      const patientResult = await apiRequest(
        `${Labbaseurl}hms_patients_get_barcode/?from_date=${dateString}&to_date=${dateString}`,
        "GET"
      );

      if (!patientResult.success) {
        console.error("Error fetching test details:", patientResult.error);
        toast.error(patientResult.error || "Failed to fetch test details.");
        return;
      }

      const patientData = patientResult.data.data.find(
        (patient) =>
          patient.patient_id === patientId && patient.bill_no === bill_no
      );

      if (!patientData) {
        toast.error("Patient not found.");
        return;
      }

      // Set patient data
      setSelectedPatient(patientData);
      setTestDetails(patientData.testdetails || []);
      setSelectedTests(
        new Array(patientData.testdetails?.length || 0).fill(false)
      );

      // Generate barcode immediately from bill number
      const generatedBarcode = extractBarcodeFromBillNo(bill_no);
      if (generatedBarcode) {
        const updatedTestDetails = (patientData.testdetails || []).map((test) => ({
          ...test,
          barcode: generatedBarcode,
        }));
        
        setTestDetails(updatedTestDetails);

        // Create barcode data for display
        const containerGroups = {};
        updatedTestDetails.forEach((test) => {
          const container = test.container || "";
          if (!containerGroups[container]) {
            containerGroups[container] = [];
          }
          containerGroups[container].push(test);
        });

        const newBarcodeData = [
          ...Object.entries(containerGroups).map(([container, testdetails]) => ({
            barcode: generatedBarcode,
            containerName: container,
            isExtra: false,
          })),
          {
            barcode: generatedBarcode,
            containerName: "",
            isExtra: true,
          },
        ];

        setBarcodeData(newBarcodeData);
      }
    };

    if (patientId && selectedDate) {
      fetchTestDetails();
    }
  }, [patientId, selectedDate, bill_no]);

  const hasBarcodes = testDetails.some((test) => test.barcode);

  return (
    <PageContainer>
      <toast.ToastDisplay />

      <BackButton onClick={handleBack}>
        <ArrowLeft size={16} />
        Back to Barcode Generation
      </BackButton>

      <PageHeader>
        <Title>Test Details for Patient {patientId}</Title>
      </PageHeader>

      {selectedPatient ? (
        <>
          <PatientCard>
            <PatientCardHeader>
              <PatientName>{selectedPatient.patientname}</PatientName>
            </PatientCardHeader>
            <PatientCardBody>
              <PatientInfoGrid>
                <PatientInfoItem>
                  <InfoLabel>Patient ID</InfoLabel>
                  <InfoValue>
                    <User size={14} />
                    {patientId}
                  </InfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <InfoLabel>Age</InfoLabel>
                  <InfoValue>{selectedPatient.age} years</InfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <InfoLabel>Gender</InfoLabel>
                  <InfoValue>{selectedPatient.gender}</InfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <InfoLabel>Date</InfoLabel>
                  <InfoValue>
                    <Calendar size={14} />
                    {formatDate(selectedPatient.date)}
                  </InfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <InfoLabel>Bill No</InfoLabel>
                  <InfoValue>
                    <FileText size={14} />
                    {bill_no}
                  </InfoValue>
                </PatientInfoItem>
                <PatientInfoItem>
                  <InfoLabel>Generated Barcode</InfoLabel>
                  <InfoValue>
                    <BarcodeScan size={14} />
                    {extractBarcodeFromBillNo(bill_no)}
                  </InfoValue>
                </PatientInfoItem>
              </PatientInfoGrid>
            </PatientCardBody>
          </PatientCard>

          {isLoading ? (
            <EmptyState>
              <div className="animate-pulse">Loading test details...</div>
            </EmptyState>
          ) : testDetails.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <tr>
                    <th>Test Name</th>
                    <th>Collection Container</th>
                    <th>Barcode</th>
                  </tr>
                </TableHead>
                <TableBody>
                  {testDetails.map((test, index) => (
                    <tr key={index}>
                      <td>{test.testname}</td>
                      <td>{test.container}</td>
                      <td>
                        {test.barcode ? (
                          <BarcodeContainer>
                            <svg
                              ref={(el) => {
                                if (el && test.barcode) {
                                  JsBarcode(el, test.barcode, {
                                    format: "CODE128",
                                    width: 1,
                                    height: 30,
                                    displayValue: true,
                                    fontSize: 10,
                                    margin: 0,
                                  });
                                }
                              }}
                            />
                          </BarcodeContainer>
                        ) : (
                          "No Barcode"
                        )}
                      </td>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <EmptyState>
              <AlertCircle size={40} color="#94a3b8" />
              <EmptyStateText>
                No test details found for this patient.
              </EmptyStateText>
            </EmptyState>
          )}

          <ButtonsContainer>
            <PrimaryButton
              onClick={handleGenerateAndPrint}
              disabled={isGenerating || isPrinting || isLoading}
            >
              <BarcodeScan size={16} />
              {isGenerating ? "Generating..." : "Generate & Print Barcodes"}
            </PrimaryButton>

            <SecondaryButton
              onClick={handleReGenerateAndPrint}
              disabled={isGenerating || isPrinting || isLoading}
            >
              <RefreshCw size={16} />
              {isGenerating ? "Regenerating..." : "Regenerate & Print Barcodes"}
            </SecondaryButton>

            {hasBarcodes && (
              <SecondaryButton
                onClick={handlePrintBarcodes}
                disabled={isPrinting || isLoading}
              >
                <Printer size={16} />
                {isPrinting ? "Printing..." : "Print Barcodes"}
              </SecondaryButton>
            )}
          </ButtonsContainer>
        </>
      ) : (
        <EmptyState>
          <AlertCircle size={40} color="#94a3b8" />
          <EmptyStateText>Patient information not available.</EmptyStateText>
        </EmptyState>
      )}

      <PrintSection ref={printSectionRef}>
        {barcodeData.map((item, index) => (
          <BarcodeItem key={index} className="barcode-item">
            <BarcodeText className="barcode-text">
              {selectedPatient?.patientname} | {selectedPatient?.age} |{" "}
              {selectedPatient?.gender === "Male"
                ? "M"
                : selectedPatient?.gender === "Female"
                ? "F"
                : ""}
            </BarcodeText>
            <BarcodeDate className="barcode-date">
              {selectedPatient?.date ? formatDate(selectedPatient.date) : ""}
            </BarcodeDate>
            <BarcodeContainer className="barcode-container">
              <svg
                ref={(el) => {
                  if (el && item.barcode) {
                    JsBarcode(el, item.barcode, {
                      format: "CODE128",
                      width: 0.6,
                      height: 12,
                      displayValue: true,
                      fontSize: 6,
                      margin: 0,
                    });
                  }
                }}
              />
            </BarcodeContainer>
            {item.containerName && !item.isExtra && (
              <ContainerName className="container-name">
                {item.containerName}
              </ContainerName>
            )}
          </BarcodeItem>
        ))}
      </PrintSection>
    </PageContainer>
  );
};

export default HMSBarcodeTestDetails;