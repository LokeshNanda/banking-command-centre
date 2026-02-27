"use client";

import { motion } from "framer-motion";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import type { CustomerIntelligence } from "@/lib/mockBankingData";

interface CustomerValueMatrixProps {
  data: CustomerIntelligence[];
}

export function CustomerValueMatrix({ data }: CustomerValueMatrixProps) {
  const chartData = data.map((d) => ({
    name: d.segment,
    x: d.profitability,
    y: d.churnProbability,
    z: d.avgBalance / 100000,
  }));

  const getColor = (churn: number) => {
    if (churn >= 15) return "#f87171";
    if (churn >= 10) return "#fbbf24";
    return "#22d3ee";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Customer Value Matrix
      </h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="Profitability"
              tick={{ fill: "#94a3b8", fontSize: 9 }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Churn Risk"
              tick={{ fill: "#94a3b8", fontSize: 9 }}
              tickFormatter={(v) => `${v}%`}
            />
            <ZAxis type="number" dataKey="z" range={[100, 400]} name="Avg Balance" />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: unknown, _name: string, item: unknown) => {
                const payload = item && typeof item === "object" && "payload" in item
                  ? (item as { payload: { name: string } }).payload
                  : null;
                const label = payload?.name ?? "";
                const num = Number(value);
                if (num < 25) return [`${num}%`, label];
                return [`₹${(num / 10).toFixed(1)}L`, label];
              }}
            />
            <Scatter name="Segments" data={chartData}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={getColor(entry.y)} fillOpacity={0.8} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[9px] text-slate-500 mt-2">Bubble size: avg balance</p>
    </motion.div>
  );
}
