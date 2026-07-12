import { StartupReport } from "@/types/report";

export default function ExecutiveSummary({
  report,
}: {
  report: StartupReport;
}) {
  const e = report.executiveSummary;

  return (
    <div className="reportGrid">

      <div className="reportCard span2 executiveHero">

        <span className="businessLabel">
          Executive Summary
        </span>

        <h2>{e.oneLineSummary}</h2>

        <p>
          Startup Stage:
          <strong> {e.startupStage}</strong>
        </p>

      </div>

      <div className="reportCard">
        <h2>Biggest Strength</h2>
        <p>{e.biggestStrength}</p>
      </div>

      <div className="reportCard">
        <h2>Biggest Risk</h2>
        <p>{e.biggestRisk}</p>
      </div>

      <Checklist
        title="Next 30 Days"
        items={e.next30Days}
      />

      <Checklist
        title="Next 90 Days"
        items={e.next90Days}
      />

      <Checklist
        title="Founder Checklist"
        items={e.founderChecklist}
      />

    </div>
  );
}

function Checklist({
  title,
  items,
}:{
  title:string;
  items:string[];
}){

return(

<div className="reportCard">

<h2>{title}</h2>

{items.map(item=>(
<p key={item}>✅ {item}</p>
))}

</div>

)

}