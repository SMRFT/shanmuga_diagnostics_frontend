// This file has been split into src/Components/Franchise/FranchiseOverview/ for
// maintainability (index.js, useFranchiseOverviewData.js, helpers.js,
// pdfBuilder.js, styles.js). Kept as a thin re-export shim so existing
// imports of "./Components/Franchise/FranchiseOverview" (or
// "../Franchise/FranchiseOverview") keep resolving without any changes at
// call sites.
export { default } from "./FranchiseOverview/index";
