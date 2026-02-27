/**
 * AI Executive Insights Generator
 * Converts banking signals into clear executive narratives
 * 3-4 bullets, no jargon, action-oriented
 */

import type { MetricsPayload } from "./mockBankingData";

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

  return insights.slice(0, 4);
}
