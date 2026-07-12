"use client";

import { useMemo, useState } from "react";

export default function CompareReports({ reports }: { reports: any[] }) {
  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");

  const left = useMemo(
    () => reports.find((r) => r.id === leftId),
    [reports, leftId]
  );

  const right = useMemo(
    () => reports.find((r) => r.id === rightId),
    [reports, rightId]
  );

  if (reports.length < 2) {
    return (
      <div className="reportCard">
        <h2>Compare Reports</h2>
        <p>Generate at least two reports to compare ideas side by side.</p>
      </div>
    );
  }

  return (
    <div className="compareBox">
      <div className="compareSelectors">
        <select value={leftId} onChange={(e) => setLeftId(e.target.value)}>
          <option value="">Choose first report</option>
          {reports.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>

        <select value={rightId} onChange={(e) => setRightId(e.target.value)}>
          <option value="">Choose second report</option>
          {reports.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
      </div>

      {left && right && (
        <div className="compareGrid">
          <CompareCard item={left} />
          <CompareCard item={right} />
        </div>
      )}
    </div>
  );
}

function CompareCard({ item }: { item: any }) {
  const report = item.report;

  return (
    <div className="compareCard">
      <span className="businessLabel">{item.idea?.industry || "Startup"}</span>
      <h2>{item.title}</h2>

      <p>
        <b>Security:</b> {report?.security?.riskLevel || "Unknown"}
      </p>

      <p>
        <b>Business:</b> {report?.business?.profitOutlook || "Unknown"}
      </p>

      <p>
        <b>Break-even:</b> {report?.business?.breakEven || "Unknown"}
      </p>

      <p>
        <b>Competitors:</b> {report?.competitors?.length || 0}
      </p>

      <p>
        <b>Readiness:</b>{" "}
        {report?.validation?.readiness || "Validation not available"}
      </p>
    </div>
  );
}