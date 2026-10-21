import { expect, test, type Page } from "@playwright/test";
import { projects, heroReel } from "../src/content/projects";
import { nav } from "../src/content/site";

const routes = [
  "/",
  "/work",
  ...projects.filter((p) => p.caseStudy).map((p) => `/work/${p.slug}`),
  "/services",
  "/agencies",
  "/pricing",
  "/about",
  "/contact",
];

function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
  return errors;
}

for (const route of routes) {
  test(`${route} renders cleanly`, async ({ page }) => {
    const errors = watchErrors(page);
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveTitle(/Xoro Visuals/);
    expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toBeTruthy();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, "no horizontal scroll").toBeLessThanOrEqual(0);
    // Scroll through so every reveal fires, then confirm nothing stayed hidden.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await page.waitForTimeout(1600);
    const hidden = await page.$$eval("[data-reveal]", (els) =>
      els.filter((el) => Number(getComputedStyle(el).opacity) < 0.99).length,
    );
    expect(hidden, "reveals completed").toBe(0);
    expect(errors).toEqual([]);
  });
}

test("unknown case study returns 404", async ({ page }) => {
  const res = await page.goto("/work/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("final cut");
});

test("every referenced media file exists", async ({ request }) => {
  const urls = [heroReel, ...projects.map((p) => p.media)].flatMap((m) => [m.poster, m.preview]);
  expect(urls.length).toBeGreaterThan(10);
  for (const url of urls) {
    const res = await request.get(url);
    expect(res.status(), url).toBe(200);
  }
});

test("sitemap, robots and social image are served", async ({ request }) => {
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  const og = await request.get("/opengraph-image");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
});

test("navigation links reach real pages, and back/forward work", async ({ page, isMobile }) => {
  await page.goto("/");
  for (const item of nav) {
    if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
    const link = page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: item.label, exact: true });
    await link.first().click();
    await expect(page).toHaveURL(new RegExp(item.href.replace(/[/#]/g, "\\$&") + "$"));
    // Next keeps visited routes mounted but hidden, so count only the visible title.
    await expect(page.locator("h1:visible")).toHaveCount(1);
  }
  await page.goto("/");
  await page.goto("/work");
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("#hero-title:visible")).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/\/work$/);
});

test("mobile menu opens, traps the page and closes with Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  // Every link must be on screen, not clipped inside the header bar.
  const last = page.locator("#mobile-menu").getByRole("link", { name: "Contact", exact: true });
  await expect(last).toBeInViewport();
  const sheetHeight = await page.locator("#mobile-menu").evaluate((el) => el.getBoundingClientRect().height);
  expect(sheetHeight).toBeGreaterThan(400);
  await expect(page.locator("#main")).toHaveAttribute("inert", "");
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("keyboard: skip link and visible focus", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard test on desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).not.toBe("none");
});

const heroVideo = (page: Page) => page.locator("section:has(#hero-title) video").first();

test("background reel can be paused", async ({ page }) => {
  await page.goto("/");
  const video = heroVideo(page);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  await page.getByRole("button", { name: "Pause background" }).click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await expect(page.getByRole("button", { name: "Play background" })).toBeVisible();
});

test("Watch reel opens a player with controls and closes with Escape", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Watch reel" }).click();
  const dialog = page.getByRole("dialog", { name: "Showreel" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("video[controls]")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("content is visible immediately and the reel does not autoplay", async ({ page }) => {
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.classList.contains("motion"))).toBe(false);
    await expect(page.locator("#hero-title")).toBeInViewport();
    const paused = await heroVideo(page).evaluate((v: HTMLVideoElement) => v.paused);
    expect(paused).toBe(true);
    await expect(page.getByRole("button", { name: "Play background" })).toBeVisible();
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("all content is readable", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero-title")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Selected work/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /One idea/i })).toBeVisible();
    const hidden = await page.$$eval("[data-reveal]", (els) =>
      els.filter((el) => getComputedStyle(el).opacity !== "1").length,
    );
    expect(hidden).toBe(0);
  });
});

