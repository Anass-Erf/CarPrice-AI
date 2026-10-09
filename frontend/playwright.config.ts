import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  use: { baseURL: "http://127.0.0.1:13000", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
    {
      name: "tablet",
      use: { ...devices["iPad Mini"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: [
    {
      command: "npm run dev -- --hostname 127.0.0.1 --port 13000",
      url: "http://127.0.0.1:13000",
      reuseExistingServer: false,
      env: { NEXT_PUBLIC_API_URL: "http://127.0.0.1:18000" },
    },
    {
      command:
        "../.venv/bin/python -m uvicorn backend.app.main:app --app-dir .. --host 127.0.0.1 --port 18000",
      url: "http://127.0.0.1:18000/health",
      reuseExistingServer: false,
      env: {
        CORS_ORIGINS: "http://127.0.0.1:13000",
        OMP_NUM_THREADS: "2",
        OPENBLAS_NUM_THREADS: "2",
      },
    },
  ],
});
