import { Archive, Star, TrendingUp, ShieldCheck } from "lucide-react";

export default function HistoryAnalytics({ reports }: { reports: any[] }) {
  const total = reports.length;

  const favoriteCount = reports.filter((r) => r.favorite).length;

  const avgValidation =
    reports.length === 0
      ? "--"
      : Math.round(
          reports.reduce(
            (sum, r) => sum + (r.report?.validation?.overallScore || 0),
            0
          ) / reports.length
        );

  const lowRisk = reports.filter(
    (r) => String(r.report?.security?.riskLevel || "").toLowerCase() === "low"
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1 shadow-lg">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            Total Dossiers
          </span>
          <Archive className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white font-mono">{total}</span>
          <span className="text-xs text-slate-400">reports</span>
        </div>
        <p className="text-[11px] text-slate-500">Startup ideas saved</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1 shadow-lg">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            Pinned Favorites
          </span>
          <Star className="h-4 w-4 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-amber-300 font-mono">{favoriteCount}</span>
          <span className="text-xs text-slate-400">starred</span>
        </div>
        <p className="text-[11px] text-slate-500">Pinned for quick review</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1 shadow-lg">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Avg Readiness
          </span>
          <TrendingUp className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-emerald-300 font-mono">{avgValidation}</span>
          <span className="text-xs text-slate-400">/ 100</span>
        </div>
        <p className="text-[11px] text-slate-500">Validation score average</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1 shadow-lg">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
            Low Risk Tier
          </span>
          <ShieldCheck className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-indigo-300 font-mono">{lowRisk}</span>
          <span className="text-xs text-slate-400">viable</span>
        </div>
        <p className="text-[11px] text-slate-500">Low security & compliance friction</p>
      </div>
    </div>
  );
}