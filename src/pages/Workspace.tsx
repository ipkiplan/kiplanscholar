import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Layers, Plus, FolderKanban } from "lucide-react";
import { MY_DOCUMENTS, CURATED_RESOURCES, DocumentCardConfig, ResourceCardConfig, PlaceholderContent } from "../components/workspace/workspaceData";
import { getDocumentStatus } from "../components/workspace/documentStatus";
import DocumentCard from "../components/workspace/DocumentCard";
import ResourceCard from "../components/workspace/ResourceCard";
import WorkspaceStats from "../components/workspace/WorkspaceStats";
import WorkspaceSearch from "../components/workspace/WorkspaceSearch";
import ApplicationCard from "../components/workspace/ApplicationCard";
import ApplicationDetail from "../components/workspace/ApplicationDetail";
import CreateApplicationModal from "../components/workspace/CreateApplicationModal";
import DeleteApplicationConfirm from "../components/workspace/DeleteApplicationConfirm";
import { Application, getApplications, createApplication, deleteApplication } from "../lib/applications";
import { getScholarships } from "../lib/scholarships";

/**
 * ES-006C — My Workspace (internal name: My Documents Hub).
 *
 * New, independent page. Reuses existing, already-built destinations
 * wherever they exist (CV Builder, SOP Builder, the Resources page's
 * real entries, and the shared PlaceholderView for anything not yet
 * built) — this file contains no document-editing logic, no resource
 * content, and no placeholder-rendering logic of its own; it only
 * decides which existing destination each card routes to.
 *
 * Does not import from, and is not imported by, conversationEngine.ts,
 * assistantOrchestrator.ts, or any file in scholarshipIntelligence/ —
 * no locked module is touched by this file or anything under
 * src/components/workspace/.
 */

interface WorkspacePageProps {
  setCurrentTab: (tab: string) => void;
  setPlaceholderMeta: (meta: { title: string; category: string; description: string; comingSoonFeatures: string[]; type: "opportunity" | "resource" }) => void;
}

function matchesSearch(query: string, ...fields: string[]): boolean {
  if (!query.trim()) return true;
  const normalized = query.trim().toLowerCase();
  return fields.some((field) => field.toLowerCase().includes(normalized));
}

