"use client";

import { motion } from "framer-motion";
import { getKPIStatus, getStatusColor } from "@/lib/riskScoring";
import type { ExecutiveKPIs } from "@/lib/mockBankingData";

const KPI_CONFIG: { key: keyof ExecutiveKPIs; label: string; format: (v: number) => string }[] = [
  { key: "totalAdvances", label: "TOTAL ADVANCES", format: (v: number) => `₹${(v / 1000).toFixed(1)}K Cr` },
  { key: "grossNpaPercent", label: "GROSS NPA %", format: (v: number) => `${v}%` },
  { key: "nimPercent", label: "NIM %", format: (v: number) => `${v}%` },
  { key: "lcrPercent", label: "LCR %", format: (v: number) => `${v}%` },
  { key: "churnRiskPercent", label: "CHURN RISK %", format: (v: number) => `${v}%` },
  { key: "enterpriseRiskIndex", label: "ENTERPRISE RISK INDEX", format: (v: number) => v.toFixed(1) },
] as const;

interface KPIBarProps {
  kpis: ExecutiveKPIs;
}

export function KPIBar({ kpis }: KPIBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap gap-4 md:gap-6 justify-between items-stretch"
    >
      {KPI_CONFIG.map(({ key, label, format }, i) => {
        const value = kpis[key] ?? 0;
        const status = getKPIStatus(key, value);
        const colorClass = getStatusColor(status);

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className={`
              flex-1 min-w-[120px] max-w-[200px]
              glass-panel px-4 py-3
              border-l-4 ${status === "critical" ? "border-red-500" : status === "warning" ? "border-amber-500" : "border-cyan-500"}
            `}
          >
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">
              {label}
            </p>
            <motion.p
              key={value}
              initial={{ scale: 1.1, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`text-xl md:text-2xl font-bold ${colorClass}`}
            >
              {format(value)}
            </motion.p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
