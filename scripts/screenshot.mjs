import { chromium } from "playwright";
const pages = [
  ["/", "front-door-1440.png", 1440],
  ["/stores", "stores-1440.png", 1440],
  ["/stores/resin-miniatures/niche", "niche-1440.png", 1440],
  ["/stores/resin-miniatures/preview", "storefront-1440.png", 1440],
  ["/stores", "stores-390.png", 390],
  ["/", "front-door-390.png", 390],
];
export default async function main(base = "http://127.0.0.1:3000") {
  const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  for (const [path, file, width] of pages) {
    const page = await browser.newPage({ viewport: { width, height: 1100 } });
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `screenshots/app/${file}`, fullPage: true });
    console.log("shot", path);
    await page.close();
  }
  await browser.close();
}
main();
