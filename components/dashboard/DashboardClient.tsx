"use client";

import { useEffect, useState } from "react";
import Sidebar, { DashboardMode } from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import IdeaWizard from "@/components/dashboard/wizard/IdeaWizard";
import ReportShell, { ReportTab } from "@/components/report/ReportShell";
import ReportsHistory from "@/components/dashboard/history/ReportsHistory";
import DashboardWorkspace from "@/components/dashboard/DashboardWorkspace";
import SettingsPage from "@/components/dashboard/SettingsPage";
import { StartupReport } from "@/types/report";
import { getReportsFromSupabase } from "@/lib/reports-db";
import ResearchPapersPage from "@/components/dashboard/ResearchPapersPage";
import FloatingCopilot from "@/components/copilot/FloatingCopilot";
import { Compass, PlusCircle } from "lucide-react";

export default function DashboardClient() {
  const [mode, setMode] = useState<DashboardMode>("dashboard");
  const [report, setReport] = useState<StartupReport | null>(null);
  const [activeReportTab, setActiveReportTab] = useState<ReportTab>("Overview");
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [prefilledIdea, setPrefilledIdea] = useState<string>("");

  async function loadReports() {
    try {
      setLoading(true);
      const data = await getReportsFromSupabase();
      setSavedReports(data || []);
    } catch (e) {
      console.warn("Load reports warning:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  function openReport(selectedReport: StartupReport, tab: ReportTab = "Overview") {
    setReport(selectedReport);
    setActiveReportTab(tab);
    setMode("reports");
  }

  function handleSidebarNavigation(nextMode: DashboardMode) {
    setMode(nextMode);

    if (nextMode === "market") {
      setActiveReportTab("Market");
      setReport(savedReports[0]?.report || null);
    } else if (nextMode === "competitors") {
      setActiveReportTab("Competitors");
      setReport(savedReports[0]?.report || null);
    } else if (nextMode === "blueprint") {
      setActiveReportTab("Blueprint");
      setReport(savedReports[0]?.report || null);
    } else if (nextMode === "pitch") {
      setActiveReportTab("Pitch");
      setReport(savedReports[0]?.report || null);
    } else if (nextMode === "dashboard") {
      setReport(null);
    } else if (nextMode === "reports" || nextMode === "history") {
      setReport(null);
    } else if (nextMode === "wizard") {
      setReport(null);
    }
  }

  const latestStartupIdea = savedReports[0]?.idea || null;
  const isDirectReportSection =
    mode === "market" || mode === "competitors" || mode === "blueprint" || mode === "pitch";
  const activeReport = report || savedReports[0]?.report || null;

  return (
    <main className="dashboardShell">
      {/* 1. Standard Sidebar Navigation Element (~268px on desktop) */}
      <Sidebar
        mode={mode}
        setMode={handleSidebarNavigation}
      />

      {/* 2. Main Central Workspace */}
      <section className="dashboardMain">
        <Topbar />

        {/* Dynamic View Container */}
        <div className="w-full min-w-0">
          {/* New Idea Wizard Experience */}
          {mode === "wizard" && (
            <IdeaWizard
              initialIdea={prefilledIdea ? { idea: prefilledIdea } as any : undefined}
              onReportReady={(newReport) => {
                openReport(newReport, "Overview");
                loadReports();
              }}
            />
          )}

          {/* Active Single Report View */}
          {(mode === "reports" || mode === "history") && report && (
            <ReportShell
              report={report}
              initialTab={activeReportTab}
              onNewIdea={() => {
                setReport(null);
                setPrefilledIdea("");
                setMode("wizard");
              }}
            />
          )}

          {/* Dedicated Interactive Dashboard Workspace */}
          {mode === "dashboard" && !report && (
            <DashboardWorkspace
              reports={savedReports}
              onOpenReport={(r, tab) => openReport(r, tab || "Overview")}
              onCreateNewIdea={(idea) => {
                setPrefilledIdea(idea || "");
                setMode("wizard");
              }}
              onNavigateMode={(m) => handleSidebarNavigation(m)}
            />
          )}

          {/* Reports History Library View */}
          {(mode === "reports" || mode === "history") && !report && (
            <ReportsHistory
              reports={savedReports}
              onOpen={(r) => openReport(r, "Overview")}
              onCreate={() => {
                setPrefilledIdea("");
                setMode("wizard");
              }}
              refresh={loadReports}
            />
          )}

          {/* Direct Section Workspace (Market, Competitors, Blueprint, Pitch) */}
          {isDirectReportSection && (
            activeReport ? (
              <ReportShell
                report={activeReport}
                initialTab={activeReportTab}
                onNewIdea={() => {
                  setReport(null);
                  setPrefilledIdea("");
                  setMode("wizard");
                }}
              />
            ) : (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  No Active Startup Report Yet
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Generate an intelligence dossier with our AI Idea Workspace to view detailed {mode} signals and forecasts.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPrefilledIdea("");
                    setMode("wizard");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:from-cyan-400 hover:to-indigo-500 transition-all hover:scale-[1.02]"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Your First Idea</span>
                </button>
              </div>
            )
          )}

          {/* Settings Page */}
          {mode === "settings" && <SettingsPage />}

          {/* Research Papers Page (Strictly Preserved API) */}
          {mode === "research" && (
            <ResearchPapersPage startupIdea={latestStartupIdea} />
          )}
        </div>
      </section>

      {/* 3. Floating AI Copilot Launcher & Slide-over Drawer */}
      <FloatingCopilot
        report={activeReport}
        activeIdea={latestStartupIdea}
      />
    </main>
  );
}