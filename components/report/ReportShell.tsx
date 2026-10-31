"use client";

import { useEffect, useState, useRef } from "react";
import { StartupReport } from "@/types/report";
import {
  FileText,
  Download,
  PlusCircle,
  Sparkles,
  ChevronDown,
  Layers,
  TrendingUp,
  Briefcase,
  Layers3,
  Rocket,
  ShieldCheck,
  Cpu,
  BarChart2,
  Lock,
  Compass,
  CheckCircle2,
  DollarSign,
  Grid,
  ChevronRight,
  ArrowLeft,
  X,
} from "lucide-react";

import StartupOverview from "./StartupOverview";
import ExecutiveSummary from "./ExecutiveSummary";
import Validation from "./Validation";
import Market from "./Market";
import Competitors from "./Competitors";
import Business from "./Business";
import MVP from "./MVP";
import Security from "./Security";
import SWOT from "./SWOT";
import Roadmap from "./Roadmap";
import Pitch from "./Pitch";
import TechStack from "./TechStack";
import CostEstimator from "./CostEstimator";
import InvestorReadiness from "./InvestorReadiness";
import TechnicalBlueprint from "./TechnicalBlueprint";
import OpportunityRadar from "./OpportunityRadar";
import PitchDeck from "./PitchDeck";
import Branding from "./Branding";
import CompetitorMatrix from "./CompetitorMatrix";
import GoToMarket from "./GoToMarket";
import MarketMap from "./MarketMap";

export type ReportTab =
  | "Overview"
  | "Validation"
  | "SWOT"
  | "Radar"
  | "Market"
  | "Market Map"
  | "Competitors"
  | "Matrix"
  | "Blueprint"
  | "Tech Stack"
  | "MVP"
  | "Security"
  | "Business"
  | "Cost"
  | "Investor"
  | "Branding"
  | "Roadmap"
  | "GTM"
  | "Pitch"
  | "Deck"
  | "Executive";

interface SectionCategory {
  category: string;
  description: string;
  items: { label: string; tab: ReportTab; icon: any; summary: string }[];
}

