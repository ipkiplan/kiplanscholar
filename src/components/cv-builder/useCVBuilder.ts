import { useState, useEffect, useCallback } from "react";
import { CVData, CVListSectionKey, CVStepId, CVTemplateId, PersonalInfo, SkillEntry } from "./cvTypes";
import { createEmptyCV, generateEntryId, CV_STEPS } from "./emptyCV";

const STORAGE_KEY = "kiplan_cv_builder_draft";

interface StoredDraft {
  data: CVData;
  template: CVTemplateId;
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
  return { data: createEmptyCV(), template: "scholarship" };
}

export function useCVBuilder() {
  const [draft, setDraft] = useState<StoredDraft>(loadDraft);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // CV Builder still works in-memory for this session; it just
      // won't survive a reload if localStorage is unavailable (e.g.
      // private browsing quota).
    }
  }, [draft]);

  const activeStep = CV_STEPS[activeStepIndex];

  const goToStep = useCallback((stepId: CVStepId) => {
    const index = CV_STEPS.findIndex((s) => s.id === stepId);
    if (index >= 0) setActiveStepIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setActiveStepIndex((i) => Math.min(i + 1, CV_STEPS.length - 1));
  }, []);

  const goBack = useCallback(() => {
    setActiveStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const updatePersonalInfo = useCallback((patch: Partial<PersonalInfo>) => {
    setDraft((prev) => ({ ...prev, data: { ...prev.data, personalInfo: { ...prev.data.personalInfo, ...patch } } }));
  }, []);

  const updateSummary = useCallback((text: string) => {
    setDraft((prev) => ({ ...prev, data: { ...prev.data, summary: text } }));
  }, []);

  const setTemplate = useCallback((template: CVTemplateId) => {
    setDraft((prev) => ({ ...prev, template }));
  }, []);

  // Generic CRUD for every repeatable list section, driven by the
  // section key — this is what lets one RepeatableEntryForm component
  // serve all twelve list-based sections instead of one file each.
  const addEntry = useCallback((section: CVListSectionKey) => {
    setDraft((prev) => ({
      ...prev,
      data: { ...prev.data, [section]: [...prev.data[section], { id: generateEntryId() }] },
    }));
  }, []);

  const updateEntry = useCallback((section: CVListSectionKey, id: string, field: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [section]: prev.data[section].map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)),
      },
    }));
  }, []);

  const removeEntry = useCallback((section: CVListSectionKey, id: string) => {
    setDraft((prev) => ({
      ...prev,
      data: { ...prev.data, [section]: prev.data[section].filter((entry) => entry.id !== id) },
    }));
  }, []);

  const addSkill = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setDraft((prev) => ({
      ...prev,
      data: { ...prev.data, skills: [...prev.data.skills, { id: generateEntryId(), name: trimmed }] },
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setDraft((prev) => ({ ...prev, data: { ...prev.data, skills: prev.data.skills.filter((s: SkillEntry) => s.id !== id) } }));
  }, []);

  const resetCV = useCallback(() => {
    setDraft({ data: createEmptyCV(), template: draft.template });
    setActiveStepIndex(0);
  }, [draft.template]);

  return {
    data: draft.data,
    template: draft.template,
    steps: CV_STEPS,
    activeStep,
    activeStepIndex,
    isFirstStep: activeStepIndex === 0,
    isLastStep: activeStepIndex === CV_STEPS.length - 1,
    goToStep,
    goNext,
    goBack,
    updatePersonalInfo,
    updateSummary,
    setTemplate,
    addEntry,
    updateEntry,
    removeEntry,
    addSkill,
    removeSkill,
    resetCV,
  };
}