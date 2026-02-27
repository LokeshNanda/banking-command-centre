import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: "#0f172a",
          light: "#1e293b",
          dark: "#020617",
        },
        neon: {
          cyan: "#22d3ee",
          blue: "#38bdf8",
        },
        glow: {
          cyan: "rgba(34, 211, 238, 0.4)",
          amber: "rgba(251, 191, 36, 0.4)",
          red: "rgba(248, 113, 113, 0.4)",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glow-cyan": "0 0 20px rgba(34, 211, 238, 0.3)",
        "glow-amber": "0 0 20px rgba(251, 191, 36, 0.3)",
        "glow-red": "0 0 20px rgba(248, 113, 113, 0.3)",
      },
      backdropBlur: {
        glass: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
