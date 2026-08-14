import { useState, useEffect, useCallback } from "react";
import { LORData, LORStepId, LORTypeId, createEmptyLOR, LOR_SECTIONS } from "./lorTypes";

const STORAGE_KEY = "kiplan_lor_builder_draft";

interface StoredDraft {
  data: LORData;
  lorType: LORTypeId;
  lastSavedAt: string | null;
}

const PREVIEW_STEP: LORStepId = "preview";
const STEP_IDS: LORStepId[] = [...LOR_SECTIONS.map((s) => s.id), PREVIEW_STEP];

function loadDraft(): StoredDraft {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.data && parsed.lorType) {
        return parsed as StoredDraft;
      }
    }
  } catch {
    // Corrupt or inaccessible storage — start fresh, same as a first visit.
  }
  return { data: createEmptyLOR(), lorType: "academic-professor", lastSavedAt: null };
}

export function useLORBuilder() {
  const [draft, setDraft] = useState<StoredDraft>(loadDraft);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // LOR Builder still works in-memory for this session; it just
      // won't survive a reload if localStorage is unavailable.
    }
  }, [draft]);

  const activeStepId = STEP_IDS[activeStepIndex];
  const activeSection = LOR_SECTIONS.find((s) => s.id === activeStepId) ?? null;

  const goToStep = useCallback((stepId: LORStepId) => {
    const index = STEP_IDS.indexOf(stepId);
    if (index >= 0) setActiveStepIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setActiveStepIndex((i) => Math.min(i + 1, STEP_IDS.length - 1));
  }, []);

  const goBack = useCallback(() => {
    setActiveStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const updateField = useCallback((key: keyof LORData, value: string) => {
    setDraft((prev) => ({ ...prev, data: { ...prev.data, [key]: value } }));
  }, []);

  const setLORType = useCallback((lorType: LORTypeId) => {
    setDraft((prev) => ({ ...prev, lorType }));
  }, []);

  const saveDraft = useCallback(() => {
    setDraft((prev) => ({ ...prev, lastSavedAt: new Date().toISOString() }));
  }, []);

  const resetLOR = useCallback(() => {
    setDraft({ data: createEmptyLOR(), lorType: draft.lorType, lastSavedAt: null });
    setActiveStepIndex(0);
  }, [draft.lorType]);

  return {
    data: draft.data,
    lorType: draft.lorType,
    lastSavedAt: draft.lastSavedAt,
    stepIds: STEP_IDS,
    activeStepId,
    activeStepIndex,
    activeSection,
    isFirstStep: activeStepIndex === 0,
    isLastStep: activeStepIndex === STEP_IDS.length - 1,
    goToStep,
    goNext,
    goBack,
    updateField,
    setLORType,
    saveDraft,
    resetLOR,
  };
}