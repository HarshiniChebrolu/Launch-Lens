import { StartupReport } from "@/types/report";

export default function CompetitorMatrix({ report }: { report: StartupReport }) {
  const matrix = report.competitorMatrix;

  return (
    <div className="matrixWrap">
      <div className="reportCard">
        <span className="businessLabel">Competitive intelligence</span>
        <h2>Feature Comparison Matrix</h2>
        <p>
          This matrix compares your idea against competitors based on research
          and positioning gaps.
        </p>
      </div>

      <div className="matrixTable">
        <div className="matrixRow matrixHead">
          <div>Feature</div>
          {matrix.competitors.map((c) => (
            <div key={c.name}>{c.name}</div>
          ))}
        </div>

        {matrix.features.map((feature, rowIndex) => (
          <div className="matrixRow" key={feature}>
            <div>{feature}</div>
            {matrix.competitors.map((c) => (
              <div key={c.name + feature}>{c.values[rowIndex] || "—"}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}