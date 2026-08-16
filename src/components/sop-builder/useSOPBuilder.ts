import { useState, useEffect, useCallback, useRef } from "react";
import { SOPData, SOPStepId, SOPTemplateId, createEmptySOP, SOP_STEPS } from "./sopTypes";
import { notifySuccess } from "../../lib/notifications";

const STORAGE_KEY = "kiplan_sop_builder_draft";

interface StoredDraft {
  data: SOPData;
  template: SOPTemplateId;
  lastSavedAt: string | null;
}

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
  return { data: createEmptySOP(), template: "academic", lastSavedAt: null };
}

export function useSOPBuilder() {
  const [draft, setDraft] = useState<StoredDraft>(loadDraft);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const hasUnsavedChanges = useRef(false);

  // Auto-persist quietly (this is what makes "Continue Later" work at
  // all — closing the tab and coming back should not lose work), but
  // "Save Draft" as a distinct, explicit action still exists below for
  // the student's peace of mind, with its own visible timestamp.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // SOP Builder still works in-memory for this session; it just
      // won't survive a reload if localStorage is unavailable.
    }
  }, [draft]);

  const activeStep = SOP_STEPS[activeStepIndex];

  const goToStep = useCallback((stepId: SOPStepId) => {
    const index = SOP_STEPS.findIndex((s) => s.id === stepId);
    if (index >= 0) setActiveStepIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setActiveStepIndex((i) => Math.min(i + 1, SOP_STEPS.length - 1));
  }, []);

  const goBack = useCallback(() => {
    setActiveStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const updateSection = useCallback((stepId: SOPStepId, text: string) => {
    hasUnsavedChanges.current = true;
    setDraft((prev) => ({ ...prev, data: { ...prev.data, [stepId]: text } }));
  }, []);

  const setTemplate = useCallback((template: SOPTemplateId) => {
    setDraft((prev) => ({ ...prev, template }));
  }, []);

  /** Module: Save Draft / Continue Later — explicit save, separate from the silent auto-persist above. */
  const saveDraft = useCallback(() => {
    hasUnsavedChanges.current = false;
    setDraft((prev) => ({ ...prev, lastSavedAt: new Date().toISOString() }));
    notifySuccess("Document saved successfully!");
  }, []);

  const resetSOP = useCallback(() => {
    setDraft({ data: createEmptySOP(), template: draft.template, lastSavedAt: null });
    setActiveStepIndex(0);
  }, [draft.template]);

  return {
    data: draft.data,
    template: draft.template,
    lastSavedAt: draft.lastSavedAt,
    steps: SOP_STEPS,
    activeStep,
    activeStepIndex,
    isFirstStep: activeStepIndex === 0,
    isLastStep: activeStepIndex === SOP_STEPS.length - 1,
    goToStep,
    goNext,
    goBack,
    updateSection,
    setTemplate,
    saveDraft,
    resetSOP,
  };
}