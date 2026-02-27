"use client";

import { motion } from "framer-motion";

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-700/50 rounded animate-pulse" />
          <div className="h-4 w-48 bg-slate-700/30 rounded animate-pulse" />
        </div>
        <div className="h-4 w-32 bg-slate-700/30 rounded animate-pulse" />
      </div>

      {/* KPI Bar skeleton */}
      <div className="flex flex-wrap gap-4 md:gap-6 justify-between mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex-1 min-w-[120px] max-w-[200px] h-24 glass-panel rounded-xl animate-pulse"
          >
            <div className="p-4 space-y-2">
              <div className="h-3 w-20 bg-slate-600/50 rounded" />
              <div className="h-8 w-16 bg-slate-600/50 rounded" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.03 }}
            className={`glass-panel h-48 rounded-xl animate-pulse ${
              i === 1 ? "lg:col-span-2" : ""
            }`}
          >
            <div className="p-4 space-y-4">
              <div className="h-3 w-24 bg-slate-600/50 rounded" />
              <div className="flex-1 h-32 bg-slate-600/30 rounded" />
            </div>
          </motion.div>
        ))}
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 glass-panel h-32 rounded-xl animate-pulse">
          <div className="p-4 space-y-3">
            <div className="h-3 w-32 bg-slate-600/50 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-600/30 rounded" />
              <div className="h-4 w-4/5 bg-slate-600/30 rounded" />
              <div className="h-4 w-3/4 bg-slate-600/30 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
