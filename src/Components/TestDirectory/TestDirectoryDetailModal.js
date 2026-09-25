import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  FaTimes,
  FaFilePdf,
  FaFileImage,
  FaDownload,
  FaVial,
  FaClock,
  FaMicroscope,
  FaNotesMedical,
  FaFlask,
  FaBuilding,
  FaCheckCircle,
  FaShareAlt,
  FaWhatsapp,
  FaEnvelope,
  FaCopy,
  FaCheck,
  FaPaperPlane,
  FaLink,
} from "react-icons/fa";
import { getSampleReportUrl } from "./api";

export default function TestDirectoryDetailModal({ test, onClose }) {
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [shareTab, setShareTab] = useState("whatsapp"); // 'whatsapp' | 'email' | 'copy'
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (!test) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [test]);

  if (!test) return null;

  const sampleReportUrl = getSampleReportUrl(test.sample_report_file_id);
  const downloadReportUrl = getSampleReportUrl(test.sample_report_file_id, true);
  const isPdf =
    test.sample_report_file_type?.includes("pdf") ||
    test.sample_report_file_name?.toLowerCase().endsWith(".pdf");
  const isImage =
    test.sample_report_file_type?.includes("image") ||
    /\.(jpe?g|png|webp)$/i.test(test.sample_report_file_name || "");

  // Formatted clinical text for sharing
  const generateShareText = () => {
    let text = `🏥 *SHANMUGA DIAGNOSTICS - CLINICAL INVESTIGATION*\n\n`;
    text += `🔬 *Test Name:* ${test.test_name || "Diagnostic Investigation"}\n`;
    if (test.test_code) text += `🏷️ *Test Code:* ${test.test_code}\n`;
    if (test.department) text += `🏢 *Specialty:* ${test.department}\n`;
    if (test.specimen) text += `🩸 *Specimen:* ${test.specimen}\n`;
    if (test.unit) text += `📐 *Unit:* ${test.unit}\n`;
    if (test.turnaround_time) text += `⏱️ *Turnaround Time (TAT):* ${test.turnaround_time}\n`;
    if (test.reference_range) text += `📊 *Reference Interval:* ${test.reference_range.replace(/\n/g, " ")}\n`;
    if (test.clinical_purpose) text += `📋 *Clinical Purpose:* ${test.clinical_purpose}\n`;
    if (test.patient_preparation) text += `🥣 *Patient Preparation:* ${test.patient_preparation}\n`;
    if (sampleReportUrl) text += `\n📄 *Sample Report Link:* ${window.location.origin}${sampleReportUrl}\n`;
    text += `\n🌐 *Directory:* ${window.location.origin}/TestDirectoryReport`;
    return text;
  };

  // WhatsApp Share Handler
  const handleWhatsAppShare = (e) => {
    e?.preventDefault();
    const shareMessage = generateShareText();
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

    let waUrl = "";
    if (cleanNumber.length > 0) {
      // If user typed 10 digits without country code, default to 91 (India)
      const fullNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
      waUrl = `https://wa.me/${fullNumber}?text=${encodeURIComponent(shareMessage)}`;
    } else {
      waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    }

    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  // Email Share Handler
  const handleEmailShare = (e) => {
    e?.preventDefault();
    const subject = encodeURIComponent(`Shanmuga Diagnostics - Investigation Monograph: ${test.test_name}`);
    const body = encodeURIComponent(generateShareText().replace(/\*/g, ""));
    const mailtoUrl = `mailto:${emailAddress.trim()}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  // Copy details handler
  const handleCopyDetails = () => {
    navigator.clipboard.writeText(generateShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Copy link handler
  const handleCopyLink = () => {
    const link = `${window.location.origin}/TestDirectoryReport?search=${encodeURIComponent(test.test_name || "")}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const modalElement = (
    <div className="td-modal-overlay" onClick={onClose}>
      <div className="td-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="td-modal-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span className="td-dept-badge" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                {test.department || "General"}
              </span>
              {test.test_code && (
                <span className="td-code-badge" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
                  {test.test_code}
                </span>
              )}
            </div>
            <h3>{test.test_name}</h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Share Trigger Button */}
            <button
              type="button"
              className={`td-modal-share-btn ${showSharePanel ? "active" : ""}`}
              onClick={() => setShowSharePanel(!showSharePanel)}
              title="Share test details via WhatsApp, Email, or Copy"
            >
              <FaShareAlt /> <span className="td-share-btn-text">Share</span>
            </button>

            {/* Close Button */}
            <button type="button" className="td-modal-close-btn" onClick={onClose} title="Close">
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Interactive Share Panel (Expandable) */}
        {showSharePanel && (
          <div className="td-share-panel">
            <div className="td-share-panel-header">
              <span style={{ fontWeight: "700", fontSize: "13px", color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                <FaShareAlt color="#0284c7" /> Share Test Information
              </span>
              <div className="td-share-tabs">
                <button
                  type="button"
                  className={`td-share-tab-btn ${shareTab === "whatsapp" ? "active-wa" : ""}`}
                  onClick={() => setShareTab("whatsapp")}
                >
                  <FaWhatsapp /> WhatsApp
                </button>
                <button
                  type="button"
                  className={`td-share-tab-btn ${shareTab === "email" ? "active-email" : ""}`}
                  onClick={() => setShareTab("email")}
                >
                  <FaEnvelope /> Email
                </button>
                <button
                  type="button"
                  className={`td-share-tab-btn ${shareTab === "copy" ? "active-copy" : ""}`}
                  onClick={() => setShareTab("copy")}
                >
                  <FaCopy /> Copy Text
                </button>
              </div>
            </div>

            <div className="td-share-panel-body">
              {/* WhatsApp Tab */}
              {shareTab === "whatsapp" && (
                <form onSubmit={handleWhatsAppShare} className="td-share-form">
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                    <div className="td-share-input-group">
                      <span className="td-share-input-prefix">+91</span>
                      <input
                        type="tel"
                        className="td-share-input"
                        placeholder="Recipient Phone Number (Optional)"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        maxLength={15}
                      />
                    </div>
                    <button type="submit" className="td-btn-wa-send">
                      <FaWhatsapp size={16} /> Send via WhatsApp
                    </button>
                  </div>
                  <p className="td-share-hint">
                    💡 Tip: Enter a 10-digit number to message directly, or leave blank to pick a contact in WhatsApp.
                  </p>
                </form>
              )}

              {/* Email Tab */}
              {shareTab === "email" && (
                <form onSubmit={handleEmailShare} className="td-share-form">
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                    <input
                      type="email"
                      className="td-share-input-full"
                      placeholder="Enter recipient email address (e.g. patient@gmail.com)"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                    />
                    <button type="submit" className="td-btn-email-send">
                      <FaPaperPlane size={14} /> Send Email
                    </button>
                  </div>
                  <p className="td-share-hint">
                    ✉️ Opens your email client pre-filled with the complete investigation summary and sample report link.
                  </p>
                </form>
              )}

              {/* Copy Tab */}
              {shareTab === "copy" && (
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    type="button"
                    className="td-btn td-btn-primary"
                    style={{ fontSize: "12.5px", padding: "8px 16px" }}
                    onClick={handleCopyDetails}
                  >
                    {copied ? <FaCheck color="#a7f3d0" /> : <FaCopy />} {copied ? "Copied to Clipboard!" : "Copy Full Test Summary"}
                  </button>
                  <button
                    type="button"
                    className="td-btn td-btn-outline"
                    style={{ fontSize: "12.5px", padding: "8px 16px" }}
                    onClick={handleCopyLink}
                  >
                    {linkCopied ? <FaCheck color="#0284c7" /> : <FaLink />} {linkCopied ? "Link Copied!" : "Copy Test Link"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="td-modal-body">
          {/* Key Parameters 2x2 Grid */}
          <div
            className="td-meta-boxes"
            style={{ marginBottom: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
          >
            <div className="td-meta-item">
              <span className="td-meta-label">
                <FaVial style={{ marginRight: "4px" }} /> Specimen / Sample
              </span>
              <span className="td-meta-val highlight">{test.specimen || "Not specified"}</span>
            </div>

            <div className="td-meta-item">
              <span className="td-meta-label">
                <FaClock style={{ marginRight: "4px" }} /> Turnaround Time (TAT)
              </span>
              <span className="td-meta-val">{test.turnaround_time || "Standard"}</span>
            </div>

            <div className="td-meta-item">
              <span className="td-meta-label">
                <FaMicroscope style={{ marginRight: "4px" }} /> Methodology
              </span>
              <span className="td-meta-val">{test.method || "Automated Analyzer"}</span>
            </div>

            <div className="td-meta-item">
              <span className="td-meta-label">
                <FaFlask style={{ marginRight: "4px" }} /> Unit
              </span>
              <span className="td-meta-val highlight">{test.unit || "N/A"}</span>
            </div>
          </div>

          {/* Reference Interval / Normal Values */}
          <div className="td-detail-section">
            <div className="td-detail-section-title">Biological Reference Range / Normal Values</div>
            <div
              className="td-detail-box"
              style={{ background: "#f0fdf4", borderColor: "#bbf7d0", color: "#166534", fontWeight: "600" }}
            >
              {test.reference_range ? test.reference_range : "Reference values vary with age, gender, and clinical history."}
            </div>
          </div>

          {/* Clinical Purpose / For What this test is taken */}
          <div className="td-detail-section">
            <div className="td-detail-section-title">Clinical Purpose & Diagnostic Indications</div>
            <div className="td-detail-box">
              {test.clinical_purpose ? test.clinical_purpose : "Clinical indication not documented."}
            </div>
          </div>

          {/* Patient Preparation & Fasting Instructions */}
          <div className="td-detail-section">
            <div className="td-detail-section-title">Patient Preparation & Sample Instructions</div>
            <div
              className="td-detail-box"
              style={{ background: "#fffbeb", borderColor: "#fde68a", color: "#92400e" }}
            >
              {test.patient_preparation ? test.patient_preparation : "No special fasting or diet restriction required."}
            </div>
          </div>

          {/* Sample Diagnostic Report Preview */}
          <div className="td-detail-section">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <div className="td-detail-section-title" style={{ margin: 0 }}>Sample Diagnostic Report Template</div>
              {sampleReportUrl && (
                <a
                  href={downloadReportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="td-btn td-btn-primary"
                  style={{ padding: "6px 14px", fontSize: "12px", textDecoration: "none" }}
                  download
                >
                  <FaDownload /> Download File
                </a>
              )}
            </div>

            {sampleReportUrl ? (
              <div>
                {isPdf ? (
                  <iframe
                    src={sampleReportUrl}
                    title="Sample Report PDF"
                    className="td-report-embed-frame"
                  />
                ) : isImage ? (
                  <div style={{ textAlign: "center", background: "#f8fafc", padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <img
                      src={sampleReportUrl}
                      alt="Sample Report"
                      style={{ maxWidth: "100%", maxHeight: "380px", borderRadius: "8px", objectFit: "contain" }}
                    />
                  </div>
                ) : (
                  <div className="td-detail-box" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <FaFilePdf size={24} color="#0284c7" />
                      <div>
                        <strong>{test.sample_report_file_name || "sample_report_document"}</strong>
                        <div style={{ fontSize: "11.5px", color: "#64748b" }}>
                          {test.sample_report_file_size ? `${(test.sample_report_file_size / 1024).toFixed(1)} KB` : "Uploaded"}
                        </div>
                      </div>
                    </div>
                    <a
                      href={sampleReportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="td-btn td-btn-outline"
                      style={{ padding: "6px 12px", fontSize: "12px" }}
                    >
                      Open Document
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="td-detail-box" style={{ color: "#94a3b8", fontStyle: "italic", textAlign: "center", padding: "20px" }}>
                No sample report template has been uploaded for this test.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--td-border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="td-btn-wa-direct"
              onClick={handleWhatsAppShare}
              title="Quick share on WhatsApp"
            >
              <FaWhatsapp size={15} /> WhatsApp
            </button>
            <button
              type="button"
              className="td-btn-email-direct"
              onClick={handleEmailShare}
              title="Quick share via Email"
            >
              <FaEnvelope size={13} /> Email
            </button>
          </div>

          <button type="button" className="td-btn td-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalElement, document.body);
}
