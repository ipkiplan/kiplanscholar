import React from "react";
import { 
  ShieldAlert, 
  Scale, 
  AlertTriangle, 
  HelpCircle, 
  Globe, 
  ExternalLink,
  BookOpen,
  MapPin,
  Mail,
  Phone
} from "lucide-react";
import { motion } from "motion/react";

export default function Disclaimer() {
  const points = [
    {
      title: "No Guarantees",
      icon: ShieldAlert,
      color: "text-[#D7263D] bg-[#D7263D]/5 dark:text-[#F42E56] dark:bg-[#F42E56]/10",
      text: "KIPLANScholar does not guarantee scholarship selection, university admission, visa approval, or financial funding. The final selection depends entirely on the respective university board, host country governments, or scholarship foundations."
    },
    {
      title: "Accuracy of Information",
      icon: AlertTriangle,
      color: "text-[#102B5C] bg-[#102B5C]/5 dark:text-sky-300 dark:bg-sky-300/10",
      text: "While we make every effort to verify and publish authentic opportunities, details like deadlines, eligibility criteria, required documents, and fund structures can change without notice. Always verify details on the official provider's website."
    },
    {
      title: "No Professional Advice",
      icon: Scale,
      color: "text-[#102B5C] bg-[#102B5C]/5 dark:text-sky-300 dark:bg-sky-300/10",
      text: "The information provided is for educational and general guidance only. It does not constitute legal, immigration, or professional educational consultancy. Users are encouraged to seek certified legal or official embassy services if needed."
    },
    {
      title: "External Links",
      icon: ExternalLink,
      color: "text-[#102B5C] bg-[#102B5C]/5 dark:text-sky-300 dark:bg-sky-300/10",
      text: "Our portal contains links to external university websites and government portals. KIPLANScholar has no control over the content, reliability, or privacy policies of those external websites."
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        
        {/* Navigation Indicator */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D7263D] dark:text-[#F42E56] font-mono bg-[#D7263D]/5 dark:bg-[#F42E56]/10 px-3.5 py-1.5 rounded-full">
            <ShieldAlert className="h-3.5 w-3.5" />
            Legal Disclaimer
          </span>
        </div>

        {/* Page Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#102B5C] dark:text-white tracking-tight">
            Disclaimer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-mono font-bold uppercase">
            Last Updated: July 2026
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium pt-1">
            Important legal clarifications regarding the information published on KIPLANScholar.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-[#D7263D] to-[#102B5C] mx-auto rounded-full" />
        </div>

        {/* Main Content Statement */}
        <div className="bg-[#102B5C]/5 dark:bg-[#071126]/60 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium space-y-3">
          <p>
            Welcome to KIPLANScholar. KIPLANScholar is an independent scholarship directory and guide developed by <strong>KIPLAN Law & Notary</strong>. 
          </p>
          <p>
            Please note that we are not affiliated with the United Nations, foreign embassies, nor any specific funding agencies. All logos, trademarks, and university identifiers are property of their respective owners.
          </p>
        </div>

        {/* Core Disclaimer Points Stack */}
        <div className="space-y-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white dark:bg-[#071126] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(16,43,92,0.03)] hover:shadow-[0_8px_30px_-6px_rgba(16,43,92,0.06)] dark:hover:border-slate-700/60 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className={`p-3 rounded-xl shrink-0 ${pt.color}`}>
                    <Icon className="h-5.5 w-5.5" />
                  </div>
                  <div className="space-y-2 w-full">
                    <h2 className="text-lg font-bold text-[#102B5C] dark:text-white tracking-tight">
                      {pt.title}
                    </h2>
                    <div className="border-t border-slate-100 dark:border-slate-800/40 pt-3">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                        {pt.text}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legal Liability Disclaimer Statement Card */}
        <div className="bg-[#D7263D]/5 dark:bg-[#071126] border border-l-4 border-[#D7263D] dark:border-l-4 dark:border-l-[#D7263D] rounded-r-2xl p-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-3">
          <h3 className="font-bold text-[#102B5C] dark:text-white">Limitation of Liability</h3>
          <p className="text-xs sm:text-sm">
            In no event shall KIPLAN Law & Notary, KIPLANScholar, its authors, developers, or content contributors be liable for any direct, indirect, incidental, special, or consequential damages (including, but not limited to, financial expenditures, visa costs, application fees, or lost opportunities) arising out of the use, or inability to use, this website or the information published here.
          </p>
        </div>

        {/* Contact Info card */}
        <div className="bg-slate-50 dark:bg-[#071126] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 text-center space-y-4">
          <h3 className="text-base font-bold text-[#102B5C] dark:text-white">
            Have questions about official verification or notary services?
          </h3>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#D7263D]" /> Sundhara, Kathmandu</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-emerald-500" /> +977 1 5312040</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-sky-400" /> ipkiplan@gmail.com</span>
          </div>
        </div>

        {/* Elegant Footer Notice */}
        <div className="border-t border-slate-100 dark:border-slate-800/40 pt-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            © 2026 KIPLANScholar – Developed by KIPLAN Law & Notary.
          </p>
        </div>

      </div>
    </div>
  );
}
