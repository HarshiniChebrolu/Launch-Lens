"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Bot,
  User,
  X,
  Send,
  RotateCcw,
  Copy,
  Check,
  MessageSquare,
  Layers,
  DollarSign,
  Lightbulb,
  HelpCircle,
  Megaphone,
  ArrowRight,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { StartupReport } from "@/types/report";

interface FloatingCopilotProps {
  report?: StartupReport | null;
  activeIdea?: any;
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

const defaultSuggestions = [
  { icon: Layers, label: "Optimize MVP Scope", query: "How can I refine and optimize the MVP feature scope for this startup?" },
  { icon: DollarSign, label: "Reduce Dev Cost", query: "What are the most effective ways to reduce initial development and infrastructure costs?" },
  { icon: Lightbulb, label: "Stress Test Model", query: "What are the hidden risks in the current business model and how can I mitigate them?" },
  { icon: HelpCircle, label: "Investor Q&A", query: "What tough questions are venture capital investors likely to ask about this market?" },
  { icon: Megaphone, label: "GTM Channel Strategy", query: "Suggest the top 3 acquisition channels to acquire the first 100 paying customers." },
];

export default function FloatingCopilot({ report, activeIdea }: FloatingCopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when context changes
  useEffect(() => {
    const title = report?.title || activeIdea?.idea || "your startup concept";
    setMessages([
      {
        role: "assistant",
        content: `Welcome to **LaunchLens Copilot**! I'm equipped with context on **${title}**.\n\nAsk me anything about market demand, competitor moats, MVP scopes, architecture blueprints, or pitch positioning.`,
      },
    ]);
  }, [report?.title, activeIdea]);

  // Handle ESC key to dismiss drawer
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, busy, isOpen]);

  async function ask(questionText?: string) {
    const text = (questionText || input).trim();
    if (!text || busy) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(nextMessages);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report: report || { title: activeIdea?.idea || "Startup Concept" },
          question: text,
          messages: nextMessages,
        }),
      });

      const json = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: json.answer || "I could not generate an answer at this time. Please try rephrasing your question.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Encountered a network issue connecting to the AI model. Please check your connection and try again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleReset() {
    const title = report?.title || activeIdea?.idea || "your concept";
    setMessages([
      {
        role: "assistant",
        content: `Conversation reset. Ready to analyze **${title}**. How can I help you proceed?`,
      },
    ]);
  }

  function copyMessage(text: string, index: number) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  }

  function parseBold(text: string) {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  }

  function renderFormattedContent(content: string) {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={i} className="h-2" />;
      }

      if (trimmed.startsWith("•") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const bulletText = trimmed.replace(/^[•\-\*]\s*/, "");
        return (
          <div key={i} className="flex items-start gap-2 my-1 pl-1">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
            <span className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              {parseBold(bulletText)}
            </span>
          </div>
        );
      }

      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={i} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-[11px] font-mono font-bold text-cyan-400 mt-0.5 shrink-0">
              {numMatch[1]}.
            </span>
            <span className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              {parseBold(numMatch[2])}
            </span>
          </div>
        );
      }

      return (
        <p key={i} className="text-slate-200 text-xs sm:text-sm leading-relaxed my-1">
          {parseBold(line)}
        </p>
      );
    });
  }

  return (
    <>
      {/* 1. FLOATING BOT LAUNCHER BUTTON (Fixed bottom-right corner) */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open LaunchLens AI Copilot"
          title="Ask LaunchLens AI Copilot"
          className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-indigo-600 text-white shadow-2xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-cyan-500/30"
        >
          {/* Subtle animated pulse ring */}
          <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-30 blur-sm group-hover:opacity-60 transition-opacity animate-pulse" />

          {/* Active status indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900" />
          </span>

          {isOpen ? (
            <X className="h-6 w-6 relative z-10" />
          ) : (
            <Sparkles className="h-6 w-6 relative z-10 transition-transform group-hover:rotate-12" />
          )}

          {/* Tooltip on hover */}
          <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-slate-800 bg-slate-900/95 px-3 py-1.5 text-xs font-semibold text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
            Ask LaunchLens AI
          </span>
        </button>
      </div>

      {/* 2. OVERLAY BACKDROP (Click to close) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* 3. SLIDE-OUT AI COPILOT DRAWER (Right side overlay) */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] lg:w-[460px] h-screen bg-slate-900/95 border-l border-slate-800 shadow-2xl backdrop-blur-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="LaunchLens Copilot Chat"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20 shrink-0">
              <Sparkles className="h-4 w-4" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight truncate">
                  LaunchLens Copilot
                </h3>
                <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-bold text-cyan-400 uppercase tracking-wider border border-cyan-500/20">
                  AI Advisor
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Context: {report?.title || activeIdea?.idea || "Startup Workspace"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReset}
              title="Reset conversation"
              className="rounded-lg border border-slate-800 p-1.5 text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsOpen(false)}
              title="Close Copilot (Esc)"
              className="rounded-lg border border-slate-800 p-1.5 text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Strategy Suggestion Chips */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {defaultSuggestions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => ask(item.query)}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-700/60 bg-slate-800/50 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all disabled:opacity-50"
                >
                  <Icon className="h-3 w-3 text-cyan-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={index}
                className={`flex items-start gap-2.5 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    isUser
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400"
                  }`}
                >
                  {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>

                <div
                  className={`relative group max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm ${
                    isUser
                      ? "bg-indigo-600 text-white shadow-md rounded-tr-sm"
                      : "border border-slate-800 bg-slate-800/60 text-slate-200 shadow-sm rounded-tl-sm"
                  }`}
                >
                  {!isUser ? renderFormattedContent(msg.content) : msg.content}

                  {/* Copy message button */}
                  {!isUser && (
                    <button
                      onClick={() => copyMessage(msg.content, index)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-slate-700/60 text-slate-400 hover:text-white transition-opacity"
                      title="Copy response"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {busy && (
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
                <Bot className="h-3.5 w-3.5 animate-pulse" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-slate-800 bg-slate-800/60 px-4 py-3 text-xs text-cyan-300 flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" />
                </span>
                <span>Synthesizing intelligence...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Composer (Fixed at bottom) */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 shrink-0">
          <div className="relative flex items-center rounded-xl border border-slate-700 bg-slate-900/90 shadow-inner focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot about feasibility, rivals, or tech..."
              disabled={busy}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask();
                }
              }}
              className="w-full bg-transparent px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none disabled:opacity-50"
            />

            <button
              onClick={() => ask()}
              disabled={busy || !input.trim()}
              className="m-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-500">
            <span>Powered by Gemini 1.5 Pro</span>
            <span>Press Enter ↵ to send</span>
          </div>
        </div>
      </div>
    </>
  );
}
