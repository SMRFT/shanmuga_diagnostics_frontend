// This file has been split into src/Components/Corparate/CorporatePatientOverview/ for
// maintainability (index.js, useCorporatePatientOverviewData.js, helpers.js,
// pdfBuilder.js, styles.js). Kept as a thin re-export shim so existing
// imports of "./Components/Corparate/CorporatePatientOverview" (or
// "../Corparate/CorporatePatientOverview") keep resolving without any changes at call
// sites.
export { default } from "./CorporatePatientOverview/index";
