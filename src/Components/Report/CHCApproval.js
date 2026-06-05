"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { X, Eye, Save, Loader } from "lucide-react";
import apiRequest from "../Auth/apiRequest";
import * as pdfjsLib from "pdfjs-dist";

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
  background: #ffffff;
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
  justify-content: space-between;
  gap: 12px;
  flex: 1;
`;

const StatusBadgeBase = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
`;

const ApprovedBadge = styled(StatusBadgeBase)`
  color: #276749;
  background: #f0fff4;
  border: 1px solid #9ae6b4;
`;

const PendingBadge = styled(StatusBadgeBase)`
  color: #c53030;
  background: #fff5f5;
  border: 1px solid #feb2b2;
`;

const StatusLabel = styled.span`
  font-weight: 600;
  color: #333;
  min-width: 140px;
`;

const IndicatorsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const IndicatorChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 20px;
  background: ${(props) => (props.$ok ? "#f0fff4" : "#fff5f5")};
  color: ${(props) => (props.$ok ? "#276749" : "#c53030")};
  border: 1px solid ${(props) => (props.$ok ? "#9ae6b4" : "#feb2b2")};
  white-space: nowrap;
`;

const DynamicFieldTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
`;

const DynamicFieldTh = styled.th`
  text-align: left;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  color: #444;
  background: #faf5f8;
  border-bottom: 1px solid #eaeaea;
  width: 40%;
`;

const DynamicFieldTd = styled.td`
  padding: 10px 14px;
  font-size: 14px;
  color: #222;
  border-bottom: 1px solid #f2f2f2;
`;

const TickIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <circle cx="6" cy="6" r="6" fill="#38a169" />
    <path
      d="M3.5 6l1.8 1.8 3.2-3.6"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CrossIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <circle cx="6" cy="6" r="6" fill="#e53e3e" />
    <path
      d="M4 4l4 4M8 4l-4 4"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

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
`;

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

    &:hover {
      background: #c985a7;
    }
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
  min-height: 120px;
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
`;

const FileImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

const StatusBadgeHl = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 12px;
  color: ${(props) =>
    props.$high ? "#b91c1c" : props.$low ? "#1e3a8a" : "#555"};
`;

const OphthalmologyTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #eaeaea;
  margin: 15px 0;
`;

const OphthalmologyTh = styled.th`
  padding: 10px;
  background: #faf5f8;
  border: 1px solid #eaeaea;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
`;

const OphthalmologyTd = styled.td`
  padding: 10px;
  border: 1px solid #eaeaea;
  text-align: center;
  font-size: 14px;
`;

