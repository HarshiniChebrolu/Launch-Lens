"use client";

import { motion } from "framer-motion";
import { Lightbulb, Search, Brain, LineChart } from "lucide-react";

const steps = [
  {
    icon: <Lightbulb size={24} />,
    title: "Describe your idea",
    text: "Enter your startup name, problem, target users, industry, budget and goal.",
  },
  {
    icon: <Search size={24} />,
    title: "Research the market",
    text: "Launch Lens uses live web intelligence to gather competitors, trends and pricing signals.",
  },
  {
    icon: <Brain size={24} />,
    title: "AI builds the report",
    text: "Gemini combines your idea and research into a structured Startup Intelligence Report.",
  },
  {
    icon: <LineChart size={24} />,
    title: "Act on the blueprint",
    text: "Get MVP, roadmap, business strategy, security, pitch and launch recommendations.",
  },
];

export default function HowItWorks() {
  return (
    <section id="workflow" className="workflowSection">
      <div className="sectionHeader">
        <span>Workflow</span>
        <h2>From idea to launch blueprint in minutes.</h2>
        <p>
          The platform does not just generate text. It researches, reasons,
          structures and visualizes your startup plan.
        </p>
      </div>

      <div className="workflowLine">
        {steps.map((step, index) => (
          <motion.div
            className="workflowCard"
            key={step.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12 }}
            viewport={{ once: true }}
          >
            <div className="stepNumber">0{index + 1}</div>
            <div className="workflowIcon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}