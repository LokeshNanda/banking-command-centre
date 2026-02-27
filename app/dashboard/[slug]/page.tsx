"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
import { DashboardKPIBar } from "@/components/DashboardKPIBar";
import { AIInsights } from "@/components/AIInsights";
import { SectorRiskTreemap } from "@/components/dashboard/SectorRiskTreemap";
import { SlippageTrendLine } from "@/components/dashboard/SlippageTrendLine";
import { LCRGauge } from "@/components/dashboard/LCRGauge";
import { StressImpactPanel } from "@/components/dashboard/StressImpactPanel";
import { CustomerValueMatrix } from "@/components/dashboard/CustomerValueMatrix";
import { CrossSellMap } from "@/components/dashboard/CrossSellMap";
import { FraudPulseTimeline } from "@/components/dashboard/FraudPulseTimeline";
import { SeverityCounters } from "@/components/dashboard/SeverityCounters";
import { GrowthMomentumChart } from "@/components/dashboard/GrowthMomentumChart";
import { CasaTrendLine } from "@/components/dashboard/CasaTrendLine";
import { RecoveryTrendChart } from "@/components/dashboard/RecoveryTrendChart";
import { DPDPyramid } from "@/components/dashboard/DPDPyramid";
import { VaRTrendChart } from "@/components/dashboard/VaRTrendChart";
import { ExposureBreakdown } from "@/components/dashboard/ExposureBreakdown";
import { BranchLeaderboard } from "@/components/dashboard/BranchLeaderboard";
import { RegionPerformance } from "@/components/dashboard/RegionPerformance";
import { FilingCalendar } from "@/components/dashboard/FilingCalendar";
import { AMLQueueStatus } from "@/components/dashboard/AMLQueueStatus";
import { IncidentTrendChart } from "@/components/dashboard/IncidentTrendChart";
import { KRIScorecard } from "@/components/dashboard/KRIScorecard";
import type { ExtendedMetricsPayload } from "@/lib/mockBankingData";

const DASHBOARD_SLUGS = [
  "credit-risk",
  "liquidity",
  "customer-profitability",
  "fraud",
  "growth",
  "collections",
  "treasury",
  "branch-network",
  "compliance",
  "operational-risk",
] as const;

const DASHBOARD_TITLES: Record<string, string> = {
  "credit-risk": "Credit Risk & NPA Intelligence",
  liquidity: "Liquidity & ALM Dashboard",
  "customer-profitability": "Customer Profitability & Churn Radar",
  fraud: "Fraud & Anomaly Detection",
  growth: "Growth & Performance Dashboard",
  collections: "Collections & Recovery Command",
  treasury: "Treasury & Market Risk",
  "branch-network": "Branch & Network Performance",
  compliance: "Compliance & Regulatory Hub",
  "operational-risk": "Operational Risk & Incidents",
};

interface DashboardResponse extends ExtendedMetricsPayload {
  dashboardInsights?: string[];
}

export default function SubDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/metrics?dashboard=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (!DASHBOARD_SLUGS.includes(slug as (typeof DASHBOARD_SLUGS)[number])) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <p className="text-slate-400 mb-4">Unknown dashboard</p>
        <button
          onClick={() => router.push("/")}
          className="text-cyan-500 hover:text-cyan-400"
        >
          Back to Command Centre
        </button>
      </div>
    );
  }

  if (loading || !data) {
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

  const title = DASHBOARD_TITLES[slug] ?? slug;
  const insights = data.dashboardInsights ?? [];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-slate-500 hover:text-cyan-500 mb-2 flex items-center gap-1"
          >
            ← Back to Command Centre
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {title}
          </h1>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <DashboardKPIBar slug={slug} data={data} />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {slug === "credit-risk" && (
            <>
              <div className="lg:col-span-2">
                <CreditRiskMap data={data.creditRisk} />
              </div>
              <SectorRiskTreemap data={data.sectorAggregate} />
              <div className="lg:col-span-2">
                <SlippageTrendLine data={data.sectorNpaTrend} />
              </div>
              {insights.length > 0 && (
                <div className="lg:col-span-2 xl:col-span-1">
                  <AIInsights insights={insights} />
                </div>
              )}
            </>
          )}
          {slug === "liquidity" && (
            <>
              <LCRGauge lcrPercent={data.kpis.lcrPercent} nsfrPercent={data.nsfrPercent} />
              <LiquidityPanel data={data.liquidity} />
              <StressImpactPanel data={data.stressScenarios} />
              {insights.length > 0 && (
                <div className="lg:col-span-2">
                  <AIInsights insights={insights} />
                </div>
              )}
            </>
          )}
          {slug === "customer-profitability" && (
            <>
              <CustomerRadar data={data.customerIntelligence} />
              <CustomerValueMatrix data={data.customerIntelligence} />
              <CrossSellMap data={data.productHolding} />
              {insights.length > 0 && (
                <div className="lg:col-span-2">
                  <AIInsights insights={insights} />
                </div>
              )}
            </>
          )}
          {slug === "fraud" && (
            <>
              <FraudPanel data={data.fraudSignals} />
              <FraudPulseTimeline data={data.fraudTimeline} />
              <SeverityCounters data={data.fraudSignals} />
              {insights.length > 0 && (
                <div className="lg:col-span-2">
                  <AIInsights insights={insights} />
                </div>
              )}
            </>
          )}
          {slug === "growth" && (
            <>
              <GrowthPanel data={data.growth} />
              <GrowthMomentumChart data={data.advancesTrend} />
              <CasaTrendLine data={data.casaTrend} />
              {insights.length > 0 && (
                <div className="lg:col-span-2">
                  <AIInsights insights={insights} />
                </div>
              )}
            </>
          )}
          {slug === "collections" && (
            <>
              <CollectionsPanel data={data.collections} />
              <RecoveryTrendChart data={data.recoveryTrend} />
              <DPDPyramid data={data.collections} />
              {insights.length > 0 && (
                <div className="lg:col-span-2">
                  <AIInsights insights={insights} />
                </div>
              )}
            </>
          )}
          {slug === "treasury" && (
            <>
              <TreasuryPanel data={data.treasury} />
              <VaRTrendChart data={data.varHistory} />
              <ExposureBreakdown data={data.treasury} />
              {insights.length > 0 && (
                <div className="lg:col-span-2">
                  <AIInsights insights={insights} />
                </div>
              )}
            </>
          )}
          {slug === "branch-network" && (
            <>
              <BranchNetworkPanel data={data.branchNetwork} />
              <BranchLeaderboard data={data.branchRanking} />
              <RegionPerformance data={data.branchNetwork} />
              {insights.length > 0 && (
                <div className="lg:col-span-2">
                  <AIInsights insights={insights} />
                </div>
              )}
            </>
          )}
          {slug === "compliance" && (
            <>
              <CompliancePanel data={data.compliance} />
              <FilingCalendar data={data.filingCalendar} />
              <AMLQueueStatus data={data.compliance} />
              {insights.length > 0 && (
                <div className="lg:col-span-2">
                  <AIInsights insights={insights} />
                </div>
              )}
            </>
          )}
          {slug === "operational-risk" && (
            <>
              <OperationalRiskPanel data={data.operationalRisk} />
              <IncidentTrendChart data={data.incidentTrend} />
              <KRIScorecard data={data.operationalRisk} />
              {insights.length > 0 && (
                <div className="lg:col-span-2">
                  <AIInsights insights={insights} />
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
