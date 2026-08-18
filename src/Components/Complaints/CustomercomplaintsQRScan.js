import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes } from "styled-components";
import { QRCodeCanvas } from "qrcode.react";
import apiRequest from "../Auth/apiRequest";
import {
  ISSUE_TYPE_OPTIONS,
  OTHER_ISSUE_VALUE,
} from "../Constantdata/Customercomplaintconstants";

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

const ACCENT = "#b673c9";
const ACCENT_DARK = "#895697";

const initialFormData = {
  labcode: "",
  patientId: "",
  issuetype: [],
  otherIssueText: "",
  comments: "",
  assignedby: "",
};

// ── Styled Components ───────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fbf7fd 0%, #f1e9f7 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 16px;
  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
`;

const Card = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: ${(props) => (props.$isForm ? "600px" : "460px")};
  border-radius: 20px;
  padding: ${(props) => (props.$isForm ? "36px 32px" : "40px 32px")};
  box-shadow: 0 16px 40px rgba(137, 86, 151, 0.14);
  border: 1px solid rgba(182, 115, 201, 0.25);
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$isForm ? "stretch" : "center")};
  text-align: ${(props) => (props.$isForm ? "left" : "center")};

  @media (max-width: 480px) {
    padding: 24px 18px;
    border-radius: 16px;
  }
`;

const BrandBadge = styled.div`
  display: inline-block;
  align-self: center;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${ACCENT_DARK};
  background: #f6ecfa;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 12px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #2b2230;
  margin: 0 0 8px 0;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 21px;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6d6473;
  margin: 0 0 24px 0;
  line-height: 1.5;
  text-align: center;
`;

const QRFrame = styled.div`
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;
  border: 2px solid #f0e6f5;
  box-shadow: 0 8px 24px rgba(137, 86, 151, 0.08);
  margin-bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// ── Form Styled Components ──────────────────────────────────────────────

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #4a3e52;
  margin-bottom: 6px;
`;

const TextInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #d5dede;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  background: #fff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${ACCENT};
    box-shadow: 0 0 0 3px rgba(182, 115, 201, 0.15);
  }

  &::placeholder {
    color: #a4b3b3;
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #d5dede;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  background: #fff;
  min-height: 90px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${ACCENT};
    box-shadow: 0 0 0 3px rgba(182, 115, 201, 0.15);
  }

  &::placeholder {
    color: #a4b3b3;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #d5dede;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  background: #fff;
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${ACCENT};
  }
`;

const LabSearchWrapper = styled.div`
  position: relative;
`;

const LabDropdownList = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #d5dede;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  z-index: 20;
`;

const LabDropdownItem = styled.div`
  padding: 10px 12px;
  font-size: 14px;
  color: #333;
  cursor: pointer;

  &:hover {
    background: #f7edfa;
    color: ${ACCENT_DARK};
  }
`;

const LabDropdownEmpty = styled.div`
  padding: 10px 12px;
  font-size: 13px;
  color: #7a8a8a;
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  background: #fdfbfd;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #efe8f2;
  transition: background 0.15s ease;

  &:hover {
    background: #f7eff9;
  }

  input {
    accent-color: ${ACCENT_DARK};
    cursor: pointer;
  }
`;

const ErrorText = styled.div`
  color: #d64545;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
`;

const SubmitButton = styled.button`
  background: ${ACCENT};
  color: #fff;
  border: none;
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover:not(:disabled) {
    background: ${ACCENT_DARK};
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const SuccessBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 12px;
`;

const SuccessIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #eaf8f0;
  color: #27ae60;
  font-size: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 14px rgba(39, 174, 96, 0.2);
`;

const SuccessTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #2b2230;
  margin: 0 0 10px 0;
`;

const SuccessMessage = styled.p`
  font-size: 15px;
  color: #555;
  line-height: 1.6;
  max-width: 420px;
  margin: 0 0 28px 0;
`;

const ResetButton = styled.button`
  background: ${ACCENT};
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${ACCENT_DARK};
  }
`;

const toastSlideIn = keyframes`
  from {
    transform: translateX(24px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 3000;

  @media (max-width: 480px) {
    left: 16px;
    right: 16px;
    top: 16px;
  }
`;

const ToastItem = styled.div`
  min-width: 240px;
  max-width: 360px;
  padding: 12px 16px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  background: ${(props) => (props.$type === "error" ? "#d64545" : "#2e9e5b")};
  animation: ${toastSlideIn} 0.2s ease-out;
`;

// ── Main Component ─────────────────────────────────────────────────────

