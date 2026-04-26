/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        bg: {
          DEFAULT: "#05070d",
          panel: "#0a0f1a",
          card: "#0f1524",
          border: "#1b2335",
        },
        cyber: {
          cyan: "#22d3ee",
          green: "#34d399",
          violet: "#a78bfa",
          pink: "#f472b6",
          red: "#ef4444",
          yellow: "#fde047",
        },
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        glitch: "glitch 0.3s infinite",
        scan: "scan 6s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      boxShadow: {
        glow: "0 0 30px -5px rgba(34, 211, 238, 0.45)",
        "glow-violet": "0 0 30px -5px rgba(167, 139, 250, 0.45)",
      },
      backgroundImage: {
        "grid-cyan":
          "linear-gradient(rgba(34, 211, 238, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
