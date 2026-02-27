"use client";

import { motion } from "framer-motion";
import type { TreasuryData } from "@/lib/mockBankingData";

interface TreasuryPanelProps {
  data: TreasuryData;
  onClick?: () => void;
}

export function TreasuryPanel({ data, onClick }: TreasuryPanelProps) {
  const varStatus = data.varValue <= 120 ? "normal" : data.varValue <= 150 ? "warning" : "critical";
  const varColor = varStatus === "normal" ? "text-cyan-400" : varStatus === "warning" ? "text-amber-400" : "text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full cursor-pointer hover:border-cyan-500/30 transition-colors"
      onClick={onClick}
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-between">
        <span>Treasury & Market Risk</span>
        <span className="text-cyan-500/80 text-[10px]">View details →</span>
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-800/50 px-3 py-3">
          <div className="text-[10px] text-slate-500 uppercase">VaR (Cr)</div>
          <div className={`text-xl font-bold ${varColor}`}>₹{data.varValue.toFixed(1)}</div>
          <div className="text-[9px] text-slate-500 mt-0.5">Limit: ₹150 Cr</div>
        </div>
        <div className="rounded-lg bg-slate-800/50 px-3 py-3">
          <div className="text-[10px] text-slate-500 uppercase">Duration Gap</div>
          <div className="text-xl font-bold text-slate-200">{data.durationGap.toFixed(2)}</div>
        </div>
        <div className="rounded-lg bg-slate-800/50 px-3 py-3">
          <div className="text-[10px] text-slate-500 uppercase">FX Exposure (Cr)</div>
          <div className="text-xl font-bold text-slate-200">₹{data.fxExposure.toFixed(0)}</div>
        </div>
        <div className="rounded-lg bg-slate-800/50 px-3 py-3">
          <div className="text-[10px] text-slate-500 uppercase">MTM P&L (Cr)</div>
          <div className={`text-xl font-bold ${data.mtmPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {data.mtmPnl >= 0 ? "+" : ""}₹{data.mtmPnl.toFixed(1)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
