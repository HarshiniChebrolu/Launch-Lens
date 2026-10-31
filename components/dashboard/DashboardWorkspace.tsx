"use client";

import React, { useState, useMemo } from "react";
import { StartupReport } from "@/types/report";
import {
  Rocket,
  Compass,
  TrendingUp,
  Briefcase,
  Layers3,
  DollarSign,
  PlusCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  BarChart3,
  Calendar,
  Layers,
  ChevronRight,
  Flame,
  Check,
  Star,
  ExternalLink,
  Target,
  FileText,
} from "lucide-react";
import { ReportTab } from "@/components/report/ReportShell";

interface DashboardWorkspaceProps {
  reports: any[];
  onOpenReport: (report: StartupReport, tab?: ReportTab) => void;
  onCreateNewIdea: (prefilledConcept?: string) => void;
  onNavigateMode: (mode: any) => void;
}

export default function DashboardWorkspace({
  reports,
  onOpenReport,
  onCreateNewIdea,
  onNavigateMode,
}: DashboardWorkspaceProps) {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  // Local interactive state for founder action checklist
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({
    action_1: true,
  });

  const toggleAction = (key: string) => {
    setCompletedActions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const latestProject = reports[0] || null;
  const latestReport: StartupReport | null = latestProject?.report || null;

  // Filtered reports
  const filteredProjects = useMemo(() => {
    return reports.filter((item) => {
      const matchSearch =
        !searchFilter.trim() ||
        (item.title && item.title.toLowerCase().includes(searchFilter.toLowerCase())) ||
        (item.idea && item.idea.toLowerCase().includes(searchFilter.toLowerCase()));

      const matchIndustry =
        selectedIndustry === "All" ||
        (item.industry && item.industry.toLowerCase() === selectedIndustry.toLowerCase());

      return matchSearch && matchIndustry;
    });
  }, [reports, searchFilter, selectedIndustry]);

  // Derived metrics
  const totalReportsCount = reports.length;
  const totalCompetitorsTracked = reports.reduce(
    (acc, curr) => acc + (curr.report?.competitors?.length || 0),
    0
  );
  const avgFeasibilityScore = useMemo(() => {
    if (!reports.length) return 82;
    const scores = reports
      .map((r) => r.report?.validation?.overallScore)
      .filter((s) => typeof s === "number");
    if (!scores.length) return 84;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [reports]);

  // Starter Inspiration Prompts
  const starterPrompts = [
    {
      title: "AI Underwriting Copilot",
      industry: "FinTech",
      idea: "Real-time AI risk assessment and cash flow analysis for micro-SME loans.",
    },
    {
      title: "Campus Study Synthesis",
      industry: "EdTech",
      idea: "Automated dense academic paper summarizer with citation verification for college students.",
    },
    {
      title: "Carbon Ledger for Logistics",
      industry: "ClimateTech",
      idea: "Automated Scope 3 emissions audit engine for last-mile freight delivery fleets.",
    },
    {
      title: "Zero-Trust Agent Security",
      industry: "Cybersecurity",
      idea: "Runtime anomaly detection and permission sandboxing for enterprise AI autonomous agents.",
    },
  ];

  return (
    <div className="w-full space-y-8 min-w-0">
      {/* 1. Founder Studio Welcome Header */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/30 p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="h-3 w-3" />
                LaunchLens Studio
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Founder Intelligence Workspace
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Validate startup hypotheses, evaluate competitive moats, build technical architectures,
              and prepare investor materials backed by real data.
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onCreateNewIdea()}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-xl shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Idea & Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Snapshot Cards (4 Key Counters) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Evaluated Ideas
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {totalReportsCount}
          </div>
          <p className="text-[11px] text-slate-400">
            {totalReportsCount > 0 ? "Stored in founder library" : "Ready for first concept"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Avg Feasibility
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {avgFeasibilityScore}%
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span>Validated across multi-factors</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Competitors Tracked
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {totalCompetitorsTracked}
          </div>
          <p className="text-[11px] text-slate-400">Rivals mapped in matrix</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Research Dossiers
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Layers3 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            21
          </div>
          <p className="text-[11px] text-purple-400">Modules generated per report</p>
        </div>
      </div>

      {/* 3. Latest Startup Intelligence Spotlight (If exists) */}
      {latestReport ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-7 shadow-xl backdrop-blur-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Latest Active Intelligence Dossier
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {latestReport.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenReport(latestReport, "Overview")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-xs font-bold text-cyan-300 border border-cyan-500/30 transition-all shadow-sm"
              >
                <span>Open Full Dossier</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
            {latestReport.summary}
          </p>

          {/* Quick Insights Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <button
              onClick={() => onOpenReport(latestReport, "Market")}
              className="text-left rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 hover:border-cyan-500/40 transition-colors group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Market Demand</span>
                <TrendingUp className="h-3.5 w-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-sm font-bold text-white mt-1">
                {latestReport.market?.trends?.length ? "High Growth Signal" : "Steady Demand"}
              </div>
              <span className="text-[11px] text-cyan-400">Inspect Market Trends →</span>
            </button>

            <button
              onClick={() => onOpenReport(latestReport, "Competitors")}
              className="text-left rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 hover:border-indigo-500/40 transition-colors group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Incumbent Rivals</span>
                <Briefcase className="h-3.5 w-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-sm font-bold text-white mt-1">
                {latestReport.competitors?.length || 0} Identified
              </div>
              <span className="text-[11px] text-indigo-400">View Competitor Moats →</span>
            </button>

            <button
              onClick={() => onOpenReport(latestReport, "Blueprint")}
              className="text-left rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 hover:border-purple-500/40 transition-colors group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Architecture Plan</span>
                <Layers3 className="h-3.5 w-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-sm font-bold text-white mt-1">
                {latestReport.technicalBlueprint?.architecture?.frontend || "Full-Stack Ready"}
              </div>
              <span className="text-[11px] text-purple-400">Review Blueprint →</span>
            </button>

            <button
              onClick={() => onOpenReport(latestReport, "Business")}
              className="text-left rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 hover:border-emerald-500/40 transition-colors group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Primary Model</span>
                <DollarSign className="h-3.5 w-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-sm font-bold text-white mt-1 truncate">
                {latestReport.business?.primaryModel || "B2B Subscription"}
              </div>
              <span className="text-[11px] text-emerald-400">Check Unit Economics →</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty State for New Users */
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 sm:p-12 text-center space-y-4 shadow-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto">
            <Compass className="h-7 w-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Begin Your Startup Validation
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Enter a rough concept or browse our 15-category idea library to generate your first 21-module startup intelligence dossier.
            </p>
          </div>
          <button
            onClick={() => onCreateNewIdea()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Launch First Analysis</span>
          </button>
        </div>
      )}

      {/* 4. Two-Column Workspace: Founder Action Hub & Starter Hypotheses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prioritized Founder Action Hub */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Target className="h-4 w-4 text-cyan-400" />
                <span>Founder Validation Action Hub</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Next steps derived to accelerate market validation
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">
              Interactive Checklist
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: "action_1",
                text: "Conduct 5 problem-focused customer discovery interviews",
                badge: "Customer Discovery",
                color: "text-cyan-400",
              },
              {
                id: "action_2",
                text: "Draft clickable wireframe prototype focusing on must-have MVP features",
                badge: "Product Definition",
                color: "text-indigo-400",
              },
              {
                id: "action_3",
                text: "Benchmark incumbent pricing tiers and assess willingness-to-pay",
                badge: "Market Feasibility",
                color: "text-emerald-400",
              },
              {
                id: "action_4",
                text: "Verify third-party API dependencies and database schema readiness",
                badge: "Technical Blueprint",
                color: "text-purple-400",
              },
              {
                id: "action_5",
                text: "Synthesize elevator pitch into concise investor teaser narrative",
                badge: "Pitch Studio",
                color: "text-amber-400",
              },
            ].map((item) => {
              const isChecked = completedActions[item.id] || false;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleAction(item.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? "border-emerald-500/20 bg-emerald-500/5 opacity-80"
                      : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                  }`}
                >
                  <button
                    type="button"
                    className={`h-4 w-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                      isChecked
                        ? "bg-emerald-500 border-emerald-400 text-white"
                        : "border-slate-600 bg-slate-800"
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs leading-snug ${
                        isChecked ? "text-slate-400 line-through" : "text-slate-200"
                      }`}
                    >
                      {item.text}
                    </p>
                    <span className={`text-[10px] font-semibold mt-1 inline-block ${item.color}`}>
                      {item.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Starter Startup Hypotheses & Inspiration */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Startup Concept Exploration</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Explore trending industry ideas with pre-populated prompts
              </p>
            </div>
            <button
              onClick={() => onNavigateMode("wizard")}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Browse Library →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {starterPrompts.map((p, idx) => (
              <div
                key={idx}
                onClick={() => onCreateNewIdea(p.idea)}
                className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 space-y-2 hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 inline-block">
                    {p.industry}
                  </span>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {p.idea}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1 text-[11px] font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Develop Concept</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Recent Startup Projects & Intelligence History */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 shadow-xl backdrop-blur-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>Recent Startup Projects ({filteredProjects.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and drill into previously generated startup intelligence dossiers
            </p>
          </div>

          {/* Search Filter */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.slice(0, 6).map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => onOpenReport(item.report, "Overview")}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3.5 hover:border-cyan-500/50 hover:bg-slate-950 transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                      {item.industry || "AI SaaS"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "Active"}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {item.title || item.report?.title || "Untitled Startup"}
                  </h4>

                  <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                    {item.report?.summary || item.idea || "Startup intelligence analysis completed."}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    21 Modules
                  </span>
                  <span className="text-cyan-400 font-bold text-[11px] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Inspect</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            {searchFilter ? "No startup projects match your search keywords." : "No startup projects created yet."}
          </div>
        )}
      </div>
    </div>
  );
}
