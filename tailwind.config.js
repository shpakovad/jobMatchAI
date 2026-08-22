/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        card: "var(--card)",
        primary: "var(--primary)",
        "muted-foreground": "var(--muted-foreground)",
        background: "var(--background)",
        destructive: "var(--destructive)",
      },
    },
  },
  plugins: [],
};
