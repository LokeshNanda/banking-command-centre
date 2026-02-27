"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAlertHistory, clearAlertHistory, type AlertHistoryEntry } from "@/lib/alertHistory";

interface AlertHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const today = now.toDateString() === d.toDateString();
  if (today) {
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AlertHistoryPanel({ isOpen, onClose }: AlertHistoryPanelProps) {
  const [entries, setEntries] = useState<AlertHistoryEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      setEntries(getAlertHistory());
    }
  }, [isOpen]);

  const handleClear = () => {
    clearAlertHistory();
    setEntries([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-panel p-6 z-50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Alert History</h3>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Timeline of threshold breaches. Stored in browser.
            </p>

            <div className="overflow-y-auto max-h-[calc(100vh-12rem)] space-y-2">
              {entries.length === 0 ? (
                <p className="text-slate-500 text-sm py-8 text-center">No breach history yet.</p>
              ) : (
                entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`
                      p-3 rounded-lg border-l-4
                      ${entry.status === "critical" ? "border-red-500 bg-red-900/20" : "border-amber-500 bg-amber-900/20"}
                    `}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-sm font-medium text-slate-200">{entry.kpiLabel}</span>
                      <span
                        className={`text-xs font-semibold shrink-0 ${
                          entry.status === "critical" ? "text-red-400" : "text-amber-400"
                        }`}
                      >
                        {entry.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Crossed at {entry.value}
                      {entry.kpiKey.includes("Percent") ? "%" : ""}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{formatTimestamp(entry.timestamp)}</p>
                  </div>
                ))
              )}
            </div>

            {entries.length > 0 && (
              <button
                onClick={handleClear}
                className="mt-4 w-full py-2 text-sm text-slate-400 hover:text-white border border-slate-600 rounded-lg"
              >
                Clear History
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
