"use client";

import { motion } from "framer-motion";
import type { ExtendedMetricsPayload } from "@/lib/mockBankingData";

const KPI_CONFIG: Record<
  string,
  { label: string; format: (v: number | string) => string; getValue: (d: ExtendedMetricsPayload) => number | string }[]
> = {
  "credit-risk": [
    { label: "GROSS NPA %", format: (v) => `${v}%`, getValue: (d) => d.kpis.grossNpaPercent },
    { label: "NET NPA %", format: (v) => `${v}%`, getValue: (d) => d.netNpaPercent },
    { label: "SLIPPAGE RATE", format: (v) => `${v}%`, getValue: (d) => d.slippageRate },
    { label: "PROVISION COVERAGE", format: (v) => `${v}%`, getValue: (d) => d.provisionCoverage },
    { label: "TOP RISK REGION", format: (v) => String(v), getValue: (d) => d.topRiskRegion },
  ],
  liquidity: [
    { label: "LCR %", format: (v) => `${v}%`, getValue: (d) => d.kpis.lcrPercent },
    { label: "NSFR %", format: (v) => `${v}%`, getValue: (d) => d.nsfrPercent },
    { label: "GAP 31-90D (Cr)", format: (v) => `₹${Number(v).toFixed(0)}`, getValue: (d) => d.gap3190 },
    { label: "HQLA (Cr)", format: (v) => `₹${(Number(v) / 1000).toFixed(1)}K`, getValue: (d) => d.hqla },
  ],
  "customer-profitability": [
    {
      label: "AVG PROFITABILITY",
      format: (v) => `${v}%`,
      getValue: (d) =>
        d.customerIntelligence.length
          ? (
              d.customerIntelligence.reduce((s, c) => s + c.profitability, 0) /
              d.customerIntelligence.length
            ).toFixed(1)
          : 0,
    },
    {
      label: "CHURN RISK %",
      format: (v) => `${v}%`,
      getValue: (d) => d.kpis.churnRiskPercent,
    },
    { label: "CROSS-SELL RATIO", format: (v) => String(v), getValue: (d) => d.crossSellRatio },
    { label: "AT-RISK HV CUSTOMERS", format: (v) => String(v), getValue: (d) => d.atRiskHvCustomers },
  ],
  fraud: [
    { label: "ANOMALY COUNT", format: (v) => String(v), getValue: (d) => d.anomalyCount },
    {
      label: "HIGH-SEVERITY",
      format: (v) => String(v),
      getValue: (d) => d.fraudSignals.filter((f) => f.severity === "high").length,
    },
    { label: "VELOCITY BREACHES", format: (v) => String(v), getValue: (d) => d.velocityBreaches },
    { label: "GEO HOTSPOTS", format: (v) => String(v), getValue: (d) => d.geoHotspots },
  ],
  growth: [
    { label: "ADVANCES GROWTH %", format: (v) => `${v}%`, getValue: (d) => d.growth.advancesGrowth },
    { label: "CASA %", format: (v) => `${v}%`, getValue: (d) => d.growth.casaRatio },
    { label: "DIGITAL ADOPTION %", format: (v) => `${v}%`, getValue: (d) => d.growth.digitalAdoption },
    {
      label: "MOBILE SHARE",
      format: (v) => `${v}%`,
      getValue: (d) =>
        d.growth.channelSplit.find((c) => c.channel === "Mobile")?.share?.toFixed(1) ?? 0,
    },
  ],
  collections: [
    {
      label: "AVG RECOVERY %",
      format: (v) => `${v}%`,
      getValue: (d) =>
        d.collections.length
          ? (
              d.collections.reduce((s, c) => s + c.recoveryRate, 0) / d.collections.length
            ).toFixed(1)
          : 0,
    },
    {
      label: "WRITE-OFFS (Cr)",
      format: (v) => `₹${Number(v).toFixed(0)}`,
      getValue: (d) => d.collections.reduce((s, c) => s + c.writeOffAmount, 0),
    },
    {
      label: "180+ DPD EXPOSURE",
      format: (v) => `₹${Number(v).toFixed(0)}`,
      getValue: (d) => d.dpd180Exposure,
    },
  ],
  treasury: [
    { label: "VaR (Cr)", format: (v) => `₹${Number(v).toFixed(1)}`, getValue: (d) => d.treasury.varValue },
    { label: "DURATION GAP", format: (v) => String(v), getValue: (d) => d.treasury.durationGap.toFixed(2) },
    { label: "FX EXPOSURE (Cr)", format: (v) => `₹${Number(v).toFixed(0)}`, getValue: (d) => d.treasury.fxExposure },
    {
      label: "MTM P&L (Cr)",
      format: (v) => `${Number(v) >= 0 ? "+" : ""}₹${Number(v).toFixed(1)}`,
      getValue: (d) => d.treasury.mtmPnl,
    },
  ],
  "branch-network": [
    {
      label: "ATM UTIL %",
      format: (v) => `${v}%`,
      getValue: (d) =>
        d.branchNetwork.length
          ? (
              d.branchNetwork.reduce((s, b) => s + b.atmUtilisation, 0) / d.branchNetwork.length
            ).toFixed(0)
          : 0,
    },
    {
      label: "CONVERSION %",
      format: (v) => `${v}%`,
      getValue: (d) =>
        d.branchNetwork.length
          ? (
              d.branchNetwork.reduce((s, b) => s + b.footfallConversion, 0) /
              d.branchNetwork.length
            ).toFixed(1)
          : 0,
    },
    {
      label: "CROSS-SELL",
      format: (v) => String(v),
      getValue: (d) =>
        d.branchNetwork.length
          ? (
              d.branchNetwork.reduce((s, b) => s + b.crossSellCount, 0) /
              d.branchNetwork.length
            ).toFixed(2)
          : 0,
    },
    { label: "UNDERPERFORMERS", format: (v) => String(v), getValue: (d) => d.underperformers },
  ],
  compliance: [
    { label: "COMPLIANT %", format: (v) => `${v}%`, getValue: (d) => d.compliantPercent },
    {
      label: "AML QUEUE",
      format: (v) => String(v),
      getValue: (d) => d.compliance.reduce((s, c) => s + c.amlAlertCount, 0),
    },
    { label: "PENDING FILINGS", format: (v) => String(v), getValue: (d) => d.pendingFilings },
  ],
  "operational-risk": [
    {
      label: "INCIDENTS",
      format: (v) => String(v),
      getValue: (d) => d.operationalRisk.reduce((s, o) => s + o.incidentCount, 0),
    },
    {
      label: "LOSS (Cr)",
      format: (v) => `₹${Number(v).toFixed(0)}`,
      getValue: (d) =>
        d.operationalRisk.reduce((s, o) => s + o.lossAmount, 0),
    },
    { label: "KRI RED", format: (v) => String(v), getValue: (d) => d.kriRedCount },
  ],
};

