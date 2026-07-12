import { StartupReport } from "@/types/report";

export default function Validation({ report }: { report: StartupReport }) {
  const validation = report.validation;

  if (!validation) {
    return (
      <div className="reportCard">
        <h2>Validation not available</h2>
        <p>
          Generate a new report with the latest intelligence engine to see
          validation scores.
        </p>
      </div>
    );
  }

  return (
    <div className="validationPage">
      <div className="validationHero">
        <div>
          <span className="businessLabel">Launch Lens Validation</span>
          <h2>{validation.overallScore}/100</h2>
          <p>
            Readiness: <b>{validation.readiness}</b> • Confidence:{" "}
            <b>{validation.confidence}</b>
          </p>
        </div>

        <div className="validationCircle">
          {validation.overallScore}
        </div>
      </div>

      <div className="validationGrid">
        {validation.factors.map((item) => (
          <div className="validationCard" key={item.factor}>
            <div className="validationTop">
              <h3>{item.factor}</h3>
              <strong>{item.score}</strong>
            </div>

            <div className="validationBar">
              <span style={{ width: `${item.score}%` }}></span>
            </div>

            <p>{item.reason}</p>

            <div className="improveBox">
              <b>Improve:</b> {item.improvement}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}