/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        card: "var(--card)",
        primary: "var(--primary)",
        "muted-foreground": "var(--muted-foreground)",
        background: "var(--background)",
      },
    },
  },
  plugins: [],
};
