"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { SectorNpaTrend } from "@/lib/mockBankingData";

interface SlippageTrendLineProps {
  data: SectorNpaTrend[];
}

const MONTH_ORDER = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

export function SlippageTrendLine({ data }: SlippageTrendLineProps) {
  const sectors = [...new Set(data.map((d) => d.sector))];
  const byMonth = data.reduce<Record<string, Record<string, number | string>>>((acc, d) => {
    if (!acc[d.month]) acc[d.month] = { month: d.month };
    acc[d.month][d.sector] = d.npaPercent;
    return acc;
  }, {});

  const chartData = MONTH_ORDER.filter((m) => byMonth[m]).map((m) => ({
    ...byMonth[m],
    month: m,
  }));

  const colors = ["#22d3ee", "#38bdf8", "#fbbf24", "#f87171"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Slippage Trend by Sector
      </h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#94a3b8", fontSize: 9 }}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 9 }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 10]}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value}%`, ""]}
            />
            <Legend wrapperStyle={{ fontSize: "9px" }} />
            {sectors.map((sector, i) => (
              <Line
                key={sector}
                type="monotone"
                dataKey={sector}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[i % colors.length], r: 3 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
