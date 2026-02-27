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

interface BranchNetworkPanelProps {
  data: BranchNetworkData[];
  onClick?: () => void;
}

export function BranchNetworkPanel({ data, onClick }: BranchNetworkPanelProps) {
  const byRegion = data.reduce<Record<string, { deposits: number; advances: number; count: number }>>((acc, d) => {
    if (!acc[d.region]) acc[d.region] = { deposits: 0, advances: 0, count: 0 };
    acc[d.region].deposits += d.deposits;
    acc[d.region].advances += d.advances;
    acc[d.region].count += 1;
    return acc;
  }, {});

  const chartData = Object.entries(byRegion).map(([region, v]) => ({
    name: region,
    deposits: Math.round(v.deposits / 1000),
    advances: Math.round(v.advances / 1000),
  }));

  const avgAtmUtil = data.reduce((s, d) => s + d.atmUtilisation, 0) / data.length;
  const avgConversion = data.reduce((s, d) => s + d.footfallConversion, 0) / data.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full cursor-pointer hover:border-cyan-500/30 transition-colors"
      onClick={onClick}
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-between">
        <span>Branch & Network</span>
        <span className="text-cyan-500/80 text-[10px]">View details →</span>
      </h3>
      <div className="flex gap-3 mb-3">
        <div className="flex-1 rounded-lg bg-slate-800/50 px-2 py-2">
          <div className="text-[9px] text-slate-500 uppercase">ATM Util</div>
          <div className="text-sm font-bold text-cyan-400">{avgAtmUtil.toFixed(0)}%</div>
        </div>
        <div className="flex-1 rounded-lg bg-slate-800/50 px-2 py-2">
          <div className="text-[9px] text-slate-500 uppercase">Conversion</div>
          <div className="text-sm font-bold text-cyan-400">{avgConversion.toFixed(1)}%</div>
        </div>
      </div>
      <div className="h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 9 }}
            />
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
            <Bar dataKey="deposits" fill="#22d3ee" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
            <Bar dataKey="advances" fill="#64748b" fillOpacity={0.6} radius={[4, 4, 0, 0]} />
            <Legend wrapperStyle={{ fontSize: "9px" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
