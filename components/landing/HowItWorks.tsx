"use client";

import { motion } from "framer-motion";
import { Lightbulb, Search, Brain, LineChart, ArrowRight, Sparkles, Clock, CheckCircle } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Lightbulb,
    title: "Concept Ingestion & Vertical Scoping",
    duration: "30 Seconds",
    text: "Define core problem hypotheses, target user verticals, and initial pricing assumptions through our structured founder intake wizard.",
    tag: "Input Matrix",
  },
  {
    num: "02",
    icon: Search,
    title: "Dual-Engine Live Web Crawl & Rival Indexing",
    duration: "20 Seconds",
    text: "Automated web crawlers sweep real-time search volume velocity, customer friction on forums, incumbent pricing tables, and feature parity gaps.",
    tag: "Live Data Feed",
  },
  {
    num: "03",
    icon: Brain,
    title: "Gemini 1.5 Pro Multi-Dimensional Synthesis",
    duration: "25 Seconds",
    text: "Reasoning models stress-test unit economics, construct TAM/SAM/SOM boundaries, map system architecture topologies, and generate SWOT matrices.",
    tag: "AI Reasoning",
  },
  {
    num: "04",
    icon: LineChart,
    title: "Interactive 21-Module Cockpit & Export",
    duration: "15 Seconds",
    text: "Access your living venture dossier, interrogate market assumptions with LaunchLens Copilot, and export one-click investor PDF decks.",
    tag: "Venture Ready",
  },
];

export default function HowItWorks() {
  return (
    <section id="workflow" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400 landingBadge">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Execution Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight landingSectionTitle text-white">
          From rough idea to validated dossier in 90 seconds.
        </h2>
        <p className="text-sm sm:text-base leading-relaxed font-normal landingSectionDesc text-slate-400">
          Not generic LLM prose. A disciplined, quantitative venture intelligence pipeline engineered for high-conviction builders.
        </p>
      </div>

      {/* Stepper Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between landingStepCard"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black font-mono text-slate-800 transition-colors landingStepNum">
                    {step.num}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20 text-cyan-400 landingStepIconBox">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400">
                    <Clock className="h-3 w-3" />
                    <span>{step.duration}</span>
                  </div>
                  <h3 className="text-base font-bold tracking-tight landingCardTitle text-white">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed landingCardText text-slate-400">
                  {step.text}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-cyan-400 font-semibold uppercase tracking-wider landingStepFooter">
                <span>{step.tag}</span>
                <div className="flex items-center gap-1">
                  <span>Stage {step.num}</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}