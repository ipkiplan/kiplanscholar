import React from "react";
import { 
  FileText, 
  Scale, 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  Copyright, 
  Globe2, 
  ExternalLink,
  BookOpen,
  UserCheck,
  RefreshCw,
  Mail,
  MapPin,
  Phone,
  GraduationCap
} from "lucide-react";
import { motion } from "motion/react";

export default function TermsOfUse() {
  const sections = [
    {
      id: "about-kiplanscholar",
      title: "1. About KIPLANScholar",
      icon: Info,
      color: "text-[#102B5C] bg-[#102B5C]/5 dark:text-sky-300 dark:bg-sky-300/10",
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
          <p>
            KIPLANScholar is an independent educational information platform developed to help Nepali students, women, researchers, entrepreneurs, professionals, and other opportunity seekers discover scholarships, fellowships, grants, exchange programs, internships, competitions, conferences, and other international opportunities.
          </p>
          <p>
            Our mission is to reduce information barriers by collecting publicly available educational opportunities into one searchable platform.
          </p>
        </div>
      )
    },
    {
      id: "testing-phase-notice",
      title: "2. Testing Phase Notice",
      icon: AlertTriangle,
      color: "text-[#D7263D] bg-[#D7263D]/5 dark:text-[#F42E56] dark:bg-[#F42E56]/10",
      content: (
        <div className="space-y-3">
          <p className="text-[#D7263D] dark:text-[#F42E56] font-bold text-sm bg-[#D7263D]/10 dark:bg-[#F42E56]/10 px-4 py-2.5 rounded-xl border border-[#D7263D]/20 inline-block w-full">
            "KIPLANScholar is currently in its testing and development phase."
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            Features, scholarship information, search results, deadlines, and eligibility criteria may change without prior notice while the platform is being improved. Users are encouraged to verify all information directly from the official scholarship provider before submitting any application.
          </p>
        </div>
      )
    },
    {
      id: "information-purpose-only",
      title: "3. Information Purpose Only",
      icon: Globe2,
      color: "text-[#102B5C] bg-[#102B5C]/5 dark:text-sky-300 dark:bg-sky-300/10",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            All information provided on this website is intended <strong>solely for educational and informational purposes.</strong> KIPLANScholar does not guarantee:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 text-sm">
            {[
              "acceptance into any scholarship",
              "admission to any university",
              "visa approval",
              "funding decisions",
              "interview invitations",
              "job placement",
              "accuracy of third-party information"
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7263D]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-500 dark:text-slate-400 text-xs italic pt-2">
            Final decisions always belong to the respective universities, governments, scholarship agencies, embassies, and funding organizations.
          </p>
        </div>
      )
    },
    {
      id: "no-professional-advice",
      title: "4. No Professional Advice",
      icon: Scale,
      color: "text-[#102B5C] bg-[#102B5C]/5 dark:text-sky-300 dark:bg-sky-300/10",
      content: (
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
          Nothing on this website constitutes legal advice, immigration advice, financial advice, educational consultancy, or professional representation. Users should seek advice directly from the relevant authorities whenever necessary.
        </p>
      )
    },
    {
      id: "limitation-of-liability",
      title: "5. Limitation of Liability",
      icon: ShieldAlert,
      color: "text-[#D7263D] bg-[#D7263D]/5 dark:text-[#F42E56] dark:bg-[#F42E56]/10",
      content: (
        <div className="space-y-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>
            Although every effort is made to provide accurate and updated information, KIPLANScholar, its owners, developers, contributors, affiliates, and partners shall not be liable for any direct or indirect loss arising from:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pl-4 list-disc text-xs text-slate-500 dark:text-slate-400">
            <li>outdated information</li>
            <li>incorrect deadlines</li>
            <li>website interruptions</li>
            <li>application rejection</li>
            <li>scholarship cancellation</li>
            <li>changes made by scholarship providers</li>
            <li>visa refusal</li>
            <li>technical errors</li>
            <li>third-party websites</li>
          </ul>
          <p className="pt-2 font-semibold text-xs text-[#D7263D]">
            Use of this website is entirely at your own discretion.
          </p>
        </div>
      )
    },
    {
      id: "third-party-websites",
      title: "6. Third-Party Websites",
      icon: ExternalLink,
      color: "text-[#102B5C] bg-[#102B5C]/5 dark:text-sky-300 dark:bg-sky-300/10",
      content: (
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
          This website may contain links to external organizations. KIPLANScholar has no control over external websites and accepts no responsibility for their content, policies, or availability.
        </p>
      )
    },
    {
      id: "user-responsibility",
      title: "7. User Responsibility",
      icon: UserCheck,
      color: "text-[#102B5C] bg-[#102B5C]/5 dark:text-sky-300 dark:bg-sky-300/10",
      content: (
        <div className="space-y-2 text-slate-600 dark:text-slate-300 text-sm">
          <p>Users are responsible for:</p>
          <ul className="space-y-1.5 pl-4 list-decimal text-xs text-slate-500 dark:text-slate-400 font-medium">
            <li>verifying all scholarship information</li>
            <li>checking official deadlines</li>
            <li>reviewing eligibility requirements</li>
            <li>submitting accurate applications</li>
            <li>maintaining confidentiality of their login credentials</li>
          </ul>
        </div>
      )
    },
    {
      id: "intellectual-property",
      title: "8. Intellectual Property",
      icon: Copyright,
      color: "text-[#102B5C] bg-[#102B5C]/5 dark:text-sky-300 dark:bg-sky-300/10",
      content: (
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
          Unless otherwise stated, all original content, design, graphics, software, branding, logos, databases, and written materials on this website belong to KIPLANScholar. No material may be copied or redistributed without prior written permission.
        </p>
      )
    },
    {
      id: "changes-to-terms",
      title: "9. Changes to These Terms",
      icon: RefreshCw,
      color: "text-[#102B5C] bg-[#102B5C]/5 dark:text-sky-300 dark:bg-sky-300/10",
      content: (
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
          These Terms of Use may be updated at any time without prior notice. Continued use of the website indicates acceptance of the updated Terms.
        </p>
      )
    },
    {
      id: "contact-info",
      title: "10. Contact Information",
      icon: MapPin,
      color: "text-emerald-600 bg-emerald-500/5 dark:text-emerald-400 dark:bg-emerald-500/10",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-1">
          <div className="space-y-1.5">
            <h4 className="font-bold text-[#102B5C] dark:text-sky-300 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#D7263D]" /> Address
            </h4>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              Civil Trade Centre (CTC) Mall<br />
              Sundhara, Kathmandu 44600<br />
              Nepal
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-[#102B5C] dark:text-sky-300 flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-[#D7263D]" /> Direct Contact
            </h4>
            <div className="text-slate-600 dark:text-slate-300 space-y-1 font-medium">
              <p>Email: <a href="mailto:kiplanscholar@gmail.com" className="text-[#D7263D] hover:underline">kiplanscholar@gmail.com</a></p>
              <p>Phone: <a href="tel:+97715312040" className="text-slate-700 dark:text-slate-200 hover:underline">+977 1 5312040</a></p>
              <p className="pl-12"><a href="tel:+9779849530970" className="text-slate-700 dark:text-slate-200 hover:underline">+977 9849530970</a></p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        
        {/* Navigation Indicator / Breadcrumb */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D7263D] dark:text-[#F42E56] font-mono bg-[#D7263D]/5 dark:bg-[#F42E56]/10 px-3.5 py-1.5 rounded-full">
            <FileText className="h-3.5 w-3.5" />
            Terms of Use
          </span>
        </div>

        {/* Page Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#102B5C] dark:text-white tracking-tight">
            Terms of Use
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-mono font-bold uppercase">
            Last Updated: July 2026
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium pt-1">
            Please read these Terms of Use carefully before using KIPLANScholar.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-[#D7263D] to-[#102B5C] mx-auto rounded-full" />
        </div>

        {/* Welcome Notice */}
        <div className="bg-[#102B5C]/5 dark:bg-[#071126]/60 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-5 sm:p-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
          Welcome to KIPLANScholar. By accessing or using this website, you agree to these Terms of Use. If you do not agree, please discontinue using this website.
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
                transition={{ duration: 0.4, delay: idx * 0.06 }}
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

        {/* Mission Statement Callout */}
        <div className="bg-[#D7263D]/5 dark:bg-[#071126] border border-l-4 border-[#D7263D] dark:border-l-4 dark:border-l-[#D7263D] rounded-r-2xl p-6 text-center space-y-3">
          <p className="text-sm font-semibold text-[#102B5C] dark:text-white">
            Thank you for using KIPLANScholar.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed">
            "Our goal is simple: To help Nepali students discover life-changing opportunities that may otherwise remain hidden."
          </p>
        </div>

        {/* Elegant Footer Notice */}
        <div className="border-t border-slate-100 dark:border-slate-800/40 pt-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            © 2026 KIPLANScholar.
          </p>
        </div>

      </div>
    </div>
  );
}