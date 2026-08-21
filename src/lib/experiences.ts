import { supabase } from "./supabase";

/**
 * Data-layer functions for public.student_experiences, following the same
 * interface pattern as applications.ts.
 *
 * Row shapes match the live table exactly, verified by direct Supabase
 * introspection at migration time.
 */

const PHOTO_BUCKET = "student-experience-photos";
// Signed URL lifetime for displaying a photo on the public homepage. Long
// enough that it won't need re-generating on every single render, short
// of building a refresh mechanism this first version doesn't need yet.
const SIGNED_URL_EXPIRY_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type ExperienceStatus = "pending" | "approved" | "rejected";

export interface StudentExperience {
  id: string;
  user_id: string;
  name: string;
  role_context: string;
  scholarship_name: string | null;
  experience_text: string;
  location: string | null;
  avatar_url: string | null;
  status: ExperienceStatus;
  consent_given_at: string; // timestamptz
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
}

export interface SubmitExperienceInput {
  userId: string;
  name: string;
  roleContext: string;
  scholarshipName?: string;
  experienceText: string;
  location?: string;
  avatarUrl?: string;
}

function isExternalUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}

/**
 * Resolves a stored avatar_url value into something actually usable in an
 * <img src>. Two cases:
 *   - An external URL (e.g. a value from before the upload feature
 *     existed) is returned as-is.
 *   - An internal Storage object path (the only kind newly created by
 *     uploadExperiencePhoto) is exchanged for a real, working signed URL.
 *     The bucket is private, so a raw path is never directly fetchable --
 *     this call itself is subject to the same Storage RLS policy as any
 *     other read, so it will only succeed for a path that genuinely
 *     belongs to an approved experience (or the caller's own).
 */
async function resolveAvatarUrl(avatarUrl: string | null): Promise<string | null> {
  if (!avatarUrl) return null;
  if (isExternalUrl(avatarUrl)) return avatarUrl;

  const { data, error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrl(avatarUrl, SIGNED_URL_EXPIRY_SECONDS);

  if (error || !data) return null;
  return data.signedUrl;
}

/**
 * Uploads an already-compressed image Blob to the private photos bucket,
 * under a path scoped to the given user's own folder -- matching the
 * Storage RLS policies exactly (INSERT is only permitted when
 * (storage.foldername(name))[1] = auth.uid()). Returns the storage path
 * (not a public URL, since the bucket is private) -- this is what gets
 * stored in avatar_url and later resolved via resolveAvatarUrl.
 */
export async function uploadExperiencePhoto(
  userId: string,
  blob: Blob
): Promise<{ path: string | null; error: string | null }> {
  const fileName = `${userId}/${crypto.randomUUID()}.jpg`;

  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(fileName, blob, {
    contentType: "image/jpeg",
    upsert: false,
  });

  if (error) {
    return { path: null, error: error.message };
  }
  return { path: fileName, error: null };
}

/**
 * Fetches only publicly-approved experiences -- safe to call from an
 * unauthenticated visitor. RLS itself already enforces this (a pending or
 * rejected row is never returned to anon/other users regardless of what
 * this query asks for), but the explicit status filter here keeps the
 * query's own intent clear.
 */
export async function fetchApprovedExperiences(): Promise<{
  data: StudentExperience[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("student_experiences")
    .select("id, name, role_context, scholarship_name, experience_text, location, avatar_url, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  const resolved = await Promise.all(
    (data as unknown as StudentExperience[]).map(async (exp) => ({
      ...exp,
      avatar_url: await resolveAvatarUrl(exp.avatar_url),
    }))
  );

  // Cast is safe: the selected columns above are a strict subset of
  // StudentExperience, and user_id/status/consent_given_at/updated_at are
  // deliberately not requested here -- there's no reason for the public
  // homepage query to pull a submitter's user_id at all.
  return { data: resolved, error: null };
}

/**
 * Submits a new experience for review. Requires an authenticated user_id;
 * the caller is responsible for only invoking this from behind
 * ProtectedRoute (or an equivalent auth check). RLS independently enforces
 * that a user can only ever insert a row with their own auth.uid() as
 * user_id, regardless of what this function is given.
 *
 * avatarUrl, if provided, is expected to already be an internal Storage
 * path returned by uploadExperiencePhoto -- not a raw uploaded file.
 */
export async function submitExperience(input: SubmitExperienceInput): Promise<{
  error: string | null;
}> {
  const { error } = await supabase.from("student_experiences").insert({
    user_id: input.userId,
    name: input.name.trim(),
    role_context: input.roleContext.trim(),
    scholarship_name: input.scholarshipName?.trim() || null,
    experience_text: input.experienceText.trim(),
    location: input.location?.trim() || null,
    avatar_url: input.avatarUrl?.trim() || null,
    // status defaults to 'pending' and consent_given_at defaults to now()
    // at the database level -- not set explicitly here, since consent is
    // what submitting this form (with its consent checkbox checked)
    // itself represents.
  });

  if (error) {
    return { error: error.message };
  }
  return { error: null };
}

/**
 * Fetches the current user's own submissions, regardless of status --
 * used so a user can see their own pending/approved/rejected experience(s)
 * on their own account, never anyone else's.
 */
export async function fetchOwnExperiences(userId: string): Promise<{
  data: StudentExperience[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("student_experiences")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }
  return { data: data as StudentExperience[], error: null };
}