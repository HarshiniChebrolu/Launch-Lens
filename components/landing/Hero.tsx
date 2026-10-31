"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Rocket,
  TrendingUp,
  ShieldCheck,
  Target,
  Zap,
  Cpu,
  Layers,
  CheckCircle2,
  Database,
  Compass,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[420px] bg-gradient-to-tr from-cyan-500/15 via-indigo-600/10 to-transparent blur-3xl rounded-full pointer-events-none landingHeroGlow" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Column: Specified Value Proposition */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-400 landingBadge"
          >
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>LaunchLens 2.0 • Autonomous Venture Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] landingHeroTitle text-white"
          >
            Validate your startup{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              before writing code.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal landingHeroDesc text-slate-300"
          >
            LaunchLens autonomously crawls live web search demand, benchmarks incumbent competitor blindspots, and executes 21 multi-dimensional Gemini AI validation modules. Generate TAM/SAM/SOM economics, system architecture topologies, and investor pitch decks in under 90 seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2"
          >
            <a
              href="/auth"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Build Startup Report</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#preview"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-all landingHeroSecBtn"
            >
              <span>Live Dossier Preview</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs pt-3 landingHeroCheckmarks text-slate-400"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Real-time competitor indexing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Production-ready tech blueprints</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Zero-hallucination verification</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: High-Fidelity Product Intelligence Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5"
        >
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-5 landingHeroCard">
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 landingHeroCardHeader">
              <div className="flex items-center gap-2.5">
                <div className="flex h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="flex h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="flex h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Live Intelligence Engine v2.0
              </span>
            </div>

            {/* Scorecard Hero */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 space-y-1 landingStatBox">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider landingMuted">
                  Readiness Score
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-cyan-400 font-mono">
                    94
                  </span>
                  <span className="text-xs text-slate-400 landingMuted">/ 100</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <TrendingUp className="h-3 w-3" />
                  <span>High Feasibility Tier</span>
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-1 landingStatBox">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider landingMuted">
                  Market Growth
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-indigo-400 font-mono">
                    +38.4%
                  </span>
                  <span className="text-xs text-slate-400 landingMuted">YoY</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-indigo-400 font-medium">
                  <Zap className="h-3 w-3" />
                  <span>High Expansion Vector</span>
                </div>
              </div>
            </div>

            {/* Teardown Micro Insight Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 landingHeroInnerCard">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 landingCardTitle">
                <span className="flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-cyan-400" />
                  Competitor Vulnerability Mapped
                </span>
                <span className="rounded bg-emerald-500/15 text-emerald-400 text-[10px] px-2 py-0.5 border border-emerald-500/25">
                  $180M Addressable Wedge
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed landingHeroCardText">
                Legacy market leaders lack sub-second autonomous webhook routing and open API pricing. Initial beachhead can capture 18% unserved enterprise demand.
              </p>
            </div>

            {/* Architecture Blueprint Pill */}
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5 flex items-center justify-between gap-3 text-xs landingArchBox">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/20 text-purple-300 shrink-0">
                  <Cpu className="h-3 w-3" />
                </div>
                <span className="text-slate-300 font-medium truncate landingArchText">
                  Topology: Next.js 14 + Edge Functions + PostgreSQL Vector
                </span>
              </div>
              <span className="text-[10px] text-purple-400 font-mono shrink-0 font-bold">
                Phase 1 MVP Spec
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}