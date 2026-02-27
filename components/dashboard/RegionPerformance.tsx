"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { BranchNetworkData } from "@/lib/mockBankingData";

interface RegionPerformanceProps {
  data: BranchNetworkData[];
}

export function RegionPerformance({ data }: RegionPerformanceProps) {
  const byRegion = data.reduce<Record<string, { deposits: number; advances: number; crossSell: number }>>(
    (acc, d) => {
      if (!acc[d.region]) acc[d.region] = { deposits: 0, advances: 0, crossSell: 0 };
      acc[d.region].deposits += d.deposits;
      acc[d.region].advances += d.advances;
      acc[d.region].crossSell += d.crossSellCount;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(byRegion).map(([name, v]) => ({
    name,
    deposits: Math.round(v.deposits / 1000),
    advances: Math.round(v.advances / 1000),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Region Performance
      </h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 9 }} />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 9 }}
              tickFormatter={(v) => `${v}K`}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`₹${value}K Cr`, ""]}
            />
            <Legend wrapperStyle={{ fontSize: "9px" }} />
            <Bar dataKey="deposits" fill="#22d3ee" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
            <Bar dataKey="advances" fill="#64748b" fillOpacity={0.6} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
