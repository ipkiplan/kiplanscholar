/**
 * Module D — Export (PDF & Print).
 *
 * V1.0 implementation note, disclosed plainly: both "Export PDF" and
 * "Print" are implemented via the browser's native print pipeline
 * (window.print() targeting a print-only stylesheet scoped to
 * #cv-print-area). Choosing "Save as PDF" as the destination in the
 * resulting system print dialog produces a PDF — this is a common,
 * dependency-free pattern for browser-based document export. It is
 * NOT a one-click silent PDF download; the user interacts with one
 * standard browser dialog either way.
 *
 * This choice was made deliberately to avoid adding a new npm
 * dependency (e.g. jsPDF + html2canvas) to a project that has
 * repeatedly hit environment-sync friction around dependencies and
 * file drift. A true one-click, dialog-free PDF download is a
 * reasonable Version 1.1 enhancement once that trade-off is revisited.
 */

const PRINT_STYLE_ID = "cv-print-style";

function injectPrintStyle() {
  if (document.getElementById(PRINT_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = PRINT_STYLE_ID;
  style.textContent = `
    @media print {
      body * { visibility: hidden; }
      #cv-print-area, #cv-print-area * { visibility: visible; }
      #cv-print-area { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; border-radius: 0 !important; }
    }
  `;
  document.head.appendChild(style);
}

function removePrintStyle() {
  document.getElementById(PRINT_STYLE_ID)?.remove();
}

function triggerBrowserPrint(documentTitle: string) {
  injectPrintStyle();
  const originalTitle = document.title;
  document.title = documentTitle;

  const cleanup = () => {
    document.title = originalTitle;
    removePrintStyle();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);

  // Fallback cleanup in case the browser doesn't fire afterprint
  // (rare, but not universally guaranteed across browsers).
  setTimeout(cleanup, 5000);

  window.print();
}

export function exportCVAsPDF(applicantName: string) {
  const fileName = applicantName.trim() ? `${applicantName.trim()} - CV` : "CV";
  triggerBrowserPrint(fileName);
}

export function printCV(applicantName: string) {
  const fileName = applicantName.trim() ? `${applicantName.trim()} - CV` : "CV";
  triggerBrowserPrint(fileName);
}