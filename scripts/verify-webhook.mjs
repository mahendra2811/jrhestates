import { createServer } from "node:http";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { setTimeout } from "node:timers/promises";
let received,
  fail = false;
const webhook = createServer(async (req, res) => {
  let body = "";
  for await (const chunk of req) body += chunk;
  received = { data: JSON.parse(body), auth: req.headers.authorization };
  res.writeHead(fail ? 500 : 200).end();
});
await new Promise((resolve) => webhook.listen(4319, "127.0.0.1", resolve));
const app = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", "3001"],
  {
    env: {
      ...process.env,
      LEAD_WEBHOOK_URL: "http://127.0.0.1:4319",
      LEAD_WEBHOOK_SECRET: "test-secret",
    },
    stdio: "ignore",
  },
);
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try {
      if ((await fetch("http://127.0.0.1:3001")).ok) {
        ready = true;
        break;
      }
    } catch {}
    await setTimeout(250);
  }
  assert(ready, "Test app did not start");
  const payload = {
    name: "Test Visitor",
    phone: "9876543210",
    project: "nh125",
    plot: "150",
    message: "Test site visit",
    website: "",
  };
  const send = (origin = "http://127.0.0.1:3001") =>
    fetch("http://127.0.0.1:3001/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: origin },
      body: JSON.stringify(payload),
    });
  const success = await send();
  assert.equal(success.status, 200);
  assert.equal(received.data.name, "Test Visitor");
  assert.equal(received.data.plot, "150");
  assert.equal(received.auth, "Bearer test-secret");
  fail = true;
  assert.equal((await send()).status, 502);
  assert.equal((await send("https://unrelated.example")).status, 403);
  console.log(
    "Webhook acceptance, payload, authentication, delivery failure and origin protection passed.",
  );
} finally {
  app.kill();
  await new Promise((resolve) => webhook.close(resolve));
}
