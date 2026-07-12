import { StartupReport } from "@/types/report";

export default function SWOT({ report }: { report: StartupReport }) {
  return (
    <div className="reportGrid">
      <List title="Strengths" items={report.swot.strengths} />
      <List title="Weaknesses" items={report.swot.weaknesses} />
      <List title="Opportunities" items={report.swot.opportunities} />
      <List title="Threats" items={report.swot.threats} />
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="reportCard">
      <h2>{title}</h2>
      {items.map((item) => (
        <p key={item}>• {item}</p>
      ))}
    </div>
  );
}