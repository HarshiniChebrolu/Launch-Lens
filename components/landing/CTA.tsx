"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Rocket, CheckCircle2 } from "lucide-react";

export default function CTA() {
  return (
    <section id="start" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/50 p-8 sm:p-14 shadow-2xl backdrop-blur-2xl text-center max-w-5xl mx-auto space-y-6 landingCTACard"
      >
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-16 w-96 h-48 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none landingCTAGlow" />

        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400 landingBadge">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Launch Your Venture Dossier</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-2xl mx-auto landingSectionTitle text-white">
          Know your market before you write a single line of code.
        </h2>

        <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal landingSectionDesc text-slate-300">
          Eliminate startup uncertainty. Generate quantitative market validation, competitor vulnerability teardowns, full-stack architecture specs, and investor decks in minutes.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <a
            href="/auth"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Launch My Startup Dossier</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400 landingHeroCheckmarks">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Instant guest & demo workspace mode
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Full export rights & PDF generation
          </span>
        </div>
      </motion.div>
    </section>
  );
}