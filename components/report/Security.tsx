import { StartupReport } from "@/types/report";
import { CheckCircle2 } from "lucide-react";

export default function Roadmap({ report }: { report: StartupReport }) {
  return (
    <div className="timelineWrap">
      {report.roadmap.map((phase, index) => (
        <div className="timelineItem" key={phase.phase}>
          <div className="timelineMarker">
            <CheckCircle2 size={22} />
          </div>

          <div className="timelineContent">
            <span>
              {phase.phase} • Step {index + 1}
            </span>

            <h2>{phase.title}</h2>

            <div className="timelineTasks">
              {phase.items.map((item) => (
                <p key={item}>• {item}</p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}