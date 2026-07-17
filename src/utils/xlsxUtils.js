// Shared XLSX (SheetJS) helpers.
//
// Across the app, Excel exports follow one of two identical sequences:
//   1) json_to_sheet -> book_new -> book_append_sheet -> XLSX.writeFile(wb, filename)
//   2) json_to_sheet -> book_new -> book_append_sheet -> XLSX.write (buffer)
//      -> new Blob(...) -> saveAs(blob, filename)  [file-saver]
//
// exportToExcel() / exportToExcelBlob() below capture those two patterns so
// individual components don't need to re-implement (and re-import `xlsx`
// directly) each time. The raw `XLSX` namespace is also re-exported for any
// call sites that need something more bespoke (multi-sheet workbooks,
// custom cell styling, etc.).

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export { XLSX };

/**
 * Build a single-sheet workbook from an array of plain objects.
 *
 * @param {Array<Object>} data - rows, one object per row (same shape XLSX.utils.json_to_sheet expects)
 * @param {string} sheetName - worksheet tab name
 * @param {Array<Object>} [colWidths] - optional `!cols` width array, e.g. [{ wch: 18 }, ...]
 */
function buildWorkbook(data, sheetName, colWidths) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  if (colWidths) {
    worksheet["!cols"] = colWidths;
  }
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return workbook;
}

/**
 * Export an array of plain objects straight to an .xlsx file via XLSX.writeFile.
 * Equivalent to the json_to_sheet -> book_new -> book_append_sheet -> writeFile
 * sequence previously duplicated in Busfare.js, CHCReport.js, PatientTAT.js,
 * PatientRecordView.js, TrackingHistory.js, RouteAnalysisDashboard.js,
 * PreethamLedgerBalance.js and LedgerBalance.js.
 *
 * @param {Array<Object>} data
 * @param {string} filename - e.g. "MIS_Report_2026-01-01_to_2026-01-31.xlsx"
 * @param {{ sheetName?: string, colWidths?: Array<Object> }} [options]
 */
export function exportToExcel(data, filename, options = {}) {
  const { sheetName = "Sheet1", colWidths } = options;
  const workbook = buildWorkbook(data, sheetName, colWidths);
  XLSX.writeFile(workbook, filename);
}

/**
 * Export an array of plain objects to an .xlsx file via an in-memory buffer +
 * file-saver's saveAs. Equivalent to the json_to_sheet -> book_new ->
 * book_append_sheet -> XLSX.write -> Blob -> saveAs sequence previously
 * duplicated in MIS.js, FranchiseMIS.js, HMSTestCount.js and ShanmugaMIS.js.
 *
 * @param {Array<Object>} data
 * @param {string} filename
 * @param {{ sheetName?: string, colWidths?: Array<Object> }} [options]
 */
export function exportToExcelBlob(data, filename, options = {}) {
  const { sheetName = "Sheet1", colWidths } = options;
  const workbook = buildWorkbook(data, sheetName, colWidths);
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, filename);
}
