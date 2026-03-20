const puppeteer = require('C:/Users/ajsta/AppData/Local/Temp/node_modules/puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Users/ajsta/.cache/puppeteer/chrome/win64-146.0.7680.66/chrome-win64/chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/social-preview-card.html', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(__dirname, 'brand_assets/social-preview.jpg'),
    type: 'jpeg',
    quality: 95,
    clip: { x: 0, y: 0, width: 1200, height: 630 }
  });
  await browser.close();
  console.log('Social preview saved.');
})();
