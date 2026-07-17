"use client";

import { useEffect, useState, useMemo } from "react";
import ReactDOM from "react-dom";
import { format } from "date-fns";
import Modal from "react-modal";
import "react-datepicker/dist/react-datepicker.css";
import CHCApproval from "../CHCApproval";
import { exportToExcel } from "../../../utils/xlsxUtils";
import { Printer, X, List, Download } from "lucide-react";
import { IoIosFemale, IoIosMale, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import apiRequest from "../../Auth/apiRequest";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import {
  GlobalStyle,
  Container,
  Card,
  CardHeader,
  Title,
  FiltersContainer,
  FilterRow,
  FilterGroup,
  FilterLabel,
  FilterInput,
  FilterSelect,
  ButtonContainer,
  ClearButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  NoData,
  Badge,
  ActionContainer,
  ActionButton,
  GenderIcon,
  ExportButton,
  OverallPrintButton,
  InvestigationStatusDisplay,
  StyledCheckbox,
  SelectionBar,
  StatsGrid,
  StatCard,
  StatLabel,
  StatDot,
  StatValue,
  StatSub,
  ManualNameList,
  ManualNameRow,
  ManualNameCount,
  PrintDropdown,
  PortalDropdownMenu,
  DropdownItem,
} from "./styles";
import {
  pLimit,
  isPrintAndMailEnabled,
  getBadgeColor,
  hasPendingInvestigations,
  getPendingInvestigations,
  mergeInvestigationData,
} from "./helpers";
import {
  fetchInvestigationFile,
  preProcessInvestigationFiles,
  buildPdfDocument,
} from "./pdfBuilder";
import useCHCReportData from "./useCHCReportData";

// ─── Component ────────────────────────────────────────────────────────────────
const CHCReport = () => {
  const {
    patients,
    statuses,
    investigationStatuses,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loading,
    setLoading,
    error,
    handleApprovalSaved,
    Labbaseurl,
  } = useCHCReportData();

  const [activeDropdownPatientId, setActiveDropdownPatientId] = useState(null);
  const [activeDropdownType, setActiveDropdownType] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [barcode, setBarcode] = useState("");
  const [refBy, setRefBy] = useState("");
  const [patientId, setPatientId] = useState("");
  const [IPNumber, setIPNumber] = useState("");
  const [patientName, setPatientName] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [investigationStatusFilter, setInvestigationStatusFilter] =
    useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [selectedBarcodes, setSelectedBarcodes] = useState(new Set());
  const navigate = useNavigate();
  const location = useLocation();

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const showDropdown = (id, type, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 4,
      left: rect.right - 200,
    });
    setActiveDropdownPatientId(id);
    setActiveDropdownType(type);
  };

  const hideDropdown = () => {
    setActiveDropdownPatientId(null);
    setActiveDropdownType(null);
  };

  const branchNames = useMemo(() => {
    const names = patients.map((p) => p.branch_name).filter(Boolean);
    return [...new Set(names)].sort();
  }, [patients]);

  // Expensive filter over the (potentially large) patient list — recomputed
  // only when one of these inputs actually changes, instead of on every
  // render, and without the extra state + effect round-trip render.
  const filteredPatients = useMemo(() => {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    return patients.filter((patient) => {
      const patientDate = new Date(patient.date);
      const patientStatus = statuses[patient.patient_id]?.status || "";
      const hasPending = hasPendingInvestigations(
        investigationStatuses,
        patient.barcode,
      );
      return (
        patientDate >= startOfDay &&
        patientDate <= endOfDay &&
        (!refBy || patient.refby === refBy) &&
        (!patientId || patient.patient_id.includes(patientId)) &&
        (!IPNumber || patient.ipnumber?.includes(IPNumber)) &&
        (!barcode ||
          patient.barcode?.toLowerCase().includes(barcode.toLowerCase())) &&
        (!patientName ||
          patient.patient_name
            ?.toLowerCase()
            .includes(patientName.toLowerCase())) &&
        (!branchFilter || patient.branch_name === branchFilter) &&
        (!statusFilter || patientStatus === statusFilter) &&
        (!investigationStatusFilter ||
          (investigationStatusFilter === "Pending" && hasPending) ||
          (investigationStatusFilter === "All Approved" && !hasPending))
      );
    });
  }, [
    startDate,
    endDate,
    patients,
    refBy,
    patientId,
    barcode,
    IPNumber,
    patientName,
    branchFilter,
    statusFilter,
    investigationStatusFilter,
    statuses,
    investigationStatuses,
  ]);

  const approvalCounts = useMemo(() => {
    let auto = 0;
    const manualByName = {}; // { "Dr. X": 3, "Dr. Y": 1 }

    filteredPatients.forEach((p) => {
      if (p.approval_type === "auto") {
        auto++;
      } else if (p.approval_type === "manual") {
        const name = p.approved_by_name || "Unknown";
        manualByName[name] = (manualByName[name] || 0) + 1;
      }
    });

    const manualTotal = Object.values(manualByName).reduce((s, n) => s + n, 0);
    return { auto, manualByName, manualTotal, total: auto + manualTotal };
  }, [filteredPatients]);

  // Reset the selected-barcode set whenever the filtered result set would
  // change, preserving prior behavior where filtering and the selection
  // reset happened together.
  useEffect(() => {
    setSelectedBarcodes(new Set());
  }, [
    startDate,
    endDate,
    patients,
    refBy,
    patientId,
    barcode,
    IPNumber,
    patientName,
    branchFilter,
    statusFilter,
    investigationStatusFilter,
    statuses,
    investigationStatuses,
  ]);

  const clearFilters = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setBarcode("");
    setRefBy("");
    setPatientId("");
    setIPNumber("");
    setPatientName("");
    setBranchFilter("");
    setStatusFilter("");
    setInvestigationStatusFilter("");
  };

  // ─── handlePrint (single patient — unchanged logic) ───────────────────────
  const handlePrint = async (patient, withLetterpad = true) => {
    try {
      setLoading(true);
      const response = await apiRequest(
        `${Labbaseurl}corporate_health_report/?barcode=${patient.barcode}`,
        "GET",
      );
      if (!response.success) {
        toast.error(response.error || "Failed to fetch patient details");
        setLoading(false);
        return null;
      }
      let patientDetails,
        signaturesData = [];
      if (response.data.patient_data && response.data.signatures) {
        patientDetails = response.data.patient_data;
        signaturesData = response.data.signatures;
      } else {
        patientDetails = response.data;
      }
      if (Array.isArray(patientDetails)) {
        patientDetails = {
          ...patientDetails[0],
          testdetails: patientDetails.flatMap((r) => r.testdetails || []),
        };
      }
      const invResult = await apiRequest(
        `${Labbaseurl}get_investigation_status/?barcode=${patient.barcode}`,
        "GET",
      );
      if (invResult.success && invResult.data)
        patientDetails = mergeInvestigationData(patientDetails, invResult.data);

      const chcTestsForFiles =
        invResult.success && invResult.data?.chc_tests?.length > 0
          ? invResult.data.chc_tests
          : investigationStatuses[patient.barcode]?.chc_tests || [];

      const investigationFiles = {};
      await Promise.all(
        chcTestsForFiles.map(async (test) => {
          investigationFiles[test.test_id] = {
            label: test.testname,
            report: test.report?.trim() || "",
            notes: test.notes?.trim() || "",
            files: [],
          };
          if (test.files?.length > 0) {
            const testFiles = await Promise.all(
              test.files.map((fileId) => fetchInvestigationFile(fileId)),
            );
            investigationFiles[test.test_id].files = testFiles.filter(Boolean);
          }
        }),
      );
      patientDetails.investigation_files = investigationFiles;
      patientDetails.chc_tests_for_files = chcTestsForFiles;
      patientDetails.test_names = patient.test_names;

      const designationMapping = {
        DESIG101: { position: 0, title: "Consultant Microbiologist" },
        DESIG100: { position: 1, title: "Consultant Pathologist" },
        DESIG099: { position: 2, title: "Consultant Biochemist" },
      };
      const consultants = [null, null, null];
      signaturesData.forEach((sig) => {
        const mapping = designationMapping[sig.designation];
        if (mapping)
          consultants[mapping.position] = [
            sig.employeeName,
            mapping.title,
            sig.signatureBase64
              ? `data:image/png;base64,${sig.signatureBase64}`
              : null,
          ];
      });
      const activeConsultants = consultants.filter((c) => c !== null);

      // Single print: no preProcessedFiles — converts on the fly
      const doc = await buildPdfDocument(
        patientDetails,
        activeConsultants,
        withLetterpad,
      );
      const patientID = patientDetails.patient_id || "Unknown";
      const pdfFileName = `MedicalReport_${patientID}_${patientDetails.patientname.replace(/\s+/g, "_")}.pdf`;
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = pdfFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
      setLoading(false);
      toast.success("Medical report generated successfully!");
      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("An unexpected error occurred while generating the PDF");
      setLoading(false);
      return null;
    }
  };

  // ─── handleOverallPrint (OPTIMIZED) ───────────────────────────────────────
  const handleOverallPrint = async (withLetterpad = true) => {
    // Use selected patients if any checkboxes are ticked, otherwise fall back to all filtered
    const patientsToPrint =
      selectedPrintCount > 0 ? printTargetPatients : filteredPatients;

    if (!patientsToPrint.length) {
      toast.error("No patients to print");
      return;
    }
    if (patientsToPrint.length > 100) {
      toast.warning("Please select ≤100 patients at a time.");
      return;
    }
    if (patientsToPrint.length > 20)
      toast.warning("Large number of records. This may take a while...");

    setLoading(true);

    try {
      const allBarcodes = patientsToPrint.map((p) => p.barcode).filter(Boolean);
      if (!allBarcodes.length) {
        toast.error("No valid barcodes found");
        setLoading(false);
        return;
      }

      // ── PHASE 1: Batch fetch report data (1 API call) ─────────────────────
      toast.info(`Fetching report data for ${allBarcodes.length} patients...`);
      let allPatientData = {};
      try {
        const result = await apiRequest(
          `${Labbaseurl}get_batch_corporate_health_reports/`,
          "POST",
          { barcodes: allBarcodes },
          { "Content-Type": "application/json" },
        );
        if (result.success) allPatientData = result.data.results || {};
        else toast.error("Batch fetch failed: " + result.error);
      } catch (err) {
        toast.error("Batch fetch error: " + err.message);
      }

      const validBarcodes = allBarcodes.filter(
        (bc) => allPatientData[bc] && !allPatientData[bc].error,
      );
      if (!validBarcodes.length) {
        toast.error("No valid patient data found");
        setLoading(false);
        return;
      }

      // ── PHASE 2: Batch fetch ALL investigation statuses (1 API call) ──────
      toast.info(`Fetching investigation data...`);
      let batchInvResults = {};
      try {
        const invRes = await apiRequest(
          `${Labbaseurl}get_batch_investigation_status/`,
          "POST",
          { barcodes: validBarcodes },
          { "Content-Type": "application/json" },
        );
        if (invRes.success) batchInvResults = invRes.data.results || {};
      } catch (e) {
        console.warn("Batch inv status failed:", e);
      }

      // ── PHASE 3: Fetch files + pre-convert PDFs to images IN PARALLEL ─────
      toast.info(`Fetching & converting files...`);
      const limit6 = pLimit(6);
      const fileDataMap = {};
      let filesDone = 0;

      await Promise.all(
        validBarcodes.map((bc) =>
          limit6(async () => {
            const invResult = batchInvResults[bc] || {};
            const chcTestsForFiles =
              invResult.chc_tests?.length > 0
                ? invResult.chc_tests
                : investigationStatuses[bc]?.chc_tests || [];

            // Fetch raw files for this barcode
            const investigationFiles = {};
            await Promise.all(
              chcTestsForFiles.map(async (test) => {
                investigationFiles[test.test_id] = {
                  label: test.testname,
                  report: test.report?.trim() || "",
                  notes: test.notes?.trim() || "",
                  files: [],
                };
                if (test.files?.length > 0) {
                  const fetched = await Promise.all(
                    test.files.map((fid) => fetchInvestigationFile(fid)),
                  );
                  investigationFiles[test.test_id].files =
                    fetched.filter(Boolean);
                }
              }),
            );

            // Pre-convert PDF pages → images (parallel within each barcode)
            const preProc = await preProcessInvestigationFiles(
              investigationFiles,
              chcTestsForFiles,
            );
            preProc._raw = investigationFiles;
            preProc._chcTests = chcTestsForFiles;
            fileDataMap[bc] = preProc;

            filesDone++;
            if (filesDone % 5 === 0 || filesDone === validBarcodes.length)
              toast.info(`Files ready: ${filesDone} / ${validBarcodes.length}`);
          }),
        ),
      );

      // ── PHASE 4: Build patientDetails objects ─────────────────────────────
      const designationMapping = {
        DESIG101: { position: 0, title: "Consultant Microbiologist" },
        DESIG100: { position: 1, title: "Consultant Pathologist" },
        DESIG099: { position: 2, title: "Consultant Biochemist" },
      };

      const patientDataList = validBarcodes.map((bc) => {
        const barcodeData = allPatientData[bc];
        const invResult = batchInvResults[bc] || {};
        let patientDetails = barcodeData.patient_data ?? barcodeData;
        const signaturesData = barcodeData.signatures ?? [];

        if (Object.keys(invResult).length) {
          patientDetails = mergeInvestigationData(patientDetails, {
            chc_tests: invResult.chc_tests || [],
            vitals: invResult.vitals || {},
            patient_history: invResult.patient_history || "",
          });
        }

        const fdEntry = fileDataMap[bc] || {};
        const matchingPatient = patientsToPrint.find((p) => p.barcode === bc);
        if (matchingPatient) {
          patientDetails.test_names = matchingPatient.test_names;
        }
        patientDetails.investigation_files = fdEntry._raw || {};
        patientDetails.chc_tests_for_files = fdEntry._chcTests || [];

        const consultants = [null, null, null];
        signaturesData.forEach((sig) => {
          const m = designationMapping[sig.designation];
          if (m)
            consultants[m.position] = [
              sig.employeeName,
              m.title,
              sig.signatureBase64
                ? `data:image/png;base64,${sig.signatureBase64}`
                : null,
            ];
        });

        return {
          patientDetails,
          activeConsultants: consultants.filter(Boolean),
          preProcessedFiles: fdEntry,
        };
      });

      // ── PHASE 5: Generate PDFs — 3 at a time ─────────────────────────────
      toast.info(`Generating ${patientDataList.length} PDFs...`);
      const zip = new JSZip();
      let successCount = 0,
        failCount = 0,
        completed = 0;
      const limit3 = pLimit(3);

      await Promise.all(
        patientDataList.map(
          ({ patientDetails, activeConsultants, preProcessedFiles }) =>
            limit3(async () => {
              try {
                const doc = await buildPdfDocument(
                  patientDetails,
                  activeConsultants,
                  withLetterpad,
                  preProcessedFiles,
                );
                const pdfBlob = doc.output("blob");
                const safeName = (
                  patientDetails.patientname || "Unknown"
                ).replace(/\s+/g, "_");
                zip.file(
                  `${patientDetails.patient_id}_${safeName}.pdf`,
                  pdfBlob,
                );
                successCount++;
              } catch (err) {
                failCount++;
                console.error(
                  `PDF failed for ${patientDetails.patient_id}:`,
                  err,
                );
              } finally {
                completed++;
                if (completed % 3 === 0 || completed === patientDataList.length)
                  toast.info(`PDFs: ${completed} / ${patientDataList.length}`);
              }
            }),
        ),
      );

      // ── PHASE 6: Create ZIP and download ──────────────────────────────────
      if (successCount > 0) {
        toast.info("Creating ZIP...");
        const zipBlob = await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 3 },
        });
        saveAs(
          zipBlob,
          `CHC_Reports_${format(startDate, "yyyy-MM-dd")}_to_${format(endDate, "yyyy-MM-dd")}.zip`,
        );
        toast.success(
          `✅ ${successCount} reports downloaded!${failCount ? ` (${failCount} failed)` : ""}`,
        );
        clearSelection(); // reset checkboxes after successful download
      } else {
        toast.error("No PDFs could be generated.");
      }
    } catch (err) {
      console.error("Overall print error:", err);
      toast.error("Failed: " + (err.message || "Unknown error"));
    }

    setLoading(false);
  };

  // ─── Excel export ─────────────────────────────────────────────────────────
  const handleExportToExcel = async () => {
    try {
      setLoading(true);
      const barcodes = filteredPatients.map((p) => p.barcode).filter(Boolean);
      if (!barcodes.length) {
        toast.error("No patients with barcodes found");
        setLoading(false);
        return;
      }
      const excelData = filteredPatients.map((patient) => {
        const bc = patient.barcode;
        const invData = investigationStatuses[bc] || {};
        const chcTests = invData.chc_tests || {};
        const chcTestColumns = {};
        chcTests.forEach &&
          chcTests.forEach((test) => {
            const collected = test.has_file || test.has_report;
            chcTestColumns[`${test.testname} - Collection`] = collected
              ? "Collected"
              : "Pending";
            chcTestColumns[`${test.testname} - Approval`] =
              test.status?.toLowerCase() === "approved"
                ? "Approved"
                : "Pending";
          });
        return {
          Date: patient.date
            ? format(new Date(patient.date), "yyyy-MM-dd")
            : "N/A",
          "Employee ID": patient.patient_id || "N/A",
          Barcode: bc || "N/A",
          "Employee Name": patient.patient_name || "N/A",
          Gender: patient.gender || "N/A",
          Age: patient.age || "N/A",
          Branch: patient.branch || "N/A",
          "Test Names": patient.test_names || "N/A",
          "No of Tests": patient.no_of_tests || 0,
          "Overall Status": patient.status || "N/A",
          ...chcTestColumns,
          "Lab Approval": invData.lab_approval || "N/A",
        };
      });
      const colWidths = Object.keys(excelData[0] || {}).map(() => ({
        wch: 18,
      }));
      exportToExcel(
        excelData,
        `CHC_Report_${format(startDate, "yyyy-MM-dd")}_to_${format(endDate, "yyyy-MM-dd")}.xlsx`,
        { sheetName: "CHC Report", colWidths },
      );
      setLoading(false);
      toast.success(`Excel report exported! (${excelData.length} records)`);
    } catch (error) {
      toast.error(
        "Failed to export Excel: " + (error.message || "Unknown error"),
      );
      setLoading(false);
    }
  };

  // ─── Checkbox selection helpers ───────────────────────────────────────────
  const approvedFilteredPatients = useMemo(
    () =>
      filteredPatients.filter((p) =>
        isPrintAndMailEnabled(statuses[p.patient_id]?.status || ""),
      ),
    [filteredPatients, statuses],
  );

  const isAllSelected = useMemo(
    () =>
      approvedFilteredPatients.length > 0 &&
      approvedFilteredPatients.every((p) => selectedBarcodes.has(p.barcode)),
    [approvedFilteredPatients, selectedBarcodes],
  );

  const isIndeterminate = useMemo(
    () =>
      !isAllSelected &&
      approvedFilteredPatients.some((p) => selectedBarcodes.has(p.barcode)),
    [isAllSelected, approvedFilteredPatients, selectedBarcodes],
  );

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all approved rows
      setSelectedBarcodes((prev) => {
        const next = new Set(prev);
        approvedFilteredPatients.forEach((p) => next.delete(p.barcode));
        return next;
      });
    } else {
      // Select all approved rows
      setSelectedBarcodes((prev) => {
        const next = new Set(prev);
        approvedFilteredPatients.forEach((p) => {
          if (p.barcode) next.add(p.barcode);
        });
        return next;
      });
    }
  };

  const toggleSelectOne = (barcode) => {
    setSelectedBarcodes((prev) => {
      const next = new Set(prev);
      next.has(barcode) ? next.delete(barcode) : next.add(barcode);
      return next;
    });
  };

  const clearSelection = () => setSelectedBarcodes(new Set());

  // ─── UI helpers ───────────────────────────────────────────────────────────
  const openModal = (patient) => {
    setSelectedPatient(patient);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPatient(null);
  };
  const openTestModal = (patient) => {
    setSelectedPatient(patient);
    setIsTestModalOpen(true);
  };
  const allPatientsApproved = useMemo(
    () =>
      filteredPatients.length > 0 &&
      filteredPatients.every(
        (p) => (statuses[p.patient_id]?.status || "") === "Approved",
      ),
    [filteredPatients, statuses],
  );

  // Patients to print: selected ones if any are checked, else all filtered approved
  const selectedPrintCount = selectedBarcodes.size;
  const printTargetPatients = useMemo(
    () =>
      selectedPrintCount > 0
        ? filteredPatients.filter((p) => selectedBarcodes.has(p.barcode))
        : filteredPatients,
    [selectedPrintCount, filteredPatients, selectedBarcodes],
  );

  const canOverallPrint = useMemo(
    () =>
      !loading &&
      (selectedPrintCount > 0
        ? printTargetPatients.every((p) =>
          isPrintAndMailEnabled(statuses[p.patient_id]?.status || ""),
        )
        : allPatientsApproved),
    [loading, selectedPrintCount, printTargetPatients, allPatientsApproved, statuses],
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Container>
      <GlobalStyle />
      <Card>
        <CardHeader>
          <Title>Corporate Health Checkup - Approval Report</Title>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <PrintDropdown
              onMouseEnter={(e) =>
                canOverallPrint &&
                showDropdown("overall", "overallPrint", e)
              }
              onMouseLeave={hideDropdown}
            >
              <OverallPrintButton
                disabled={!canOverallPrint}
                title={
                  selectedPrintCount > 0
                    ? `Print ${selectedPrintCount} selected report(s)`
                    : "Download all filtered approved reports as ZIP"
                }
              >
                <Download size={16} />
                {selectedPrintCount > 0
                  ? `Print Selected (${selectedPrintCount})`
                  : `Overall Print (${filteredPatients.length})`}
              </OverallPrintButton>
            </PrintDropdown>
            <ExportButton
              onClick={handleExportToExcel}
              disabled={loading || filteredPatients.length === 0}
            >
              <Download size={16} /> Export to Excel
            </ExportButton>
          </div>
        </CardHeader>

        <FiltersContainer>
          <FilterRow>
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
              <FilterLabel>Employee ID</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter Employee ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Barcode</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter Barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Employee Name</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter employee name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Branch Name</FilterLabel>
              <FilterSelect
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
              >
                <option value="">All Branches</option>
                {branchNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Approval Status</FilterLabel>
              <FilterSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Investigation Status</FilterLabel>
              <FilterSelect
                value={investigationStatusFilter}
                onChange={(e) => setInvestigationStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="All Approved">All Approved</option>
                <option value="Pending">Pending</option>
              </FilterSelect>
            </FilterGroup>
          </FilterRow>
          <ButtonContainer>
            <ClearButton onClick={clearFilters}>
              <X size={16} /> Clear Filters
            </ClearButton>
          </ButtonContainer>
        </FiltersContainer>
        <StatsGrid>
          <StatCard>
            <StatLabel>
              <StatDot color="#4cc9f0" />
              Auto approvals
            </StatLabel>
            <StatValue color="#0891b2">{approvalCounts.auto}</StatValue>
            <StatSub>All criteria met automatically</StatSub>
          </StatCard>

          <StatCard>
            <StatLabel>
              <StatDot color="#4361ee" />
              Manual approvals
            </StatLabel>
            <StatValue color="#3730a3">{approvalCounts.manualTotal}</StatValue>
            <StatSub>Approved via overall approval</StatSub>
            {Object.keys(approvalCounts.manualByName).length > 0 && (
              <ManualNameList>
                {Object.entries(approvalCounts.manualByName)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, count]) => (
                    <ManualNameRow key={name}>
                      <span>{name}</span>
                      <ManualNameCount>{count}</ManualNameCount>
                    </ManualNameRow>
                  ))}
              </ManualNameList>
            )}
          </StatCard>

          <StatCard>
            <StatLabel>
              <StatDot color="#6c757d" />
              Total approved
            </StatLabel>
            <StatValue>{approvalCounts.total}</StatValue>
            <StatSub>Out of {filteredPatients.length} filtered records</StatSub>
          </StatCard>

          <StatCard>
            <StatLabel>
              <StatDot color="#f72585" />
              Pending
            </StatLabel>
            <StatValue color="#be123c">
              {filteredPatients.length - approvalCounts.total}
            </StatValue>
            <StatSub>Awaiting approval</StatSub>
          </StatCard>
        </StatsGrid>

        {selectedBarcodes.size > 0 && (
          <SelectionBar>
            <span>
              ✓ {selectedBarcodes.size} row
              {selectedBarcodes.size !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={clearSelection}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                cursor: "pointer",
                fontSize: "0.8rem",
                textDecoration: "underline",
              }}
            >
              Clear selection
            </button>
          </SelectionBar>
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <th style={{ width: "40px", textAlign: "center" }}>
                  <StyledCheckbox
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={toggleSelectAll}
                    title={
                      isAllSelected ? "Deselect all" : "Select all approved"
                    }
                  />
                </th>
                <th>Date</th>
                <th>Employee ID</th>
                <th>Barcode</th>
                <th>Employee Name</th>
                <th>Company Name</th>
                <th>CHC Investigation Status</th>
                <th>Approval Status</th>
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
                  const bc = patientStatus.barcode || "N/A";
                  const isPrintMailEnabled = isPrintAndMailEnabled(status);
                  const badgeColor = getBadgeColor(status);
                  const isChecked = selectedBarcodes.has(patient.barcode);
                  return (
                    <tr
                      key={patient.patient_id}
                      style={
                        isChecked
                          ? { backgroundColor: "rgba(67,97,238,0.07)" }
                          : {}
                      }
                    >
                      <td style={{ textAlign: "center" }}>
                        <StyledCheckbox
                          checked={isChecked}
                          disabled={!isPrintMailEnabled}
                          onChange={() =>
                            isPrintMailEnabled &&
                            toggleSelectOne(patient.barcode)
                          }
                          title={
                            !isPrintMailEnabled
                              ? "Only approved patients can be selected"
                              : ""
                          }
                        />
                      </td>
                      <td>
                        {patient.date
                          ? format(new Date(patient.date), "yyyy-MM-dd")
                          : "N/A"}
                      </td>
                      <td>{patient.patient_id}</td>
                      <td>{bc}</td>
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
                      <td>{patient.branch_name}</td>
                      <td>
                        <InvestigationStatusDisplay>
                          {getPendingInvestigations(
                            investigationStatuses[patient.barcode],
                          )}
                        </InvestigationStatusDisplay>
                      </td>
                      <td>
                        <Badge color={badgeColor}>{status}</Badge>
                      </td>
                      <td>
                        <ActionContainer>
                          <ActionButton
                            onClick={() => openTestModal(patient)}
                            disabled={status === "Approved"}
                            title="Sort Tests"
                          >
                            <List size={16} />
                          </ActionButton>
                          <PrintDropdown
                            onMouseEnter={(e) =>
                              isPrintMailEnabled &&
                              showDropdown(patient.barcode, "print", e)
                            }
                            onMouseLeave={hideDropdown}
                          >
                            <ActionButton
                              disabled={!isPrintMailEnabled}
                              title="Print Options"
                            >
                              <Printer size={16} />
                            </ActionButton>
                          </PrintDropdown>
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

        <div
          style={{
            padding: "1rem 1.5rem",
            textAlign: "right",
            color: "var(--gray)",
            fontSize: "0.875rem",
            borderTop: "1px solid var(--gray-light)",
          }}
        >
          Showing {filteredPatients.length}{" "}
          {filteredPatients.length === 1 ? "entry" : "entries"}
        </div>
      </Card>

      {isTestModalOpen && (
        <CHCApproval
          patient={selectedPatient}
          onClose={() => setIsTestModalOpen(false)}
          onApprovalSaved={handleApprovalSaved}
        />
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
          content: {
            width: "800px",
            height: "fit-content",
            position: "absolute",
            left: "400px",
            right: "auto",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            overflowY: "auto",
          },
        }}
      >
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
        {selectedPatient && (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          />
        )}
      </Modal>

      {activeDropdownPatientId &&
        activeDropdownType === "print" &&
        ReactDOM.createPortal(
          <PortalDropdownMenu
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onMouseEnter={() => {
              setActiveDropdownPatientId(activeDropdownPatientId);
              setActiveDropdownType(activeDropdownType);
            }}
            onMouseLeave={hideDropdown}
          >
            <DropdownItem
              onClick={() => {
                const p = patients.find((pat) => pat.barcode === activeDropdownPatientId);
                if (p) handlePrint(p, true);
                hideDropdown();
              }}
            >
              Print with Letterpad
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                const p = patients.find((pat) => pat.barcode === activeDropdownPatientId);
                if (p) handlePrint(p, false);
                hideDropdown();
              }}
            >
              Print without Letterpad
            </DropdownItem>
          </PortalDropdownMenu>,
          document.body,
        )}

      {activeDropdownPatientId === "overall" &&
        activeDropdownType === "overallPrint" &&
        ReactDOM.createPortal(
          <PortalDropdownMenu
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onMouseEnter={() => {
              setActiveDropdownPatientId("overall");
              setActiveDropdownType("overallPrint");
            }}
            onMouseLeave={hideDropdown}
          >
            <DropdownItem
              onClick={() => {
                handleOverallPrint(true);
                hideDropdown();
              }}
            >
              {selectedPrintCount > 0 ? "Print Selected with Letterpad" : "Print with Letterpad"}
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                handleOverallPrint(false);
                hideDropdown();
              }}
            >
              {selectedPrintCount > 0 ? "Print Selected without Letterpad" : "Print without Letterpad"}
            </DropdownItem>
          </PortalDropdownMenu>,
          document.body,
        )}
    </Container>
  );
};

export default CHCReport;
