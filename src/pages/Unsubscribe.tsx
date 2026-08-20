import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { GraduationCap } from "lucide-react";

/**
 * Standalone unsubscribe landing page for Scholarship Alert emails.
 *
 * Reads `token` from the URL query string and POSTs it to the existing
 * `unsubscribe-scholarship-alert` Edge Function -- that function is not
 * modified by this component. This page never queries the subscriber
 * table directly, never displays a subscriber's email address, and never
 * reveals whether a given token corresponds to a real subscriber (the
 * Edge Function's own generic-response design already ensures this;
 * this page simply reflects that same generic outcome to the visitor).
 *
 * Refreshing this page re-sends the same request, which is safe --
 * unsubscribing an already-unsubscribed row is a no-op on the server.
 */
export default function Unsubscribe() {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "missing-token">("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("missing-token");
      return;
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    fetch(`${supabaseUrl}/functions/v1/unsubscribe-scholarship-alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        setStatus(res.ok ? "success" : "error");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-nepal-dark px-4 text-center">
      <div className="flex items-center gap-2 mb-8">
        <GraduationCap className="h-7 w-7 text-nepal-blue" />
        <span className="font-black text-xl text-nepal-blue">KIPLANScholar</span>
      </div>

      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-3 text-slate-600 dark:text-slate-300">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Processing your request…</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">You've been unsubscribed</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You will no longer receive KIPLANScholar scholarship deadline alerts at this address.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Something went wrong</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              We couldn't process your request right now. Please try again shortly.
            </p>
          </div>
        )}

        {status === "missing-token" && (
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Invalid unsubscribe link</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This link is missing required information. Please use the unsubscribe link from your original email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}