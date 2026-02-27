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
import type { CollectionsData } from "@/lib/mockBankingData";

interface CollectionsPanelProps {
  data: CollectionsData[];
  onClick?: () => void;
}

export function CollectionsPanel({ data, onClick }: CollectionsPanelProps) {
  const chartData = data.map((d) => ({
    name: d.bucket,
    recovery: d.recoveryRate,
    efficiency: d.collectionEfficiency,
    writeOff: d.writeOffAmount,
  }));

  const avgRecovery =
    data.reduce((s, d) => s + d.recoveryRate, 0) / data.length;
  const totalWriteOff = data.reduce((s, d) => s + d.writeOffAmount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full cursor-pointer hover:border-cyan-500/30 transition-colors"
      onClick={onClick}
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-between">
        <span>Collections & Recovery</span>
        <span className="text-cyan-500/80 text-[10px]">View details →</span>
      </h3>
      <div className="flex gap-4 mb-3">
        <div className="flex-1 rounded-lg bg-slate-800/50 px-3 py-2">
          <div className="text-[10px] text-slate-500 uppercase">Avg Recovery</div>
          <div className="text-lg font-bold text-cyan-400">{avgRecovery.toFixed(1)}%</div>
        </div>
        <div className="flex-1 rounded-lg bg-slate-800/50 px-3 py-2">
          <div className="text-[10px] text-slate-500 uppercase">Write-offs (Cr)</div>
          <div className="text-lg font-bold text-amber-400">₹{totalWriteOff.toFixed(0)}</div>
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
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, "Recovery"]}
            />
            <Bar dataKey="recovery" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={chartData[i].recovery >= 60 ? "#22d3ee" : chartData[i].recovery >= 40 ? "#fbbf24" : "#f87171"}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
