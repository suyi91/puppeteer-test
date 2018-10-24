#!/usr/local/bin/node

/**
 * @author: vanishcode
 * @desc: hahahaha, fuck you, ADs!
 */

const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const rimraf = require('rimraf');

if (!fs.existsSync('./result')) {
  fs.mkdirSync('./result');
}
if (fs.existsSync('./result/girl')) {
  rimraf.sync('./result/girl');
}
fs.mkdirSync('./result/girl');

function getExtension(str = '') {
  const dotPos = str.lastIndexOf('.');
  if (dotPos > -1) {
    return str.substr(dotPos + 1);
  }
  return 'jpg';
}

let times = 1;
let currentNum = 1;

async function run(url) {
  console.log('Start to crawl girl\'s pictures...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  let images = await page.evaluate(
    () => Array.from(document.querySelectorAll('a.view_img_link')).map(e => e.href)
  );
  images.forEach(async url => {
    try {
      const res = await axios.get(url, {
        responseType: 'stream'
      });
      res.data.pipe(fs.createWriteStream(`./result/girl/${currentNum}.${getExtension(url)}`));
    } catch (e) {
      console.log(e);
    }
    currentNum++;
  });
  let nextPage = await page.evaluate(() =>
    document.querySelectorAll('#comments > div:nth-child(4) > div > a.previous-comment-page')[0].href
  );
  console.log('OK!');
  if (++times > 5) {
    browser.close();
    console.log('All pictures downloaded complete!')
    process.exit(0);
  }
  setTimeout(function () {
    run(nextPage)
  }, 5000);
}

run('http://jandan.net/ooxx');