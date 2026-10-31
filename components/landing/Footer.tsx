import { Rocket, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 py-12 px-4 sm:px-6 landingFooter">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20">
            <Rocket className="h-4 w-4" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight landingNavLogo text-white">Launch Lens</span>
            <p className="text-[11px] text-slate-500 landingMuted">Autonomous Startup Intelligence & Validation</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 landingFooterLinks">
          <a href="#features" className="hover:text-cyan-400 transition-colors">
            Capabilities
          </a>
          <a href="#workflow" className="hover:text-cyan-400 transition-colors">
            Pipeline
          </a>
          <a href="#preview" className="hover:text-cyan-400 transition-colors">
            Live Dossier
          </a>
          <a href="/auth" className="hover:text-cyan-400 transition-colors">
            Founder Sign In
          </a>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 landingMuted">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span>All Systems Operational • © {new Date().getFullYear()} LaunchLens Intelligence</span>
        </div>
      </div>
    </footer>
  );
}