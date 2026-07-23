import React from "react";

export type OpportunityStatus = "Open" | "Opening Soon" | "Closing Soon" | "Closed";

interface StatusBadgeProps {
  status: OpportunityStatus;
  daysRemaining?: number;
}

export default function StatusBadge({ status, daysRemaining }: StatusBadgeProps) {
  let colorClass = "";
  let dotClass = "";
  let text: string = status;

  switch (status) {
    case "Open":
      colorClass = "text-emerald-600 bg-emerald-500/10 border-emerald-500/15 dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-900/30";
      dotClass = "bg-emerald-500";
      text = daysRemaining && daysRemaining < 365 ? `${daysRemaining} days left` : "Open";
      break;
    case "Opening Soon":
      colorClass = "text-amber-600 bg-amber-500/10 border-amber-500/15 dark:text-amber-400 dark:bg-amber-950/20 dark:border-amber-900/30";
      dotClass = "bg-amber-500";
      text = "Opening Soon";
      break;
    case "Closing Soon":
      colorClass = "text-rose-600 bg-rose-500/10 border-rose-500/15 dark:text-rose-400 dark:bg-rose-950/20 dark:border-rose-900/30";
      dotClass = "bg-rose-500";
      text = daysRemaining && daysRemaining > 0 ? `${daysRemaining} days left` : "Closing Soon";
      break;
    case "Closed":
      colorClass = "text-slate-500 bg-slate-500/10 border-slate-500/15 dark:text-slate-400 dark:bg-slate-950/20 dark:border-slate-900/30";
      dotClass = "bg-slate-400";
      text = "Closed";
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${colorClass}`}
      id={`status-badge-${status.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass} ${status !== "Closed" ? "animate-pulse" : ""}`} />
      <span>{text}</span>
    </span>
  );
}
