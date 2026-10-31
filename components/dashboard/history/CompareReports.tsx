"use client";

import { useMemo, useState } from "react";
import { GitCompare, ChevronDown, CheckCircle2, ShieldCheck, TrendingUp, Users } from "lucide-react";

export default function CompareReports({ reports }: { reports: any[] }) {
  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");

  const left = useMemo(
    () => reports.find((r) => r.id === leftId),
    [reports, leftId]
  );

  const right = useMemo(
    () => reports.find((r) => r.id === rightId),
    [reports, rightId]
  );

  if (reports.length < 2) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl space-y-5 my-6">
      <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <GitCompare className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Compare Intelligence Dossiers
          </h3>
          <p className="text-xs text-slate-400">
            Benchmark feasibility, economics, and risk profiles side-by-side
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">
            Dossier A
          </label>
          <div className="relative">
            <select
              value={leftId}
              onChange={(e) => setLeftId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/70 pl-3.5 pr-8 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="">Select first report...</option>
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">
            Dossier B
          </label>
          <div className="relative">
            <select
              value={rightId}
              onChange={(e) => setRightId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/70 pl-3.5 pr-8 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="">Select second report...</option>
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          </div>
        </div>
      </div>

      {left && right && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <CompareCard item={left} />
          <CompareCard item={right} />
        </div>
      )}
    </div>
  );
}

function CompareCard({ item }: { item: any }) {
  const report = item.report;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
          {item.idea?.industry || "Tech Venture"}
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      </div>

      <h4 className="text-base font-bold text-white tracking-tight">
        {item.title}
      </h4>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 space-y-1">
          <span className="text-slate-500 block text-[10px] uppercase font-semibold">
            Validation Score
          </span>
          <span className="text-base font-bold text-emerald-400 font-mono">
            {report?.validation?.overallScore ? `${report.validation.overallScore}/100` : "Validated"}
          </span>
        </div>

        <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 space-y-1">
          <span className="text-slate-500 block text-[10px] uppercase font-semibold">
            Risk Tier
          </span>
          <span className="text-sm font-bold text-cyan-300">
            {report?.security?.riskLevel || "Standard"}
          </span>
        </div>

        <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 space-y-1">
          <span className="text-slate-500 block text-[10px] uppercase font-semibold">
            Profit Outlook
          </span>
          <span className="text-xs font-semibold text-slate-200">
            {report?.business?.profitOutlook || "Moderate"}
          </span>
        </div>

        <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 space-y-1">
          <span className="text-slate-500 block text-[10px] uppercase font-semibold">
            Rivals Tracked
          </span>
          <span className="text-base font-bold text-indigo-300 font-mono">
            {report?.competitors?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}