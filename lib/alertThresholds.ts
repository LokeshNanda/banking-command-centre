/**
 * Configurable alert thresholds - stored in localStorage
 * Per-KPI thresholds: e.g. NPA > 4% = warning, > 6% = critical
 */

import type { ExecutiveKPIs } from "./mockBankingData";

const STORAGE_KEY = "banking-command-centre-alert-thresholds";

export interface KpiThresholds {
  grossNpaPercent?: { warning: number; critical: number };
  nimPercent?: { warning: number; critical: number };
  lcrPercent?: { warning: number; critical: number };
  churnRiskPercent?: { warning: number; critical: number };
  enterpriseRiskIndex?: { warning: number; critical: number };
}

const DEFAULT_THRESHOLDS: Required<KpiThresholds> = {
  grossNpaPercent: { warning: 4.5, critical: 6 },
  nimPercent: { warning: 3.2, critical: 2.5 },
  lcrPercent: { warning: 100, critical: 90 },
  churnRiskPercent: { warning: 14, critical: 18 },
  enterpriseRiskIndex: { warning: 65, critical: 75 },
};

export function getThresholds(): Required<KpiThresholds> {
  if (typeof window === "undefined") return DEFAULT_THRESHOLDS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as KpiThresholds;
      return { ...DEFAULT_THRESHOLDS, ...parsed };
    }
  } catch {
    // ignore
  }
  return DEFAULT_THRESHOLDS;
}

export function setThresholds(thresholds: Partial<KpiThresholds>): void {
  if (typeof window === "undefined") return;
  try {
    const current = getThresholds();
    const merged = { ...current, ...thresholds };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // ignore
  }
}

export function resetThresholds(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export type RiskStatus = "normal" | "warning" | "critical";

export function getKPIStatusWithThresholds(
  key: keyof ExecutiveKPIs,
  value: number,
  thresholds?: KpiThresholds
): RiskStatus {
  const t: Required<KpiThresholds> = thresholds
    ? { ...DEFAULT_THRESHOLDS, ...thresholds }
    : getThresholds();

  switch (key) {
    case "grossNpaPercent": {
      const { warning, critical } = t.grossNpaPercent;
      if (value >= critical) return "critical";
      if (value >= warning) return "warning";
      return "normal";
    }
    case "nimPercent": {
      const { warning, critical } = t.nimPercent;
      if (value < critical) return "critical";
      if (value < warning) return "warning";
      return "normal";
    }
    case "lcrPercent": {
      const { warning, critical } = t.lcrPercent;
      if (value < critical) return "critical";
      if (value < warning) return "warning";
      return "normal";
    }
    case "churnRiskPercent": {
      const { warning, critical } = t.churnRiskPercent;
      if (value >= critical) return "critical";
      if (value >= warning) return "warning";
      return "normal";
    }
    case "enterpriseRiskIndex": {
      const { warning, critical } = t.enterpriseRiskIndex;
      if (value >= critical) return "critical";
      if (value >= warning) return "warning";
      return "normal";
    }
    case "totalAdvances":
      return "normal";
    default:
      return "normal";
  }
}
