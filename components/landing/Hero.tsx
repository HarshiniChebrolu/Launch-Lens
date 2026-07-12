"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Rocket, BarChart3 } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero">

      <div className="heroLeft">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          className="heroBadge"
        >
          <Sparkles size={16} />
          AI Powered Startup Intelligence Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .2 }}
        >
          Transform Ideas into
          <br />
          <span>Investor-Ready Startups</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .4 }}
        >
          Launch Lens combines AI, market research,
          competitor intelligence and startup validation
          into one beautiful platform that helps founders
          build smarter and launch faster.
        </motion.p>

        <motion.div
          className="heroButtons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .6 }}
        >
          <a href="/auth" className="heroPrimary">
            Start Building
            <ArrowRight size={18} />
          </a>

          <a href="#preview" className="heroSecondary">
            Live Preview
          </a>
        </motion.div>

      </div>

      <motion.div
        className="heroRight"
        initial={{ opacity: 0, scale: .8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: .8 }}
      >

        <div className="dashboardCard">

          <div className="dashboardTop">

            <h3>Startup Intelligence</h3>

            <span>Live</span>

          </div>

          <div className="scoreCircle">

            <h2>92</h2>

            <p>AI Score</p>

          </div>

          <div className="miniCards">

            <div>

              <Rocket size={18} />

              <h4>Market</h4>

              <p>High Growth</p>

            </div>

            <div>

              <BarChart3 size={18} />

              <h4>Competition</h4>

              <p>Moderate</p>

            </div>

          </div>

        </div>

      </motion.div>

    </section>
  );
}