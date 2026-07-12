import {
  ArrowRight,
  FileText,
  Lightbulb,
  LineChart,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    label: "Ideas analyzed",
    value: "0",
    note: "Create your first blueprint",
  },
  {
    label: "Market reports",
    value: "0",
    note: "Generated after analysis",
  },
  {
    label: "Avg readiness",
    value: "--",
    note: "No reports yet",
  },
  {
    label: "Saved pitches",
    value: "0",
    note: "Pitch Studio awaits",
  },
];

const actions = [
  {
    icon: <Lightbulb size={22} />,
    title: "Create New Idea",
    text: "Start with your startup concept and generate an intelligence report.",
    href: "#",
  },
  {
    icon: <LineChart size={22} />,
    title: "Market Research",
    text: "Analyze trends, competitors, pricing and growth signals.",
    href: "#",
  },
  {
    icon: <Rocket size={22} />,
    title: "Pitch Studio",
    text: "Create investor, hackathon and 30-second startup pitches.",
    href: "#",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Security Lens",
    text: "Understand data risks, compliance and privacy needs for your idea.",
    href: "#",
  },
];

export default function DashboardHome() {
  return (
    <section className="dashboardHome">
      <div className="welcomeGrid">
        <div className="welcomeCard">
          <span className="welcomeBadge">
            <Sparkles size={15} />
            Launch Lens Copilot
          </span>

          <h2>Good to see you, Founder 👋</h2>

          <p>
            You have not generated a startup intelligence report yet. Start with
            one idea, and Launch Lens will research the market, competitors,
            business model, MVP, roadmap, security and pitch.
          </p>

          <a href="#" className="welcomeButton">
            Generate your first blueprint
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="insightCard">
          <div className="insightTop">
            <TrendingUp size={22} />
            <span>Workspace Health</span>
          </div>

          <h3>No reports yet</h3>

          <p>
            Once you analyze an idea, this panel will show your strongest
            opportunity, weakest risk area and next recommended action.
          </p>

          <div className="healthBars">
            <span style={{ width: "0%" }}></span>
          </div>
        </div>
      </div>

      <div className="statsGrid">
        {stats.map((item) => (
          <div className="statCard" key={item.label}>
            <p>{item.label}</p>
            <h3>{item.value}</h3>
            <span>{item.note}</span>
          </div>
        ))}
      </div>

      <div className="sectionTitleRow">
        <div>
          <span className="eyebrowSmall">
            <FileText size={14} />
            Workspace actions
          </span>
          <h2>What would you like to build today?</h2>
        </div>
      </div>

      <div className="actionGrid">
        {actions.map((item) => (
          <a href={item.href} className="actionCard" key={item.title}>
            <div className="actionIcon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <span>
              Open
              <ArrowRight size={15} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}