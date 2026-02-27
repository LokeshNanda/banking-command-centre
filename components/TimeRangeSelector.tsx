"use client";

export type TimeRange = "today" | "mtd" | "qtd" | "ytd";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const OPTIONS: { value: TimeRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "mtd", label: "MTD" },
  { value: "qtd", label: "QTD" },
  { value: "ytd", label: "YTD" },
];

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex rounded-lg border border-slate-600/50 overflow-hidden">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-xs transition-colors ${
            value === opt.value
              ? "bg-cyan-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
