/**
 * Rule-based NL Query handler for demo purposes
 * Maps common query patterns to narrative responses
 */

import type { ExtendedMetricsPayload } from "./mockBankingData";

export interface QueryResult {
  narrative: string;
  suggestedChart?: string;
  relevantData?: Record<string, unknown>;
}

const QUERY_PATTERNS: {
  pattern: RegExp;
  handler: (data: ExtendedMetricsPayload) => QueryResult;
}[] = [
  {
    pattern: /npa|npl|non.?performing|bad.?loan/i,
    handler: (data) => ({
      narrative: `Gross NPA stands at ${data.kpis.grossNpaPercent}%. ${
        data.topRiskRegion
          ? `The ${data.topRiskRegion} region shows elevated NPA levels. `
          : ""
      }Retail and MSME sectors are the primary contributors. Slippage rate is ${data.slippageRate ?? "—"}%. Consider tightening underwriting in high-risk segments.`,
      suggestedChart: "credit-risk",
      relevantData: {
        grossNpa: data.kpis.grossNpaPercent,
        topRiskRegion: data.topRiskRegion,
        slippageRate: data.slippageRate,
      },
    }),
  },
  {
    pattern: /liquidity|lcr|nsfr|alm/i,
    handler: (data) => ({
      narrative: `LCR is at ${data.kpis.lcrPercent}%, NSFR at ${data.nsfrPercent ?? "—"}%. ${
        data.kpis.lcrPercent >= 100
          ? "Liquidity buffer remains strong. "
          : "Monitor short-term maturity gaps. "
      }The 31-90 day gap is ₹${((data.gap3190 ?? 0) / 1000).toFixed(0)}K Cr. HQLA stands at ₹${((data.hqla ?? 0) / 1000).toFixed(0)}K Cr.`,
      suggestedChart: "liquidity",
      relevantData: {
        lcr: data.kpis.lcrPercent,
        nsfr: data.nsfrPercent,
        gap3190: data.gap3190,
      },
    }),
  },
  {
    pattern: /churn|customer|attrition/i,
    handler: (data) => ({
      narrative: `Churn risk is ${data.kpis.churnRiskPercent}%. ${data.atRiskHvCustomers ?? "—"} high-value customers show early churn signals. Cross-sell ratio is ${data.crossSellRatio ?? "—"}. Focus on Prime Retail and Affluent segments for retention.`,
      suggestedChart: "customer-profitability",
      relevantData: {
        churnRisk: data.kpis.churnRiskPercent,
        atRiskHvCustomers: data.atRiskHvCustomers,
      },
    }),
  },
  {
    pattern: /fraud|anomaly|velocity/i,
    handler: (data) => ({
      narrative: `Fraud signals: ${data.anomalyCount ?? "—"} anomalies detected, ${data.velocityBreaches ?? "—"} velocity breaches, ${data.geoHotspots ?? "—"} geo hotspots. Prioritise case review in high-severity locations.`,
      suggestedChart: "fraud",
      relevantData: {
        anomalyCount: data.anomalyCount,
        velocityBreaches: data.velocityBreaches,
      },
    }),
  },
  {
    pattern: /growth|advances|nim/i,
    handler: (data) => ({
      narrative: `Advances growth at ${data.growth.advancesGrowth}%. NIM is ${data.kpis.nimPercent}%. CASA ratio ${data.growth.casaRatio}%, digital adoption ${data.growth.digitalAdoption}%. Mobile leads channel mix.`,
      suggestedChart: "growth",
      relevantData: {
        advancesGrowth: data.growth.advancesGrowth,
        nim: data.kpis.nimPercent,
      },
    }),
  },
  {
    pattern: /north|south|east|west|region/i,
    handler: (data) => {
      const regionData = data.creditRisk.filter((c) =>
        /north|south|east|west/i.test(c.region)
      );
      const avgNpa =
        regionData.length > 0
          ? regionData.reduce((s, c) => s + c.npaPercent, 0) / regionData.length
          : data.kpis.grossNpaPercent;
      return {
        narrative: `Regional NPA: ${data.topRiskRegion} is the top risk region. Sector-wise, Retail and MSME show higher delinquency in Tier-2 exposure. Consider regional portfolio rebalancing.`,
        suggestedChart: "credit-risk",
        relevantData: { topRiskRegion: data.topRiskRegion, avgNpa },
      };
    },
  },
  {
    pattern: /compliance|regulatory|rbi|aml|filing/i,
    handler: (data) => ({
      narrative: `Compliance: ${data.compliantPercent ?? "—"}% compliant. ${data.pendingFilings ?? "—"} filings pending. AML alert queue requires attention. Review filing calendar for upcoming RBI LCR and IFRS 9 deadlines.`,
      suggestedChart: "compliance",
      relevantData: {
        compliantPercent: data.compliantPercent,
        pendingFilings: data.pendingFilings,
      },
    }),
  },
];

export function processQuery(
  query: string,
  data: ExtendedMetricsPayload
): QueryResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      narrative: "Ask a question about NPA, liquidity, churn, fraud, growth, regions, or compliance.",
    };
  }

  for (const { pattern, handler } of QUERY_PATTERNS) {
    if (pattern.test(trimmed)) {
      return handler(data);
    }
  }

  return {
    narrative: "Try asking about NPA, liquidity, customer churn, fraud, growth, regional performance, or compliance. For example: 'What's driving NPA in the North?'",
  };
}
