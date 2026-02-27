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
import type { ProductHolding } from "@/lib/mockBankingData";

interface CrossSellMapProps {
  data: ProductHolding[];
}

export function CrossSellMap({ data }: CrossSellMapProps) {
  const byProduct = data.reduce<Record<string, number[]>>((acc, d) => {
    if (!acc[d.product]) acc[d.product] = [];
    acc[d.product].push(d.penetration);
    return acc;
  }, {});

  const chartData = Object.entries(byProduct).map(([product, vals]) => ({
    name: product,
    avg: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0,
  }));

  const colors = ["#22d3ee", "#38bdf8", "#64748b", "#94a3b8"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Cross-sell Opportunity Map
      </h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 9 }}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 9 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value.toFixed(1)}% penetration`, ""]}
            />
            <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
