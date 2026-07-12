import { StartupReport } from "@/types/report";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Business({ report }: { report: StartupReport }) {
  return (
    <div className="reportGrid">
      <div className="reportCard">
        <h2>Primary Business Model</h2>
        <p>{report.business.primaryModel}</p>

        <div className="businessMini">
          <span>Profit outlook: {report.business.profitOutlook}</span>
          <span>Cost risk: {report.business.costRisk}</span>
          <span>Break-even: {report.business.breakEven}</span>
        </div>
      </div>

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
        <div className="chartBox">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={report.business.chart}>
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="value" fill="#7C3AED" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mutedText">{report.business.researchBasis}</p>
      </div>
    </div>
  );
}