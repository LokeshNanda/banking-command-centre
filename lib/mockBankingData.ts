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

export interface CollectionsData {
  bucket: string;
  recoveryRate: number;
  dpdDays: number;
  collectionEfficiency: number;
  writeOffAmount: number;
}

export interface TreasuryData {
  varValue: number;
  durationGap: number;
  fxExposure: number;
  mtmPnl: number;
}

export interface BranchNetworkData {
  branchId: string;
  region: string;
  deposits: number;
  advances: number;
  crossSellCount: number;
  atmUtilisation: number;
  footfallConversion: number;
}

export interface ComplianceData {
  regulation: string;
  status: "compliant" | "pending" | "overdue";
  amlAlertCount: number;
  sanctionsHits: number;
  filingDueDate: string;
}

export interface OperationalRiskData {
  category: string;
  incidentCount: number;
  lossAmount: number;
  kriStatus: "green" | "amber" | "red";
}

export interface GrowthData {
  advancesGrowth: number;
  casaRatio: number;
  digitalAdoption: number;
  channelSplit: { channel: string; share: number }[];
}

export interface MetricsPayload {
  kpis: ExecutiveKPIs;
  creditRisk: CreditRiskData[];
  liquidity: LiquidityData[];
  customerIntelligence: CustomerIntelligence[];
  fraudSignals: FraudSignal[];
  collections: CollectionsData[];
  treasury: TreasuryData;
  branchNetwork: BranchNetworkData[];
  compliance: ComplianceData[];
  operationalRisk: OperationalRiskData[];
  growth: GrowthData;
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

  const dpdBuckets = ["0-30", "31-60", "61-90", "91-180", "180+"];
  const collections: CollectionsData[] = dpdBuckets.map((bucket, i) => ({
    bucket,
    recoveryRate: Math.round(vary(45 + (4 - i) * 12, 4) * 100) / 100,
    dpdDays: i === 0 ? 15 : i === 1 ? 45 : i === 2 ? 75 : i === 3 ? 135 : 200,
    collectionEfficiency: Math.round(vary(72 + Math.random() * 15, 5) * 100) / 100,
    writeOffAmount: Math.round(vary(50 + i * 80, 20) * 100) / 100,
  }));

  const treasury: TreasuryData = {
    varValue: Math.round(vary(125, 15) * 100) / 100,
    durationGap: Math.round(vary(0.8, 0.2) * 100) / 100,
    fxExposure: Math.round(vary(450, 80) * 100) / 100,
    mtmPnl: Math.round(vary(12.5, 5) * 100) / 100,
  };

  const branchRegions = ["North", "South", "East", "West", "Central"];
  const branchNetwork: BranchNetworkData[] = branchRegions.flatMap((region, ri) =>
    [1, 2, 3].map((_, bi) => ({
      branchId: `${region.slice(0, 2)}-${ri * 3 + bi + 1}`,
      region,
      deposits: Math.round(vary(8000 + Math.random() * 12000, 1500) * 100) / 100,
      advances: Math.round(vary(6000 + Math.random() * 10000, 1200) * 100) / 100,
      crossSellCount: Math.round(vary(2.5 + Math.random() * 3, 0.5) * 100) / 100,
      atmUtilisation: Math.round(vary(55 + Math.random() * 35, 8) * 100) / 100,
      footfallConversion: Math.round(vary(18 + Math.random() * 12, 3) * 100) / 100,
    }))
  );

  const regulations = ["RBI LCR", "AML/KYC", "BASEL III", "IFRS 9", "DPDP"];
  const compliance: ComplianceData[] = regulations.map((reg, i) => ({
    regulation: reg,
    status: pick<ComplianceData["status"]>(["compliant", "pending", "overdue"]),
    amlAlertCount: reg === "AML/KYC" ? Math.round(vary(24, 8)) : 0,
    sanctionsHits: reg === "AML/KYC" ? Math.round(vary(3, 2)) : 0,
    filingDueDate: reg === "RBI LCR" ? "2025-03-15" : reg === "IFRS 9" ? "2025-03-31" : "2025-04-10",
  }));

  const opRiskCategories = ["IT", "Cyber", "Process", "Fraud", "External"];
  const operationalRisk: OperationalRiskData[] = opRiskCategories.map((cat) => ({
    category: cat,
    incidentCount: Math.round(vary(2 + Math.random() * 8, 2)),
    lossAmount: Math.round(vary(5 + Math.random() * 45, 10) * 100) / 100,
    kriStatus: pick<OperationalRiskData["kriStatus"]>(["green", "amber", "red"]),
  }));

  const growth: GrowthData = {
    advancesGrowth: Math.round(vary(12.5, 1.5) * 100) / 100,
    casaRatio: Math.round(vary(42, 3) * 100) / 100,
    digitalAdoption: Math.round(vary(68, 5) * 100) / 100,
    channelSplit: [
      { channel: "Mobile", share: vary(45, 3) },
      { channel: "Internet", share: vary(28, 2) },
      { channel: "Branch", share: vary(18, 2) },
      { channel: "ATM", share: vary(9, 1) },
    ],
  };

  return {
    kpis,
    creditRisk,
    liquidity,
    customerIntelligence,
    fraudSignals,
    collections,
    treasury,
    branchNetwork,
    compliance,
    operationalRisk,
    growth,
  };
}
