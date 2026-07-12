"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  ShieldCheck,
  Briefcase,
  Rocket,
  Brain,
} from "lucide-react";

export default function LivePreview() {
  return (
    <section id="preview" className="previewSection">

      <div className="sectionHeader">

        <span>Platform Preview</span>

        <h2>Everything generated in one intelligent dashboard.</h2>

        <p>
          Every report is generated uniquely using Gemini AI +
          Tavily Research. Nothing is manually written.
        </p>

      </div>

      <motion.div
        className="previewWindow"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >

        <div className="windowHeader">

          <div className="dots">

            <span></span>

            <span></span>

            <span></span>

          </div>

          <h4>Launch Lens Intelligence Dashboard</h4>

        </div>

        <div className="dashboardGrid">

          <div className="metricCard">

            <TrendingUp />

            <h3>Market Growth</h3>

            <h2>18.6%</h2>

            <p>Detected from live research</p>

          </div>

          <div className="metricCard">

            <Users />

            <h3>Competitors</h3>

            <h2>12</h2>

            <p>Found across web</p>

          </div>

          <div className="metricCard">

            <Brain />

            <h3>Validation</h3>

            <h2>91</h2>

            <p>AI Startup Score</p>

          </div>

          <div className="metricCard">

            <ShieldCheck />

            <h3>Security</h3>

            <h2>Low Risk</h2>

            <p>Industry compliant</p>

          </div>

        </div>

        <div className="graphArea">

          <div className="graphHeader">

            <h3>Startup Growth Forecast</h3>

            <Briefcase />

          </div>

          <div className="fakeGraph">

            <div className="bar b1"></div>

            <div className="bar b2"></div>

            <div className="bar b3"></div>

            <div className="bar b4"></div>

            <div className="bar b5"></div>

            <div className="bar b6"></div>

            <div className="line"></div>

          </div>

        </div>

        <div className="bottomCards">

          <div>

            <Rocket />

            <h4>Dynamic MVP</h4>

          </div>

          <div>

            <TrendingUp />

            <h4>Business Intelligence</h4>

          </div>

          <div>

            <ShieldCheck />

            <h4>Security Analysis</h4>

          </div>

        </div>

      </motion.div>

    </section>
  );
}
