import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      /* App-wide black text outline. `paint-order: stroke fill` draws the
         stroke behind the glyph fill so text stays legible on both light
         honey and dark chocolate surfaces. */
      textStrokeWidth: {
        DEFAULT: "0.6px",
        strong: "0.9px",
      },
      textStrokeColor: {
        DEFAULT: "oklch(0.05 0.01 64)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        honey: "0 10px 30px -10px oklch(0.74 0.18 76 / 0.5)",
        "honey-lg": "0 18px 44px -14px oklch(0.74 0.18 76 / 0.58)",
        "honey-inset":
          "inset 0 1px 0 oklch(0.99 0.05 96 / 0.88), inset 0 -2px 6px oklch(0.5 0.15 60 / 0.58)",
        "card-warm": "0 12px 28px -16px oklch(0.05 0.01 60 / 0.9)",
        "card-warm-lg": "0 22px 48px -18px oklch(0.05 0.01 60 / 0.95)",
        "hex-glow":
          "0 0 0 1px oklch(0.74 0.18 76 / 0.38), 0 0 30px -6px oklch(0.8 0.17 82 / 0.45)",
        "comb-cell":
          "inset 0 1px 0 oklch(0.99 0.06 96 / 0.65), inset 0 -2px 5px oklch(0.46 0.13 58 / 0.6)",
        "comb-frame":
          "0 1px 0 oklch(0.98 0.06 96 / 0.5), 0 2px 6px -2px oklch(0.05 0.01 64 / 0.85)",
        "honey-drip":
          "inset 0 1px 0 oklch(0.99 0.06 96 / 0.72), 0 6px 14px -6px oklch(0.5 0.15 60 / 0.62)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "honey-shimmer": {
          "0%": { backgroundPosition: "-160% 0" },
          "100%": { backgroundPosition: "260% 0" },
        },
        "honey-glow": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "bee-hover": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(-3deg)" },
          "50%": { transform: "translate3d(0, -7px, 0) rotate(3deg)" },
        },
        "bee-drift": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(14px, -10px, 0)" },
          "100%": { transform: "translate3d(0, 0, 0)" },
        },
        "bee-swarm": {
          "0%": {
            transform: "translate3d(0, 0, 0) rotate(-6deg)",
            opacity: "0",
          },
          "12%": { opacity: "1" },
          "50%": {
            transform: "translate3d(55vw, -22px, 0) rotate(6deg)",
            opacity: "1",
          },
          "88%": { opacity: "1" },
          "100%": {
            transform: "translate3d(118vw, 14px, 0) rotate(-4deg)",
            opacity: "0",
          },
        },
        "float-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "honey-drop": {
          "0%": { transform: "translateY(-6px) scaleY(0.6)", opacity: "0" },
          "45%": { transform: "translateY(2px) scaleY(1.08)", opacity: "1" },
          "100%": { transform: "translateY(0) scaleY(1)", opacity: "1" },
        },
        "page-enter": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "hex-pop": {
          "0%": { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "comb-glow": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.7" },
        },
        "honey-seep": {
          "0%": { transform: "translateY(-4px) scaleY(0.7)", opacity: "0" },
          "55%": { transform: "translateY(1px) scaleY(1.06)", opacity: "1" },
          "100%": { transform: "translateY(0) scaleY(1)", opacity: "1" },
        },
        "wing-shimmer": {
          "0%, 100%": { opacity: "0.7", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
        "hive-breathe": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.04)" },
        },
        "comb-drift": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "34px 60px" },
        },
        "honey-drip-fall": {
          "0%": { transform: "translateY(-8px) scaleY(0.5)", opacity: "0" },
          "35%": { opacity: "1" },
          "70%": { transform: "translateY(6px) scaleY(1.12)" },
          "100%": { transform: "translateY(0) scaleY(1)", opacity: "1" },
        },
        "honey-pool": {
          "0%, 100%": { transform: "scaleX(1) scaleY(1)", opacity: "0.75" },
          "50%": { transform: "scaleX(1.03) scaleY(1.06)", opacity: "1" },
        },
        "honey-sheen": {
          "0%": { backgroundPosition: "-140% 0" },
          "100%": { backgroundPosition: "240% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "honey-shimmer": "honey-shimmer 3.2s ease-in-out infinite",
        "honey-glow": "honey-glow 2.8s ease-in-out infinite",
        "bee-hover": "bee-hover 3.4s ease-in-out infinite",
        "bee-drift": "bee-drift 7s ease-in-out infinite",
        "bee-swarm": "bee-swarm 3s ease-in-out both",
        "float-soft": "float-soft 5s ease-in-out infinite",
        "honey-drop": "honey-drop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "page-enter": "page-enter 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
        "hex-pop": "hex-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "comb-glow": "comb-glow 6s ease-in-out infinite",
        "honey-seep": "honey-seep 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "wing-shimmer": "wing-shimmer 2.6s ease-in-out infinite",
        "hive-breathe": "hive-breathe 8s ease-in-out infinite",
        "comb-drift": "comb-drift 24s linear infinite",
        "honey-drip-fall":
          "honey-drip-fall 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "honey-pool": "honey-pool 5.5s ease-in-out infinite",
        "honey-sheen": "honey-sheen 4.2s ease-in-out infinite",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