export const sectionCategories: SectionCategory[] = [
  {
    category: "Overview and Strategy",
    description: "High-level feasibility synthesis & strategic positioning",
    items: [
      {
        label: "Startup Overview",
        tab: "Overview",
        icon: Compass,
        summary: "Primary startup synthesis & 10 key feasibility pillars",
      },
      {
        label: "Feasibility Validation",
        tab: "Validation",
        icon: CheckCircle2,
        summary: "Multi-factor readiness score & risk decomposition",
      },
      {
        label: "SWOT Analysis",
        tab: "SWOT",
        icon: ShieldCheck,
        summary: "Internal strengths/weaknesses & external dynamics",
      },
      {
        label: "Opportunity Radar",
        tab: "Radar",
        icon: Sparkles,
        summary: "Market white-space & expansion vectors",
      },
    ],
  },
  {
    category: "Market and Competition",
    description: "Customer demand, growth curves & rival intelligence",
    items: [
      {
        label: "Market Demand & Growth",
        tab: "Market",
        icon: TrendingUp,
        summary: "Market momentum signals & demand forecasts",
      },
      {
        label: "2D Semantic Market Map",
        tab: "Market Map",
        icon: Grid,
        summary: "Vector-based market landscape positioning",
      },
      {
        label: "Competitor Intelligence",
        tab: "Competitors",
        icon: Briefcase,
        summary: "Direct/indirect rivals, strengths & vulnerability gaps",
      },
      {
        label: "Feature Parity Matrix",
        tab: "Matrix",
        icon: Layers,
        summary: "Granular capability comparison across incumbents",
      },
    ],
  },
  {
    category: "Product and Technology",
    description: "Architecture blueprint, stack & technical execution",
    items: [
      {
        label: "Technical Blueprint",
        tab: "Blueprint",
        icon: Layers3,
        summary: "System architecture, database schema & REST APIs",
      },
      {
        label: "Full-Stack Tech Specs",
        tab: "Tech Stack",
        icon: Cpu,
        summary: "Frontend, backend, AI reasoning & cloud infrastructure",
      },
      {
        label: "Phased MVP Scope",
        tab: "MVP",
        icon: Layers,
        summary: "Must-have vs nice-to-have capabilities roadmap",
      },
      {
        label: "Security & Compliance",
        tab: "Security",
        icon: Lock,
        summary: "Data privacy, risk mitigation & compliance posture",
      },
    ],
  },
  {
    category: "Business and Finance",
    description: "Monetization models, unit economics & investor diligence",
    items: [
      {
        label: "Business Model & Monetization",
        tab: "Business",
        icon: DollarSign,
        summary: "Revenue streams, pricing strategy & profit outlook",
      },
      {
        label: "Financial & Cost Estimator",
        tab: "Cost",
        icon: DollarSign,
        summary: "Infrastructure costs, burn rate & break-even timeline",
      },
      {
        label: "Investor Readiness & Diligence",
        tab: "Investor",
        icon: TrendingUp,
        summary: "Fundraising criteria & institutional diligence scorecard",
      },
      {
        label: "Brand Identity & Positioning",
        tab: "Branding",
        icon: Sparkles,
        summary: "Naming options, taglines, color palettes & design tone",
      },
    ],
  },
  {
    category: "Execution and Growth",
    description: "Milestones, sprint schedules & distribution channels",
    items: [
      {
        label: "Execution Roadmap & Sprints",
        tab: "Roadmap",
        icon: BarChart2,
        summary: "Phase 1 through Phase 4 actionable startup milestones",
      },
      {
        label: "Go-To-Market & Channels",
        tab: "GTM",
        icon: Rocket,
        summary: "Customer acquisition tactics & growth loops",
      },
    ],
  },
  {
    category: "Pitch and Research",
    description: "Investor storytelling, slide deck & research references",
    items: [
      {
        label: "30-Second Elevator Pitch",
        tab: "Pitch",
        icon: Rocket,
        summary: "Elevator hook, hackathon script & investor Q&A prep",
      },
      {
        label: "10-Slide Pitch Deck",
        tab: "Deck",
        icon: FileText,
        summary: "Structured slide outline with talking points & metrics",
      },
      {
        label: "Executive Milestones",
        tab: "Executive",
        icon: Sparkles,
        summary: "Founder checklist, 30-day & 90-day action targets",
      },
    ],
  },
];

