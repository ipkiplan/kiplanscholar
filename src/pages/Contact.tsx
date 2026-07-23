import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Landmark, Clock, PhoneCall, MessageCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "Scholarships Filter help", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", subject: "Scholarships Filter help", message: "" });
      }, 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-nepal-crimson dark:text-nepal-crimson-light font-mono bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10 px-3 py-1.5 rounded-full">
          Support desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-nepal-blue dark:text-white tracking-tight">
          Let’s Discuss Your Applications
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
          Have an inquiry about scholarship requirements or need guidance attesting transcripts at Keshar Mahal? Send us a message below.
        </p>
      </div>

      {/* Grid Layout Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-nepal-blue dark:text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-nepal-crimson" />
              <span>Send An Inquiry</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fill out your parameters. A KIPLANScholar expert will answer within 24 business hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-center gap-4 animate-bounce">
              <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-500" />
              <div className="text-xs">
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">Message Dispatched!</h4>
                <p className="text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                  Your ticket has been catalogued. An academic officer at our Kathmandu Sundhara head office is preparing your answer.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 font-mono mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Sunil Giri"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-nepal-crimson"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 font-mono mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., sunil@email.com"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-nepal-crimson"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 font-mono mb-1">
                  Subject Matter
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-nepal-crimson cursor-pointer"
                >
                  <option value="Scholarships Filter help">🔍 General Scholarship Criteria Search</option>
                  <option value="SOP Essay Formatting">✍️ SOP Structural Review</option>
                  <option value="Kathmandu MOEST NOC guidance">📜 NOC / Document Attestation Queue advice</option>
                  <option value="Partnerships">💼 Institutional Partner Collaboration</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 font-mono mb-1">
                  Detail Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  placeholder="Describe your undergraduate major, desired country, and specific questions..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-nepal-crimson leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-nepal-blue to-nepal-blue-light dark:from-nepal-crimson dark:to-nepal-crimson-light text-white font-extrabold text-xs rounded-xl shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="h-4.5 w-4.5" />
                <span>Submit Inquiry Ticket</span>
              </button>
            </form>
          )}
        </div>

        {/* Info Grid & Mock Map (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Quick Contact Block */}
          <div className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 space-y-5 shadow-sm">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-base">
              KIPLAN Law & Notary Head Office
            </h3>
            
            <div className="space-y-4">
              {/* Loc */}
              <div className="flex gap-3 items-start text-xs text-slate-600 dark:text-slate-300">
                <MapPin className="h-5 w-5 text-nepal-crimson shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-800 dark:text-white">KIPLAN Law & Notary</span>
                  <span>Civil Trade Centre (CTC) Mall,</span>
                  <span>Sundhara, Kathmandu 44600, Nepal</span>
                </div>
              </div>
              
              {/* Phone Office */}
              <div className="flex gap-3 items-start text-xs text-slate-600 dark:text-slate-300">
                <Phone className="h-4.5 w-4.5 text-nepal-gold shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Office Phone</span>
                  <a href="tel:+97715312040" className="text-slate-700 dark:text-slate-200 hover:text-nepal-gold hover:underline font-semibold transition-colors mt-0.5">
                    +977 1 5312040
                  </a>
                </div>
              </div>

              {/* Mobile (WhatsApp/Viber) */}
              <div className="flex gap-3 items-start text-xs text-slate-600 dark:text-slate-300">
                <MessageCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mobile (WhatsApp/Viber)</span>
                  <a href="tel:+9779849530970" className="text-slate-700 dark:text-slate-200 hover:text-emerald-500 hover:underline font-semibold transition-colors mt-0.5">
                    +977 9849530970
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-3 items-start text-xs text-slate-600 dark:text-slate-300">
                <Mail className="h-4.5 w-4.5 text-sky-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Email</span>
                  <a href="mailto:ipkiplan@gmail.com" className="text-slate-700 dark:text-slate-200 hover:text-sky-400 hover:underline font-semibold transition-colors mt-0.5 break-all">
                    ipkiplan@gmail.com
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex gap-3 items-center text-xs text-slate-600 dark:text-slate-300">
                <Clock className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>Sunday - Friday: 9:00 AM - 5:00 PM (NPT)</span>
              </div>
            </div>

            {/* Quick call dial action */}
            <div className="pt-2">
              <a
                href="tel:+97715312040"
                className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <PhoneCall className="h-4 w-4" /> Call Hotline Directly
              </a>
            </div>
          </div>

          {/* Styled Mock Map */}
          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-4 space-y-3">
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block">
              Sundhara Head Office Location
            </span>
            {/* Map Mock Frame */}
            <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl relative overflow-hidden border border-slate-300/40 dark:border-slate-700/50 flex items-center justify-center text-center">
              {/* Minimal stylized grid background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2c3e50_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Custom marker */}
              <div className="relative flex flex-col items-center">
                <div className="absolute -top-6 animate-ping h-8 w-8 rounded-full bg-nepal-crimson/30" />
                <MapPin className="h-8 w-8 text-nepal-crimson fill-nepal-crimson drop-shadow-md z-1" />
                <span className="mt-2 text-[10px] font-black text-slate-800 dark:text-white bg-white/90 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-md shadow-sm z-1">
                  CTC Mall, Sundhara, Kathmandu
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
