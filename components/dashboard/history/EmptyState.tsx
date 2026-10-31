"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Compass,
  Layers,
  LineChart,
  ShieldCheck,
  Rocket,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

export default function EmptyState({ onCreate }: { onCreate: () => void }) {
  const [founderEmail, setFounderEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("launch_lens_user");
        if (storedUser) {
          const u = JSON.parse(storedUser);
          if (u.email) {
            const namePart = u.email.split("@")[0];
            setFounderEmail(namePart.charAt(0).toUpperCase() + namePart.slice(1));
          }
        }
      } catch (e) {}
    }
  }, []);

  const onboardingSteps = [
    {
      num: "01",
      title: "Input Concept & Target Market",
      desc: "Specify your problem statement, target audience, and business goals in under 2 minutes.",
      icon: Lightbulb,
    },
    {
      num: "02",
      title: "Automated Web Intelligence",
      desc: "Our dual-engine extracts real-time competitor teardowns, market trends, and pricing signals.",
      icon: Compass,
    },
    {
      num: "03",
      title: "Receive Comprehensive Blueprint",
      desc: "Get an investor-ready dossier: technical architecture, MVP scope, pricing models, and pitch script.",
      icon: Rocket,
    },
  ];

  const starterTemplates = [
    {
      title: "Autonomous Support Copilot",
      industry: "AI SaaS",
      tagline: "Multilingual AI support agent for fast-growing B2B software companies.",
    },
    {
      title: "Preventive Health Bio-Tracker",
      industry: "HealthTech",
      tagline: "Continuous biomarker monitoring and personalized longevity intelligence.",
    },
    {
      title: "Cross-Border Freelance Treasury",
      industry: "FinTech",
      tagline: "Instant multi-currency settlement and automated tax reserves for digital nomads.",
    },
  ];

  return (
    <div className="w-full space-y-8 py-2">
      {/* 1. Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>First Session Orientation</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome to LaunchLens{founderEmail ? `, ${founderEmail}` : ""} 👋
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Your intelligence workspace is ready. Before writing code or raising capital, validate your startup concept against live market data, incumbent vulnerabilities, and technical feasibility.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onCreate}
              className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Build First Startup Report</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Onboarding Workflow Stepper */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
            How LaunchLens Operates
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Three steps from concept to validated blueprint
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {onboardingSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg backdrop-blur-sm space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-slate-700">
                    {step.num}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight">
                  {step.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Starter Inspiration Templates */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Rocket className="h-4 w-4 text-cyan-400" />
              Explore Sample Concepts
            </h3>
            <p className="text-xs text-slate-400">
              Not sure what to input? Click to launch the builder with an inspiring theme.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          {starterTemplates.map((tpl, i) => (
            <div
              key={i}
              onClick={onCreate}
              className="group cursor-pointer rounded-xl border border-slate-800/80 bg-slate-950/50 p-4 space-y-2 hover:border-cyan-500/40 hover:bg-slate-950/80 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                  {tpl.industry}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                {tpl.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {tpl.tagline}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}