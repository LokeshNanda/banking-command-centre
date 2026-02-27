"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MeetingModeProps {
  isActive: boolean;
  onExit: () => void;
  kpis: {
    totalAdvances: number;
    grossNpaPercent: number;
    nimPercent: number;
    lcrPercent: number;
    churnRiskPercent: number;
    enterpriseRiskIndex: number;
  };
  insights: string[];
  topRiskHighlight?: string;
}

const SLIDES = [
  { id: "kpis", label: "Executive KPIs" },
  { id: "insights", label: "AI Insights" },
  { id: "risk", label: "Risk Highlight" },
];

const ADVANCE_INTERVAL_MS = 8000;

export function MeetingMode({
  isActive,
  onExit,
  kpis,
  insights,
  topRiskHighlight = "Monitor NPA trajectory in Retail and MSME segments.",
}: MeetingModeProps) {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDES.length);
    }, ADVANCE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isActive]);

  if (!isActive) return null;

  const slide = SLIDES[slideIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col">
      <button
        onClick={onExit}
        className="absolute top-4 right-4 z-10 px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-600 rounded-lg"
      >
        Exit Meeting Mode (M)
      </button>

      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <AnimatePresence mode="wait">
          {slide.id === "kpis" && (
            <motion.div
              key="kpis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl"
            >
              <h2 className="text-2xl text-slate-400 mb-8 uppercase tracking-widest">
                Executive KPIs
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-slate-500 text-sm mb-1">Total Advances</p>
                  <p className="text-4xl font-bold text-cyan-400">
                    ₹{(kpis.totalAdvances / 1000).toFixed(1)}K Cr
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Gross NPA %</p>
                  <p
                    className={`text-4xl font-bold ${
                      kpis.grossNpaPercent >= 6
                        ? "text-red-400"
                        : kpis.grossNpaPercent >= 4
                          ? "text-amber-400"
                          : "text-cyan-400"
                    }`}
                  >
                    {kpis.grossNpaPercent}%
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">NIM %</p>
                  <p className="text-4xl font-bold text-cyan-400">{kpis.nimPercent}%</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">LCR %</p>
                  <p className="text-4xl font-bold text-cyan-400">{kpis.lcrPercent}%</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Churn Risk %</p>
                  <p className="text-4xl font-bold text-cyan-400">{kpis.churnRiskPercent}%</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Enterprise Risk Index</p>
                  <p className="text-4xl font-bold text-cyan-400">
                    {kpis.enterpriseRiskIndex.toFixed(1)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          {slide.id === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl"
            >
              <h2 className="text-2xl text-slate-400 mb-8 uppercase tracking-widest">
                AI Executive Insights
              </h2>
              <ul className="space-y-4 text-left">
                {insights.slice(0, 4).map((insight, i) => (
                  <li key={i} className="text-xl text-slate-200 flex gap-3">
                    <span className="text-cyan-500">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          {slide.id === "risk" && (
            <motion.div
              key="risk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl"
            >
              <h2 className="text-2xl text-slate-400 mb-8 uppercase tracking-widest">
                Key Risk Highlight
              </h2>
              <p className="text-3xl text-amber-400 font-medium">{topRiskHighlight}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 pb-8">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSlideIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === slideIndex ? "bg-cyan-500" : "bg-slate-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
