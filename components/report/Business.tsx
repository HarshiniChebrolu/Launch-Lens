"use client";

import React, { useState } from "react";
import { StartupReport } from "@/types/report";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  PieChart,
  Target,
  BarChart2,
  Coins,
  Repeat,
  Scale,
  FlaskConical,
  HelpCircle,
} from "lucide-react";
import BusinessBarChart from "@/components/charts/BusinessBarChart";
import MetricCard from "@/components/charts/MetricCard";

export default function Business({ report }: { report: StartupReport }) {
  const b = report.business || ({} as any);
  const cost = report.costEstimator || ({} as any);

  const [selectedPricingTier, setSelectedPricingTier] = useState<number>(1);

  const revenueStreams = b.revenueStreams || [];
  const pricingStrategies = b.pricingStrategy || [];
  const chartData = b.chart || [];

  return (
    <div className="w-full space-y-8 min-w-0">
      {/* 1. Commercial Strategy Header */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-emerald-950/20 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <DollarSign className="h-3.5 w-3.5" />
            Commercial & Monetization Engine
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            Model: {b.primaryModel || "B2B SaaS"}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Revenue Architecture & Unit Economics
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          {b.researchBasis ||
            "Data-driven financial hypotheses synthesizing pricing elasticity, infrastructure cost drivers, and customer lifetime value."}
        </p>

        {/* 4 Financial Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Profit Outlook
            </span>
            <div className="text-lg font-bold text-emerald-400">
              {b.profitOutlook || "High Margins (75%+)"}
            </div>
            <span className="text-[10px] text-slate-400">Post-MVP projection</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Break-Even Horizon
            </span>
            <div className="text-lg font-bold text-cyan-400">
              {b.breakEven || "12-14 Months"}
            </div>
            <span className="text-[10px] text-slate-400">Assumes standard burn</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Cost & Burn Risk
            </span>
            <div className="text-lg font-bold text-amber-400">
              {b.costRisk || "Moderate API Scale"}
            </div>
            <span className="text-[10px] text-slate-400">LLM token cost variable</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Time To MVP
            </span>
            <div className="text-lg font-bold text-purple-400">
              {cost.timeToMvp || "6-8 Weeks"}
            </div>
            <span className="text-[10px] text-slate-400">Core milestone delivery</span>
          </div>
        </div>
      </div>

      {/* 2. Structured Monetization Streams & Pricing Hypotheses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Streams */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl backdrop-blur-sm">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Coins className="h-4 w-4 text-emerald-400" />
              <span>Diversified Revenue Streams</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Primary and expansion monetization channels
            </p>
          </div>

          <div className="space-y-3">
            {revenueStreams.map((stream: string, idx: number) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300">
                    Stream 0{idx + 1}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    {idx === 0 ? "Primary Engine" : "Expansion Engine"}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {stream}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Strategy & Packaging Hypotheses */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl backdrop-blur-sm">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Scale className="h-4 w-4 text-cyan-400" />
              <span>Pricing & Packaging Strategy</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tiers optimized for low friction adoption and expansion revenue
            </p>
          </div>

          <div className="space-y-3">
            {pricingStrategies.map((tier: string, idx: number) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300">
                    Tier Formulation 0{idx + 1}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                    Hypothesis
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {tier}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Business Strength Visual Chart & Unit Economics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl backdrop-blur-sm">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-emerald-400" />
              <span>Commercial Viability Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Score across monetization drivers (Margin, Retention, Pricing Power, Scale)
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <BusinessBarChart data={chartData} />
          </div>
        </div>

        {/* Validation Experiments to Test Willingness to Pay */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-purple-400" />
                <span>Willingness-to-Pay Tests</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Experiments to validate pricing power prior to code build
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Test A: Smoke Test Landing Page
                </span>
                <p className="text-xs text-slate-300 leading-snug">
                  Publish 2 pricing options on pre-launch page and measure Stripe preorder intent.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Test B: Van Westendorp Survey
                </span>
                <p className="text-xs text-slate-300 leading-snug">
                  Survey 20 target users on price tolerance thresholds (too cheap vs too expensive).
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Test C: Letter of Intent (LOI)
                </span>
                <p className="text-xs text-slate-300 leading-snug">
                  Secure 3 non-binding pilot agreements for enterprise deployment post-MVP.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
            * Note: All economic figures are strategic hypotheses to be validated through customer contracts.
          </div>
        </div>
      </div>
    </div>
  );
}