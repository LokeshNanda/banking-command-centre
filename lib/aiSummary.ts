/**
 * AI Executive Insights Generator
 * Converts banking signals into clear executive narratives
 * 3-4 bullets, no jargon, action-oriented
 */

import type { ExtendedMetricsPayload, MetricsPayload } from "./mockBankingData";

const SLUG_TO_KEY: Record<string, keyof typeof INSIGHT_TEMPLATES> = {
  "credit-risk": "creditRisk",
  liquidity: "liquidity",
  "customer-profitability": "customer",
  fraud: "fraud",
  growth: "growth",
  collections: "collections",
  treasury: "treasury",
  "branch-network": "branchNetwork",
  compliance: "compliance",
  "operational-risk": "operationalRisk",
};

const INSIGHT_TEMPLATES = {
  creditRisk: [
    "Retail NPAs rising in unsecured personal loans across Tier-2 cities.",
    "Sector-wise stress visible in MSME and real estate portfolios.",
    "North and West regions show early warning signals on delinquency.",
    "Corporate segment remains stable; monitor agriculture slippages.",
  ],
  liquidity: [
    "Liquidity buffer remains strong but short-term maturity gaps widening.",
    "LCR comfortably above regulatory minimum; NSFR within target.",
    "31-90 day bucket shows marginal pressure—review funding mix.",
    "Stress scenario impact within acceptable tolerance.",
  ],
  customer: [
    "High-value customers show early churn signals due to digital friction.",
    "Prime Retail segment profitability improving; cross-sell opportunities.",
    "Affluent segment at-risk—prioritize relationship manager outreach.",
    "SME segment growth potential; product bundling recommended.",
  ],
  fraud: [
    "Transaction anomalies elevated in Mumbai and Bangalore corridors.",
    "Velocity breaches contained; geo-risk patterns under monitoring.",
    "Fraud pulse trending within normal bounds—maintain vigilance.",
    "High-severity alerts down 12% vs prior period.",
  ],
  growth: [
    "Advances growth above industry; CASA ratio stable.",
    "Digital adoption accelerating; mobile channel leads.",
    "Channel mix shifting—branch footfall declining as expected.",
    "Growth momentum strong; maintain risk discipline.",
  ],
  collections: [
    "Collections recovery improving in 0-30 DPD bucket; focus on 180+ aging.",
    "Write-offs trending down; collection efficiency above target.",
    "High-value recoverable accounts in 61-90 bucket—prioritise outreach.",
    "DPD aging pyramid shifting; early-stage buckets under control.",
  ],
  treasury: [
    "VaR within limits; FX exposure elevated—review hedging strategy.",
    "Duration gap stable; MTM P&L positive for the period.",
    "Market risk appetite utilisation at 78%; headroom available.",
    "FX net open position approaching limit—consider rebalancing.",
  ],
  branchNetwork: [
    "Branch productivity strong in North; South region needs attention.",
    "ATM utilisation improving; digital migration reducing branch footfall.",
    "Cross-sell metrics above target in Central and West regions.",
    "Underperforming branches identified; right-sizing review recommended.",
  ],
  compliance: [
    "AML alert queue elevated; prioritise case review before month-end.",
    "Regulatory filings on track; RBI LCR submission due 15 Mar.",
    "Sanctions screening hits within normal range; no false positives.",
    "Compliance scorecard green; one pending audit finding to close.",
  ],
  operationalRisk: [
    "Operational incidents up in IT category; root cause analysis underway.",
    "KRI traffic lights: two categories in amber—escalate to risk committee.",
    "Loss trend within appetite; near-misses down 15% vs prior quarter.",
    "Process and Cyber categories stable; external risk monitoring active.",
  ],
};

function selectInsights(
  templates: string[],
  count: number,
  seed: number
): string[] {
  const shuffled = [...templates].sort(() => (Math.sin(seed) > 0 ? 1 : -1));
  return shuffled.slice(0, count);
}

