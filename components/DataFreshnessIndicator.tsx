"use client";

import { useState, useEffect } from "react";

interface DataFreshnessIndicatorProps {
  lastRefresh: Date | null;
  isStale?: boolean;
  refreshIntervalMs?: number;
}

const STALE_THRESHOLD_MS = 25_000; // Consider stale if no refresh in 25s (slightly over 20s interval)

export function DataFreshnessIndicator({
  lastRefresh,
  isStale = false,
  refreshIntervalMs = 20_000,
}: DataFreshnessIndicatorProps) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);
  const stale =
    isStale || (lastRefresh && Date.now() - lastRefresh.getTime() > STALE_THRESHOLD_MS);

  return (
    <div className="flex items-center gap-3 text-xs">
      <span
        className={`flex items-center gap-1.5 ${stale ? "text-amber-400" : "text-slate-500"}`}
      >
        <span
          className={`w-2 h-2 rounded-full ${stale ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}
        />
        {stale ? "Updating..." : "Live"}
      </span>
      <span className="text-slate-600">·</span>
      <span className="text-slate-500">
        As of {lastRefresh ? lastRefresh.toLocaleTimeString() : "—"}
      </span>
      <span className="text-slate-600">·</span>
      <span className="text-slate-500">Refreshes every {refreshIntervalMs / 1000}s</span>
    </div>
  );
}
