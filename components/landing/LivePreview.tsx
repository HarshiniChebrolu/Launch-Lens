"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  ShieldCheck,
  Brain,
  Sparkles,
  Layers3,
  Rocket,
  Compass,
  ArrowUpRight,
  Target,
  Cpu,
  BarChart2,
  CheckCircle2,
  Layers,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const sampleTrends = [
  { label: "Q1", value: 38 },
  { label: "Q2", value: 52 },
  { label: "Q3", value: 68 },
  { label: "Q4", value: 85 },
  { label: "Q5 (Proj)", value: 94 },
];

export default function LivePreview() {
  const [activeTab, setActiveTab] = useState<"market" | "competitors" | "architecture">("market");

  return (
    <section id="preview" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400 landingBadge">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Dossier</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight landingSectionTitle text-white">
          Everything synthesized in one intelligent cockpit.
        </h2>
        <p className="text-sm sm:text-base leading-relaxed font-normal landingSectionDesc text-slate-400">
          Every report is synthesized dynamically using Gemini AI + real-time web research. Explore an active sample dossier below.
        </p>
      </div>

      {/* Main Glass Preview Window */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-2xl overflow-hidden landingPreviewShell"
      >
        {/* Window Topbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-slate-800 bg-slate-950/70 landingPreviewBar">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono font-semibold text-slate-400 pl-2 border-l border-slate-800 landingPreviewUrl">
              dossier://stealth-support-ai/analysis.v2
            </span>
          </div>

          {/* Module Switcher Pills */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 p-1 landingPreviewTabs">
            <button
              onClick={() => setActiveTab("market")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "market"
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 landingPreviewTabActive"
                  : "text-slate-400 hover:text-white landingPreviewTab"
              }`}
            >
              Market Signal
            </button>
            <button
              onClick={() => setActiveTab("competitors")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "competitors"
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 landingPreviewTabActive"
                  : "text-slate-400 hover:text-white landingPreviewTab"
              }`}
            >
              Competitor Moat
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "architecture"
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 landingPreviewTabActive"
                  : "text-slate-400 hover:text-white landingPreviewTab"
              }`}
            >
              System Blueprint
            </button>
          </div>
        </div>

        {/* Intelligence Content Area */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 space-y-1 landingStatBox">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider landingMuted">
                Market Velocity
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
                  +38.2%
                </span>
                <span className="text-xs text-emerald-400 font-medium flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  High
                </span>
              </div>
              <p className="text-[11px] text-slate-500 landingMuted">Search volume expansion</p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 space-y-1 landingStatBox">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider landingMuted">
                Rivals Indexed
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">
                  14
                </span>
                <span className="text-xs text-slate-400 landingMuted">entities</span>
              </div>
              <p className="text-[11px] text-slate-500 landingMuted">3 critical gaps identified</p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 space-y-1 landingStatBox">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider landingMuted">
                Readiness Index
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                  94
                </span>
                <span className="text-xs text-slate-400 landingMuted">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-500 landingMuted">Investment ready</p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 space-y-1 landingStatBox">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider landingMuted">
                Risk Profile
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                  Low Risk
                </span>
              </div>
              <p className="text-[11px] text-slate-500 landingMuted">SOC2 & GDPR mapped</p>
            </div>
          </div>

          {/* Dynamic Module Body */}
          {activeTab === "market" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3 landingHeroInnerCard">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider landingCardTitle text-white">
                      Forecasted Adoption Curve
                    </span>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-mono font-medium">
                    Continuous Synthesis
                  </span>
                </div>
                <div className="h-[200px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sampleTrends} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="livePreviewGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="label" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "0.75rem",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#06B6D4"
                        strokeWidth={2.5}
                        fill="url(#livePreviewGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-3">
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 space-y-1.5 landingHeroInnerCard">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5" />
                    Target Beachhead Wedge
                  </span>
                  <p className="text-xs leading-relaxed font-normal landingCardText text-slate-300">
                    Initial launch targets mid-market SaaS platforms experiencing 40%+ customer support volume surges. Extreme willingness to pay for sub-second automated resolution.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 landingHeroInnerCard">
                  <span className="text-[11px] font-semibold uppercase tracking-wider landingMuted text-slate-400">
                    Immediate Growth Corridors
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-300 landingCardText">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Zero-code ticketing integration plugins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Multi-language intent detection API</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "competitors" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3 landingHeroInnerCard">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm landingCardTitle text-white">Incumbent Zendesk AI</span>
                  <span className="rounded bg-rose-500/10 text-rose-400 text-[10px] px-2 py-0.5 border border-rose-500/20">
                    High Vulnerability
                  </span>
                </div>
                <p className="text-xs leading-relaxed landingCardText text-slate-400">
                  Expensive seat-based enterprise licensing and slow custom model training cycles (3-6 weeks).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3 landingHeroInnerCard">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm landingCardTitle text-white">Intercom Fin</span>
                  <span className="rounded bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 border border-amber-500/20">
                    Pricing Friction
                  </span>
                </div>
                <p className="text-xs leading-relaxed landingCardText text-slate-400">
                  $0.99 per resolution model penalizes high-volume support desks. Leaves wide opening for fixed pricing tiers.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 space-y-3 landingHeroInnerCard">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-cyan-400">Your Strategic Moat</span>
                  <span className="rounded bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 border border-emerald-500/30">
                    Defensible
                  </span>
                </div>
                <p className="text-xs leading-relaxed landingCardText text-slate-300">
                  Native webhook triggers + transparent compute-based pricing gives 65% cost advantage to modern builders.
                </p>
              </div>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 landingHeroInnerCard">
                <span className="text-[10px] font-semibold uppercase tracking-wider landingMuted text-slate-500">Frontend</span>
                <p className="text-xs font-mono font-bold text-cyan-400">Next.js 14 + Tailwind</p>
                <p className="text-[11px] landingCardText text-slate-400">Server Components + Edge</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 landingHeroInnerCard">
                <span className="text-[10px] font-semibold uppercase tracking-wider landingMuted text-slate-500">AI Pipeline</span>
                <p className="text-xs font-mono font-bold text-purple-400">Gemini 1.5 + RAG</p>
                <p className="text-[11px] landingCardText text-slate-400">Vector Embeddings (pgvector)</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 landingHeroInnerCard">
                <span className="text-[10px] font-semibold uppercase tracking-wider landingMuted text-slate-500">Database</span>
                <p className="text-xs font-mono font-bold text-emerald-400">PostgreSQL (Supabase)</p>
                <p className="text-[11px] landingCardText text-slate-400">Row-Level Security Enabled</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 landingHeroInnerCard">
                <span className="text-[10px] font-semibold uppercase tracking-wider landingMuted text-slate-500">Deployment</span>
                <p className="text-xs font-mono font-bold text-amber-400">Vercel + Cloudflare</p>
                <p className="text-[11px] landingCardText text-slate-400">Global low-latency DNS</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