export default function ReportShell({
  report,
  onNewIdea,
  initialTab = "Overview",
}: {
  report: StartupReport;
  onNewIdea: () => void;
  initialTab?: ReportTab;
}) {
  const [tab, setTab] = useState<ReportTab>(initialTab);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && dropdownOpen) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  function exportReport() {
    window.print();
  }

  // Find active item info
  const activeItem = sectionCategories
    .flatMap((c) => c.items)
    .find((item) => item.tab === tab) || {
    label: tab === "Overview" ? "Startup Overview" : tab,
    icon: Compass,
    summary: "Active report module",
  };

  const ActiveIcon = activeItem.icon;
  const isOverview = tab === "Overview";

  return (
    <section className="w-full space-y-6 min-w-0">
      {/* LEVEL 2: TOP REPORT HEADER & REPORT SECTIONS DROPDOWN (Positioned Above Content) */}
      <header className="relative z-50 w-full rounded-2xl border border-slate-800 bg-slate-900/95 p-5 sm:p-6 shadow-xl backdrop-blur-xl reportShellHeader space-y-4">
        {/* Tier 1: Top Navigation Bar with Badges on Left, Dropdown & Actions on Right */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          {/* Left: Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
              Startup Intelligence Dossier
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              Feasibility Validated
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[11px] text-slate-300 font-medium">
              21 Modules
            </span>
          </div>

          {/* Right: TOP Report Sections Dropdown & Primary Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Report Sections Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs font-bold text-slate-400">
                  Report Sections
                </span>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                  aria-expanded={dropdownOpen}
                  aria-label="Open report sections menu"
                >
                  <ActiveIcon className="h-4 w-4 text-cyan-400" />
                  <span className="max-w-[140px] sm:max-w-none truncate">{activeItem.label}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* High-Z Dropdown Overlay: Never hidden behind cards */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[75vh] overflow-y-auto rounded-2xl border border-slate-700/90 bg-slate-950/98 p-3 shadow-2xl backdrop-blur-2xl z-[100] space-y-4 custom-scrollbar reportSectionDropdown"
                  style={{ minWidth: "280px" }}
                >
                  <div className="flex items-center justify-between px-2 py-1 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Dossier Sections (21)
                    </span>
                    <button
                      onClick={() => setDropdownOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {sectionCategories.map((group) => (
                    <div key={group.category} className="space-y-1">
                      <div className="px-2">
                        <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                          {group.category}
                        </span>
                        <span className="text-[10px] text-slate-400 block -mt-0.5">
                          {group.description}
                        </span>
                      </div>

                      <div className="space-y-0.5 pt-1">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isSelected = tab === item.tab;
                          return (
                            <button
                              key={item.tab}
                              type="button"
                              onClick={() => {
                                setTab(item.tab);
                                setDropdownOpen(false);
                              }}
                              className={`flex items-start justify-between w-full px-3 py-2 text-left rounded-xl transition-all ${
                                isSelected
                                  ? "bg-cyan-500/20 text-cyan-200 font-bold border border-cyan-500/30 shadow-sm"
                                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                              }`}
                            >
                              <div className="flex items-start gap-2.5 min-w-0">
                                <Icon
                                  className={`h-4 w-4 shrink-0 mt-0.5 ${
                                    isSelected ? "text-cyan-400" : "text-slate-400"
                                  }`}
                                />
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold leading-tight truncate">
                                    {item.label}
                                  </div>
                                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                    {item.summary}
                                  </div>
                                </div>
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Export & New Idea Buttons */}
            <button
              onClick={exportReport}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-all shadow-sm"
              title="Print or Save as PDF"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span>Export PDF</span>
            </button>

            <button
              onClick={onNewIdea}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>New Idea</span>
            </button>
          </div>
        </div>

        {/* Tier 2: Startup Concept Title & Description */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Startup Dossier
            </span>
          </div>

          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-snug break-words max-w-4xl reportTitle">
            {report.title}
          </h1>

          {report.summary && report.summary !== report.title && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words max-w-4xl reportSummary">
              {report.summary}
            </p>
          )}
        </div>

        {/* Breadcrumb banner when inside a detailed sub-section (allows instant return to Overview) */}
        {!isOverview && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
            <button
              onClick={() => setTab("Overview")}
              className="inline-flex items-center gap-1.5 font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Startup Overview</span>
            </button>

            <div className="flex items-center gap-2 text-slate-400">
              <span>Section:</span>
              <span className="font-semibold text-white">{activeItem.label}</span>
            </div>
          </div>
        )}
      </header>

      {/* LEVEL 1: MAIN REPORT BODY (Full width, responsive, clean stacking) */}
      <div className="w-full min-w-0 transition-all relative z-10">
        {tab === "Overview" && (
          <StartupOverview
            report={report}
            onNavigateToTab={(nextTab) => setTab(nextTab)}
          />
        )}
        {tab === "Validation" && <Validation report={report} />}
        {tab === "SWOT" && <SWOT report={report} />}
        {tab === "Radar" && <OpportunityRadar report={report} />}
        {tab === "Market" && <Market report={report} />}
        {tab === "Market Map" && <MarketMap report={report} />}
        {tab === "Competitors" && <Competitors report={report} />}
        {tab === "Matrix" && <CompetitorMatrix report={report} />}
        {tab === "Blueprint" && <TechnicalBlueprint report={report} />}
        {tab === "Tech Stack" && <TechStack report={report} />}
        {tab === "MVP" && <MVP report={report} />}
        {tab === "Security" && <Security report={report} />}
        {tab === "Business" && <Business report={report} />}
        {tab === "Cost" && <CostEstimator report={report} />}
        {tab === "Investor" && <InvestorReadiness report={report} />}
        {tab === "Branding" && <Branding report={report} />}
        {tab === "Roadmap" && <Roadmap report={report} />}
        {tab === "GTM" && <GoToMarket report={report} />}
        {tab === "Pitch" && <Pitch report={report} />}
        {tab === "Deck" && <PitchDeck report={report} />}
        {tab === "Executive" && <ExecutiveSummary report={report} />}
      </div>
    </section>
  );
}