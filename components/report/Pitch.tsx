"use client";

import React, { useState } from "react";
import { StartupReport } from "@/types/report";
import {
  Rocket,
  Mic,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  Clock,
  Volume2,
  FileText,
  Share2,
  Layers,
  ChevronDown,
  Target,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  ArrowRight,
} from "lucide-react";

export default function Pitch({ report }: { report: StartupReport }) {
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [activeTab, setActiveTab] = useState<"elevator" | "investor" | "hackathon" | "qa">("elevator");
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);

  const pitch = report.pitch || ({} as any);
  const questions = pitch.questions || [];

  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined" && text) {
      navigator.clipboard.writeText(text);
      setCopiedPitch(true);
      setTimeout(() => setCopiedPitch(false), 2000);
    }
  };

  const wordCount = (pitch.short || "").split(/\s+/).filter(Boolean).length;
  const estimatedSeconds = Math.round((wordCount / 130) * 60) || 30;

  return (
    <div className="w-full space-y-8 min-w-0">
      {/* 1. Pitch Workspace Header */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/20 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Rocket className="h-3.5 w-3.5" />
              Pitch & Presentation Studio
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              Audience: Investors & Early Adopters
            </span>
          </div>

          {/* Quick Script Selector Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("elevator")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "elevator"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              30s Elevator
            </button>
            <button
              onClick={() => setActiveTab("investor")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "investor"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Investor Story
            </button>
            <button
              onClick={() => setActiveTab("hackathon")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "hackathon"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Demo Day
            </button>
            <button
              onClick={() => setActiveTab("qa")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "qa"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Q&A Prep
            </button>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          High-Impact Presentation & Narrative Workspace
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          Craft high-converting hooks, rehearse your 30-second speech cadence, and anticipate tough investor questions with structured answers.
        </p>
      </div>

      {/* 2. Active Tab Content */}

      {/* Tab: 30-Second Elevator Pitch */}
      {activeTab === "elevator" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    The 30-Second Spoken Hook
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <Clock className="h-3.5 w-3.5" />
                      ~{estimatedSeconds}s reading time
                    </span>
                    <span>•</span>
                    <span>{wordCount} words</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy(pitch.short || "")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-colors shadow-sm self-start sm:self-auto"
              >
                {copiedPitch ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-6 sm:p-7 relative">
              <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed italic">
                &ldquo;{pitch.short || "Elevator pitch script will appear here."}&rdquo;
              </p>
            </div>

            {/* Speaking Delivery Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  01. The Hook (0-5s)
                </span>
                <p className="text-xs text-slate-300">
                  Deliver the acute problem immediately without pleasantries.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  02. The Unique Secret (5-20s)
                </span>
                <p className="text-xs text-slate-300">
                  Explain the non-obvious technology or distribution moat.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  03. The Ask (20-30s)
                </span>
                <p className="text-xs text-slate-300">
                  Conclude with a specific call to action (beta access, partner intro).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Investor Pitch Narrative */}
      {activeTab === "investor" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Target className="h-4 w-4 text-cyan-400" />
                <span>Institutional Investor Narrative</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Structured narrative addressing market size, moat, unit economics, and execution
              </p>
            </div>
            <button
              onClick={() => handleCopy(pitch.investor || "")}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
            >
              Copy Story
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {pitch.investor || "Detailed investor pitch narrative compiled for this startup idea."}
            </p>
          </div>
        </div>
      )}

      {/* Tab: Hackathon / Demo Day Script */}
      {activeTab === "hackathon" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Demo Day & Technical Showcase Script</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Paced for rapid live demonstrations, judges, and product innovators
              </p>
            </div>
            <button
              onClick={() => handleCopy(pitch.hackathon || "")}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
            >
              Copy Script
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {pitch.hackathon || "Technical showcase and live demo narrative compiled for this startup."}
            </p>
          </div>
        </div>
      )}

      {/* Tab: Investor Q&A Prep */}
      {activeTab === "qa" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-5">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-purple-400" />
              <span>Anticipated Investor & Judge Questions ({questions.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tough diligence questions with recommended founder defense talking points
            </p>
          </div>

          <div className="space-y-3">
            {questions.length > 0 ? (
              questions.map((q: string, idx: number) => {
                const isOpen = expandedQuestion === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedQuestion(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-900/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 text-xs font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-200">
                          {q}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-400 border-t border-slate-900 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                          Suggested Founder Angle:
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          Acknowledge the core challenge directly, share your specific customer insight or data advantage, and highlight your short-term mitigation hypothesis.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                No questions generated for this report.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}