test.describe("contact form", () => {
  test("shows accessible errors for missing required fields", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(3200);
    await page.getByRole("button", { name: "Send inquiry" }).click();
    const alert = page.locator("form [role=alert]");
    await expect(alert).toContainText("need attention");
    await expect(alert).toBeFocused();
    await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Work email")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Choose a project type.")).toBeVisible();
  });

  test("keeps entered values when validation fails", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Test Person");
    await page.getByLabel("Work email").fill("not-an-email");
    await page.waitForTimeout(3200);
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(page.getByText(/name@company\.com/)).toBeVisible();
    await expect(page.getByLabel("Name")).toHaveValue("Test Person");
  });

  test("pre-selects the project type from ?type=", async ({ page }) => {
    await page.goto("/contact?type=agency");
    await expect(page.getByLabel("Project type")).toHaveValue("agency");
  });

  test("delivers a valid inquiry to the webhook", async ({ page, request }, info) => {
    const marker = `E2E ${info.project.name} ${Date.now()}`;
    await page.goto("/contact");
    await page.getByLabel("Name").fill(marker);
    await page.getByLabel("Work email").fill("producer@agency.example");
    await page.getByLabel("Country").fill("United Kingdom");
    await page.getByLabel("Project type").selectOption("commercial");
    await page.getByLabel("Tell us about it").fill("A 30 second product film for a skincare launch, with cut-downs.");
    await page.waitForTimeout(3200);
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(page.getByRole("status")).toContainText("Inquiry sent");
    await expect
      .poll(async () => (await (await request.get("http://127.0.0.1:3201/last")).json())?.name)
      .toBe(marker);
  });

  test("rejects instant bot-speed submissions", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Bot");
    await page.getByLabel("Work email").fill("bot@example.com");
    await page.getByLabel("Project type").selectOption("other");
    await page.getByLabel("Tell us about it").fill("This is an automated submission that is too fast.");
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(page.locator("form [role=alert]")).toContainText("didn't go through");
  });
});

test("reveals complete after client-side navigation and returning", async ({ page }) => {
  const errors = watchErrors(page);
  const visibleHidden = () =>
    page.$$eval("[data-reveal]", (els) =>
      els.filter((el) => el.getClientRects().length > 0 && el.getBoundingClientRect().top < window.innerHeight)
        .filter((el) => Number(getComputedStyle(el).opacity) < 0.99).length,
    );
  await page.goto("/");
  await page.getByRole("link", { name: /All work/ }).click();
  await expect(page).toHaveURL(/\/work$/);
  await page.waitForTimeout(1500);
  expect(await visibleHidden()).toBe(0);
  await page.goBack();
  // Back restores the earlier scroll position (where the hero has faded away), so return to the top.
  await expect(page).toHaveURL(/\/$/);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator("#hero-title:visible")).toBeVisible();
  await page.waitForTimeout(2200);
  const lineShift = await page
    .locator("#hero-title:visible span span")
    .first()
    .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
  expect(Math.abs(lineShift)).toBeLessThan(1);
  expect(errors).toEqual([]);
});

test("pricing shows the three rate-card packages, links to a pre-filled inquiry, and the PDF downloads", async ({ page, request }) => {
  await page.goto("/pricing");
  await expect(page.locator("main ol").first().locator("> li")).toHaveCount(3);
  for (const price of ["₹1,000", "₹2,000", "₹5,000", "₹7,000", "₹10,000"]) {
    await expect(page.locator("td", { hasText: price }).first()).toBeAttached();
  }
  // Terms reveal on scroll, so check presence in the DOM rather than the accessibility tree.
  await expect(page.locator("h3", { hasText: "Payment structure" })).toBeAttached();
  // Cards below the fold are hidden until revealed, so find the link by its target, then scroll to it.
  const choose = page.locator('main a[href="/contact?type=ai-video"]', { hasText: "Choose Cinematic Film" });
  await choose.scrollIntoViewIfNeeded();
  await expect(choose).toBeVisible();
  await choose.click();
  await expect(page).toHaveURL(/\/contact\?type=ai-video$/);
  await expect(page.getByLabel("Project type")).toHaveValue("ai-video");
  const pdf = await request.get("/xoro-visuals-price-list.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
});

test("prompt-to-film demo types, generates and renders without errors", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/");
  const section = page.locator("section:has(#ptf-title)");
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByText("Rendered", { exact: true })).toBeVisible({ timeout: 15000 });
  await expect(section.getByText(/licensed stock, not Xoro work/)).toBeVisible();
  expect(errors).toEqual([]);
});

test.describe("prompt-to-film with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("shows a finished still, no noise canvas", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("section:has(#ptf-title)");
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator("canvas")).toBeHidden();
    await expect(section.getByText("Rendered", { exact: true })).toBeVisible();
  });
});
