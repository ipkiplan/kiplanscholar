import React from "react";
import { DollarSign } from "lucide-react";

interface FundingBadgeProps {
  funding: string;
}

export default function FundingBadge({ funding }: FundingBadgeProps) {
  const isFullyFunded = funding.toLowerCase().includes("fully");
  const colorClass = isFullyFunded
    ? "text-emerald-600 bg-emerald-50 border-emerald-200/50 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-800/30"
    : "text-blue-600 bg-blue-50 border-blue-200/50 dark:text-blue-400 dark:bg-blue-950/30 dark:border-blue-800/30";

  return (
    <span
      className={`inline-flex items-center gap-1 text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 rounded font-mono border ${colorClass}`}
      id={`funding-badge-${funding.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <DollarSign className="h-3 w-3 opacity-70" />
      <span>{funding}</span>
    </span>
  );
}
