"use client";

import { motion } from "framer-motion";

interface LCRGaugeProps {
  lcrPercent: number;
  nsfrPercent: number;
}

export function LCRGauge({ lcrPercent, nsfrPercent }: LCRGaugeProps) {
  const lcrStatus = lcrPercent >= 100 ? "normal" : lcrPercent >= 90 ? "warning" : "critical";
  const nsfrStatus = nsfrPercent >= 100 ? "normal" : nsfrPercent >= 90 ? "warning" : "critical";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Liquidity Ratios
      </h3>
      <div className="flex gap-6 justify-center items-center">
        <div className="flex flex-col items-center">
          <div
            className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${
              lcrStatus === "critical"
                ? "border-red-500 text-red-400"
                : lcrStatus === "warning"
                  ? "border-amber-500 text-amber-400"
                  : "border-cyan-500 text-cyan-400"
            }`}
          >
            <span className="text-2xl font-bold">{lcrPercent}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">LCR %</p>
          <p className="text-[9px] text-slate-600">Min 100%</p>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${
              nsfrStatus === "critical"
                ? "border-red-500 text-red-400"
                : nsfrStatus === "warning"
                  ? "border-amber-500 text-amber-400"
                  : "border-cyan-500 text-cyan-400"
            }`}
          >
            <span className="text-2xl font-bold">{nsfrPercent}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">NSFR %</p>
          <p className="text-[9px] text-slate-600">Min 100%</p>
        </div>
      </div>
    </motion.div>
  );
}
