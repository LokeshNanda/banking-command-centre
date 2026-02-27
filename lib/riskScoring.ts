/**
 * Risk scoring utilities for color coding and status
 * Normal → Cool blue glow | Warning → Amber pulse | Critical → Soft red pulse
 */

export type RiskStatus = "normal" | "warning" | "critical";

export function getKPIStatus(
  key: string,
  value: number
): RiskStatus {
  switch (key) {
    case "grossNpaPercent":
      if (value >= 6) return "critical";
      if (value >= 4.5) return "warning";
      return "normal";

    case "nimPercent":
      if (value < 2.5) return "critical";
      if (value < 3.2) return "warning";
      return "normal";

    case "lcrPercent":
      if (value < 90) return "critical";
      if (value < 100) return "warning";
      return "normal";

    case "churnRiskPercent":
      if (value >= 18) return "critical";
      if (value >= 14) return "warning";
      return "normal";

    case "enterpriseRiskIndex":
      if (value >= 75) return "critical";
      if (value >= 65) return "warning";
      return "normal";

    case "totalAdvances":
      return "normal";

    default:
      return "normal";
  }
}

export function getStatusGlow(status: RiskStatus): string {
  switch (status) {
    case "critical":
      return "shadow-glow-red";
    case "warning":
      return "shadow-glow-amber";
    default:
      return "shadow-glow-cyan";
  }
}

export function getStatusColor(status: RiskStatus): string {
  switch (status) {
    case "critical":
      return "text-red-400";
    case "warning":
      return "text-amber-400";
    default:
      return "text-cyan-400";
  }
}

export function getNPARiskStatus(npaPercent: number): RiskStatus {
  if (npaPercent >= 6) return "critical";
  if (npaPercent >= 4) return "warning";
  return "normal";
}
