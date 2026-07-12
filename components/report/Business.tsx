import { StartupReport } from "@/types/report";
import BusinessBarChart from "@/components/charts/BusinessBarChart";
import MetricCard from "@/components/charts/MetricCard";

export default function Business({ report }: { report: StartupReport }) {
  return (
    <div className="reportGrid">
      <div className="reportCard span2 businessHero">
        <div>
          <span className="businessLabel">Dynamic business intelligence</span>
          <h2>{report.business.primaryModel}</h2>
          <p>{report.business.researchBasis}</p>
        </div>
      </div>

      <MetricCard
        label="Profit outlook"
        value={report.business.profitOutlook}
        note="Estimated from idea, user segment and business model"
      />

      <MetricCard
        label="Cost risk"
        value={report.business.costRisk}
        note="Based on build complexity and operating cost"
      />

      <MetricCard
        label="Break-even"
        value={report.business.breakEven}
        note="Early estimate, should be validated with real users"
      />

      <div className="reportCard">
        <h2>Revenue Streams</h2>
        {report.business.revenueStreams.map((item) => (
          <p key={item}>💰 {item}</p>
        ))}
      </div>

      <div className="reportCard">
        <h2>Pricing Strategy</h2>
        {report.business.pricingStrategy.map((item) => (
          <p key={item}>📌 {item}</p>
        ))}
      </div>

      <div className="reportCard span2">
        <h2>Business Strength Graph</h2>
        <p>
          This graph is generated from the business intelligence data returned
          for this startup idea.
        </p>

        <BusinessBarChart data={report.business.chart} />
      </div>
    </div>
  );
}