import { StartupReport } from "@/types/report";

function StackSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="stackCard">
      <h3>{title}</h3>

      <div className="stackTags">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}

export default function TechStack({
  report,
}: {
  report: StartupReport;
}) {
  return (
    <div className="reportGrid">

      <div className="reportCard span2">
        <h2>Recommended Technology Stack</h2>

        <p>{report.techStack.reason}</p>
      </div>

      <StackSection
        title="Frontend"
        items={report.techStack.frontend}
      />

      <StackSection
        title="Backend"
        items={report.techStack.backend}
      />

      <StackSection
        title="Database"
        items={report.techStack.database}
      />

      <StackSection
        title="Artificial Intelligence"
        items={report.techStack.ai}
      />

      <StackSection
        title="Cloud"
        items={report.techStack.cloud}
      />

      <StackSection
        title="Integrations"
        items={report.techStack.integrations}
      />

      <StackSection
        title="DevOps"
        items={report.techStack.devops}
      />

    </div>
  );
}