import { StartupReport } from "@/types/report";
import GrowthLineChart from "@/components/charts/GrowthLineChart";
import MetricCard from "@/components/charts/MetricCard";

export default function Overview({ report }: { report: StartupReport }) {
  return (
    <div className="reportGrid">
      <div className="reportCard span2 overviewHero">
        <span className="businessLabel">Executive summary</span>
        <h2>{report.title}</h2>
        <p>{report.summary}</p>
      </div>

      <MetricCard
        label="Market signal"
        value="Live"
        note="Driven by AI + research context"
      />

      <MetricCard
        label="Competitors found"
        value={String(report.competitors.length)}
        note="Used to identify positioning gaps"
      />

      <MetricCard
        label="Security risk"
        value={report.security.riskLevel}
        note="Specific to this startup domain"
      />

      <div className="reportCard span2">
        <h2>Market Growth Trend</h2>
        <p>{report.market.insight}</p>

        <GrowthLineChart data={report.market.trends} />
      </div>

      <div className="reportCard span2">
        <h2>Top Opportunities</h2>
        <div className="opportunityGrid">
          {report.market.opportunities.map((item) => (
            <div className="opportunityCard" key={item}>
              <span>Opportunity</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}