const CustomercomplaintsQRScan = () => {
  // Check whether to show the Feedback & Grievance form alone or the QR code alone
  const isFormMode = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname.toLowerCase();
    return (
      params.get("form") === "1" ||
      params.get("mode") === "feedback" ||
      path.endsWith("/feedback")
    );
  }, []);

  const formUrl = `${window.location.origin}/CustomercomplaintsQRScan?form=1`;

  // Form states
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [clinicalNames, setClinicalNames] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [labSearchTerm, setLabSearchTerm] = useState("");
  const [labDropdownOpen, setLabDropdownOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const loadClinicalNames = useCallback(async () => {
    try {
      const res = await apiRequest(`${Labbaseurl}get_b2b_clinical_names/`, "GET");
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.results)
        ? res.results
        : [];
      setClinicalNames(list);
    } catch (err) {
      console.error("Failed to load clinical names:", err);
    }
  }, []);

  const loadEmployees = useCallback(async () => {
    try {
      const res = await apiRequest(`${Labbaseurl}get_b2b_lab_employees/`, "GET");
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];
      setEmployees(list);
    } catch (err) {
      console.error("Failed to load employees:", err);
    }
  }, []);

  useEffect(() => {
    if (isFormMode) {
      loadClinicalNames();
      loadEmployees();
    }
  }, [isFormMode, loadClinicalNames, loadEmployees]);

  const filteredClinicalNames = clinicalNames.filter((cn) => {
    const name = cn.clinicalname || "";
    const code = cn.referrerCode || "";
    const q = labSearchTerm.trim().toLowerCase();
    return name.toLowerCase().includes(q) || code.toLowerCase().includes(q);
  });

  const handleLabSearchChange = (e) => {
    const val = e.target.value;
    setLabSearchTerm(val);
    setFormData((prev) => ({ ...prev, labcode: val }));
    setLabDropdownOpen(true);
  };

  const handleSelectLab = (cn) => {
    setFormData((prev) => ({
      ...prev,
      labcode: cn.referrerCode || cn.clinicalname,
    }));
    setLabSearchTerm(cn.clinicalname || cn.referrerCode);
    setLabDropdownOpen(false);
  };

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleIssueTypeToggle = (value) => {
    setFormData((prev) => {
      const exists = prev.issuetype.includes(value);
      const next = exists
        ? prev.issuetype.filter((v) => v !== value)
        : [...prev.issuetype, value];
      return {
        ...prev,
        issuetype: next,
        otherIssueText: exists && value === OTHER_ISSUE_VALUE ? "" : prev.otherIssueText,
      };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.labcode.trim()) {
      newErrors.labcode = "Lab Name is required";
    }
    if (formData.issuetype.length === 0) {
      newErrors.issuetype = "Please select at least one issue type";
    }
    if (
      formData.issuetype.includes(OTHER_ISSUE_VALUE) &&
      !formData.otherIssueText.trim()
    ) {
      newErrors.otherIssueText = "Please specify the issue";
    }
    if (!formData.comments.trim()) {
      newErrors.comments = "Comments / feedback are required";
    }
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      const firstKey = Object.keys(validationErrors)[0];
      showToast(validationErrors[firstKey], "error");
      return;
    }

    setSaving(true);
    try {
      const issuetypeString = formData.issuetype
        .map((value) =>
          value === OTHER_ISSUE_VALUE ? formData.otherIssueText.trim() : value
        )
        .join(", ");

      const payload = {
        labcode: formData.labcode.trim(),
        patient_id: formData.patientId.trim() || null,
        issuetype: issuetypeString,
        comments: formData.comments.trim(),
        assignedby: formData.assignedby || "",
      };

      const res = await apiRequest(`${Labbaseurl}customer_complaints/`, "POST", payload);
      if (res && res.success === false) {
        showToast(res.error || "Failed to submit. Please try again.", "error");
        return;
      }

      setSubmitted(true);
      showToast("Feedback submitted successfully!", "success");
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      showToast("Failed to submit feedback. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <Card $isForm={isFormMode}>
        <BrandBadge>Shanmuga Diagnostics</BrandBadge>

        {isFormMode ? (
          /* ── Feedback And Grievance Form Alone ── */
          submitted ? (
            <SuccessBox>
              <SuccessIcon>✓</SuccessIcon>
              <SuccessTitle>Thank You!</SuccessTitle>
              <SuccessMessage>
                Your feedback and grievance have been recorded successfully. Our team will review your submission and take necessary action promptly.
              </SuccessMessage>
              <ResetButton
                type="button"
                onClick={() => {
                  setFormData(initialFormData);
                  setLabSearchTerm("");
                  setSubmitted(false);
                }}
              >
                Submit Another Response
              </ResetButton>
            </SuccessBox>
          ) : (
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Title>Feedback And Grievance</Title>
              <Subtitle>
                We value your feedback. Please fill in the details below to submit your feedback or grievance.
              </Subtitle>

              <FormGroup>
                <Label htmlFor="qr-labname">Lab Name *</Label>
                <LabSearchWrapper>
                  <TextInput
                    id="qr-labname"
                    placeholder="Search and select a lab"
                    autoComplete="off"
                    value={labSearchTerm}
                    onChange={handleLabSearchChange}
                    onFocus={() => setLabDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setLabDropdownOpen(false), 200)}
                  />
                  {labDropdownOpen && (
                    <LabDropdownList>
                      {filteredClinicalNames.length === 0 ? (
                        <LabDropdownEmpty>No matching labs found</LabDropdownEmpty>
                      ) : (
                        filteredClinicalNames.map((cn) => (
                          <LabDropdownItem
                            key={cn.referrerCode}
                            onMouseDown={() => handleSelectLab(cn)}
                          >
                            {cn.clinicalname} ({cn.referrerCode})
                          </LabDropdownItem>
                        ))
                      )}
                    </LabDropdownList>
                  )}
                </LabSearchWrapper>
                {errors.labcode && <ErrorText>{errors.labcode}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="qr-patientid">Patient ID (Optional)</Label>
                <TextInput
                  id="qr-patientid"
                  placeholder="Enter Patient ID if applicable"
                  value={formData.patientId}
                  onChange={handleChange("patientId")}
                />
              </FormGroup>

              <FormGroup>
                <Label>Issue Type *</Label>
                <CheckboxGroup>
                  {ISSUE_TYPE_OPTIONS.map((opt) => (
                    <CheckboxLabel key={opt.value}>
                      <input
                        type="checkbox"
                        checked={formData.issuetype.includes(opt.value)}
                        onChange={() => handleIssueTypeToggle(opt.value)}
                      />
                      {opt.label}
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
                {formData.issuetype.includes(OTHER_ISSUE_VALUE) && (
                  <TextInput
                    style={{ marginTop: "8px" }}
                    placeholder="Please specify the issue"
                    value={formData.otherIssueText}
                    onChange={handleChange("otherIssueText")}
                  />
                )}
                {errors.issuetype && <ErrorText>{errors.issuetype}</ErrorText>}
                {errors.otherIssueText && <ErrorText>{errors.otherIssueText}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="qr-comments">Comments / Grievance Details *</Label>
                <TextArea
                  id="qr-comments"
                  placeholder="Please describe the issue or feedback in detail..."
                  value={formData.comments}
                  onChange={handleChange("comments")}
                />
                {errors.comments && <ErrorText>{errors.comments}</ErrorText>}
              </FormGroup>

              {employees.length > 0 && (
                <FormGroup>
                  <Label htmlFor="qr-assignedby">Assigned By (Optional)</Label>
                  <Select
                    id="qr-assignedby"
                    value={formData.assignedby}
                    onChange={handleChange("assignedby")}
                  >
                    <option value="">Select employee</option>
                    {employees.map((emp, idx) => (
                      <option key={`${emp.employeeId}-${idx}`} value={emp.employeeId}>
                        {emp.employeeName}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              )}

              <SubmitButton type="submit" disabled={saving}>
                {saving ? "Submitting..." : "Submit Feedback & Grievance"}
              </SubmitButton>
            </form>
          )
        ) : (
          /* ── QR Scan Alone ── */
          <>
            <Title>Feedback & Grievance QR Code</Title>
            <Subtitle>
              Scan this QR code with any smartphone camera to open and submit the Feedback & Grievance form.
            </Subtitle>

            <QRFrame>
              <QRCodeCanvas
                id="qr-canvas-display"
                value={formUrl}
                size={240}
                level="H"
                includeMargin={true}
              />
            </QRFrame>
          </>
        )}
      </Card>

      {toasts.length > 0 &&
        ReactDOM.createPortal(
          <ToastContainer>
            {toasts.map((t) => (
              <ToastItem key={t.id} $type={t.type}>
                {t.message}
              </ToastItem>
            ))}
          </ToastContainer>,
          document.body
        )}
    </Container>
  );
};

export default CustomercomplaintsQRScan;
