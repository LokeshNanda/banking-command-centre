"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { LiquidityData } from "@/lib/mockBankingData";

interface LiquidityPanelProps {
  data: LiquidityData[];
}

export function LiquidityPanel({ data }: LiquidityPanelProps) {
  const chartData = data.map((d) => ({
    name: d.maturityBucket,
    assets: d.assets,
    liabilities: d.liabilities,
    gap: d.gap,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Liquidity & ALM Snapshot
      </h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 60, bottom: 0 }}
          >
            <XAxis
              type="number"
              tick={{ fill: "#94a3b8", fontSize: 9 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={55}
              tick={{ fill: "#94a3b8", fontSize: 9 }}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`₹${(value / 1000).toFixed(1)}K Cr`, ""]}
              labelFormatter={(label) => label}
            />
            <Bar dataKey="assets" fill="#22d3ee" fillOpacity={0.7} radius={[0, 4, 4, 0]} />
            <Bar dataKey="liabilities" fill="#64748b" fillOpacity={0.6} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-2 text-[10px]">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-cyan-500" />
          Assets
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-slate-500" />
          Liabilities
        </span>
      </div>
    </motion.div>
  );
}
