// ─── PDF generation logic extracted from CHCReport ────────────────────────────
// These functions do not read component state directly — all inputs they need
// (patientDetails, activeConsultants, withLetterpad, preProcessedFiles, etc.)
// are passed in as arguments by the caller, exactly as before.

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import { pdfjsLib } from "../../../utils/pdfUtils";
import apiRequest from "../../Auth/apiRequest";
import headerImage from "../../Images/Header.png";
import FooterImage from "../../Images/Footer.png";
import NABLImage from "../../Images/NABL.png";
import Muhsina from "../../Images/Muhsina.png";
import drarun from "../../Images/drarun.png";
import DRPS from "../../Images/DRPS.png";

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

// ─── PDF utilities ────────────────────────────────────────────────────────
// Worker config now lives in src/utils/pdfUtils.js (set once on import).

// OPTIMIZED: scale 1.5 + JPEG + parallel page rendering
export const convertPdfToImages = async (base64Data) => {
  try {
    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "").trim();
    const binaryString = atob(cleanBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++)
      bytes[i] = binaryString.charCodeAt(i);

    const loadingTask = pdfjsLib.getDocument({ data: bytes });
    const pdf = await loadingTask.promise;

    // Render all pages in parallel
    const pagePromises = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      pagePromises.push(
        (async (num) => {
          const page = await pdf.getPage(num);
          const viewport = page.getViewport({ scale: 1.5 }); // was 2.0 — 44% fewer pixels
          const canvas = document.createElement("canvas");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({
            canvasContext: canvas.getContext("2d"),
            viewport,
          }).promise;
          return canvas.toDataURL("image/jpeg", 0.85); // JPEG: 60-80% smaller than PNG
        })(pageNum),
      );
    }
    const results = await Promise.all(pagePromises);
    return results.map((dataUri) => ({ dataUri, format: "JPEG" }));
  } catch (error) {
    console.error("Error converting PDF to images:", error);
    return [];
  }
};

