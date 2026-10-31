"use client";

import { motion } from "framer-motion";
import {
  Search,
  BarChart3,
  Users,
  ShieldCheck,
  Route,
  Presentation,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
  LineChart,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Live Web & Market Demand Sizing",
    badge: "Dual-Engine Web Scrape",
    text: "Autonomous web intelligence crawling search volume velocity, customer sentiment on community forums, and Google Trends momentum. Computes defensible TAM, SAM, and SOM projections with verified sources.",
    metric: "$14.2B TAM • +38% Demand Velocity",
    accent: "cyan",
  },
  {
    icon: BarChart3,
    title: "Dynamic Economics & Pricing Studio",
    badge: "Financial Feasibility",
    text: "Simulates tiered SaaS pricing, usage margins, customer acquisition cost (CAC), and payback break-even horizons. Stress-tests revenue assumptions under high-churn and enterprise retention models.",
    metric: "3.8x LTV/CAC • 14-Mo Break-Even",
    accent: "indigo",
  },
  {
    icon: Users,
    title: "Granular Beachhead Persona Mapping",
    badge: "Target ICP Wedge",
    text: "Pinpoints high-intent buyer archetypes, unaddressed daily workflows, willingness-to-pay thresholds, and highest-converting distribution channels (outbound, organic search, partner integrations).",
    metric: "88% Purchase Intent • Sub-48h Sales Cycle",
    accent: "emerald",
  },
  {
    icon: ShieldCheck,
    title: "Regulatory, Privacy & Security Guardrails",
    badge: "Compliance & Risk Matrix",
    text: "Pre-empts compliance roadblocks before architecture begins. Automatically audits industry regulatory standards (SOC2, HIPAA, GDPR, PCI-DSS) and flags third-party vendor attack vectors.",
    metric: "Zero Severe Liabilities • SOC2 Type II Mapped",
    accent: "amber",
  },
  {
    icon: Route,
    title: "Production Engineering Architecture",
    badge: "Phased MVP Specs",
    text: "Generates full-stack topology blueprints, PostgreSQL schema definitions, API contracts, deployment topologies, and concrete 4-phase implementation sprints with precise time estimates.",
    metric: "Next.js 14 + Edge • 4-Phase Delivery Plan",
    accent: "purple",
  },
  {
    icon: Presentation,
    title: "Investor Pitch Studio & Due Diligence",
    badge: "Fundraising Ready",
    text: "Converts deep research into 30-second elevator pitches, 10-slide seed pitch deck narratives, and simulation transcripts for the toughest questions institutional VCs will ask.",
    metric: "10-Slide Deck Spec • Tough VC Q&A Matrix",
    accent: "rose",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 landingBadge">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight landingSectionTitle text-white">
          Everything a founder needs before spending a dollar.
        </h2>
        <p className="text-sm sm:text-base leading-relaxed font-normal landingSectionDesc text-slate-400">
          LaunchLens replaces weeks of fragmented market research, expensive consulting decks, and guesswork with one comprehensive quantitative intelligence dossier.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl border border-slate-800 bg-slate-900/80 p-7 shadow-xl backdrop-blur-sm hover:border-slate-700 transition-all flex flex-col justify-between landingFeatureCard"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform landingFeatureIconBox">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-slate-800 bg-slate-950 px-2.5 py-0.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider landingFeaturePill">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold tracking-tight group-hover:text-cyan-400 transition-colors landingCardTitle text-white">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm leading-relaxed font-normal landingCardText text-slate-400">
                  {item.text}
                </p>
              </div>

              <div className="pt-5 mt-6 border-t border-slate-800/80 space-y-3 landingFeatureFooter">
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 font-semibold landingFeatureMetric">
                  <LineChart className="h-3.5 w-3.5 shrink-0" />
                  <span>{item.metric}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 group-hover:text-cyan-400 transition-colors font-medium landingFeatureAction">
                  <span>Integrated into Report</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}