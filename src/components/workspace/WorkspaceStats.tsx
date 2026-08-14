import React from "react";
import { FileText, BookOpen, CheckCircle2 } from "lucide-react";

interface WorkspaceStatsProps {
  documentsInProgress: number;
  totalDocuments: number;
  totalResources: number;
}

export default function WorkspaceStats({ documentsInProgress, totalDocuments, totalResources }: WorkspaceStatsProps) {
  const stats = [
    { icon: FileText, label: "Documents In Progress", value: `${documentsInProgress} of ${totalDocuments}` },
    { icon: CheckCircle2, label: "Document Types Available", value: String(totalDocuments) },
    { icon: BookOpen, label: "Curated Resources", value: String(totalResources) },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900"
        >
          <div className="p-2 rounded-xl bg-nepal-crimson/10 text-nepal-crimson dark:text-nepal-crimson-light shrink-0">
            <stat.icon className="h-4 w-4" />
          </div>
          <div>
            <div className="font-extrabold text-base text-slate-800 dark:text-white">{stat.value}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}