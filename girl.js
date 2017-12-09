#!/usr/local/bin/node

/**
 * @author: vanishcode
 * @desc: hahahaha, fuck you, ADs!
 */

const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

if (!fs.existsSync('./result')) {
  fs.mkdirSync('./result');
}
if (!fs.existsSync('./result/girl')) {
  fs.mkdirSync('./result/girl');
}
let currentNumber = 1;

async function run(url) {
  console.log('Start to crawl girl\'s pictures...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  let imgURL = await page.evaluate(() => {
    let imgURL = []
    let selector = 'a.view_img_link';
    let imgUrlList = [...document.querySelectorAll(selector)];
    imgUrlList.forEach(e => {
      imgURL.push(e.href)
    })
    return imgURL
  });
  imgURL.forEach((e, i) => {
    if (currentNumber >= 200) {
      browser.close();
      console.log('All pictures downloaded complete!')
      process.exit(0);
    }
    axios.get(e, {
      responseType: 'stream'
    }).then(res => {
      res.data.pipe(fs.createWriteStream(`./result/girl/${currentNumber}.${e.substr(e.length-3)}`));
      currentNumber++;
    })
  });
  let nextPage = await page.evaluate(() => {
    return document.querySelectorAll('#comments > div:nth-child(4) > div > a.previous-comment-page')[0].href;
  })
  console.log('OK!');
  setTimeout(function () {
    run(nextPage)
  }, 3000);



}
run('http://jandan.net/ooxx');