import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  oxc: {
    jsx: {
      runtime: "automatic",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/shared/lib/tests/setup.ts",
    server: {
      deps: {
        inline: ["next-intl", "next"],
      },
    },
    alias: {
      "server-only": path.resolve(__dirname, "./vitest.server-only-mock.js"),
      "@": path.resolve(__dirname, "./"),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./"),
    },
  },
});
