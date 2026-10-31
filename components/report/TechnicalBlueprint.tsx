"use client";

import React, { useState } from "react";
import { StartupReport } from "@/types/report";
import {
  Layers3,
  Cpu,
  Database,
  Globe,
  Lock,
  Sparkles,
  Server,
  FolderTree,
  Code2,
  CheckCircle2,
  ArrowRight,
  Cloud,
  Terminal,
  Copy,
  Check,
  Workflow,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function TechnicalBlueprint({
  report,
}: {
  report: StartupReport;
}) {
  const [activeSection, setActiveSection] = useState<
    "all" | "architecture" | "phases" | "data_api" | "deployment"
  >("all");
  const [copiedFolder, setCopiedFolder] = useState(false);

  const b = report.technicalBlueprint;

  if (!b) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
          <Layers3 className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Technical Blueprint Not Available</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          A technical launch blueprint has not yet been compiled for this startup idea. You can regenerate the report to populate architectural specifications.
        </p>
      </div>
    );
  }

  const phases = b.developmentPhases || [];
  const apis = b.apis || [];
  const tables = b.databaseTables || [];
  const folderStructure = b.folderStructure || [];
  const arch = b.architecture || ({} as any);

  const copyFolderTree = () => {
    if (folderStructure.length && typeof navigator !== "undefined") {
      navigator.clipboard.writeText(folderStructure.join("\n"));
      setCopiedFolder(true);
      setTimeout(() => setCopiedFolder(false), 2000);
    }
  };

  const archLayers = [
    { label: "Frontend Client", val: arch.frontend, icon: Globe, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { label: "Backend API", val: arch.backend, icon: Server, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { label: "Database Engine", val: arch.database, icon: Database, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Authentication", val: arch.authentication, icon: Lock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "AI Reasoning Layer", val: arch.aiLayer, icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Cloud & Storage", val: arch.storage || arch.deployment, icon: Cloud, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  ];

  return (
    <div className="w-full space-y-6">
      {/* 1. Blueprint Header */}
      <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-inner">
              <Layers3 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Technical Launch Blueprint & System Architecture
                </h2>
                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
                  Production Blueprint
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Engineering specification: stack topology, database schema, REST/RPC endpoints, and phased execution timeline
              </p>
            </div>
          </div>
        </div>

        {/* Blueprint Metrics KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Phases Planned
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-mono">{phases.length || 4}</span>
              <span className="text-xs text-slate-400">milestones</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
              APIs Mapped
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-cyan-300 font-mono">{apis.length || 6}</span>
              <span className="text-xs text-cyan-400/80">endpoints</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Database Tables
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-300 font-mono">{tables.length || 5}</span>
              <span className="text-xs text-emerald-400/80">schemas</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              Deploy Readiness
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-300 font-mono">MVP Ready</span>
            </div>
          </div>
        </div>

        {/* Section Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {[
            { id: "all", label: "Full Blueprint View" },
            { id: "architecture", label: "System Architecture" },
            { id: "phases", label: "Development Phases" },
            { id: "data_api", label: "Data & APIs" },
            { id: "deployment", label: "Deployment & Structure" },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                activeSection === sec.id
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Architecture Stack Topology */}
      {(activeSection === "all" || activeSection === "architecture") && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  System Architecture & Stack Topology
                </h3>
                <p className="text-xs text-slate-400">
                  Recommended architectural tiering for high scalability and lean maintenance
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {archLayers.map((layer, idx) => {
              const Icon = layer.icon;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border ${layer.border} bg-slate-950/40 p-4 space-y-2 hover:bg-slate-950/70 transition-all`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {layer.label}
                    </span>
                    <div className={`flex h-7 w-7 items-center justify-center rounded-md ${layer.bg} ${layer.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white leading-snug">
                    {layer.val || "Standard Cloud Native"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Phased Execution Roadmap */}
      {(activeSection === "all" || activeSection === "phases") && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Workflow className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Development Milestones & Phased Execution
                </h3>
                <p className="text-xs text-slate-400">
                  Sprint-by-sprint engineering plan to take the MVP from prototype to production
                </p>
              </div>
            </div>
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
              {phases.length} Phases Defined
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {phases.map((phase, pIdx) => {
              const taskList = phase.tasks || (phase as any).items || [];
              return (
                <div
                  key={pIdx}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-5 space-y-3.5 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300 border border-indigo-500/30">
                        {pIdx + 1}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {phase.phase || `Phase ${pIdx + 1}: Implementation`}
                      </h4>
                    </div>
                    <span className="text-xs text-indigo-400 font-medium">
                      {taskList.length} Key Deliverables
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pl-2">
                    {taskList.map((task: string, tIdx: number) => (
                      <div key={tIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Database Schema & API Contracts */}
      {(activeSection === "all" || activeSection === "data_api") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Database Tables */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Database Schema & Entities
                </h3>
                <p className="text-xs text-slate-400">
                  {tables.length} Core Tables & Data Models
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
              {tables.map((table, idx) => {
                const tableName = table.name || table.tableName || `table_${idx + 1}`;
                const columns = table.fields || table.columns || [];

                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {tableName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {columns.length} columns
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {columns.map((col: string, cIdx: number) => (
                        <span
                          key={cIdx}
                          className="rounded-md border border-slate-800 bg-slate-900 px-2 py-0.5 text-[11px] font-mono text-slate-300"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* API Endpoints & Integrations */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Code2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  API Contracts & Endpoints
                </h3>
                <p className="text-xs text-slate-400">
                  {apis.length} Primary REST/RPC Endpoints
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
              {apis.map((api, idx) => {
                const endpoint = api.endpoint || api.name || `/api/v1/resource_${idx + 1}`;
                const isPost = endpoint.toLowerCase().includes("create") || endpoint.toLowerCase().includes("analyze") || idx % 2 === 0;

                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                            isPost
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          }`}
                        >
                          {isPost ? "POST" : "GET"}
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-200 truncate">
                          {endpoint}
                        </span>
                      </div>
                      {api.auth && (
                        <span className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[9px] font-medium text-amber-400 shrink-0">
                          {api.auth}
                        </span>
                      )}
                    </div>

                    {api.description && (
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {api.description}
                      </p>
                    )}

                    {api.payload && (
                      <div className="rounded bg-slate-900/90 p-2 text-[11px] font-mono text-slate-400 border border-slate-800/80 overflow-x-auto">
                        <span className="text-slate-500">Payload: </span>
                        {typeof api.payload === "string" ? api.payload : JSON.stringify(api.payload)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. Production Deployment Plan & Folder Tree */}
      {(activeSection === "all" || activeSection === "deployment") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deployment Plan */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Cloud className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Production Deployment Pipeline
                </h3>
                <p className="text-xs text-slate-400">
                  Target infrastructure & hosting providers
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Frontend Host</span>
                <span className="text-xs font-semibold text-white font-mono">
                  {b.deploymentPlan?.frontend || "Vercel / Cloudflare Pages"}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Backend & Serverless</span>
                <span className="text-xs font-semibold text-white font-mono">
                  {b.deploymentPlan?.backend || "Next.js API / Edge Functions"}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Database Host</span>
                <span className="text-xs font-semibold text-white font-mono">
                  {b.deploymentPlan?.database || "Supabase PostgreSQL"}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Blob & File Storage</span>
                <span className="text-xs font-semibold text-white font-mono">
                  {b.deploymentPlan?.storage || "AWS S3 / Supabase Storage"}
                </span>
              </div>
            </div>

            {/* Workflow steps */}
            {b.workflow && b.workflow.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Core Runtime Workflow
                </span>
                <div className="space-y-2">
                  {b.workflow.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-cyan-400">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5 leading-relaxed">
                        {typeof step === "string" ? step : JSON.stringify(step)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Folder Structure */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <FolderTree className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Project Folder Architecture
                  </h3>
                  <p className="text-xs text-slate-400">
                    Clean directory layout for rapid bootstrapping
                  </p>
                </div>
              </div>

              <button
                onClick={copyFolderTree}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300 hover:text-white transition-colors"
                title="Copy folder structure"
              >
                {copiedFolder ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 font-mono text-xs text-slate-300 max-h-[380px] overflow-y-auto custom-scrollbar space-y-1">
              {folderStructure.length > 0 ? (
                folderStructure.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300">
                    <span className="text-slate-600 select-none">├──</span>
                    <span>{typeof item === "string" ? item : JSON.stringify(item)}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-500">Standard Next.js App Router tree structure</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}