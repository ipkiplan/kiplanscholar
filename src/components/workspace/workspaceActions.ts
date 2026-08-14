/**
 * ES-006C.1 — shared My Documents / Curated Resources card-action
 * handlers, extracted so Dashboard.tsx doesn't need to duplicate the
 * routing logic Workspace.tsx already has inline.
 *
 * Workspace.tsx itself is NOT modified to use this file — its own
 * inline handlers are left exactly as they were, per the explicit
 * "do not modify Workspace.tsx" constraint. This file exists purely
 * so the new Dashboard.tsx integration has a single, tested place for
 * this logic rather than a second inline copy.
 */

import { DocumentCardConfig, ResourceCardConfig, PlaceholderContent } from "./workspaceData";

type SetCurrentTab = (tab: string) => void;
type SetPlaceholderMeta = (meta: {
  title: string;
  category: string;
  description: string;
  comingSoonFeatures: string[];
  type: "opportunity" | "resource";
}) => void;

export function openPlaceholder(
  setPlaceholderMeta: SetPlaceholderMeta,
  setCurrentTab: SetCurrentTab,
  content: PlaceholderContent
) {
  setPlaceholderMeta({ ...content, type: "resource" });
  setCurrentTab("placeholder");
}

export function handleDocumentAction(
  doc: DocumentCardConfig,
  setCurrentTab: SetCurrentTab,
  setPlaceholderMeta: SetPlaceholderMeta
) {
  if (doc.kind === "builder" && doc.targetTab) {
    setCurrentTab(doc.targetTab);
    return;
  }
  if (doc.kind === "placeholder" && doc.placeholder) {
    openPlaceholder(setPlaceholderMeta, setCurrentTab, doc.placeholder);
  }
}

export function handleResourceAction(
  resource: ResourceCardConfig,
  setCurrentTab: SetCurrentTab,
  setPlaceholderMeta: SetPlaceholderMeta
) {
  if (resource.kind === "resource" && resource.resourcePresetId) {
    // Same mechanism Navbar's existing handleResourcePreset already uses.
    (window as unknown as { resourcePreset?: string }).resourcePreset = resource.resourcePresetId;
    setCurrentTab("resources");
    return;
  }
  if (resource.kind === "placeholder" && resource.placeholder) {
    openPlaceholder(setPlaceholderMeta, setCurrentTab, resource.placeholder);
  }
}