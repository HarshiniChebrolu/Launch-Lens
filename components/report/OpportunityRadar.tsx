import RadarChart from "@/components/charts/RadarChart";
import { StartupReport } from "@/types/report";

export default function OpportunityRadar({
  report,
}: {
  report: StartupReport;
}) {
  return (
    <div className="reportGrid">

      <div className="reportCard span2 radarHero">

        <span className="businessLabel">
          AI Opportunity Analysis
        </span>

        <h2>Startup Opportunity Radar</h2>

        <p>
          This radar is generated from AI validation,
          market research, competition,
          technology readiness,
          execution feasibility,
          scalability and revenue potential.
        </p>

      </div>

      <div className="reportCard span2">

        <RadarChart
          data={report.opportunityRadar}
        />

      </div>

      <Metric
        title="Market"
        value={report.opportunityRadar.market}
      />

      <Metric
        title="Innovation"
        value={report.opportunityRadar.innovation}
      />

      <Metric
        title="Scalability"
        value={report.opportunityRadar.scalability}
      />

      <Metric
        title="Competition"
        value={report.opportunityRadar.competition}
      />

      <Metric
        title="Execution"
        value={report.opportunityRadar.execution}
      />

      <Metric
        title="Revenue"
        value={report.opportunityRadar.revenue}
      />

      <Metric
        title="Technology"
        value={report.opportunityRadar.technology}
      />

    </div>
  );
}

function Metric({
  title,
  value,
}:{
  title:string;
  value:number;
}){

return(

<div className="metricDataCard">

<p>{title}</p>

<h2>{value}/100</h2>

<span>AI generated score</span>

</div>

)

}