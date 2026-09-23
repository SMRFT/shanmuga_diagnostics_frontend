import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaFlask,
  FaVial,
  FaClock,
  FaMicroscope,
  FaNotesMedical,
  FaBuilding,
  FaDownload,
  FaFilePdf,
  FaFileImage,
  FaCheckCircle,
  FaShieldAlt,
  FaChevronDown,
  FaChevronUp,
  FaPhoneAlt,
  FaArrowLeft,
  FaInfoCircle,
  FaExclamationTriangle,
  FaFileMedical,
  FaShareAlt,
  FaPrint,
  FaUserMd,
  FaHome,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getTestDirectoryDetail, getSampleReportUrl } from "./api";
import "./TestDirectory.css";

export default function TestMonographView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getTestDirectoryDetail(id)
        .then((res) => {
          if (res.success && res.data) {
            setTest(res.data);
          } else {
            toast.error("Test details not found.");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load test monograph.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${test?.test_name} - Shanmuga Diagnostics`,
        text: `Check out the test details and specimen requirements for ${test?.test_name}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Test monograph link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="sd-portal-wrapper">
        <div className="td-spinner-container" style={{ minHeight: "60vh" }}>
          <div className="td-spinner" />
          <p style={{ color: "var(--sd-text-muted)", fontWeight: "600" }}>Loading diagnostic test monograph...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="sd-portal-wrapper" style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2>Test Not Found</h2>
        <p style={{ color: "var(--sd-text-muted)" }}>The requested diagnostic test details could not be found.</p>
        <button className="sd-nav-btn sd-nav-btn-primary" onClick={() => navigate("/TestDirectoryReport")}>
          <FaArrowLeft /> Back to Directory
        </button>
      </div>
    );
  }

  const sampleReportUrl = getSampleReportUrl(test.sample_report_file_id);
  const downloadReportUrl = getSampleReportUrl(test.sample_report_file_id, true);
  const isPdf = test.sample_report_file_type?.includes("pdf") || test.sample_report_file_name?.toLowerCase().endsWith(".pdf");
  const isImage = test.sample_report_file_type?.includes("image") || /\.(jpe?g|png|webp)$/i.test(test.sample_report_file_name || "");

  // Dynamic FAQs based on test data
  const faqs = [
    {
      q: `What is the purpose of the ${test.test_name} test?`,
      a: test.clinical_purpose
        ? `${test.clinical_purpose} It is an essential clinical parameter used by physicians to formulate targeted diagnosis and therapy plans.`
        : `This test evaluates physiological markers to assist doctors in accurate diagnosis and monitoring.`,
    },
    {
      q: `Do I need to fast before taking the ${test.test_name}?`,
      a: test.patient_preparation
        ? `Preparation instructions: ${test.patient_preparation}`
        : `Generally, no special fasting is required unless prescribed in conjunction with fasting profiles. Consult your clinician for specific dietary instructions.`,
    },
    {
      q: `How long does it take to receive the test report?`,
      a: `Standard Turnaround Time (TAT) is ${test.turnaround_time || "Same Day"}. Digital reports are automatically delivered via SMS, Email, and WhatsApp.`,
    },
    {
      q: `What sample specimen is collected for this test?`,
      a: `The required specimen is ${test.specimen || "Blood/Serum"}. It is collected using sterile, vacuum-sealed tubes and transported under strict temperature-controlled logistics.`,
    },
  ];

  return (
    <div className="sd-portal-wrapper">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Public Top Navbar */}
      <header className="sd-public-header">
        <div className="sd-portal-container">
          <div className="sd-header-content">
            <div className="sd-logo-brand" onClick={() => navigate("/TestDirectoryReport")}>
              <div className="sd-logo-circle">
                <FaFlask />
              </div>
              <div className="sd-brand-text">
                <h1>Shanmuga Diagnostics</h1>
                <p>Pathology & Radiology Test Catalog</p>
              </div>
            </div>

            <div className="sd-header-actions">
              <button className="sd-nav-btn sd-nav-btn-outline" onClick={() => navigate("/TestDirectoryReport")}>
                <FaArrowLeft /> All Tests
              </button>
              <button className="sd-nav-btn sd-nav-btn-outline" onClick={handleShare}>
                <FaShareAlt /> Share
              </button>
              <button className="sd-nav-btn sd-nav-btn-admin" onClick={() => navigate(`/TestDirectoryForm?id=${test.id}`)}>
                <FaFileMedical /> Edit Test (Internal)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Monograph Top Header Banner */}
      <div className="sd-monograph-header-banner">
        <div className="sd-portal-container">
          {/* Breadcrumbs */}
          <nav className="sd-breadcrumbs">
            <Link to="/TestDirectoryReport" className="sd-breadcrumb-link">
              <FaHome style={{ marginRight: "4px" }} /> Test Directory
            </Link>
            <span>›</span>
            <span style={{ color: "var(--sd-primary)" }}>{test.department || "Pathology"}</span>
            <span>›</span>
            <span style={{ fontWeight: "700", color: "#0f172a" }}>{test.test_name}</span>
          </nav>

          {/* Title Area */}
          <div className="sd-monograph-title-area">
            <div>
              <div className="sd-monograph-code-row" style={{ marginBottom: "8px" }}>
                <span className="sd-card-dept-tag">{test.department || "General"}</span>
                {test.test_code && (
                  <span className="td-code-badge">Code: {test.test_code}</span>
                )}
                <span className="sd-nabl-badge">
                  <FaShieldAlt /> NABL Accredited & ISO Certified Lab
                </span>
              </div>
              <h1 className="sd-monograph-title">{test.test_name}</h1>
              <p style={{ margin: 0, fontSize: "14px", color: "var(--sd-text-muted)" }}>
                Also known as: <strong>{test.test_name} Panel</strong> • Method: <strong>{test.method || "Automated Laboratory Analysis"}</strong>
              </p>
            </div>
          </div>

          {/* 4-Key Metrics Highlight Bar (Specimen, Preparation, TAT, Method) */}
          <div className="sd-key-metrics-bar">
            <div className="sd-key-metric-box">
              <div className="sd-key-metric-icon">
                <FaVial />
              </div>
              <div className="sd-key-metric-text">
                <label>Specimen / Sample</label>
                <span>{test.specimen || "Serum"}</span>
              </div>
            </div>

            <div className="sd-key-metric-box">
              <div className="sd-key-metric-icon" style={{ color: "#d97706" }}>
                <FaInfoCircle />
              </div>
              <div className="sd-key-metric-text">
                <label>Pre-Test Preparation</label>
                <span title={test.patient_preparation}>
                  {test.patient_preparation ? (test.patient_preparation.length > 25 ? `${test.patient_preparation.substring(0, 25)}...` : test.patient_preparation) : "No Special Prep"}
                </span>
              </div>
            </div>

            <div className="sd-key-metric-box">
              <div className="sd-key-metric-icon" style={{ color: "#059669" }}>
                <FaClock />
              </div>
              <div className="sd-key-metric-text">
                <label>Report Delivery (TAT)</label>
                <span>{test.turnaround_time || "Same Day"}</span>
              </div>
            </div>

            <div className="sd-key-metric-box">
              <div className="sd-key-metric-icon">
                <FaMicroscope />
              </div>
              <div className="sd-key-metric-text">
                <label>Methodology</label>
                <span>{test.method || "CLIA / Automated"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Monograph Layout */}
      <div className="sd-portal-container">
        <div className="sd-monograph-main-layout">
          {/* Left Column: Monograph Content */}
          <div className="sd-monograph-content-col">
            {/* 1. Overview */}
            <div className="sd-monograph-card">
              <h2 className="sd-monograph-card-title">
                <FaFlask /> Test Overview & Clinical Purpose
              </h2>
              <p className="sd-prose-text">
                {test.clinical_purpose || (
                  <>
                    The <strong>{test.test_name}</strong> is a specialized clinical laboratory investigation performed at Shanmuga Diagnostics to evaluate vital diagnostic markers. It assists medical practitioners in screening, confirming diagnoses, and monitoring therapeutic responses.
                  </>
                )}
              </p>
            </div>

            {/* 2. Biological Reference Range Table */}
            <div className="sd-monograph-card">
              <h2 className="sd-monograph-card-title">
                <FaNotesMedical /> Biological Reference Intervals & Normal Values
              </h2>
              <p className="sd-prose-text" style={{ marginBottom: "14px" }}>
                Reference intervals represent standard physiological baseline measurements. Any deviation should be correlated clinically by a qualified physician.
              </p>

              <table className="sd-ref-table">
                <thead>
                  <tr>
                    <th>Parameter / Component</th>
                    <th>Standard Reference Range</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>{test.test_name}</strong></td>
                    <td style={{ color: "#0284c7", fontWeight: "700", whiteSpace: "pre-line" }}>
                      {test.reference_range || "Age & gender specific biological range applies."}
                    </td>
                    <td><strong>{test.unit || "N/A"}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 3. Patient Preparation Notice */}
            <div className="sd-monograph-card">
              <h2 className="sd-monograph-card-title">
                <FaInfoCircle /> Patient Preparation Guidelines
              </h2>
              <div className="sd-prep-notice-box">
                <FaExclamationTriangle className="sd-prep-notice-icon" />
                <div className="sd-prep-notice-content">
                  <h4>Pre-Collection Instructions:</h4>
                  <p>
                    {test.patient_preparation || "No special preparation or fasting is required for this test. Normal diet and medication routine can be followed unless advised otherwise by your treating doctor."}
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Specimen Requirements & Handling */}
            <div className="sd-monograph-card">
              <h2 className="sd-monograph-card-title">
                <FaVial /> Specimen Collection & Storage Guidelines
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginTop: "10px" }}>
                <div className="td-detail-box">
                  <strong>Specimen Type:</strong>
                  <div style={{ color: "var(--sd-primary)", fontWeight: "700", marginTop: "4px" }}>
                    {test.specimen || "Serum / Whole Blood"}
                  </div>
                </div>
                <div className="td-detail-box">
                  <strong>Transport Temperature:</strong>
                  <div style={{ color: "#059669", fontWeight: "700", marginTop: "4px" }}>
                    Refrigerated (2°C - 8°C)
                  </div>
                </div>
                <div className="td-detail-box">
                  <strong>Sample Stability:</strong>
                  <div style={{ color: "#334155", fontWeight: "700", marginTop: "4px" }}>
                    Room Temp: 4 Hrs | Cold: 48 Hrs
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Sample Diagnostic Report Template */}
            <div className="sd-monograph-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <h2 className="sd-monograph-card-title" style={{ margin: 0, border: "none", padding: 0 }}>
                  <FaFilePdf /> Sample Diagnostic Report Template
                </h2>
                {sampleReportUrl && (
                  <a
                    href={downloadReportUrl}
                    className="sd-nav-btn sd-nav-btn-primary"
                    style={{ fontSize: "12px", padding: "6px 14px" }}
                    download
                  >
                    <FaDownload /> Download Report PDF
                  </a>
                )}
              </div>

              {sampleReportUrl ? (
                <div>
                  <p className="sd-prose-text" style={{ marginBottom: "14px" }}>
                    Below is an official sample report preview demonstrating how clinical parameters, reference values, and medical pathologist signatures are presented.
                  </p>
                  {isPdf ? (
                    <iframe
                      src={sampleReportUrl}
                      title="Sample Diagnostic Report Preview"
                      className="td-report-embed-frame"
                      style={{ height: "480px" }}
                    />
                  ) : isImage ? (
                    <div style={{ textAlign: "center", background: "#f8fafc", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                      <img
                        src={sampleReportUrl}
                        alt="Sample Diagnostic Report"
                        style={{ maxWidth: "100%", maxHeight: "500px", borderRadius: "8px", objectFit: "contain" }}
                      />
                    </div>
                  ) : (
                    <div className="td-detail-box" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span>{test.sample_report_file_name || "Diagnostic_Sample_Report.pdf"}</span>
                      <a href={sampleReportUrl} target="_blank" rel="noopener noreferrer" className="sd-btn-view-details">
                        Open File
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="td-detail-box" style={{ textAlign: "center", padding: "30px", color: "var(--sd-text-muted)" }}>
                  Sample report template will be uploaded soon by the laboratory team.
                </div>
              )}
            </div>

            {/* 6. Frequently Asked Questions (FAQs) */}
            <div className="sd-monograph-card">
              <h2 className="sd-monograph-card-title">
                <FaInfoCircle /> Frequently Asked Questions (FAQs)
              </h2>

              <div style={{ marginTop: "14px" }}>
                {faqs.map((faq, idx) => (
                  <div key={idx} className="sd-faq-item">
                    <div className="sd-faq-question" onClick={() => toggleFaq(idx)}>
                      <span>{faq.q}</span>
                      {activeFaq === idx ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {activeFaq === idx && (
                      <div className="sd-faq-answer">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Action Sidebar */}
          <div className="sd-monograph-sidebar-col">
            <div className="sd-sticky-sidebar">
              <div className="sd-booking-action-card">
                <div className="sd-action-header">
                  <span className="sd-nabl-badge" style={{ marginBottom: "8px" }}>
                    <FaShieldAlt /> 100% Verified Quality
                  </span>
                  <h3>Book Test at Shanmuga Diagnostics</h3>
                  <p>Walk-in to our nearest diagnostic branch or request a home sample collection.</p>
                </div>

                <a
                  href="tel:04443445555"
                  className="sd-btn-large-primary"
                >
                  <FaPhoneAlt /> Call Lab: 044 - 4344 5555
                </a>

                {sampleReportUrl && (
                  <a
                    href={downloadReportUrl}
                    className="sd-btn-large-report"
                    download
                  >
                    <FaFilePdf /> Download Sample Report
                  </a>
                )}

                <div className="sd-sidebar-perks">
                  <div className="sd-perk-item">
                    <FaCheckCircle className="sd-perk-icon" /> NABL & ICMR Accredited Facility
                  </div>
                  <div className="sd-perk-item">
                    <FaCheckCircle className="sd-perk-icon" /> Barcoded & Temperature-Controlled Transport
                  </div>
                  <div className="sd-perk-item">
                    <FaCheckCircle className="sd-perk-icon" /> Automated Online Report Delivery
                  </div>
                  <div className="sd-perk-item">
                    <FaCheckCircle className="sd-perk-icon" /> Free Pathologist Consultation on Queries
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
