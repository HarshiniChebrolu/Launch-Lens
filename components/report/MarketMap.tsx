"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import {
  Compass,
  Sparkles,
  ShieldAlert,
  Target,
  Layers,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import {
  MarketPositioningResult,
  PositionedEntity,
} from "@/types/positioning";
import { StartupReport } from "@/types/report";

export interface MarketMapProps {
  positioningData?: MarketPositioningResult;
  report?: StartupReport;
  startup?: {
    name: string;
    description: string;
    industry?: string;
    targetUsers?: string;
  };
  competitors?: Array<{
    name: string;
    description?: string;
    strength?: string;
    weakness?: string;
    gap?: string;
  }>;
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: PositionedEntity;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data: PositionedEntity = payload[0].payload;
  const isStartup = data.type === "startup";

  return (
    <div className="z-50 min-w-[240px] max-w-[300px] rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 text-white shadow-2xl backdrop-blur-md space-y-2">
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{
              backgroundColor: isStartup ? "#06B6D4" : data.color || "#818CF8",
              boxShadow: isStartup
                ? "0 0 8px #06B6D4"
                : "0 0 4px rgba(129, 140, 248, 0.6)",
            }}
          />
          <span className="font-semibold text-xs truncate text-slate-100">
            {data.name}
          </span>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
            isStartup
              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
              : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
          }`}
        >
          {isStartup ? "Startup" : "Competitor"}
        </span>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400 text-[11px]">Semantic Overlap:</span>
          <span className="font-mono font-bold text-cyan-400 text-xs">
            {isStartup ? "100% (Anchor)" : `${data.similarityPercentage}%`}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400 text-[11px]">Quadrant:</span>
          <span className="text-slate-200 font-medium text-[11px]">{data.quadrant}</span>
        </div>

        <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
          <span>Coordinates:</span>
          <span className="text-slate-300">
            [{data.x}, {data.y}]
          </span>
        </div>
      </div>
    </div>
  );
}

function CustomScatterNode(props: any) {
  const { cx, cy, payload } = props;
  const isStartup = payload?.type === "startup";
  const color = isStartup ? "#06B6D4" : payload?.color || "#818CF8";

  if (isStartup) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={16}
          fill="none"
          stroke="#06B6D4"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          opacity={0.7}
        />
        <circle
          cx={cx}
          cy={cy}
          r={10}
          fill="#06B6D4"
          fillOpacity={0.25}
          stroke="#38BDF8"
          strokeWidth={2}
        />
        <circle cx={cx} cy={cy} r={5} fill="#FFFFFF" />
      </g>
    );
  }

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={7}
        fill={color}
        fillOpacity={0.85}
        stroke="#FFFFFF"
        strokeWidth={1.5}
        className="cursor-pointer transition-transform hover:scale-125"
      />
    </g>
  );
}

export default function MarketMap({
  positioningData: initialData,
  report,
  startup,
  competitors,
  className = "",
}: MarketMapProps) {
  const [data, setData] = useState<MarketPositioningResult | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  const derivedStartup = useMemo(() => {
    if (startup) return startup;
    if (report) {
      return {
        name: report.title || "Your Startup",
        description: report.summary || "The startup idea being validated",
      };
    }
    return { name: "Your Startup", description: "Startup concept" };
  }, [startup, report]);

  const derivedCompetitors = useMemo(() => {
    if (competitors && competitors.length > 0) return competitors;
    if (report?.competitors && report.competitors.length > 0) {
      return report.competitors.map((c) => ({
        name: c.name,
        description: `${c.strength ? `Strength: ${c.strength}. ` : ""}${c.weakness ? `Weakness: ${c.weakness}. ` : ""}${c.gap ? `Gap: ${c.gap}` : ""}`.trim(),
        strength: c.strength,
        weakness: c.weakness,
        gap: c.gap,
      }));
    }
    return [];
  }, [competitors, report]);

  const loadPositioning = React.useCallback(async () => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
      return;
    }

    if (derivedCompetitors.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/positioning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startup: derivedStartup,
          competitors: derivedCompetitors,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Failed to analyze semantic market positioning.");
      }

      setData(json.positioning);
    } catch (err) {
      console.error("[MarketMap] Fetch error:", err);
      setError(err instanceof Error ? err.message : "Error computing positioning.");
    } finally {
      setLoading(false);
    }
  }, [initialData, derivedStartup, derivedCompetitors]);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
    } else {
      loadPositioning();
    }
  }, [initialData, loadPositioning]);

  const selectedEntity = useMemo(() => {
    if (!data || !selectedEntityId) return null;
    return data.entities.find((e) => e.id === selectedEntityId) || null;
  }, [data, selectedEntityId]);

  const getScoreColor = (score: number, invert = false) => {
    const val = invert ? 100 - score : score;
    if (val >= 67) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
    if (val >= 40) return "text-amber-400 border-amber-500/20 bg-amber-500/10";
    return "text-rose-400 border-rose-500/20 bg-rose-500/10";
  };

  const getConfidenceBadge = (confidence?: "high" | "medium" | "low") => {
    switch (confidence) {
      case "high":
        return {
          label: "High Confidence",
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          icon: CheckCircle2,
        };
      case "medium":
        return {
          label: "Medium Confidence",
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          icon: AlertCircle,
        };
      default:
        return {
          label: "Low Confidence",
          color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
          icon: HelpCircle,
        };
    }
  };

  const confidenceMeta = getConfidenceBadge(data?.confidence);
  const ConfidenceIcon = confidenceMeta.icon;

  return (
    <div
      className={`w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6 ${className}`}
    >
      {/* 1. Header & Badges */}
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
            <Compass className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Semantic Market Positioning Map
              </h2>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Vector Space
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-normal">
              2D spatial projection based on Gemini text-embedding-004 cosine distance
            </p>
          </div>
        </div>

        {/* Badges & Refresh Action */}
        <div className="flex flex-wrap items-center gap-3">
          {data && (
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${confidenceMeta.color}`}
            >
              <ConfidenceIcon className="h-3.5 w-3.5 shrink-0" />
              <span>
                {confidenceMeta.label} ({data.competitorCount} competitors)
              </span>
            </div>
          )}

          <button
            onClick={loadPositioning}
            disabled={loading}
            title="Recalculate Proximity Vectors"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-800/50 text-slate-400 transition-all hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-200">
            Generating semantic vector embeddings & computing 2D spatial projection...
          </p>
          <p className="text-xs text-slate-400">
            Projecting multi-dimensional embeddings into 2D principal coordinate space
          </p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-rose-400 text-sm">
            <ShieldAlert className="h-4 w-4" />
            <span>Market Positioning Calculation Error</span>
          </div>
          <p className="text-xs text-slate-400">{error}</p>
          <button
            onClick={loadPositioning}
            className="rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/30"
          >
            Retry Analysis
          </button>
        </div>
      )}

      {/* Main Content Body */}
      {!loading && data && (
        <div className="space-y-6">
          {/* 2. Metrics & Scorecards Grid (3-column responsive) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Crowdedness Score Card */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 space-y-3 shadow-md">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-slate-400 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-400 shrink-0" />
                  Crowdedness Score
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getScoreColor(
                    data.scores.crowdednessScore,
                    true
                  )}`}
                >
                  {data.summary.crowdednessLevel} Density
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono tracking-tight">
                  {data.scores.crowdednessScore}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-700/50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-700"
                  style={{ width: `${data.scores.crowdednessScore}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                Mean top competitor overlap:{" "}
                <b className="text-slate-200">{data.scores.averageCompetitorSimilarity}%</b>
              </p>
            </div>

            {/* Differentiation Score Card */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 space-y-3 shadow-md">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-slate-400 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
                  Differentiation Score
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getScoreColor(
                    data.scores.differentiationScore
                  )}`}
                >
                  {data.summary.differentiationLevel} Uniqueness
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono tracking-tight">
                  {data.scores.differentiationScore}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-700/50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-cyan-400 transition-all duration-700"
                  style={{ width: `${data.scores.differentiationScore}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                Nearest rival proximity:{" "}
                <b className="text-slate-200">{data.scores.topCompetitorSimilarity}%</b>
              </p>
            </div>

            {/* Whitespace Opportunity Score Card */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 space-y-3 shadow-md">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-slate-400 flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-400 shrink-0" />
                  Whitespace Opportunity
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getScoreColor(
                    data.scores.whitespaceOpportunityScore
                  )}`}
                >
                  {data.summary.whitespaceLevel} Niche
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono tracking-tight">
                  {data.scores.whitespaceOpportunityScore}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-700/50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-700"
                  style={{ width: `${data.scores.whitespaceOpportunityScore}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                Strategic market corridor potential
              </p>
            </div>
          </div>

          {/* 3. Accented Insight Callout Box (Left Accent Border) */}
          <div className="border-l-4 border-emerald-500 bg-emerald-500/5 p-4 rounded-r-xl space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" />
              <h4 className="text-sm font-semibold text-white">
                {data.summary.verdict}
              </h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed pl-6">
              {data.summary.recommendation}
            </p>
          </div>

          {/* 4. Dedicated Scatter Chart Padded Dark Wrapper */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  2D Principal Component Space
                </span>
                <span className="text-xs text-slate-500">
                  (Click any node to view proximity)
                </span>
              </div>

              {/* Map Legend */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-full bg-cyan-400 ring-2 ring-cyan-400/40" />
                  <span className="text-slate-200 font-medium">{data.startup.name} (Origin)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-full bg-indigo-400" />
                  <span className="text-slate-400">Competitors</span>
                </div>
              </div>
            </div>

            {/* Recharts Scatter Map Container */}
            <div className="relative h-[320px] md:h-[350px] w-full select-none">
              {/* Quadrant Watermarks */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2 p-6 text-[11px] font-medium tracking-wider text-slate-600/40 uppercase">
                <div className="flex items-start justify-start">
                  II. Differentiated Challenger
                </div>
                <div className="flex items-start justify-end">
                  I. Feature Convergence
                </div>
                <div className="flex items-end justify-start">
                  III. Niche Alternative
                </div>
                <div className="flex items-end justify-end">
                  IV. Incumbent Horizon
                </div>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  onClick={(e) => {
                    if (e && e.activePayload && e.activePayload[0]) {
                      setSelectedEntityId(e.activePayload[0].payload.id);
                    }
                  }}
                >
                  <XAxis
                    type="number"
                    dataKey="x"
                    domain={[-100, 100]}
                    stroke="#475569"
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    name="Semantic Dimension 1"
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    domain={[-100, 100]}
                    stroke="#475569"
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    name="Semantic Dimension 2"
                  />
                  <ZAxis range={[100, 100]} />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.15)" }}
                  />
                  <ReferenceLine x={0} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4" />
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4" />

                  <Scatter
                    data={data.entities}
                    shape={<CustomScatterNode />}
                  >
                    {data.entities.map((entry) => (
                      <Cell
                        key={entry.id}
                        fill={entry.type === "startup" ? "#06B6D4" : entry.color || "#818CF8"}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Selected Node Proximity Bar */}
            {selectedEntity && (
              <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          selectedEntity.type === "startup"
                            ? "#06B6D4"
                            : selectedEntity.color || "#818CF8",
                      }}
                    />
                    <h4 className="text-xs font-bold text-white">
                      {selectedEntity.name}
                    </h4>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase font-semibold text-slate-300">
                      {selectedEntity.quadrant}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400">Proximity Overlap: </span>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {selectedEntity.type === "startup"
                        ? "100% (Origin)"
                        : `${selectedEntity.similarityPercentage}%`}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedEntity.description}
                </p>
              </div>
            )}
          </div>

          {/* 5. Footer Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>
                Engine method:{" "}
                <b className="text-slate-300 font-mono">
                  {data.method === "gemini-embedding-004"
                    ? "Google Gemini text-embedding-004 (768d)"
                    : "Deterministic pseudo-semantic embedding fallback"}
                </b>
              </span>
            </div>
            <span>
              Updated: {new Date(data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
