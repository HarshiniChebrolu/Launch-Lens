"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import WizardProgress from "./WizardProgress";
import LoadingEngine from "./LoadingEngine";
import { StartupReport } from "@/types/report";

type IdeaData = {
  idea: string;
  users: string;
  problem: string;
  industry: string;
  budget: string;
  goal: string;
};

const emptyIdea: IdeaData = {
  idea: "",
  users: "",
  problem: "",
  industry: "",
  budget: "",
  goal: "",
};

const industries = [
  "AI SaaS",
  "EdTech",
  "HealthTech",
  "FinTech",
  "RetailTech",
  "Agriculture",
  "Productivity",
  "Women Safety",
];

const goals = ["Hackathon", "Startup", "College Project", "MVP", "Business"];

export default function IdeaWizard({
  onReportReady,
}: {
  onReportReady: (report: StartupReport) => void;
}) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IdeaData>(emptyIdea);
  const [error, setError] = useState("");

  function update(key: keyof IdeaData, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function generate() {
  setError("");
  setLoading(true);

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!json.success) {
      throw new Error(json.error || "Failed to generate report");
    }

    const { saveReportToSupabase } = await import("@/lib/reports-db");
    await saveReportToSupabase(data, json.report);

    onReportReady(json.report);
  } catch {
    setError("Could not generate report. Please check API keys or try again.");
  } finally {
    setLoading(false);
  }
}

  if (loading) return <LoadingEngine />;

  return (
    <section className="wizardPage">
      <div className="wizardHeader">
        <span className="wizardBadge">
          <Sparkles size={15} />
          Guided Startup Wizard
        </span>

        <h1>Let’s understand what you want to build.</h1>
        <p>
          Answer only what you know. Launch Lens will research and structure the
          rest.
        </p>
      </div>

      <WizardProgress step={step} />

      <div className="wizardCard">
        {step === 0 && (
          <div className="wizardScreen">
            <h2>What are you building?</h2>
            <textarea
              value={data.idea}
              onChange={(e) => update("idea", e.target.value)}
              placeholder="Ex: An AI platform that helps students validate startup ideas before building them..."
            />
          </div>
        )}

        {step === 1 && (
          <div className="wizardScreen">
            <h2>Who are your target users?</h2>
            <input
              value={data.users}
              onChange={(e) => update("users", e.target.value)}
              placeholder="Ex: college students, founders, small businesses..."
            />
          </div>
        )}

        {step === 2 && (
          <div className="wizardScreen">
            <h2>What problem are you solving?</h2>
            <textarea
              value={data.problem}
              onChange={(e) => update("problem", e.target.value)}
              placeholder="Describe the pain point clearly..."
            />
          </div>
        )}

        {step === 3 && (
          <div className="wizardScreen">
            <h2>Choose your industry</h2>
            <div className="choiceGrid">
              {industries.map((item) => (
                <button
                  key={item}
                  className={data.industry === item ? "choice active" : "choice"}
                  onClick={() => update("industry", item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="wizardScreen">
            <h2>What is your budget or build constraint?</h2>
            <input
              value={data.budget}
              onChange={(e) => update("budget", e.target.value)}
              placeholder="Ex: Free tools only, ₹5000, low MVP budget..."
            />
          </div>
        )}

        {step === 5 && (
          <div className="wizardScreen">
            <h2>What is your goal?</h2>
            <div className="choiceGrid">
              {goals.map((item) => (
                <button
                  key={item}
                  className={data.goal === item ? "choice active" : "choice"}
                  onClick={() => update("goal", item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p className="wizardError">{error}</p>}

        <div className="wizardActions">
          <button
            className="wizardBtn secondary"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {step < 5 ? (
            <button className="wizardBtn primary" onClick={() => setStep(step + 1)}>
              Next
              <ArrowRight size={18} />
            </button>
          ) : (
            <button className="wizardBtn primary" onClick={generate}>
              Generate Report
              <Sparkles size={18} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}