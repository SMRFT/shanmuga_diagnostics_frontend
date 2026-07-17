// ─── PDF generation logic extracted from PatientOverview's handlePrint ────────
// This does not read component state directly — patientDetails, the
// originating patient record, its signatures and the full (unfiltered) test
// list are all passed in by the caller, exactly as before. The caller is
// still responsible for the initial fetch/validation (including the
// Molecular-Biology filtering and the "no test details" early-returns) since
// those paths call toast/setLoading which are tied to the component.

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import JsBarcode from "jsbarcode";
import headerImage from "../../Images/Header.png";
import FooterImage from "../../Images/Footer.png";
import NABLImage from "../../Images/NABL.png";

// patientDetails: already validated + Molecular Biology tests filtered out of testdetails
// patient: the original row/record from the table (used for patient.test_statuses)
// signaturesData: raw signatures array from the API response
// allFetchedTests: patientDetails.testdetails BEFORE Molecular Biology filtering (for the
//                  "Result/s to follow" unapproved-tests comparison)
export const buildPdfDocument = async (
  patientDetails,
  patient,
  signaturesData,
  allFetchedTests,
  withLetterpad = true,
) => {
  // ── NABL SPLIT: separate NABL=true and NABL=false tests ──────────────
  const nablTrueTests = patientDetails.testdetails.filter(
    (t) => t.NABL === true,
  );
  const nablFalseTests = patientDetails.testdetails.filter(
    (t) => t.NABL !== true,
  );
  // We will render NABL=true tests first (pages with NABL logo),
  // then NABL=false tests (pages WITHOUT NABL logo).
  // ──────────────────────────────────────────────────────────────────────

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
    "\\u03bc": "µ",
    "\\u00b5": "µ",
    "\\u00b0": "°",
    "\\u00b1": "±",
    "\\u00b2": "²",
    "\\u00b3": "³",
  };
  const processUnicodeText = (text) => {
    if (!text) return "";
    let t = text;
    t = t.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
      const char = String.fromCharCode(parseInt(hex, 16));
      return unicodeMap[char] || char;
    });
    Object.keys(unicodeMap).forEach((u) => {
      t = t.replace(new RegExp(u, "g"), unicodeMap[u]);
    });
    return t;
  };
  const extractPatientRefNoNumber = (refNo) => {
    if (!refNo) return "N/A";
    return refNo.split("+")[0];
  };
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
  const departmentOrder = [
    "Haematology",
    "Coagulation",
    "Biochemistry",
    "Immunology",
    "Immunoassay",
    "Serology",
    "Clinical Pathology",
    "Clinical Chemistry",
    "Cytology",
    "Genetics",
    "Histopathology",
    "Immunohistochemistry",
    "Microbiology",
    "Molecular Biology",
  ];
  const patientRefNo =
    patientDetails.barcodes?.[0]?.match(/\d+/)?.[0] || "N/A";
  const patientRefNoNumber = extractPatientRefNoNumber(patientRefNo);
  let barcodeImage = null;
  if (patientRefNoNumber !== "N/A") {
    const barcodeCanvas = document.createElement("canvas");
    JsBarcode(barcodeCanvas, patientRefNoNumber, {
      format: "CODE128",
      lineColor: "#000",
      width: 1.5,
      height: 10,
      displayValue: false,
      margin: 0,
    });
    barcodeImage = barcodeCanvas.toDataURL("image/png");
  }
  const leftMargin = 10;
  const rightMargin = leftMargin + 190;
  const contentWidth = rightMargin - leftMargin;
  const headerHeight = 30;
  const footerHeight = 20;
  const contentYStart = headerHeight + 20;
  const signatureHeight = 35;
  const tableHeaderHeight = 10;
  const colWidths = [
    contentWidth * 0.28,
    contentWidth * 0.12,
    contentWidth * 0.05,
    contentWidth * 0.18,
    contentWidth * 0.1,
    contentWidth * 0.27,
    0,
  ];
  const leftDetails = [
    { label: "Patient ID", value: patientDetails.patient_id || "N/A" },
    {
      label: "Name",
      value: patientDetails.patientname || "No name provided",
    },
    {
      label: "Age/Gender",
      value: `${patientDetails.age || "N/A"} ${patientDetails.age_type || ""}/ ${patientDetails.gender || "N/A"}`,
    },
    { label: "Referral", value: patientDetails.refby || "SELF" },
    { label: "Branch", value: patientDetails.branch || "N/A" },
    { label: "Source", value: patientDetails.B2B || "N/A" },
  ];
  const rightDetails = [
    {
      label: "Collected On",
      value:
        format(
          new Date(patientDetails.testdetails[0].samplecollected_time),
          "dd MMM yy / HH:mm",
        ) || "N/A",
    },
    {
      label: "Received On",
      value:
        format(
          new Date(patientDetails.testdetails[0].received_time),
          "dd MMM yy / HH:mm",
        ) || "N/A",
    },
    ...(patientDetails.testdetails[0].dispatch_time &&
      patientDetails.testdetails[0].dispatch_time !== "null"
      ? [
        {
          label: "Released On",
          value: format(
            new Date(patientDetails.testdetails[0].dispatch_time),
            "dd MMM yy / HH:mm",
          ),
        },
      ]
      : []),
    { label: "Printed On", value: format(new Date(), "dd MMM yy / HH:mm") },
    { label: "Patient Ref.No", value: patientRefNoNumber },
  ];
  const calculateMaxLabelWidth = (details) => {
    const tempDoc = new jsPDF();
    return Math.max(
      ...details.map((item) => tempDoc.getTextWidth(item.label)),
    );
  };

  const doc = new jsPDF();
  let pageCount = 1;
  let isTableStarted = false;
  let patientInfoEndY = 0;

  // ── Track which "section" we are currently rendering ─────────────────
  // showNablLogo = true  → pages for NABL=true tests
  // showNablLogo = false → pages for NABL=false tests
  let showNablLogo = nablTrueTests.length > 0; // start with NABL pages if any exist
  // ──────────────────────────────────────────────────────────────────────

  const leftMaxLabelWidth = calculateMaxLabelWidth(leftDetails);
  const rightMaxLabelWidth = calculateMaxLabelWidth(rightDetails);
  const centerPoint = (leftMargin + rightMargin) / 2;
  const leftLabelX = leftMargin;
  const leftColonX = leftLabelX + leftMaxLabelWidth + 2;
  const leftValueX = leftColonX + 3;
  const rightLabelX = centerPoint + 28;
  const rightColonX = rightLabelX + rightMaxLabelWidth + 2;
  const rightValueX = rightColonX + 1;

  const wrapTextAndGetLines = (doc, text, maxWidth) => {
    if (!text) return [];
    return doc.splitTextToSize(text, maxWidth);
  };
  const renderWrappedText = (
    doc,
    text,
    maxWidth,
    startX,
    yPos,
    lineHeight = 4,
  ) => {
    if (!text) return 0;
    const lines = wrapTextAndGetLines(doc, text, maxWidth);
    lines.forEach((line, index) =>
      doc.text(line, startX, yPos + index * lineHeight),
    );
    return lines.length * lineHeight;
  };
  const addPatientInfo = (yPos) => {
    doc.setFontSize(10);
    let patientInfoY = yPos;
    let barcodeBottomY = 0;
    const maxLength = Math.max(leftDetails.length, rightDetails.length);
    for (let i = 0; i < maxLength; i++) {
      const left = leftDetails[i];
      const right = rightDetails[i];
      if (left) {
        doc.setFont("helvetica", "bold");
        doc.text(left.label, leftLabelX, patientInfoY);
        doc.text(":", leftColonX, patientInfoY);
        doc.setFont("helvetica", "normal");
        const maxLeftValueWidth = centerPoint + 25 - leftValueX;
        const leftValueLines = wrapTextAndGetLines(
          doc,
          left.value,
          maxLeftValueWidth,
        );
        leftValueLines.forEach((line, lineIndex) =>
          doc.text(line, leftValueX, patientInfoY + lineIndex * 4),
        );
        var leftRowHeight = leftValueLines.length * 4;
      } else {
        var leftRowHeight = 5;
      }
      if (right) {
        doc.setFont("helvetica", "bold");
        doc.text(right.label, rightLabelX, patientInfoY);
        doc.text(":", rightColonX, patientInfoY);
        doc.setFont("helvetica", "normal");
        doc.text(right.value, rightValueX, patientInfoY);
        if (
          right.label === "Patient Ref.No" &&
          patientRefNoNumber !== "N/A" &&
          barcodeImage
        ) {
          const barcodeY = patientInfoY + 4;
          doc.addImage(
            barcodeImage,
            "PNG",
            rightValueX + doc.getTextWidth(right.value) - 10,
            barcodeY,
            25,
            10,
          );
          barcodeBottomY = barcodeY + 10;
        }
      }
      patientInfoY += Math.max(leftRowHeight, 5);
    }
    return Math.max(patientInfoY, barcodeBottomY);
  };

  // ── addHeaderFooter now accepts a boolean: whether to show NABL logo ──
  const addHeaderFooter = (withNabl = false) => {
    if (withLetterpad) {
      doc.addImage(
        headerImage,
        "PNG",
        0,
        10,
        doc.internal.pageSize.width,
        headerHeight,
      );
      // ── Place NABL logo beside NABH logo (≈2 inches = 50.8 mm from right) ──
      if (withNabl && NABLImage) {
        // nablLogoImage is the imported/loaded NABL png (see note below)
        const nablLogoWidth = 20; // adjust as needed (mm)
        const nablLogoHeight = 20;
        const nablLogoX = doc.internal.pageSize.width - 45 - nablLogoWidth;
        const nablLogoY = 14; // vertically centred in header band
        doc.addImage(
          NABLImage,
          "PNG",
          nablLogoX,
          nablLogoY,
          nablLogoWidth,
          nablLogoHeight,
        );
      }
      doc.addImage(
        FooterImage,
        "PNG",
        0,
        doc.internal.pageSize.height - footerHeight,
        doc.internal.pageSize.width,
        footerHeight,
      );
    } else {
      // Without letterpad – still overlay NABL logo at the same position
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(255, 255, 255);
      doc.text("Header Space", leftMargin, 10);
      doc.setTextColor(0, 0, 0);
      if (withNabl && NABLImage) {
        const nablLogoWidth = 25;
        const nablLogoHeight = 25;
        const nablLogoX = doc.internal.pageSize.width - 30 - nablLogoWidth;
        const nablLogoY = 5;
        doc.addImage(
          NABLImage,
          "PNG",
          nablLogoX,
          nablLogoY,
          nablLogoWidth,
          nablLogoHeight,
        );
      }
    }
  };
  // ──────────────────────────────────────────────────────────────────────

  const renderUnicodeText = (text, x, y, options = {}) => {
    const processedText = processUnicodeText(text);
    if (processedText.includes("µ")) {
      const parts = processedText.split("µ");
      let currentX = x;
      parts.forEach((part, index) => {
        if (index > 0) {
          doc.setFont("helvetica", options.fontStyle || "normal");
          doc.text("µ", currentX, y);
          currentX += doc.getTextWidth("µ");
        }
        if (part) {
          doc.text(part, currentX, y);
          currentX += doc.getTextWidth(part);
        }
      });
    } else {
      doc.text(processedText, x, y);
    }
  };
  const renderValueWithSuperscript = (
    doc,
    text,
    x,
    y,
    maxWidth = null,
    lineHeight = 4,
  ) => {
    if (!text) return 0;

    const lines = maxWidth ? doc.splitTextToSize(text, maxWidth) : text.split("\n");
    let currentY = y;
    let totalHeight = 0;

    lines.forEach((lineText) => {
      const superscriptRegex = /(\d+[xX×]?\d*)\^(-?\d+)/;
      const match = lineText.match(superscriptRegex);

      if (!match) {
        doc.text(lineText, x, currentY);
      } else {
        const before = lineText.slice(0, match.index);
        const base = match[1].replace(/[xX]/, "×");
        const exponent = match[2];
        const after = lineText.slice(match.index + match[0].length);

        let currentX = x;
        const normalSize = doc.getFontSize();

        if (before) {
          doc.text(before, currentX, currentY);
          currentX += doc.getTextWidth(before);
        }

        doc.text(base, currentX, currentY);
        currentX += doc.getTextWidth(base);

        doc.setFontSize(7);
        doc.text(exponent, currentX, currentY - 2);
        currentX += doc.getTextWidth(exponent);
        doc.setFontSize(normalSize);

        if (after) {
          doc.text(after, currentX, currentY);
        }
      }
      currentY += lineHeight;
      totalHeight += lineHeight;
    });

    return totalHeight;
  };
  const drawTableHeader = (yPos) => {
    doc.line(leftMargin, yPos, rightMargin, yPos);
    yPos += 5;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const headers = [
      "Test",
      "Specimen",
      "",
      "Result",
      "Units",
      "Reference Range / Method",
      "",
    ];
    let xPos = leftMargin;
    headers.forEach((header, index) => {
      if (header) doc.text(header, xPos, yPos);
      xPos += colWidths[index];
    });
    yPos += 3;
    doc.line(leftMargin, yPos, rightMargin, yPos);
    yPos += 5;
    return yPos;
  };
  const addSignatures = () => {
    const pageHeight = doc.internal.pageSize.height;
    const signaturesY = pageHeight - footerHeight - signatureHeight - 2;
    const signatureWidth = 35;
    if (activeConsultants.length === 0) return;
    const startX = rightMargin - activeConsultants.length * 60;
    activeConsultants.forEach((consultant, index) => {
      const xPosition = startX + index * 60;
      if (consultant[2])
        doc.addImage(
          consultant[2],
          "PNG",
          xPosition,
          signaturesY,
          signatureWidth,
          15,
        );
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(consultant[0], xPosition, signaturesY + 20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(consultant[1], xPosition, signaturesY + 25);
    });
  };
  const checkForNewPage = (yPos, estimatedHeight) => {
    const pageHeight = doc.internal.pageSize.height;
    const footerStart = pageHeight - (footerHeight + signatureHeight - 1);
    if (yPos + estimatedHeight >= footerStart) {
      addSignatures();
      doc.addPage();
      pageCount++;
      addHeaderFooter(showNablLogo); // ← pass current NABL flag
      let newYPos = contentYStart;
      newYPos = addPatientInfo(newYPos);
      newYPos += 12;
      if (isTableStarted) newYPos = drawTableHeader(newYPos);
      return newYPos;
    }
    return yPos;
  };
  const getHighLowStatus = (value, reference) => {
    if (!value || !reference) return null;
    const numValue = Number.parseFloat(value);
    if (isNaN(numValue)) return null;
    if (reference.includes("-")) {
      const [min, max] = reference
        .split("-")
        .map((v) => Number.parseFloat(v));
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
  const drawArrowSymbol = (doc, x, y, direction) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    if (direction === "up") {
      doc.line(x, y, x + 1, y - 1);
      doc.line(x + 1, y - 1, x + 2, y);
      doc.line(x + 1, y - 1, x + 1, y + 2);
    } else if (direction === "down") {
      doc.line(x, y, x + 1, y + 1);
      doc.line(x + 1, y + 1, x + 2, y);
      doc.line(x + 1, y + 1, x + 1, y - 2);
    }
  };

  // ── helper: render one ordered list of tests onto the PDF ────────────
  const renderTestGroup = (testsToRender, yPos) => {
    if (!testsToRender.length) return yPos;

    isTableStarted = true;
    yPos = checkForNewPage(yPos, tableHeaderHeight);
    yPos = drawTableHeader(yPos);

    const testsByDepartment = testsToRender.reduce((acc, test) => {
      (acc[test.department] = acc[test.department] || []).push(test);
      return acc;
    }, {});
    const sortedDepartments = Object.keys(testsByDepartment).sort(
      (a, b) => {
        const iA = departmentOrder.indexOf(a);
        const iB = departmentOrder.indexOf(b);
        if (iA !== -1 && iB !== -1) return iA - iB;
        if (iA !== -1) return -1;
        if (iB !== -1) return 1;
        return a.localeCompare(b);
      },
    );

    sortedDepartments.forEach((department) => {
      const verifiedBySet = new Set();
      testsByDepartment[department].forEach((test) => {
        if (test.verified_by && test.verified_by.trim() !== "")
          verifiedBySet.add(test.verified_by);
      });
      const hasMultipleVerifiers = verifiedBySet.size > 1;

      testsByDepartment[department].forEach((test, testIndex) => {
        if (testIndex === 0) {
          yPos = checkForNewPage(yPos, 15);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          const textWidth = doc.getTextWidth(department.toUpperCase());
          const centerX = leftMargin + contentWidth / 2;
          doc.text(department.toUpperCase(), centerX, yPos, {
            align: "center",
          });
          doc.line(
            centerX - textWidth / 2,
            yPos + 2,
            centerX + textWidth / 2,
            yPos + 2,
          );
          yPos += 10;
        }

        const parametersBySubtitle = {};
        if (test.parameters && test.parameters.length > 0) {
          test.parameters.forEach((param) => {
            const subtitle = param.sub_title || "";
            if (!parametersBySubtitle[subtitle])
              parametersBySubtitle[subtitle] = [];
            parametersBySubtitle[subtitle].push(param);
          });
        }

        yPos = checkForNewPage(yPos, 20);
        doc.setFontSize(10);
        const testNameText = test.testname;
        const valueText = test.value || "";
        const methodText = (test.method || "")
          .replace(/\bMethod\b/i, "")
          .trim();
        const hasParameters = test.parameters && test.parameters.length > 0;
        const testNameWidth = hasParameters ? contentWidth - 2 : colWidths[0] - 2;
        const testNameLines = wrapTextAndGetLines(
          doc,
          testNameText,
          testNameWidth,
        );
        const valueLines = wrapTextAndGetLines(
          doc,
          valueText,
          colWidths[3] - 2,
        );
        const refMethodText = [test.reference_range, methodText].filter(p => p && p.trim() !== "").join(" / ");
        const refMethodLines = wrapTextAndGetLines(
          doc,
          refMethodText,
          colWidths[5] - 2,
        );
        const maxLines = Math.max(
          testNameLines.length,
          valueLines.length,
          refMethodLines.length,
        );
        const lineHeight = 4.5;
        const actualRowHeight = maxLines * lineHeight + 2;

        yPos = checkForNewPage(yPos, actualRowHeight);
        let xPos = leftMargin;
        doc.setFont("helvetica", "bold");
        renderWrappedText(
          doc,
          testNameText,
          testNameWidth,
          xPos,
          yPos,
          lineHeight,
        );
        xPos += colWidths[0];
        doc.setFont("helvetica", "normal");
        doc.text(test.specimen_type || "", xPos, yPos);
        xPos += colWidths[1];
        xPos += colWidths[2];
        const statusIndicator = test.isHigh
          ? "H"
          : test.isLow
            ? "L"
            : getHighLowStatus(valueText, test.reference_range);
        if (statusIndicator) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(
            statusIndicator === "H" ? 255 : 0,
            0,
            statusIndicator === "L" ? 255 : 0,
          );
          renderValueWithSuperscript(
            doc,
            valueText,
            xPos,
            yPos,
            colWidths[3] - 5,
            lineHeight,
          );
          const valueWidth = doc.getTextWidth(valueText);
          if (valueWidth < colWidths[3] - 5)
            drawArrowSymbol(
              doc,
              xPos + valueWidth + 2,
              yPos - 1,
              statusIndicator === "H" ? "up" : "down",
            );
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
        } else {
          renderValueWithSuperscript(
            doc,
            valueText,
            xPos,
            yPos,
            colWidths[3] - 2,
            lineHeight,
          );
        }
        xPos += colWidths[3];
        renderUnicodeText(test.unit || "", xPos, yPos);
        xPos += colWidths[4];
        renderWrappedText(
          doc,
          refMethodText,
          colWidths[5] - 2,
          xPos,
          yPos,
          lineHeight,
        );
        yPos += actualRowHeight + (hasParameters ? 1.5 : 3.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        if (test.outsourced === true) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8);
          yPos = checkForNewPage(yPos, 4);
          doc.text("(Outsourced)", leftMargin, yPos);
          yPos += 4;
        }
        if (!test.parameters || test.parameters.length === 0) {
          if (test.comment && test.comment.trim() !== "") {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(8);
            const commentLines = wrapTextAndGetLines(doc, `Comment: ${test.comment}`, contentWidth);
            yPos = checkForNewPage(yPos, commentLines.length * 3.5 + 2);
            const commentHeight = renderWrappedText(
              doc,
              `Comment: ${test.comment}`,
              contentWidth,
              leftMargin,
              yPos,
              3.5,
            );
            yPos += commentHeight + 2;
          }
          if (test.notes && test.notes.trim() !== "") {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(8);
            const notesLines = wrapTextAndGetLines(doc, `Notes: ${test.notes}`, contentWidth);
            yPos = checkForNewPage(yPos, notesLines.length * 3.5 + 2);
            const notesHeight = renderWrappedText(
              doc,
              `Notes: ${test.notes}`,
              contentWidth,
              leftMargin,
              yPos,
              3.5,
            );
            yPos += notesHeight + 2;
          }
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        Object.keys(parametersBySubtitle).forEach((subtitle) => {
          if (subtitle && subtitle.trim() !== "") {
            yPos = checkForNewPage(yPos, 25);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.text(subtitle, leftMargin, yPos);
            yPos += 6;
          }
          parametersBySubtitle[subtitle].forEach((currentTest) => {
            doc.setFontSize(10);
            const paramNameText = currentTest.name;
            const paramValueText = currentTest.value || "";
            const paramMethodText = (currentTest.method || "")
              .replace(/\bMethod\b/i, "")
              .trim();
            const paramNameLines = wrapTextAndGetLines(
              doc,
              paramNameText,
              colWidths[0] - 2,
            );
            const paramValueLines = wrapTextAndGetLines(
              doc,
              paramValueText,
              colWidths[3] - 2,
            );
            const paramRefMethodText = [currentTest.reference_range, paramMethodText].filter(p => p && p.trim() !== "").join(" / ");
            const paramRefMethodLines = wrapTextAndGetLines(
              doc,
              paramRefMethodText,
              colWidths[5] - 2,
            );
            const paramMaxLines = Math.max(
              paramNameLines.length,
              paramValueLines.length,
              paramRefMethodLines.length,
            );
            const paramLineHeight = 4.5;
            const paramRowHeight = paramMaxLines * paramLineHeight + 2;
            yPos = checkForNewPage(yPos, paramRowHeight);
            let xPos = leftMargin;
            doc.setFont("helvetica", "normal");
            renderWrappedText(
              doc,
              paramNameText,
              colWidths[0] - 2,
              xPos,
              yPos,
              paramLineHeight,
            );
            xPos += colWidths[0];
            doc.text(currentTest.specimen_type || "", xPos, yPos);
            xPos += colWidths[1];
            xPos += colWidths[2];
            const paramStatus = currentTest.isHigh
              ? "H"
              : currentTest.isLow
                ? "L"
                : getHighLowStatus(
                  paramValueText,
                  currentTest.reference_range,
                );
            if (paramStatus) {
              doc.setFont("helvetica", "bold");
              doc.setTextColor(
                paramStatus === "H" ? 255 : 0,
                0,
                paramStatus === "L" ? 255 : 0,
              );
              renderValueWithSuperscript(
                doc,
                paramValueText,
                xPos,
                yPos,
                colWidths[3] - 5,
                paramLineHeight,
              );
              const paramValueWidth = doc.getTextWidth(paramValueText);
              if (paramValueWidth < colWidths[3] - 5)
                drawArrowSymbol(
                  doc,
                  xPos + paramValueWidth + 2,
                  yPos - 1,
                  paramStatus === "H" ? "up" : "down",
                );
              doc.setTextColor(0, 0, 0);
              doc.setFont("helvetica", "normal");
            } else {
              renderValueWithSuperscript(
                doc,
                paramValueText,
                xPos,
                yPos,
                colWidths[3] - 2,
                paramLineHeight,
              );
            }
            xPos += colWidths[3];
            renderUnicodeText(currentTest.unit || "", xPos, yPos);
            xPos += colWidths[4];
            renderWrappedText(
              doc,
              paramRefMethodText,
              colWidths[5] - 2,
              xPos,
              yPos,
              paramLineHeight,
            );
            yPos += paramRowHeight;

            if (currentTest.comment && currentTest.comment.trim() !== "") {
              doc.setFont("helvetica", "italic");
              doc.setFontSize(8);
              const commentLines = wrapTextAndGetLines(
                doc,
                `Comment: ${currentTest.comment}`,
                contentWidth
              );
              yPos = checkForNewPage(yPos, commentLines.length * 3.5 + 2);
              const paramCommentHeight = renderWrappedText(
                doc,
                `Comment: ${currentTest.comment}`,
                contentWidth,
                leftMargin,
                yPos,
                3.5,
              );
              yPos += paramCommentHeight + 2;
            }
            if (currentTest.notes && currentTest.notes.trim() !== "") {
              doc.setFont("helvetica", "italic");
              doc.setFontSize(8);
              const notesLines = wrapTextAndGetLines(doc, `Notes: ${currentTest.notes}`, contentWidth);
              yPos = checkForNewPage(yPos, notesLines.length * 3.5 + 2);
              const notesHeight = renderWrappedText(
                doc,
                `Notes: ${currentTest.notes}`,
                contentWidth,
                leftMargin,
                yPos,
                3.5,
              );
              yPos += notesHeight + 2;
            }
            yPos += 1;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
          });
        });

        if (test.parameters && test.parameters.length > 0 && test.notes && test.notes.trim() !== "") {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8);
          const testNotesLines = wrapTextAndGetLines(doc, `Notes: ${test.notes}`, contentWidth);
          yPos = checkForNewPage(yPos, testNotesLines.length * 3.5 + 2);
          const testNotesHeight = renderWrappedText(
            doc,
            `Notes: ${test.notes}`,
            contentWidth,
            leftMargin,
            yPos,
            3.5,
          );
          yPos += testNotesHeight + 2;
        }

        if (
          hasMultipleVerifiers &&
          test.verified_by &&
          test.verified_by.trim() !== ""
        ) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.text(`Verified by: ${test.verified_by}`, leftMargin, yPos);
          yPos += 5;
        }
      });

      if (!hasMultipleVerifiers && verifiedBySet.size > 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(
          `Verified by: ${Array.from(verifiedBySet).join(", ")}`,
          leftMargin,
          yPos,
        );
        yPos += 5;
      }
      const isLastDept =
        department === sortedDepartments[sortedDepartments.length - 1];
      yPos += isLastDept ? 2 : 4;
    });

    return yPos;
  };
  // ──────────────────────────────────────────────────────────────────────

  // ── FIRST PAGE: always starts with NABL logo state = nablTrueTests exist ─
  addHeaderFooter(showNablLogo);
  let currentYPosition = addPatientInfo(contentYStart);
  patientInfoEndY = currentYPosition;
  currentYPosition += 12;

  // ── Render NABL=true tests (with logo) ───────────────────────────────
  if (nablTrueTests.length > 0) {
    currentYPosition = renderTestGroup(nablTrueTests, currentYPosition);
  }

  // ── Switch to non-NABL section ────────────────────────────────────────
  if (nablFalseTests.length > 0) {
    // If we already have NABL=true tests rendered, start a new page for false tests
    if (nablTrueTests.length > 0) {
      addSignatures();
      showNablLogo = false; // ← flip the flag BEFORE adding the new page
      doc.addPage();
      pageCount++;
      addHeaderFooter(false); // no NABL logo
      currentYPosition = contentYStart;
      currentYPosition = addPatientInfo(currentYPosition);
      currentYPosition += 12;
    } else {
      // No NABL=true tests at all – first (and only) section, no logo
      showNablLogo = false;
    }
    currentYPosition = renderTestGroup(nablFalseTests, currentYPosition);
  }

  isTableStarted = false;

  const ensureSpaceForFooter = (currentYPosition) => {
    const pageHeight = doc.internal.pageSize.height;
    const footerStart = pageHeight - (footerHeight + signatureHeight - 1);
    if (currentYPosition + 5 >= footerStart) {
      addSignatures();
      doc.addPage();
      pageCount++;
      addHeaderFooter(showNablLogo);
      return addPatientInfo(contentYStart) + 12;
    }
    return currentYPosition;
  };
  currentYPosition = ensureSpaceForFooter(currentYPosition);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const centerX = leftMargin + contentWidth / 2;
  doc.text("**End of the Report**", centerX, currentYPosition, {
    align: "center",
  });
  currentYPosition += 6;

  const allTestStatuses = patient.test_statuses || [];
  const unapprovedTests = allTestStatuses.filter((hmsTest) => {
    return !allFetchedTests.some((fetchedTest) => fetchedTest.test_id === hmsTest.test_id);
  });

  if (unapprovedTests.length > 0) {
    currentYPosition = checkForNewPage(currentYPosition, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Result/s to follow:", leftMargin, currentYPosition);
    currentYPosition += 4.5;

    doc.setFont("helvetica", "normal");
    unapprovedTests.forEach((t) => {
      currentYPosition = checkForNewPage(currentYPosition, 5);
      doc.text(`- ${t.test_name}`, leftMargin + 2, currentYPosition);
      currentYPosition += 4.5;
    });
  }

  addSignatures();

  // ── Page numbering ────────────────────────────────────────────────────
  const finalPageCount = pageCount;
  const barcodeX = rightValueX + doc.getTextWidth(patientRefNoNumber) - 10;
  const pageNumberX = barcodeX + 12.5; // Centered under the barcode
  for (let i = 1; i <= finalPageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${finalPageCount}`,
      pageNumberX,
      patientInfoEndY + 4,
      { align: "center" },
    );
  }

  return doc;
};
