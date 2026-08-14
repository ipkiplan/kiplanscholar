import { toast } from "sonner";
import { fireConfetti } from "./confetti";

/**
 * Centralized notification system for KIPLANScholar.
 *
 * Every part of the app (auth, dashboard, SOP/LOR builders, scholarship
 * applications, admin tools, etc.) should call these helpers instead of
 * importing `toast` from "sonner" directly. This keeps toast styling,
 * wording conventions, and confetti rules consistent in one place as the
 * app grows.
 *
 * Confetti is reserved for major milestones only (see `celebrate`) —
 * routine actions (saving a scholarship, updating a profile field, a
 * plain successful login) should use `notifySuccess` instead.
 */

export function notifySuccess(message: string): void {
  toast.success(message);
}

export function notifyError(message: string): void {
  toast.error(message);
}

export function notifyInfo(message: string): void {
  toast.info(message);
}

/**
 * Use ONLY for major milestones:
 * - New account registration
 * - Email verification (future)
 * - Profile completion at 100% (future)
 * - Scholarship application submission (future)
 * - Premium purchase (future)
 *
 * Do not use for routine actions like saving a scholarship, logging in,
 * or updating a profile field — those should call notifySuccess instead.
 */
export function celebrate(message: string): void {
  toast.success(message);
  fireConfetti();
}