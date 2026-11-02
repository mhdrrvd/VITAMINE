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
        // Palette from user image
        vitamine: {
          midnight: "#051F20",
          pine: "#0B2B26",
          evergreen: "#163832",
          forest: "#235347",
          sage: "#8EB69B",
          mint: "#DAF1DE",
        },
        brand: {
          primary: "#235347", // Forest green primary
          hover: "#163832",   // Dark evergreen hover
          light: "#DAF1DE",   // Soft pastel mint
          accent: "#8EB69B",  // Sage mint
          dark: "#0B2B26",    // Deep pine green sidebar
        },
        status: {
          success: "#235347",
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
        card: "0 2px 4px rgba(11, 43, 38, 0.04), 0 1px 2px rgba(11, 43, 38, 0.02)",
        "card-hover": "0 12px 20px -4px rgba(35, 83, 71, 0.15), 0 4px 6px -2px rgba(11, 43, 38, 0.05)",
        drawer: "-4px 0 24px rgba(11, 43, 38, 0.08)",
        modal: "0 25px 50px -12px rgba(5, 31, 32, 0.25)",
        "glow-green": "0 0 24px rgba(35, 83, 71, 0.35)",
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
