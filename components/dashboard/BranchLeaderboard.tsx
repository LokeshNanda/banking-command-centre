"use client";

import { motion } from "framer-motion";

interface BranchLeaderboardProps {
  data: { branchId: string; region: string; score: number; deposits: number; advances: number }[];
}

export function BranchLeaderboard({ data }: BranchLeaderboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4">
        Branch Leaderboard
      </h3>
      <div className="space-y-2 max-h-[220px] overflow-y-auto">
        {data.slice(0, 8).map((b, i) => (
          <motion.div
            key={b.branchId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/30 border border-slate-700/50"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                  i < 3 ? "bg-cyan-500/30 text-cyan-400" : "bg-slate-600/50 text-slate-400"
                }`}
              >
                {i + 1}
              </span>
              <span className="text-sm font-medium text-slate-200">{b.branchId}</span>
              <span className="text-[10px] text-slate-500">{b.region}</span>
            </div>
            <span className="text-sm text-cyan-400 font-medium">
              ₹{(b.deposits / 1000).toFixed(1)}K
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
