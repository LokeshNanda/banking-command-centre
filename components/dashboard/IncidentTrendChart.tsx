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
import type { IncidentTrend } from "@/lib/mockBankingData";

interface IncidentTrendChartProps {
  data: IncidentTrend[];
}

export function IncidentTrendChart({ data }: IncidentTrendChartProps) {
  const categories = [...new Set(data.map((d) => d.category))];
  const byMonth = data.reduce<Record<string, Record<string, number | string>>>((acc, d) => {
    if (!acc[d.month]) acc[d.month] = { month: d.month };
    acc[d.month][d.category] = d.count;
    return acc;
  }, {});

  const MONTH_ORDER = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const chartData = MONTH_ORDER.filter((m) => byMonth[m]).map((m) => ({
    ...byMonth[m],
    month: m,
  }));

  const colors = ["#22d3ee", "#f87171", "#fbbf24", "#34d399", "#94a3b8"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Incident Trend by Category
      </h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 9 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 9 }} />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "9px" }} />
            {categories.map((cat, i) => (
              <Line
                key={cat}
                type="monotone"
                dataKey={cat}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[i % colors.length], r: 2 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
