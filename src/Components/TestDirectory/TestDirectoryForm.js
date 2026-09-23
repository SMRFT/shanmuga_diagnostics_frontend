import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  FaVial,
  FaFileMedical,
  FaUpload,
  FaTimes,
  FaCheckCircle,
  FaListAlt,
  FaClock,
  FaFlask,
  FaMicroscope,
  FaNotesMedical,
  FaBuilding,
  FaSave,
  FaUndo,
  FaFilePdf,
  FaFileImage,
  FaArrowRight,
  FaBookMedical,
  FaSearch,
  FaDatabase,
  FaSpinner,
  FaCaretDown,
  FaCheck,
  FaBolt,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  createTestDirectoryEntry,
  updateTestDirectoryEntry,
  getTestDirectoryDetail,
  getCoreTestOptions,
} from "./api";
import "./TestDirectory.css";

// Standard Master Presets
const POPULAR_TESTS = [
  { name: "Complete Blood Count (CBC)", dept: "Hematology", spec: "EDTA Whole Blood", unit: "cells/cu.mm", tat: "2 Hours", method: "Automated 5-Part Hematology Analyzer", purpose: "Evaluates overall health and detects anemia, infections, leukemia, and clotting disorders.", ref: "WBC: 4,000 - 11,000 /cu.mm\nRBC: 4.5 - 5.5 mill/cu.mm\nHb: 13.0 - 17.0 g/dL\nPlatelets: 1.5 - 4.5 Lakhs/cu.mm" },
  { name: "Lipid Profile", dept: "Biochemistry", spec: "Serum", unit: "mg/dL", tat: "4 Hours", method: "Enzymatic Colorimetric / Spectrophotometry", purpose: "Assesses risk of cardiovascular disease, coronary artery disease, and stroke.", ref: "Total Cholesterol: < 200 mg/dL\nTriglycerides: < 150 mg/dL\nHDL (Good): > 40 mg/dL\nLDL (Bad): < 100 mg/dL" },
  { name: "Thyroid Profile (T3, T4, TSH)", dept: "Biochemistry", spec: "Serum", unit: "µIU/mL", tat: "Same Day (6 PM)", method: "Chemiluminescence Immunoassay (CLIA)", purpose: "Evaluates thyroid gland function to detect hypothyroidism and hyperthyroidism.", ref: "Total T3: 0.8 - 2.0 ng/mL\nTotal T4: 5.1 - 14.1 µg/dL\nTSH: 0.27 - 4.2 µIU/mL" },
  { name: "HbA1c (Glycated Hemoglobin)", dept: "Biochemistry", spec: "EDTA Whole Blood", unit: "%", tat: "2 Hours", method: "High Performance Liquid Chromatography (HPLC)", purpose: "Measures 3-month average blood glucose level for diabetes diagnosis and monitoring.", ref: "Normal: < 5.7%\nPrediabetes: 5.7% - 6.4%\nDiabetes: >= 6.5%" },
  { name: "Liver Function Test (LFT)", dept: "Biochemistry", spec: "Serum", unit: "U/L", tat: "4 Hours", method: "Automated Chemistry Analyzer", purpose: "Screens for liver damage, hepatitis, cirrhosis, and biliary obstruction.", ref: "Bilirubin Total: 0.2 - 1.2 mg/dL\nSGOT (AST): 5 - 40 U/L\nSGPT (ALT): 5 - 45 U/L\nAlkaline Phosphatase: 30 - 120 U/L" },
  { name: "Serum Creatinine & Urea", dept: "Biochemistry", spec: "Serum", unit: "mg/dL", tat: "2 Hours", method: "Modified Jaffe's Kinetic Method", purpose: "Evaluates renal (kidney) filtration capacity and detects kidney dysfunction.", ref: "Serum Creatinine: 0.6 - 1.2 mg/dL\nBlood Urea: 15 - 45 mg/dL" },
  { name: "Vitamin D (25-Hydroxy)", dept: "Biochemistry", spec: "Serum", unit: "ng/mL", tat: "24 Hours", method: "CLIA", purpose: "Determines bone density risk, calcium absorption, and immune health.", ref: "Deficiency: < 20 ng/mL\nInsufficiency: 20 - 30 ng/mL\nSufficiency: 30 - 100 ng/mL" },
  { name: "Urine Routine & Microscopy", dept: "Clinical Pathology", spec: "Spot Urine", unit: "/HPF", tat: "2 Hours", method: "Automated Urine Strips & Light Microscopy", purpose: "Detects urinary tract infections (UTI), kidney disease, and diabetes.", ref: "Color: Pale Yellow\nProtein: Nil\nSugar: Nil\nPus Cells: 0 - 5 /HPF\nRBCs: Nil" },
];

