import React, { useState, useEffect, FormEvent } from "react";
import { Mail, Loader2, GraduationCap } from "lucide-react";
import { loginWithGoogle } from "../lib/auth";
import { loginUser } from "../lib/auth";
import PasswordInput from "../components/auth/PasswordInput";
import { useAuth } from "../context/AuthContext";

interface LoginProps {
  setCurrentTab: (tab: string) => void;
}

export default function Login({ setCurrentTab }: LoginProps) {
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // If a session already exists (e.g. this tab was left open on the login
  // form and the user just confirmed their email / is already signed in),
  // leave the login form automatically instead of showing it indefinitely.
  useEffect(() => {
    if (!authLoading && user) {
      setCurrentTab("dashboard");
    }
  }, [authLoading, user, setCurrentTab]);

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!password) {
      errors.password = "Password is required.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      // Store the remember-me preference BEFORE signing in, since our
      // storage adapter reads this flag as soon as the session is written.
      localStorage.setItem("kiplan_remember_me", rememberMe ? "true" : "false");

      const { error: signInError } = await loginUser(email.trim(), password);

      if (signInError) {
        // Supabase returns "Invalid login credentials" for both wrong
        // password AND unregistered email — intentionally vague, so we
        // pass it through as-is rather than trying to be more specific
        // (being specific here would let someone enumerate valid emails).
        if (signInError.message.toLowerCase().includes("invalid login credentials")) {
          setError("Incorrect email or password. Please try again.");
        } else if (signInError.message.toLowerCase().includes("email not confirmed")) {
          setError("Please verify your email before logging in. Check your inbox for the confirmation link.");
        } else {
          setError("Something went wrong while signing in. Please try again.");
        }
        return;
      }

      setCurrentTab("dashboard");
    } catch (err) {
      setError("Unable to reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-nepal-dark">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 mb-4">
            <GraduationCap className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome to KIPLANScholar
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Log in to continue exploring scholarships on KIPLANScholar
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
          {/* Google Login Button */}
<button
  type="button"
  onClick={async () => {
    await loginWithGoogle();
  }}
  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
>
  <span className="font-bold text-blue-600">G</span>
  Continue with Google
</button>

{/* Divider */}
<div className="flex items-center gap-3 my-5">
  <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
  <span className="text-xs text-slate-400">OR</span>
  <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
</div>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  className={`w-full rounded-lg border bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    fieldErrors.email
                      ? "border-red-400 focus:ring-red-300"
                      : "border-slate-300 dark:border-slate-600 focus:ring-blue-400 focus:border-blue-400"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-500">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              error={fieldErrors.password}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 transition-colors"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
  New to KIPLANScholar?{" "}
  <button
    type="button"
    onClick={() => setCurrentTab("register")}
    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
  >
    Register here
  </button>
</p>
      </div>
    </div>
  );
}