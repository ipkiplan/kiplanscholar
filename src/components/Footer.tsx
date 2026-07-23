import React, { useState } from "react";
import { GraduationCap, Mail, Phone, MapPin, Send, CheckCircle2, Globe, Heart, MessageCircle } from "lucide-react";

interface FooterProps {
  setCurrentTab: (tab: string) => void;
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
                  <span className="font-semibold text-slate-200">KIPLAN Law & Notary</span>
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
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Mobile (WhatsApp/Viber)</span>
                  <a href="tel:+9779849530970" className="text-slate-300 hover:text-emerald-400 hover:underline transition-colors">
                    +977 9849530970
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4.5 w-4.5 text-sky-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email</span>
                  <a href="mailto:ipkiplan@gmail.com" className="text-slate-300 hover:text-sky-400 hover:underline transition-colors break-all">
                    ipkiplan@gmail.com
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
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Thank you! Alerts configured.</span>
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
          <div>
            <span>&copy; {new Date().getFullYear()} KIPLANScholar. All Rights Reserved.</span>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
