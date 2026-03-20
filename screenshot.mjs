import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/ajsta/AppData/Local/Temp/node_modules/puppeteer');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

// Auto-increment: find next available N
const existing = fs.readdirSync(outDir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.replace('screenshot-', '').split(/[-.]/, 1)[0])).filter(n => !isNaN(n));
const next = nums.length ? Math.max(...nums) + 1 : 1;

const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outPath = path.join(outDir, filename);

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: undefined, // uses bundled Chromium
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2' });
  // Scroll through page to trigger IntersectionObserver reveal animations
  await page.evaluate(async () => {
    await new Promise(resolve => {
      const distance = 300;
      const delay = 80;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, delay);
    });
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: outPath, fullPage: true });
  await browser.close();
  console.log(`Saved: ${outPath}`);
})();
