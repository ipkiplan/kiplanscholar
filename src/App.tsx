import React, { useState, useEffect, Suspense } from "react";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// Home is kept as a static, eager import: currentTab initializes to "home",
// so this is the one page component genuinely required for the very first
// render, with no lazy/Suspense delay.
import Home from "./pages/Home";
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

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-nepal-dark text-slate-800 dark:text-slate-100 transition-colors duration-300">

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