"use client";

import { useEffect, useState } from "react";
import { StartupReport } from "@/types/report";

import ExecutiveSummary from "./ExecutiveSummary";
import Overview from "./Overview";
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
import CopilotPanel from "@/components/copilot/CopilotPanel";

export type ReportTab =
  | "Executive"
  | "Overview"
  | "Validation"
  | "Market"
  | "Competitors"
  | "Business"
  | "MVP"
  | "Security"
  | "SWOT"
  | "Pitch"
  | "Roadmap"
  | "Tech Stack"
  | "Cost"
  | "Investor"
  | "Blueprint"
  | "Radar"
  | "Deck"
  | "Branding"
  | "Matrix"
  | "GTM";

const tabs: ReportTab[] = [
  "Overview",
  "Validation",
  "Market",
  "Competitors",
  "Business",
  "MVP",
  "Security",
  "SWOT",
  "Pitch",
  "Roadmap",
  "Tech Stack",
  "Cost",
  "Investor",
  "Blueprint",
  "Radar",
  "Deck",
  "Branding",
  "Matrix",
  "GTM",
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

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);
  function exportReport() {
    window.print();
  }

  return (
    <section className="reportPage">
      <div className="reportHeader">
        <div>
          <span className="wizardBadge">Startup Intelligence Report</span>
          <h1>{report.title}</h1>
          <p>{report.summary}</p>
        </div>

        <div className="reportHeaderActions">
          <button className="wizardBtn secondary" onClick={exportReport}>
            Export PDF
          </button>

          <button className="wizardBtn primary" onClick={onNewIdea}>
            New Idea
          </button>
        </div>
      </div>

      <div className="reportSimpleNav">
        <button
          className={tab === "Executive" ? "active" : ""}
          onClick={() => setTab("Executive")}
        >
          Executive Summary
        </button>

        <select
          value={tab}
          onChange={(e) => setTab(e.target.value as ReportTab)}
        >
          <option value="Executive">Features</option>
          {tabs.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="reportWithCopilot">
        <div>
          {tab === "Executive" && <ExecutiveSummary report={report} />}
          {tab === "Overview" && <Overview report={report} />}
          {tab === "Validation" && <Validation report={report} />}
          {tab === "Market" && <Market report={report} />}
          {tab === "Competitors" && <Competitors report={report} />}
          {tab === "Business" && <Business report={report} />}
          {tab === "MVP" && <MVP report={report} />}
          {tab === "Security" && <Security report={report} />}
          {tab === "SWOT" && <SWOT report={report} />}
          {tab === "Pitch" && <Pitch report={report} />}
          {tab === "Roadmap" && <Roadmap report={report} />}
          {tab === "Tech Stack" && <TechStack report={report} />}
          {tab === "Cost" && <CostEstimator report={report} />}
          {tab === "Investor" && <InvestorReadiness report={report} />}
          {tab === "Blueprint" && <TechnicalBlueprint report={report} />}
          {tab === "Radar" && <OpportunityRadar report={report} />}
          {tab === "Deck" && <PitchDeck report={report} />}
          {tab === "Branding" && <Branding report={report} />}
          {tab === "Matrix" && <CompetitorMatrix report={report} />}
          {tab === "GTM" && <GoToMarket report={report} />}
        </div>

        <CopilotPanel report={report} />
      </div>
    </section>
  );
}