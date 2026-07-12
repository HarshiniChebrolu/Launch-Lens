"use client";

import { motion } from "framer-motion";
import { Brain, CheckCircle2 } from "lucide-react";

const steps = [
  "Understanding startup idea",
  "Researching market signals",
  "Finding competitors",
  "Studying pricing models",
  "Building MVP roadmap",
  "Preparing intelligence report",
];

export default function LoadingEngine() {
  return (
    <div className="loadingEngine">
      <motion.div
        className="loadingBox"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="brainPulse">
          <Brain size={36} />
        </div>

        <h1>Building your Startup Intelligence Report</h1>
        <p>
          Launch Lens is combining AI reasoning with research signals to create
          your blueprint.
        </p>

        <div className="loadingSteps">
          {steps.map((item, index) => (
            <motion.div
              key={item}
              className="loadingStep"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.25 }}
            >
              <CheckCircle2 size={18} />
              {item}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}