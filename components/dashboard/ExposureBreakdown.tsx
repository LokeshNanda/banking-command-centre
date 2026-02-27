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
import type { TreasuryData } from "@/lib/mockBankingData";

interface ExposureBreakdownProps {
  data: TreasuryData;
}

export function ExposureBreakdown({ data }: ExposureBreakdownProps) {
  const chartData = [
    { name: "VaR", value: data.varValue, color: "#22d3ee" },
    { name: "FX Exposure", value: data.fxExposure, color: "#38bdf8" },
    { name: "MTM P&L", value: Math.abs(data.mtmPnl), color: data.mtmPnl >= 0 ? "#34d399" : "#f87171" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Exposure Breakdown
      </h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} fillOpacity={0.8} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`₹${value.toFixed(1)} Cr`, ""]}
            />
            <Legend wrapperStyle={{ fontSize: "9px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
