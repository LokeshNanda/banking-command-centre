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
import type { OperationalRiskData } from "@/lib/mockBankingData";

interface OperationalRiskPanelProps {
  data: OperationalRiskData[];
  onClick?: () => void;
}

function getKriColor(status: OperationalRiskData["kriStatus"]): string {
  switch (status) {
    case "green":
      return "#22d3ee";
    case "amber":
      return "#fbbf24";
    case "red":
      return "#f87171";
    default:
      return "#64748b";
  }
}

export function OperationalRiskPanel({ data, onClick }: OperationalRiskPanelProps) {
  const chartData = data.map((d) => ({
    name: d.category,
    incidents: d.incidentCount,
    loss: d.lossAmount,
    status: d.kriStatus,
  }));

  const totalIncidents = data.reduce((s, d) => s + d.incidentCount, 0);
  const totalLoss = data.reduce((s, d) => s + d.lossAmount, 0);
  const redCount = data.filter((d) => d.kriStatus === "red").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full cursor-pointer hover:border-cyan-500/30 transition-colors"
      onClick={onClick}
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-between">
        <span>Operational Risk</span>
        <span className="text-cyan-500/80 text-[10px]">View details →</span>
      </h3>
      <div className="flex gap-3 mb-3">
        <div className="flex-1 rounded-lg bg-slate-800/50 px-3 py-2">
          <div className="text-[10px] text-slate-500 uppercase">Incidents</div>
          <div className="text-lg font-bold text-slate-200">{totalIncidents}</div>
        </div>
        <div className="flex-1 rounded-lg bg-slate-800/50 px-3 py-2">
          <div className="text-[10px] text-slate-500 uppercase">Loss (Cr)</div>
          <div className="text-lg font-bold text-amber-400">₹{totalLoss.toFixed(0)}</div>
        </div>
        {redCount > 0 && (
          <div className="flex-1 rounded-lg bg-red-500/20 px-3 py-2">
            <div className="text-[10px] text-slate-500 uppercase">KRI Red</div>
            <div className="text-lg font-bold text-red-400">{redCount}</div>
          </div>
        )}
      </div>
      <div className="h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 9 }}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 9 }}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string) => [
                name === "incidents" ? value : `₹${value.toFixed(1)} Cr`,
                name === "incidents" ? "Incidents" : "Loss",
              ]}
            />
            <Bar dataKey="incidents" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={getKriColor(entry.status)} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-2 text-[10px]">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-cyan-500" />
          Green
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-amber-500" />
          Amber
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-red-500" />
          Red
        </span>
      </div>
    </motion.div>
  );
}
