"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  getKPIStatusWithThresholds,
  getThresholds,
  type KpiThresholds,
} from "@/lib/alertThresholds";
import { getStatusColor } from "@/lib/riskScoring";
import type { ExecutiveKPIs } from "@/lib/mockBankingData";
import type { KpiHistory } from "@/lib/mockBankingData";
import { LineChart, Line, ResponsiveContainer } from "recharts";

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
  kpiHistory?: KpiHistory[];
  currency?: "INR" | "USD";
}

function MiniSparkline({ values }: { values: number[] }) {
  if (!values || values.length < 2) return null;
  const data = values.map((v, i) => ({ i, v }));
  const last = values[values.length - 1] ?? 0;
  const prev = values[values.length - 2] ?? 0;
  const trend = last >= prev ? "up" : "down";

  return (
    <div className="flex items-center gap-1 mt-1">
      <div className="w-12 h-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={trend === "up" ? "#22d3ee" : "#f59e0b"}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <span
        className={`text-[10px] ${trend === "up" ? "text-cyan-400" : "text-amber-400"}`}
      >
        {trend === "up" ? "↑" : "↓"}
      </span>
    </div>
  );
}

export function KPIBar({ kpis, kpiHistory = [], currency = "INR" }: KPIBarProps) {
  const [thresholds, setThresholdsState] = useState<KpiThresholds | null>(null);

  useEffect(() => {
    setThresholdsState(getThresholds());
  }, []);

  const formatWithCurrency = (key: string, value: number, format: (v: number) => string) => {
    if (key === "totalAdvances" && currency === "USD") {
      const usdValue = value / 12; // Mock FX ~83
      return `$${(usdValue / 1000).toFixed(1)}K Cr`;
    }
    return format(value);
  };

  const getHistoryValues = (key: string) => {
    const hist = kpiHistory.find((h) => h.key === key);
    return hist?.values ?? [];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap gap-4 md:gap-6 justify-between items-stretch"
    >
      {KPI_CONFIG.map(({ key, label, format }, i) => {
        const value = kpis[key] ?? 0;
        const status = getKPIStatusWithThresholds(key, value, thresholds ?? undefined);
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
              {formatWithCurrency(key, value, format)}
            </motion.p>
            <MiniSparkline values={getHistoryValues(key)} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
