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

// Extended data for drill-down dashboards
export interface SectorNpaTrend {
  sector: string;
  month: string;
  npaPercent: number;
}

export interface StressScenario {
  scenario: string;
  lcrImpact: number;
}

export interface ProductHolding {
  segment: string;
  product: string;
  penetration: number;
}

export interface FraudTimelineEntry {
  date: string;
  count: number;
  severity: "low" | "medium" | "high";
}

export interface AdvancesTrend {
  month: string;
  value: number;
}

export interface RecoveryTrend {
  bucket: string;
  month: string;
  rate: number;
}

export interface VarHistory {
  date: string;
  value: number;
}

export interface FilingCalendarEntry {
  name: string;
  due: string;
  status: "on_track" | "at_risk" | "overdue";
}

export interface EarlyWarning {
  composite: number;
  credit: number;
  liquidity: number;
  fraud: number;
  ops: number;
}

export interface PeerBenchmark {
  metric: string;
  bankValue: number;
  peerMedian: number;
  peerP25?: number;
  peerP75?: number;
}

export interface KpiHistory {
  key: string;
  values: number[];
}

export interface IncidentTrend {
  category: string;
  month: string;
  count: number;
}

export interface ExtendedMetricsPayload extends MetricsPayload {
  earlyWarning: EarlyWarning;
  peerBenchmarks: PeerBenchmark[];
  kpiHistory: KpiHistory[];
  // Credit Risk
  sectorNpaTrend: SectorNpaTrend[];
  sectorAggregate: { sector: string; exposure: number; npaPercent: number }[];
  netNpaPercent: number;
  slippageRate: number;
  provisionCoverage: number;
  topRiskRegion: string;
  // Liquidity
  nsfrPercent: number;
  stressScenarios: StressScenario[];
  gap3190: number;
  hqla: number;
  // Customer
  productHolding: ProductHolding[];
  crossSellRatio: number;
  atRiskHvCustomers: number;
  // Fraud
  fraudTimeline: FraudTimelineEntry[];
  anomalyCount: number;
  velocityBreaches: number;
  geoHotspots: number;
  // Growth
  advancesTrend: AdvancesTrend[];
  casaTrend: { month: string; value: number }[];
  // Collections
  recoveryTrend: RecoveryTrend[];
  dpd180Exposure: number;
  // Treasury
  varHistory: VarHistory[];
  // Branch
  branchRanking: { branchId: string; region: string; score: number; deposits: number; advances: number }[];
  underperformers: number;
  // Compliance
  filingCalendar: FilingCalendarEntry[];
  compliantPercent: number;
  pendingFilings: number;
  // Operational
  incidentTrend: IncidentTrend[];
  kriRedCount: number;
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

export function generateMockData(): ExtendedMetricsPayload {
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

  // Credit Risk extended data
  const sectorAggregate = SECTORS.slice(0, 6).map((sector) => {
    const sectorData = creditRisk.filter((c) => c.sector === sector);
    const exposure = sectorData.reduce((s, c) => s + c.exposure, 0);
    const avgNpa =
      sectorData.length > 0
        ? sectorData.reduce((s, c) => s + c.npaPercent, 0) / sectorData.length
        : 0;
    return { sector, exposure, npaPercent: Math.round(avgNpa * 100) / 100 };
  });
  const months6 = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const sectorNpaTrend: SectorNpaTrend[] = [];
  for (const sector of SECTORS.slice(0, 4)) {
    let base = vary(2.5, 0.5);
    for (const month of months6) {
      base = Math.max(1, Math.min(8, base + (Math.random() - 0.5) * 0.8));
      sectorNpaTrend.push({ sector, month, npaPercent: Math.round(base * 100) / 100 });
    }
  }
  const netNpaPercent = Math.round(kpis.grossNpaPercent * 0.65 * 100) / 100;
  const slippageRate = Math.round(vary(0.8, 0.2) * 100) / 100;
  const provisionCoverage = Math.round(vary(72, 5) * 100) / 100;
  const worstRegion = [...new Map(creditRisk.map((c) => [c.region, c.npaPercent])).entries()].reduce(
    (a, b) => (a[1] > b[1] ? a : b)
  );
  const topRiskRegion = worstRegion[0];

  // Liquidity extended data
  const nsfrPercent = Math.round(vary(108, 5) * 100) / 100;
  const stressScenarios: StressScenario[] = [
    { scenario: "7-day run", lcrImpact: Math.round(vary(95, 5) * 100) / 100 },
    { scenario: "30-day stress", lcrImpact: Math.round(vary(88, 6) * 100) / 100 },
    { scenario: "Combined shock", lcrImpact: Math.round(vary(82, 8) * 100) / 100 },
  ];
  const bucket3190 = liquidity.find((l) => l.maturityBucket === "31-90 days");
  const gap3190 = bucket3190 ? Math.round(bucket3190.gap * 100) / 100 : vary(2000, 500);
  const hqla = Math.round(vary(85000, 5000) * 100) / 100;

  // Customer extended data
  const products = ["Savings", "Current", "FD", "Loan", "Cards", "Insurance"];
  const productHolding: ProductHolding[] = [];
  for (const seg of CUSTOMER_SEGMENTS) {
    for (const prod of products.slice(0, 4)) {
      productHolding.push({
        segment: seg,
        product: prod,
        penetration: Math.round(vary(15 + Math.random() * 60, 8) * 100) / 100,
      });
    }
  }
  const crossSellRatio = Math.round(vary(2.8, 0.4) * 100) / 100;
  const atRiskHvCustomers = Math.round(vary(120, 30));

  // Fraud extended data
  const fraudDates = ["20 Feb", "21 Feb", "22 Feb", "23 Feb", "24 Feb", "25 Feb", "26 Feb", "27 Feb"];
  const fraudTimeline: FraudTimelineEntry[] = fraudDates.map((date, i) => ({
    date,
    count: Math.round(vary(8 + i * 2 + Math.random() * 10, 3)),
    severity: pick<FraudTimelineEntry["severity"]>(["low", "medium", "high"]),
  }));
  const anomalyCount = fraudSignals.reduce((s, f) => s + Math.round(f.anomalyScore * 100), 0);
  const velocityBreaches = Math.round(vary(3, 2));
  const geoHotspots = fraudSignals.filter((f) => f.severity === "high").length;

  // Growth extended data
  const advancesTrend: AdvancesTrend[] = months6.map((month, i) => ({
    month,
    value: Math.round(vary(4_50_000 + i * 6000 + Math.random() * 3000, 2000) * 100) / 100,
  }));
  const casaTrend = months6.map((month, i) => ({
    month,
    value: Math.round(vary(40 + i * 0.5 + Math.random() * 2, 1) * 100) / 100,
  }));

  // Collections extended data
  const recoveryTrend: RecoveryTrend[] = [];
  for (const b of dpdBuckets) {
    let base = vary(50, 10);
    for (const month of months6) {
      base = Math.max(1, Math.min(90, base + (Math.random() - 0.5) * 5));
      recoveryTrend.push({ bucket: b, month, rate: Math.round(base * 100) / 100 });
    }
  }
  const dpd180Bucket = collections.find((c) => c.bucket === "180+");
  const dpd180Exposure = dpd180Bucket ? Math.round(dpd180Bucket.writeOffAmount * 1.5) : 350;

  // Treasury extended data
  const varHistory: VarHistory[] = fraudDates.slice(-7).map((date, i) => ({
    date,
    value: Math.round(vary(115 + i * 2 + Math.random() * 15, 5) * 100) / 100,
  }));

  // Branch extended data
  const branchRanking = branchNetwork
    .map((b) => ({
      ...b,
      score: Math.round((b.deposits / 1000 + b.advances / 1000 + b.crossSellCount * 10) * 100) / 100,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ branchId, region, score, deposits, advances }) => ({
      branchId,
      region,
      score,
      deposits,
      advances,
    }));
  const underperformers = branchNetwork.filter((b) => b.footfallConversion < 15).length;

  // Compliance extended data
  const filingStatuses = ["on_track", "at_risk", "overdue"] as const;
  const filingCalendar: FilingCalendarEntry[] = [
    { name: "RBI LCR", due: "2025-03-15", status: pick(filingStatuses) },
    { name: "IFRS 9", due: "2025-03-31", status: pick(["on_track", "at_risk"] as const) },
    { name: "AML/KYC", due: "2025-04-10", status: pick(["on_track", "at_risk"] as const) },
    { name: "BASEL III", due: "2025-04-30", status: "on_track" },
  ];
  const compliantPercent = Math.round(
    (compliance.filter((c) => c.status === "compliant").length / compliance.length) * 100
  );
  const pendingFilings = compliance.filter((c) => c.status !== "compliant").length;

  // Operational extended data
  const incidentTrend: IncidentTrend[] = [];
  for (const cat of opRiskCategories) {
    let base = vary(2, 1);
    for (const month of months6) {
      base = Math.max(0, base + (Math.random() - 0.5) * 2);
      incidentTrend.push({ category: cat, month, count: Math.round(base) });
    }
  }
  const kriRedCount = operationalRisk.filter((o) => o.kriStatus === "red").length;

  // Early Warning Scorecard (0-100, higher = more risk)
  const creditScore = Math.round(
    (creditRisk.reduce((s, c) => s + c.npaPercent, 0) / creditRisk.length) * 15 +
      (kpis.grossNpaPercent >= 6 ? 25 : kpis.grossNpaPercent >= 4 ? 15 : 5)
  );
  const liquidityScore = Math.round(
    kpis.lcrPercent < 90 ? 30 : kpis.lcrPercent < 100 ? 20 : 10
  );
  const fraudScore = Math.round(
    fraudSignals.filter((f) => f.severity === "high").length * 8 +
      fraudSignals.reduce((s, f) => s + f.anomalyScore * 10, 0)
  );
  const opsScore = Math.round(
    operationalRisk.filter((o) => o.kriStatus === "red").length * 15 +
      operationalRisk.filter((o) => o.kriStatus === "amber").length * 5
  );
  const earlyWarning: EarlyWarning = {
    composite: Math.round(
      (creditScore + liquidityScore + fraudScore + opsScore) / 4
    ),
    credit: Math.min(100, creditScore),
    liquidity: Math.min(100, liquidityScore),
    fraud: Math.min(100, fraudScore),
    ops: Math.min(100, opsScore),
  };

  // Peer Benchmarks
  const peerBenchmarks: PeerBenchmark[] = [
    {
      metric: "Gross NPA %",
      bankValue: kpis.grossNpaPercent,
      peerMedian: vary(4.5, 0.5),
      peerP25: 3.2,
      peerP75: 5.8,
    },
    {
      metric: "NIM %",
      bankValue: kpis.nimPercent,
      peerMedian: vary(3.6, 0.3),
      peerP25: 3.2,
      peerP75: 4.0,
    },
    {
      metric: "LCR %",
      bankValue: kpis.lcrPercent,
      peerMedian: vary(115, 5),
      peerP25: 108,
      peerP75: 125,
    },
  ];

  // KPI History for sparklines (last 6 values)
  const retailNpa = sectorNpaTrend.filter((s) => s.sector === "Retail");
  const kpiHistory: KpiHistory[] = [
    {
      key: "totalAdvances",
      values: advancesTrend.map((t) => t.value / 1000),
    },
    {
      key: "grossNpaPercent",
      values:
        retailNpa.length >= 6
          ? retailNpa.slice(-6).map((s) => s.npaPercent)
          : [3.5, 3.8, 4.0, 4.1, 4.0, kpis.grossNpaPercent],
    },
    {
      key: "nimPercent",
      values: casaTrend.map((c) => 3.2 + c.value / 100),
    },
    {
      key: "lcrPercent",
      values: [115, 116, 117, 116, 117, kpis.lcrPercent],
    },
    {
      key: "churnRiskPercent",
      values: [
        ...customerIntelligence.slice(0, 5).map((c) => c.churnProbability),
        kpis.churnRiskPercent,
      ],
    },
    {
      key: "enterpriseRiskIndex",
      values: [
        ...varHistory.slice(0, 5).map((v) => 58 + v.value / 20),
        kpis.enterpriseRiskIndex,
      ],
    },
  ];

  return {
    kpis,
    earlyWarning,
    peerBenchmarks,
    kpiHistory,
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
    sectorNpaTrend,
    sectorAggregate,
    netNpaPercent,
    slippageRate,
    provisionCoverage,
    topRiskRegion,
    nsfrPercent,
    stressScenarios,
    gap3190,
    hqla,
    productHolding,
    crossSellRatio,
    atRiskHvCustomers,
    fraudTimeline,
    anomalyCount,
    velocityBreaches,
    geoHotspots,
    advancesTrend,
    casaTrend,
    recoveryTrend,
    dpd180Exposure,
    varHistory,
    branchRanking,
    underperformers,
    filingCalendar,
    compliantPercent,
    pendingFilings,
    incidentTrend,
    kriRedCount,
  };
}
