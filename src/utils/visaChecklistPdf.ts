/**
 * ES-007A.2 — Visa Preparation Hub: PDF checklist generator.
 *
 * Renders a clean, printable A4 PDF from the same VisaCountryProfile
 * data already shown on the Visa Preparation Hub page — no content is
 * duplicated or re-authored here, only laid out.
 *
 * Uses jsPDF (MIT licensed, client-side, no server round-trip) — the
 * lightest-weight option that reliably produces a real PDF in-browser.
 * Checkboxes are drawn as vector rectangles rather than a Unicode glyph,
 * since jsPDF's standard fonts don't reliably render "□" across all
 * PDF readers.
 */

import { jsPDF } from "jspdf";
import {
  VisaCountryProfile,
  UNIVERSAL_NEPAL_GUIDANCE,
  CONSULTANCY_INTRO,
  CONSULTANCY_GUIDANCE,
  DOCUMENT_PROTECTION_GUIDANCE,
} from "../data/visaPreparation";

/**
 * Deliberately not importing `Country` from src/data/scholarships.ts —
 * that type doesn't actually resolve today (src/types.ts is missing the
 * shared exports it used to have; see the ES-006D.1 Completion Report's
 * "technical debt" note). This generator only needs a name and flag, so
 * a minimal local shape avoids depending on that broken import chain.
 */
interface VisaChecklistCountry {
  name: string;
  flag: string;
}

const PAGE_WIDTH = 210; // A4, mm
const PAGE_HEIGHT = 297; // A4, mm
const MARGIN = 16;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FOOTER_Y = PAGE_HEIGHT - 12;

const COLOR_HEADING = "#1B2A4A"; // matches --nepal-blue
const COLOR_ACCENT = "#A6192E"; // matches --nepal-crimson
const COLOR_BODY = "#334155"; // slate-700
const COLOR_MUTED = "#64748B"; // slate-500
const COLOR_LINE = "#E2E8F0"; // slate-200

/**
 * jsPDF's standard fonts (Helvetica/Times/Courier) use WinAnsiEncoding —
 * they render Latin-1 characters, €, and en/em dashes fine, but garble
 * anything outside that (confirmed empirically: "≈" and Cyrillic both
 * render as junk glyphs). Flag emoji are supplementary-plane characters
 * and are always stripped by the same rule, which is the desired
 * behaviour since this app doesn't embed an emoji-capable font.
 * Applied to every string before it's drawn, so future data additions
 * are protected automatically rather than needing a case-by-case fix.
 */
