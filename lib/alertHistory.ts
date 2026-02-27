/**
 * Alert History - records threshold breaches for audit trail
 * Stored in localStorage
 */

import { getKPIStatusWithThresholds, getThresholds } from "./alertThresholds";
import type { ExecutiveKPIs } from "./mockBankingData";

const STORAGE_KEY = "banking-command-centre-alert-history";
const MAX_ENTRIES = 50;

export interface AlertHistoryEntry {
  id: string;
  timestamp: string; // ISO string
  kpiKey: keyof ExecutiveKPIs;
  kpiLabel: string;
  value: number;
  status: "warning" | "critical";
  previousStatus?: "normal" | "warning" | "critical";
}

const KPI_LABELS: Record<keyof ExecutiveKPIs, string> = {
  totalAdvances: "Total Advances",
  grossNpaPercent: "Gross NPA %",
  nimPercent: "NIM %",
  lcrPercent: "LCR %",
  churnRiskPercent: "Churn Risk %",
  enterpriseRiskIndex: "Enterprise Risk Index",
};

function loadHistory(): AlertHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return [];
}

function saveHistory(entries: AlertHistoryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)));
  } catch {
    // ignore
  }
}

export function getAlertHistory(): AlertHistoryEntry[] {
  return loadHistory().sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function recordBreachIfNeeded(
  kpis: ExecutiveKPIs,
  previousKpis?: ExecutiveKPIs
): AlertHistoryEntry[] {
  const thresholds = getThresholds();
  const entries: AlertHistoryEntry[] = [];
  const keys = [
    "grossNpaPercent",
    "nimPercent",
    "lcrPercent",
    "churnRiskPercent",
    "enterpriseRiskIndex",
  ] as const;

  for (const key of keys) {
    const value = kpis[key] ?? 0;
    const status = getKPIStatusWithThresholds(key, value, thresholds);
    const prevValue = previousKpis?.[key];
    const prevStatus = prevValue !== undefined
      ? getKPIStatusWithThresholds(key, prevValue, thresholds)
      : undefined;

    if (status === "warning" || status === "critical") {
      const isNewBreach = prevStatus !== status && prevStatus !== "critical";
      const isEscalation = prevStatus === "warning" && status === "critical";
      if (isNewBreach || isEscalation) {
        entries.push({
          id: `alert-${Date.now()}-${key}-${Math.random().toString(36).slice(2)}`,
          timestamp: new Date().toISOString(),
          kpiKey: key,
          kpiLabel: KPI_LABELS[key],
          value,
          status,
          previousStatus: prevStatus,
        });
      }
    }
  }

  if (entries.length > 0) {
    const history = [...entries, ...loadHistory()];
    saveHistory(history);
  }

  return entries;
}

export function clearAlertHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
