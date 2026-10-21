// Prints /price-list to public/xoro-visuals-price-list.pdf (one A4 page).
// Needs the site running: npm run dev (or start), then npm run pricelist [base-url].
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${base}/price-list`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: "public/xoro-visuals-price-list.pdf",
  format: "A4",
  printBackground: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
  pageRanges: "1",
});
await browser.close();
console.log("Wrote public/xoro-visuals-price-list.pdf");
