"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section id="start" className="ctaSection">
      <motion.div
        className="ctaBox"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="ctaBadge">
          <Sparkles size={16} />
          Ready to validate your idea?
        </span>

        <h2>See your startup before you build it.</h2>

        <p>
          Launch Lens helps you understand the market, competitors, business
          model, MVP, roadmap, security risks and pitch before spending weeks
          building the wrong product.
        </p>

        <a href="/auth" className="ctaButton">
          Generate My Startup Report
          <ArrowRight size={18} />
        </a>
      </motion.div>
    </section>
  );
}