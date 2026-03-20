const puppeteer = require('C:/Users/ajsta/AppData/Local/Temp/node_modules/puppeteer');
const path = require('path');

(async () => {
  const filePath = path.join(__dirname, 'brand-identity.html');
  const outPath  = path.join(__dirname, 'Captains-Table-Brand-Identity.pdf');

  const browser = await puppeteer.launch({
    executablePath: 'C:/Users/ajsta/.cache/puppeteer/chrome/win64-146.0.7680.66/chrome-win64/chrome.exe',
    headless: true
  });

  const page = await browser.newPage();
  await page.goto(`file:///${filePath.replace(/\\/g,'/')}`, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  await page.pdf({
    path: outPath,
    format: 'Letter',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log('PDF saved to:', outPath);
})();
