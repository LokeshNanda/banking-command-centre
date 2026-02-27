"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KPIBar } from "@/components/KPIBar";
import { CreditRiskMap } from "@/components/CreditRiskMap";
import { LiquidityPanel } from "@/components/LiquidityPanel";
import { CustomerRadar } from "@/components/CustomerRadar";
import { FraudPanel } from "@/components/FraudPanel";
import { AIInsights } from "@/components/AIInsights";
import type { MetricsPayload } from "@/lib/mockBankingData";

const REFRESH_INTERVAL_MS = 20_000;

export default function CommandCentrePage() {
  const [data, setData] = useState<MetricsPayload & { aiInsights?: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/metrics");
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const id = setInterval(fetchMetrics, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-cyan-500/50 border-t-cyan-500 rounded-full"
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Failed to load metrics
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Banking Command Centre
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Enterprise Intelligence · Risk · Liquidity · Growth
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span
            className={`w-2 h-2 rounded-full ${data ? "bg-emerald-500 animate-pulse" : "bg-slate-500"}`}
          />
          Live · Refreshes every 20s
          {lastRefresh && (
            <span className="text-slate-600">
              Last: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
        </div>
      </motion.header>

      {/* KPI Bar */}
      <div className="mb-6">
        <AnimatePresence mode="wait">
          <KPIBar key={lastRefresh?.getTime()} kpis={data.kpis} />
        </AnimatePresence>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Credit Risk Heatmap */}
        <div className="lg:row-span-2">
          <CreditRiskMap data={data.creditRisk} />
        </div>

        {/* Liquidity */}
        <LiquidityPanel data={data.liquidity} />

        {/* Customer Radar */}
        <CustomerRadar data={data.customerIntelligence} />

        {/* Fraud Panel */}
        <FraudPanel data={data.fraudSignals} />

        {/* AI Insights - full width */}
        <div className="lg:col-span-2">
          <AIInsights insights={data.aiInsights ?? []} />
        </div>
      </div>
    </div>
  );
}
