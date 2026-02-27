"use client";

import { motion } from "framer-motion";
import type { OperationalRiskData } from "@/lib/mockBankingData";

interface KRIScorecardProps {
  data: OperationalRiskData[];
}

function getKriColor(status: string): string {
  switch (status) {
    case "green":
      return "bg-emerald-500/40 text-emerald-400 border-emerald-500/50";
    case "amber":
      return "bg-amber-500/40 text-amber-400 border-amber-500/50";
    case "red":
      return "bg-red-500/40 text-red-400 border-red-500/50";
    default:
      return "bg-slate-500/40 text-slate-400 border-slate-500/50";
  }
}

export function KRIScorecard({ data }: KRIScorecardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        KRI Traffic Lights
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {data.map((d, i) => (
          <motion.div
            key={d.category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className={`flex flex-col px-3 py-2 rounded-lg border ${getKriColor(d.kriStatus)}`}
          >
            <span className="text-sm font-medium">{d.category}</span>
            <span className="text-[10px] opacity-80">
              {d.incidentCount} incidents · ₹{d.lossAmount.toFixed(0)} Cr
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
