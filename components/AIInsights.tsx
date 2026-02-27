"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

interface AIInsightsProps {
  insights: string[];
}

const INSIGHT_TO_DASHBOARD: Record<string, string> = {
  npa: "credit-risk",
  npas: "credit-risk",
  credit: "credit-risk",
  retail: "credit-risk",
  msme: "credit-risk",
  liquidity: "liquidity",
  lcr: "liquidity",
  churn: "customer-profitability",
  customer: "customer-profitability",
  fraud: "fraud",
  aml: "compliance",
  collections: "collections",
  recovery: "collections",
  var: "treasury",
  treasury: "treasury",
  branch: "branch-network",
  operational: "operational-risk",
};

function suggestDashboard(insight: string): string | null {
  const lower = insight.toLowerCase();
  for (const [keyword, slug] of Object.entries(INSIGHT_TO_DASHBOARD)) {
    if (lower.includes(keyword)) return slug;
  }
  return null;
}

export function AIInsights({ insights }: AIInsightsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [createdTasks, setCreatedTasks] = useState<Set<number>>(new Set());

  const handleCreateTask = (insight: string, index: number) => {
    setCreatedTasks((prev) => new Set(prev).add(index));
    toast(`Task created: Review — ${insight.slice(0, 50)}${insight.length > 50 ? "…" : ""}`, "success");
  };

  const handleScheduleReview = (insight: string, index: number) => {
    const slug = suggestDashboard(insight);
    if (slug) {
      router.push(`/dashboard/${slug}`);
      toast("Navigated to relevant dashboard", "info");
    } else {
      toast("Review scheduled for next ALCO meeting", "success");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-4 h-full"
    >
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
        AI Executive Insights
      </h3>
      <ul className="space-y-3">
        {insights.map((insight, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="group"
          >
            <div className="flex gap-2">
              <span className="text-cyan-500 shrink-0">•</span>
              <span className="text-sm text-slate-300 leading-relaxed flex-1">{insight}</span>
            </div>
            <div className="flex gap-2 mt-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleCreateTask(insight, i)}
                className="text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-slate-600 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {createdTasks.has(i) ? "✓ Task created" : "Create task"}
              </button>
              <button
                onClick={() => handleScheduleReview(insight, i)}
                className="text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-slate-600 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                Schedule review
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
