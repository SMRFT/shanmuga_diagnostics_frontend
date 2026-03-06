"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { X, Eye, Save, Loader } from "lucide-react";
import apiRequest from "../Auth/apiRequest";
import * as pdfjsLib from "pdfjs-dist";

// ─── Styled Components ────────────────────────────────────────────────────────

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
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  margin: 8px 0;
  transition: all 0.2s;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 12px;
  color: ${(p) => (p.$high ? "#b91c1c" : p.$low ? "#1e3a8a" : "#555")};
`;

const ApprovalBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(p) => (p.$approved ? "#dcfce7" : "#fef3c7")};
  color: ${(p) => (p.$approved ? "#166534" : "#92400e")};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
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
  ${(p) =>
    p.$primary &&
    `
    background-color: #DB9BB9;
    color: white;
    &:hover:not(:disabled) { background-color: #c985a7; transform: translateY(-2px); }
  `}
  ${(p) =>
    p.$secondary &&
    `
    background-color: #f5f5f5;
    color: #333;
    &:hover:not(:disabled) { background-color: #e9e9e9; transform: translateY(-2px); }
  `}
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// ─── Preview Modal Styled Components ─────────────────────────────────────────

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
`;

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
  }
`;

const PreviewHeader = styled(ModalHeader)`
  padding: 30px 40px 20px 40px;
  margin: 0;
  flex-shrink: 0;
`;

const PreviewFooter = styled(ModalFooter)`
  padding: 20px 40px 30px 40px;
  margin: 0;
  flex-shrink: 0;
  background: white;
  border-top: 2px solid #f0f0f0;
`;

const ReportSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #222;
  margin: 0 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 3px solid #db9bb9;
`;

const InfoRow = styled.div`
  display: flex;
  margin: 12px 0;
  font-size: 15px;
  line-height: 1.6;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #444;
  min-width: 180px;
  flex-shrink: 0;
`;

const InfoValue = styled.span`
  color: #222;
  flex: 1;
  white-space: pre-wrap;
`;

const StatusLabel = styled.span`
  font-weight: 600;
  color: #333;
`;

const InputGroup = styled.div`
  margin: 15px 0;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

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
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #666;
  gap: 10px;
`;

/* 2×3 grid container for multiple files */
const FilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 12px;
`;

const FileGridCell = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #f9f9f9;
`;

const FileGridCellLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #888;
  padding: 6px 10px;
  background: #f0f0f0;
  border-bottom: 1px solid #e0e0e0;
`;

const FileImage = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
`;

const FilePreviewContainer = styled.div`
  margin-top: 10px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const FilePreviewTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin: 0 0 10px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #db9bb9;
`;

const TestReportCard = styled.div`
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const TestReportCardHeader = styled.div`
  background: linear-gradient(135deg, #fdf2f8, #fce7f3);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e8e8e8;
`;

const TestReportCardTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #333;
`;

const TestReportCardBody = styled.div`
  padding: 16px;
`;

const LabTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
`;

const LabThead = styled.thead`
  background: #faf5f8;
`;

const LabTh = styled.th`
  text-align: left;
  padding: 10px 12px;
  font-size: 13px;
  color: #333;
  border-bottom: 1px solid #eaeaea;
`;

const LabTd = styled.td`
  padding: 10px 12px;
  font-size: 14px;
  color: #222;
  border-bottom: 1px solid #f2f2f2;
  vertical-align: top;
`;

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
    background: #db9bb9;
    width: 120px;
    margin: 6px auto 0;
    border-radius: 2px;
  }
`;

const SubTitle = styled.div`
  font-weight: 600;
  color: #444;
  margin: 8px 0 4px;
`;

const CHCTestSectionTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 12px 0 6px 0;
  padding-bottom: 4px;
  border-bottom: 1px dashed #e0e0e0;
`;

const LoadPdfButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #db9bb9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-top: 8px;
  &:hover {
    background-color: #c985a7;
  }
`;

// ─── Main Component ───────────────────────────────────────────────────────────

const CHCApproval = ({ patient, onClose, onApprovalSaved }) => {
  const [chcTests, setChcTests] = useState([]);
  const [chcInvestigationStatus, setChcInvestigationStatus] = useState(null);
  const [labApprovalStatus, setLabApprovalStatus] = useState(null);
  // Vitals & patient_history come from get_investigation_status (core_investigation)
  const [vitalsFromInvestigation, setVitalsFromInvestigation] = useState({});
  const [patientHistoryFromInvestigation, setPatientHistoryFromInvestigation] =
    useState("");
  // previewChcTests: guaranteed-fresh copy used inside the preview modal
  const [previewChcTests, setPreviewChcTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  // investigationFiles: { testId: [fileData, ...] }
  const [investigationFiles, setInvestigationFiles] = useState({});
  // pdfImages: { "testId_fileIdx_pageIdx" or "testId_fileIdx": [dataUrl,...] }
  const [pdfImages, setPdfImages] = useState({});
  const [conversionLoading, setConversionLoading] = useState({});
  const [impression, setImpression] = useState("Reports within Normal Limits.");
  const [remarks, setRemarks] = useState(
    "The above candidate was examined and found Medically Fit for the Job.",
  );

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }, []);

  useEffect(() => {
    fetchInvestigationStatus();
  }, [patient.barcode]);

  // ── Fetch per-test CHC status from get_investigation_status ──────────────
  const fetchInvestigationStatus = async () => {
    try {
      setLoading(true);
      const result = await apiRequest(
        `${Labbaseurl}get_investigation_status/?barcode=${patient.barcode}`,
        "GET",
      );
      if (result.success) {
        setChcTests(result.data.chc_tests || []);
        setChcInvestigationStatus(
          result.data.chc_investigation_status || "pending",
        );
        setLabApprovalStatus(result.data.lab_approval);
        setVitalsFromInvestigation(result.data.vitals || {});
        setPatientHistoryFromInvestigation(result.data.patient_history || "");
      } else {
        console.error("Error fetching investigation status:", result.error);
        alert("Failed to fetch investigation status: " + result.error);
      }
    } catch (error) {
      console.error("Error fetching investigation status:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch a single file by gridFS file_id ─────────────────────────────────
  const fetchInvestigationFile = async (fileId) => {
    if (!fileId) return null;
    try {
      const result = await apiRequest(
        `${Labbaseurl}get_investigation_file/?file_id=${fileId}`,
        "GET",
      );
      if (!result.success) return null;
      return {
        data: result.data.data,
        contentType: result.data.contentType,
        filename: result.data.filename,
      };
    } catch (error) {
      console.error(`Error fetching file ${fileId}:`, error);
      return null;
    }
  };

  // ── Convert a base64 PDF to an array of PNG dataURLs ─────────────────────
  const convertPdfToImages = async (base64Data, cacheKey) => {
    try {
      const cleanBase64 = base64Data.replace(/^data:.*?;base64,/, "");
      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const loadingTask = pdfjsLib.getDocument({
        data: bytes,
        verbosity: pdfjsLib.VerbosityLevel.ERRORS,
        cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
      });
      const pdf = await loadingTask.promise;
      const images = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        images.push(canvas.toDataURL("image/png"));
      }
      setPdfImages((prev) => ({ ...prev, [cacheKey]: images }));
      return images;
    } catch (error) {
      console.error("Error converting PDF to images:", error);
      return [];
    } finally {
      setConversionLoading((prev) => ({ ...prev, [cacheKey]: false }));
    }
  };

  // ── Fetch patient details AND all investigation files ─────────────────────
  const fetchPatientDetails = async () => {
    try {
      setLoading(true);

      // 1. Re-fetch fresh investigation status (avoids stale chcTests closure)
      //    This gives us the latest files[] list per test directly from core_investigation
      const statusResult = await apiRequest(
        `${Labbaseurl}get_investigation_status/?barcode=${patient.barcode}`,
        "GET",
      );
      let freshChcTests = chcTests; // fallback to state
      if (statusResult.success) {
        freshChcTests = statusResult.data.chc_tests || [];
        // Also refresh state in case anything changed
        setChcTests(freshChcTests);
        setPreviewChcTests(freshChcTests);
        setVitalsFromInvestigation(statusResult.data.vitals || {});
        setPatientHistoryFromInvestigation(
          statusResult.data.patient_history || "",
        );
      }

      // 2. Fetch patient/lab report data
      const result = await apiRequest(
        `${Labbaseurl}corporate_health_report/?barcode=${patient.barcode}`,
        "GET",
      );
      if (!result.success) {
        alert("Failed to fetch patient details: " + result.error);
        return;
      }
      const patientData = result.data.patient_data || result.data;
      setPatientDetails(patientData);

      // 3. Fetch all files using freshChcTests (not stale state)
      //    Each test.files is an array of GridFS ObjectId strings
      const files = {};
      await Promise.all(
        freshChcTests.map(async (test) => {
          const fileIds = test.files || [];
          if (fileIds.length === 0) return;
          const fetched = await Promise.all(
            fileIds.map((fileId) => {
              // fileId may be a plain string or an object like { "$oid": "..." }
              const id =
                typeof fileId === "object" && fileId.$oid
                  ? fileId.$oid
                  : String(fileId);
              return fetchInvestigationFile(id);
            }),
          );
          files[test.test_id] = fetched.filter(Boolean);
        }),
      );
      setInvestigationFiles(files);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── allApproved gate ──────────────────────────────────────────────────────
  const allApproved = () => {
    const allChcApproved =
      chcTests.length > 0
        ? chcTests.every(
            (t) => (t.has_file || t.has_report) && t.status === "approved",
          )
        : chcInvestigationStatus === "approved";
    return allChcApproved && labApprovalStatus === "approved";
  };

  const handlePreview = async () => {
    await fetchPatientDetails();
    setShowPreview(true);
  };

  const handleSaveApproval = async () => {
    try {
      const result = await apiRequest(
        `${Labbaseurl}save_overall_approval/`,
        "POST",
        {
          barcode: patient.barcode,
          employee_id: patient.patient_id,
          impression,
          remarks,
          date: new Date().toISOString(),
        },
      );
      if (result.success) {
        alert("Approval saved successfully!");
        setShowPreview(false);
        if (typeof onApprovalSaved === "function") await onApprovalSaved();
        onClose();
      } else {
        alert("Error saving approval: " + result.error);
      }
    } catch (error) {
      console.error("Error saving approval:", error);
      alert("Error saving approval");
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const processUnicodeText = (text) => {
    if (!text) return "";
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
    };
    let processed = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
      const ch = String.fromCharCode(parseInt(hex, 16));
      return unicodeMap[ch] || ch;
    });
    Object.keys(unicodeMap).forEach((k) => {
      processed = processed.replace(new RegExp(k, "g"), unicodeMap[k]);
    });
    return processed;
  };

  const getHighLowStatus = (value, reference) => {
    if (!value || !reference) return null;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return null;
    if (reference.includes("-")) {
      const [min, max] = reference.split("-").map((v) => parseFloat(v));
      if (!isNaN(min) && !isNaN(max)) {
        if (numValue < min) return "L";
        if (numValue > max) return "H";
      }
    } else if (reference.includes("<")) {
      const max = parseFloat(reference.replace("<", ""));
      if (!isNaN(max) && numValue > max) return "H";
    } else if (reference.includes(">")) {
      const min = parseFloat(reference.replace(">", ""));
      if (!isNaN(min) && numValue < min) return "L";
    }
    return null;
  };

  // ── Summary counts ────────────────────────────────────────────────────────
  const pendingCount = chcTests.filter((t) => t.status !== "approved").length;
  const approvedCount = chcTests.filter((t) => t.status === "approved").length;

  // ── Render a single file cell (image or PDF page) ─────────────────────────
  const renderSingleFileCell = (file, cacheKey, label) => {
    if (!file || !file.data) return null;
    const contentType = file.contentType || "";
    const filename = (file.filename || "").toLowerCase();
    const isPDF = contentType.includes("pdf") || filename.endsWith(".pdf");
    const images = pdfImages[cacheKey] || [];
    const isConverting = conversionLoading[cacheKey];

    if (isPDF) {
      if (images.length === 0 && !isConverting) {
        return (
          <LoadPdfButton
            onClick={() => {
              setConversionLoading((prev) => ({ ...prev, [cacheKey]: true }));
              convertPdfToImages(file.data, cacheKey);
            }}
          >
            Load PDF: {label}
          </LoadPdfButton>
        );
      }
      if (isConverting) {
        return (
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            Converting PDF…
          </div>
        );
      }
      // For PDF: show all pages stacked inside this cell
      return (
        <div>
          {images.map((imgSrc, pageIdx) => (
            <div key={pageIdx}>
              {images.length > 1 && (
                <div
                  style={{ fontSize: 11, color: "#888", padding: "4px 8px" }}
                >
                  Page {pageIdx + 1}/{images.length}
                </div>
              )}
              <FileImage src={imgSrc} alt={`${label} p${pageIdx + 1}`} />
            </div>
          ))}
        </div>
      );
    }

    // Image
    return (
      <FileImage src={`data:${contentType};base64,${file.data}`} alt={label} />
    );
  };

  // ── Render files for one CHC test (1 file → full width; 2+ → 2-col grid capped at 3 rows) ──
  const renderTestFiles = (testId, testName) => {
    const files = investigationFiles[testId];
    if (!files || files.length === 0) return null;

    if (files.length === 1) {
      const cacheKey = `${testId}_0`;
      return (
        <div style={{ marginTop: 8 }}>
          {renderSingleFileCell(files[0], cacheKey, testName)}
        </div>
      );
    }

    // 2+ files → 2-column grid (up to 6 shown, i.e. 3 rows × 2 cols)
    const maxShow = 6;
    const shown = files.slice(0, maxShow);
    return (
      <FilesGrid>
        {shown.map((file, idx) => {
          const cacheKey = `${testId}_${idx}`;
          return (
            <FileGridCell key={cacheKey}>
              <FileGridCellLabel>
                File {idx + 1}
                {files.length > maxShow && idx === maxShow - 1
                  ? ` (+${files.length - maxShow} more)`
                  : ""}
              </FileGridCellLabel>
              <div style={{ padding: 8 }}>
                {renderSingleFileCell(
                  file,
                  cacheKey,
                  `${testName} #${idx + 1}`,
                )}
              </div>
            </FileGridCell>
          );
        })}
      </FilesGrid>
    );
  };

  // ── Lab Investigations sub-component ──────────────────────────────────────
  const LabInvestigationsPreview = ({ tests = [] }) => {
    const labTests = tests.filter(
      (t) =>
        ![
          "Audiometry",
          "Pulmonary Function Test",
          "Chest - XRay",
          "ECG",
          "Eye examination",
        ].includes(t.testname),
    );
    if (labTests.length === 0)
      return <InfoValue>No lab investigations available.</InfoValue>;

    const testsByDepartment = labTests.reduce((acc, test) => {
      const dept = test.department || "LABORATORY";
      (acc[dept] = acc[dept] || []).push(test);
      return acc;
    }, {});

    return (
      <div>
        {Object.keys(testsByDepartment).map((department) => (
          <div key={department} style={{ marginBottom: 16 }}>
            <DeptHeading>{department.toUpperCase()}</DeptHeading>
            <LabTable>
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
                  const status = getHighLowStatus(
                    test.value,
                    test.reference_range,
                  );
                  return (
                    <React.Fragment
                      key={test.testname + (test.samplecollected_time || "")}
                    >
                      <tr>
                        <LabTd style={{ fontWeight: 600 }}>
                          {test.testname}
                        </LabTd>
                        <LabTd>{test.specimen_type || ""}</LabTd>
                        <LabTd>
                          <span>{test.value || ""}</span>
                          {status === "H" && (
                            <StatusBadge $high> ▲ H</StatusBadge>
                          )}
                          {status === "L" && (
                            <StatusBadge $low> ▼ L</StatusBadge>
                          )}
                        </LabTd>
                        <LabTd>{processUnicodeText(test.unit || "")}</LabTd>
                        <LabTd>{test.reference_range || ""}</LabTd>
                        <LabTd>
                          {(test.method || "")
                            .replace(/\bMethod\b/i, "")
                            .trim()}
                        </LabTd>
                      </tr>
                      {(test.parameters || []).length > 0 &&
                        (() => {
                          const bySubtitle = test.parameters.reduce(
                            (acc, p) => {
                              const sub = p.sub_title || "";
                              (acc[sub] = acc[sub] || []).push(p);
                              return acc;
                            },
                            {},
                          );
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
                                const pStatus = getHighLowStatus(
                                  p.value,
                                  p.reference_range,
                                );
                                return (
                                  <tr key={p.name}>
                                    <LabTd>{p.name}</LabTd>
                                    <LabTd>{p.specimen_type || ""}</LabTd>
                                    <LabTd>
                                      <span>{p.value || ""}</span>
                                      {pStatus === "H" && (
                                        <StatusBadge $high> ▲ H</StatusBadge>
                                      )}
                                      {pStatus === "L" && (
                                        <StatusBadge $low> ▼ L</StatusBadge>
                                      )}
                                    </LabTd>
                                    <LabTd>
                                      {processUnicodeText(p.unit || "")}
                                    </LabTd>
                                    <LabTd>{p.reference_range || ""}</LabTd>
                                    <LabTd>
                                      {(p.method || "")
                                        .replace(/\bMethod\b/i, "")
                                        .trim()}
                                    </LabTd>
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          ));
                        })()}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </LabTable>
          </div>
        ))}
      </div>
    );
  };

  // ── Build vitals rows robustly (handles both key naming conventions) ───────
  const buildVitalsRows = (vitals) => {
    if (!vitals) return [];
    const rows = [];
    // height: stored as height_cm or height
    const height = vitals.height_cm || vitals.height;
    if (height && String(height).trim() && String(height).trim() !== "0") {
      rows.push({ param: "Height", value: `${height} cms`, range: "" });
    }
    // weight: stored as weight_kg or weight
    const weight = vitals.weight_kg || vitals.weight;
    if (weight && String(weight).trim() && String(weight).trim() !== "0") {
      rows.push({ param: "Weight", value: `${weight} kgs`, range: "" });
    }
    if (
      vitals.bmi &&
      String(vitals.bmi).trim() &&
      String(vitals.bmi).trim() !== "0"
    ) {
      rows.push({
        param: "BMI",
        value: `${vitals.bmi} kg/m²`,
        range: "18.5 – 24.9",
      });
    }
    if (vitals.blood_pressure && String(vitals.blood_pressure).trim()) {
      rows.push({
        param: "Blood Pressure",
        value: `${vitals.blood_pressure} mmHg`,
        range: "120/80",
      });
    }
    // pulse: stored as pulse or spo2 (legacy)
    const pulse = vitals.pulse || vitals.spo2;
    if (pulse && String(pulse).trim() && String(pulse).trim() !== "0") {
      rows.push({
        param: "Pulse Rate",
        value: `${pulse} bpm`,
        range: "60 – 100",
      });
    }
    return rows;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PREVIEW MODAL
  // ═══════════════════════════════════════════════════════════════════════════
  if (showPreview) {
    const vitalsRows = buildVitalsRows(
      // Prefer vitals fetched from core_investigation via get_investigation_status
      Object.keys(vitalsFromInvestigation).length > 0
        ? vitalsFromInvestigation
        : patientDetails?.vitals,
    );

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
                <Loader size={32} />
                <span>Loading report and files…</span>
              </LoadingContainer>
            ) : patientDetails ? (
              <>
                {/* ── 1. Patient Information ─────────────────────────────── */}
                <ReportSection>
                  <SectionTitle>1. Patient Information</SectionTitle>
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

                {/* ── 2. Medical History ─────────────────────────────────── */}
                <ReportSection>
                  <SectionTitle>2. Medical History</SectionTitle>
                  <InfoValue style={{ lineHeight: 1.8, fontSize: 15 }}>
                    {patientHistoryFromInvestigation ||
                      patientDetails.medical_history?.patient_history ||
                      "Nil Significant"}
                  </InfoValue>
                </ReportSection>

                {/* ── 3. Vitals ──────────────────────────────────────────── */}
                <ReportSection>
                  <SectionTitle>3. Vitals</SectionTitle>
                  {vitalsRows.length > 0 ? (
                    <LabTable>
                      <LabThead>
                        <tr>
                          <LabTh>Parameter</LabTh>
                          <LabTh>Reading</LabTh>
                          <LabTh>Normal Range</LabTh>
                        </tr>
                      </LabThead>
                      <tbody>
                        {vitalsRows.map((row) => (
                          <tr key={row.param}>
                            <LabTd style={{ fontWeight: 600 }}>
                              {row.param}
                            </LabTd>
                            <LabTd>{row.value}</LabTd>
                            <LabTd style={{ color: "#888" }}>{row.range}</LabTd>
                          </tr>
                        ))}
                      </tbody>
                    </LabTable>
                  ) : (
                    <InfoValue style={{ color: "#888" }}>
                      No vitals recorded.
                    </InfoValue>
                  )}
                </ReportSection>

                {/* ── 4. Miscellaneous Investigations ───────────────────── */}
                <ReportSection>
                  <SectionTitle>4. Miscellaneous Investigations</SectionTitle>
                  {patientDetails.investigation_notes?.ecg_notes && (
                    <InfoRow>
                      <InfoLabel>E.C.G:</InfoLabel>
                      <InfoValue>
                        {patientDetails.investigation_notes.ecg_notes}
                      </InfoValue>
                    </InfoRow>
                  )}
                  {patientDetails.investigation_notes?.pft_notes && (
                    <InfoRow>
                      <InfoLabel>Spirometry / PFT:</InfoLabel>
                      <InfoValue>
                        {patientDetails.investigation_notes.pft_notes}
                      </InfoValue>
                    </InfoRow>
                  )}
                  {patientDetails.investigation_notes?.xray_notes && (
                    <InfoRow>
                      <InfoLabel>X-Ray:</InfoLabel>
                      <InfoValue>
                        {patientDetails.investigation_notes.xray_notes}
                      </InfoValue>
                    </InfoRow>
                  )}
                  {patientDetails.investigation_notes?.audiometry_notes && (
                    <InfoRow>
                      <InfoLabel>Audiometry:</InfoLabel>
                      <InfoValue>
                        {patientDetails.investigation_notes.audiometry_notes}
                      </InfoValue>
                    </InfoRow>
                  )}
                  {/* Also show notes from previewChcTests (from core_investigation.test_results) */}
                  {previewChcTests.filter((t) => t.notes && t.notes.trim())
                    .length > 0 && (
                    <>
                      <div
                        style={{
                          marginTop: 16,
                          marginBottom: 8,
                          fontWeight: 600,
                          color: "#555",
                          fontSize: 13,
                          borderTop: "1px dashed #e0e0e0",
                          paddingTop: 12,
                        }}
                      >
                        CHC Test Notes:
                      </div>
                      {previewChcTests
                        .filter((t) => t.notes && t.notes.trim())
                        .map((test) => (
                          <InfoRow key={test.test_id}>
                            <InfoLabel style={{ minWidth: 160 }}>
                              {test.testname}:
                            </InfoLabel>
                            <InfoValue>{test.notes}</InfoValue>
                          </InfoRow>
                        ))}
                    </>
                  )}
                  {/* If nothing at all */}
                  {!patientDetails.investigation_notes?.ecg_notes &&
                    !patientDetails.investigation_notes?.pft_notes &&
                    !patientDetails.investigation_notes?.xray_notes &&
                    !patientDetails.investigation_notes?.audiometry_notes &&
                    previewChcTests.filter((t) => t.notes && t.notes.trim())
                      .length === 0 && (
                      <InfoValue style={{ color: "#888" }}>
                        No miscellaneous investigation notes available.
                      </InfoValue>
                    )}
                </ReportSection>

                {/* ── 5. Test Reports (report text + files per test) ─────── */}
                {previewChcTests.length > 0 && (
                  <ReportSection>
                    <SectionTitle>5. Test Reports &amp; Files</SectionTitle>
                    {previewChcTests.map((test) => {
                      const hasReport = test.report && test.report.trim();
                      const hasFiles =
                        investigationFiles[test.test_id] &&
                        investigationFiles[test.test_id].length > 0;
                      if (!hasReport && !hasFiles) {
                        return (
                          <TestReportCard key={test.test_id}>
                            <TestReportCardHeader>
                              <TestReportCardTitle>
                                {test.testname}
                              </TestReportCardTitle>
                              <ApprovalBadge $approved={false}>
                                No Data
                              </ApprovalBadge>
                            </TestReportCardHeader>
                          </TestReportCard>
                        );
                      }
                      return (
                        <TestReportCard key={test.test_id}>
                          <TestReportCardHeader>
                            <TestReportCardTitle>
                              {test.testname}
                            </TestReportCardTitle>
                            <ApprovalBadge
                              $approved={test.status === "approved"}
                            >
                              {test.status === "approved"
                                ? "Approved"
                                : "Pending"}
                            </ApprovalBadge>
                          </TestReportCardHeader>
                          <TestReportCardBody>
                            {hasReport && (
                              <div style={{ marginBottom: hasFiles ? 16 : 0 }}>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    color: "#555",
                                    marginBottom: 8,
                                    fontSize: 13,
                                  }}
                                >
                                  Report:
                                </div>
                                <div
                                  style={{
                                    lineHeight: 1.9,
                                    fontSize: 14,
                                    color: "#222",
                                  }}
                                >
                                  {test.report
                                    .replace(/\\n/g, "\n")
                                    .split(/(?<=\.)\s+/)
                                    .map((s) => s.trim())
                                    .filter((s) => s.length > 0)
                                    .map((sentence, i) => (
                                      <div key={i} style={{ marginBottom: 4 }}>
                                        {sentence.endsWith(".")
                                          ? sentence
                                          : `${sentence}.`}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                            {hasFiles && (
                              <div>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    color: "#555",
                                    marginBottom: 6,
                                    fontSize: 13,
                                  }}
                                >
                                  Files (
                                  {investigationFiles[test.test_id].length}):
                                </div>
                                {renderTestFiles(test.test_id, test.testname)}
                              </div>
                            )}
                          </TestReportCardBody>
                        </TestReportCard>
                      );
                    })}
                  </ReportSection>
                )}

                {/* ── 6. Lab Investigations ──────────────────────────────── */}
                {patientDetails.testdetails &&
                  patientDetails.testdetails.length > 0 && (
                    <ReportSection>
                      <SectionTitle>6. Lab Investigations</SectionTitle>
                      <LabInvestigationsPreview
                        tests={patientDetails.testdetails}
                      />
                    </ReportSection>
                  )}

                {/* ── 7. Clinical Assessment ────────────────────────────── */}
                <ReportSection>
                  <SectionTitle>7. Clinical Assessment</SectionTitle>
                  <InputGroup>
                    <InputLabel>Impression</InputLabel>
                    <TextArea
                      value={impression}
                      onChange={(e) => setImpression(e.target.value)}
                      placeholder="Enter impression…"
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLabel>Remarks</InputLabel>
                    <TextArea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Enter remarks…"
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
              <X size={16} /> Cancel
            </Button>
            <Button $primary onClick={handleSaveApproval}>
              <Save size={16} /> Save Approval
            </Button>
          </PreviewFooter>
        </PreviewModalContent>
      </ModalOverlay>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATUS MODAL (default view)
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <Title>Investigation Status</Title>
          <Button $secondary onClick={onClose}>
            <X size={16} />
          </Button>
        </ModalHeader>

        {loading ? (
          <LoadingContainer>
            <Loader size={32} />
            <span>Loading status…</span>
          </LoadingContainer>
        ) : (
          <>
            <StatusList>
              {/* CHC Tests */}
              {chcTests.length > 0 ? (
                <>
                  <CHCTestSectionTitle>CHC Investigations</CHCTestSectionTitle>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 16px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#999",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <span>Test</span>
                    <div style={{ display: "flex", gap: 48 }}>
                      <span>Collection</span>
                      <span>Approval</span>
                    </div>
                  </div>
                  {chcTests.map((test) => {
                    const collected = test.has_file || test.has_report;
                    const approved = test.status === "approved";
                    return (
                      <StatusItem key={test.test_id}>
                        <StatusInfo>
                          <StatusLabel>
                            {test.testname || test.test_id}
                          </StatusLabel>
                        </StatusInfo>
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                          }}
                        >
                          <ApprovalBadge $approved={collected}>
                            {collected ? "Collected" : "Pending"}
                          </ApprovalBadge>
                          <ApprovalBadge $approved={approved}>
                            {approved ? "Approved" : "Pending"}
                          </ApprovalBadge>
                        </div>
                      </StatusItem>
                    );
                  })}
                  <div
                    style={{
                      marginTop: 8,
                      padding: "8px 12px",
                      background: "#f9f9f9",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "#555",
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>
                      📋 Collected:{" "}
                      <strong>
                        {
                          chcTests.filter((t) => t.has_file || t.has_report)
                            .length
                        }
                      </strong>{" "}
                      / {chcTests.length}
                    </span>
                    <span>
                      ✅ Approved: <strong>{approvedCount}</strong>
                    </span>
                    <span>
                      ⏳ Pending:{" "}
                      <strong
                        style={{ color: pendingCount > 0 ? "#b45309" : "#555" }}
                      >
                        {pendingCount}
                      </strong>
                    </span>
                  </div>
                </>
              ) : (
                <StatusItem>
                  <StatusInfo>
                    <StatusLabel>CHC Investigations</StatusLabel>
                    <StatusBadge>No billed CHC tests found</StatusBadge>
                  </StatusInfo>
                </StatusItem>
              )}

              {/* Lab Approval */}
              <CHCTestSectionTitle style={{ marginTop: 16 }}>
                Lab Approval
              </CHCTestSectionTitle>
              <StatusItem>
                <StatusInfo>
                  <StatusLabel>Lab Investigations</StatusLabel>
                </StatusInfo>
                <ApprovalBadge $approved={labApprovalStatus === "approved"}>
                  {labApprovalStatus === "approved" ? "Approved" : "Pending"}
                </ApprovalBadge>
              </StatusItem>
            </StatusList>

            <ModalFooter>
              <Button $secondary onClick={onClose}>
                <X size={16} /> Close
              </Button>
              <Button
                $primary
                onClick={handlePreview}
                disabled={!allApproved()}
              >
                <Eye size={16} /> Preview Report
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default CHCApproval;
