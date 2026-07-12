import { StartupReport } from "@/types/report";

export default function Roadmap({ report }: { report: StartupReport }) {
  return (
    <div className="roadmapList">
      {report.roadmap.map((phase) => (
        <div className="roadmapItem" key={phase.phase}>
          <span>{phase.phase}</span>
          <h2>{phase.title}</h2>
          {phase.items.map((item) => (
            <p key={item}>• {item}</p>
          ))}
        </div>
      ))}
    </div>
  );
}