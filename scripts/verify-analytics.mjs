import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { setTimeout } from "node:timers/promises";
import { chromium } from "@playwright/test";
const app = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "dev", "-p", "3002"],
  {
    env: { ...process.env, NEXT_PUBLIC_GA_ID: "G-TEST123456" },
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
  await page.locator("[name=phone]").fill("9876543210");
  await page.route("**/api/enquiry", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ message: "Test delivery accepted." }),
    }),
  );
  await page.getByRole("button", { name: "Request a Site Visit" }).click();
  await page.waitForFunction(() =>
    window.dataLayer.some(
      (entry) => entry[0] === "event" && entry[1] === "generate_lead",
    ),
  );
  const events = await page.evaluate(() => JSON.stringify(window.dataLayer));
  assert(!events.includes("9876543210"));
  assert(!events.includes("Test Visitor"));
  console.log(
    "GA configuration, asynchronous script loading, successful lead event and exclusion of form PII passed. No traffic sent to Google.",
  );
} finally {
  await browser?.close();
  app.kill();
}
