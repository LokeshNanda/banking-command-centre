/**
 * Realistic mock banking data generator for Enterprise Command Centre
 * Data varies slightly on each generation to simulate live refresh
 */

const INDIAN_REGIONS = [
  "North",
  "South",
  "East",
  "West",
  "Central",
  "Northeast",
] as const;

const SECTORS = [
  "Retail",
  "Corporate",
  "MSME",
  "Agriculture",
  "Real Estate",
  "Infrastructure",
] as const;

const MATURITY_BUCKETS = [
  "Overnight",
  "1-7 days",
  "8-30 days",
  "31-90 days",
  "91-365 days",
  "1-5 years",
  "5+ years",
] as const;

const CUSTOMER_SEGMENTS = [
  "Prime Retail",
  "Mass Retail",
  "Affluent",
  "SME",
  "Corporate",
  "Institutional",
] as const;

function vary(base: number, variance: number): number {
  return base + (Math.random() - 0.5) * 2 * variance;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface ExecutiveKPIs {
  totalAdvances: number;
  grossNpaPercent: number;
  nimPercent: number;
  lcrPercent: number;
  churnRiskPercent: number;
  enterpriseRiskIndex: number;
}

export interface CreditRiskData {
  region: string;
  sector: string;
  exposure: number;
  npaPercent: number;
  delinquencyTrend: "improving" | "stable" | "worsening";
}

export interface LiquidityData {
  maturityBucket: string;
  assets: number;
  liabilities: number;
  gap: number;
}

export interface CustomerIntelligence {
  segment: string;
  avgBalance: number;
  profitability: number;
  churnProbability: number;
}

export interface FraudSignal {
  transactionVolume: number;
  anomalyScore: number;
  geoLocation: string;
  severity: "low" | "medium" | "high";
}

export interface MetricsPayload {
  kpis: ExecutiveKPIs;
  creditRisk: CreditRiskData[];
  liquidity: LiquidityData[];
  customerIntelligence: CustomerIntelligence[];
  fraudSignals: FraudSignal[];
}

export function generateMockData(): MetricsPayload {
  const kpis: ExecutiveKPIs = {
    totalAdvances: Math.round(vary(4_85_000, 8000) * 100) / 100, // ₹ Cr
    grossNpaPercent: Math.round(vary(4.2, 0.3) * 100) / 100,
    nimPercent: Math.round(vary(3.85, 0.1) * 100) / 100,
    lcrPercent: Math.round(vary(118, 4) * 100) / 100,
    churnRiskPercent: Math.round(vary(12.4, 1.2) * 100) / 100,
    enterpriseRiskIndex: Math.round(vary(62, 5) * 10) / 10,
  };

  const creditRisk: CreditRiskData[] = [];
  for (const region of INDIAN_REGIONS) {
    for (const sector of SECTORS.slice(0, 4)) {
      const exposure = Math.round(vary(8000 + Math.random() * 12000, 1500) * 100) / 100;
      const npaPercent = Math.round(vary(2 + Math.random() * 5, 0.5) * 100) / 100;
      const trends: CreditRiskData["delinquencyTrend"][] = ["improving", "stable", "worsening"];
      creditRisk.push({
        region,
        sector,
        exposure,
        npaPercent,
        delinquencyTrend: trends[Math.floor(Math.random() * 3)],
      });
    }
  }

  const liquidity: LiquidityData[] = MATURITY_BUCKETS.map((bucket, i) => {
    const assets = Math.round(vary(15000 + i * 8000, 2000) * 100) / 100;
    const liabilities = Math.round(vary(12000 + i * 7000, 1800) * 100) / 100;
    const gap = Math.round((assets - liabilities) * 100) / 100;
    return { maturityBucket: bucket, assets, liabilities, gap };
  });

  const customerIntelligence: CustomerIntelligence[] = CUSTOMER_SEGMENTS.map((segment) => ({
    segment,
    avgBalance: Math.round(vary(2_50_000 + Math.random() * 15_00_000, 50000) * 100) / 100,
    profitability: Math.round(vary(8 + Math.random() * 12, 1) * 100) / 100,
    churnProbability: Math.round(vary(5 + Math.random() * 15, 2) * 100) / 100,
  }));

  const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"];
  const fraudSignals: FraudSignal[] = cities.slice(0, 6).map((geo) => ({
    transactionVolume: Math.round(vary(500 + Math.random() * 2000, 200)),
    anomalyScore: Math.round(vary(0.2 + Math.random() * 0.6, 0.1) * 100) / 100,
    geoLocation: geo,
    severity: pick<FraudSignal["severity"]>(["low", "medium", "high"]),
  }));

  return {
    kpis,
    creditRisk,
    liquidity,
    customerIntelligence,
    fraudSignals,
  };
}
