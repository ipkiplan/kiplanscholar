/**
 * Module: Browser Print-to-PDF export (no new dependencies).
 *
 * Same disclosed approach as exportCV.ts (ES-006A): both "Export PDF"
 * and "Print" use window.print() targeting a print-only stylesheet
 * scoped to #sop-print-area. Choosing "Save as PDF" as the
 * destination in the resulting system dialog produces a PDF — not a
 * silent one-click download. See the ES-006A Completion Report for
 * the full rationale (avoiding new npm dependencies given this
 * project's history of environment-sync friction).
 */

const PRINT_STYLE_ID = "sop-print-style";

function injectPrintStyle() {
  if (document.getElementById(PRINT_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = PRINT_STYLE_ID;
  style.textContent = `
    @media print {
      body * { visibility: hidden; }
      #sop-print-area, #sop-print-area * { visibility: visible; }
      #sop-print-area { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; border-radius: 0 !important; }
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
  setTimeout(cleanup, 5000);

  window.print();
}

export function exportSOPAsPDF(fileLabel: string) {
  triggerBrowserPrint(fileLabel.trim() ? `${fileLabel.trim()} - SOP` : "Statement of Purpose");
}

export function printSOP(fileLabel: string) {
  triggerBrowserPrint(fileLabel.trim() ? `${fileLabel.trim()} - SOP` : "Statement of Purpose");
}