import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173/trener-studium/",
  },
  webServer: {
    command: "npm run build && npm run preview -- --port 4173",
    url: "http://localhost:4173/trener-studium/",
    reuseExistingServer: !process.env.CI,
    env: { VITE_CONTENT_FIXTURES: "1" },
    timeout: 60_000,
  },
});
