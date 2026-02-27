"use client";

import { motion } from "framer-motion";
import type { ComplianceData } from "@/lib/mockBankingData";

interface CompliancePanelProps {
  data: ComplianceData[];
  onClick?: () => void;
}

function getStatusColor(status: ComplianceData["status"]): string {
  switch (status) {
    case "compliant":
      return "bg-emerald-500/40 text-emerald-400";
    case "pending":
      return "bg-amber-500/40 text-amber-400";
    case "overdue":
      return "bg-red-500/40 text-red-400";
    default:
      return "bg-slate-500/40 text-slate-400";
  }
}

export function CompliancePanel({ data, onClick }: CompliancePanelProps) {
  const compliantCount = data.filter((d) => d.status === "compliant").length;
  const totalAlerts = data.reduce((s, d) => s + d.amlAlertCount + d.sanctionsHits, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full cursor-pointer hover:border-cyan-500/30 transition-colors"
      onClick={onClick}
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-between">
        <span>Compliance & Regulatory</span>
        <span className="text-cyan-500/80 text-[10px]">View details →</span>
      </h3>
      <div className="flex gap-3 mb-3">
        <div className="flex-1 rounded-lg bg-slate-800/50 px-3 py-2">
          <div className="text-[10px] text-slate-500 uppercase">Compliant</div>
          <div className="text-lg font-bold text-emerald-400">{compliantCount}/{data.length}</div>
        </div>
        <div className="flex-1 rounded-lg bg-slate-800/50 px-3 py-2">
          <div className="text-[10px] text-slate-500 uppercase">AML Alerts</div>
          <div className="text-lg font-bold text-amber-400">{totalAlerts}</div>
        </div>
      </div>
      <div className="space-y-2">
        {data.slice(0, 4).map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-[10px] py-1.5 border-b border-slate-700/50 last:border-0"
          >
            <span className="text-slate-300">{d.regulation}</span>
            <span className={`px-2 py-0.5 rounded ${getStatusColor(d.status)}`}>
              {d.status}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