const CHCApproval = ({ patient, onClose, onApprovalSaved }) => {
  // ── State ────────────────────────────────────────────────────────────────
  const [chcTests, setChcTests] = useState([]);
  const [labApprovalStatus, setlabApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [investigationFiles, setInvestigationFiles] = useState({});
  const [chcInvestigationFiles, setChcInvestigationFiles] = useState({});
  const [chcInvestigationStatus, setChcInvestigationStatus] = useState(null);
  const [pdfImages, setPdfImages] = useState({});
  const [conversionLoading, setConversionLoading] = useState({});
  const [impression, setImpression] = useState("Reports within Normal Limits.");
  const [remarks, setRemarks] = useState(
    "The above candidate was examined and found Medically Fit for the Job.",
  );
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const buildImpression = (vitals, testdetails, chcTests) => {
    const lines = ["Reports within Normal Limits."];

    // BMI check
    const bmi = parseFloat(vitals?.bmi || 0);
    const bmiStatus = (vitals?.bmi_status || "").toLowerCase();
    if (
      (bmiStatus === "obese" ||
        bmiStatus === "over weight" ||
        bmiStatus === "overweight") &&
      bmi >= 30
    ) {
      lines.push("Needs endocrinology opinion for weight management.");
    } else if (
      bmiStatus === "obese" ||
      bmiStatus === "over weight" ||
      bmiStatus === "overweight"
    ) {
      lines.push("Life style modification for weight reduction.");
    }

    // BP check
    const bp = vitals?.blood_pressure || "";
    const bpParts = bp.split("/");
    if (bpParts.length === 2) {
      const systolic = parseFloat(bpParts[0]);
      const diastolic = parseFloat(bpParts[1]);
      if (systolic > 150 || diastolic > 100) {
        lines.push("Get physician opinion for hypertension management.");
      } else if (systolic > 140 || diastolic > 90) {
        lines.push(
          "To recheck BP after 2 weeks and get physician consultation for BP control.",
        );
      }
    }

    // SpO2 check
    const spo2Status = (vitals?.spo2_status || "").toLowerCase();
    if (spo2Status === "low" || spo2Status === "high") {
      lines.push(
        "To recheck SpO2 after 2 weeks and get cardiologist consultation for SpO2 control.",
      );
    }

    // PFT notes check
    const pftTest = (chcTests || []).find((t) => t.testname === "PFT");
    if (
      pftTest?.notes &&
      pftTest.notes.trim().toLowerCase() !== "normal study."
    ) {
      lines.push("Repeat PFT and to obtain pulmonology opinion.");
    }

    // Lab test checks
    const allParams = (testdetails || []).flatMap(
      (t) => t.parameters || [{ name: t.testname, value: t.value }],
    );

    // HbA1c + EAG combined
    const hba1c = allParams.find(
      (p) => p.name === "Glycosylated Haemoglobin (HbA1C)",
    );
    const eag = allParams.find(
      (p) => p.name === "Estimated Average Glucose (EAG)",
    );

    if (
      hba1c &&
      parseFloat(hba1c.value) > 7 &&
      eag &&
      parseFloat(eag.value) > 200
    ) {
      lines.push("Get physician opinion for uncontrolled diabetes.");
    } else if (hba1c && parseFloat(hba1c.value) > 6.5) {
      lines.push("Get physician opinion.");
    }
    // Random glucose
    const glucose = allParams.find((p) => p.name === "GLUCOSE - RANDOM");
    if (glucose && parseFloat(glucose.value) > 200) {
      lines.push("Get physician opinion for Sugar Control.");
    }

    // Cholesterol
    const cholesterol = allParams.find((p) => p.name === "Cholesterol (Total)");
    if (cholesterol && parseFloat(cholesterol.value) > 240) {
      lines.push("Get physician opinion for hyperlipidemia.");
    }

    // Triglycerides
    const tgl = allParams.find((p) => p.name === "Triglycerides - TGL");
    if (tgl && parseFloat(tgl.value) > 200) {
      lines.push("Get physician opinion for hyperlipidemia.");
    }

    // Haemoglobin
    const hb = allParams.find((p) => p.name === "Haemoglobin");
    if (hb && parseFloat(hb.value) < 10) {
      lines.push("Get physician opinion for anemic management.");
    }

    // ECHO notes check
    const echoTest = (chcTests || []).find((t) => t.testname === "ECHO");
    if (
      echoTest?.notes &&
      echoTest.notes.trim().toLowerCase() !== "normal study."
    ) {
      lines.push("Get cardiology opinion for ECHO Changes.");
    }

    // ECG notes check
    const ecgTest = (chcTests || []).find((t) => t.testname === "ECG");
    if (
      ecgTest?.notes &&
      ecgTest.notes.trim().toLowerCase() !== "normal study."
    ) {
      lines.push("Get cardiology opinion for ECG Changes.");
    }

    // VDRL
    const vdrl = allParams.find((p) => p.name === "VDRL");
    if (vdrl && vdrl.value.trim().toLowerCase() !== "negative") {
      lines.push(
        "To do confirmatory test for syphilis since VDRL is Positive.",
      );
    }

    const uniqueLines = [...new Set(lines)];
    if (uniqueLines.length > 1) {
      uniqueLines[0] = "Other reports within Normal Limits.";
    }
    return uniqueLines.join("\n");
  };

  useEffect(() => {
    // Dynamically resolve the worker URL from the installed pdfjs-dist version
    // This avoids any CDN version mismatch
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }, []);

  useEffect(() => {
    fetchInvestigationStatus();
  }, [patient.barcode]);

  // ── Fetch investigation status (uses chc_tests from API) ─────────────────
  const fetchInvestigationStatus = async () => {
    try {
      setLoading(true);
      const result = await apiRequest(
        `${Labbaseurl}get_investigation_status/?barcode=${patient.barcode}`,
        "GET",
      );
      if (result.success) {
        setChcTests(result.data.chc_tests || []);
        setlabApprovalStatus(result.data.lab_approval || null);
        setChcInvestigationStatus(result.data.chc_investigation_status || null); // ← add
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

  // ── All approved check ────────────────────────────────────────────────────
  const allApproved = () => {
    return (
      chcInvestigationStatus === "approved" && labApprovalStatus === "approved"
    );
  };

  // ── File helpers ─────────────────────────────────────────────────────────
  const fetchInvestigationFile = async (fileId) => {
    if (!fileId) return null;
    try {
      const result = await apiRequest(
        `${Labbaseurl}get_investigation_file/?file_id=${fileId}`,
        "GET",
      );
      if (!result.success) {
        console.error(`Failed to fetch file ${fileId}:`, result.error);
        return null;
      }
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

  const convertPdfToImages = async (base64Data, fileKey) => {
    try {
      console.log("Starting PDF conversion for key:", fileKey);

      // Strip any data-URI prefix, keep raw base64
      const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "").trim();

      // Decode base64 → Uint8Array
      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      console.log("PDF bytes length:", bytes.length);

      const loadingTask = pdfjsLib.getDocument({
        data: bytes,
        // No cMapUrl needed for most medical PDFs; omitting avoids version mismatch errors
      });

      const pdf = await loadingTask.promise;
      console.log("PDF loaded, pages:", pdf.numPages);

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
        console.log(`Rendered page ${pageNum}/${pdf.numPages}`);
      }

      setPdfImages((prev) => ({ ...prev, [fileKey]: images }));
      console.log("PDF conversion done, images:", images.length);
      return images;
    } catch (error) {
      console.error("PDF conversion error for key", fileKey, ":", error);
      // Mark as failed so UI can show error instead of spinner
      setPdfImages((prev) => ({ ...prev, [fileKey]: ["ERROR"] }));
      return [];
    } finally {
      setConversionLoading((prev) => ({ ...prev, [fileKey]: false }));
    }
  };

  // ── Fetch full patient details for preview ────────────────────────────────
  const fetchPatientDetails = async () => {
    try {
      setLoading(true);

      // ── Step 1: corporate_health_report ──────────────────────────────────
      const result = await apiRequest(
        `${Labbaseurl}corporate_health_report/?barcode=${patient.barcode}`,
        "GET",
      );

      console.log("corporate_health_report raw result:", result);

      if (!result.success) {
        console.error("Error fetching patient details:", result.error);
        alert(
          "Failed to fetch patient details: " +
            (result.error || "Unknown error"),
        );
        return;
      }

      // The backend returns { patient_data: {...}, signatures: [...] }
      // but apiRequest may wrap it under result.data
      let details = null;
      const raw = result.data;

      if (raw?.patient_data) {
        details = raw.patient_data; // normal shape
      } else if (raw?.patientname || raw?.patient_id) {
        details = raw; // already unwrapped
      } else if (raw?.data?.patient_data) {
        details = raw.data.patient_data; // double-wrapped
      } else {
        details = raw;
      }

      console.log("Resolved patientDetails:", details);
      setPatientDetails(details);

      // ── Step 2: get_investigation_status — merge vitals / history ────────
      const invResult = await apiRequest(
        `${Labbaseurl}get_investigation_status/?barcode=${patient.barcode}`,
        "GET",
      );
      console.log("get_investigation_status result:", invResult);

      if (invResult.success && invResult.data) {
        const inv = invResult.data;

        setPatientDetails((prev) => {
          const merged = { ...prev };

          // Vitals
          if (
            (!merged.vitals || Object.keys(merged.vitals).length === 0) &&
            inv.vitals &&
            Object.keys(inv.vitals).length > 0
          ) {
            merged.vitals = inv.vitals;
          }

          // Patient history
          if (
            !merged.medical_history &&
            inv.patient_history &&
            inv.patient_history.trim()
          ) {
            merged.medical_history = { patient_history: inv.patient_history };
          }

          // Ophthalmology — try from chc_tests CHCT001 notes if main ophthalmology missing
          if (!merged.ophthalmology) {
            const ophthalTest = (inv.chc_tests || []).find(
              (t) => t.test_id === "CHCT001",
            );
            if (ophthalTest && ophthalTest.notes) {
              merged.ophthalmology = {
                remarks: ophthalTest.notes,
                patient_complaints: "",
                visual_acuity: null,
              };
            }
          }

          if (merged.vitals && Object.keys(merged.vitals).length > 0) {
            setImpression(
              buildImpression(merged.vitals, merged.testdetails, inv.chc_tests),
            );
          }

          return merged;
        });
      }

      // ── Step 3: Fetch investigation files from chc_tests ────────────────
      // chc_tests[].files[] contains the GridFS file IDs for each test
      const chcTests = invResult?.data?.chc_tests || [];
      const chcFilesMap = {}; // { test_id: { label, files: [{ data, contentType, filename }] } }

      // Also collect old-style investigation_file_ids (ecg_file, pft_file etc.)
      const oldFileIds = details?.investigation_file_ids || {};

      // Fetch all CHC test files in parallel + store report/notes for each test
      await Promise.all(
        chcTests.map(async (test) => {
          const hasFiles = test.files && test.files.length > 0;
          const hasReport = !!(test.report && test.report.trim());
          const hasNotes = !!(test.notes && test.notes.trim());

          // Include test if it has files OR report/notes to display
          if (!hasFiles && !hasReport && !hasNotes) return;

          let validFiles = [];
          if (hasFiles) {
            const fetched = await Promise.all(
              test.files.map((fileId) => fetchInvestigationFile(fileId)),
            );
            validFiles = fetched.filter(Boolean);
          }

          chcFilesMap[test.test_id] = {
            label: test.testname,
            report: test.report || "",
            notes: test.notes || "",
            files: validFiles,
          };
        }),
      );

      // Fetch old-style files (backward compat)
      const oldFiles = {};
      await Promise.all(
        Object.entries(oldFileIds).map(async ([key, fileId]) => {
          if (fileId) {
            const fileData = await fetchInvestigationFile(fileId);
            if (fileData) oldFiles[key] = fileData;
          }
        }),
      );

      setInvestigationFiles(oldFiles); // legacy keyed files
      setChcInvestigationFiles(chcFilesMap); // new test-keyed files
      console.log("CHC files fetched:", Object.keys(chcFilesMap));
      console.log("Old files fetched:", Object.keys(oldFiles));
    } catch (error) {
      console.error("Error fetching patient details:", error);
      alert("Error loading preview: " + error.message);
    } finally {
      setLoading(false);
    }
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
        if (typeof onApprovalSaved === "function") {
          await onApprovalSaved();
        }
        onClose();
      } else {
        alert("Error saving approval: " + result.error);
      }
    } catch (error) {
      console.error("Error saving approval:", error);
      alert("Error saving approval");
    }
  };

  // ── Utilities ─────────────────────────────────────────────────────────────
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
      const ch = String.fromCharCode(Number.parseInt(hex, 16));
      return unicodeMap[ch] || ch;
    });
    Object.keys(unicodeMap).forEach((k) => {
      processed = processed.replace(new RegExp(k, "g"), unicodeMap[k]);
    });
    return processed;
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

  // ── Sub-components ────────────────────────────────────────────────────────
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
                            <StatusBadgeHl $high> ▲ H</StatusBadgeHl>
                          )}
                          {status === "L" && (
                            <StatusBadgeHl $low> ▼ L</StatusBadgeHl>
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
                                        <StatusBadgeHl $high>
                                          {" "}
                                          ▲ H
                                        </StatusBadgeHl>
                                      )}
                                      {pStatus === "L" && (
                                        <StatusBadgeHl $low> ▼ L</StatusBadgeHl>
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

  const renderFilePreview = (fileKey, label) => {
    const file = investigationFiles[fileKey];
    if (!file) return null;

    const contentType = (file.contentType || "").toLowerCase();
    const filename = (file.filename || "").toLowerCase();
    const rawData = file.data || "";

    const isPDF =
      contentType.includes("pdf") ||
      filename.endsWith(".pdf") ||
      rawData.startsWith("JVBER");

    const imgMime = contentType.startsWith("image/")
      ? contentType
      : filename.endsWith(".png")
        ? "image/png"
        : "image/jpeg";

    const images = pdfImages[fileKey] || [];
    const isConverting = conversionLoading[fileKey];
    const hasError = images[0] === "ERROR";

    return (
      <FilePreviewContainer key={fileKey}>
        <FilePreviewTitle>{label}</FilePreviewTitle>
        {isPDF ? (
          <>
            {images.length === 0 && !isConverting && (
              <button
                onClick={() => {
                  setConversionLoading((prev) => ({
                    ...prev,
                    [fileKey]: true,
                  }));
                  convertPdfToImages(rawData, fileKey);
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#DB9BB9",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                📄 Load PDF Preview
              </button>
            )}
            {isConverting && (
              <div
                style={{
                  padding: 20,
                  textAlign: "center",
                  background: "#f8f4f7",
                  borderRadius: 6,
                  color: "#888",
                  fontSize: 14,
                }}
              >
                ⏳ Converting PDF to images…
              </div>
            )}
            {hasError && !isConverting && (
              <div
                style={{
                  padding: 16,
                  background: "#fff5f5",
                  border: "1px solid #feb2b2",
                  borderRadius: 6,
                  color: "#c53030",
                  fontSize: 13,
                }}
              >
                ⚠️ Failed to render PDF.
                <button
                  onClick={() => {
                    setPdfImages((prev) => {
                      const n = { ...prev };
                      delete n[fileKey];
                      return n;
                    });
                    setConversionLoading((prev) => ({
                      ...prev,
                      [fileKey]: true,
                    }));
                    convertPdfToImages(rawData, fileKey);
                  }}
                  style={{
                    marginLeft: 10,
                    padding: "4px 10px",
                    cursor: "pointer",
                    background: "#DB9BB9",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                  }}
                >
                  Retry
                </button>
              </div>
            )}
            {!hasError &&
              images.length > 0 &&
              !isConverting &&
              images.map((img, idx) => (
                <div key={idx} style={{ marginBottom: 12 }}>
                  {images.length > 1 && (
                    <div
                      style={{ fontSize: 11, color: "#888", marginBottom: 4 }}
                    >
                      Page {idx + 1} / {images.length}
                    </div>
                  )}
                  <FileImage src={img} alt={`${label} page ${idx + 1}`} />
                </div>
              ))}
          </>
        ) : rawData ? (
          <FileImage
            src={
              rawData.startsWith("data:")
                ? rawData
                : `data:${imgMime};base64,${rawData}`
            }
            alt={label}
          />
        ) : (
          <div style={{ color: "#888", fontSize: 13 }}>
            No file data available
          </div>
        )}
      </FilePreviewContainer>
    );
  };

  // ── Render CHC test files (multiple files per test) ─────────────────────
  const renderChcTestFiles = (testId, label) => {
    const entry = chcInvestigationFiles[testId];
    if (!entry) return null;
    // Show if there's report/notes OR files
    if (!entry.files?.length && !entry.report && !entry.notes) return null;

    const displayLabel = label || entry.label;

    return (
      <FilePreviewContainer key={testId}>
        <FilePreviewTitle>{displayLabel}</FilePreviewTitle>

        {/* ── Report text (shown BEFORE images) ──────────────────────── */}
        {entry.report?.trim() && (
          <div
            style={{
              background: "#f8f9ff",
              border: "1px solid #dde3ff",
              borderRadius: 8,
              padding: "14px 16px",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#4361ee",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Report
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#222",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {entry.report}
            </div>
          </div>
        )}

        {/* ── Notes / Impression (shown BEFORE images) ───────────────── */}
        {entry.notes?.trim() && (
          <div
            style={{
              background: "#f6fff8",
              border: "1px solid #c6f6d5",
              borderRadius: 8,
              padding: "14px 16px",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#276749",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Impression / Notes
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#222",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {entry.notes}
            </div>
          </div>
        )}

        {/* ── No files message ───────────────────────────────────────── */}
        {(!entry.files || entry.files.length === 0) && (
          <div style={{ fontSize: 13, color: "#888", fontStyle: "italic" }}>
            No image files attached.
          </div>
        )}

        {/* ── File images / PDFs ─────────────────────────────────────── */}
        {entry.files &&
          entry.files.map((file, fileIdx) => {
            if (!file) return null;

            const contentType = (file.contentType || "").toLowerCase();
            const filename = (file.filename || "").toLowerCase();
            const rawData = file.data || "";

            // ── Detect file type ──────────────────────────────────────────────
            // Backend returns raw base64 with no data: prefix.
            // Detect PDF by content-type OR filename OR magic bytes in base64.
            const isPDF =
              contentType.includes("pdf") ||
              filename.endsWith(".pdf") ||
              rawData.startsWith("JVBER"); // base64 of %PDF-

            // For images, detect type: default to jpeg if unknown
            const imgMime = contentType.startsWith("image/")
              ? contentType
              : filename.endsWith(".png")
                ? "image/png"
                : filename.endsWith(".gif")
                  ? "image/gif"
                  : "image/jpeg";

            const fileKey = `${testId}_${fileIdx}`;
            const pdfImgList = pdfImages[fileKey] || [];
            const isConverting = conversionLoading[fileKey];
            const hasError = pdfImgList[0] === "ERROR";

            return (
              <div
                key={fileIdx}
                style={{
                  marginBottom: fileIdx < entry.files.length - 1 ? 20 : 0,
                }}
              >
                {entry.files.length > 1 && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#888",
                      marginBottom: 6,
                      fontStyle: "italic",
                    }}
                  >
                    File {fileIdx + 1} of {entry.files.length}
                    {file.filename ? ` — ${file.filename}` : ""}
                  </div>
                )}

                {isPDF ? (
                  <>
                    {/* Not yet triggered */}
                    {pdfImgList.length === 0 && !isConverting && (
                      <button
                        onClick={() => {
                          setConversionLoading((prev) => ({
                            ...prev,
                            [fileKey]: true,
                          }));
                          convertPdfToImages(rawData, fileKey);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px",
                          backgroundColor: "#DB9BB9",
                          color: "white",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        📄 Load PDF Preview
                      </button>
                    )}

                    {/* Converting spinner */}
                    {isConverting && (
                      <div
                        style={{
                          padding: 20,
                          textAlign: "center",
                          background: "#f8f4f7",
                          borderRadius: 6,
                          color: "#888",
                          fontSize: 14,
                        }}
                      >
                        ⏳ Converting PDF to images…
                      </div>
                    )}

                    {/* Error state */}
                    {hasError && !isConverting && (
                      <div
                        style={{
                          padding: 16,
                          background: "#fff5f5",
                          border: "1px solid #feb2b2",
                          borderRadius: 6,
                          color: "#c53030",
                          fontSize: 13,
                        }}
                      >
                        ⚠️ Failed to render PDF. Check console for details.
                        <button
                          onClick={() => {
                            setPdfImages((prev) => {
                              const n = { ...prev };
                              delete n[fileKey];
                              return n;
                            });
                            setConversionLoading((prev) => ({
                              ...prev,
                              [fileKey]: true,
                            }));
                            convertPdfToImages(rawData, fileKey);
                          }}
                          style={{
                            marginLeft: 10,
                            padding: "4px 10px",
                            cursor: "pointer",
                            background: "#DB9BB9",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                          }}
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    {/* Rendered pages */}
                    {!hasError && pdfImgList.length > 0 && !isConverting && (
                      <div>
                        {pdfImgList.map((img, pgIdx) => (
                          <div key={pgIdx} style={{ marginBottom: 12 }}>
                            {pdfImgList.length > 1 && (
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#888",
                                  marginBottom: 4,
                                }}
                              >
                                Page {pgIdx + 1} / {pdfImgList.length}
                              </div>
                            )}
                            <FileImage
                              src={img}
                              alt={`${label || entry.label} page ${pgIdx + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : /* Image file — construct proper data URI */
                rawData ? (
                  <FileImage
                    src={
                      rawData.startsWith("data:")
                        ? rawData
                        : `data:${imgMime};base64,${rawData}`
                    }
                    alt={`${label || entry.label} file ${fileIdx + 1}`}
                    onError={(e) => {
                      console.error("Image load error for", fileKey, e);
                      e.target.style.display = "none";
                      e.target.insertAdjacentHTML(
                        "afterend",
                        "<div style='color:#c53030;font-size:13px'>⚠️ Image failed to load</div>",
                      );
                    }}
                  />
                ) : (
                  <div style={{ color: "#888", fontSize: 13 }}>
                    No file data available
                  </div>
                )}
              </div>
            );
          })}
      </FilePreviewContainer>
    );
  };

  // ── Preview modal ─────────────────────────────────────────────────────────
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
                <Loader size={32} />
                <span>Loading report and files...</span>
              </LoadingContainer>
            ) : patientDetails ? (
              <>
                {/* Patient Info */}
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
                  {patientDetails.doj && (
                    <InfoRow>
                      <InfoLabel>Date of Joining:</InfoLabel>
                      <InfoValue>{formatDate(patientDetails.doj)}</InfoValue>
                    </InfoRow>
                  )}
                  {patientDetails.designation && (
                    <InfoRow>
                      <InfoLabel>Designation:</InfoLabel>
                      <InfoValue>{patientDetails.designation}</InfoValue>
                    </InfoRow>
                  )}
                  {patientDetails.employee_type && (
                    <InfoRow>
                      <InfoLabel>Employee Type:</InfoLabel>
                      <InfoValue>{patientDetails.employee_type}</InfoValue>
                    </InfoRow>
                  )}
                </ReportSection>

                {/* Vitals — backend may use height_cm/weight_kg OR height/weight */}
                {patientDetails.vitals &&
                  Object.keys(patientDetails.vitals).length > 0 &&
                  (() => {
                    const v = patientDetails.vitals;
                    const height = v.height || "N/A";
                    const weight = v.weight || "N/A";
                    const bmi = v.bmi || "N/A";
                    const bmi_status = v.bmi_status || "N/A";
                    const bp = v.blood_pressure || "N/A";
                    const bp_status = v.BP_status || "N/A";
                    const pulse = v.spo2 || "N/A";
                    const pulse_status = v.spo2_status || "N/A";
                    return (
                      <ReportSection>
                        <SectionTitle>Vitals</SectionTitle>
                        <LabTable>
                          <LabThead>
                            <tr>
                              <LabTh>Parameter</LabTh>
                              <LabTh>Reading</LabTh>
                              <LabTh>Normal Range</LabTh>
                              <LabTh>Status</LabTh>
                            </tr>
                          </LabThead>
                          <tbody>
                            <tr>
                              <LabTd>Height</LabTd>
                              <LabTd>{height} cms</LabTd>
                              <LabTd></LabTd>
                            </tr>
                            <tr>
                              <LabTd>Weight</LabTd>
                              <LabTd>{weight} kgs</LabTd>
                              <LabTd></LabTd>
                            </tr>
                            <tr>
                              <LabTd>BMI</LabTd>
                              <LabTd>{bmi} kg/m²</LabTd>
                              <LabTd>18.5 - 24.9</LabTd>
                              <LabTd>{bmi_status}</LabTd>
                            </tr>
                            <tr>
                              <LabTd>Blood Pressure</LabTd>
                              <LabTd>{bp} mmHg</LabTd>
                              <LabTd>120/80</LabTd>
                              <LabTd>{bp_status}</LabTd>
                            </tr>
                            <tr>
                              <LabTd>Pulse Rate</LabTd>
                              <LabTd>{pulse} bpm</LabTd>
                              <LabTd>60 - 100</LabTd>
                              <LabTd>{pulse_status}</LabTd>
                            </tr>
                          </tbody>
                        </LabTable>
                      </ReportSection>
                    );
                  })()}
                {/* Dynamic Fields */}
                {patientDetails.dynamic_fields?.length > 0 &&
                  patientDetails.dynamic_fields.map((field, idx) => (
                    <ReportSection key={`dynamic-${idx}`}>
                      <SectionTitle>{field.field_name}</SectionTitle>
                      <DynamicFieldTable>
                        <thead>
                          <tr>
                            <DynamicFieldTh>Parameter</DynamicFieldTh>
                            <DynamicFieldTh>Finding</DynamicFieldTh>
                          </tr>
                        </thead>
                        <tbody>
                          {field.field_values.map((fv, fvIdx) => (
                            <tr key={fvIdx}>
                              <DynamicFieldTd
                                style={{ fontWeight: 600, color: "#555" }}
                              >
                                {fv.key}
                              </DynamicFieldTd>
                              <DynamicFieldTd>{fv.value}</DynamicFieldTd>
                            </tr>
                          ))}
                        </tbody>
                      </DynamicFieldTable>
                    </ReportSection>
                  ))}

                {/* Medical History */}
                {patientDetails.medical_history && (
                  <ReportSection>
                    <SectionTitle>Medical History</SectionTitle>
                    <InfoValue>
                      {patientDetails.medical_history.patient_history ||
                        "Nil Significant"}
                    </InfoValue>
                  </ReportSection>
                )}

                {/* Miscellaneous Investigations */}
                {patientDetails.investigation_notes &&
                  Object.keys(patientDetails.investigation_notes).length >
                    0 && (
                    <ReportSection>
                      <SectionTitle>Miscellaneous Investigations</SectionTitle>
                      {patientDetails.investigation_notes.ecg_notes && (
                        <InfoRow>
                          <InfoLabel>E.C.G:</InfoLabel>
                          <InfoValue>
                            {patientDetails.investigation_notes.ecg_notes}
                          </InfoValue>
                        </InfoRow>
                      )}
                      {patientDetails.investigation_notes.pft_notes && (
                        <InfoRow>
                          <InfoLabel>Spirometry:</InfoLabel>
                          <InfoValue>
                            {patientDetails.investigation_notes.pft_notes}
                          </InfoValue>
                        </InfoRow>
                      )}
                      {patientDetails.investigation_notes.xray_notes && (
                        <InfoRow>
                          <InfoLabel>X-Ray:</InfoLabel>
                          <InfoValue>
                            {patientDetails.investigation_notes.xray_notes}
                          </InfoValue>
                        </InfoRow>
                      )}
                      {patientDetails.investigation_notes.audiometry_notes && (
                        <InfoRow>
                          <InfoLabel>Audiometry:</InfoLabel>
                          <InfoValue>
                            {
                              patientDetails.investigation_notes
                                .audiometry_notes
                            }
                          </InfoValue>
                        </InfoRow>
                      )}
                    </ReportSection>
                  )}

                {/* X-Ray Report */}
                {patientDetails.investigation_notes?.xray_report &&
                  patientDetails.investigation_notes.xray_report.trim() && (
                    <ReportSection>
                      <SectionTitle>X-Ray Chest PA View</SectionTitle>
                      <InfoValue
                        style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}
                      >
                        {(() => {
                          let text =
                            patientDetails.investigation_notes.xray_report;
                          text = text.replace(/\\n/g, "\n");
                          return text
                            .split("\n")
                            .map((l) => l.trim())
                            .filter((l) => l.length > 0)
                            .join("\n");
                        })()}
                      </InfoValue>
                      <div
                        style={{
                          marginTop: "25px",
                          paddingTop: "15px",
                          borderTop: "1px solid #e0e0e0",
                        }}
                      >
                        <InfoLabel
                          style={{
                            display: "block",
                            marginBottom: "10px",
                            fontSize: "15px",
                          }}
                        >
                          IMPRESSION:
                        </InfoLabel>
                        <InfoValue style={{ fontSize: "14px" }}>
                          {patientDetails.investigation_notes.xray_notes ||
                            "No significant finding in the lungs or mediastinum."}
                        </InfoValue>
                      </div>
                    </ReportSection>
                  )}

                {/* Investigation Files */}
                {/* Investigation Files — from chc_tests[].files (primary)
                     and legacy investigation_file_ids (fallback) */}
                {(Object.keys(chcInvestigationFiles).length > 0 ||
                  Object.keys(investigationFiles).length > 0) && (
                  <ReportSection>
                    <SectionTitle>Investigation Reports & Files</SectionTitle>

                    {/* New: render each CHC test's files grouped by test */}
                    {Object.keys(chcInvestigationFiles).length > 0 ? (
                      Object.entries(chcInvestigationFiles).map(
                        ([testId, entry]) =>
                          renderChcTestFiles(testId, entry.label),
                      )
                    ) : (
                      /* Fallback: old-style single-file-per-key */
                      <>
                        {renderFilePreview("xrayfilm_file", "X-Ray Film")}
                        {renderFilePreview("ecg_file", "ECG Report")}
                        {renderFilePreview(
                          "pft_file",
                          "Pulmonary Function Test (PFT)",
                        )}
                        {renderFilePreview(
                          "audiometric_file",
                          "Audiometry Report",
                        )}
                      </>
                    )}
                  </ReportSection>
                )}

                {/* Ophthalmology — handles both CHC (distance/nearVision/colourVision keys)
                     and legacy (visual_acuity nested) structures */}
                {(() => {
                  const oph = patientDetails.ophthalmology;
                  if (!oph) return null;

                  // CHC shape: { distance:{right,left}, nearVision:{right,left}, colourVision:{right,left}, ocularmovement:{right,left}, complaints, remarks }
                  // Legacy shape: { visual_acuity:{ distance, near_vision, color_vision, ocularmovement }, patient_complaints, remarks }
                  const isCHC =
                    oph.distance || oph.nearVision || oph.colourVision;

                  const rows = [];
                  if (isCHC) {
                    if (oph.distance)
                      rows.push({
                        label: "Distant Vision",
                        r: oph.distance.right,
                        l: oph.distance.left,
                      });
                    if (oph.nearVision)
                      rows.push({
                        label: "Near Vision",
                        r: oph.nearVision.right,
                        l: oph.nearVision.left,
                      });
                    if (oph.colourVision)
                      rows.push({
                        label: "Colour Vision",
                        r: oph.colourVision.right,
                        l: oph.colourVision.left,
                      });
                    if (oph.ocularmovement)
                      rows.push({
                        label: "Ocular Movement",
                        r: oph.ocularmovement.right,
                        l: oph.ocularmovement.left,
                      });
                  } else if (oph.visual_acuity) {
                    const va = oph.visual_acuity;
                    if (va.distance)
                      rows.push({
                        label: "Distant Vision",
                        r: va.distance.right,
                        l: va.distance.left,
                      });
                    if (va.near_vision)
                      rows.push({
                        label: "Near Vision",
                        r: va.near_vision.right,
                        l: va.near_vision.left,
                      });
                    if (va.color_vision)
                      rows.push({
                        label: "Colour Vision",
                        r: va.color_vision.right,
                        l: va.color_vision.left,
                      });
                    if (va.ocularmovement)
                      rows.push({
                        label: "Ocular Movement",
                        r: va.ocularmovement.right,
                        l: va.ocularmovement.left,
                      });
                  }

                  const complaints =
                    oph.complaints || oph.patient_complaints || "";
                  const remarks = oph.remarks || "";

                  return (
                    <ReportSection>
                      <SectionTitle>Ophthalmology Report</SectionTitle>

                      {rows.length > 0 && (
                        <OphthalmologyTable>
                          <thead>
                            <tr>
                              <OphthalmologyTh>Test</OphthalmologyTh>
                              <OphthalmologyTh>Right Eye</OphthalmologyTh>
                              <OphthalmologyTh>Left Eye</OphthalmologyTh>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row) => (
                              <tr key={row.label}>
                                <OphthalmologyTd style={{ fontWeight: 600 }}>
                                  {row.label}
                                </OphthalmologyTd>
                                <OphthalmologyTd>
                                  {row.r || "N/A"}
                                </OphthalmologyTd>
                                <OphthalmologyTd>
                                  {row.l || "N/A"}
                                </OphthalmologyTd>
                              </tr>
                            ))}
                          </tbody>
                        </OphthalmologyTable>
                      )}

                      {complaints?.trim() && (
                        <div style={{ marginTop: "20px" }}>
                          <InfoLabel
                            style={{ display: "block", marginBottom: "8px" }}
                          >
                            Patient Complaints:
                          </InfoLabel>
                          <InfoValue>{complaints}</InfoValue>
                        </div>
                      )}

                      <div style={{ marginTop: "15px" }}>
                        <InfoLabel
                          style={{ display: "block", marginBottom: "8px" }}
                        >
                          Remarks:
                        </InfoLabel>
                        <InfoValue>
                          {remarks?.trim() ||
                            "Both Eyes: Normal Vision. Review after 6 months or 1 year."}
                        </InfoValue>
                      </div>

                      <div
                        style={{
                          marginTop: "15px",
                          fontSize: "12px",
                          fontStyle: "italic",
                          color: "#666",
                        }}
                      >
                        This spectacle prescription is valid for correction,
                        only for three months from the date of consultation.
                      </div>
                    </ReportSection>
                  );
                })()}

                {/* Lab Investigations */}
                {patientDetails.testdetails?.length > 0 && (
                  <ReportSection>
                    <SectionTitle>Lab Investigations</SectionTitle>
                    <LabInvestigationsPreview
                      tests={patientDetails.testdetails}
                    />
                  </ReportSection>
                )}

                {/* Clinical Assessment */}
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

  // ── Main modal ────────────────────────────────────────────────────────────
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <Title>Investigation & Approval Status</Title>
          <Button $secondary onClick={onClose}>
            <X size={16} />
          </Button>
        </ModalHeader>

        {loading ? (
          <LoadingContainer>
            <Loader size={32} />
            <span>Loading status...</span>
          </LoadingContainer>
        ) : (
          <>
            <StatusList>
              {/* CHC Tests — indicators only, no per-test status badge */}
              {chcTests.length > 0 ? (
                chcTests.map((test) => {
                  const hasReport = !!test.has_report;
                  const hasFile = !!test.has_file;
                  const hasNotes = !!(test.notes && test.notes.trim());
                  return (
                    <StatusItem key={test.test_id}>
                      <StatusInfo>
                        <StatusLabel>{test.testname}</StatusLabel>
                        <IndicatorsRow>
                          <IndicatorChip $ok={hasReport}>
                            {hasReport ? <TickIcon /> : <CrossIcon />} Report
                          </IndicatorChip>
                          <IndicatorChip $ok={hasFile}>
                            {hasFile ? <TickIcon /> : <CrossIcon />} File
                          </IndicatorChip>
                          <IndicatorChip $ok={hasNotes}>
                            {hasNotes ? <TickIcon /> : <CrossIcon />} Notes
                          </IndicatorChip>
                          {/* ← no Approved/Pending badge per test */}
                        </IndicatorsRow>
                      </StatusInfo>
                    </StatusItem>
                  );
                })
              ) : (
                <StatusItem>
                  <StatusInfo>
                    <StatusLabel style={{ color: "#999", fontStyle: "italic" }}>
                      No CHC tests found
                    </StatusLabel>
                  </StatusInfo>
                </StatusItem>
              )}

              {/* CHC Approval — from investigation.status */}
              <StatusItem
                style={{
                  background:
                    chcInvestigationStatus === "approved"
                      ? "#f0fff4"
                      : "#fff5f5",
                  border: `1px solid ${chcInvestigationStatus === "approved" ? "#9ae6b4" : "#feb2b2"}`,
                }}
              >
                <StatusInfo>
                  <StatusLabel
                    style={{
                      color:
                        chcInvestigationStatus === "approved"
                          ? "#276749"
                          : "#c53030",
                    }}
                  >
                    CHC Approval
                  </StatusLabel>
                  {chcInvestigationStatus === "approved" ? (
                    <ApprovedBadge>✓ Approved</ApprovedBadge>
                  ) : (
                    <PendingBadge>⏳ Pending</PendingBadge>
                  )}
                </StatusInfo>
              </StatusItem>

              {/* Lab Investigations */}
              <StatusItem
                style={{
                  background:
                    labApprovalStatus === "approved" ? "#f0fff4" : "#fff5f5",
                  border: `1px solid ${labApprovalStatus === "approved" ? "#9ae6b4" : "#feb2b2"}`,
                }}
              >
                <StatusInfo>
                  <StatusLabel
                    style={{
                      color:
                        labApprovalStatus === "approved"
                          ? "#276749"
                          : "#c53030",
                    }}
                  >
                    Lab Investigations
                  </StatusLabel>
                  {labApprovalStatus === "approved" ? (
                    <ApprovedBadge>✓ Approved</ApprovedBadge>
                  ) : (
                    <PendingBadge>⏳ Pending</PendingBadge>
                  )}
                </StatusInfo>
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
