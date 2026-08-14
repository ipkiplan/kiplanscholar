import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Send, GraduationCap, User } from "lucide-react";

/**
 * ES-005-A — AI Assistant Foundation.
 *
 * Scope: conversation layout, message bubbles, input area, local
 * session state only. Deliberately excludes: OpenAI/LLM integration,
 * Supabase search, scholarship matching, document generation, memory
 * persistence, feedback systems — all reserved for later ES-005 phases.
 *
 * Greeting text is the exact, locked wording from
 * docs/architecture/PRODUCT_CONSTITUTION_V1.md — not paraphrased.
 *
 * "Local session state only": messages live in plain in-memory React
 * state, reset each time this view is (re)entered. No sessionStorage,
 * no backend persistence — deliberately, since persistence is a form
 * of "memory," which is explicitly out of scope for this phase.
 */

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
}

const LOCKED_GREETING =
  "🙏 Namaste! Welcome to KIPLANScholar.\nI'm your Scholar Assistant.\nI can help you discover scholarships, understand eligibility, prepare application documents, and guide you through the application process.\nWhat would you like help with today?";

// ES-005-A compliance fix: session memory must persist across toggling
// between Dashboard and Chat, and across navigation away/back, while
// remaining strictly session-only (DOC-003 §9.12, Decision 1 — no
// permanent history). sessionStorage clears on tab/window close, which
// is the correct scope — same pattern already established and approved
// in Scholarships.tsx for search-state persistence.
const SESSION_STORAGE_KEY = "kiplan_scholar_assistant_messages";

// Honest placeholder response — per the Product Constitution's Personality
// rule ("never pretends to know information it does not have") and
// Safety Boundaries ("never invent scholarships/deadlines/funding info").
// This is NOT a simulated AI answer; it's a clear, honest statement that
// real conversational matching isn't built yet, with a working, real
// alternative action offered instead.
const PLACEHOLDER_RESPONSE =
  "Thanks for sharing that. Full conversational scholarship matching is coming in a future update — I can't yet give you personalized recommendations here. In the meantime, you're welcome to explore real, verified scholarships directly using Explore Opportunities, or browse by country and funding type.";

interface ScholarAssistantChatProps {
  onBack: () => void;
}

export default function ScholarAssistantChat({ onBack }: ScholarAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Corrupt or inaccessible sessionStorage — fall through to the
      // default greeting seed below, same as a fresh session.
    }
    return [{ id: "greeting", role: "assistant", text: LOCKED_GREETING }];
  });
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Conversation still works in-memory for this view; it just won't
      // survive a toggle/navigation if sessionStorage is unavailable
      // (e.g. private browsing quota) — same fallback behavior already
      // accepted in Scholarships.tsx's identical pattern.
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: `assistant-${Date.now()}`, role: "assistant", text: PLACEHOLDER_RESPONSE },
    ]);
    setInputValue("");
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm flex flex-col h-[600px] max-h-[75vh]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl text-slate-500 hover:text-nepal-crimson hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div className="p-2 rounded-xl bg-nepal-crimson/10 text-nepal-crimson dark:text-nepal-crimson-light">
          <GraduationCap className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="font-extrabold text-sm text-slate-800 dark:text-white">Scholar Assistant</h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Here to help you find opportunities</p>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isAssistant = message.role === "assistant";
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-start gap-2.5 ${isAssistant ? "justify-start" : "justify-end"}`}
              >
                {isAssistant && (
                  <div className="p-1.5 rounded-lg bg-nepal-crimson/10 text-nepal-crimson dark:text-nepal-crimson-light shrink-0 mt-0.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    isAssistant
                      ? "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm"
                      : "bg-nepal-blue text-white rounded-tr-sm"
                  }`}
                >
                  {message.text}
                </div>
                {!isAssistant && (
                  <div className="p-1.5 rounded-lg bg-nepal-blue/10 text-nepal-blue dark:text-sky-400 shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSend} className="flex items-center gap-2 px-5 py-4 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about scholarships, eligibility, or applications..."
          className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nepal-crimson/20 focus:border-nepal-crimson transition-all"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="p-2.5 bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white rounded-xl shadow-sm hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}