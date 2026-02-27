"use client";

import { motion } from "framer-motion";
import type { ComplianceData } from "@/lib/mockBankingData";

interface AMLQueueStatusProps {
  data: ComplianceData[];
}

export function AMLQueueStatus({ data }: AMLQueueStatusProps) {
  const aml = data.find((c) => c.regulation === "AML/KYC");
  const totalAlerts = data.reduce((s, c) => s + c.amlAlertCount, 0);
  const totalSanctions = data.reduce((s, c) => s + c.sanctionsHits, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        AML Queue Status
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-slate-800/50 px-4 py-3 border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase">Alert Queue</p>
          <p className="text-2xl font-bold text-amber-400">{totalAlerts}</p>
          <p className="text-[9px] text-slate-600 mt-1">Pending review</p>
        </div>
        <div className="rounded-lg bg-slate-800/50 px-4 py-3 border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase">Sanctions Hits</p>
          <p className="text-2xl font-bold text-cyan-400">{totalSanctions}</p>
          <p className="text-[9px] text-slate-600 mt-1">This period</p>
        </div>
      </div>
      {aml && (
        <p className="text-[10px] text-slate-500 mt-3">
          Status: {aml.status} · Filing due {aml.filingDueDate}
        </p>
      )}
    </motion.div>
  );
}
