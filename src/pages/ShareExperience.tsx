import React, { useState, useRef } from "react";
import { CheckCircle2, AlertCircle, Loader2, Heart, ImagePlus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { submitExperience, uploadExperiencePhoto } from "../lib/experiences";
import { compressImageToTarget } from "../lib/imageCompression";

interface ShareExperienceProps {
  setCurrentTab: (tab: string) => void;
}

/**
 * Submission form for the Student Experiences feature. Rendered behind
 * ProtectedRoute in App.tsx -- a real, signed-in user is guaranteed by
 * the time this component mounts, so `user` here is never null.
 *
 * Submitting does NOT publish anything immediately. The row is created
 * with status 'pending' (the database default) and stays completely
 * private -- visible only to the submitter themselves -- until
 * KIPLANScholar reviews and approves it. This is stated explicitly to
 * the user before they submit, not just implied.
 */
export default function ShareExperience({ setCurrentTab }: ShareExperienceProps) {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [roleContext, setRoleContext] = useState("");
  const [scholarshipName, setScholarshipName] = useState("");
  const [location, setLocation] = useState("");
  const [experienceText, setExperienceText] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);

  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [compressingPhoto, setCompressingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later if removed
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Please choose a JPG, PNG, or WebP image.");
      return;
    }

    setPhotoError(null);
    setCompressingPhoto(true);

    const { blob, error: compressError } = await compressImageToTarget(file);

    setCompressingPhoto(false);

    if (compressError || !blob) {
      setPhotoError(compressError || "Something went wrong processing that photo.");
      return;
    }

    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoBlob(blob);
    setPhotoPreviewUrl(URL.createObjectURL(blob));
  };

  const handleRemovePhoto = () => {
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoBlob(null);
    setPhotoPreviewUrl(null);
    setPhotoError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!user) return; // guarded by ProtectedRoute in practice, but kept explicit here too
    if (!name.trim() || !roleContext.trim() || !experienceText.trim() || !consentChecked) return;

    setSubmitting(true);
    setError(null);

    let avatarPath: string | undefined;
    if (photoBlob) {
      const { path, error: uploadError } = await uploadExperiencePhoto(user.id, photoBlob);
      if (uploadError || !path) {
        setSubmitting(false);
        setError("We couldn't upload your photo right now. Please try again, or submit without a photo.");
        return;
      }
      avatarPath = path;
    }

    const { error: submitError } = await submitExperience({
      userId: user.id,
      name,
      roleContext,
      scholarshipName: scholarshipName || undefined,
      experienceText,
      location: location || undefined,
      avatarUrl: avatarPath,
    });

    setSubmitting(false);

    if (submitError) {
      setError("We couldn't submit your experience right now. Please try again shortly.");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
        <h1 className="text-2xl font-black text-nepal-blue dark:text-white">Thank you for sharing</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Your experience has been submitted and is now awaiting review. We aim to review submissions within 24 hours.
          If it's approved, and since you've given permission to publish it, it may appear in the Student Experiences
          section on the homepage.
        </p>
        <button
          onClick={() => setCurrentTab("home")}
          className="mt-2 px-6 py-2.5 bg-nepal-blue hover:bg-nepal-blue/90 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-nepal-crimson dark:text-nepal-crimson-light font-mono bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
          <Heart className="h-3.5 w-3.5" /> Share Your Experience
        </span>
        <h1 className="text-3xl font-black text-nepal-blue dark:text-white tracking-tight">
          Tell other students your story
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
          Your own words, not a formal essay. A few honest sentences about your scholarship or application journey can
          genuinely help another Nepali student who's just starting out.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-premium space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 font-mono mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sunita Rai"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-nepal-crimson"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 font-mono mb-1">
              Role / Context
            </label>
            <input
              type="text"
              required
              value={roleContext}
              onChange={(e) => setRoleContext(e.target.value)}
              placeholder="e.g., Master's Student, Chevening Scholar"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-nepal-crimson"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 font-mono mb-1">
              Scholarship / Program <span className="normal-case font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              value={scholarshipName}
              onChange={(e) => setScholarshipName(e.target.value)}
              placeholder="e.g., Fulbright Foreign Student Program"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-nepal-crimson"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 font-mono mb-1">
              Location <span className="normal-case font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Kathmandu / London"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-nepal-crimson"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 font-mono mb-1">
            Your Experience
          </label>
          <textarea
            required
            value={experienceText}
            onChange={(e) => setExperienceText(e.target.value)}
            rows={5}
            placeholder="Share what your scholarship or application journey was actually like — what helped, what was hard, what you'd tell someone starting out..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-nepal-crimson leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 font-mono mb-1">
            Upload Your Photo <span className="normal-case font-normal text-slate-400">(optional)</span>
          </label>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-2">
            JPG, PNG or WebP · automatically optimized to 500 KB or less
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoSelect}
            className="hidden"
          />

          {photoPreviewUrl ? (
            <div className="flex items-center gap-3">
              <img
                src={photoPreviewUrl}
                alt="Selected preview"
                className="h-16 w-16 rounded-full object-cover border-2 border-nepal-crimson"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" /> Remove
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-nepal-crimson dark:text-nepal-crimson-light hover:underline cursor-pointer"
              >
                Replace
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={compressingPhoto}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-nepal-crimson dark:hover:border-nepal-crimson-light transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {compressingPhoto ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Optimizing photo...
                </>
              ) : (
                <>
                  <ImagePlus className="h-4 w-4" /> Choose a photo
                </>
              )}
            </button>
          )}

          {photoError && (
            <div className="flex items-center gap-2 text-xs text-red-500 mt-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{photoError}</span>
            </div>
          )}
        </div>

        {/* Explicit "what happens next" explanation, shown before the
            consent checkbox and submit button, not buried afterward. */}
        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Your experience will be reviewed before publication. We aim to review submissions within 24 hours.
          Publication is not guaranteed — it depends on review and on the permission you give below. Your words are
          published as you wrote them; we don't rewrite your story into marketing copy. If you later want your
          published experience removed, you can contact KIPLANScholar and request its removal.
        </div>

        <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer">
          <input
            type="checkbox"
            required
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="mt-0.5 accent-nepal-crimson"
          />
          <span>
            I give KIPLANScholar permission to publish my experience on this website if it is approved. I understand
            my name and submitted experience may become publicly visible.
          </span>
        </label>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !consentChecked || compressingPhoto}
          className="w-full py-3 bg-gradient-to-r from-nepal-crimson to-nepal-crimson-light text-white font-bold rounded-xl text-sm hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit for Review"}
        </button>
      </form>
    </div>
  );
}