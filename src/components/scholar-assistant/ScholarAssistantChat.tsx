import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Send, GraduationCap, User, RotateCcw } from "lucide-react";
import {
  ConversationContext,
  INITIAL_CONTEXT,
  GOAL_QUICK_REPLIES,
  submitAnswer,
} from "./conversationEngine";
import { shouldTriggerSearch, runIntelligenceSearch } from "./assistantOrchestrator";

/**
 * ES-005-A — AI Assistant Foundation (chat shell, message list, input area).
 * ES-005-B — Conversation Experience Layer: wires the shell up to the
 * Conversation Engine (./conversationEngine.ts) for one-question-at-a-
 * time question sequencing, quick-reply buttons, and a "New
 * Conversation" reset action.
 * ES-005-D — Intelligence Integration (this revision): when the
 * "find-scholarships" journey completes, this component calls the
 * Intelligence Bridge (./assistantOrchestrator.ts), which is the only
 * place that talks to the Intelligence Layer's single public API,
 * findScholarshipsForApplicant(). This component itself never imports
 * Supabase or any individual intelligence engine directly.
 *
 * conversationEngine.ts (ES-005B) itself remains synchronous and has
 * no dependency on the Intelligence Layer or Supabase — this
 * component, not the engine, is the async caller.
 *
 * Greeting text is the exact, locked wording from
 * docs/architecture/PRODUCT_CONSTITUTION_V1.md — not paraphrased, not
 * touched by ES-005B or ES-005D.
 *
 * "Session context only" (DOC-003 §9.6, §9.12 Decision 1): both the
 * message list AND the conversation's structured context (which
 * journey, which answers) live in sessionStorage — cleared on tab/
 * window close, never sent anywhere, never treated as permanent
 * history.
 */

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
  quickReplies?: string[];
  /** ES-016: real, clickable KIPLAN contact actions (WhatsApp/Call/Email) — absent on every other message. */
  contactLinks?: { label: string; href: string }[];
}

const LOCKED_GREETING =
  "🙏 Namaste! Welcome to KIPLANScholar.\nI'm your Scholar Assistant.\nI can help you discover scholarships, understand eligibility, prepare application documents, and guide you through the application process.\nWhat would you like help with today?";

const SESSION_STORAGE_KEY = "kiplan_scholar_assistant_session";

interface StoredSession {
  messages: Message[];
  context: ConversationContext;
}

function freshSession(): StoredSession {
  return {
    messages: [
      { id: "greeting", role: "assistant", text: LOCKED_GREETING, quickReplies: GOAL_QUICK_REPLIES },
    ],
    context: INITIAL_CONTEXT,
  };
}

function loadSession(): StoredSession {
  try {
    const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        parsed &&
        Array.isArray(parsed.messages) &&
        parsed.messages.length > 0 &&
        parsed.context &&
        typeof parsed.context.stage === "string"
      ) {
        return parsed as StoredSession;
      }
    }
  } catch {
    // Corrupt or inaccessible sessionStorage — fall through to a fresh
    // session, same as a first-time visit.
  }
  return freshSession();
}

interface ScholarAssistantChatProps {
  onBack: () => void;
}