export const fetchInvestigationFile = async (fileId) => {
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

// NEW: Pre-convert all PDF files → images BEFORE PDF generation starts
// This separates I/O (slow) from PDF building (CPU) so both can be parallelized
export const preProcessInvestigationFiles = async (
  investigationFiles,
  chcTestsForFiles,
) => {
  const processed = {};
  await Promise.all(
    chcTestsForFiles.map(async (test) => {
      const testEntry = investigationFiles[test.test_id];
      if (!testEntry) return;

      const testNameLower = (test.testname || "").toLowerCase();
      const isOphthal =
        testNameLower.includes("optho") ||
        testNameLower.includes("ophth") ||
        test.test_id === "CHCT001";
      if (isOphthal) return;

      const processedImages = [];
      if (testEntry.files?.length > 0) {
        await Promise.all(
          testEntry.files.map(async (file) => {
            if (!file?.data) return;
            const contentType = file.contentType || "";
            const filename = (file.filename || "").toLowerCase();
            const isPDF =
              contentType.includes("pdf") || filename.endsWith(".pdf");
            if (isPDF) {
              const imgs = await convertPdfToImages(file.data);
              imgs.forEach((img) => processedImages.push(img));
            } else {
              let fmt = "PNG";
              if (
                contentType.includes("jpeg") ||
                contentType.includes("jpg") ||
                filename.endsWith(".jpg") ||
                filename.endsWith(".jpeg")
              )
                fmt = "JPEG";
              processedImages.push({
                dataUri: `data:${contentType || "image/png"};base64,${file.data}`,
                format: fmt,
              });
            }
          }),
        );
      }
      processed[test.test_id] = { ...testEntry, processedImages };
    }),
  );
  return processed;
};

// ─── buildPdfDocument ─────────────────────────────────────────────────────
// 4th param preProcessedFiles: if provided, addInvestigationFiles uses pre-rendered
// images instead of converting on-the-fly (used in batch mode)
export const buildPdfDocument = async (
  patientDetails,
  activeConsultants = [],
  withLetterpad = true,
  preProcessedFiles = null, // NEW param
) => {
  const doc = new jsPDF();
  let pageCount = 1;
  const leftMargin = 15;
  const rightMargin = leftMargin + 180;
  const contentWidth = rightMargin - leftMargin;
  const headerHeight = 25;
  const footerHeight = 15;
  let currentYPosition = headerHeight + 10;

  const unicodeMap = {
    μ: "µ",
    "×": "x",
    "÷": "/",
    "°": "°",
    "±": "±",
    "²": "²",
    "³": "³",
  };

  const processUnicodeText = (text) => {
    if (!text) return "";
    let t = text;
    t = t.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
      const ch = String.fromCharCode(parseInt(hex, 16));
      return unicodeMap[ch] || ch;
    });
    Object.keys(unicodeMap).forEach((k) => {
      t = t.replace(new RegExp(k, "g"), unicodeMap[k]);
    });
    return t;
  };

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
    lines.forEach((line, index) => {
      doc.text(line, startX, yPos + index * lineHeight);
    });
    return lines.length * lineHeight;
  };

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

  const billingOrder = patientDetails.test_names
    ? patientDetails.test_names.split(",").map((name) => name.trim().toUpperCase())
    : [];

  const findBillingIndex = (testName) => {
    if (!testName || !billingOrder.length) return -1;
    const cleanName = testName.trim().toUpperCase();

    let idx = billingOrder.indexOf(cleanName);
    if (idx !== -1) return idx;

    const normName = cleanName.replace(/[^A-Z0-9]/g, "");
    idx = billingOrder.findIndex(boName => {
      const normBo = boName.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
      return normBo.includes(normName) || normName.includes(normBo);
    });
    if (idx !== -1) return idx;

    const words = cleanName.split(/[^A-Z0-9]/).filter(w => w.length >= 4);
    if (words.length > 0) {
      idx = billingOrder.findIndex(boName => {
        const boClean = boName.trim().toUpperCase();
        return words.some(word => boClean.includes(word));
      });
      if (idx !== -1) return idx;
    }

    return -1;
  };

  const sortTestsByBillingOrder = (testsArray, getNameFn) => {
    if (!testsArray || !testsArray.length || !billingOrder.length) return;
    testsArray.sort((a, b) => {
      let indexA = findBillingIndex(getNameFn(a));
      let indexB = findBillingIndex(getNameFn(b));

      if (indexA === -1) indexA = 999;
      if (indexB === -1) indexB = 999;

      return indexA - indexB;
    });
  };

  // Sort both testdetails and chc_tests_for_files
  sortTestsByBillingOrder(patientDetails.testdetails, (t) => t.testname || "");
  sortTestsByBillingOrder(patientDetails.chc_tests_for_files, (t) => t.testname || "");

  const safeFormatDate = (dateStr, formatStr, fallback = "N/A") => {
    try {
      if (!dateStr) return fallback;
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return fallback;
      return format(date, formatStr);
    } catch (e) {
      return fallback;
    }
  };

  const drawArrowSymbol = (doc, x, y, direction) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    if (direction === "up") {
      doc.line(x, y, x + 1, y - 1);
      doc.line(x + 1, y - 1, x + 2, y);
      doc.line(x + 1, y - 1, x + 1, y + 2);
    } else {
      doc.line(x, y, x + 1, y + 1);
      doc.line(x + 1, y + 1, x + 2, y);
      doc.line(x + 1, y + 1, x + 1, y - 2);
    }
  };

  const addHeaderFooter = (withNabl = false) => {
    if (withLetterpad) {
      doc.addImage(
        headerImage,
        "PNG",
        0,
        5,
        doc.internal.pageSize.width,
        headerHeight,
      );
      doc.addImage(
        FooterImage,
        "PNG",
        0,
        doc.internal.pageSize.height - footerHeight,
        doc.internal.pageSize.width,
        footerHeight,
      );
    }
    if (withNabl && NABLImage) {
      const nablLogoWidth = 20,
        nablLogoHeight = 20;
      const nablLogoX = doc.internal.pageSize.width - 45 - nablLogoWidth;
      doc.addImage(
        NABLImage,
        "PNG",
        nablLogoX,
        7,
        nablLogoWidth,
        nablLogoHeight,
      );
    }
  };

  const checkForNewPage = (yPos, estimatedHeight) => {
    const pageHeight = doc.internal.pageSize.height;
    if (yPos + estimatedHeight >= pageHeight - footerHeight - 30) {
      doc.addPage();
      pageCount++;
      addHeaderFooter(false);
      return headerHeight + 10;
    }
    return yPos;
  };

  const addMedicalExaminationHeader = (yPos) => {
    yPos += 15;
    doc.setFontSize(10);
    const leftCol = [
      { label: "Employee ID", value: patientDetails.patient_id || "N/A" },
      { label: "Employee Name", value: patientDetails.patientname || "N/A" },
      {
        label: "Age / Sex",
        value: `${patientDetails.age || "N/A"} / ${patientDetails.gender || "N/A"}`,
      },
    ];
    const rightCol = [
      {
        label: "Date",
        value: safeFormatDate(new Date().toISOString(), "dd/MM/yyyy"),
      },
      {
        label: "Approved Date",
        value: safeFormatDate(
          patientDetails.final_assessment?.approved_date ||
          patientDetails.testdetails?.[0]?.approve_time,
          "dd/MM/yyyy",
        ),
      },
      { label: "Ref. By", value: patientDetails.company_name || "N/A" },
      { label: "Barcode", value: patientDetails.barcode || "N/A" },
    ];
    for (let i = 0; i < Math.max(leftCol.length, rightCol.length); i++) {
      let lineHeight = 0;
      if (leftCol[i]) {
        doc.setFont("helvetica", "bold");
        doc.text(leftCol[i].label, leftMargin, yPos);
        doc.text(":", leftMargin + 40, yPos);
        doc.setFont("helvetica", "normal");
        if (leftCol[i].label === "Name") {
          const wt = doc.splitTextToSize(leftCol[i].value, 50);
          doc.text(wt, leftMargin + 45, yPos);
          lineHeight = Math.max(lineHeight, (wt.length - 1) * 5);
        } else {
          doc.text(leftCol[i].value, leftMargin + 45, yPos);
        }
      }
      if (rightCol[i]) {
        doc.setFont("helvetica", "bold");
        doc.text(rightCol[i].label, leftMargin + 100, yPos);
        doc.text(":", leftMargin + 125, yPos);
        doc.setFont("helvetica", "normal");
        if (rightCol[i].label === "Ref. By") {
          const wt = doc.splitTextToSize(rightCol[i].value, 65);
          doc.text(wt, leftMargin + 130, yPos);
          lineHeight = Math.max(lineHeight, (wt.length - 1) * 5);
        } else {
          doc.text(rightCol[i].value, leftMargin + 130, yPos);
        }
      }
      yPos += 6 + lineHeight;
    }
    return yPos + 10;
  };

  const addMedicalHistory = (yPos) => {
    yPos = checkForNewPage(yPos, 15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(
      "MEDICAL EXAMINATION REPORT",
      leftMargin + contentWidth / 2,
      yPos,
      { align: "center" },
    );
    yPos += 10;
    doc.setFontSize(10);
    const historyItems = [
      { label: "Department", value: patientDetails.department || "N/A" },
      {
        label: "DOJ",
        value: patientDetails.doj
          ? (() => {
            try {
              const d = new Date(patientDetails.doj);
              if (isNaN(d.getTime())) return "N/A";
              return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
            } catch {
              return "N/A";
            }
          })()
          : "N/A",
      },
      {
        label: "Employment Type",
        value: patientDetails.employee_type || "N/A",
      },
      {
        label: "Medical History",
        value:
          patientDetails.medical_history?.patient_history ||
          "Nil Significant",
      },
    ];
    historyItems.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.text(item.label, leftMargin, yPos);
      doc.text(":", leftMargin + 50, yPos);
      doc.setFont("helvetica", "normal");
      if (item.label === "Medical History") {
        const lines = doc.splitTextToSize(item.value, contentWidth - 55);
        doc.text(lines, leftMargin + 55, yPos);
        yPos += lines.length * 6;
      } else {
        doc.text(item.value, leftMargin + 55, yPos);
        yPos += 6;
      }
    });

    if (patientDetails.dynamic_fields?.length > 0) {
      yPos += 5;
      patientDetails.dynamic_fields.forEach((field) => {
        yPos = checkForNewPage(yPos, 15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(field.field_name || "Clinical Findings", leftMargin, yPos);
        yPos += 7;
        doc.setFontSize(10);
        if (field.field_values?.length > 0) {
          const colWidths = [55, contentWidth - 55];
          const tableStartX = leftMargin;
          const rowHeight = 8;
          const tableWidth = colWidths[0] + colWidths[1];
          doc.rect(tableStartX, yPos, tableWidth, rowHeight);
          doc.line(
            tableStartX + colWidths[0],
            yPos,
            tableStartX + colWidths[0],
            yPos + rowHeight,
          );
          doc.setFont("helvetica", "bold");
          doc.text("Parameter", tableStartX + 2, yPos + 5);
          doc.text("Finding", tableStartX + colWidths[0] + 2, yPos + 5);
          yPos += rowHeight;
          doc.setFont("helvetica", "normal");
          field.field_values.forEach((fv) => {
            yPos = checkForNewPage(yPos, rowHeight);
            const valueLines = doc.splitTextToSize(
              fv.value || "",
              colWidths[1] - 4,
            );
            const rowH = Math.max(rowHeight, valueLines.length * 5 + 3);
            doc.rect(tableStartX, yPos, tableWidth, rowH);
            doc.line(
              tableStartX + colWidths[0],
              yPos,
              tableStartX + colWidths[0],
              yPos + rowH,
            );
            doc.setFont("helvetica", "bold");
            doc.text(fv.key || "", tableStartX + 2, yPos + 5);
            doc.setFont("helvetica", "normal");
            doc.text(valueLines, tableStartX + colWidths[0] + 2, yPos + 5);
            yPos += rowH;
          });
          yPos += 4;
        }
      });
    }
    return yPos + 5;
  };

  const addGeneralExamination = (yPos) => {
    yPos = checkForNewPage(yPos, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("VITALS", leftMargin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    const colWidths = [55, 40, 45, 35];
    const tableStartX = leftMargin;
    const rowHeight = 8;
    const tableWidth =
      colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3];
    doc.rect(tableStartX, yPos, tableWidth, rowHeight);
    doc.line(
      tableStartX + colWidths[0],
      yPos,
      tableStartX + colWidths[0],
      yPos + rowHeight,
    );
    doc.line(
      tableStartX + colWidths[0] + colWidths[1],
      yPos,
      tableStartX + colWidths[0] + colWidths[1],
      yPos + rowHeight,
    );
    doc.line(
      tableStartX + colWidths[0] + colWidths[1] + colWidths[2],
      yPos,
      tableStartX + colWidths[0] + colWidths[1] + colWidths[2],
      yPos + rowHeight,
    );
    doc.setFont("helvetica", "bold");
    doc.text("Parameter", tableStartX + 2, yPos + 5);
    doc.text("Value", tableStartX + colWidths[0] + 2, yPos + 5);
    doc.text(
      "Normal Range",
      tableStartX + colWidths[0] + colWidths[1] + 2,
      yPos + 5,
    );
    doc.text(
      "Status",
      tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 2,
      yPos + 5,
    );
    yPos += rowHeight;
    const vitalSigns = [
      {
        param: "Height",
        value: (patientDetails.vitals?.height || "N/A") + " cms",
        range: "",
      },
      {
        param: "Weight",
        value: (patientDetails.vitals?.weight || "N/A") + " kgs",
        range: "",
      },
      {
        param: "BMI",
        value: (patientDetails.vitals?.bmi || "N/A") + " kg/m²",
        range: "18.5 - 24.9 kg/m²",
        status: patientDetails.vitals?.bmi_status || "N/A",
      },
      {
        param: "Blood Pressure",
        value: (patientDetails.vitals?.blood_pressure || "N/A") + " mmHg",
        range: "120/80 mmHg",
        status: patientDetails.vitals?.BP_status || "N/A",
      },
      {
        param: "Pulse Rate",
        value: (patientDetails.vitals?.spo2 || "N/A") + " bpm",
        range: "60 - 100 bpm",
        status: patientDetails.vitals?.spo2_status || "N/A",
      },
    ];
    doc.setFont("helvetica", "normal");
    vitalSigns.forEach((item) => {
      const rowY = yPos;
      doc.rect(tableStartX, rowY, tableWidth, rowHeight);
      doc.line(
        tableStartX + colWidths[0],
        rowY,
        tableStartX + colWidths[0],
        rowY + rowHeight,
      );
      doc.line(
        tableStartX + colWidths[0] + colWidths[1],
        rowY,
        tableStartX + colWidths[0] + colWidths[1],
        rowY + rowHeight,
      );
      doc.line(
        tableStartX + colWidths[0] + colWidths[1] + colWidths[2],
        rowY,
        tableStartX + colWidths[0] + colWidths[1] + colWidths[2],
        rowY + rowHeight,
      );
      doc.line(
        tableStartX +
        colWidths[0] +
        colWidths[1] +
        colWidths[2] +
        colWidths[3],
        rowY,
        tableStartX +
        colWidths[0] +
        colWidths[1] +
        colWidths[2] +
        colWidths[3],
        rowY + rowHeight,
      );
      doc.text(item.param, tableStartX + 2, rowY + 5);
      doc.text(item.value, tableStartX + colWidths[0] + 2, rowY + 5);
      doc.text(
        item.range || "",
        tableStartX + colWidths[0] + colWidths[1] + 2,
        rowY + 5,
      );
      if (item.status && item.status !== "N/A") {
        const isAbnormal = ["High", "Low", "Obese", "Overweight"].includes(
          item.status,
        );
        doc.setTextColor(isAbnormal ? 220 : 0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text(
          item.status,
          tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 2,
          rowY + 5,
        );
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
      }
      yPos += rowHeight;
    });
    return yPos + 10;
  };

  const addMiscellaneousInvestigations = (yPos) => {
    yPos = checkForNewPage(yPos, 15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("MISCELLANEOUS", leftMargin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    const chcTestsForMisc = patientDetails.chc_tests_for_files || [];
    const availedTests = chcTestsForMisc.filter((t) => {
      const hasContent =
        t.has_file || t.has_report || t.report?.trim() || t.notes?.trim();
      if (!hasContent) return false;
      const name = (t.testname || "").toLowerCase();
      return (
        !name.includes("optho") &&
        !name.includes("ophth") &&
        t.test_id !== "CHCT001"
      );
    });
    if (availedTests.length === 0) {
      doc.setFont("helvetica", "normal");
      doc.text("No miscellaneous investigations recorded.", leftMargin, yPos);
      return yPos + 10;
    }
    const maxWidth = 210 - leftMargin - 20 - 45;
    availedTests.forEach((test) => {
      const label = test.testname || "Unknown";
      let value = test.notes?.trim() || "";
      if (!value && test.report?.trim()) {
        value = test.report.split(/\.(?=\s|$)/)[0].trim();
        if (value && !value.endsWith(".")) value += ".";
      }
      if (!value) value = "Normal";
      yPos = checkForNewPage(yPos, 15);
      doc.setFont("helvetica", "bold");
      doc.text(label, leftMargin, yPos);
      doc.text(":", leftMargin + 40, yPos);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(value, maxWidth);
      for (let i = 0; i < lines.length; i++) {
        if (i > 0) {
          yPos += 6;
          yPos = checkForNewPage(yPos, 6);
        }
        doc.text(lines[i], leftMargin + 45, yPos);
      }
      yPos += 6;
    });
    return yPos + 5;
  };

  const addOphthalmologyReport = (yPos) => {
    const chcOphthal = patientDetails.chc_ophthalmology;
    const legacyOphthal = patientDetails.ophthalmology;
    if (!chcOphthal && !legacyOphthal) return yPos;
    yPos = checkForNewPage(yPos, 70);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("OPHTHALMOLOGY REPORT", leftMargin, yPos);
    yPos += 10;
    const getEyes = (chcKey, legacyKey) => {
      if (chcOphthal) {
        const obj = chcOphthal[chcKey] || {};
        return { right: obj.right || "N/A", left: obj.left || "N/A" };
      }
      const obj = legacyOphthal?.[legacyKey] || {};
      return { right: obj.right || "N/A", left: obj.left || "N/A" };
    };
    const rows = [
      { label: "Distant Vision", eyes: getEyes("distance", "distance") },
      { label: "Near Vision", eyes: getEyes("nearVision", "near_vision") },
      {
        label: "Colour Vision",
        eyes: getEyes("colourVision", "color_vision"),
      },
      {
        label: "Ocular Movement",
        eyes: getEyes("ocularmovement", "ocularmovement"),
      },
    ];
    const tableX = leftMargin,
      tableWidth = 155;
    const col1Width = 52,
      col2Width = 51.5,
      col3Width = 51.5;
    const rowHeight = 10;
    doc.setLineWidth(0.3);
    doc.setFontSize(10);
    doc.rect(tableX, yPos, tableWidth, rowHeight * (rows.length + 1));
    doc.line(
      tableX + col1Width,
      yPos,
      tableX + col1Width,
      yPos + rowHeight * (rows.length + 1),
    );
    doc.line(
      tableX + col1Width + col2Width,
      yPos,
      tableX + col1Width + col2Width,
      yPos + rowHeight * (rows.length + 1),
    );
    for (let i = 1; i <= rows.length; i++)
      doc.line(
        tableX,
        yPos + rowHeight * i,
        tableX + tableWidth,
        yPos + rowHeight * i,
      );
    doc.setFont("helvetica", "bold");
    doc.text("Test", tableX + col1Width / 2 - 5, yPos + 6);
    doc.text("Right Eye", tableX + col1Width + col2Width / 2 - 10, yPos + 6);
    doc.text(
      "Left Eye",
      tableX + col1Width + col2Width + col3Width / 2 - 8,
      yPos + 6,
    );
    doc.setFont("helvetica", "normal");
    rows.forEach((row, idx) => {
      const ry = yPos + rowHeight * (idx + 1);
      doc.setFont("helvetica", "bold");
      doc.text(row.label, tableX + 5, ry + 6);
      doc.setFont("helvetica", "normal");
      const r = String(row.eyes.right),
        l = String(row.eyes.left);
      doc.text(
        r,
        tableX + col1Width + col2Width / 2 - doc.getTextWidth(r) / 2,
        ry + 6,
      );
      doc.text(
        l,
        tableX +
        col1Width +
        col2Width +
        col3Width / 2 -
        doc.getTextWidth(l) / 2,
        ry + 6,
      );
    });
    yPos = yPos + rowHeight * (rows.length + 1) + 10;
    const complaints =
      chcOphthal?.complaints?.trim() ||
      legacyOphthal?.patient_complaints?.trim();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Patient Complaints:", leftMargin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const cl = doc.splitTextToSize(complaints || "Nil", contentWidth - 10);
    doc.text(cl, leftMargin, yPos);
    yPos += cl.length * 5 + 8;
    const remarks =
      chcOphthal?.remarks?.trim() || legacyOphthal?.remarks?.trim();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Remarks:", leftMargin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const remarksTxt =
      remarks || "Both Eyes: Normal Vision. Review after 6 months or 1 year.";
    const rl = doc.splitTextToSize(remarksTxt, contentWidth - 10);
    doc.text(rl, leftMargin, yPos);
    yPos += rl.length * 5 + 10;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    const vn =
      "This spectacle prescription is valid for correction, only for three months from the date of consultation.";
    const vl = doc.splitTextToSize(vn, contentWidth);
    doc.text(vl, leftMargin, yPos);
    return yPos + 15;
  };

  const addCHC012LabSummary = (yPos) => {
    const INLINE_TESTS_BY_NAME = {
      "GLUCOSE - RANDOM": { paramNames: "all" },
      "COMPLETE BLOOD COUNT": {
        paramNames: ["Haemoglobin", "Platelet Count"],
      },
      "VDRL/ RPR": { paramNames: "all" },
    };
    if (
      !patientDetails.testdetails ||
      patientDetails.testdetails.length === 0
    ) {
      yPos = checkForNewPage(yPos, 15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Lab Investigations", leftMargin, yPos);
      doc.text(":", leftMargin + 50, yPos);
      doc.setFont("helvetica", "normal");
      doc.text("Enclosed", leftMargin + 55, yPos);
      return yPos + 10;
    }
    const getHighLowStatus = (value, reference) => {
      if (!value || !reference) return null;
      const num = parseFloat(value);
      if (isNaN(num)) return null;
      if (reference.includes("-")) {
        const parts = reference.split("-").map((v) => parseFloat(v));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          if (num < parts[0]) return "L";
          if (num > parts[1]) return "H";
        }
      } else if (reference.includes("<")) {
        const max = parseFloat(reference.replace("<", ""));
        if (!isNaN(max) && num > max) return "H";
      } else if (reference.includes(">")) {
        const min = parseFloat(reference.replace(">", ""));
        if (!isNaN(min) && num < min) return "L";
      }
      return null;
    };
    const rows = [];
    patientDetails.testdetails.forEach((test) => {
      const config = INLINE_TESTS_BY_NAME[test.testname];
      if (!config) return;
      if (config.paramNames === "all") {
        const src = test.value?.trim()
          ? test
          : test.parameters?.length > 0
            ? test.parameters[0]
            : test;
        rows.push({
          testname: test.testname || "Test",
          value: src.value || "",
          unit: src.unit || "",
          status: getHighLowStatus(src.value, src.reference_range),
          reference_range: src.reference_range || "",
        });
      } else {
        (test.parameters || []).forEach((p) => {
          if (config.paramNames.includes(p.name))
            rows.push({
              testname: p.name,
              value: p.value || "",
              unit: p.unit || "",
              status: getHighLowStatus(p.value, p.reference_range),
              reference_range: p.reference_range || "",
            });
        });
      }
    });
    yPos = checkForNewPage(yPos, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Lab Investigations", leftMargin, yPos);
    yPos += 8;
    if (rows.length > 0) {
      doc.setFontSize(10);
      const colW = [
        contentWidth * 0.42,
        contentWidth * 0.2,
        contentWidth * 0.18,
        contentWidth * 0.2,
      ];
      const tableX = leftMargin;
      const rowH = 8;
      const tableW = colW.reduce((a, b) => a + b, 0);
      doc.rect(tableX, yPos, tableW, rowH);
      let cx = tableX;
      colW.forEach((w) => {
        cx += w;
        if (cx < tableX + tableW) doc.line(cx, yPos, cx, yPos + rowH);
      });
      doc.setFont("helvetica", "bold");
      const headers = ["Test Name", "Value", "Unit", "Reference"];
      let hx = tableX;
      headers.forEach((h, i) => {
        doc.text(h, hx + 2, yPos + 5);
        hx += colW[i];
      });
      yPos += rowH;
      doc.setFont("helvetica", "normal");
      rows.forEach((row) => {
        yPos = checkForNewPage(yPos, rowH);
        doc.rect(tableX, yPos, tableW, rowH);
        let rx = tableX;
        colW.forEach((w) => {
          rx += w;
          if (rx < tableX + tableW) doc.line(rx, yPos, rx, yPos + rowH);
        });
        doc.setFont("helvetica", "normal");
        doc.text(String(row.testname).substring(0, 34), tableX + 2, yPos + 5);
        const valueX = tableX + colW[0] + 2;
        const valueStr = String(row.value);
        doc.text(valueStr, valueX, yPos + 5);
        if (row.status === "H" || row.status === "L") {
          const indicatorX = valueX + doc.getTextWidth(valueStr) + 2;
          doc.setFont("helvetica", "bold");
          if (row.status === "H") {
            doc.setTextColor(220, 0, 0);
            doc.text("H", indicatorX + 3, yPos + 5);
            drawArrowSymbol(doc, indicatorX, yPos + 4, "up");
          } else {
            doc.setTextColor(0, 0, 220);
            doc.text("L", indicatorX + 3, yPos + 5);
            drawArrowSymbol(doc, indicatorX, yPos + 4, "down");
          }
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
        }
        doc.text(
          String(row.unit).substring(0, 10),
          tableX + colW[0] + colW[1] + 2,
          yPos + 5,
        );
        doc.text(
          String(row.reference_range).substring(0, 18),
          tableX + colW[0] + colW[1] + colW[2] + 2,
          yPos + 5,
        );
        yPos += rowH;
      });
      yPos += 4;
    }
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Other Lab Reports are Enclosed", leftMargin, yPos);
    doc.setFont("helvetica", "normal");
    return yPos + 70;
  };

  const addLabInvestigations = (yPos) => {
    if (!patientDetails.testdetails?.length) return yPos;
    if (patientDetails.company_id === "CHC012")
      return addCHC012LabSummary(yPos);
    yPos = checkForNewPage(yPos, 15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Lab Investigations", leftMargin, yPos);
    doc.text(":", leftMargin + 50, yPos);
    doc.setFont("helvetica", "normal");
    doc.text("Enclosed", leftMargin + 55, yPos);
    return yPos + 10;
  };

  const addFinalAssessment = (yPos) => {
    yPos = checkForNewPage(yPos, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const impression =
      patientDetails.final_assessment?.impression ||
      "Reports within Normal Limits.";
    const remarks =
      patientDetails.final_assessment?.remarks ||
      "The above candidate was examined and found Medically Fit for the Job.";
    if (impression?.trim()) {
      const impressionLines = [
        ...new Set(
          impression
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l),
        ),
      ];
      doc.setFont("helvetica", "bold");
      doc.text("Impression", leftMargin, yPos);
      doc.text(":", leftMargin + 30, yPos);
      doc.setFont("helvetica", "normal");
      impressionLines.forEach((line) => {
        const wrapped = doc.splitTextToSize(line, contentWidth - 40);
        wrapped.forEach((wl) => {
          doc.text(wl, leftMargin + 35, yPos);
          yPos += 6;
        });
      });
      doc.setFont("helvetica", "bold");
      yPos += 4;
    }
    if (remarks?.trim()) {
      yPos += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(remarks, leftMargin, yPos);
    }
    yPos += 8;
    const pageHeight = doc.internal.pageSize.height;
    if (yPos + 40 >= pageHeight - footerHeight) {
      doc.addPage();
      pageCount++;
      addHeaderFooter(false);
      yPos = headerHeight + 10;
    }
    const signatureX = leftMargin + 120;
    if (DRPS) doc.addImage(DRPS, "PNG", signatureX, yPos, 35, 25);
    yPos += 25;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Dr. P. PRABU SANKAR, MS, MRCS.", signatureX, yPos);
    yPos += 5;
    doc.text("GENERAL SURGEON", signatureX, yPos);
    yPos += 5;
    doc.text("Reg No. 80709", signatureX, yPos);
    yPos += 5;
    doc.text("Shanmuga Hospital Ltd, Salem-7.", signatureX, yPos);
    return yPos + 10;
  };

  // ORIGINAL addInvestigationFiles — used by single handlePrint (converts on the fly)
  const addInvestigationFiles = async () => {
    const files = patientDetails.investigation_files;
    const chcTestsOrder = patientDetails.chc_tests_for_files || [];
    if (!files) return;
    const pageHeight = doc.internal.pageSize.height;

    for (const test of chcTestsOrder) {
      const testNameLower = (test.testname || "").toLowerCase();
      if (
        testNameLower.includes("optho") ||
        testNameLower.includes("ophth") ||
        test.test_id === "CHCT001"
      )
        continue;
      const testEntry = files[test.test_id];
      if (!testEntry) continue;
      const label = testEntry.label || test.testname;
      const reportText = testEntry.report || test.report?.trim() || "";
      const notesText = testEntry.notes || test.notes?.trim() || "";
      const hasFiles = testEntry.files?.length > 0;
      if (!reportText && !notesText && !hasFiles) continue;
      const isXRay =
        testNameLower.includes("x-ray") ||
        testNameLower.includes("xray") ||
        testNameLower.includes("chest");
      const isEcho =
        testNameLower.includes("echo") ||
        testNameLower.includes("echocardiogram");

      const allImages = [];
      if (hasFiles) {
        for (const file of testEntry.files) {
          if (!file?.data) continue;
          try {
            const contentType = file.contentType || "";
            const filename = (file.filename || "").toLowerCase();
            const isPDF =
              contentType.includes("pdf") || filename.endsWith(".pdf");
            if (isPDF) {
              const pdfImages = await convertPdfToImages(file.data);
              pdfImages.forEach((img) => allImages.push(img));
            } else {
              let fmt = "PNG";
              if (
                contentType.includes("jpeg") ||
                contentType.includes("jpg") ||
                filename.endsWith(".jpg") ||
                filename.endsWith(".jpeg")
              )
                fmt = "JPEG";
              allImages.push({
                dataUri: `data:${contentType || "image/png"};base64,${file.data}`,
                format: fmt,
              });
            }
          } catch (err) {
            console.error(`Error processing file in ${label}:`, err);
          }
        }
      }
      await _renderTestPages(
        label,
        reportText,
        notesText,
        allImages,
        isXRay,
        isEcho,
      );
    }
  };

  // FAST addInvestigationFiles — uses pre-converted images (used by batch handleOverallPrint)
  const addInvestigationFiles_Fast = async (preProc) => {
    if (!preProc) return;
    const chcTestsOrder = patientDetails.chc_tests_for_files || [];
    for (const test of chcTestsOrder) {
      const testNameLower = (test.testname || "").toLowerCase();
      if (
        testNameLower.includes("optho") ||
        testNameLower.includes("ophth") ||
        test.test_id === "CHCT001"
      )
        continue;
      const testEntry = preProc[test.test_id];
      if (!testEntry) continue;
      const label = testEntry.label || test.testname;
      const reportText = testEntry.report || "";
      const notesText = testEntry.notes || "";
      const allImages = testEntry.processedImages || [];
      if (!reportText && !notesText && !allImages.length) continue;
      const isXRay =
        testNameLower.includes("x-ray") ||
        testNameLower.includes("xray") ||
        testNameLower.includes("chest");
      const isEcho =
        testNameLower.includes("echo") ||
        testNameLower.includes("echocardiogram");
      await _renderTestPages(
        label,
        reportText,
        notesText,
        allImages,
        isXRay,
        isEcho,
      );
    }
  };

  // Shared page-rendering logic for both addInvestigationFiles variants
  const _renderTestPages = async (
    label,
    reportText,
    notesText,
    allImages,
    isXRay,
    isEcho,
  ) => {
    const pageHeight = doc.internal.pageSize.height;
    if (reportText) {
      doc.addPage();
      pageCount++;
      addHeaderFooter(false);
      let yPos = headerHeight + 10;
      yPos = addMedicalExaminationHeader(yPos);
      yPos += 5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(label.toUpperCase(), leftMargin + contentWidth / 2, yPos, {
        align: "center",
      });
      yPos += 3;
      const titleWidth = doc.getTextWidth(label.toUpperCase());
      doc.setLineWidth(0.5);
      doc.line(
        leftMargin + contentWidth / 2 - titleWidth / 2,
        yPos,
        leftMargin + contentWidth / 2 + titleWidth / 2,
        yPos,
      );
      yPos += 12;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const normalizedReport = reportText
        .replace(/\\r\\n/g, "\n")
        .replace(/\r\n/g, "\n");
      const paragraphs = normalizedReport
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      const allSentences = [];
      paragraphs.forEach((p) => {
        p.split(/\.(?=\s|$)/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
          .map((s) => (s.endsWith(".") ? s : s + "."))
          .forEach((s) => allSentences.push(s));
      });
      allSentences.forEach((sentence) => {
        const lines = doc.splitTextToSize(sentence, contentWidth - 10);
        doc.text(lines, leftMargin, yPos);
        yPos += lines.length * 5.5 + 4;
      });
      if (notesText) {
        yPos += 8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("IMPRESSION:", leftMargin, yPos);
        yPos += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const impressionLines = doc.splitTextToSize(
          notesText,
          contentWidth - 10,
        );
        doc.text(impressionLines, leftMargin, yPos);
        yPos += impressionLines.length * 5.5 + 20;
        if (isXRay) {
          const sx = leftMargin + 120;
          if (Muhsina) doc.addImage(Muhsina, "PNG", sx, yPos, 35, 15);
          yPos += 20;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.text("DR. MUHSINA ABOOBAKER, MBBS, MDRD", sx, yPos);
          yPos += 5;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.text("CONSULTANT RADIOLOGIST", sx, yPos);
          yPos += 5;
          doc.text("REG NO: 143512 (TNMC)", sx, yPos);
        }
        if (isEcho) {
          const sx = leftMargin + 110;
          if (drarun) doc.addImage(drarun, "PNG", sx, yPos, 40, 20);
          yPos += 20;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.text("Dr. ARUN KUMAR.B, MD(MED), DNB(CARDIO)", sx, yPos);
          yPos += 5;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.text("CONSULTANT INTERVENTIONAL CARDIOLOGIST", sx, yPos);
          yPos += 5;
          doc.text("REG NO: 91581", sx, yPos);
          yPos += 5;
          doc.text("Shanmuga Hospital & Salem Cancer Institute", sx, yPos);
        }
      }
    }
    for (const img of allImages) {
      doc.addPage();
      pageCount++;
      addHeaderFooter(false);
      let imgYPos = headerHeight + 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(label.toUpperCase(), leftMargin + contentWidth / 2, imgYPos, {
        align: "center",
      });
      imgYPos += 3;
      const imgTitleWidth = doc.getTextWidth(label.toUpperCase());
      doc.setLineWidth(0.5);
      doc.line(
        leftMargin + contentWidth / 2 - imgTitleWidth / 2,
        imgYPos,
        leftMargin + contentWidth / 2 + imgTitleWidth / 2,
        imgYPos,
      );
      imgYPos += 5;
      const availableHeight = pageHeight - footerHeight - imgYPos - 5;
      try {
        doc.addImage(
          img.dataUri,
          img.format,
          leftMargin,
          imgYPos,
          contentWidth,
          availableHeight,
        );
      } catch (e) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(
          `[Image error: ${e.message}]`,
          leftMargin,
          imgYPos + availableHeight / 2,
        );
      }
    }
  };

  const addLaboratoryReports = () => {
    if (!patientDetails.testdetails?.length) return;
    const labTests = patientDetails.testdetails.filter(
      (t) =>
        ![
          "Audiometry",
          "Pulmonary Function Test",
          "Chest - XRay",
          "ECG",
          "Eye examination",
        ].includes(t.testname),
    );
    if (labTests.length === 0) return;
    const nablTrueTests = labTests.filter((t) => t.NABL === true);
    const nablFalseTests = labTests.filter((t) => t.NABL !== true);

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
    const unicodeMap = {
      μ: "µ",
      "×": "x",
      "÷": "/",
      "°": "°",
      "±": "±",
      "²": "²",
      "³": "³",
    };
    const processUnicodeText = (text) => {
      if (!text) return "";
      let t = text;
      t = t.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
        const ch = String.fromCharCode(parseInt(hex, 16));
        return unicodeMap[ch] || ch;
      });
      Object.keys(unicodeMap).forEach((k) => {
        t = t.replace(new RegExp(k, "g"), unicodeMap[k]);
      });
      return t;
    };
    const wrapText = (doc, text, maxWidth, startX, yPos, lineHeight = 4) => {
      if (!text) return 0;
      const split = doc.splitTextToSize(text, maxWidth);
      split.forEach((line, i) =>
        doc.text(line, startX, yPos + i * lineHeight),
      );
      return split.length * lineHeight;
    };
    const getHighLowStatus = (value, reference) => {
      if (!value || !reference) return null;
      const num = parseFloat(value);
      if (isNaN(num)) return null;
      if (reference.includes("-")) {
        const [min, max] = reference.split("-").map((v) => parseFloat(v));
        if (!isNaN(min) && !isNaN(max)) {
          if (num < min) return "L";
          if (num > max) return "H";
        }
      } else if (reference.includes("<")) {
        const max = parseFloat(reference.replace("<", ""));
        if (!isNaN(max) && num > max) return "H";
      } else if (reference.includes(">")) {
        const min = parseFloat(reference.replace(">", ""));
        if (!isNaN(min) && num < min) return "L";
      }
      return null;
    };
    const colWidths = [
      contentWidth * 0.28,
      contentWidth * 0.12,
      contentWidth * 0.05,
      contentWidth * 0.18,
      contentWidth * 0.1,
      contentWidth * 0.27,
      0,
    ];
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
      headers.forEach((h, i) => {
        if (h) doc.text(h, xPos, yPos);
        xPos += colWidths[i];
      });
      yPos += 3;
      doc.line(leftMargin, yPos, rightMargin, yPos);
      yPos += 5;
      return yPos;
    };
    const addLabReportHeader = (yPos) => {
      doc.setFontSize(10);
      const firstTest = labTests[0];
      const rows = [
        [
          "Reg.ID",
          patientDetails.patient_id || "N/A",
          "Collected On",
          firstTest?.samplecollected_time
            ? safeFormatDate(
              firstTest.samplecollected_time,
              "dd MMM yy / HH:mm",
            )
            : "N/A",
        ],
        [
          "Name",
          patientDetails.patientname || "N/A",
          "Received On",
          firstTest?.received_time
            ? safeFormatDate(firstTest.received_time, "dd MMM yy / HH:mm")
            : "N/A",
        ],
        [
          "Age/Gender",
          `${patientDetails.age || "N/A"} / ${patientDetails.gender || "N/A"}`,
          "Approved Date",
          safeFormatDate(
            firstTest?.approve_time,
            "dd MMM yy / HH:mm",
            safeFormatDate(new Date().toISOString(), "dd MMM yy / HH:mm"),
          ),
        ],
      ];
      rows.forEach(([l1, v1, l2, v2]) => {
        doc.setFont("helvetica", "bold");
        doc.text(l1, leftMargin, yPos);
        doc.text(":", leftMargin + 30, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(v1, leftMargin + 35, yPos);
        doc.setFont("helvetica", "bold");
        doc.text(l2, leftMargin + 100, yPos);
        doc.text(":", leftMargin + 140, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(v2, leftMargin + 145, yPos);
        yPos += 5;
      });
      doc.setFont("helvetica", "bold");
      doc.text("Referral", leftMargin, yPos);
      doc.text(":", leftMargin + 30, yPos);
      doc.setFont("helvetica", "normal");
      const refByText =
        patientDetails.company_name || patientDetails.refby || "SELF";
      const wrappedRefBy = doc.splitTextToSize(refByText, 60);
      doc.text(wrappedRefBy, leftMargin + 35, yPos);
      yPos += wrappedRefBy.length * 5;
      return yPos + 5;
    };
    const addSignatures = () => {
      if (!activeConsultants.length) return;
      const signaturesY = doc.internal.pageSize.height - footerHeight - 35;
      const signatureWidth = 35,
        signatureSpacing = 60;
      const startX =
        rightMargin - activeConsultants.length * signatureSpacing;
      activeConsultants.forEach((consultant, index) => {
        const xPosition = startX + index * signatureSpacing;
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

    let sharedYPos = 0,
      sharedCheckFn = null;

    const renderTestGroup = (testsToRender, withNabl) => {
      if (!testsToRender.length) return;
      const checkForNewPageLab = (yPos, estimatedHeight) => {
        if (
          yPos + estimatedHeight >=
          doc.internal.pageSize.height - footerHeight - 35
        ) {
          addSignatures();
          doc.addPage();
          pageCount++;
          addHeaderFooter(withNabl);
          let newYPos = headerHeight + 10;
          newYPos = addLabReportHeader(newYPos);
          newYPos = drawTableHeader(newYPos);
          return newYPos;
        }
        return yPos;
      };
      const testsByDepartment = testsToRender.reduce((acc, test) => {
        const dept = test.department || "LABORATORY";
        (acc[dept] = acc[dept] || []).push(test);
        return acc;
      }, {});

      const getDeptMinBillingIndex = (deptName) => {
        const deptTests = testsToRender.filter(t => (t.department || "LABORATORY") === deptName);
        let minIndex = 999;
        deptTests.forEach(test => {
          let idx = findBillingIndex(test.testname);
          if (idx !== -1 && idx < minIndex) {
            minIndex = idx;
          }
        });
        return minIndex;
      };

      const sortedDepartments = Object.keys(testsByDepartment).sort(
        (a, b) => {
          if (billingOrder.length > 0) {
            const idxA = getDeptMinBillingIndex(a);
            const idxB = getDeptMinBillingIndex(b);
            if (idxA !== idxB) {
              return idxA - idxB;
            }
          }
          const ia = departmentOrder.indexOf(a),
            ib = departmentOrder.indexOf(b);
          if (ia !== -1 && ib !== -1) return ia - ib;
          if (ia !== -1) return -1;
          if (ib !== -1) return 1;
          return a.localeCompare(b);
        },
      );

      doc.addPage();
      pageCount++;
      addHeaderFooter(withNabl);
      let yPos = headerHeight + 10;
      yPos = addLabReportHeader(yPos);
      yPos = drawTableHeader(yPos);

      sortedDepartments.forEach((department) => {
        const verifiedBySet = new Set();
        testsByDepartment[department].forEach((t) => {
          if (t.verified_by?.trim()) verifiedBySet.add(t.verified_by);
        });
        const hasMultipleVerifiers = verifiedBySet.size > 1;

        testsByDepartment[department].forEach((test, testIndex) => {
          if (testIndex === 0) {
            yPos = checkForNewPageLab(yPos, 25);
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
          const paramsBySubtitle = {};
          (test.parameters || []).forEach((p) => {
            const sub = p.sub_title || "";
            (paramsBySubtitle[sub] = paramsBySubtitle[sub] || []).push(p);
          });

          yPos = checkForNewPageLab(yPos, 20);
          doc.setFontSize(10);
          const testNameText = test.testname;
          const valueText = test.value || "";
          const methodText = (test.method || "")
            .replace(/\bMethod\b/i, "")
            .trim();
          const hasParameters = test.parameters && test.parameters.length > 0;
          const testNameWidth = hasParameters ? contentWidth - 2 : colWidths[0] - 2;
          const testNameLines = wrapTextAndGetLines(doc, testNameText, testNameWidth);
          const valueLines = wrapTextAndGetLines(doc, valueText, colWidths[3] - 2);
          const refMethodText = [test.reference_range, methodText].filter(p => p && p.trim() !== "").join(" / ");
          const refMethodLines = wrapTextAndGetLines(doc, refMethodText, colWidths[5] - 2);
          const maxLines = Math.max(
            testNameLines.length,
            valueLines.length,
            refMethodLines.length,
          );
          const lineHeight = 4.5;
          const actualRowHeight = maxLines * lineHeight + 2;

          yPos = checkForNewPageLab(yPos, actualRowHeight);
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

          if (!hasParameters) {
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
          }

          yPos += actualRowHeight + (hasParameters ? 1.5 : 3.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);

          if (test.outsourced === true) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(8);
            yPos = checkForNewPageLab(yPos, 4);
            doc.text("(Outsourced)", leftMargin, yPos);
            yPos += 4;
          }

          if (!test.parameters || test.parameters.length === 0) {
            if (test.comment && test.comment.trim() !== "") {
              doc.setFont("helvetica", "italic");
              doc.setFontSize(8);
              const commentLines = wrapTextAndGetLines(doc, `Comment: ${test.comment}`, contentWidth);
              yPos = checkForNewPageLab(yPos, commentLines.length * 3.5 + 2);
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
              yPos = checkForNewPageLab(yPos, notesLines.length * 3.5 + 2);
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

          Object.keys(paramsBySubtitle).forEach((subtitle) => {
            if (subtitle && subtitle.trim() !== "") {
              yPos = checkForNewPageLab(yPos, 25);
              doc.setFont("helvetica", "bold");
              doc.setFontSize(9);
              doc.text(subtitle, leftMargin, yPos);
              yPos += 6;
            }
            paramsBySubtitle[subtitle].forEach((currentTest) => {
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

              yPos = checkForNewPageLab(yPos, paramRowHeight);
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
                const commentLines = wrapTextAndGetLines(doc, `Comment: ${currentTest.comment}`, contentWidth);
                yPos = checkForNewPageLab(yPos, commentLines.length * 3.5 + 2);
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
                yPos = checkForNewPageLab(yPos, notesLines.length * 3.5 + 2);
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
            yPos = checkForNewPageLab(yPos, testNotesLines.length * 3.5 + 2);
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

          if (hasMultipleVerifiers && test.verified_by?.trim()) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`Verified by: ${test.verified_by}`, leftMargin, yPos);
            yPos += 8;
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
          yPos += 8;
        }
        yPos += 4;
      });
      sharedYPos = yPos;
      sharedCheckFn = checkForNewPageLab;
    };

    if (nablTrueTests.length > 0) {
      renderTestGroup(nablTrueTests, true);
      if (nablFalseTests.length > 0) {
        addSignatures();
      }
    }
    if (nablFalseTests.length > 0) {
      renderTestGroup(nablFalseTests, false);
    }
    const ensureSpaceForFooter = (currentYPosition) => {
      const pageHeight = doc.internal.pageSize.height;
      const footerStart = pageHeight - (footerHeight + 35 - 1);
      if (currentYPosition + 5 >= footerStart) {
        addSignatures();
        doc.addPage();
        pageCount++;
        const finalNabl = nablFalseTests.length > 0 ? false : true;
        addHeaderFooter(finalNabl);
        let newYPos = headerHeight + 10;
        newYPos = addLabReportHeader(newYPos);
        newYPos = drawTableHeader(newYPos);
        return newYPos;
      }
      return currentYPosition;
    };

    if (sharedCheckFn) {
      sharedYPos = ensureSpaceForFooter(sharedYPos);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(
        "**End of the Report**",
        leftMargin + contentWidth / 2,
        sharedYPos + 4,
        { align: "center" },
      );
      addSignatures();
    }
  };

  // ── Assemble the PDF ──────────────────────────────────────────────────────
  addHeaderFooter(false);
  currentYPosition = addMedicalExaminationHeader(currentYPosition);
  currentYPosition = addMedicalHistory(currentYPosition);
  currentYPosition = addGeneralExamination(currentYPosition);
  currentYPosition = addMiscellaneousInvestigations(currentYPosition);
  currentYPosition = addOphthalmologyReport(currentYPosition);
  currentYPosition = addLabInvestigations(currentYPosition);
  currentYPosition = addFinalAssessment(currentYPosition);

  // Use pre-processed images in batch mode, original conversion in single print
  if (preProcessedFiles) {
    await addInvestigationFiles_Fast(preProcessedFiles);
  } else {
    await addInvestigationFiles();
  }

  addLaboratoryReports();

  // Page numbers
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount}`,
      leftMargin + contentWidth / 2,
      doc.internal.pageSize.height - footerHeight - 5,
      { align: "center" },
    );
  }

  return doc;
};