export function generateAIInsights(data: MetricsPayload): string[] {
  const seed = Date.now() % 1000;
  const insights: string[] = [];

  // Credit risk insight based on worst NPA
  const maxNPA = Math.max(...data.creditRisk.map((c) => c.npaPercent));
  if (maxNPA >= 5) {
    insights.push(INSIGHT_TEMPLATES.creditRisk[0]);
  } else {
    insights.push(
      selectInsights(INSIGHT_TEMPLATES.creditRisk, 1, seed)[0] ??
        INSIGHT_TEMPLATES.creditRisk[0]
    );
  }

  // Liquidity insight
  insights.push(
    selectInsights(INSIGHT_TEMPLATES.liquidity, 1, seed + 1)[0] ??
      INSIGHT_TEMPLATES.liquidity[0]
  );

  // Customer insight based on churn
  const maxChurn = Math.max(
    ...data.customerIntelligence.map((c) => c.churnProbability)
  );
  if (maxChurn >= 15) {
    insights.push(INSIGHT_TEMPLATES.customer[0]);
  } else {
    insights.push(
      selectInsights(INSIGHT_TEMPLATES.customer, 1, seed + 2)[0] ??
        INSIGHT_TEMPLATES.customer[0]
    );
  }

  // Fraud insight
  insights.push(
    selectInsights(INSIGHT_TEMPLATES.fraud, 1, seed + 3)[0] ??
      INSIGHT_TEMPLATES.fraud[0]
  );

  // Rotate through new insights: collections, treasury, branch, compliance, operational
  const extraTemplates = [
    INSIGHT_TEMPLATES.collections,
    INSIGHT_TEMPLATES.treasury,
    INSIGHT_TEMPLATES.branchNetwork,
    INSIGHT_TEMPLATES.compliance,
    INSIGHT_TEMPLATES.operationalRisk,
  ];
  const extraIdx = Math.floor(seed / 200) % extraTemplates.length;
  const extra = selectInsights(extraTemplates[extraIdx], 1, seed + 4)[0];
  if (extra) insights.push(extra);

  return insights.slice(0, 5);
}

export function generateDashboardInsights(
  slug: string,
  data: ExtendedMetricsPayload
): string[] {
  const key = SLUG_TO_KEY[slug];
  if (!key || !INSIGHT_TEMPLATES[key]) {
    return [];
  }
  const templates = INSIGHT_TEMPLATES[key];
  const seed = Date.now() % 1000;
  const insights: string[] = [];

  switch (key) {
    case "creditRisk": {
      const maxNpa = Math.max(...data.creditRisk.map((c) => c.npaPercent));
      const worstCell = data.creditRisk.find((c) => c.npaPercent === maxNpa);
      if (maxNpa >= 5) {
        insights.push(templates[0]);
      } else {
        insights.push(selectInsights(templates, 1, seed)[0] ?? templates[0]);
      }
      if (worstCell) {
        insights.push(
          `${worstCell.region} and ${worstCell.sector} show highest NPA at ${worstCell.npaPercent}%—prioritise review.`
        );
      }
      const rest = selectInsights(templates, 2, seed + 1).filter((t) => !insights.includes(t));
      insights.push(...rest);
      break;
    }
    case "liquidity": {
      if (data.kpis.lcrPercent < 100) {
        insights.push("LCR below regulatory minimum—urgent funding action required.");
      } else {
        insights.push(selectInsights(templates, 1, seed)[0] ?? templates[0]);
      }
      if (data.stressScenarios?.some((s) => s.lcrImpact < 80)) {
        insights.push("Combined stress scenario pushes LCR below 80%—review contingency funding.");
      }
      const rest = selectInsights(templates, 2, seed + 2).filter((t) => !insights.includes(t));
      insights.push(...rest);
      break;
    }
    case "customer": {
      const maxChurn = Math.max(...data.customerIntelligence.map((c) => c.churnProbability));
      const atRiskSeg = data.customerIntelligence.find((c) => c.churnProbability === maxChurn);
      if (maxChurn >= 15) {
        insights.push(templates[0]);
      } else {
        insights.push(selectInsights(templates, 1, seed)[0] ?? templates[0]);
      }
      if (atRiskSeg) {
        insights.push(
          `${atRiskSeg.segment} segment shows ${atRiskSeg.churnProbability}% churn risk—outreach recommended.`
        );
      }
      const rest = selectInsights(templates, 2, seed + 3).filter((t) => !insights.includes(t));
      insights.push(...rest);
      break;
    }
    case "fraud": {
      const highCount = data.fraudSignals.filter((f) => f.severity === "high").length;
      if (highCount >= 3) {
        insights.push("Multiple high-severity geo hotspots—escalate to fraud team.");
      } else {
        insights.push(selectInsights(templates, 1, seed)[0] ?? templates[0]);
      }
      insights.push(...selectInsights(templates, 3, seed + 4));
      break;
    }
    case "growth":
    case "collections":
    case "treasury":
    case "branchNetwork":
    case "compliance":
    case "operationalRisk":
    default:
      insights.push(...selectInsights(templates, 4, seed));
  }

  return insights.slice(0, 4);
}
