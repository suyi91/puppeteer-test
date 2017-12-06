const puppeteer = require('puppeteer');
const fs = require('fs');
const resultDir = './result';

if (!fs.existsSync(resultDir)) {
  fs.mkdirSync(resultDir);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({path: `${resultDir}/example.png`});

  await browser.close();
})();