const DEPARTMENTS = [
  "Biochemistry",
  "Hematology",
  "Immunology & Serology",
  "Microbiology",
  "Clinical Pathology",
  "Molecular Biology",
  "Histopathology",
  "Endocrinology",
  "Cytology",
  "General",
];

const SPECIMEN_TYPES = [
  "EDTA Whole Blood",
  "Serum",
  "Fluoride Plasma",
  "Heparin Plasma",
  "Spot Urine",
  "24-Hour Urine",
  "Stool",
  "Sputum",
  "Nasopharyngeal Swab",
  "Throat Swab",
  "Cerebrospinal Fluid (CSF)",
  "Synovial Fluid",
  "Pleural Fluid",
  "Tissue Biopsy",
];

const UNITS = [
  "mg/dL",
  "g/dL",
  "%",
  "pg/mL",
  "ng/mL",
  "µg/dL",
  "µIU/mL",
  "IU/L",
  "U/L",
  "mmol/L",
  "cells/cu.mm",
  "/HPF",
  "Index / Ratio",
  "Positive / Negative",
];

const METHODS = [
  "Fully Automated 5-Part Cell Counter",
  "Chemiluminescence Immunoassay (CLIA)",
  "Enzyme-Linked Immunosorbent Assay (ELISA)",
  "High Performance Liquid Chromatography (HPLC)",
  "Spectrophotometry / Photometry",
  "Nephelometry",
  "Real-Time Polymerase Chain Reaction (RT-PCR)",
  "Direct Light Microscopy",
  "Electrophoresis",
  "Ion Selective Electrode (ISE)",
];

const TAT_PRESETS = [
  "1 Hour (Stat)",
  "2 Hours",
  "4 Hours",
  "Same Day (6 PM)",
  "24 Hours",
  "48 Hours",
  "72 Hours",
  "5-7 Days",
];

