import React, { useState, useEffect, Suspense } from "react";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// Home is kept as a static, eager import: currentTab initializes to "home",
// so this is the one page component genuinely required for the very first
// render, with no lazy/Suspense delay.
import Home from "./pages/Home";
// Unsubscribe is also a static, eager import: it must render immediately
// for the /unsubscribe path, the same reasoning as Home.
import Unsubscribe from "./pages/Unsubscribe";
// The remaining 28 page components are route-level code-split via
// React.lazy — each becomes its own chunk, fetched only when its
// currentTab value is actually reached, instead of all being bundled
// into the single initial JS chunk regardless of which page is visited.
const Scholarships = React.lazy(() => import("./pages/Scholarships"));
const Countries = React.lazy(() => import("./pages/Countries"));
const Women = React.lazy(() => import("./pages/Women"));
const Entrepreneurs = React.lazy(() => import("./pages/Entrepreneurs"));
const Resources = React.lazy(() => import("./pages/Resources"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const TermsOfUse = React.lazy(() => import("./pages/TermsOfUse"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const Sitemap = React.lazy(() => import("./pages/Sitemap"));
const Disclaimer = React.lazy(() => import("./pages/Disclaimer"));
const Faq = React.lazy(() => import("./pages/Faq"));
const Eligibility = React.lazy(() => import("./pages/Eligibility"));
const ShareExperience = React.lazy(() => import("./pages/ShareExperience"));
const Organizations = React.lazy(() => import("./pages/Organizations"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const AIAssistant = React.lazy(() => import("./pages/AIAssistant"));
const CVBuilderPage = React.lazy(() => import("./pages/CVBuilder"));
const SOPBuilderPage = React.lazy(() => import("./pages/SOPBuilder"));
const LORBuilderPage = React.lazy(() => import("./pages/LORBuilder"));
const MotivationLetterBuilderPage = React.lazy(() => import("./pages/MotivationLetterBuilder"));
const LegalNotarialPage = React.lazy(() => import("./pages/LegalNotarial"));
const WorkspacePage = React.lazy(() => import("./pages/Workspace"));
const VisaPreparationHub = React.lazy(() => import("./pages/VisaPreparationHub"));
const ScholarshipCalendar = React.lazy(() => import("./pages/ScholarshipCalendar"));
const UniversityExplorer = React.lazy(() => import("./pages/UniversityExplorer"));
const UniversityComparisonPage = React.lazy(() => import("./pages/UniversityComparison"));
import PlaceholderView from "./components/PlaceholderView";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";

// Minimal, unobtrusive fallback shown only for the brief moment a
// lazy-loaded page chunk is being fetched. Not a new persistent UI
// element — it never appears for the initial Home render (Home is not
// lazy), only during navigation to any other page.
function RouteLoadingFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" aria-label="Loading page" />
    </div>
  );
}

// Four fixed font-size levels, applied as a root-level percentage via
// document.documentElement.style.fontSize. Since the vast majority of
// this app's text uses Tailwind's rem-based text-* classes, they scale
// automatically with this root value. Levels: 87.5% (min) / 100%
// (default) / 112.5% / 125% (max).
const FONT_SIZE_LEVELS = [87.5, 100, 112.5, 125];
const DEFAULT_FONT_SIZE_LEVEL_INDEX = 1; // 100%
const FONT_SIZE_STORAGE_KEY = "kiplan_font_size_level";

function readStoredFontSizeLevelIndex(): number {
  if (typeof window === "undefined") return DEFAULT_FONT_SIZE_LEVEL_INDEX;
  try {
    const raw = window.localStorage.getItem(FONT_SIZE_STORAGE_KEY);
    if (raw === null) return DEFAULT_FONT_SIZE_LEVEL_INDEX;
    const parsed = Number(raw);
    // Falls back safely to the default on anything invalid/out of range,
    // rather than trusting stored data blindly.
    if (!Number.isInteger(parsed) || parsed < 0 || parsed >= FONT_SIZE_LEVELS.length) {
      return DEFAULT_FONT_SIZE_LEVEL_INDEX;
    }
    return parsed;
  } catch {
    return DEFAULT_FONT_SIZE_LEVEL_INDEX;
  }
}

export default function App() {
  // Minimal, self-contained check for the one real URL-path route this
  // app has: /unsubscribe?token=... . Everything else in this app is
  // currentTab state, not URL-based routing -- this is a deliberately
  // narrow addition, not a switch to a routing library. Computed once
  // via useState's lazy initializer so it participates correctly in the
  // normal hooks order (no conditional hook calls).
  const [isUnsubscribePage] = useState<boolean>(
    () => typeof window !== "undefined" && window.location.pathname === "/unsubscribe"
  );
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [fontSizeLevelIndex, setFontSizeLevelIndex] = useState<number>(readStoredFontSizeLevelIndex);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string | null>(null);
  const [placeholderMeta, setPlaceholderMeta] = useState<{
    title: string;
    category: string;
    description: string;
    comingSoonFeatures: string[];
    type: "opportunity" | "resource";
  } | null>(null);

  // Sync dark mode class with standard Document Root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Apply the font-size level to the document root and persist it.
  // Entirely independent of the dark-mode effect above -- different DOM
  // property (style.fontSize vs. classList), different localStorage key,
  // no shared state between the two features.
  useEffect(() => {
    document.documentElement.style.fontSize = `${FONT_SIZE_LEVELS[fontSizeLevelIndex]}%`;
    try {
      window.localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(fontSizeLevelIndex));
    } catch {
      // Storage unavailable (private browsing, quota, etc.) -- the
      // in-session size still applies via the line above; only
      // persistence across a refresh is lost, not the feature itself.
    }
  }, [fontSizeLevelIndex]);

  const decreaseFontSize = () => {
    setFontSizeLevelIndex((i) => Math.max(0, i - 1));
  };
  const increaseFontSize = () => {
    setFontSizeLevelIndex((i) => Math.min(FONT_SIZE_LEVELS.length - 1, i + 1));
  };
  const resetFontSize = () => {
    setFontSizeLevelIndex(DEFAULT_FONT_SIZE_LEVEL_INDEX);
  };

  // Navigate to scholarship with details pre-loaded
  const handleSelectScholarship = (id: string) => {
    setSelectedScholarshipId(id);
    setCurrentTab("opportunities");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Pre-filter scholarships by country
  const handleSelectCountryFilter = (countryName: string) => {
    setSelectedScholarshipId("all"); // trigger clean state
    setCurrentTab("opportunities");
    // We will use standard scrolling
    window.scrollTo({ top: 0, behavior: "smooth" });

    // We can simulate pre-setting filters in the Scholarships tab by passing state or a custom event/callback
    // Let's set the selectedScholarshipId to a special query string or rely on the Scholarships tab to parse
    setTimeout(() => {
      const searchInput = document.querySelector("input[placeholder='Search grants or topics...']") as HTMLInputElement;
      if (searchInput) {
        searchInput.value = countryName;
        // Trigger synthetic input event
        const event = new Event("input", { bubbles: true });
        searchInput.dispatchEvent(event);
        // Force state update by directly focusing/typing or using the ref
      }
    }, 100);
  };

  if (isUnsubscribePage) {
    return <Unsubscribe />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-nepal-dark-deep text-slate-800 dark:text-slate-100 transition-colors duration-300">

      {/* Toast notifications — follows the site's dark/light mode */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme={isDarkMode ? "dark" : "light"}
      />

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        fontSizeLevelIndex={fontSizeLevelIndex}
        onDecreaseFontSize={decreaseFontSize}
        onResetFontSize={resetFontSize}
        onIncreaseFontSize={increaseFontSize}
        setPlaceholderMeta={setPlaceholderMeta}
      />

      {/* Main Content Render with beautiful motion transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            <Suspense fallback={<RouteLoadingFallback />}>
            {currentTab === "home" && (
              <Home
                setCurrentTab={setCurrentTab}
                onSelectScholarship={handleSelectScholarship}
              />
            )}

            {(currentTab === "opportunities" || currentTab === "scholarships") && (
              <Scholarships
                selectedScholarshipId={selectedScholarshipId}
                setSelectedScholarshipId={setSelectedScholarshipId}
                setCurrentTab={setCurrentTab}
              />
            )}

            {currentTab === "eligibility" && (
              <ProtectedRoute setCurrentTab={setCurrentTab}>
                <Eligibility setCurrentTab={setCurrentTab} />
              </ProtectedRoute>
            )}

            {currentTab === "share-experience" && (
              <ProtectedRoute setCurrentTab={setCurrentTab}>
                <ShareExperience setCurrentTab={setCurrentTab} />
              </ProtectedRoute>
            )}

            {currentTab === "organizations" && (
              <Organizations />
            )}

            {currentTab === "ai-assistant" && (
              <ProtectedRoute setCurrentTab={setCurrentTab}>
                <AIAssistant setCurrentTab={setCurrentTab} />
              </ProtectedRoute>
            )}

            {currentTab === "dashboard" && (
              <ProtectedRoute setCurrentTab={setCurrentTab}>
                <Dashboard setCurrentTab={setCurrentTab} setPlaceholderMeta={setPlaceholderMeta} />
              </ProtectedRoute>
            )}

            {currentTab === "cv-builder" && (
              <ProtectedRoute setCurrentTab={setCurrentTab}>
                <CVBuilderPage setCurrentTab={setCurrentTab} />
              </ProtectedRoute>
            )}

            {currentTab === "sop-builder" && (
              <ProtectedRoute setCurrentTab={setCurrentTab}>
                <SOPBuilderPage setCurrentTab={setCurrentTab} />
              </ProtectedRoute>
            )}

            {currentTab === "lor-builder" && (
              <ProtectedRoute setCurrentTab={setCurrentTab}>
                <LORBuilderPage setCurrentTab={setCurrentTab} />
              </ProtectedRoute>
            )}

            {currentTab === "motivation-letter-builder" && (
              <ProtectedRoute setCurrentTab={setCurrentTab}>
                <MotivationLetterBuilderPage setCurrentTab={setCurrentTab} />
              </ProtectedRoute>
            )}

            {currentTab === "legal-notarial" && (
              <ProtectedRoute setCurrentTab={setCurrentTab}>
                <LegalNotarialPage setCurrentTab={setCurrentTab} />
              </ProtectedRoute>
            )}

            {currentTab === "workspace" && (
              <ProtectedRoute setCurrentTab={setCurrentTab}>
                <WorkspacePage setCurrentTab={setCurrentTab} setPlaceholderMeta={setPlaceholderMeta} />
              </ProtectedRoute>
            )}

            {currentTab === "login" && (
              <Login setCurrentTab={setCurrentTab} />
            )}

            {currentTab === "register" && (
              <Register setCurrentTab={setCurrentTab} />
            )}

            {currentTab === "countries" && (
              <Countries
                setCurrentTab={setCurrentTab}
                setSelectedScholarshipId={setSelectedScholarshipId}
                onSelectCountryFilter={handleSelectCountryFilter}
                setPlaceholderMeta={setPlaceholderMeta}
              />
            )}

            {currentTab === "women" && (
              <Women
                onSelectScholarship={handleSelectScholarship}
              />
            )}

            {currentTab === "entrepreneurs" && (
              <Entrepreneurs
                onSelectScholarship={handleSelectScholarship}
              />
            )}

            {currentTab === "resources" && (
              <Resources setCurrentTab={setCurrentTab} />
            )}

            {currentTab === "university-explorer" && (
              <UniversityExplorer />
            )}

            {currentTab === "visa-prep" && (
              <VisaPreparationHub />
            )}

            {currentTab === "scholarship-calendar" && (
              <ScholarshipCalendar
                onSelectScholarship={handleSelectScholarship}
                setCurrentTab={setCurrentTab}
              />
            )}

            {currentTab === "university-comparison" && (
              <UniversityComparisonPage onSelectCountryFilter={handleSelectCountryFilter} />
            )}

            {currentTab === "about" && (
              <About setCurrentTab={setCurrentTab} />
            )}

            {currentTab === "contact" && (
              <Contact />
            )}

            {currentTab === "terms" && (
              <TermsOfUse />
            )}

            {currentTab === "privacy" && (
              <PrivacyPolicy />
            )}

            {currentTab === "sitemap" && (
              <Sitemap setCurrentTab={setCurrentTab} />
            )}

            {currentTab === "disclaimer" && (
              <Disclaimer />
            )}

            {currentTab === "faq" && (
              <Faq />
            )}

            {currentTab === "placeholder" && placeholderMeta && (
              <PlaceholderView {...placeholderMeta} />
            )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Professional Footer */}
      <Footer setCurrentTab={setCurrentTab} />

    </div>
  );
}