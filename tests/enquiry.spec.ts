import { expect, test } from "@playwright/test";

for (const phone of [
  "9876543210",
  "919876543210",
  "+91 98765 43210",
  "98765 43210",
  "09876543210",
  "0091 98765 43210",
]) {
  test(`WhatsApp form accepts ${phone.replace(/\d/g, "•")}`, async ({
    page,
  }) => {
    await page.goto("/");
    let draft = "";
    await page.route("https://wa.me/**", (route) => {
      draft = new URL(route.request().url()).searchParams.get("text") || "";
      return route.fulfill({
        contentType: "text/html",
        body: "<h1>WhatsApp draft test</h1>",
      });
    });
    await page.locator("[name=name]").fill("Test Visitor");
    await page.locator("[name=phone]").fill(phone);
    await page
      .locator("[name=message]")
      .fill("Sunday visit & courtyard plans. धन्यवाद");
    await page.getByRole("button", { name: "Continue on WhatsApp" }).click();
    await expect.poll(() => draft).toContain("Mobile number: 9876543210");
    expect(draft).toContain("Full name: Test Visitor");
    expect(draft).toContain("Sunday visit & courtyard plans. धन्यवाद");
  });
}

test("Inline validation clears when corrected and analytics cannot block WhatsApp", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Continue on WhatsApp" }).click();
  await expect(page.locator("#enquiry-name-error")).toBeVisible();
  await expect(page.locator("[name=name]")).toBeFocused();
  await page.locator("[name=name]").fill("Test Visitor");
  await expect(page.locator("#enquiry-name-error")).toHaveCount(0);
  await page.locator("[name=phone]").fill("123");
  await page.getByRole("button", { name: "Continue on WhatsApp" }).click();
  await expect(page.locator("#enquiry-phone-error")).toBeVisible();
  await expect(page.locator("[name=phone]")).toBeFocused();
  await page.locator("[name=phone]").fill("+91 98765 43210");
  await expect(page.locator("#enquiry-phone-error")).toHaveCount(0);
  await expect(page.locator("input[name=website]")).toHaveCount(0);
  await page.evaluate(() => {
    window.gtag = () => {
      throw new Error("Analytics unavailable");
    };
  });
  await page.route("https://wa.me/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<h1>WhatsApp draft test</h1>",
    }),
  );
  await page.getByRole("button", { name: "Continue on WhatsApp" }).click();
  await expect(page).toHaveURL(/^https:\/\/wa\.me\//);
});

for (const width of [360, 390, 430, 1440]) {
  test(`Form controls and submit button fit at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const form = page.locator(".enquiry-form");
    await form.scrollIntoViewIfNeeded();
    if (width < 600) await expect(page.locator(".mobile-contact")).toBeHidden();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    for (const control of await form
      .locator("input, select, textarea, button")
      .all()) {
      const box = await control.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    await form.screenshot({ path: `test-results/form-${width}.png` });
  });
}
