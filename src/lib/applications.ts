import { supabase } from "./supabase";

/**
 * Phase 1 — Application Database Schema & Application Data Model.
 *
 * Row shapes below match the `applications` and `application_documents`
 * tables exactly, verified by direct Supabase introspection at
 * migration time (not assumed from the migration SQL alone). Follows
 * the same interface/query-function pattern as scholarships.ts.
 *
 * This is a Phase 1 data-layer file only. Nothing here is imported by,
 * or imports from, CV/SOP/LOR/Motivation Letter Builder, Resources.tsx,
 * LegalNotarial.tsx, or Scholar Assistant. No UI in this project calls
 * any function in this file yet — that's later-phase work.
 */

export type ApplicationStatus =
  | "planning"
  | "in_preparation"
  | "ready_to_submit"
  | "submitted"
  | "under_review"
  | "result";

export type DocumentStatus =
  | "not_started"
  | "draft"
  | "saved"
  | "needs_review"
  | "reviewed"
  | "ready";

export interface Application {
  id: string;
  user_id: string;
  scholarship_id: string | null;
  application_name: string;
  status: ApplicationStatus;
  deadline: string | null; // date, ISO format (YYYY-MM-DD)
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
}

export interface ApplicationDocument {
  id: string;
  application_id: string;
  /**
   * Deliberately a plain string, not a union type, matching the
   * database's deliberately unconstrained (no CHECK) column — new
   * document types must not require a type-level migration here any
   * more than a database one. Initial conceptual values: "cv", "sop",
   * "lor", "motivation_letter", "academic_documents", "passport",
   * "other".
   */
  document_type: string;
  status: DocumentStatus;
  content_ref: string | null;
  required: boolean;
  last_updated: string; // timestamptz
  created_at: string; // timestamptz
}

export interface ApplicationResult<T> {
  data: T | null;
  error: string | null;
}

function toErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "An unexpected error occurred while accessing application data.";
}

// ---------------------------------------------------------------------
// applications
// ---------------------------------------------------------------------

/**
 * Returns all applications belonging to the current authenticated
 * user. RLS enforces this server-side regardless of any client-side
 * filtering — this function does not need to (and does not) pass a
 * user_id filter itself.
 */
export async function getApplications(): Promise<ApplicationResult<Application[]>> {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: data as Application[], error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}

/**
 * Returns a single application by its id, or null if not found (or
 * not owned by the current user, per RLS).
 */
export async function getApplication(id: string): Promise<ApplicationResult<Application>> {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: data as Application | null, error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}

export async function createApplication(input: {
  application_name: string;
  scholarship_id?: string | null;
  deadline?: string | null;
}): Promise<ApplicationResult<Application>> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { data: null, error: userError?.message ?? "Not authenticated." };
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: userData.user.id,
        application_name: input.application_name,
        scholarship_id: input.scholarship_id ?? null,
        deadline: input.deadline ?? null,
      })
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: data as Application, error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}

export async function updateApplication(
  id: string,
  updates: Partial<Pick<Application, "application_name" | "status" | "deadline" | "scholarship_id">>
): Promise<ApplicationResult<Application>> {
  try {
    const { data, error } = await supabase
      .from("applications")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: data as Application, error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}

export async function deleteApplication(id: string): Promise<ApplicationResult<null>> {
  try {
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}

// ---------------------------------------------------------------------
// application_documents
// ---------------------------------------------------------------------

/**
 * Returns every document row for a given application. RLS enforces
 * that this only succeeds if the requesting user owns the parent
 * application.
 */
export async function getApplicationDocuments(
  applicationId: string
): Promise<ApplicationResult<ApplicationDocument[]>> {
  try {
    const { data, error } = await supabase
      .from("application_documents")
      .select("*")
      .eq("application_id", applicationId)
      .order("created_at", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: data as ApplicationDocument[], error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}

export async function createApplicationDocument(input: {
  application_id: string;
  document_type: string;
  required?: boolean;
}): Promise<ApplicationResult<ApplicationDocument>> {
  try {
    const { data, error } = await supabase
      .from("application_documents")
      .insert({
        application_id: input.application_id,
        document_type: input.document_type,
        required: input.required ?? true,
      })
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: data as ApplicationDocument, error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}

export async function updateApplicationDocument(
  id: string,
  updates: Partial<Pick<ApplicationDocument, "status" | "content_ref" | "required">>
): Promise<ApplicationResult<ApplicationDocument>> {
  try {
    const { data, error } = await supabase
      .from("application_documents")
      .update({ ...updates, last_updated: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: data as ApplicationDocument, error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}