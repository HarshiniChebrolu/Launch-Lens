import { StartupReport } from "@/types/report";

export default function GoToMarket({ report }: { report: StartupReport }) {
  const gtm = report.goToMarket;

  return (
    <div className="reportGrid">
      <div className="reportCard span2">
        <span className="businessLabel">Go-To-Market Strategy</span>
        <h2>{gtm.targetBeachhead}</h2>
        <p>
          A focused launch strategy generated from the target users, market,
          competitors, business model and startup stage.
        </p>
      </div>

      <List title="Launch Channels" items={gtm.launchChannels} />
      <List title="First 100 Users" items={gtm.first100Users} />
      <List title="Marketing Angles" items={gtm.marketingAngles} />
      <List title="Partnerships" items={gtm.partnerships} />
      <List title="Growth Loops" items={gtm.growthLoops} />
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