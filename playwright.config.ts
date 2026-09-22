import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3217", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "npm run build -w apps/api && npm run start -w apps/api",
      url: "http://127.0.0.1:4217/tasks",
      env: { PORT: "4217" },
      reuseExistingServer: false,
    },
    {
      command: "npm run dev -w apps/web -- --port 3217 --hostname 127.0.0.1",
      url: "http://127.0.0.1:3217/tasks",
      env: { API_URL: "http://127.0.0.1:4217" },
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
