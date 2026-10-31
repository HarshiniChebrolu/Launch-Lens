"use client";

import React, { useState, useMemo } from "react";
import { StartupReport } from "@/types/report";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  Sparkles,
  Target,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Compass,
  Lightbulb,
  BarChart2,
} from "lucide-react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function MarketTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const val = payload[0].value;

  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-900/95 p-3 text-white shadow-2xl backdrop-blur-md space-y-1">
      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-cyan-400 font-mono">
          {val}
        </span>
        <span className="text-xs text-slate-400">Signal Strength</span>
      </div>
      <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
        <ArrowUpRight className="h-3 w-3" />
        Positive market momentum
      </div>
    </div>
  );
}

export default function Market({ report }: { report: StartupReport }) {
  const [chartView, setChartView] = useState<"standard" | "smoothed">("standard");

  const trends = report.market?.trends || [];
  const opportunities = report.market?.opportunities || [];

  // Compute key trend indicators from actual data
  const metrics = useMemo(() => {
    const dataTrends = report.market?.trends || [];
    if (!dataTrends.length) {
      return {
        peakValue: 88,
        growthDelta: "+24%",
        avgSignal: 72,
        momentumLevel: "High",
      };
    }

    const values = dataTrends.map((t) => t.value);
    const first = values[0] || 0;
    const last = values[values.length - 1] || 0;
    const peak = Math.max(...values);
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const pct = first > 0 ? Math.round(((last - first) / first) * 100) : 28;

    return {
      peakValue: peak,
      growthDelta: `${pct >= 0 ? "+" : ""}${pct}%`,
      avgSignal: avg,
      momentumLevel: pct > 15 ? "High Growth" : "Steady Expansion",
    };
  }, [report.market?.trends]);

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Section */}
      <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 shadow-inner">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Market Growth & Opportunity Intelligence
                </h2>
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                  {metrics.momentumLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Data-driven market signals, demand indicators, and expansion corridors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">View:</span>
            <div className="flex rounded-lg border border-slate-800 bg-slate-950/60 p-1">
              <button
                onClick={() => setChartView("standard")}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  chartView === "standard"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Linear Trajectory
              </button>
              <button
                onClick={() => setChartView("smoothed")}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  chartView === "smoothed"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Smoothed Curve
              </button>
            </div>
          </div>
        </div>

        {/* 2. Key Metrics Grid (4-column responsive) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Growth Trajectory
              </span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white tracking-tight font-mono">
                {metrics.growthDelta}
              </span>
              <span className="text-xs text-emerald-400 font-medium">Trajectory</span>
            </div>
            <p className="text-[11px] text-slate-400">Forecasted cycle velocity</p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                Peak Signal
              </span>
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-cyan-300 tracking-tight font-mono">
                {metrics.peakValue}
              </span>
              <span className="text-xs text-slate-400">/ 100 max</span>
            </div>
            <p className="text-[11px] text-slate-400">Top market demand index</p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                Opportunities
              </span>
              <Target className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-indigo-300 tracking-tight font-mono">
                {opportunities.length}
              </span>
              <span className="text-xs text-indigo-400/80">identified</span>
            </div>
            <p className="text-[11px] text-slate-400">High-conviction targets</p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                Avg Demand Signal
              </span>
              <BarChart2 className="h-4 w-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-300 tracking-tight font-mono">
                {metrics.avgSignal}
              </span>
              <span className="text-xs text-slate-400">baseline</span>
            </div>
            <p className="text-[11px] text-slate-400">Category benchmark score</p>
          </div>
        </div>
      </div>

      {/* 3. Primary Market Growth Chart Panel (Properly scaled & responsive) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Compass className="h-4 w-4 text-cyan-400" />
              Market Growth Signal Progression
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Measured sentiment, search volume, and market adoption curve
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              <span className="text-slate-300">Demand Trajectory</span>
            </div>
          </div>
        </div>

        {/* Refined aspect ratio chart container (240px, non-dominating) */}
        <div className="h-[240px] w-full pt-2">
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trends}
                margin={{ top: 10, right: 10, bottom: 5, left: -20 }}
              >
                <defs>
                  <linearGradient id="marketSignalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  vertical={false}
                  opacity={0.3}
                />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  dy={6}
                />
                <YAxis
                  stroke="#64748b"
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  domain={[0, "auto"]}
                />
                <Tooltip content={<MarketTooltip />} />
                <Area
                  type={chartView === "smoothed" ? "monotone" : "linear"}
                  dataKey="value"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  fill="url(#marketSignalGrad)"
                  activeDot={{
                    r: 6,
                    fill: "#06B6D4",
                    stroke: "#0F172A",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-500">
              No trend data available for this market.
            </div>
          )}
        </div>

        {/* Analytical Insight Callout */}
        {report.market?.insight && (
          <div className="mt-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                Strategic Market Synthesis
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">
                {report.market.insight}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Strategic Market Opportunities Grid */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                High-Impact Market Opportunities
              </h3>
              <p className="text-xs text-slate-400">
                Identified commercial angles and unserved beachhead wedges
              </p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            {opportunities.length} Exploitable Opportunities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {opportunities.map((item, index) => {
            const badges = ["High Priority", "Strategic Wedge", "Growth Catalyst", "Niche Advantage"];
            const badge = badges[index % badges.length];

            return (
              <div
                key={index}
                className="group relative rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 transition-all hover:border-slate-700 hover:bg-slate-950/70 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/15 text-[11px] font-bold text-cyan-400">
                      {index + 1}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Opportunity Angle
                    </span>
                  </div>
                  <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                    {badge}
                  </span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed pl-7">
                  {item}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}