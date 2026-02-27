"use client";

import { motion } from "framer-motion";
import type { CreditRiskData } from "@/lib/mockBankingData";
import { getNPARiskStatus } from "@/lib/riskScoring";

interface CreditRiskMapProps {
  data: CreditRiskData[];
}

function getHeatColor(npaPercent: number): string {
  const status = getNPARiskStatus(npaPercent);
  if (status === "critical") return "bg-red-500/60";
  if (status === "warning") return "bg-amber-500/50";
  return "bg-cyan-500/40";
}

export function CreditRiskMap({ data }: CreditRiskMapProps) {
  const regions = [...new Set(data.map((d) => d.region))];
  const sectors = [...new Set(data.map((d) => d.sector))];

  const getCell = (region: string, sector: string) =>
    data.find((d) => d.region === region && d.sector === sector);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        India Credit Risk Heatmap
      </h3>
      <div className="overflow-x-auto">
        <div className="min-w-[400px]">
          <div className="grid gap-1 grid-cols-[80px_repeat(4,1fr)]">
            <div className="p-1" />
            {sectors.slice(0, 4).map((s) => (
              <div
                key={s}
                className="text-[9px] uppercase text-slate-500 text-center truncate"
              >
                {s}
              </div>
            ))}
            {regions.map((region) => (
              <div key={region} className="contents">
                <div className="text-[10px] text-slate-400 py-1 flex items-center">
                  {region}
                </div>
                {sectors.slice(0, 4).map((sector) => {
                  const cell = getCell(region, sector);
                  if (!cell) return <div key={`${region}-${sector}`} />;
                  const heatClass = getHeatColor(cell.npaPercent);
                  return (
                    <motion.div
                      key={`${region}-${sector}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`${heatClass} rounded p-2 flex flex-col justify-center items-center min-h-[48px]`}
                      title={`NPA: ${cell.npaPercent}% | Exposure: ₹${(cell.exposure / 1000).toFixed(1)}K Cr`}
                    >
                      <span className="text-[10px] font-semibold text-white">
                        {cell.npaPercent}%
                      </span>
                      <span className="text-[8px] text-slate-300">
                        ₹{(cell.exposure / 1000).toFixed(0)}K
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
