"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { PeerBenchmark } from "@/lib/mockBankingData";

interface PeerBenchmarkOverlayProps {
  data: PeerBenchmark[];
}

function formatValue(metric: string, value: number): string {
  if (metric.includes("NPA") || metric.includes("NIM") || metric.includes("LCR")) {
    return `${value.toFixed(1)}%`;
  }
  return value.toFixed(1);
}

export function PeerBenchmarkOverlay({ data }: PeerBenchmarkOverlayProps) {
  const [visible, setVisible] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs uppercase tracking-widest text-slate-400">
          Peer Benchmark Overlay
        </h3>
        <button
          onClick={() => setVisible((v) => !v)}
          className="text-[10px] text-cyan-500 hover:text-cyan-400"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {visible && (
        <div className="space-y-3">
          {data.map((b) => {
            const isAboveMedian =
              (b.metric.includes("NIM") || b.metric.includes("LCR")
                ? b.bankValue >= b.peerMedian
                : b.bankValue <= b.peerMedian);
            return (
              <div
                key={b.metric}
                className="flex justify-between items-center py-2 px-3 rounded-lg bg-slate-800/30"
              >
                <span className="text-xs text-slate-400">{b.metric}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-cyan-400 font-medium">
                    You: {formatValue(b.metric, b.bankValue)}
                  </span>
                  <span className="text-slate-500">
                    Peer median: {formatValue(b.metric, b.peerMedian)}
                  </span>
                  <span
                    className={
                      isAboveMedian ? "text-emerald-400" : "text-amber-400"
                    }
                  >
                    {isAboveMedian ? "↑" : "↓"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
