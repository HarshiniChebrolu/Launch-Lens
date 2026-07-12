import { StartupReport } from "@/types/report";

export default function Branding({
  report,
}: {
  report: StartupReport;
}) {
  const b = report.branding;

  return (
    <div className="reportGrid">

      <div className="reportCard span2 brandingHero">

        <span className="businessLabel">
          Startup Branding
        </span>

        <h2>{b.startupName}</h2>

        <p>{b.tagline}</p>

      </div>

      <ColorCard
        title="Primary"
        color={b.colorPalette.primary}
      />

      <ColorCard
        title="Secondary"
        color={b.colorPalette.secondary}
      />

      <ColorCard
        title="Accent"
        color={b.colorPalette.accent}
      />

      <div className="reportCard">
        <h2>Brand Personality</h2>
        <p>{b.brandPersonality}</p>
      </div>

      <div className="reportCard">
        <h2>Typography</h2>

        <p>
          <strong>Heading:</strong> {b.typography.heading}
        </p>

        <p>
          <strong>Body:</strong> {b.typography.body}
        </p>

      </div>

      <div className="reportCard span2">
        <h2>Logo Prompt</h2>
        <p>{b.logoPrompt}</p>
      </div>

      <div className="reportCard">
        <h2>Suggested Domains</h2>

        {b.domainSuggestions.map((d) => (
          <p key={d}>🌐 {d}</p>
        ))}

      </div>

      <div className="reportCard">
        <h2>Social Handles</h2>

        {b.socialHandles.map((s) => (
          <p key={s}>@{s}</p>
        ))}

      </div>

    </div>
  );
}

function ColorCard({
  title,
  color,
}:{
  title:string;
  color:string;
}){

return(

<div className="reportCard">

<h2>{title}</h2>

<div
className="brandColor"
style={{background:color}}
/>

<p>{color}</p>

</div>

)

}