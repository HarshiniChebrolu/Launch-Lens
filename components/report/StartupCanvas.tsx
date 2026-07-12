import { StartupReport } from "@/types/report";

export default function StartupCanvas({ report }: { report: StartupReport }) {
  const c = report.startupCanvas;

  return (
    <div className="canvasGrid">
      <CanvasBox title="Problem" items={c.problem} />
      <CanvasBox title="Solution" items={c.solution} />
      <CanvasBox title="Unique Value Proposition" text={c.uniqueValue} />
      <CanvasBox title="Unfair Advantage" text={c.unfairAdvantage} />
      <CanvasBox title="Customer Segments" items={c.customerSegments} />
      <CanvasBox title="Channels" items={c.channels} />
      <CanvasBox title="Revenue Streams" items={c.revenueStreams} />
      <CanvasBox title="Cost Structure" items={c.costStructure} />
      <CanvasBox title="Key Metrics" items={c.keyMetrics} />
    </div>
  );
}

function CanvasBox({
  title,
  items,
  text,
}: {
  title: string;
  items?: string[];
  text?: string;
}) {
  return (
    <div className="canvasBox">
      <h2>{title}</h2>

      {text && <p>{text}</p>}

      {items?.map((item) => (
        <p key={item}>• {item}</p>
      ))}
    </div>
  );
}