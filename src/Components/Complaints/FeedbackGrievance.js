import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  ISSUE_TYPE_OPTIONS,
  OTHER_ISSUE_VALUE,
} from "../Constantdata/Customercomplaintconstants";

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

const ACCENT = "#b673c9";
const ACCENT_DARK = "#895697";

const initialFormData = {
  labname: "",
  patientId: "",
  issuetype: [],
  otherIssueText: "",
  comments: "",
};

// ── Styled Components ───────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fbf7fd 0%, #f1e9f7 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 16px;
  box-sizing: border-box;
  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif;

  @media (max-width: 600px) {
    padding: 16px 10px;
  }
`;

const Card = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 580px;
  border-radius: 20px;
  padding: 36px 32px;
  box-shadow: 0 16px 40px rgba(137, 86, 151, 0.14);
  border: 1px solid rgba(182, 115, 201, 0.25);
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 24px 16px;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(137, 86, 151, 0.1);
  }
`;

const HeaderBox = styled.div`
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid #f2e9f6;

  @media (max-width: 600px) {
    margin-bottom: 18px;
    padding-bottom: 14px;
  }
`;

const BrandBadge = styled.div`
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${ACCENT_DARK};
  background: #f6ecfa;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    font-size: 11px;
    padding: 4px 12px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #2b2230;
  margin: 0 0 8px 0;

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6d6473;
  margin: 0;
  line-height: 1.5;

  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;

  @media (max-width: 600px) {
    margin-bottom: 15px;
  }
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #4a3e52;
  margin-bottom: 6px;

  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const TextInput = styled.input`
  padding: 12px 14px;
  border: 1px solid #d5dede;
  border-radius: 8px;
  font-size: 15px;
  color: #333;
  background: #fff;
  box-sizing: border-box;
  width: 100%;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${ACCENT};
    box-shadow: 0 0 0 3px rgba(182, 115, 201, 0.15);
  }

  &::placeholder {
    color: #a4b3b3;
  }

  @media (max-width: 600px) {
    font-size: 16px; /* Prevents auto-zoom on iOS */
    padding: 11px 12px;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 14px;
  border: 1px solid #d5dede;
  border-radius: 8px;
  font-size: 15px;
  color: #333;
  background: #fff;
  min-height: 95px;
  resize: vertical;
  box-sizing: border-box;
  width: 100%;
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

  @media (max-width: 600px) {
    font-size: 16px; /* Prevents auto-zoom on iOS */
    min-height: 85px;
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  background: #fdfbfd;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #efe8f2;
  transition: background 0.15s ease, border-color 0.15s ease;
  user-select: none;
  min-height: 42px;
  box-sizing: border-box;

  &:hover {
    background: #f7eff9;
    border-color: #dfcae6;
  }

  input {
    accent-color: ${ACCENT_DARK};
    cursor: pointer;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    font-size: 13.5px;
    padding: 10px 12px;
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
  min-height: 48px;

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

  @media (max-width: 600px) {
    font-size: 15px;
    padding: 13px;
  }
`;

const SuccessBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 12px;

  @media (max-width: 600px) {
    padding: 20px 8px;
  }
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

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
    font-size: 32px;
    margin-bottom: 16px;
  }
`;

const SuccessTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #2b2230;
  margin: 0 0 10px 0;

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const SuccessMessage = styled.p`
  font-size: 15px;
  color: #555;
  line-height: 1.6;
  max-width: 420px;
  margin: 0 0 28px 0;

  @media (max-width: 600px) {
    font-size: 14px;
    margin-bottom: 22px;
  }
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
  min-height: 44px;

  &:hover {
    background: ${ACCENT_DARK};
  }

  @media (max-width: 600px) {
    width: 100%;
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
    left: 14px;
    right: 14px;
    top: 14px;
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

  @media (max-width: 480px) {
    max-width: 100%;
    min-width: 0;
  }
`;

// ── Main Component ─────────────────────────────────────────────────────

const FeedbackGrievance = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
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
    if (!formData.labname.trim()) {
      newErrors.labname = "Lab Name is required";
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
        labname: formData.labname.trim(),
        patient_id: formData.patientId.trim() || null,
        issuetype: issuetypeString,
        comments: formData.comments.trim(),
      };

      const response = await fetch(`${Labbaseurl}customer_complaints_qr_scan/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        showToast(resData?.error || "Failed to submit. Please try again.", "error");
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
      <Card>
        <HeaderBox>
          <BrandBadge>Shanmuga Diagnostics</BrandBadge>
          <Title>Feedback And Grievance</Title>
          <Subtitle>
            We value your feedback. Please fill in the details below to submit your feedback or grievance.
          </Subtitle>
        </HeaderBox>

        {submitted ? (
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
                setSubmitted(false);
              }}
            >
              Submit Another Response
            </ResetButton>
          </SuccessBox>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* 1. Lab Name */}
            <FormGroup>
              <Label htmlFor="fb-labname">Lab Name *</Label>
              <TextInput
                id="fb-labname"
                type="text"
                placeholder="Enter Lab Name"
                value={formData.labname}
                onChange={handleChange("labname")}
              />
              {errors.labname && <ErrorText>{errors.labname}</ErrorText>}
            </FormGroup>

            {/* 2. Patient ID (Optional) */}
            <FormGroup>
              <Label htmlFor="fb-patientid">Patient ID (Optional)</Label>
              <TextInput
                id="fb-patientid"
                type="text"
                placeholder="Enter Patient ID if applicable"
                value={formData.patientId}
                onChange={handleChange("patientId")}
              />
            </FormGroup>

            {/* 3. Issue Type */}
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
                    <span>{opt.label}</span>
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

            {/* 4. Comments */}
            <FormGroup>
              <Label htmlFor="fb-comments">Comments / Grievance Details *</Label>
              <TextArea
                id="fb-comments"
                placeholder="Please describe your feedback or grievance in detail..."
                value={formData.comments}
                onChange={handleChange("comments")}
              />
              {errors.comments && <ErrorText>{errors.comments}</ErrorText>}
            </FormGroup>

            <SubmitButton type="submit" disabled={saving}>
              {saving ? "Submitting..." : "Submit Feedback & Grievance"}
            </SubmitButton>
          </form>
        )}
      </Card>

      {toasts.length > 0 && (
        <ToastContainer>
          {toasts.map((t) => (
            <ToastItem key={t.id} $type={t.type}>
              {t.message}
            </ToastItem>
          ))}
        </ToastContainer>
      )}
    </Container>
  );
};

export default FeedbackGrievance;
