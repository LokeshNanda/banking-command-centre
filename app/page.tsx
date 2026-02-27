"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { KPIBar } from "@/components/KPIBar";
import { CreditRiskMap } from "@/components/CreditRiskMap";
import { LiquidityPanel } from "@/components/LiquidityPanel";
import { CustomerRadar } from "@/components/CustomerRadar";
import { FraudPanel } from "@/components/FraudPanel";
import { GrowthPanel } from "@/components/GrowthPanel";
import { CollectionsPanel } from "@/components/CollectionsPanel";
import { TreasuryPanel } from "@/components/TreasuryPanel";
import { BranchNetworkPanel } from "@/components/BranchNetworkPanel";
import { CompliancePanel } from "@/components/CompliancePanel";
import { OperationalRiskPanel } from "@/components/OperationalRiskPanel";
import { AIInsights } from "@/components/AIInsights";
import { EarlyWarningScorecard } from "@/components/EarlyWarningScorecard";
import { FilingCalendar } from "@/components/dashboard/FilingCalendar";
import { DataFreshnessIndicator } from "@/components/DataFreshnessIndicator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { AlertThresholdsModal } from "@/components/AlertThresholdsModal";
import { StressScenarioSimulator } from "@/components/StressScenarioSimulator";
import { NpaLiquidityForecast } from "@/components/NpaLiquidityForecast";
import { ExportButton } from "@/components/ExportButton";
import { TimeRangeSelector, type TimeRange } from "@/components/TimeRangeSelector";
import { PeerBenchmarkOverlay } from "@/components/PeerBenchmarkOverlay";
import { MeetingMode } from "@/components/MeetingMode";
import { ExecutiveSummaryMode } from "@/components/ExecutiveSummaryMode";
import { ViewPresetSelector, type ViewPreset } from "@/components/ViewPresetSelector";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { NLQueryBar } from "@/components/NLQueryBar";
import { AlertHistoryPanel } from "@/components/AlertHistoryPanel";
import { AIChatPanel } from "@/components/AIChatPanel";
import { recordBreachIfNeeded } from "@/lib/alertHistory";
import type { MetricsPayload, ExtendedMetricsPayload } from "@/lib/mockBankingData";

const REFRESH_INTERVAL_MS = 20_000;

const PRESET_PANELS: Record<ViewPreset, string[]> = {
  default: [
    "earlyWarning",
    "filingCalendar",
    "stress",
    "forecast",
    "peerBenchmark",
    "creditRisk",
    "liquidity",
    "customer",
    "fraud",
    "growth",
    "collections",
    "treasury",
    "branch",
    "compliance",
    "operational",
  ],
  cro: ["earlyWarning", "filingCalendar", "creditRisk", "liquidity", "fraud", "compliance", "operational"],
  cfo: ["earlyWarning", "filingCalendar", "stress", "forecast", "peerBenchmark", "liquidity", "treasury", "collections", "compliance"],
  cdo: ["earlyWarning", "customer", "growth", "branch", "fraud", "peerBenchmark"],
};

type PageData = MetricsPayload & {
  aiInsights?: string[];
  earlyWarning?: ExtendedMetricsPayload["earlyWarning"];
  filingCalendar?: ExtendedMetricsPayload["filingCalendar"];
  kpiHistory?: ExtendedMetricsPayload["kpiHistory"];
  peerBenchmarks?: ExtendedMetricsPayload["peerBenchmarks"];
};

