"use client"

import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { X, Eye, Save, Loader } from "lucide-react"
import apiRequest from "../Auth/apiRequest"
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs";
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
`

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
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
`

const Title = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
`

const StatusList = styled.div`
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
`

const StatusItem = styled.div`
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
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
`

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 12px;
  color: ${(props) => (props.$high ? "#b91c1c" : props.$low ? "#1e3a8a" : "#555")};
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
  gap: 10px;
`

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
    props.$primary &&
    `
    background-color: #DB9BB9;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #c985a7;
      transform: translateY(-2px);
    }
  `}

  ${(props) =>
    props.$secondary &&
    `
    background-color: #f5f5f5;
    color: #333;
    
    &:hover:not(:disabled) {
      background-color: #e9e9e9;
      transform: translateY(-2px);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const PreviewModalContent = styled.div`
  background: white;
  width: 95%;
  max-width: 1400px;
  max-height: 95vh;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const PreviewScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 40px;
  background: #fafafa;
  
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
    margin: 10px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: #db9bb9;
    border-radius: 10px;
    
    &:hover {
      background: #c985a7;
    }
  }
`

const PreviewHeader = styled(ModalHeader)`
  padding: 30px 40px 20px 40px;
  margin: 0;
  flex-shrink: 0;
`

const PreviewFooter = styled(ModalFooter)`
  padding: 20px 40px 30px 40px;
  margin: 0;
  flex-shrink: 0;
  background: white;
  border-top: 2px solid #f0f0f0;
`

const ReportSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #e8e8e8;
`

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #222;
  margin: 0 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 3px solid #DB9BB9;
`

const InfoRow = styled.div`
  display: flex;
  margin: 12px 0;
  font-size: 15px;
  line-height: 1.6;
`

const InfoLabel = styled.span`
  font-weight: 600;
  color: #444;
  min-width: 180px;
  flex-shrink: 0;
`

const InfoValue = styled.span`
  color: #222;
  flex: 1;
  white-space: pre-wrap;
`

const StatusLabel = styled.span`
  font-weight: 600;
  color: #333;
`

const InputGroup = styled.div`
  margin: 15px 0;
`

const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #db9bb9;
    box-shadow: 0 0 0 2px rgba(219, 155, 185, 0.2);
  }
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #666;
  gap: 10px;
`

const FilePreviewContainer = styled.div`
  margin-top: 10px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`

const FilePreviewTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin: 0 0 10px 0;
`

const FileImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`

const LabTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
`

const LabThead = styled.thead`
  background: #faf5f8;
`

const LabTh = styled.th`
  text-align: left;
  padding: 10px 12px;
  font-size: 13px;
  color: #333;
  border-bottom: 1px solid #eaeaea;
`

const LabTd = styled.td`
  padding: 10px 12px;
  font-size: 14px;
  color: #222;
  border-bottom: 1px solid #f2f2f2;
  vertical-align: top;
`

const DeptHeading = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin: 16px 0 8px;
  text-align: center;
  position: relative;

  &::after {
    content: "";
    display: block;
    height: 2px;
    background: #DB9BB9;
    width: 120px;
    margin: 6px auto 0;
    border-radius: 2px;
  }
`

const SubTitle = styled.div`
  font-weight: 600;
  color: #444;
  margin: 8px 0 4px;
`

// NEW: Table for ophthalmology visual acuity
const OphthalmologyTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #eaeaea;
  margin: 15px 0;
`

const OphthalmologyTh = styled.th`
  padding: 10px;
  background: #faf5f8;
  border: 1px solid #eaeaea;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
`

const OphthalmologyTd = styled.td`
  padding: 10px;
  border: 1px solid #eaeaea;
  text-align: center;
  font-size: 14px;
