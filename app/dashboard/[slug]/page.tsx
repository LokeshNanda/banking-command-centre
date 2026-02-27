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
import type { MetricsPayload } from "@/lib/mockBankingData";

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

export default function SubDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [data, setData] = useState<MetricsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/metrics")
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"
      >
        {slug === "credit-risk" && (
          <div className="lg:col-span-2">
            <CreditRiskMap data={data.creditRisk} />
          </div>
        )}
        {slug === "liquidity" && (
          <div className="lg:col-span-2">
            <LiquidityPanel data={data.liquidity} />
          </div>
        )}
        {slug === "customer-profitability" && (
          <div className="lg:col-span-2">
            <CustomerRadar data={data.customerIntelligence} />
          </div>
        )}
        {slug === "fraud" && (
          <div className="lg:col-span-2">
            <FraudPanel data={data.fraudSignals} />
          </div>
        )}
        {slug === "growth" && (
          <div className="lg:col-span-2">
            <GrowthPanel data={data.growth} />
          </div>
        )}
        {slug === "collections" && (
          <div className="lg:col-span-2">
            <CollectionsPanel data={data.collections} />
          </div>
        )}
        {slug === "treasury" && (
          <div className="lg:col-span-2">
            <TreasuryPanel data={data.treasury} />
          </div>
        )}
        {slug === "branch-network" && (
          <div className="lg:col-span-2">
            <BranchNetworkPanel data={data.branchNetwork} />
          </div>
        )}
        {slug === "compliance" && (
          <div className="lg:col-span-2">
            <CompliancePanel data={data.compliance} />
          </div>
        )}
        {slug === "operational-risk" && (
          <div className="lg:col-span-2">
            <OperationalRiskPanel data={data.operationalRisk} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
