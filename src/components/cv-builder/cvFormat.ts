import { CVData, CVListSectionKey } from "./cvTypes";

export function formatDateRange(startDate?: string, endDate?: string): string {
  const start = startDate ? formatMonth(startDate) : "";
  const end = endDate ? formatMonth(endDate) : start ? "Present" : "";
  if (!start && !end) return "";
  return [start, end].filter(Boolean).join(" – ");
}

function formatMonth(value: string): string {
  // <input type="month"> gives "YYYY-MM"; render as "Mon YYYY" if valid, otherwise pass through untouched (e.g. free-typed years).
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** True if a list section has at least one entry — used to skip rendering empty sections entirely, so the CV never shows a hollow heading. */
export function hasEntries(data: CVData, key: CVListSectionKey): boolean {
  return data[key].length > 0;
}