`

const CHCApproval = ({ patient, onClose, onApprovalSaved }) => {
  const [investigationStatus, setInvestigationStatus] = useState({})
  const [ophthalmologyStatus, setOphthalmologyStatus] = useState(null)
  const [labApprovalStatus, setlabApprovalStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [patientDetails, setPatientDetails] = useState(null)
  const [investigationFiles, setInvestigationFiles] = useState({})
  const [pdfImages, setPdfImages] = useState({});
  const [conversionLoading, setConversionLoading] = useState({});
  const [impression, setImpression] = useState("Reports within Normal Limits.")
  const [remarks, setRemarks] = useState("The above candidate was examined and found Medically Fit for the Job.")
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  useEffect(() => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}, []);

  useEffect(() => {
    fetchInvestigationStatus()
  }, [patient.barcode])

  const fetchInvestigationStatus = async () => {
    try {
      setLoading(true)
      const result = await apiRequest(`${Labbaseurl}get_investigation_status/?barcode=${patient.barcode}`, "GET")

      if (result.success) {
        setInvestigationStatus(result.data.investigation || {})
        setOphthalmologyStatus(result.data.ophthalmology)
        setlabApprovalStatus(result.data.lab_approval)
      } else {
        console.error("Error fetching investigation status:", result.error)
        alert("Failed to fetch investigation status: " + result.error)
      }
    } catch (error) {
      console.error("Error fetching investigation status:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInvestigationFile = async (fileId) => {
    if (!fileId) return null

    try {
      const result = await apiRequest(`${Labbaseurl}get_investigation_file/?file_id=${fileId}`, "GET")

      if (!result.success) {
        console.error(`Failed to fetch file ${fileId}:`, result.error)
        return null
      }

      return {
        data: result.data.data,
        contentType: result.data.contentType,
        filename: result.data.filename,
      }
    } catch (error) {
      console.error(`Error fetching file ${fileId}:`, error)
      return null
    }
  }

  const convertPdfToImages = async (base64Data, fileKey) => {
  try {
    console.log("Converting PDF to images for:", fileKey);
    
    // Remove any data URL prefix if present
    const cleanBase64 = base64Data.replace(/^data:.*?;base64,/, '');
    
    // Decode base64 to binary
    const binaryString = atob(cleanBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    console.log("PDF decoded, byte length:", bytes.length);
    
    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ 
      data: bytes,
      verbosity: pdfjsLib.VerbosityLevel.ERRORS,
      cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
      cMapPacked: true,
    });
    
    const pdf = await loadingTask.promise;
    console.log("PDF loaded, number of pages:", pdf.numPages);
    
    const images = [];
    
    // Convert each page to image
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      images.push(canvas.toDataURL('image/png'));
      console.log(`Converted page ${pageNum} to image`);
    }
    
    setPdfImages(prev => ({
      ...prev,
      [fileKey]: images
    }));
    
    return images;
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    return [];
  } finally {
    setConversionLoading(prev => ({
      ...prev,
      [fileKey]: false
    }));
  }
};


  const fetchPatientDetails = async () => {
    try {
      setLoading(true)
      const result = await apiRequest(`${Labbaseurl}corporate_health_report/?barcode=${patient.barcode}`, "GET")

      if (result.success) {
        setPatientDetails(result.data)

        // Fetch investigation files
        const fileIds = result.data.investigation_file_ids || {}
        const files = {}

        const filePromises = Object.entries(fileIds).map(async ([key, fileId]) => {
          if (fileId) {
            const fileData = await fetchInvestigationFile(fileId)
            if (fileData) {
              files[key] = fileData
            }
          }
        })

        await Promise.all(filePromises)
        setInvestigationFiles(files)
      } else {
        console.error("Error fetching patient details:", result.error)
        alert("Failed to fetch patient details: " + result.error)
      }
    } catch (error) {
      console.error("Error fetching patient details:", error)
    } finally {
      setLoading(false)
    }
  }

  const allApproved = () => {
    const investigationsApproved = investigations.every(inv => {
      const status = investigationStatus[inv.key]
      return status === "approved"
    })

    const ophthalmologyApproved = ophthalmologyStatus === "approved"
    const labApproved = labApprovalStatus === "approved"

    return investigationsApproved && ophthalmologyApproved && labApproved
  }

  const getStatusDisplay = (status) => {
    if (!status || status === "pending") {
      return { text: "Pending Upload", badge: "pending" }
    }
    return { text: "Approved", badge: "approved" }
  }

  const investigations = [   
    { key: "xrayfilm_file", label: "X-Ray Film" },
    { key: "ecg_file", label: "ECG" },
    { key: "pft_file", label: "PFT (Pulmonary Function Test)" },
    { key: "audiometric_file", label: "Audiometry" },
  ]

  const handlePreview = async () => {
    await fetchPatientDetails()
    setShowPreview(true)
  }

  const handleSaveApproval = async () => {
  try {
    const result = await apiRequest(`${Labbaseurl}save_overall_approval/`, "POST", {
      barcode: patient.barcode,
      employee_id: patient.patient_id,
      impression: impression,
      remarks: remarks,
      date: new Date().toISOString(),
    })

    if (result.success) {
      alert("Approval saved successfully!")
      setShowPreview(false)
      
      // IMPORTANT: Call the callback BEFORE closing
      if (typeof onApprovalSaved === 'function') {
        await onApprovalSaved()  // Add await here
      }
      
      onClose()
    } else {
      alert("Error saving approval: " + result.error)
    }
  } catch (error) {
    console.error("Error saving approval:", error)
    alert("Error saving approval")
  }
}

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const processUnicodeText = (text) => {
    if (!text) return ""
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
    }
    let processed = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
      const ch = String.fromCharCode(Number.parseInt(hex, 16))
      return unicodeMap[ch] || ch
    })
    Object.keys(unicodeMap).forEach((k) => {
      processed = processed.replace(new RegExp(k, "g"), unicodeMap[k])
    })
    return processed
  }

  const getHighLowStatus = (value, reference) => {
    if (!value || !reference) return null
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) return null

    if (reference.includes("-")) {
      const [min, max] = reference.split("-").map((v) => Number.parseFloat(v))
      if (!isNaN(min) && !isNaN(max)) {
        if (numValue < min) return "L"
        if (numValue > max) return "H"
      }
    } else if (reference.includes("<")) {
      const max = Number.parseFloat(reference.replace("<", ""))
      if (!isNaN(max) && numValue > max) return "H"
    } else if (reference.includes(">")) {
      const min = Number.parseFloat(reference.replace(">", ""))
      if (!isNaN(min) && numValue < min) return "L"
    }
    return null
  }

  const LabInvestigationsPreview = ({ tests = [] }) => {
    const labTests = tests.filter(
      (t) => !["Audiometry", "Pulmonary Function Test", "Chest - XRay", "ECG", "Eye examination"].includes(t.testname),
    )

    if (labTests.length === 0) {
      return <InfoValue>No lab investigations available.</InfoValue>
    }

    const testsByDepartment = labTests.reduce((acc, test) => {
      const dept = test.department || "LABORATORY"
      ;(acc[dept] = acc[dept] || []).push(test)
      return acc
    }, {})

    return (
      <div>
        {Object.keys(testsByDepartment).map((department) => (
          <div key={department} style={{ marginBottom: 16 }}>
            <DeptHeading>{department.toUpperCase()}</DeptHeading>
            <LabTable role="table" aria-label={`${department} lab investigations`}>
              <LabThead>
                <tr>
                  <LabTh>Test</LabTh>
                  <LabTh>Specimen</LabTh>
                  <LabTh>Result</LabTh>
                  <LabTh>Units</LabTh>
                  <LabTh>Reference Value</LabTh>
                  <LabTh>Method</LabTh>
                </tr>
              </LabThead>
              <tbody>
                {testsByDepartment[department].map((test) => {
                  const status = getHighLowStatus(test.value, test.reference_range)
                  return (
                    <React.Fragment key={test.testname + (test.samplecollected_time || "")}>
                      <tr>
                        <LabTd style={{ fontWeight: 600 }}>{test.testname}</LabTd>
                        <LabTd>{test.specimen_type || ""}</LabTd>
                        <LabTd>
                          <div className="flex items-center gap-1">
                            <span>{test.value || ""}</span>
                            {status === "H" && <StatusBadge $high>▲ H</StatusBadge>}
                            {status === "L" && <StatusBadge $low>▼ L</StatusBadge>}
                          </div>
                        </LabTd>
                        <LabTd>{processUnicodeText(test.unit || "")}</LabTd>
                        <LabTd>{test.reference_range || ""}</LabTd>
                        <LabTd>{(test.method || "").replace(/\bMethod\b/i, "").trim()}</LabTd>
                      </tr>

                      {(test.parameters || []).length > 0 &&
                        (() => {
                          const bySubtitle = test.parameters.reduce((acc, p) => {
                            const sub = p.sub_title || ""
                            ;(acc[sub] = acc[sub] || []).push(p)
                            return acc
                          }, {})
                          return Object.keys(bySubtitle).map((subtitle) => (
                            <React.Fragment key={subtitle || "nosub"}>
                              {subtitle && (
                                <tr>
                                  <LabTd colSpan={6}>
                                    <SubTitle>{subtitle}</SubTitle>
                                  </LabTd>
                                </tr>
                              )}
                              {bySubtitle[subtitle].map((p) => {
                                const pStatus = getHighLowStatus(p.value, p.reference_range)
                                return (
                                  <tr key={p.name}>
                                    <LabTd>{p.name}</LabTd>
                                    <LabTd>{p.specimen_type || ""}</LabTd>
                                    <LabTd>
                                      <div className="flex items-center gap-1">
                                        <span>{p.value || ""}</span>
                                        {pStatus === "H" && <StatusBadge $high>▲ H</StatusBadge>}
                                        {pStatus === "L" && <StatusBadge $low>▼ L</StatusBadge>}
                                      </div>
                                    </LabTd>
                                    <LabTd>{processUnicodeText(p.unit || "")}</LabTd>
                                    <LabTd>{p.reference_range || ""}</LabTd>
                                    <LabTd>{(p.method || "").replace(/\bMethod\b/i, "").trim()}</LabTd>
                                  </tr>
                                )
                              })}
                            </React.Fragment>
                          ))
                        })()}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </LabTable>
          </div>
        ))}
      </div>
    )
  }

  const renderFilePreview = (fileKey, label) => {
  const file = investigationFiles[fileKey];
  if (!file) return null;

  const contentType = file.contentType || "";
  const filename = (file.filename || "").toLowerCase();
  const isPDF = contentType.includes("pdf") || filename.endsWith(".pdf");
  const images = pdfImages[fileKey] || [];
  const isConverting = conversionLoading[fileKey];

  return (
    <FilePreviewContainer key={fileKey}>
      <FilePreviewTitle>{label}</FilePreviewTitle>
      {isPDF ? (
        <>
          {images.length === 0 && !isConverting ? (
            <button
              onClick={() => {
                setConversionLoading(prev => ({
                  ...prev,
                  [fileKey]: true
                }));
                convertPdfToImages(file.data, fileKey);
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#DB9BB9',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                marginTop: '8px'
              }}
            >
              Load PDF Preview
            </button>
          ) : isConverting ? (
            <div
              style={{
                color: "#666",
                fontSize: "14px",
                padding: "20px",
                textAlign: "center",
                background: "#f0f0f0",
                borderRadius: "4px",
              }}
            >
              <p>Converting PDF...</p>
            </div>
          ) : (
            <div style={{ marginTop: '10px' }}>
              {images.map((image, idx) => (
                <div key={idx} style={{ marginBottom: '15px' }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                    Page {idx + 1} of {images.length}
                  </div>
                  <FileImage src={image} alt={`${label} - Page ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <FileImage src={`data:${contentType};base64,${file.data}`} alt={label} />
      )}
    </FilePreviewContainer>
    )
  }

  if (showPreview) {
    return (
      <ModalOverlay>
        <PreviewModalContent>
          <PreviewHeader>
            <Title>Medical Report Preview</Title>
            <Button $secondary onClick={() => setShowPreview(false)}>
              <X size={16} />
            </Button>
          </PreviewHeader>

          <PreviewScrollContainer>
            {loading ? (
              <LoadingContainer>
                <Loader size={32} className="spinning" />
                <span>Loading report and files...</span>
              </LoadingContainer>
            ) : patientDetails ? (
              <>
                <ReportSection>
                  <SectionTitle>Patient Information</SectionTitle>
                  <InfoRow>
                    <InfoLabel>Name:</InfoLabel>
                    <InfoValue>{patientDetails.patientname || "N/A"}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Employee ID:</InfoLabel>
                    <InfoValue>{patientDetails.patient_id || "N/A"}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Age / Gender:</InfoLabel>
                    <InfoValue>
                      {patientDetails.age} / {patientDetails.gender}
                    </InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Date:</InfoLabel>
                    <InfoValue>{formatDate(patientDetails.date)}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Barcode:</InfoLabel>
                    <InfoValue>{patientDetails.barcode}</InfoValue>
                  </InfoRow>
                  {patientDetails.company_name && (
                    <InfoRow>
                      <InfoLabel>Company:</InfoLabel>
                      <InfoValue>{patientDetails.company_name}</InfoValue>
                    </InfoRow>
                  )}
                  {patientDetails.department && (
                    <InfoRow>
                      <InfoLabel>Department:</InfoLabel>
                      <InfoValue>{patientDetails.department}</InfoValue>
                    </InfoRow>
                  )}
                </ReportSection>

                {patientDetails.vitals && Object.keys(patientDetails.vitals).length > 0 && (
                  <ReportSection>
                    <SectionTitle>Vitals</SectionTitle>
                    <LabTable>
                      <LabThead>
                        <tr>
                          <LabTh>Parameter</LabTh>
                          <LabTh>Reading</LabTh>
                          <LabTh>Normal Range</LabTh>
                        </tr>
                      </LabThead>
                      <tbody>
                        <tr>
                          <LabTd>Height</LabTd>
                          <LabTd>{patientDetails.vitals?.height || "N/A"} cms</LabTd>
                          <LabTd></LabTd>
                        </tr>
                        <tr>
                          <LabTd>Weight</LabTd>
                          <LabTd>{patientDetails.vitals?.weight || "N/A"} kgs</LabTd>
                          <LabTd></LabTd>
                        </tr>
                        <tr>
                          <LabTd>BMI</LabTd>
                          <LabTd>{patientDetails.vitals?.bmi || "N/A"} kg/m²</LabTd>
                          <LabTd>18.5 - 24.9</LabTd>
                        </tr>
                        <tr>
                          <LabTd>Blood Pressure</LabTd>
                          <LabTd>{patientDetails.vitals?.blood_pressure || "N/A"} mmHg</LabTd>
                          <LabTd>120/80</LabTd>
                        </tr>
                        <tr>
                          <LabTd>Pulse Rate</LabTd>
                          <LabTd>{patientDetails.vitals?.spo2 || "N/A"} bpm</LabTd>
                          <LabTd>60 - 100</LabTd>
                        </tr>
                      </tbody>
                    </LabTable>
                  </ReportSection>
                )}

                {patientDetails.medical_history && (
                  <ReportSection>
                    <SectionTitle>Medical History</SectionTitle>
                    <InfoValue>{patientDetails.medical_history.patient_history || "Nil Significant"}</InfoValue>
                  </ReportSection>
                )}

                {patientDetails.investigation_notes && Object.keys(patientDetails.investigation_notes).length > 0 && (
                  <ReportSection>
                    <SectionTitle>Miscellaneous Investigations</SectionTitle>
                    {patientDetails.investigation_notes.ecg_notes && (
                      <InfoRow>
                        <InfoLabel>E.C.G:</InfoLabel>
                        <InfoValue>{patientDetails.investigation_notes.ecg_notes}</InfoValue>
                      </InfoRow>
                    )}
                    {patientDetails.investigation_notes.pft_notes && (
                      <InfoRow>
                        <InfoLabel>Spirometry:</InfoLabel>
                        <InfoValue>{patientDetails.investigation_notes.pft_notes}</InfoValue>
                      </InfoRow>
                    )}
                    {/* NEW: Display X-Ray notes */}
                    {patientDetails.investigation_notes.xray_notes && (
                      <InfoRow>
                        <InfoLabel>X-Ray:</InfoLabel>
                        <InfoValue>{patientDetails.investigation_notes.xray_notes}</InfoValue>
                      </InfoRow>
                    )}
                    {patientDetails.investigation_notes.audiometry_notes && (
                      <InfoRow>
                        <InfoLabel>Audiometry:</InfoLabel>
                        <InfoValue>{patientDetails.investigation_notes.audiometry_notes}</InfoValue>
                      </InfoRow>
                    )}
                  </ReportSection>
                )}

                {/* NEW: X-Ray Report Content Section (before files) */}
                {patientDetails.investigation_notes?.xray_report && patientDetails.investigation_notes.xray_report.trim() && (
                  <ReportSection>
                    <SectionTitle>X-Ray Chest PA View</SectionTitle>
                    <InfoValue style={{ whiteSpace: 'pre-wrap' }}>
                      {patientDetails.investigation_notes.xray_report}
                    </InfoValue>
                    
                    <div style={{ marginTop: '20px' }}>
                      <InfoLabel style={{ display: 'block', marginBottom: '10px' }}>IMPRESSION:</InfoLabel>
                      <InfoValue>
                        {patientDetails.investigation_notes.xray_notes || "No significant finding in the lungs or mediastinum."}
                      </InfoValue>
                    </div>
                  </ReportSection>
                )}

                {Object.keys(investigationFiles).length > 0 && (
                  <ReportSection>
                    <SectionTitle>Investigation Files</SectionTitle>
                    {renderFilePreview("xrayfilm_file", "X-Ray Film")}
                    {renderFilePreview("ecg_file", "ECG Report")}
                    {renderFilePreview("pft_file", "Pulmonary Function Test (PFT)")}
                    {renderFilePreview("audiometric_file", "Audiometry Report")}                    
                  </ReportSection>
                )}

                {patientDetails.ophthalmology && (
                  <ReportSection>
                    <SectionTitle>Ophthalmology Report</SectionTitle>
                    
                    {/* NEW: Visual Acuity Table with Ocular Movement */}
                    {patientDetails.ophthalmology.visual_acuity && (
                      <OphthalmologyTable>
                        <thead>
                          <tr>
                            <OphthalmologyTh>Test</OphthalmologyTh>
                            <OphthalmologyTh>Left Eye</OphthalmologyTh>
                            <OphthalmologyTh>Right Eye</OphthalmologyTh>
                          </tr>
                        </thead>
                        <tbody>
                          {patientDetails.ophthalmology.visual_acuity.distance && (
                            <tr>
                              <OphthalmologyTd style={{ fontWeight: 600 }}>Distant Vision</OphthalmologyTd>
                              <OphthalmologyTd>
                                {patientDetails.ophthalmology.visual_acuity.distance.left || "N/A"}
                              </OphthalmologyTd>
                              <OphthalmologyTd>
                                {patientDetails.ophthalmology.visual_acuity.distance.right || "N/A"}
                              </OphthalmologyTd>
                            </tr>
                          )}
                          {patientDetails.ophthalmology.visual_acuity.near_vision && (
                            <tr>
                              <OphthalmologyTd style={{ fontWeight: 600 }}>Near Vision</OphthalmologyTd>
                              <OphthalmologyTd>
                                {patientDetails.ophthalmology.visual_acuity.near_vision.left || "N/A"}
                              </OphthalmologyTd>
                              <OphthalmologyTd>
                                {patientDetails.ophthalmology.visual_acuity.near_vision.right || "N/A"}
                              </OphthalmologyTd>
                            </tr>
                          )}
                          {patientDetails.ophthalmology.visual_acuity.color_vision && (
                            <tr>
                              <OphthalmologyTd style={{ fontWeight: 600 }}>Colour Vision</OphthalmologyTd>
                              <OphthalmologyTd>
                                {patientDetails.ophthalmology.visual_acuity.color_vision.left || "N/A"}
                              </OphthalmologyTd>
                              <OphthalmologyTd>
                                {patientDetails.ophthalmology.visual_acuity.color_vision.right || "N/A"}
                              </OphthalmologyTd>
                            </tr>
                          )}
                          {/* NEW: Ocular Movement Row */}
                          {patientDetails.ophthalmology.visual_acuity.ocularmovement && (
                            <tr>
                              <OphthalmologyTd style={{ fontWeight: 600 }}>Ocular Movement</OphthalmologyTd>
                              <OphthalmologyTd>
                                {patientDetails.ophthalmology.visual_acuity.ocularmovement.left || "N/A"}
                              </OphthalmologyTd>
                              <OphthalmologyTd>
                                {patientDetails.ophthalmology.visual_acuity.ocularmovement.right || "N/A"}
                              </OphthalmologyTd>
                            </tr>
                          )}
                        </tbody>
                      </OphthalmologyTable>
                    )}

                    {/* Patient Complaints */}
                    {patientDetails.ophthalmology.patient_complaints && patientDetails.ophthalmology.patient_complaints.trim() && (
                      <div style={{ marginTop: '20px' }}>
                        <InfoLabel style={{ display: 'block', marginBottom: '8px' }}>Patient Complaints:</InfoLabel>
                        <InfoValue>{patientDetails.ophthalmology.patient_complaints}</InfoValue>
                      </div>
                    )}

                    {/* Remarks */}
                    <div style={{ marginTop: '15px' }}>
                      <InfoLabel style={{ display: 'block', marginBottom: '8px' }}>Remarks:</InfoLabel>
                      <InfoValue>
                        {patientDetails.ophthalmology.remarks && patientDetails.ophthalmology.remarks.trim()
                          ? patientDetails.ophthalmology.remarks
                          : "Both Eyes: Normal Vision. Review after 6 months or 1 year."}
                      </InfoValue>
                    </div>

                    {/* Validity Note */}
                    <div style={{ marginTop: '15px', fontSize: '12px', fontStyle: 'italic', color: '#666' }}>
                      This spectacle prescription is valid for correction, only for three months from the date of consultation.
                    </div>
                  </ReportSection>
                )}

                {patientDetails.testdetails && patientDetails.testdetails.length > 0 && (
                  <ReportSection>
                    <SectionTitle>Lab Investigations</SectionTitle>
                    <LabInvestigationsPreview tests={patientDetails.testdetails} />
                  </ReportSection>
                )}

                <ReportSection>
                  <SectionTitle>Clinical Assessment</SectionTitle>
                  <InputGroup>
                    <InputLabel>Impression</InputLabel>
                    <TextArea
                      value={impression}
                      onChange={(e) => setImpression(e.target.value)}
                      placeholder="Enter impression..."
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>Remarks</InputLabel>
                    <TextArea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Enter remarks..."
                    />
                  </InputGroup>
                </ReportSection>
              </>
            ) : (
              <LoadingContainer>No data available</LoadingContainer>
            )}
          </PreviewScrollContainer>

          <PreviewFooter>
            <Button $secondary onClick={() => setShowPreview(false)}>
              <X size={16} />
              Cancel
            </Button>
            <Button $primary onClick={handleSaveApproval}>
              <Save size={16} />
              Save Approval
            </Button>
          </PreviewFooter>
        </PreviewModalContent>
      </ModalOverlay>
    )
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <Title>Investigation & Ophthalmology Status</Title>
          <Button $secondary onClick={onClose}>
            <X size={16} />
          </Button>
        </ModalHeader>

        {loading ? (
          <LoadingContainer>
            <Loader size={32} className="spinning" />
            <span>Loading status...</span>
          </LoadingContainer>
        ) : (
          <>
            <StatusList>
              {investigations.map((inv) => {
                const status = investigationStatus[inv.key]
                const display = getStatusDisplay(status)

                return (
                  <StatusItem key={inv.key}>
                    <StatusInfo>
                      <StatusLabel>{inv.label}</StatusLabel>
                      <StatusBadge>{display.text}</StatusBadge>
                    </StatusInfo>
                  </StatusItem>
                )
              })}

              <StatusItem>
                <StatusInfo>
                  <StatusLabel>Ophthalmology</StatusLabel>
                  <StatusBadge>{ophthalmologyStatus === "approved" ? "Approved" : "Pending"}</StatusBadge>
                </StatusInfo>
              </StatusItem>

              <StatusItem>
                <StatusInfo>
                  <StatusLabel>Lab Investigations</StatusLabel>
                  <StatusBadge>{labApprovalStatus === "approved" ? "Approved" : "Pending"}</StatusBadge>
                </StatusInfo>
              </StatusItem>
            </StatusList>

            <ModalFooter>
              <Button $secondary onClick={onClose}>
                <X size={16} />
                Close
              </Button>
              <Button $primary onClick={handlePreview} disabled={!allApproved()}>
                <Eye size={16} />
                Preview Report
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  )
}

export default CHCApproval