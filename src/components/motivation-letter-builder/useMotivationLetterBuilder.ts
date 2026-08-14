import { useState, useEffect, useCallback } from "react";
import { MLData, MLSectionId, MLTemplateId, createEmptyML, ML_SECTIONS, countWords } from "./mlTypes";

const STORAGE_KEY = "kiplan_ml_builder_draft";

interface StoredDraft {
  data: MLData;
  template: MLTemplateId;
  lastSavedAt: string | null;
}

const SECTION_IDS: MLSectionId[] = ML_SECTIONS.map((s) => s.id);

function loadDraft(): StoredDraft {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.data && parsed.template) {
        return parsed as StoredDraft;
      }
    }
  } catch {
    // Corrupt or inaccessible storage — start fresh, same as a first visit.
  }
  return { data: createEmptyML(), template: "scholarship", lastSavedAt: null };
}

export function useMotivationLetterBuilder() {
  const [draft, setDraft] = useState<StoredDraft>(loadDraft);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Auto-persist quietly, same pattern as SOP/LOR Builder — "Save
  // Draft" below is a distinct, explicit action for the student's
  // peace of mind, with its own visible timestamp.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Motivation Letter Builder still works in-memory for this
      // session; it just won't survive a reload if localStorage is
      // unavailable.
    }
  }, [draft]);

  const activeSectionId = SECTION_IDS[activeStepIndex];
  const activeSection = ML_SECTIONS.find((s) => s.id === activeSectionId)!;

  const goToStep = useCallback((sectionId: MLSectionId) => {
    const index = SECTION_IDS.indexOf(sectionId);
    if (index >= 0) setActiveStepIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setActiveStepIndex((i) => Math.min(i + 1, SECTION_IDS.length - 1));
  }, []);

  const goBack = useCallback(() => {
    setActiveStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const updateSection = useCallback((sectionId: MLSectionId, text: string) => {
    setDraft((prev) => ({ ...prev, data: { ...prev.data, [sectionId]: text } }));
  }, []);

  const setTemplate = useCallback((template: MLTemplateId) => {
    setDraft((prev) => ({ ...prev, template }));
  }, []);

  /** Explicit save, separate from the silent auto-persist above. */
  const saveDraft = useCallback(() => {
    setDraft((prev) => ({ ...prev, lastSavedAt: new Date().toISOString() }));
  }, []);

  const resetML = useCallback(() => {
    setDraft({ data: createEmptyML(), template: draft.template, lastSavedAt: null });
    setActiveStepIndex(0);
  }, [draft.template]);

  const totalWordCount = SECTION_IDS.reduce((sum, id) => sum + countWords(draft.data[id]), 0);

  return {
    data: draft.data,
    template: draft.template,
    lastSavedAt: draft.lastSavedAt,
    sections: ML_SECTIONS,
    sectionIds: SECTION_IDS,
    activeSection,
    activeStepIndex,
    isFirstStep: activeStepIndex === 0,
    isLastStep: activeStepIndex === SECTION_IDS.length - 1,
    totalWordCount,
    goToStep,
    goNext,
    goBack,
    updateSection,
    setTemplate,
    saveDraft,
    resetML,
  };
}