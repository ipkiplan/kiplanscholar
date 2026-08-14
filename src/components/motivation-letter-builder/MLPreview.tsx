import React from "react";
import { MLData } from "./mlTypes";
import MLLetterTemplate from "./MLLetterTemplate";

interface MLPreviewProps {
  data: MLData;
}

/** Live Preview — same state, re-rendered on every keystroke via normal React data flow, no separate sync step. */
export default function MLPreview({ data }: MLPreviewProps) {
  return (
    <div className="h-full overflow-y-auto bg-slate-100 dark:bg-slate-950 p-4 sm:p-6">
      <div id="ml-print-area" className="max-w-[720px] mx-auto shadow-lg rounded-sm overflow-hidden">
        <MLLetterTemplate data={data} />
      </div>
    </div>
  );
}