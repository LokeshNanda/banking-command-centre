"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface StressScenarioSimulatorProps {
  baseLcr: number;
  baseNpa: number;
  baseNim: number;
}

export function StressScenarioSimulator({
  baseLcr,
  baseNpa,
  baseNim,
}: StressScenarioSimulatorProps) {
  const [lcrShock, setLcrShock] = useState(0);
  const [npaShock, setNpaShock] = useState(0);
  const [depositRun, setDepositRun] = useState(0);

  // Simulate impact: LCR drops with liquidity shock, NPA rises with credit shock, deposit run affects LCR
  const impactedLcr = Math.max(0, baseLcr - lcrShock * 2 - depositRun * 1.5);
  const impactedNpa = Math.min(15, baseNpa + npaShock * 0.5);
  const impactedNim = Math.max(1, baseNim - npaShock * 0.1 - depositRun * 0.05);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Stress Scenario Simulator
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>LCR Shock (%)</span>
            <span>{lcrShock}</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            value={lcrShock}
            onChange={(e) => setLcrShock(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>NPA Shock (%)</span>
            <span>{npaShock}</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={npaShock}
            onChange={(e) => setNpaShock(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Deposit Run (%)</span>
            <span>{depositRun}</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={depositRun}
            onChange={(e) => setDepositRun(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
        </div>
        <div className="pt-3 border-t border-slate-700/50 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Impacted LCR</span>
            <span
              className={
                impactedLcr < 90
                  ? "text-red-400 font-bold"
                  : impactedLcr < 100
                    ? "text-amber-400"
                    : "text-cyan-400"
              }
            >
              {impactedLcr.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Impacted NPA</span>
            <span
              className={
                impactedNpa >= 6
                  ? "text-red-400 font-bold"
                  : impactedNpa >= 4
                    ? "text-amber-400"
                    : "text-cyan-400"
              }
            >
              {impactedNpa.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Impacted NIM</span>
            <span className="text-cyan-400">{impactedNim.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
