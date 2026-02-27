"use client";

export type ViewPreset = "default" | "cro" | "cfo" | "cdo";

interface ViewPresetSelectorProps {
  value: ViewPreset;
  onChange: (preset: ViewPreset) => void;
}

const PRESETS: { value: ViewPreset; label: string }[] = [
  { value: "default", label: "All" },
  { value: "cro", label: "CRO" },
  { value: "cfo", label: "CFO" },
  { value: "cdo", label: "CDO" },
];

export function ViewPresetSelector({ value, onChange }: ViewPresetSelectorProps) {
  return (
    <div className="flex rounded-lg border border-slate-600/50 overflow-hidden">
      {PRESETS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-xs transition-colors ${
            value === opt.value
              ? "bg-cyan-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
          title={
            opt.value === "cro"
              ? "Chief Risk Officer: Risk-focused panels"
              : opt.value === "cfo"
                ? "Chief Financial Officer: Finance & liquidity"
                : opt.value === "cdo"
                  ? "Chief Digital Officer: Growth & customer"
                  : "All panels"
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
