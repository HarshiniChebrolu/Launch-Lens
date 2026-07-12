"use client";

import { useEffect, useState } from "react";
import Sidebar, { DashboardMode } from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import IdeaWizard from "@/components/dashboard/wizard/IdeaWizard";
import ReportShell, { ReportTab } from "@/components/report/ReportShell";
import ReportsHistory from "@/components/dashboard/history/ReportsHistory";
import SettingsPage from "@/components/dashboard/SettingsPage";
import { StartupReport } from "@/types/report";
import { getReportsFromSupabase } from "@/lib/reports-db";
import ResearchPapersPage from "@/components/dashboard/ResearchPapersPage";
export default function DashboardClient() {
  const [mode, setMode] = useState<DashboardMode>("history");
  const [report, setReport] = useState<StartupReport | null>(null);
  const [activeReportTab, setActiveReportTab] = useState<ReportTab>("Overview");
  const [savedReports, setSavedReports] = useState<any[]>([]);

  async function loadReports() {
    const data = await getReportsFromSupabase();
    setSavedReports(data);
  }

  useEffect(() => {
    loadReports();
  }, []);

  function openReport(selectedReport: StartupReport, tab: ReportTab = "Overview") {
    setReport(selectedReport);
    setActiveReportTab(tab);
    setMode("history");
  }

  function openLatest(tab: ReportTab) {
    const latest = savedReports[0]?.report;

    if (latest) {
      openReport(latest, tab);
    } else {
      setMode("wizard");
    }
  }
 const latestStartupIdea = savedReports[0]?.idea || null;
  return (
    <main className="dashboardShell">
      <Sidebar
        mode={mode}
        setMode={(nextMode) => {
          if (nextMode === "market") return openLatest("Market");
          if (nextMode === "competitors") return openLatest("Competitors");
          if (nextMode === "blueprint") return openLatest("MVP");
          if (nextMode === "pitch") return openLatest("Pitch");

          setReport(null);
          setMode(nextMode);
        }}
      />

      <section className="dashboardMain">
        <Topbar />

        {mode === "wizard" && (
          <IdeaWizard
            onReportReady={(newReport) => {
              openReport(newReport, "Overview");
              loadReports();
            }}
          />
        )}

        {mode === "history" && report && (
          <ReportShell
            report={report}
            initialTab={activeReportTab}
            onNewIdea={() => {
              setReport(null);
              setMode("wizard");
            }}
          />
        )}

        {mode === "history" && !report && (
          <ReportsHistory
            reports={savedReports}
            onOpen={(r) => openReport(r, "Overview")}
            onCreate={() => setMode("wizard")}
            refresh={loadReports}
          />
        )}

        {mode === "settings" && <SettingsPage />}
        {mode === "research" && (
  <ResearchPapersPage startupIdea={latestStartupIdea} />
)}
      </section>
    </main>
  );
}