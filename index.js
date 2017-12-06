const puppeteer = require('puppeteer');
const fs = require('fs');
const resultDir = './result/pdf';

const minPageHeight = 1700;
const pdfWidth = 1366;

if (!fs.existsSync(resultDir)) {
  fs.mkdirSync(resultDir);
}

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(() => { resolve() }, ms);
  });
}

(async () => {
  const browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.goto('https://router.vuejs.org/zh-cn/');
  await page.mainFrame().waitForSelector('.summary');
  
  const menuList = await page.evaluate(async () => {
    const nodes = [...document.querySelectorAll('.summary > .chapter > .articles > .chapter > a')];
    return nodes.map(i => ({ href: i.href.trim(), title: i.innerText.trim() }));
  });

  let currNum = -1;
  while(++currNum < menuList.length) {
    await page.goto(menuList[currNum].href, {
      waitUntil: 'networkidle',
    });
    await page.mainFrame().waitForSelector('.page-wrapper');
    
    const contentHeight = await page.evaluate(async () => {
      return [...document.querySelectorAll('.page-wrapper')][0].offsetHeight + 300;
    });
    await page.emulateMedia('screen');
    await page.pdf({ 
      path: `${resultDir}/${menuList[currNum].title}.pdf`,
      width: pdfWidth,
      height: contentHeight > minPageHeight ? contentHeight : minPageHeight,
    });
  }
  
  await browser.close();
})();