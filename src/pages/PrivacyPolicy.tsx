import React from "react";
import { 
  ShieldCheck, 
  Target, 
  Database, 
  Activity, 
  Lock, 
  Cookie, 
  ExternalLink, 
  UserCheck, 
  GraduationCap 
} from "lucide-react";
import { motion } from "motion/react";

export default function PrivacyPolicy() {
  const sections = [
    {
      id: "our-mission",
      title: "1. Our Mission",
      icon: Target,
      color: "text-[#102B5C] bg-[#102B5C]/5 dark:text-sky-300 dark:bg-sky-300/10",
      content: (
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
          KIPLANScholar is dedicated to providing free, high-quality, and comprehensive educational information for Nepali students, women, researchers, entrepreneurs, and professionals seeking international opportunities. We strive to clear the path toward overseas studies and global grants by maintaining an inclusive and open information database.
        </p>
      )
    },
    {
      id: "information-we-collect",
      title: "2. Information We Collect",
      icon: Database,
      color: "text-[#D7263D] bg-[#D7263D]/5 dark:text-[#F42E56] dark:bg-[#F42E56]/10",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            To provide a custom-tailored search experience, we may collect information explicitly provided by you. We only collect the necessary information required to deliver our core features:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 text-sm">
            {[
              "Name",
              "Email Address",
              "Country / Nationality",
              "Academic Background",
              "Saved Scholarships / Favorites",
              "User Preferences"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <span className="w-2 h-2 rounded-full bg-[#D7263D]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "how-we-use",
      title: "3. How We Use Information",
      icon: Activity,
      color: "text-[#102B5C] bg-[#102B5C]/5 dark:text-sky-300 dark:bg-sky-300/10",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            Any collected information is processed solely for the advancement of your academic discoverability. Specifically, we use your details to:
          </p>
          <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-sm">
            {[
              "Create and manage personalized user accounts",
              "Personalize scholarship recommendations to fit your specific eligibility",
              "Send reminders and notification updates regarding upcoming application deadlines",
              "Improve website search indexing and technical capabilities",
              "Enhance the overall user experience and discoverability workflow"
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-[#D7263D] font-bold shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "data-security",
      title: "4. Data Security",
      icon: Lock,
      color: "text-[#102B5C] bg-[#102B5C]/5 dark:text-sky-300 dark:bg-sky-300/10",
      content: (
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
          We take information protection seriously. KIPLANScholar employs secure standard authentication models, encrypted HTTPS network connections, firewalls, and modern industry security practices to safeguard all collected user information from unauthorized access, alteration, or disclosure.
        </p>
      )
    },
    {
      id: "cookies",
      title: "5. Cookies",
      icon: Cookie,
      color: "text-[#D7263D] bg-[#D7263D]/5 dark:text-[#F42E56] dark:bg-[#F42E56]/10",
      content: (
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
          We utilize essential and performance cookies to remember your visual preferences (such as Dark Mode selection) and to monitor basic website analytics. These cookies improve website performance, streamline load times, and help us understand which types of grants Nepali students search for the most.
        </p>
      )
    },
    {
      id: "third-party",
      title: "6. Third-Party Services",
      icon: ExternalLink,
      color: "text-[#102B5C] bg-[#102B5C]/5 dark:text-sky-300 dark:bg-sky-300/10",
      content: (
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
          To deliver robust web infrastructure, we may utilize trusted third-party cloud services. These include standard secure authentication services, scalable web hosting infrastructures, and database providers that comply with strict global privacy standards.
        </p>
      )
    },
    {
      id: "user-rights",
      title: "7. User Rights",
      icon: UserCheck,
      color: "text-emerald-600 bg-emerald-500/5 dark:text-emerald-400 dark:bg-emerald-500/10",
      content: (
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
          You maintain full control over your personal data. At any time, you have the right to request access to, correction of, or complete deletion of your personal information and registered account details. Simply contact our support team to initiate a request.
        </p>
      )
    },
    {
      id: "educational-mission",
      title: "8. Educational Mission",
      icon: GraduationCap,
      color: "text-[#102B5C] bg-[#102B5C]/5 dark:text-sky-300 dark:bg-sky-300/10",
      content: (
        <div className="p-4 bg-[#102B5C]/5 dark:bg-[#102B5C]/10 border-l-4 border-[#102B5C] rounded-r-xl text-slate-700 dark:text-slate-300 text-sm italic">
          "KIPLANScholar exists to reduce information barriers and empower Nepali students through access to authentic educational opportunities around the world."
        </div>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        
        {/* Decorative Badge */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D7263D] dark:text-[#F42E56] font-mono bg-[#D7263D]/5 dark:bg-[#F42E56]/10 px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="h-3.5 w-3.5" />
            Privacy Integrity
          </span>
        </div>

        {/* Page Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#102B5C] dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
            Protecting your information while helping Nepali students access global opportunities.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-[#D7263D] to-[#102B5C] mx-auto rounded-full" />
        </div>

        {/* Dynamic Cards Stack */}
        <div className="space-y-6">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white dark:bg-[#071126] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(16,43,92,0.03)] hover:shadow-[0_8px_30px_-6px_rgba(16,43,92,0.06)] dark:hover:border-slate-700/60 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className={`p-3 rounded-xl shrink-0 ${section.color}`}>
                    <Icon className="h-5.5 w-5.5" />
                  </div>
                  <div className="space-y-3 w-full">
                    <h2 className="text-lg font-bold text-[#102B5C] dark:text-white tracking-tight">
                      {section.title}
                    </h2>
                    <div className="border-t border-slate-100 dark:border-slate-800/40 pt-3">
                      {section.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Support & Inquiry CTA */}
        <div className="bg-[#102B5C]/5 dark:bg-[#071126] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 text-center space-y-4">
          <h3 className="text-base font-bold text-[#102B5C] dark:text-white">
            Want to request data deletion or update your profile details?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Our legal compliance team at KIPLAN Law & Notary is ready to process any GDPR/privacy requests within 48 business hours.
          </p>
          <div className="pt-2">
            <a 
              href="mailto:ipkiplan@gmail.com?subject=Privacy%20Data%20Request" 
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#102B5C] hover:bg-[#D7263D] dark:bg-sky-500 dark:hover:bg-[#D7263D] text-white text-xs font-bold rounded-xl shadow-md transition-colors duration-300 cursor-pointer"
            >
              Submit Privacy Request
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Elegant Footer Notice */}
        <div className="border-t border-slate-100 dark:border-slate-800/40 pt-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            © 2026 KIPLANScholar – Your trusted scholarship discovery platform.
          </p>
        </div>

      </div>
    </div>
  );
}
