// This file has been split into src/Components/Report/CHCReport/ for
// maintainability (index.js, useCHCReportData.js, helpers.js, pdfBuilder.js,
// styles.js). Kept as a thin re-export shim so existing imports of
// "./Components/Report/CHCReport" (or "../Report/CHCReport") keep resolving
// without any changes at call sites.
export { default } from "./CHCReport/index";
