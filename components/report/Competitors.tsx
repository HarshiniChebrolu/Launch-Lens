"use client";

import React, { useState } from "react";
import { StartupReport } from "@/types/report";
import {
  ShieldAlert,
  Zap,
  TrendingUp,
  Award,
  AlertTriangle,
  Sparkles,
  Layers,
  Crosshair,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

export default function Competitors({ report }: { report: StartupReport }) {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>(
    report.competitors[0]?.name || ""
  );

  const matrix = report.competitorMatrix;

  // Separate "Your Startup" from external competitors to avoid duplicate columns
  const startupCol = matrix?.competitors?.find(
    (c) =>
      c.name.toLowerCase().includes("your startup") ||
      c.name.toLowerCase().includes("launch lens") ||
      c.name.toLowerCase() === "startup"
  );
  const externalCompetitors =
    matrix?.competitors?.filter((c) => c !== startupCol) || [];

  const gapsCount = report.competitors.filter((c) => c.gap).length;
  const featuresCount = matrix?.features?.length || 0;

  // Helper to render matrix cell with appropriate styling / pill
  const renderCellContent = (value: string | number | boolean | undefined, isHighlight: boolean = false) => {
    const str = String(value ?? "—").trim();
    const lower = str.toLowerCase();

    if (lower === "yes" || lower === "true" || lower === "full native" || lower === "full native support") {
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
          isHighlight ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
        }`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          {str}
        </span>
      );
    }

    if (lower === "no" || lower === "false") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <XCircle className="w-3.5 h-3.5" />
          No
        </span>
      );
    }

    if (lower === "limited" || lower === "basic" || lower === "slow" || lower === "manual" || lower === "high effort") {
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
          isHighlight ? "bg-cyan-500/15 text-cyan-200" : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
        }`}>
          {str}
        </span>
      );
    }

    return (
      <span className={isHighlight ? "font-semibold text-cyan-200" : "text-slate-300"}>
        {str}
      </span>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Page Header & Key Metrics Summary */}
      <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-5">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 shadow-inner">
              <Crosshair className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Competitor Intelligence & Threat Analysis
                </h2>
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  {report.competitors.length} Rivals Tracked
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-normal">
                Comprehensive teardown: incumbent vulnerabilities, unserved market gaps, feature parity, and defensive moats
              </p>
            </div>
          </div>
        </div>

        {/* Compact KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Rivals Tracked</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">{report.competitors.length}</span>
              <span className="text-xs text-slate-400">entities</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 space-y-1">
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">Market Gaps</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-cyan-300 tracking-tight">{gapsCount}</span>
              <span className="text-xs text-cyan-400/80">exploitable</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 space-y-1">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Features Mapped</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-300 tracking-tight">{featuresCount}</span>
              <span className="text-xs text-emerald-400/80">capabilities</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 space-y-1">
            <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">Moat Readiness</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-indigo-300 tracking-tight">
                {report.swot?.strengths?.length ? "High" : "Optimal"}
              </span>
              <span className="text-xs text-indigo-400/80">defensible</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Competitor Intelligence Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Direct Rivals & Incumbent Analysis
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Click any competitor card to inspect details
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.competitors.map((item, idx) => {
            const isSelected = selectedCompetitor === item.name;
            return (
              <div
                key={item.name}
                onClick={() => setSelectedCompetitor(item.name)}
                className={`rounded-2xl border p-5 space-y-4 transition-all cursor-pointer ${
                  isSelected
                    ? "border-cyan-500/50 bg-slate-900 shadow-xl shadow-cyan-950/20 ring-1 ring-cyan-500/30"
                    : "border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-slate-300">
                      {idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-white tracking-tight">
                      {item.name}
                    </h4>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 border border-slate-700/80 rounded-full px-2.5 py-0.5 bg-slate-800/60">
                    Incumbent Rival
                  </span>
                </div>

                {/* Structured Strengths, Weaknesses, Gaps */}
                <div className="space-y-2.5 text-xs">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px] uppercase tracking-wider">
                      <Award className="h-3.5 w-3.5 shrink-0" />
                      <span>Key Strength</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed pl-5 font-normal">
                      {item.strength}
                    </p>
                  </div>

                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-400 text-[11px] uppercase tracking-wider">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>Known Vulnerability</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed pl-5 font-normal">
                      {item.weakness}
                    </p>
                  </div>

                  <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-3.5 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-cyan-400 text-[11px] uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      <span>Exploitable Market Gap</span>
                    </div>
                    <p className="text-cyan-200/95 leading-relaxed pl-5 font-medium">
                      {item.gap}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Feature Comparison Matrix */}
      {matrix && matrix.features && matrix.features.length > 0 && (
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Competitive Feature Parity Matrix
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Benchmarked across {matrix.features.length} core product capabilities
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4 min-w-[200px] text-slate-300">Feature Capability</th>
                  
                  {/* Your Startup Column (Highlighted Primary Column) */}
                  <th className="py-3.5 px-4 min-w-[140px] text-cyan-400 bg-cyan-950/30 border-x border-cyan-500/30">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                      {startupCol?.name || "Your Startup"}
                    </div>
                  </th>

                  {/* External Competitors */}
                  {externalCompetitors.map((c) => (
                    <th key={c.name} className="py-3.5 px-4 min-w-[140px] text-slate-300">
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans text-slate-300">
                {matrix.features.map((feature, rowIndex) => (
                  <tr key={feature} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">
                      {feature}
                    </td>
                    
                    {/* Your Startup Value */}
                    <td className="py-3.5 px-4 bg-cyan-950/15 border-x border-cyan-500/20 font-medium">
                      {renderCellContent(
                        startupCol ? startupCol.values[rowIndex] : "Full Native Support",
                        true
                      )}
                    </td>

                    {/* Competitor Values */}
                    {externalCompetitors.map((c) => (
                      <td key={c.name + feature} className="py-3.5 px-4 text-slate-400">
                        {renderCellContent(c.values[rowIndex], false)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Strategic Defense & Market Moat Callout (SWOT Integration) */}
      {report.swot && (
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Competitive Moat & Defensive Strategy
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-xs uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Defensible Core Advantages</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.swot.strengths.slice(0, 4).map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-400 text-xs uppercase tracking-wider">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Anticipated Incumbent Responses</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.swot.threats.slice(0, 4).map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}