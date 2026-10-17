import { test, expect } from "@playwright/test";
for (const width of [360, 375, 390, 430, 768, 1440]) {
  test(`Layout and imagery at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Your Land.Your Legacy.",
    );
    await page.waitForTimeout(1800);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    const hero = page.locator(".hero-image img");
    await expect(hero).toBeVisible();
    expect(
      await hero.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    ).toBeTruthy();
    await page.screenshot({ path: `test-results/hero-${width}.png` });
    if (width < 800) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: "Open navigation" }),
      ).toBeFocused();
    }
    expect(errors).toEqual([]);
  });
}
test("Gallery, plot selection, feature accordion and honest form error", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Next project image" }).click();
  await expect(page.locator(".gallery-controls b")).toHaveText("02");
  await page.getByRole("tab", { name: "200 SQ. YD." }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Space for your vision",
  );
  await page
    .getByRole("button", { name: /Green spaces & landscape planning/ })
    .click();
  await expect(page.locator("#feature-2")).toBeVisible();
  await page.locator("[name=name]").fill("Test Visitor");
  await page.locator("[name=phone]").fill("9876543210");
  await page.getByRole("button", { name: "Request a Site Visit" }).click();
  await expect(page.locator(".form-feedback")).toContainText(
    "Your enquiry has not been sent",
  );
  for (const image of await page.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBeTruthy();
  }
  await page.screenshot({
    path: "test-results/page-desktop.png",
    fullPage: true,
  });
});
test("API rejects invalid submissions and metadata routes work", async ({
  request,
}) => {
  expect(
    (
      await request.post("/api/enquiry", { data: { name: "A", phone: "123" } })
    ).status(),
  ).toBe(400);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/privacy")).status()).toBe(200);
});

test("Accessible document structure and form controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

test("Mobile accessibility with all content visible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 850 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});
