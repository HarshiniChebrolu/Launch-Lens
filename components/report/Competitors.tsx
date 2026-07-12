import { StartupReport } from "@/types/report";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Competitors({ report }: { report: StartupReport }) {
  const chartData = report.competitors.map((item, index) => ({
    name: item.name,
    value: 80 - index * 8,
  }));

  return (
    <div className="reportGrid">
      <div className="reportCard span2">
        <h2>Competitor Positioning</h2>
        <p>
          These competitors and alternatives are generated from the AI research
          context and used to identify positioning gaps.
        </p>

        <div className="chartBox">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="value" fill="#06B6D4" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {report.competitors.map((item) => (
        <div className="reportCard" key={item.name}>
          <h2>{item.name}</h2>
          <p>
            <b>Strength:</b> {item.strength}
          </p>
          <p>
            <b>Weakness:</b> {item.weakness}
          </p>
          <p className="cyanText">
            <b>Gap:</b> {item.gap}
          </p>
        </div>
      ))}
    </div>
  );
}