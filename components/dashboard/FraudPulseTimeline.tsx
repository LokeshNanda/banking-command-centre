"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { FraudTimelineEntry } from "@/lib/mockBankingData";

interface FraudPulseTimelineProps {
  data: FraudTimelineEntry[];
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case "high":
      return "#f87171";
    case "medium":
      return "#fbbf24";
    default:
      return "#22d3ee";
  }
}

export function FraudPulseTimeline({ data }: FraudPulseTimelineProps) {
  const chartData = data.map((d) => ({
    ...d,
    fill: getSeverityColor(d.severity),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Fraud Pulse Timeline
      </h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="date"
              tick={{ fill: "#94a3b8", fontSize: 9 }}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 9 }}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number, _name: string, item: unknown) => {
                const payload = item && typeof item === "object" && "payload" in item
                  ? (item as { payload: { severity?: string } }).payload
                  : null;
                const severity = payload?.severity ?? "";
                return [`${value} alerts${severity ? ` (${severity})` : ""}`, "Count"];
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#22d3ee"
              fill="#22d3ee"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