export default function TestDirectoryForm() {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const editId = paramId || searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetchingTest, setFetchingTest] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Master Test selection from core_testdetails
  const [coreTests, setCoreTests] = useState([]);
  const [loadingCoreTests, setLoadingCoreTests] = useState(false);
  const [searchTestQuery, setSearchTestQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCoreTest, setSelectedCoreTest] = useState(null);
  const dropdownRef = useRef(null);

  // Form states
  const [formData, setFormData] = useState({
    test_name: "",
    test_code: "",
    department: "Biochemistry",
    specimen: "Serum",
    reference_range: "",
    unit: "mg/dL",
    method: "Chemiluminescence Immunoassay (CLIA)",
    clinical_purpose: "",
    turnaround_time: "4 Hours",
    patient_preparation: "No special preparation required. Random sample.",
  });

  // File Upload State
  const [sampleReportFile, setSampleReportFile] = useState(null);
  const [existingFileName, setExistingFileName] = useState("");
  const [removeExistingFile, setRemoveExistingFile] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch Master tests from core_testdetails on mount
  useEffect(() => {
    setLoadingCoreTests(true);
    getCoreTestOptions()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setCoreTests(res.data);
        }
      })
      .catch((err) => {
        console.error("Could not fetch core test details:", err);
      })
      .finally(() => {
        setLoadingCoreTests(false);
      });
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load test for edit if ID present
  useEffect(() => {
    if (editId) {
      setIsEditMode(true);
      setFetchingTest(true);
      getTestDirectoryDetail(editId)
        .then((res) => {
          if (res.success && res.data) {
            const d = res.data;
            setFormData({
              test_name: d.test_name || "",
              test_code: d.test_code || "",
              department: d.department || "Biochemistry",
              specimen: d.specimen || "Serum",
              reference_range: d.reference_range || "",
              unit: d.unit || "",
              method: d.method || "",
              clinical_purpose: d.clinical_purpose || "",
              turnaround_time: d.turnaround_time || "4 Hours",
              patient_preparation: d.patient_preparation || "",
            });
            if (d.sample_report_file_name) {
              setExistingFileName(d.sample_report_file_name);
            }
          }
        })
        .catch((err) => {
          toast.error("Failed to load test details for editing.");
        })
        .finally(() => setFetchingTest(false));
    }
  }, [editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectCoreTest = (test) => {
    setSelectedCoreTest(test);
    setSearchTestQuery(test.test_name);
    setIsDropdownOpen(false);

    // Auto populate form fields from core_testdetails
    setFormData((prev) => ({
      ...prev,
      test_name: test.test_name || prev.test_name,
      test_code: test.test_code || prev.test_code,
      department: test.department || prev.department,
      specimen: test.specimen || prev.specimen,
      unit: test.unit || prev.unit,
      method: test.method || prev.method,
      reference_range: test.reference_range || prev.reference_range,
      turnaround_time: test.turnaround_time || prev.turnaround_time,
    }));

    toast.success(`Loaded "${test.test_name}" from Master Test Directory!`);
  };

  const handleClearSelectedCoreTest = () => {
    setSelectedCoreTest(null);
    setSearchTestQuery("");
  };

  // Filtered list of core master tests from core_testdetails
  const filteredCoreTests = coreTests.filter((t) => {
    if (!searchTestQuery) return true;
    const q = searchTestQuery.toLowerCase();
    return (
      (t.test_name && t.test_name.toLowerCase().includes(q)) ||
      (t.test_code && t.test_code.toLowerCase().includes(q)) ||
      (t.department && t.department.toLowerCase().includes(q))
    );
  });

  const handleApplyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      test_name: preset.name,
      department: preset.dept,
      specimen: preset.spec,
      unit: preset.unit,
      turnaround_time: preset.tat,
      method: preset.method,
      clinical_purpose: preset.purpose,
      reference_range: preset.ref,
    }));
    toast.info(`Loaded template for "${preset.name}"`);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    // Max file size 15MB
    if (file.size > 15 * 1024 * 1024) {
      toast.warning("File is too large! Please upload a file under 15MB.");
      return;
    }
    setSampleReportFile(file);
    setRemoveExistingFile(false);
    toast.success(`Selected sample report: ${file.name}`);
  };

  const handleRemoveSelectedFile = () => {
    setSampleReportFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (isEditMode && existingFileName) {
      setRemoveExistingFile(true);
      setExistingFileName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.test_name.trim()) {
      toast.warning("Please enter the Test Name.");
      return;
    }

    setLoading(true);

    try {
      const dataPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        dataPayload.append(key, formData[key]);
      });

      if (sampleReportFile) {
        dataPayload.append("sample_report_file", sampleReportFile);
      }

      if (removeExistingFile) {
        dataPayload.append("remove_sample_report", "true");
      }

      let res;
      if (isEditMode) {
        res = await updateTestDirectoryEntry(editId, dataPayload);
        toast.success("Test details updated successfully!");
      } else {
        res = await createTestDirectoryEntry(dataPayload);
        toast.success("New test added to directory successfully!");
      }

      // Navigate to report after short pause
      setTimeout(() => {
        navigate("/TestDirectoryReport");
      }, 1200);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Error saving test. Please try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedCoreTest(null);
    setSearchTestQuery("");
    setFormData({
      test_name: "",
      test_code: "",
      department: "Biochemistry",
      specimen: "Serum",
      reference_range: "",
      unit: "mg/dL",
      method: "Chemiluminescence Immunoassay (CLIA)",
      clinical_purpose: "",
      turnaround_time: "4 Hours",
      patient_preparation: "No special preparation required. Random sample.",
    });
    setSampleReportFile(null);
    setExistingFileName("");
    setRemoveExistingFile(false);
  };

  if (fetchingTest) {
    return (
      <div className="td-wrapper">
        <div className="td-container">
          <div className="td-spinner-container">
            <div className="td-spinner" />
            <p>Loading test details for editing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="td-wrapper">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="td-container">
        {/* Navigation Bar */}
        <div className="td-nav-bar">
          <div className="td-brand">
            <div className="td-brand-icon">
              <FaBookMedical />
            </div>
            <div>
              <h1 className="td-brand-title">Shanmuga Diagnostics • Test Directory</h1>
              <p className="td-brand-subtitle">Diagnostic Master & Specimen Information</p>
            </div>
          </div>

          <div className="td-nav-tabs">
            <button
              className="td-nav-tab active"
              onClick={() => navigate("/TestDirectoryForm")}
            >
              <FaFileMedical /> {isEditMode ? "Edit Test Form" : "Add Test Form"}
            </button>
            <button
              className="td-nav-tab"
              onClick={() => navigate("/TestDirectoryReport")}
            >
              <FaListAlt /> Directory Report
            </button>
          </div>
        </div>

        {/* Master Test Dropdown Selector (from core_testdetails) */}
        {!isEditMode && (
          <div className="td-master-selector-card">
            <div className="td-master-selector-header">
              <div className="td-master-selector-title">
                <FaDatabase style={{ color: "#0284c7" }} /> Select Test from Master Directory ({coreTests.length > 0 ? `${coreTests.length} Tests` : "Loading..."})
              </div>
              <span className="td-master-badge">
                <FaBolt style={{ marginRight: "4px" }} /> Auto-fill Enabled
              </span>
            </div>

            <div className="td-search-dropdown-wrapper" ref={dropdownRef}>
              <div className="td-search-dropdown-input-row">
                <FaSearch style={{ color: "#94a3b8", marginRight: "8px" }} />
                <input
                  type="text"
                  className="td-search-dropdown-input"
                  placeholder={
                    loadingCoreTests
                      ? "Loading tests from core_testdetails..."
                      : "Search & select test from master directory (e.g. Glucose, CBC, Thyroid, Lipid, SGPT)..."
                  }
                  value={searchTestQuery}
                  onChange={(e) => {
                    setSearchTestQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  disabled={loadingCoreTests}
                />
                {loadingCoreTests && (
                  <FaSpinner className="fa-spin" style={{ color: "#0284c7", marginRight: "8px" }} />
                )}
                {searchTestQuery && (
                  <button
                    type="button"
                    className="td-search-dropdown-clear-btn"
                    onClick={handleClearSelectedCoreTest}
                    title="Clear selection"
                  >
                    <FaTimes />
                  </button>
                )}
                <button
                  type="button"
                  className="td-search-dropdown-clear-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  title="Toggle test list"
                >
                  <FaCaretDown />
                </button>
              </div>

              {isDropdownOpen && (
                <div className="td-search-dropdown-menu">
                  {loadingCoreTests ? (
                    <div style={{ padding: "14px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
                      <FaSpinner className="fa-spin" style={{ marginRight: "6px" }} /> Loading tests...
                    </div>
                  ) : filteredCoreTests.length === 0 ? (
                    <div style={{ padding: "14px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                      No master tests found matching "{searchTestQuery}"
                    </div>
                  ) : (
                    filteredCoreTests.slice(0, 60).map((item, idx) => (
                      <div
                        key={item._id || idx}
                        className={`td-search-dropdown-item ${
                          selectedCoreTest?._id === item._id || selectedCoreTest?.test_name === item.test_name
                            ? "active"
                            : ""
                        }`}
                        onClick={() => handleSelectCoreTest(item)}
                      >
                        <div className="td-search-dropdown-item-name">
                          <FaFlask style={{ color: "#0284c7", fontSize: "12px" }} />
                          {item.test_name}
                        </div>
                        <div className="td-search-dropdown-item-meta">
                          {item.test_code && (
                            <span className="td-item-code-text">#{item.test_code}</span>
                          )}
                          {item.department && (
                            <span className="td-item-dept-pill">{item.department}</span>
                          )}
                          {selectedCoreTest?.test_name === item.test_name && (
                            <FaCheck style={{ color: "#059669", fontSize: "12px", marginLeft: "4px" }} />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {filteredCoreTests.length > 60 && (
                    <div
                      style={{
                        padding: "8px",
                        textAlign: "center",
                        fontSize: "11px",
                        color: "#94a3b8",
                        background: "#f8fafc",
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      Showing top 60 of {filteredCoreTests.length} matches. Type above to refine search.
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedCoreTest && (
              <div className="td-autofill-banner">
                <FaCheckCircle style={{ fontSize: "15px" }} />
                <span>
                  Auto-populated details for <strong>{selectedCoreTest.test_name}</strong>. You can customize any field below before saving.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Quick Suggestion Presets (Only in Add mode) */}
        {!isEditMode && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.04em" }}>
              ⚡ Quick Standard Presets:
            </div>
            <div className="td-chips-row">
              {POPULAR_TESTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="td-chip-btn"
                  onClick={() => handleApplyPreset(item)}
                >
                  + {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Test Form Card */}
        <div className="td-form-card">
          <div className="td-form-header">
            <div className="td-form-header-badge">
              <FaFlask /> {isEditMode ? "Edit Mode" : "New Test Entry"}
            </div>
            <h2>{isEditMode ? `Update Test: ${formData.test_name || "Diagnostic Test"}` : "Add Diagnostic Test Details"}</h2>
            <p>
              Fill in all clinical parameters, reference intervals, specimen requirements, and upload an official sample diagnostic report.
            </p>
          </div>

          <form className="td-form-body" onSubmit={handleSubmit}>
            {/* 1. Basic Identification */}
            <div className="td-section-heading">
              <FaFlask /> 1. Test Identification & Specialty
            </div>

            <div className="td-form-grid">
              <div className="td-field">
                <label className="td-label">
                  <span>TEST NAME <span className="td-label-required">*</span></span>
                  <span className="td-label-hint">Official lab test name</span>
                </label>
                <input
                  type="text"
                  name="test_name"
                  className="td-input"
                  placeholder="e.g. Complete Blood Count (CBC)"
                  value={formData.test_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="td-field">
                <label className="td-label">
                  <span>TEST CODE / SHORT CODE</span>
                  <span className="td-label-hint">Optional / auto-generated</span>
                </label>
                <input
                  type="text"
                  name="test_code"
                  className="td-input"
                  placeholder="e.g. CBC01, LFT, THY01"
                  value={formData.test_code}
                  onChange={handleChange}
                />
              </div>

              <div className="td-field">
                <label className="td-label">
                  <span>DEPARTMENT / SPECIALTY <span className="td-label-required">*</span></span>
                </label>
                <select
                  name="department"
                  className="td-select"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  {DEPARTMENTS.map((dept, idx) => (
                    <option key={idx} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Specimen, Method & Turnaround Time */}
            <div className="td-section-heading">
              <FaVial /> 2. Specimen Handling & Methodology
            </div>

            <div className="td-form-grid">
              <div className="td-field">
                <label className="td-label">
                  <span>SPECIMEN / SAMPLE TYPE <span className="td-label-required">*</span></span>
                </label>
                <input
                  type="text"
                  name="specimen"
                  className="td-input"
                  placeholder="e.g. EDTA Whole Blood, Serum"
                  value={formData.specimen}
                  onChange={handleChange}
                  list="specimen-list"
                  required
                />
                <datalist id="specimen-list">
                  {SPECIMEN_TYPES.map((spec, idx) => (
                    <option key={idx} value={spec} />
                  ))}
                </datalist>

                {/* Quick specimen chips */}
                <div className="td-chips-row">
                  {SPECIMEN_TYPES.slice(0, 6).map((spec, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`td-chip-btn ${formData.specimen === spec ? "active" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, specimen: spec }))}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              <div className="td-field">
                <label className="td-label">
                  <span>METHOD / TECHNIQUE</span>
                  <span className="td-label-hint">Analytical methodology</span>
                </label>
                <input
                  type="text"
                  name="method"
                  className="td-input"
                  placeholder="e.g. CLIA, HPLC, Automated Analyzer"
                  value={formData.method}
                  onChange={handleChange}
                  list="method-list"
                />
                <datalist id="method-list">
                  {METHODS.map((m, idx) => (
                    <option key={idx} value={m} />
                  ))}
                </datalist>
              </div>

              <div className="td-field">
                <label className="td-label">
                  <span>TIME TAKEN / TURNAROUND TIME (TAT)</span>
                  <span className="td-label-hint">Report delivery time</span>
                </label>
                <input
                  type="text"
                  name="turnaround_time"
                  className="td-input"
                  placeholder="e.g. 2 Hours, Same Day"
                  value={formData.turnaround_time}
                  onChange={handleChange}
                />
                {/* TAT presets */}
                <div className="td-chips-row">
                  {TAT_PRESETS.slice(0, 5).map((tat, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`td-chip-btn ${formData.turnaround_time === tat ? "active" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, turnaround_time: tat }))}
                    >
                      {tat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Reference Range, Unit & Clinical Purpose */}
            <div className="td-section-heading">
              <FaNotesMedical /> 3. Reference Intervals & Clinical Indication
            </div>

            <div className="td-form-grid-3">
              <div className="td-field">
                <label className="td-label">
                  <span>UNIT OF MEASUREMENT</span>
                  <span className="td-label-hint">Metric unit</span>
                </label>
                <input
                  type="text"
                  name="unit"
                  className="td-input"
                  placeholder="e.g. mg/dL, g/dL, %"
                  value={formData.unit}
                  onChange={handleChange}
                  list="units-list"
                />
                <datalist id="units-list">
                  {UNITS.map((u, idx) => (
                    <option key={idx} value={u} />
                  ))}
                </datalist>
                <div className="td-chips-row">
                  {UNITS.slice(0, 5).map((u, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`td-chip-btn ${formData.unit === u ? "active" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, unit: u }))}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="td-field" style={{ gridColumn: "span 2" }}>
                <label className="td-label">
                  <span>BIOLOGICAL REFERENCE RANGE / NORMAL VALUES</span>
                  <span className="td-label-hint">Standard physiological values</span>
                </label>
                <textarea
                  name="reference_range"
                  className="td-textarea"
                  placeholder="e.g. Adult Male: 13.5 - 17.5 g/dL&#10;Adult Female: 12.0 - 15.5 g/dL&#10;Child: 11.5 - 14.5 g/dL"
                  value={formData.reference_range}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="td-field td-form-full">
                <label className="td-label">
                  <span>FOR WHAT THIS TEST IS TAKEN / CLINICAL PURPOSE</span>
                  <span className="td-label-hint">Diagnostic value & disease markers</span>
                </label>
                <textarea
                  name="clinical_purpose"
                  className="td-textarea"
                  placeholder="e.g. Used to diagnose anemia, monitor chemotherapy or radiation side effects, check for chronic infections, and assess overall hematological health."
                  value={formData.clinical_purpose}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="td-field td-form-full">
                <label className="td-label">
                  <span>PATIENT PREPARATION & FASTING INSTRUCTIONS</span>
                  <span className="td-label-hint">Special diet, fasting, or time restrictions</span>
                </label>
                <input
                  type="text"
                  name="patient_preparation"
                  className="td-input"
                  placeholder="e.g. 10-12 hours overnight fasting required. Water is permitted."
                  value={formData.patient_preparation}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 4. Sample Report Upload */}
            <div className="td-section-heading">
              <FaUpload /> 4. Sample Diagnostic Report Upload
            </div>

            <div className="td-field td-form-full">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".pdf,image/png,image/jpeg,image/webp"
                onChange={handleFileInputChange}
              />

              <div
                className={`td-dropzone ${dragActive ? "drag-active" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <div className="td-dropzone-icon">
                  <FaUpload />
                </div>
                <div className="td-dropzone-title">Click to upload or drag & drop sample report</div>
                <div className="td-dropzone-sub">Supports PDF, PNG, JPG, or WEBP formats (Max 15MB)</div>
              </div>

              {/* Show Selected or Existing File */}
              {(sampleReportFile || existingFileName) && (
                <div className="td-file-preview-card">
                  <div className="td-file-info">
                    <div className="td-file-icon">
                      {sampleReportFile?.type?.includes("image") ? <FaFileImage /> : <FaFilePdf />}
                    </div>
                    <div>
                      <p className="td-file-name">
                        {sampleReportFile ? sampleReportFile.name : existingFileName}
                      </p>
                      <p className="td-file-size">
                        {sampleReportFile
                          ? `${(sampleReportFile.size / 1024).toFixed(1)} KB (Ready to upload)`
                          : "Existing Sample Report on File"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="td-btn-remove-file"
                    onClick={handleRemoveSelectedFile}
                  >
                    <FaTimes /> Remove File
                  </button>
                </div>
              )}
            </div>

            {/* Form Actions Footer */}
            <div className="td-form-actions">
              <button
                type="button"
                className="td-btn td-btn-secondary"
                onClick={handleReset}
                disabled={loading}
              >
                <FaUndo /> Reset Form
              </button>

              <button
                type="button"
                className="td-btn td-btn-outline"
                onClick={() => navigate("/TestDirectoryReport")}
              >
                <FaListAlt /> View Directory Report
              </button>

              <button
                type="submit"
                className="td-btn td-btn-primary"
                disabled={loading}
              >
                <FaSave /> {loading ? "Saving Test..." : isEditMode ? "Update Test Details" : "Save Test to Directory"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
