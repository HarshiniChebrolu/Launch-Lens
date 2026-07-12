import { StartupReport } from "@/types/report";
import BusinessBarChart from "@/components/charts/BusinessBarChart";

export default function CostEstimator({ report }: { report: StartupReport }) {
  return (
    <div className="reportGrid">
      <div className="reportCard span2">
        <span className="businessLabel">Dynamic cost estimation</span>
        <h2>Estimated Build & Operating Cost</h2>
        <p>
          These estimates are generated from the startup idea, MVP scope,
          recommended tech stack, AI usage, cloud needs, and business model.
        </p>
      </div>

      <CostCard title="Development Cost" value={report.costEstimator.developmentCost} />
      <CostCard title="Monthly Operating Cost" value={report.costEstimator.monthlyOperatingCost} />
      <CostCard title="AI/API Cost" value={report.costEstimator.aiApiCost} />
      <CostCard title="Cloud Cost" value={report.costEstimator.cloudCost} />
      <CostCard title="Time to MVP" value={report.costEstimator.timeToMvp} />
      <CostCard title="Break-even Estimate" value={report.costEstimator.breakEvenEstimate} />

      <div className="reportCard">
        <h2>Team Needed</h2>
        {report.costEstimator.teamNeeded.map((item) => (
          <p key={item}>👤 {item}</p>
        ))}
      </div>

      <div className="reportCard">
        <h2>Cost Risks</h2>
        {report.costEstimator.costRisks.map((item) => (
          <p key={item}>⚠️ {item}</p>
        ))}
      </div>

      <div className="reportCard span2">
        <h2>Cost Distribution</h2>
        <BusinessBarChart data={report.costEstimator.chart} />
      </div>

      <div className="reportCard span2">
        <h2>How to Reduce Cost</h2>
        {report.costEstimator.savingSuggestions.map((item) => (
          <p key={item}>💡 {item}</p>
        ))}
      </div>
    </div>
  );
}

function CostCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="metricDataCard">
      <p>{title}</p>
      <h2>{value}</h2>
      <span>Generated from MVP scope and technical complexity</span>
    </div>
  );
}