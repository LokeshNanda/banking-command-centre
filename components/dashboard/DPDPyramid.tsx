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

interface DPDPyramidProps {
  data: CollectionsData[];
}

export function DPDPyramid({ data }: DPDPyramidProps) {
  const chartData = data.map((d) => ({
    name: d.bucket,
    recovery: d.recoveryRate,
    efficiency: d.collectionEfficiency,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        DPD Aging Pyramid
      </h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
            <XAxis
              type="number"
              tick={{ fill: "#94a3b8", fontSize: 9 }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={45}
              tick={{ fill: "#94a3b8", fontSize: 9 }}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value}%`, "Recovery"]}
            />
            <Bar dataKey="recovery" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.recovery >= 60 ? "#22d3ee" : entry.recovery >= 40 ? "#fbbf24" : "#f87171"}
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
