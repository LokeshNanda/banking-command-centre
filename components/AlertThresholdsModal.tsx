"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getThresholds, setThresholds, resetThresholds, type KpiThresholds } from "@/lib/alertThresholds";
import { useToast } from "@/contexts/ToastContext";

interface AlertThresholdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const THRESHOLD_FIELDS: {
  key: keyof KpiThresholds;
  label: string;
  warningLabel: string;
  criticalLabel: string;
  invert?: boolean;
}[] = [
  { key: "grossNpaPercent", label: "Gross NPA %", warningLabel: "Warning ≥", criticalLabel: "Critical ≥" },
  { key: "nimPercent", label: "NIM %", warningLabel: "Warning <", criticalLabel: "Critical <", invert: true },
  { key: "lcrPercent", label: "LCR %", warningLabel: "Warning <", criticalLabel: "Critical <", invert: true },
  { key: "churnRiskPercent", label: "Churn Risk %", warningLabel: "Warning ≥", criticalLabel: "Critical ≥" },
  { key: "enterpriseRiskIndex", label: "Enterprise Risk Index", warningLabel: "Warning ≥", criticalLabel: "Critical ≥" },
];

function getInitialThresholds(): KpiThresholds {
  if (typeof window === "undefined") return {};
  return getThresholds();
}

export function AlertThresholdsModal({ isOpen, onClose, onSave }: AlertThresholdsModalProps) {
  const [thresholds, setThresholdsState] = useState<KpiThresholds>(getInitialThresholds);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setThresholdsState(getThresholds());
    }
  }, [isOpen]);

  const handleSave = () => {
    setThresholds(thresholds);
    toast("Alert thresholds saved", "success");
    onSave?.();
    onClose();
  };

  const handleReset = () => {
    resetThresholds();
    setThresholdsState(getThresholds());
    toast("Thresholds reset to default", "info");
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-[85vh] max-h-[85vh] flex flex-col overflow-hidden glass-panel z-50"
          >
            <div className="p-4 pb-2 shrink-0">
              <h3 className="text-lg font-bold text-white mb-1">Configurable Alert Thresholds</h3>
              <p className="text-xs text-slate-400">
                Set warning and critical values per KPI. Click Save to apply.
              </p>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 py-2 alert-thresholds-scroll">
              <div className="space-y-3">
                {THRESHOLD_FIELDS.map(({ key, label, warningLabel, criticalLabel }) => {
                  const t = thresholds[key];
                  if (!t) return null;
                  return (
                    <div key={key} className="space-y-1.5 p-2.5 rounded-lg bg-slate-800/30">
                      <p className="text-sm font-medium text-slate-200">{label}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-500">{warningLabel}</label>
                          <input
                            type="number"
                            step="0.1"
                            value={t.warning}
                            onChange={(e) =>
                              setThresholdsState((prev) => ({
                                ...prev,
                                [key]: { ...prev[key]!, warning: parseFloat(e.target.value) || 0 },
                              }))
                            }
                            className="w-full mt-0.5 px-2 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500">{criticalLabel}</label>
                          <input
                            type="number"
                            step="0.1"
                            value={t.critical}
                            onChange={(e) =>
                              setThresholdsState((prev) => ({
                                ...prev,
                                [key]: { ...prev[key]!, critical: parseFloat(e.target.value) || 0 },
                              }))
                            }
                            className="w-full mt-0.5 px-2 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Footer - always visible at bottom */}
            <div className="p-4 pt-3 border-t border-slate-700/50 bg-slate-800/50 shrink-0">
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-600 rounded-lg"
                >
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
