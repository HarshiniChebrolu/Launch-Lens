import { Sparkles } from "lucide-react";

export default function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="historyEmpty">
      <Sparkles size={38} />
      <h2>No startup reports yet</h2>
      <p>Create your first Startup Intelligence Report and it will appear here.</p>
      <button onClick={onCreate} className="wizardBtn primary">
        Generate First Report
      </button>
    </div>
  );
}