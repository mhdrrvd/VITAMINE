import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#FF6B00",
          hover: "#E05E00",
          light: "#FFF3EB",
        },
        status: {
          success: "#10B981",
          danger: "#E11D48",
          warning: "#F59E0B",
          purple: "#8B5CF6",
        },
        slate: {
          850: "#151D2A",
          950: "#0B0F17",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        card: "0 2px 4px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)",
        "card-hover": "0 12px 20px -4px rgba(255, 107, 0, 0.15), 0 4px 6px -2px rgba(15, 23, 42, 0.05)",
        drawer: "-4px 0 24px rgba(15, 23, 42, 0.08)",
        modal: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
        "glow-citrus": "0 0 24px rgba(255, 107, 0, 0.4)",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
    },
  },
  plugins: [],
};

export default config;
