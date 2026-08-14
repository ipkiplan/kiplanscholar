import React from "react";
import { CalendarPlus, FileStack, Send, MessagesSquare, Award, Plane, ArrowRight, ArrowDown } from "lucide-react";

interface ApplicationTimelineProps {
  onViewVisaPrep: () => void;
}

const STEPS = [
  { icon: CalendarPlus, title: "Application Opens", desc: "Scholarship portal opens for submissions." },
  { icon: FileStack, title: "Prepare Documents", desc: "Gather transcripts, essays, and references." },
  { icon: Send, title: "Submit Application", desc: "Complete and submit before the deadline." },
  { icon: MessagesSquare, title: "Interview", desc: "Where applicable — panel or online interview." },
  { icon: Award, title: "Result Expected", desc: "Award decisions are typically announced." },
  { icon: Plane, title: "Visa Preparation", desc: "Begin visa documents once accepted." },
];

export default function ApplicationTimeline({ onViewVisaPrep }: ApplicationTimelineProps) {
  return (
    <div className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 space-y-5">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-nepal-gold font-mono block">
          Planning Reference
        </span>
        <h3 className="text-lg font-extrabold text-nepal-blue dark:text-white mt-1">
          A Typical Scholarship Application Cycle
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Every scholarship's exact timeline differs — this is a general reference to help you plan, not a guarantee for any specific programme.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-stretch gap-2 sm:gap-1">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === STEPS.length - 1;
          return (
            <React.Fragment key={step.title}>
              <div className="flex-1 flex flex-row sm:flex-col items-center sm:items-center gap-3 sm:gap-2 p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 text-left sm:text-center">
                <div className="p-2.5 bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10 text-nepal-crimson dark:text-nepal-crimson-light rounded-xl shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-white">{step.title}</h4>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{step.desc}</p>
                  {isLast && (
                    <button
                      type="button"
                      onClick={onViewVisaPrep}
                      className="mt-1.5 inline-flex items-center gap-1 text-[10.5px] font-bold text-nepal-crimson dark:text-nepal-crimson-light hover:underline cursor-pointer"
                    >
                      Visa Preparation Hub <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              {!isLast && (
                <div className="flex items-center justify-center shrink-0 text-slate-300 dark:text-slate-700">
                  <ArrowDown className="h-4 w-4 sm:hidden" />
                  <ArrowRight className="h-4 w-4 hidden sm:block" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}