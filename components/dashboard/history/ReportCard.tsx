import { Copy, Trash2, Eye, Star, RefreshCw, Calendar, ShieldCheck, Layers } from "lucide-react";

export default function ReportCard({
  item,
  onOpen,
  onDelete,
  onDuplicate,
  onFavorite,
  onRegenerate,
}: {
  item: any;
  onOpen: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onFavorite: () => void;
  onRegenerate: () => void;
}) {
  const report = item.report;

  return (
    <div
      className={`rounded-2xl border transition-all p-6 shadow-xl flex flex-col justify-between space-y-4 ${
        item.favorite
          ? "border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/15"
          : "border-slate-800 bg-slate-900/80 hover:border-slate-700"
      }`}
    >
      <div className="space-y-3">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
            {item.idea?.industry || "Tech Startup"}
          </span>

          <button
            onClick={onFavorite}
            className={`p-1.5 rounded-lg transition-colors ${
              item.favorite
                ? "text-amber-400 hover:text-amber-300"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
            }`}
            title={item.favorite ? "Unpin report" : "Pin report as favorite"}
          >
            <Star
              className="h-4 w-4"
              fill={item.favorite ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Title & Summary */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">
            {item.title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {report?.summary || "Startup intelligence analysis generated."}
          </p>
        </div>
      </div>

      {/* Metadata Pill Strip */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-slate-500" />
          {new Date(item.created_at || Date.now()).toLocaleDateString()}
        </span>
        <span className="text-slate-700">•</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-emerald-400" />
          {report?.security?.riskLevel ? `${report.security.riskLevel} Risk` : "Evaluated"}
        </span>
        <span className="text-slate-700">•</span>
        <span className="truncate max-w-[120px] text-cyan-300">
          {report?.business?.primaryModel || "SaaS Model"}
        </span>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={onOpen}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/25 transition-all"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Open Dossier</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={onRegenerate}
            title="Regenerate Report with fresh AI data"
            className="p-2 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={onDuplicate}
            title="Duplicate Report"
            className="p-2 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={onDelete}
            title="Delete Report"
            className="p-2 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}