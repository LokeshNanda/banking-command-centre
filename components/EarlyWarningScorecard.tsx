"use client";

import { motion } from "framer-motion";
import type { EarlyWarning } from "@/lib/mockBankingData";

interface EarlyWarningScorecardProps {
  data: EarlyWarning;
}

function getScoreStatus(score: number): "normal" | "warning" | "critical" {
  if (score >= 70) return "critical";
  if (score >= 50) return "warning";
  return "normal";
}

function getScoreColor(status: "normal" | "warning" | "critical"): string {
  switch (status) {
    case "critical":
      return "text-red-400 border-red-500/50 bg-red-500/10";
    case "warning":
      return "text-amber-400 border-amber-500/50 bg-amber-500/10";
    default:
      return "text-emerald-400 border-emerald-500/50 bg-emerald-500/10";
  }
}

const SUB_DOMAINS: { key: keyof Omit<EarlyWarning, "composite">; label: string }[] = [
  { key: "credit", label: "Credit" },
  { key: "liquidity", label: "Liquidity" },
  { key: "fraud", label: "Fraud" },
  { key: "ops", label: "Operational" },
];

export function EarlyWarningScorecard({ data }: EarlyWarningScorecardProps) {
  const compositeStatus = getScoreStatus(data.composite);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Early Warning Scorecard
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl border-2 ${getScoreColor(
              compositeStatus
            )}`}
          >
            <span className="text-2xl font-bold">{data.composite}</span>
            <span className="text-[9px] uppercase">Composite</span>
          </motion.div>
          <div className="flex-1 grid grid-cols-2 gap-2">
            {SUB_DOMAINS.map(({ key, label }) => {
              const score = data[key];
              const status = getScoreStatus(score);
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg border ${getScoreColor(
                    status
                  )}`}
                >
                  <span className="text-[10px] font-medium">{label}</span>
                  <span className="text-sm font-bold">{score}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
        <p className="text-[10px] text-slate-500">
          Score 0–100 · Higher = elevated risk · Traffic-light by sub-domain
        </p>
      </div>
    </motion.div>
  );
}
