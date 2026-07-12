import { StartupReport } from "@/types/report";

export default function InvestorReadiness({ report }: { report: StartupReport }) {
  return (
    <div className="validationPage">
      <div className="validationHero">
        <div>
          <span className="businessLabel">Investor readiness</span>
          <h2>{report.investorReadiness.score}/100</h2>
          <p>
            Stage: <b>{report.investorReadiness.stage}</b> • Funding Fit:{" "}
            <b>{report.investorReadiness.fundingFit}</b>
          </p>
        </div>

        <div className="validationCircle">
          {report.investorReadiness.score}
        </div>
      </div>

      <div className="reportGrid">
        <List title="Investor Strengths" items={report.investorReadiness.strengths} />
        <List title="Weaknesses" items={report.investorReadiness.weaknesses} />
        <List title="Investor Concerns" items={report.investorReadiness.investorConcerns} />
        <List title="Recommendations" items={report.investorReadiness.recommendations} />
      </div>
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