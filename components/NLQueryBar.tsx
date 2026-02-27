"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { processQuery } from "@/lib/nlQuery";
import type { ExtendedMetricsPayload } from "@/lib/mockBankingData";

interface NLQueryBarProps {
  data: ExtendedMetricsPayload;
}

const SUGGESTED_QUERIES = [
  "What's driving NPA in the North?",
  "Summarise liquidity position",
  "Customer churn risk",
  "Fraud anomalies today",
  "Growth and NIM outlook",
];

export function NLQueryBar({ data }: NLQueryBarProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ narrative: string; suggestedChart?: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (isOpen && ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = processQuery(query, data);
    setResult({ narrative: res.narrative, suggestedChart: res.suggestedChart });
  };

  const handleSuggestedClick = (q: string) => {
    setQuery(q);
    const res = processQuery(q, data);
    setResult({ narrative: res.narrative, suggestedChart: res.suggestedChart });
  };

  const navigateToChart = () => {
    if (result?.suggestedChart) {
      router.push(`/dashboard/${result.suggestedChart}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600/50 hover:border-cyan-500/50 bg-slate-800/30 text-slate-400 hover:text-cyan-400 transition-colors w-full max-w-md"
      >
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="text-sm">Ask: NPA, liquidity, churn, fraud...</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass-panel p-4 z-50 max-w-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What's driving NPA in the North?"
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                autoFocus
              />
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUERIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSuggestedClick(q)}
                    className="px-3 py-1 text-xs rounded-full border border-slate-600 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </form>

            {result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 pt-4 border-t border-slate-700"
              >
                <p className="text-sm text-slate-300 leading-relaxed">{result.narrative}</p>
                {result.suggestedChart && (
                  <button
                    onClick={navigateToChart}
                    className="mt-3 text-xs text-cyan-500 hover:text-cyan-400"
                  >
                    Drill into {result.suggestedChart.replace("-", " ")} →
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
