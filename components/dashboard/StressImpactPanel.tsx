"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";
import type { StressScenario } from "@/lib/mockBankingData";

interface StressImpactPanelProps {
  data: StressScenario[];
}

export function StressImpactPanel({ data }: StressImpactPanelProps) {
  const chartData = data.map((d) => ({
    name: d.scenario,
    lcr: d.lcrImpact,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Stress Impact Simulator
      </h3>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 9 }}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 9 }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 120]}
            />
            <ReferenceLine y={100} stroke="#64748b" strokeDasharray="3 3" />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value}% LCR`, ""]}
            />
            <Bar
              dataKey="lcr"
              fill="#22d3ee"
              fillOpacity={0.7}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[9px] text-slate-500 mt-2">Dashed line: regulatory minimum</p>
    </motion.div>
  );
}
