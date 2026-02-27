"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { GrowthData } from "@/lib/mockBankingData";

interface GrowthPanelProps {
  data: GrowthData;
  onClick?: () => void;
}

const CHANNEL_COLORS = ["#22d3ee", "#38bdf8", "#64748b", "#94a3b8"];

export function GrowthPanel({ data, onClick }: GrowthPanelProps) {
  const chartData = data.channelSplit.map((d) => ({
    name: d.channel,
    value: Math.round(d.share * 10) / 10,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full cursor-pointer hover:border-cyan-500/30 transition-colors"
      onClick={onClick}
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-between">
        <span>Growth & Performance</span>
        <span className="text-cyan-500/80 text-[10px]">View details →</span>
      </h3>
      <div className="flex gap-3 mb-3">
        <div className="flex-1 rounded-lg bg-slate-800/50 px-2 py-2">
          <div className="text-[9px] text-slate-500 uppercase">Advances Growth</div>
          <div className="text-sm font-bold text-cyan-400">{data.advancesGrowth}%</div>
        </div>
        <div className="flex-1 rounded-lg bg-slate-800/50 px-2 py-2">
          <div className="text-[9px] text-slate-500 uppercase">CASA Ratio</div>
          <div className="text-sm font-bold text-cyan-400">{data.casaRatio}%</div>
        </div>
        <div className="flex-1 rounded-lg bg-slate-800/50 px-2 py-2">
          <div className="text-[9px] text-slate-500 uppercase">Digital</div>
          <div className="text-sm font-bold text-cyan-400">{data.digitalAdoption}%</div>
        </div>
      </div>
      <div className="h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={55}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} fillOpacity={0.8} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value}%`, "Share"]}
            />
            <Legend wrapperStyle={{ fontSize: "9px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
