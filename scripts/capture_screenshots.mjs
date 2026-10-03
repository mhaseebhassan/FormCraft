import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE_URL = "http://localhost:3000";
const OUTPUT_DIR = path.resolve("public/screenshots");

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log("Launching Edge browser...");
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();

  // 1. Landing Page
  console.log("Capturing Landing Page...");
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });
  await page.waitForSelector("h1");
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "landing.png") });
  console.log("Saved landing.png");

  // 2. Login Page & Authenticate
  console.log("Capturing Login Page...");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "login.png") });
  console.log("Saved login.png");

  console.log("Authenticating as demo user...");
  await page.evaluate(async () => {
    const csrfRes = await fetch("/api/auth/csrf");
    const { csrfToken } = await csrfRes.json();
    await fetch("/api/auth/callback/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        email: "demo@formcraft.test",
        password: "FormCraft123!",
        csrfToken,
        json: "true",
      }),
    });
  });
  await new Promise((r) => setTimeout(r, 1000));


  // 3. Dashboard
  console.log("Capturing Dashboard...");
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "dashboard.png") });
  console.log("Saved dashboard.png");

  // 4. Forms Library
  console.log("Capturing My Forms...");
  await page.goto(`${BASE_URL}/forms`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "forms.png") });
  console.log("Saved forms.png");

  // Find a form ID from the page or DB
  const formLinks = await page.$$eval("a[href^='/forms/']", (links) =>
    links.map((a) => a.getAttribute("href"))
  );
  let formId = "6ac132f42051c2fe65611896";
  for (const href of formLinks) {
    const match = href.match(/\/forms\/([a-f0-9]{24})\/edit/);
    if (match) {
      formId = match[1];
      break;
    }
  }

  // 5. Form Builder Studio
  console.log(`Capturing Form Builder (${formId})...`);
  await page.goto(`${BASE_URL}/forms/${formId}/edit`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "builder.png") });
  console.log("Saved builder.png");

  // 6. Responses Table
  console.log(`Capturing Responses (${formId})...`);
  await page.goto(`${BASE_URL}/forms/${formId}/responses`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "responses.png") });
  console.log("Saved responses.png");

  // 7. Visual Analytics
  console.log(`Capturing Analytics (${formId})...`);
  await page.goto(`${BASE_URL}/forms/${formId}/analytics`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "analytics.png") });
  console.log("Saved analytics.png");

  // 8. Public Classic Form
  console.log("Capturing Classic Public Form...");
  await page.goto(`${BASE_URL}/f/UtE8efQe`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "classic_form.png") });
  console.log("Saved classic_form.png");

  // 9. Public Conversational Form
  console.log("Capturing Conversational Public Form...");
  await page.goto(`${BASE_URL}/f/sQaJUY4L`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "conversational_form.png") });
  console.log("Saved conversational_form.png");

  await browser.close();
  console.log("All screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