interface DashboardKPIBarProps {
  slug: string;
  data: ExtendedMetricsPayload;
}

export function DashboardKPIBar({ slug, data }: DashboardKPIBarProps) {
  const config = KPI_CONFIG[slug];
  if (!config) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap gap-3 md:gap-4 justify-between items-stretch"
    >
      {config.map(({ label, format, getValue }, i) => {
        const value = getValue(data);
        const isNumeric = typeof value === "number";
        const numVal = isNumeric ? (value as number) : 0;
        const isWarning =
          (label.includes("NPA") && numVal > 4) ||
          (label.includes("CHURN") && numVal > 15) ||
          (label.includes("LOSS") && numVal > 30);
        const isCritical =
          (label.includes("NPA") && numVal > 6) ||
          (label.includes("LCR") && numVal < 100);

        return (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className={`
              flex-1 min-w-[100px] max-w-[180px]
              glass-panel px-3 py-2
              border-l-4 ${isCritical ? "border-red-500" : isWarning ? "border-amber-500" : "border-cyan-500"}
            `}
          >
            <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">
              {label}
            </p>
            <motion.p
              key={String(value)}
              initial={{ scale: 1.1, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`text-lg font-bold ${
                isCritical ? "text-red-400" : isWarning ? "text-amber-400" : "text-cyan-400"
              }`}
            >
              {format(value)}
            </motion.p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
