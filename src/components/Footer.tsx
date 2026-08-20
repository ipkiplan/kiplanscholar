import React, { useState } from "react";
import { GraduationCap, Mail, Phone, MapPin, Send, CheckCircle2, Globe, Heart, MessageCircle, Building2 } from "lucide-react";
import { notifySuccess } from "../lib/notifications";

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

// Configurable contact number — change here only, both WhatsApp and Viber
// links derive from this single source. International format, digits only
// (no "+", no spaces), matching what wa.me and Viber's deep-link scheme
// expect.
const OFFICE_MOBILE_INTL = "9779849530970";

/**
 * lucide-react does not ship official brand logos for WhatsApp/Viber (it's
 * intentionally a generic icon set, not a brand-asset library). These are
 * small custom inline SVGs standing in for those brand marks. If pixel-
 * perfect brand compliance matters, swap these for KIPLAN's official
 * WhatsApp/Viber SVG assets when available.
 */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2c-5.514 0-9.99 4.476-9.99 9.99 0 1.76.46 3.484 1.334 4.998L2 22l5.144-1.35a9.96 9.96 0 0 0 4.86 1.24h.004c5.514 0 9.99-4.476 9.99-9.99C21.998 6.476 17.518 2 12.004 2zm0 18.15h-.003a8.19 8.19 0 0 1-4.17-1.14l-.299-.177-3.052.8.815-2.97-.195-.306a8.16 8.16 0 0 1-1.256-4.367c0-4.516 3.674-8.19 8.164-8.19 4.482 0 8.163 3.674 8.163 8.19 0 4.516-3.674 8.16-8.167 8.16z" />
    </svg>
  );
}

function ViberIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-3.2 0-6.06.62-8.02 2.36C2.44 6 2 8.2 2 10.86c0 2.98.6 5.24 2.4 6.86.5.46 1.06.8 1.68 1.02-.06.7-.1 1.72.24 2.4.06.14.2.24.36.24.1 0 .2-.04.28-.1.7-.5 1.86-1.5 2.36-1.98.68.08 1.4.12 2.1.12 3.2 0 6.06-.62 8.02-2.36C20.86 15.6 21.3 13.4 21.3 10.72c0-2.66-.44-4.86-2.24-6.5C17.1 2.62 15.24 2 12.04 2zm0 1.5c2.86 0 4.4.5 5.9 1.9 1.4 1.28 1.86 3.02 1.86 5.32 0 2.3-.46 4.02-1.86 5.3-1.5 1.4-3.66 1.94-6.9 1.9-.7 0-1.4-.05-2.06-.13l-.32-.04-.24.22c-.28.26-.86.78-1.4 1.24.02-.3.02-.62 0-.9l-.04-.44-.42-.16c-.58-.22-1.08-.5-1.5-.9-1.4-1.28-1.9-3.06-1.9-5.4 0-2.34.5-4.06 1.9-5.34 1.5-1.36 3.7-1.9 6.98-1.9z" />
      <path d="M9.9 11.3c-.24-.5-.8-.72-1.3-.5-.5.2-1.2.62-1.34 1.34-.16.8.1 1.9.98 3.08 1.06 1.4 2.4 2.34 3.9 2.78.9.26 1.66.06 2.14-.38.4-.36.68-.9.6-1.42-.06-.4-.32-.68-.7-.84-.4-.16-1.1-.5-1.3-.58-.2-.08-.36-.02-.52.14-.16.16-.42.5-.52.6-.1.1-.2.12-.36.06-.4-.18-.98-.5-1.5-1.02-.4-.4-.68-.86-.78-1.02-.1-.18-.02-.28.08-.38.1-.1.2-.24.3-.36.08-.1.1-.18.16-.3.06-.12.02-.24-.02-.34-.04-.1-.4-.98-.62-1.36z" />
      <path d="M13.02 6.55a.6.6 0 0 0-.12 1.19c1.5.34 2.44 1.28 2.8 2.86a.6.6 0 1 0 1.17-.27c-.46-2-1.68-3.25-3.65-3.72a.6.6 0 0 0-.2-.06z" />
    </svg>
  );
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
      }, 3000);
    }
  };

  // Placeholder share behavior, per requirement: uses the native share
  // sheet where the browser supports it (mobile Safari/Chrome, etc.);
  // falls back to copying a share message to the clipboard elsewhere.
  // Uses window.location.origin rather than a hardcoded/guessed domain,
  // so the shared link is always correct for wherever this is deployed.
  const handleShare = async (audience: string) => {
    const shareUrl = typeof window !== "undefined" ? window.location.origin : "";
    const shareText = `Check out KIPLANScholar — free, verified scholarships and opportunities for Nepali students! ${shareUrl}`;

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as any).share({
          title: "KIPLANScholar",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled the native share sheet — no error state needed.
      }
      return;
    }

    if (typeof navigator === "undefined" || !(navigator as any).clipboard) {
      notifySuccess(`Share KIPLANScholar with ${audience}!`);
      return;
    }

    try {
      await (navigator as any).clipboard.writeText(shareText);
      notifySuccess(`Share link copied — ready to send to ${audience}!`);
    } catch {
      notifySuccess(`Share KIPLANScholar with ${audience}!`);
    }
  };

  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-300 border-t border-slate-800 transition-colors duration-300">
      {/* Top Graphic Panel */}
      <div className="bg-gradient-to-r from-nepal-crimson via-nepal-blue to-nepal-gold h-1.5 w-full" />

      {/* Main Content Areas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand block */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab("home")}>
              <div className="p-2 bg-gradient-to-tr from-nepal-crimson to-nepal-blue rounded-xl text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-black text-white">
                KIPLAN<span className="text-nepal-crimson-light">Scholar</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering Nepali students, women researchers, social entrepreneurs, and global professionals with world-class scholarship opportunities and professional application mentoring.
            </p>
            <div className="flex space-x-3 text-sm text-slate-400">
              <span className="flex items-center gap-1"><Globe className="h-4 w-4 text-nepal-gold" /> Based in Kathmandu, Nepal</span>
            </div>
          </div>

          {/* Quick Tabs Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-tight border-l-2 border-nepal-crimson pl-3">
              Explore Portals
            </h3>
            <ul className="space-y-2.5 text-sm text-left">
              <li>
                <button onClick={() => setCurrentTab("opportunities")} className="hover:text-white hover:underline cursor-pointer transition-all">
                  Opportunities Discovery Hub
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("eligibility")} className="hover:text-white hover:underline cursor-pointer transition-all">
                  AI Eligibility & Match Score
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("organizations")} className="hover:text-white hover:underline cursor-pointer transition-all">
                  Sponsoring Organizations
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("dashboard")} className="hover:text-white hover:underline cursor-pointer transition-all">
                  Student Command Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("resources")} className="hover:text-white hover:underline cursor-pointer transition-all">
                  SOP & Reference LOR Guides
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("countries")} className="hover:text-white hover:underline cursor-pointer transition-all">
                  Country Destination Guides
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("about")} className="hover:text-white hover:underline cursor-pointer transition-all text-nepal-crimson-light font-semibold">
                  About KIPLANScholar
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-tight border-l-2 border-nepal-blue pl-3">
              Connect With Us
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-nepal-crimson shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span>Civil Trade Centre (CTC) Mall,</span>
                  <span>Sundhara, Kathmandu 44600, Nepal</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4.5 w-4.5 text-nepal-gold shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Office</span>
                  <a href="tel:+97715312040" className="text-slate-300 hover:text-nepal-gold hover:underline transition-colors">
                    +977 1 5312040
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Mobile (WhatsApp/Viber)</span>
                  <div className="flex items-center gap-2.5">
                    <a href="tel:+9779849530970" className="text-slate-300 hover:text-emerald-400 hover:underline transition-colors">
                      +977 9849530970
                    </a>
                    <a
                      href={`https://wa.me/${OFFICE_MOBILE_INTL}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Chat on WhatsApp"
                      title="Chat on WhatsApp"
                      className="text-slate-500 hover:text-emerald-400 transition-colors"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                    </a>
                    <a
                      href={`viber://chat?number=%2B${OFFICE_MOBILE_INTL}`}
                      aria-label="Chat on Viber"
                      title="Chat on Viber (where supported)"
                      className="text-slate-500 hover:text-purple-400 transition-colors"
                    >
                      <ViberIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4.5 w-4.5 text-sky-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email</span>
                  <a href="mailto:kiplanscholar@gmail.com" className="text-slate-300 hover:text-sky-400 hover:underline transition-colors break-all">
                    kiplanscholar@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-tight border-l-2 border-nepal-gold pl-3">
              Scholarship Alerts
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Get the latest application deadlines, visa guides, and new funding announcements sent to your inbox.
            </p>
            {subscribed ? (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Thank you for your interest in KIPLANScholar!</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Help more students discover global educational opportunities by sharing KIPLANScholar.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleShare("Friends")}
                    className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Share with Friends
                  </button>
                  <button
                    onClick={() => handleShare("Family")}
                    className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Share with Family
                  </button>
                  <button
                    onClick={() => handleShare("Student Groups")}
                    className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Share with Student Groups
                  </button>
                  <button
                    onClick={() => handleShare("Your Community")}
                    className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Share with Your Community
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-nepal-crimson transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-gradient-to-r from-nepal-crimson to-nepal-crimson-light text-white font-semibold rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span>&copy; {new Date().getFullYear()} KIPLANScholar. All Rights Reserved.</span>
            {/*
              No KIPLAN Pvt. Ltd. logo image asset is available yet — using
              a generic icon as a placeholder. Swap <Building2 /> for the
              real logo <img> once the asset file is provided.
            */}
            <a
              href="https://kiplan.com.np/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>KIPLANScholar is a property of KIPLAN Pvt. Ltd.</span>
            </a>
          </div>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-nepal-crimson fill-nepal-crimson animate-pulse" />
            <span>for Nepali Aspirants worldwide.</span>
          </div>
          <div className="flex gap-4 flex-wrap justify-center sm:justify-end">
            <button 
              onClick={() => {
                setCurrentTab("privacy");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hover:text-slate-300 cursor-pointer transition-colors bg-transparent border-none text-slate-500 font-semibold text-xs"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button 
              onClick={() => {
                setCurrentTab("terms");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }} 
              className="hover:text-slate-300 cursor-pointer transition-colors bg-transparent border-none text-slate-500 font-semibold text-xs"
            >
              Terms of Use
            </button>
            <span>•</span>
            <button 
              onClick={() => {
                setCurrentTab("disclaimer");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }} 
              className="hover:text-slate-300 cursor-pointer transition-colors bg-transparent border-none text-slate-500 font-semibold text-xs"
            >
              Disclaimer
            </button>
            <span>•</span>
            <button 
              onClick={() => {
                setCurrentTab("contact");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hover:text-slate-300 cursor-pointer transition-colors bg-transparent border-none text-slate-500 font-semibold text-xs"
            >
              Contact Us
            </button>
            <span>•</span>
            <button 
              onClick={() => {
                setCurrentTab("sitemap");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hover:text-slate-300 cursor-pointer transition-colors bg-transparent border-none text-slate-500 font-semibold text-xs"
            >
              Sitemap
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}