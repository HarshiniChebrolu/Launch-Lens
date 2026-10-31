"use client";

import React, { useState } from "react";
import { Rocket, Menu, X, ArrowRight, Sparkles } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 max-w-6xl mx-auto">
      <nav className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/80 px-4 sm:px-6 py-3 shadow-2xl backdrop-blur-xl transition-colors duration-200 landingNav">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <Rocket className="h-4 w-4" />
          </div>
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-white landingNavLogo">
            Launch Lens
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium text-slate-300 landingNavLinks">
          <a href="#features" className="hover:text-cyan-400 transition-colors">
            Capabilities
          </a>
          <a href="#workflow" className="hover:text-cyan-400 transition-colors">
            Pipeline
          </a>
          <a href="#preview" className="hover:text-cyan-400 transition-colors">
            Live Dossier
          </a>
          <a href="#start" className="hover:text-cyan-400 transition-colors">
            Pricing & Launch
          </a>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/auth"
            className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3.5 py-1.5 transition-colors landingNavSignIn"
          >
            Sign In
          </a>
          <a
            href="/auth"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-800/50 text-slate-300 hover:text-white landingNavMobileBtn"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden mt-2 rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-2xl space-y-4 landingNavDrawer">
          <div className="flex flex-col space-y-3 text-sm font-medium text-slate-200">
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-cyan-400 transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-cyan-400 transition-colors"
            >
              Pipeline
            </a>
            <a
              href="#preview"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-cyan-400 transition-colors"
            >
              Live Dossier
            </a>
            <a
              href="#start"
              onClick={() => setMobileOpen(false)}
              className="py-1 hover:text-cyan-400 transition-colors"
            >
              Pricing & Launch
            </a>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <a
              href="/auth"
              className="w-full text-center py-2.5 text-xs font-semibold text-slate-300 rounded-xl border border-slate-800 bg-slate-800/40 landingNavDrawerSignIn"
            >
              Sign In
            </a>
            <a
              href="/auth"
              className="w-full text-center py-2.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-md"
            >
              Get Started Free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}