export default function CommandCentrePage() {
  const router = useRouter();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [thresholdsVersion, setThresholdsVersion] = useState(0);
  const [timeRange, setTimeRange] = useState<TimeRange>("today");
  const [meetingMode, setMeetingMode] = useState(false);
  const [summaryMode, setSummaryMode] = useState(false);
  const [showAlertHistory, setShowAlertHistory] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [viewPreset, setViewPreset] = useState<ViewPreset>("default");

  const showPanel = (id: string) => PRESET_PANELS[viewPreset].includes(id);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "m" || e.key === "M") setMeetingMode((v) => !v);
      if (e.key === "s" || e.key === "S") setSummaryMode((v) => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch(`/api/metrics?timeRange=${timeRange}`);
      const json = await res.json();
      recordBreachIfNeeded(json.kpis, data?.kpis);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchMetrics intentionally recreated with timeRange
  }, [timeRange]);

  if (loading && !data) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Failed to load metrics
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 relative">
      <AnimatedBackground />
      <MeetingMode
        isActive={meetingMode}
        onExit={() => setMeetingMode(false)}
        kpis={data.kpis}
        insights={data.aiInsights ?? []}
        topRiskHighlight={
          data.earlyWarning?.composite && data.earlyWarning.composite >= 50
            ? "Early warning score elevated. Review credit and liquidity sub-domains."
            : "Monitor NPA trajectory in Retail and MSME segments."
        }
      />

      <ExecutiveSummaryMode
        isActive={summaryMode}
        onExit={() => setSummaryMode(false)}
        kpis={data.kpis}
        insights={data.aiInsights ?? []}
        topRiskHighlight={
          data.earlyWarning?.composite && data.earlyWarning.composite >= 50
            ? "Early warning score elevated. Review credit and liquidity sub-domains."
            : "Monitor NPA trajectory in Retail and MSME segments."
        }
        currency={currency}
      />

      <AlertHistoryPanel isOpen={showAlertHistory} onClose={() => setShowAlertHistory(false)} />
      <AIChatPanel
        data={data as ExtendedMetricsPayload}
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
      />

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
          <div className="mt-3">
            <NLQueryBar data={data as ExtendedMetricsPayload} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ViewPresetSelector value={viewPreset} onChange={setViewPreset} />
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          <DataFreshnessIndicator
            lastRefresh={lastRefresh}
            refreshIntervalMs={REFRESH_INTERVAL_MS}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMeetingMode(true)}
              className="p-2 rounded-lg border border-slate-600/50 hover:border-slate-500 hover:bg-slate-800/30 transition-colors"
              title="Meeting Mode (M)"
              aria-label="Enter meeting mode"
            >
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setSummaryMode(true)}
              className="p-2 rounded-lg border border-slate-600/50 hover:border-slate-500 hover:bg-slate-800/30 transition-colors"
              title="Executive Summary (S)"
              aria-label="Executive summary"
            >
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setShowAIChat(true)}
              className="p-2 rounded-lg border border-slate-600/50 hover:border-cyan-500/50 hover:bg-slate-800/30 transition-colors"
              title="AI Chat"
              aria-label="Open AI chat"
            >
              <svg
                className="w-4 h-4 text-slate-400 hover:text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
            <button
              onClick={() => setShowAlertHistory(true)}
              className="p-2 rounded-lg border border-slate-600/50 hover:border-slate-500 hover:bg-slate-800/30 transition-colors"
              title="Alert History"
              aria-label="View alert history"
            >
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <ExportButton />
            <button
              onClick={() => setCurrency((c) => (c === "INR" ? "USD" : "INR"))}
              className="px-2 py-1 text-xs rounded border border-slate-600/50 hover:border-slate-500 text-slate-400 hover:text-white"
            >
              {currency}
            </button>
            <ThemeToggle />
            <button
              onClick={() => setShowAlertModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-600/50 hover:border-slate-500 hover:bg-slate-800/30 transition-colors"
              title="Configure alert thresholds"
              aria-label="Configure alert thresholds"
            >
              <svg
                className="w-4 h-4 text-slate-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-xs text-slate-400 hidden sm:inline">Thresholds</span>
            </button>
          </div>
        </div>
      </motion.header>

      <AlertThresholdsModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        onSave={() => setThresholdsVersion((v) => v + 1)}
      />

      {/* KPI Bar */}
      <div className="mb-6">
        <AnimatePresence mode="wait">
          <KPIBar
            key={`${lastRefresh?.getTime()}-${thresholdsVersion}`}
            kpis={data.kpis}
            kpiHistory={data.kpiHistory}
            currency={currency}
          />
        </AnimatePresence>
      </div>

      {/* Main Grid - Early Warning + Filing Tracker + 10 Sub-Dashboards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        data-export-target
      >
        {/* Early Warning Scorecard */}
        {data.earlyWarning && (
          <div className="cursor-pointer" onClick={() => router.push("/dashboard/compliance")}>
            <EarlyWarningScorecard data={data.earlyWarning} />
          </div>
        )}

        {/* Regulatory Filing Tracker */}
        {data.filingCalendar && (
          <div className="cursor-pointer" onClick={() => router.push("/dashboard/compliance")}>
            <FilingCalendar data={data.filingCalendar} />
          </div>
        )}

        {/* Stress Scenario Simulator - interactive, no navigation */}
        <div>
          <StressScenarioSimulator
            baseLcr={data.kpis.lcrPercent}
            baseNpa={data.kpis.grossNpaPercent}
            baseNim={data.kpis.nimPercent}
          />
        </div>

        {/* NPA & Liquidity Forecast */}
        {showPanel("forecast") && (
        <div className="cursor-pointer" onClick={() => router.push("/dashboard/credit-risk")}>
          <NpaLiquidityForecast
            currentNpa={data.kpis.grossNpaPercent}
            currentLcr={data.kpis.lcrPercent}
          />
        </div>
        )}

        {/* Peer Benchmark Overlay */}
        {showPanel("peerBenchmark") && data.peerBenchmarks && data.peerBenchmarks.length > 0 && (
          <PeerBenchmarkOverlay data={data.peerBenchmarks} />
        )}

        {/* 1. Credit Risk */}
        {showPanel("creditRisk") && (
        <div
          className="lg:col-span-2 cursor-pointer transition-transform hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/5"
          onClick={() => router.push("/dashboard/credit-risk")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && router.push("/dashboard/credit-risk")}
        >
          <CreditRiskMap data={data.creditRisk} />
        </div>
        )}

        {/* 2. Liquidity */}
        {showPanel("liquidity") && (
        <div
          className="cursor-pointer transition-transform hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/5"
          onClick={() => router.push("/dashboard/liquidity")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && router.push("/dashboard/liquidity")}
        >
          <LiquidityPanel data={data.liquidity} />
        </div>
        )}

        {/* 3. Customer Radar */}
        {showPanel("customer") && (
        <div
          className="cursor-pointer transition-transform hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/5"
          onClick={() => router.push("/dashboard/customer-profitability")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && router.push("/dashboard/customer-profitability")}
        >
          <CustomerRadar data={data.customerIntelligence} />
        </div>
        )}

        {/* 4. Fraud Panel */}
        {showPanel("fraud") && (
        <div
          className="cursor-pointer transition-transform hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/5"
          onClick={() => router.push("/dashboard/fraud")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && router.push("/dashboard/fraud")}
        >
          <FraudPanel data={data.fraudSignals} />
        </div>
        )}

        {/* 5. Growth */}
        {showPanel("growth") && (
        <div
          className="cursor-pointer transition-transform hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/5"
          onClick={() => router.push("/dashboard/growth")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && router.push("/dashboard/growth")}
        >
          <GrowthPanel data={data.growth} />
        </div>
        )}

        {/* 6. Collections */}
        {showPanel("collections") && (
        <CollectionsPanel
          data={data.collections}
          onClick={() => router.push("/dashboard/collections")}
        />
        )}

        {/* 7. Treasury */}
        {showPanel("treasury") && (
        <TreasuryPanel
          data={data.treasury}
          onClick={() => router.push("/dashboard/treasury")}
        />
        )}

        {/* 8. Branch & Network */}
        {showPanel("branch") && (
        <BranchNetworkPanel
          data={data.branchNetwork}
          onClick={() => router.push("/dashboard/branch-network")}
        />
        )}

        {/* 9. Compliance */}
        {showPanel("compliance") && (
        <CompliancePanel
          data={data.compliance}
          onClick={() => router.push("/dashboard/compliance")}
        />
        )}

        {/* 10. Operational Risk */}
        {showPanel("operational") && (
        <OperationalRiskPanel
          data={data.operationalRisk}
          onClick={() => router.push("/dashboard/operational-risk")}
        />
        )}

        {/* AI Insights - full width */}
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
          <AIInsights insights={data.aiInsights ?? []} />
        </div>
      </div>
    </div>
  );
}
