"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getStatusColor } from "@/lib/riskScoring";
import { getKPIStatusWithThresholds, getThresholds } from "@/lib/alertThresholds";
import type { ExecutiveKPIs } from "@/lib/mockBankingData";

interface ExecutiveSummaryModeProps {
  isActive: boolean;
  onExit: () => void;
  kpis: ExecutiveKPIs;
  insights: string[];
  topRiskHighlight: string;
  currency?: "INR" | "USD";
}

const TOP_5_KPIS: { key: keyof ExecutiveKPIs; label: string; format: (v: number) => string }[] = [
  { key: "totalAdvances", label: "Total Advances", format: (v) => `₹${(v / 1000).toFixed(1)}K Cr` },
  { key: "grossNpaPercent", label: "Gross NPA %", format: (v) => `${v}%` },
  { key: "nimPercent", label: "NIM %", format: (v) => `${v}%` },
  { key: "lcrPercent", label: "LCR %", format: (v) => `${v}%` },
  { key: "enterpriseRiskIndex", label: "Risk Index", format: (v) => v.toFixed(1) },
];

export function ExecutiveSummaryMode({
  isActive,
  onExit,
  kpis,
  insights,
  topRiskHighlight,
  currency = "INR",
}: ExecutiveSummaryModeProps) {
  if (!isActive) return null;

  const thresholds = getThresholds();

  const formatWithCurrency = (key: string, value: number, format: (v: number) => string) => {
    if (key === "totalAdvances" && currency === "USD") {
      const usdValue = value / 12;
      return `$${(usdValue / 1000).toFixed(1)}K Cr`;
    }
    return format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-slate-950/95 backdrop-blur-md flex flex-col"
    >
      <button
        onClick={onExit}
        className="absolute top-4 right-4 z-10 px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-600 rounded-lg"
      >
        Exit Summary (S)
      </button>

      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
        <h2 className="text-slate-500 text-sm uppercase tracking-widest mb-8">
          Executive Summary
        </h2>

        {/* 5 KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 w-full mb-10">
          {TOP_5_KPIS.map(({ key, label, format }, i) => {
            const value = kpis[key] ?? 0;
            const status = getKPIStatusWithThresholds(key, value, thresholds);
            const colorClass = getStatusColor(status);
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel p-4 text-center"
              >
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{label}</p>
                <p className={`text-2xl md:text-3xl font-bold ${colorClass}`}>
                  {formatWithCurrency(key, value, format)}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* 3 AI Insights */}
        <div className="w-full glass-panel p-6 mb-6">
          <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4">AI Insights</h3>
          <ul className="space-y-3">
            {(insights.slice(0, 3) || []).map((insight, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="text-slate-300 flex gap-2"
              >
                <span className="text-cyan-500 shrink-0">•</span>
                {insight}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* 1 Risk Highlight */}
        <div className="w-full glass-panel p-6 border-l-4 border-amber-500">
          <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-2">Key Risk</h3>
          <p className="text-lg text-amber-400 font-medium">{topRiskHighlight}</p>
        </div>
      </div>
    </motion.div>
  );
}
