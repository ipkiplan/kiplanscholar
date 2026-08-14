/**
 * ES-011 — shared document-builder infrastructure.
 *
 * Genuinely generic version of exportCV.ts / exportSOP.ts,
 * parameterized by the print-area element id instead of being
 * copy-pasted a third time. CV/SOP Builder's own export files are
 * intentionally left untouched — new infrastructure, not a
 * modification to already-shipped work.
 *
 * Same disclosed approach as the two prior builders: both "Export
 * PDF" and "Print" use window.print() targeting a print-only
 * stylesheet — not a silent one-click download. See the ES-006A
 * Completion Report for the full rationale (avoiding new npm
 * dependencies).
 */

function triggerBrowserPrint(printAreaId: string, documentTitle: string) {
  const styleId = `${printAreaId}-print-style`;

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @media print {
        body * { visibility: hidden; }
        #${printAreaId}, #${printAreaId} * { visibility: visible; }
        #${printAreaId} { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; border-radius: 0 !important; }
      }
    `;
    document.head.appendChild(style);
  }

  const originalTitle = document.title;
  document.title = documentTitle;

  const cleanup = () => {
    document.title = originalTitle;
    document.getElementById(styleId)?.remove();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  setTimeout(cleanup, 5000);

  window.print();
}

export function exportDocumentAsPDF(printAreaId: string, fileLabel: string, documentTypeLabel: string) {
  triggerBrowserPrint(printAreaId, fileLabel.trim() ? `${fileLabel.trim()} - ${documentTypeLabel}` : documentTypeLabel);
}

export function printDocument(printAreaId: string, fileLabel: string, documentTypeLabel: string) {
  triggerBrowserPrint(printAreaId, fileLabel.trim() ? `${fileLabel.trim()} - ${documentTypeLabel}` : documentTypeLabel);
}