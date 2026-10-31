"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  Wand2,
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import LoadingEngine from "./LoadingEngine";
import IntelligentIdeaEditor from "./IntelligentIdeaEditor";
import IdeaDiscoveryLibrary from "./IdeaDiscoveryLibrary";
import { IdeaInput, StartupReport } from "@/types/report";
import { DiscoveryIdea } from "@/lib/idea-library";

type EntryPath = "have_idea" | "improve_idea" | "find_idea";

export default function IdeaWizard({
  onReportReady,
  initialIdea,
}: {
  onReportReady: (report: StartupReport) => void;
  initialIdea?: Partial<IdeaInput & { title?: string; constraints?: string }>;
}) {
  const [activePath, setActivePath] = useState<EntryPath>("have_idea");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prefilledIdea, setPrefilledIdea] = useState<Partial<IdeaInput & { title?: string; constraints?: string }>>(
    initialIdea || {}
  );

  async function handleValidate(data: IdeaInput) {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!json.success || !json.report) {
        throw new Error(json.error || "Failed to generate report");
      }

      // Persist to database/local storage
      try {
        const { saveReportToSupabase } = await import("@/lib/reports-db");
        await saveReportToSupabase(data, json.report);
      } catch (saveErr) {
        console.warn("Report save warning:", saveErr);
      }

      onReportReady(json.report);
    } catch (err: any) {
      console.error("Analysis generation error:", err);
      setError(
        err?.message ||
          "Could not generate report. Please check API connection or try again."
      );
      setLoading(false);
    }
  }

  function handleSelectFromLibrary(idea: DiscoveryIdea, expansionDirective?: string) {
    let solutionText = idea.proposedSolution;
    if (expansionDirective) {
      solutionText += `\n[AI Expansion]: ${expansionDirective}`;
    }

    setPrefilledIdea({
      title: idea.name,
      idea: `${idea.proposedSolution}\nKey MVP: ${idea.mvpFeatures.slice(0, 2).join("; ")}`,
      users: idea.intendedUsers,
      problem: idea.problem,
      industry: idea.category.includes("AI") ? "AI SaaS" : idea.category,
      budget: "Low MVP budget (< $1,000)",
      goal: "Startup Venture",
    });

    // Switch to editor
    setActivePath("have_idea");
  }

  if (loading) {
    return <LoadingEngine />;
  }

  return (
    <section className="w-full space-y-6 max-w-6xl mx-auto">
      {/* 1. Header with 3 Entry Paths */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Idea Creation Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How would you like to begin?
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Whether you have a rough concept, an unrefined idea, or no idea at all, LaunchLens will help you formulate a validated venture proposal.
          </p>
        </div>

        {/* 3 Entry Path Selector Cards (Functional Actions) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Path 1: I Have an Idea */}
          <button
            type="button"
            onClick={() => setActivePath("have_idea")}
            className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 group ${
              activePath === "have_idea"
                ? "border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900"
            }`}
          >
            <div className="space-y-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                  activePath === "have_idea"
                    ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 group-hover:text-cyan-400"
                }`}
              >
                <Lightbulb className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                1. I Have an Idea
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your rough concept in plain English or voice. Formulate your problem, users, and constraints.
              </p>
            </div>

            <div
              className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                activePath === "have_idea" ? "text-cyan-300" : "text-slate-500"
              }`}
            >
              <span>{activePath === "have_idea" ? "Active Mode" : "Start with concept"}</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>

          {/* Path 2: Improve My Idea with AI */}
          <button
            type="button"
            onClick={() => {
              setActivePath("improve_idea");
            }}
            className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 group ${
              activePath === "improve_idea"
                ? "border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900"
            }`}
          >
            <div className="space-y-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                  activePath === "improve_idea"
                    ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 group-hover:text-indigo-400"
                }`}
              >
                <Wand2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                2. Improve My Idea with AI
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide a raw 1-sentence draft and let our venture model structure the beachhead, MVP, and revenue model.
              </p>
            </div>

            <div
              className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                activePath === "improve_idea" ? "text-indigo-300" : "text-slate-500"
              }`}
            >
              <span>{activePath === "improve_idea" ? "Active Mode" : "Auto-refine concept"}</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>

          {/* Path 3: Help Me Find an Idea */}
          <button
            type="button"
            onClick={() => setActivePath("find_idea")}
            className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 group ${
              activePath === "find_idea"
                ? "border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/10"
                : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900"
            }`}
          >
            <div className="space-y-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                  activePath === "find_idea"
                    ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 group-hover:text-purple-400"
                }`}
              >
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                3. Help Me Find an Idea
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse our 15-industry library of vetted, pre-structured startup concepts. Choose one and customize it.
              </p>
            </div>

            <div
              className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                activePath === "find_idea" ? "text-purple-300" : "text-slate-500"
              }`}
            >
              <span>{activePath === "find_idea" ? "Active Mode" : "Browse 15 categories"}</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* 2. Workspace View based on selected Path */}
      {activePath === "find_idea" ? (
        <IdeaDiscoveryLibrary
          onSelectIdea={handleSelectFromLibrary}
          onClose={() => setActivePath("have_idea")}
        />
      ) : (
        <IntelligentIdeaEditor
          initialIdea={prefilledIdea}
          onValidate={handleValidate}
          onExploreLibrary={() => setActivePath("find_idea")}
          initialMode={activePath === "improve_idea" ? "improve" : "direct"}
        />
      )}
    </section>
  );
}