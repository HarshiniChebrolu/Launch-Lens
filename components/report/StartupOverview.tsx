"use client";

import React from "react";
import { StartupReport } from "@/types/report";
import {
  Compass,
  TrendingUp,
  Briefcase,
  Layers3,
  DollarSign,
  ShieldAlert,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  BarChart2,
  Calendar,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Cpu,
} from "lucide-react";
import GrowthLineChart from "@/components/charts/GrowthLineChart";
import { ReportTab } from "./ReportShell";

interface StartupOverviewProps {
  report: StartupReport;
  onNavigateToTab: (tab: ReportTab) => void;
}

export default function StartupOverview({
  report,
  onNavigateToTab,
}: StartupOverviewProps) {
  const e = report.executiveSummary || ({} as any);
  const m = report.market || ({} as any);
  const b = report.business || ({} as any);
  const comp = report.competitors || [];
  const mvp = report.mvp || ({} as any);
  const tech = report.techStack || ({} as any);
  const blueprint = report.technicalBlueprint || ({} as any);
  const security = report.security || ({} as any);

  // Compute key market trend metrics
  const marketTrends = m.trends || [];
  const latestTrendVal = marketTrends.length
    ? marketTrends[marketTrends.length - 1]?.value
    : 85;

  return (
    <div className="w-full space-y-8 min-w-0">
      {/* 1. Startup Overview Hero: Idea, Stage & Value Proposition */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/20 p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Compass className="h-3.5 w-3.5" />
              Startup Overview
            </span>
            {e.startupStage && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Stage: {e.startupStage}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              AI Feasibility Analyzed
            </span>
          </div>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight leading-snug">
            {e.oneLineSummary || report.summary || "Comprehensive Startup Feasibility Overview"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Core Value Proposition</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {e.biggestStrength || report.summary}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Primary Risk to De-Risk</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {e.biggestRisk || "Market adoption friction and customer switching cost."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key High-Level Signals Grid (4 Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Market Pillar */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Market Demand
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">
              {latestTrendVal}/100
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {m.insight || "High demand signals in target market"}
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab("Market")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors pt-1"
          >
            <span>Explore Market</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Competitor Pillar */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Competitive Gaps
            </span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">
              {comp.length} Tracked
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {comp[0]?.gap ? `Gap: ${comp[0].gap}` : "Multiple unserved feature opportunities identified"}
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab("Competitors")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors pt-1"
          >
            <span>Inspect Rivals</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Technical Architecture Pillar */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tech Feasibility
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Layers3 className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">
              {report.costEstimator?.timeToMvp || "6-8 Wks"}
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {blueprint.architecture?.frontend
                ? `${blueprint.architecture.frontend} + ${blueprint.architecture.backend}`
                : "Full-stack blueprint ready for sprint execution"}
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab("Blueprint")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors pt-1"
          >
            <span>View Architecture</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Commercial Model Pillar */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Business Model
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-white truncate">
              {b.primaryModel || "B2B SaaS"}
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Break-even: {b.breakEven || "12-14 Months"}
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab("Business")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors pt-1"
          >
            <span>Unit Economics</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* 3. Market Growth Signal & Opportunity Landscape */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                <span>Market Growth Signal & Trajectory</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Composite trend forecasting based on real-time market drivers
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab("Market")}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Full Market Report</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {m.insight || "Strong market growth dynamics across target demographics."}
          </p>

          <div className="h-56 w-full pt-2">
            <GrowthLineChart data={marketTrends} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <span>Top Market Opportunities</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                High-leverage avenues for differentiation
              </p>
            </div>

            <div className="space-y-2.5">
              {(m.opportunities || []).slice(0, 3).map((opp: string, i: number) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
                    Opportunity {i + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-snug">{opp}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab("Opportunity Radar" as any)}
            className="w-full mt-3 py-2 px-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Opportunity Radar</span>
            <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* 4. Recommended MVP Scope & Technical Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MVP Scope Summary */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Target className="h-4 w-4 text-cyan-400" />
                <span>Recommended MVP Scope</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Essential capabilities needed for initial validation
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab("MVP")}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Phased MVP</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              Must-Have Capabilities
            </span>
            {(mvp.mustHave || []).slice(0, 4).map((feat: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-lg border border-slate-800/90 bg-slate-950/40 p-2.5"
              >
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-200 leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Architecture Stack */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Cpu className="h-4 w-4 text-purple-400" />
                <span>Architecture & Engineering Stack</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Core technologies recommended for scale and speed
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab("Blueprint")}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>Full Blueprint</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Frontend Client</span>
              <p className="font-semibold text-cyan-300 truncate">
                {blueprint.architecture?.frontend || tech.frontend?.[0] || "Next.js 14 / TypeScript"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Backend API</span>
              <p className="font-semibold text-indigo-300 truncate">
                {blueprint.architecture?.backend || tech.backend?.[0] || "Node.js / Express / Edge"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Database Engine</span>
              <p className="font-semibold text-emerald-300 truncate">
                {blueprint.architecture?.database || tech.database?.[0] || "PostgreSQL / Supabase"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">AI Reasoning</span>
              <p className="font-semibold text-purple-300 truncate">
                {blueprint.architecture?.aiLayer || tech.ai?.[0] || "Gemini 1.5 Pro / Embeddings"}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400 italic pt-1">
            {tech.reason || "Architecture optimized for rapid iteration, sub-second latency, and scalable data layers."}
          </p>
        </div>
      </div>

      {/* 5. 30-Day & 90-Day Prioritized Execution Roadmap */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-400" />
              <span>Prioritized Founder Action Roadmap</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Clear milestone progression from validation to initial MVP rollout
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab("Roadmap")}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View Full Execution Sprints</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Next 30 Days */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/50 p-4 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Rocket className="h-3.5 w-3.5" />
              <span>Next 30 Days: Validation</span>
            </span>
            <div className="space-y-2">
              {(e.next30Days || [
                "Conduct 10 problem interviews with target segment",
                "Create interactive clickable wireframe prototype",
                "Validate willingness-to-pay with pre-orders",
              ]).map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next 90 Days */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/50 p-4 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Layers3 className="h-3.5 w-3.5" />
              <span>Next 90 Days: Build & Test</span>
            </span>
            <div className="space-y-2">
              {(e.next90Days || [
                "Engineer core MVP must-have capabilities",
                "Deploy closed beta with 25 pilot founders/users",
                "Instrument telemetry & feedback collection loops",
              ]).map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Founder Checklist */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/50 p-4 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Founder Checklist</span>
            </span>
            <div className="space-y-2">
              {(e.founderChecklist || [
                "Establish landing page & value proposition",
                "Benchmark direct competitor pricing tiers",
                "Verify compliance & data privacy controls",
              ]).map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
