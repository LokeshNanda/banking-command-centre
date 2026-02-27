"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { getNPARiskStatus } from "@/lib/riskScoring";

interface SectorRiskTreemapProps {
  data: { sector: string; exposure: number; npaPercent: number }[];
}

function getHeatColor(npaPercent: number): string {
  const status = getNPARiskStatus(npaPercent);
  if (status === "critical") return "#f87171";
  if (status === "warning") return "#fbbf24";
  return "#22d3ee";
}

export function SectorRiskTreemap({ data }: SectorRiskTreemapProps) {
  const chartData = data.map((d) => ({
    name: d.sector,
    exposure: d.exposure / 1000,
    npaPercent: d.npaPercent,
    fill: getHeatColor(d.npaPercent),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Sector Risk by Exposure
      </h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 50, bottom: 0 }}>
            <XAxis
              type="number"
              tick={{ fill: "#94a3b8", fontSize: 9 }}
              tickFormatter={(v) => `${v}K`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={48}
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
                  ? (item as { payload: { npaPercent?: number } }).payload
                  : null;
                const npa = payload?.npaPercent ?? 0;
                return [`₹${value.toFixed(1)}K Cr · NPA ${npa}%`, "Exposure"];
              }}
            />
            <Bar dataKey="exposure" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
