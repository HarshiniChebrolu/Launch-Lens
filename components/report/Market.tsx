import { StartupReport } from "@/types/report";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Market({ report }: { report: StartupReport }) {
  return (
    <div className="reportGrid">
      <div className="reportCard span2">
        <h2>Market Growth Signal</h2>
        <p>{report.market.insight}</p>

        <div className="chartBox">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={report.market.trends}>
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#06B6D4"
                fill="#4F46E5"
                fillOpacity={0.35}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="reportCard span2">
        <h2>Market Opportunities</h2>
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