"use client";

import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { CustomerIntelligence } from "@/lib/mockBankingData";

interface CustomerRadarProps {
  data: CustomerIntelligence[];
}

export function CustomerRadar({ data }: CustomerRadarProps) {
  const chartData = data.slice(0, 6).map((d) => ({
    segment: d.segment.replace(" ", "\n"),
    profitability: d.profitability,
    churnRisk: d.churnProbability,
    fullMark: 20,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Customer Profitability Radar
      </h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis
              dataKey="segment"
              tick={{ fill: "#94a3b8", fontSize: 9 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 20]}
              tick={{ fill: "#64748b", fontSize: 8 }}
            />
            <Radar
              name="Profitability %"
              dataKey="profitability"
              stroke="#22d3ee"
              fill="#22d3ee"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Churn Risk %"
              dataKey="churnRisk"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "10px" }}
              formatter={(value) => (
                <span className="text-slate-400">{value}</span>
              )}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
