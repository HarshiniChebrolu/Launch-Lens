"use client";

import { motion } from "framer-motion";
import {
  Search,
  BarChart3,
  Users,
  ShieldCheck,
  Route,
  Presentation,
} from "lucide-react";

const features = [
  {
    icon: <Search size={24} />,
    title: "Live Market Research",
    text: "Uses web intelligence to discover market signals, trends, competitors and current opportunities.",
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Business Intelligence",
    text: "Generates dynamic pricing, revenue streams, cost risks and growth outlook for each startup idea.",
  },
  {
    icon: <Users size={24} />,
    title: "Customer Personas",
    text: "Identifies target users, their pain points, needs and why they would actually use the product.",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Startup-Specific Security",
    text: "Analyzes privacy risks, compliance needs and security controls based on the startup domain.",
  },
  {
    icon: <Route size={24} />,
    title: "Dynamic MVP Roadmap",
    text: "Creates a practical MVP and launch roadmap that changes based on the idea, industry and users.",
  },
  {
    icon: <Presentation size={24} />,
    title: "Pitch Studio",
    text: "Creates 30-second, investor and hackathon pitches with expected judge questions and answers.",
  },
];

export default function Features() {
  return (
    <section id="features" className="featuresSection">
      <div className="sectionHeader">
        <span>Powerful modules</span>
        <h2>Everything a founder needs before building.</h2>
        <p>
          Launch Lens turns scattered research into one structured startup
          intelligence report.
        </p>
      </div>

      <div className="featuresGrid">
        {features.map((item, index) => (
          <motion.div
            className="featureCard"
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            viewport={{ once: true }}
          >
            <div className="featureIcon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}