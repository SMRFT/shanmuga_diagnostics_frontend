import React, { useState } from "react";
import styled from "styled-components";
import { QRCodeCanvas } from "qrcode.react";

const ACCENT = "#b673c9";
const ACCENT_DARK = "#895697";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fbf7fd 0%, #f1e9f7 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 16px;
  box-sizing: border-box;
  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif;

  @media (max-width: 480px) {
    padding: 16px 12px;
  }
`;

const Card = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 480px;
  border-radius: 20px;
  padding: 40px 32px;
  box-shadow: 0 16px 40px rgba(137, 86, 151, 0.14);
  border: 1px solid rgba(182, 115, 201, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 24px 18px;
    border-radius: 16px;
  }
`;

const BrandBadge = styled.div`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${ACCENT_DARK};
  background: #f6ecfa;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 12px;

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 4px 12px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #2b2230;
  margin: 0 0 8px 0;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6d6473;
  margin: 0 0 24px 0;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 13px;
    margin-bottom: 18px;
  }
`;

const QRFrame = styled.div`
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;
  border: 2px solid #f0e6f5;
  box-shadow: 0 8px 24px rgba(137, 86, 151, 0.08);
  margin-bottom: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  box-sizing: border-box;

  canvas {
    max-width: 100% !important;
    height: auto !important;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 18px;
  }
`;

const InstructionBox = styled.div`
  background: #faf6fc;
  border: 1px solid #eedff5;
  border-radius: 10px;
  padding: 12px 14px;
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 10px 12px;
    margin-bottom: 16px;
  }
`;

const IconCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${ACCENT};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
`;

const InstructionText = styled.div`
  font-size: 13px;
  color: #4a3e52;
  line-height: 1.4;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 12.5px;
  }
`;

const LinkRow = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
  margin-bottom: 20px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const LinkInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #d5dede;
  border-radius: 8px;
  font-size: 13px;
  color: #555;
  background: #fdfbfd;
  min-width: 0;

  &:focus {
    outline: none;
    border-color: ${ACCENT};
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 8px 10px;
  }
`;

const CopyButton = styled.button`
  background: #eef2f2;
  color: ${ACCENT_DARK};
  border: 1px solid #d5dede;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease;
  min-height: 40px;

  &:hover {
    background: #e2ecec;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`;

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const ActionButton = styled.button`
  background: ${(props) => (props.$primary ? ACCENT : "#6c757d")};
  color: #ffffff;
  border: none;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
  min-height: 44px;

  &:hover {
    background: ${(props) => (props.$primary ? ACCENT_DARK : "#5a6268")};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 11px;
  }
`;

const CustomercomplaintsQRScan = () => {
  const [copied, setCopied] = useState(false);

  const formUrl = `${window.location.origin}/FeedbackGrievance`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(formUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById("qr-canvas-display");
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "shanmuga-feedback-qr.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handlePrintQR = () => {
    const canvas = document.getElementById("qr-canvas-display");
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Feedback & Grievance QR Code - Shanmuga Diagnostics</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 40px 20px; margin: 0; }
            .brand { color: #895697; font-size: 20px; font-weight: bold; margin-bottom: 6px; }
            .title { font-size: 22px; color: #222; margin-bottom: 12px; font-weight: bold; }
            .desc { color: #666; font-size: 14px; margin-bottom: 24px; max-width: 400px; margin-left: auto; margin-right: auto; line-height: 1.5; }
            img { width: 260px; height: 260px; }
          </style>
        </head>
        <body>
          <div class="brand">Shanmuga Diagnostics</div>
          <div class="title">Feedback And Grievance</div>
          <div class="desc">Scan this QR code with your mobile camera to submit your feedback or grievance directly.</div>
          <img src="${dataUrl}" />
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Container>
      <Card>
        <BrandBadge>Shanmuga Diagnostics</BrandBadge>
        <Title>Feedback & Grievance QR Code</Title>
        <Subtitle>
          Scan this QR code with any smartphone camera to open and submit the Feedback & Grievance form.
        </Subtitle>

        <QRFrame>
          <QRCodeCanvas
            id="qr-canvas-display"
            value={formUrl}
            size={220}
            level="H"
            includeMargin={true}
          />
        </QRFrame>

        <InstructionBox>
          <IconCircle>📱</IconCircle>
          <InstructionText>
            Open camera on mobile device & point at QR code to open the <strong>Feedback & Grievance</strong> form.
          </InstructionText>
        </InstructionBox>

        <LinkRow>
          <LinkInput type="text" readOnly value={formUrl} />
          <CopyButton type="button" onClick={handleCopyLink}>
            {copied ? "Copied!" : "Copy Link"}
          </CopyButton>
        </LinkRow>

        <ActionRow>
          <ActionButton $primary type="button" onClick={handleDownloadQR}>
            ⬇ Download
          </ActionButton>
          <ActionButton type="button" onClick={handlePrintQR}>
            🖨 Print QR
          </ActionButton>
          <ActionButton
            $primary
            type="button"
            onClick={() => window.open(formUrl, "_blank")}
            style={{ background: "#4e73df" }}
          >
            ↗ Open Form
          </ActionButton>
        </ActionRow>
      </Card>
    </Container>
  );
};

export default CustomercomplaintsQRScan;