export default function WorkspacePage({ setCurrentTab, setPlaceholderMeta }: WorkspacePageProps) {
  const [search, setSearch] = useState("");

  // --- Phase 2A: My Applications state ---
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationsError, setApplicationsError] = useState<string | null>(null);
  const [scholarshipTitles, setScholarshipTitles] = useState<Record<string, string>>({});
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);

  const loadApplications = useCallback(async () => {
    setApplicationsLoading(true);
    setApplicationsError(null);
    const res = await getApplications();
    setApplicationsLoading(false);
    if (res.error) {
      setApplicationsError(res.error);
      return;
    }
    setApplications(res.data ?? []);
  }, []);

  useEffect(() => {
    loadApplications();
    // Reuses the existing getScholarships() service — same data source
    // CreateApplicationModal uses for its own selector — purely to
    // resolve scholarship_id -> title for display on cards/detail.
    getScholarships().then((res) => {
      if (res.data) {
        const map: Record<string, string> = {};
        res.data.forEach((s) => {
          map[s.id] = s.title;
        });
        setScholarshipTitles(map);
      }
    });
  }, [loadApplications]);

  const handleCreateApplication = async (input: { application_name: string; scholarship_id: string | null; deadline: string | null }) => {
    const res = await createApplication(input);
    if (res.error) {
      throw new Error(res.error);
    }
    await loadApplications();
  };

  const handleApplicationUpdated = (updated: Application) => {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleDeleteApplication = async () => {
    if (!deleteTarget) return;
    const res = await deleteApplication(deleteTarget.id);
    if (res.error) {
      setApplicationsError(res.error);
      return;
    }
    setDeleteTarget(null);
    setSelectedApplicationId(null);
    await loadApplications();
  };

  const selectedApplication = applications.find((a) => a.id === selectedApplicationId) ?? null;

  const openPlaceholder = (content: PlaceholderContent) => {
    setPlaceholderMeta({ ...content, type: "resource" });
    setCurrentTab("placeholder");
  };

  const handleDocumentAction = (doc: DocumentCardConfig) => {
    if (doc.kind === "builder" && doc.targetTab) {
      setCurrentTab(doc.targetTab);
      return;
    }
    if (doc.kind === "placeholder" && doc.placeholder) {
      openPlaceholder(doc.placeholder);
    }
  };

  const handleResourceAction = (resource: ResourceCardConfig) => {
    if (resource.kind === "tab" && resource.targetTab) {
      // Same direct-navigation mechanism DocumentCardConfig's "builder"
      // kind already uses above — reused here, not reimplemented.
      setCurrentTab(resource.targetTab);
      return;
    }
    if (resource.kind === "resource" && resource.resourcePresetId) {
      // Same mechanism Navbar's existing handleResourcePreset already
      // uses — reused here, not reimplemented.
      (window as unknown as { resourcePreset?: string }).resourcePreset = resource.resourcePresetId;
      setCurrentTab("resources");
      return;
    }
    if (resource.kind === "placeholder" && resource.placeholder) {
      openPlaceholder(resource.placeholder);
    }
  };

  const documentsWithStatus = useMemo(
    () =>
      MY_DOCUMENTS.map((doc) => ({
        ...doc,
        statusInfo: doc.kind === "builder" && doc.storageKey ? getDocumentStatus(doc.storageKey) : null,
      })),
    []
  );

  const filteredDocuments = documentsWithStatus.filter((doc) => matchesSearch(search, doc.title, doc.description));
  const filteredResources = CURATED_RESOURCES.filter((r) => matchesSearch(search, r.title, r.description));

  const documentsInProgress = documentsWithStatus.filter((d) => d.statusInfo?.status === "in-progress").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Workspace header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-nepal-crimson/10 text-nepal-crimson dark:text-nepal-crimson-light">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-slate-800 dark:text-white">My Workspace</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">Your documents and curated resources, in one place</p>
          </div>
        </div>
        <WorkspaceSearch value={search} onChange={setSearch} />
      </div>

      {/* Simple statistics */}
      <div className="mb-8">
        <WorkspaceStats
          documentsInProgress={documentsInProgress}
          totalDocuments={MY_DOCUMENTS.length}
          totalResources={CURATED_RESOURCES.length}
        />
      </div>

      {/* My Applications — Phase 2A foundation. Internal list/detail
          state within this same page, per the instruction not to
          introduce a new top-level navigation route for this. */}
      <section className="mb-10">
        {selectedApplication ? (
          <ApplicationDetail
            application={selectedApplication}
            scholarshipTitle={selectedApplication.scholarship_id ? scholarshipTitles[selectedApplication.scholarship_id] : null}
            onBack={() => setSelectedApplicationId(null)}
            onUpdated={handleApplicationUpdated}
            onRequestDelete={() => setDeleteTarget(selectedApplication)}
          />
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="font-extrabold text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FolderKanban className="h-4 w-4" /> My Applications
              </h2>
              {applications.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white hover:opacity-95 shadow-sm shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" /> Create Application
                </button>
              )}
            </div>

            {applicationsError && <p className="text-xs text-red-500 mb-3">{applicationsError}</p>}

            {applicationsLoading ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">Loading your applications...</p>
            ) : applications.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                <p className="font-extrabold text-sm text-slate-700 dark:text-slate-200 mb-1">No applications yet</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                  Create your first application to start tracking a scholarship you're preparing for.
                </p>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white hover:opacity-95 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" /> Create Your First Application
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {applications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    scholarshipTitle={app.scholarship_id ? scholarshipTitles[app.scholarship_id] : null}
                    onOpen={() => setSelectedApplicationId(app.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <CreateApplicationModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateApplication}
      />
      <DeleteApplicationConfirm
        open={!!deleteTarget}
        applicationName={deleteTarget?.application_name ?? ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteApplication}
      />

      {/* My Documents */}
      <section className="mb-10">
        <h2 className="font-extrabold text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">My Documents</h2>
        {filteredDocuments.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">No documents match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                title={doc.title}
                description={doc.description}
                status={doc.kind === "placeholder" ? "coming-soon" : doc.statusInfo?.status ?? "not-started"}
                lastUpdated={doc.statusInfo?.lastUpdated ?? null}
                onAction={() => handleDocumentAction(doc)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Curated Resources */}
      <section>
        <h2 className="font-extrabold text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">Curated Resources</h2>
        {filteredResources.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">No resources match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                title={resource.title}
                description={resource.description}
                isPlaceholder={resource.kind === "placeholder"}
                onOpen={() => handleResourceAction(resource)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}