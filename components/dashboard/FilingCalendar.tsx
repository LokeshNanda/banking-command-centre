"use client";

import { motion } from "framer-motion";
import type { FilingCalendarEntry } from "@/lib/mockBankingData";

interface FilingCalendarProps {
  data: FilingCalendarEntry[];
}

function getStatusColor(status: string): string {
  switch (status) {
    case "on_track":
      return "bg-emerald-500/40 text-emerald-400 border-emerald-500/50";
    case "at_risk":
      return "bg-amber-500/40 text-amber-400 border-amber-500/50";
    case "overdue":
      return "bg-red-500/40 text-red-400 border-red-500/50";
    default:
      return "bg-slate-500/40 text-slate-400 border-slate-500/50";
  }
}

export function FilingCalendar({ data }: FilingCalendarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Regulatory Filing Tracker
      </h3>
      <div className="space-y-3">
        {data.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/30 border border-slate-700/50"
          >
            <div>
              <span className="text-sm font-medium text-slate-200">{f.name}</span>
              <p className="text-[10px] text-slate-500">Due {f.due}</p>
            </div>
            <span
              className={`px-2 py-1 rounded text-[10px] uppercase font-medium border ${getStatusColor(
                f.status
              )}`}
            >
              {f.status.replace("_", " ")}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
