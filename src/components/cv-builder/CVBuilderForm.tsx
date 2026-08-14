import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCVBuilder } from "./useCVBuilder";
import StepSidebar from "./StepSidebar";
import PersonalInfoForm from "./PersonalInfoForm";
import SummaryForm from "./SummaryForm";
import RepeatableEntryForm from "./RepeatableEntryForm";
import TagInputForm from "./TagInputForm";
import { CVListSectionKey, LIST_SECTION_FIELDS } from "./cvTypes";
import { CVStepMeta } from "./emptyCV";

const SECTION_LABELS: Record<CVListSectionKey, string> = {
  education: "Education",
  workExperience: "Work Experience",
  researchExperience: "Research Experience",
  publications: "Publication",
  conferences: "Conference",
  awards: "Award",
  scholarships: "Scholarship",
  leadership: "Leadership Role",
  volunteering: "Volunteering",
  certifications: "Certification",
  languages: "Language",
  references: "Reference",
};

function isListSection(stepId: string): stepId is CVListSectionKey {
  return stepId in LIST_SECTION_FIELDS;
}

interface CVBuilderFormProps {
  builder: ReturnType<typeof useCVBuilder>;
  onFinish: () => void;
}

export default function CVBuilderForm({ builder, onFinish }: CVBuilderFormProps) {
  const { data, steps, activeStep, activeStepIndex, isFirstStep, isLastStep, goToStep, goNext, goBack } = builder;

  const renderStepForm = (step: CVStepMeta) => {
    if (step.id === "personal") {
      return <PersonalInfoForm value={data.personalInfo} onChange={builder.updatePersonalInfo} />;
    }
    if (step.id === "summary") {
      return <SummaryForm value={data.summary} onChange={builder.updateSummary} />;
    }
    if (step.id === "skills") {
      return <TagInputForm entries={data.skills} onAdd={builder.addSkill} onRemove={builder.removeSkill} />;
    }
    if (isListSection(step.id)) {
      const sectionKey = step.id;
      return (
        <RepeatableEntryForm
          section={sectionKey}
          sectionLabel={SECTION_LABELS[sectionKey]}
          fields={LIST_SECTION_FIELDS[sectionKey]}
          entries={data[sectionKey]}
          onAdd={() => builder.addEntry(sectionKey)}
          onUpdate={(id, field, value) => builder.updateEntry(sectionKey, id, field, value)}
          onRemove={(id) => builder.removeEntry(sectionKey, id)}
        />
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col sm:flex-row h-full">
      <StepSidebar steps={steps} activeStepIndex={activeStepIndex} data={data} onSelectStep={(i) => goToStep(steps[i].id)} />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-5">
          <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-4">{activeStep.label}</h3>
          {renderStepForm(activeStep)}
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
          <button
            type="button"
            onClick={goBack}
            disabled={isFirstStep}
            className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={onFinish}
              className="px-5 py-2.5 bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-95 transition-all cursor-pointer"
            >
              Finish CV
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold text-white bg-nepal-crimson hover:opacity-90 transition-colors cursor-pointer"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}