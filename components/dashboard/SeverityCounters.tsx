"use client";

import { motion } from "framer-motion";
import type { FraudSignal } from "@/lib/mockBankingData";

interface SeverityCountersProps {
  data: FraudSignal[];
}

export function SeverityCounters({ data }: SeverityCountersProps) {
  const low = data.filter((f) => f.severity === "low").length;
  const medium = data.filter((f) => f.severity === "medium").length;
  const high = data.filter((f) => f.severity === "high").length;

  const counters = [
    { label: "Low", count: low, color: "bg-cyan-500/40 text-cyan-400 border-cyan-500/50" },
    { label: "Medium", count: medium, color: "bg-amber-500/40 text-amber-400 border-amber-500/50" },
    { label: "High", count: high, color: "bg-red-500/40 text-red-400 border-red-500/50" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Risk Severity Counters
      </h3>
      <div className="flex gap-4 justify-around">
        {counters.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className={`flex flex-col items-center px-4 py-3 rounded-lg border ${c.color}`}
          >
            <span className="text-2xl font-bold">{c.count}</span>
            <span className="text-[10px] uppercase tracking-wider">{c.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
