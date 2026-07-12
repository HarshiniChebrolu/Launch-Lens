export default function HistoryAnalytics({ reports }: { reports: any[] }) {
  const total = reports.length;

  const favoriteCount = reports.filter((r) => r.favorite).length;

  const avgValidation =
    reports.length === 0
      ? "--"
      : Math.round(
          reports.reduce(
            (sum, r) => sum + (r.report?.validation?.overallScore || 0),
            0
          ) / reports.length
        );

  const lowRisk = reports.filter(
    (r) => String(r.report?.security?.riskLevel || "").toLowerCase() === "low"
  ).length;

  return (
    <div className="historyAnalytics">
      <div className="analyticsCard">
        <span>Total Reports</span>
        <h2>{total}</h2>
        <p>Startup intelligence reports saved</p>
      </div>

      <div className="analyticsCard">
        <span>Favorites</span>
        <h2>{favoriteCount}</h2>
        <p>Pinned reports for quick access</p>
      </div>

      <div className="analyticsCard">
        <span>Avg Validation</span>
        <h2>{avgValidation}</h2>
        <p>Average startup readiness score</p>
      </div>

      <div className="analyticsCard">
        <span>Low Risk</span>
        <h2>{lowRisk}</h2>
        <p>Reports with lower security risk</p>
      </div>
    </div>
  );
}