export default function ScholarAssistantChat({ onBack }: ScholarAssistantChatProps) {
  const [session, setSession] = useState<StoredSession>(loadSession);
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, context } = session;

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Conversation still works in-memory for this view; it just won't
      // survive a toggle/navigation if sessionStorage is unavailable
      // (e.g. private browsing quota).
    }
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAnswer = (rawAnswer: string) => {
    if (isSearching) return;
    const trimmed = rawAnswer.trim();
    if (!trimmed) return;

    const result = submitAnswer(context, trimmed);

    // The engine — not this component — decided this answer means "start
    // over." The UI's only job here is to act on that signal.
    if (result.resetRequested) {
      setSession(freshSession());
      setInputValue("");
      return;
    }

    const userMessage: Message = { id: `user-${Date.now()}`, role: "user", text: trimmed };
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      text: result.assistantText,
      quickReplies: result.quickReplies,
      contactLinks: result.contactLinks,
    };

    const triggerSearch = shouldTriggerSearch(context.stage, result.context);

    setSession((prev) => ({
      messages: [...prev.messages, userMessage, assistantMessage],
      context: result.context,
    }));
    setInputValue("");

    // ES-005D integration point: a searchable journey just completed.
    // The engine has already produced its own (static) guidance
    // message above — this appends a second, real-search follow-up
    // message once the Intelligence Layer responds. The engine and
    // its message are untouched either way; this is purely additive.
    if (triggerSearch) {
      setIsSearching(true);
      runIntelligenceSearch(
        result.context,
        [...messages, userMessage, assistantMessage].map((m) => ({ role: m.role, text: m.text }))
      )
        .then((bridgeMessage) => {
          const searchMessage: Message = {
            id: `assistant-search-${Date.now()}`,
            role: "assistant",
            text: bridgeMessage.text,
            quickReplies: bridgeMessage.quickReplies,
          };
          setSession((prev) => ({ ...prev, messages: [...prev.messages, searchMessage] }));
        })
        .finally(() => setIsSearching(false));
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnswer(inputValue);
  };

  const handleQuickReply = (option: string) => {
    handleAnswer(option);
  };

  const handleNewConversation = () => {
    // Only ask for confirmation if there's an actual conversation to
    // lose — avoids an unnecessary interruption right after opening.
    const hasProgress = messages.length > 1;
    if (hasProgress && !window.confirm("Start a new conversation? This will clear the current chat.")) {
      return;
    }
    setSession(freshSession());
    setInputValue("");
  };

  const lastMessage = messages[messages.length - 1];

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
        <div className="flex-1 min-w-0">
          <h2 className="font-extrabold text-sm text-slate-800 dark:text-white">Scholar Assistant</h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Here to help you find opportunities</p>
        </div>
        <button
          type="button"
          onClick={handleNewConversation}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-500 hover:text-nepal-crimson hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shrink-0"
          aria-label="Start a new conversation"
          title="Start a new conversation"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New Conversation</span>
        </button>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isAssistant = message.role === "assistant";
            const isLastMessage = message.id === lastMessage?.id;
            const showQuickReplies =
              isAssistant && isLastMessage && !isSearching && message.quickReplies && message.quickReplies.length > 0;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex flex-col gap-2 ${isAssistant ? "items-start" : "items-end"}`}
              >
                <div className={`flex items-start gap-2.5 ${isAssistant ? "justify-start" : "justify-end"}`}>
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
                </div>

                {/* Quick reply buttons — only rendered for the current, most
                    recent assistant question, so answered questions never
                    show stale, re-clickable options. */}
                {showQuickReplies && (
                  <div className="flex flex-wrap gap-2 pl-9 max-w-[90%]">
                    {message.quickReplies!.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleQuickReply(option)}
                        className="px-3 py-1.5 rounded-full text-xs font-bold border border-nepal-crimson/30 text-nepal-crimson dark:text-nepal-crimson-light bg-nepal-crimson/5 hover:bg-nepal-crimson/10 transition-colors cursor-pointer"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {/* ES-016: real, clickable KIPLAN contact actions — unlike
                    quick replies (which re-submit text into the chat),
                    these are genuine anchor tags that open WhatsApp, the
                    phone dialer, or the mail client. Rendered whenever
                    present, independent of showQuickReplies, since this
                    is the direct-contact response, not a re-clickable
                    conversational question. */}
                {isAssistant && message.contactLinks && message.contactLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 pl-9 max-w-[90%]">
                    {message.contactLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="px-3 py-1.5 rounded-full text-xs font-bold border border-nepal-blue/30 text-nepal-blue dark:text-sky-400 bg-nepal-blue/5 hover:bg-nepal-blue/10 transition-colors cursor-pointer"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5"
          >
            <div className="p-1.5 rounded-lg bg-nepal-crimson/10 text-nepal-crimson dark:text-nepal-crimson-light shrink-0 mt-0.5">
              <GraduationCap className="h-3.5 w-3.5" />
            </div>
            <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 italic">
              Searching verified scholarships...
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSend} className="flex items-center gap-2 px-5 py-4 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isSearching}
          placeholder={isSearching ? "Searching..." : "Type your answer, or tap an option above..."}
          className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nepal-crimson/20 focus:border-nepal-crimson transition-all disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isSearching}
          className="p-2.5 bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white rounded-xl shadow-sm hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}