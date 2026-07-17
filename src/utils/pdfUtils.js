// Shared pdfjs-dist setup.
//
// Every component that renders PDFs to images (CHCReport.js, CHCApproval.js)
// independently imported `pdfjs-dist` and re-assigned
// `pdfjsLib.GlobalWorkerOptions.workerSrc` to the same CDN URL, either on
// every render or in a mount effect. Since the worker only needs to be
// configured once for the whole app, that assignment now lives here as a
// module-level side effect: it runs a single time, the first time this
// module is imported, and every consumer shares the same configured
// `pdfjsLib` instance afterwards.

import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export { pdfjsLib };
export default pdfjsLib;