function sanitizeForPdf(text: string): string {
  return text
    .replace(/\u2248/g, "~")
    .replace(/[^\x00-\xFF\u20AC\u2013\u2014\u2018\u2019\u201C\u201D]/g, "")
    .replace(/\(\s*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function generateVisaChecklistPdf(
  country: VisaChecklistCountry,
  profile: VisaCountryProfile
): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_HEIGHT - MARGIN - 10) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const addSpacer = (h: number) => {
    y += h;
  };

  const addSectionHeading = (rawText: string) => {
    const text = sanitizeForPdf(rawText);
    ensureSpace(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(COLOR_HEADING);
    doc.text(text.toUpperCase(), MARGIN, y);
    y += 2;
    doc.setDrawColor(COLOR_LINE);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 6;
  };

  const addSubheading = (rawText: string) => {
    const text = sanitizeForPdf(rawText);
    ensureSpace(8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(COLOR_ACCENT);
    doc.text(text, MARGIN, y);
    y += 5.5;
  };

  const addChecklistItem = (rawText: string) => {
    const text = sanitizeForPdf(rawText);
    const maxTextWidth = CONTENT_WIDTH - 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(text, maxTextWidth);
    const lineHeight = 4.6;
    const blockHeight = lines.length * lineHeight;
    ensureSpace(blockHeight + 1.5);

    // checkbox square
    doc.setDrawColor(COLOR_MUTED);
    doc.setLineWidth(0.35);
    doc.rect(MARGIN, y - 3.2, 3.2, 3.2);

    doc.setTextColor(COLOR_BODY);
    doc.text(lines, MARGIN + 6, y);
    y += blockHeight + 1.5;
  };

  const addBulletItem = (rawText: string) => {
    const text = sanitizeForPdf(rawText);
    const maxTextWidth = CONTENT_WIDTH - 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(text, maxTextWidth);
    const lineHeight = 4.6;
    const blockHeight = lines.length * lineHeight;
    ensureSpace(blockHeight + 1.5);

    doc.setFillColor(COLOR_ACCENT);
    doc.circle(MARGIN + 1, y - 1.4, 0.7, "F");

    doc.setTextColor(COLOR_BODY);
    doc.text(lines, MARGIN + 5, y);
    y += blockHeight + 1.5;
  };

  const addKeyValueRow = (rawLabel: string, rawValue: string) => {
    const label = sanitizeForPdf(rawLabel);
    const value = sanitizeForPdf(rawValue);
    const labelWidth = 42;
    const maxTextWidth = CONTENT_WIDTH - labelWidth;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(value, maxTextWidth);
    const lineHeight = 4.6;
    const blockHeight = Math.max(lines.length * lineHeight, lineHeight);
    ensureSpace(blockHeight + 1.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLOR_MUTED);
    doc.text(label, MARGIN, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLOR_BODY);
    doc.text(lines, MARGIN + labelWidth, y);
    y += blockHeight + 1.5;
  };

  const addLinkRow = (rawLabel: string, url: string) => {
    const label = sanitizeForPdf(rawLabel);
    const maxTextWidth = CONTENT_WIDTH;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(COLOR_BODY);
    ensureSpace(5.5);
    doc.text(label, MARGIN, y);
    y += 4.4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(COLOR_ACCENT);
    // URL itself is not sanitized for stripping (it must stay exact for
    // the clickable target) but every official URL in the data model is
    // plain ASCII already, so this is a no-op in practice — kept as-is
    // rather than risking a mismatch between displayed and linked URL.
    const lines = doc.splitTextToSize(url, maxTextWidth);
    ensureSpace(lines.length * 4.2 + 2);
    doc.textWithLink(lines.join(" "), MARGIN, y, { url });
    y += lines.length * 4.2 + 3;
  };

  // ---------- Header ----------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(COLOR_HEADING);
  doc.text("KIPLANScholar", MARGIN, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(COLOR_ACCENT);
  doc.text("Visa Preparation Checklist", MARGIN, y);
  y += 8;

  const dateGenerated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(COLOR_BODY);
  // Country flags are emoji (supplementary-plane Unicode) and aren't
  // renderable with jsPDF's standard fonts without embedding a custom
  // emoji font — omitted here by design rather than left to render as
  // broken glyphs. The country name alone is unambiguous.
  doc.text(`Destination: ${sanitizeForPdf(country.name)}`, MARGIN, y);
  y += 5.5;
  doc.setTextColor(COLOR_MUTED);
  doc.text(`Date generated: ${dateGenerated}`, MARGIN, y);
  y += 4;

  doc.setDrawColor(COLOR_ACCENT);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 9;

  // ---------- Visa Overview ----------
  addSectionHeading("Visa Overview");
  addKeyValueRow("Visa Type:", profile.overview.visaType);
  addKeyValueRow("Processing Time:", profile.overview.processingTime);
  addKeyValueRow("Visa Fee:", profile.overview.visaFee);
  addKeyValueRow("Application Method:", profile.overview.applicationMethod);
  addKeyValueRow("Embassy / VFS:", profile.overview.embassyOrVfs);
  addKeyValueRow("Official Website:", profile.overview.officialWebsite);
  addSpacer(4);

  // ---------- Required Documents ----------
  addSectionHeading("Required Documents");
  profile.documentCategories.forEach((cat) => {
    addSubheading(cat.category);
    cat.items.forEach((item) => addChecklistItem(item));
    addSpacer(2.5);
  });

  // ---------- Nepal-Specific Preparation ----------
  addSectionHeading("Nepal-Specific Preparation");
  [...UNIVERSAL_NEPAL_GUIDANCE, ...profile.nepalGuidance].forEach((tip) =>
    addBulletItem(tip)
  );
  addSpacer(4);

  // ---------- Official Resources ----------
  addSectionHeading("Official Resources");
  profile.officialResources.forEach((r) => addLinkRow(r.label, r.url));
  addSpacer(4);

  // ---------- Education Consultancy Guidance (general, not country-specific) ----------
  addSectionHeading("Considering an Education Consultancy?");
  addBulletItem(CONSULTANCY_INTRO);
  addSpacer(1.5);
  CONSULTANCY_GUIDANCE.forEach((point) => {
    addSubheading(point.label);
    addBulletItem(point.description);
  });
  addSpacer(2.5);

  // ---------- Protect Your Original Documents ----------
  addSectionHeading(DOCUMENT_PROTECTION_GUIDANCE.heading);
  addBulletItem(DOCUMENT_PROTECTION_GUIDANCE.intro);
  DOCUMENT_PROTECTION_GUIDANCE.points.forEach((p) => addBulletItem(p));
  addSpacer(1);
  addBulletItem(DOCUMENT_PROTECTION_GUIDANCE.closing);

  // ---------- Footer (disclaimer + page numbers on every page) ----------
  const pageCount = doc.getNumberOfPages();
  const disclaimer =
    "This checklist is provided for general guidance only. Students should always verify the latest visa " +
    "requirements with the official embassy, visa authority, and their educational institution before submitting an application.";

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(COLOR_LINE);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, FOOTER_Y - 8, PAGE_WIDTH - MARGIN, FOOTER_Y - 8);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_MUTED);
    const disclaimerLines = doc.splitTextToSize(sanitizeForPdf(disclaimer), CONTENT_WIDTH);
    doc.text(disclaimerLines, MARGIN, FOOTER_Y - 3.5);

    if (pageCount > 1) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN, FOOTER_Y + 4, {
        align: "right",
      });
    }
  }

  const fileName = `${country.name.replace(/\s+/g, "-")}-Visa-Checklist.pdf`;
  doc.save(fileName);
}