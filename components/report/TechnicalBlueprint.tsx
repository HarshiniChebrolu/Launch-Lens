import { StartupReport } from "@/types/report";

export default function TechnicalBlueprint({
  report,
}: {
  report: StartupReport;
}) {
  const b = report.technicalBlueprint;

  if (!b) {
    return (
      <div className="reportCard">
        <h2>Technical Blueprint</h2>
        <p>No technical blueprint was generated for this report.</p>
      </div>
    );
  }

  return (
    <div className="reportGrid">
      <div className="reportCard span2">
        <span className="businessLabel">Technical Blueprint</span>
        <h2>Build Architecture</h2>
        <p>This section explains how to technically build the product.</p>
      </div>

      <div className="reportCard span2">
        <h2>Architecture</h2>
        <p><b>Frontend:</b> {b.architecture?.frontend}</p>
        <p><b>Backend:</b> {b.architecture?.backend}</p>
        <p><b>Database:</b> {b.architecture?.database}</p>
        <p><b>Auth:</b> {b.architecture?.authentication}</p>
        <p><b>AI Layer:</b> {b.architecture?.aiLayer}</p>
        <p><b>Storage:</b> {b.architecture?.storage}</p>
        <p><b>Deployment:</b> {b.architecture?.deployment}</p>
      </div>

      <StringList title="Folder Structure" items={b.folderStructure} />

      <div className="reportCard span2">
        <h2>APIs & Integrations</h2>
        {(b.apis || []).map((api: any, index: number) => (
          <div className="blueprintPhase" key={index}>
            <h3>{api.endpoint || api.name || `API ${index + 1}`}</h3>
            <p>{api.description}</p>
            {api.payload && <p><b>Payload:</b> {api.payload}</p>}
            {api.auth && <p><b>Auth:</b> {api.auth}</p>}
          </div>
        ))}
      </div>

      <div className="reportCard span2">
        <h2>Database Tables</h2>
        {(b.databaseTables || []).map((table: any, index: number) => (
          <div className="blueprintPhase" key={index}>
            <h3>{table.name || table.tableName || `Table ${index + 1}`}</h3>

            {(table.fields || table.columns || []).map(
              (field: string, fieldIndex: number) => (
                <p key={fieldIndex}>• {field}</p>
              )
            )}
          </div>
        ))}
      </div>

      <div className="reportCard span2">
        <h2>Development Phases</h2>
        {(b.developmentPhases || []).map((phase: any, index: number) => (
          <div className="blueprintPhase" key={index}>
            <h3>{phase.phase || `Phase ${index + 1}`}</h3>

            {(phase.tasks || phase.items || []).map(
              (task: string, taskIndex: number) => (
                <p key={taskIndex}>• {task}</p>
              )
            )}
          </div>
        ))}
      </div>

      <div className="reportCard">
        <h2>Deployment Plan</h2>
        <p><b>Frontend:</b> {b.deploymentPlan?.frontend}</p>
        <p><b>Backend:</b> {b.deploymentPlan?.backend}</p>
        <p><b>Database:</b> {b.deploymentPlan?.database}</p>
        <p><b>Storage:</b> {b.deploymentPlan?.storage}</p>
      </div>

      <StringList title="Workflow" items={b.workflow} />
    </div>
  );
}

function StringList({
  title,
  items = [],
}: {
  title: string;
  items?: any[];
}) {
  return (
    <div className="reportCard">
      <h2>{title}</h2>

      {items.map((item, index) => (
        <p key={index}>• {typeof item === "string" ? item : JSON.stringify(item)}</p>
      ))}
    </div>
  );
}