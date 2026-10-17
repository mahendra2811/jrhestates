import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { setTimeout } from "node:timers/promises";
import { chromium } from "@playwright/test";
const app = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "dev", "-p", "3002"],
  {
    env: {
      ...process.env,
      NEXT_PUBLIC_GA_ID: "G-TEST123456",
      NEXT_PUBLIC_WHATSAPP: "919876543210",
    },
    stdio: "inherit",
  },
);
let browser;
try {
  let ready = false;
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch("http://127.0.0.1:3002")).ok) {
        ready = true;
        break;
      }
    } catch {}
    await setTimeout(250);
  }
  assert(ready, "Analytics test server did not start");
  browser = await chromium.launch();
  const page = await browser.newPage();
  // Stub the remote library so no test data is sent to Google.
  await page.route("https://www.googletagmanager.com/**", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "window.__gaLoaded=true;",
    }),
  );
  await page.route("https://wa.me/**", (route) => route.abort());
  await page.goto("http://127.0.0.1:3002");
  await page.waitForFunction(
    () => window.__gaLoaded && window.dataLayer?.length >= 2,
  );
  const config = await page.evaluate(() =>
    window.dataLayer
      .map((entry) => Array.from(entry))
      .find((entry) => entry[0] === "config"),
  );
  assert.equal(config[1], "G-TEST123456");
  assert.equal(config[2].allow_google_signals, false);
  assert.equal(config[2].allow_ad_personalization_signals, false);
  await page.locator("[name=name]").fill("Test Visitor");
  await page.locator("[name=phone]").fill("123");
  await page.getByRole("button", { name: "Continue on WhatsApp" }).click();
  assert.equal(new URL(page.url()).host, "127.0.0.1:3002");
  assert.equal(
    await page.locator("[name=phone]").getAttribute("aria-invalid"),
    "true",
  );
  await page.locator("[name=phone]").fill("+91 98765 43210");
  await page.locator("[name=plot]").selectOption("150");
  await page
    .locator("[name=message]")
    .fill("A courtyard & garden? Visit on Sunday. धन्यवाद");
  let draftUrl,
    events,
    backendCalled = false;
  page.on("request", (request) => {
    if (request.url().includes("/api/enquiry")) backendCalled = true;
  });
  page.on("console", (message) => {
    if (message.text().startsWith("GA_TEST_SNAPSHOT:"))
      events = message.text().slice("GA_TEST_SNAPSHOT:".length);
  });
  await page.evaluate(() => {
    const original = window.gtag;
    window.gtag = (...args) => {
      original(...args);
      console.debug("GA_TEST_SNAPSHOT:" + JSON.stringify(window.dataLayer));
    };
  });
  await page.route("https://wa.me/**", async (route) => {
    draftUrl = new URL(route.request().url());
    await route.fulfill({
      contentType: "text/html",
      body: "<h1>WhatsApp destination stub</h1>",
    });
  });
  await page.getByRole("button", { name: "Continue on WhatsApp" }).click();
  await page.waitForURL("https://wa.me/**");
  assert.equal(draftUrl.pathname, "/919876543210");
  const draft = draftUrl.searchParams.get("text");
  for (const text of [
    "Full name: Test Visitor",
    "Mobile number: 9876543210",
    "Jodhpur–Jaisalmer Road",
    "150 sq. yd.",
    "A courtyard & garden? Visit on Sunday. धन्यवाद",
  ])
    assert(draft.includes(text));
  assert.equal(backendCalled, false);
  assert(events.includes("whatsapp_enquiry_start"));
  assert(!events.includes("9876543210"));
  assert(!events.includes("Test Visitor"));
  assert(!events.includes("courtyard"));
  console.log(
    "GA loading, form validation, WhatsApp recipient, all draft fields, Unicode encoding, no backend request and analytics PII exclusion passed. No traffic sent to Google or WhatsApp.",
  );
} finally {
  await browser?.close();
  app.kill();
}
