import { defineConfig, devices } from "@playwright/test";

// Runs against a production build. A local mock stands in for CONTACT_WEBHOOK_URL
// so the inquiry form's real delivery path is exercised end to end.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: "http://127.0.0.1:3200", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: [
    { command: "node tests/mock-webhook.mjs", url: "http://127.0.0.1:3201", reuseExistingServer: false },
    {
      command: "npx next start -p 3200 -H 127.0.0.1",
      url: "http://127.0.0.1:3200",
      env: { CONTACT_WEBHOOK_URL: "http://127.0.0.1:3201/hook" },
      reuseExistingServer: false,
    },
  ],
});
