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
  ReferenceLine,
} from "recharts";

interface ForecastDataPoint {
  month: string;
  npa: number;
  lcr: number;
}

interface NpaLiquidityForecastProps {
  currentNpa: number;
  currentLcr: number;
  sectorNpaTrend?: { sector: string; month: string; npaPercent: number }[];
}

function generateForecast(
  currentNpa: number,
  currentLcr: number
): ForecastDataPoint[] {
  const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const npaTrend = currentNpa <= 4 ? 0.05 : currentNpa <= 5 ? 0.08 : 0.12;
  const lcrTrend = currentLcr >= 120 ? -0.5 : currentLcr >= 110 ? -0.3 : -0.2;

  return months.map((month, i) => ({
    month,
    npa: Math.min(8, Math.round((currentNpa + (i + 1) * npaTrend) * 100) / 100),
    lcr: Math.max(85, Math.round((currentLcr + (i + 1) * lcrTrend) * 100) / 100),
  }));
}

export function NpaLiquidityForecast({
  currentNpa,
  currentLcr,
}: NpaLiquidityForecastProps) {
  const data = generateForecast(currentNpa, currentLcr);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        NPA & Liquidity Forecast
      </h3>
      <p className="text-[10px] text-slate-500 mb-3">
        If current trajectory holds · 6-month forward view
      </p>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 9 }} />
            <YAxis
              yAxisId="npa"
              orientation="left"
              tick={{ fill: "#f59e0b", fontSize: 9 }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 8]}
            />
            <YAxis
              yAxisId="lcr"
              orientation="right"
              tick={{ fill: "#22d3ee", fontSize: 9 }}
              tickFormatter={(v) => `${v}%`}
              domain={[80, 130]}
            />
            <ReferenceLine yAxisId="lcr" y={100} stroke="#64748b" strokeDasharray="3 3" />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string) => [
                `${value}%`,
                name === "npa" ? "NPA" : "LCR",
              ]}
              labelFormatter={(label) => label}
            />
            <Line
              yAxisId="npa"
              type="monotone"
              dataKey="npa"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: "#f59e0b" }}
              name="npa"
            />
            <Line
              yAxisId="lcr"
              type="monotone"
              dataKey="lcr"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={{ fill: "#22d3ee" }}
              name="lcr"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-2 text-[10px]">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-amber-500" />
          NPA %
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-cyan-500" />
          LCR %
        </span>
      </div>
    </motion.div>
  );
}
