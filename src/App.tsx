import React, { useState, useEffect } from "react";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Scholarships from "./pages/Scholarships";
import Countries from "./pages/Countries";
import Women from "./pages/Women";
import Entrepreneurs from "./pages/Entrepreneurs";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Sitemap from "./pages/Sitemap";
import Disclaimer from "./pages/Disclaimer";
import Faq from "./pages/Faq";
import Eligibility from "./pages/Eligibility";
import Organizations from "./pages/Organizations";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import CVBuilderPage from "./pages/CVBuilder";
import SOPBuilderPage from "./pages/SOPBuilder";
import LORBuilderPage from "./pages/LORBuilder";
import MotivationLetterBuilderPage from "./pages/MotivationLetterBuilder";
import LegalNotarialPage from "./pages/LegalNotarial";
import WorkspacePage from "./pages/Workspace";
import VisaPreparationHub from "./pages/VisaPreparationHub";
import ScholarshipCalendar from "./pages/ScholarshipCalendar";
import UniversityExplorer from "./pages/UniversityExplorer";
import UniversityComparisonPage from "./pages/UniversityComparison";
import PlaceholderView from "./components/PlaceholderView";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { motion, AnimatePresence } from "motion/react";

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
              <Eligibility />
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
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Professional Footer */}
      <Footer setCurrentTab={setCurrentTab} />

    </div>
  );
}